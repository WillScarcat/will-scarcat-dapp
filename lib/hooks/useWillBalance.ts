'use client'

import { useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { WILL_TOKEN, WILL_TOKEN_ABI } from '../contracts'

export function useWillBalance(address: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: WILL_TOKEN as `0x${string}`, abi: WILL_TOKEN_ABI, functionName: 'balanceOf', args: [address!] },
      { address: WILL_TOKEN as `0x${string}`, abi: WILL_TOKEN_ABI, functionName: 'decimals' },
    ],
    query: { enabled: !!address && !!WILL_TOKEN },
  })

  if (!data) return { balance: null, formatted: null, isLoading }

  const raw = data[0].result as bigint | undefined
  const decimals = (data[1].result as number | undefined) ?? 18

  if (raw === undefined) return { balance: null, formatted: null, isLoading }

  const formatted = parseFloat(formatUnits(raw, decimals)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })

  return { balance: raw, formatted, isLoading }
}
