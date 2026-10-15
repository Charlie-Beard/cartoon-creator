/**
 * Set pieces that suit any world: a "meanwhile…" cut, a noise off that
 * makes everyone prick up their ears, friends sneaking in, and the warm
 * ending. A set piece is a whole recurring bit of staging, so a scene can
 * say what happens in a few lines instead of building it beat by beat. The
 * one-shot sounds and moves are in ./moves.ts; the pieces use them.
 *
 *   import { meanwhile, noiseOff, sneakIn, warmEnding } from '../../worlds/common/pieces';
 *   await noiseOff(k, { listeners: [a, b, c], sound: () => whistle(1.6, 0.35), line: 'listen', by: b });
 *
 * How a piece works (docs/WORLDS.md, "pieces.ts"):
 *
 *   - A piece is an async function `(k, options)`, or an object with a
 *     `set` part (builds the opening picture: no waiting, no motion, so it
 *     is legal inside a scene's `set`) and a `play` part (does the
 *     animation). `set` returns the actors it made and `play` takes them.
 *   - Lines are never written in a piece. The cartoon passes line keys
 *     (`line: 'listen'`), which must be in its own `lines`, so the voice
 *     export finds them. A key a cartoon only hands to a piece still counts
 *     as used by `npm run check`.
 *   - Everything waits through the kit (`k.to`, `k.wait`, `k.say`, `k.cut`),
 *     so a skipped scene stops where it was.
 *   - One thing moves at a time, and a sound goes with every action that
 *     matters. A piece never starts motion that outlives it.
 *
 * Also here, for the world pieces to share: `Placed` and `placeAll` (put a few
 * characters on stage from a list), `centreOf` (where an actor's middle is now)
 * and `ensureBackdrop` (a whole-place piece's backdrop, unless the scene has one).
 */
import { gsap } from 'gsap';
import type { Kit, Mood } from '../../kit';

// ---------------------------------------------------------------- helpers

/**
 * Who stands where, for the pieces that put a few characters on stage: a
 * character id and the top-left corner they are placed at (docs/KIT.md,
 * `k.character`). Everything but `id` and `x` is optional.
 */
export interface Placed {
  id: string;
  x: number;
  /** Top-left y. Each piece has its own default, the height people usually stand at in that place. */
  y?: number;
  /** Width on stage (portraits are 300 × 340, so height is about 1.13 × width). */
  w?: number;
  z?: number;
  /** Face left. */
  flip?: boolean;
  pose?: string;
}

/** Puts each `Placed` character on stage, in order, and returns the actors in the same order. */
export function placeAll<K extends string>(k: Kit<K>, list: Placed[], defaults: { y: number; w: number }): HTMLElement[] {
  return list.map((p) => {
    const o: Parameters<Kit<K>['character']>[1] = { x: p.x, y: p.y ?? defaults.y, w: p.w ?? defaults.w };
    if (p.z !== undefined) o.z = p.z;
    if (p.flip) o.flip = true;
    if (p.pose) o.pose = p.pose;
    return k.character(p.id, o);
  });
}

/**
 * Gives the scene its backdrop, unless it has one already. The pieces that
 * are a whole place (the top of the ladder, Moon-Face's room) call this so a
 * scene works with just the piece; call `k.backdrop('moon-room')` yourself
 * first if you like (the checker reads those calls) or to choose another place.
 */
export function ensureBackdrop<K extends string>(k: Kit<K>, id: string): void {
  if (!k.root.querySelector(':scope > .story-backdrop')) k.backdrop(id);
}

/** Where the middle of an actor is on the stage right now, counting any movement so far. Handy for aiming sparkles and puffs at someone. */
export function centreOf(el: HTMLElement): [number, number] {
  const w = parseFloat(el.style.width) || el.offsetWidth;
  const h = parseFloat(el.style.height) || el.offsetHeight;
  return [
    (parseFloat(el.style.left) || 0) + w / 2 + (Number(gsap.getProperty(el, 'x')) || 0),
    (parseFloat(el.style.top) || 0) + h / 2 + (Number(gsap.getProperty(el, 'y')) || 0),
  ];
}

/** Anything that can be said by a key and spoken by an actor. */
type Speaker = HTMLElement | undefined;

// ------------------------------------------------------------- meanwhile

/**
 * "Meanwhile…": a paper sheet sweeps across, the new place is built under
 * it, and (if you give a line) the narrator says where we are. The way to
 * cut away to the villain, or back to the tree, without a whole scene.
 *
 * Options:
 *   build   builds the new set, exactly as a scene's `set` does (no waiting,
 *           no motion); whatever it returns is handed back to you
 *   line    a line key for the narrator, said once the new place is there
 *   by      who says it, if it isn't the narrator
 *   music   a music bed to start under the new place
 *
 * Returns whatever `build` returned (usually the new actors).
 *
 *   const { snap } = await meanwhile(k, {
 *     build: () => { k.backdrop('snap-school'); return { snap: k.character('dameSnap', { x: 770, y: 225, w: 380 }) }; },
 *     line: 'meanwhile',
 *     music: 'sneaky',
 *   });
 */
export async function meanwhile<K extends string, T>(k: Kit<K>, o: { build: () => T; line?: K; by?: Speaker; music?: Mood }): Promise<T> {
  let made!: T;
  await k.cut(() => {
    made = o.build();
    if (o.music) k.music(o.music);
  });
  if (o.line) await k.say(o.line, o.by);
  return made;
}

// -------------------------------------------------------------- noise off

