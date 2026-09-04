export const supportedLanguages = ['ru', 'en'] as const

export type Language = (typeof supportedLanguages)[number]

export function toLanguage(value: string | null | undefined): Language | null {
  const language = value?.toLowerCase().split('-')[0]
  return language === 'ru' || language === 'en' ? language : null
}

export function resolveInitialLanguage(
  queryLanguage: string | null | undefined,
  cookieLanguage: string | null | undefined,
  browserLanguage: string | null | undefined,
): Language {
  return toLanguage(queryLanguage) ?? toLanguage(cookieLanguage) ?? toLanguage(browserLanguage) ?? 'en'
}
