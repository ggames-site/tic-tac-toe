export const LANGUAGE_STORAGE_KEY = 'ggames-tic-tac-toe-language'

export const supportedLanguages = ['ru', 'en'] as const

export type Language = (typeof supportedLanguages)[number]

export function toLanguage(value: string | null | undefined): Language | null {
  const language = value?.toLowerCase().split('-')[0]
  return language === 'ru' || language === 'en' ? language : null
}

export function resolveInitialLanguage(storedLanguage: string | null | undefined, browserLanguage: string | null | undefined): Language {
  return toLanguage(storedLanguage) ?? toLanguage(browserLanguage) ?? 'ru'
}
