/**
 * One-off sounds for The Land of Nod: a little snore (smaller and softer than
 * the giant's), the chair snoring like a creaky old armchair, a person's yawn,
 * a clap, the broom's swish and the sleepy-sand's tinkle. All soft.
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../kit';

/** A small, whistly snore: a soft breath in and a little whistle out, `times` of them. */
export function snooze(times = 1): void {
  const t = now();
  for (let i = 0; i < times; i++) {
    const s = t + i * 1.8;
    noiseBurst(s, { freq: 400, type: 'lowpass', peak: 0.04, attack: 0.5, decay: 0.4, sweepTo: 250 });
    tone(NOTE.C6, s + 0.9, { wave: 'sine', peak: 0.025, attack: 0.08, decay: 0.5, glideTo: NOTE.G5 });
  }
}

/** The chair snoring: a slow wooden creak in and a low rumbly purr out. */
export function chairSnore(times = 1): void {
  const t = now();
  for (let i = 0; i < times; i++) {
    const s = t + i * 2;
    tone(150, s, { wave: 'sawtooth', peak: 0.025, attack: 0.5, decay: 0.5, glideTo: 190, lowpass: 600 });
    tone(95, s + 1, { wave: 'sawtooth', peak: 0.035, attack: 0.2, decay: 0.7, glideTo: 80, lowpass: 400, vibrato: [14, 5] });
  }
}

/** A person's big yawn: a breathy note sliding up and slowly down. */
export function yawn(high = false): void {
  const t = now();
  const f = high ? 330 : 240;
  tone(f, t, { wave: 'triangle', peak: 0.05, attack: 0.3, decay: 1.2, glideTo: f * 0.6, lowpass: 900 });
  noiseBurst(t, { freq: 700, type: 'lowpass', peak: 0.025, attack: 0.3, decay: 1.1, sweepTo: 400 });
}

/** Two quick hand claps. */
export function clap(): void {
  const t = now();
  for (let i = 0; i < 2; i++) noiseBurst(t + i * 0.22, { freq: 1800, q: 1.2, peak: 0.08, attack: 0.003, decay: 0.08 });
}

/** The broom's swish across the ground. */
export function swish(): void {
  noiseBurst(now(), { freq: 2400, q: 1.5, peak: 0.05, attack: 0.08, decay: 0.25, sweepTo: 1200 });
}

/** Sleepy-sand tinkling: a few tiny high bells, falling. */
export function sandTinkle(): void {
  const t = now();
  [NOTE.E6, NOTE.C6, NOTE.A5, NOTE.G5].forEach((f, i) => bell(f, t + i * 0.16, 0.03, 0.6));
}
