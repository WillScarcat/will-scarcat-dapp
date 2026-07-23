import { parseAbi } from 'viem'

export const WILL_TOKEN = (process.env.NEXT_PUBLIC_WILL_TOKEN || undefined) as `0x${string}` | undefined
export const TRACKER    = (process.env.NEXT_PUBLIC_TRACKER    || undefined) as `0x${string}` | undefined

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
  { id: 'cashcat', ticker: 'CASHCAT', name: 'Cash Cat',      address: '0x020bfC650A365f8BB26819deAAbF3E21291018b4', img: '/images/cats/cashcat.png', color: '#CCFF00' },
  { id: 'meow',    ticker: 'MEOW',    name: 'meow',           address: '0x75C8258eAa6d0f94b82951194191cA3efB0bCBe2', img: '/images/cats/meow.png',    color: '#a855f7' },
  { id: 'gmeow',   ticker: 'GMEOW',   name: 'gmeow',          address: '0x7179e590A4cEA6649FA11eCc2E49cC89773f3F96', img: '/images/cats/gmeow.png',   color: '#38bdf8' },
  { id: 'shibcat', ticker: 'SHIBCAT', name: 'Shib Cat',       address: '0xac0F333bBEBB62B6d16322650641Bd5eF2B849e5', img: '/images/cats/shibcat.png', color: '#fb923c' },
  { id: 'buffcat', ticker: 'BUFFCAT', name: 'Buff Cat',       address: '0xD80aFe3Be875a14155FDd96D39669A6734E12036', img: '/images/cats/buffcat.png', color: '#4ade80' },
  { id: 'applcat', ticker: 'APPLCAT', name: 'Apple Cat',      address: '0x2711Aa54aB08f448826a0d93Ed4C043189827777', img: '/images/cats/applcat.png', color: '#f87171' },
  { id: 'helia',   ticker: 'HELIA',   name: 'Starecat',       address: '0xA3B9120593C93169E36A0CDea1324584B745E03f', img: '/images/cats/helia.png',   color: '#FF6B6B' },
  { id: 'swink',   ticker: 'SWINK',   name: 'Swole Wink Cat', address: '0xA59ad0402d51D4879AF7f8A8A09707C52D52FDDa', img: '/images/cats/swink.png',   color: '#4ECDC4' },
  { id: 'kitty',   ticker: 'KITTY',   name: 'Roaring Kitty',  address: '0x19B7791b26DbF0fCf23c0db9DE89c937b33fD20e', img: '/images/cats/kitty.png',   color: '#FFE66D' },
]
