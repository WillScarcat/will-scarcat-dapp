'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { LivePing } from './LivePing'
import { WILL_TOKEN } from '@/lib/contracts'
import { useState } from 'react'

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [imgError, setImgError] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(WILL_TOKEN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 pt-20 max-w-6xl mx-auto">
      {/* Live status row */}
      <div className="flex items-center gap-2 mb-6">
        <LivePing />
        <span className="wc-mono wc-upper text-[10px] text-wc-muted tracking-widest">
          Robinhood Chain · Chain ID 4663
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        {/* Left — text */}
        <div className="flex-1">
          <h1 className="wc-mono font-bold uppercase leading-none mb-6 text-5xl md:text-7xl">
            THE WILL<br />
            <span className="text-wc-green">SCARCAT</span><br />
            TERMINAL
          </h1>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="wc-badge wc-badge-green">LIVE</span>
            <span className="wc-badge wc-badge-white">6 CATS</span>
            <span className="wc-badge wc-badge-gray">PURR · ROBINHOOD CHAIN</span>
          </div>

          <p className="text-wc-muted text-sm leading-relaxed mb-8 max-w-md">
            Hold $WILL, choose your cat faction, earn ETH dividends from every swap.
            CashCat auto-distributes if you don&apos;t pick.
          </p>

          {/* CA box */}
          <div className="border border-wc-border flex items-center mb-8 max-w-md">
            <span className="wc-mono text-[10px] wc-upper text-wc-green px-3 py-2 border-r border-wc-border shrink-0">
              $WILL CA
            </span>
            <span className="wc-mono text-xs text-wc-muted px-3 flex-1 truncate">
              {WILL_TOKEN}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-2 border-l border-wc-border wc-mono text-[10px] wc-upper text-wc-text hover:text-wc-green transition-colors shrink-0"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a
              href={`https://robinhoodchain.blockscout.com/address/${WILL_TOKEN}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 border-l border-wc-border wc-mono text-[10px] wc-upper text-wc-muted hover:text-wc-green transition-colors shrink-0"
            >
              Explorer ↗
            </a>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dapp"
              className="bg-wc-green text-black px-8 py-3 font-bold text-sm wc-mono wc-upper hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2"
            >
              Launch dApp <ArrowRight size={14} />
            </Link>
            <a
              href="#how-to-buy"
              className="border border-wc-border px-8 py-3 text-sm text-wc-muted hover:border-wc-green hover:text-wc-green transition-colors wc-mono wc-upper text-center"
            >
              How to Buy
            </a>
          </div>
        </div>

        {/* Right — logo + stats */}
        <div className="flex flex-col items-center gap-6">
          {!imgError && (
            <div className="border-2 border-wc-green/30 p-1">
              <Image
                src="/images/willlogo.jpg"
                alt="Will"
                width={180}
                height={180}
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Stat grid */}
          <div className="grid grid-cols-3 gap-px border border-wc-border bg-wc-border w-full min-w-[240px]">
            {[
              { value: 'PURR', label: 'Token', sub: '$WILL' },
              { value: '4663', label: 'Chain ID', sub: 'Robinhood' },
              { value: '6', label: 'Factions', sub: 'Cats' },
            ].map(s => (
              <div key={s.label} className="bg-wc-card p-3 text-center">
                <div className="wc-mono font-bold text-wc-text text-lg">{s.value}</div>
                <div className="wc-mono wc-upper text-[9px] font-bold text-wc-green mt-0.5">{s.label}</div>
                <div className="text-wc-muted text-[9px] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
