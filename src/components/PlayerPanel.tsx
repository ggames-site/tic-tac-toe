import { MarkIcon } from './MarkIcon'
import type { Player } from '../game/types'

interface PlayerPanelProps {
  player: Player
  isCurrent: boolean
}

export function PlayerPanel({ player, isCurrent }: PlayerPanelProps) {
  return (
    <article className="player-panel">
      <MarkIcon mark={player.mark} className="player-panel__mark" />
      <div>
        <p className="eyebrow">{player.isBot ? 'Соперник' : 'Игрок'}</p>
        <h2>{player.name}</h2>
      </div>
      {isCurrent ? <span className="player-panel__turn">ходит</span> : null}
    </article>
  )
}
