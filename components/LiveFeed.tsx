import { LivePing } from './LivePing'
import { ExternalLink } from 'lucide-react'

const TRACKER = '0x1c5dd362b2ae190468f25f9dff000d8f4c19fe44'
const EXPLORER = 'https://robinhoodchain.blockscout.com'

type TxItem = {
  hash: string
  from: string
  method: string | null
  timestamp: string
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function methodLabel(method: string | null): string {
  if (!method) return 'TX'
  if (method.toLowerCase().includes('withdraw') || method.toLowerCase().includes('dividend')) return 'CLAIM'
  if (method.toLowerCase().includes('choose') || method.toLowerCase().includes('cat')) return 'CHOOSE CAT'
  return method.slice(0, 12).toUpperCase()
}

async function fetchFeed(): Promise<TxItem[]> {
  try {
    const res = await fetch(
      `${EXPLORER}/api/v2/addresses/${TRACKER}/transactions?limit=15`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.items ?? []).slice(0, 10).map((tx: Record<string, unknown>) => ({
      hash: tx.hash as string,
      from: tx.from ? (tx.from as Record<string, string>).hash ?? '' : '',
      method: (tx.method as string | null) ?? null,
      timestamp: (tx.timestamp as string) ?? new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export default async function LiveFeed() {
  const txs = await fetchFeed()

  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <LivePing />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                Reward Stream
              </span>
            </div>
            <span className="text-[10px] text-gray-600">
              {txs.length === 0 ? 'loading...' : `${txs.length} recent txs`}
            </span>
          </div>

          {/* Column labels */}
          <div
            className="grid grid-cols-[4rem_1fr_5rem_5rem] gap-2 px-4 py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            {['TYPE', 'FROM', 'TIME', 'TX'].map(h => (
              <span key={h} className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {txs.length === 0 ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-5 rounded animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : (
            <div>
              {txs.map((tx, i) => (
                <div
                  key={tx.hash}
                  className="grid grid-cols-[4rem_1fr_5rem_5rem] gap-2 items-center px-4 py-2 transition-colors"
                  style={{
                    borderBottom: i < txs.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    background: i === 0 ? 'rgba(204,255,0,0.03)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background =
                      i === 0 ? 'rgba(204,255,0,0.03)' : 'transparent'
                  }}
                >
                  <span className="flex items-center gap-1">
                    {i === 0 && <span className="wc-badge wc-badge-green text-[7px] px-1">NEW</span>}
                    <span className="wc-mono text-[10px]" style={{ color: '#CCFF00' }}>
                      {methodLabel(tx.method)}
                    </span>
                  </span>
                  <span className="wc-mono text-[10px] text-gray-500 truncate">
                    {tx.from ? `${tx.from.slice(0, 6)}…${tx.from.slice(-4)}` : '—'}
                  </span>
                  <span className="wc-mono text-[10px] text-gray-600">
                    {formatTimestamp(tx.timestamp)}
                  </span>
                  <a
                    href={`${EXPLORER}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="wc-mono text-[10px] text-gray-600 hover:text-[#CCFF00] transition-colors flex items-center gap-1 justify-end"
                  >
                    {tx.hash.slice(0, 6)}…
                    <ExternalLink size={9} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
