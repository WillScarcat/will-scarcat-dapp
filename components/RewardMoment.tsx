'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Share2, X as XIcon } from 'lucide-react'

const CONFETTI_COLORS = [
  '#CCFF00', '#a855f7', '#38bdf8', '#fb923c', '#4ade80',
  '#f87171', '#FF6B6B', '#4ECDC4', '#FFE66D', '#CCFF00',
  '#a855f7', '#38bdf8',
]

interface RewardMomentProps {
  amount: number
  ticker: string
  catColor: string
  onClose: () => void
}

export function RewardMoment({ amount, ticker, catColor, onClose }: RewardMomentProps) {
  const [displayAmount, setDisplayAmount] = useState(0)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    navigator.vibrate?.([50, 30, 50, 30, 100])

    const startTime = performance.now()
    const duration = 600

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayAmount(amount * eased)
      if (t < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [amount])

  const shareText = `I just claimed ${amount.toFixed(4)} ${ticker} on @WillScarcat! 🐾`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`

  return (
    <div className="reward-moment-overlay" onClick={onClose}>
      <motion.div
        className="reward-moment-card"
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti */}
        <div className="confetti-container">
          {CONFETTI_COLORS.map((color, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                background: color,
                left: `${(i / 12) * 100}%`,
                top: 0,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
          onClick={onClose}
        >
          <XIcon size={16} />
        </button>

        {/* Check icon */}
        <CheckCircle size={40} style={{ color: catColor }} className="mx-auto" />

        <div className="reward-moment-label">Claimed!</div>

        <div className="reward-moment-amount" style={{ color: catColor }}>
          {displayAmount.toFixed(4)}
        </div>
        <div
          className="wc-mono text-sm font-bold uppercase tracking-widest mt-1"
          style={{ color: catColor }}
        >
          {ticker}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-center">
          <button
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg wc-mono uppercase tracking-wide transition-colors"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
            onClick={() => setShowShare(s => !s)}
          >
            <Share2 size={12} /> Share
          </button>
          <button
            className="px-4 py-2 text-xs font-medium rounded-lg wc-mono uppercase tracking-wide text-gray-500 hover:text-white transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Share links */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              className="share-links"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
            >
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
              >
                X / Twitter
              </a>
              <a
                href={farcasterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-btn-purple"
              >
                Farcaster
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
