/**
 * Sounds only The Land of Lost Things wants: the Keeper's hand-bell, the
 * great heap creaking and wobbling, things tumbling off it, and a sock
 * popping off to be lost. Soft and short (docs/STYLE.md, "Sound").
 */
import { bell, noiseBurst, NOTE, now, tone } from '../../kit';

/** The Keeper's hand-bell: `n` bright dings, swinging to and fro. */
export function handbell(n = 3): void {
  const t = now();
  for (let i = 0; i < n; i++) bell(i % 2 ? NOTE.E6 : NOTE.C6, t + i * 0.32, 0.07, 0.9);
}

/** The heap creaking as it sways: a slow, groaning wooden creak, `s` seconds long. */
export function heapCreak(s = 1.2): void {
  const t = now();
  tone(110, t, { wave: 'sawtooth', peak: 0.03, attack: s * 0.4, decay: s * 0.6, glideTo: 82, vibrato: [11, 6], lowpass: 700 });
  noiseBurst(t, { freq: 420, q: 6, peak: 0.025, attack: s * 0.4, decay: s * 0.6, sweepTo: 260 });
}

/** Something soft tumbling off the heap: a little bump, then a softer one. */
export function tumble(): void {
  const t = now();
  noiseBurst(t, { freq: 300, type: 'lowpass', peak: 0.08, attack: 0.005, decay: 0.12 });
  noiseBurst(t + 0.22, { freq: 260, type: 'lowpass', peak: 0.05, attack: 0.005, decay: 0.1 });
}

/** A sock slipping away to the Land of Lost Things: a little rising "fwip" and a tinkle. */
export function fwip(): void {
  const t = now();
  tone(NOTE.C5, t, { wave: 'sine', peak: 0.06, attack: 0.02, decay: 0.3, glideTo: NOTE.C6 });
  bell(NOTE.G6, t + 0.28, 0.04, 0.6);
}
