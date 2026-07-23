'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  /** Prevent closing on backdrop click */
  lock?: boolean
}

const SHEET = {
  initial:  { y: '100%', opacity: 0.6 },
  animate:  { y: 0,      opacity: 1   },
  exit:     { y: '100%', opacity: 0   },
  transition: {
    type: 'spring' as const,
    stiffness: 380,
    damping: 32,
    mass: 0.9,
  },
}

export default function BottomSheet({ isOpen, onClose, children, lock }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Keyboard: Escape closes
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !lock) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, lock, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[190]"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={lock ? undefined : onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-[200]"
            style={{
              background: 'var(--smoke-2, #14141a)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px 20px 0 0',
              maxHeight: '85dvh',
              overflowY: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            {...SHEET}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="rounded-full"
                style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.15)' }}
              />
            </div>

            <div className="px-5 pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
