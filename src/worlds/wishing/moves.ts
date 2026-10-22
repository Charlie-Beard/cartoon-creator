/**
 * The Wishing-Chair's signature sounds and moves: the chair's happy creak
 * and its wingbeats, the tinkle of Jigs's hat bell, the wind up high, the
 * giant's roar, his snores and his yawn; the chair wriggling its legs, its
 * wings growing, flapping and folding away. Check here (and
 * common/moves.ts) before writing your own (docs/WORLDS.md, "moves.ts").
 *
 *   import { sounds, moves } from '../../worlds/wishing/moves';
 *   sounds.creak();
 *   await moves.growWings(k, chair);
 *
 * The chair's moves work on the `wishing-chair` prop (its parts wingL and
 * wingR); to move the chair with riders in it, use the chairRide set piece.
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../audio/synth';
import type { Kit } from '../../kit';

export const sounds = {
  /** The chair's happy creak: a little wooden "cree-eak" that rises. Use when it wriggles, is patted or is pleased. */
  creak(): void {
    const t = now();
    tone(180, t, { wave: 'sawtooth', peak: 0.03, attack: 0.05, decay: 0.35, glideTo: 260, lowpass: 900 });
    tone(240, t + 0.3, { wave: 'sawtooth', peak: 0.025, attack: 0.05, decay: 0.3, glideTo: 330, lowpass: 900 });
  },

  /** The chair's wings beating: soft feathery whooshes, `times` of them. Use with moves.flap. */
  wingbeats(times = 4): void {
    const t = now();
    for (let i = 0; i < times; i++) noiseBurst(t + i * 0.32, { freq: 600, type: 'lowpass', peak: 0.05, attack: 0.06, decay: 0.2, sweepTo: 300 });
  },

  /** Jigs's hat bell: two tiny tinkles. Use when he pops up, nods or hurries. */
  hatBell(): void {
    const t = now();
    bell(NOTE.E6, t, 0.05, 0.4);
    bell(NOTE.C6, t + 0.12, 0.04, 0.4);
  },

  /** The wind high up: a long soft rush that swells and fades over `seconds`. Use under a flying scene. */
  highWind(seconds = 3): void {
    noiseBurst(now(), { freq: 500, type: 'lowpass', peak: 0.05, attack: seconds * 0.4, decay: seconds * 0.6, sweepTo: 900 });
  },

  /** The giant's roar: a deep, wobbling "RAAARGH" that falls. Loud enough to feel, never harsh. Use as he looms. */
  roar(): void {
    const t = now();
    tone(110, t, { wave: 'sawtooth', peak: 0.07, attack: 0.08, decay: 1.1, glideTo: 70, lowpass: 500, vibrato: [7, 6] });
    noiseBurst(t, { freq: 300, type: 'lowpass', peak: 0.06, attack: 0.08, decay: 1, sweepTo: 150 });
  },

  /** A giant snore: a long rumbling breath in and a whistle out, `times` of them. Use once he's asleep. */
  snore(times = 2): void {
    const t = now();
    for (let i = 0; i < times; i++) {
      const s = t + i * 2.2;
      tone(70, s, { wave: 'sawtooth', peak: 0.05, attack: 0.5, decay: 0.7, glideTo: 60, lowpass: 300 });
      tone(NOTE.A5, s + 1.2, { wave: 'sine', peak: 0.03, attack: 0.1, decay: 0.6, glideTo: NOTE.E5 });
    }
  },

  /** A huge, sleepy giant yawn: a slow deep note sliding down. Use as he gets tired. */
  yawn(): void {
    tone(160, now(), { wave: 'triangle', peak: 0.07, attack: 0.3, decay: 1.6, glideTo: 80, lowpass: 700 });
  },
};

/** The chair's two wings, ready to turn about their roots (empty if it has none). */
const wingsOf = (k: Kit, chair: HTMLElement): { l: SVGGElement[]; r: SVGGElement[] } => ({
  l: k.pivot(k.part(chair, 'wingL')),
  r: k.pivot(k.part(chair, 'wingR')),
});

export const moves = {
  /** The chair wriggles its legs, wanting to fly: a little wobble from side to side, with a creak. Use as a hint that it's magic. */
  async wriggle(k: Kit, chair: HTMLElement, times = 3): Promise<void> {
    sounds.creak();
    for (let i = 0; i < times; i++) {
      await k.to(chair, 0.12, { rotation: 4, ease: 'sine.inOut' });
      await k.to(chair, 0.12, { rotation: -4, ease: 'sine.inOut' });
    }
    await k.to(chair, 0.12, { rotation: 0 });
  },

  /** The chair grows its wings: they fade in folded and open out with a twinkle and a sparkle. Use when it decides to fly. */
  async growWings(k: Kit, chair: HTMLElement): Promise<void> {
    const { l, r } = wingsOf(k, chair);
    if (!l.length && !r.length) return;
    k.set(l, { rotation: 50, opacity: 0 });
    k.set(r, { rotation: -50, opacity: 0 });
    k.fx.twinkle();
    const b = k.box(chair);
    k.sparkle(b.x + b.w / 2, b.y + b.h * 0.3, 16, b.w * 0.6);
    await k.all(k.to(l, 0.8, { opacity: 1, rotation: 0, ease: 'back.out(1.6)' }), k.to(r, 0.8, { opacity: 1, rotation: 0, ease: 'back.out(1.6)' }));
  },

  /** The wings beat `times` times, with their whoosh. `void` it while the chair flies. */
  async flap(k: Kit, chair: HTMLElement, times = 3): Promise<void> {
    const { l, r } = wingsOf(k, chair);
    if (!l.length && !r.length) return;
    sounds.wingbeats(times);
    for (let i = 0; i < times; i++) {
      await k.all(k.to(l, 0.16, { rotation: 28, ease: 'sine.inOut' }), k.to(r, 0.16, { rotation: -28, ease: 'sine.inOut' }));
      await k.all(k.to(l, 0.16, { rotation: -8, ease: 'sine.inOut' }), k.to(r, 0.16, { rotation: 8, ease: 'sine.inOut' }));
    }
    await k.all(k.to(l, 0.12, { rotation: 0 }), k.to(r, 0.12, { rotation: 0 }));
  },

  /** The wings droop, tired: they sag down slowly. Use when the magic is wearing off. */
  async droop(k: Kit, chair: HTMLElement): Promise<void> {
    const { l, r } = wingsOf(k, chair);
    tone(NOTE.G4, now(), { wave: 'triangle', peak: 0.05, attack: 0.05, decay: 0.8, glideTo: NOTE.C4 });
    await k.all(k.to(l, 0.9, { rotation: 35, ease: 'power1.out' }), k.to(r, 0.9, { rotation: -35, ease: 'power1.out' }));
  },

  /** The wings fold away and vanish, with a soft poof. Use when the flight is over. */
  async foldWings(k: Kit, chair: HTMLElement): Promise<void> {
    const { l, r } = wingsOf(k, chair);
    k.fx.poof();
    await k.all(k.to(l, 0.6, { rotation: 50, opacity: 0 }), k.to(r, 0.6, { rotation: -50, opacity: 0 }));
  },
};
