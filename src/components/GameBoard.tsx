import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GameCell } from './GameCell'
import { WinningLine } from './WinningLine'
import type { Board, Mark, RoundResult } from '../game/types'

interface GameBoardProps {
  board: Board
  currentMark: Mark
  outcome: RoundResult
  isLocked: boolean
  onSelect: (index: number) => void
}

export function GameBoard({ board, currentMark, outcome, isLocked, onSelect }: GameBoardProps) {
  const reducedMotion = useReducedMotion()
  const { t } = useTranslation()
  const winningLine = outcome.kind === 'win' ? outcome.line : []

  return (
    <motion.section
      aria-label={t('game.board')}
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: 'easeOut' }}
      className={`game-board ${outcome.kind === 'win' ? 'game-board--won' : ''}`}
    >
      <div className="sr-only" aria-live="polite">
        {outcome.kind === 'playing'
          ? t('game.liveTurn', { mark: currentMark })
          : outcome.kind === 'draw'
            ? t('game.liveDraw')
            : t('game.liveWin', { mark: outcome.winner })}
      </div>
      {board.map((cell, index) => (
        <GameCell
          key={index}
          index={index}
          value={cell}
          isWinning={winningLine.includes(index)}
          disabled={isLocked}
          onSelect={onSelect}
        />
      ))}
      <WinningLine outcome={outcome} />
    </motion.section>
  )
}
