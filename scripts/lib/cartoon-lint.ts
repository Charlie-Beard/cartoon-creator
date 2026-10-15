/**
 * The checks on a cartoon's script that need its source text, not just
 * its lines: are all the lines used, do the characters, backdrops and
 * props it asks for exist, is there a turn for him to tap.
 *
 * Pure (no DOM, no file access): scripts/check-cartoon.ts feeds it the
 * file and the worlds, and tests/unit/cartoon-lint.test.ts runs it over
 * every cartoon on the shelf.
 *
 * It reads the source with regular expressions, not a TypeScript parser,
 * so it only sees ids written out as string literals ('moonface'), which
 * is how the kit's docs tell authors to write them.
 */
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

/** How many times the script calls tapToHelp, and how many of those have no `ask`. */
export function tapCalls(source: string): { total: number; withoutAsk: number } {
  const calls = callArguments(stripComments(source), 'tapToHelp');
  return { total: calls.length, withoutAsk: calls.filter((a) => !/\bask\s*:/.test(a)).length };
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
  if (!taps.total) errors.push('no k.tapToHelp(): every cartoon needs at least one turn for him');
  else if (taps.withoutAsk) warnings.push(`${taps.withoutAsk} tapToHelp without an \`ask\` line: he is never told what to tap`);

  const seconds = spokenSeconds(lines);
  if (seconds > 270) warnings.push(`${Math.round(seconds)} s of speech: with the pictures this runs past 5 minutes`);
  if (seconds < 45) warnings.push(`only ${Math.round(seconds)} s of speech: probably under the 2 minute minimum`);
  if (!new RegExp(`\\bid\\s*:\\s*${QUOTE}${escapeRe(id)}${QUOTE}`).test(source)) warnings.push(`the script's id does not look like "${id}"`);

  return { errors, warnings, spokenSeconds: seconds, taps: taps.total };
}
