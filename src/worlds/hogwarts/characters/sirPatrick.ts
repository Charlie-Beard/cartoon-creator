/**
 * Sir Patrick Delaney-Podmore, leader of the Headless Hunt (book 2; original
 * paper art). A jolly, booming ghost huntsman who holds his own head in both
 * hands in front of his chest, like a trophy he is proud of.
 *
 * He is see-through like Nearly Headless Nick, but tinted silvery green. A
 * ghost-pale red hunting jacket with brass buttons, and a frilly white ruff
 * at the top of the shoulders with NOTHING above it except a soft curl of
 * silvery mist: no neck, no stump, nothing gory. The held head is cheerful:
 * a black riding cap, a huge curly moustache, rosy cheeks and a big grin.
 *
 * Parts: figure, head (the held head, origin at its centre [150, 264], so a
 * script can toss it up and catch it or spin it), mouth, mouthOpen and lids
 * (all inside the head). The hands are drawn over the head's sides; when the
 * head is tossed, they stay where they were, holding the air.
 *
 * Layout in the 300 × 340 box: ruff at y 124 to 158, mist curl above it, the
 * held head centred at (150, 264) with the face about 100 wide, the chip
 * crops to it.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';

const HX = 150;
const HY = 264;

const SKIN = '#d6e9e1';
const SKIN_SHADE = '#a9c9bf';
const JACKET = '#d58f8c';
const JACKET_DARK = '#b66f70';
const RUFF = '#f1f8f5';
const MIST = '#e4f3ee';
const BRASS = '#d9bd66';
const CAP = '#34353d';

const button = (x: number, y: number, r = 6): Node[] => [
  piece(circle(x, y, r), BRASS, { edge: 'cut', fibre: false, shadow: false }),
  dot(x - r * 0.3, y - r * 0.3, r * 0.3, '#f6e8b0'),
];

/** A soft curl of mist where the head would be: a few puffs and a spiral. */
function mist(): Node[] {
  return [
    piece(ellipse(150, 112, 34, 15), MIST, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    piece(ellipse(138, 92, 22, 14, -12), MIST, { edge: 'clean', fibre: false, shadow: false, opacity: 0.55 }),
    piece(ellipse(166, 80, 16, 11, 14), MIST, { edge: 'clean', fibre: false, shadow: false, opacity: 0.42 }),
    piece(ellipse(152, 62, 11, 8), MIST, { edge: 'clean', fibre: false, shadow: false, opacity: 0.3 }),
    ink([[128, 108], [124, 90], [140, 76], [160, 82], [160, 98], [148, 98]], { width: 3.5, color: '#b5d3c9', opacity: 0.85 }),
    ink([[176, 106], [190, 92], [186, 72], [172, 62]], { width: 3, color: '#b5d3c9', opacity: 0.6 }),
  ];
}

/** The frilly ruff: a ring of overlapping scallops lying across the top of the shoulders. */
function ruff(): Node[] {
  const out: Node[] = [piece(curve([[84, 144], [110, 128], [150, 122], [190, 128], [216, 144], [200, 160], [150, 168], [100, 160]], 2), RUFF, { edge: 'cut', fibre: false })];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = 92 + t * 116;
    const y = 150 + Math.sin(t * Math.PI) * 10;
    out.push(piece(ellipse(x, y, 16, 12, (t - 0.5) * 40), RUFF, { edge: 'cut', fibre: false, shadow: false }));
    out.push(ink([[x - 7, y + 2], [x + 7, y + 2]], { width: 1.6, color: '#b8d2c9' }));
  }
  // the dark, hollow top of the ruff, filled with mist rather than anything else
  out.push(piece(ellipse(150, 134, 46, 11), '#c7e0d8', { edge: 'clean', fibre: false, shadow: false, opacity: 0.9 }));
  return out;
}

