import CatCard from './CatCard'
import { CATS } from '@/lib/contracts'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PickYourCat() {
  return (
    <section id="cats" className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="cat-grid grid grid-cols-3 gap-3">
          {CATS.map(cat => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/dapp"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-black text-sm uppercase tracking-wide text-black transition-all hover:bg-white hover:scale-[1.02]"
            style={{ background: '#CCFF00' }}
          >
            Connect Wallet to Choose <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
