'use client'

import RewardsDashboard from '@/components/RewardsDashboard'
import { SectionDivider } from '@/components/SectionDivider'
import { Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="ml-2 text-wc-muted hover:text-wc-green transition-colors" title="Copy">
      {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
    </button>
  )
}

const WILL_CA   = '0x3bfb420ccd9724201fe1e96d4e1a4ad89c94137c'
const TRACKER_CA = '0x7fcaf2b0780f5c795de393401458635724890075'

const CONTRACT_STATS = [
  { label: 'Contract', value: WILL_CA,    display: `${WILL_CA.slice(0,6)}…${WILL_CA.slice(-4)}`,    copyable: true },
  { label: 'Tracker',  value: TRACKER_CA, display: `${TRACKER_CA.slice(0,6)}…${TRACKER_CA.slice(-4)}`, copyable: true },
  { label: 'Chain ID', value: '4663',              display: '4663',              copyable: false },
  { label: 'Network',  value: 'Robinhood Chain',   display: 'Robinhood Chain',   copyable: false },
]

const STEPS = [
  { step: '01', title: 'Connect Wallet', body: 'Add Robinhood Chain (ID 4663) to your wallet and connect.' },
  { step: '02', title: 'Choose a Cat', body: 'Pick your cat faction. Your $WILL weight goes to that cat.' },
  { step: '03', title: 'Earn Rewards', body: 'Every $WILL swap generates dividends distributed to your cat.' },
  { step: '04', title: 'Claim', body: 'Hit Claim any time to withdraw your earned rewards.' },
]

export default function DappPage() {
  return (
    <div className="min-h-screen pt-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-0 px-4 py-8 lg:flex-row lg:gap-8">

        {/* Left panel — 40% */}
        <div className="lg:w-2/5 space-y-6 mb-8 lg:mb-0">
          <div>
            <div className="wc-mono wc-upper text-[10px] text-gray-500 mb-3">Robinhood Chain</div>
            <h1 className="wc-mono font-bold uppercase leading-none text-4xl mb-4">
              Will<br /><span className="text-wc-green">Scarcat</span>
            </h1>
            <p className="text-wc-muted text-sm leading-relaxed">
              Hold $WILL. Pick your cat. Earn dividends from every swap.
            </p>
          </div>

          {/* Contract info */}
          <div className="border border-wc-border divide-y divide-wc-border">
            {CONTRACT_STATS.map(stat => (
              <div key={stat.label} className="flex justify-between items-center px-3 py-2.5">
                <span className="wc-mono wc-upper text-[9px] text-wc-muted">{stat.label}</span>
                <div className="flex items-center">
                  <span className="wc-mono text-[11px] text-wc-text">{stat.display}</span>
                  {stat.copyable && <CopyButton text={stat.value} />}
                </div>
              </div>
            ))}
          </div>

          {/* How it works — stonkbrokers step style */}
          <div className="space-y-2">
            <div className="wc-mono wc-upper text-[10px] text-wc-muted font-bold mb-3">How It Works</div>
            {STEPS.map(s => (
              <div key={s.step} className="flex gap-3 border border-wc-border bg-wc-card p-4">
                <div className="w-8 h-8 shrink-0 border border-wc-green flex items-center justify-center">
                  <span className="wc-mono font-bold text-xs text-wc-green">{s.step}</span>
                </div>
                <div>
                  <h4 className="wc-mono wc-upper font-bold text-xs text-wc-text mb-1">{s.title}</h4>
                  <p className="text-wc-muted text-[11px] leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — 60% */}
        <div className="lg:w-3/5 border border-wc-border bg-wc-card p-5">
          <SectionDivider label="Rewards Terminal" />
          <RewardsDashboard />
        </div>
      </div>
    </div>
  )
}
