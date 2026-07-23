'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Cat, LayoutDashboard, BarChart2, Coins } from 'lucide-react'

const TABS = [
  { label: 'Home',  href: '/',          icon: Home },
  { label: 'Cats',  href: '/cats',       icon: Cat },
  { label: 'dApp',  href: '/dapp',       icon: LayoutDashboard },
  { label: 'Stats', href: '/dapp#stats', icon: BarChart2 },
  { label: 'Claim', href: '/dapp#claim', icon: Coins },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center"
      style={{
        height: 64,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const base = href.split('#')[0]
        const isActive = base === '/' ? pathname === '/' : pathname.startsWith(base)
        return (
          <Link
            key={label}
            href={href}
            className="nav-item flex flex-col items-center gap-1 px-3 py-2 transition-colors"
            style={{ color: isActive ? '#CCFF00' : '#555555' }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="nav-item-label wc-mono text-[9px] font-bold uppercase tracking-wide">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
