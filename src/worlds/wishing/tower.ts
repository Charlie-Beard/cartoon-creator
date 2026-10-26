/**
 * The round room at the top of Enchanter Muddle's tower: curved grey-violet
 * stone walls with a deeper shadow where they bend away at each side, warm
 * wooden beams overhead, and a cosy, cluttered, magical feel (never dark).
 *
 * On the LEFT a big arched window (x 60-280, y 90-420) stands open onto a
 * pale blue sky and a cloud: the Wishing-Chair flies in through it. Across
 * the back wall (x 330-780) two stout shelves (tops at y 200 and y 320) are
 * crowded with bottles of every colour, jars and old books, with a hanging
 * lantern between them and a crooked brass moon-and-stars mobile above. On
 * the RIGHT (x 880-1110) a big black cauldron sits on three stubby legs over
 * a low, steady fire, its green brew bubbling (painted bubbles only: the
 * cartoon adds its own froth and steam). A round rug patterned with stars
 * lies in the middle of the floor.
 *
 * Ground line y 640. The open floor is x 300-900, clear for the chair and up
 * to 4 actors; the shelves sit high on the wall, so heads at y 330-380 are
 * clear of them but for the lower shelf's bottles. The bottom band (y 690-820)
 * is plain flagstones, the rug's near edge excepted (soft and low-contrast).
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const GROUND = 640;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

const STONE = ['#8e879a', '#9a93a6', '#847d90', '#948da0', '#8a8396'];
const STONE_FLOOR = ['#756e82', '#7d768a', '#6f687c', '#79728a'];

/** Coursed stone blocks over a region. */
function stones(x0: number, y0: number, x1: number, y1: number, seed: number, tones: string[], course = 50): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  let row = 0;
  for (let y = y0; y < y1; y += course, row++) {
    let x = x0 - (row % 2 ? 48 : 0);
    while (x < x1) {
      const bw = 88 + r() * 60;
      const bx = Math.max(x, x0);
      const bx1 = Math.min(x + bw, x1);
      if (bx1 - bx > 8) out.push(piece(rect(bx + 2, y + 2, bx1 - bx - 4, Math.min(course, y1 - y) - 4, 5), tones[Math.floor(r() * tones.length)], { ...flat, edge: 'torn', rough: 0.5 }));
      x += bw;
    }
  }
  return out;
}

/** One bottle: a round or tall body with a neck and a cork, a pale shine, and a label. */
function bottle(x: number, base: number, kind: 'round' | 'tall' | 'flask', fill: string, seed: number): Node[] {
  const out: Node[] = [];
  if (kind === 'round') {
    out.push(piece(circle(x, base - 20, 20), fill, { edge: 'cut', fibre: false }));
    out.push(piece(rect(x - 6, base - 56, 12, 20, 2), fill, { edge: 'cut', fibre: false, shadow: false }));
    out.push(piece(rect(x - 6, base - 62, 12, 8, 2), C.brown, flat));
    out.push(dot(x - 8, base - 26, 4, C.white, 0.45));
  } else if (kind === 'tall') {
    out.push(piece(rect(x - 12, base - 60, 24, 60, 5), fill, { edge: 'cut', fibre: false }));
    out.push(piece(rect(x - 5, base - 80, 10, 22, 2), fill, { edge: 'cut', fibre: false, shadow: false }));
    out.push(piece(rect(x - 6, base - 86, 12, 8, 2), C.brown, flat));
    out.push(piece(rect(x - 10, base - 38, 20, 14, 1), C.cream, { ...flat, opacity: 0.85 }));
    out.push(dot(x - 6, base - 50, 3, C.white, 0.45));
  } else {
    out.push(piece(poly([[x - 4, base - 62], [x + 4, base - 62], [x + 6, base - 34], [x + 22, base - 4], [x - 22, base - 4], [x - 6, base - 34]]), fill, { edge: 'cut', fibre: false }));
    out.push(piece(rect(x - 6, base - 68, 12, 8, 2), C.brown, flat));
    out.push(dot(x - 5, base - 20, 3.4, C.white, 0.45));
  }
  void seed;
  return out;
}

/** A row of books leaning on a shelf, spines of many colours. */
function books(x0: number, base: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const cols = [C.toyRed, C.blueDark, C.greenDark, C.gold, C.violetDark, C.rust, C.teal];
  const out: Node[] = [];
  let x = x0;
  for (let i = 0; i < n; i++) {
    const w = 14 + r() * 10;
    const h = 46 + r() * 22;
    out.push(piece(rect(x, base - h, w, h, 1.5), cols[Math.floor(r() * cols.length)], { edge: 'cut', fibre: false }));
    out.push(ink([[x + 3, base - h + 10], [x + w - 3, base - h + 10]], { width: 1.6, color: C.goldLight, opacity: 0.8 }));
    x += w + 1;
  }
  return out;
}

