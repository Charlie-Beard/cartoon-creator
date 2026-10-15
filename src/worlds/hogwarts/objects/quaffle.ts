/** From Wizard Words, b6c3 (quaffleArt). */
import { C } from '../../../art/palette';
import { circle, ink, piece, svg } from '../../../art/paper';

/** The Quaffle: a plain red ball, 60 × 60. */
export function quaffleArt(): string {
  return svg({ w: 60, h: 60, name: 'b6c3-quaffle' }, [
    piece(circle(30, 30, 27), C.red, { edge: 'cut' }),
    ink([[10, 22], [30, 18], [50, 22]], { width: 2, color: C.redDark }),
    ink([[10, 40], [30, 44], [50, 40]], { width: 2, color: C.redDark }),
  ]);
}
