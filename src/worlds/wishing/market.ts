/**
 * The Goblin Market: a market in a wood clearing at dusk. A purple-and-gold
 * evening sky behind dark trees, packed earth underfoot, and a striped stall
 * at each side (the left one with pots, hats and jars, the right one with
 * cakes, jars and bottles), lanterns and bunting strung across the top, and
 * toadstools along the edges. Warm, a little shady and mysterious, never
 * dark: the lanterns glow.
 *
 * Ground line y 640. The open ground is x 280-900 (the stalls fill x 0-280
 * and x 900-1180); everything high up (lanterns, bunting, tree tops) is above
 * y 330. The bottom band (y 690-820) is plain earth. No people, no chair.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../art/paper';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** A tall dark fir-ish tree standing far back, a flat silhouette. */
function farTree(x: number, base: number, h: number, col: string): Node[] {
  const w = h * 0.34;
  return [
    piece(rect(x - 5, base - h * 0.2, 10, h * 0.2), C.barkDark, flat),
    piece(poly([[x - w, base - h * 0.16], [x, base - h * 0.62], [x + w, base - h * 0.16]]), col, { ...flat, edge: 'torn', rough: 0.8 }),
    piece(poly([[x - w * 0.8, base - h * 0.44], [x, base - h * 0.84], [x + w * 0.8, base - h * 0.44]]), col, { ...flat, edge: 'torn', rough: 0.8 }),
    piece(poly([[x - w * 0.55, base - h * 0.7], [x, base - h], [x + w * 0.55, base - h * 0.7]]), col, { ...flat, edge: 'torn', rough: 0.8 }),
  ];
}

/** A striped awning: alternating stripes with a scalloped lower edge. */
function awning(x: number, y: number, w: number, h: number, a: string, b: string): Node[] {
  const n = 6;
  const sw = w / n;
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = x + i * sw;
    // a slightly slanted roof: stripes get a touch shorter toward the front
    out.push(piece(poly([[x0 + 4, y], [x0 + sw + 4, y], [x0 + sw, y + h], [x0, y + h]]), i % 2 ? b : a, { edge: 'cut', fibre: false, shadow: i === 0 }));
    out.push(piece(poly([[x0, y + h - 2], [x0 + sw, y + h - 2], [x0 + sw / 2, y + h + 20]]), i % 2 ? b : a, flat));
  }
  return out;
}

/** A jar with a lid and a coloured sweet inside. */
const jar = (x: number, base: number, col: string): Node[] => [
  piece(rect(x - 14, base - 44, 28, 44, 6), C.glass, { ...flat, shadow: true, opacity: 0.9 }),
  piece(rect(x - 11, base - 30, 22, 28, 4), col, flat),
  piece(rect(x - 12, base - 52, 24, 9, 2), C.brass, flat),
];

/** A round pot with a handle. */
const pot = (x: number, base: number, r: number, col: string): Node[] => [
  piece(ellipse(x, base - r, r, r * 0.9), col, { edge: 'cut' }),
  piece(ellipse(x, base - r * 1.7, r * 0.7, r * 0.2), C.charcoal, flat),
  ink([[x - r, base - r * 1.2], [x - r - 8, base - r * 0.9], [x - r, base - r * 0.6]], { width: 3, color: col === C.steel ? C.steelDark : C.brownDark }),
];

/** A cake with icing and a cherry. */
const cake = (x: number, base: number, w: number, col: string): Node[] => [
  piece(rect(x - w / 2, base - 30, w, 30, 4), C.honey, { edge: 'cut' }),
  piece(curve([[x - w / 2 - 2, base - 30], [x - w / 4, base - 40], [x + w / 4, base - 36], [x + w / 2 + 2, base - 30], [x + w / 4, base - 24], [x - w / 4, base - 26]], 1.5), col, flat),
  piece(circle(x, base - 42, 5), C.cherry, flat),
];

/** A tall hat on a peg. */
const hat = (x: number, y: number, col: string): Node[] => [
  piece(poly([[x - 14, y + 34], [x - 10, y + 6], [x, y - 22], [x + 10, y + 6], [x + 14, y + 34]]), col, { edge: 'cut' }),
  piece(ellipse(x, y + 36, 24, 6), col, { edge: 'cut' }),
];

