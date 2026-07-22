'use client'

import { useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Cat, Loader2, CheckCircle, X, AlertTriangle } from 'lucide-react'
import CatCard from './CatCard'
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
  const { rewards, refetch } = useRewards(address)
  const { chooseCat, isPending: isChoosePending, isSuccess: isChooseSuccess, error: chooseError } = useChooseCat()
  const { claim, isPending: isClaimPending, isSuccess: isClaimSuccess, error: claimError, reset: resetClaim } = useClaim()
  const { stats: catStats } = useCatStats()

  useEffect(() => {
    if (isClaimSuccess) {
      navigator.vibrate?.(200)
      refetch()
    }
  }, [isClaimSuccess, refetch])

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

  const totalClaimable = rewards.reduce((acc, r) => acc + r.amount, 0)

  return (
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

      {/* Active cat */}
      {currentCat ? (
        <div className="border border-wc-border bg-wc-black px-4 py-2.5 flex items-center gap-3">
          <span className="wc-mono wc-upper text-[9px] text-wc-muted">Active cat:</span>
          <span className="wc-mono wc-upper font-bold text-sm" style={{ color: currentCat.color }}>
            ${currentCat.ticker}
          </span>
          <span className="wc-badge wc-badge-green ml-auto">CHOSEN</span>
        </div>
      ) : (
        <div className="border border-wc-border px-4 py-2.5 wc-mono text-[10px] text-wc-muted">
          No cat chosen yet — CashCat distributes by default.
        </div>
      )}

      {/* TX feedback */}
      {isChoosePending && (
        <div className="flex items-center gap-2 wc-mono text-[10px] text-wc-muted border border-wc-border px-3 py-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Switching cat...
        </div>
      )}
      {isChooseSuccess && !isChoosePending && (
        <div className="flex items-center gap-2 wc-mono text-[10px] text-green-400 border border-green-400/20 px-3 py-2">
          <CheckCircle className="w-3 h-3" />
          Cat switched!
        </div>
      )}
      {chooseError && (
        <div className="flex items-center gap-2 wc-mono text-[10px] text-red-400 border border-red-400/20 px-3 py-2">
          <X className="w-3 h-3" />
          Transaction failed
        </div>
      )}

      {/* Cat grid */}
      <div className="grid grid-cols-2 gap-px md:grid-cols-3 bg-wc-border border border-wc-border">
        {CATS.map(cat => {
          const reward = rewards.find(r => r.cat.id === cat.id)
          const weightEntry = catStats.find(s => s.cat.id === cat.id)
          return (
            <div key={cat.id} className="bg-wc-black">
              <CatCard
                cat={cat}
                isSelected={currentCat?.id === cat.id}
                claimable={reward?.formatted}
                weightPct={weightEntry?.pct}
                showActions
                onChoose={() => chooseCat(cat.address)}
                onClaim={() => claim()}
                isChoosingPending={isChoosePending}
                isClaimPending={isClaimPending}
              />
            </div>
          )
        })}
      </div>

      {/* Claim feedback */}
      {isClaimPending && (
        <div className="flex items-center gap-2 wc-mono text-[10px] text-wc-muted border border-wc-border px-3 py-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Claiming...
        </div>
      )}
      {isClaimSuccess && !isClaimPending && (
        <div className="flex items-center justify-between wc-mono text-[10px] text-green-400 border border-green-400/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Claimed successfully!
          </div>
          <button onClick={resetClaim}><X className="w-3 h-3 text-wc-muted" /></button>
        </div>
      )}
      {claimError && !isClaimPending && (
        <div className="flex items-center justify-between wc-mono text-[10px] text-red-400 border border-red-400/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <X className="w-3 h-3" />
            Claim failed
          </div>
          <button onClick={resetClaim}><X className="w-3 h-3 text-wc-muted" /></button>
        </div>
      )}

      {/* Claim All */}
      {totalClaimable > 0 && (
        <button
          onClick={() => claim()}
          disabled={isClaimPending}
          className="w-full bg-wc-green py-3 font-bold text-black text-sm wc-mono wc-upper hover:bg-[#b8e600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isClaimPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Claiming...</>
          ) : (
            `Claim All (${totalClaimable.toFixed(6)} ${currentCat?.ticker ?? 'tokens'})`
          )}
        </button>
      )}
    </div>
  )
}
