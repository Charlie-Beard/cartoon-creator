/**
 * One-off sounds for The Troll's Bridge, all soft and short: a hammer on a
 * nail, heavy troll footsteps under the bridge, a hungry rumbling tummy,
 * big troll munching, a wobbly jelly, and a hedgehog bouncing.
 */
import { noiseBurst, NOTE, now, tone } from '../../kit';

/** One hammer blow on a nail: a dry wooden knock with a little metal ting. */
export function bang(): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 1.4, peak: 0.12, attack: 0.002, decay: 0.09 });
  tone(NOTE.E6, t, { wave: 'triangle', peak: 0.035, attack: 0.002, decay: 0.18 });
}

/** Heavy troll footsteps from under the bridge: `steps` deep thumps, slow. */
export function trollSteps(steps = 3, gap = 0.55): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    tone(55, t + i * gap, { wave: 'sine', peak: 0.2, attack: 0.01, decay: 0.32, glideTo: 40 });
    noiseBurst(t + i * gap, { freq: 180, q: 0.7, peak: 0.07, attack: 0.005, decay: 0.2, type: 'lowpass' });
  }
}

/** A hungry tummy: a long, low, wobbling grumble. */
export function tummy(seconds = 1.6): void {
  const t = now();
  tone(70, t, { wave: 'sawtooth', peak: 0.06, attack: 0.2, decay: seconds, vibrato: [7, 18], lowpass: 260, glideTo: 52 });
  tone(96, t + seconds * 0.4, { wave: 'sine', peak: 0.06, attack: 0.15, decay: seconds * 0.6, vibrato: [5, 12], glideTo: 80 });
}

/** Big happy munching: `bites` soft chomps. */
export function munch(bites = 3): void {
  const t = now();
  for (let i = 0; i < bites; i++) {
    noiseBurst(t + i * 0.32, { freq: 700, q: 0.8, peak: 0.07, attack: 0.01, decay: 0.12, type: 'lowpass' });
    tone(150, t + i * 0.32, { wave: 'sine', peak: 0.05, attack: 0.01, decay: 0.1 });
  }
}

/** A jelly wobbling: a soft, bendy "boyoyoing" that slides up and down. */
export function wobble(): void {
  const t = now();
  tone(NOTE.C4, t, { wave: 'sine', peak: 0.07, attack: 0.02, decay: 0.8, vibrato: [9, 40] });
}

/** A hedgehog ball bouncing: a small, bright "boink". */
export function boink(): void {
  const t = now();
  tone(NOTE.G4, t, { wave: 'triangle', peak: 0.07, attack: 0.005, decay: 0.2, glideTo: NOTE.D5 });
}
