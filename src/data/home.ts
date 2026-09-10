import { Trophy, UserRound, type LucideIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { TableTennisTableIcon } from '@/components/icons/table-tennis-table'
import type { TranslationKey } from '@/i18n/types'

export type QuickAction = {
  id: string
  labelKey: TranslationKey
  href: string
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>
}

export const quickActions: QuickAction[] = [
  {
    id: 'reserve',
    labelKey: 'home.actions.reserve',
    href: '/reserve',
    icon: TableTennisTableIcon,
  },
  {
    id: 'tournament',
    labelKey: 'home.actions.tournament',
    href: '/tournaments',
    icon: Trophy,
  },
  {
    id: 'trainer',
    labelKey: 'home.actions.trainer',
    href: '/trainers',
    icon: UserRound,
  },
]

export type Tournament = {
  id: string
  nameKey: TranslationKey
  /** ISO 8601 start time, rendered in the club's local timezone. */
  startsAt: string
  status: 'open' | 'full' | 'closed'
  spotsTaken: number
  spotsTotal: number
  href: string
}

export const nextTournament: Tournament = {
  id: 'cup-of-the-advanced',
  nameKey: 'tournaments.names.cupOfTheAdvanced',
  startsAt: '2026-07-30T18:15:00',
  status: 'open',
  spotsTaken: 2,
  spotsTotal: 32,
  href: '/tournaments/cup-of-the-advanced',
}
