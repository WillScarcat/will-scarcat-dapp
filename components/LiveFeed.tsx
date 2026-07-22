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

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
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
    const items: TxItem[] = (data.items ?? []).slice(0, 10).map((tx: Record<string, unknown>) => ({
      hash: tx.hash as string,
      from: tx.from ? (tx.from as Record<string, string>).hash ?? '' : '',
      method: (tx.method as string | null) ?? null,
      timestamp: (tx.timestamp as string) ?? new Date().toISOString(),
    }))
    return items
  } catch {
    return []
  }
}

export default async function LiveFeed() {
  const txs = await fetchFeed()

  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="border border-wc-border bg-wc-card">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-wc-border">
            <div className="flex items-center gap-2">
              <LivePing />
              <span className="wc-mono wc-upper text-[10px] font-bold text-wc-text">
                Reward Stream
              </span>
            </div>
            <span className="wc-mono text-[10px] text-wc-muted">
              {txs.length === 0 ? 'loading...' : `${txs.length} recent txs`}
            </span>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-[4rem_1fr_6rem_5rem] gap-2 px-3 py-1.5 border-b border-wc-border/50">
            {['TYPE', 'FROM', 'WHEN', 'TX'].map(h => (
              <span key={h} className="wc-mono text-[9px] text-wc-muted wc-upper">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {txs.length === 0 ? (
            <div className="px-3 py-8 text-center wc-mono text-[11px] text-wc-muted">
              No transactions yet
            </div>
          ) : (
            <div className="divide-y divide-wc-border/30">
              {txs.map((tx, i) => (
                <div
                  key={tx.hash}
                  className={`grid grid-cols-[4rem_1fr_6rem_5rem] gap-2 items-center px-3 py-2 text-xs ${i === 0 ? 'bg-wc-green/[0.04]' : ''}`}
                >
                  <span>
                    {i === 0 && <span className="wc-badge wc-badge-green mr-1">NEW</span>}
                    <span className="wc-mono text-wc-green text-[10px]">
                      {methodLabel(tx.method)}
                    </span>
                  </span>
                  <span className="wc-mono text-wc-muted truncate">
                    {tx.from ? `${tx.from.slice(0, 6)}…${tx.from.slice(-4)}` : '—'}
                  </span>
                  <span className="wc-mono text-wc-muted text-[10px]">
                    {timeAgo(tx.timestamp)}
                  </span>
                  <a
                    href={`${EXPLORER}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="wc-mono text-[10px] text-wc-muted hover:text-wc-green transition-colors flex items-center gap-1 justify-end"
                  >
                    {tx.hash.slice(0, 6)}…
                    <ExternalLink size={10} />
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
