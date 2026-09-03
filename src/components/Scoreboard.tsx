import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Score } from '../game/types'

interface AnimatedNumberProps {
  value: number
  className?: string
}

function AnimatedNumber({ value, className = '' }: AnimatedNumberProps) {
  const reducedMotion = useReducedMotion()

  return (
    <span className={`scoreboard__number ${className}`} aria-label={`${value}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

interface ScoreboardProps {
  score: Score
  completedRounds: number
  length: number | null
}

export function Scoreboard({ score, completedRounds, length }: ScoreboardProps) {
  return (
    <section className="scoreboard" aria-label="Счёт матча">
      <div className="scoreboard__middle">
        <small>ничьи: {score.draws}</small>
        <div className="scoreboard__score" aria-label={`Счёт: ${score.X} – ${score.O}`}>
          <AnimatedNumber value={score.X} className="scoreboard__number--large" />
          <span className="scoreboard__dash" aria-hidden="true">–</span>
          <AnimatedNumber value={score.O} className="scoreboard__number--large" />
        </div>
        <span className="scoreboard__round">{length === null ? 'Без лимита' : `Партия ${Math.min(completedRounds + 1, length)} из ${length}`}</span>
      </div>
    </section>
  )
}