function shelves(): Node[] {
  const x0 = 330;
  const x1 = 780;
  const wood = { edge: 'cut' as const, fibre: false as const };
  const bottles = (base: number, xs: number[], seed: number): Node[] => {
    const r = rng(seed);
    const cols = ['#c0392f', '#4a74c0', '#6fa86a', '#e0a63a', '#b04a98', '#3a9690', '#e0688c', '#8fd0b0'];
    const kinds: ('round' | 'tall' | 'flask')[] = ['round', 'tall', 'flask'];
    return xs.flatMap((x) => bottle(x, base, kinds[Math.floor(r() * 3)], cols[Math.floor(r() * cols.length)], 0));
  };
  return [
    // the shelf backs: a darker recess so the bottles show up
    piece(rect(x0 - 14, 110, x1 - x0 + 28, 230, 4), '#5d4a63', { edge: 'cut', fibre: false, opacity: 0.55 }),
    // upper shelf: bottles and a few jars
    ...bottles(200, [360, 404, 446, 556, 600, 648, 692, 740], 5),
    ...books(480, 200, 4, 9),
    piece(rect(x0 - 20, 200, x1 - x0 + 40, 14, 3), C.brown, wood),
    piece(rect(x0 - 20, 200, x1 - x0 + 40, 4, 2), C.tan, flat),
    piece(poly([[x0 - 6, 214], [x0 + 18, 214], [x0 - 6, 244]]), C.brownDark, flat),
    piece(poly([[x1 + 6, 214], [x1 - 18, 214], [x1 + 6, 244]]), C.brownDark, flat),
    // lower shelf: books, a skull-shaped jar of sweets, more bottles
    ...books(346, 320, 8, 21),
    ...bottles(320, [520, 566, 612, 700, 746], 12),
    piece(circle(666, 298, 14), C.cream, { edge: 'cut', fibre: false }),
    piece(rect(x0 - 20, 320, x1 - x0 + 40, 14, 3), C.brown, wood),
    piece(rect(x0 - 20, 320, x1 - x0 + 40, 4, 2), C.tan, flat),
    piece(poly([[x0 - 6, 334], [x0 + 18, 334], [x0 - 6, 364]]), C.brownDark, flat),
    piece(poly([[x1 + 6, 334], [x1 - 18, 334], [x1 + 6, 364]]), C.brownDark, flat),
  ];
}

function archWindow(): Node[] {
  const x0 = 60;
  const x1 = 280;
  const top = 90;
  const bottom = 420;
  const mid = (x0 + x1) / 2;
  const arch = (pad: number): Pt[] =>
    poly([
      [x0 + pad, bottom - pad],
      [x0 + pad, top + 110],
      [x0 + pad + 14, top + 52],
      [mid, top + pad],
      [x1 - pad - 14, top + 52],
      [x1 - pad, top + 110],
      [x1 - pad, bottom - pad],
    ]);
  return [
    piece(arch(-18), '#b5aec0', { edge: 'cut' }),
    piece(arch(0), '#6e7f94', { edge: 'cut', shadow: false }),
    piece(arch(10), C.sky, { ...flat, edge: 'clean' }),
    piece(rect(x0 + 10, 290, x1 - x0 - 20, 120), '#b3cfe6', { ...flat, edge: 'clean', opacity: 0.7 }),
    // a fat cloud, a smaller one and a faraway hill
    piece(ellipse(160, 220, 52, 24), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(196, 208, 34, 22), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(130, 208, 28, 18), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(170, 232, 56, 10), C.cloudShade, { ...flat, opacity: 0.6 }),
    piece(ellipse(230, 330, 30, 12), C.cloud, { ...flat, edge: 'torn', rough: 1.2, opacity: 0.85 }),
    piece(poly([[x0 + 10, 408], [x0 + 60, 372], [x0 + 130, 388], [x1 - 20, 366], [x1 - 10, 408]]), C.leafLight, { ...flat, edge: 'clean', opacity: 0.85 }),
    // the two casements swung open into the room
    piece(poly([[x0 + 10, 180], [x0 + 52, 208], [x0 + 52, 396], [x0 + 10, 410]]), C.wood, { edge: 'cut' }),
    piece(poly([[x0 + 20, 196], [x0 + 44, 214], [x0 + 44, 386], [x0 + 20, 396]]), '#a8c6dc', { ...flat, opacity: 0.8 }),
    piece(poly([[x1 - 10, 180], [x1 - 52, 208], [x1 - 52, 396], [x1 - 10, 410]]), C.wood, { edge: 'cut' }),
    piece(poly([[x1 - 20, 196], [x1 - 44, 214], [x1 - 44, 386], [x1 - 20, 396]]), '#a8c6dc', { ...flat, opacity: 0.8 }),
    // the sill, with a pot of something purple
    piece(rect(x0 - 26, bottom - 4, x1 - x0 + 52, 24, 4), '#b8b2c4', { edge: 'cut' }),
    piece(rect(x0 - 26, bottom - 4, x1 - x0 + 52, 7, 3), '#cfc9d8', flat),
  ];
}

