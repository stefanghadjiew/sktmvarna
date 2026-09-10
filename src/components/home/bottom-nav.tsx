import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'

/** The phone-width tab bar. From `md` up `SiteHeader` replaces it. */
export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('nav.primary')}
      className="hairline-t flex justify-around pt-4"
    >
      {navItems.map(({ id, labelKey, to, icon: Icon }) => (
        <NavLink
          key={id}
          to={to}
          end={to === '/'}
          aria-label={t(labelKey)}
          className="rounded-md p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {({ isActive }) => (
            <Icon
              className={cn(
                'size-[18px]',
                isActive
                  ? 'text-brand opacity-100'
                  : 'text-foreground opacity-35',
              )}
              strokeWidth={1.8}
            />
          )}
        </NavLink>
      ))}
    </nav>
  )
}
