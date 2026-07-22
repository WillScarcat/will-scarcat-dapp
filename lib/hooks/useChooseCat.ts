'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TRACKER, TRACKER_ABI } from '../contracts'

export function useChooseCat() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function chooseCat(catAddress: `0x${string}`) {
    if (!TRACKER) return
    writeContract({
      address: TRACKER,
      abi: TRACKER_ABI,
      functionName: 'chooseCat',
      args: [catAddress],
    })
  }

  return { chooseCat, isPending: isPending || isConfirming, isSuccess, error, hash }
}
