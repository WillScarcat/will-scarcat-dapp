'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Loader2, Check } from 'lucide-react'
import CatCard from './CatCard'
import BottomSheet from './BottomSheet'
import EmptyState from './EmptyState'
import { SkeletonCard } from './Skeleton'
import { RewardMoment } from './RewardMoment'
import { useToast } from './Toast'
import { CATS } from '@/lib/contracts'
import { robinhoodChain } from '@/lib/wagmi'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useWillBalance } from '@/lib/hooks/useWillBalance'
import { useCurrentCat } from '@/lib/hooks/useCurrentCat'
import { useRewards } from '@/lib/hooks/useRewards'
import { useChooseCat } from '@/lib/hooks/useChooseCat'
import { useClaim } from '@/lib/hooks/useClaim'
import { useCatStats } from '@/lib/hooks/useCatStats'
import type { Cat } from '@/lib/contracts'

export default function RewardsDashboard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isWrongChain = isConnected && chainId !== robinhoodChain.id
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { formatted: willBalance } = useWillBalance(address)
  const { cat: currentCat } = useCurrentCat(address)
  const { rewards, isLoading: isRewardsLoading, refetch } = useRewards(address)
  const { chooseCat, isPending: isChoosePending, isSuccess: isChooseSuccess, error: chooseError } = useChooseCat()
  const {
    claim, isSigning, isConfirming,
    isPending: isClaimPending, isSuccess: isClaimSuccess,
    error: claimError, reset: resetClaim,
  } = useClaim()
  const { stats: catStats } = useCatStats()
  const { toast } = useToast()

  const [pendingClaimAmount, setPendingClaimAmount] = useState(0)
  const [showRewardMoment, setShowRewardMoment] = useState(false)
  const [claimAllSheet, setClaimAllSheet] = useState(false)
  const [chooseCatSheet, setChooseCatSheet] = useState<Cat | null>(null)

  const totalClaimable = rewards.reduce((acc, r) => acc + r.amount, 0)
  const claimableRewards = rewards.filter(r => r.amount > 0)

  const claimState: 'idle' | 'signing' | 'confirming' | 'confirmed' =
    isClaimSuccess && !isClaimPending ? 'confirmed'
    : isConfirming ? 'confirming'
    : isSigning ? 'signing'
    : 'idle'

  useEffect(() => {
    if (isClaimSuccess) {
      navigator.vibrate?.([50, 30, 50, 30, 100])
      setShowRewardMoment(true)
      setClaimAllSheet(false)
      toast(`Claimed ${pendingClaimAmount.toFixed(4)} ${currentCat?.ticker ?? 'tokens'}!`, 'success')
      refetch()
    }
  }, [isClaimSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isChooseSuccess) {
      setChooseCatSheet(null)
      toast(`Switched to ${currentCat?.ticker ?? 'cat'}!`, 'success')
    }
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

  // ── States ──────────────────────────────────────────────────
  if (!isConnected) return <EmptyState variant="no-wallet" />
  if (isWrongChain) return (
    <EmptyState
      variant="wrong-network"
      onAction={() => switchChain({ chainId: robinhoodChain.id })}
    />
  )

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div>
            <div className="wc-mono wc-upper text-[9px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>$WILL Balance</div>
            <div className="wc-mono text-xl font-bold" style={{ color: '#CCFF00' }}>
              {willBalance ?? '—'} WILL
            </div>
          </div>
          <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
        </div>

        {/* Active cat banner */}
        {currentCat ? (
          <div className="active-cat-banner">
            <img src={currentCat.img} alt={currentCat.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Active Cat</div>
              <div className="font-bold text-sm" style={{ color: currentCat.color }}>${currentCat.ticker}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Claimable</div>
              <div className="wc-mono font-bold text-xs text-white">
                {totalClaimable > 0 ? totalClaimable.toFixed(4) : '—'}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState variant="no-cat" />
        )}

        {/* TX state feedback */}
        {claimState === 'signing' && (
          <div className="flex items-center gap-2 wc-mono text-[10px] px-3 py-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Loader2 className="w-3 h-3 animate-spin" />
            Waiting for wallet signature...
          </div>
        )}
        {claimState === 'confirming' && (
          <div className="flex items-center gap-2 wc-mono text-[10px] px-3 py-2 rounded-lg animate-pulse"
            style={{ color: '#CCFF00', background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.15)' }}>
            <Loader2 className="w-3 h-3 animate-spin" />
            Confirming on Robinhood Chain...
          </div>
        )}
        {isChoosePending && (
          <div className="flex items-center gap-2 wc-mono text-[10px] px-3 py-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Loader2 className="w-3 h-3 animate-spin" />
            Switching cat...
          </div>
        )}

        {/* Cat grid */}
        <div className={isMobile ? 'flex flex-col gap-2' : 'cat-grid grid grid-cols-3 gap-3'}>
          {isRewardsLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : CATS.map(cat => {
                const reward = rewards.find(r => r.cat.id === cat.id)
                const weightEntry = catStats.find(s => s.cat.id === cat.id)
                return (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    variant={isMobile ? 'list' : 'grid'}
                    isSelected={currentCat?.id === cat.id}
                    claimable={reward?.formatted}
                    weightPct={weightEntry?.pct}
                    showActions
                    onChoose={() => setChooseCatSheet(cat)}
                    onClaim={handleClaim}
                    isChoosingPending={isChoosePending}
                    claimState={claimState}
                  />
                )
              })
          }
        </div>

        {/* Claim All — triggers confirmation sheet */}
        {totalClaimable > 0 && (
          <motion.button
            onClick={() => claimState === 'idle' ? setClaimAllSheet(true) : undefined}
            disabled={isClaimPending || claimState === 'confirmed'}
            whileHover={claimState === 'idle' ? { scale: 1.015 } : undefined}
            whileTap={claimState === 'idle' ? { scale: 0.985 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="claim-all-btn w-full py-3 font-bold text-sm wc-mono wc-upper disabled:opacity-50 flex items-center justify-center gap-2 rounded-[10px]"
            style={{
              background: claimState === 'confirmed' ? 'rgba(34,197,94,0.12)' : claimState === 'confirming' ? 'rgba(204,255,0,0.12)' : '#CCFF00',
              color: claimState === 'confirmed' ? '#22c55e' : claimState === 'confirming' ? '#CCFF00' : '#0f0f12',
              border: claimState === 'confirming' ? '1px solid rgba(204,255,0,0.3)' : 'none',
            }}
          >
            {(claimState === 'signing' || claimState === 'confirming') && <Loader2 className="w-4 h-4 animate-spin" />}
            {claimState === 'confirmed' && <Check className="w-4 h-4" strokeWidth={3} />}
            {claimState === 'idle'
              ? `Claim All (${totalClaimable.toFixed(4)} ${currentCat?.ticker ?? 'tokens'})`
              : claimState === 'signing' ? 'Signing...'
              : claimState === 'confirming' ? 'Confirming...'
              : '✓ Claimed!'}
          </motion.button>
        )}
      </div>

      {/* ── Bottom Sheet: Cat Confirmation ── */}
      <BottomSheet isOpen={!!chooseCatSheet} onClose={() => setChooseCatSheet(null)}>
        {chooseCatSheet && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CatCard
              cat={chooseCatSheet}
              variant="expanded"
              weightPct={catStats.find(s => s.cat.id === chooseCatSheet.id)?.pct}
              onChoose={() => chooseCat(chooseCatSheet.address)}
              isChoosingPending={isChoosePending}
              claimState="idle"
            />
            <button
              onClick={() => setChooseCatSheet(null)}
              className="w-full py-2.5 wc-mono text-[10px] uppercase tracking-wider rounded-[10px] transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancel
            </button>
          </div>
        )}
      </BottomSheet>

      {/* ── Bottom Sheet: Claim All Confirmation ── */}
      <BottomSheet isOpen={claimAllSheet} onClose={() => setClaimAllSheet(false)}>
        <div className="space-y-4">
          <div className="text-center">
            <p className="font-bold text-white text-lg mb-1">Claim All Rewards?</p>
            <p className="wc-mono text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {claimableRewards.length} cat{claimableRewards.length !== 1 ? 's' : ''} · 1 transaction
            </p>
          </div>

          {/* Claimable list */}
          <div className="space-y-2">
            {claimableRewards.map(r => (
              <div key={r.cat.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={r.cat.img} alt={r.cat.name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-semibold text-white text-sm flex-1">{r.cat.name}</span>
                <span className="wc-mono text-sm font-bold" style={{ color: r.cat.color }}>
                  {r.amount.toFixed(4)} {r.cat.ticker}
                </span>
              </div>
            ))}
          </div>

          {/* Divider + total */}
          <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="wc-mono text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Total</span>
            <span className="wc-mono font-bold text-sm" style={{ color: '#CCFF00' }}>
              {totalClaimable.toFixed(4)} {currentCat?.ticker ?? 'tokens'}
            </span>
          </div>

          <motion.button
            onClick={handleClaim}
            disabled={isClaimPending}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 font-black text-sm wc-mono uppercase tracking-wider rounded-[12px] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#CCFF00', color: '#0f0f12' }}
          >
            {isClaimPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Claim All
          </motion.button>

          <button
            onClick={() => setClaimAllSheet(false)}
            className="w-full py-2.5 wc-mono text-[10px] uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Cancel
          </button>
        </div>
      </BottomSheet>

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
