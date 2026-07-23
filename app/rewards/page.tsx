import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RewardsScrollFlow } from '@/components/RewardsScrollFlow'

const FLOW = [
  { label: 'SWAP', sub: 'DEX Trade' },
  { label: '5% TAX', sub: 'Captured' },
  { label: 'TRACKER', sub: 'Smart Contract' },
  { label: 'YOUR CAT', sub: 'Faction Pool' },
  { label: 'WALLET', sub: 'Your ETH' },
]


export default function RewardsPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Mechanics
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            How Rewards<br />
            <span style={{ color: '#CCFF00' }}>Work</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            $WILL is a dividend-distributing token. Every swap generates yield — routed to
            your chosen cat faction, claimable at any time.
          </p>
        </div>

        {/* Animated flow diagram */}
        <div className="mb-10 glass-card px-5 py-6 overflow-x-auto">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: 'rgba(204,255,0,0.5)' }}>
            Reward Flow
          </div>
          <div className="flex items-center gap-0 min-w-max">
            {FLOW.map((node, i) => (
              <div key={node.label} className="flex items-center">
                {/* Node */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="px-3 py-2 text-center"
                    style={{
                      border: '1px solid rgba(204,255,0,0.25)',
                      background: 'rgba(204,255,0,0.06)',
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    <div
                      className="wc-mono text-[11px] font-black tracking-widest whitespace-nowrap"
                      style={{ color: '#CCFF00' }}
                    >
                      {node.label}
                    </div>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-600 whitespace-nowrap">
                    {node.sub}
                  </div>
                </div>

                {/* Arrow connector */}
                {i < FLOW.length - 1 && (
                  <div className="flex items-center mx-1 mb-4">
                    <div className="relative w-8 h-px" style={{ background: 'rgba(204,255,0,0.2)' }}>
                      <div
                        className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-px"
                        style={{
                          background: '#CCFF00',
                          animation: `flow-pulse 2s ease-in-out ${i * 0.4}s infinite`,
                        }}
                      />
                    </div>
                    <div
                      className="w-0 h-0"
                      style={{
                        borderTop: '3px solid transparent',
                        borderBottom: '3px solid transparent',
                        borderLeft: '5px solid rgba(204,255,0,0.4)',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <style>{`
            @keyframes flow-pulse {
              0%, 100% { opacity: 0.3; transform: translateY(-50%) translateX(0); }
              50% { opacity: 1; transform: translateY(-50%) translateX(24px); }
            }
          `}</style>
        </div>

        {/* Flow steps — GSAP ScrollTrigger animated */}
        <RewardsScrollFlow />

        {/* Key numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { value: '∞', label: 'Cat Factions', sub: 'Growing' },
            { value: '0%', label: 'Lock-up', sub: 'Claim any time' },
            { value: '∞', label: 'Switches', sub: 'No penalty' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="font-black text-3xl text-white mb-1" style={{ color: '#CCFF00' }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(204,255,0,0.7)' }}>{s.label}</div>
              <div className="text-gray-600 text-[10px]">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* CashCat default note */}
        <div className="glass-card p-5 mb-10" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#CCFF00' }}>
            Default: CashCat
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            If you hold $WILL without choosing a faction, your weight automatically routes to{' '}
            <strong className="text-white">CashCat</strong>. CashCat rewards are distributed
            proportionally to all CashCat-weighted holders. You don&apos;t lose anything by
            not picking — but picking lets you be part of a faction.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dapp"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 font-black text-sm uppercase tracking-wide text-black transition-all hover:bg-white hover:scale-[1.02]"
            style={{ background: '#CCFF00' }}
          >
            Claim Rewards <ArrowRight size={14} />
          </Link>
          <Link
            href="/cats"
            className="flex-1 flex items-center justify-center py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:text-[#CCFF00]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Pick a Cat
          </Link>
        </div>
      </div>
    </div>
  )
}
