/**
 * The Faraway Tree's signature sounds and moves: Dame Snap's heels and
 * ruler, the Saucepan Man's clanking pots, Silky's wings and pop biscuits,
 * Moon-Face's shine, the whistling kettle. Check here before you write your
 * own sound or move; promote anything a second episode would want
 * (docs/WORLDS.md, "moves.ts").
 *
 *   import { sounds, moves } from '../../worlds/faraway/moves';
 *   sounds.heelsComing(5);
 *   await moves.earCup(k, saucepan, true);
 *
 * `sounds` are plain functions that make a synthesised sound now (no `this`,
 * so `const { heels } = sounds` works too). `moves` take the kit and an actor
 * and return a promise: `await` them to wait, `void` them to run alongside.
 * Every move uses only parts the character really has (see `parts` in
 * ./index.ts) and moves smoothly; a move on a character without the part
 * does nothing rather than throwing.
 *
 * World-neutral ones (slam, pour, laugh, buzz, hiss, ting, wave …) are in
 * ../common/moves.ts. The kit's own `k.fx` (stomp, rumble, spell, splash …)
 * and `k.sfx` come first of all.
 *
 * Scary, never cruel (docs/STYLE.md): Dame Snap's sounds are menace only.
 * Her ruler hits the desk, or snaps in her own two hands; nothing and
 * nobody else.
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../audio/synth';
import { C } from '../../art/palette';
import { rng } from '../../art/paper';
import type { Kit } from '../../kit';
import { sounds as common } from '../common/moves';

/** One sharp heel-click (`i` alternates the pitch a little so a walk doesn't sound like a machine). */
function click(at: number, i: number, loud: number): void {
  noiseBurst(at, { freq: 3200 + (i % 2) * 400, q: 5, peak: 0.1 * loud, decay: 0.03 });
  tone(1500 + (i % 2) * 120, at, { wave: 'triangle', peak: 0.05 * loud, attack: 0.002, decay: 0.05, glideTo: 900 });
  tone(220, at, { peak: 0.06 * loud, attack: 0.002, decay: 0.06, glideTo: 140 });
}

