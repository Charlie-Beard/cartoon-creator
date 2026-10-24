/**
 * Sounds and moves that suit any world: a door slam, tea pouring, a laugh,
 * a wave. The Faraway Tree's and Hogwarts' own signature sounds and moves
 * are in src/worlds/<id>/moves.ts; look there first, then here, before you
 * write your own (docs/WORLDS.md, "moves.ts").
 *
 *   import { sounds, moves } from '../../worlds/common/moves';
 *   sounds.slam();
 *   await moves.wave(k, hero);
 *
 * `sounds` are plain functions that make a synthesised sound now (no `this`,
 * so `const { slam } = sounds` works too). `moves` take the kit and an actor
 * and return a promise: `await` them to wait, `void` them to run alongside.
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../audio/synth';
import type { Kit } from '../../kit';

export const sounds = {
  /** A door slammed somewhere out of sight (never on anyone): a low bang. Use when a cross villain stomps off. */
  slam(): void {
    const t = now();
    tone(90, t, { peak: 0.24, decay: 0.28, glideTo: 45 });
    noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.18, decay: 0.22 });
    noiseBurst(t + 0.02, { freq: 2200, q: 1, peak: 0.05, decay: 0.08 });
  },

  /** Tea (or anything) pouring: a little rising trickle. Use before someone says "who would like a cup?". */
  pour(): void {
    const t = now();
    for (let i = 0; i < 8; i++) noiseBurst(t + i * 0.09, { freq: 900 + i * 140, q: 3, peak: 0.035, attack: 0.02, decay: 0.1 });
  },

  /** Everyone laughing: a warm, bouncing "ho-ho-ho" under the giggles. Use at the punchline of a joke or a mishearing. */
  laugh(): void {
    const t = now();
    [196, 185, 175, 165].forEach((f, i) => tone(f, t + i * 0.2, { wave: 'triangle', peak: 0.09, attack: 0.02, decay: 0.14, glideTo: f * 0.85, lowpass: 900 }));
    [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.A5].forEach((f, i) => tone(f, t + 0.1 + i * 0.17, { wave: 'sine', peak: 0.04, attack: 0.01, decay: 0.1, glideTo: f * 1.1 }));
  },

  /** A happy little giggle: quick bouncing notes. Use for a small, private laugh. */
  giggle(): void {
    const t = now();
    [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.A5, NOTE.G5].forEach((f, i) => tone(f, t + i * 0.09, { wave: 'triangle', peak: 0.05, decay: 0.1 }));
  },

  /** Bees! A short, silly buzz. Use for a bee, a fly, or a mishearing of "bees". */
  buzz(): void {
    const t = now();
    tone(220, t, { wave: 'sawtooth', peak: 0.035, attack: 0.05, decay: 0.9, vibrato: [18, 30], lowpass: 900, glideTo: 260 });
    tone(330, t + 0.1, { wave: 'sawtooth', peak: 0.02, attack: 0.05, decay: 0.7, vibrato: [22, 30], lowpass: 900 });
  },

  /** Steam puffing out: a soft hiss. Use with a kettle, a pipe or a cross little dragon (a snake's hiss is in the Hogwarts file). */
  hiss(seconds = 0.8): void {
    noiseBurst(now(), { freq: 5200, q: 0.8, peak: 0.035, attack: 0.08, decay: seconds, type: 'highpass' });
  },

  /** One bright little ting, like a spoon on a cup or a tap on a lid. Use when a hero touches something small and shiny. */
  ting(): void {
    bell(NOTE.E6, now(), 0.1, 0.8);
  },

  /** Two big sniffs. Use when someone smells a cake, a clue or trouble. */
  sniff(): void {
    const t = now();
    for (let i = 0; i < 2; i++) noiseBurst(t + i * 0.32, { freq: 3200, q: 0.8, peak: 0.07, attack: 0.08, decay: 0.12, sweepTo: 4800 });
  },

  /** A key turning in a lock: two small metal clicks. Use for a lock, a latch or a catch. */
  click(): void {
    const t = now();
    for (const dt of [0, 0.12]) {
      noiseBurst(t + dt, { freq: 3800, q: 6, peak: 0.09, decay: 0.03 });
      tone(1900, t + dt, { wave: 'triangle', peak: 0.04, attack: 0.002, decay: 0.04 });
    }
  },
};

export const moves = {
  /** A friendly wave with an arm (`armR` by default, `armL` mirrors it); characters with no arms hop instead. Use for hellos and goodbyes. */
  async wave(k: Kit, el: HTMLElement, times = 2, arm: 'armL' | 'armR' = 'armR'): Promise<void> {
    const parts = k.pivot(k.part(el, arm));
    if (!parts.length) return k.hop(el, 20, times);
    const up = arm === 'armR' ? -1 : 1;
    for (let i = 0; i < times; i++) {
      await k.to(parts, 0.2, { rotation: up * 16 });
      await k.to(parts, 0.2, { rotation: up * -6 });
    }
    await k.to(parts, 0.2, { rotation: 0 });
  },

  /** Tweens several actors at once with the same settings (everyone leans in, everyone settles back). Takes the list of actors, not one. */
  together(k: Kit, els: HTMLElement[], seconds: number, vars: Parameters<Kit['to']>[2]): Promise<void> {
    return k.all(...els.map((e) => k.to(e, seconds, vars)));
  },
};
