import { createContext } from 'react'

import type { ResolvedTheme, Theme } from '@/lib/theme'

export type ThemeContextValue = {
  /** What the user picked — may be `system`. */
  theme: Theme
  /** What is actually on screen right now. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  /** Flips to the opposite of what is currently rendered. */
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
