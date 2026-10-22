import { describe, expect, it } from 'vitest';
import { ALL_CARTOONS as SHELF } from '../../src/cartoons';
import type { Ledger } from '../../src/cartoons/shelf';
import type { Line } from '../../src/core/cartoon';
import { compareLedgers, formatLedgers, lintLedger, phraseWords, placeholderFields, similarity, type LedgerEntry } from '../../scripts/lib/cartoon-lint';
import { catalogue } from '../../scripts/lib/catalogue';

const cat = {
  speakers: new Set(['narrator', 'moonface', 'dameSnap']),
  characters: { moonface: [], silky: [], dameSnap: [] },
  backdrops: new Set(['moon-room', 'snap-school', 'cloud-top']),
  props: new Set<string>(),
};

const ledger = (over: Partial<Ledger> = {}): Ledger => ({
  problem: 'the kettle is gone',
  villain: 'dameSnap',
  places: ['snap-school', 'moon-room'],
  cast: ['moonface', 'dameSnap'],
  turns: ['blow the cloud away'],
  jokes: ['Saucepan Man mishears'],
  ending: 'tea party',
  ...over,
});

const ep = (id: string, added: string, over: Partial<Ledger> | null = {}, world = 'faraway'): LedgerEntry => ({
  id,
  title: `Title of ${id}`,
  world,
  added,
  ledger: over === null ? undefined : ledger(over),
});

const lines: Record<string, Line> = {
  hello: { who: 'moonface', text: 'Hello!' },
  boo: { who: 'dameSnap', text: 'Boo!' },
};
const source = `k.backdrop('snap-school'); k.backdrop('moon-room'); k.character('moonface', {}); k.tapToHelp(a, {});`;
const lint = (l: Ledger | undefined, over: { source?: string; taps?: number } = {}) =>
  lintLedger({ ledger: l, source: over.source ?? source, lines, taps: over.taps ?? 1, catalogue: cat });

describe('the ledger of one cartoon', () => {
  it('is an error to have none', () => {
    const r = lint(undefined);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatch(/no `ledger`/);
  });

  it('passes when it agrees with the script and the worlds', () => {
    expect(lint(ledger())).toEqual({ errors: [], warnings: [] });
  });

  it('is an error to name a cast member, place or villain no world has', () => {
    const r = lint(ledger({ cast: ['moonface', 'nobody'], places: ['nowhere'], villain: 'witch' }));
    const text = r.errors.join('\n');
    expect(text).toMatch(/cast: "nobody"/);
    expect(text).toMatch(/places: "nowhere"/);
    expect(text).toMatch(/villain: "witch" looks like a character id/);
  });

  it('lets a villain be a danger in words', () => {
    expect(lint(ledger({ villain: 'a big storm' })).errors).toEqual([]);
    expect(lint(ledger({ villain: undefined })).errors).toEqual([]);
  });

  it('is an error to leave the template placeholders in, once per field', () => {
    const l = ledger({ problem: '<one line: what goes wrong>', places: ['<backdrop id>'], jokes: ['<a joke>'] });
    expect(placeholderFields(l)).toEqual(['problem', 'places', 'jokes']);
    const r = lint(l);
    expect(r.errors.filter((e) => /placeholder/.test(e))).toHaveLength(3);
    // A placeholder is not also reported as an unknown backdrop.
    expect(r.errors.join('\n')).not.toMatch(/not a backdrop/);
  });

  it('is an error to leave a required field empty', () => {
    const r = lint(ledger({ problem: ' ', turns: [], cast: ['moonface', ''] }));
    expect(r.errors.join('\n')).toMatch(/problem is empty/);
    expect(r.errors.join('\n')).toMatch(/turns is empty/);
    expect(r.errors.join('\n')).toMatch(/cast has an empty entry/);
  });

  it('warns about cast the script never uses, and cast it uses but does not list', () => {
    const unused = lint(ledger({ cast: ['moonface', 'dameSnap', 'silky'] })).warnings.join('\n');
    expect(unused).toMatch(/lists "silky" but the script never draws or hears them/);
    const unlisted = lint(ledger({ cast: ['moonface'], villain: 'a storm' })).warnings.join('\n');
    expect(unlisted).toMatch(/uses "dameSnap" but ledger.cast does not list them/);
  });

  it('counts a character who only speaks, and ignores one in a comment', () => {
    expect(lint(ledger({ cast: ['moonface', 'dameSnap'] })).warnings).toEqual([]);
    const commented = lint(ledger({ cast: ['moonface', 'dameSnap', 'silky'] }), { source: source + "// k.character('silky', {})" }).warnings;
    expect(commented.join('\n')).toMatch(/"silky" but the script never/);
  });

  it('warns about places the script never shows, or shows without listing', () => {
    const w = lint(ledger({ places: ['snap-school', 'cloud-top'] })).warnings.join('\n');
    expect(w).toMatch(/lists "cloud-top" but the script never shows it/);
    expect(w).toMatch(/shows "moon-room" but ledger.places does not list it/);
  });

  it('warns when the turns and the tapToHelp calls do not match', () => {
    expect(lint(ledger(), { taps: 2 }).warnings.join('\n')).toMatch(/1 but the script has 2 turns/);
  });

  it('warns when the villain is a character who is not in the cast', () => {
    const l = ledger({ cast: ['moonface'] });
    expect(lint(l).warnings.join('\n')).toMatch(/villain "dameSnap" is not in ledger.cast/);
  });
});