export const sounds = {
  // ------------------------------------------------------------ Dame Snap

  /** Dame Snap's heels on a hard floor: sharp, hollow clicks. Vary `loud` between calls (0.45, 0.75, 1) to bring her nearer, then let her appear. */
  heels(steps = 4, gap = 0.34, loud = 1): void {
    const t = now();
    for (let i = 0; i < steps; i++) click(t + i * gap, i, loud);
  },

  /** Dame Snap's heels coming closer: the same clacks, getting louder with every step. Build her entrance with this, then silence, then her. */
  heelsComing(steps = 5, gap = 0.5): void {
    const t = now();
    for (let i = 0; i < steps; i++) click(t + i * gap, i, steps > 1 ? 0.3 + (0.7 * i) / (steps - 1) : 1);
  },

  /** Her ruler smacked down on a desk: a crack and a wooden thwack. Use with moves.smackRuler. */
  smack(): void {
    const t = now();
    noiseBurst(t, { freq: 2600, q: 0.7, peak: 0.2, attack: 0.002, decay: 0.07, type: 'highpass' });
    tone(420, t, { wave: 'square', peak: 0.06, attack: 0.002, decay: 0.09, glideTo: 160, lowpass: 1600 });
    tone(140, t, { peak: 0.14, attack: 0.002, decay: 0.12, glideTo: 70 });
  },

  /** Her ruler snapping in two: a dry crackle, the split, then a silly falling "boing". Use for her defeat (she hurts nobody, only her own ruler). */
  snapRuler(): void {
    const t = now();
    const r = rng(17);
    for (let i = 0; i < 6; i++) noiseBurst(t + i * 0.03 + r() * 0.02, { freq: 2000 + r() * 2500, q: 3, peak: 0.07, decay: 0.025 });
    noiseBurst(t + 0.22, { freq: 1600, q: 0.8, peak: 0.15, decay: 0.12, sweepTo: 600 });
    tone(300, t + 0.22, { wave: 'triangle', peak: 0.06, decay: 0.15, glideTo: 120 });
    tone(NOTE.G4, t + 0.5, { wave: 'triangle', peak: 0.06, attack: 0.01, decay: 0.5, glideTo: NOTE.C3, vibrato: [12, 20] });
  },

  /** Chalk squeaking on her blackboard: thin and very quiet. Use when she writes a rule. */
  chalk(seconds = 0.5): void {
    const t = now();
    tone(2300, t, { wave: 'sawtooth', peak: 0.012, attack: 0.04, decay: seconds, glideTo: 2600, vibrato: [30, 60], lowpass: 3200 });
    noiseBurst(t, { freq: 3000, q: 2, peak: 0.03, attack: 0.03, decay: seconds });
  },

  /** A crow's harsh caw, `times` over. Use on the railings outside her school or prison. */
  caw(times = 2): void {
    const t = now();
    for (let i = 0; i < times; i++) {
      const at = t + i * 0.42;
      tone(620, at, { wave: 'sawtooth', peak: 0.05, attack: 0.02, decay: 0.24, glideTo: 430, vibrato: [40, 30], lowpass: 1500 });
      noiseBurst(at, { freq: 1200, q: 1.5, peak: 0.04, attack: 0.02, decay: 0.2 });
    }
  },

  /** The iron gates (or a cage door) clanging shut: a low ring and a heavy bump. Use when she locks something; nobody is trapped for long. */
  gateClang(): void {
    const t = now();
    bell(NOTE.C4, t, 0.12, 1.6);
    bell(NOTE.D4 * 1.06, t + 0.01, 0.07, 1.2);
    tone(80, t, { peak: 0.22, decay: 0.3, glideTo: 45 });
    noiseBurst(t, { freq: 900, q: 0.8, peak: 0.12, decay: 0.25 });
  },

  // ------------------------------------------------------------ the folk

  /** The Saucepan Man's pots and pans clanking, one clank per step. Use on every step he takes and whenever he is startled or pleased. */
  clank(steps = 1, gap = 0.2): void {
    const t = now();
    const r = rng(steps * 31);
    for (let i = 0; i < steps; i++) {
      const at = t + i * gap;
      const f = 520 + r() * 400;
      tone(f, at, { wave: 'triangle', peak: 0.07, attack: 0.002, decay: 0.25 });
      tone(f * 2.76, at, { peak: 0.04, attack: 0.002, decay: 0.15 });
      noiseBurst(at, { freq: 4200, q: 3, peak: 0.05, decay: 0.05 });
    }
  },

  /** Plump cushions taking a landing at the bottom of the slippery-slip: a soft, deep flump. */
  flump(): void {
    const t = now();
    noiseBurst(t, { freq: 320, type: 'lowpass', peak: 0.22, attack: 0.01, decay: 0.32 });
    tone(95, t, { peak: 0.16, decay: 0.25, glideTo: 55 });
  },

  /** Mr Watzisname's enormous snore: a rumbling saw going in, a whistle going out. Use when the camera finds him on his branch. */
  snore(): void {
    const t = now();
    tone(70, t, { wave: 'sawtooth', peak: 0.12, attack: 0.3, decay: 0.6, glideTo: 95, vibrato: [22, 10], lowpass: 500 });
    noiseBurst(t, { freq: 300, q: 1, peak: 0.08, attack: 0.3, decay: 0.6 });
    tone(900, t + 1, { peak: 0.04, attack: 0.1, decay: 0.5, glideTo: 1400 });
  },

  /** Silky's pop biscuit going pop in your mouth (`i` lifts the pitch for each one, so a row of them climbs). */
  popBiscuit(i = 0): void {
    const t = now();
    tone(620 + i * 90, t, { wave: 'triangle', peak: 0.09, attack: 0.004, decay: 0.12, glideTo: 1500 + i * 120 });
    noiseBurst(t, { freq: 3000, q: 2, peak: 0.04, decay: 0.04 });
  },

  /** Fairy wings: a soft, quick whirr. Use with moves.flutter when Silky flies in or hovers. */
  whirr(times = 6): void {
    const t = now();
    for (let i = 0; i < times; i++) noiseBurst(t + i * 0.07, { freq: 1800, q: 1.5, peak: 0.025, attack: 0.01, decay: 0.05, sweepTo: 2600 });
  },

  // ----------------------------------------------------- the kettle, the lands

  /** The kettle's whistle: a breathy note sliding up. Quiet (`loud` below 1) when it is far away. Use for a distant clue. */
  whistle(seconds = 1.2, loud = 1): void {
    const t = now();
    tone(NOTE.E5, t, { wave: 'sine', peak: 0.08 * loud, attack: 0.3, decay: seconds, glideTo: NOTE.B5, vibrato: [6, 10] });
    tone(NOTE.E6, t, { wave: 'sine', peak: 0.02 * loud, attack: 0.3, decay: seconds, glideTo: NOTE.B5 * 2, vibrato: [6, 18] });
    noiseBurst(t, { freq: 3400, q: 6, peak: 0.035 * loud, attack: 0.25, decay: seconds });
  },

  /** The kettle whistling its jolly tune (about 2.6 s): each note a breathy whistle that slides into place. Use for the payoff when he taps its lid. */
  whistleTune(loud = 1): void {
    const t = now();
    const notes: [number, number, number][] = [
      [NOTE.G5, 0, 0.18], [NOTE.C6, 0.22, 0.18], [NOTE.E6, 0.44, 0.18], [NOTE.G6, 0.66, 0.4],
      [NOTE.E6, 1.12, 0.16], [NOTE.G6, 1.32, 0.16], [NOTE.E6, 1.52, 0.16], [NOTE.D6, 1.72, 0.16], [NOTE.C6, 1.94, 0.6],
    ];
    for (const [f, dt, d] of notes) {
      tone(f * 0.96, t + dt, { wave: 'sine', peak: 0.08 * loud, attack: 0.03, decay: d, glideTo: f, vibrato: [6, 9] });
      noiseBurst(t + dt, { freq: f * 2, q: 7, peak: 0.018 * loud, attack: 0.02, decay: d });
    }
  },

  /** A thick grey cloud blown away: a big soft whoosh with a sprinkle of bells. Use when he taps a cloud that hides a land, with a few k.puff. */
  blowAway(): void {
    const t = now();
    noiseBurst(t, { freq: 400, q: 0.7, peak: 0.1, attack: 0.15, decay: 1.2, sweepTo: 2600 });
    noiseBurst(t + 0.2, { freq: 2400, q: 0.8, peak: 0.05, attack: 0.1, decay: 1, sweepTo: 600 });
    [NOTE.C6, NOTE.E6, NOTE.G6].forEach((f, i) => bell(f, t + 0.5 + i * 0.12, 0.05, 0.9));
  },

  /** A land turning to move on: a whirring hum that winds up higher and higher. Use with k.fx.rumble when the land is leaving. */
  landTurning(seconds = 2, from = 90, to = 260): void {
    const t = now();
    tone(from, t, { wave: 'sawtooth', peak: 0.05, attack: 0.3, decay: seconds, glideTo: to, vibrato: [6, 8], lowpass: 900 });
    noiseBurst(t, { freq: 400, q: 2, peak: 0.06, attack: seconds * 0.6, decay: seconds * 0.4, sweepTo: 1600 });
  },
};

