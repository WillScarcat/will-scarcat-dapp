'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, X as XIcon } from 'lucide-react'

// All 9 cat faction colors — burst uses these cycling
const CAT_COLORS = [
  '#CCFF00', '#a855f7', '#38bdf8',
  '#f97316', '#4ade80', '#f87171',
  '#ff6b6b', '#4ecdc4', '#ffe66d',
  '#CCFF00', '#a855f7', '#38bdf8',
]

// 12 evenly-spaced burst angles (degrees, clockwise from top)
const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 24 }
const SMOOTH = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }

interface RewardMomentProps {
  amount: number
  ticker: string
  catColor: string
  onClose: () => void
}

export function RewardMoment({ amount, ticker, catColor, onClose }: RewardMomentProps) {
  const [displayAmount, setDisplayAmount] = useState(0)
  const [showShare, setShowShare] = useState(false)
  const shareTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    // Haptic — double tap + hold pattern
    navigator.vibrate?.([50, 30, 50, 30, 100])

    // Odometer: cubic ease-out, 600ms
    const start = performance.now()
    const duration = 600
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayAmount(amount * eased)
      if (t < 1) requestAnimationFrame(tick)
      else setDisplayAmount(amount) // snap to exact value
    }
    requestAnimationFrame(tick)

    // Auto-reveal share after 3s
    shareTimerRef.current = setTimeout(() => setShowShare(true), 3000)
    return () => clearTimeout(shareTimerRef.current)
  }, [amount])

  const shareText = `I just claimed ${amount.toFixed(4)} ${ticker} on Will Scarcat! 🐾`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`

  return (
    <div className="reward-moment-overlay" onClick={onClose}>
      <motion.div
        className="reward-moment-card"
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti burst — 12 particles from center */}
        <div className="confetti-container" aria-hidden="true">
          {CAT_COLORS.map((color, i) => {
            const rad = BURST_ANGLES[i] * (Math.PI / 180)
            const dist = 48 + (i % 4) * 14   // 48–90px radius variation
            const tx = Math.round(Math.sin(rad) * dist)
            const ty = Math.round(-Math.cos(rad) * dist) // negative = upward
            const rot = (i % 2 === 0 ? 1 : -1) * (540 + i * 36)
            return (
              <div
                key={i}
                className="confetti-particle"
                style={{
                  background: color,
                  left: '50%',
                  top: '40%',
                  marginLeft: -3,
                  marginTop: -3,
                  animationDelay: `${i * 35}ms`,
                  ['--tx' as string]: `${tx}px`,
                  ['--ty' as string]: `${ty}px`,
                  ['--rot' as string]: `${rot}deg`,
                } as React.CSSProperties}
              />
            )
          })}
        </div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 transition-opacity hover:opacity-100"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onClick={onClose}
        >
          <XIcon size={16} />
        </button>

        {/* Check icon — spring pop */}
        <motion.div
          className="mx-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          <CheckCircle
            size={44}
            strokeWidth={1.5}
            style={{ color: catColor, filter: `drop-shadow(0 0 12px ${catColor}66)` }}
          />
        </motion.div>

        {/* "CLAIMED!" label */}
        <motion.div
          className="reward-moment-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, ...SMOOTH }}
        >
          Claimed!
        </motion.div>

        {/* Odometer amount — Geist Mono + cat-color glow */}
        <motion.div
          className="reward-moment-amount"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...SMOOTH }}
          style={{
            color: catColor,
            textShadow: `0 0 28px ${catColor}55, 0 0 60px ${catColor}22`,
          }}
        >
          {displayAmount.toFixed(4)}
        </motion.div>

        {/* Ticker */}
        <motion.div
          className="wc-mono text-[11px] font-bold uppercase tracking-[0.2em] mt-1"
          style={{ color: `${catColor}99` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, ...SMOOTH }}
        >
          {ticker}
        </motion.div>

        {/* Share section — auto-shows after 3s, or via close while waiting */}
        <AnimatePresence mode="wait">
          {showShare ? (
            <motion.div
              key="share"
              className="mt-6 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={SMOOTH}
            >
              <div
                className="wc-mono text-[9px] uppercase tracking-[0.15em] text-center mb-3"
                style={{ color: 'rgba(255,255,255,0.28)' }}
              >
                Share the win
              </div>
              <div className="share-links">
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                >
                  𝕏 / Twitter
                </a>
                <a
                  href={farcasterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn share-btn-purple"
                >
                  Farcaster
                </a>
              </div>
              <button
                className="mt-3 w-full text-[10px] wc-mono uppercase tracking-wider transition-opacity hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.28)' }}
                onClick={onClose}
              >
                Close
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="close"
              className="mt-6 px-5 py-2 text-[10px] wc-mono uppercase tracking-wider transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Close
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
