import { describe, expect, it } from 'vitest';
import { ALL_CARTOONS as SHELF } from '../../src/cartoons';
import { SHELF as ON_DISK } from '../../scripts/lib/shelf';
import { SHOWING, showingIds } from '../../src/cartoons/shelf';
import { checkLines, isKebab } from '../../src/core/cartoon';
import { speakers, WORLDS } from '../../src/worlds';

/** Every cartoon on the shelf loads, agrees with its meta.ts, and its lines pass the house rules. */
describe('cartoons', () => {
  it('are found the same way by the library and by the scripts', () => {
    expect(SHELF.map((c) => c.id)).toEqual(ON_DISK.map((c) => c.id));
  });

  it('have unique kebab-case ids', () => {
    const ids = SHELF.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(isKebab(id), id).toBe(true);
  });

  it('show only cartoons that exist, and a timed one only once its time has come', () => {
    for (const s of SHOWING ?? []) {
      const id = typeof s === 'string' ? s : s.id;
      expect(SHELF.some((c) => c.id === id), id).toBe(true);
      if (typeof s !== 'string') expect(Number.isNaN(new Date(s.from).getTime()), s.from).toBe(false);
    }
    const list = ['a', { id: 'b', from: '2026-10-26T10:00' }];
    expect(showingIds(list, new Date('2026-10-26T09:59'))).toEqual(['a']);
    expect(showingIds(list, new Date('2026-10-26T10:00'))).toEqual(['a', 'b']);
  });

  for (const entry of SHELF) {
    describe(entry.id, () => {
      it('is in a folder named after its id, and its script spreads its meta', async () => {
        const c = (await entry.load()).default;
        expect(entry.load).toBeTypeOf('function');
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
