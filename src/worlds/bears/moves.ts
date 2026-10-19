/**
 * The bears' signature sounds and moves: the sea and its gulls, Captain
 * Bear's whistle and his roar, Uncle Bill's helicopter, a muddy splat,
 * stirring porridge, Teddy flapping his arms to fly; a big bear sneeze, a
 * grumpy sigh, the Musical Chairs tune, candles blown out, and bears ducking
 * down behind a bush and peeping up again. Check here (and
 * common/moves.ts) before writing your own (docs/WORLDS.md, "moves.ts").
 *
 *   import { sounds, moves } from '../../worlds/bears/moves';
 *   sounds.waves(3);
 *   await moves.flap(k, teddy, 4);
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../audio/synth';
import type { Kit } from '../../kit';

export const sounds = {
  /** Little waves on the shore: soft rushes in and out for about `seconds`. Use under a seaside scene's opening. */
  waves(seconds = 3): void {
    const t = now();
    for (let i = 0; i < Math.max(1, Math.round(seconds / 1.5)); i++) {
      noiseBurst(t + i * 1.5, { freq: 700, type: 'lowpass', peak: 0.06, attack: 0.5, decay: 1.1, sweepTo: 400 });
    }
  },

  /** A seagull's call: two falling cries. Use when a gull flies over, or to say "we're at the seaside". */
  seagull(): void {
    const t = now();
    [0, 0.32].forEach((dt) => tone(1500, t + dt, { wave: 'triangle', peak: 0.05, attack: 0.02, decay: 0.24, glideTo: 950, lowpass: 3000 }));
  },

  /** Captain Bear's whistle: one long bright peep. Use to start or end the sand-castle judging. */
  whistle(): void {
    tone(2350, now(), { wave: 'sine', peak: 0.07, attack: 0.02, decay: 0.7, vibrato: [30, 40] });
  },

  /** The helicopter: a soft chopping whirr for `seconds`. Use as Uncle Bill flies in and away (never loud). */
  whirr(seconds = 2.5): void {
    const t = now();
    const n = Math.round(seconds * 9);
    for (let i = 0; i < n; i++) {
      const fade = Math.min(1, i / 6, (n - i) / 6);
      noiseBurst(t + i / 9, { freq: 260, type: 'lowpass', peak: 0.07 * fade, attack: 0.01, decay: 0.08 });
    }
    tone(90, t, { wave: 'sawtooth', peak: 0.03, attack: 0.4, decay: seconds, lowpass: 300 });
  },

  /** SPLAT! into mud: a wet slap and a few drips. Use when someone lands in the muddy stream (they're fine). */
  splat(): void {
    const t = now();
    noiseBurst(t, { freq: 420, type: 'lowpass', peak: 0.22, attack: 0.005, decay: 0.3 });
    tone(140, t, { peak: 0.14, decay: 0.2, glideTo: 70 });
    [0.25, 0.4, 0.58].forEach((dt, i) => tone(900 - i * 120, t + dt, { wave: 'sine', peak: 0.04, decay: 0.08, glideTo: 1400 }));
  },

  /** Squelch, squelch: a muddy step or two. Use when a muddy bear walks or wriggles. */
  squelch(steps = 2): void {
    const t = now();
    for (let i = 0; i < steps; i++) noiseBurst(t + i * 0.35, { freq: 600, q: 2, peak: 0.08, attack: 0.03, decay: 0.16, sweepTo: 300 });
  },

  /** A wooden spoon going round a bowl: a soft scrape, round and round. Use while porridge is stirred. */
  scrape(rounds = 3): void {
    const t = now();
    for (let i = 0; i < rounds; i++) noiseBurst(t + i * 0.45, { freq: 1400, q: 3, peak: 0.04, attack: 0.12, decay: 0.3, sweepTo: 900 });
  },

  /** Mmm! A happy little "yum" tune. Use when someone tastes something lovely (honey, a cherry bun). */
  yum(): void {
    const t = now();
    [NOTE.C5, NOTE.E5, NOTE.G5].forEach((f, i) => tone(f, t + i * 0.1, { wave: 'triangle', peak: 0.05, decay: 0.18 }));
  },

  /** A kite's tug on the wind: a soft whoosh up. Use as a kite climbs. */
  swoosh(): void {
    noiseBurst(now(), { freq: 900, q: 1, peak: 0.07, attack: 0.15, decay: 0.5, sweepTo: 2200 });
  },

  /** The wishing well's bucket on its rope: a creaky winding and a little bell. Use when the bucket comes up. */
  windlass(): void {
    const t = now();
    for (let i = 0; i < 4; i++) tone(320 + i * 30, t + i * 0.18, { wave: 'square', peak: 0.025, decay: 0.1, lowpass: 900 });
    bell(NOTE.A5, t + 0.8, 0.07, 0.6);
  },

  // From the Teddy Bear Treasury episodes (the party, Grumpy Bertie).
  /** A big bear sneeze: "ah… ah…" rising, then the ATISHOO burst (about 1.1 s in). Say the line after it. */
  sneeze(): void {
    const t = now();
    tone(NOTE.A3, t, { wave: 'triangle', peak: 0.05, attack: 0.2, decay: 0.5, glideTo: NOTE.E4 });
    tone(NOTE.C4, t + 0.55, { wave: 'triangle', peak: 0.05, attack: 0.2, decay: 0.4, glideTo: NOTE.G4 });
    noiseBurst(t + 1.05, { freq: 2200, q: 0.8, peak: 0.12, attack: 0.01, decay: 0.35 });
  },

  /** A long, grumpy sigh: a low breath sliding down. Use for a bear who is put out. */
  sigh(): void {
    noiseBurst(now(), { freq: 600, q: 0.7, peak: 0.05, attack: 0.25, decay: 1.1, sweepTo: 300 });
  },

  /** A sip of something hot (hot chocolate, tea). */
  sip(): void {
    noiseBurst(now(), { freq: 1400, q: 2, peak: 0.04, attack: 0.05, decay: 0.3, sweepTo: 900 });
  },

  /** The Musical Chairs tune: a bouncy little march on a toy piano, `bars` long (1.6 s a bar). */
  chairsTune(bars = 2): void {
    const t = now();
    const tune = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.F5, NOTE.A5, NOTE.G5, NOTE.E5];
    for (let b = 0; b < bars; b++) {
      tune.forEach((n, i) => tone(n, t + b * 1.6 + i * 0.2, { wave: 'triangle', peak: 0.06, attack: 0.01, decay: 0.22 }));
      tone(NOTE.C4, t + b * 1.6, { wave: 'sine', peak: 0.05, attack: 0.01, decay: 0.5 });
      tone(NOTE.G4, t + b * 1.6 + 0.8, { wave: 'sine', peak: 0.05, attack: 0.01, decay: 0.5 });
    }
  },

  /** The music stopping with a plonk (Musical Chairs, a sudden halt). */
  plonk(): void {
    tone(NOTE.C4, now(), { wave: 'triangle', peak: 0.08, attack: 0.01, decay: 0.4, glideTo: NOTE.A3 });
  },

  /** A sad little slide down: something broken is shown, a plan falls through. */
  sadSlide(): void {
    tone(NOTE.G4, now(), { wave: 'sine', peak: 0.06, attack: 0.05, decay: 0.9, glideTo: NOTE.C4, vibrato: [5, 10] });
  },

  /** Blowing out candles: one long soft puff. */
  blow(): void {
    noiseBurst(now(), { freq: 900, q: 0.6, peak: 0.07, attack: 0.08, decay: 0.9, sweepTo: 500 });
  },
};

