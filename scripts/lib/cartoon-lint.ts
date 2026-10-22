/**
 * The checks on a cartoon's script that need its source text, not just
 * its lines: are all the lines used, do the characters, backdrops and
 * props it asks for exist, is there a turn for him to tap. Also the episode
 * ledger (see the end of this file): checked against the script and the
 * worlds, and compared with the other episodes on the shelf.
 *
 * Pure (no DOM, no file access): scripts/check-cartoon.ts feeds it the
 * file and the worlds, and tests/unit/cartoon-lint.test.ts runs it over
 * every cartoon on the shelf.
 *
 * It reads the source with regular expressions, not a TypeScript parser,
 * so it only sees ids written out as string literals ('moonface'), which
 * is how the kit's docs tell authors to write them.
 */
import type { CartoonMeta, Ledger } from '../../src/cartoons/shelf';
import { checkLines, spokenSeconds, type Line } from '../../src/core/cartoon';

/** What exists in the worlds, boiled down to ids. */
export interface Catalogue {
  /** Every speaker: 'narrator' plus the characters of all worlds. */
  speakers: ReadonlySet<string>;
  /** Character id → the pose names it has. */
  characters: Readonly<Record<string, readonly string[]>>;
  /** Backdrop ids from any world (the kit looks in the cartoon's world, then the common one, then the rest). */
  backdrops: ReadonlySet<string>;
  props: ReadonlySet<string>;
}

export interface LintInput {
  id: string;
  /** The cartoon's own source file. */
  source: string;
  lines: Record<string, Line>;
  catalogue: Catalogue;
}

export interface LintResult {
  /** Must be fixed: the cartoon would be broken, or would waste a recording. */
  errors: string[];
  /** Worth a look, but allowed. */
  warnings: string[];
  /** Estimated seconds of speech if every line is said once (the floor for the running time). */
  spokenSeconds: number;
  /** How many tapToHelp calls the script makes. */
  taps: number;
}

// ------------------------------------------------------------------ reading

/**
 * Blanks out comments, keeping the length (so offsets still match the
 * source) and the line breaks. Strings are left alone but skipped over, so
 * a "//" inside one isn't taken for a comment.
 */
