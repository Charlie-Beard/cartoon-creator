/**
 * Harry before Hogwarts, living with the Dursleys: Dudley's old clothes
 * hang off him (an enormous baggy grey sweatshirt, sleeves rolled up many
 * times), the round glasses are mended with a bit of sticky tape, and
 * there is no Gryffindor tie. Same head, face and parts as the main
 * portrait (mouth, mouthOpen, lids, wand), so anything that works on
 * harry works here.
 */
import { C } from '../../../art/palette';
import { curve, ink, piece, poly } from '../../../art/paper';
import { HEAD, person, roundGlasses, wand } from './people';

const [cx, cy] = HEAD;
const HAIR = '#24212a';
const GREY = '#9a9ca2';
const GREY_DARK = '#7c7e86';
const GREY_LIGHT = '#b4b6bb';

export function harryMuggle(): string {
  return person({
    name: 'harry-muggle',
    label: 'Harry Potter in Dudley\'s old clothes',
    skin: C.skin,
    eyes: C.green,
    tie: null,
    back: [piece(poly([[cx - 74, cy + 14], [cx - 76, cy - 40], [cx - 30, cy - 90], [cx + 30, cy - 90], [cx + 76, cy - 40], [cx + 74, cy + 14]]), HAIR)],
    body: [
      // a sweatshirt far too big: wide, drooping off the shoulders, right to the edges
      piece(curve([[-6, 345], [6, 262], [74, 222], [150, 216], [226, 222], [294, 262], [306, 345]], 2), GREY),
      // slack neck, a darker ribbed collar and the neck-hole sagging
      piece(curve([[104, 228], [150, 262], [196, 228], [186, 218], [150, 240], [114, 218]], 2), GREY_DARK, { fibre: false }),
      // creases from being a size (or three) too big
      ink([[40, 300], [74, 290], [96, 312]], { width: 3, color: GREY_DARK, opacity: 0.7 }),
      ink([[260, 300], [226, 288], [204, 314]], { width: 3, color: GREY_DARK, opacity: 0.7 }),
      ink([[130, 296], [150, 312], [172, 296]], { width: 3, color: GREY_DARK, opacity: 0.7 }),
      // the left sleeve, rolled up and up into fat bands
      piece(curve([[8, 345], [4, 290], [44, 270], [64, 300], [56, 345]], 2), GREY_LIGHT),
      ...[304, 322, 340].map((y) => piece(curve([[4, y], [30, y - 8], [60, y]], 2), GREY_DARK, { edge: 'cut', fibre: false, shadow: false })),
      // the right sleeve, rolled the same, where the hand with the wand comes out
      piece(curve([[292, 345], [296, 290], [256, 270], [236, 300], [244, 345]], 2), GREY_LIGHT),
      ...[304, 322, 340].map((y) => piece(curve([[240, y], [268, y - 8], [296, y]], 2), GREY_DARK, { edge: 'cut', fibre: false, shadow: false })),
    ],
    brows: 'none',
    front: [
      // the same messy fringe as the main portrait
      piece(
        poly([
          [cx - 74, cy - 6], [cx - 70, cy - 60], [cx - 30, cy - 86], [cx + 20, cy - 90], [cx + 66, cy - 66], [cx + 76, cy - 10],
          [cx + 58, cy - 34], [cx + 50, cy - 18], [cx + 36, cy - 44], [cx + 22, cy - 28], [cx + 10, cy - 48],
          [cx - 8, cy - 30], [cx - 22, cy - 50], [cx - 36, cy - 30], [cx - 50, cy - 46], [cx - 60, cy - 20],
        ]),
        HAIR,
      ),
      ink([[cx + 12, cy - 46], [cx + 4, cy - 36], [cx + 14, cy - 34], [cx + 6, cy - 22]], { width: 3.5, color: C.rose }),
      ...roundGlasses(C.ink),
      // sticky tape across the bridge, with a second strip over it
      piece(poly([[cx - 11, cy - 6], [cx + 11, cy - 8], [cx + 12, cy + 6], [cx - 10, cy + 8]]), '#efe6c4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.95 }),
      ink([[cx - 8, cy - 2], [cx + 8, cy + 1]], { width: 1.6, color: C.stoneLight, opacity: 0.8 }),
    ],
    extra: [wand(232, 318)],
  });
}
