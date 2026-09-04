import { getAvailableMoves, getRoundResult, placeMark } from './rules'
import type { Board, Difficulty, Mark } from './types'

const BOT_MARK: Mark = 'O'
const HUMAN_MARK: Mark = 'X'

function chooseRandomMove(board: Board, random: () => number): number {
  const moves = getAvailableMoves(board)
  return moves[Math.floor(random() * moves.length)] ?? -1
}

function findImmediateMove(board: Board, mark: Mark): number | null {
  for (const move of getAvailableMoves(board)) {
    const outcome = getRoundResult(placeMark(board, move, mark))
    if (outcome.kind === 'win' && outcome.winner === mark) return move
  }

  return null
}

function scorePosition(board: Board, turn: Mark, depth: number): number {
  const outcome = getRoundResult(board)

  if (outcome.kind === 'win') {
    return outcome.winner === BOT_MARK ? 10 - depth : depth - 10
  }

  if (outcome.kind === 'draw') return 0

  const scores = getAvailableMoves(board).map((move) =>
    scorePosition(placeMark(board, move, turn), turn === BOT_MARK ? HUMAN_MARK : BOT_MARK, depth + 1),
  )

  return turn === BOT_MARK ? Math.max(...scores) : Math.min(...scores)
}

function chooseOptimalMove(board: Board): number {
  let bestMove = -1
  let bestScore = -Infinity

  for (const move of getAvailableMoves(board)) {
    const score = scorePosition(placeMark(board, move, BOT_MARK), HUMAN_MARK, 1)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export function chooseBotMove(board: Board, difficulty: Difficulty, random = Math.random): number {
  if (difficulty === 'easy') return chooseRandomMove(board, random)

  const winningMove = findImmediateMove(board, BOT_MARK)
  if (winningMove !== null) return winningMove

  const blockingMove = findImmediateMove(board, HUMAN_MARK)
  if (blockingMove !== null) return blockingMove

  return difficulty === 'medium' ? chooseRandomMove(board, random) : chooseOptimalMove(board)
}
