import { describe, expect, it } from 'vitest';
import { isKebab } from '../../src/core/cartoon';
import { WORLDS } from '../../src/worlds';

/** Every world, character, backdrop and prop must draw, and ids must not clash. */
describe('worlds', () => {
  const worlds = Object.entries(WORLDS);

  it('are keyed by their own kebab-case id', () => {
    for (const [key, w] of worlds) {
      expect(w.id).toBe(key);
      expect(isKebab(w.id)).toBe(true);
    }
  });

  it('have unique character ids across all worlds', () => {
    const seen = new Map<string, string>();
    for (const [wid, w] of worlds) {
      for (const id of Object.keys(w.characters)) {
        expect(seen.get(id), `"${id}" is in both ${seen.get(id)} and ${wid}`).toBeUndefined();
        seen.set(id, wid);
      }
    }
  });

  for (const [wid, w] of worlds) {
    describe(wid, () => {
      it('has notes for writers', () => {
        expect(w.about.length).toBeGreaterThan(10);
        for (const [id, c] of Object.entries(w.characters)) {
          expect(c.about.length, `${id}.about`).toBeGreaterThan(10);
          expect(c.voice.length, `${id}.voice`).toBeGreaterThan(5);
        }
      });

      it('draws every character and pose as an SVG, with the parts it lists', () => {
        for (const [id, c] of Object.entries(w.characters)) {
          const art = c.art();
          expect(art.startsWith('<svg'), id).toBe(true);
          for (const p of c.parts ?? []) expect(art.includes(`data-part="${p}"`), `${id} part ${p}`).toBe(true);
          for (const [pose, draw] of Object.entries(c.poses ?? {})) expect(draw().startsWith('<svg'), `${id}:${pose}`).toBe(true);
        }
      });

      it('draws every backdrop at stage size and every prop', () => {
        for (const [id, b] of Object.entries(w.backdrops)) {
          expect(b.art(), id).toMatch(/^<svg[^>]*viewBox="0 0 1180 820"/);
          expect(b.about.length, id).toBeGreaterThan(5);
        }
        for (const [id, p] of Object.entries(w.props)) {
          expect(p.art().startsWith('<svg'), id).toBe(true);
          expect(p.about.length, id).toBeGreaterThan(3);
        }
      });
    });
  }
});
