import type { TranslationKey } from '@/i18n/types'

/** A label/value pair; `valueKey` is null when the player hasn't filled it in. */
export type ProfileField = {
  labelKey: TranslationKey
  valueKey: TranslationKey | null
}

export type ProfileStat = {
  labelKey: TranslationKey
  value: number
  /** Renders through the percent formatter rather than as a plain number. */
  isPercent?: boolean
}

export type RatingChange = {
  labelKey: TranslationKey
  value: number
}

export type PlayerProfile = {
  id: string
  nameKey: TranslationKey
  initials: string
  stats: ProfileStat[]
  basicInfo: ProfileField[]
  playingStyle: ProfileField[]
  recentMatches: unknown[]
  ratingChange: RatingChange[]
}

export const playerProfile: PlayerProfile = {
  id: 'yasen-kostov',
  nameKey: 'profile.people.yasenKostov',
  initials: 'YK',
  stats: [
    { labelKey: 'profile.stats.rating', value: 1000 },
    { labelKey: 'profile.stats.matches', value: 0 },
    { labelKey: 'profile.stats.wins', value: 0 },
    { labelKey: 'profile.stats.winRate', value: 0, isPercent: true },
  ],
  basicInfo: [
    { labelKey: 'profile.fields.yearOfBirth', valueKey: null },
    { labelKey: 'profile.fields.city', valueKey: null },
    { labelKey: 'profile.fields.country', valueKey: 'profile.values.bulgaria' },
  ],
  playingStyle: [
    { labelKey: 'profile.fields.style', valueKey: null },
    { labelKey: 'profile.fields.grip', valueKey: null },
    { labelKey: 'profile.fields.blade', valueKey: null },
    { labelKey: 'profile.fields.forehandRubber', valueKey: null },
    { labelKey: 'profile.fields.backhandRubber', valueKey: null },
  ],
  recentMatches: [],
  ratingChange: [
    { labelKey: 'profile.ratingChange.sevenDays', value: 0 },
    { labelKey: 'profile.ratingChange.thirtyDays', value: 0 },
    { labelKey: 'profile.ratingChange.thisYear', value: 0 },
    { labelKey: 'profile.ratingChange.tournaments', value: 0 },
  ],
}