export function stripComments(src: string): string {
  let out = '';
  let i = 0;
  const blank = (s: string) => s.replace(/[^\n]/g, ' ');
  while (i < src.length) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (two === '//') {
      const end = src.indexOf('\n', i);
      const stop = end < 0 ? src.length : end;
      out += blank(src.slice(i, stop));
      i = stop;
    } else if (two === '/*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      out += blank(src.slice(i, stop));
      i = stop;
    } else if (c === "'" || c === '"' || c === '`') {
      const stop = endOfString(src, i);
      out += src.slice(i, stop);
      i = stop;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** The index just past the string literal that starts at `start`. */
function endOfString(src: string, start: number): number {
  const q = src[start];
  let i = start + 1;
  while (i < src.length) {
    if (src[i] === '\\') i += 2;
    else if (src[i] === q) return i + 1;
    else if (q === '`' && src[i] === '$' && src[i + 1] === '{') i = endOfBraces(src, i + 1);
    else i++;
  }
  return src.length;
}

/** The index just past the `{…}` or `(…)` group that opens at `start`, skipping strings and comments. */
function endOfBraces(src: string, start: number): number {
  const open = src[start];
  const close = open === '(' ? ')' : open === '[' ? ']' : '}';
  let depth = 0;
  let i = start;
  while (i < src.length) {
    const c = src[i];
    const two = src.slice(i, i + 2);
    if (c === "'" || c === '"' || c === '`') i = endOfString(src, i);
    else if (two === '//') i = src.indexOf('\n', i) < 0 ? src.length : src.indexOf('\n', i);
    else if (two === '/*') i = src.indexOf('*/', i + 2) < 0 ? src.length : src.indexOf('*/', i + 2) + 2;
    else {
      if (c === open) depth++;
      else if (c === close && --depth === 0) return i + 1;
      i++;
    }
  }
  return src.length;
}

/**
 * The source with the `lines: { … }` table blanked out, so a line's own
 * definition doesn't count as a use of it. Returns the source unchanged if
 * there is no table (the checks then report what they can).
 */
export function withoutLinesTable(src: string): string {
  const m = /\blines\s*:\s*\{/.exec(src);
  if (!m) return src;
  const open = m.index + m[0].length - 1;
  const end = endOfBraces(src, open);
  return src.slice(0, open) + src.slice(open, end).replace(/[^\n]/g, ' ') + src.slice(end);
}

const QUOTE = `['"\`]`;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every string literal argument matched by `re` (group 1), in the order found. */
function allMatches(src: string, re: RegExp): string[] {
  return [...src.matchAll(re)].map((m) => m[1]);
}

/** The text of every call to `name(` in the source: what is between its parentheses. */
export function callArguments(src: string, name: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`\\.${name}\\s*\\(`, 'g');
  for (let m = re.exec(src); m; m = re.exec(src)) {
    const open = m.index + m[0].length - 1;
    out.push(src.slice(open + 1, endOfBraces(src, open) - 1));
  }
  return out;
}

// ------------------------------------------------------------------- checks

/** Line keys that are defined but never mentioned anywhere else in the script. */
export function unusedLines(source: string, lines: Record<string, Line>): string[] {
  const body = withoutLinesTable(stripComments(source));
  return Object.keys(lines).filter((key) => !new RegExp(`${QUOTE}${escapeRe(key)}${QUOTE}`).test(body));
}

/** Line keys the script says (k.say, ask:, nudge:, helped:) that aren't in the table. */
export function undefinedLines(source: string, lines: Record<string, Line>): string[] {
  const body = withoutLinesTable(stripComments(source));
  const used = [
    ...allMatches(body, new RegExp(`\\.say\\s*\\(\\s*${QUOTE}([^'"\`]+)${QUOTE}`, 'g')),
    ...allMatches(body, new RegExp(`\\b(?:ask|nudge|helped)\\s*:\\s*${QUOTE}([^'"\`]+)${QUOTE}`, 'g')),
  ];
  return [...new Set(used)].filter((key) => !(key in lines));
}

/** Characters, backdrops, props and poses the script asks for that no world has. */
export function unknownIds(source: string, cat: Catalogue): string[] {
  const body = stripComments(source);
  const problems: string[] = [];
  const idRe = (fn: string) => new RegExp(`\\.${fn}\\s*\\(\\s*${QUOTE}([^'"\`]+)${QUOTE}`, 'g');

  const usedCharacters = [...new Set(allMatches(body, idRe('character')))];
  for (const id of usedCharacters) if (!(id in cat.characters)) problems.push(`character "${id}" is not in any world`);

  for (const id of new Set(allMatches(body, idRe('backdrop')))) {
    // An SVG string (starts with "<") is a one-off backdrop, not an id.
    if (!id.trimStart().startsWith('<') && !cat.backdrops.has(id)) problems.push(`backdrop "${id}" is not in any world`);
  }
  for (const id of new Set(allMatches(body, idRe('prop')))) if (!cat.props.has(id)) problems.push(`prop "${id}" is not in any world`);

  // Poses given when a character is made: k.character('moonface', { …, pose: 'loom' }).
  for (const args of callArguments(body, 'character')) {
    const id = new RegExp(`^\\s*${QUOTE}([^'"\`]+)${QUOTE}`).exec(args)?.[1];
    const pose = new RegExp(`\\bpose\\s*:\\s*${QUOTE}([^'"\`]+)${QUOTE}`).exec(args)?.[1];
    if (id && pose && id in cat.characters && !cat.characters[id].includes(pose)) {
      problems.push(`${id} has no pose "${pose}" (poses: ${cat.characters[id].join(', ') || 'none'})`);
    }
  }
  // k.pose(el, 'loom') doesn't say whose pose it is: it must exist for someone in the cast.
  const knownPoses = new Set(usedCharacters.flatMap((id) => cat.characters[id] ?? []));
  for (const args of callArguments(body, 'pose')) {
    const pose = new RegExp(`,\\s*${QUOTE}([^'"\`]+)${QUOTE}\\s*$`).exec(args.trim())?.[1];
    if (pose && pose !== 'default' && !knownPoses.has(pose)) {
      problems.push(`pose "${pose}" belongs to none of the characters in this cartoon (${usedCharacters.join(', ') || 'none'})`);
    }
  }
  return [...new Set(problems)];
}

/** The fewest turns an episode has (k.tapToHelp and k.dragToHelp together). */
export const MIN_TURNS = 5;

/** How many of his turns the script has (tapToHelp and dragToHelp), and how many of those have no `ask`. */
export function tapCalls(source: string): { total: number; withoutAsk: number; drags: number } {
  const code = stripComments(source);
  const taps = callArguments(code, 'tapToHelp');
  const drags = callArguments(code, 'dragToHelp');
  const calls = [...taps, ...drags];
  return { total: calls.length, withoutAsk: calls.filter((a) => !/\bask\s*:/.test(a)).length, drags: drags.length };
}

/** All the checks together. */
export function lintCartoon({ id, source, lines, catalogue }: LintInput): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const i of checkLines(lines, catalogue.speakers)) errors.push(`line "${i.key}": ${i.problem}`);
  for (const key of unusedLines(source, lines)) errors.push(`line "${key}" is never said: delete it (it would be recorded for nothing)`);
  for (const key of undefinedLines(source, lines)) errors.push(`the script says "${key}" but there is no such line`);
  for (const p of unknownIds(source, catalogue)) errors.push(p);

  const taps = tapCalls(source);
  if (taps.total < MIN_TURNS) errors.push(`only ${taps.total} of his turns: every cartoon needs at least ${MIN_TURNS} (tapToHelp or dragToHelp)`);
  if (taps.withoutAsk) warnings.push(`${taps.withoutAsk} of his turns without an \`ask\` line: he is never told what to do`);

  const seconds = spokenSeconds(lines);
  if (seconds > 315) warnings.push(`${Math.round(seconds)} s of speech: with the pictures this runs past 6 minutes`);
  if (seconds < 45) warnings.push(`only ${Math.round(seconds)} s of speech: probably under the 2 minute minimum`);
  if (!new RegExp(`\\bid\\s*:\\s*${QUOTE}${escapeRe(id)}${QUOTE}`).test(source)) warnings.push(`the script's id does not look like "${id}"`);

  return { errors, warnings, spokenSeconds: seconds, taps: taps.total };
}

