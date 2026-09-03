import { Dialog } from './Dialog'
import { useTranslation } from 'react-i18next'

interface SeriesResultDialogProps {
  isOpen: boolean
  xName: string
  oName: string
  xScore: number
  oScore: number
  draws: number
  onPlayAgain: () => void
}

export function SeriesResultDialog({ isOpen, xName, oName, xScore, oScore, draws, onPlayAgain }: SeriesResultDialogProps) {
  const { t } = useTranslation()
  const winner = xScore === oScore ? null : xScore > oScore ? xName : oName

  return (
    <Dialog
      isOpen={isOpen}
      title={winner === null ? t('result.drawTitle') : t('result.winTitle', { name: winner })}
      description={winner === null ? t('result.drawDescription') : t('result.winDescription')}
      actions={<button type="button" className="button" onClick={onPlayAgain}>{t('result.playAgain')}</button>}
    >
      <dl className="result-score">
        <div><dt>{xName}</dt><dd>{xScore}</dd></div>
        <div><dt>{t('result.draws')}</dt><dd>{draws}</dd></div>
        <div><dt>{oName}</dt><dd>{oScore}</dd></div>
      </dl>
    </Dialog>
  )
}
