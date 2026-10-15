import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Each world's set pieces (src/worlds/<id>/pieces.ts, see docs/WORLDS.md) are
 * either an async function, or an object whose parts are functions (`set`
 * builds the opening picture, `play` animates). They need a stage to run, so
 * this only checks they are there and are the right shape; the episodes that
 * use them (npm run check, npm run shots) do the rest.
 */
const loaders = {
  common: () => import('../../src/worlds/common/pieces'),
  faraway: () => import('../../src/worlds/faraway/pieces'),
  hogwarts: () => import('../../src/worlds/hogwarts/pieces'),
};

/** Every export of a pieces file that is meant to be a piece (not art, a helper or a type). */
const PIECES: Record<keyof typeof loaders, string[]> = {
  common: ['meanwhile', 'noiseOff', 'sneakIn', 'warmEnding'],
  faraway: ['ladderArrival', 'landMovesOn', 'slipperySlip', 'teaTime', 'trapdoorArrival', 'snapLoom', 'snapDefeat'],
  hogwarts: ['owlPost', 'greatHall', 'spellLesson', 'broomArrival', 'apparateArrival', 'voldemortLoom'],
};

/** Pieces that come in parts must have a `set` and a `play` (or at least some parts, all functions). */
const SET_AND_PLAY = ['sneakIn', 'ladderArrival', 'slipperySlip', 'teaTime', 'trapdoorArrival', 'owlPost', 'greatHall', 'spellLesson', 'broomArrival', 'apparateArrival'];

describe('world pieces', () => {
  for (const id of Object.keys(loaders) as (keyof typeof loaders)[]) {
    describe(id, () => {
      it('has a pieces.ts', () => {
        expect(existsSync(fileURLToPath(new URL(`../../src/worlds/${id}/pieces.ts`, import.meta.url)))).toBe(true);
      });

      it('exports each of its pieces as a function, or an object of functions', async () => {
        const m = (await loaders[id]()) as Record<string, unknown>;
        for (const name of PIECES[id]) {
          const piece = m[name];
          expect(piece, `${id}.${name}`).toBeDefined();
          if (typeof piece === 'function') continue;
          expect(piece, `${id}.${name}`).toBeTypeOf('object');
          const parts = Object.entries(piece as Record<string, unknown>);
          expect(parts.length, `${id}.${name} has parts`).toBeGreaterThan(0);
          for (const [part, fn] of parts) expect(fn, `${id}.${name}.${part}`).toBeTypeOf('function');
        }
      });

      it('gives every piece that has parts a set and a play', async () => {
        const m = (await loaders[id]()) as unknown as Record<string, Record<string, unknown>>;
        for (const name of PIECES[id].filter((n) => SET_AND_PLAY.includes(n))) {
          expect(m[name].set, `${id}.${name}.set`).toBeTypeOf('function');
          expect(m[name].play, `${id}.${name}.play`).toBeTypeOf('function');
        }
      });
    });
  }

  it('give each story world something to start from', async () => {
    expect(PIECES.faraway.length).toBeGreaterThanOrEqual(5);
    expect(PIECES.hogwarts.length).toBeGreaterThanOrEqual(5);
    expect(PIECES.common.length).toBeGreaterThanOrEqual(2);
  });

  it('draw their own art as strings, so a cartoon can pass a name to seed the torn edges', async () => {
    const [f, h] = await Promise.all([loaders.faraway(), loaders.hogwarts()]);
    for (const art of [f.greyCloud('test-cloud'), f.teaTable('test-table'), h.longTable('test-long-table'), h.lessonDesk('test-desk')]) {
      expect(art).toMatch(/^<svg/);
    }
    // The same name always draws the same paper.
    expect(f.greyCloud('test-cloud')).toBe(f.greyCloud('test-cloud'));
  });
});
