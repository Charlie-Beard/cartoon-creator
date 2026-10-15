/** From Wizard Words, b6c3 (snitchArt). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, svg } from '../../../art/paper';

/** The golden Snitch with fluttery wings, 130 × 80. */
export function snitchArt(): string {
  return svg({ w: 130, h: 80, name: 'b6c3-snitch', label: 'the golden Snitch' }, [
    piece(curve([[56, 40], [20, 6], [4, 24], [10, 44], [48, 48]], 2), C.cream, { edge: 'cut', fibre: false, opacity: 0.95 }),
    piece(curve([[74, 40], [110, 6], [126, 24], [120, 44], [82, 48]], 2), C.cream, { edge: 'cut', fibre: false, opacity: 0.95 }),
    ink([[54, 38], [20, 22]], { width: 1.8, color: C.gold }),
    ink([[76, 38], [110, 22]], { width: 1.8, color: C.gold }),
    piece(circle(65, 50, 22), C.gold, { edge: 'cut' }),
    piece(ellipse(58, 43, 7, 5), C.goldLight, { fibre: false, shadow: false }),
  ]);
}
