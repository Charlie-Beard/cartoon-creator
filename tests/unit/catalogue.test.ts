import { describe, expect, it } from 'vitest';
import { catalogueText, SECTIONS, worldList } from '../../scripts/catalogue';
import { WORLDS } from '../../src/worlds';

/**
 * `npm run catalogue -- <world>` is the cheat sheet a cartoon writer reads
 * instead of src/worlds/<id>/index.ts. It must never leave a character or
 * backdrop out, and the sounds, moves and set pieces it reads from source
 * text must stay in step with what the moves.ts and pieces.ts files really
 * export.
 */
const startsALine = (text: string, id: string): boolean => new RegExp(`^\\s*${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'm').test(text);

const movesOf = {
  common: () => import('../../src/worlds/common/moves'),
  faraway: () => import('../../src/worlds/faraway/moves'),
  hogwarts: () => import('../../src/worlds/hogwarts/moves'),
  bears: () => import('../../src/worlds/bears/moves'),
} as const;

const piecesOf = {
  common: () => import('../../src/worlds/common/pieces'),
  faraway: () => import('../../src/worlds/faraway/pieces'),
  hogwarts: () => import('../../src/worlds/hogwarts/pieces'),
  bears: () => import('../../src/worlds/bears/pieces'),
} as const;

const isAsync = (f: unknown): boolean => typeof f === 'function' && f.constructor.name === 'AsyncFunction';
const isObjectOfFunctions = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && Object.values(v).length > 0 && Object.values(v).every((m) => typeof m === 'function');

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

      it('lists every set piece in its pieces.ts, with its parts, in every mode', async () => {
        const exported = await piecesOf[wid as keyof typeof piecesOf]();
        // The run-time exports tell pieces (async functions, objects of functions) from art and helpers.
        const pieces = Object.entries(exported).filter(([, v]) => isAsync(v) || isObjectOfFunctions(v));
        expect(pieces.length, 'a pieces.ts with no pieces').toBeGreaterThan(0);
        for (const mode of ['brief', 'normal', 'full'] as const) {
          const part = catalogueText(wid, { section: 'pieces', common: false, mode });
          expect(part, `${mode}: import line`).toContain(`from '../../worlds/${wid}/pieces'`);
          for (const [name, value] of pieces) {
            expect(startsALine(part, name), `${mode}: piece ${name}`).toBe(true);
            if (isObjectOfFunctions(value)) for (const member of Object.keys(value)) expect(part, `${mode}: ${name}.${member}`).toMatch(mode === 'brief' ? new RegExp(`^\\s+${name}: .*\\b${member}\\b`, 'm') : new RegExp(`^\\s+${member}\\(`, 'm'));
          }
        }
      });

      it('puts the art and helper exports on one line each, not among the pieces', async () => {
        const exported = await piecesOf[wid as keyof typeof piecesOf]();
        const part = catalogueText(wid, { section: 'pieces', common: false });
        const side = part.split('\n').filter((l) => /^\s+(?:art \(|also exported)/.test(l)).join('\n');
        const others = Object.entries(exported).filter(([, v]) => typeof v === 'function' && !isAsync(v));
        for (const [name] of others) {
          expect(side, `${name} on the art / helpers line`).toMatch(new RegExp(`\\b${name}\\b`));
          expect(part, `${name} is not a piece`).not.toMatch(new RegExp(`^\\s+${name}\\(k`, 'm'));
        }
      });

      it('gives a piece in full with --id, usage example included', async () => {
        const exported = await piecesOf[wid as keyof typeof piecesOf]();
        for (const [name, value] of Object.entries(exported)) {
          if (!isAsync(value) && !isObjectOfFunctions(value)) continue;
          const entry = catalogueText(wid, { id: name });
          expect(entry, name).toContain(`import { ${name} } from '../../worlds/${wid}/pieces'`);
          expect(entry, `${name}: example`).toMatch(new RegExp(`^\\s+(?:const \\w+ = |await |void )?(?:await )?${name}\\b.*\\(k`, 'm'));
        }
      });
    });
  }

  it('shows the common world under faraway unless asked not to', () => {
    expect(catalogueText('faraway')).toContain('common (available everywhere)');
    expect(catalogueText('faraway', { common: false })).not.toContain('common (available everywhere)');
  });

  it('shows common’s pieces under faraway, and drops them with --no-common', () => {
    expect(catalogueText('faraway', { section: 'pieces' })).toMatch(/^\s+warmEnding\(/m);
    expect(catalogueText('faraway', { section: 'pieces', common: false })).not.toContain('warmEnding');
    expect(catalogueText('faraway', { common: false })).not.toContain('common/pieces');
  });

  it('keeps the pieces section small: names, options and a line of doc, not the file', () => {
    // Together with common's, the default sheet grows by about 3.6 KB; the file itself is 10-30 KB per world.
    expect(catalogueText('faraway', { section: 'pieces' }).length).toBeLessThan(4500);
    expect(catalogueText('hogwarts', { section: 'pieces' }).length).toBeLessThan(4500);
    expect(catalogueText('faraway', { section: 'pieces', mode: 'brief' }).length).toBeLessThan(1200);
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
