import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { MouseEvent, PropsWithChildren, ReactNode } from 'react'

interface DialogProps extends PropsWithChildren {
  isOpen: boolean
  title: string
  description?: string
  actions?: ReactNode
  onClose?: () => void
}

export function Dialog({ isOpen, title, description, actions, children, onClose }: DialogProps) {
  const reducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return undefined

    dialogRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
          onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) onClose?.()
          }}
        >
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
            className="dialog"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.99 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}
          >
            <header className="dialog__header">
              <p className="eyebrow">GGames</p>
              <h2 id="dialog-title">{title}</h2>
              {description ? <p>{description}</p> : null}
            </header>
            {children}
            {actions ? <footer className="dialog__actions">{actions}</footer> : null}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
