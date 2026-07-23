/**
 * Ported from ballad-web/src/lib/ballad-audio.ts — SCALE and hashToMelody
 * are copied verbatim (no Tone.js/browser-audio dependency here, just the
 * pure byte->note mapping) so this bot resolves the exact same melody for
 * a given seed that the website's on-chain-seeded renderer would.
 */

/** E Dorian, spanning ~2 octaves. Index = byte % SCALE.length. */
export const SCALE = [
  'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'G4', 'A4', 'B4', 'E5',
] as const;

export type BalladNote = (typeof SCALE)[number];

export interface MelodyNote {
  note: BalladNote;
  /** true when byte % 5 === 0 — held longer than a normal pluck */
  long: boolean;
}

/** The Bard's Crown always plays the full 12-note "fanfare" melody. */
export const CROWN_NOTE_COUNT = 12;

/**
 * Every 2 hex chars of `hash` -> one byte -> SCALE[byte % 12].
 * byte % 5 === 0 marks a long (held) note. Wraps around the hash if
 * `count` exceeds the number of bytes available.
 */
export function hashToMelody(hash: string, count: number): MelodyNote[] {
  const clean = hash.startsWith('0x') ? hash.slice(2) : hash;
  const bytes: number[] = [];
  for (let i = 0; i + 2 <= clean.length; i += 2) {
    const byte = parseInt(clean.slice(i, i + 2), 16);
    if (!Number.isNaN(byte)) bytes.push(byte);
  }
  if (bytes.length === 0) bytes.push(0);

  const notes: MelodyNote[] = [];
  for (let i = 0; i < count; i++) {
    const byte = bytes[i % bytes.length];
    notes.push({
      note: SCALE[byte % SCALE.length],
      long: byte % 5 === 0,
    });
  }
  return notes;
}

/** Standard 12-TET frequencies (A4 = 440Hz), used only to synthesize the
 *  placeholder note clips — has no bearing on melody selection itself. */
export const NOTE_FREQUENCIES: Record<BalladNote, number> = {
  E3: 164.814,
  'F#3': 185.0,
  G3: 196.0,
  A3: 220.0,
  B3: 246.942,
  'C#4': 277.183,
  D4: 293.665,
  E4: 329.628,
  G4: 391.995,
  A4: 440.0,
  B4: 493.883,
  E5: 659.255,
};