function beams(): Node[] {
  return [
    piece(rect(-20, -20, W + 40, 70), '#6a5040', { edge: 'clean', shadow: false }),
    // curved rafters, bowing down at the sides as the round roof bends away
    piece(curve([[-20, 40], [300, 62], [590, 70], [880, 62], [1200, 40], [1200, 22], [880, 44], [590, 52], [300, 44], [-20, 22]], 2), C.wood, { edge: 'cut' }),
    piece(rect(560, 40, 60, 34, 3), C.brownDark, flat),
  ];
}

/** A hanging lantern and a crooked brass mobile of moons and stars, hung from the beams. */
function hangings(): Node[] {
  return [
    // lantern between the shelves, low over the lower shelf
    ink([[540, 60], [540, 118]], { width: 3, color: C.brownDark }),
    piece(poly([[524, 118], [556, 118], [562, 130], [518, 130]]), C.brass, { edge: 'cut', fibre: false }),
    piece(rect(522, 130, 36, 34, 3), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    ink([[540, 132], [540, 162]], { width: 2, color: C.brassDark }),
    piece(poly([[520, 164], [560, 164], [554, 174], [526, 174]]), C.brass, { edge: 'cut', fibre: false }),
    // mobile
    ink([[820, 62], [820, 100]], { width: 2.4, color: C.brassDark }),
    ink([[790, 100], [850, 108]], { width: 2.6, color: C.brassDark }),
    ink([[796, 100], [796, 128]], { width: 1.8, color: C.brassDark }),
    ink([[846, 108], [846, 140]], { width: 1.8, color: C.brassDark }),
    piece(poly(starPts(796, 140, 14)), C.starYellow, flat),
    piece(poly(moonPts(846, 156, 15)), '#d4d8de', flat),
  ];
}

function starPts(x: number, y: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return pts;
}

function moonPts(x: number, y: number, r: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI;
    out.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  for (let i = 10; i >= 0; i--) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI;
    out.push([x + Math.cos(a) * r * 0.55 + r * 0.32, y + Math.sin(a) * r * 0.78]);
  }
  return out;
}

function cauldron(): Node[] {
  const cx = 1000;
  return [
    // low fire under it
    piece(poly([[cx - 74, 646], [cx - 54, 596], [cx - 30, 636], [cx - 10, 586], [cx + 14, 634], [cx + 38, 592], [cx + 58, 640], [cx + 76, 646]]), C.orange, { ...flat, edge: 'torn', rough: 1.4 }),
    piece(poly([[cx - 50, 646], [cx - 30, 614], [cx - 12, 640], [cx + 8, 606], [cx + 30, 642], [cx + 52, 646]]), C.yellow, { ...flat, edge: 'torn', rough: 1.4 }),
    piece(rect(cx - 90, 640, 180, 10, 3), C.charcoal, flat),
    // stubby legs and the pot
    piece(poly([[cx - 78, 570], [cx - 58, 570], [cx - 70, 640], [cx - 88, 640]]), C.charcoal, { edge: 'cut', fibre: false }),
    piece(poly([[cx + 78, 570], [cx + 58, 570], [cx + 70, 640], [cx + 88, 640]]), C.charcoal, { edge: 'cut', fibre: false }),
    piece(ellipse(cx, 490, 118, 104), '#33323a', { edge: 'cut' }),
    piece(ellipse(cx - 40, 470, 60, 70), '#4a4953', { ...flat, opacity: 0.55 }),
    // the rim and the green brew, with painted bubbles
    piece(ellipse(cx, 402, 108, 24), '#262530', { edge: 'cut' }),
    piece(ellipse(cx, 404, 94, 17), '#8fd06a', { ...flat, edge: 'clean' }),
    piece(ellipse(cx - 20, 402, 44, 8), '#b6e88a', { ...flat, edge: 'clean', opacity: 0.7 }),
    piece(circle(cx - 44, 396, 9), '#b6e88a', { edge: 'clean', fibre: false, shadow: false }),
    piece(circle(cx + 30, 400, 12), '#b6e88a', { edge: 'clean', fibre: false, shadow: false }),
    piece(circle(cx + 62, 394, 7), '#b6e88a', { edge: 'clean', fibre: false, shadow: false }),
    // a handle on each side
    ink([[cx - 112, 436], [cx - 138, 456], [cx - 112, 480]], { width: 7, color: '#262530' }),
    ink([[cx + 112, 436], [cx + 138, 456], [cx + 112, 480]], { width: 7, color: '#262530' }),
    // a wooden ladle leaning in the pot
    piece(poly([[cx + 52, 410], [cx + 62, 408], [cx + 96, 328], [cx + 88, 324]]), C.wood, { edge: 'cut', fibre: false }),
  ];
}

