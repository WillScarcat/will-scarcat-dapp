'use client'

import { useState } from 'react'
import { Cat as CatIcon } from 'lucide-react'
import type { Cat } from '@/lib/contracts'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

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
  const isMobile = useMediaQuery('(max-width: 768px)')
  const hasReward = claimable && parseFloat(claimable) > 0

  return (
    <div
      className={[
        'cat-glass cat-tilt cat-card-wrapper relative p-4',
        `ambient-${cat.id}`,
        isSelected ? 'cat-selected' : '',
      ].join(' ')}
      style={{
        border: isSelected ? `2px solid ${cat.color}` : undefined,
        touchAction: 'manipulation',
        '--cat-color': cat.color,
      } as React.CSSProperties}
    >
      {/* CHOSEN badge */}
      {isSelected && (
        <div className="absolute -top-px -right-px">
          <span className="wc-badge wc-badge-green" style={{ borderColor: cat.color, color: cat.color }}>
            CHOSEN
          </span>
        </div>
      )}

      {/* Avatar + info row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div
          className="cat-img h-12 w-12 shrink-0 overflow-hidden flex items-center justify-center rounded-xl"
          style={{ border: `1px solid rgba(255,255,255,0.1)`, background: cat.color + '0d' }}
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

        {/* Info */}
        <div className="cat-info flex-1 min-w-0">
          <div className="cat-name font-semibold text-white text-sm leading-tight">{cat.name}</div>
          <div
            className="cat-ticker wc-mono text-[10px] font-bold tracking-widest uppercase mb-2"
            style={{ color: cat.color }}
          >
            ${cat.ticker}
          </div>

          {/* Weight bar — inside info column */}
          {weightPct !== undefined && (
            <div>
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

          {/* Claimable — inside info column */}
          {showActions && claimable !== undefined && (
            <div
              className="mt-2 px-2 py-1.5 text-xs"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">Claimable </span>
              <span className="wc-mono text-white text-[11px]">{claimable} {cat.ticker}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div
          className="flex gap-2 cat-buttons"
          style={isMobile ? { opacity: 1, transform: 'translateY(0)' } : undefined}
        >
          {!isSelected && onChoose && (
            <button
              onClick={onChoose}
              disabled={isChoosingPending}
              className="btn-choose flex-1 py-1.5 text-[10px] font-bold wc-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              style={{ background: cat.color + '14', color: cat.color, border: `1px solid ${cat.color}33` }}
            >
              {isChoosingPending ? 'Choosing…' : 'Choose'}
            </button>
          )}

          {onClaim && (
            <button
              onClick={onClaim}
              disabled={isClaimPending || !hasReward}
              className="btn-claim flex-1 py-1.5 text-[10px] font-black wc-mono uppercase tracking-wider text-black transition-all disabled:opacity-40 hover:scale-[1.02]"
              style={{ background: '#CCFF00' }}
            >
              {isClaimPending ? 'Claiming…' : `Claim ${cat.ticker}`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
