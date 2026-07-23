import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createChainClient, watchCrownClaimed, type CrownClaimedLog } from './chain.js';
import { loadConfig } from './config.js';
import { createDebouncer } from './debounce.js';
import { formatEth, shortAddr } from './format.js';
import { createTelegramBot, sendCrownAnnouncement } from './telegram.js';
import { registerScarcatCommands } from './scarcat/commands.js';
import { startScarcatScheduler } from './scarcat/scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notesDir = path.join(__dirname, '..', 'assets', 'notes');

async function main(): Promise<void> {
  const config = loadConfig();
  const bot = createTelegramBot(config.tgBotToken);
  const client = createChainClient(config);

  // ── BALLAD: CrownClaimed watcher (existing) ──────────────────────────────
  console.log(
    `[crown-herald] watching CrownClaimed on ${config.hookAddress} ` +
      `(chain ${config.chainId}), polling every ${config.pollingIntervalMs}ms, ` +
      `debouncing ${config.debounceMs}ms`,
  );

  const debounced = createDebouncer<CrownClaimedLog>(config.debounceMs, async (log) => {
    console.log(
      `[crown-herald] announcing crown: ${shortAddr(log.newHolder)} — ${formatEth(log.amountETH)} ETH`,
    );
    try {
      await sendCrownAnnouncement(bot, config.tgChatId, log, notesDir);
    } catch (err) {
      console.error('[crown-herald] failed to send Telegram announcement:', err);
    }
  });

  const unwatch = watchCrownClaimed(client, config, (log) => {
    console.log(
      `[crown-herald] CrownClaimed seen: ${shortAddr(log.newHolder)} — ${formatEth(log.amountETH)} ETH ` +
        `(tx ${log.transactionHash ?? 'pending'}) — debouncing`,
    );
    debounced(log);
  });

  // ── SCARCAT Intelligence ──────────────────────────────────────────────────
  const scarcatCfg = {
    willToken: config.willToken,
    trackerAddress: config.trackerAddress,
    poolAddress: config.poolAddress,
    anthropicApiKey: config.anthropicApiKey,
  };

  registerScarcatCommands(bot, client, scarcatCfg);

  startScarcatScheduler(bot, client, {
    ...scarcatCfg,
    scarcatChatId: config.scarcatChatId,
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = (signal: string): void => {
    console.log(`[crown-herald] received ${signal}, shutting down`);
    unwatch();
    void bot.stop();
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // bot.start() handles incoming Telegram updates (commands) via long-polling.
  // It runs indefinitely — must be last.
  await bot.start();
}

main().catch((err: unknown) => {
  console.error('[crown-herald] fatal:', err);
  process.exitCode = 1;
});
