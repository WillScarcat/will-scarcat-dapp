'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { PriceData } from '@/lib/api/dexscreener'
import { fetchPurrPriceClient } from '@/lib/api/dexscreener'
import { LivePing } from './LivePing'

type Props = { initial: PriceData }

export default function PriceTicker({ initial }: Props) {
  const [data, setData] = useState<PriceData>(initial)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const id = setInterval(async () => {
      const fresh = await fetchPurrPriceClient()
      setData(fresh)
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  const up = data.priceChange24h >= 0
  const ChangeIcon = up ? TrendingUp : TrendingDown

  return (
    <div className="border border-wc-border bg-wc-card px-3 py-2 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1.5">
        <LivePing />
        <span className="wc-mono text-[9px] text-wc-muted wc-upper">Live · 30s</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="wc-mono text-[9px] text-wc-muted wc-upper">Price</span>
        <span className={`wc-mono text-xs font-bold text-wc-text transition-colors ${pulse ? 'text-wc-green' : ''}`}>
          ${parseFloat(data.price).toFixed(12).replace(/\.?0+$/, '') || '0'}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ChangeIcon size={11} className={up ? 'text-green-400' : 'text-red-400'} />
        <span className={`wc-mono text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
          {up ? '+' : ''}{data.priceChange24h.toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="wc-mono text-[9px] text-wc-muted wc-upper">Liq</span>
        <span className="wc-mono text-xs text-wc-text">
          {data.liquidity >= 1000 ? `$${(data.liquidity / 1000).toFixed(1)}K` : `$${data.liquidity.toFixed(0)}`}
        </span>
      </div>
    </div>
  )
}
