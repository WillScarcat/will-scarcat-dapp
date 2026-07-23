'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

export type ClaimState = 'idle' | 'signing' | 'confirming' | 'confirmed'

interface ClaimButtonProps {
  ticker: string
  catColor: string
  claimState: ClaimState
  disabled?: boolean
  hasReward?: boolean
  onClick: () => void
  variant?: 'card' | 'full'
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 22 }

export function ClaimButton({
  ticker,
  catColor,
  claimState,
  disabled,
  hasReward = true,
  onClick,
  variant = 'card',
}: ClaimButtonProps) {
  const isIdle = claimState === 'idle'
  const isSigning = claimState === 'signing'
  const isConfirming = claimState === 'confirming'
  const isConfirmed = claimState === 'confirmed'
  const isActive = !isIdle

  const canClick = isIdle && hasReward && !disabled

  return (
    <motion.button
      onClick={canClick ? onClick : undefined}
      disabled={!canClick}
      whileHover={canClick ? { scale: 1.03 } : undefined}
      whileTap={canClick ? { scale: 0.96 } : undefined}
      transition={SPRING}
      className={[
        'relative overflow-hidden flex items-center justify-center gap-1.5',
        'wc-mono text-[10px] font-black uppercase tracking-wider',
        'transition-colors disabled:cursor-not-allowed',
        variant === 'full'
          ? 'w-full py-4 text-sm rounded-[10px]'
          : 'flex-1 py-1.5 btn-claim rounded-[8px]',
      ].join(' ')}
      style={{
        background: isConfirmed
          ? 'rgba(34,197,94,0.12)'
          : isConfirming || isSigning
          ? `${catColor}18`
          : hasReward
          ? '#CCFF00'
          : 'rgba(255,255,255,0.04)',
        color: isConfirmed
          ? '#22c55e'
          : isConfirming || isSigning
          ? catColor
          : hasReward
          ? '#0f0f12'
          : 'rgba(255,255,255,0.25)',
        border: isConfirmed
          ? '1px solid rgba(34,197,94,0.28)'
          : isConfirming || isSigning
          ? `1px solid ${catColor}40`
          : 'none',
        boxShadow:
          isConfirming ? `0 0 14px ${catColor}28` : undefined,
      }}
    >
      {/* Confirming pulse ring */}
      {isConfirming && (
        <motion.span
          className="absolute inset-0"
          style={{ border: `1px solid ${catColor}`, borderRadius: 'inherit' }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {isConfirmed ? (
          <motion.span
            key="confirmed"
            className="flex items-center gap-1"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING}
          >
            <Check size={11} strokeWidth={3} />
            Claimed!
          </motion.span>
        ) : isSigning ? (
          <motion.span
            key="signing"
            className="flex items-center gap-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 size={10} className="animate-spin" />
            Signing...
          </motion.span>
        ) : isConfirming ? (
          <motion.span
            key="confirming"
            className="flex items-center gap-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 size={10} className="animate-spin" />
            Confirming...
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {hasReward ? `Claim ${ticker}` : `0 ${ticker}`}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
