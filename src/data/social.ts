import type { TranslationKey } from '@/i18n/types'

export type SocialLink = {
  id: string
  labelKey: TranslationKey
  descriptionKey: TranslationKey
  href: string
}

/** The club's two Facebook presences: the hall itself, and the club. */
export const facebookLinks: SocialLink[] = [
  {
    id: 'hall',
    labelKey: 'hall.social.hall',
    descriptionKey: 'hall.social.hallDescription',
    href: 'https://www.facebook.com/share/19ZEsCg97C/?mibextid=wwXIfr',
  },
  {
    id: 'club',
    labelKey: 'hall.social.club',
    descriptionKey: 'hall.social.clubDescription',
    href: 'https://www.facebook.com/share/19YG1dDWnU/?mibextid=wwXIfr',
  },
]
