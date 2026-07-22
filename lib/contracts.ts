import { parseAbi } from 'viem'

export const WILL_TOKEN = '0xbc0a5427e2a06241a53b335d1c4fdae8100aafa9' as `0x${string}`
export const TRACKER = '0x1c5dd362b2ae190468f25f9dff000d8f4c19fe44' as `0x${string}`

export const WILL_TOKEN_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
])

export const TRACKER_ABI = parseAbi([
  'function chooseCat(address catToken)',
  'function withdrawDividend()',
  'function holderCat(address) view returns (address)',
  'function withdrawableDividendOf(address cat, address owner) view returns (uint256)',
  'function catList(uint256) view returns (address)',
  'function isCatApproved(address) view returns (bool)',
  'function catTotalWeight(address cat) view returns (uint256)',
])

export type Cat = {
  id: string
  ticker: string
  name: string
  address: `0x${string}`
  img: string
  color: string
}

export const CATS: Cat[] = [
  { id: 'cashcat', ticker: 'CASHCAT', name: 'Cash Cat', address: '0x020bfC650A365f8BB26819deAAbF3E21291018b4', img: '/images/cats/cashcat.png', color: '#CCFF00' },
  { id: 'meow', ticker: 'MEOW', name: 'meow', address: '0x75C8258eAa6d0f94b82951194191cA3efB0bCBe2', img: '/images/cats/meow.png', color: '#a855f7' },
  { id: 'gmeow', ticker: 'GMEOW', name: 'gmeow', address: '0x7179e590A4cEA6649FA11eCc2E49cC89773f3F96', img: '/images/cats/gmeow.png', color: '#38bdf8' },
  { id: 'shibcat', ticker: 'SHIBCAT', name: 'Shib Cat', address: '0xac0F333bBEBB62B6d16322650641Bd5eF2B849e5', img: '/images/cats/shibcat.png', color: '#fb923c' },
  { id: 'buffcat', ticker: 'BUFFCAT', name: 'Buff Cat', address: '0xD80aFe3Be875a14155FDd96D39669A6734E12036', img: '/images/cats/buffcat.png', color: '#4ade80' },
  { id: 'applcat', ticker: 'APPLCAT', name: 'Apple Cat', address: '0x2711Aa54aB08f448826a0d93Ed4C043189827777', img: '/images/cats/applcat.png', color: '#f87171' },
]
