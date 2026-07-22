const PAIR = '0xE4cD9b5B27e7b3404c29634320BD548731951490'
const API = 'https://api.dexscreener.com/latest/dex/pairs/robinhood/'

export type PriceData = {
  price: string
  priceChange24h: number
  volume24h: number
  liquidity: number
  fdv: number
  txns24h: number
}

const EMPTY: PriceData = { price: '0', priceChange24h: 0, volume24h: 0, liquidity: 0, fdv: 0, txns24h: 0 }

function parse(data: Record<string, unknown>): PriceData {
  // DexScreener returns { pairs: [...] }
  const pair = (data.pairs as Record<string, unknown>[] | undefined)?.[0]
  if (!pair) return EMPTY
  const txns = pair.txns as Record<string, Record<string, number>> | undefined
  return {
    price: (pair.priceUsd as string | undefined) ?? '0',
    priceChange24h: (pair.priceChange as Record<string, number> | undefined)?.h24 ?? 0,
    volume24h: (pair.volume as Record<string, number> | undefined)?.h24 ?? 0,
    liquidity: (pair.liquidity as Record<string, number> | undefined)?.usd ?? 0,
    fdv: (pair.fdv as number | undefined) ?? 0,
    txns24h: (txns?.h24?.buys ?? 0) + (txns?.h24?.sells ?? 0),
  }
}

export async function getPurrPrice(): Promise<PriceData> {
  try {
    const res = await fetch(API + PAIR, { next: { revalidate: 30 } })
    return parse(await res.json())
  } catch {
    return EMPTY
  }
}

export async function fetchPurrPriceClient(): Promise<PriceData> {
  try {
    const res = await fetch(API + PAIR)
    return parse(await res.json())
  } catch {
    return EMPTY
  }
}
