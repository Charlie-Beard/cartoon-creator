/**
 * Exports everything the cartoons say to scripts/voice/lines.json, for
 * generate.py to record with ElevenLabs.
 *
 *   npx tsx scripts/voice/export.ts
 *   npm run voice:export
 *
 * Walks the shelf (src/cartoons/<id>/), loads each cartoon and writes
 * one entry per distinct spoken line:
 *
 *   id       voiceId(text, speaker): the clip's file name, public/audio/lines/<id>.mp3
 *   text     what is said, with the child's name filled in or left out
 *   speaker  'narrator' or a character id (scripts/voice/cast.json has its voice)
 *   where    '<cartoon>/<lineKey>', for the review page. If the same words
 *            by the same speaker are in several places, the first is here
 *            and the rest are in `also`.
 *   risky    why ElevenLabs might say it wrong (only when it might)
 *
 * Lines with {name} are recorded twice, like the games do: with
 * DEFAULT_NAME ("Well done, Jasper!") and without ("Well done!").
 * Whole lines only: a cartoon has no questions or numbers to piece together.
 */
import { writeFileSync } from 'node:fs';
import { SHELF } from '../lib/shelf';
import { DEFAULT_NAME, generic, personalise, voiceId } from '../../src/core/phrases';

interface LineOut {
  id: string;
  text: string;
  speaker: string;
  where: string;
  also?: string[];
  risky?: string;
}

/**
 * Words text-to-speech often gets wrong: sounds rather than words (it may
 * spell "Zzz" or "Hmph" out, or skip it), and shouted CAPITALS, which it
 * can read as letters ("EH" → "E. H."). Hear them first with
 * `generate.py --risky` and respell any that come out wrong with say_as in
 * scripts/voice/config.json.
 */
const SOUNDS = /^(h+m+p?h?|u+h+m*|e+r+m+|b+r+|s+h+|p+s+t|t+u+t|g+r+|z{2,}|ugh|eek)$/i;
export function risky(text: string): string | undefined {
  const words = text.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
  const why = [
    ...words.filter((w) => SOUNDS.test(w)).map((w) => `sound “${w}”`),
    ...words.filter((w) => w.length >= 2 && w === w.toUpperCase()).map((w) => `capitals “${w}”`),
    ...(text.match(/[^\w\s.,!?’‘'\-…:;"“”()]/g) ?? []).map((c) => `symbol “${c}”`),
    ...(/(\w)\1\1/.test(text) ? ['stretched letters'] : []),
  ];
  return why.length ? [...new Set(why)].join(', ') : undefined;
}

const lines: LineOut[] = [];
const byId = new Map<string, LineOut>();

const push = (text: string, speaker: string, where: string) => {
  const id = voiceId(text, speaker);
  const have = byId.get(id);
  if (have) {
    if (have.where !== where && !(have.also ?? []).includes(where)) (have.also ??= []).push(where);
    return;
  }
  const why = risky(text);
  const line: LineOut = { id, text, speaker, where, ...(why ? { risky: why } : {}) };
  byId.set(id, line);
  lines.push(line);
};

const add = (template: string, speaker: string, where: string) => {
  if (template.includes('{name}')) {
    push(personalise(template, DEFAULT_NAME), speaker, where);
    push(generic(template), speaker, where);
  } else push(template, speaker, where);
};

for (const entry of SHELF) {
  const cartoon = (await entry.load()).default;
  for (const [key, line] of Object.entries(cartoon.lines)) add(line.text, line.who, `${entry.id}/${key}`);
}

writeFileSync(new URL('./lines.json', import.meta.url), JSON.stringify({ lines }, null, 1) + '\n');

const chars = (xs: { text: string }[]) => xs.reduce((n, x) => n + x.text.length, 0);
console.log(`${SHELF.length} cartoon${SHELF.length === 1 ? '' : 's'} → ${lines.length} lines (${chars(lines).toLocaleString('en-GB')} characters) in scripts/voice/lines.json`);
for (const entry of SHELF) {
  const mine = lines.filter((l) => l.where.startsWith(entry.id + '/'));
  const bySpeaker = new Map<string, number>();
  mine.forEach((l) => bySpeaker.set(l.speaker, (bySpeaker.get(l.speaker) ?? 0) + 1));
  console.log(`  ${entry.id}: ${mine.length} new lines, ${chars(mine).toLocaleString('en-GB')} characters  (${[...bySpeaker].map(([s, n]) => `${s} ${n}`).join(', ')})`);
}
const flagged = lines.filter((l) => l.risky);
if (flagged.length) console.log(`${flagged.length} risky lines (${chars(flagged)} characters): hear them first with generate.py --risky`);
