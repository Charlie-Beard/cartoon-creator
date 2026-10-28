/**
 * The Land of Birthdays, where it is somebody's birthday every day, and
 * three party props: the birthday cake, one loose candle and a paper chain.
 *
 * The backdrop is a bright, sugary afternoon: a clear blue sky going creamy
 * near the hills, a soft sun, a few fluffy clouds, and green hills far off
 * with a little street of CAKE-SHAPED COTTAGES (sponge walls, drippy icing
 * roofs, a cherry on top and a candle for a chimney): three tiny ones on the
 * far hills and two nearer, small ones behind the open ground (bases about
 * (372, 600) and (800, 598), tops no higher than y 470), all in pale
 * mid-tones so faces read in front of them.
 *
 * At the left (x 0-300) is Mr Bunloaf's bakery, built like a big two-tier
 * cake: a sponge-coloured lower tier with a pink-and-white striped awning
 * (y 330-420), a shop window full of cakes (x 22-168, y 440-570) and a red
 * door (x 196-272, y 446-640); a pink-iced top tier with a round sign
 * painted with a cake, a cherry on the very top and a candle chimney. A bunch
 * of three balloons is tied to the awning's right end (x 270-345, y 230-410).
 *
 * At the right is the CANDLE TREE (see CANDLE_TREE for numbers): a tall
 * friendly tree with a knobbly trunk (x about 995-1065 near the ground,
 * narrowing upward; foot-hold knots up it), round mint-green leaf clumps,
 * and little unlit candles standing upright in leaf-cups on its branches.
 * The low ones are plain white with pink stripes; the best ones, near the
 * top (above y 200), are bigger, cream with gold stripes, and twinkle. A
 * long, thick, nearly flat bough reaches left near the top, its upper
 * surface at y about 290 from x 860 to 1010: Peter can stand on it.
 *
 * Bunting is strung from the bakery's top tier to the tree, sagging to
 * about y 268 in the middle (all of it above y 300). Ground line y 640: soft
 * grass with a pale sugar-pink path down the middle. The open ground is
 * x 300-880. The bottom band (y 690+) is plain grass and path.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const soft = { edge: 'torn' as const, rough: 1.4, fibre: false as const, shadow: false };

/**
 * Where to put someone in the candle tree, in stage coordinates. The trunk's
 * middle is at x 1030 (about 70 wide at the bottom, 40 at the top); knots
 * for footholds are at the `holds`. The `bough` is the long flat branch near
 * the top: its upper surface is at y `bough.top` from x `bough.x0` to
 * `bough.x1`, so a character stood on it has their feet (box bottom) at
 * y 290 and can be anywhere from x 860 to 1000 (Peter at w 170 is about
 * 195 tall: place him at y ≈ 95). The best candles hang above the bough,
 * at y 50-200 between x 920 and 1160 (`best`), in easy reach of someone
 * standing on it.
 */
export const CANDLE_TREE = {
  trunkX: 1030,
  base: 645,
  holds: [[1022, 570], [1044, 505], [1016, 440], [1040, 375]] as Pt[],
  bough: { x0: 860, x1: 1010, top: 290 },
  best: { x0: 920, x1: 1160, y0: 50, y1: 200 },
};

// ---------------------------------------------------------------------------
// Little pieces
// ---------------------------------------------------------------------------

/** Diagonal stripes across an upright stick (x-w/2..x+w/2, top..bottom). */
function stripes(x: number, top: number, bottom: number, w: number, col: string, gap: number): Node[] {
  const out: Node[] = [];
  const hw = w / 2;
  const t = Math.max(1.6, gap * 0.4);
  const slant = w * 0.55;
  for (let y = top + slant + 1; y + t < bottom - 1; y += gap) {
    out.push(piece(poly([[x - hw, y], [x + hw, y - slant], [x + hw, y - slant + t], [x - hw, y + t]]), col, flat));
  }
  return out;
}

/**
 * One unlit candle standing in a little leaf-cup, its base at (x, y).
 * `best` makes it bigger, cream with gold stripes, with a twinkle.
 */
function treeCandle(x: number, y: number, best: boolean): Node[] {
  const h = best ? 34 : 26;
  const w = best ? 10 : 8;
  const out: Node[] = [];
  if (best) out.push(piece(circle(x, y - h / 2 - 4, 20), '#fff4c8', { ...flat, opacity: 0.35 }));
  out.push(
    piece(rect(x - w / 2, y - h, w, h, 2.5), best ? '#fff3d6' : C.china, { edge: 'cut', fibre: false, shadow: true }),
    ...stripes(x, y - h, y, w, best ? C.gold : C.raspberry, best ? 8 : 7),
    ink([[x, y - h], [x + 0.6, y - h - 6]], { width: 1.8, color: C.ink, wobble: 0.1 }),
    // the leaf-cup it grows in
    piece(curve([[x - w / 2 - 6, y - 7], [x - w / 2, y + 3], [x + w / 2, y + 3], [x + w / 2 + 6, y - 7], [x + 2, y - 2], [x - 2, y - 2]], 1), C.leafDark, { edge: 'cut', fibre: false, shadow: false }),
  );
  if (best) {
    const sx = x + 10;
    const sy = y - h - 4;
    out.push(
      ink([[sx - 5, sy], [sx + 5, sy]], { width: 1.6, color: '#fffbe8', wobble: 0 }),
      ink([[sx, sy - 5], [sx, sy + 5]], { width: 1.6, color: '#fffbe8', wobble: 0 }),
      dot(sx, sy, 1.6, '#ffffff'),
    );
  }
  return out;
}

