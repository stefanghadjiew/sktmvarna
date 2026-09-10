export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

/** Keep in sync with the bootstrap script in index.html. */
export const THEME_STORAGE_KEY = 'bapha-theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Matches the `--background` of each theme, for the browser chrome. */
const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#faf9f7',
  dark: '#0a0a0a',
}

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

export function watchSystemTheme(onChange: (theme: ResolvedTheme) => void) {
  const query = window.matchMedia(DARK_QUERY)
  const handler = (event: MediaQueryListEvent) => {
    onChange(event.matches ? 'dark' : 'light')
  }
  query.addEventListener('change', handler)
  return () => query.removeEventListener('change', handler)
}

/** Storage throws in private mode and with site data blocked — never fatal. */
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Preference just won't survive a reload.
  }
}

export function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[resolved])
}

let transitionTimer: number | undefined

/** Crossfades the palette instead of snapping it. */
export function withThemeTransition(apply: () => void) {
  const root = document.documentElement
  root.classList.add('theme-transition')
  apply()
  window.clearTimeout(transitionTimer)
  transitionTimer = window.setTimeout(() => {
    root.classList.remove('theme-transition')
  }, 220)
}
