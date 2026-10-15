/** From Wizard Words, b6c3 (bludgerArt). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, svg } from '../../../art/paper';

/** A cheeky Bludger, 110 × 110. */
export function bludgerArt(): string {
  return svg({ w: 110, h: 110, name: 'b6c3-bludger', label: 'a cheeky Bludger' }, [
    piece(circle(55, 55, 50), C.night, { edge: 'cut' }),
    piece(ellipse(38, 46, 10, 12), C.cream, { fibre: false, shadow: false }),
    piece(ellipse(72, 46, 10, 12), C.cream, { fibre: false, shadow: false }),
    dot(40, 48, 4.5, C.ink),
    dot(74, 48, 4.5, C.ink),
    ink([[24, 30], [48, 38]], { width: 3.5, color: C.cream }),
    ink([[86, 30], [62, 38]], { width: 3.5, color: C.cream }),
    piece(curve([[32, 68], [55, 90], [80, 68], [55, 76]], 2), C.cream, { fibre: false, shadow: false }),
  ]);
}