function floor(): Node[] {
  const r = rng(404);
  const out: Node[] = [piece(rect(-20, GROUND, W + 40, H - GROUND + 40), '#756e82', { edge: 'clean', shadow: false, fibre: false })];
  const rows = [GROUND, 676, 722, 780, 850];
  for (let i = 0; i < rows.length - 1; i++) {
    let x = -30 - r() * 80;
    while (x < W + 30) {
      const w = 120 + r() * 120;
      out.push(piece(rect(x + 2, rows[i] + 2, w - 4, rows[i + 1] - rows[i] - 4, 4), STONE_FLOOR[Math.floor(r() * STONE_FLOOR.length)], { ...flat, edge: 'torn', rough: 0.4 }));
      x += w;
    }
  }
  return out;
}

/** A round rug, indigo with a rose border and cream stars, lying flat. */
function rug(): Node[] {
  const cx = 590;
  const cy = 676;
  const out: Node[] = [
    piece(ellipse(cx, cy, 300, 44), C.rose, { rough: 0.8, shadow: false }),
    piece(ellipse(cx, cy, 262, 36), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    piece(ellipse(cx, cy, 238, 31), '#40407a', { edge: 'cut', fibre: false, shadow: false }),
  ];
  const pts: [number, number, number][] = [[-170, 0, 9], [-110, -8, 7], [-50, 6, 10], [20, -6, 8], [80, 8, 11], [140, -4, 8], [190, 4, 7]];
  for (const [dx, dy, r] of pts) out.push(piece(poly(starPts(cx + dx, cy + dy, r)), C.starYellow, { ...flat, opacity: 0.9 }));
  return out;
}

export const enchanterTower = cached(() =>
  svg({ w: 1180, h: 820, name: 'wishing-enchanter-tower', className: 'backdrop' }, [
    // Full-bleed base, then the stone wall.
    piece(rect(-20, -20, 1220, 860), '#7f788d', { edge: 'clean', shadow: false }),
    ...stones(-20, 40, 1200, GROUND, 77, STONE),
    // The room curves away at each side: deeper tones on the bend.
    piece(poly([[-20, 40], [110, 40], [60, 340], [96, GROUND], [-20, GROUND]]), '#5a5368', { ...flat, edge: 'torn', rough: 2, opacity: 0.45 }),
    piece(poly([[1200, 40], [1070, 40], [1124, 340], [1090, GROUND], [1200, GROUND]]), '#5a5368', { ...flat, edge: 'torn', rough: 2, opacity: 0.45 }),
    piece(poly([[-20, 40], [40, 40], [20, 340], [44, GROUND], [-20, GROUND]]), '#463f54', { ...flat, edge: 'torn', rough: 2, opacity: 0.45 }),
    piece(poly([[1200, 40], [1140, 40], [1160, 340], [1136, GROUND], [1200, GROUND]]), '#463f54', { ...flat, edge: 'torn', rough: 2, opacity: 0.45 }),
    ...beams(),
    ...archWindow(),
    ...shelves(),
    ...hangings(),
    ...cauldron(),
    // A skirting of darker stone where wall meets floor.
    piece(rect(-20, GROUND - 14, W + 40, 18, 3), '#5c556a', { edge: 'cut', fibre: false }),
    ...floor(),
    ...rug(),
  ]),
);