describe('comparing phrases', () => {
  it('ignores filler, plurals and word endings', () => {
    expect(phraseWords('Blow the cloud away!').sort()).toEqual(['away', 'blow', 'cloud']);
    expect(similarity('blow the cloud away', 'blows away a cloud')).toBe(1);
    expect(similarity('tap the kettle’s lid to make it whistle', 'make the kettle whistle')).toBeGreaterThanOrEqual(0.6);
  });

  it('tells different phrases apart', () => {
    expect(similarity('blow the cloud away', 'tap the kettle’s lid')).toBeLessThan(0.3);
    expect(similarity('wake the owl', 'wake the dragon')).toBeLessThan(0.6);
    expect(similarity('', 'anything')).toBe(0);
  });
});

describe('comparing with the shelf', () => {
  const mk = (over: Partial<Ledger>, others: LedgerEntry[]) => compareLedgers(ep('new', '2026-11-01', over), [ep('new', '2026-11-01', over), ...others], (id) => (id === 'dameSnap' ? 'Dame Snap' : id));
  const plain: Partial<Ledger> = { villain: 'a storm', places: ['cloud-top'], turns: ['pop the bubble'], jokes: [], problem: 'a lost hat' };

  it('warns about the same villain as the most recent episode in the world', () => {
    const w = mk({ ...plain, villain: 'dameSnap' }, [ep('old', '2026-10-15')]);
    expect(w).toEqual(["Dame Snap was also the villain in 'Title of old' (2026-10-15); fine if deliberate."]);
  });

  it('does not warn about a different villain', () => {
    expect(mk({ ...plain, villain: 'a storm' }, [ep('old', '2026-10-15')])).toEqual([]);
    expect(mk({ ...plain, villain: undefined }, [ep('old', '2026-10-15')])).toEqual([]);
  });

  it('only looks at the most recent episode for the villain, not the one before', () => {
    const w = mk({ ...plain, villain: 'dameSnap' }, [ep('older', '2026-09-01'), ep('newest', '2026-10-15', { villain: 'a storm' })]);
    expect(w).toEqual([]);
  });

  it('does not compare villains across worlds', () => {
    expect(mk({ ...plain, villain: 'dameSnap' }, [ep('hp', '2026-10-15', {}, 'hogwarts')])).toEqual([]);
  });

  it('matches a danger in words however it is phrased', () => {
    const w = mk({ ...plain, villain: 'the storm' }, [ep('old', '2026-10-15', { villain: 'A storm' })]);
    expect(w.join('')).toMatch(/the storm was also the villain/);
  });

  it('warns about the same main place as the previous episode, not a shared side place', () => {
    const w = mk({ ...plain, places: ['snap-school'] }, [ep('old', '2026-10-15')]);
    expect(w).toEqual(["snap-school was also the main place in 'Title of old' (2026-10-15); fine if deliberate."]);
    expect(mk({ ...plain, places: ['cloud-top', 'snap-school'] }, [ep('old', '2026-10-15')])).toEqual([]);
  });

  it('warns about a turn very like one already used, in any world', () => {
    const w = mk({ ...plain, turns: ['blow away a cloud'] }, [ep('hp', '2026-10-15', {}, 'hogwarts')]);
    expect(w).toEqual([`turn "blow away a cloud" is much like "blow the cloud away" in 'Title of hp' (2026-10-15); fine if deliberate.`]);
    expect(mk({ ...plain, turns: ['pop the bubble'] }, [ep('old', '2026-10-15')])).toEqual([]);
  });

  it('warns about the same problem wording', () => {
    const w = mk({ ...plain, problem: 'The kettle is gone!' }, [ep('old', '2026-10-15')]);
    expect(w).toHaveLength(1);
    expect(w[0]).toMatch(/^the problem is worded like 'Title of old' \(2026-10-15\)/);
    expect(mk({ ...plain, problem: 'the tree has a hiccup' }, [ep('old', '2026-10-15')])).toEqual([]);
  });

  it('warns about a joke only when it is in each of the last 2 episodes', () => {
    const joke = { ...plain, jokes: ['Saucepan Man mishears'] };
    const both = [ep('a', '2026-10-15'), ep('b', '2026-10-01')];
    expect(mk(joke, both).join('\n')).toMatch(/joke "Saucepan Man mishears" was in the last 2 episodes too \('Title of a' \(2026-10-15\) and 'Title of b' \(2026-10-01\)\)/);
    // Only one of the last two has it: no warning.
    expect(mk(joke, [ep('a', '2026-10-15'), ep('b', '2026-10-01', { jokes: ['pop biscuits'] })])).toEqual([]);
    // Used in the last two but an older one is the odd one out: still a warning (the last 2 are what count).
    expect(mk(joke, [...both, ep('c', '2026-09-01', { jokes: [] })])).toHaveLength(1);
    // Only one earlier episode in the world: nothing to repeat yet.
    expect(mk(joke, [ep('a', '2026-10-15')])).toEqual([]);
  });

  it('compares only with earlier episodes, so an old one is not warned about a newer one', () => {
    const old = ep('old', '2026-10-15');
    const newer = ep('newer', '2026-11-01');
    expect(compareLedgers(old, [old, newer])).toEqual([]);
    expect(compareLedgers(newer, [old, newer])).not.toEqual([]);
  });

  it('compares two episodes made on the same day both ways', () => {
    const a = ep('a', '2026-11-01');
    const b = ep('b', '2026-11-01');
    expect(compareLedgers(a, [a, b])).not.toEqual([]);
    expect(compareLedgers(b, [a, b])).not.toEqual([]);
  });

  it('skips episodes with no ledger or an unfinished one, and says nothing when this one has none', () => {
    expect(mk({ ...plain, villain: 'dameSnap' }, [ep('none', '2026-10-15', null)])).toEqual([]);
    expect(mk({ ...plain, villain: 'dameSnap' }, [ep('draft', '2026-10-15', { problem: '<what goes wrong>' })])).toEqual([]);
    expect(compareLedgers(ep('none', '2026-11-01', null), [ep('old', '2026-10-15')])).toEqual([]);
  });

  it('is quiet for the only episode on the shelf', () => {
    const only = ep('only', '2026-10-15');
    expect(compareLedgers(only, [only])).toEqual([]);
  });
});

