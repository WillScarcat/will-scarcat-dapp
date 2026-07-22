'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Home, LayoutDashboard, Cat, Coins, ShoppingBag, BookOpen } from 'lucide-react'

const NAV = [
  { href: '/',        label: 'Home',       icon: Home },
  { href: '/dapp',    label: 'Terminal',   icon: LayoutDashboard },
  { href: '/cats',    label: 'Cats',       icon: Cat },
  { href: '/rewards', label: 'Rewards',    icon: Coins },
  { href: '/buy',     label: 'How to Buy', icon: ShoppingBag },
  { href: '/docs',    label: 'Docs',       icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()

  return (
    <aside
      className={[
        'hidden lg:flex',
        'fixed top-0 left-0 bottom-0 z-50 flex-col',
        'w-14 hover:w-[200px]',
        'overflow-hidden',
        'transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'group/sidebar',
      ].join(' ')}
      style={{
        background: '#0f0f12',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        className="flex items-center gap-3 px-4 h-14 shrink-0 hover:bg-white/[0.03] transition-colors"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <img
          src="/images/willlogo.jpg"
          alt="Will"
          className="w-6 h-6 rounded-full shrink-0 object-cover"
          style={{ border: '1px solid rgba(204,255,0,0.3)' }}
        />
        <div className="whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
          <span className="font-bold text-sm" style={{ color: '#CCFF00' }}>WILL</span>
          <span className="font-bold text-white text-sm"> SCARCAT</span>
        </div>
      </Link>

      {/* ── Chain status ── */}
      <div
        className="flex items-center gap-3 px-4 h-9 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: '#CCFF00' }} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
          Robinhood Chain · 4663
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-1 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className="flex items-center gap-3 h-10 px-4 transition-all relative"
              style={{
                color: active ? '#CCFF00' : '#4b5563',
                background: active ? 'rgba(204,255,0,0.04)' : undefined,
                borderRight: active ? '2px solid #CCFF00' : '2px solid transparent',
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5"
                  style={{ background: '#CCFF00', boxShadow: '0 0 6px rgba(204,255,0,0.6)' }}
                />
              )}
              <Icon size={18} className="shrink-0" strokeWidth={active ? 2.5 : 1.5} />
              <span className="whitespace-nowrap overflow-hidden text-sm font-semibold uppercase tracking-wider opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* ── Wallet / status ── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: isConnected ? '#CCFF00' : '#374151' }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200"
            style={{ color: isConnected ? '#CCFF00' : '#4b5563' }}
          >
            {isConnected && address
              ? `${address.slice(0, 6)}…${address.slice(-4)}`
              : 'Not Connected'}
          </span>
        </div>
      </div>
    </aside>
  )
}