/** A round soft clump of leaves with a few pale blossoms. */
function clump(x: number, y: number, r: number, seed: number): Node[] {
  const q = rng(seed);
  const out: Node[] = [
    piece(ellipse(x, y + r * 0.12, r * 1.04, r * 0.9), '#6fae6a', { edge: 'torn', rough: 1.1, fibre: false, shadow: true }),
    piece(ellipse(x - r * 0.12, y - r * 0.06, r * 0.86, r * 0.72), '#8cc77e', { edge: 'torn', rough: 1, fibre: false, shadow: false }),
    piece(ellipse(x - r * 0.3, y - r * 0.3, r * 0.42, r * 0.28), '#b2dc98', { ...flat, edge: 'torn', rough: 0.8, opacity: 0.8 }),
  ];
  for (let i = 0; i < 4; i++) {
    const a = q() * Math.PI * 2;
    const d = r * (0.3 + q() * 0.45);
    out.push(dot(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 3.2, i % 2 ? '#fbdbe6' : '#fff4d8', 0.95));
  }
  return out;
}

/**
 * A cottage shaped like a round iced cake, base-middle at (x, base): sponge
 * walls with a cream band, a drippy icing roof, a cherry on top, a candle
 * chimney, a round window and a round-topped door.
 */
function cakeCottage(x: number, base: number, s: number, sponge: string, icing: string, door: string): Node[] {
  const hw = 74 * s;
  const top = base - 104 * s;
  const roof: Pt[] = [[x - hw - 6 * s, top + 6 * s], [x - hw + 4 * s, top - 26 * s], [x - 30 * s, top - 46 * s], [x + 30 * s, top - 46 * s], [x + hw - 4 * s, top - 26 * s], [x + hw + 6 * s, top + 6 * s]];
  // drips back along the bottom edge of the roof, right to left
  const n = 6;
  for (let i = 0; i <= n; i++) {
    const dx = x + hw + 4 * s - ((2 * hw + 8 * s) * i) / n;
    roof.push([dx, top + 4 * s], [dx - 6 * s, top + (i % 2 ? 22 : 15) * s], [dx - 12 * s, top + 4 * s]);
  }
  return [
    piece(ellipse(x, base + 2 * s, hw + 12 * s, 7 * s), '#5f8f52', { ...flat, opacity: 0.35 }),
    // the sponge walls, with a darker base and a cream filling band
    piece(rect(x - hw, top, hw * 2, base - top, 6 * s), sponge, { edge: 'torn', rough: 0.6, fibre: false }),
    piece(rect(x - hw, base - 54 * s, hw * 2, 9 * s), '#fbf3e6', { ...flat, opacity: 0.8 }),
    piece(rect(x - hw, base - 12 * s, hw * 2, 12 * s), '#000000', { ...flat, opacity: 0.08 }),
    // candle chimney, behind the roof
    piece(rect(x + 30 * s, top - 74 * s, 12 * s, 40 * s, 3 * s), C.china, { edge: 'cut', fibre: false, shadow: false }),
    ...stripes(x + 36 * s, top - 74 * s, top - 34 * s, 12 * s, C.raspberry, 9 * s),
    ink([[x + 36 * s, top - 74 * s], [x + 36 * s, top - 80 * s]], { width: Math.max(1.2, 2 * s), color: C.ink, wobble: 0.1 }),
    // the icing roof and the cherry on top
    piece(curve(roof, 1), icing, { edge: 'torn', rough: 0.5, fibre: false, shadow: true }),
    piece(circle(x - 6 * s, top - 54 * s, 12 * s), C.cherry, { edge: 'cut', fibre: false, shadow: false }),
    dot(x - 10 * s, top - 58 * s, 3 * s, '#ffffff', 0.6),
    ink([[x - 6 * s, top - 64 * s], [x + 2 * s, top - 76 * s], [x + 10 * s, top - 80 * s]], { width: Math.max(1.2, 2.2 * s), color: C.leafDark, wobble: 0.2 }),
    // round window with a warm pane and a cross of glazing bars
    piece(circle(x - 34 * s, base - 70 * s, 15 * s), '#fff2c0', { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 49 * s, base - 70 * s], [x - 19 * s, base - 70 * s]], { width: Math.max(1, 1.8 * s), color: C.brownDark, opacity: 0.6, wobble: 0.1 }),
    ink([[x - 34 * s, base - 85 * s], [x - 34 * s, base - 55 * s]], { width: Math.max(1, 1.8 * s), color: C.brownDark, opacity: 0.6, wobble: 0.1 }),
    // round-topped door with a knob
    piece(curve([[x + 12 * s, base], [x + 12 * s, base - 40 * s], [x + 28 * s, base - 58 * s], [x + 44 * s, base - 40 * s], [x + 44 * s, base]], 2), door, { edge: 'cut', fibre: false, shadow: false }),
    dot(x + 38 * s, base - 22 * s, 2.4 * s, C.goldLight),
  ];
}

