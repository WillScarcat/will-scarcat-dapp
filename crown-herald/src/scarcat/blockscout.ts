import { parseAbi } from 'viem';
import type { Address } from 'viem';
import type { ChainClient } from '../chain.js';

const BLOCKSCOUT_BASE = 'https://robinhoodchain.blockscout.com/api/v2';

// 1B WILL with 9 decimals — user-specified whale threshold
export const WHALE_THRESHOLD = 1_000_000_000n * 10n ** 9n;

export interface WillStats {
  holderCount: number;
  name: string;
  symbol: string;
  decimals: number;
}

export interface WillTransfer {
  from: Address;
  to: Address;
  valueRaw: bigint;
  txHash: string;
  timestamp: string;
}

// Optimistic ABI — catSelectionCount(uint8) is the most common pattern
// for faction-tracker contracts. Falls back to null if unavailable.
const TRACKER_ABI = parseAbi([
  'function catSelectionCount(uint8 catId) view returns (uint256)',
]);

// Cat names matching OPENCLAW_VISION faction definitions
export const CAT_NAMES: Record<number, string> = {
  0: 'Scarface',
  1: 'Whiskers',
  2: 'Mittens',
  3: 'Shadow',
};

async function bsFetch(path: string): Promise<unknown> {
  const res = await fetch(`${BLOCKSCOUT_BASE}${path}`);
  if (!res.ok) throw new Error(`Blockscout ${res.status}: ${path}`);
  return res.json();
}

export async function fetchWillStats(tokenAddress: Address): Promise<WillStats> {
  const data = (await bsFetch(`/tokens/${tokenAddress}`)) as {
    holders_count?: string | number;
    name?: string;
    symbol?: string;
    decimals?: string | number;
  };
  return {
    holderCount: Number(data.holders_count ?? 0),
    name: data.name ?? 'Will Scarcat',
    symbol: data.symbol ?? 'WILL',
    decimals: Number(data.decimals ?? 18),
  };
}

export async function fetchRecentTransfers(
  tokenAddress: Address,
): Promise<WillTransfer[]> {
  const data = (await bsFetch(
    `/tokens/${tokenAddress}/transfers`,
  )) as {
    items?: Array<{
      from: { hash: string };
      to: { hash: string };
      total: { value: string };
      tx_hash: string;
      timestamp: string;
    }>;
  };
  return (data.items ?? []).map((t) => ({
    from: t.from.hash as Address,
    to: t.to.hash as Address,
    valueRaw: BigInt(t.total.value),
    txHash: t.tx_hash,
    timestamp: t.timestamp,
  }));
}

export async function fetchCatCounts(
  client: ChainClient,
  trackerAddress: Address,
): Promise<Record<number, number> | null> {
  try {
    const counts = await Promise.all(
      [0, 1, 2, 3].map((catId) =>
        client.readContract({
          address: trackerAddress,
          abi: TRACKER_ABI,
          functionName: 'catSelectionCount',
          args: [catId],
        }),
      ),
    );
    return Object.fromEntries(counts.map((c, i) => [i, Number(c)]));
  } catch {
    // TRACKER ABI unconfirmed — return null and commands handle gracefully
    return null;
  }
}

export function filterWhales(transfers: WillTransfer[]): WillTransfer[] {
  return transfers.filter((t) => t.valueRaw >= WHALE_THRESHOLD);
}

/** Format raw WILL amount to human-readable (no decimals on large numbers). */
export function formatWill(rawAmount: bigint): string {
  const whole = rawAmount / 10n ** 9n;
  return Number(whole).toLocaleString('en-US');
}

// ── Claw Score veri kaynakları ────────────────────────────────────────────────

export interface WalletProfile {
  balanceWill: bigint;       // raw WILL balance (9 dec)
  holdDays: number;          // days since first WILL transfer
  txCount: number;           // total on-chain tx count (community proxy)
}

export async function fetchWalletProfile(
  tokenAddress: Address,
  walletAddress: Address,
): Promise<WalletProfile> {
  const [balData, txData, firstTransfer] = await Promise.all([
    bsFetch(`/addresses/${walletAddress}/token-balances`) as Promise<
      Array<{ token: { address: string }; value: string }>
    >,
    bsFetch(`/addresses/${walletAddress}`) as Promise<{ tx_count?: number }>,
    bsFetch(
      `/tokens/${tokenAddress}/transfers?limit=1&sort=asc&filter=to:${walletAddress}`,
    ) as Promise<{ items?: Array<{ timestamp: string }> }>,
  ]);

  const willEntry = (balData as Array<{ token: { address: string }; value: string }>)
    .find((b) => b.token.address.toLowerCase() === tokenAddress.toLowerCase());
  const balanceWill = BigInt(willEntry?.value ?? '0');

  const txCount = Number((txData as { tx_count?: number }).tx_count ?? 0);

  const firstTs = (firstTransfer as { items?: Array<{ timestamp: string }> }).items?.[0]?.timestamp;
  const holdDays = firstTs
    ? Math.floor((Date.now() - new Date(firstTs).getTime()) / 86_400_000)
    : 0;

  return { balanceWill, holdDays, txCount };
}
