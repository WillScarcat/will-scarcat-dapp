const BLOCKSCOUT = 'https://robinhoodchain.blockscout.com/api/v2'

export type TokenStats = {
  holders: number
  transfers: number
  totalSupply: string
}

export async function getTokenStats(tokenAddress: string): Promise<TokenStats> {
  try {
    const res = await fetch(`${BLOCKSCOUT}/tokens/${tokenAddress}`, {
      next: { revalidate: 60 },
    })
    const data = await res.json()
    return {
      holders: data.holders_count ?? 0,
      transfers: data.transfers_count ?? 0,
      totalSupply: data.total_supply ?? '0',
    }
  } catch {
    return { holders: 0, transfers: 0, totalSupply: '0' }
  }
}