/** A balloon on a string from (sx, sy), body centred at (x, y). */
function balloon(x: number, y: number, r: number, col: string, sx: number, sy: number): Node[] {
  return [
    ink([[x, y + r * 1.15], [x + (sx - x) * 0.4 + 6, y + r * 1.15 + (sy - y - r) * 0.4], [x + (sx - x) * 0.7 - 5, y + r * 1.15 + (sy - y - r) * 0.7], [sx, sy]], { width: 1.6, color: C.ink, opacity: 0.7, wobble: 0.3 }),
    piece(curve([[x, y - r * 1.1], [x + r * 0.95, y - r * 0.6], [x + r * 0.85, y + r * 0.5], [x, y + r * 1.1], [x - r * 0.85, y + r * 0.5], [x - r * 0.95, y - r * 0.6]], 2), col, { edge: 'cut', fibre: false, shadow: true }),
    piece(poly([[x - 5, y + r * 1.2], [x, y + r * 1.04], [x + 5, y + r * 1.2]]), col, flat),
    piece(ellipse(x - r * 0.38, y - r * 0.45, r * 0.16, r * 0.3, 30), '#ffffff', { ...flat, opacity: 0.45 }),
  ];
}

/** A soft white cloud of three puffs. */
const cloud = (x: number, y: number, s: number): Node[] => [
  piece(ellipse(x, y, 70 * s, 20 * s), '#ffffff', { edge: 'torn', rough: 0.8, fibre: false, shadow: false, opacity: 0.85 }),
  piece(ellipse(x - 26 * s, y - 14 * s, 34 * s, 20 * s), '#ffffff', { edge: 'torn', rough: 0.8, fibre: false, shadow: false, opacity: 0.85 }),
  piece(ellipse(x + 18 * s, y - 20 * s, 40 * s, 24 * s), '#ffffff', { edge: 'torn', rough: 0.8, fibre: false, shadow: false, opacity: 0.85 }),
];

// ---------------------------------------------------------------------------
// The Land of Birthdays
// ---------------------------------------------------------------------------

