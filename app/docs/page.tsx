import { ExternalLink } from 'lucide-react'
import { WILL_TOKEN, TRACKER, CATS } from '@/lib/contracts'

const EXPLORER = 'https://robinhoodchain.blockscout.com'

const CHAIN = [
  { label: 'Network Name', value: 'Robinhood Chain' },
  { label: 'Chain ID', value: '4663' },
  { label: 'RPC URL', value: 'https://rpc.mainnet.chain.robinhood.com' },
  { label: 'Currency Symbol', value: 'ETH' },
  { label: 'Block Explorer', value: 'robinhoodchain.blockscout.com' },
]

const CONTRACTS = [
  {
    label: '$WILL Token',
    address: WILL_TOKEN,
    description: 'ERC-20 dividend-distributing token. Hold to earn.',
  },
  {
    label: 'Tracker',
    address: TRACKER,
    description: 'Dividend tracker — call chooseCat() and withdrawDividend().',
  },
]

const ABI_SNIPPETS = [
  { sig: 'chooseCat(address catToken)', desc: 'Set your active cat faction' },
  { sig: 'withdrawDividend()', desc: 'Claim pending dividends for your cat' },
  { sig: 'holderCat(address)', desc: 'Returns the active cat address for a wallet' },
  { sig: 'withdrawableDividendOf(address cat, address owner)', desc: 'Claimable amount for wallet + faction' },
  { sig: 'catTotalWeight(address cat)', desc: 'Total $WILL weight backing a faction' },
]

function TableRow({ left, right, link }: { left: string; right: string; link?: string }) {
  return (
    <div
      className="flex items-start justify-between gap-4 px-4 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 shrink-0 pt-0.5">{left}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="wc-mono text-[11px] text-gray-300 break-all text-right">{right}</span>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="shrink-0 text-gray-600 hover:text-[#CCFF00] transition-colors">
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(204,255,0,0.6)' }}>
            Technical Reference
          </div>
          <h1 className="font-black text-4xl md:text-5xl text-white mb-3 leading-none tracking-tight">
            Docs
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Contract addresses, chain configuration, and ABI reference for Will Scarcat on Robinhood Chain.
          </p>
        </div>

        {/* Chain Config */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(204,255,0,0.7)' }}>
            Chain Configuration
          </h2>
          <div className="glass-card overflow-hidden">
            {CHAIN.map(row => (
              <TableRow key={row.label} left={row.label} right={row.value} />
            ))}
          </div>
        </section>

        {/* Contracts */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(204,255,0,0.7)' }}>
            Contracts
          </h2>
          <div className="space-y-3">
            {CONTRACTS.map(c => (
              <div key={c.label} className="glass-card overflow-hidden">
                <div
                  className="px-4 py-2.5 flex items-center justify-between gap-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-bold text-sm text-white">{c.label}</span>
                  <a
                    href={`${EXPLORER}/address/${c.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors hover:text-white"
                    style={{ color: 'rgba(204,255,0,0.7)' }}
                  >
                    Explorer <ExternalLink size={10} />
                  </a>
                </div>
                <div className="px-4 py-3">
                  <div className="wc-mono text-xs text-gray-400 mb-2 break-all">{c.address}</div>
                  <div className="text-[11px] text-gray-600">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cat Contracts */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(204,255,0,0.7)' }}>
            Cat Faction Contracts
          </h2>
          <div className="glass-card overflow-hidden">
            {CATS.map(cat => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">${cat.ticker}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="wc-mono text-[10px] text-gray-500 truncate">
                    {cat.address.slice(0, 10)}…{cat.address.slice(-6)}
                  </span>
                  <a
                    href={`${EXPLORER}/address/${cat.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-gray-600 hover:text-[#CCFF00] transition-colors"
                  >
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABI Reference */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(204,255,0,0.7)' }}>
            Tracker ABI Reference
          </h2>
          <div className="glass-card overflow-hidden">
            {ABI_SNIPPETS.map(fn => (
              <div
                key={fn.sig}
                className="px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="wc-mono text-xs text-white mb-1 break-all">{fn.sig}</div>
                <div className="text-[10px] text-gray-600">{fn.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-[10px] text-gray-700 text-center pb-4 uppercase tracking-widest">
          Will Scarcat · Robinhood Chain · Chain ID 4663
        </div>
      </div>
    </div>
  )
}
