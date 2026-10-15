/**
 * Hogwarts' signature sounds and moves: Hedwig's hoots and wings, a cloak
 * swishing, a snake's hiss, Hagrid's belly laugh, a house-elf's crack, a
 * wand flicked. Check here before you write your own sound or move; promote
 * anything a second episode would want (docs/WORLDS.md, "moves.ts").
 *
 *   import { sounds, moves } from '../../worlds/hogwarts/moves';
 *   sounds.cloakSwish();
 *   await moves.swoopIn(k, hedwig, 'right');
 *
 * `sounds` are plain functions that make a synthesised sound now (no `this`,
 * so `const { crack } = sounds` works too). `moves` take the kit and an actor
 * and return a promise: `await` them to wait, `void` them to run alongside.
 * Every move uses only parts the character really has (see `parts` in
 * ./index.ts) and moves smoothly; a move on a character without the part
 * does nothing rather than throwing.
 *
 * Already in the kit, so use these first: `k.sfx.hoot()` (Hedwig's hoot),
 * `k.sfx.zap()` / `darkZap()` / `block()` / `boom()` (spells flying, blocked
 * and landing), `k.fx.spell()`, `k.fx.stomp()` (Hagrid's footsteps),
 * `k.fx.rumble()`, `k.fx.poof()`. World-neutral sounds (slam, laugh, hiss,
 * giggle …) are in ../common/moves.ts.
 *
 * Scary, never cruel (docs/STYLE.md): the villains' moves here are all
 * theatre. Voldemort and Bellatrix swish and cackle; a wand is aimed at an
 * object, the sky or another spell, never at a person's body.
 */
import { gsap } from 'gsap';
import { bell, noiseBurst, NOTE, now, tone } from '../../audio/synth';
import type { Kit, Side } from '../../kit';

