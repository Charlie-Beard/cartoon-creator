/**
 * Who can be recorded, and who still needs a voice.
 *
 *   npx tsx scripts/voice/cast-check.ts                # every cartoon on the shelf
 *   npx tsx scripts/voice/cast-check.ts lost-kettle    # just this one
 *   npm run voice:cast -- lost-kettle
 *
 * Prints every speaker the cartoons use that has no voice in
 * scripts/voice/cast.json (exit 1 if there are any: generate.py will not
 * record them), then every world character with no voice yet, with the
 * `voice` note from their world so a grown-up can choose one
 * (pick-voice.py finds and sets it). Also notes voices shared by two
 * characters and cast.json entries nobody uses.
 */
import { readFileSync } from 'node:fs';
import { SHELF } from '../../src/cartoons';
import { WORLDS } from '../../src/worlds';

const cast = Object.entries(JSON.parse(readFileSync(new URL('./cast.json', import.meta.url), 'utf8')) as Record<string, { voice_id?: string; name?: string }>).filter(
  ([id]) => !id.startsWith('_'),
);
const voiced = new Map(cast);
const hasVoice = (id: string) => !!voiced.get(id)?.voice_id;

const NARRATOR_NOTE = 'The narrator: a warm, calm British storyteller, a little slower than normal, kind to a six-year-old.';
const noteFor = (id: string): string => (id === 'narrator' ? NARRATOR_NOTE : (Object.values(WORLDS).find((w) => id in w.characters)?.characters[id].voice ?? '(not in any world)'));
const worldOf = (id: string): string => Object.values(WORLDS).find((w) => id in w.characters)?.name ?? '';
const nameOf = (id: string): string => (id === 'narrator' ? 'Narrator' : (Object.values(WORLDS).find((w) => id in w.characters)?.characters[id].name ?? id));

const asked = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const unknown = asked.filter((id) => !SHELF.some((c) => c.id === id));
if (unknown.length) {
  console.error(`Not on the shelf (src/cartoons/index.ts): ${unknown.join(', ')}`);
  process.exit(1);
}
const shelf = asked.length ? SHELF.filter((c) => asked.includes(c.id)) : SHELF;

// Who speaks in the cartoons, and how often.
const used = new Map<string, { lines: number; cartoons: Set<string> }>();
for (const entry of shelf) {
  const cartoon = (await entry.load()).default;
  for (const line of Object.values(cartoon.lines)) {
    const u = used.get(line.who) ?? { lines: 0, cartoons: new Set() };
    u.lines++;
    u.cartoons.add(entry.id);
    used.set(line.who, u);
  }
}

// pick-voice.py already knows what some characters should sound like; any other needs --gender and --age.
const pickKnown = new Set([...readFileSync(new URL('./pick-voice.py', import.meta.url), 'utf8').matchAll(/^    "(\w+)": want\(/gm)].map((m) => m[1]));

const show = (id: string) => {
  console.log(`  ${id}  (${nameOf(id)}${worldOf(id) ? `, ${worldOf(id)}` : ''})`);
  console.log(`    voice note: ${noteFor(id)}`);
  console.log(`    choose one: python scripts/voice/pick-voice.py ${id} --list${pickKnown.has(id) ? '' : ' --gender <male|female> --age <young|middle_aged|old>'}`);
};

const missingUsed = [...used.keys()].filter((id) => !hasVoice(id)).sort();
console.log(`${shelf.length} cartoon${shelf.length === 1 ? '' : 's'}, ${used.size} speaker${used.size === 1 ? '' : 's'}: ${[...used].map(([id, u]) => `${id} ${u.lines}`).join(', ') || 'none'}\n`);

if (missingUsed.length) {
  console.log(`SPEAKERS WITH NO VOICE (generate.py will not record their lines): ${missingUsed.length}`);
  for (const id of missingUsed) {
    show(id);
    console.log(`    used in: ${[...used.get(id)!.cartoons].join(', ')} (${used.get(id)!.lines} lines)`);
  }
  console.log('');
} else if (used.size) {
  console.log('Every speaker in these cartoons has a voice.\n');
}

const everyone = ['narrator', ...Object.values(WORLDS).flatMap((w) => Object.keys(w.characters))];
const idle = everyone.filter((id) => !hasVoice(id) && !missingUsed.includes(id));
if (idle.length) {
  console.log(`CHARACTERS WITH NO VOICE YET (not used in these cartoons): ${idle.length}`);
  for (const id of idle) show(id);
  console.log('');
}

// A voice entry for nobody, usually a typo in the id.
const strays = cast.map(([id]) => id).filter((id) => !everyone.includes(id));
if (strays.length) console.log(`In cast.json but not a character in any world (a typo, or a character not written into its world yet): ${strays.join(', ')}\n`);

// Two characters on one voice is allowed (Wizard Words does it), but worth knowing when they talk in the same cartoon.
const byVoice = new Map<string, string[]>();
for (const [id, v] of cast) if (v.voice_id && used.has(id)) byVoice.set(v.voice_id, [...(byVoice.get(v.voice_id) ?? []), id]);
const shared = [...byVoice.values()].filter((ids) => ids.length > 1);
if (shared.length) console.log(`Sharing a voice in these cartoons: ${shared.map((ids) => ids.join(' + ')).join('; ')} (they will sound alike)\n`);

process.exit(missingUsed.length ? 1 : 0);
