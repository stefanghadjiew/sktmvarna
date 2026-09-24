import type { TranslationKey } from '@/i18n/types'

export type TrainerStat = {
  value: string
  labelKey: TranslationKey
}

export type Trainer = {
  id: string
  nameKey: TranslationKey
  initials: string
  /** Years of coaching, pluralised per language at render time. */
  years: number
  specialtyKey: TranslationKey
  href: string
}

export type FeaturedTrainer = Omit<Trainer, 'years' | 'specialtyKey'> & {
  roleKey: TranslationKey
  badgeKey: TranslationKey
  bioKey: TranslationKey
  stats: TrainerStat[]
  tagKeys: TranslationKey[]
}

export const featuredTrainer: FeaturedTrainer = {
  id: 'nikolay-kapitanov',
  nameKey: 'trainers.people.nikolayKapitanov.name',
  initials: 'NK',
  roleKey: 'trainers.roles.headCoach',
  badgeKey: 'trainers.badges.head',
  bioKey: 'trainers.people.nikolayKapitanov.bio',
  href: '/trainers/nikolay-kapitanov',
  stats: [
    { value: '11', labelKey: 'trainers.stats.yearsCoaching' },
    { value: '45+', labelKey: 'trainers.stats.playersTrained' },
    { value: '12', labelKey: 'trainers.stats.tablesInHall' },
  ],
  tagKeys: [
    'trainers.tags.juniors',
    'trainers.tags.competitivePrep',
    'trainers.tags.formerPro',
    'trainers.tags.germanLeague',
  ],
}

/** Add coaches here as they join; the list shows a placeholder while empty. */
export const otherTrainers: Trainer[] = []
