import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { RoundResult } from '../game/types'

interface WinningLineProps {
  outcome: RoundResult
}

const paths: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
  '0-1-2': { x1: 8, y1: 16.7, x2: 92, y2: 16.7 },
  '3-4-5': { x1: 8, y1: 50, x2: 92, y2: 50 },
  '6-7-8': { x1: 8, y1: 83.3, x2: 92, y2: 83.3 },
  '0-3-6': { x1: 16.7, y1: 8, x2: 16.7, y2: 92 },
  '1-4-7': { x1: 50, y1: 8, x2: 50, y2: 92 },
  '2-5-8': { x1: 83.3, y1: 8, x2: 83.3, y2: 92 },
  '0-4-8': { x1: 8, y1: 8, x2: 92, y2: 92 },
  '2-4-6': { x1: 92, y1: 8, x2: 8, y2: 92 },
}

export function WinningLine({ outcome }: WinningLineProps) {
  const reducedMotion = useReducedMotion()
  const line = outcome.kind === 'win' ? paths[outcome.line.join('-')] : undefined

  return (
    <AnimatePresence>
      {line ? (
        <motion.svg
          aria-hidden="true"
          className="winning-line"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.line
            {...line}
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.48, ease: 'easeOut' }}
          />
        </motion.svg>
      ) : null}
    </AnimatePresence>
  )
}
