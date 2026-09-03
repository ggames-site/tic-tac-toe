import { MarkIcon } from './MarkIcon'
import type { Cell } from '../game/types'

interface GameCellProps {
  index: number
  value: Cell
  isWinning: boolean
  disabled: boolean
  onSelect: (index: number) => void
}

export function GameCell({ index, value, isWinning, disabled, onSelect }: GameCellProps) {
  const label = value === null ? `Поставить знак в клетку ${index + 1}` : `Клетка ${index + 1}: ${value}`

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
