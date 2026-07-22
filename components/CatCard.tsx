'use client'

import { useState } from 'react'
import Image from 'next/image'
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
      className="relative border bg-wc-card p-4 transition-all duration-200 hover:border-wc-green/40"
      style={{
        borderColor: isSelected ? cat.color : '#2a2a2a',
        borderWidth: isSelected ? 2 : 1,
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
          className="h-12 w-12 overflow-hidden flex items-center justify-center border shrink-0"
          style={{ borderColor: cat.color + '44', background: cat.color + '0d' }}
        >
          {imgError ? (
            <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
          ) : (
            <Image
              src={cat.img}
              alt={cat.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div>
          <div className="font-bold text-wc-text text-sm">{cat.name}</div>
          <div className="wc-mono wc-upper text-[10px]" style={{ color: cat.color }}>
            ${cat.ticker}
          </div>
        </div>
      </div>

      {/* Weight bar */}
      {weightPct !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="wc-mono text-[9px] text-wc-muted wc-upper">Weight</span>
            <span className="wc-mono text-[9px]" style={{ color: cat.color }}>{weightPct}%</span>
          </div>
          <div className="h-0.5 bg-wc-border w-full">
            <div className="h-0.5 transition-all duration-700" style={{ width: `${weightPct}%`, background: cat.color }} />
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <>
          {claimable !== undefined && (
            <div className="mb-3 border border-wc-border px-3 py-2 text-xs bg-wc-black">
              <span className="wc-mono text-wc-muted wc-upper text-[9px]">Claimable </span>
              <span className="wc-mono text-wc-text">{claimable} {cat.ticker}</span>
            </div>
          )}

          <div className="flex gap-2">
            {!isSelected && onChoose && (
              <button
                onClick={onChoose}
                disabled={isChoosingPending}
                className="flex-1 py-1.5 text-[10px] font-bold wc-mono wc-upper transition-colors disabled:opacity-50 border"
                style={{ background: cat.color + '14', color: cat.color, borderColor: cat.color + '44' }}
              >
                {isChoosingPending ? 'Choosing…' : 'Choose'}
              </button>
            )}

            {onClaim && (
              <button
                onClick={onClaim}
                disabled={isClaimPending || !hasReward}
                className="flex-1 py-1.5 text-[10px] font-bold wc-mono wc-upper bg-wc-green text-black transition-colors disabled:opacity-40 hover:bg-[#b8e600]"
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