describe('the ledger table', () => {
  it('groups by world, newest first, and says when a ledger is missing', () => {
    const text = formatLedgers([ep('old', '2026-09-01'), ep('new', '2026-10-15'), ep('wiz', '2026-10-01', {}, 'hogwarts'), ep('bare', '2026-08-01', null)], (id) => (id === 'dameSnap' ? 'Dame Snap' : id));
    const lines = text.split('\n');
    expect(lines.filter((l) => /^\S/.test(l))).toEqual(['faraway (3)', 'hogwarts (1)']);
    expect(lines.filter((l) => /^ {2}\d{4}/.test(l)).map((l) => l.match(/\[(.+)\]/)![1])).toEqual(['new', 'old', 'bare', 'wiz']);
    expect(text).toMatch(/villain +Dame Snap/);
    expect(text).toMatch(/\(no ledger yet\)/);
    expect(text).toMatch(/places +snap-school, moon-room/);
  });
});

describe('the cartoons on the shelf', () => {
  // A cartoon with no ledger is `npm run check`'s error, not a test failure,
  // so a cartoon being written in parallel doesn't break `npm test`.
  for (const entry of SHELF.filter((e) => e.ledger)) {
    it(`${entry.id} has a ledger of characters and places that exist, finished`, () => {
      const l = entry.ledger!;
      const c = catalogue();
      expect(placeholderFields(l), 'placeholders left in').toEqual([]);
      for (const id of l.cast) expect(id in c.characters, `character ${id}`).toBe(true);
      for (const id of l.places) expect(c.backdrops.has(id), `backdrop ${id}`).toBe(true);
      expect(l.turns.length).toBeGreaterThan(0);
    });
  }
});
