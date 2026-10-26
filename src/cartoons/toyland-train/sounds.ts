/**
 * Sounds only The Toyland Express wants: the engine's whistle, its chuffing,
 * a slow clock tick, a box rattling, a handful of jester's bells, and the
 * winding of the key. Soft and short (docs/STYLE.md, "Sound").
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../kit';

/** The engine's whistle: a bright two-note "too-toot", the second a little higher. */
export function toot(): void {
  const t = now();
  tone(NOTE.E5, t, { wave: 'triangle', peak: 0.07, attack: 0.03, decay: 0.28, vibrato: [8, 5], lowpass: 2400 });
  tone(NOTE.A5, t + 0.34, { wave: 'triangle', peak: 0.08, attack: 0.03, decay: 0.5, vibrato: [8, 5], lowpass: 2400 });
}

/** Peter's tin train: a tiny, thin "toot toot". */
export function tinToot(): void {
  const t = now();
  tone(NOTE.C6, t, { wave: 'square', peak: 0.022, attack: 0.01, decay: 0.12, lowpass: 2600 });
  tone(NOTE.C6, t + 0.2, { wave: 'square', peak: 0.022, attack: 0.01, decay: 0.16, lowpass: 2600 });
}

/** The engine chuffing: `n` soft puffs of steam, `gap` seconds apart. */
export function chuff(n = 4, gap = 0.42): void {
  const t = now();
  for (let i = 0; i < n; i++) noiseBurst(t + i * gap, { freq: 700, type: 'lowpass', peak: 0.06, attack: 0.02, decay: 0.2, sweepTo: 300 });
}

/** A slow clock tick: `n` low wooden ticks, `gap` seconds apart. Use inside the cupboard. */
export function tick(n = 3, gap = 0.9): void {
  const t = now();
  for (let i = 0; i < n; i++) tone(i % 2 ? 520 : 640, t + i * gap, { wave: 'triangle', peak: 0.05, attack: 0.002, decay: 0.07, lowpass: 1800 });
}

/** A box rattling: `n` quick little knocks, getting louder. */
export function rattle(n = 6): void {
  const t = now();
  for (let i = 0; i < n; i++) noiseBurst(t + i * 0.09, { freq: 900 + (i % 2) * 300, q: 2, peak: 0.03 + i * 0.008, attack: 0.004, decay: 0.07 });
}

/** The bells on a jester's hat, jangling: a handful of quick tinkles. */
export function jangle(): void {
  const t = now();
  [NOTE.E6, NOTE.G6, NOTE.C6, NOTE.C7, NOTE.E6, NOTE.G6].forEach((f, i) => bell(f, t + i * 0.07, 0.04, 0.35));
}

/** One click of the winding key as it turns, with a little ratchet after it. */
export function windClick(): void {
  const t = now();
  tone(1300, t, { wave: 'square', peak: 0.03, attack: 0.002, decay: 0.04, lowpass: 3000 });
  for (let i = 1; i < 5; i++) tone(1100 + i * 80, t + i * 0.06, { wave: 'square', peak: 0.015, attack: 0.002, decay: 0.03, lowpass: 3000 });
}

/** A happy little "boing" with a spring wobble, for Jack. */
export function boingy(): void {
  const t = now();
  tone(180, t, { wave: 'sine', peak: 0.12, attack: 0.01, decay: 0.5, glideTo: 520, vibrato: [18, 30] });
  tone(360, t + 0.02, { wave: 'triangle', peak: 0.04, attack: 0.01, decay: 0.4, glideTo: 780 });
}
