/**
 * One of Charlie Weasley's friends from the dragon reserve in Romania, who
 * flies in on a broomstick to collect Norbert (book 1; original paper art).
 *
 * A young witch with a windswept red-brown plait, freckles, flying goggles
 * pushed up on her forehead, a brown leather jacket with buckles and a wide
 * cheerful grin. Built on person() with the usual parts (figure, head, lids,
 * mouth, mouthOpen) plus `armR`, which swings from the shoulder at
 * (232, 262) so she can wave. Her face sits inside 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const BRASS = '#b98a3a';

const buckle = (x: number, y: number): Node[] => [
  piece(rect(x - 8, y - 6, 16, 12, 2), BRASS, { edge: 'cut', fibre: false, shadow: false }),
  piece(rect(x - 4, y - 3, 8, 6, 1), '#5a3a28', { edge: 'clean', fibre: false, shadow: false }),
];

/** Flying goggles: two brass-rimmed lenses joined by a bridge, with glints. */
const goggles = (x: number, y: number, r: number): Node[] => [
  ...[-1, 1].flatMap((s) => [
    piece(circle(x + s * r * 1.15, y, r), BRASS, { edge: 'cut', fibre: false }),
    piece(circle(x + s * r * 1.15, y, r * 0.72), '#9cc4d6', { edge: 'clean', fibre: false, shadow: false }),
    dot(x + s * r * 1.15 - r * 0.25, y - r * 0.25, r * 0.2, C.white),
  ]),
  ink([[x - r * 0.4, y], [x + r * 0.4, y]], { width: 5, color: '#5a3a28' }),
];

/** A friendly waving arm, from the shoulder at (232, 262). */
const arm = (sleeve: string, cuff: string): Node =>
  group({ part: 'armR', origin: [232, 262] }, [
    piece(band([[226, 264], [250, 294], [260, 312]], 32), sleeve),
    piece(band([[252, 306], [262, 320]], 36), cuff, { edge: 'cut', fibre: false }),
    piece(circle(266, 326, 14), C.skin, { edge: 'cut' }),
    ...[-6, 0, 6].map((d) => piece(ellipse(266 + d, 338, 3.5, 6), C.skin, { edge: 'clean', fibre: false, shadow: false })),
  ]);

export function dragonKeeper(): string {
  const HAIR = '#9a4a28';
  const HAIR_LIGHT = '#b8643a';
  const JACKET = '#7a4a2a';
  const jacket: Node[] = [
    piece(curve([[40, 345], [52, 262], [104, 230], [150, 226], [196, 230], [248, 262], [260, 345]], 2), JACKET),
    // cream shirt at the neck
    piece(poly([[124, 228], [150, 290], [176, 228], [168, 222], [150, 250], [132, 222]]), C.cream, { fibre: false }),
    // big turned-down collar
    piece(poly([[112, 230], [146, 292], [140, 236], [128, 216]]), '#8f5a34', { fibre: false }),
    piece(poly([[188, 230], [154, 292], [160, 236], [172, 216]]), '#8f5a34', { fibre: false }),
    // zip line, pockets and buckled straps
    ink([[150, 296], [150, 345]], { width: 3, color: '#4a2e1c' }),
    ...[-1, 1].map((s) => ink([[150 + s * 56, 300], [150 + s * 56, 345]], { width: 3, color: '#4a2e1c' })),
    piece(rect(70, 296, 50, 30, 4), '#8f5a34', { fibre: false }),
    ...buckle(95, 312),
    ...[-1, 1].map((s) => ink([[150 + s * 36, 254], [150 + s * 80, 270]], { width: 9, color: '#5a3a28' })),
    ...buckle(114, 262),
    ...buckle(194, 266),
  ];
  return person({
    name: 'dragonKeeper',
    label: 'Charlie’s friend, a dragon keeper',
    skin: C.skin,
    eyes: C.green,
    eyeStyle: 'round',
    freckles: true,
    face: [58, 66],
    brows: 'kind',
    browColor: '#7a3a20',
    mouth: 'grin',
    ears: false,
    body: jacket,
    back: [
      // windswept hair behind the head, blown back to the left
      piece(ellipse(cx, cy - 18, 70, 62), HAIR),
      piece(curve([[cx - 56, cy - 14], [cx - 96, cy - 4], [cx - 128, cy + 20], [cx - 100, cy + 22], [cx - 74, cy + 36], [cx - 58, cy + 30]], 2), HAIR_LIGHT),
    ],
    front: [
      // side-swept fringe
      piece(curve([[cx - 62, cy - 4], [cx - 60, cy - 60], [cx - 10, cy - 84], [cx + 48, cy - 70], [cx + 62, cy - 14], [cx + 38, cy - 40], [cx - 6, cy - 44], [cx - 40, cy - 24]], 2), HAIR),
      piece(curve([[cx - 30, cy - 70], [cx + 6, cy - 82], [cx + 36, cy - 66]], 2), HAIR_LIGHT, { fibre: false, shadow: false }),
      // the goggles' strap, and the goggles pushed up on the forehead
      ink([[cx - 62, cy - 34], [cx - 30, cy - 46], [cx + 30, cy - 46], [cx + 62, cy - 34]], { width: 6, color: '#5a3a28' }),
      ...goggles(cx, cy - 44, 17),
    ],
    extra: [
      // the plait: over the right shoulder, braided links, tied with a red band
      ...[0, 1, 2, 3, 4, 5].map((i) => piece(ellipse(206 + i * 2.5, 226 + i * 16, 14 - i * 0.8, 12), i % 2 ? HAIR : HAIR_LIGHT)),
      piece(rect(204, 322, 20, 8, 3), C.red, { edge: 'cut', fibre: false, shadow: false }),
      piece(poly([[206, 328], [226, 328], [216, 346]]), HAIR),
      arm(JACKET, '#5a3a28'),
    ],
  });
}
