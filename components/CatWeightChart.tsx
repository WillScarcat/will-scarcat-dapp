'use client'

import { useCatStats } from '@/lib/hooks/useCatStats'

export default function CatWeightChart({ holdersCount }: { holdersCount: number }) {
  const { stats, isLoading } = useCatStats()

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Cat Weight</span>
        <span className="text-[10px] text-gray-600">{holdersCount.toLocaleString()} holders</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded animate-pulse"
              style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {stats.map(({ cat, pct }) => (
            <div key={cat.id} className="flex items-center gap-3">
              <div
                className="w-16 text-[10px] font-bold uppercase tracking-widest shrink-0"
                style={{ color: cat.color }}
              >
                {cat.ticker}
              </div>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%`, background: cat.color }}
                />
              </div>
              <div className="w-8 text-right text-[10px] font-bold text-gray-500 shrink-0">{pct}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
