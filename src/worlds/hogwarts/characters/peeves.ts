/**
 * Peeves the poltergeist (book-only; new for the cartoons, original art).
 *
 * A little man floating cross-legged, solid and bright (not see-through like
 * the ghosts): a floppy two-pointed jester hat with bells, wild black tufts,
 * wicked dark eyes with one brow cocked, rosy cheeks, a very wide grin, a big
 * orange bow tie and a spotty waistcoat. Built on person() like the other
 * portraits, with its own wide mouth.
 *
 * Parts: figure, head, lids, mouth, mouthOpen (the usual), armR (origin at
 * the shoulder, a chalk stick in the fist, to throw) and tongue (hidden,
 * poking out of the mouth for a raspberry: show it with mouthOpen).
 *
 * Layout in the 300 × 340 box: the face sits inside 78 62 144 144, the hat
 * above it, the crossed legs and shoes along the bottom (he floats, so there
 * is no ground line).
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const SKIN = '#f3c4a2';
const HAT_A = '#3f9aa0';
const HAT_B = '#c8402e';
const TIE = '#e2512b';
const VEST = '#7b4fa0';

const bell = (x: number, y: number): Node[] => [
  piece(circle(x, y, 9), C.gold, { edge: 'cut', fibre: false }),
  ink([[x - 5, y + 2], [x + 5, y + 2]], { width: 2, color: C.brownDark }),
  dot(x - 3, y - 3, 2.4, C.goldLight),
];

const spot = (x: number, y: number, r = 4.5): Node => piece(circle(x, y, r), C.cream, { edge: 'clean', fibre: false, shadow: false });

export function peeves(): string {
  return person({
    name: 'peeves',
    label: 'Peeves the poltergeist',
    skin: SKIN,
    eyes: C.ink,
    eyeStyle: 'wide',
    face: [60, 68],
    brows: 'none',
    nose: 'big',
    mouth: 'none',
    back: [
      // wild black tufts poking out from under the hat
      piece(poly([[cx - 52, cy - 30], [cx - 96, cy - 22], [cx - 74, cy - 6], [cx - 98, cy + 16], [cx - 56, cy + 10]]), C.ink, { edge: 'torn' }),
      piece(poly([[cx + 52, cy - 30], [cx + 96, cy - 22], [cx + 74, cy - 6], [cx + 98, cy + 16], [cx + 56, cy + 10]]), C.ink, { edge: 'torn' }),
    ],
    body: [
      // crossed legs: stripy trousers, curly-toed shoes
      piece(band([[84, 298], [150, 312], [218, 304]], 34), '#d8c06a'),
      piece(band([[216, 296], [150, 316], [84, 306]], 34), '#c9a24a'),
      ...[[110, 304], [128, 310], [172, 310], [192, 304]].map(([x, y]) => ink([[x - 6, y - 12], [x + 6, y + 12]], { width: 4, color: HAT_B })),
      piece(curve([[58, 328], [70, 294], [100, 296], [110, 316], [86, 332]], 1), HAT_A),
      piece(curve([[242, 322], [232, 290], [200, 294], [192, 314], [216, 330]], 1), HAT_B),
      piece(circle(56, 326, 8), C.gold, { edge: 'cut', fibre: false }),
      piece(circle(244, 320, 8), C.gold, { edge: 'cut', fibre: false }),
      // shirt and spotty waistcoat
      piece(curve([[56, 304], [60, 262], [104, 230], [150, 226], [196, 230], [240, 262], [244, 304], [150, 314]], 2), C.white),
      piece(curve([[76, 304], [84, 266], [112, 236], [150, 232], [188, 236], [216, 266], [224, 304], [150, 314]], 2), VEST),
      piece(poly([[150, 250], [172, 232], [186, 238], [172, 306], [150, 314]]), '#6a4390', { fibre: false, shadow: false }),
      piece(poly([[122, 230], [150, 280], [178, 230], [168, 224], [150, 252], [132, 224]]), C.white, { fibre: false }),
      ...[[100, 286], [124, 298], [176, 294], [206, 282], [102, 262], [200, 258]].map(([x, y]) => spot(x, y, 4)),
      ...[[150, 272], [150, 292]].map(([x, y]) => piece(circle(x, y, 4), C.gold, { edge: 'cut', fibre: false, shadow: false })),
      // left arm: a puffed sleeve, hand on knee
      piece(curve([[62, 266], [40, 288], [48, 308], [82, 300], [92, 270]], 2), C.white),
      piece(circle(52, 310, 12), SKIN, { edge: 'cut' }),
      // the bow tie
      piece(poly([[150, 238], [112, 220], [110, 256]]), TIE, { edge: 'cut', fibre: false }),
      piece(poly([[150, 238], [188, 220], [190, 256]]), TIE, { edge: 'cut', fibre: false }),
      ...[[128, 234], [172, 234]].map(([x, y]) => spot(x, y, 3.4)),
      piece(ellipse(150, 238, 11, 12), '#b53a1c', { edge: 'cut', fibre: false }),
    ],
    front: [
      // rosy cheeks (on top of the blush person() draws)
      piece(ellipse(cx - 40, cy + 28, 13, 9), '#ec7a6e', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
      piece(ellipse(cx + 40, cy + 28, 13, 9), '#ec7a6e', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
      // brows: one cocked high, one slanted low, both wicked
      ink([[cx - 42, cy - 18], [cx - 26, cy - 28], [cx - 10, cy - 14]], { width: 5.5, color: C.ink }),
      ink([[cx + 10, cy - 10], [cx + 28, cy - 16], [cx + 42, cy - 8]], { width: 5.5, color: C.ink }),
      // the wide mouth: shut (a long grin with dimples) ...
      group({ part: 'mouth' }, [
        ink([[cx - 40, cy + 40], [cx - 20, cy + 54], [cx, cy + 56], [cx + 20, cy + 54], [cx + 40, cy + 40]], { width: 4, color: C.redDark }),
        ink([[cx - 44, cy + 36], [cx - 40, cy + 44]], { width: 3, color: C.redDark }),
        ink([[cx + 44, cy + 36], [cx + 40, cy + 44]], { width: 3, color: C.redDark }),
      ]),
      // ... and open
      group({ part: 'mouthOpen', opacity: 0 }, [
        piece(curve([[cx - 40, cy + 40], [cx, cy + 46], [cx + 40, cy + 40], [cx + 26, cy + 64], [cx, cy + 68], [cx - 26, cy + 64]], 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
        piece(poly([[cx - 30, cy + 43], [cx + 30, cy + 43], [cx + 22, cy + 52], [cx - 22, cy + 52]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
      ]),
      // the raspberry tongue (hidden; show it with the open mouth)
      group({ part: 'tongue', origin: [cx, cy + 56], opacity: 0 }, [
        piece(curve([[cx - 14, cy + 54], [cx + 14, cy + 54], [cx + 16, cy + 70], [cx, cy + 78], [cx - 16, cy + 70]], 2), '#e0707a', { edge: 'cut', fibre: false, shadow: false }),
        ink([[cx, cy + 56], [cx, cy + 70]], { width: 2, color: C.rose }),
      ]),
      // the jester hat: spotty brim, two floppy points with bells
      piece(curve([[cx - 64, cy - 24], [cx - 60, cy - 58], [cx, cy - 76], [cx + 60, cy - 58], [cx + 64, cy - 24], [cx, cy - 36]], 2), '#f3d36a', { fibre: false }),
      ...[-44, -22, 0, 22, 44].map((dx) => spot(cx + dx, cy - 52 + Math.abs(dx) * 0.1, 4)),
      piece(curve([[cx - 50, cy - 50], [cx - 66, cy - 96], [cx - 104, cy - 100], [cx - 118, cy - 70], [cx - 94, cy - 74], [cx - 74, cy - 56], [cx - 20, cy - 60]], 2), HAT_A),
      piece(curve([[cx + 50, cy - 50], [cx + 66, cy - 96], [cx + 104, cy - 104], [cx + 124, cy - 76], [cx + 98, cy - 78], [cx + 74, cy - 58], [cx + 20, cy - 60]], 2), HAT_B),
      ...[[-96, -88], [-78, -72]].map(([dx, dy]) => spot(cx + dx, cy + dy, 3.6)),
      ...[[104, -92], [82, -76]].map(([dx, dy]) => spot(cx + dx, cy + dy, 3.6)),
      ...bell(cx - 116, cy - 62),
      ...bell(cx + 124, cy - 68),
    ],
    extra: [
      // right arm, from the shoulder: puffed sleeve and a fist round a stick of chalk
      group({ part: 'armR', origin: [232, 262] }, [
        piece(band([[226, 262], [250, 292], [260, 308]], 30), C.white),
        piece(circle(262, 314, 13), SKIN, { edge: 'cut' }),
        piece(band([[254, 328], [276, 306]], 9), C.white, { edge: 'cut', fibre: false }),
        ink([[254, 328], [258, 324]], { width: 3, color: C.stoneLight }),
      ]),
    ],
  });
}