// ------------------------------------------------------------------- ledger
//
// The episode ledger (src/cartoons/shelf.ts, Ledger) in meta.ts says what an
// episode was about. Two kinds of check: the ledger against its own script
// and the worlds (lintLedger), and against the episodes already on the shelf
// (compareLedgers). Only the first can fail a cartoon. The second only
// warns, because repeating a villain or a place is sometimes the point.

/** The part of a shelf entry the ledger checks read. */
export type LedgerEntry = Pick<CartoonMeta, 'id' | 'title' | 'world' | 'added' | 'ledger'>;

const PLACEHOLDER = /<[^<>]*>/;

/** The ledger fields that still hold the template's `<placeholder>` text. */
export function placeholderFields(ledger: Ledger): string[] {
  const out: string[] = [];
  const texts: [string, string[]][] = [
    ['problem', [ledger.problem]],
    ['villain', ledger.villain === undefined ? [] : [ledger.villain]],
    ['places', ledger.places ?? []],
    ['cast', ledger.cast ?? []],
    ['turns', ledger.turns ?? []],
    ['jokes', ledger.jokes ?? []],
    ['ending', [ledger.ending]],
  ];
  for (const [field, list] of texts) if (list.some((s) => typeof s === 'string' && PLACEHOLDER.test(s))) out.push(field);
  return out;
}

