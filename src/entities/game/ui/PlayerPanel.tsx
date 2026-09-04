import { MarkIcon } from './MarkIcon'
import { useTranslation } from 'react-i18next'
import type { Player } from '../model/types'

interface PlayerPanelProps {
  player: Player
  isCurrent: boolean
}

export function PlayerPanel({ player, isCurrent }: PlayerPanelProps) {
  const { t } = useTranslation()

  return (
    <article className="player-panel">
      <MarkIcon mark={player.mark} className="player-panel__mark" />
      <div>
        <p className="eyebrow">{player.isBot ? t('game.opponent') : t('game.player')}</p>
        <h2>{player.name}</h2>
      </div>
      {isCurrent ? <span className="player-panel__turn">{t('game.currentTurn')}</span> : null}
    </article>
  )
}
