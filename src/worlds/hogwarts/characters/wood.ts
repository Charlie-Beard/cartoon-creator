/**
 * Oliver Wood, captain of the Gryffindor Quidditch team (book 3; original
 * paper art). Seventeen, tall and broad: a bigger body than the first-years
 * (wider shoulders, padded), short brown hair, a square jaw, heavy intense
 * brows, in scarlet Quidditch robes with gold trim.
 *
 * Built on person() with the usual parts (figure, head, lids, mouth,
 * mouthOpen) plus `armR`, which swings from the shoulder at (240, 262): lift it
 * for a fist pump. Its face sits inside 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const SCARLET = '#b3302c';
const SCARLET_DARK = '#8a2220';
const HAIR = '#5b3a24';
const HAIR_LIGHT = '#74502f';
const SKIN = '#ecbf92';

/** Scarlet robes with big padded shoulders and gold trim. */
function robes(): Node[] {
  return [
    // the broad body
    piece(curve([[20, 345], [30, 266], [92, 230], [150, 226], [208, 230], [270, 266], [280, 345]], 2), SCARLET),
    // padded shoulders, left (the right one is under the arm)
    piece(curve([[28, 276], [38, 244], [80, 230], [112, 236], [92, 262], [52, 282]], 2), SCARLET_DARK),
    piece(curve([[272, 276], [262, 244], [220, 230], [188, 236], [208, 262], [248, 282]], 2), SCARLET_DARK),
    // gold edge of the pads
    ink([[40, 262], [74, 240], [108, 238]], { width: 5, color: C.gold }),
    ink([[260, 262], [226, 240], [192, 238]], { width: 5, color: C.gold }),
    // gold collar and a gold stripe down the front
    piece(poly([[112, 230], [150, 272], [188, 230], [180, 220], [150, 250], [120, 220]]), C.gold, { fibre: false }),
    piece(poly([[144, 262], [156, 262], [160, 345], [140, 345]]), C.gold, { edge: 'cut', fibre: false }),
    // gold bands round the chest
    ink([[56, 316], [110, 308]], { width: 5, color: C.gold }),
    ink([[244, 316], [190, 308]], { width: 5, color: C.gold }),
  ];
}

/** The right arm from the shoulder at (240, 262): a scarlet sleeve, a gold cuff and a fist. */
const arm: Node = group({ part: 'armR', origin: [240, 262] }, [
  piece(band([[236, 266], [258, 294], [264, 308]], 42), SCARLET),
  piece(band([[258, 296], [264, 308]], 46), C.gold, { edge: 'cut', fibre: false }),
  piece(circle(268, 322, 16), SKIN, { edge: 'cut' }),
  // curled knuckles
  ...[-8, 0, 8].map((d) => piece(ellipse(262 + d, 333, 4.5, 5.5), SKIN, { edge: 'clean', fibre: false, shadow: false })),
  ink([[258, 318], [280, 318]], { width: 2, color: C.skinShade }),
]);

export function wood(): string {
  return person({
    name: 'wood',
    label: 'Oliver Wood',
    skin: SKIN,
    eyes: C.brownDark,
    eyeStyle: 'narrow',
    mouth: 'flat',
    brows: 'none',
    face: [58, 72],
    blush: false,
    nose: 'big',
    body: robes(),
    back: [
      // the square jaw sticks out beyond the round face
      piece(poly([[cx - 52, cy + 20], [cx - 50, cy + 76], [cx - 40, cy + 84], [cx + 40, cy + 84], [cx + 50, cy + 76], [cx + 52, cy + 20]]), SKIN),
      // short hair
      piece(ellipse(cx, cy - 22, 66, 58), HAIR),
    ],
    front: [
      // short, rough fringe pushed up off the forehead
      piece(curve([[cx - 64, cy - 6], [cx - 66, cy - 56], [cx - 20, cy - 80], [cx + 34, cy - 78], [cx + 66, cy - 50], [cx + 62, cy - 6], [cx + 52, cy - 36], [cx + 24, cy - 52], [cx - 8, cy - 44], [cx - 40, cy - 50], [cx - 52, cy - 30]], 2), HAIR),
      ...[-30, -6, 20, 44].map((x) => ink([[cx + x, cy - 54], [cx + x + 4, cy - 74]], { width: 3, color: HAIR_LIGHT })),
      // thick, intense brows, bent down towards the nose
      ink([[cx - 46, cy - 18], [cx - 26, cy - 14], [cx - 10, cy - 6]], { width: 7, color: HAIR }),
      ink([[cx + 46, cy - 18], [cx + 26, cy - 14], [cx + 10, cy - 6]], { width: 7, color: HAIR }),
      // a little stubble on the jaw
      ...[[-34, 56], [-24, 66], [-12, 72], [0, 74], [12, 72], [24, 66], [34, 56], [-42, 44], [42, 44]].map(([x, y]) => dot(cx + x, cy + y, 1.6, HAIR, 0.7)),
    ],
    extra: [arm],
  });
}
