import { getPurrPrice } from '@/lib/api/dexscreener'
import { getTokenStats } from '@/lib/api/blockscout'
import { WILL_TOKEN } from '@/lib/contracts'
import PriceTicker from './PriceTicker'
import CatWeightChart from './CatWeightChart'

function formatPrice(p: number): string {
  if (!p) return '—'
  // Show enough decimal places to see 2–3 significant figures
  if (p < 1e-9) return `<$0.000000001`
  if (p < 0.01) {
    const s = p.toFixed(12).replace(/0+$/, '').replace(/\.$/, '')
    return `$${s}`
  }
  if (p < 1) return `$${p.toFixed(4)}`
  return `$${p.toLocaleString('en', { maximumFractionDigits: 2 })}`
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(2)}`
}

export default async function Dashboard() {
  const [price, tokenStats] = await Promise.all([
    getPurrPrice(),
    WILL_TOKEN ? getTokenStats(WILL_TOKEN) : Promise.resolve({ holders: 0, transfers: 0, totalSupply: '0' }),
  ])

  const up = price.priceChange24h >= 0

  const CARDS = [
    {
      value: formatPrice(parseFloat(price.price)),
      label: 'Price',
      sub: '$PURR / WETH',
      accent: true,
      delay: '0ms',
    },
    {
      value: `${up ? '+' : ''}${price.priceChange24h.toFixed(2)}%`,
      label: '24h Change',
      sub: 'vs yesterday',
      accent: false,
      up,
      delay: '80ms',
    },
    {
      value: tokenStats.holders.toLocaleString(),
      label: 'Holders',
      sub: '$WILL wallets',
      accent: false,
      delay: '160ms',
    },
    {
      value: formatVolume(price.volume24h),
      label: 'Volume 24h',
      sub: 'DEX activity',
      accent: false,
      delay: '240ms',
    },
  ]

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl space-y-3">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className="glass-card glass-card-hover p-4 text-center glow-green"
              style={{
                animation: `counter-up 0.5s ease-out ${card.delay} both`,
              }}
            >
              <div
                className="text-xl font-black leading-none"
                style={{
                  color: card.accent
                    ? '#CCFF00'
                    : card.up === true
                    ? '#4ade80'
                    : card.up === false
                    ? '#f87171'
                    : '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {card.value}
              </div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mt-1.5"
                style={{ color: 'rgba(204,255,0,0.7)' }}
              >
                {card.label}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">{card.sub}</div>
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
