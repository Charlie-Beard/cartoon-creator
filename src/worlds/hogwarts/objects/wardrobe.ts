/** From Wizard Words, b3c2 (wardrobe). */
import { C } from '../../../art/palette';
import { circle, curve, group, piece, rect, svg, type Node } from '../../../art/paper';

/** The boggart's wardrobe, 240 × 470, with doors that swing open. */
export function wardrobe(): string {
  const door = (x: number, part: string, knobX: number): Node =>
    group({ part }, [
      piece(rect(x, 58, 98, 372, 4), C.wood, { edge: 'cut' }),
      piece(rect(x + 14, 78, 70, 140, 6), '#b07c50', { edge: 'cut', fibre: false }),
      piece(rect(x + 14, 250, 70, 156, 6), '#b07c50', { edge: 'cut', fibre: false }),
      piece(circle(knobX, 240, 8), C.gold, { edge: 'cut' }),
    ]);
  return svg({ w: 240, h: 470, name: 'b3c2-wardrobe', boil: false, label: 'a rattling wardrobe' }, [
    piece(rect(6, 440, 26, 30, 3), C.brownDark),
    piece(rect(208, 440, 26, 30, 3), C.brownDark),
    piece(rect(12, 34, 216, 412, 6), C.brown),
    piece(rect(20, 56, 200, 376, 3), '#241a22', { edge: 'cut', fibre: false, shadow: false }),
    door(21, 'dl', 106),
    door(121, 'dr', 134),
    piece(curve([[0, 40], [30, 12], [120, 0], [210, 12], [240, 40], [240, 50], [0, 50]], 2), C.brownDark),
  ]);
}
