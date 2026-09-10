import {
  ChartLine,
  House,
  Image,
  UserRound,
  Users,
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
 * The mockups disagree on the middle tabs, so these five are the
 * reconciliation: one tab per screen that actually exists. Gallery keeps the
 * image icon from the home and trainers mockups.
 *
 * Shared by the mobile bottom nav and the desktop site header. The header
 * drops `account`, which it shows as the avatar on the right instead.
 */
export const navItems: NavItem[] = [
  { id: 'home', labelKey: 'nav.home', to: '/', icon: House },
  { id: 'gallery', labelKey: 'nav.gallery', to: '/gallery', icon: Image },
  { id: 'rankings', labelKey: 'nav.rankings', to: '/rankings', icon: ChartLine },
  { id: 'coaching', labelKey: 'nav.coaching', to: '/trainers', icon: Users },
  { id: 'account', labelKey: 'nav.account', to: '/account', icon: UserRound },
]

export const headerNavItems = navItems.filter((item) => item.id !== 'account')
