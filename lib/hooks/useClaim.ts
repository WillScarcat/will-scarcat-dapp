'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TRACKER, TRACKER_ABI } from '../contracts'

export function useClaim() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function claim() {
    if (!TRACKER) return
    writeContract({
      address: TRACKER,
      abi: TRACKER_ABI,
      functionName: 'withdrawDividend',
    })
  }

  return { claim, isSigning: isPending, isConfirming, isPending: isPending || isConfirming, isSuccess, error, hash, reset }
}