/** A lantern hanging from a string, with its own soft glow painted round it. */
function lantern(x: number, y: number, col: string): Node[] {
  return [
    ink([[x, y - 26], [x, y]], { width: 2, color: C.brownDark, opacity: 0.8 }),
    piece(circle(x, y + 22, 36), C.candle, { ...flat, opacity: 0.2 }),
    piece(poly([[x - 12, y + 2], [x + 12, y + 2], [x + 15, y + 36], [x - 15, y + 36]]), col, { edge: 'cut' }),
    piece(poly([[x - 7, y + 8], [x + 7, y + 8], [x + 9, y + 32], [x - 9, y + 32]]), C.candle, flat),
    piece(rect(x - 14, y - 2, 28, 7, 2), C.brownDark, flat),
  ];
}

/** A toadstool: red cap, white dots, pale stalk. */
function toadstool(x: number, base: number, s: number): Node[] {
  return [
    piece(poly([[x - 7 * s, base], [x - 5 * s, base - 22 * s], [x + 5 * s, base - 22 * s], [x + 7 * s, base]]), C.cream, { edge: 'cut', fibre: false }),
    piece(curve([[x - 22 * s, base - 20 * s], [x - 16 * s, base - 36 * s], [x, base - 44 * s], [x + 16 * s, base - 36 * s], [x + 22 * s, base - 20 * s], [x, base - 16 * s]], 2), C.toadRed, { edge: 'cut', fibre: false }),
    dot(x - 8 * s, base - 30 * s, 3.4 * s, C.white),
    dot(x + 7 * s, base - 34 * s, 2.6 * s, C.white),
    dot(x + 12 * s, base - 25 * s, 2.2 * s, C.white),
  ];
}

