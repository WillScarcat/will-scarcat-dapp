'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Cat, Check, Loader2, AlertTriangle } from 'lucide-react'
import CatCard from './CatCard'
import { SkeletonCard } from './Skeleton'
import { RewardMoment } from './RewardMoment'
import { useToast } from './Toast'
import { CATS } from '@/lib/contracts'
import { robinhoodChain } from '@/lib/wagmi'
import { useWillBalance } from '@/lib/hooks/useWillBalance'
import { useCurrentCat } from '@/lib/hooks/useCurrentCat'
import { useRewards } from '@/lib/hooks/useRewards'
import { useChooseCat } from '@/lib/hooks/useChooseCat'
import { useClaim } from '@/lib/hooks/useClaim'
import { useCatStats } from '@/lib/hooks/useCatStats'

export default function RewardsDashboard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isWrongChain = isConnected && chainId !== robinhoodChain.id

  const { formatted: willBalance } = useWillBalance(address)
  const { cat: currentCat } = useCurrentCat(address)
  const { rewards, isLoading: isRewardsLoading, refetch } = useRewards(address)
  const { chooseCat, isPending: isChoosePending, isSuccess: isChooseSuccess, error: chooseError } = useChooseCat()
  const {
    claim,
    isSigning,
    isConfirming,
    isPending: isClaimPending,
    isSuccess: isClaimSuccess,
    error: claimError,
    reset: resetClaim,
  } = useClaim()
  const { stats: catStats } = useCatStats()
  const { toast } = useToast()

  const [pendingClaimAmount, setPendingClaimAmount] = useState(0)
  const [showRewardMoment, setShowRewardMoment] = useState(false)

  const totalClaimable = rewards.reduce((acc, r) => acc + r.amount, 0)

  const claimState: 'idle' | 'signing' | 'confirming' | 'confirmed' =
    isClaimSuccess && !isClaimPending ? 'confirmed'
    : isConfirming ? 'confirming'
    : isSigning ? 'signing'
    : 'idle'

  const claimAllLabel = {
    idle:       `Claim All (${totalClaimable.toFixed(6)} ${currentCat?.ticker ?? 'tokens'})`,
    signing:    'Signing...',
    confirming: 'Confirming...',
    confirmed:  '✓ Claimed!',
  }[claimState]

  useEffect(() => {
    if (isClaimSuccess) {
      navigator.vibrate?.([50, 30, 50, 30, 100])
      setShowRewardMoment(true)
      toast(`Claimed ${pendingClaimAmount.toFixed(4)} ${currentCat?.ticker ?? 'tokens'}!`, 'success')
      refetch()
    }
  }, [isClaimSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isChooseSuccess) toast(`Switched to ${currentCat?.ticker ?? 'cat'}!`, 'success')
  }, [isChooseSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chooseError) toast('Transaction failed. Try again.', 'error')
  }, [chooseError]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (claimError) toast('Claim failed. Try again.', 'error')
  }, [claimError]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClaim() {
    setPendingClaimAmount(totalClaimable)
    claim()
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <Cat className="w-10 h-10 text-wc-muted" />
        <p className="wc-mono text-wc-muted text-xs max-w-xs">
          Connect your wallet to pick a cat and claim rewards.
        </p>
        <ConnectButton />
        <p className="wc-mono text-[10px] text-wc-muted max-w-xs mt-2">
          No wallet? Hold $WILL — CashCat auto-distributes rewards to all holders.
        </p>
      </div>
    )
  }

  if (isWrongChain) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-500" />
        <div>
          <p className="wc-mono wc-upper font-bold text-wc-text text-sm mb-1">Wrong Network</p>
          <p className="wc-mono text-wc-muted text-xs">Switch to Robinhood Chain to continue.</p>
        </div>
        <button
          onClick={() => switchChain({ chainId: robinhoodChain.id })}
          className="bg-wc-green text-black px-6 py-2.5 font-bold text-sm wc-mono wc-upper hover:bg-[#b8e600] transition-colors"
        >
          Switch to Robinhood Chain
        </button>
        <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-wc-border pb-4">
          <div>
            <div className="wc-mono wc-upper text-[9px] text-wc-muted mb-1">$WILL Balance</div>
            <div className="wc-mono text-xl font-bold text-wc-green">
              {willBalance ?? '—'} WILL
            </div>
          </div>
          <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
        </div>

        {/* Active cat banner */}
        {currentCat ? (
          <div className="active-cat-banner">
            <img
              src={currentCat.img}
              alt={currentCat.name}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-widest text-gray-500">Active Cat</div>
              <div className="font-bold text-sm" style={{ color: currentCat.color }}>
                ${currentCat.ticker}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] uppercase tracking-widest text-gray-500">Claimable</div>
              <div className="wc-mono font-bold text-xs text-white">
                {totalClaimable > 0 ? totalClaimable.toFixed(4) : '—'}
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-wc-border px-4 py-2.5 wc-mono text-[10px] text-wc-muted">
            No cat chosen yet — CashCat distributes by default.
          </div>
        )}

        {/* TX state feedback */}
        {claimState === 'signing' && (
          <div className="flex items-center gap-2 wc-mono text-[10px] text-wc-muted border border-wc-border px-3 py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Waiting for wallet signature...
          </div>
        )}
        {claimState === 'confirming' && (
          <div className="flex items-center gap-2 wc-mono text-[10px] border px-3 py-2 animate-pulse"
            style={{ color: '#CCFF00', borderColor: 'rgba(204,255,0,0.2)' }}>
            <Loader2 className="w-3 h-3 animate-spin" />
            Confirming on Robinhood Chain...
          </div>
        )}
        {isChoosePending && (
          <div className="flex items-center gap-2 wc-mono text-[10px] text-wc-muted border border-wc-border px-3 py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Switching cat...
          </div>
        )}

        {/* Cat grid — skeleton while loading */}
        <div className="cat-grid grid grid-cols-3 gap-3">
          {isRewardsLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : CATS.map(cat => {
                const reward = rewards.find(r => r.cat.id === cat.id)
                const weightEntry = catStats.find(s => s.cat.id === cat.id)
                return (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    isSelected={currentCat?.id === cat.id}
                    claimable={reward?.formatted}
                    weightPct={weightEntry?.pct}
                    showActions
                    onChoose={() => chooseCat(cat.address)}
                    onClaim={handleClaim}
                    isChoosingPending={isChoosePending}
                    claimState={claimState}
                  />
                )
              })
          }
        </div>

        {/* Claim All */}
        {totalClaimable > 0 && (
          <motion.button
            onClick={handleClaim}
            disabled={isClaimPending || claimState === 'confirmed'}
            whileHover={claimState === 'idle' ? { scale: 1.015 } : undefined}
            whileTap={claimState === 'idle' ? { scale: 0.985 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="claim-all-btn w-full py-3 font-bold text-sm wc-mono wc-upper disabled:opacity-50 flex items-center justify-center gap-2 rounded-[10px]"
            style={{
              background: claimState === 'confirmed'
                ? 'rgba(34,197,94,0.12)'
                : claimState === 'confirming'
                ? 'rgba(204,255,0,0.12)'
                : '#CCFF00',
              color: claimState === 'confirmed'
                ? '#22c55e'
                : claimState === 'confirming'
                ? '#CCFF00'
                : '#0f0f12',
              border: claimState === 'confirming'
                ? '1px solid rgba(204,255,0,0.3)'
                : 'none',
            }}
          >
            {claimState === 'signing' && <Loader2 className="w-4 h-4 animate-spin" />}
            {claimState === 'confirming' && <Loader2 className="w-4 h-4 animate-spin" />}
            {claimState === 'confirmed' && <Check className="w-4 h-4" strokeWidth={3} />}
            {claimAllLabel}
          </motion.button>
        )}
      </div>

      {/* Reward moment overlay */}
      <AnimatePresence>
        {showRewardMoment && currentCat && (
          <RewardMoment
            amount={pendingClaimAmount}
            ticker={currentCat.ticker}
            catColor={currentCat.color}
            onClose={() => { setShowRewardMoment(false); resetClaim() }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
