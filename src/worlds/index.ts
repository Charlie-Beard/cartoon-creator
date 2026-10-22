/**
 * Every world, by id. Append-only (one line per world) so parallel PRs
 * stay mergeable. Character ids must be unique across all worlds: a
 * cartoon may borrow anyone (tests/unit/worlds.test.ts checks).
 */
import common from './common';
import faraway from './faraway';
import hogwarts from './hogwarts';
import bears from './bears';
import wishing from './wishing';
import type { BackdropDef, CharacterDef, PropDef, World } from './types';

export const WORLDS: Record<string, World> = {
  common,
  faraway,
  hogwarts,
  bears,
  wishing,
};

export type { BackdropDef, CharacterDef, PropDef, World } from './types';

/** A character from any world. */
export function findCharacter(id: string): CharacterDef | undefined {
  for (const w of Object.values(WORLDS)) if (id in w.characters) return w.characters[id];
  return undefined;
}

/**
 * A backdrop or prop by id: the cartoon's own world first, then the
 * common world, then any other world (so a crossover can visit).
 */
function find<T>(kind: 'backdrops' | 'props', id: string, world?: string): T | undefined {
  const order = [world, 'common', ...Object.keys(WORLDS)].filter((w): w is string => !!w && w in WORLDS);
  for (const w of order) {
    const hit = WORLDS[w][kind][id];
    if (hit) return hit as T;
  }
  return undefined;
}

export const findBackdrop = (id: string, world?: string): BackdropDef | undefined => find<BackdropDef>('backdrops', id, world);
export const findProp = (id: string, world?: string): PropDef | undefined => find<PropDef>('props', id, world);

/** Everyone who may speak a line: the narrator and every character. */
export function speakers(): Set<string> {
  const s = new Set(['narrator']);
  for (const w of Object.values(WORLDS)) for (const id of Object.keys(w.characters)) s.add(id);
  return s;
}
