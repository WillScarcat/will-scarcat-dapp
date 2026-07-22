import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import PickYourCat from '@/components/PickYourCat'
import Dashboard from '@/components/Dashboard'
import LiveFeed from '@/components/LiveFeed'
import { SectionDivider } from '@/components/SectionDivider'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <SectionDivider label="Token Stats" />
      <Dashboard />

      <SectionDivider label="Pick Your Cat" />
      <PickYourCat />

      <SectionDivider label="Live Rewards" />
      <LiveFeed />

      <SectionDivider label="How It Works" />
      <section id="how-to-buy" className="px-4 pb-16">
        <div className="mx-auto max-w-2xl space-y-2">
          {[
            { step: '01', title: 'Add Robinhood Chain', desc: 'Chain ID 4663 · RPC: rpc.mainnet.chain.robinhood.com' },
            { step: '02', title: 'Bridge ETH', desc: 'Bridge ETH to Robinhood Chain via the official bridge.' },
            { step: '03', title: 'Buy $WILL', desc: 'CA deploying soon — swap on any Robinhood DEX once live.' },
            { step: '04', title: 'Pick Your Cat', desc: 'Connect on /dapp, choose your faction, start earning.' },
          ].map(item => (
            <div
              key={item.step}
              className="glass-card flex gap-4 p-4"
            >
              <div
                className="w-9 h-9 shrink-0 flex items-center justify-center"
                style={{ border: '1px solid rgba(204,255,0,0.3)' }}
              >
                <span className="wc-mono font-bold text-sm" style={{ color: '#CCFF00' }}>{item.step}</span>
              </div>
              <div>
                <div className="font-bold text-sm text-white mb-1 uppercase tracking-wide">{item.title}</div>
                <div className="text-gray-500 text-[11px] leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="py-16 px-4 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 mb-4">
          Ready to play?
        </div>
        <Link
          href="/dapp"
          className="inline-flex items-center gap-2 px-10 py-4 font-black text-sm uppercase tracking-wide text-black transition-all hover:bg-white hover:scale-[1.02]"
          style={{ background: '#CCFF00' }}
        >
          Launch dApp <ArrowRight size={14} />
        </Link>
      </section>

      <footer
        className="py-6 px-4 text-center text-[10px] font-medium uppercase tracking-widest text-gray-700"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        Will Scarcat · Robinhood Chain · 4663
      </footer>
    </>
  )
}
