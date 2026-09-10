import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { bg } from '@/i18n/locales/bg'
import { en } from '@/i18n/locales/en'

export const languages = ['bg', 'en'] as const
export type Language = (typeof languages)[number]

/** Bulgarian is the club's primary language. */
export const DEFAULT_LANGUAGE: Language = 'bg'

/** Keep in sync with the bootstrap script in index.html. */
export const LANGUAGE_STORAGE_KEY = 'bapha-language'

export function isLanguage(value: unknown): value is Language {
  return languages.includes(value as Language)
}

/** Storage throws in private mode and with site data blocked — never fatal. */
export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function storeLanguage(language: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Preference just won't survive a reload.
  }
}

export const resources = {
  bg: { translation: bg },
  en: { translation: en },
}

void i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: languages,
  interpolation: {
    // React escapes for us.
    escapeValue: false,
  },
})

// Keeps the document in step with the active language for a11y and SEO.
function syncDocumentLanguage() {
  document.documentElement.lang = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE
  document.title = i18n.t('app.title')
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', i18n.t('app.description'))
}

// `init` is synchronous with inline resources, so its own `languageChanged`
// has already fired by now — run once for the stored language, then on change.
syncDocumentLanguage()
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
