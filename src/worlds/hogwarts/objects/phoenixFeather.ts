/** From Wizard Words, b2c4 (featherArt). */
import { curve, ink, piece, svg } from '../../../art/paper';

/** A loose, droopy feather. */
export function featherArt(): string {
  return svg({ w: 60, h: 120, name: 'b2c4-feather' }, [
    piece(curve([[30, 6], [48, 40], [44, 90], [30, 116], [16, 90], [12, 40]], 2), '#8d5a50'),
    ink([[30, 12], [30, 114]], { width: 2, color: '#5a3a34' }),
  ]);
}
