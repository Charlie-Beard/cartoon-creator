/** One-off sounds for The Island That Swam Away: the whale's song, his spout, drips and a gull. */
import { bell, noiseBurst, NOTE, now, tone } from '../../kit';

/** A deep, slow whale song: three long sliding notes with a wobble, soft and warm. About 7 s. */
export function whaleSong(): void {
  const t = now();
  const note = (f: number, to: number, at: number, len: number): void => {
    tone(f, t + at, { wave: 'sine', peak: 0.1, attack: 0.9, decay: len, glideTo: to, vibrato: [4, f * 0.03], lowpass: 700 });
    tone(f * 2, t + at + 0.1, { wave: 'sine', peak: 0.03, attack: 1.1, decay: len * 0.9, glideTo: to * 2, vibrato: [4.5, f * 0.04], lowpass: 900 });
  };
  note(110, 165, 0, 2.2);
  note(147, 98, 2.4, 2.4);
  note(123, 185, 4.8, 2.6);
}

/** The great whoosh of a whale's spout: a rising rush of air, then a patter of falling drops. */
export function spoutBlast(): void {
  const t = now();
  noiseBurst(t, { freq: 900, type: 'bandpass', q: 0.8, peak: 0.07, attack: 0.1, decay: 0.9, sweepTo: 2600 });
  tone(90, t, { wave: 'triangle', peak: 0.06, attack: 0.05, decay: 0.7, glideTo: 60, lowpass: 400 });
  for (let i = 0; i < 6; i++) noiseBurst(t + 0.9 + i * 0.09, { freq: 3200 + i * 200, type: 'highpass', peak: 0.02, attack: 0.01, decay: 0.1 });
}

/** A gentle, happy spout: the same, but softer and brighter. */
export function happySpout(): void {
  const t = now();
  noiseBurst(t, { freq: 1200, type: 'bandpass', q: 0.8, peak: 0.05, attack: 0.1, decay: 0.7, sweepTo: 3000 });
  bell(NOTE.G5, t + 0.15, 0.04, 0.7);
  bell(NOTE.C6, t + 0.3, 0.04, 0.7);
  for (let i = 0; i < 5; i++) noiseBurst(t + 0.7 + i * 0.08, { freq: 3600, type: 'highpass', peak: 0.015, attack: 0.01, decay: 0.1 });
}

/** A few drips: small round plinks falling in pitch. */
export function drip(times = 3): void {
  const t = now();
  for (let i = 0; i < times; i++) tone(1500 - i * 140, t + i * 0.22, { wave: 'sine', peak: 0.05, attack: 0.005, decay: 0.12, glideTo: 900 });
}

/** A low, long grumble of a whale waking up, shaking the sea. */
export function whaleRumble(seconds = 2.4): void {
  const t = now();
  tone(48, t, { wave: 'sawtooth', peak: 0.07, attack: seconds * 0.4, decay: seconds * 0.7, glideTo: 70, lowpass: 200, vibrato: [3, 3] });
  noiseBurst(t, { freq: 160, type: 'lowpass', peak: 0.05, attack: seconds * 0.4, decay: seconds * 0.7, sweepTo: 90 });
}

/** The tickle of a feather: a quick trill of tiny high notes. */
export function tickle(): void {
  const t = now();
  for (let i = 0; i < 8; i++) bell(NOTE.C6 * (1 + (i % 3) * 0.12), t + i * 0.07, 0.03, 0.25);
}

/** A little ripply laugh for the chair: its creak, wobbling. */
export function chairGiggle(): void {
  const t = now();
  for (let i = 0; i < 4; i++) tone(200 + (i % 2) * 70, t + i * 0.13, { wave: 'sawtooth', peak: 0.025, attack: 0.02, decay: 0.12, glideTo: 260 + (i % 2) * 60, lowpass: 900 });
}
