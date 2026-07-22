'use client'

import { useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { TRACKER, TRACKER_ABI, CATS } from '../contracts'

export function useCatStats() {
  const { data, isLoading } = useReadContracts({
    contracts: CATS.map(cat => ({
      address: TRACKER as `0x${string}`,
      abi: TRACKER_ABI,
      functionName: 'catTotalWeight' as const,
      args: [cat.address] as [`0x${string}`],
    })),
    query: { enabled: !!TRACKER },
  })

  const weights = CATS.map((cat, i) => {
    const raw = data?.[i]?.result as bigint | undefined
    return { cat, raw: raw ?? 0n }
  })

  const totalRaw = weights.reduce((sum, w) => sum + w.raw, 0n)

  const stats = weights.map(({ cat, raw }) => {
    const pct = totalRaw > 0n
      ? Math.round(Number((raw * 10000n) / totalRaw) / 100)
      : 0
    const formatted = parseFloat(formatUnits(raw, 18)).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })
    return { cat, raw, formatted, pct }
  })

  return { stats, isLoading }
}
