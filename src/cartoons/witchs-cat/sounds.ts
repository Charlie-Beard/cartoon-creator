/**
 * One-off sounds for The Witch's Lost Cat, all soft and short: a match
 * struck and a pumpkin lit, Midnight's miaows and purr, the whispering
 * wood, a low drone for the shadow, a biscuit's crunch.
 */
import { noiseBurst, NOTE, now, tone } from '../../kit';

/** A match scratched, then a soft warm "whump" as the candle catches. */
export function lightPumpkin(): void {
  const t = now();
  noiseBurst(t, { freq: 3200, q: 1.2, peak: 0.05, attack: 0.01, decay: 0.28, sweepTo: 1800 });
  tone(NOTE.C3, t + 0.4, { wave: 'sine', peak: 0.1, attack: 0.12, decay: 0.7, glideTo: NOTE.G3 });
  noiseBurst(t + 0.4, { freq: 600, q: 0.6, peak: 0.04, attack: 0.15, decay: 0.7, type: 'lowpass' });
}

/** A cat's miaow: a nasal note that rises, then falls. `small` is a faint, scared one. */
export function miaow(small = false): void {
  const t = now();
  const p = small ? 0.05 : 0.09;
  tone(620, t, { wave: 'triangle', peak: p, attack: 0.05, decay: 0.2, glideTo: 940, lowpass: 2400 });
  tone(930, t + 0.26, { wave: 'triangle', peak: p, attack: 0.02, decay: 0.34, glideTo: 560, lowpass: 2400 });
}

/** A contented purr: a low rumbling throb for about `seconds`. */
export function purr(seconds = 2): void {
  const t = now();
  tone(62, t, { wave: 'sawtooth', peak: 0.05, attack: 0.3, decay: seconds, vibrato: [24, 10], lowpass: 220 });
  noiseBurst(t, { freq: 140, q: 0.8, peak: 0.04, attack: 0.3, decay: seconds, type: 'lowpass' });
}

/** The wood whispering: soft, breathy, rising and falling a few times. */
export function whispers(seconds = 3): void {
  const t = now();
  for (let i = 0; i < 3; i++) {
    noiseBurst(t + (i * seconds) / 3, { freq: 2600 + i * 400, q: 3, peak: 0.035, attack: seconds / 7, decay: seconds / 4, sweepTo: 3600 });
  }
}

/** A low, slow drone under the looming shadow (it swells and fades; never harsh). */
export function drone(seconds = 3): void {
  const t = now();
  tone(65.4, t, { wave: 'sine', peak: 0.12, attack: seconds * 0.5, decay: seconds * 0.5 });
  tone(98.5, t, { wave: 'sine', peak: 0.05, attack: seconds * 0.5, decay: seconds * 0.5 });
}

/** A crunchy bite of biscuit: two quick, dry crackles. */
export function crunch(): void {
  const t = now();
  for (const o of [0, 0.14]) noiseBurst(t + o, { freq: 2200, q: 0.9, peak: 0.07, attack: 0.002, decay: 0.07 });
}

/** A bat's quick flutter: a few soft, fast flaps. */
export function flutter(): void {
  const t = now();
  for (let i = 0; i < 5; i++) noiseBurst(t + i * 0.07, { freq: 900, q: 1.5, peak: 0.03, attack: 0.01, decay: 0.05 });
}

/** A gentle "poof" and rising chime for a spell: a row of lights. */
export function glowChime(step = 0): void {
  const t = now();
  tone([NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6][step % 4], t, { wave: 'sine', peak: 0.07, attack: 0.01, decay: 0.7 });
}
