/**
 * The bears' bigger people: Captain Bear, Uncle Sailor Bill, Bully Bear, and
 * Goldilocks (the one human, drawn here by a small builder of her own in the
 * same watercolour and ink).
 *
 * Captain Bear is the old sea captain who judges the sand-castles: white cap
 * with a black peak, round spectacles, a thick cream roll-neck. Uncle Bill is
 * the jolly one: a round white sailor's cap (no peak), a striped jersey and an
 * open red waistcoat. Bully Bear is a bigger cub in the blue-and-white stripes,
 * drawn chunkier with a jumper that fills out past the shoulders.
 */
import { circle, curve, dot, ellipse, group, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';
import { bandOutline, bear, FUR, top, type BearOpts } from './parts';

const CREAM = '#f1e9d6';
const WHITE = '#f6f1e6';
const NAVY = '#2f4670';
const RED = '#c8433a';
const BLUE = '#7c9fd0';
const GOLD = '#e0b13c';

// ------------------------------------------------------------- Captain Bear

const captainBase = (): BearOpts => {
  const lens = (x: number): Node[] => [blot(circle(x, 118, 13), '#cfe3f2', 0.5), pen(circle(x, 118, 15), { closed: true, width: 2.2, color: '#5a4636', breaks: 0.1 })];
  return {
    name: 'captain-bear',
    label: 'Captain Bear',
    fur: FUR.toffee,
    snout: 1.2,
    sleeve: CREAM,
    cuff: '#e0d4b8',
    clothes: [
      ...top(CREAM),
      // knit: little rows of stitches down the jumper and the rolled collar
      ...[0, 1, 2, 3, 4, 5].flatMap((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => pen([[96 + c * 18 + (r % 2) * 9, 232 + r * 14], [100 + c * 18 + (r % 2) * 9, 244 + r * 14]], { width: 1.3, color: '#b9aa88', opacity: 0.85, breaks: 0, taper: false })),
      ),
      // the roll-neck: a thick band round the throat
      wash(curve([[102, 184], [150, 176], [198, 184], [204, 206], [150, 216], [96, 206]], 2), '#f7f0de', { lineWidth: 2.2, depth: 0.2 }),
      pen([[104, 196], [150, 205], [196, 196]], { width: 1.6, opacity: 0.7 }),
      // grey check trousers show a little at the hem
      wash(curve([[84, 300], [150, 310], [216, 300], [214, 318], [150, 322], [86, 318]], 1), '#9aa0a8', { depth: 0.2, bloom: false }),
    ],
    onFace: [...lens(hx(-30)), ...lens(hx(30)), pen([[hx(-15), 116], [150, 112], [hx(15), 116]], { width: 2, color: '#5a4636' }), pen([[hx(-45), 116], [hx(-70), 108]], { width: 2, color: '#5a4636' }), pen([[hx(45), 116], [hx(70), 108]], { width: 2, color: '#5a4636' })],
    hat: [
      // crown
      wash(curve([[96, 66], [102, 34], [150, 22], [198, 34], [204, 66], [150, 62]], 2), WHITE, { depth: 0.2, lineWidth: 2.2 }),
      // black band and peak
      wash(curve([[96, 56], [150, 62], [204, 56], [206, 72], [150, 78], [94, 72]], 1), '#2c2a30', { lineWidth: 2, bloom: false }),
      wash(ellipse(150, 82, 62, 12), '#1f1d22', { lineWidth: 2, depth: 0.15 }),
      // gold badge
      wash(circle(150, 48, 9), GOLD, { lineWidth: 1.8, bloom: false }),
      pen([[150, 42], [150, 54]], { width: 1.6, breaks: 0 }),
      pen([[145, 46], [155, 46]], { width: 1.6, breaks: 0 }),
      dot(124, 56, 3, GOLD),
      dot(176, 56, 3, GOLD),
    ],
  };
};
/** Absolute x of a spectacle feature, relative to the face's middle (150). */
function hx(dx: number): number {
  return 150 + dx;
}

export const captainBear = (): string => bear(captainBase());
const captainRoar = (): string => bear({ ...captainBase(), name: 'captain-bear-roar', arms: 'up', brows: 'cross', mouth: 'o', tilt: -3 });
const captainPoint = (): string => bear({ ...captainBase(), name: 'captain-bear-point', arms: 'point', brows: 'cross', mouth: 'o', tilt: 5 });
const captainHappy = (): string => bear({ ...captainBase(), name: 'captain-bear-happy', arms: 'hips', eyes: 'happy', mouth: 'grin', brows: 'kind' });

// ------------------------------------------------------------- Uncle Bill

/** Open red waistcoat over a striped jersey. */
function sailorTop(): Node[] {
  return [
    ...top(WHITE, { stripes: { color: NAVY, at: [214, 238, 262, 286, 310], width: 11 }, collar: undefined }),
    wash(curve([[104, 188], [122, 194], [118, 316], [78, 306], [68, 270], [78, 222]], 2), RED, { depth: 0.22 }),
    wash(curve([[196, 188], [178, 194], [182, 316], [222, 306], [232, 270], [222, 222]], 2), RED, { depth: 0.22 }),
    ...[250, 280].map((y) => dot(112, y, 3.4, GOLD)),
    // a red scarf knot at the neck
    wash(curve([[132, 190], [168, 190], [160, 210], [140, 210]], 2), '#d86a3a', { lineWidth: 2, bloom: false }),
  ];
}

const billBase = (): BearOpts => ({
  name: 'uncle-bill',
  label: 'Uncle Sailor Bill',
  fur: FUR.golden,
  snout: 1.1,
  sleeve: WHITE,
  cuff: NAVY,
  clothes: sailorTop(),
  hat: [
    // round white cap, a turned-up navy band, a small anchor on the front
    wash(curve([[104, 62], [108, 32], [150, 20], [192, 32], [196, 62], [150, 58]], 2), WHITE, { depth: 0.22, lineWidth: 2.2 }),
    wash(curve([[98, 58], [150, 64], [202, 58], [204, 76], [150, 82], [96, 76]], 1), NAVY, { lineWidth: 2, bloom: false }),
    pen([[150, 30], [150, 52]], { width: 2.2, color: NAVY, breaks: 0 }),
    pen([[142, 36], [158, 36]], { width: 2, color: NAVY, breaks: 0 }),
    pen([[140, 46], [150, 54], [160, 46]], { width: 2, color: NAVY, breaks: 0 }),
    dot(150, 28, 3, NAVY),
  ],
});

export const uncleBill = (): string => bear(billBase());
const uncleBillWave = (): string => bear({ ...billBase(), name: 'uncle-bill-wave', arms: 'wave', mouth: 'grin' });
const uncleBillLaugh = (): string => bear({ ...billBase(), name: 'uncle-bill-laugh', eyes: 'happy', mouth: 'grin', tilt: 8, arms: 'hips' });

// ------------------------------------------------------------- Bully Bear

/** Chunky: the jumper fills out past the cub's usual shoulders. */
const BULKY: Pt[] = curve([[88, 186], [150, 180], [212, 186], [246, 218], [256, 270], [242, 308], [150, 318], [58, 308], [44, 270], [54, 218]], 2);

function bullyClothes(): Node[] {
  const w = 20;
  return [
    wash(BULKY, WHITE, { depth: 0.22 }),
    clipped(BULKY, [212, 244, 276, 308].map((y) => wash([[30, y - w / 2], [270, y - w / 2 - 4], [270, y + w / 2 - 4], [30, y + w / 2]], '#6f93c6', { line: false, depth: 0.5, wobble: 1.6 }))),
    pen(BULKY, { closed: true, width: 2.2, breaks: 0.6 }),
    wash(curve([[110, 184], [148, 192], [146, 214], [116, 210]], 2), WHITE, { lineWidth: 2, bloom: false, depth: 0.2 }),
    wash(curve([[190, 184], [152, 192], [154, 214], [184, 210]], 2), WHITE, { lineWidth: 2, bloom: false, depth: 0.2 }),
  ];
}

const bullyBase = (): BearOpts => ({
  name: 'bully-bear',
  label: 'Bully Bear',
  fur: FUR.toffee,
  snout: 1.12,
  sleeve: '#e4ebf5',
  cuff: '#6f93c6',
  clothes: bullyClothes(),
  brows: 'cross',
  mouth: 'smirk',
});

const envelope: Node[] = [
  wash(curve([[226, 66], [290, 56], [296, 104], [232, 114]], 1), '#fbf3dc', { lineWidth: 2, depth: 0.18 }),
  pen([[226, 66], [261, 92], [296, 104]], { width: 1.8 }),
  pen([[290, 56], [261, 92], [232, 114]], { width: 1.8 }),
  dot(261, 90, 5, RED),
];

const spade: Node[] = [
  // grip, shaft, and a blade dug into the sand
  pen([[174, 216], [194, 214]], { width: 5, color: '#6a4a2a', breaks: 0, taper: false }),
  wash([[179, 218], [187, 218], [187, 306], [179, 306]], '#b88a52', { lineWidth: 1.8, bloom: false, depth: 0.3, wobble: 0.5 }),
  wash(curve([[164, 304], [202, 304], [200, 334], [183, 342], [166, 334]], 1), '#8f98a3', { lineWidth: 2, depth: 0.3 }),
];

export const bullyBear = (): string => bear(bullyBase());
const bullyGrab = (): string => bear({ ...bullyBase(), name: 'bully-bear-grab', arms: 'wave', holdR: envelope, mouth: 'smirk', tilt: -4 });
const bullyDig = (): string => bear({ ...bullyBase(), name: 'bully-bear-dig', arms: 'hold', holdR: spade, tilt: 3 });
const bullySorry = (): string => bear({ ...bullyBase(), name: 'bully-bear-sorry', arms: 'down', brows: 'worried', mouth: 'frown', tilt: 7 });

// ------------------------------------------------------------- Goldilocks

const SKIN = '#f2c4a6';
const HAIR = '#efbb3a';
const GL = { cx: 150, cy: 126 };

type GirlArms = 'down' | 'wave' | 'peek';

/** One curl of the mop: a scalloped wash with a pen swirl in it. */
function curl(x: number, y: number, r: number, tone = 0): Node[] {
  const c = tone ? deeper(HAIR, tone) : HAIR;
  return [
    wash(ellipse(x, y, r, r * 0.95), c, { depth: 0.3, lineWidth: 1.8, wobble: 1.6 }),
    pen([[x - r * 0.45, y + r * 0.2], [x - r * 0.1, y - r * 0.45], [x + r * 0.45, y - r * 0.1], [x + r * 0.1, y + r * 0.35]], { width: 1.4, color: '#a8761c', opacity: 0.8, breaks: 0 }),
  ];
}

function girlArm(part: 'armL' | 'armR', from: Pt, to: Pt): Node {
  const via: Pt = [(from[0] + to[0]) / 2 + (part === 'armL' ? -5 : 5), (from[1] + to[1]) / 2 + 2];
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const k = 1 - 12 / len;
  const wrist: Pt = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
  const sleeve = bandOutline([from, via, wrist], 30);
  const dots: Node[] = [];
  for (let i = 0; i < 4; i++) dots.push(dot(from[0] + (wrist[0] - from[0]) * (0.15 + i * 0.22) + (i % 2 ? 4 : -4), from[1] + (wrist[1] - from[1]) * (0.15 + i * 0.22), 3.2, WHITE, 0.95));
  return group({ part, origin: from }, [wash(sleeve, BLUE, { depth: 0.25, lineWidth: 2 }), clipped(sleeve, dots), wash(circle(to[0], to[1], 13), SKIN, { lineWidth: 2, depth: 0.25 }), ...[-5, 0, 5].map((d) => pen([[to[0] + d - 1, to[1] + 5], [to[0] + d, to[1] + 11]], { width: 1.2, opacity: 0.6, breaks: 0 }))]);
}

function girl(name: string, arms: GirlArms, o: { tilt?: number; mouth?: 'smile' | 'grin'; lean?: boolean } = {}): string {
  const [x, y] = [GL.cx, GL.cy];
  const shL: Pt = [126, 216];
  const shR: Pt = [174, 216];
  const [toL, toR]: [Pt, Pt] =
    arms === 'wave' ? [[100, 292], [240, 150]] : arms === 'peek' ? [[112, 238], [196, 290]] : [[104, 290], [196, 290]];
  const dressShape = curve([[122, 196], [178, 196], [196, 250], [222, 304], [150, 314], [78, 304], [104, 250]], 2);
  const spots: Node[] = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 8; col++) spots.push(dot(80 + col * 20 + (row % 2) * 10, 208 + row * 18, 4.2, WHITE, 0.95));
  const my = y + 40;
  const eye = (dx: number): Node[] => [dot(x + dx, y - 4, 5.6, '#2a1d17'), dot(x + dx - 2, y - 6.6, 2, '#ffffff')];
  const lid = (dx: number): Node[] => [wash(ellipse(x + dx, y - 4, 10, 10), SKIN, { line: false, shade: false, bloom: false, wobble: 0 }), pen([[x + dx - 8, y - 4], [x + dx, y + 1], [x + dx + 8, y - 4]], { width: 2.4 })];
  const brow = (dx: number, s: number): Node => pen([[x + dx - 9 * s, y - 20], [x + dx, y - 24], [x + dx + 9 * s, y - 21]], { width: 2, color: '#a8761c' });
  const smile: Node[] =
    o.mouth === 'grin'
      ? [wash(curve([[x - 17, my - 4], [x + 17, my - 4], [x + 8, my + 9], [x - 8, my + 9]], 2), '#9a3a2c', { lineWidth: 1.8, shade: false, bloom: false }), blot(ellipse(x, my + 4, 6, 2.6), '#e48a7a', 0.9)]
      : [pen([[x - 14, my - 2], [x - 6, my + 5], [x, my + 1], [x + 6, my + 5], [x + 14, my - 2]], { width: 2.4, color: '#a8382c' })];

  const hairBack: [number, number, number, number?][] = [
    [88, 150, 24], [76, 124, 26], [80, 98, 26, 0.12], [96, 74, 26], [122, 58, 26, 0.1], [150, 52, 26], [178, 58, 26, 0.1], [204, 74, 26],
    [220, 98, 26, 0.12], [224, 124, 26], [212, 150, 24], [80, 178, 20], [220, 178, 20],
  ];
  const fringe: [number, number, number][] = [[112, 92, 15], [134, 88, 15], [156, 88, 15], [178, 92, 15]];
  const bow = (dx: number): Node => wash(curve([[150 + dx * 0.1, 36], [150 + dx * 1.3, 10], [150 + dx * 1.35, 60]], 1), BLUE, { lineWidth: 2, bloom: false });

  const figureNodes: Node[] = [
    blot(ellipse(150, 336, 78, 8), '#6b4a30', 0.22),
    // legs, socks and shoes
    wash(curve([[124, 304], [144, 304], [143, 326], [122, 326]], 1), SKIN, { depth: 0.2, bloom: false }),
    wash(curve([[156, 304], [176, 304], [178, 326], [157, 326]], 1), SKIN, { depth: 0.2, bloom: false }),
    wash(curve([[121, 322], [145, 322], [143, 332], [120, 332]], 1), WHITE, { lineWidth: 1.8, bloom: false }),
    wash(curve([[155, 322], [179, 322], [180, 332], [157, 332]], 1), WHITE, { lineWidth: 1.8, bloom: false }),
    wash(ellipse(126, 334, 20, 7), '#8a4a3a', { lineWidth: 2, bloom: false }),
    wash(ellipse(174, 334, 20, 7), '#8a4a3a', { lineWidth: 2, bloom: false }),
    // the spotted dress with its white collar
    wash(dressShape, BLUE, { depth: 0.24 }),
    clipped(dressShape, spots),
    pen(dressShape, { closed: true, width: 2.2, breaks: 0.6 }),
    wash(curve([[126, 192], [150, 200], [148, 218], [128, 214]], 2), WHITE, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    wash(curve([[174, 192], [150, 200], [152, 218], [172, 214]], 2), WHITE, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), SKIN, { depth: 0.2, bloom: false }),
    girlArm('armL', shL, toL),
    group({ part: 'head', origin: [x, y + 66], transform: o.tilt ? `rotate(${o.tilt} ${x} ${y + 66})` : undefined }, [
      wash(ellipse(x, y + 8, 64, 62), SKIN, { depth: 0.22, lineWidth: 2.2 }),
      blot(ellipse(x - 40, y + 30, 13, 9), '#e57a72', 0.6),
      blot(ellipse(x + 40, y + 30, 13, 9), '#e57a72', 0.6),
      group({ part: 'eyes', origin: [x, y - 4] }, [...eye(-26), ...eye(26)]),
      group({ part: 'lids', opacity: 0 }, [...lid(-26), ...lid(26)]),
      brow(-26, 1),
      brow(26, -1),
      pen([[x - 4, y + 12], [x - 7, y + 20], [x + 1, y + 21]], { width: 1.8, opacity: 0.8, breaks: 0 }),
      group({ part: 'mouth', origin: [x, my] }, smile),
      group({ part: 'mouthOpen', origin: [x, my], opacity: 0 }, [
        wash(curve([[x - 12, my - 3], [x + 12, my - 3], [x + 8, my + 12], [x - 8, my + 12]], 2), '#8a2f26', { lineWidth: 1.8, shade: false, bloom: false }),
        blot(ellipse(x, my + 7, 6, 3), '#e48a7a', 0.95),
      ]),
      // the great mop of curls, with a few over the forehead
      group({ part: 'hair' }, [...hairBack.flatMap(([cx, cy, r, t]) => curl(cx, cy, r, t ?? 0)), ...fringe.flatMap(([cx, cy, r]) => curl(cx, cy, r))]),
      // the blue spotted bow
      bow(-40),
      bow(40),
      wash(ellipse(150, 36, 9, 11), deeper(BLUE, 0.15), { lineWidth: 2, bloom: false, shade: false }),
      ...[[116, 28], [112, 42], [184, 28], [188, 42]].map(([bx, by]) => dot(bx, by, 2.6, WHITE)),
    ]),
    girlArm('armR', shR, toR),
  ];

  if (!o.lean) {
    return svg({ w: 300, h: 340, name, label: 'Goldilocks', className: 'portrait' }, [group({ part: 'figure', origin: [150, 340] }, figureNodes)]);
  }
  // Peeking: she leans out from behind a trunk on the left, so the left of
  // the picture is cut away along a slanting edge and one hand grips it.
  const cut: Pt[] = [[128, -20], [330, -20], [330, 360], [114, 360]];
  return svg({ w: 300, h: 340, name, label: 'Goldilocks peeking', className: 'portrait' }, [
    group({ part: 'figure', origin: [150, 340] }, [clipped(cut, [group({ transform: 'translate(-10 0) rotate(7 150 340)' }, figureNodes)])]),
  ]);
}

export const goldilocks = (): string => girl('goldilocks', 'down');
const goldilocksWave = (): string => girl('goldilocks-wave', 'wave', { mouth: 'grin', tilt: 3 });
const goldilocksPeek = (): string => girl('goldilocks-peek', 'peek', { lean: true, tilt: 4 });

export const grownups: Record<string, () => string> = {
  'captain-bear': captainBear,
  'captain-bear:roar': captainRoar,
  'captain-bear:point': captainPoint,
  'captain-bear:happy': captainHappy,
  'uncle-bill': uncleBill,
  'uncle-bill:wave': uncleBillWave,
  'uncle-bill:laugh': uncleBillLaugh,
  'bully-bear': bullyBear,
  'bully-bear:grab': bullyGrab,
  'bully-bear:dig': bullyDig,
  'bully-bear:sorry': bullySorry,
  goldilocks,
  'goldilocks:peek': goldilocksPeek,
  'goldilocks:wave': goldilocksWave,
};
