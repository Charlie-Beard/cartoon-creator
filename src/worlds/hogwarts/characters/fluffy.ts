/**
 * Fluffy, Hagrid's enormous three-headed dog (book 1; original paper art).
 *
 * A great shaggy toffee-brown heap lying down with his big paws out in front
 * and a tail curling up behind. Three big dog heads sit side by side on the
 * one body: a larger middle head and a head either side that is a touch
 * lower and smaller. Every head has big floppy dark ears, a pale muzzle with
 * a wet black nose, round friendly brown eyes and worried-kind eyebrows. He
 * looks gruff, but he is secretly a big soppy puppy. Open, the mouths show
 * teeth for a growl; they are never cruel.
 *
 * Parts: headL, headM and headR (each head in one group, origin at its
 * neck, so it can nod and droop as he falls asleep); lidsL, lidsM and lidsR
 * (each head's closed sleepy eyelids, hidden; they sit inside the head
 * group, so they nod with it); lids (all three heads' blink lids, hidden;
 * three groups of the same name, one inside each head, so k.blink finds
 * them all and they move with the heads); mouth and mouthOpen (the MIDDLE
 * head's mouth, closed / open with teeth, mouthOpen hidden); mouthOpenL and
 * mouthOpenR (the side heads' snarls, hidden; their closed mouths are always
 * drawn); tail (origin at its base, for a happy wag). He doesn't speak: it
 * is growls, barks and snores only.
 *
 * Layout in the 300 x 340 box: the middle head is centred on (150, 124)
 * (eyes at y 116, nose at y 136, mouth at y 154, chin about y 182), so the
 * face sits inside the 78 62 144 144 chip. The left head is centred on
 * (56, 158) and the right on (244, 158); necks (the head origins) are at
 * (150, 170), (56, 199) and (244, 199). The body mound fills x 8 to 292
 * down to the ground at y 336; the front paws are at about (104, 314) and
 * (196, 314); the tail sprouts at (266, 296) and curls up to (288, 226).
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';
import { H, W } from './people';

const FUR = '#a8794a';
const FUR_LIGHT = '#c99a63';
const FUR_DARK = '#7a5232';
const FUR_DEEP = '#5a3a24';
const MUZZLE = '#e6cba0';
const EYE = '#3b2616';

/** A pointed tuft of darker fur at (x, y), tilted by `rot` degrees. */
const tuft = (x: number, y: number, s = 1, rot = 0, col = FUR_DARK): Node => {
  const a = (rot * Math.PI) / 180;
  const pts = ([[-8, 6], [-3, -6], [0, -17], [4, -6], [9, 6]] as Pt[]).map(
    ([dx, dy]): Pt => [x + (dx * Math.cos(a) - dy * Math.sin(a)) * s, y + (dx * Math.sin(a) + dy * Math.cos(a)) * s],
  );
  return piece(pts, col, { edge: 'cut', shadow: false, fibre: false });
};

/** One big paw seen from the front, with three toe lines. */
function paw(x: number): Node[] {
  return [
    piece(ellipse(x, 314, 38, 23), FUR_LIGHT),
    ...[-14, 0, 14].map((d) => ink([[x + d, 318], [x + d, 330]], { width: 2.6, color: FUR_DARK })),
    ...[-14, 0, 14].map((d) => piece(ellipse(x + d, 332, 5.5, 3.5), C.cream, { edge: 'clean', fibre: false, shadow: false })),
  ];
}

/**
 * One head. (cx, cy) is the middle of the face and `s` its scale. `side` is
 * -1 / 0 / 1 for left / middle / right: the middle head's closed mouth is the
 * `mouth` part, the sides' are plain. `part` is the head's own part name,
 * `lid` its sleepy-lid part and `open` its open-mouth part.
 */
