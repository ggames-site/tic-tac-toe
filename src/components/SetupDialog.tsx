import { Dialog } from './Dialog'
import type { Difficulty, GameMode } from '../game/types'

export type SetupStep = 'mode' | 'difficulty' | 'length' | null

interface SetupDialogProps {
  step: SetupStep
  mode: GameMode | null
  difficulty: Difficulty
  onModeSelect: (mode: GameMode) => void
  onDifficultySelect: (difficulty: Difficulty) => void
  onLengthSelect: (length: number | null) => void
}

const difficulties: Array<{ value: Difficulty; title: string; description: string }> = [
  { value: 'easy', title: 'Легко', description: 'Бот выбирает свободные клетки случайно.' },
  { value: 'medium', title: 'Средне', description: 'Бот замечает прямые победы и угрозы.' },
  { value: 'hard', title: 'Сложно', description: 'Бот играет оптимально и не ошибается.' },
]

export function SetupDialog({ step, mode, difficulty, onModeSelect, onDifficultySelect, onLengthSelect }: SetupDialogProps) {
  if (step === 'mode') {
    return (
      <Dialog isOpen title="Выберите формат" description="С кем сыграем первую партию?">
        <div className="choice-grid">
          <button type="button" className="choice-card" onClick={() => onModeSelect('solo')}>
            <span className="choice-card__number">01</span>
            <strong>Для одного</strong>
            <small>Сразитесь с Бот-Мастером.</small>
          </button>
          <button type="button" className="choice-card" onClick={() => onModeSelect('duo')}>
            <span className="choice-card__number">02</span>
            <strong>Для двоих</strong>
            <small>Ходите по очереди на одной доске.</small>
          </button>
        </div>
      </Dialog>
    )
  }

  if (step === 'difficulty') {
    return (
      <Dialog isOpen title="Уровень Бот-Мастера" description="Его можно будет изменить в настройках.">
        <div className="option-list">
          {difficulties.map((item) => (
            <button
              type="button"
              key={item.value}
              className={`option-row ${difficulty === item.value ? 'option-row--selected' : ''}`}
              onClick={() => onDifficultySelect(item.value)}
            >
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <svg className="option-row__chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m6 3 5 5-5 5" />
              </svg>
            </button>
          ))}
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog
      isOpen={step === 'length'}
      title="Длина матча"
      description={mode === 'solo' ? 'Проверьте себя против Бот-Мастера.' : 'Выберите число партий для матча.'}
    >
      <div className="choice-grid choice-grid--length">
        <button type="button" className="choice-card choice-card--featured" onClick={() => onLengthSelect(null)}>
          <span className="choice-card__number">∞</span>
          <strong>Бесконечно</strong>
          <small>Новая партия начнётся автоматически.</small>
        </button>
        {[3, 5, 7].map((length) => (
          <button type="button" key={length} className="choice-card" onClick={() => onLengthSelect(length)}>
            <span className="choice-card__number">{length}</span>
            <strong>{length} партий</strong>
            <small>До финального результата.</small>
          </button>
        ))}
      </div>
    </Dialog>
  )
}
