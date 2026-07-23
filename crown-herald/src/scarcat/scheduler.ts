import type { Bot } from 'grammy';
import type { Address } from 'viem';
import type { ChainClient } from '../chain.js';
import { fetchWillStats, fetchRecentTransfers, fetchCatCounts } from './blockscout.js';
import { fetchPairData } from './dexscreener.js';
import { buildMarketData, formatFullReport } from './analysis.js';
import { generateScarcatComment } from './agent.js';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export interface ScarcatSchedulerConfig {
  willToken: Address;
  trackerAddress: Address;
  poolAddress: Address;
  scarcatChatId: string;
  anthropicApiKey: string | null;
}

async function sendScheduledReport(
  bot: Bot,
  client: ChainClient,
  cfg: ScarcatSchedulerConfig,
): Promise<void> {
  try {
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
        const aiComment = await generateScarcatComment(cfg.anthropicApiKey, data);
        report += `\n\n🤖 AI Yorum:\n${aiComment}`;
      } catch (err) {
        console.error('[scarcat/scheduler] AI comment failed:', err);
      }
    }

    await bot.api.sendMessage(cfg.scarcatChatId, report);
    console.log('[scarcat/scheduler] 6h report sent');
  } catch (err) {
    console.error('[scarcat/scheduler] report failed:', err);
  }
}

export function startScarcatScheduler(
  bot: Bot,
  client: ChainClient,
  cfg: ScarcatSchedulerConfig,
): void {
  // Fire immediately, then every 6 hours
  void sendScheduledReport(bot, client, cfg);
  setInterval(() => {
    void sendScheduledReport(bot, client, cfg);
  }, SIX_HOURS_MS);

  console.log('[scarcat/scheduler] started — reports every 6h');
}