/** Character ids the script uses: drawn with k.character('id', …) or speaking a line (not the narrator). */
export function usedCharacters(source: string, lines: Record<string, Line>): string[] {
  const body = stripComments(source);
  const drawn = allMatches(body, new RegExp(`\\.character\\s*\\(\\s*${QUOTE}([^'"\`]+)${QUOTE}`, 'g'));
  const speaking = Object.values(lines).map((l) => l.who);
  return [...new Set([...drawn, ...speaking])].filter((id) => id !== 'narrator');
}

/** Backdrop ids the script uses (one-off SVG backdrops have no id and are left out). */
export function usedBackdrops(source: string): string[] {
  const ids = allMatches(stripComments(source), new RegExp(`\\.backdrop\\s*\\(\\s*${QUOTE}([^'"\`]+)${QUOTE}`, 'g'));
  return [...new Set(ids.filter((id) => !id.trimStart().startsWith('<')))];
}

/** A villain written as one lower-case word or id ('dameSnap', 'snap-guard') is meant as a character id; 'a storm' is words. */
const looksLikeId = (s: string): boolean => /^[a-z][A-Za-z0-9]*(?:-[a-z0-9]+)*$/.test(s);

export interface LedgerLintInput {
  ledger: Ledger | undefined;
  /** The cartoon's source (all its .ts files, as scripts/lib/shelf.ts sourceOf joins them). */
  source: string;
  lines: Record<string, Line>;
  /** How many tapToHelp calls the script makes. */
  taps: number;
  catalogue: Catalogue;
}

/**
 * A ledger against its own script and the worlds. Errors: missing, blank,
 * still holding template placeholders, or naming a character or backdrop no
 * world has. Warnings: the ledger and the script disagree (a cast member or
 * place never used, or used but not listed, the turn count).
 */
export function lintLedger({ ledger, source, lines, taps, catalogue }: LedgerLintInput): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!ledger) {
    errors.push('meta.ts has no `ledger`: say what the episode is about (problem, villain, places, cast, turns, jokes, ending). See templates/cartoon/meta.ts, and `npm run check -- --ledger` for the others');
    return { errors, warnings };
  }

  const stale = new Set(placeholderFields(ledger));
  for (const f of stale) errors.push(`ledger.${f} still has the template's <placeholder>: fill it in${f === 'villain' || f === 'jokes' ? ' (or delete it if there is none)' : ''}`);

  const blank = (s: unknown): boolean => typeof s !== 'string' || !s.trim();
  if (!stale.has('problem') && blank(ledger.problem)) errors.push('ledger.problem is empty: one line on what goes wrong');
  if (!stale.has('ending') && blank(ledger.ending)) errors.push('ledger.ending is empty: a word or two, like "tea party"');
  if (ledger.villain !== undefined && !stale.has('villain') && blank(ledger.villain)) errors.push('ledger.villain is empty: leave it out if there is no villain');
  for (const f of ['places', 'cast', 'turns'] as const) {
    if (stale.has(f)) continue;
    const list = ledger[f];
    if (!Array.isArray(list) || !list.length) errors.push(`ledger.${f} is empty`);
    else if (list.some(blank)) errors.push(`ledger.${f} has an empty entry`);
  }
  if (ledger.jokes && !stale.has('jokes') && ledger.jokes.some(blank)) errors.push('ledger.jokes has an empty entry');

  const castOk = !stale.has('cast') && Array.isArray(ledger.cast);
  const placesOk = !stale.has('places') && Array.isArray(ledger.places);

  if (castOk) {
    for (const id of ledger.cast) if (!blank(id) && !(id in catalogue.characters)) errors.push(`ledger.cast: "${id}" is not a character in any world`);
  }
  if (placesOk) {
    for (const id of ledger.places) if (!blank(id) && !catalogue.backdrops.has(id)) errors.push(`ledger.places: "${id}" is not a backdrop in any world`);
  }
  const villain = ledger.villain?.trim();
  if (villain && !stale.has('villain') && looksLikeId(villain) && !(villain in catalogue.characters)) {
    errors.push(`ledger.villain: "${villain}" looks like a character id but no world has one (a gentler danger goes in words, like "a storm")`);
  }

  // The ledger and the script should tell the same story.
  if (castOk) {
    const used = usedCharacters(source, lines);
    for (const id of ledger.cast) if (id in catalogue.characters && !used.includes(id)) warnings.push(`ledger.cast lists "${id}" but the script never draws or hears them`);
    for (const id of used) if (id in catalogue.characters && !ledger.cast.includes(id)) warnings.push(`the script uses "${id}" but ledger.cast does not list them`);
    if (villain && looksLikeId(villain) && villain in catalogue.characters && !ledger.cast.includes(villain)) warnings.push(`ledger.villain "${villain}" is not in ledger.cast`);
  }
  if (placesOk) {
    const used = usedBackdrops(source);
    for (const id of ledger.places) if (catalogue.backdrops.has(id) && !used.includes(id)) warnings.push(`ledger.places lists "${id}" but the script never shows it`);
    for (const id of used) if (catalogue.backdrops.has(id) && !ledger.places.includes(id)) warnings.push(`the script shows "${id}" but ledger.places does not list it`);
  }
  if (!stale.has('turns') && Array.isArray(ledger.turns) && ledger.turns.length && ledger.turns.length !== taps) {
    warnings.push(`ledger.turns has ${ledger.turns.length} but the script has ${taps} turns (tapToHelp and dragToHelp): one phrase per turn`);
  }
  return { errors, warnings };
}

