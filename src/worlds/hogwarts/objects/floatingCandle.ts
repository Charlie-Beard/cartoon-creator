/** From Wizard Words, b1c4 (candle). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, piece, rect, svg, type Node } from '../../../art/paper';

/** One small floating candle with its glow. */
function candleNodes(x: number, y: number, s = 1): Node[] {
  return [
    piece(circle(x, y - 4 * s, 22 * s), C.candle, { edge: 'clean', shadow: false, opacity: 0.16 }),
    piece(rect(x - 5 * s, y, 10 * s, 30 * s, 2), C.cream, { edge: 'cut', fibre: false }),
    piece(curve([[x, y - 18 * s], [x + 6 * s, y - 6 * s], [x, y - 1 * s], [x - 6 * s, y - 6 * s]], 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, y - 5 * s, 2.5 * s, 4 * s), C.white, { edge: 'clean', shadow: false }),
  ];
}

/** A hovering candle for the foreground (bobs gently). */
export function candle(): string {
  return svg({ w: 60, h: 110, name: 'b1c4-candle', boil: false }, candleNodes(30, 40, 1.5));
}
