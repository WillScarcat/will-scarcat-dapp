'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cat as CatIcon, Check } from 'lucide-react'
import type { Cat } from '@/lib/contracts'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { ClaimButton, type ClaimState } from './ClaimButton'

export type CardVariant = 'grid' | 'list' | 'expanded'

type Props = {
  cat: Cat
  /** Default: auto (list on mobile, grid on desktop) */
  variant?: CardVariant
  isSelected?: boolean
  claimable?: string
  weightPct?: number
  holders?: number
  onChoose?: () => void
  onClaim?: () => void
  isChoosingPending?: boolean
  claimState?: ClaimState
  showActions?: boolean
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 22 }

function CatAvatar({ cat, size }: { cat: Cat; size: number }) {
  const [err, setErr] = useState(false)
  return (
    <div
      className="shrink-0 overflow-hidden flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size >= 80 ? 20 : size >= 56 ? 14 : 10,
        border: '1px solid rgba(255,255,255,0.1)',
        background: cat.color + '12',
      }}
    >
      {err ? (
        <CatIcon style={{ color: cat.color, width: size * 0.5, height: size * 0.5 }} />
      ) : (
        <img
          src={cat.img}
          alt={cat.name}
          className="object-cover w-full h-full"
          onError={() => setErr(true)}
        />
      )}
    </div>
  )
}

function WeightBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

