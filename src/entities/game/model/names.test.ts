import { describe, expect, it, vi } from 'vitest'
import { createRandomName, getPreferences } from './names'

describe('player names', () => {
  it('creates locale-appropriate default names', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    expect(createRandomName('ru')).toBe('Ловкий Лис')
    expect(createRandomName('en')).toBe('Swift Fox')

    vi.restoreAllMocks()
  })

  it('keeps stored names instead of replacing them for a new locale', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => JSON.stringify({
          playerXName: 'Saved X',
          playerOName: 'Saved O',
          difficulty: 'hard',
        }),
      },
    })

    expect(getPreferences('en')).toEqual({
      playerXName: 'Saved X',
      playerOName: 'Saved O',
      difficulty: 'hard',
    })

    vi.unstubAllGlobals()
  })
})
