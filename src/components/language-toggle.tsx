import { useTranslation } from 'react-i18next'

import {
  isLanguage,
  languages,
  storeLanguage,
  type Language,
} from '@/i18n/config'
import { cn } from '@/lib/utils'

/**
 * Segmented BG / EN picker. With only two languages a segmented control shows
 * both the current choice and the alternative without opening a menu.
 */
export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const current = isLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : languages[0]

  const select = (language: Language) => {
    if (language === current) return
    storeLanguage(language)
    void i18n.changeLanguage(language)
  }

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex h-[30px] items-center rounded-lg bg-secondary p-0.5"
    >
      {languages.map((language) => {
        const isCurrent = language === current
        return (
          <button
            key={language}
            type="button"
            onClick={() => select(language)}
            aria-pressed={isCurrent}
            aria-label={t('language.switchTo', {
              language: t(`language.${language}`),
            })}
            className={cn(
              'rounded-[6px] px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isCurrent
                ? 'bg-brand text-white'
                : 'text-label hover:text-foreground',
            )}
          >
            {language}
          </button>
        )
      })}
    </div>
  )
}
