/** One-off sounds for Aunt Marge Floats Away. Soft and silly: nothing sharp. */
import { NOTE, noiseBurst, now, tone } from '../../kit';

/** A balloon being blown up: a long, breathy, rising whistle for `seconds`. */
export function inflate(seconds = 2.6): void {
  const t = now();
  tone(NOTE.C4, t, { wave: 'sine', peak: 0.08, attack: seconds * 0.5, decay: seconds * 0.5, glideTo: NOTE.G5, vibrato: [7, 10] });
  tone(NOTE.E4, t, { wave: 'triangle', peak: 0.03, attack: seconds * 0.5, decay: seconds * 0.5, glideTo: NOTE.B5 });
  noiseBurst(t, { freq: 1600, q: 3, peak: 0.03, attack: seconds * 0.5, decay: seconds * 0.5, sweepTo: 4000 });
}

/** A button pinging off: a quick bright ping. */
export function ping(high = false): void {
  const t = now();
  tone(high ? 1568 : 1175, t, { wave: 'triangle', peak: 0.09, decay: 0.25, glideTo: high ? 2093 : 1568 });
}

/** A bulldog's bark: a short, gruff "ruff" (comic, never sharp). */
export function bark(times = 1): void {
  for (let i = 0; i < times; i++) {
    const t = now() + i * 0.28;
    tone(150, t, { wave: 'sawtooth', peak: 0.1, attack: 0.01, decay: 0.16, glideTo: 90, lowpass: 600 });
    noiseBurst(t, { freq: 700, q: 1, peak: 0.05, decay: 0.12 });
  }
}

/** A low bulldog growl, rumbling for `seconds`. */
export function growl(seconds = 1): void {
  const t = now();
  tone(70, t, { wave: 'sawtooth', peak: 0.09, attack: 0.2, decay: seconds, vibrato: [22, 12], lowpass: 300 });
  noiseBurst(t, { freq: 250, type: 'lowpass', peak: 0.04, attack: 0.2, decay: seconds });
}

/** Slurping tea from a saucer: wet, bubbly sucks. */
export function slurp(): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 6, peak: 0.07, attack: 0.05, decay: 0.5, sweepTo: 2200 });
  noiseBurst(t + 0.55, { freq: 1200, q: 5, peak: 0.05, attack: 0.03, decay: 0.3, sweepTo: 500 });
  tone(420, t + 0.1, { wave: 'sine', peak: 0.03, decay: 0.2, glideTo: 700 });
}

/** The doorbell: ding-dong. */
export function doorbell(): void {
  const t = now();
  tone(NOTE.E5, t, { wave: 'sine', peak: 0.12, decay: 0.7 });
  tone(NOTE.C5, t + 0.45, { wave: 'sine', peak: 0.12, decay: 1 });
}

/** A heave: an effortful, breathy groan, "hnnnngh". */
export function groan(): void {
  const t = now();
  tone(160, t, { wave: 'sawtooth', peak: 0.05, attack: 0.15, decay: 0.5, glideTo: 110, lowpass: 500, vibrato: [8, 6] });
  noiseBurst(t, { freq: 500, q: 1, peak: 0.03, attack: 0.15, decay: 0.4 });
}

/** The Knight Bus braking: a long, squealing screech that slides down, then a puff of air. */
export function brakes(): void {
  const t = now();
  tone(1500, t, { wave: 'sawtooth', peak: 0.04, attack: 0.05, decay: 1.1, glideTo: 380, lowpass: 2400, vibrato: [30, 40] });
  noiseBurst(t, { freq: 2600, q: 2, peak: 0.05, attack: 0.05, decay: 1.1, sweepTo: 900 });
  noiseBurst(t + 1.2, { freq: 3000, q: 1, type: 'highpass', peak: 0.05, decay: 0.5 });
}

/** The bus lurching off: a engine roar, then a long rushing whizz. */
export function lurch(): void {
  const t = now();
  tone(70, t, { wave: 'sawtooth', peak: 0.1, attack: 0.05, decay: 0.7, glideTo: 220, lowpass: 400 });
  noiseBurst(t + 0.1, { freq: 800, q: 1, peak: 0.08, attack: 0.1, decay: 0.8, sweepTo: 3500 });
}

/** A gentle slosh of liquid. */
export function slosh(): void {
  const t = now();
  noiseBurst(t, { freq: 500, q: 2, peak: 0.05, attack: 0.08, decay: 0.35, sweepTo: 900 });
  noiseBurst(t + 0.3, { freq: 800, q: 2, peak: 0.04, attack: 0.05, decay: 0.3, sweepTo: 400 });
}

/** The squeeze: a squeaky in-breath and out-breath. */
export function squeak(): void {
  const t = now();
  tone(500, t, { wave: 'triangle', peak: 0.07, decay: 0.35, glideTo: 1000 });
  tone(1000, t + 0.55, { wave: 'triangle', peak: 0.07, decay: 0.35, glideTo: 450 });
}
