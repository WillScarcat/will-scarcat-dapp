'use client'

import { useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { TRACKER, TRACKER_ABI, CATS } from '../contracts'

export function useRewards(address: `0x${string}` | undefined) {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: CATS.map(cat => ({
      address: TRACKER as `0x${string}`,
      abi: TRACKER_ABI,
      functionName: 'withdrawableDividendOf' as const,
      args: [cat.address, address!] as [`0x${string}`, `0x${string}`],
    })),
    query: { enabled: !!address && !!TRACKER },
  })

  const rewards = CATS.map((cat, i) => {
    const raw = data?.[i]?.result as bigint | undefined
    const amount = raw ? parseFloat(formatUnits(raw, 18)) : 0
    const formatted = amount.toLocaleString('en-US', { maximumFractionDigits: 6 })
    return { cat, raw: raw ?? 0n, amount, formatted }
  })

  return { rewards, isLoading, refetch }
}
