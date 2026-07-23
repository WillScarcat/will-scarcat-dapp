import type { WillStats, WillTransfer, WalletProfile } from './blockscout.js';
import { filterWhales, formatWill, CAT_NAMES } from './blockscout.js';
import type { PairData } from './dexscreener.js';
import { washTradingVerdict, isPriceAlert } from './dexscreener.js';

export interface WillMarketData {
  stats: WillStats;
  pair: PairData;
  whales: WillTransfer[];
  washScore: number;            // 0-100
  washVerdict: 'clean' | 'suspicious' | 'likely_wash';
  priceAlert: boolean;
  catCounts: Record<number, number> | null;
  transfer24hCount: number;
}

export function buildMarketData(
  stats: WillStats,
  pair: PairData,
  transfers: WillTransfer[],
  catCounts: Record<number, number> | null,
): WillMarketData {
  const whales = filterWhales(transfers);

  // Wash score: maps ratio to 0-100 scale capped at likely_wash threshold (30x = 100)
  const washScore = Math.min(Math.round((pair.washRatio / 30) * 100), 100);
  const washVerdict = washTradingVerdict(pair.washRatio);

  return {
    stats,
    pair,
    whales,
    washScore,
    washVerdict,
    priceAlert: isPriceAlert(pair.priceChangeH24),
    catCounts,
    transfer24hCount: transfers.length,
  };
}

// ── Formatters ──────────────────────────────────────────────────────────────

export function formatPriceMessage(pair: PairData): string {
  const changeSign = pair.priceChangeH24 >= 0 ? '+' : '';
  const alertTag = isPriceAlert(pair.priceChangeH24) ? ' ⚠️' : '';
  return [
    `💰 $WILL Fiyat`,
    `ETH: ${pair.priceNative}${pair.priceUsd ? ` ($${Number(pair.priceUsd).toFixed(8)})` : ''}`,
    `24s değişim: ${changeSign}${pair.priceChangeH24.toFixed(2)}%${alertTag}`,
    `6s değişim: ${pair.priceChangeH6 >= 0 ? '+' : ''}${pair.priceChangeH6.toFixed(2)}%`,
  ].join('\n');
}

export function formatWhaleMessage(whales: WillTransfer[]): string {
  if (whales.length === 0) return '🐳 Son transferlerde whale hareketi yok.';
  const lines = whales.slice(0, 5).map((t) => {
    const from = `${t.from.slice(0, 6)}…${t.from.slice(-4)}`;
    const to = `${t.to.slice(0, 6)}…${t.to.slice(-4)}`;
    return `🐳 ${formatWill(t.valueRaw)} WILL\n   ${from} → ${to}`;
  });
  return `🐳 Büyük Transferler (>1B WILL)\n\n${lines.join('\n\n')}`;
}

export function formatWashMessage(pair: PairData, score: number, verdict: WillMarketData['washVerdict']): string {
  const icon = verdict === 'likely_wash' ? '🔴' : verdict === 'suspicious' ? '🟡' : '🟢';
  const label = verdict === 'likely_wash' ? 'ŞÜPHELI WASH TRADING' : verdict === 'suspicious' ? 'Şüpheli' : 'Temiz';
  return [
    `${icon} Wash Trading Analizi`,
    `Hacim/Likidite oranı: ${pair.washRatio.toFixed(1)}x`,
    `Skor: ${score}/100`,
    `Karar: ${label}`,
    `Vol 24s: $${pair.volume24h.toLocaleString('en-US')}`,
    `Likidite: $${pair.liquidityUsd.toLocaleString('en-US')}`,
  ].join('\n');
}

