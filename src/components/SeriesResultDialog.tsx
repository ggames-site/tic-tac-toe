import { Dialog } from './Dialog'

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
  const winner = xScore === oScore ? null : xScore > oScore ? xName : oName

  return (
    <Dialog
      isOpen={isOpen}
      title={winner === null ? 'Матч завершён вничью' : `Победил ${winner}`}
      description={winner === null ? 'Силы оказались равны.' : 'Отличная серия — сыграете ещё?'}
      actions={<button type="button" className="button" onClick={onPlayAgain}>Играть снова</button>}
    >
      <dl className="result-score">
        <div><dt>{xName}</dt><dd>{xScore}</dd></div>
        <div><dt>Ничьи</dt><dd>{draws}</dd></div>
        <div><dt>{oName}</dt><dd>{oScore}</dd></div>
      </dl>
    </Dialog>
  )
}