/* ── GRID variant (desktop default) ─────────────────────────── */
function CatCardGrid({
  cat, isSelected, claimable, weightPct, onChoose, onClaim,
  isChoosingPending, claimState = 'idle', showActions,
}: Props) {
  const hasReward = Boolean(claimable && parseFloat(claimable) > 0)

  return (
    <div
      className={['cat-glass cat-tilt cat-card-wrapper relative p-4', `ambient-${cat.id}`, isSelected ? 'cat-selected' : ''].join(' ')}
      style={{
        border: isSelected ? `2px solid ${cat.color}` : undefined,
        touchAction: 'manipulation',
        '--cat-color': cat.color,
      } as React.CSSProperties}
    >
      {isSelected && (
        <motion.div className="absolute -top-px -right-px" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING}>
          <span className="wc-badge" style={{ borderColor: cat.color, color: cat.color }}>CHOSEN</span>
        </motion.div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <CatAvatar cat={cat} size={48} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm leading-tight">{cat.name}</div>
          <div className="wc-mono text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: cat.color }}>
            ${cat.ticker}
          </div>
          {weightPct !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">Weight</span>
                <span className="text-[9px] font-bold" style={{ color: cat.color }}>{weightPct}%</span>
              </div>
              <WeightBar pct={weightPct} color={cat.color} />
            </div>
          )}
          {showActions && claimable !== undefined && (
            <div className="mt-2 px-2 py-1.5 text-xs rounded-md" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">Claimable </span>
              <span className="wc-mono text-white text-[11px]">{claimable} {cat.ticker}</span>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 cat-buttons">
          {!isSelected && onChoose && (
            <motion.button
              onClick={onChoose}
              disabled={isChoosingPending}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
              className="btn-choose flex-1 py-1.5 text-[10px] font-bold wc-mono uppercase tracking-wider disabled:opacity-50"
              style={{ background: cat.color + '14', color: cat.color, border: `1px solid ${cat.color}33`, borderRadius: 8 }}
            >
              {isChoosingPending ? 'Choosing…' : 'Choose'}
            </motion.button>
          )}
          {onClaim && (
            <ClaimButton
              ticker={cat.ticker}
              catColor={cat.color}
              claimState={claimState}
              hasReward={hasReward}
              onClick={onClaim}
              variant="card"
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ── LIST variant (mobile horizontal) ───────────────────────── */
function CatCardList({
  cat, isSelected, claimable, weightPct, onChoose, onClaim,
  isChoosingPending, claimState = 'idle', showActions,
}: Props) {
  const hasReward = Boolean(claimable && parseFloat(claimable) > 0)

  return (
    <div
      className={['relative flex items-center gap-3 p-3', `ambient-${cat.id}`].join(' ')}
      style={{
        background: isSelected ? `${cat.color}08` : 'rgba(255,255,255,0.02)',
        border: isSelected ? `1px solid ${cat.color}33` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        '--cat-color': cat.color,
      } as React.CSSProperties}
    >
      {/* Avatar */}
      <CatAvatar cat={cat} size={48} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-white text-sm leading-tight truncate">{cat.name}</span>
          {isSelected && <Check size={11} strokeWidth={3} style={{ color: cat.color, flexShrink: 0 }} />}
        </div>
        <div className="wc-mono text-[9px] font-bold tracking-widest uppercase" style={{ color: cat.color }}>
          ${cat.ticker}
        </div>
        {weightPct !== undefined && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1">
              <WeightBar pct={weightPct} color={cat.color} />
            </div>
            <span className="wc-mono text-[9px] font-bold shrink-0" style={{ color: cat.color }}>{weightPct}%</span>
          </div>
        )}
      </div>

      {/* Claimable */}
      {showActions && claimable !== undefined && (
        <div className="text-right shrink-0 mr-1">
          <div className="wc-mono text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Claim</div>
          <div className="wc-mono text-xs font-bold" style={{ color: hasReward ? '#CCFF00' : 'rgba(255,255,255,0.25)' }}>
            {hasReward ? parseFloat(claimable!).toFixed(3) : '—'}
          </div>
        </div>
      )}

      {/* Action */}
      {showActions && (
        <div className="shrink-0">
          {!isSelected && onChoose ? (
            <motion.button
              onClick={onChoose}
              disabled={isChoosingPending}
              whileTap={{ scale: 0.93 }}
              className="w-8 h-8 flex items-center justify-center rounded-lg wc-mono text-[9px] font-black uppercase disabled:opacity-40"
              style={{ background: cat.color + '16', border: `1px solid ${cat.color}33`, color: cat.color }}
            >
              +
            </motion.button>
          ) : onClaim ? (
            <ClaimButton
              ticker=""
              catColor={cat.color}
              claimState={claimState}
              hasReward={hasReward}
              onClick={onClaim}
              variant="card"
            />
          ) : null}
        </div>
      )}
    </div>
  )
}

/* ── EXPANDED variant (bottom sheet / detail view) ──────────── */
function CatCardExpanded({
  cat, isSelected, claimable, weightPct, holders, onChoose, onClaim,
  isChoosingPending, claimState = 'idle',
}: Props) {
  const hasReward = Boolean(claimable && parseFloat(claimable) > 0)

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Hero avatar */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      >
        <CatAvatar cat={cat} size={96} />
      </motion.div>

      {/* Name + ticker */}
      <div className="text-center">
        <div className="font-bold text-white text-xl leading-tight">{cat.name}</div>
        <div className="wc-mono text-xs font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: cat.color }}>
          ${cat.ticker}
        </div>
      </div>

      {/* 3-stat row */}
      <div className="w-full grid grid-cols-3 gap-2">
        {[
          { label: 'HOLDERS', value: holders != null ? holders.toLocaleString() : '—' },
          { label: 'WEIGHT',  value: weightPct != null ? `${weightPct}%` : '—' },
          { label: 'CLAIM',   value: hasReward ? parseFloat(claimable!).toFixed(3) : '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="wc-mono text-[8px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
            <span className="wc-mono font-bold text-sm text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Weight bar */}
      {weightPct !== undefined && (
        <div className="w-full">
          <div className="flex justify-between mb-1.5">
            <span className="wc-mono text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Pool Weight</span>
            <span className="wc-mono text-[9px] font-bold" style={{ color: cat.color }}>{weightPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: cat.color }}
              initial={{ width: 0 }}
              animate={{ width: `${weightPct}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {!isSelected && onChoose ? (
        <motion.button
          onClick={onChoose}
          disabled={isChoosingPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="w-full py-4 font-black text-sm wc-mono uppercase tracking-wider rounded-[12px] disabled:opacity-50 mt-1"
          style={{ background: cat.color, color: '#0f0f12' }}
        >
          {isChoosingPending ? 'Joining…' : `Join ${cat.name} Faction`}
        </motion.button>
      ) : isSelected && onClaim ? (
        <ClaimButton
          ticker={cat.ticker}
          catColor={cat.color}
          claimState={claimState}
          hasReward={hasReward}
          onClick={onClaim}
          variant="full"
        />
      ) : isSelected ? (
        <div className="w-full py-3 text-center wc-mono text-xs font-bold uppercase tracking-wider rounded-[10px]"
          style={{ background: `${cat.color}12`, color: cat.color, border: `1px solid ${cat.color}33` }}>
          ✓ Your Active Faction
        </div>
      ) : null}
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export default function CatCard(props: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const resolved: CardVariant = props.variant ?? (isMobile ? 'list' : 'grid')

  if (resolved === 'list')     return <CatCardList     {...props} />
  if (resolved === 'expanded') return <CatCardExpanded {...props} />
  return <CatCardGrid {...props} />
}
