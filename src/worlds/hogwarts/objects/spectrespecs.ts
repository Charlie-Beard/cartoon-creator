/** From Wizard Words, b5c2 (spectrespecs). */
import { C } from '../../../art/palette';
import { circle, curve, ink, piece, rect, svg, type Node } from '../../../art/paper';

/** Rainbow spectrespecs, 220 × 100. */
export function spectrespecs(): string {
  const lens = (x: number): Node[] => [
    piece(circle(x, 50, 38), '#d97aa6', { edge: 'cut' }),
    piece(circle(x, 50, 32), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(x, 50, 27), '#8fc7c4', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(x, 50, 22), '#c7b4ea', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    ink([[x - 12, 42], [x - 4, 36]], { width: 3, color: C.white, opacity: 0.8 }),
  ];
  return svg({ w: 220, h: 100, name: 'b5c2-specs', label: 'spectrespecs' }, [
    piece(curve([[34, 44], [4, 30], [8, 24], [36, 36]], 1), '#d97aa6', { edge: 'cut' }),
    piece(curve([[186, 44], [216, 30], [212, 24], [184, 36]], 1), '#d97aa6', { edge: 'cut' }),
    piece(rect(98, 40, 24, 9, 4), '#d97aa6', { edge: 'cut' }),
    ...lens(70),
    ...lens(150),
  ]);
}
