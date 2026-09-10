import type { ParseKeys } from 'i18next'

/**
 * Every key in the default namespace. Data files use this so a stale key is a
 * build error rather than a raw key rendered on screen.
 */
export type TranslationKey = ParseKeys
