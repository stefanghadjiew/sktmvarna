import {
  BadgeEuro,
  CalendarCheck,
  MapPin,
  Trophy,
  Users,
  // Icons for the switched-off rankings and account tabs.
  // ChartLine,
  // UserRound,
  type LucideIcon,
} from 'lucide-react'

import type { TranslationKey } from '@/i18n/types'

export type NavItem = {
  id: string
  labelKey: TranslationKey
  /** Shorter label for the phone tab bar, where five have to fit. */
  shortLabelKey?: TranslationKey
  to: string
  icon: LucideIcon
}

/**
 * The main menu, in the order the site wants to lead people: book, play a
 * tournament, train, check prices, find the hall. Home is the logo; the
 * gallery is no longer a tab — its photos sit inside the pages instead.
 *
 * Rankings and account are commented out rather than deleted — their pages
 * still exist, so restoring a tab is uncommenting its entry here and its route
 * in `src/App.tsx`.
 */
export const navItems: NavItem[] = [
  { id: 'reserve', labelKey: 'nav.reserve', to: '/reserve', icon: CalendarCheck },
  { id: 'tournaments', labelKey: 'nav.tournaments', to: '/tournaments', icon: Trophy },
  { id: 'coaching', labelKey: 'nav.coaching', to: '/trainers', icon: Users },
  { id: 'prices', labelKey: 'nav.prices', to: '/prices', icon: BadgeEuro },
  { id: 'hall', labelKey: 'nav.hall', shortLabelKey: 'nav.hallShort', to: '/hall', icon: MapPin },
  // { id: 'rankings', labelKey: 'nav.rankings', to: '/rankings', icon: ChartLine },
  // { id: 'account', labelKey: 'nav.account', to: '/account', icon: UserRound },
]

export const headerNavItems = navItems.filter((item) => item.id !== 'account')
