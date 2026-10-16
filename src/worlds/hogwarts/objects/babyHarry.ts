/**
 * Baby Harry, fast asleep in a bundle of blankets (new for the cartoons).
 *
 * 220 × 160. The bundle's bottom is flat-ish so it can be set down on a
 * doorstep. A letter is tucked into the front of the blanket as
 * `part: 'letter'` so a script can hide or show it. No scar: he is asleep
 * and the cartoon never needs one.
 */
import { C } from '../../../art/palette';
import { curve, ellipse, group, ink, piece, poly, svg } from '../../../art/paper';

const CREAM = '#f3e8cc';
const BLUE = '#b9cde2';
const BLUE_DEEP = '#93afcf';

export function babyHarryArt(): string {
  return svg({ w: 220, h: 160, name: 'hogwarts-babyHarry', label: 'Baby Harry asleep in a blanket' }, [
    piece(ellipse(110, 150, 96, 8), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false }),
    // the bundle: a fat cream blanket with a flat bottom
    piece(curve([[12, 148], [10, 108], [42, 64], [110, 48], [178, 64], [210, 108], [208, 148], [110, 154]], 2), CREAM),
    // a pale blue blanket folded over the middle
    piece(curve([[22, 146], [24, 112], [60, 92], [110, 100], [160, 92], [196, 112], [198, 146], [110, 150]], 2), BLUE),
    ink([[34, 128], [60, 120]], { width: 3, color: BLUE_DEEP }),
    ink([[160, 120], [188, 128]], { width: 3, color: BLUE_DEEP }),
    ink([[44, 140], [70, 134]], { width: 3, color: BLUE_DEEP }),
    ink([[150, 134], [178, 140]], { width: 3, color: BLUE_DEEP }),
    // cream hood folded round his face
    piece(curve([[56, 92], [54, 52], [80, 22], [110, 16], [140, 22], [166, 52], [164, 92], [110, 84]], 2), CREAM, { rough: 0.8 }),
    // his face: round, peachy, asleep
    piece(ellipse(110, 54, 40, 36), C.skin),
    // a tuft of black hair
    piece(poly([[96, 22], [104, 8], [110, 22], [118, 6], [126, 24], [112, 28]]), C.ink, { fibre: false }),
    piece(curve([[76, 40], [92, 26], [128, 26], [144, 40], [120, 34], [96, 34]], 2), C.ink, { fibre: false, shadow: false }),
    // closed sleepy eyes (curved lines) and lashes
    ink([[88, 54], [96, 60], [104, 54]], { width: 3, color: C.ink }),
    ink([[116, 54], [124, 60], [132, 54]], { width: 3, color: C.ink }),
    // rosy cheeks, a button nose and a small mouth
    piece(ellipse(84, 68, 9, 6), C.pink, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    piece(ellipse(136, 68, 9, 6), C.pink, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    ink([[108, 64], [112, 66]], { width: 2.5, color: C.skinShade }),
    ink([[104, 74], [110, 77], [116, 74]], { width: 2.5, color: C.rose }),
    // the letter tucked into the front of the blanket
    group({ part: 'letter', origin: [110, 112] }, [
      piece(poly([[78, 100], [144, 106], [140, 142], [74, 136]]), C.white, { edge: 'cut' }),
      ink([[76, 102], [108, 124], [142, 108]], { width: 2.5, color: C.stoneLight }),
      piece(ellipse(108, 124, 9, 8), C.red, { edge: 'torn', fibre: false }),
      ink([[104, 124], [112, 124]], { width: 2, color: C.redDark }),
    ]),
  ]);
}
