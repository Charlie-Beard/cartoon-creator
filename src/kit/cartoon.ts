/**
 * A cartoon: an episode of a few scenes, written as a script.
 *
 *   export default defineCartoon({
 *     id: 'lost-kettle',
 *     title: 'The Lost Kettle',
 *     world: 'faraway',
 *     summary: 'The Saucepan Man loses his kettle, and Jasper helps find it.',
 *     lines: {
 *       hello: { who: 'moonface', text: 'Hello, {name}! Have you seen a kettle?' },
 *     },
 *     scenes: [
 *       {
 *         name: 'Moon-Face's room',
 *         set(k) {
 *           k.backdrop('moon-room');
 *           cast.mf = k.character('moonface', { x: 700, y: 330 });
 *         },
 *         async play(k) {
 *           await k.say('hello', cast.mf);
 *         },
 *       },
 *     ],
 *   });
 *
 * `set` builds a scene's opening picture (hidden behind the curtains or
 * the paper wipe, so it must not wait or move anything); `play` runs it.
 * Actors made in `set` are shared with `play` through a module-level
 * `cast` object. Every line is listed up front so scripts/voice/export.ts
 * can send it to be recorded.
 *
 * See docs/WRITING.md for how to write one, and the new-cartoon skill.
 */
import type { CartoonInfo, Line } from '../core/cartoon';
import type { Kit } from './kit';

export interface SceneDef<K extends string> {
  /** A few words, for the scene list and screenshots ("The kettle is gone"). */
  name: string;
  /** Builds the scene's first picture: backdrop and actors in place. No waiting, no movement. */
  set(k: Kit<K>): void;
  /** Runs the scene. Resolves when it has finished. */
  play(k: Kit<K>): Promise<void>;
}

export interface CartoonDef<K extends string> extends CartoonInfo {
  /** Every spoken line, by key. */
  lines: Record<K, Line>;
  /** The scenes, in order. Between each, the player sweeps a paper wipe across. */
  scenes: SceneDef<K>[];
}

export type Cartoon = CartoonDef<string>;

export const defineCartoon = <K extends string>(c: CartoonDef<K>): CartoonDef<K> => c;
