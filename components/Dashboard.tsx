import { getPurrPrice } from '@/lib/api/dexscreener'
import { getTokenStats } from '@/lib/api/blockscout'
import { WILL_TOKEN } from '@/lib/contracts'
import PriceTicker from './PriceTicker'
import CatWeightChart from './CatWeightChart'

export default async function Dashboard() {
  const [price, tokenStats] = await Promise.all([
    getPurrPrice(),
    getTokenStats(WILL_TOKEN),
  ])

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl space-y-3">
        {/* Stonkbrokers-style stat cards — 2×2 on mobile, 4 across on md */}
        <div className="grid grid-cols-2 gap-px md:grid-cols-4 bg-wc-border border border-wc-border">
          {[
            { value: `$${parseFloat(price.price).toExponential(3)}`, label: 'Price', sub: '$PURR / WETH' },
            {
              value: `${price.priceChange24h >= 0 ? '+' : ''}${price.priceChange24h.toFixed(2)}%`,
              label: '24h Change',
              sub: 'vs yesterday',
            },
            { value: tokenStats.holders.toLocaleString(), label: 'Holders', sub: '$WILL wallets' },
            {
              value: price.volume24h >= 1000 ? `$${(price.volume24h / 1000).toFixed(1)}K` : `$${price.volume24h.toFixed(2)}`,
              label: 'Volume 24h',
              sub: 'DEX activity',
            },
          ].map(card => (
            <div key={card.label} className="bg-wc-card p-4 text-center">
              <div className="wc-mono text-xl font-bold text-wc-text">{card.value}</div>
              <div className="wc-mono wc-upper text-[10px] font-bold text-wc-green mt-1">{card.label}</div>
              <div className="text-wc-muted text-[10px] mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Auto-refresh price strip */}
        <PriceTicker initial={price} />

        {/* Cat weight chart */}
        <CatWeightChart holdersCount={tokenStats.holders} />
      </div>
    </div>
  )
}
