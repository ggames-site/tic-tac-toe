import { Dialog } from './Dialog'
import { useTranslation } from 'react-i18next'
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

const difficulties: readonly Difficulty[] = ['easy', 'medium', 'hard']

export function SetupDialog({ step, mode, difficulty, onModeSelect, onDifficultySelect, onLengthSelect }: SetupDialogProps) {
  const { t } = useTranslation()

  if (step === 'mode') {
    return (
      <Dialog isOpen title={t('setup.modeTitle')} description={t('setup.modeDescription')}>
        <div className="choice-grid">
          <button type="button" className="choice-card" onClick={() => onModeSelect('solo')}>
            <span className="choice-card__number">01</span>
            <strong>{t('setup.soloTitle')}</strong>
            <small>{t('setup.soloDescription')}</small>
          </button>
          <button type="button" className="choice-card" onClick={() => onModeSelect('duo')}>
            <span className="choice-card__number">02</span>
            <strong>{t('setup.duoTitle')}</strong>
            <small>{t('setup.duoDescription')}</small>
          </button>
        </div>
      </Dialog>
    )
  }

  if (step === 'difficulty') {
    return (
      <Dialog isOpen title={t('setup.difficultyTitle')} description={t('setup.difficultyDescription')}>
        <div className="option-list">
          {difficulties.map((value) => (
            <button
              type="button"
              key={value}
              className={`option-row ${difficulty === value ? 'option-row--selected' : ''}`}
              onClick={() => onDifficultySelect(value)}
            >
              <span>
                <strong>{t(`difficulty.${value}.title`)}</strong>
                <small>{t(`difficulty.${value}.description`)}</small>
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
      title={t('setup.lengthTitle')}
      description={mode === 'solo' ? t('setup.soloLengthDescription') : t('setup.duoLengthDescription')}
    >
      <div className="choice-grid choice-grid--length">
        <button type="button" className="choice-card choice-card--featured" onClick={() => onLengthSelect(null)}>
          <span className="choice-card__number">∞</span>
          <strong>{t('setup.infiniteTitle')}</strong>
          <small>{t('setup.infiniteDescription')}</small>
        </button>
        {[3, 5, 7].map((length) => (
          <button type="button" key={length} className="choice-card" onClick={() => onLengthSelect(length)}>
            <span className="choice-card__number">{length}</span>
            <strong>{t('setup.roundsTitle', { count: length })}</strong>
            <small>{t('setup.roundsDescription')}</small>
          </button>
        ))}
      </div>
    </Dialog>
  )
}
