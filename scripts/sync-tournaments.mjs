/**
 * Regenerates `src/data/tournaments.generated.json` from Tournir.com.
 *
 * Tournir has no public API, but its pages are server-rendered, so the
 * tournament list and each tournament's page carry everything the site shows:
 * date, level, format, capacity, description and the registered players. This
 * reads them at build time so the tournaments live inside our own pages
 * instead of sending visitors off to tournir.com.
 *
 *   npm run tournaments:sync          fetch and overwrite the file
 *   node scripts/sync-tournaments.mjs --soft
 *                                     same, but a network or parse failure
 *                                     keeps the committed file and exits 0 —
 *                                     this is what `npm run build` uses, so a
 *                                     Tournir outage never breaks a deploy.
 *
 * Scraping follows Tournir's markup, so a redesign on their side can break it.
 * When the club gets API access, replace `fetchTournaments` below and keep the
 * output shape — the site only ever reads the JSON.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE_URL = 'https://www.tournir.com'
/** Upcoming tournaments to fetch details for; the list has the rest. */
const MAX_DETAILS = 16

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = join(root, 'src', 'data', 'tournaments.generated.json')
const soft = process.argv.includes('--soft')

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }

/** Strips tags and React's `<!-- -->` text separators, decodes entities. */
function text(html) {
  return html
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (match, code) => {
      if (code[0] === '#') {
        const n = code[1] === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
        return String.fromCodePoint(n)
      }
      return ENTITIES[code] ?? match
    })
    .replace(/\s+/g, ' ')
    .trim()
}

function span(html, className) {
  const match = html.match(
    new RegExp(`class="${className}[^"]*"[^>]*>([\\s\\S]*?)</span>`),
  )
  return match ? text(match[1]) : ''
}

async function get(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'user-agent': 'sktmvarna-site-sync/1.0' },
  })
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`)
  return response.text()
}

/**
 * The list shows "DD.MM" without a year. A date more than two months behind
 * today belongs to next year — the list only reaches a few weeks ahead.
 */
function inferDate(dayMonth, time, today) {
  const [day, month] = dayMonth.split('.').map(Number)
  let year = today.getFullYear()
  const candidate = new Date(year, month - 1, day)
  if (today - candidate > 60 * 24 * 3600 * 1000) year += 1
  const pad = (n) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${time || '00:00'}:00`
}

function parseList(html, today) {
  const rows = html.match(/<a class="mobile-tournament-row"[\s\S]*?<\/a>/g) ?? []
  return rows.map((row) => {
    const id = row.match(/href="\/tournaments\/([0-9a-f-]{36})"/)?.[1]
    const name = text(row.match(/title="([^"]*)"/)?.[1] ?? '')
    const [taken, total] = span(row, 'mobile-row-capacity').split('/').map(Number)
    return {
      id,
      name,
      startsAt: inferDate(span(row, 'mobile-row-date'), span(row, 'mobile-row-time'), today),
      level: span(row, 'mobile-row-level') || null,
      spotsTaken: Number.isFinite(taken) ? taken : 0,
      spotsTotal: Number.isFinite(total) ? total : null,
    }
  }).filter((row) => row.id && row.name)
}

const STATUS = { open: 'open', upcoming: 'upcoming', live: 'live', finished: 'finished', archived: 'finished' }

function parseDetail(html) {
  const meta = {}
  for (const card of html.match(/<div class="meta-card"[\s\S]*?<\/div><\/div>/g) ?? []) {
    const label = text(card.match(/class="meta-label">([\s\S]*?)<\/div>/)?.[1] ?? '')
    const value = text(card.match(/class="meta-value">([\s\S]*?)<\/div>/)?.[1] ?? '')
    if (label) meta[label] = value
  }

  const capacity = html.match(/class="capacity-row">[\s\S]*?<strong>([\s\S]*?)<\/strong>/)
  const [taken, total] = capacity ? text(capacity[1]).split('/').map((n) => Number(n.trim())) : []

  // The participant list arrives in a streamed, hidden `<div id="S:0">` chunk
  // after the shell, so it is matched anywhere in the document.
  const players = [...html.matchAll(/<div class="player-row">([\s\S]*?)<\/div>/g)].map(
    ([, row]) => {
      const rating = row.match(/class="player-rating"><span>(\d+)<\/span>/)?.[1]
      return {
        name: text(row.match(/class="player-name-main">([\s\S]*?)<\/span><\/span>/)?.[1] ?? ''),
        rating: rating ? Number(rating) : null,
      }
    },
  ).filter((player) => player.name)

  const fee = Object.entries(meta).find(([label]) => /такса/i.test(label))?.[1] ?? null

  return {
    status: STATUS[html.match(/class="status-dot (\w+)"/)?.[1]] ?? 'upcoming',
    description: text(html.match(/<p class="hero-desc">([\s\S]*?)<\/p>/)?.[1] ?? '') || null,
    format: meta['Формат'] || null,
    level: meta['Ниво'] || null,
    fee,
    spotsTaken: Number.isFinite(taken) ? taken : undefined,
    spotsTotal: Number.isFinite(total) ? total : undefined,
    players,
  }
}

async function fetchTournaments() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const list = parseList(await get('/tournaments'), today)
  // The list runs from the archive to the weeks ahead; keep what's still to come.
  const seen = new Set()
  const upcoming = list
    .filter((row) => new Date(row.startsAt) >= today)
    .filter((row) => (seen.has(row.id) ? false : seen.add(row.id)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, MAX_DETAILS)

  const tournaments = []
  for (const row of upcoming) {
    const detail = parseDetail(await get(`/tournaments/${row.id}`))
    tournaments.push({
      ...row,
      ...Object.fromEntries(Object.entries(detail).filter(([, v]) => v !== undefined)),
      level: detail.level ?? row.level,
      sourceUrl: `${BASE_URL}/tournaments/${row.id}`,
    })
  }
  return tournaments
}

try {
  const tournaments = await fetchTournaments()
  const payload = { syncedAt: new Date().toISOString(), source: BASE_URL, tournaments }
  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`tournaments: wrote ${tournaments.length} upcoming tournaments`)
} catch (error) {
  if (!soft) throw error
  const kept = JSON.parse(readFileSync(outFile, 'utf8'))
  console.warn(
    `tournaments: sync failed (${error.message}); keeping the file from ${kept.syncedAt}`,
  )
}
