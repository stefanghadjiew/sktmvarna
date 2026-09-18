import {
  House,
  Image,
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
  to: string
  icon: LucideIcon
}

/**
 * One tab per screen that is currently switched on. Rankings and account are
 * commented out rather than deleted — their pages still exist, so restoring a
 * tab is uncommenting its entry here and its route in `src/App.tsx`.
 */
export const navItems: NavItem[] = [
  { id: 'home', labelKey: 'nav.home', to: '/', icon: House },
  { id: 'gallery', labelKey: 'nav.gallery', to: '/gallery', icon: Image },
  // { id: 'rankings', labelKey: 'nav.rankings', to: '/rankings', icon: ChartLine },
  { id: 'coaching', labelKey: 'nav.coaching', to: '/trainers', icon: Users },
  // { id: 'account', labelKey: 'nav.account', to: '/account', icon: UserRound },
]

export const headerNavItems = navItems.filter((item) => item.id !== 'account')
