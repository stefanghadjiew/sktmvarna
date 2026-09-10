import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Bulgarian CLDR renders a `short` month numerically ("чт, 30.07"), so it asks
 * for the long name to stay readable; English keeps the design's "Thu, Jul 30".
 */
const DATE_FORMATS: Record<string, [locale: string, Intl.DateTimeFormatOptions]> =
  {
    bg: ['bg-BG', { weekday: 'short', day: 'numeric', month: 'long' }],
    en: ['en-US', { weekday: 'short', month: 'short', day: 'numeric' }],
  }

/**
 * `Intl` formatters bound to the active language, so dates and times follow
 * the same switch as the copy.
 */
export function useFormatters() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'bg'

  return useMemo(() => {
    const [locale, dateOptions] = DATE_FORMATS[language]
    return {
      locale,
      date: new Intl.DateTimeFormat(locale, dateOptions),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }),
      percent: new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 0,
      }),
    }
  }, [language])
}
