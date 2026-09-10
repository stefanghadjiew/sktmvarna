import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, toggleTheme } = useTheme()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  const label = t('theme.switchTo', { theme: t(`theme.${next}`) })

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative size-[30px] shrink-0 rounded-lg text-label hover:bg-secondary hover:text-foreground"
    >
      <Sun
        className="size-4 scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <Moon
        className="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </Button>
  )
}
