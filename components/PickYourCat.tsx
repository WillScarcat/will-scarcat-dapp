import CatCard from './CatCard'
import { CATS } from '@/lib/contracts'

export default function PickYourCat() {
  return (
    <section id="cats" className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-px md:grid-cols-3 bg-wc-border border border-wc-border">
          {CATS.map(cat => (
            <div key={cat.id} className="bg-wc-black">
              <CatCard cat={cat} />
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <a
            href="/dapp"
            className="inline-block bg-wc-green text-black px-8 py-3 font-bold text-sm wc-mono wc-upper hover:bg-[#b8e600] transition-colors"
          >
            Connect Wallet to Choose
          </a>
        </div>
      </div>
    </section>
  )
}
