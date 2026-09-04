export interface SavedPreferences {
  playerXName: string
  playerOName: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const STORAGE_KEY = 'ggames-tic-tac-toe-preferences'
type NameLanguage = 'ru' | 'en'

const NAME_PARTS: Record<NameLanguage, { first: readonly string[]; second: readonly string[] }> = {
  ru: {
    first: ['Ловкий', 'Смелый', 'Точный', 'Быстрый', 'Тихий', 'Яркий', 'Мудрый', 'Северный'],
    second: ['Лис', 'Маяк', 'Стриж', 'Клён', 'Ветер', 'Комета', 'Сокол', 'Кедр'],
  },
  en: {
    first: ['Swift', 'Brave', 'Keen', 'Quick', 'Quiet', 'Bright', 'Wise', 'Northern'],
    second: ['Fox', 'Beacon', 'Swift', 'Maple', 'Wind', 'Comet', 'Falcon', 'Cedar'],
  },
}

function choose<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)] as T
}

export function createRandomName(language: NameLanguage = 'ru'): string {
  const parts = NAME_PARTS[language]
  return `${choose(parts.first)} ${choose(parts.second)}`
}

export function getPreferences(language: NameLanguage = 'ru'): SavedPreferences {
  const fallback: SavedPreferences = {
    playerXName: createRandomName(language),
    playerOName: createRandomName(language),
    difficulty: 'medium',
  }

  return getStoredPreferences() ?? fallback
}

export function getStoredPreferences(): SavedPreferences | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === null) return null

    const parsed: Partial<SavedPreferences> = JSON.parse(stored)
    return {
      playerXName: parsed.playerXName?.trim() || '',
      playerOName: parsed.playerOName?.trim() || '',
      difficulty: parsed.difficulty === 'easy' || parsed.difficulty === 'hard' ? parsed.difficulty : 'medium',
    }
  } catch {
    return null
  }
}

export function savePreferences(preferences: SavedPreferences): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}