export const moves = {
  /** Flaps both arms like wings, `times` times, with a little hop each flap. Use for Teddy trying to fly. */
  async flap(k: Kit, el: HTMLElement, times = 3): Promise<void> {
    const l = k.pivot(k.part(el, 'armL'));
    const r = k.pivot(k.part(el, 'armR'));
    for (let i = 0; i < times; i++) {
      await k.all(k.to(l, 0.16, { rotation: 40 }), k.to(r, 0.16, { rotation: -40 }), k.to(el, 0.16, { y: '-=24' }));
      await k.all(k.to(l, 0.16, { rotation: -10 }), k.to(r, 0.16, { rotation: 10 }), k.to(el, 0.16, { y: '+=24' }));
    }
    await k.all(k.to(l, 0.2, { rotation: 0 }), k.to(r, 0.2, { rotation: 0 }));
  },

  /** A big cross roar: leans in, arms up, a shake (Captain Bear at a ruffian). Theatre: nobody is touched. */
  async roar(k: Kit, el: HTMLElement): Promise<void> {
    const arms = k.pivot([...k.part(el, 'armL'), ...k.part(el, 'armR')]);
    await k.all(k.to(el, 0.25, { scale: 1.08, y: '-=10' }), k.to(arms, 0.25, { rotation: (i: number) => (i ? -20 : 20) }));
    await k.shake(el, 6, 3);
    await k.all(k.to(el, 0.3, { scale: 1, y: '+=10' }), k.to(arms, 0.3, { rotation: 0 }));
  },

  /** Marches on the spot with little leg swings (a cross march, or a proud one), then moves by dx. */
  async march(k: Kit, el: HTMLElement, dx = 0, steps = 4): Promise<void> {
    const l = k.pivot(k.part(el, 'legL'));
    const r = k.pivot(k.part(el, 'legR'));
    const go = dx ? k.to(el, steps * 0.3, { x: `+=${dx}`, ease: 'none' }) : Promise.resolve();
    for (let i = 0; i < steps; i++) {
      await k.all(k.to(i % 2 ? l : r, 0.15, { rotation: i % 2 ? 14 : -14 }), k.to(el, 0.15, { y: '-=8' }));
      await k.all(k.to(i % 2 ? l : r, 0.15, { rotation: 0 }), k.to(el, 0.15, { y: '+=8' }));
    }
    await go;
  },

  /** Stirs with one arm: small circles of the paw for `rounds`. Use while stirring porridge (put the spoon prop at the paw). */
  async stir(k: Kit, el: HTMLElement, rounds = 3, arm: 'armL' | 'armR' = 'armR'): Promise<void> {
    const a = k.pivot(k.part(el, arm));
    if (!a.length) return;
    for (let i = 0; i < rounds; i++) {
      await k.to(a, 0.22, { rotation: 10 });
      await k.to(a, 0.22, { rotation: -6 });
    }
    await k.to(a, 0.2, { rotation: 0 });
  },

  // From the Teddy Bear Treasury episodes (the party, Grumpy Bertie).
  /**
   * Bears hiding behind a bush duck down out of sight: they sink `by` px and
   * fade away as they go (so nothing pokes out under the bush). Pair with `peep`.
   */
  async duck(k: Kit, who: HTMLElement[], by = 120, seconds = 0.5): Promise<void> {
    await k.all(...who.map((el, i) => k.wait(i * 80).then(() => k.to(el, seconds, { y: by, opacity: 0, ease: 'power2.in' }))));
  },

  /** Bears who ducked (or were set ducked: `{ y: 120, opacity: 0 }`) peep up again to where they were placed. */
  async peep(k: Kit, who: HTMLElement[], seconds = 0.5): Promise<void> {
    await k.all(...who.map((el, i) => k.wait(i * 80).then(() => k.to(el, seconds, { y: 0, opacity: 1, ease: 'back.out(1.6)' }))));
  },

  /** A bear's little sad droop: sinks a touch and tilts, then holds there. */
  async droop(k: Kit, el: HTMLElement): Promise<void> {
    await k.to(el, 0.8, { y: '+=10', rotation: -4, ease: 'power2.out' });
  },

  /** Back up from a droop, cheered. */
  async perkUp(k: Kit, el: HTMLElement): Promise<void> {
    await k.to(el, 0.5, { y: '-=10', rotation: 0, ease: 'back.out(2)' });
  },
};
