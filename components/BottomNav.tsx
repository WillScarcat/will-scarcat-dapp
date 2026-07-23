'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Cat, Coins, Terminal } from 'lucide-react'

const TABS = [
  { label: 'Home',  href: '/',      icon: Home },
  { label: 'Cats',  href: '/cats',  icon: Cat },
  { label: 'Claim', href: '/dapp',  icon: Coins },
  { label: 'Intel', href: '/intel', icon: Terminal },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center"
      style={{
        height: 56,
        background: 'rgba(8,9,10,0.92)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={label}
            href={href}
            className="relative flex flex-col items-center justify-center gap-[3px] flex-1 py-2 transition-transform active:scale-[0.92]"
            style={{ color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.35)' }}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span
              className="wc-mono text-[8px] font-bold uppercase tracking-wider"
              style={{ color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.35)' }}
            >
              {label}
            </span>
            {isActive && (
              <span
                className="nav-indicator absolute bottom-[6px] left-1/2 -translate-x-1/2 rounded-[1px]"
                style={{
                  height: 2,
                  background: '#CCFF00',
                  boxShadow: '0 0 6px rgba(204,255,0,0.5)',
                }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
