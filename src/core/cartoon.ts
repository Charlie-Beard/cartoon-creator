/**
 * The pure side of a cartoon: its spoken lines, and the checks every
 * script must pass before it reaches the iPad. No DOM and no audio, so all
 * of it is unit-tested (tests/unit) and the voice scripts can use it too.
 *
 * The playable side (the kit, scenes, `defineCartoon`) is in src/kit.
 */

export interface Line {
  /**
   * Who says it: 'narrator' or a character id from a world
   * (moonface, hedwig …). Each has its own voice (scripts/voice/cast.json).
   */
  who: string;
  /** What they say. Short and simple: a 6-year-old is listening. {name} is the child's name. */
  text: string;
}

/** What the library, the voice export and the checks know about a cartoon, without loading it. */
export interface CartoonInfo {
  /** Unique, kebab-case, also the file name: src/cartoons/<id>.ts. */
  id: string;
  /** Shown on the shelf and the opening curtain. Short: 2–5 words. */
  title: string;
  /** The world it is set in (src/worlds/<world>). */
  world: string;
  /** One or two sentences for grown-ups: what happens. */
  summary: string;
}

/** Roughly how many seconds a line takes to say, with the iPad's voice or a recording. */
export function estimateSeconds(text: string): number {
  const words = text.replace(/\{name\}/g, 'Jasper').split(/\s+/).filter(Boolean).length;
  // About 2.4 words a second for slow, clear speech to a child, plus a beat
  // for each sentence break, plus the kit's 250 ms gap after every line.
  const stops = (text.match(/[.!?…]+/g) ?? []).length;
  return words / 2.4 + stops * 0.3 + 0.25;
}

/** Spellings he must never hear or read (US forms), with the UK form. */
export const US_SPELLINGS: Record<string, string> = {
  color: 'colour',
  colors: 'colours',
  favorite: 'favourite',
  favorites: 'favourites',
  mom: 'Mum',
  mommy: 'Mummy',
  math: 'maths',
  gray: 'grey',
  center: 'centre',
  theater: 'theatre',
  neighbor: 'neighbour',
  neighbors: 'neighbours',
  honor: 'honour',
  flavor: 'flavour',
  humor: 'humour',
  realize: 'realise',
  organize: 'organise',
  candy: 'sweets',
  cookie: 'biscuit',
  cookies: 'biscuits',
  pants: 'trousers',
  sidewalk: 'pavement',
  vacation: 'holiday',
  diaper: 'nappy',
  trash: 'rubbish',
  garbage: 'rubbish',
  flashlight: 'torch',
  airplane: 'aeroplane',
};

/** Words that don't belong in a cartoon for him (cruelty, not scariness: PLAN §2). */
export const CRUEL_WORDS = ['kill', 'killed', 'dead', 'blood', 'stupid', 'hate you', 'shut up', 'slap', 'hit him', 'hit her', 'punch'];

export interface LineIssue {
  key: string;
  problem: string;
}

/**
 * Checks a cartoon's lines against the house rules (CLAUDE.md): known
 * speakers, short sentences, UK English, nothing cruel. Returns every
 * problem found (none means it passes). `speakers` is every id that may
 * talk: 'narrator' plus the characters of all worlds.
 */
export function checkLines(lines: Record<string, Line>, speakers: ReadonlySet<string>): LineIssue[] {
  const issues: LineIssue[] = [];
  for (const [key, line] of Object.entries(lines)) {
    const say = (problem: string) => issues.push({ key, problem });
    if (!speakers.has(line.who)) say(`unknown speaker "${line.who}"`);
    const text = line.text.trim();
    if (!text) say('empty line');
    if (text.length > 140) say(`too long (${text.length} characters, keep under 140): split it into two lines`);
    for (const sentence of text.split(/(?<=[.!?…])\s+/)) {
      const words = sentence.split(/\s+/).filter(Boolean).length;
      if (words > 16) say(`a sentence of ${words} words (keep to 16 or fewer): "${sentence}"`);
    }
    const lower = ` ${text.toLowerCase().replace(/[^a-z' ]+/g, ' ')} `;
    for (const [us, uk] of Object.entries(US_SPELLINGS)) {
      if (lower.includes(` ${us} `)) say(`US English "${us}": use "${uk}"`);
    }
    for (const w of CRUEL_WORDS) {
      if (lower.includes(` ${w} `)) say(`"${w}" is not for him: scary is fine, cruel isn't`);
    }
    if (/\{(?!name\})[^}]*\}/.test(text)) say('only {name} may be filled in');
    if (/[“”]/.test(text) && (text.match(/“/g) ?? []).length !== (text.match(/”/g) ?? []).length) say('unbalanced quotes');
  }
  return issues;
}

/** The estimated spoken length of a set of lines, in seconds (the floor for an episode's running time). */
export function spokenSeconds(lines: Record<string, Line>): number {
  return Object.values(lines).reduce((t, l) => t + estimateSeconds(l.text), 0);
}

/** A kebab-case id, as cartoon and world ids must be. */
export const isKebab = (id: string): boolean => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
