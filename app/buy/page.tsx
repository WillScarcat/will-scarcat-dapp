import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { WILL_TOKEN } from '@/lib/contracts'

const STEPS = [
  {
    step: '01',
    title: 'Add Robinhood Chain',
    body: 'Add Robinhood Chain to MetaMask or any EVM wallet.',
    details: [
      { label: 'Network Name', value: 'Robinhood Chain' },
      { label: 'Chain ID', value: '4663' },
      { label: 'RPC URL', value: 'https://rpc.mainnet.chain.robinhood.com' },
      { label: 'Currency Symbol', value: 'ETH' },
      { label: 'Explorer', value: 'https://robinhoodchain.blockscout.com' },
    ],
  },
  {
    step: '02',
    title: 'Bridge ETH',
    body: 'Bridge ETH from Ethereum mainnet to Robinhood Chain using the official bridge.',
    link: { label: 'Open Bridge →', href: 'https://bridge.chain.robinhood.com' },
  },
  {
    step: '03',
    title: 'Buy $WILL on a DEX',
    body: 'Swap ETH for $WILL using the contract address below on any Robinhood Chain DEX.',
    details: [
      { label: 'Token', value: '$WILL' },
      { label: 'Contract', value: `${WILL_TOKEN.slice(0, 10)}…${WILL_TOKEN.slice(-6)}` },
    ],
    copy: WILL_TOKEN,
  },
  {
    step: '04',
    title: 'Pick Your Cat',
    body: 'Connect your wallet on the Terminal, choose a faction, and start earning dividends from every swap.',
    cta: true,
  },
]

export default function BuyPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Get Started
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            How to<br />
            <span style={{ color: '#CCFF00' }}>Buy $WILL</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Four steps to hold $WILL and earn cat dividends on Robinhood Chain.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-10">
          {STEPS.map((item, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex gap-4">
                <div
                  className="w-9 h-9 shrink-0 flex items-center justify-center"
                  style={{ border: '1px solid rgba(204,255,0,0.3)' }}
                >
                  <span className="wc-mono font-bold text-sm" style={{ color: '#CCFF00' }}>{item.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm mb-1.5">{item.title}</div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{item.body}</p>

                  {/* Details table */}
                  {item.details && (
                    <div
                      className="divide-y"
                      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {item.details.map(d => (
                        <div
                          key={d.label}
                          className="flex items-center justify-between px-3 py-2"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{d.label}</span>
                          <span className="wc-mono text-[11px] text-gray-300">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* External link */}
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:text-white"
                      style={{ color: '#CCFF00' }}
                    >
                      {item.link.label} <ExternalLink size={11} />
                    </a>
                  )}

                  {/* CTA */}
                  {item.cta && (
                    <Link
                      href="/dapp"
                      className="inline-flex items-center gap-2 px-6 py-2.5 font-black text-xs uppercase tracking-wide text-black transition-all hover:bg-white hover:scale-[1.02]"
                      style={{ background: '#CCFF00' }}
                    >
                      Launch Terminal <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contract address box */}
        <div className="glass-card overflow-hidden" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
          <div
            className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest"
            style={{
              color: 'rgba(204,255,0,0.8)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(204,255,0,0.04)',
            }}
          >
            $WILL Contract Address
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <span className="wc-mono text-xs text-gray-300 break-all">{WILL_TOKEN}</span>
            <a
              href={`https://robinhoodchain.blockscout.com/address/${WILL_TOKEN}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-gray-500 hover:text-[#CCFF00] transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
