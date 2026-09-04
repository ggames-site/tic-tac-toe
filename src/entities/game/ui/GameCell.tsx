import { MarkIcon } from './MarkIcon'
import { useTranslation } from 'react-i18next'
import type { Cell } from '../model/types'

interface GameCellProps {
  index: number
  value: Cell
  isWinning: boolean
  disabled: boolean
  onSelect: (index: number) => void
}

export function GameCell({ index, value, isWinning, disabled, onSelect }: GameCellProps) {
  const { t } = useTranslation()
  const label = value === null
    ? t('game.emptyCell', { index: index + 1 })
    : t('game.filledCell', { index: index + 1, mark: value })

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || value !== null}
      onClick={() => onSelect(index)}
      className={`game-cell ${value === null ? 'game-cell--empty' : ''} ${isWinning ? 'game-cell--winning' : ''}`}
    >
      {value !== null ? <MarkIcon mark={value} className={value === 'X' ? 'mark mark--x' : 'mark mark--o'} /> : null}
    </button>
  )
}
