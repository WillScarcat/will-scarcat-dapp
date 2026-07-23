'use client'

import { motion } from 'framer-motion'
import { Cat, AlertTriangle, Wifi } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type Variant = 'no-wallet' | 'wrong-network' | 'no-cat'

interface EmptyStateProps {
  variant: Variant
  onAction?: () => void
}

const ENTER = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
}

const ICON_PULSE = {
  animate:    { scale: [1, 1.05, 1] },
  transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
}

export default function EmptyState({ variant, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 py-20 text-center px-6"
      {...ENTER}
    >
      {variant === 'no-wallet' && (
        <>
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ background: 'rgba(204,255,0,0.07)', border: '1px solid rgba(204,255,0,0.15)' }}
            {...ICON_PULSE}
          >
            <Cat size={28} style={{ color: '#CCFF00' }} />
          </motion.div>

          <div>
            <p className="font-bold text-white text-lg mb-1">Connect Your Wallet</p>
            <p className="wc-mono text-[11px] uppercase tracking-wider max-w-[220px]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Pick a cat faction and earn block rewards automatically
            </p>
          </div>

          <ConnectButton label="Connect Wallet" />

          <p className="wc-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No wallet? Just hold $WILL — CashCat auto-distributes.
          </p>
        </>
      )}

      {variant === 'wrong-network' && (
        <>
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Wifi size={28} style={{ color: '#f59e0b' }} />
          </motion.div>

          <div>
            <p className="wc-mono font-bold text-sm uppercase tracking-widest mb-2"
              style={{ color: '#f59e0b' }}>
              Wrong Network
            </p>
            <p className="text-white font-semibold mb-1">Switch to Robinhood Chain</p>
            <p className="wc-mono text-[10px] uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Chain ID: 4663
            </p>
          </div>

          <button
            onClick={onAction}
            className="px-7 py-3 font-black text-sm wc-mono uppercase tracking-wider rounded-[10px] transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: '#CCFF00', color: '#0f0f12' }}
          >
            Switch Network
          </button>

          <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
        </>
      )}

      {variant === 'no-cat' && (
        <>
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            {...ICON_PULSE}
          >
            <AlertTriangle size={28} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </motion.div>

          <div>
            <p className="font-bold text-white text-base mb-1">No Faction Chosen</p>
            <p className="wc-mono text-[11px] uppercase tracking-wider max-w-[240px]"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              CashCat distributes rewards by default. Choose a cat to start tracking.
            </p>
          </div>

          {onAction && (
            <button
              onClick={onAction}
              className="px-6 py-2.5 font-black text-xs wc-mono uppercase tracking-wider rounded-[10px] transition-all hover:brightness-110 active:scale-[0.97]"
              style={{
                background: 'rgba(204,255,0,0.08)',
                color: '#CCFF00',
                border: '1px solid rgba(204,255,0,0.2)',
              }}
            >
              Browse Cats →
            </button>
          )}
        </>
      )}
    </motion.div>
  )
}
