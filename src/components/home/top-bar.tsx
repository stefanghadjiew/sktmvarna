import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * The phone-width header. The account avatar that used to sit on the right is
 * commented out along with the profile route — see `src/App.tsx`.
 */
export function TopBar() {
  const { t } = useTranslation()

  return (
    <header className="mb-[30px] flex items-center justify-between gap-2">
      <Link
        to="/"
        aria-label={t('common.homeLink')}
        className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Logo className="size-[34px]" />
      </Link>

      <div className="flex items-center gap-1.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
