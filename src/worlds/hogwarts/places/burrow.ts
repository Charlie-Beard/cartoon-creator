/** From Wizard Words, b2c2 (burrow). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const HOUSE: Array<[string, Pt[]]> = [
  ['#c49a74', [[60, 410], [330, 402], [334, 568], [56, 570]]],
  ['#b5886a', [[78, 300], [318, 306], [326, 410], [70, 410]]],
  ['#cfae88', [[100, 210], [300, 202], [306, 304], [94, 306]]],
  ['#bd9372', [[126, 130], [282, 136], [290, 206], [120, 212]]],
  ['#c9a684', [[150, 64], [252, 58], [258, 134], [146, 136]]],
];

/** The strips of roof between the floors. */
const EAVES: Pt[][] = [
  [[54, 402], [338, 396], [338, 412], [54, 416]],
  [[70, 298], [326, 302], [326, 314], [70, 310]],
  [[92, 202], [308, 196], [308, 208], [92, 214]],
  [[118, 128], [290, 132], [290, 142], [118, 140]],
];

/** A little window: wooden frame, glass and a cross of glazing bars. */
function win(x: number, y: number, w: number, hh: number, glass: string): Node[] {
  return [
    piece(rect(x - 5, y - 5, w + 10, hh + 10, 3), C.wood, { edge: 'cut' }),
    piece(rect(x, y, w, hh, 2), glass, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x + w / 2, y + 2], [x + w / 2, y + hh - 2]], { width: 3, color: C.brownDark }),
    ink([[x + 2, y + hh / 2], [x + w - 2, y + hh / 2]], { width: 3, color: C.brownDark }),
  ];
}

/** A flower: stalk and a little torn-paper head. */
const flower = (x: number, y: number, color: string, r = 9): Node[] => [
  ink([[x, y + 30], [x + 2, y + 14], [x, y]], { width: 3, color: C.greenDark }),
  piece(circle(x, y, r), color, { edge: 'cut' }),
  piece(circle(x, y, r * 0.38), C.goldLight, { edge: 'clean', shadow: false }),
];

/** The Burrow and its overgrown garden on a soft summer day (1180 × 820). */
export function burrow(): string {
  const r = rng(22);
  const glass = '#d7e4ea';
  // Rolling ground: pale far hills, then the big garden lawn.
  const hill = (y: number, amp: number, color: string, seed: number): Node => {
    const rr = rng(seed);
    const pts: Pt[] = [[-40, 900]];
    for (let x = -40; x <= 1220; x += 110) pts.push([x, y - rr() * amp]);
    pts.push([1220, 900]);
    return piece(curve(pts, 2), color, { rough: 1.3 });
  };
  const weeds: Node[] = [];
  for (let i = 0; i < 14; i++) {
    const x = 350 + r() * 300;
    const y = 520 + r() * 60;
    weeds.push(ink([[x, y + 40], [x + (r() - 0.5) * 20, y]], { width: 4, color: i % 2 ? C.greenDark : '#55804a' }));
  }
  return svg({ w: 1180, h: 820, name: 'b2c2-burrow', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.sky, { edge: 'clean', shadow: false }),
    // soft clouds
    ...[[760, 110, 1], [1010, 70, 0.8], [560, 60, 0.6]].flatMap(([x, y, s]) => [
      piece(ellipse(x, y, 90 * s, 26 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.85 }),
      piece(ellipse(x - 30 * s, y - 16 * s, 44 * s, 26 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.85 }),
      piece(ellipse(x + 26 * s, y - 20 * s, 50 * s, 30 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.85 }),
    ]),
    hill(372, 44, '#bccdb4', 3),
    hill(410, 50, '#9cb685', 5),
    hill(470, 30, C.green, 9),
    // a winding path from the door
    piece(curve([[262, 570], [312, 568], [360, 640], [420, 760], [420, 860], [250, 860], [280, 720], [256, 620]], 2), C.sand, { rough: 1.2 }),

    // ---- the Burrow: rooms stacked any old how
    piece(curve([[214, 52], [196, 30], [214, 8], [236, 20], [246, 0], [268, 18], [262, 46]], 2), C.white, { shadow: false, opacity: 0.7 }),
    piece(rect(228, 30, 22, 46), C.brown, { rough: 0.8 }),
    piece(rect(112, 98, 18, 44), C.stone, { rough: 0.8 }),
    piece(rect(350, 268, 16, 40), C.brown, { rough: 0.8 }),
    piece(poly([[318, 320], [374, 316], [378, 394], [318, 398]]), '#c7a383', { rough: 0.8 }),
    piece(poly([[310, 326], [346, 292], [386, 322]]), C.redDark, { rough: 0.8 }),
    piece(poly([[22, 252], [104, 246], [104, 330], [26, 334]]), '#a98468', { rough: 0.8 }),
    piece(poly([[12, 258], [60, 214], [114, 252]]), C.redDark, { rough: 0.8 }),
    ...HOUSE.map(([c, pts]) => piece(poly(pts), c, { rough: 0.8 })),
    // eaves between the floors
    ...EAVES.map((pts) => piece(poly(pts), C.rust, { edge: 'cut', fibre: false })),
    piece(poly([[132, 72], [206, 6], [274, 64]]), C.rust, { rough: 0.8 }),
    // windows (the big kitchen one glows warm)
    ...win(104, 429, 132, 82, C.candle),
    ...win(108, 330, 48, 48, glass),
    ...win(232, 334, 46, 46, glass),
    ...win(138, 232, 42, 44, glass),
    ...win(238, 226, 38, 44, glass),
    ...win(182, 152, 40, 38, glass),
    ...win(188, 82, 28, 32, glass),
    ...win(46, 272, 34, 34, glass),
    ...win(334, 340, 26, 30, glass),
    // the back door
    piece(rect(262, 468, 52, 102, 10), C.brownDark, { rough: 0.8 }),
    piece(circle(302, 522, 5), C.gold, { edge: 'clean', shadow: false }),
    // the garden: weeds and flowers growing everywhere
    ...weeds,
    ...flower(48, 548, C.pink),
    ...flower(84, 560, C.yellow, 8),
    ...flower(380, 540, C.rose),
    ...flower(560, 520, C.yellow),
    ...flower(1120, 470, C.pink, 8),

    // ---- the fish pond (its front half is an actor, so things can sit in it)
    ...[[818, 590], [850, 556], [905, 540], [970, 534], [1035, 538], [1095, 552], [1142, 584]].map(([x, y], i) =>
      piece(ellipse(x, y, 22, 13, i * 17), i % 2 ? C.stoneLight : C.stone, { rough: 0.8 }),
    ),
    piece(ellipse(980, 600, 175, 58), C.blue, { rough: 0.7 }),
    piece(ellipse(860, 580, 22, 9), C.greenDark, { edge: 'cut', fibre: false }),
    piece(ellipse(1100, 592, 18, 7), C.greenDark, { edge: 'cut', fibre: false }),
  ]);
}
