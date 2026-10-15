/** From Wizard Words, b7c3 (knightArt). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ink, piece, poly, rect, svg } from '../../../art/paper';

const STONE_DARK = '#6c6f7a';

const STONE = '#8c8f98';

/** A stone knight in armour, with a little spear. */
export function knightArt(): string {
  return svg({ w: 140, h: 260, name: 'b7c3-knight', boil: false }, [
    // spear
    ink([[112, 30], [112, 250]], { width: 5, color: C.brownDark }),
    piece(poly([[112, 0], [104, 34], [120, 34]]), C.grey, { edge: 'cut', fibre: false }),
    // legs
    piece(rect(44, 170, 22, 80, 4), STONE_DARK, { edge: 'cut', fibre: false }),
    piece(rect(74, 170, 22, 80, 4), STONE_DARK, { edge: 'cut', fibre: false }),
    piece(rect(38, 240, 32, 14, 4), STONE, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(70, 240, 32, 14, 4), STONE, { edge: 'cut', fibre: false, shadow: false }),
    // body
    piece(rect(32, 84, 76, 96, 14), STONE, { edge: 'cut' }),
    piece(rect(48, 112, 44, 10, 3), STONE_DARK, { edge: 'clean', fibre: false, shadow: false }),
    piece(circle(26, 98, 17), STONE_DARK, { edge: 'cut', fibre: false }),
    piece(circle(114, 98, 17), STONE_DARK, { edge: 'cut', fibre: false }),
    // helmet
    piece(rect(44, 20, 52, 66, 20), STONE, { edge: 'cut' }),
    piece(rect(52, 44, 36, 10, 3), C.ink, { edge: 'clean', fibre: false, shadow: false }),
    piece(curve([[70, 4], [58, 18], [82, 18]]), C.red, { edge: 'cut', fibre: false }),
    dot(62, 49, 2.5, C.goldLight),
    dot(78, 49, 2.5, C.goldLight),
  ]);
}