export const sounds = {
  // ---------------------------------------------------------------- owls

  /** Hedwig's urgent double hoot, "look out!": two quick hoots, the second higher. For her gentle hoot use k.sfx.hoot(). */
  doubleHoot(): void {
    const t = now();
    tone(440, t, { peak: 0.12, attack: 0.03, decay: 0.16, glideTo: 400, lowpass: 900 });
    tone(500, t + 0.24, { peak: 0.14, attack: 0.03, decay: 0.26, glideTo: 440, vibrato: [6, 6], lowpass: 900 });
  },

  /** Small wings: a tiny soft flutter, `count` flaps (a moth, the Snitch, Hedwig landing). Pair with moves.flap. */
  flutter(count = 14): void {
    const t = now();
    for (let i = 0; i < count; i++) noiseBurst(t + i * 0.055, { freq: 2300 + (i % 2) * 400, q: 1.5, peak: 0.035, decay: 0.03 });
  },

  /** One big, soft wingbeat of air (`times` of them, `gap` apart): Buckbeak, Fawkes, a dragon. Pair with moves.flap. */
  wingbeat(times = 1, gap = 0.45): void {
    const t = now();
    for (let i = 0; i < times; i++) {
      const at = t + i * gap;
      noiseBurst(at, { freq: 380, type: 'lowpass', peak: 0.2, attack: 0.06, decay: 0.28, sweepTo: 140 });
      noiseBurst(at + 0.02, { freq: 900, q: 0.8, peak: 0.05, attack: 0.05, decay: 0.2, sweepTo: 400 });
      tone(95, at, { peak: 0.09, attack: 0.04, decay: 0.22, glideTo: 60 });
    }
  },

  // ------------------------------------------------------------ villains

  /** A cloak or heavy robe swishing round: a soft whoosh down. Use when Voldemort or Snape sweeps away. */
  cloakSwish(): void {
    const t = now();
    noiseBurst(t, { freq: 2600, q: 0.8, peak: 0.14, attack: 0.03, decay: 0.3, sweepTo: 700 });
    noiseBurst(t + 0.08, { freq: 1600, q: 1, peak: 0.07, attack: 0.03, decay: 0.25, sweepTo: 500 });
  },

  /** A long, soft, hissing "ssss" of filtered noise. Use for Voldemort's whisper or Nagini; never harsh. */
  snakeHiss(seconds = 1.2): void {
    const t = now();
    noiseBurst(t, { freq: 5200, q: 1.2, peak: 0.07, attack: 0.15, decay: seconds, type: 'bandpass', sweepTo: 7200 });
    noiseBurst(t + 0.05, { freq: 3400, q: 0.8, peak: 0.04, attack: 0.2, decay: seconds * 0.8, type: 'bandpass', sweepTo: 4800 });
  },

  /** A long body slithering over stone: soft swaying hisses and a low rustle. Use for Nagini and the Basilisk coming in. */
  slither(seconds = 1.6): void {
    const t = now();
    for (let s = 0, i = 0; s < seconds; s += 0.26, i++) {
      noiseBurst(t + s, { freq: i % 2 ? 2400 : 3200, q: 1.4, peak: 0.065, attack: 0.1, decay: 0.2, sweepTo: i % 2 ? 3600 : 1900 });
    }
    tone(70, t, { peak: 0.04, attack: 0.3, decay: seconds, lowpass: 300 });
  },

  /** Bellatrix's cackle: a wobbly "ha-ha-ha-ha" tumbling down, then a squeaky "hee!". Cartoon-silly, never cruel. */
  cackle(): void {
    const t = now();
    [932, 880, 831, 784, 740, 698].forEach((f, i) => {
      const at = t + i * 0.12;
      tone(f, at, { wave: 'triangle', peak: 0.1, attack: 0.01, decay: 0.09, vibrato: [16, 18], lowpass: 2400 });
      noiseBurst(at, { freq: 1800, q: 2, peak: 0.025, decay: 0.05 });
    });
    tone(660, t + 0.8, { wave: 'triangle', peak: 0.1, attack: 0.02, decay: 0.32, glideTo: 1100, vibrato: [12, 14], lowpass: 2600 });
  },

  // ------------------------------------------------------------ creatures

  /** The Hungarian Horntail's roar: a low, rolling growl that swells in (never sudden). `peak` is the loudness. */
  dragonRoar(seconds = 1.4, peak = 0.2): void {
    const t = now();
    tone(92, t, { wave: 'sawtooth', peak: peak * 0.55, attack: 0.2, decay: 0.35, glideTo: 138, vibrato: [7, 8], lowpass: 650 });
    tone(138, t + 0.45, { wave: 'sawtooth', peak: peak * 0.6, attack: 0.08, decay: seconds, glideTo: 70, vibrato: [6, 10], lowpass: 750 });
    tone(207, t + 0.45, { wave: 'sawtooth', peak: peak * 0.18, attack: 0.1, decay: seconds * 0.8, glideTo: 104, vibrato: [6, 14], lowpass: 900 });
    noiseBurst(t, { freq: 420, q: 0.9, peak: peak * 0.5, attack: 0.3, decay: seconds + 0.3, sweepTo: 160 });
    tone(55, t + 0.2, { peak: peak * 0.6, attack: 0.25, decay: seconds, glideTo: 40 });
  },

  /** A toad's two croaks (Trevor). */
  croak(): void {
    const t = now();
    tone(135, t, { wave: 'sawtooth', peak: 0.11, attack: 0.015, decay: 0.1, glideTo: 108, vibrato: [38, 22], lowpass: 900 });
    tone(165, t + 0.16, { wave: 'sawtooth', peak: 0.11, attack: 0.015, decay: 0.13, glideTo: 125, vibrato: [38, 22], lowpass: 900 });
  },

  /** Crookshanks' low, sleepy purr. */
  purr(): void {
    tone(55, now(), { wave: 'sawtooth', peak: 0.035, attack: 0.4, decay: 1.8, lowpass: 250, vibrato: [22, 6] });
  },

  /** A little rat's squeak (Wormtail, Scabbers), `count` of them; `muffled` for one still inside a hat. */
  squeak(count = 1, gap = 0.16, muffled = false): void {
    const t = now();
    for (let i = 0; i < count; i++) {
      const f = 1400 + i * 90;
      tone(f, t + i * gap, { wave: 'triangle', peak: muffled ? 0.05 : 0.07, attack: 0.01, decay: 0.09, glideTo: f * 1.35, vibrato: [30, 50], lowpass: muffled ? 1300 : 3800 });
    }
  },

  // ---------------------------------------------------------- the castle

  /** Hagrid's big, warm belly laugh: "huh-huh-ho-ho-ho". */
  bellyLaugh(): void {
    const t = now();
    [196, 188, 178, 168, 158, 148].forEach((f, i) => {
      const at = t + i * 0.19;
      noiseBurst(at, { freq: 800, q: 1.2, peak: 0.035, attack: 0.01, decay: 0.06 });
      tone(f, at + 0.02, { wave: 'sawtooth', peak: 0.13, attack: 0.025, decay: 0.13, glideTo: f * 0.82, lowpass: 650 });
      tone(f * 2, at + 0.02, { wave: 'triangle', peak: 0.04, attack: 0.025, decay: 0.1, glideTo: f * 1.6, lowpass: 1200 });
    });
  },

  /** The hearth fire: a soft low roar with little pops and crackles, for `seconds`. Use in the hut, the common room, the kitchen. */
  fireCrackle(seconds = 3): void {
    const t = now();
    noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.025, attack: 0.5, decay: seconds });
    const n = Math.round(seconds * 5);
    for (let i = 0; i < n; i++) {
      const dt = ((i * 0.618) % 1) * seconds;
      noiseBurst(t + dt, { freq: 2200 + ((i * 0.37) % 1) * 3000, q: 3, peak: 0.03 + ((i * 0.53) % 1) * 0.04, attack: 0.002, decay: 0.015 + ((i * 0.29) % 1) * 0.03 });
    }
  },

  /** A house-elf's crack (Dobby, Kreacher): a quick snap with a little magic shimmer after it. Use with moves.apparate. */
  crack(): void {
    const t = now();
    noiseBurst(t, { freq: 3200, type: 'highpass', peak: 0.2, attack: 0.002, decay: 0.06 });
    noiseBurst(t, { freq: 1200, q: 0.8, peak: 0.14, attack: 0.002, decay: 0.14, sweepTo: 380 });
    tone(170, t, { peak: 0.2, decay: 0.18, glideTo: 60 });
    tone(1400, t + 0.02, { wave: 'triangle', peak: 0.05, decay: 0.2, glideTo: 2600 });
    bell(NOTE.G6, t + 0.12, 0.05, 0.5);
  },
};

