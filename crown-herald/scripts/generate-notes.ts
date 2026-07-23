/**
 * npm run generate:notes
 *
 * Synthesizes one placeholder .ogg per SCALE note into assets/notes/.
 * Run once (locally or in CI/Docker build) before the bot needs to build a
 * fanfare clip — buildFanfareClip() assumes these already exist.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateAllNoteClips } from '../src/audio.js';
import { SCALE } from '../src/melody.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notesDir = path.join(__dirname, '..', 'assets', 'notes');

async function main(): Promise<void> {
  console.log(`Generating ${SCALE.length} placeholder note clips into ${notesDir} ...`);
  await generateAllNoteClips(notesDir);
  console.log('Done:', SCALE.map((n) => `${n}.ogg`).join(', '));
}

main().catch((err: unknown) => {
  console.error('generate-notes failed:', err);
  process.exitCode = 1;
});
