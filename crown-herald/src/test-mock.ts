/**
 * npm run test:mock
 *
 * Exercises the full announce pipeline (debounce -> melody -> message
 * format -> Telegram send) against fabricated CrownClaimed events, without
 * touching the chain. Two modes, picked automatically:
 *
 *  - TG_BOT_TOKEN + TG_CHAT_ID set (e.g. via .env): actually sends the
 *    formatted message + fanfare voice note, so you can eyeball a real
 *    Telegram message end-to-end.
 *  - Neither set: dry-run — logs what would have been sent and exits 0.
 *    Safe to run in CI with no secrets configured.
 *
 * Also fires three fake CrownClaimed events in a tight burst to prove the
 * debouncer coalesces them into a single announcement (the third/largest).
 */
import 'dotenv/config';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Address } from 'viem';
import { createDebouncer } from './debounce.js';
import { formatEth, shortAddr } from './format.js';
import { hashToMelody, CROWN_NOTE_COUNT } from './melody.js';
import { createTelegramBot, formatCrownMessage, sendCrownAnnouncement } from './telegram.js';
import type { CrownClaimedLog } from './chain.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notesDir = path.join(__dirname, '..', 'assets', 'notes');

const MOCK_DEBOUNCE_MS = 1000;

/** Deterministic but varied 32-byte hash, so the demo melody isn't just one
 *  repeated note — real on-chain seeds have this much entropy too. */
function fakeSeed(label: string): `0x${string}` {
  return `0x${createHash('sha256').update(label).digest('hex')}`;
}

function fakeLog(holder: Address, amountEth: string, seedLabel: string): CrownClaimedLog {
  return {
    newHolder: holder,
    amountETH: BigInt(Math.round(Number(amountEth) * 1e18)),
    seed: fakeSeed(seedLabel),
    transactionHash: `0x${'ab'.repeat(32)}` as `0x${string}`,
    logIndex: 0,
  };
}

async function main(): Promise<void> {
  const dryRun = !process.env.TG_BOT_TOKEN || !process.env.TG_CHAT_ID;
  console.log(`[test:mock] mode: ${dryRun ? 'dry-run (no TG_BOT_TOKEN/TG_CHAT_ID set)' : 'live send'}`);

  const burst: CrownClaimedLog[] = [
    fakeLog('0x1111111111111111111111111111111111111111', '0.005', 'a1'),
    fakeLog('0x2222222222222222222222222222222222222222', '0.01', 'b2'),
    fakeLog('0x3333333333333333333333333333333333333333', '0.02', 'c3'),
  ];

  let handledCount = 0;
  const done = new Promise<CrownClaimedLog>((resolve) => {
    const debounced = createDebouncer<CrownClaimedLog>(MOCK_DEBOUNCE_MS, async (log) => {
      handledCount += 1;
      resolve(log);
    });
    for (const log of burst) {
      console.log(`[test:mock] firing fake CrownClaimed: ${shortAddr(log.newHolder)} — ${formatEth(log.amountETH)} ETH`);
      debounced(log);
    }
  });

  const winner = await done;

  console.log(`[test:mock] debouncer fired ${handledCount} time(s) for ${burst.length} events (expected 1)`);
  if (handledCount !== 1 || winner.newHolder !== burst[burst.length - 1].newHolder) {
    throw new Error('debounce did not coalesce the burst into the final event as expected');
  }

  const melody = hashToMelody(winner.seed, CROWN_NOTE_COUNT);
  console.log('[test:mock] resolved melody:', melody.map((n) => (n.long ? `${n.note}*` : n.note)).join(' '));
  console.log('[test:mock] message:\n' + formatCrownMessage(winner));

  if (dryRun) {
    console.log('[test:mock] dry-run complete — set TG_BOT_TOKEN + TG_CHAT_ID to actually send.');
    return;
  }

  const bot = createTelegramBot(process.env.TG_BOT_TOKEN as string);
  await sendCrownAnnouncement(bot, process.env.TG_CHAT_ID as string, winner, notesDir);
  console.log('[test:mock] sent to Telegram.');
}

main().catch((err: unknown) => {
  console.error('[test:mock] FAILED:', err);
  process.exitCode = 1;
});
