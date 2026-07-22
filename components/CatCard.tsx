'use client'

import { useState } from 'react'
import { Cat as CatIcon } from 'lucide-react'
import type { Cat } from '@/lib/contracts'

type Props = {
  cat: Cat
  isSelected?: boolean
  claimable?: string
  weightPct?: number
  onChoose?: () => void
  onClaim?: () => void
  isChoosingPending?: boolean
  isClaimPending?: boolean
  showActions?: boolean
}

export default function CatCard({
  cat,
  isSelected,
  claimable,
  weightPct,
  onChoose,
  onClaim,
  isChoosingPending,
  isClaimPending,
  showActions = false,
}: Props) {
  const [imgError, setImgError] = useState(false)
  const hasReward = claimable && parseFloat(claimable) > 0

  return (
    <div
      className="glass-card glass-card-hover relative p-4 transition-all duration-200"
      style={{
        borderColor: isSelected ? cat.color : 'rgba(255,255,255,0.08)',
        borderWidth: isSelected ? 2 : 1,
        boxShadow: isSelected ? `0 0 20px ${cat.color}22` : undefined,
      }}
    >
      {/* CHOSEN badge */}
      {isSelected && (
        <div className="absolute -top-px -right-px">
          <span className="wc-badge wc-badge-green" style={{ borderColor: cat.color, color: cat.color }}>
            CHOSEN
          </span>
        </div>
      )}

      {/* Avatar + name */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="h-12 w-12 overflow-hidden flex items-center justify-center shrink-0 rounded-xl"
          style={{
            border: `1px solid rgba(255,255,255,0.1)`,
            background: cat.color + '0d',
          }}
        >
          {imgError ? (
            <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
          ) : (
            <img
              src={cat.img}
              alt={cat.name}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{cat.name}</div>
          <div className="wc-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: cat.color }}>
            ${cat.ticker}
          </div>
        </div>
      </div>

      {/* Weight bar */}
      {weightPct !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">Weight</span>
            <span className="text-[9px] font-bold" style={{ color: cat.color }}>{weightPct}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${weightPct}%`, background: cat.color }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <>
          {claimable !== undefined && (
            <div
              className="mb-3 px-3 py-2 text-xs"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">Claimable </span>
              <span className="wc-mono text-white text-[11px]">{claimable} {cat.ticker}</span>
            </div>
          )}

          <div className="flex gap-2">
            {!isSelected && onChoose && (
              <button
                onClick={onChoose}
                disabled={isChoosingPending}
                className="flex-1 py-1.5 text-[10px] font-bold wc-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                style={{
                  background: cat.color + '14',
                  color: cat.color,
                  border: `1px solid ${cat.color}33`,
                }}
              >
                {isChoosingPending ? 'Choosing…' : 'Choose'}
              </button>
            )}

            {onClaim && (
              <button
                onClick={onClaim}
                disabled={isClaimPending || !hasReward}
                className="flex-1 py-1.5 text-[10px] font-black wc-mono uppercase tracking-wider text-black transition-all disabled:opacity-40 hover:scale-[1.02]"
                style={{ background: '#CCFF00' }}
              >
                {isClaimPending ? 'Claiming…' : `Claim ${cat.ticker}`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
