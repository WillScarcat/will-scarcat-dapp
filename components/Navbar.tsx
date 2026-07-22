'use client'

import Link from 'next/link'
import { LivePing } from './LivePing'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: 'rgba(15,15,18,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-12">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/images/willlogo.jpg"
            alt="Will"
            className="w-6 h-6 object-cover rounded-full"
            style={{ border: '1px solid rgba(204,255,0,0.3)' }}
          />
          <span className="font-bold text-[#CCFF00] text-sm tracking-wide">$WILL</span>
          <LivePing />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/#how-to-buy"
            className="px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:text-white transition-colors hidden sm:block"
          >
            How to Buy
          </Link>
          <Link
            href="/dapp"
            className="px-4 py-1.5 text-[11px] font-bold text-black transition-all hover:scale-[1.02]"
            style={{ background: '#CCFF00' }}
          >
            Launch dApp
          </Link>
        </div>
      </div>
    </nav>
  )
}
