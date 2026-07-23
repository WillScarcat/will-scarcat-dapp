import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { NOTE_FREQUENCIES, SCALE, type BalladNote, type MelodyNote } from './melody.js';

const execFileAsync = promisify(execFile);

// ffmpeg-static is a plain CJS package whose .d.ts (`export default`) doesn't
// interop cleanly with NodeNext ESM default-import resolution — require()
// via createRequire sidesteps the mismatch since the package really is CJS
// at runtime regardless of what its type declarations claim.
const require = createRequire(import.meta.url);
const ffmpegPathRaw = require('ffmpeg-static') as string | null;

export function resolveFfmpegPath(): string {
  if (!ffmpegPathRaw) {
    throw new Error(
      'ffmpeg-static did not resolve a binary for this platform — cannot synthesize audio.',
    );
  }
  return ffmpegPathRaw;
}

/** Placeholder tone: a single sine wave at the note's frequency. Not meant
 *  to sound good — just enough signal to prove the pipeline end-to-end
 *  until real instrument samples replace these. */
export async function synthesizeNoteClip(
  note: BalladNote,
  outPath: string,
  durationSec = 0.45,
): Promise<void> {
  const ffmpeg = resolveFfmpegPath();
  const freq = NOTE_FREQUENCIES[note];
  // libopus, not libvorbis: Telegram's sendVoice requires .ogg encoded with
  // OPUS specifically, or it won't render as a playable voice bubble.
  // Sample rate must be one libopus actually supports (8k/12k/16k/24k/48k) —
  // 44100 (the usual default) is NOT one of them and fails encoder init.
  await execFileAsync(ffmpeg, [
    '-y',
    '-f', 'lavfi',
    '-i', `sine=frequency=${freq}:duration=${durationSec}`,
    '-ac', '1',
    '-ar', '48000',
    '-c:a', 'libopus',
    outPath,
  ]);
}

/** Generates one placeholder .ogg per note in SCALE into `notesDir`. */
export async function generateAllNoteClips(notesDir: string): Promise<void> {
  await mkdir(notesDir, { recursive: true });
  for (const note of SCALE) {
    const outPath = path.join(notesDir, `${note}.ogg`);
    await synthesizeNoteClip(note, outPath);
  }
}

function notePath(notesDir: string, note: BalladNote): string {
  // Must be absolute: ffmpeg's concat demuxer resolves relative paths
  // inside the list file against the *list file's own directory* (a temp
  // dir elsewhere), not the process cwd or notesDir — a relative path here
  // silently resolves to the wrong location and fails with "Impossible to
  // open ...".
  return path.resolve(notesDir, `${note}.ogg`);
}

/** Concatenates the pre-generated per-note clips for `melody`, in order,
 *  into a single .ogg at `outPath`. Assumes generateAllNoteClips has already
 *  populated `notesDir` — callers should generate once at startup/build
 *  time, not on every crown claim. */
export async function buildFanfareClip(
  melody: MelodyNote[],
  notesDir: string,
  outPath: string,
): Promise<void> {
  const ffmpeg = resolveFfmpegPath();
  const listDir = await mkdtemp(path.join(tmpdir(), 'crown-herald-concat-'));
  const listFile = path.join(listDir, 'concat.txt');
  try {
    const lines = melody.map((n) => `file '${notePath(notesDir, n.note)}'`);
    await writeFile(listFile, lines.join('\n'), 'utf8');
    await execFileAsync(ffmpeg, [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', listFile,
      '-c', 'copy',
      outPath,
    ]);
  } finally {
    await rm(listDir, { recursive: true, force: true });
  }
}
