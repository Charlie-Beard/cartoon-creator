import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Each world's signature sounds and moves (src/worlds/<id>/moves.ts, see
 * docs/WORLDS.md) are plain objects of functions. Doc comments can't be
 * tested here, so this only checks they are there and are functions;
 * the episodes that use them (npm run check, npm run shots) do the rest.
 */
const WORLDS_WITH_MOVES = ['common', 'faraway', 'hogwarts', 'bears'] as const;

const loaders = {
  common: () => import('../../src/worlds/common/moves'),
  faraway: () => import('../../src/worlds/faraway/moves'),
  hogwarts: () => import('../../src/worlds/hogwarts/moves'),
  bears: () => import('../../src/worlds/bears/moves'),
};

describe('world moves', () => {
  for (const id of WORLDS_WITH_MOVES) {
    describe(id, () => {
      it('has a moves.ts', () => {
        expect(existsSync(fileURLToPath(new URL(`../../src/worlds/${id}/moves.ts`, import.meta.url)))).toBe(true);
      });

      it('exports sounds and moves, each a non-empty object of functions', async () => {
        const m = await loaders[id]();
        for (const [group, fns] of [['sounds', m.sounds], ['moves', m.moves]] as const) {
          const entries = Object.entries(fns);
          expect(entries.length, `${id} ${group}`).toBeGreaterThan(0);
          for (const [name, fn] of entries) expect(fn, `${id}.${group}.${name}`).toBeTypeOf('function');
        }
      });

      it('does not use one name for both a sound and a move (scripts destructure both)', async () => {
        const m = await loaders[id]();
        const sounds = new Set(Object.keys(m.sounds));
        expect(Object.keys(m.moves).filter((n) => sounds.has(n))).toEqual([]);
      });
    });
  }

  it('give the two story worlds something to start from', async () => {
    const [faraway, hogwarts] = await Promise.all([loaders.faraway(), loaders.hogwarts()]);
    for (const m of [faraway, hogwarts]) {
      expect(Object.keys(m.sounds).length).toBeGreaterThanOrEqual(5);
      expect(Object.keys(m.moves).length).toBeGreaterThanOrEqual(3);
    }
  });
});
