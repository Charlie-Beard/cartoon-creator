/**
 * What the worlds contain, boiled down to ids for the cartoon checks
 * (scripts/lib/cartoon-lint.ts). Pure: no DOM, nothing is drawn.
 */
import { speakers, WORLDS } from '../../src/worlds';
import type { Catalogue } from './cartoon-lint';

/** The kit finds a backdrop or prop in the cartoon's world, then the common one, then any other, so one flat set will do. */
export function catalogue(): Catalogue {
  const characters: Record<string, string[]> = {};
  const backdrops = new Set<string>();
  const props = new Set<string>();
  for (const w of Object.values(WORLDS)) {
    for (const [id, c] of Object.entries(w.characters)) characters[id] = Object.keys(c.poses ?? {});
    for (const id of Object.keys(w.backdrops)) backdrops.add(id);
    for (const id of Object.keys(w.props)) props.add(id);
  }
  return { speakers: speakers(), characters, backdrops, props };
}
