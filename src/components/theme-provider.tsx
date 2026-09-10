import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  storeTheme,
  watchSystemTheme,
  withThemeTransition,
  type ResolvedTheme,
  type Theme,
} from '@/lib/theme'
import { ThemeContext, type ThemeContextValue } from '@/lib/theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredTheme()),
  )

  // The bootstrap script already set the class; this keeps it in sync after.
  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  // Follow the OS only while the user hasn't chosen an explicit theme.
  useEffect(() => {
    if (theme !== 'system') return
    return watchSystemTheme((next) => {
      withThemeTransition(() => setResolvedTheme(next))
    })
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    storeTheme(next)
    setThemeState(next)
    withThemeTransition(() => setResolvedTheme(resolveTheme(next)))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
