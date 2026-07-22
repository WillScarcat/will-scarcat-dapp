import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATS } from '@/lib/contracts'

const CAT_DESCRIPTIONS: Record<string, string> = {
  cashcat: 'The banker of Sherwood. Every transaction fills the vault — and CashCat makes sure no one leaves empty-handed. The default faction for all $WILL holders.',
  meow: 'The silent shadow. Strikes without warning. MEOW is the meme standard, the floor, the vibe — pure cat energy distilled into a ticker.',
  gmeow: 'The morning herald. First to arrive, last to leave. GMEOW is for the early risers who believe in the number going up and never sell at the bottom.',
  shibcat: 'The loyal hound-cat. Fierce but fair. SHIBCAT carries the spirit of the OG meme dog, reimagined with whiskers and claws on Robinhood Chain.',
  buffcat: 'The strongman of Sherwood. Lifts twice its weight in dividends. Gains-focused, protein-rich, and always in the gym — BUFFCAT never skips leg day.',
  applcat: 'The merchant cat. Trades in knowledge and fruit. Sleek, minimalist, and dangerously premium — APPLCAT is for the cats who just work.',
}

export default function CatsPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Will Scarcat
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            Pick Your<br />
            <span style={{ color: '#CCFF00' }}>Faction</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Each $WILL holder belongs to a cat faction. Your weight determines how dividends are distributed.
            Choose wisely — you can switch any time with no penalty.
          </p>
        </div>

        {/* Cat grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATS.map(cat => (
            <div
              key={cat.id}
              className="glass-card glass-card-hover flex flex-col"
            >
              {/* Cat image */}
              <div
                className="aspect-square relative overflow-hidden"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                {/* Ticker overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: 'linear-gradient(to top, rgba(15,15,18,0.9), transparent)' }}
                >
                  <span
                    className="wc-mono text-xs font-black uppercase tracking-widest"
                    style={{ color: cat.color }}
                  >
                    ${cat.ticker}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                  <div className="font-bold text-white text-base mb-1">{cat.name}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {CAT_DESCRIPTIONS[cat.id]}
                  </p>
                </div>

                {/* Contract */}
                <div
                  className="px-3 py-2 mt-auto"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Contract</div>
                  <div className="wc-mono text-[10px] text-gray-500">
                    {cat.address.slice(0, 10)}…{cat.address.slice(-6)}
                  </div>
                </div>

                <Link
                  href="/dapp"
                  className="flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-all hover:scale-[1.02]"
                  style={{ background: cat.color }}
                >
                  Choose {cat.ticker} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 glass-card px-5 py-4 text-center">
          <p className="text-gray-500 text-xs leading-relaxed">
            Not picking a cat? <span className="text-white font-semibold">CashCat</span> is the default —
            your dividends are distributed automatically. Connect your wallet on{' '}
            <Link href="/dapp" className="underline" style={{ color: '#CCFF00' }}>the Terminal</Link>{' '}
            to change your faction at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
