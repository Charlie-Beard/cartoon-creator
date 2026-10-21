/**
 * Checks cartoons against the house rules before they reach the iPad.
 *
 *   npx tsx scripts/check-cartoon.ts            # every cartoon on the shelf
 *   npx tsx scripts/check-cartoon.ts lost-kettle
 *   npm run check -- lost-kettle
 *
 * For each cartoon:
 *   - its lines pass checkLines (known speakers, short sentences, UK
 *     English, nothing cruel, only {name} filled in)
 *   - every line is used by the script (an unused line would be recorded
 *     for nothing) and every line the script says exists
 *   - every character, pose, backdrop and prop it asks for exists in a world
 *   - there are at least 5 of his turns (k.tapToHelp or k.dragToHelp)
 *   - the folder, its meta.ts and the script agree, and the id is kebab-case
 *   - how long the speech alone runs, and roughly how long the episode runs on
 *     screen (speech × 1.15, plus about 25 s for each turn he waits out)
 *   - its meta.ts has an episode ledger (what the episode is about), whose
 *     characters and places exist and match the script (an error), and
 *     which is compared with the episodes already on the shelf: a repeated
 *     villain, main place, turn, problem or running joke is a warning
 *
 *   npm run check -- --ledger    prints every episode's ledger, newest first
 *                                and grouped by world, to read before planning
 *
 * Exits 1 if any cartoon has an error. Warnings are printed but allowed.
 * The checks themselves are in scripts/lib/cartoon-lint.ts (also run by
 * tests/unit/cartoon-lint.test.ts).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { isKebab } from '../src/core/cartoon';
import { WORLDS } from '../src/worlds';
import { catalogue } from './lib/catalogue';
import { compareLedgers, formatLedgers, lintCartoon, lintLedger } from './lib/cartoon-lint';
import { folderOf, SHELF, sourceOf } from './lib/shelf';

// Character ids to names for the messages ('dameSnap' → 'Dame Snap').
const names: Record<string, string> = {};
for (const w of Object.values(WORLDS)) for (const [id, c] of Object.entries(w.characters)) names[id] = c.name;
const nameOf = (id: string): string => names[id] ?? id;

if (process.argv.includes('--ledger')) {
  console.log(SHELF.length ? formatLedgers(SHELF, nameOf) : 'The shelf is empty: no ledgers yet.');
  process.exit(0);
}

const asks = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const unknown = asks.filter((id) => !SHELF.some((c) => c.id === id));
if (unknown.length) {
  console.error(`Not on the shelf (no src/cartoons/<id>/meta.ts): ${unknown.join(', ')}`);
  console.error(`On the shelf: ${SHELF.map((c) => c.id).join(', ') || '(nothing yet)'}`);
  process.exit(1);
}
const chosen = asks.length ? SHELF.filter((c) => asks.includes(c.id)) : SHELF;
if (!chosen.length) {
  console.log('The shelf is empty: nothing to check.');
  process.exit(0);
}

const cat = catalogue();
let failed = 0;

for (const entry of chosen) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (!isKebab(entry.id)) errors.push(`id "${entry.id}" is not kebab-case`);
  const folder = folderOf(entry.id);
  if (!existsSync(join(folder, 'cartoon.ts'))) {
    errors.push(`src/cartoons/${entry.id}/cartoon.ts does not exist (a cartoon is a folder named after its id, with meta.ts and cartoon.ts)`);
  } else {
    let cartoon;
    try {
      cartoon = (await entry.load()).default;
    } catch (e) {
      errors.push(`could not load: ${e instanceof Error ? e.message : String(e)}`);
    }
    if (cartoon) {
      for (const k of ['id', 'title', 'world', 'summary'] as const) {
        if (cartoon[k] !== entry[k]) errors.push(`meta.ts ${k} "${entry[k]}" differs from the script's "${cartoon[k]}" (spread ...meta into defineCartoon)`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.added)) errors.push(`meta.ts added "${entry.added}" is not a date (YYYY-MM-DD)`);
      if (!(cartoon.world in WORLDS)) errors.push(`world "${cartoon.world}" does not exist`);
      if (cartoon.scenes.length < 2) warnings.push(`only ${cartoon.scenes.length} scene: an episode has a few`);
      if (cartoon.scenes.length > 7) warnings.push(`${cartoon.scenes.length} scenes: a 5 minute episode rarely needs more than 6`);
      const result = lintCartoon({ id: entry.id, source: sourceOf(entry.id), lines: cartoon.lines, catalogue: cat });
      errors.push(...result.errors);
      warnings.push(...result.warnings);
      const ledger = lintLedger({ ledger: entry.ledger, source: sourceOf(entry.id), lines: cartoon.lines, taps: result.taps, catalogue: cat });
      errors.push(...ledger.errors);
      warnings.push(...ledger.warnings);
      warnings.push(...compareLedgers(entry, SHELF, nameOf));
      const n = Object.keys(cartoon.lines).length;
      // On screen it runs about 1.1–1.2 × the speech (measured on the episodes so far: the
      // action between lines, less the nudge and helped lines that a tapping child never hears),
      // and each turn he waits out adds about 25 s.
      const onScreen = result.spokenSeconds * 1.15;
      const mmss = (s: number): string => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
      if (onScreen < 120) warnings.push(`about ${mmss(onScreen)} on screen: under the 2 minute floor (add a beat or a few lines)`);
      if (onScreen > 360) warnings.push(`about ${mmss(onScreen)} on screen: over the 6 minute ceiling (trim lines)`);
      else if (onScreen + result.taps * 25 > 480) warnings.push(`up to ${mmss(onScreen + result.taps * 25)} on screen if he waits out every turn: long (fine if a real run with --no-tap says otherwise)`);
      info.push(
        `${cartoon.scenes.length} scenes, ${n} lines, about ${Math.round(result.spokenSeconds)} s of speech, ${result.taps} turns for him`,
        `on screen: about ${mmss(onScreen)} if he taps, up to ${mmss(onScreen + result.taps * 25)} if he waits out every turn (shots measures it)`,
        `scenes: ${cartoon.scenes.map((s, i) => `${i + 1} ${s.name}`).join(' · ')}`,
      );
    }
  }

  console.log(`${errors.length ? 'FAIL' : 'ok  '} ${entry.id}`);
  for (const i of info) console.log(`       ${i}`);
  for (const w of warnings) console.log(`  warn ${w}`);
  for (const e of errors) console.log(`  ERROR ${e}`);
  if (errors.length) failed++;
}

console.log(failed ? `\n${failed} of ${chosen.length} cartoons have errors.` : `\n${chosen.length} cartoon${chosen.length === 1 ? '' : 's'} pass.`);
process.exit(failed ? 1 : 0);
