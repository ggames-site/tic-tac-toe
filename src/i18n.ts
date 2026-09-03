import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ru } from './locales/ru'
import { LANGUAGE_STORAGE_KEY, resolveInitialLanguage, supportedLanguages, toLanguage, type Language } from './i18n/language'

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

function updateDocumentLanguage(language: string): void {
  const normalizedLanguage = toLanguage(language) ?? 'ru'
  document.documentElement.lang = normalizedLanguage
  document.title = i18n.t('document.title', { lng: normalizedLanguage })
}

const initialLanguage = resolveInitialLanguage(readStoredLanguage(), typeof navigator === 'undefined' ? null : navigator.language)

void i18n.use(initReactI18next).init({
  resources: { ru, en },
  lng: initialLanguage,
  fallbackLng: 'ru',
  supportedLngs: supportedLanguages,
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', updateDocumentLanguage)
updateDocumentLanguage(initialLanguage)

export function changeAppLanguage(language: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // The app remains usable when browser storage is unavailable.
  }

  void i18n.changeLanguage(language)
}

export default i18n
