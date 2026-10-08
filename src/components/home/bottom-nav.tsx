import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'

/**
 * The phone-width tab bar. From `md` up `SiteHeader` replaces it. Five tabs
 * are too many to tell apart by icon alone, so each carries a short label.
 */
export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('nav.primary')}
      className="hairline-t flex justify-around gap-1 pt-2.5"
    >
      {navItems.map(({ id, labelKey, shortLabelKey, to, icon: Icon }) => (
        <NavLink
          key={id}
          to={to}
          aria-label={t(labelKey)}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md px-0.5 py-1 text-[10px] font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isActive ? 'text-brand' : 'text-foreground/50',
            )
          }
        >
          <Icon className="size-[18px]" strokeWidth={1.8} />
          <span className="max-w-full truncate">{t(shortLabelKey ?? labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