/**
 * A noise off: something far away makes everyone prick up their ears. The
 * hook that ends a scene ("Listen! That's your kettle!"). They lift and
 * tilt one after another, a second noise can follow, someone says what it
 * was, and they settle again.
 *
 * Options:
 *   listeners  who hears it, in the order they notice (not all need to be on stage)
 *   sound      the first noise (`() => whistle(1.6, 0.35)`)
 *   then       an optional second noise, half a second later (`() => heels(2, 0.5, 0.3)`)
 *   line       a line key, said after the noises
 *   by         who says it
 *   during     something to run while it is said (`() => flutter(k, silky, 6)`)
 *   beat       the quiet before the first noise, in ms (default 300)
 *
 * Returns nothing; the listeners are back where they were.
 *
 *   await noiseOff(k, { listeners: [mf, silky, pan], sound: () => whistle(1.6, 0.35), then: () => heels(2, 0.5, 0.3), line: 'listen', by: silky });
 */
export async function noiseOff<K extends string>(
  k: Kit<K>,
  o: { listeners: HTMLElement[]; sound: () => void; then?: () => void; line?: K; by?: Speaker; during?: () => Promise<unknown>; beat?: number },
): Promise<void> {
  await k.wait(o.beat ?? 300);
  o.sound();
  // Heads come up one after another, the middle one tilting the other way.
  await k.all(...o.listeners.map((el, i) => k.wait(i * 120).then(() => k.to(el, 0.4, { y: '-=14', rotation: i % 2 === 1 ? 4 : -4 }))));
  await k.wait(500);
  if (o.then) {
    o.then();
    await k.wait(800);
  }
  if (o.line) await k.all(k.say(o.line, o.by), o.during?.() ?? Promise.resolve());
  await k.all(...o.listeners.map((el) => k.to(el, 0.4, { y: '+=14', rotation: 0 })));
  await k.wait(300);
}

// ---------------------------------------------------------------- sneakIn

/**
 * Friends tiptoeing in to somewhere they shouldn't be (the villain's lair,
 * a night-time corridor): a creeping sound, the walkers hopping slowly
 * along, anyone who flies gliding beside them.
 *
 *   sneakIn.set(k, actors, { from })    parks them just off stage, in `set`
 *   sneakIn.play(k, { walkers, gliders })   they creep to where you placed them
 *
 * `set` options: `from` 'left' (default) or 'right', `distance` in stage
 * points (default 520: well off the edge for actors placed in the left or
 * middle of the stage). `play` options: `walkers` (hop along), `gliders`
 * (fly along, on the same path), `seconds` (default 1.6), `hops` (default
 * 6), `distance` and `from` as in `set`. Both parts must agree on
 * `from` and `distance`.
 *
 *   sneakIn.set(k, [mf, pan, silky]);                 // in set
 *   void flutter(k, silky, 9);                        // in play
 *   await sneakIn.play(k, { walkers: [mf, pan], gliders: [silky] });
 */
export const sneakIn = {
  /** Parks the actors off stage to one side, ready for `play`. No motion: legal in a scene's `set`. */
  set<K extends string>(k: Kit<K>, actors: HTMLElement[], o: { from?: 'left' | 'right'; distance?: number } = {}): HTMLElement[] {
    const dx = (o.from === 'right' ? 1 : -1) * (o.distance ?? 520);
    k.set(actors, { x: dx });
    return actors;
  },

  /** The friends creep in to the places `set` gave them, with a sneaking sound. */
  async play<K extends string>(
    k: Kit<K>,
    o: { walkers: HTMLElement[]; gliders?: HTMLElement[]; seconds?: number; hops?: number; from?: 'left' | 'right'; distance?: number },
  ): Promise<void> {
    const dx = (o.from === 'right' ? -1 : 1) * (o.distance ?? 520);
    const seconds = o.seconds ?? 1.6;
    k.fx.sneak();
    await k.all(
      ...o.walkers.map((el) => k.walk(el, dx, seconds, o.hops ?? 6)),
      ...(o.gliders ?? []).map((el) => k.to(el, seconds, { x: `+=${dx}`, ease: 'sine.inOut' })),
    );
  },
};

// ------------------------------------------------------------- warmEnding

/**
 * The warm ending: everyone together, hopping for joy one after another, a
 * burst of sparkles, a twinkle, a beat of quiet, then (if you give one) the
 * narrator's last line. It always ends safe and glad. The last thing he
 * sees before The End.
 *
 * Options:
 *   cast      everyone who is there, in the order they hop
 *   end       a line key for the narrator's last words ("And they all had tea.")
 *   music     the music bed (default 'triumph'; `false` leaves what is playing)
 *   hops      how many hops each (default 3)
 *   stagger   ms between one friend starting and the next (default 220)
 *   sparkleAt where the sparkles burst, [x, y] (default the middle, [590, 300])
 *   confetti  true to let confetti fall as well (a big party; default false)
 *   hold      ms of calm after the last line before the piece returns (default 1200)
 *
 * Returns nothing. Start anything that should carry on under it (a kettle
 * whistling, Moon-Face beaming) with `void` first.
 *
 *   void beam(k, mf, true);
 *   await warmEnding(k, { cast: [pan, mf, silky], end: 'end' });
 */
export async function warmEnding<K extends string>(
  k: Kit<K>,
  o: { cast: HTMLElement[]; end?: K; music?: Mood | false; hops?: number; stagger?: number; sparkleAt?: [number, number]; confetti?: boolean; hold?: number },
): Promise<void> {
  if (o.music !== false) k.music(o.music ?? 'triumph');
  await k.all(...o.cast.map((el, i) => k.wait(i * (o.stagger ?? 220)).then(() => k.hop(el, 30, o.hops ?? 3))));
  const [x, y] = o.sparkleAt ?? [590, 300];
  k.sparkle(x, y, 18, 300);
  k.fx.twinkle();
  if (o.confetti) k.confetti(30);
  await k.wait(400);
  if (o.end) await k.say(o.end);
  await k.wait(o.hold ?? 1200);
}
