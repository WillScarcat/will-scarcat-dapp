'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type FaqItem = { q: string; a: string }

const FAQS: FaqItem[] = [
  {
    q: 'What is Will Scarcat?',
    a: 'Will Scarcat ($WILL) is a dividend-distributing meme token on Robinhood Chain (Chain ID 4663). Every time $WILL is bought or sold, a 5% tax is collected by the Tracker contract and redistributed to holders — routed to the cat faction you choose.',
  },
  {
    q: 'How do rewards work?',
    a: 'Every $WILL swap generates a 5% tax. The Tracker contract records each holder\'s weight (based on their $WILL balance and chosen faction) and accumulates dividends proportionally. You can claim your share any time — there\'s no lock-up period.',
  },
  {
    q: 'How do I pick a cat faction?',
    a: 'Connect your EVM wallet on the Terminal (/dapp), then click any cat card to select that faction. The dApp calls chooseCat() on the Tracker contract on your behalf. Your weight immediately routes to the chosen faction\'s reward pool.',
  },
  {
    q: 'How often can I claim rewards?',
    a: 'Any time — there is no minimum wait or cooldown. As long as you have unclaimed dividends, you can hit Claim on the Terminal and receive them instantly. Gas is paid in ETH on Robinhood Chain, which is very low.',
  },
  {
    q: 'Can I switch cats after picking one?',
    a: 'Yes, switching is completely free and has no penalty. You can change your cat faction as many times as you like by calling chooseCat() again. Your pending rewards from the previous faction are preserved and claimable separately.',
  },
  {
    q: 'Is there a minimum $WILL balance to earn rewards?',
    a: 'No minimum. Any wallet holding $WILL earns rewards proportional to their share of the total supply. Even small holders accumulate dividends from every swap. The only requirement is that you hold $WILL at the time of the swap.',
  },
  {
    q: 'Has the contract been audited?',
    a: 'The smart contracts are currently deploying. Audit details and the full audit report will be published in this Docs section once available. We prioritize transparency — all contracts will be verified on Blockscout before trading opens.',
  },
  {
    q: 'How is the liquidity pool managed?',
    a: 'The LP is locked at launch. A portion of the initial supply is paired with ETH and deposited to a Robinhood Chain DEX. The LP lock certificate will be linked in the Docs once contracts are live. Dev team holds no unlocked LP.',
  },
  {
    q: 'Who are the devs?',
    a: 'Will Scarcat is a community-driven project launched on Robinhood Chain. The team is pseudonymous — we let the code speak. All contracts are open-source and verified on-chain. Community members can verify every function call on Blockscout.',
  },
]

function FaqRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="glass-card overflow-hidden transition-all duration-200"
      style={{ borderColor: open ? 'rgba(204,255,0,0.15)' : undefined }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="font-semibold text-sm text-white leading-snug">{item.q}</span>
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: open ? '#CCFF00' : '#4b5563',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div
          className="px-5 pb-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-gray-400 text-xs leading-relaxed pt-4">{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Will Scarcat
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            FAQ
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Common questions about $WILL, cat factions, rewards, and how everything fits together.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <FaqRow
              key={i}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div
          className="mt-8 glass-card px-5 py-5 text-center"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
            Still have questions?
          </div>
          <p className="text-xs text-gray-500">
            Join the community — all contract interactions are public on{' '}
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              style={{ color: '#CCFF00' }}
            >
              Blockscout
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
