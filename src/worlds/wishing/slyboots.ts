/**
 * Old Slyboots, the pedlar of the Goblin Market: a tall, thin hobgoblin
 * with a green face, a long hooked nose, narrow sly eyes, big pointed ears
 * and a little pointed goatee. A battered tall hat with a teal feather, a
 * patched purple coat with a rust scarf, and on his back a huge brown pack
 * hung with pots, a ladle, a lantern and bunches of ribbons that clank and
 * flutter behind his shoulders. Greedy and sneaky, with a loud market voice.
 * He looms and snaps "MINE!", but he never touches anyone.
 *
 * Green skin and a purple coat keep him well apart from the friends and
 * from Mr Grim (black gown, pale face).
 *
 * Parts: the usual person() ones (figure, head, eyes, lids, brows, mouth,
 * mouthOpen, armL, armR, hat; the hat tips and wobbles).
 * Poses: shout (his market call: hand to his mouth, mouth wide), grab
 * (hugging his money bag, greedy grin), flop (sat down in a heap, dizzy,
 * hat over one ear).
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso } from '../faraway/parts';

type Mood = 'sly' | 'shout' | 'grab' | 'flop';

const SKIN = '#9db56c';
const SKIN_DARK = '#7f9a55';
const NOSE = '#aac27a';
const COAT = C.purple;
const COAT_DARK = C.plum;
const HAT = '#5a4a36';
const HAT_BAND = C.rust;
const FEATHER = C.teal;
const SACK = '#a8794a';
const SACK_DARK = '#7b5634';
const FACE_RX = 44;
const FACE_RY = 62;
const EX = 22; // half the distance between the eyes
const EY = cy - 4;
const MY = cy + 46; // the mouth

/** Turns points about (ox, oy) by `deg` degrees and shifts them, for a hat knocked askew. */
const turn =
  (deg: number, ox: number, oy: number, dx = 0, dy = 0) =>
  (pts: Pt[]): Pt[] => {
    const a = (deg * Math.PI) / 180;
    return pts.map(([x, y]) => [ox + (x - ox) * Math.cos(a) - (y - oy) * Math.sin(a) + dx, oy + (x - ox) * Math.sin(a) + (y - oy) * Math.cos(a) + dy] as Pt);
  };