export const birthdayLand = cached((): string => {
  const r = rng(1207);

  // the candle tree: trunk, branches, leaf clumps, candles
  const B = (pts: Pt[], w: number): Node => piece(band(pts, w), C.bark, { edge: 'torn', rough: 0.7, fibre: false, shadow: true });
  const tree: Node[] = [
    // a soft pale crown behind the branches, so it reads as one big tree
    piece(ellipse(1050, 110, 170, 120), '#a6d494', { edge: 'torn', rough: 1.4, fibre: false, shadow: false, opacity: 0.75 }),
    piece(ellipse(1130, 300, 80, 150), '#a6d494', { edge: 'torn', rough: 1.4, fibre: false, shadow: false, opacity: 0.6 }),
    // shadow where it stands
    piece(ellipse(1032, 650, 120, 12), '#5f8f52', { ...flat, opacity: 0.35 }),
    // roots and trunk, narrowing upward and running into the crown
    piece(curve([[938, 652], [975, 628], [995, 560], [1000, 460], [1006, 360], [1012, 240], [1018, 130], [1022, 60], [1040, 60], [1044, 130], [1050, 240], [1056, 360], [1060, 460], [1066, 560], [1088, 628], [1124, 652]], 2), C.bark, { edge: 'torn', rough: 0.8, fibre: false }),
    // a lighter, sunny left side
    piece(curve([[992, 600], [998, 520], [1004, 400], [1010, 280], [1016, 150], [1026, 150], [1022, 280], [1018, 400], [1014, 520], [1010, 600]], 2), C.barkLight, { ...flat, edge: 'torn', rough: 0.6, opacity: 0.7 }),
    // bark lines
    ink([[1046, 610], [1042, 540], [1048, 470]], { width: 2, color: C.barkDark, opacity: 0.6 }),
    ink([[1030, 420], [1034, 340], [1028, 280]], { width: 2, color: C.barkDark, opacity: 0.6 }),
    // knots for footholds
    ...CANDLE_TREE.holds.map(([x, y]) => piece(ellipse(x, y, 9, 6), C.barkDark, { edge: 'cut', fibre: false, shadow: false })),
    ...CANDLE_TREE.holds.map(([x, y]) => ink([[x - 9, y - 4], [x, y - 7], [x + 9, y - 4]], { width: 1.6, color: C.barkLight, opacity: 0.8 })),
    // low branches
    B([[1004, 520], [960, 486], [920, 470]], 22),
    B([[1056, 480], [1110, 446], [1172, 428]], 22),
    B([[1056, 372], [1110, 344], [1176, 318]], 20),
    // the long flat bough near the top (Peter's): upper surface y ≈ 290
    B([[1016, 306], [960, 302], [900, 302], [862, 298]], 26),
    piece(band([[1010, 296], [950, 293], [880, 293]], 6), C.barkLight, { ...flat, opacity: 0.7 }),
    // upper branches into the crown
    B([[1020, 210], [980, 176], [940, 150]], 16),
    B([[1044, 196], [1090, 164], [1140, 130]], 16),
    B([[1028, 120], [1000, 90], [972, 70]], 12),
    B([[1036, 110], [1070, 82], [1104, 64]], 12),
  ];
  const leaves: Node[] = [
    ...clump(1030, 34, 46, 1),
    ...clump(950, 108, 40, 2),
    ...clump(1124, 92, 42, 3),
    ...clump(1180, 300, 42, 4),
    ...clump(1180, 408, 38, 5),
    ...clump(908, 448, 34, 6),
    ...clump(846, 284, 18, 7),
  ];
  const candles: Node[] = [
    // plain ones low down
    ...treeCandle(934, 462, false),
    ...treeCandle(968, 478, false),
    ...treeCandle(1092, 451, false),
    ...treeCandle(1140, 433, false),
    ...treeCandle(1100, 344, false),
    ...treeCandle(1146, 327, false),
    ...treeCandle(906, 290, false),
    // the best ones, at the top
    ...treeCandle(962, 157, true),
    ...treeCandle(996, 182, true),
    ...treeCandle(1078, 168, true),
    ...treeCandle(1118, 140, true),
    ...treeCandle(988, 80, true),
    ...treeCandle(1078, 76, true),
    ...treeCandle(1036, 52, true),
  ];

  // bunting from the bakery's top tier to the tree
  const flagCols = [C.raspberry, C.toyYellow, C.toyBlue, C.mint, C.lilac, C.orange];
  const bunt = (t: number): Pt => [258 + (1000 - 258) * t, 170 + 20 * t + 96 * Math.sin(Math.PI * t)];
  const flags: Node[] = [];
  for (let i = 1; i < 18; i++) {
    const [x, y] = bunt(i / 18);
    flags.push(piece(poly([[x - 14, y - 1], [x + 14, y + 1], [x + 1, y + 30]]), flagCols[i % flagCols.length], { edge: 'cut', fibre: false, shadow: true }));
  }

  // a few sprinkles on the path, quiet and above the bottom band
  const sprinkles: Node[] = [];
  for (let i = 0; i < 22; i++) {
    const x = 380 + r() * 420;
    const y = 612 + r() * 70;
    const a = r() * 180;
    sprinkles.push(piece(ellipse(x, y, 5, 1.6, a), flagCols[i % flagCols.length], { ...flat, opacity: 0.55 }));
  }

  return svg({ w: 1180, h: 820, name: 'wishing-birthday-land', className: 'backdrop' }, [
    // a clear afternoon sky going creamy toward the hills
    piece(rect(-20, -20, 1220, 860), '#8fc3e6', { edge: 'clean', shadow: false }),
    piece(rect(-20, 160, 1220, 400), '#a9d3ee', { ...soft, rough: 2 }),
    piece(rect(-20, 300, 1220, 260), '#c6e2ef', { ...soft, rough: 2 }),
    piece(rect(-20, 400, 1220, 200), '#ecebd8', { ...soft, rough: 2, opacity: 0.85 }),
    // the sun, soft, with a halo
    piece(circle(560, 92, 92), '#fff6d0', { ...flat, opacity: 0.25 }),
    piece(circle(560, 92, 64), '#fff6d0', { ...flat, opacity: 0.35 }),
    piece(circle(560, 92, 42), '#ffe9a0', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    ...cloud(390, 120, 0.9),
    ...cloud(760, 70, 0.8),
    ...cloud(820, 250, 0.6),

    // far rolling hills with three tiny cake cottages
    piece(curve([[-40, 560], [80, 500], [220, 486], [380, 510], [520, 490], [680, 504], [820, 478], [960, 470], [1100, 494], [1220, 520], [1220, 660], [-40, 660]], 3), '#b3d79a', { ...soft, rough: 1.2 }),
    ...cakeCottage(460, 516, 0.34, '#efd2a4', '#fbe2ea', '#c7899a'),
    ...cakeCottage(590, 502, 0.28, '#f4e0b0', '#e9f2fb', '#8aa6c8'),
    ...cakeCottage(700, 508, 0.32, '#f1cdb4', '#fff4cc', '#9cb88a'),
    piece(curve([[-40, 620], [120, 560], [300, 556], [460, 584], [620, 570], [780, 580], [920, 556], [1080, 560], [1220, 590], [1220, 700], [-40, 700]], 3), '#a5cf88', { ...soft, rough: 1.2 }),

    // ----- the ground: soft grass and a pale sugar path (under the bakery and the tree)
    piece(rect(-20, 600, 1220, 240), '#9ccb7c', { ...soft, rough: 1.4 }),
    piece(rect(-20, 690, 1220, 150), '#94c476', { ...soft, rough: 1.2 }),
    piece(poly([[400, 606], [800, 606], [980, 840], [220, 840]]), '#f6dccb', { edge: 'torn', rough: 1.2, fibre: false, shadow: false }),
    piece(poly([[440, 612], [760, 612], [880, 700], [320, 700]]), '#fbe7da', { ...flat, edge: 'torn', rough: 1, opacity: 0.6 }),
    ...sprinkles,

    // two nearer, small cake cottages behind the open ground
    ...cakeCottage(372, 600, 0.62, '#f2cf9c', '#f7b8cb', '#c4706c'),
    ...balloon(326, 470, 13, C.toyBlue, 320, 548),
    ...cakeCottage(800, 598, 0.6, '#f4dcb0', '#fbf3f4', '#7d9ac4'),
    ...balloon(852, 466, 12, C.toyYellow, 846, 546),

    // ----- Mr Bunloaf's bakery, built like a two-tier cake
    piece(rect(-20, 260, 320, 390, 10), '#e9c48a', { edge: 'torn', rough: 0.7, fibre: false }),
    piece(rect(-20, 600, 320, 42), '#000000', { ...flat, opacity: 0.08 }),
    // a cream filling band and a lower base board
    piece(rect(-20, 424, 320, 12), '#fbf3e6', { ...flat, opacity: 0.85 }),
    // the top tier, pink-iced, behind its own drips
    piece(rect(30, 150, 222, 118, 8), '#f8d9e2', { edge: 'torn', rough: 0.6, fibre: false }),
    piece(curve([[24, 160], [40, 132], [100, 116], [180, 116], [240, 132], [258, 160], [240, 184], [228, 170], [214, 194], [196, 172], [176, 186], [156, 168], [136, 190], [116, 170], [96, 184], [76, 168], [58, 190], [40, 172]], 1), '#f3a3bb', { edge: 'torn', rough: 0.5, fibre: false }),
    // the round sign with a little painted cake
    piece(circle(141, 222, 34), C.cream, { edge: 'cut', fibre: false }),
    piece(rect(121, 220, 40, 20, 3), C.cakeSponge, flat),
    piece(curve([[118, 222], [126, 210], [156, 210], [164, 222], [154, 228], [140, 222], [128, 228]], 1), '#f7b8cb', flat),
    piece(circle(141, 205, 5), C.cherry, flat),
    ink(ellipse(141, 222, 30, 30), { width: 2, color: C.raspberryDark, opacity: 0.6, wobble: 0.2, closed: true }),
    // the candle chimney and the big cherry on top
    piece(rect(206, 70, 18, 60, 4), C.china, { edge: 'cut', fibre: false }),
    ...stripes(215, 70, 130, 18, C.raspberry, 12),
    ink([[215, 70], [216, 60]], { width: 2.2, color: C.ink, wobble: 0.1 }),
    piece(circle(128, 100, 24), C.cherry, { edge: 'cut', fibre: false }),
    dot(120, 92, 6, '#ffffff', 0.5),
    ink([[128, 78], [140, 58], [156, 50]], { width: 3, color: C.leafDark, wobble: 0.2 }),
    piece(ellipse(160, 52, 12, 6, -20), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    // white icing drips over the lower tier's top edge
    piece(curve([[-30, 244], [60, 250], [150, 248], [240, 252], [310, 250], [310, 276], [292, 272], [280, 298], [262, 274], [238, 290], [214, 270], [190, 296], [168, 272], [142, 288], [118, 270], [96, 296], [72, 272], [48, 290], [26, 270], [6, 294], [-30, 276]], 1), '#fbf3f4', { edge: 'torn', rough: 0.5, fibre: false }),

    // the shop window with cakes on show
    piece(rect(20, 438, 150, 134, 6), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(28, 446, 134, 118, 4), '#fdf2d8', flat),
    piece(rect(28, 446, 134, 118, 4), '#ffe8a8', { ...flat, opacity: 0.4 }),
    piece(rect(28, 518, 134, 8, 2), C.wood, flat),
    piece(rect(40, 488, 40, 30, 4), C.cakeSponge, { edge: 'cut', fibre: false }),
    piece(curve([[37, 492], [48, 480], [72, 480], [83, 492], [72, 498], [60, 494], [48, 498]], 1), '#f7b8cb', flat),
    piece(circle(60, 478, 5), C.cherry, flat),
    piece(rect(96, 474, 52, 44, 4), '#fbf3f4', { edge: 'cut', fibre: false }),
    piece(curve([[93, 478], [108, 466], [136, 466], [151, 478], [138, 486], [122, 480], [108, 486]], 1), C.mint, flat),
    piece(rect(118, 452, 8, 16, 2), C.china, flat),
    piece(rect(44, 536, 26, 20, 4), C.toffee, flat),
    piece(rect(80, 536, 26, 20, 4), C.raspberry, flat),
    piece(rect(116, 536, 26, 20, 4), C.lemon, flat),
    ink([[28, 446], [162, 446], [162, 564], [28, 564], [28, 446]], { width: 2, color: C.brownDark, opacity: 0.5, wobble: 0.2 }),
    piece(poly([[40, 452], [60, 452], [36, 500]]), '#ffffff', { ...flat, opacity: 0.35 }),
    piece(rect(14, 572, 162, 12, 3), C.wood, { edge: 'cut', fibre: false }),
    // the red door with a round window and a step
    piece(curve([[196, 642], [196, 480], [210, 454], [234, 446], [258, 454], [272, 480], [272, 642]], 2), C.coatRed, { edge: 'cut', fibre: false }),
    piece(circle(234, 494, 15), '#fff2c0', { edge: 'cut', fibre: false, shadow: false }),
    ink([[234, 479], [234, 509]], { width: 1.8, color: C.redDark, opacity: 0.7 }),
    dot(258, 572, 4, C.goldLight),
    piece(rect(186, 636, 96, 12, 3), C.stoneLight, { edge: 'cut', fibre: false }),

    // the striped awning, scalloped
    ...(() => {
      const out: Node[] = [];
      const n = 8;
      const x0 = -14;
      const sw = 330 / n;
      for (let i = 0; i < n; i++) {
        const x = x0 + i * sw;
        const col = i % 2 ? '#fbf3f4' : '#ec8aa8';
        out.push(piece(poly([[x + 6, 330], [x + sw + 6, 330], [x + sw, 400], [x, 400]]), col, { edge: 'cut', fibre: false, shadow: i === 0 }));
        out.push(piece(curve([[x, 398], [x + sw, 398], [x + sw * 0.85, 412], [x + sw / 2, 420], [x + sw * 0.15, 412]], 1), col, flat));
      }
      out.push(piece(rect(-14, 326, 336, 8, 2), C.raspberryDark, { edge: 'cut', fibre: false, shadow: false }));
      return out;
    })(),
    // three balloons tied to the awning's right end
    ...balloon(296, 262, 24, C.balloon, 312, 404),
    ...balloon(338, 296, 22, C.toyYellow, 314, 404),
    ...balloon(306, 330, 20, C.toyBlue, 316, 404),

    // ----- the candle tree
    ...tree,
    ...leaves,
    ...candles,

    // bunting: string, then the flags
    ink(Array.from({ length: 21 }, (_, i) => bunt(i / 20)), { width: 2.4, color: C.brownDark, opacity: 0.75, wobble: 0.3 }),
    ...flags,

    // tufts of grass and lollipop flowers at the sides of the open ground
    ...[[312, 640], [878, 642], [180, 676], [1120, 668]].flatMap(([x, y], i) => [
      ink([[x, y], [x + 1, y - 34]], { width: 2.6, color: C.leafDark }),
      piece(circle(x + 1, y - 42, 10), [C.raspberry, C.toyYellow, C.lilac, C.mint][i], { edge: 'cut', fibre: false }),
      dot(x + 1, y - 42, 3.4, '#fff4d8'),
      piece(ellipse(x + 8, y - 14, 8, 3.5, -30), C.leaf, flat),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const PINK = '#f3a9bf';
const PINK_DARK = '#d97f9c';
const WHITE = '#fdf6f4';

/** A drum outline: straight sides from y0 to y1, round bottom of depth `d`. */
function drum(cx: number, rx: number, y0: number, y1: number, d: number): Pt[] {
  const pts: Pt[] = [[cx - rx, y0], [cx - rx, y1]];
  for (let a = 180; a >= 0; a -= 10) {
    const t = (a * Math.PI) / 180;
    pts.push([cx + rx * Math.cos(t), y1 + d * Math.sin(t)]);
  }
  pts.push([cx + rx, y0]);
  return pts;
}

/** A row of icing drips hanging under y from x0 to x1. */
function drips(x0: number, x1: number, y: number, n: number, deep: number): Pt[] {
  const pts: Pt[] = [[x0 - 2, y - 8]];
  const step = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step;
    const dd = deep * (i % 2 ? 0.7 : 1) * (0.85 + 0.15 * Math.sin(i * 1.7));
    pts.push([x, y], [x + step * 0.25, y + dd * 0.4], [x + step * 0.45, y + dd], [x + step * 0.65, y + dd * 0.4], [x + step, y]);
  }
  pts.push([x1 + 2, y - 8]);
  return pts;
}

/** The candle positions on the cake's top (bases), left to right. */
const CAKE_CANDLES: Pt[] = [[102, 92], [126, 84], [150, 94], [174, 84], [198, 92]];

/**
 * The birthday cake, 300 × 260: a big round two-tier cake on a china plate,
 * the bottom tier pink with white drips, piped swags and five cherries, the
 * top tier white with pink drips and a pink top (its top surface centre at
 * (150, 88)). Plate bottom at y 254.
 *
 * Parts: `candles` holds five cream-and-gold candles (the best ones from the
 * candle tree), each its own part `candle1` … `candle5` left to right, so
 * they can be faded in one at a time as they are put on (set them to
 * opacity 0 first for a cake with no candles). `flames` (hidden: opacity 0)
 * holds the five flames with their soft glows, each its own part `flame1` …
 * `flame5` with its origin at the wick, for a gentle flicker; fade `flames`
 * in to light them and out to blow them out.
 */
export const birthdayCake = cached((): string => {
  const candle = (i: number): Node => {
    const [x, y] = CAKE_CANDLES[i];
    return group({ part: `candle${i + 1}` }, [
      piece(rect(x - 5, y - 40, 10, 40, 2.5), '#fff3d6', { edge: 'cut', fibre: false, shadow: true }),
      ...stripes(x, y - 40, y, 10, C.gold, 9),
      ink([[x, y - 40], [x + 0.6, y - 47]], { width: 1.8, color: C.ink, wobble: 0.1 }),
    ]);
  };
  const flame = (i: number): Node => {
    const [x, y] = CAKE_CANDLES[i];
    const t = y - 46;
    return group({ part: `flame${i + 1}`, origin: [x, t + 2] }, [
      piece(circle(x, t - 10, 20), '#ffe9a0', { ...flat, opacity: 0.3 }),
      piece(curve([[x, t - 26], [x + 8, t - 12], [x + 7, t - 1], [x, t + 3], [x - 7, t - 1], [x - 8, t - 12]], 2), C.flame, { edge: 'cut', fibre: false, shadow: false }),
      piece(curve([[x, t - 14], [x + 4, t - 6], [x, t], [x - 4, t - 6]], 2), C.lemon, flat),
    ]);
  };
  return svg({ w: 300, h: 260, name: 'wishing-birthday-cake', className: 'prop' }, [
    // the plate, with a blue rim line
    piece(ellipse(150, 240, 144, 16), C.china, { edge: 'cut', fibre: false }),
    ink([[12, 242], [80, 252], [150, 254], [220, 252], [288, 242]], { width: 2, color: C.chinaBlue, opacity: 0.6, wobble: 0.2 }),
    // the bottom tier: pink, a darker shaded right side, white drips and swags
    piece(drum(150, 124, 154, 222, 18), PINK, { edge: 'cut' }),
    piece(poly([[234, 158], [274, 154], [274, 222], [266, 232], [234, 238]]), PINK_DARK, { ...flat, opacity: 0.45 }),
    piece(ellipse(150, 154, 124, 20), WHITE, { edge: 'cut', fibre: false, shadow: false }),
    piece(drips(26, 274, 166, 10, 22), WHITE, { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2, 3].map((i) => ink([[60 + i * 45, 190], [72 + i * 45, 204], [94 + i * 45, 206], [105 + i * 45, 190]], { width: 3.2, color: WHITE, wobble: 0.2 })),
    ...[60, 105, 150, 195, 240].flatMap((x) => [
      piece(circle(x, 190, 7), C.cherry, { edge: 'cut', fibre: false }),
      dot(x - 2.4, 187.6, 2, '#ffffff', 0.6),
    ]),
    // a row of white piped pearls round the bottom
    ...Array.from({ length: 13 }, (_, i) => {
      const a = Math.PI - (i / 12) * Math.PI;
      return dot(150 + 120 * Math.cos(a), 224 + 16 * Math.sin(a), 5, WHITE);
    }),
    // the top tier: white, with pink drips and a pink top
    piece(drum(150, 80, 90, 146, 14), WHITE, { edge: 'cut' }),
    piece(poly([[204, 94], [230, 92], [230, 146], [222, 154], [204, 158]]), '#e8dcd8', { ...flat, opacity: 0.6 }),
    piece(ellipse(150, 90, 80, 14), PINK, { edge: 'cut', fibre: false, shadow: false }),
    piece(drips(70, 230, 98, 7, 18), PINK, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(138, 86, 40, 5), '#ffffff', { ...flat, opacity: 0.35 }),
    // hundreds-and-thousands on the top tier
    ...[[88, 124], [112, 136], [140, 126], [168, 138], [194, 124], [214, 134], [128, 144], [182, 148]].map(([x, y], i) =>
      piece(ellipse(x, y, 4, 1.4, i * 47), [C.toyBlue, C.toyYellow, C.mint, C.lilac][i % 4], flat)),

    group({ part: 'candles' }, CAKE_CANDLES.map((_, i) => candle(i))),
    group({ part: 'flames', opacity: 0 }, CAKE_CANDLES.map((_, i) => flame(i))),
  ]);
});

/**
 * One loose birthday candle, 60 × 140, standing upright: cream with gold
 * stripes (one of the best ones from the top of the candle tree), with its
 * little green leaf-cup still on the bottom (y 120-136) and a twinkle. The
 * wick tip is at (30, 30). Part `flame` (hidden: opacity 0, origin at the
 * wick) lights it.
 */
export const candle = cached((): string =>
  svg({ w: 60, h: 140, name: 'wishing-candle', className: 'prop' }, [
    piece(circle(30, 76, 28), '#fff4c8', { ...flat, opacity: 0.35 }),
    piece(rect(21, 40, 18, 88, 4), '#fff3d6', { edge: 'cut', fibre: false }),
    ...stripes(30, 40, 128, 18, C.gold, 14),
    piece(rect(34, 44, 4, 80, 2), '#000000', { ...flat, opacity: 0.06 }),
    ink([[30, 40], [31, 30]], { width: 2.6, color: C.ink, wobble: 0.1 }),
    // the leaf-cup it grew in, with a bit of stalk
    piece(curve([[8, 118], [18, 136], [42, 136], [52, 118], [36, 126], [24, 126]], 1), C.leafDark, { edge: 'cut', fibre: false }),
    piece(ellipse(14, 121, 9, 4, 30), C.leaf, flat),
    ink([[30, 136], [32, 140]], { width: 3, color: C.leafDark }),
    // a twinkle
    ink([[42, 30], [54, 30]], { width: 1.8, color: '#fffbe8', wobble: 0 }),
    ink([[48, 24], [48, 36]], { width: 1.8, color: '#fffbe8', wobble: 0 }),
    dot(48, 30, 2, '#ffffff'),
    group({ part: 'flame', opacity: 0, origin: [30, 30] }, [
      piece(circle(30, 16, 16), '#ffe9a0', { ...flat, opacity: 0.35 }),
      piece(curve([[30, 0], [39, 14], [38, 25], [30, 30], [22, 25], [21, 14]], 2), C.flame, { edge: 'cut', fibre: false, shadow: false }),
      piece(curve([[30, 13], [34, 21], [30, 28], [26, 21]], 2), C.lemon, flat),
    ]),
  ]),
);

/**
 * A paper chain, 600 × 120: interlocking loops of coloured paper (red,
 * yellow, blue, green, pink, purple) swagging in one curve from a drawing
 * pin at each top corner (8, 12) and (592, 12) down to about y 96 in the
 * middle. Hang it across a room; it reads at w 400-700.
 */
export const paperChain = cached((): string => {
  const cols = [C.coatRed, C.toyYellow, C.toyBlue, C.toyGreen, C.raspberry, C.violet];
  const at = (t: number): Pt => [10 + 580 * t, 14 + 82 * 4 * t * (1 - t)];
  const n = 26;
  const back: Node[] = [];
  const front: Node[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [x, y] = at(t);
    const [x2, y2] = at(Math.min(1, t + 0.01));
    const [x1, y1] = at(Math.max(0, t - 0.01));
    const rot = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const col = cols[i % cols.length];
    if (i % 2 === 0) {
      // a face-on loop: a ring of paper, two overlapping arcs
      const arc = (a0: number, a1: number): Pt[] => {
        const pts: Pt[] = [];
        const c = Math.cos((rot * Math.PI) / 180);
        const s = Math.sin((rot * Math.PI) / 180);
        for (let a = a0; a <= a1; a += 15) {
          const u = Math.cos((a * Math.PI) / 180) * 15;
          const v = Math.sin((a * Math.PI) / 180) * 10;
          pts.push([x + u * c - v * s, y + u * s + v * c]);
        }
        return pts;
      };
      back.push(piece(band(arc(-10, 190), 6), col, { edge: 'cut', fibre: false, shadow: true }));
      back.push(piece(band(arc(170, 370), 6), col, { edge: 'cut', fibre: false, shadow: true }));
    } else {
      // an edge-on loop threaded through its neighbours: a slim oval
      front.push(piece(ellipse(x, y, 16, 5, rot), col, { edge: 'cut', fibre: false, shadow: true }));
      front.push(ink([[x - 12 * Math.cos((rot * Math.PI) / 180), y - 12 * Math.sin((rot * Math.PI) / 180)], [x + 12 * Math.cos((rot * Math.PI) / 180), y + 12 * Math.sin((rot * Math.PI) / 180)]], { width: 1.4, color: '#000000', opacity: 0.25, wobble: 0.1 }));
    }
  }
  return svg({ w: 600, h: 120, name: 'wishing-paper-chain', className: 'prop' }, [
    ...back,
    ...front,
    ...[8, 592].flatMap((x) => [piece(circle(x, 12, 7), C.brass, { edge: 'cut', fibre: false }), dot(x - 2, 10, 2, '#ffffff', 0.6)]),
  ]);
});
