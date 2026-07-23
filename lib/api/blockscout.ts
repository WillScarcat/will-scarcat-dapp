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

export type TokenTransfer = {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  type: 'transfer'
}

export async function getRecentTransfers(tokenAddress: string, limit = 10): Promise<TokenTransfer[]> {
  try {
    const res = await fetch(
      `${BLOCKSCOUT}/tokens/${tokenAddress}/transfers?limit=${limit}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    const items = (data.items ?? []) as Record<string, unknown>[]
    return items.map(t => ({
      hash: (t.tx_hash as string) ?? '',
      from: (t.from as Record<string, string>)?.hash ?? '',
      to:   (t.to   as Record<string, string>)?.hash ?? '',
      value: (t.total as Record<string, string>)?.value ?? '0',
      timestamp: (t.timestamp as string) ?? '',
      type: 'transfer' as const,
    }))
  } catch {
    return []
  }
}
