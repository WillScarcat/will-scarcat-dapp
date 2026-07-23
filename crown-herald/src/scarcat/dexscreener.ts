// DexScreener uses lowercase chain slugs. Robinhood Chain = 'robinhood'.
const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex';

// vol/liq ratio above this is flagged suspicious (user spec: 30x)
export const WASH_RATIO_THRESHOLD = 30;

export interface PairData {
  priceNative: string;   // WILL price in ETH
  priceUsd: string | null;
  volume24h: number;     // USD
  liquidityUsd: number;
  priceChangeH24: number; // percentage, can be negative
  priceChangeH6: number;
  buys24h: number;
  sells24h: number;
  washRatio: number;     // volume / liquidity — >30 = suspicious
}

interface DexScreenerPairRaw {
  priceNative?: string;
  priceUsd?: string;
  volume?: { h24?: number; h6?: number };
  liquidity?: { usd?: number };
  priceChange?: { h24?: number; h6?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
}

interface DexScreenerResponse {
  pairs?: DexScreenerPairRaw[] | null;
}

export async function fetchPairData(poolAddress: string): Promise<PairData> {
  const url = `${DEXSCREENER_BASE}/pairs/robinhood/${poolAddress}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`DexScreener ${res.status}: ${url}`);

  const body = (await res.json()) as DexScreenerResponse;
  const pair = body.pairs?.[0];
  if (!pair) throw new Error('DexScreener: no pair data returned');

  const volume24h = pair.volume?.h24 ?? 0;
  const liquidityUsd = pair.liquidity?.usd ?? 0;
  const washRatio = liquidityUsd > 0 ? volume24h / liquidityUsd : 0;

  return {
    priceNative: pair.priceNative ?? '0',
    priceUsd: pair.priceUsd ?? null,
    volume24h,
    liquidityUsd,
    priceChangeH24: pair.priceChange?.h24 ?? 0,
    priceChangeH6: pair.priceChange?.h6 ?? 0,
    buys24h: pair.txns?.h24?.buys ?? 0,
    sells24h: pair.txns?.h24?.sells ?? 0,
    washRatio,
  };
}

export function washTradingVerdict(ratio: number): 'clean' | 'suspicious' | 'likely_wash' {
  if (ratio > WASH_RATIO_THRESHOLD) return 'likely_wash';
  if (ratio > 5) return 'suspicious';
  return 'clean';
}

/** Returns true when the 24h price moved more than thresholdPct % in either direction. */
export function isPriceAlert(priceChangeH24: number, thresholdPct = 20): boolean {
  return Math.abs(priceChangeH24) >= thresholdPct;
}