/** A flat spiral of ink, for dizzy eyes. */
function swirl(x: number, y: number, r: number, dir: number): Node {
  const pts: Pt[] = [];
  for (let i = 0; i <= 28; i++) {
    const a = dir * i * 0.45;
    const rr = (r * i) / 28;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return ink(pts, { width: 2.6, color: C.ink, wobble: 0.2 });
}

/** The huge pack behind his shoulders, hung with pots, a ladle, a lantern and ribbons. */
function pack(): Node[] {
  const pot = (x: number, y: number, r: number, col: string): Node[] => [
    ink([[x, y - r - 14], [x, y - r + 2]], { width: 2, color: C.brownDark, wobble: 0.3 }),
    piece(ellipse(x, y, r, r * 0.9), col, { edge: 'cut' }),
    piece(ellipse(x, y - r * 0.7, r * 0.7, r * 0.22), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
  ];
  const ribbon = (x: number, y: number, col: string, len: number, sway: number): Node =>
    piece(poly([[x - 4, y], [x + 4, y], [x + 4 + sway, y + len], [x + sway, y + len - 8], [x - 4 + sway, y + len]]), col, { edge: 'cut', fibre: false });
  return [
    // the sack itself, lumpy, wider than his shoulders and rising behind his head
    piece(curve([[8, 340], [4, 262], [26, 196], [78, 150], [150, 128], [226, 150], [276, 196], [298, 262], [292, 340]], 2), SACK),
    piece(curve([[40, 320], [34, 262], [60, 214], [110, 180], [150, 172], [100, 232], [84, 300]], 2), SACK_DARK, { edge: 'torn', fibre: false, shadow: false, opacity: 0.45 }),
    // a rope tying the neck of the sack, and a patch
    ink([[84, 158], [150, 146], [216, 158]], { width: 5, color: C.brownDark, wobble: 0.6 }),
    piece(poly([[236, 214], [268, 210], [270, 244], [238, 248]]), C.ochre, { edge: 'cut', fibre: false, shadow: false }),
    ink([[240, 216], [266, 214], [267, 242], [241, 245], [240, 216]], { width: 1.6, color: C.brownDark, wobble: 0 }),
    // pots and pans on strings
    ...pot(30, 262, 22, C.steel),
    ...pot(268, 300, 20, C.brass),
    ...pot(262, 238, 14, C.steelDark),
    // a ladle sticking out at the left
    piece(band([[24, 204], [10, 134]], 7), C.wood, { edge: 'cut', fibre: false }),
    piece(ellipse(8, 124, 15, 11, 20), C.steel, { edge: 'cut' }),
    // a little lantern hanging on the right
    ink([[286, 190], [286, 210]], { width: 2, color: C.brownDark }),
    piece(poly([[274, 210], [298, 210], [296, 238], [276, 238]]), C.brass, { edge: 'cut' }),
    piece(poly([[279, 214], [293, 214], [292, 234], [280, 234]]), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    // bunches of ribbons
    ribbon(60, 330, C.raspberry, 28, -4),
    ribbon(72, 330, C.yellow, 36, 6),
    ribbon(84, 330, C.blue, 24, -2),
    ribbon(214, 330, C.green, 30, 4),
    ribbon(226, 330, C.coatRed, 24, -6),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const shout = mood === 'shout';
  const grab = mood === 'grab';
  const flop = mood === 'flop';

  // --- the eyes: narrow and sly; wide and greedy when he grabs; swirls when dizzy
  const eye = (x: number, side: number): Node[] => {
    if (flop) return [piece(circle(x, EY, 12), C.white, FLAT), swirl(x, EY, 10, side)];
    if (grab) {
      return [
        piece(circle(x, EY, 11), C.white, FLAT),
        piece(circle(x + side * -1.5, EY + 1, 6), '#a8c43a', { edge: 'clean', shadow: false }),
        piece(circle(x + side * -1.5, EY + 1, 3), C.ink, { edge: 'clean', shadow: false }),
        dot(x - 3, EY - 3, 1.8, C.white),
      ];
    }
    return [
      piece(curve([[x - 14, EY + 1], [x, EY - 7], [x + 14, EY + 1], [x, EY + 6]], 2), C.white, FLAT),
      piece(circle(x + side * -1.5, EY, 4.8), '#a8c43a', { edge: 'clean', shadow: false }),
      piece(ellipse(x + side * -1.5, EY, 1.8, 4.2), C.ink, { edge: 'clean', shadow: false }),
      ink([[x - 15, EY + 1], [x, EY - 7.5], [x + 15, EY]], { width: 3.4, color: C.ink }),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(ellipse(x, EY, 15, 13), SKIN, FLAT),
    ink([[x - 12, EY + 1], [x, EY + 6], [x + 12, EY + 1]], { width: 2.8, color: C.ink }),
  ];

  // --- brows: slanted and sly; shot up when he grabs; crooked when dizzy
  const browSide = (s: number): Node => {
    const x = cx + s * EX;
    const y = EY - 20;
    const inner = shout ? 12 : grab ? -2 : flop ? -4 : 8;
    const outer = shout ? -6 : grab ? -10 : flop ? 4 : -4;
    return ink([[x + s * 18, y + outer], [x, y + (inner + outer) / 2 - 2], [x - s * 14, y + inner]], { width: 5.4, color: '#4b5a2e' });
  };

  // --- the mouth
  const mouthShut: Node[] = shout
    ? [piece(curve([[cx - 24, MY - 8], [cx + 24, MY - 8], [cx + 18, MY + 22], [cx - 18, MY + 22]], 2), C.redDark, FLAT)]
    : grab
      ? [
          piece(curve([[cx - 26, MY - 8], [cx + 26, MY - 8], [cx + 14, MY + 10], [cx - 14, MY + 10]], 2), C.redDark, FLAT),
          piece(curve([[cx - 18, MY - 7], [cx + 18, MY - 7], [cx + 14, MY - 1], [cx - 14, MY - 1]], 1), C.white, { edge: 'clean', shadow: false }),
        ]
      : flop
        ? [ink([[cx - 16, MY + 4], [cx - 8, MY - 4], [cx, MY + 5], [cx + 8, MY - 4], [cx + 16, MY + 4]], { width: 3.6, color: C.redDark })]
        : [ink([[cx - 18, MY + 2], [cx - 4, MY + 4], [cx + 8, MY], [cx + 20, MY - 8]], { width: 3.8, color: C.redDark })];
  const mouthTalk: Node[] = [
    piece(curve([[cx - 20, MY - 6], [cx + 20, MY - 6], [cx + 14, MY + 16], [cx - 14, MY + 16]], 2), C.redDark, FLAT),
    piece(ellipse(cx, MY + 11, 9, 4), C.rose, { edge: 'clean', shadow: false }),
    piece(curve([[cx - 12, MY - 5], [cx + 12, MY - 5], [cx + 9, MY], [cx - 9, MY]], 1), C.white, { edge: 'clean', shadow: false }),
  ];

  // --- the hat, knocked over one ear when he flops
  const T = flop ? turn(-22, cx, cy - 46, -16, 34) : (p: Pt[]): Pt[] => p;
  const hat: Node[] = [
    // crown: tall, crumpled, bent over at the tip
    piece(curve(T([[108, 90], [114, 52], [122, 18], [146, 2], [176, 6], [160, 26], [188, 40], [192, 90]]), 2), HAT),
    piece(curve(T([[128, 60], [134, 28], [146, 14], [152, 40], [146, 70]]), 1), '#3f3324', { ...FLAT, opacity: 0.45 }),
    piece(curve(T([[110, 84], [190, 84], [192, 70], [110, 68]]), 1), HAT_BAND, CUT),
    // brim
    piece(curve(T([[70, 92], [100, 80], [150, 84], [200, 80], [232, 92], [200, 104], [150, 106], [100, 104]]), 2), '#6b5a42'),
    // a patch on the crown and the teal feather
    piece(poly(T([[160, 42], [180, 46], [178, 62], [158, 60]])), C.ochre, FLAT),
    piece(curve(T([[182, 78], [206, 56], [236, 22], [252, 4], [250, 32], [232, 58], [200, 82]]), 2), FEATHER),
    ink(T([[186, 78], [214, 52], [248, 10]]), { width: 2.2, color: C.greenDeep, wobble: 0.2 }),
  ];

  // --- arms
  const handSleeve = { sleeve: COAT, cuff: COAT_DARK, hand: SKIN, width: 30 };
  const armL: Node = flop
    ? arm('armL', { from: [64, 272], via: [34, 296], to: [14, 338], ...handSleeve })
    : grab
      ? arm('armL', { from: [64, 272], via: [76, 318], to: [118, 304], ...handSleeve })
      : arm('armL', { from: [64, 272], via: [48, 306], to: [54, 338], ...handSleeve });
  const armR: Node = flop
    ? arm('armR', { from: [236, 272], via: [266, 296], to: [286, 338], ...handSleeve })
    : shout
      ? arm('armR', { from: [236, 272], via: [270, 238], to: [226, 188], ...handSleeve })
      : grab
        ? arm('armR', { from: [236, 272], via: [224, 318], to: [182, 304], ...handSleeve })
        : arm('armR', { from: [236, 272], via: [252, 306], to: [246, 338], ...handSleeve });

  return person({
    name,
    label,
    skin: SKIN,
    face: [FACE_RX, FACE_RY],
    ears: false,
    neck: SKIN_DARK,
    eyes: 'none',
    brows: 'none',
    nose: 'none',
    mouth: 'none',
    cheeks: false,
    noTalk: true,
    noBlink: true,
    tilt: flop ? 12 : undefined,
    back: pack(),
    behindHead: [
      // big pointed ears
      piece(poly([[cx - FACE_RX + 6, cy - 6], [cx - FACE_RX - 40, cy - 56], [cx - FACE_RX + 2, cy + 24]]), SKIN),
      piece(poly([[cx + FACE_RX - 6, cy - 6], [cx + FACE_RX + 40, cy - 56], [cx + FACE_RX - 2, cy + 24]]), SKIN),
      piece(poly([[cx - FACE_RX - 2, cy - 8], [cx - FACE_RX - 24, cy - 38], [cx - FACE_RX + 2, cy + 10]]), C.pink, { ...FLAT, opacity: 0.45 }),
      piece(poly([[cx + FACE_RX + 2, cy - 8], [cx + FACE_RX + 24, cy - 38], [cx + FACE_RX - 2, cy + 10]]), C.pink, { ...FLAT, opacity: 0.45 }),
    ],
    body: [
      // patched purple coat with plum lapels, a rust scarf, brass buttons
      torso(COAT, 0, 232),
      piece(poly([[104, 236], [140, 252], [124, 345], [86, 345], [94, 282]]), COAT_DARK, CUT),
      piece(poly([[196, 236], [160, 252], [176, 345], [214, 345], [206, 282]]), COAT_DARK, CUT),
      piece(poly([[52, 300], [88, 296], [92, 330], [56, 334]]), C.ochre, FLAT),
      ink([[54, 302], [86, 298], [90, 328], [58, 332], [54, 302]], { width: 1.6, color: C.brownDark, wobble: 0 }),
      piece(poly([[206, 310], [240, 304], [244, 338], [210, 342]]), C.green, FLAT),
      ink([[208, 312], [238, 306], [242, 336], [212, 340], [208, 312]], { width: 1.6, color: C.cream, wobble: 0, opacity: 0.8 }),
      ...[272, 298, 324].map((y) => dot(150, y, 4.5, C.brass)),
      piece(curve([[110, 222], [150, 244], [190, 222], [196, 244], [150, 266], [104, 244]], 2), HAT_BAND, CUT),
      piece(poly([[158, 250], [180, 252], [188, 292], [170, 296]]), HAT_BAND, CUT),
    ],
    front: [
      // the long hooked nose, and a goatee
      piece(curve([[cx - 7, EY + 2], [cx + 8, EY + 14], [cx + 24, cy + 28], [cx + 30, cy + 46], [cx + 16, cy + 42], [cx + 2, cy + 34], [cx - 10, cy + 30]], 1.5), NOSE, CUT),
      ink([[cx + 2, cy + 34], [cx + 16, cy + 42]], { width: 2, color: SKIN_DARK }),
      piece(poly([[cx - 12, MY + 18], [cx + 12, MY + 18], [cx + 4, MY + 52], [cx, MY + 62], [cx - 6, MY + 50]]), '#4b5a2e', CUT),
      // a few warts for good measure
      dot(cx - 30, cy + 30, 3, SKIN_DARK),
      dot(cx - 22, cy + 38, 2.2, SKIN_DARK),
      group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX, -1), ...eye(cx + EX, 1)]),
      group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
      group({ part: 'brows', origin: [cx, EY - 20] }, [browSide(-1), browSide(1)]),
      group({ part: 'mouth', origin: [cx, MY] }, mouthShut),
      group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, shout || grab ? mouthShut : mouthTalk),
    ],
    hat,
    arms: [armL, armR],
    extra: grab
      ? [
          // his money bag, hugged tight to his chest
          piece(curve([[110, 304], [116, 276], [138, 268], [162, 268], [184, 276], [190, 304], [178, 332], [150, 340], [122, 332]], 2), C.brownDark, CUT),
          piece(curve([[134, 270], [150, 252], [166, 270], [150, 276]], 1), C.brownDark, CUT),
          ink([[134, 274], [166, 274]], { width: 4, color: C.goldLight, wobble: 0.3 }),
          piece(circle(150, 306, 15), C.gold, CUT),
          ink([[144, 306], [150, 298], [150, 314]], { width: 2.6, color: C.brassDark }),
          // the hands over its edges
          piece(circle(118, 304, 14), SKIN, CUT),
          piece(circle(182, 304, 14), SKIN, CUT),
        ]
      : [],
  });
}

/** Old Slyboots, sly: narrow eyes, a crooked smile, hands at his sides. */
export const slyboots = cached((): string => draw('sly', 'wishing-slyboots', 'Old Slyboots'));

/** His market call: one hand cupped to his mouth, mouth wide, brows up. */
export const slybootsShout = cached((): string => draw('shout', 'wishing-slyboots-shout', 'Old Slyboots shouting'));

/** "MINE!": clutching his money bag, eyes wide and greedy. */
export const slybootsGrab = cached((): string => draw('grab', 'wishing-slyboots-grab', 'Old Slyboots clutching his money bag'));

/** Sat down in a heap: swirly eyes, hat over one ear, arms flung out. */
export const slybootsFlop = cached((): string => draw('flop', 'wishing-slyboots-flop', 'Old Slyboots in a heap'));
