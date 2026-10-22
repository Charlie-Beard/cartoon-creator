/**
 * The Wishing-Chair children: Mollie (about 8) and Peter (about 9). They
 * ride the chair side by side, often drawn small, so each has one shape
 * that reads at a glance and neither looks like Beth, Joe or Fran:
 * Mollie's two long fair plaits with blue ribbons hanging down past her
 * shoulders, Peter's neat dark head with one tuft at the front over a
 * green jumper and a white collar.
 *
 * Built from the Faraway building blocks (faraway/parts.ts). Mollie's
 * plaits are her `hair` part, so they can swing when she turns her head.
 */
import { C } from '../../art/palette';
import { circle, curve, ellipse, group, ink, piece, poly, type Node } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso } from '../faraway/parts';

const SKIN = C.skin;
const FAIR = '#d9b86c';
const FAIR_DARK = '#a98440';
const DARK = '#3a2516';

/** One plait hanging beside the face: linked loops, a blue ribbon bow, a short tail. */
function plait(side: -1 | 1): Node {
  const x0 = cx + side * 68;
  const links: Node[] = [];
  for (let i = 0; i < 5; i++) {
    const y = 132 + i * 23;
    const x = x0 + side * (4 + i * 3);
    links.push(piece(ellipse(x, y, 19 - i * 0.8, 15), FAIR));
    links.push(ink([[x - 8, y - 7], [x + 3, y + 1], [x - 5, y + 9]], { width: 2, color: FAIR_DARK, opacity: 0.8 }));
  }
  const tipX = x0 + side * 14;
  return group({ part: side < 0 ? 'hairL' : 'hairR', origin: [x0, 100] }, [
    piece(curve([[x0 - 14, 100], [x0 + 14, 100], [tipX + 16, 140], [tipX + 12, 236], [tipX - 12, 236], [tipX - 16, 140]], 2), FAIR),
    ...links,
    piece(poly([[tipX, 252], [tipX - 26, 236], [tipX - 24, 268]]), C.blue, CUT),
    piece(poly([[tipX, 252], [tipX + 26, 236], [tipX + 24, 268]]), C.blue, CUT),
    piece(circle(tipX, 252, 7), C.blueDark, FLAT),
    piece(curve([[tipX - 9, 260], [tipX + 9, 260], [tipX + 7, 292], [tipX, 298], [tipX - 7, 292]], 1), FAIR, CUT),
  ]);
}

/** Mollie, about 8: fair plaits with blue ribbons, a yellow cardigan, a kind smile. */
export function mollie(): string {
  const dress = C.blue;
  const cardi = C.yellow;
  return person({
    name: 'wishing-mollie',
    label: 'Mollie',
    skin: SKIN,
    face: [56, 62],
    behindHead: [
      piece(ellipse(cx, cy - 20, 60, 54), FAIR),
      // the plaits as one 'hair' part, hanging either side of the face
      group({ part: 'hair', origin: [cx, 96] }, [plait(-1), plait(1)]),
    ],
    body: [
      torso(dress, 0, 228),
      // a white collar peeping out, and the dress showing between cardigan sides
      piece(poly([[120, 228], [150, 252], [180, 228], [170, 224], [150, 238], [130, 224]]), C.white, FLAT),
      piece(poly([[112, 232], [150, 256], [188, 232], [196, 345], [104, 345]]), dress, { fibre: false }),
      // cardigan fronts and buttons
      piece(curve([[40, 345], [48, 270], [100, 236], [128, 232], [134, 345]], 2), cardi),
      piece(curve([[260, 345], [252, 270], [200, 236], [172, 232], [166, 345]], 2), cardi),
      ...[270, 298, 326].map((y) => piece(circle(124, y, 5), C.brownDark, FLAT)),
      ink([[134, 250], [134, 345]], { width: 3, color: '#b8933a' }),
      ink([[166, 250], [166, 345]], { width: 3, color: '#b8933a' }),
    ],
    front: [
      // a soft side-parted fringe and a blue hair slide
      piece(curve([[96, 126], [98, 84], [136, 68], [180, 72], [204, 96], [204, 126], [188, 98], [152, 88], [120, 96], [104, 126]], 2), FAIR),
      ink([[150, 76], [128, 92], [108, 118]], { width: 2, color: FAIR_DARK }),
      piece(poly([[182, 80], [200, 92], [196, 100], [178, 90]]), C.blue, CUT),
    ],
    eyes: 'round',
    eyeCol: C.blue,
    eyeDx: 24,
    eyeY: 2,
    browCol: FAIR_DARK,
    mouth: 'smile',
    mouthY: 40,
    arms: [
      arm('armL', { from: [66, 266], via: [48, 300], to: [52, 336], sleeve: cardi, cuff: '#c9a43f', hand: SKIN }),
      arm('armR', { from: [234, 266], via: [252, 300], to: [248, 336], sleeve: cardi, cuff: '#c9a43f', hand: SKIN }),
    ],
  });
}

/** Peter, about 9: short dark hair with a front tuft, green jumper, white collar, an eager grin. */
export function peter(): string {
  const jumper = C.green;
  return person({
    name: 'wishing-peter',
    label: 'Peter',
    skin: SKIN,
    face: [58, 62],
    behindHead: [piece(ellipse(cx, cy - 22, 60, 52), DARK)],
    body: [
      torso(jumper, 8, 228),
      // ribbed hem and a pale stripe across the chest
      piece(poly([[34, 318], [266, 318], [270, 345], [30, 345]]), C.greenDark, FLAT),
      piece(poly([[40, 276], [260, 276], [262, 288], [38, 288]]), C.leafLight, { ...FLAT, opacity: 0.55 }),
      // white shirt collar with two points over the jumper's V neck
      piece(poly([[114, 222], [150, 262], [186, 222], [180, 214], [150, 238], [120, 214]]), C.greenDark, FLAT),
      piece(poly([[116, 220], [146, 258], [128, 268], [104, 238]]), C.white, CUT),
      piece(poly([[184, 220], [154, 258], [172, 268], [196, 238]]), C.white, CUT),
    ],
    front: [
      // short dark hair, a side sweep, and a tuft standing up at the front
      piece(curve([[92, 128], [92, 86], [126, 62], [176, 62], [208, 86], [208, 128], [196, 100], [170, 94], [130, 100], [104, 112]], 2), DARK),
      piece(poly([[124, 78], [138, 42], [160, 24], [172, 52], [184, 76]]), DARK),
      ink([[110, 92], [140, 74]], { width: 2, color: '#5a3a22' }),
    ],
    eyes: 'big',
    eyeCol: C.brown,
    eyeDx: 25,
    eyeY: 2,
    browY: -22,
    browCol: DARK,
    brows: 'raised',
    mouth: 'grin',
    mouthY: 40,
    arms: [
      arm('armL', { from: [66, 266], via: [48, 300], to: [52, 336], sleeve: jumper, cuff: C.greenDark, hand: SKIN }),
      arm('armR', { from: [234, 266], via: [252, 300], to: [248, 336], sleeve: jumper, cuff: C.greenDark, hand: SKIN }),
    ],
  });
}
