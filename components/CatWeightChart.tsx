'use client'

import { useCatStats } from '@/lib/hooks/useCatStats'

export default function CatWeightChart({ holdersCount }: { holdersCount: number }) {
  const { stats, isLoading } = useCatStats()

  return (
    <div className="border border-wc-border bg-wc-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="wc-mono wc-upper text-[10px] font-bold text-wc-muted">Cat Weight</span>
        <span className="wc-mono text-[10px] text-wc-muted">{holdersCount.toLocaleString()} holders</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-wc-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map(({ cat, pct }) => (
            <div key={cat.id} className="flex items-center gap-3">
              <div className="w-16 wc-mono wc-upper text-[10px] shrink-0" style={{ color: cat.color }}>
                {cat.ticker}
              </div>
              <div className="flex-1 h-1 bg-wc-border overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: cat.color }}
                />
              </div>
              <div className="w-8 text-right wc-mono text-[10px] text-wc-muted shrink-0">{pct}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
