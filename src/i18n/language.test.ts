import { describe, expect, it } from 'vitest'
import { resolveInitialLanguage, toLanguage } from './language'

describe('language resolution', () => {
  it('prefers a supported saved language over the browser language', () => {
    expect(resolveInitialLanguage('en', 'ru-RU')).toBe('en')
  })

  it('uses the supported browser language when no language was saved', () => {
    expect(resolveInitialLanguage(null, 'en-US')).toBe('en')
    expect(resolveInitialLanguage(undefined, 'ru-RU')).toBe('ru')
  })

  it('falls back to Russian for unsupported values', () => {
    expect(resolveInitialLanguage('de', 'fr-FR')).toBe('ru')
    expect(toLanguage('EN-gb')).toBe('en')
  })
})
