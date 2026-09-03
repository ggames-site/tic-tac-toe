import type { FormEvent } from 'react'
import { Dialog } from './Dialog'
import type { Difficulty, GameMode } from '../game/types'

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
      title="Настройки"
      description="Сохранённые имена и уровень останутся после обновления страницы."
      onClose={onClose}
    >
      <form className="settings-form" onSubmit={submit}>
        <label>
          <span>Игрок X</span>
          <input name="xName" defaultValue={xName} maxLength={24} autoComplete="off" />
        </label>
        {mode === 'duo' ? (
          <label>
            <span>Игрок O</span>
            <input name="oName" defaultValue={oName} maxLength={24} autoComplete="off" />
          </label>
        ) : null}
        {mode === 'solo' ? (
          <label>
            <span>Сложность Бот-Мастера</span>
            <select name="difficulty" defaultValue={difficulty}>
              <option value="easy">Легко</option>
              <option value="medium">Средне</option>
              <option value="hard">Сложно</option>
            </select>
          </label>
        ) : null}
        <div className="settings-form__actions">
          <button type="button" className="button button--ghost" onClick={onNewGame}>Новая игра</button>
          <button type="submit" className="button">Сохранить</button>
        </div>
      </form>
    </Dialog>
  )
}
