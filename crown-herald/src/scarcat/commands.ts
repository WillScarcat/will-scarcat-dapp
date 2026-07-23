import type { Bot } from 'grammy';
import type { Address } from 'viem';
import type { ChainClient } from '../chain.js';
import { fetchWillStats, fetchRecentTransfers, fetchCatCounts, fetchWalletProfile } from './blockscout.js';
import { fetchPairData, washTradingVerdict } from './dexscreener.js';
import {
  buildMarketData,
  formatFullReport,
  formatPriceMessage,
  formatWhaleMessage,
  formatWashMessage,
  formatCatMessage,
  computeClawScore,
  formatClawMessage,
} from './analysis.js';
import { generateScarcatComment } from './agent.js';

export interface ScarcatCommandsConfig {
  willToken: Address;
  trackerAddress: Address;
  poolAddress: Address;
  anthropicApiKey: string | null;
}

async function withErrorReply(
  bot: Bot,
  chatId: number | string,
  fn: () => Promise<string>,
): Promise<void> {
  try {
    const text = await fn();
    await bot.api.sendMessage(chatId, text);
  } catch (err) {
    console.error('[scarcat/commands] error:', err);
    await bot.api.sendMessage(chatId, '🐱 Veri alınamadı. Birazdan tekrar dene!');
  }
}

export function registerScarcatCommands(
  bot: Bot,
  client: ChainClient,
  cfg: ScarcatCommandsConfig,
): void {
  // /scarcat — tam piyasa raporu
  bot.command('scarcat', async (ctx) => {
    const chatId = ctx.chat.id;
    await withErrorReply(bot, chatId, async () => {
      const [stats, transfers, pair, catCounts] = await Promise.all([
        fetchWillStats(cfg.willToken),
        fetchRecentTransfers(cfg.willToken),
        fetchPairData(cfg.poolAddress),
        fetchCatCounts(client, cfg.trackerAddress),
      ]);
      const data = buildMarketData(stats, pair, transfers, catCounts);
      let report = formatFullReport(data);

      if (cfg.anthropicApiKey !== null) {
        try {
          const comment = await generateScarcatComment(cfg.anthropicApiKey, data);
          report += `\n\n🤖 AI Yorum:\n${comment}`;
        } catch {
          // AI optional — don't fail the whole command
        }
      }
      return report;
    });
  });

  // /price — sadece fiyat
  bot.command('price', async (ctx) => {
    const chatId = ctx.chat.id;
    await withErrorReply(bot, chatId, async () => {
      const pair = await fetchPairData(cfg.poolAddress);
      return formatPriceMessage(pair);
    });
  });

  // /whales — büyük transferler
  bot.command('whales', async (ctx) => {
    const chatId = ctx.chat.id;
    await withErrorReply(bot, chatId, async () => {
      const transfers = await fetchRecentTransfers(cfg.willToken);
      const data = buildMarketData(
        { holderCount: 0, name: 'Will Scarcat', symbol: 'WILL', decimals: 9 },
        { priceNative: '0', priceUsd: null, volume24h: 0, liquidityUsd: 0,
          priceChangeH24: 0, priceChangeH6: 0, buys24h: 0, sells24h: 0, washRatio: 0 },
        transfers,
        null,
      );
      return formatWhaleMessage(data.whales);
    });
  });

  // /cats — kedi seçim dağılımı
  bot.command('cats', async (ctx) => {
    const chatId = ctx.chat.id;
    await withErrorReply(bot, chatId, async () => {
      const catCounts = await fetchCatCounts(client, cfg.trackerAddress);
      return formatCatMessage(catCounts);
    });
  });

  // /wash — wash trading analizi
  bot.command('wash', async (ctx) => {
    const chatId = ctx.chat.id;
    await withErrorReply(bot, chatId, async () => {
      const pair = await fetchPairData(cfg.poolAddress);
      const score = Math.min(Math.round((pair.washRatio / 30) * 100), 100);
      const verdict = washTradingVerdict(pair.washRatio);
      return formatWashMessage(pair, score, verdict);
    });
  });

  // /claw <adres> — Claw Score hesapla
  bot.command('claw', async (ctx) => {
    const chatId = ctx.chat.id;
    const arg = ctx.match?.trim();
    if (!arg || !/^0x[0-9a-fA-F]{40}$/.test(arg)) {
      await bot.api.sendMessage(chatId, '🐾 Kullanım: /claw 0xADRES');
      return;
    }
    const wallet = arg as Address;
    await withErrorReply(bot, chatId, async () => {
      const profile = await fetchWalletProfile(cfg.willToken, wallet);
      // Faction: check if catCounts contract is reachable and the wallet holds >0 WILL
      // We use hasFaction=true heuristic when balance > 0 and tracker is active
      let hasFaction = false;
      try {
        const counts = await fetchCatCounts(client, cfg.trackerAddress);
        hasFaction = counts !== null && profile.balanceWill > 0n;
      } catch { /* optional */ }

      const result = computeClawScore({ profile, hasFaction });
      return formatClawMessage(wallet, result, profile);
    });
  });

  console.log('[scarcat/commands] registered: /scarcat /price /whales /cats /wash /claw');
}
