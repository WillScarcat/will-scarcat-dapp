import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Bot, InputFile } from 'grammy';
import { buildFanfareClip } from './audio.js';
import { formatEth, shortAddr } from './format.js';
import { CROWN_NOTE_COUNT, hashToMelody } from './melody.js';
import type { CrownClaimedLog } from './chain.js';

export function createTelegramBot(token: string): Bot {
  return new Bot(token);
}

export function formatCrownMessage(log: CrownClaimedLog): string {
  return [
    '👑 THE CROWN HAS FALLEN',
    `${shortAddr(log.newHolder)} now rules the forest — ${formatEth(log.amountETH)} ETH`,
    'Their verse plays for every swap. Sing louder to take it.',
    '📯 balladrh.eth.limo',
  ].join('\n');
}

/**
 * Sends the crown announcement text, then best-effort attaches the
 * winner's fanfare as a voice note. Audio failures (missing note clips,
 * ffmpeg not available, etc.) are logged and swallowed — the text alert
 * must always go out regardless of whether the fanfare could be built.
 */
export async function sendCrownAnnouncement(
  bot: Bot,
  chatId: string,
  log: CrownClaimedLog,
  notesDir: string,
): Promise<void> {
  const text = formatCrownMessage(log);
  await bot.api.sendMessage(chatId, text);

  try {
    await sendFanfareVoiceNote(bot, chatId, log, notesDir);
  } catch (err) {
    console.error('[telegram] fanfare voice note failed (text alert already sent):', err);
  }
}

async function sendFanfareVoiceNote(
  bot: Bot,
  chatId: string,
  log: CrownClaimedLog,
  notesDir: string,
): Promise<void> {
  const melody = hashToMelody(log.seed, CROWN_NOTE_COUNT);
  const missing = melody.filter((n) => !existsSync(path.join(notesDir, `${n.note}.ogg`)));
  if (missing.length > 0) {
    throw new Error(
      `note clips missing from ${notesDir} — run "npm run generate:notes" first`,
    );
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'crown-herald-fanfare-'));
  const fanfarePath = path.join(workDir, 'fanfare.ogg');
  try {
    await buildFanfareClip(melody, notesDir, fanfarePath);
    await bot.api.sendVoice(chatId, new InputFile(fanfarePath));
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