// -------------------------------------------------- comparing with the shelf

/** Words too common to tell two phrases apart ("tap" is in nearly every turn). */
const FILLER = new Set(['a', 'an', 'the', 'to', 'of', 'and', 'his', 'her', 'their', 'its', 'it', 'up', 'out', 'on', 'in', 'at', 'for', 'with', 'is', 'are', 'then', 'tap']);

/** Crude stem: clouds → cloud, whistling and whistles → whistl. Enough to match "blow" with "blows". */
function stem(w: string): string {
  if (w.length > 4) w = w.replace(/(ing|ed|s)$/, '');
  return w.length > 3 ? w.replace(/e$/, '') : w;
}

/** The distinct, stemmed, lower-case words of a phrase, without the filler (unless that would leave nothing). */
export function phraseWords(s: string): string[] {
  const all = s
    .toLowerCase()
    .replace(/[’']s\b/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(stem);
  const kept = all.filter((w) => !FILLER.has(w));
  return [...new Set(kept.length ? kept : all)];
}

/** How alike two phrases are, 0 to 1: shared words over all words used. */
export function similarity(a: string, b: string): number {
  const wa = phraseWords(a);
  const wb = new Set(phraseWords(b));
  if (!wa.length || !wb.size) return 0;
  const shared = wa.filter((w) => wb.has(w)).length;
  return shared / (wa.length + wb.size - shared);
}

/** Turns and jokes count as the same from this much overlap (3 of 5 distinct words); a problem needs more, as sentences share words by accident. */
const SAME_PHRASE = 0.6;
const SAME_PROBLEM = 0.8;

type Filed = LedgerEntry & { ledger: Ledger };

/**
 * The other episodes with a finished ledger that came before this one (or on
 * the same day, which can't be told apart), newest first, then by title: the
 * order of the shelf. Comparing only backwards means each pair warns once
 * when a new episode is checked, not again from the old episode's side.
 */
function earlier(entry: LedgerEntry, shelf: readonly LedgerEntry[]): Filed[] {
  return shelf
    .filter((o): o is Filed => o.id !== entry.id && !!o.ledger && o.added <= entry.added && !placeholderFields(o.ledger).length)
    .sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));
}

