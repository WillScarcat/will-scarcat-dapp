import Hero from '@/components/Hero'
import PickYourCat from '@/components/PickYourCat'
import Dashboard from '@/components/Dashboard'
import LiveFeed from '@/components/LiveFeed'
import { SectionDivider } from '@/components/SectionDivider'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WILL_TOKEN } from '@/lib/contracts'

export default function Home() {
  return (
    <>
      <Hero />

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
            { step: '03', title: 'Buy $WILL', desc: `CA: ${WILL_TOKEN.slice(0, 10)}…${WILL_TOKEN.slice(-6)} — swap on any Robinhood DEX.` },
            { step: '04', title: 'Pick Your Cat', desc: 'Connect on /dapp, choose your faction, start earning.' },
          ].map(item => (
            <div key={item.step} className="flex gap-4 border border-wc-border bg-wc-card p-4">
              <div className="w-9 h-9 shrink-0 border border-wc-green flex items-center justify-center">
                <span className="wc-mono font-bold text-sm text-wc-green">{item.step}</span>
              </div>
              <div>
                <div className="wc-mono wc-upper font-bold text-xs text-wc-text mb-1">{item.title}</div>
                <div className="text-wc-muted text-[11px] leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 border-t border-wc-border text-center">
        <div className="wc-mono wc-upper text-[10px] text-wc-muted mb-4 tracking-[0.3em]">Ready to play?</div>
        <Link
          href="/dapp"
          className="inline-flex items-center gap-2 bg-wc-green text-black px-10 py-4 font-bold text-sm wc-mono wc-upper hover:bg-[#b8e600] transition-colors"
        >
          Launch dApp <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="border-t border-wc-border py-6 px-4 text-center wc-mono text-[10px] text-wc-muted wc-upper tracking-widest">
        Will Scarcat · Robinhood Chain · 4663
      </footer>
    </>
  )
}
