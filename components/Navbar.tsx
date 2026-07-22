'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { LivePing } from './LivePing'

export default function Navbar() {
  const [imgError, setImgError] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-wc-border bg-wc-black/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-12">
        <Link href="/" className="flex items-center gap-2.5">
          {!imgError && (
            <Image
              src="/images/willlogo.jpg"
              alt="Will"
              width={24}
              height={24}
              className="object-cover border border-wc-border"
              onError={() => setImgError(true)}
            />
          )}
          <span className="wc-mono wc-upper font-bold text-wc-green text-sm">$WILL</span>
          <LivePing />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/#how-to-buy"
            className="px-3 py-1.5 wc-mono wc-upper text-[10px] text-wc-muted hover:text-wc-text transition-colors hidden sm:block"
          >
            How to Buy
          </Link>
          <Link
            href="/dapp"
            className="px-4 py-1.5 border border-wc-green bg-transparent text-wc-green hover:bg-wc-green hover:text-black transition-colors wc-mono wc-upper font-bold text-[10px]"
          >
            Launch dApp
          </Link>
        </div>
      </div>
    </nav>
  )
}
