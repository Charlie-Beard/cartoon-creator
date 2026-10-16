/** A tall black iron street lamp (Privet Drive), 120 × 400. Part `glow` is the light. */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../../art/paper';

const IRON = '#26262d';
const IRON_LIGHT = '#3b3b46';

export function streetLampArt(): string {
  return svg({ w: 120, h: 400, name: 'hogwarts-streetLamp', label: 'a street lamp' }, [
    // base and post
    piece(rect(34, 372, 52, 28, 5), IRON, { edge: 'cut' }),
    piece(rect(42, 352, 36, 24, 5), IRON_LIGHT, { edge: 'cut', fibre: false }),
    piece(rect(54, 130, 12, 230, 3), IRON, { edge: 'cut' }),
    piece(rect(48, 300, 24, 8, 3), IRON_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(49, 134, 22, 10, 3), IRON_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    // the lantern head: dark glass underneath (the lamp switched off)
    piece(rect(34, 48, 52, 70, 4), '#4a4c58', { edge: 'cut', fibre: false }),
    // lit glass: halo and panes, drawn ON
    group({ part: 'glow' }, [
      piece(ellipse(60, 84, 58, 56), 'rgba(255,214,120,0.22)', { edge: 'clean', fibre: false, shadow: false }),
      piece(ellipse(60, 84, 42, 42), 'rgba(255,214,120,0.30)', { edge: 'clean', fibre: false, shadow: false }),
      piece(rect(36, 50, 48, 66, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(44, 62, 32, 44, 12), '#fff0b8', { edge: 'clean', fibre: false, shadow: false }),
    ]),
    // iron frame over the glass
    ...[34, 56, 84].map((x) => piece(rect(x, 48, x === 56 ? 8 : 5, 70, 1), IRON, { edge: 'cut', fibre: false, shadow: false })),
    piece(rect(30, 112, 60, 14, 4), IRON, { edge: 'cut' }),
    // roof and finial
    piece(poly([[28, 50], [60, 14], [92, 50]]), IRON, { edge: 'cut' }),
    piece(rect(26, 46, 68, 8, 3), IRON_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(60, 12, 7), IRON, { edge: 'cut', fibre: false }),
    // a little curl of ironwork
    ink([[66, 200], [92, 196], [96, 214], [82, 218]], { width: 4, color: IRON }),
    dot(60, 12, 2, IRON_LIGHT),
    piece(curve([[44, 340], [60, 330], [76, 340]], 2), IRON_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
  ]);
}