export const goblinMarket = cached(() => {
  const r = rng(808);
  return svg({ w: 1180, h: 820, name: 'wishing-goblin-market', className: 'backdrop' }, [
    // Dusk sky in soft torn bands: purple overhead, rose, then gold at the treeline.
    piece(rect(-20, -20, 1220, 860), '#4f3f72', { edge: 'clean', shadow: false }),
    piece(rect(-20, 120, 1220, 320), '#7d5a86', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 230, 1220, 240), '#b8738a', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 330, 1220, 200), C.dusk, { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.9 }),
    piece(ellipse(590, 430, 280, 40), C.duskSky, { ...flat, opacity: 0.7 }),
    // a few early stars and a thin cloud
    ...[[160, 60], [330, 100], [560, 40], [760, 84], [940, 52], [1090, 110]].map(([x, y]) => dot(x, y, 2.4, C.goldLight, 0.8)),
    piece(ellipse(760, 250, 150, 10), '#d79aa4', { ...flat, opacity: 0.55 }),

    // Far trees: a ragged dark line, then nearer, bigger ones.
    ...[60, 150, 250, 350, 450, 540, 640, 740, 830, 930, 1030, 1120].flatMap((x, i) => farTree(x + (r() - 0.5) * 30, 470, 190 + (i % 4) * 36, i % 2 ? '#3a4a52' : '#35473f')),
    // A low far hedge of gloom between the trees and the ground.
    piece(rect(-20, 440, 1220, 60), '#2c3a38', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    // Tiny far lights between the trees (other stalls).
    ...[[420, 452], [520, 458], [660, 454], [770, 460]].map(([x, y]) => piece(circle(x, y, 7), C.candle, { ...flat, opacity: 0.55 })),

    // Packed earth and a worn, paler path down the middle.
    piece(rect(-20, 480, 1220, 360), '#6a5a42', { edge: 'torn', rough: 1.6, shadow: false, fibre: false }),
    piece(poly([[260, 500], [920, 500], [1090, 840], [90, 840]]), '#8a7650', { edge: 'torn', rough: 1.6, shadow: false, fibre: false, opacity: 0.55 }),
    ...[[330, 560], [470, 600], [620, 570], [760, 612], [880, 560], [550, 540]].map(([x, y]) => piece(ellipse(x, y, 22 + r() * 14, 5), '#5a4a34', { ...flat, opacity: 0.4 })),

    // ----- The left stall: pots, hats and jars.
    piece(rect(30, 190, 12, 460, 2), C.barkDark, { edge: 'cut' }),
    piece(rect(246, 190, 12, 460, 2), C.barkDark, { edge: 'cut' }),
    piece(rect(40, 300, 210, 120), '#3e2f2c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...awning(14, 176, 260, 98, C.coatRed, C.cream),
    // shelf of jars and a row of hats on pegs
    piece(rect(48, 372, 196, 10, 2), C.brown, { edge: 'cut' }),
    ...jar(74, 372, C.coatRed),
    ...jar(112, 372, C.lemon),
    ...jar(150, 372, C.mint),
    ...jar(188, 372, C.raspberry),
    ...jar(224, 372, C.lilac),
    ...hat(72, 308, C.blue),
    ...hat(124, 312, C.green),
    ...hat(176, 308, C.violet),
    ...hat(226, 312, C.ochre),
    // counter with a cloth, and pots on it
    piece(rect(26, 470, 238, 14, 3), C.brown, { edge: 'cut' }),
    piece(poly([[30, 484], [260, 484], [268, 640], [24, 640]]), C.teal, { edge: 'cut' }),
    ...[0, 1, 2, 3, 4, 5].map((i) => piece(poly([[34 + i * 40, 484], [54 + i * 40, 484], [56 + i * 40, 640], [38 + i * 40, 640]]), C.cream, { ...flat, opacity: 0.35 })),
    ...pot(70, 470, 24, C.steel),
    ...pot(130, 470, 20, C.brass),
    ...pot(188, 470, 26, C.rust),
    ...pot(240, 470, 16, C.steelDark),

    // ----- The right stall: cakes, jars and bottles.
    piece(rect(928, 190, 12, 460, 2), C.barkDark, { edge: 'cut' }),
    piece(rect(1148, 190, 12, 460, 2), C.barkDark, { edge: 'cut' }),
    piece(rect(940, 300, 210, 120), '#3e2f2c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...awning(906, 176, 270, 98, C.violet, C.sand),
    piece(rect(944, 372, 200, 10, 2), C.brown, { edge: 'cut' }),
    ...jar(972, 372, C.lemon),
    ...jar(1010, 372, C.coatRed),
    ...jar(1048, 372, C.mint),
    ...[1090, 1122].flatMap((x, i) => [
      piece(poly([[x - 11, 372], [x - 11, 336], [x - 5, 326], [x - 5, 312], [x + 5, 312], [x + 5, 326], [x + 11, 336], [x + 11, 372]]), i ? C.blue : C.green, { edge: 'cut', opacity: 0.95 }),
      piece(rect(x - 6, 306, 12, 8, 2), C.brass, flat),
    ]),
    // a hanging string of sausages-and-onions style garlic bunches
    ...[966, 1038, 1110].flatMap((x) => [
      ink([[x, 276], [x, 302]], { width: 2.4, color: C.brownDark }),
      piece(circle(x, 312, 11), C.cream, { edge: 'cut' }),
      piece(circle(x - 8, 326, 9), C.cream, { edge: 'cut' }),
      piece(circle(x + 8, 328, 9), C.sand, { edge: 'cut' }),
    ]),
    piece(rect(926, 470, 238, 14, 3), C.brown, { edge: 'cut' }),
    piece(poly([[930, 484], [1160, 484], [1166, 640], [924, 640]]), C.plum, { edge: 'cut' }),
    ...[0, 1, 2, 3, 4, 5].map((i) => piece(poly([[934 + i * 40, 484], [954 + i * 40, 484], [956 + i * 40, 640], [938 + i * 40, 640]]), C.goldLight, { ...flat, opacity: 0.22 })),
    ...cake(962, 470, 56, C.raspberry),
    ...cake(1036, 470, 64, C.cream),
    ...cake(1106, 470, 50, C.mint),

    // ----- Lanterns and bunting strung across the clearing.
    ink([[-20, 96], [260, 150], [590, 176], [920, 150], [1200, 96]], { width: 3, color: C.brownDark, opacity: 0.75 }),
    ...[[120, 122], [250, 148], [420, 166], [590, 174], [760, 166], [930, 148], [1060, 122]].flatMap(([x, y], i) => lantern(x, y, i % 2 ? C.rust : C.coatRed)),
    ink([[-20, 40], [300, 96], [590, 118], [880, 96], [1200, 40]], { width: 2.4, color: C.brownDark, opacity: 0.6 }),
    ...[60, 140, 220, 300, 380, 460, 540, 620, 700, 780, 860, 940, 1020, 1100].map((x, i) => {
      const t = x / 1180;
      const y = 40 + 78 * (1 - Math.pow(2 * t - 1, 2)) * 0.9 + 6;
      return piece(poly([[x - 15, y], [x + 15, y], [x, y + 32]]), [C.toyYellow, C.toyBlue, C.raspberry, C.mint][i % 4], { ...flat, shadow: true });
    }),

    // ----- Toadstools along the edges of the open ground.
    ...toadstool(300, 650, 1.1),
    ...toadstool(334, 660, 0.7),
    ...toadstool(884, 656, 1.0),
    ...toadstool(920, 664, 0.65),
    ...toadstool(40, 690, 0.8),
    ...toadstool(1140, 690, 0.8),
  ]);
});