/** The jacket: red coat, a dark lapel line each side, brass buttons, cuffs. */
function body(): Node[] {
  return [
    piece(curve([[28, 345], [34, 240], [62, 172], [110, 152], [190, 152], [238, 172], [266, 240], [272, 345]], 2), JACKET),
    // lapels
    piece(poly([[104, 160], [150, 200], [132, 345], [108, 345], [96, 230]]), JACKET_DARK, { fibre: false, opacity: 0.55 }),
    piece(poly([[196, 160], [150, 200], [168, 345], [192, 345], [204, 230]]), JACKET_DARK, { fibre: false, opacity: 0.55 }),
    // a white stock tucked under the ruff
    piece(poly([[132, 160], [168, 160], [160, 200], [140, 200]]), RUFF, { edge: 'cut', fibre: false, shadow: false }),
    ...[[150, 318], [150, 336]].flatMap(([x, y]) => button(x, y)),
    ...[[74, 214], [78, 232], [82, 250]].flatMap(([x, y]) => button(x, y, 4.5)),
    ...[[226, 214], [222, 232], [218, 250]].flatMap(([x, y]) => button(x, y, 4.5)),
    // sleeves, bent up to the hands that hold the head
    piece(band([[66, 190], [48, 250], [86, 262]], 44), JACKET),
    piece(band([[234, 190], [252, 250], [214, 262]], 44), JACKET),
    piece(band([[60, 246], [86, 262]], 14), BRASS, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    piece(band([[240, 246], [214, 262]], 14), BRASS, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
  ];
}

/** One of the two curly moustache halves, ending in a big upward curl. */
function whisker(s: 1 | -1): Node[] {
  const x = (v: number) => HX + s * v;
  return [
    piece(curve([[x(2), HY + 6], [x(20), HY + 2], [x(44), HY + 8], [x(54), HY + 16], [x(46), HY + 24], [x(22), HY + 22], [x(4), HY + 18]], 2), '#8a949a', { edge: 'cut' }),
    // the curl: a fat spiral that turns up at the tip
    ink([[x(46), HY + 14], [x(60), HY + 12], [x(66), HY + 2], [x(60), HY - 6], [x(52), HY - 4], [x(54), HY + 2]], { width: 6, color: '#8a949a' }),
    ink([[x(14), HY + 12], [x(34), HY + 12]], { width: 1.6, color: '#c9d2d6' }),
    ink([[x(14), HY + 17], [x(40), HY + 16]], { width: 1.6, color: '#c9d2d6' }),
  ];
}

/** The held head, centred on (HX, HY) so it can be tossed and spun. */
function heldHead(): Node {
  const eye = (s: 1 | -1): Node[] => {
    const x = HX + s * 20;
    const y = HY - 8;
    return [
      piece(ellipse(x, y, 10, 11), C.white, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(x + s * -1, y + 1, 6.2), '#4f7a86', { edge: 'clean', shadow: false }),
      piece(circle(x + s * -1, y + 1, 3), C.ink, { edge: 'clean', shadow: false }),
      dot(x - 2, y - 3, 2, C.white),
    ];
  };
  return group({ part: 'head', origin: [HX, HY] }, [
  group({ transform: `translate(${HX} ${HY}) scale(1.2) translate(${-HX} ${-HY})` }, [
    // ears and face
    piece(ellipse(HX - 50, HY + 4, 10, 15), SKIN, { edge: 'cut' }),
    piece(ellipse(HX + 50, HY + 4, 10, 15), SKIN, { edge: 'cut' }),
    piece(ellipse(HX, HY, 51, 54), SKIN),
    piece(ellipse(HX, HY + 38, 36, 12), SKIN_SHADE, { edge: 'clean', fibre: false, shadow: false, opacity: 0.35 }),
    // rosy cheeks
    piece(ellipse(HX - 34, HY + 14, 13, 9), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 }),
    piece(ellipse(HX + 34, HY + 14, 13, 9), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 }),
    ...eye(-1),
    ...eye(1),
    group({ part: 'lids', opacity: 0 }, [-1, 1].flatMap((s) => [
      piece(ellipse(HX + s * 20, HY - 8, 11.5, 12.5), SKIN, { edge: 'cut', fibre: false, shadow: false }),
      ink([[HX + s * 20 - 9, HY - 6], [HX + s * 20, HY - 1], [HX + s * 20 + 9, HY - 6]], { width: 2.5, color: C.ink }),
    ])),
    // big bushy brows, up in delight
    ink([[HX - 36, HY - 22], [HX - 22, HY - 32], [HX - 8, HY - 24]], { width: 6, color: '#7e8a90' }),
    ink([[HX + 36, HY - 22], [HX + 22, HY - 32], [HX + 8, HY - 24]], { width: 6, color: '#7e8a90' }),
    // nose
    piece(ellipse(HX, HY + 8, 10, 8), SKIN_SHADE, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // the big grin, then the moustache across the top of it
    group({ part: 'mouth' }, [
      piece(curve([[HX - 26, HY + 22], [HX + 26, HY + 22], [HX + 16, HY + 40], [HX - 16, HY + 40]], 2), '#5a6a86', { edge: 'cut', fibre: false, shadow: false }),
      piece(poly([[HX - 22, HY + 23], [HX + 22, HY + 23], [HX + 20, HY + 29], [HX - 20, HY + 29]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
    ]),
    group({ part: 'mouthOpen', opacity: 0 }, [
      piece(ellipse(HX, HY + 32, 20, 15), '#5a6a86', { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(HX, HY + 39, 10, 5), '#8a9ab6', { edge: 'clean', fibre: false, shadow: false }),
    ]),
    ...whisker(-1),
    ...whisker(1),
    // the black riding cap: a round crown, a band and a short peak
    piece(curve([[HX - 54, HY - 28], [HX - 48, HY - 62], [HX, HY - 88], [HX + 48, HY - 62], [HX + 54, HY - 28], [HX, HY - 36]], 2), CAP),
    piece(curve([[HX - 54, HY - 28], [HX, HY - 38], [HX + 54, HY - 28], [HX + 52, HY - 20], [HX, HY - 28], [HX - 52, HY - 20]], 1), '#1f2026', { edge: 'cut', fibre: false }),
    piece(poly([[HX - 40, HY - 24], [HX + 40, HY - 24], [HX + 34, HY - 14], [HX - 34, HY - 14]]), '#1f2026', { edge: 'cut', fibre: false }),
    piece(ellipse(HX - 14, HY - 62, 16, 8, -20), '#555762', { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 }),
    ...button(HX, HY - 82, 5),
  ]),
  ]);
}

/** A hand wrapped round the side of the head: a pale palm and four fat fingers. */
function hand(s: 1 | -1): Node[] {
  const x = (v: number) => HX + s * v;
  return [
    piece(ellipse(x(70), HY + 24, 16, 24, s * -10), SKIN),
    ...[-14, -4, 6, 16].map((dy) => piece(ellipse(x(60), HY + 24 + dy, 10, 6, s * 8), SKIN, { edge: 'cut', fibre: false, shadow: false })),
    ...[-14, -4, 6, 16].map((dy) => ink([[x(56), HY + 24 + dy + 4], [x(66), HY + 24 + dy + 4]], { width: 1.4, color: SKIN_SHADE })),
  ];
}

export function sirPatrick(): string {
  return svg({ w: 300, h: 340, name: 'sir-patrick', label: 'Sir Patrick of the Headless Hunt', className: 'portrait' }, [
    group({ part: 'figure', opacity: 0.84 }, [
      ...body(),
      ...ruff(),
      ...mist(),
      heldHead(),
      ...hand(-1),
      ...hand(1),
    ]),
  ]);
}
