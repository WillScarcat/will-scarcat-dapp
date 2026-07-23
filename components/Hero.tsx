import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LivePing } from './LivePing'

const BADGES = [
  { label: '● LIVE', accent: true },
  { label: 'CATS' },
  { label: 'PURR · ROBINHOOD CHAIN' },
]

export default function Hero() {

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-10 pb-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">

        {/* Left — text (60%) */}
        <div className="min-w-0">
          {/* Chain label */}
          <div className="flex items-center gap-2 mb-6">
            <LivePing />
            <span className="text-[11px] font-medium tracking-widest uppercase text-gray-500">
              Robinhood Chain · 4663
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-title font-black leading-[0.92] tracking-[-0.04em] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            <span className="text-white block">THE WILL</span>
            <span className="block text-glow" style={{ color: '#CCFF00' }}>SCARCAT</span>
            <span className="text-white block">TERMINAL</span>
          </h1>

          {/* Badge pills */}
          <div className="flex flex-wrap gap-2 mb-7">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
                style={{
                  border: `1px solid ${b.accent ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: b.accent ? '#CCFF00' : 'rgba(255,255,255,0.5)',
                  background: b.accent ? 'rgba(204,255,0,0.06)' : 'transparent',
                }}
              >
                {b.label}
              </span>
            ))}
          </div>

          {/* Sub-text */}
          <p className="text-gray-400 font-light mb-8 leading-relaxed max-w-md" style={{ fontSize: '18px' }}>
            Hold $WILL, choose your cat faction, earn dividends from every swap.
            CashCat auto-distributes if you don&apos;t pick.
          </p>

          {/* CA box — deploying soon */}
          <div className="glass-card flex items-center mb-8 max-w-md overflow-hidden">
            <span
              className="wc-mono text-[10px] font-bold uppercase tracking-widest px-3 py-2.5 shrink-0"
              style={{
                color: 'rgba(204,255,0,0.5)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              $WILL CA
            </span>
            <span className="wc-mono text-[10px] text-gray-600 px-3 flex-1 italic">
              Deploying Soon
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dapp"
              className="flex items-center justify-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-wide text-black transition-all hover:bg-white hover:scale-[1.02]"
              style={{ background: '#CCFF00' }}
            >
              Launch dApp <ArrowRight size={14} />
            </Link>
            <a
              href="#how-to-buy"
              className="flex items-center justify-center px-8 py-4 text-sm font-medium uppercase tracking-wide text-white transition-all hover:border-white/30"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              How to Buy
            </a>
          </div>
        </div>

        {/* Right — logo (40%) */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-110 opacity-20"
              style={{ background: '#CCFF00' }}
            />
            <img
              src="/images/willlogo.jpg"
              alt="Will Scarcat"
              className="relative w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full object-cover"
              style={{ border: '2px solid rgba(204,255,0,0.2)' }}
            />
          </div>

          {/* Mini stat strip */}
          <div
            className="grid grid-cols-3 w-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { value: 'PURR', label: 'Token', sub: '$WILL' },
              { value: '4663', label: 'Chain', sub: 'Robinhood' },
              { value: '∞', label: 'Factions', sub: 'Growing' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="p-3 text-center"
                style={{
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div className="font-bold text-white text-lg leading-none">{s.value}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: '#CCFF00' }}>{s.label}</div>
                <div className="text-[9px] text-gray-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
