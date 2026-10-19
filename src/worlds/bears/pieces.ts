/**
 * The bears' set pieces (docs/WORLDS.md, "pieces.ts"): Mummy's story
 * cloud (a story told inside a dream cloud above the teller), and Uncle
 * Bill's helicopter flying in, letting its rope down and flying off, a
 * round of Musical Chairs, and birthday candles blown out.
 *
 *   import { candles, helicopterVisit, musicalChairs, storyCloud } from '../../worlds/bears/pieces';
 *
 * Lines are keys, never text; his turn (k.tapToHelp) stays in the script,
 * between a piece's parts.
 */
import type { Kit } from '../../kit';
import { sounds } from './moves';

// ------------------------------------------------------------ story cloud

/**
 * A story told in a thought-cloud: the cloud grows out of the teller's head
 * in two little puffs, the story's people and props appear inside it, and
 * it shrinks away at the end. The way to tell "The Three Bears" inside
 * "Teddy and the Three Bears", or to show what someone is imagining.
 *
 * Parts:
 *   set(k, { x, y, w? })   puts the cloud (prop `thought-cloud`, 520 × 360
 *                          at w 520) hidden at x, y; returns { cloud }
 *   open(k, a, { line?, by? })   grows it in with a twinkle, then says the line
 *   close(k, a, { inside? })     shrinks it away, with everything you put inside
 *
 * Put the story's actors inside the cloud's white middle (in its own units
 * x 70–450, y 70–260, scaled by w / 520), hidden, and k.appear them during
 * the story; pass them to `close` as `inside` so they go with it.
 *
 *   const a = storyCloud.set(k, { x: 560, y: 40 });
 *   await storyCloud.open(k, a, { line: 'onceUpon', by: mummy });
 *   ...
 *   await storyCloud.close(k, a, { inside: [goldi, bowl] });
 */
export const storyCloud = {
  set<K extends string>(k: Kit<K>, o: { x: number; y: number; w?: number }): { cloud: HTMLElement } {
    const cloud = k.prop('thought-cloud', { x: o.x, y: o.y, w: o.w ?? 520 });
    k.set(cloud, { opacity: 0, scale: 0.3, transformOrigin: '10% 95%' });
    return { cloud };
  },
  async open<K extends string>(k: Kit<K>, a: { cloud: HTMLElement }, o: { line?: K; by?: HTMLElement } = {}): Promise<void> {
    k.fx.twinkle();
    await k.to(a.cloud, 0.9, { opacity: 1, scale: 1, ease: 'back.out(1.4)' });
    if (o.line) await k.say(o.line, o.by);
  },
  async close<K extends string>(k: Kit<K>, a: { cloud: HTMLElement }, o: { inside?: HTMLElement[] } = {}): Promise<void> {
    k.fx.poof();
    await k.all(k.to(a.cloud, 0.7, { opacity: 0, scale: 0.3 }), ...(o.inside ?? []).map((el) => k.to(el, 0.5, { opacity: 0 })));
  },
};

// ------------------------------------------------------------- helicopter

/**
 * Uncle Bill's helicopter (prop `helicopter`, 440 × 320; Uncle Bill is in
 * the bubble): it flies in from the side with its rotor turning, hovers,
 * lets its rope down, and flies off. Teddy hanging on the rope is the
 * script's job: put him under the rope's end and move him with the
 * helicopter (`k.to` both together).
 *
 * Parts:
 *   set(k, { x, y, w?, from? })  puts it off stage on the `from` side
 *                                ('right' by default), to fly to x, y; returns { heli }
 *   arrive(k, a, { line?, by? }) flies in with a whirr, hovering, then says the line
 *   rope(k, a)                   lets the rope down (no turn: put k.tapToHelp before it)
 *   leave(k, a, { side?, with? }) flies off, taking `with` (Teddy) along
 *
 * The rope's end is at about (215, 316) in the prop's own units: at w 440
 * and placed at x, y it hangs at (x + 215, y + 316).
 *
 *   const h = helicopterVisit.set(k, { x: 560, y: 60 });
 *   await helicopterVisit.arrive(k, h, { line: 'whatAreYouDoing', by: h.heli });
 *   await helicopterVisit.rope(k, h);
 *   await helicopterVisit.leave(k, h, { with: [teddy] });
 */
