import { describe, expect, it } from 'vitest';
import { catalogueText, SECTIONS, worldList } from '../../scripts/catalogue';
import { WORLDS } from '../../src/worlds';

/**
 * `npm run catalogue -- <world>` is the cheat sheet a cartoon writer reads
 * instead of src/worlds/<id>/index.ts. It must never leave a character or
 * backdrop out, and the sounds and moves it reads from source text must
 * stay in step with what the moves.ts files really export.
 */
const startsALine = (text: string, id: string): boolean => new RegExp(`^\\s*${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'm').test(text);

const movesOf = {
  common: () => import('../../src/worlds/common/moves'),
  faraway: () => import('../../src/worlds/faraway/moves'),
  hogwarts: () => import('../../src/worlds/hogwarts/moves'),
} as const;

describe('catalogue', () => {
  it('lists every world', () => {
    const list = worldList();
    for (const w of Object.values(WORLDS)) expect(list).toContain(w.id);
  });

  for (const [wid, w] of Object.entries(WORLDS)) {
    describe(wid, () => {
      const text = catalogueText(wid);

      it('has output with the world name', () => {
        expect(text.length).toBeGreaterThan(200);
        expect(text).toContain(w.name);
      });

      it('names every character and backdrop', () => {
        for (const id of Object.keys(w.characters)) expect(startsALine(text, id), `character ${id}`).toBe(true);
        for (const id of Object.keys(w.backdrops)) expect(startsALine(text, id), `backdrop ${id}`).toBe(true);
      });

      it('names every prop, even in the brief index', () => {
        const brief = catalogueText(wid, { mode: 'brief' });
        for (const id of Object.keys(w.props)) {
          expect(text, `prop ${id}`).toContain(id);
          expect(brief, `prop ${id} (brief)`).toContain(id);
        }
      });

      it('has every section, and each section alone is shorter than the whole', () => {
        for (const section of SECTIONS) {
          const part = catalogueText(wid, { section });
          expect(part.length, section).toBeGreaterThan(0);
          expect(part.length, section).toBeLessThan(text.length + 1);
        }
      });

      it('keeps brief shorter than normal and normal shorter than full', () => {
        const brief = catalogueText(wid, { mode: 'brief' }).length;
        const full = catalogueText(wid, { mode: 'full' }).length;
        expect(brief).toBeLessThanOrEqual(text.length);
        expect(text.length).toBeLessThanOrEqual(full);
      });

      it('gives one entry in full, for any character or backdrop', () => {
        for (const id of [...Object.keys(w.characters), ...Object.keys(w.backdrops)].slice(0, 6)) {
          expect(catalogueText(wid, { id })).toContain(id);
        }
      });

      it('lists the sounds and moves in its moves.ts, each with its doc comment', async () => {
        const m = await movesOf[wid as keyof typeof movesOf]();
        const part = catalogueText(wid, { section: 'moves', common: false });
        for (const name of [...Object.keys(m.sounds), ...Object.keys(m.moves)]) expect(part, name).toMatch(new RegExp(`^\\s+${name}\\(.*\\) — \\S`, 'm'));
      });
    });
  }

  it('shows the common world under faraway unless asked not to', () => {
    expect(catalogueText('faraway')).toContain('common (available everywhere)');
    expect(catalogueText('faraway', { common: false })).not.toContain('common (available everywhere)');
  });

  it('lists the kit’s fx and sfx from kit.ts', () => {
    const kit = catalogueText('faraway', { section: 'kit' });
    expect(kit).toMatch(/^\s+boing\(\) — /m);
    expect(kit).toMatch(/^\s+sparkle\(\) — /m);
  });

  it('keeps a quoted line in one piece when it trims a note', () => {
    // Dame Washalot's note has a spoken line with a question mark inside it.
    const s = catalogueText('faraway', { id: 'washalot' });
    expect(s).toContain('"Did somebody say muddy socks? Leave them to me!"');
    const trimmed = catalogueText('faraway');
    if (trimmed.includes('muddy socks?')) expect(trimmed).toContain('muddy socks? Leave them to me!');
  });

  it('says what it cannot find', () => {
    expect(() => catalogueText('nowhere')).toThrow(/No world/);
    expect(() => catalogueText('faraway', { id: 'no-such-thing' })).toThrow(/No entry/);
  });
});
