import type { Board, Mark, RoundResult } from './types'

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = []

  for (let index = 0; index < board.length; index += 1) {
    if (board[index] === null) moves.push(index)
  }

  return moves
}

export function getRoundResult(board: Board): RoundResult {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line
    const mark = board[first]

    if (mark !== null && mark === board[second] && mark === board[third]) {
      return { kind: 'win', winner: mark, line }
    }
  }

  return getAvailableMoves(board).length === 0 ? { kind: 'draw' } : { kind: 'playing' }
}

export function placeMark(board: Board, index: number, mark: Mark): Board {
  if (board[index] !== null) return board

  const nextBoard = [...board]
  nextBoard[index] = mark
  return nextBoard
}