export const helicopterVisit = {
  set<K extends string>(k: Kit<K>, o: { x: number; y: number; w?: number; from?: 'left' | 'right' }): { heli: HTMLElement; from: 'left' | 'right' } {
    const heli = k.prop('helicopter', { x: o.x, y: o.y, w: o.w ?? 440 });
    const from = o.from ?? 'right';
    k.set(heli, { x: from === 'right' ? 1300 - o.x : -o.x - 480 });
    return { heli, from };
  },
  async arrive<K extends string>(k: Kit<K>, a: { heli: HTMLElement }, o: { line?: K; by?: HTMLElement } = {}): Promise<void> {
    const rotor = k.part(a.heli, 'rotor');
    void k.to(rotor, 0.12, { scaleX: 0.2, yoyo: true, repeat: 40, transformOrigin: '50% 50%' });
    sounds.whirr(3);
    await k.to(a.heli, 2.4, { x: 0, ease: 'power2.out' });
    void k.float(a.heli, 6, 1.6);
    if (o.line) await k.say(o.line, o.by);
  },
  async rope<K extends string>(k: Kit<K>, a: { heli: HTMLElement }): Promise<void> {
    k.fx.whizz();
    await k.fade(k.part(a.heli, 'rope'), 1, 0.6);
  },
  async leave<K extends string>(k: Kit<K>, a: { heli: HTMLElement }, o: { side?: 'left' | 'right'; with?: HTMLElement[] } = {}): Promise<void> {
    const dx = (o.side ?? 'left') === 'left' ? -1500 : 1500;
    const rotor = k.part(a.heli, 'rotor');
    void k.to(rotor, 0.12, { scaleX: 0.2, yoyo: true, repeat: 30, transformOrigin: '50% 50%' });
    sounds.whirr(2.5);
    await k.all(k.to(a.heli, 2.6, { x: `+=${dx}`, y: '-=60', ease: 'power2.in' }), ...(o.with ?? []).map((el) => k.to(el, 2.6, { x: `+=${dx}`, y: '-=60', ease: 'power2.in' })));
  },
};

// ------------------------------------------------- party games and candles

/**
 * A round of Musical Chairs: the tune plays while the players hop along
 * and back, it stops with a plonk, and everyone freezes with a wobble and a
 * giggle. About 6 s. Fades the music bed first; start it again after.
 */
export async function musicalChairs<K extends string>(k: Kit<K>, o: { players: HTMLElement[]; distance?: number }): Promise<void> {
  const d = o.distance ?? 120;
  k.silence();
  sounds.chairsTune(2);
  await k.all(...o.players.map((el) => k.walk(el, d, 1.5, 5)));
  await k.all(...o.players.map((el) => k.walk(el, -d, 1.5, 5)));
  sounds.plonk();
  await k.all(...o.players.map((el) => k.shake(el, 6, 2)));
}

/**
 * Candles blown out on a `birthday-cake` prop: a puff, the flames fade, a
 * curl of smoke, confetti and a fanfare, then (if given) `line` by `by`
 * ("Happy birthday!"). Put his `k.tapToHelp` on the cake just before it.
 */
export async function candles<K extends string>(k: Kit<K>, o: { cake: HTMLElement; line?: K; by?: HTMLElement }): Promise<void> {
  sounds.blow();
  await k.fade(k.part(o.cake, 'flames'), 0, 0.6);
  await k.fade(k.part(o.cake, 'smoke'), 1, 0.4);
  void k.fade(k.part(o.cake, 'smoke'), 0, 1.5);
  k.confetti(30);
  k.sfx.fanfare();
  if (o.line) await k.say(o.line, o.by);
}