export const moves = {
  // ----------------------------------------------------- wings and flight

  /** Wings flap, `beats` times: `wingL` and `wingR` swing up and down about the shoulder (Hedwig, Fawkes, Buckbeak, the Horntail). Pair with sounds.flutter or sounds.wingbeat. */
  async flap(k: Kit, el: HTMLElement, beats = 4, degrees = 30): Promise<void> {
    const left = k.pivot(k.part(el, 'wingL'));
    const right = k.pivot(k.part(el, 'wingR'));
    const swing = (a: number): Promise<void> =>
      k.all(
        ...(left.length ? [k.to(left, 0.2, { rotation: a, ease: 'sine.inOut' })] : []),
        ...(right.length ? [k.to(right, 0.2, { rotation: -a, ease: 'sine.inOut' })] : []),
      );
    if (!left.length && !right.length) return;
    for (let i = 0; i < beats; i++) {
      await swing(degrees);
      await swing(0);
    }
  },

  /** A bird (or hippogriff) swoops in from off stage `from` to where you placed it, wings flapping and beating the air; `big` for Buckbeak and dragons. Hide it first with k.set(el, { opacity: 0 }). */
  async swoopIn(k: Kit, el: HTMLElement, from: Side = 'right', seconds = 1.1, big = false): Promise<void> {
    const beats = Math.max(1, Math.round(seconds / 0.4));
    if (big) sounds.wingbeat(beats, 0.4);
    else sounds.flutter(Math.round(seconds / 0.055));
    await k.all(k.enter(el, from, seconds), moves.flap(k, el, beats));
  },

  /** A bird flies away off stage `to`, wings flapping. It stays off stage (use k.enter to bring it back). */
  async flyOff(k: Kit, el: HTMLElement, to: Side = 'right', seconds = 0.9, big = false): Promise<void> {
    const beats = Math.max(1, Math.round(seconds / 0.4));
    if (big) sounds.wingbeat(beats, 0.4);
    else sounds.flutter(Math.round(seconds / 0.055));
    await k.all(k.exit(el, to, seconds), moves.flap(k, el, beats));
  },

  /** Hedwig hoots, `times` over: her head dips with each (k.sfx.hoot). Do it between lines; she never speaks words. */
  async hoot(k: Kit, el: HTMLElement, times = 1): Promise<void> {
    const head = k.pivot(k.part(el, 'head'));
    for (let i = 0; i < times; i++) {
      k.sfx.hoot();
      if (head.length) {
        await k.to(head, 0.25, { rotation: -8, ease: 'sine.inOut' });
        await k.to(head, 0.4, { rotation: 0, ease: 'sine.inOut' });
      } else {
        await k.wait(650);
      }
      if (i < times - 1) await k.wait(300);
    }
  },

  // -------------------------------------------------------------- magic

  /**
   * A wand flick: the wand (a character's `wand` part) winds back, whips forward with a spell sound, and settles,
   * and a burst of sparkles lands at `aim` if you give one. Aim at an object, the sky or another spell; never at a person's body.
   */
  async castSpell(k: Kit, el: HTMLElement, aim?: [number, number]): Promise<void> {
    const wand = k.pivot(k.part(el, 'wand'));
    if (wand.length) await k.to(wand, 0.14, { rotation: -14, ease: 'power1.out' });
    k.fx.spell();
    if (wand.length) await k.to(wand, 0.12, { rotation: 26, ease: 'power2.in' });
    if (aim) k.sparkle(aim[0], aim[1], 12, 110);
    if (wand.length) await k.to(wand, 0.3, { rotation: 0, ease: 'power2.out' });
    else await k.wait(300);
  },

  /** A house-elf or wizard pops in (`appearing`) with a crack and a puff of smoke, or pops away (and is removed from the stage, like k.vanish). Hide an arrival first with k.set(el, { opacity: 0 }). */
  async apparate(k: Kit, el: HTMLElement, appearing = true): Promise<void> {
    // The middle of where the actor stands now (placed corner plus its tween offset).
    const cx = (parseFloat(el.style.left) || 0) + (parseFloat(el.style.width) || el.offsetWidth) / 2 + Number(gsap.getProperty(el, 'x'));
    const cy = (parseFloat(el.style.top) || 0) + (parseFloat(el.style.height) || el.offsetHeight) / 2 + Number(gsap.getProperty(el, 'y'));
    sounds.crack();
    k.puff(cx, cy, 150);
    if (appearing) await k.appear(el, 0.2);
    else await k.vanish(el, 0.2);
  },

  // ------------------------------------------------------------ villains

  /** A villain's cloak swishes: they sweep sideways and settle back, with the swish (Voldemort, Snape). Sideways only, so it is safe during a line. Pure theatre: nobody is touched. */
  async swishCloak(k: Kit, el: HTMLElement, dx = 18): Promise<void> {
    sounds.cloakSwish();
    await k.to(el, 0.25, { x: `+=${dx}`, ease: 'power2.out' });
    await k.to(el, 0.5, { x: `-=${dx}`, ease: 'sine.inOut' });
  },
};
