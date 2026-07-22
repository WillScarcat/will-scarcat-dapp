'use client'

import { useReadContract } from 'wagmi'
import { TRACKER, TRACKER_ABI, CATS } from '../contracts'

export function useCurrentCat(address: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContract({
    address: TRACKER as `0x${string}`,
    abi: TRACKER_ABI,
    functionName: 'holderCat',
    args: [address!],
    query: { enabled: !!address && !!TRACKER },
  })

  const catAddress = data as `0x${string}` | undefined
  const cat = catAddress ? CATS.find(c => c.address.toLowerCase() === catAddress.toLowerCase()) : undefined

  return { catAddress, cat, isLoading }
}