export function formatCatMessage(catCounts: Record<number, number> | null): string {
  if (catCounts === null) {
    return '🐱 Kedi seçim verisi henüz mevcut değil.\n(TRACKER ABI onaylanınca aktif olacak)';
  }
  const total = Object.values(catCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return '🐱 Henüz kedi seçimi yapılmamış.';

  const lines = [0, 1, 2, 3].map((id) => {
    const count = catCounts[id] ?? 0;
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
    const bar = '█'.repeat(Math.round(Number(pct) / 5)).padEnd(20, '░');
    return `${CAT_NAMES[id]}: ${bar} ${pct}% (${count})`;
  });
  return `🐱 Kedi Seçim Dağılımı (toplam: ${total})\n\n${lines.join('\n')}`;
}

export function formatFullReport(data: WillMarketData): string {
  const changeSign = data.pair.priceChangeH24 >= 0 ? '+' : '';
  const washIcon = data.washVerdict === 'likely_wash' ? '🔴' : data.washVerdict === 'suspicious' ? '🟡' : '🟢';
  const priceAlertLine = data.priceAlert
    ? `\n⚠️ FİYAT ALARMI: 24s'te %${Math.abs(data.pair.priceChangeH24).toFixed(1)} hareket!`
    : '';

  const catSection = data.catCounts !== null
    ? `\n🐱 Kedi Liderliği: ${leadingCat(data.catCounts)}`
    : '';

  return [
    `🐾 SCARCAT Intelligence Raporu`,
    `━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `💰 $WILL: ${data.pair.priceNative} ETH`,
    `   ${changeSign}${data.pair.priceChangeH24.toFixed(2)}% (24s)${priceAlertLine}`,
    ``,
    `📊 Piyasa`,
    `   Vol 24s: $${data.pair.volume24h.toLocaleString('en-US')}`,
    `   Likidite: $${data.pair.liquidityUsd.toLocaleString('en-US')}`,
    `   Al/Sat: ${data.pair.buys24h}/${data.pair.sells24h} (24s)`,
    `   ${washIcon} Wash skoru: ${data.washScore}/100`,
    ``,
    `👥 Sahipler: ${data.stats.holderCount.toLocaleString('en-US')}`,
    `🔄 24s transfer: ${data.transfer24hCount}`,
    `🐳 Whale (>1B): ${data.whales.length} transfer`,
    `${catSection}`,
    ``,
    `Powered by SCARCAT Intelligence 🐾`,
  ].join('\n');
}

// ── Claw Score ───────────────────────────────────────────────────────────────
// CS = α(min[W/10^6, 1]) + β(min[T_hold/30, 1]) + γ(C) + δ(F) + ε
// Weights (out of 100): α=30 β=30 γ=20 δ=15 ε=5
const CS_ALPHA = 30;
const CS_BETA = 30;
const CS_GAMMA = 20;
const CS_DELTA = 15;
const CS_EPSILON = 5;

// Community score: saturates at 100 transactions (C → 1.0)
const COMMUNITY_TX_CAP = 100;

// Faction: 1.0 if holder has chosen a cat, 0 otherwise
export interface ClawScoreInput {
  profile: WalletProfile;
  hasFaction: boolean; // true if wallet has picked a cat
}

export interface ClawScoreResult {
  total: number;        // 0-100
  walletComponent: number;
  holdComponent: number;
  communityComponent: number;
  factionComponent: number;
  bonusComponent: number;
  tier: 'Pawn' | 'Claw' | 'Fang' | 'Scarcat';
}

export function computeClawScore(input: ClawScoreInput): ClawScoreResult {
  const { profile, hasFaction } = input;

  const willUnits = Number(profile.balanceWill / 10n ** 9n);
  const wFactor = Math.min(willUnits / 1_000_000, 1);
  const tFactor = Math.min(profile.holdDays / 30, 1);
  const cFactor = Math.min(profile.txCount / COMMUNITY_TX_CAP, 1);
  const fFactor = hasFaction ? 1 : 0;

  const walletComponent = CS_ALPHA * wFactor;
  const holdComponent = CS_BETA * tFactor;
  const communityComponent = CS_GAMMA * cFactor;
  const factionComponent = CS_DELTA * fFactor;
  const bonusComponent = CS_EPSILON;

  const total = Math.round(walletComponent + holdComponent + communityComponent + factionComponent + bonusComponent);

  const tier: ClawScoreResult['tier'] =
    total >= 80 ? 'Scarcat'
    : total >= 55 ? 'Fang'
    : total >= 30 ? 'Claw'
    : 'Pawn';

  return { total, walletComponent, holdComponent, communityComponent, factionComponent, bonusComponent, tier };
}

export function formatClawMessage(wallet: string, result: ClawScoreResult, profile: WalletProfile): string {
  const tierIcon: Record<ClawScoreResult['tier'], string> = {
    Scarcat: '🐾',
    Fang: '🦷',
    Claw: '⚔️',
    Pawn: '🪨',
  };
  const icon = tierIcon[result.tier];
  const willBalance = Number(profile.balanceWill / 10n ** 9n).toLocaleString('en-US');
  const short = `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;

  return [
    `${icon} Claw Score — ${short}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Toplam: ${result.total}/100 — ${result.tier}`,
    ``,
    `💰 Bakiye   : ${willBalance} WILL  (+${result.walletComponent.toFixed(1)})`,
    `⏳ Hold      : ${profile.holdDays}g          (+${result.holdComponent.toFixed(1)})`,
    `🤝 Topluluk : ${profile.txCount} tx        (+${result.communityComponent.toFixed(1)})`,
    `🐱 Fraksiyon: ${result.factionComponent > 0 ? 'Seçildi' : 'Yok'}     (+${result.factionComponent.toFixed(1)})`,
    `✨ Bonus     :              +${result.bonusComponent.toFixed(1)}`,
    ``,
    `Powered by SCARCAT-QUANT 🐾`,
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

function leadingCat(catCounts: Record<number, number>): string {
  let maxId = 0;
  let maxCount = 0;
  for (const [idStr, count] of Object.entries(catCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxId = Number(idStr);
    }
  }
  return `${CAT_NAMES[maxId] ?? 'Bilinmiyor'} (${maxCount} seçim)`;
}