const where = (o: LedgerEntry): string => `'${o.title}' (${o.added})`;

/**
 * Warnings for an episode that is much like ones already on the shelf. Never
 * an error: a repeat is sometimes on purpose, so each says "fine if deliberate".
 *
 *   villain / main place   same as the most recent earlier episode in the same world
 *   running joke           used in each of the last 2 earlier episodes of the same world
 *   turn, problem          close to one in any earlier episode (any world: a good turn is a good turn)
 *
 * `nameOf` turns a character id into its name for the messages ('dameSnap' → 'Dame Snap').
 */
export function compareLedgers(entry: LedgerEntry, shelf: readonly LedgerEntry[], nameOf: (id: string) => string = (s) => s): string[] {
  const mine = entry.ledger;
  if (!mine || placeholderFields(mine).length) return [];
  const warnings: string[] = [];
  const before = earlier(entry, shelf);
  const sameWorld = before.filter((o) => o.world === entry.world);
  const last = sameWorld[0];

  if (last) {
    const v = mine.villain?.trim();
    const lv = last.ledger.villain?.trim();
    if (v && lv && similarity(v, lv) === 1) {
      warnings.push(`${looksLikeId(v) ? nameOf(v) : v} was also the villain in ${where(last)}; fine if deliberate.`);
    }
    if (mine.places[0] && mine.places[0] === last.ledger.places[0]) {
      warnings.push(`${mine.places[0]} was also the main place in ${where(last)}; fine if deliberate.`);
    }
  }

  const lastTwo = sameWorld.slice(0, 2);
  if (lastTwo.length === 2) {
    for (const joke of mine.jokes ?? []) {
      if (lastTwo.every((o) => (o.ledger.jokes ?? []).some((j) => similarity(joke, j) >= SAME_PHRASE))) {
        warnings.push(`joke "${joke}" was in the last 2 episodes too (${lastTwo.map(where).join(' and ')}); fine if deliberate.`);
      }
    }
  }

  for (const turn of mine.turns) {
    for (const o of before) {
      const twin = o.ledger.turns.find((t) => similarity(turn, t) >= SAME_PHRASE);
      if (twin) {
        warnings.push(`turn "${turn}" is much like "${twin}" in ${where(o)}; fine if deliberate.`);
        break;
      }
    }
  }

  const same = before.find((o) => similarity(mine.problem, o.ledger.problem) >= SAME_PROBLEM);
  if (same) warnings.push(`the problem is worded like ${where(same)}: "${same.ledger.problem}"; fine if deliberate.`);

  return warnings;
}

/**
 * Every episode's ledger as plain text, for a writer to read before planning:
 * grouped by world, newest first within each. An episode with no ledger yet
 * says so (it can't be compared with).
 */
export function formatLedgers(shelf: readonly LedgerEntry[], nameOf: (id: string) => string = (s) => s): string {
  const out: string[] = [];
  const worlds = [...new Set(shelf.map((e) => e.world))].sort();
  for (const world of worlds) {
    const eps = shelf.filter((e) => e.world === world).sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));
    out.push(`${world} (${eps.length})`);
    for (const e of eps) {
      out.push(`  ${e.added}  ${e.title}  [${e.id}]`);
      const l = e.ledger;
      if (!l) {
        out.push('      (no ledger yet)');
        continue;
      }
      const rows: [string, string][] = [
        ['problem', l.problem],
        ['villain', l.villain ? (looksLikeId(l.villain) ? nameOf(l.villain) : l.villain) : '(none)'],
        ['places', l.places.join(', ')],
        ['cast', l.cast.join(', ')],
        ['turns', l.turns.join(' | ')],
        ['jokes', (l.jokes ?? []).join(' | ') || '(none)'],
        ['ending', l.ending],
      ];
      for (const [k, v] of rows) out.push(`      ${k.padEnd(9)}${v}`);
    }
    out.push('');
  }
  return out.join('\n').trimEnd();
}
