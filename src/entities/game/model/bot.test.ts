import { describe, expect, it } from 'vitest'
import { chooseBotMove } from './bot'
import type { Board } from './types'

describe('chooseBotMove', () => {
  it('chooses a deterministic free cell on easy difficulty', () => {
    const board: Board = ['X', null, 'O', null, null, null, null, null, null]

    expect(chooseBotMove(board, 'easy', () => 0.99)).toBe(8)
  })

  it('never chooses an occupied cell', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', null, 'O', 'X', null]
    const move = chooseBotMove(board, 'easy', () => 0)

    expect(board[move]).toBeNull()
  })

  it('takes an immediate win on medium difficulty', () => {
    const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null]

    expect(chooseBotMove(board, 'medium', () => 0.99)).toBe(2)
  })

  it('blocks an immediate opponent win on medium difficulty', () => {
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]

    expect(chooseBotMove(board, 'medium', () => 0)).toBe(2)
  })

  it('uses an edge to prevent a corner fork on hard difficulty', () => {
    const board: Board = ['X', null, null, null, 'O', null, null, null, 'X']
    const move = chooseBotMove(board, 'hard')

    expect([1, 3, 5, 7]).toContain(move)
  })
})
