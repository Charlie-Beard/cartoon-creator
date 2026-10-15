import { describe, expect, it } from 'vitest';
import { SHELF } from '../../src/cartoons';
import { checkLines, isKebab } from '../../src/core/cartoon';
import { speakers, WORLDS } from '../../src/worlds';

/** Every cartoon on the shelf loads, agrees with its shelf entry, and its lines pass the house rules. */
describe('cartoons', () => {
  it('have unique kebab-case ids', () => {
    const ids = SHELF.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(isKebab(id), id).toBe(true);
  });

  for (const entry of SHELF) {
    describe(entry.id, () => {
      it('matches its shelf entry', async () => {
        const c = (await entry.load()).default;
        expect({ id: c.id, title: c.title, world: c.world, summary: c.summary }).toEqual({
          id: entry.id,
          title: entry.title,
          world: entry.world,
          summary: entry.summary,
        });
        expect(c.world in WORLDS).toBe(true);
        expect(c.scenes.length).toBeGreaterThan(0);
      });

      it('has lines that pass the house rules', async () => {
        const c = (await entry.load()).default;
        expect(checkLines(c.lines, speakers())).toEqual([]);
      });
    });
  }
});
