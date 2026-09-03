export interface SavedPreferences {
  playerXName: string
  playerOName: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const STORAGE_KEY = 'ggames-tic-tac-toe-preferences'
const FIRST_PARTS = ['Ловкий', 'Смелый', 'Точный', 'Быстрый', 'Тихий', 'Яркий', 'Мудрый', 'Северный']
const SECOND_PARTS = ['Лис', 'Маяк', 'Стриж', 'Клён', 'Ветер', 'Комета', 'Сокол', 'Кедр']

function choose<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)] as T
}

export function createRandomName(): string {
  return `${choose(FIRST_PARTS)} ${choose(SECOND_PARTS)}`
}

export function getPreferences(): SavedPreferences {
  const fallback: SavedPreferences = {
    playerXName: createRandomName(),
    playerOName: createRandomName(),
    difficulty: 'medium',
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === null) return fallback

    const parsed: Partial<SavedPreferences> = JSON.parse(stored)
    return {
      playerXName: parsed.playerXName?.trim() || fallback.playerXName,
      playerOName: parsed.playerOName?.trim() || fallback.playerOName,
      difficulty: parsed.difficulty === 'easy' || parsed.difficulty === 'hard' ? parsed.difficulty : 'medium',
    }
  } catch {
    return fallback
  }
}

export function savePreferences(preferences: SavedPreferences): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}
