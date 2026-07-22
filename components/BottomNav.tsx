'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutDashboard, BarChart2, Coins } from 'lucide-react'

const TABS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'dApp', href: '/dapp', icon: LayoutDashboard },
  { label: 'Stats', href: '/#stats', icon: BarChart2 },
  { label: 'Claim', href: '/dapp#claim', icon: Coins },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-wc-border bg-wc-black lg:hidden">
      <div className="flex">
        {TABS.map(({ label, href, icon: Icon }) => {
          const base = href.split('#')[0]
          const isActive = base === '/' ? pathname === '/' : pathname.startsWith(base)
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-wc-green' : 'text-wc-muted'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="wc-mono wc-upper text-[8px] font-bold tracking-[0.12em]">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
