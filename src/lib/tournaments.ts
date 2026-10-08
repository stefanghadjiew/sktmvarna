import synced from '@/data/tournaments.generated.json'

/**
 * Tournaments, as published on Tournir.com — the platform the club runs its
 * tournaments and ratings on. `scripts/sync-tournaments.mjs` copies them into
 * `tournaments.generated.json` on every build, so the site shows them in its
 * own pages rather than linking out.
 */

export type TournamentStatus = 'open' | 'upcoming' | 'live' | 'finished'

export type TournamentPlayer = { name: string; rating: number | null }

export type Tournament = {
  id: string
  name: string
  /** Local Sofia time, `YYYY-MM-DDTHH:MM:SS`. */
  startsAt: string
  status: TournamentStatus
  description: string | null
  format: string | null
  /** Rating band, e.g. "До 700", "500+", "Без ограничение". */
  level: string | null
  /** Entry fee as Tournir prints it; `null` when it isn't published there. */
  fee: string | null
  spotsTaken: number
  spotsTotal: number | null
  players: TournamentPlayer[]
  sourceUrl: string
}

export const tournamentsSyncedAt: string = synced.syncedAt

const all = synced.tournaments as Tournament[]

/** Still to come (or under way today), soonest first. */
export function upcomingTournaments(now = new Date()): Tournament[] {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  return all
    .filter((tournament) => new Date(tournament.startsAt) >= startOfToday)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

export function findTournament(id: string | undefined): Tournament | undefined {
  return all.find((tournament) => tournament.id === id)
}

export function spotsLeft(tournament: Tournament): number | null {
  return tournament.spotsTotal === null
    ? null
    : Math.max(0, tournament.spotsTotal - tournament.spotsTaken)
}

export function isRegistrationOpen(tournament: Tournament) {
  return tournament.status === 'open' && spotsLeft(tournament) !== 0
}

/* ------------------------------------------------------------------ */
/* Quick registration                                                  */
/* ------------------------------------------------------------------ */

export type RegistrationDraft = {
  tournamentId: string
  name: string
  phone: string
}

/**
 * Tournir registers players against their Tournir profile (phone + PIN) and
 * has no public API to do it from here. With `VITE_TOURNAMENT_API_URL` set,
 * the form posts to that endpoint — a small server holding the club's Tournir
 * access:
 *
 *   POST /registrations   RegistrationDraft → { ok: true }
 *
 * Without it the request is kept on this device and the page offers to finish
 * on the tournament's own Tournir page (`isDemoRegistration`).
 */
const apiUrl = import.meta.env.VITE_TOURNAMENT_API_URL as string | undefined

export const isDemoRegistration = !apiUrl

const REQUESTS_STORAGE_KEY = 'sktm-tournament-requests'

export async function registerForTournament(draft: RegistrationDraft) {
  if (apiUrl) {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/registrations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return
  }
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY)
    const requests = raw ? (JSON.parse(raw) as RegistrationDraft[]) : []
    localStorage.setItem(
      REQUESTS_STORAGE_KEY,
      JSON.stringify([...requests, { ...draft, at: new Date().toISOString() }]),
    )
  } catch {
    // Nothing to keep it in; the Tournir link still completes it.
  }
}
