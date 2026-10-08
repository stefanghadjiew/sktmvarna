/**
 * Every indexable page, in one place. The build reads this (see the `seo`
 * plugin in vite.config.ts) to write sitemap.xml and a pre-filled HTML file
 * per page, and `usePageMeta` reads it at runtime — so a page's title and
 * description live only in the locale files under `seo.<key>`.
 *
 * Kept free of `@/` imports: vite.config.ts loads it directly under Node.
 */
export type SeoKey =
  | 'home'
  | 'reserve'
  | 'myBookings'
  | 'tournaments'
  | 'trainers'
  | 'prices'
  | 'hall'
  | 'club'
  | 'gallery'

export type SeoPage = {
  key: SeoKey
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: number
  /** Private or per-visitor pages stay out of the sitemap and the index. */
  index: boolean
}

export const seoPages: SeoPage[] = [
  { key: 'home', path: '/', changefreq: 'daily', priority: 1, index: true },
  { key: 'reserve', path: '/reserve', changefreq: 'daily', priority: 0.9, index: true },
  { key: 'tournaments', path: '/tournaments', changefreq: 'daily', priority: 0.9, index: true },
  { key: 'trainers', path: '/trainers', changefreq: 'monthly', priority: 0.7, index: true },
  { key: 'prices', path: '/prices', changefreq: 'monthly', priority: 0.8, index: true },
  { key: 'hall', path: '/hall', changefreq: 'monthly', priority: 0.8, index: true },
  { key: 'club', path: '/club', changefreq: 'monthly', priority: 0.7, index: true },
  { key: 'gallery', path: '/gallery', changefreq: 'monthly', priority: 0.5, index: true },
  { key: 'myBookings', path: '/reserve/my', changefreq: 'monthly', priority: 0, index: false },
]

/**
 * Canonical origin, no trailing slash. Override with the `SITE_URL` env var
 * at build time once the site moves to its own domain; vite.config.ts passes
 * the result to the app as `__SITE_URL__`.
 */
export const DEFAULT_SITE_URL = 'https://sktmvarna.onrender.com'
