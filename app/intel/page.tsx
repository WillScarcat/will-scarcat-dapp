'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Activity, TrendingUp, Users, Zap, ArrowUp, ArrowDown } from 'lucide-react'
import { getTokenStats, getRecentTransfers, type TokenTransfer } from '@/lib/api/blockscout'
import { fetchPurrPriceClient, type PriceData } from '@/lib/api/dexscreener'

const WILL_TOKEN = process.env.NEXT_PUBLIC_WILL_TOKEN ?? ''
const POLL_MS = 5000

const EMPTY_PRICE: PriceData = { price: '0', priceChange24h: 0, volume24h: 0, liquidity: 0, fdv: 0, txns24h: 0 }

function fmt(n: number, decimals = 2): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(decimals)
}

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function washScore(vol24h: number, liquidity: number): string {
  if (!liquidity || !vol24h) return '—'
  const ratio = vol24h / liquidity
  const clean = Math.max(0, Math.min(100, 100 - (ratio - 1) * 12))
  return `${clean.toFixed(1)}%`
}

function timeAgo(iso: string): string {
  if (!iso) return '—'
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.round(diff)}s`
  if (diff < 3600) return `${Math.round(diff / 60)}m`
  return `${Math.round(diff / 3600)}h`
}

const ENTER = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }

export default function IntelPage() {
  const [price, setPrice]       = useState<PriceData>(EMPTY_PRICE)
  const [holders, setHolders]   = useState<number | null>(null)
  const [transfers, setTransfers] = useState<TokenTransfer[]>([])
  const [tick, setTick]         = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    const [p, stats, txs] = await Promise.all([
      fetchPurrPriceClient(),
      WILL_TOKEN ? getTokenStats(WILL_TOKEN) : null,
      WILL_TOKEN ? getRecentTransfers(WILL_TOKEN, 10) : [],
    ])
    setPrice(p)
    if (stats) setHolders(stats.holders)
    setTransfers(txs)
    setLastUpdate(new Date())
  }, [])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => {
    const id = setInterval(() => { setTick(t => t + 1); refresh() }, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  const priceNum   = parseFloat(price.price) || 0
  const change24h  = price.priceChange24h
  const changeUp   = change24h >= 0
  const cleanScore = washScore(price.volume24h, price.liquidity)

  const PANELS = [
    {
      label: 'PRICE',
      icon: TrendingUp,
      value: priceNum > 0 ? `$${priceNum.toFixed(priceNum < 0.001 ? 8 : 4)}` : '—',
      sub: change24h !== 0 ? `${changeUp ? '+' : ''}${change24h.toFixed(2)}%` : null,
      subColor: changeUp ? '#22c55e' : '#ef4444',
      color: '#CCFF00',
    },
    {
      label: 'VOLUME 24H',
      icon: Activity,
      value: price.volume24h > 0 ? `$${fmt(price.volume24h)}` : '—',
      sub: price.txns24h > 0 ? `${price.txns24h} txns` : null,
      subColor: 'rgba(255,255,255,0.35)',
      color: '#60a5fa',
    },
    {
      label: 'HOLDERS',
      icon: Users,
      value: holders != null ? holders.toLocaleString() : '—',
      sub: null,
      subColor: 'rgba(255,255,255,0.35)',
      color: '#a855f7',
    },
    {
      label: 'LIQUIDITY',
      icon: Zap,
      value: price.liquidity > 0 ? `$${fmt(price.liquidity)}` : '—',
      sub: price.fdv > 0 ? `FDV $${fmt(price.fdv)}` : null,
      subColor: 'rgba(255,255,255,0.35)',
      color: '#22c55e',
    },
  ]

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 lg:px-8 lg:pt-8 max-w-3xl mx-auto">

      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-6" {...ENTER}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)' }}>
          <Terminal size={18} color="#CCFF00" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="wc-mono text-sm font-bold uppercase tracking-[0.15em]" style={{ color: '#CCFF00' }}>
            SCARCAT INTEL
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ROBINHOOD CHAIN · 4663
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#CCFF00', boxShadow: '0 0 6px rgba(204,255,0,0.6)' }} />
            <span className="wc-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>LIVE</span>
          </div>
          {lastUpdate && (
            <span className="wc-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </motion.div>

      {/* Stat panels */}
      <motion.div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {PANELS.map(({ label, icon: Icon, value, sub, subColor, color }) => (
          <div key={label} className="p-4 rounded-[14px]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={11} color={color} strokeWidth={2} />
              <span className="wc-mono text-[8px] font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {label}
              </span>
            </div>
            <div className="wc-mono font-bold stat-value" style={{ color, fontSize: value.length > 8 ? 14 : 20 }}>
              {value}
            </div>
            {sub && (
              <div className="flex items-center gap-0.5 mt-1">
                {label === 'PRICE' && (changeUp
                  ? <ArrowUp size={9} color={subColor} />
                  : <ArrowDown size={9} color={subColor} />)}
                <span className="wc-mono text-[9px] font-bold" style={{ color: subColor }}>{sub}</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Live transfers feed */}
      <motion.div className="rounded-[14px] overflow-hidden mb-3"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="wc-mono text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            RECENT TRANSFERS
          </span>
          <span className="wc-mono text-[9px] font-bold tabular-nums" style={{ color: '#CCFF00' }}>
            {String(tick % 100).padStart(2, '0')}s
          </span>
        </div>

        {transfers.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="wc-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
              {WILL_TOKEN ? 'Fetching transfers…' : 'Contract pending deployment'}
            </p>
          </div>
        ) : (
          <div>
            {transfers.slice(0, 10).map((tx, i) => (
              <div key={tx.hash || i} className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderBottom: i < transfers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                <span className="wc-mono text-[9px] font-bold rounded px-1.5 py-0.5 shrink-0"
                  style={{
                    color: '#60a5fa',
                    background: 'rgba(96,165,250,0.08)',
                    border: '1px solid rgba(96,165,250,0.15)',
                  }}>
                  TX
                </span>
                <span className="wc-mono text-[10px] flex-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {shortAddr(tx.from)} → {shortAddr(tx.to)}
                </span>
                <span className="wc-mono text-[10px] font-bold shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {parseFloat(tx.value) > 0 ? fmt(parseFloat(tx.value) / 1e18, 0) : '—'}
                </span>
                <span className="wc-mono text-[9px] shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {timeAgo(tx.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Wash trading + FDV panel */}
      <motion.div className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

        {/* Wash trading score */}
        <div className="rounded-[14px] p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="wc-mono text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              CLEAN VOL
            </span>
            <span className="wc-mono text-[7px] font-bold uppercase px-1 py-0.5 rounded"
              style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', border: '1px solid rgba(204,255,0,0.2)' }}>
              ML
            </span>
          </div>
          <div className="wc-mono text-2xl font-bold stat-value" style={{ color: '#CCFF00' }}>
            {cleanScore}
          </div>
          <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Vol/Liq ratio heuristic
          </p>
        </div>

        {/* Market cap */}
        <div className="rounded-[14px] p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="wc-mono text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              MARKET CAP
            </span>
          </div>
          <div className="wc-mono text-2xl font-bold stat-value" style={{ color: '#a855f7' }}>
            {price.fdv > 0 ? `$${fmt(price.fdv)}` : '—'}
          </div>
          <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Fully diluted value
          </p>
        </div>
      </motion.div>

    </div>
  )
}
