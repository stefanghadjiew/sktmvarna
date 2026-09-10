import type { TranslationKey } from '@/i18n/types'

/** Result of one recent match, newest last — drives the form dots. */
export type FormResult = 'win' | 'loss' | 'none'

export type RankedPlayer = {
  id: string
  rank: number
  nameKey: TranslationKey
  initials: string
  styleKey: TranslationKey
  tournaments: number
  /** Share of matches won, 0–1. Null until they've played a tournament. */
  winRate: number | null
  rating: number
  /** Rating change since the last update; 0 renders as a flat dash. */
  delta: number
  form: FormResult[]
}

/** Ranks 1–3 get the brand-coloured position number. */
export const TOP_RANK_THRESHOLD = 3

export const rankedPlayers: RankedPlayer[] = [
  {
    id: 'kaloyan-dechev',
    rank: 1,
    nameKey: 'rankings.people.kaloyanDechev',
    initials: 'KD',
    styleKey: 'rankings.styles.attacker',
    tournaments: 2,
    winRate: 0.91,
    rating: 827,
    delta: 27,
    form: ['win', 'win', 'win', 'win', 'win'],
  },
  {
    id: 'zhivko-kolev',
    rank: 2,
    nameKey: 'rankings.people.zhivkoKolev',
    initials: 'ZK',
    styleKey: 'rankings.styles.attacker',
    tournaments: 1,
    winRate: 0.83,
    rating: 807,
    delta: 7,
    form: ['win', 'win', 'win', 'win', 'loss'],
  },
  {
    id: 'roman-kuvaev',
    rank: 3,
    nameKey: 'rankings.people.romanKuvaev',
    initials: 'RK',
    styleKey: 'rankings.styles.allRound',
    tournaments: 2,
    winRate: 0.78,
    rating: 805,
    delta: 5,
    form: ['win', 'win', 'loss', 'win', 'win'],
  },
  {
    id: 'yuliy-bilan',
    rank: 4,
    nameKey: 'rankings.people.yuliyBilan',
    initials: 'YB',
    styleKey: 'rankings.styles.allRound',
    tournaments: 1,
    winRate: 0.83,
    rating: 805,
    delta: 5,
    form: ['win', 'win', 'win', 'win', 'loss'],
  },
  {
    id: 'karola-karova',
    rank: 5,
    nameKey: 'rankings.people.karolaKarova',
    initials: 'KK',
    styleKey: 'rankings.styles.attacker',
    tournaments: 1,
    winRate: 0.6,
    rating: 801,
    delta: 1,
    form: ['loss', 'win', 'win', 'loss', 'win'],
  },
  {
    id: 'damian-yueber',
    rank: 6,
    nameKey: 'rankings.people.damianYueber',
    initials: 'DY',
    styleKey: 'rankings.styles.allRound',
    tournaments: 0,
    winRate: null,
    rating: 800,
    delta: 0,
    form: ['none', 'none', 'none', 'none', 'none'],
  },
]
