import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'

import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { headerNavItems } from '@/data/nav'
import { cn } from '@/lib/utils'

/**
 * The wide-screen counterpart to `BottomNav`: from `md` up the tab bar moves
 * to a sticky header with real labels. Hidden below `md`, where the phone
 * layout's own header and bottom nav take over.
 *
 * The account avatar that used to sit on the right is commented out along with
 * the profile route — see `src/App.tsx`.
 */
export function SiteHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 hidden bg-background/85 backdrop-blur-md md:block">
      <div className="hairline-b mx-auto flex h-16 w-full max-w-content items-center gap-8 px-8 lg:px-12">
        <Link
          to="/"
          aria-label={t('common.homeLink')}
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo className="size-10" />
          <span className="text-[13px] font-semibold tracking-[0.2px] text-foreground">
            {t('landing.eyebrow')}
          </span>
        </Link>

        <nav aria-label={t('nav.primary')}>
          <ul className="flex items-center gap-1">
            {headerNavItems.map(({ id, labelKey, to }) => (
              <li key={id}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      isActive
                        ? 'bg-brand-tint text-brand-accent'
                        : 'text-muted-foreground hover:bg-row-hover hover:text-foreground',
                    )
                  }
                >
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
