import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { bg } from './src/i18n/locales/bg.ts'
import { DEFAULT_SITE_URL, seoPages } from './src/seo/pages.ts'

const siteUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type PageHead = { path: string; title: string; description: string; index: boolean }

/** Swaps the shell's title and description for one page's, and adds the rest. */
function renderHead(shell: string, page: PageHead) {
  const url = `${siteUrl}${page.path}`
  const extra = [
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${page.index ? 'index, follow' : 'noindex, follow'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(bg.complex.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="bg_BG" />`,
  ].join('\n    ')

  return shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace('</head>', `    ${extra}\n  </head>`)
}

/**
 * The SEO half of the build, run after Vite has written `dist/`:
 *
 * - `<page>/index.html` for every page in `src/seo/pages.ts` and every synced
 *   tournament, each with its own title, description and canonical URL baked
 *   in. Render serves a real file before it applies the SPA rewrite, so
 *   crawlers get the right head without running any JavaScript.
 * - `sitemap.xml` built from the same list — a real XML file, where before the
 *   rewrite handed out the React shell for it.
 * - `robots.txt` pointing at the sitemap.
 */
function seo(): Plugin {
  let outDir = 'dist'

  return {
    name: 'sktm-seo',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const shell = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const { tournaments } = JSON.parse(
        readFileSync(path.resolve(import.meta.dirname, 'src/data/tournaments.generated.json'), 'utf8'),
      ) as { tournaments: { id: string; name: string; startsAt: string; description: string | null }[] }

      const heads: (PageHead & { changefreq: string; priority: number })[] = [
        ...seoPages.map((page) => ({
          path: page.path,
          title: bg.seo[page.key].title,
          description: bg.seo[page.key].description,
          index: page.index,
          changefreq: page.changefreq,
          priority: page.priority,
        })),
        ...tournaments.map((tournament) => ({
          path: `/tournaments/${tournament.id}`,
          title: bg.seo.tournament.title
            .replace('{{name}}', tournament.name)
            .replace('{{date}}', tournament.startsAt.slice(0, 10).split('-').reverse().join('.')),
          description: tournament.description ?? bg.seo.tournament.description,
          index: true,
          changefreq: 'daily',
          priority: 0.6,
        })),
      ]

      for (const head of heads) {
        const html = renderHead(shell, head)
        if (head.path === '/') {
          writeFileSync(path.join(outDir, 'index.html'), html)
        } else {
          const dir = path.join(outDir, head.path)
          mkdirSync(dir, { recursive: true })
          writeFileSync(path.join(dir, 'index.html'), html)
        }
      }

      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = heads
        .filter((head) => head.index)
        .map(
          (head) =>
            `  <url>\n    <loc>${siteUrl}${head.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${head.changefreq}</changefreq>\n    <priority>${head.priority.toFixed(1)}</priority>\n  </url>`,
        )
        .join('\n')
      writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )

      writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /reserve/my\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
