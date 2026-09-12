'use client'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Reusable level-up celebration. Control with `show` + `onDismiss`.
 * Usage: <LevelUpCelebration show={levelUp.show} level={levelUp.level} onDismiss={...} />
 */
export default function LevelUpCelebration({ show, level, onDismiss }) {
  const prefersReducedMotion = useReducedMotion()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!show) return
    dialogRef.current?.focus()
    function handleKey(e) {
      if (e.key === 'Escape') onDismiss?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [show, onDismiss])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="presentation"
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(58, 46, 40, 0.45)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="levelup-heading"
            onClick={(e) => e.stopPropagation()}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
            transition={prefersReducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 18 }}
            className="cozy-focusable"
            style={{
              background: 'var(--cozy-surface)',
              borderRadius: 'var(--cozy-radius-lg)',
              border: '1px solid var(--cozy-border)',
              padding: '36px 32px',
              textAlign: 'center',
              maxWidth: 320,
              color: 'var(--cozy-ink)',
              outline: 'none',
            }}
          >
            <motion.div
              aria-hidden="true"
              initial={prefersReducedMotion ? {} : { scale: 0, rotate: -15 }}
              animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.1, type: 'spring', stiffness: 300, damping: 12 }}
              style={{ fontSize: 48, marginBottom: 8 }}
            >
              🌱
            </motion.div>

            <h2 id="levelup-heading" style={{ fontSize: 24, margin: '0 0 6px' }}>
              Level {level}!
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--cozy-ink-soft)' }}>
              Your companion is growing. Keep the streak going.
            </p>

            <span role="status" aria-live="polite" className="sr-only">
              {`You reached level ${level}.`}
            </span>

            <button
              type="button"
              onClick={onDismiss}
              className="cozy-focusable"
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--cozy-radius-md)',
                border: 'none',
                background: 'var(--cozy-honey)',
                color: 'var(--cozy-ink)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Keep studying
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
