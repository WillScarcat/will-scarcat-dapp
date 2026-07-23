'use client'

import { useEffect, useState } from 'react'
import { Terminal, Activity, TrendingUp, Eye, Zap } from 'lucide-react'

const PANELS = [
  { id: 'price',  label: 'PRICE',   icon: TrendingUp, value: '—',     unit: 'USD',    color: '#CCFF00' },
  { id: 'vol',    label: 'VOLUME',  icon: Activity,   value: '—',     unit: '24H',    color: '#60a5fa' },
  { id: 'whales', label: 'WHALES',  icon: Eye,        value: '—',     unit: 'ACTIVE', color: '#a855f7' },
  { id: 'txs',    label: 'TXS',     icon: Zap,        value: '—',     unit: '1H',     color: '#22c55e' },
]

const FEED_PLACEHOLDER = [
  { time: '—', type: 'BUY',  amount: '—',    addr: '0x…' },
  { time: '—', type: 'SELL', amount: '—',    addr: '0x…' },
  { time: '—', type: 'BUY',  amount: '—',    addr: '0x…' },
]

export default function IntelPage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 lg:px-8 lg:pt-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)' }}
        >
          <Terminal size={18} color="#CCFF00" />
        </div>
        <div>
          <h1 className="wc-mono text-sm font-bold uppercase tracking-[0.15em]" style={{ color: '#CCFF00' }}>
            SCARCAT INTEL
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ROBINHOOD CHAIN · 4663
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#CCFF00', boxShadow: '0 0 6px rgba(204,255,0,0.6)' }}
          />
          <span className="wc-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Stat panels */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        {PANELS.map(({ id, label, icon: Icon, value, unit, color }) => (
          <div
            key={id}
            className="p-4 rounded-[14px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={12} color={color} strokeWidth={2} />
              <span
                className="wc-mono text-[9px] font-bold uppercase tracking-[0.1em]"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {label}
              </span>
            </div>
            <div className="wc-mono text-2xl font-bold stat-value" style={{ color }}>
              {value}
            </div>
            <div className="wc-mono text-[9px] mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {unit}
            </div>
          </div>
        ))}
      </div>

      {/* Live feed */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="wc-mono text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            LIVE TRANSACTIONS
          </span>
          <span className="wc-mono text-[9px] font-bold" style={{ color: '#CCFF00' }}>
            {String(tick).padStart(3, '0')}s
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {FEED_PLACEHOLDER.map((tx, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <span
                className="wc-mono text-[10px] font-bold uppercase w-8 text-center rounded px-1 py-0.5"
                style={{
                  color:       tx.type === 'BUY' ? '#22c55e' : '#ef4444',
                  background:  tx.type === 'BUY' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${tx.type === 'BUY' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  fontSize: 9,
                }}
              >
                {tx.type}
              </span>
              <span className="wc-mono text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {tx.amount}
              </span>
              <span className="wc-mono text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {tx.addr}
              </span>
            </div>
          ))}
        </div>

        {/* Coming soon overlay */}
        <div
          className="px-4 py-8 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="wc-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            LIVE DATA FEED — COMING SOON
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Blockscout · DexScreener · SSE pipeline
          </p>
        </div>
      </div>

      {/* Wash trading panel */}
      <div
        className="mt-3 rounded-[14px] p-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="wc-mono text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            WASH TRADING SCORE
          </span>
          <span
            className="wc-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', border: '1px solid rgba(204,255,0,0.2)' }}
          >
            ML
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="wc-mono text-3xl font-bold stat-value" style={{ color: '#CCFF00' }}>—</span>
          <span className="wc-mono text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
            CLEAN VOLUME %
          </span>
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
          DBSCAN + HMM pipeline · Recalculates every block batch
        </p>
      </div>

    </div>
  )
}
