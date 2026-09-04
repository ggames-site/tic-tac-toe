export type Mark = 'X' | 'O'

export type Cell = Mark | null

export type Board = readonly Cell[]

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameMode = 'solo' | 'duo'

export type MatchLength = number | null

export interface Player {
  id: 'x' | 'o'
  name: string
  mark: Mark
  isBot: boolean
}

export interface MatchConfig {
  mode: GameMode
  difficulty: Difficulty
  length: MatchLength
}

export interface Score {
  X: number
  O: number
  draws: number
}

export type RoundResult =
  | { kind: 'playing' }
  | { kind: 'draw' }
  | { kind: 'win'; winner: Mark; line: readonly number[] }

export const EMPTY_BOARD: Board = Array<Cell>(9).fill(null)