function head(cx: number, cy: number, s: number, side: -1 | 0 | 1, part: string, lid: string, open: string): Node {
  const p = (x: number, y: number): Pt => [cx + x * s, cy + y * s];
  const pp = (pts: Pt[]): Pt[] => pts.map(([x, y]) => p(x, y));
  const eyeX = 22;
  const eyeY = -8;
  const lidNodes = (): Node[] =>
    [-1, 1].flatMap((e) => {
      const [x, y] = p(e * eyeX, eyeY);
      return [
        piece(circle(x, y, 13.5 * s), FUR, { edge: 'cut', fibre: false, shadow: false }),
        ink([[x - 12 * s, y + 1 * s], [x, y + 7 * s], [x + 12 * s, y + 1 * s]], { width: 3, color: FUR_DEEP }),
        ink([[x - 9 * s, y + 5 * s], [x - 13 * s, y + 9 * s]], { width: 1.8, color: FUR_DEEP }),
        ink([[x + 9 * s, y + 5 * s], [x + 13 * s, y + 9 * s]], { width: 1.8, color: FUR_DEEP }),
      ];
    });
  const jaw = (): Node[] => [
    // the lower jaw drops: a pale chin under a dark mouth
    piece(ellipse(...p(0, 47), 25 * s, 12 * s), FUR_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve(pp([[-26, 24], [0, 28], [26, 24], [24, 44], [0, 56], [-24, 44]]), 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(...p(0, 46), 14 * s, 8 * s), C.rose, { edge: 'clean', fibre: false, shadow: false }),
    ink([p(0, 40), p(0, 50)], { width: 2, color: C.redDark }),
    // upper fangs and a row of smaller teeth, lower fangs coming up
    ...[-17, 17].map((x) => piece(poly(pp([[x - 6, 25], [x + 6, 25], [x, 42]])), C.cream, { edge: 'clean', fibre: false, shadow: false })),
    ...[-8, 0, 8].map((x) => piece(poly(pp([[x - 3.5, 26], [x + 3.5, 26], [x, 33]])), C.cream, { edge: 'clean', fibre: false, shadow: false })),
    ...[-13, 13].map((x) => piece(poly(pp([[x - 5, 52], [x + 5, 52], [x, 41]])), C.cream, { edge: 'clean', fibre: false, shadow: false })),
  ];
  const closed = (): Node[] => [
    // nose to lip, and a soft smile with a jowl each side
    ink([p(0, 20), p(0, 30)], { width: 3, color: FUR_DEEP }),
    ink(pp([[-24, 28], [-12, 36], [0, 31], [12, 36], [24, 28]]), { width: 3.4, color: FUR_DEEP }),
    ink(pp([[-26, 24], [-24, 32]]), { width: 2.6, color: FUR_DEEP }),
    ink(pp([[26, 24], [24, 32]]), { width: 2.6, color: FUR_DEEP }),
    // a tiny pink tongue tip, because he is a puppy at heart
    piece(ellipse(...p(7, 39), 6 * s, 4.5 * s), C.rose, { edge: 'clean', fibre: false, shadow: false }),
  ];

  return group({ part, origin: p(0, 46) }, [
    // big floppy ears hang down the sides of the face
    piece(curve(pp([[-38, -30], [-62, -8], [-66, 28], [-52, 52], [-38, 30], [-34, -4]]), 2), FUR_DARK),
    piece(curve(pp([[38, -30], [62, -8], [66, 28], [52, 52], [38, 30], [34, -4]]), 2), FUR_DARK),
    piece(curve(pp([[-42, -16], [-56, 4], [-56, 30], [-48, 40]]), 2), FUR_DEEP, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    piece(curve(pp([[42, -16], [56, 4], [56, 30], [48, 40]]), 2), FUR_DEEP, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    // the broad shaggy head
    piece(curve(pp([[-52, -4], [-44, -34], [0, -48], [44, -34], [52, -4], [44, 34], [0, 46], [-44, 34]]), 2), FUR),
    piece(ellipse(...p(0, -34), 34 * s, 9 * s), FUR_LIGHT, { fibre: false, shadow: false, edge: 'cut', opacity: 0.6 }),
    tuft(...p(0, -46), 1.1 * s, 0),
    tuft(...p(-20, -42), 0.9 * s, -26),
    tuft(...p(20, -42), 0.9 * s, 26),
    tuft(...p(-46, 12), 0.7 * s, -70),
    tuft(...p(46, 12), 0.7 * s, 70),
    // the pale muzzle and the big wet black nose
    piece(ellipse(...p(0, 22), 31 * s, 23 * s), MUZZLE),
    piece(ellipse(...p(0, 12), 13 * s, 9 * s), C.ink, { edge: 'clean', shadow: false }),
    piece(ellipse(...p(-4, 9), 4.5 * s, 2.5 * s, -20), C.white, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    // round friendly eyes, wide and shining
    ...[-1, 1].flatMap((e) => {
      const [x, y] = p(e * eyeX, eyeY);
      return [
        piece(circle(x, y, 12 * s), C.cream, { edge: 'clean', fibre: false, shadow: false }),
        piece(circle(x, y + 1 * s, 8.5 * s), EYE, { edge: 'clean', shadow: false }),
        dot(x - 3 * s, y - 3 * s, 3.2 * s, C.white),
        dot(x + 3 * s, y + 4 * s, 1.5 * s, C.white),
      ];
    }),
    // eyebrows tilted up in the middle: gruff, but a bit worried and kind
    ...[-1, 1].map((e) => ink(pp([[e * 36, -22], [e * 24, -26], [e * 10, -22]]), { width: 5.5, color: FUR_DEEP })),
    // the closed mouth, with the open one drawn over it
    side === 0 ? group({ part: 'mouth' }, closed()) : group({}, closed()),
    group({ part: open, opacity: 0 }, jaw()),
    // blink lids and sleepy lids, over the eyes
    group({ part: 'lids', opacity: 0 }, lidNodes()),
    group({ part: lid, opacity: 0 }, lidNodes()),
  ]);
}

export function fluffy(): string {
  return svg({ w: W, h: H, name: 'hogwarts-fluffy', label: 'Fluffy the three-headed dog', className: 'portrait' }, [
    // a soft shadow on the ground
    piece(ellipse(150, 337, 140, 11), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    // the tail, behind the haunch (wags from its base)
    group({ part: 'tail', origin: [266, 296] }, [
      piece(band([[258, 298], [282, 286], [292, 256], [284, 226]], 22), FUR_DARK),
      piece(band([[260, 296], [280, 284], [288, 258]], 9), FUR, { fibre: false, shadow: false, edge: 'cut' }),
      tuft(284, 220, 1.2, 8, FUR_LIGHT),
      tuft(274, 224, 1, -22, FUR_LIGHT),
    ]),
    // the great body: a heap of fur with a haunch each side
    piece(curve([[8, 300], [10, 240], [60, 196], [150, 184], [240, 196], [290, 240], [292, 300], [262, 336], [40, 336]], 2), FUR),
    piece(ellipse(46, 276, 44, 56), FUR_DARK, { fibre: false, shadow: false, opacity: 0.5, edge: 'cut' }),
    piece(ellipse(254, 276, 44, 56), FUR_DARK, { fibre: false, shadow: false, opacity: 0.5, edge: 'cut' }),
    piece(ellipse(150, 262, 74, 64), FUR_LIGHT, { fibre: false, shadow: false, opacity: 0.75 }),
    // tufts of shaggy fur
    tuft(24, 236, 1.2, -50),
    tuft(276, 236, 1.2, 50),
    tuft(18, 290, 1, -75),
    tuft(284, 290, 1, 75),
    tuft(150, 214, 1, 0, FUR_LIGHT),
    tuft(112, 224, 0.9, -20, FUR_LIGHT),
    tuft(188, 224, 0.9, 20, FUR_LIGHT),
    tuft(150, 262, 0.9, 0, FUR),
    // the heads: the sides first, the middle in front
    head(72, 160, 0.95, -1, 'headL', 'lidsL', 'mouthOpenL'),
    head(228, 160, 0.95, 1, 'headR', 'lidsR', 'mouthOpenR'),
    head(150, 120, 1.12, 0, 'headM', 'lidsM', 'mouthOpen'),
    // the two big front paws
    ...paw(104),
    ...paw(196),
  ]);
}
