/**
 * One-off sounds for The Mermaid's Golden Comb: gulls, Pearl's sobs and her
 * song, Old Nipper's clacking claws, a bucket of water flung through the
 * air, the tide rushing in, a pebble dropped in a tin bucket and a slip on
 * seaweed. All soft and short, as docs/STYLE.md asks.
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../kit';

/** Seagulls far off: two or three high, falling "kee-ow" cries. */
export function gulls(times = 3): void {
  const t = now();
  for (let i = 0; i < times; i++) {
    const at = t + i * 0.55;
    tone(1500, at, { wave: 'triangle', peak: 0.035, attack: 0.04, decay: 0.32, glideTo: 950, lowpass: 2600 });
    tone(1700, at + 0.02, { wave: 'sine', peak: 0.02, attack: 0.04, decay: 0.28, glideTo: 1100 });
  }
}

/** A little girl sobbing, far off and soft: three wobbly falling sighs. */
export function sobs(times = 3): void {
  const t = now();
  for (let i = 0; i < times; i++) {
    const at = t + i * 0.62;
    tone(620, at, { wave: 'triangle', peak: 0.04, attack: 0.05, decay: 0.42, glideTo: 430, vibrato: [9, 18], lowpass: 1600 });
    noiseBurst(at, { freq: 1200, q: 2, peak: 0.012, attack: 0.04, decay: 0.3 });
  }
}

/**
 * Old Nipper's claws: hard little clacks, like two shells knocked together.
 * `loud` for the scary ones at his entrance; `gap` between clacks.
 */
export function clack(times = 2, gap = 0.28, loud = false): void {
  const t = now();
  const peak = loud ? 0.09 : 0.05;
  for (let i = 0; i < times; i++) {
    const at = t + i * gap;
    noiseBurst(at, { freq: 2400, type: 'bandpass', q: 6, peak, attack: 0.002, decay: 0.05 });
    tone(880, at, { wave: 'square', peak: peak * 0.25, attack: 0.002, decay: 0.04, glideTo: 600, lowpass: 2000 });
  }
}

/** Water flung out of a bucket: a whoosh, then a soft splosh. */
export function slosh(): void {
  const t = now();
  noiseBurst(t, { freq: 700, type: 'bandpass', q: 0.8, peak: 0.05, attack: 0.08, decay: 0.4, sweepTo: 1800 });
  noiseBurst(t + 0.5, { freq: 1400, type: 'bandpass', q: 0.6, peak: 0.07, attack: 0.01, decay: 0.45, sweepTo: 500 });
  for (let i = 0; i < 4; i++) tone(1300 - i * 120, t + 0.6 + i * 0.09, { wave: 'sine', peak: 0.03, attack: 0.005, decay: 0.1, glideTo: 800 });
}

/** Filling the bucket in the rock pool: a gurgle and a few bloops. */
export function gurgle(): void {
  const t = now();
  noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.04, attack: 0.05, decay: 0.5 });
  for (let i = 0; i < 5; i++) tone(320 + i * 70, t + i * 0.12, { wave: 'sine', peak: 0.045, attack: 0.01, decay: 0.12, glideTo: 520 + i * 80 });
}

/** A foot sliding on wet seaweed: a squeaky slither, falling. */
export function slip(): void {
  const t = now();
  tone(900, t, { wave: 'sine', peak: 0.05, attack: 0.02, decay: 0.35, glideTo: 380, vibrato: [14, 30] });
  noiseBurst(t, { freq: 1600, q: 3, peak: 0.02, attack: 0.02, decay: 0.3, sweepTo: 700 });
}

/** A comb drawn through hair: a soft high swish. */
export function swish(): void {
  const t = now();
  noiseBurst(t, { freq: 4200, type: 'highpass', peak: 0.025, attack: 0.08, decay: 0.25 });
}

/** A pebble dropped in a tin bucket: one bright clink. */
export function clink(): void {
  const t = now();
  bell(NOTE.E6, t, 0.06, 0.4);
  bell(NOTE.B5, t + 0.07, 0.03, 0.3);
}

/** The tide coming in: a long, soft rushing wash that swells and fades over `seconds`. */
export function tideRush(seconds = 4): void {
  const t = now();
  for (let i = 0; i < 3; i++) {
    const at = t + (i * seconds) / 3;
    noiseBurst(at, { freq: 600, type: 'lowpass', peak: 0.045, attack: seconds / 6, decay: seconds / 3, sweepTo: 1200 });
  }
}

/**
 * Pearl's song, which brings the tide in: a slow, rising and falling tune
 * on soft bells, with a hummed sine voice under it. About 7 s.
 */
export function pearlSong(): void {
  const t = now();
  const notes: Array<[number, number, number]> = [
    // [note, start, length]
    [NOTE.E5, 0, 0.7],
    [NOTE.G5, 0.6, 0.7],
    [NOTE.A5, 1.2, 1.1],
    [NOTE.G5, 2.2, 0.6],
    [NOTE.E5, 2.8, 0.7],
    [NOTE.D5, 3.4, 1.0],
    [NOTE.E5, 4.4, 0.6],
    [NOTE.G5, 5.0, 0.7],
    [NOTE.C5, 5.7, 1.6],
  ];
  for (const [f, at, len] of notes) {
    tone(f, t + at, { wave: 'sine', peak: 0.07, attack: 0.18, decay: len, vibrato: [5, f * 0.012] });
    bell(f * 2, t + at, 0.025, len * 0.8);
  }
}