export const moves = {
  // ------------------------------------------------------------ Moon-Face

  /** Moon-Face's shine brightens (`on`) or settles back (his `glow` part). Use when he beams: delighted, proud, welcoming. (Not k.beam, the magic beam.) */
  async beam(k: Kit, el: HTMLElement, on = true): Promise<void> {
    const glow = k.pivot(k.part(el, 'glow'));
    if (!glow.length) return;
    await k.to(glow, 0.5, { scale: on ? 1.15 : 1, opacity: on ? 1 : 0.85, ease: 'sine.inOut' });
  },

  // ---------------------------------------------------------------- Silky

  /** Silky's wings flutter, `times` beats (her `wingL` and `wingR`). Pair with sounds.whirr; run it with `void` while she flies or hovers. */
  async flutter(k: Kit, el: HTMLElement, times = 4): Promise<void> {
    const wings = k.pivot([...k.part(el, 'wingL'), ...k.part(el, 'wingR')]);
    if (!wings.length) return;
    for (let i = 0; i < times; i++) {
      await k.to(wings, 0.09, { scaleX: 0.72, ease: 'sine.inOut' });
      await k.to(wings, 0.09, { scaleX: 1, ease: 'sine.inOut' });
    }
  },

  /** Pop biscuits hopping out of the tin at (x, y) and popping, `n` of them (props 'pop-biscuit'). Use when Silky opens the tin. */
  async popOut(k: Kit, x: number, y: number, n: number): Promise<void> {
    for (let i = 0; i < n; i++) {
      const b = k.prop('pop-biscuit', { x: x - 30, y: y - 30, w: 60, z: 30 });
      k.set(b, { opacity: 0 });
      await k.appear(b, 0.2);
      await k.to(b, 0.35, { y: -70 - i * 20, x: (i ? 30 : -30), rotation: 180, ease: 'power2.out' });
      sounds.popBiscuit(i);
      k.sparkle(x + (i ? 30 : -30), y - 70 - i * 20, 8, 70);
      await k.vanish(b, 0.15);
    }
  },

  // --------------------------------------------------- the Saucepan Man

  /** Rattles the Saucepan Man's pots (his `pots` part). Pair with sounds.clank on every step, hop or surprise. */
  async rattle(k: Kit, el: HTMLElement): Promise<void> {
    const pots = k.part(el, 'pots');
    if (!pots.length) return;
    for (const dx of [5, -5, 3, 0]) await k.to(pots, 0.06, { x: dx, rotation: dx * 0.6, ease: 'none' });
  },

  /** The Saucepan Man cups his ear ("Eh?") when `on`, or lowers his hand again. He mishears everything: do this before the wrong answer. */
  async earCup(k: Kit, el: HTMLElement, on: boolean): Promise<void> {
    const arm = k.pivot(k.part(el, 'armR'));
    await k.all(...(arm.length ? [k.to(arm, 0.3, { rotation: on ? -10 : 0 })] : []), k.to(el, 0.3, { rotation: on ? 4 : 0 }));
  },

  // ----------------------------------------------------------- Dame Snap

  /**
   * Dame Snap's ruler comes down on the desk with a SMACK and the stage gives a small shake,
   * then it lifts again. Needs her default portrait (the poses have no `ruler` part). `onHit`
   * runs the moment it lands, for others to jump (shake them there, not after). She hits the desk, never a person.
   */
  async smackRuler(k: Kit, el: HTMLElement, onHit?: () => void): Promise<void> {
    const ruler = k.pivot(k.part(el, 'ruler'));
    if (ruler.length) await k.to(ruler, 0.18, { rotation: 50, ease: 'power3.in' });
    sounds.smack();
    void k.quake(5);
    onHit?.();
    if (ruler.length) await k.to(ruler, 0.4, { rotation: 0, ease: 'power2.out' });
  },

  // ------------------------------------------------------ Mr Watzisname

  /** Mr Watzisname wakes with a start (`on`: eyes wide, a jump), or drifts off again (eyes shut, a slow nod). Do it between lines, not during one. */
  async wakeUp(k: Kit, el: HTMLElement, on = true): Promise<void> {
    const shut = k.part(el, 'eyes');
    const wide = k.part(el, 'eyesOpen');
    if (on) {
      k.set(shut, { opacity: 0 });
      k.set(wide, { opacity: 1 });
      await k.to(el, 0.12, { y: '-=26', ease: 'power2.out' });
      await k.to(el, 0.25, { y: '+=26', ease: 'power2.in' });
    } else {
      await k.to(el, 0.6, { rotation: 3, ease: 'sine.inOut' });
      k.set(wide, { opacity: 0 });
      k.set(shut, { opacity: 1 });
      await k.to(el, 0.6, { rotation: 0, ease: 'sine.inOut' });
    }
  },

  // ------------------------------------------------------ the kettle prop

  /**
   * The kettle prop whistles: its lid bobs, steam puffs from the spout and it jiggles, with the whistle
   * and a hiss. `at` is where you placed it (x, y, w); `loud` 1 plays the whole jolly tune,
   * and `tune` false is one short whistle (just boiled). Resolves when the steam has stopped.
   */
  async whistleKettle(k: Kit, kettle: HTMLElement, at: { x: number; y: number; w: number }, loud: number, tune = true): Promise<void> {
    // The spout's tip (the art is 180 wide, the whistle at 18, 46).
    const s = at.w / 180;
    const [x, y] = [at.x + 18 * s, at.y + 46 * s];
    const lid = k.pivot(k.part(kettle, 'lid'));
    if (tune) sounds.whistleTune(loud);
    else sounds.whistle(1, loud);
    common.hiss(tune ? 2.2 : 0.9);
    const puffs = tune ? 5 : 2;
    const lidBobs = lid.length ? k.to(lid, 0.12, { y: -8, rotation: -6, yoyo: true, repeat: tune ? 17 : 5, ease: 'sine.inOut' }) : Promise.resolve();
    const jiggle = k.to(kettle, 0.1, { rotation: '+=3', yoyo: true, repeat: tune ? 21 : 7, ease: 'sine.inOut' });
    for (let i = 0; i < puffs; i++) {
      k.puff(x - 20 - i * 6, y - 30 - i * 10, 110 + i * 16, C.white);
      await k.wait(420);
    }
    await k.all(lidBobs, jiggle);
    k.set(lid, { y: 0, rotation: 0 });
  },
};
