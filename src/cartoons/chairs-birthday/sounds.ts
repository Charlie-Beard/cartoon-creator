/**
 * One-off sounds for The Wishing-Chair's Birthday, all soft and short: the
 * chair's cross creak (its happy creak turned upside down), a chair leg
 * stamping, Jigs counting on his fingers, scissors snipping paper, a candle
 * picked off its branch, a pixie spark lighting a candle, and the candles
 * blown out by the wind of the chair's wings.
 */
import { NOTE, bell, noiseBurst, now, tone } from '../../kit';

/** The chair in a huff: a low wooden "cre-eak" that falls, grumbly. `big` makes it longer and lower. */
export function huff(big = false): void {
  const t = now();
  const d = big ? 0.6 : 0.4;
  tone(big ? 210 : 240, t, { wave: 'sawtooth', peak: 0.035, attack: 0.05, decay: d, glideTo: big ? 110 : 150, lowpass: 800 });
  tone(big ? 170 : 190, t + d * 0.8, { wave: 'sawtooth', peak: 0.03, attack: 0.05, decay: d, glideTo: big ? 80 : 110, lowpass: 700 });
}

/** One chair leg stamped on the floorboards: a short wooden knock. */
export function stamp(): void {
  const t = now();
  noiseBurst(t, { freq: 500, q: 1, peak: 0.1, attack: 0.003, decay: 0.12, type: 'lowpass' });
  tone(120, t, { wave: 'sine', peak: 0.08, attack: 0.003, decay: 0.15, glideTo: 90 });
}

/** Counting on fingers: `n` little ticking notes going up. */
export function counting(n = 4): void {
  const t = now();
  const notes = [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.F5, NOTE.G5, NOTE.A5];
  for (let i = 0; i < n; i++) tone(notes[i % notes.length], t + i * 0.28, { wave: 'triangle', peak: 0.04, attack: 0.005, decay: 0.12 });
}

/** Scissors snipping paper: `n` quick dry snips. */
export function snip(n = 3): void {
  const t = now();
  for (let i = 0; i < n; i++) noiseBurst(t + i * 0.22, { freq: 4200, q: 3, peak: 0.05, attack: 0.002, decay: 0.05 });
}

/** A candle picked off its branch: a tiny wooden "pip". */
export function pick(): void {
  tone(NOTE.A5, now(), { wave: 'sine', peak: 0.06, attack: 0.003, decay: 0.1, glideTo: NOTE.E6 });
}

/** A pixie spark lighting one candle: a tiny bright bell. `i` steps it up the scale. */
export function spark(i = 0): void {
  const notes = [NOTE.C6, NOTE.D6, NOTE.E6, NOTE.G6, NOTE.C7];
  bell(notes[i % notes.length], now(), 0.05, 0.5);
}

/** The candles blown out: a soft long whoosh. */
export function blowOut(): void {
  noiseBurst(now(), { freq: 900, type: 'lowpass', peak: 0.07, attack: 0.15, decay: 0.9, sweepTo: 400 });
}
