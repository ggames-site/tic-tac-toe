import { describe, expect, it } from 'vitest'
import { resolveInitialLanguage, toLanguage } from './language'

describe('language resolution', () => {
  it('prefers a supported query language over cookie and browser languages', () => {
    expect(resolveInitialLanguage('en', 'ru', 'ru-RU')).toBe('en')
  })

  it('uses the cookie language before the browser language', () => {
    expect(resolveInitialLanguage(null, 'en', 'ru-RU')).toBe('en')
  })

  it('uses a supported browser language when earlier sources are absent', () => {
    expect(resolveInitialLanguage(null, null, 'en-US')).toBe('en')
    expect(resolveInitialLanguage(undefined, undefined, 'ru-RU')).toBe('ru')
  })

  it('falls back to English for unsupported values', () => {
    expect(resolveInitialLanguage('de', 'fr', 'pl-PL')).toBe('en')
    expect(toLanguage('EN-gb')).toBe('en')
  })
})
