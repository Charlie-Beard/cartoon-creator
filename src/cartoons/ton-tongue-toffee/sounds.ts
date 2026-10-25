/** One-off sounds for Ton-Tongue Toffee. All soft and silly: nothing sudden except the one friendly bang. */
import { bell, noiseBurst, now, tone } from '../../kit';

/** The clock chiming `n` o'clock: a bell every 0.9 s (returns how long it takes, in ms). */
export function chime(n: number): number {
  const t = now();
  for (let i = 0; i < n; i++) bell(659, t + i * 0.9, 0.1, 1.4);
  return n * 900;
}

/** A thump from inside the chimney: low and muffled, never loud. */
export function thump(): void {
  const t = now();
  tone(90, t, { wave: 'sine', peak: 0.2, decay: 0.28, glideTo: 48 });
  noiseBurst(t, { freq: 260, type: 'lowpass', peak: 0.08, decay: 0.16 });
}

/** The toffee being gobbled: three quick wet chews. */
export function munch(): void {
  const t = now();
  for (let i = 0; i < 3; i++) {
    noiseBurst(t + i * 0.16, { freq: 700 + i * 120, q: 2, peak: 0.1, attack: 0.01, decay: 0.09 });
    tone(150 - i * 14, t + i * 0.16, { wave: 'triangle', peak: 0.06, decay: 0.1 });
  }
}

/** A funny rising slide-whistle: the tongue rolls out. */
export function bwoing(): void {
  const t = now();
  tone(260, t, { wave: 'sine', peak: 0.12, attack: 0.05, decay: 1.2, glideTo: 1500, vibrato: [8, 30] });
  tone(262 * 2, t + 0.02, { wave: 'triangle', peak: 0.04, attack: 0.05, decay: 1.1, glideTo: 2800 });
}

/** The tongue shrinking back: a springy falling "sproing". */
export function sproing(): void {
  const t = now();
  tone(1100, t, { wave: 'triangle', peak: 0.13, attack: 0.01, decay: 0.7, glideTo: 170, vibrato: [20, 40] });
  noiseBurst(t + 0.55, { freq: 900, q: 3, peak: 0.04, decay: 0.12 });
}

/** One gulp: a low blip that drops. */
export function gulp(): void {
  const t = now();
  tone(260, t, { wave: 'sine', peak: 0.14, attack: 0.01, decay: 0.16, glideTo: 110 });
  noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.05, decay: 0.1 });
}

/** The green fire catching: a rising whoosh with a soft crackle (never a bang). */
export function flooWhoosh(): void {
  const t = now();
  noiseBurst(t, { freq: 400, sweepTo: 2400, q: 0.8, peak: 0.1, attack: 0.25, decay: 0.8 });
  tone(180, t, { wave: 'sawtooth', peak: 0.04, attack: 0.3, decay: 0.8, glideTo: 520, lowpass: 600 });
}

/** The stuck fireplace letting go: a big soft "whumph" and boards clattering, a friendly bang. */
export function whumph(): void {
  const t = now();
  tone(70, t, { wave: 'sine', peak: 0.3, decay: 0.5, glideTo: 36 });
  noiseBurst(t, { freq: 600, type: 'lowpass', peak: 0.2, decay: 0.4 });
  noiseBurst(t + 0.08, { freq: 1800, q: 1.5, peak: 0.07, decay: 0.3 });
}
