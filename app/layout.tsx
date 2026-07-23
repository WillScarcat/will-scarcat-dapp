import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Providers from './providers'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import PullToRefresh from '@/components/PullToRefresh'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: 'Will Scarcat — Pick Your Cat',
  description: 'Hold $WILL, choose your cat faction, earn dividends on Robinhood Chain.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/willlogo.jpg',
    shortcut: '/images/willlogo.jpg',
    apple: '/images/willlogo.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Will Scarcat',
  },
  openGraph: {
    title: 'Will Scarcat',
    description: 'Pick your cat. Earn rewards.',
    images: ['/images/willlogo.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#CCFF00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/images/willlogo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/willlogo.jpg" />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0 lg:ml-14">
              <main className="pb-16 lg:pb-0">
                <div className="page-transition">{children}</div>
              </main>
              <BottomNav />
              <PullToRefresh />
              <ServiceWorkerRegistration />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
