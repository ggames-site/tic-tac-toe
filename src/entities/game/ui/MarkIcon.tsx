import { motion, useReducedMotion } from 'framer-motion'
import type { Mark } from '../model/types'

interface MarkIconProps {
  mark: Mark
  className?: string
}

const drawTransition = { duration: 0.32, ease: 'easeOut' } as const

export function MarkIcon({ mark, className = '' }: MarkIconProps) {
  const reducedMotion = useReducedMotion()
  const initial = reducedMotion ? false : { pathLength: 0, opacity: 0 }
  const animation = { pathLength: 1, opacity: 1 }

  if (mark === 'X') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 100 100" fill="none">
        <motion.path
          d="M22 22L78 78"
          initial={initial}
          animate={animation}
          transition={drawTransition}
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <motion.path
          d="M78 22L22 78"
          initial={initial}
          animate={animation}
          transition={{ ...drawTransition, delay: reducedMotion ? 0 : 0.1 }}
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 100" fill="none">
      <motion.circle
        cx="50"
        cy="50"
        r="31"
        initial={initial}
        animate={animation}
        transition={drawTransition}
        stroke="currentColor"
        strokeWidth="9"
      />
    </svg>
  )
}
