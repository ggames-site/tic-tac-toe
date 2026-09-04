import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog } from '../../../shared/ui/Dialog'
import type { Difficulty, GameMode } from '../../../entities/game/model/types'

interface SettingsDialogProps {
  isOpen: boolean
  mode: GameMode | null
  difficulty: Difficulty
  xName: string
  oName: string
  onClose: () => void
  onSave: (values: { xName: string; oName: string; difficulty: Difficulty }) => void
  onNewGame: () => void
}

export function SettingsDialog({ isOpen, mode, difficulty, xName, oName, onClose, onSave, onNewGame }: SettingsDialogProps) {
  const { t } = useTranslation()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    onSave({
      xName: String(values.get('xName') ?? '').trim() || xName,
      oName: String(values.get('oName') ?? '').trim() || oName,
      difficulty: String(values.get('difficulty') ?? difficulty) as Difficulty,
    })
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      title={t('settings.title')}
      description={t('settings.description')}
      onClose={onClose}
    >
      <form className="settings-form" onSubmit={submit}>
        <label>
          <span>{t('settings.playerX')}</span>
          <input name="xName" defaultValue={xName} maxLength={24} autoComplete="off" />
        </label>
        {mode === 'duo' ? (
          <label>
            <span>{t('settings.playerO')}</span>
            <input name="oName" defaultValue={oName} maxLength={24} autoComplete="off" />
          </label>
        ) : null}
        {mode === 'solo' ? (
          <label>
            <span>{t('settings.botDifficulty')}</span>
            <select name="difficulty" defaultValue={difficulty}>
              <option value="easy">{t('difficulty.easy.title')}</option>
              <option value="medium">{t('difficulty.medium.title')}</option>
              <option value="hard">{t('difficulty.hard.title')}</option>
            </select>
          </label>
        ) : null}
        <div className="settings-form__actions">
          <button type="button" className="button button--ghost" onClick={onNewGame}>{t('settings.newGame')}</button>
          <button type="submit" className="button">{t('settings.save')}</button>
        </div>
      </form>
    </Dialog>
  )
}
