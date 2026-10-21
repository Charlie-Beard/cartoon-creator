/**
 * The Toymaker's doll's house, in the Teddy Bear Treasury's watercolour and
 * ink: a red-brick Georgian house in three storeys (the title page of "The
 * Doll's House"), the same house swollen by the rain, and the same house
 * turned into a bird house for the hospital wall.
 *
 *   dolls-house         260 × 300   standing on its base: bottom edge y 300 is
 *                                   the bench top. Part 'fresh' (hidden,
 *                                   opacity 0): the last bit of paint, a bright
 *                                   wet blue door, shutters, window frames and
 *                                   sills, drawn exactly over the bare-wood
 *                                   door and shutters underneath. Fade it in.
 *   dolls-house-warped  300 × 300   after the rain: each storey has swollen
 *                                   and slipped, dark gaps between them and at
 *                                   the corners, the roof askew, two floor-
 *                                   boards sticking out (left, between the
 *                                   middle and ground floor; right, between the
 *                                   top and middle floor), drips. The door and
 *                                   shutters are already painted blue.
 *   bird-house          280 × 300   the house made over: windows and door are
 *                                   open dark holes, a thick overhanging roof,
 *                                   two twig perches, a feeding ledge (x 30–250,
 *                                   top at y 262) and two iron hooks under it.
 *                                   No birds in it (they are their own prop).
 *
 * No moving parts except 'fresh'. All three share one set of helpers so they
 * are plainly the same house: the same brick, slate, cream trim and blue.
 */
import { cached, circle, dot, ellipse, group, rect, svg, band, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';

const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

const BRICK = '#cf7b55';
const SLATE = '#7c8795';
const CREAM = '#fbf8f0';
const SHADE = '#cfd9e6';
const GLASS = '#a9bfd0';
const BARE = '#d9bd8e';
const BLUE = '#3f82c8';
const STONE = '#d6cdb9';
const BRASS = '#d6aa43';
const DARK = '#33261f';
const WOOD = '#b98a52';
const IRON = '#59616b';

type T = (p: Pt) => Pt;
const ID: T = (p) => p;

/** Adds points along every edge so a bend or lean follows the whole wall, not just its corners. */
function sub(pts: Pt[], step = 10, closed = true): Pt[] {
  const out: Pt[] = [];
  const n = pts.length;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 0; k < m; k++) out.push([a[0] + ((b[0] - a[0]) * k) / m, a[1] + ((b[1] - a[1]) * k) / m]);
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

/** A storey's transform: slip sideways/down, lean, and swell its walls outward (all 0 for a sound house). */
const storey = (dx: number, dy: number, deg: number, bulge: number, y0: number, y1: number): T => (p) => {
  const [x, y] = p;
  const ym = (y0 + y1) / 2;
  const t = Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
  const k = Math.max(-1, Math.min(1, (x - 130) / 96));
  const bx = x + k * bulge * Math.sin(Math.PI * t);
  const a = (deg * Math.PI) / 180;
  const ox = bx - 130;
  const oy = y - ym;
  return [130 + ox * Math.cos(a) - oy * Math.sin(a) + dx, ym + ox * Math.sin(a) + oy * Math.cos(a) + dy];
};
/** The same, for the roof and chimneys, about the roof's foot. */
const rotAbout = (dx: number, dy: number, deg: number, cx = 130, cy = 98): T => (p) => {
  const a = (deg * Math.PI) / 180;
  const ox = p[0] - cx;
  const oy = p[1] - cy;
  return [cx + ox * Math.cos(a) - oy * Math.sin(a) + dx, cy + ox * Math.sin(a) + oy * Math.cos(a) + dy];
};

const rectS = (t: T, x: number, y: number, w: number, h: number): Pt[] => sub(P(x, y, x + w, y, x + w, y + h, x, y + h)).map(t);
const archS = (t: T, x: number, y: number, w: number, h: number): Pt[] => {
  const r = w / 2;
  const pts: Pt[] = [[x, y + h], [x, y + r]];
  for (let i = 1; i < 8; i++) {
    const a = Math.PI + (Math.PI * i) / 8;
    pts.push([x + r + r * Math.cos(a), y + r + r * Math.sin(a)]);
  }
  pts.push([x + w, y + r], [x + w, y + h]);
  return sub(pts).map(t);
};
const shapeS = (t: T, x: number, y: number, w: number, h: number, arched: boolean): Pt[] => (arched ? archS(t, x, y, w, h) : rectS(t, x, y, w, h));
const lineS = (t: T, ...n: number[]): Pt[] => sub(P(...n), 9, false).map(t);

const sheen = (pts: Pt[], a = 0.55): Node => blot(pts, '#ffffff', a);

// ---------------------------------------------------------------------------
// The house, in pieces (shared by the sound and the swollen house)
// ---------------------------------------------------------------------------

const TIERS = [
  { y0: 92, wy: 104, wh: 42, arch: false },
  { y0: 156, wy: 168, wh: 42, arch: true },
  { y0: 220, wy: 236, wh: 38, arch: false },
];
const WX = [66, 166];
const WW = 28;

function windowNodes(t: T, x: number, y: number, w: number, h: number, arched: boolean): Node[] {
  return [
    wash(shapeS(t, x - 3, y - 3, w + 6, h + 6, arched), CREAM, { shade: SHADE, depth: 0.2, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    wash(shapeS(t, x, y, w, h, arched), GLASS, { shade: deeper(GLASS, 0.3), depth: 0.3, bloom: false, lineWidth: 1.4, wobble: 0.4 }),
    sheen(ellipse(x + 8, y + h * 0.4, 2.6, 8, 15).map(t)),
    pen(lineS(t, x + w / 2, y, x + w / 2, y + h), { width: 1.4, color: '#6b5b50', breaks: 0 }),
    pen(lineS(t, x, y + h * 0.45, x + w, y + h * 0.45), { width: 1.4, color: '#6b5b50', breaks: 0 }),
    wash(rectS(t, x - 6, y + h + 3, w + 12, 5), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.6, wobble: 0.4 }),
  ];
}

/** Shutters either side of a window: bare wood, plain blue, or wet blue paint. */
function shutterNodes(t: T, x: number, y: number, w: number, h: number, mode: 'bare' | 'blue' | 'wet'): Node[] {
  const col = mode === 'bare' ? BARE : BLUE;
  const out: Node[] = [];
  for (const sx of [x - 12, x + w + 3]) {
    out.push(wash(rectS(t, sx, y - 2, 9, h + 4), col, { shade: deeper(col, 0.3), depth: 0.4, bloom: false, lineWidth: 1.6, wobble: 0.4 }));
    for (let k = 1; k < 5; k++) {
      const yy = y - 2 + ((h + 4) * k) / 5;
      out.push(pen(lineS(t, sx + 1, yy, sx + 8, yy), { width: 1, color: deeper(col, 0.55), opacity: 0.7, breaks: 0 }));
    }
    if (mode === 'wet') out.push(sheen(ellipse(sx + 3, y + h * 0.3, 1.6, 8).map(t), 0.7));
  }
  return out;
}

/** Window frames and sills painted blue (the wet paint, or the dry paint after the rain). */
function frameNodes(t: T, x: number, y: number, w: number, h: number, arched: boolean): Node[] {
  return [
    pen(shapeS(t, x - 3, y - 3, w + 6, h + 6, arched), { closed: true, color: BLUE, width: 3.2, breaks: 0, taper: false, wobble: 0.3 }),
    wash(rectS(t, x - 6, y + h + 3, w + 12, 5), BLUE, { shade: deeper(BLUE, 0.3), depth: 0.4, bloom: false, lineWidth: 1.6, wobble: 0.4 }),
  ];
}

function doorNodes(t: T, mode: 'bare' | 'blue' | 'wet'): Node[] {
  const col = mode === 'bare' ? BARE : BLUE;
  const arc: Pt[] = [];
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI + (Math.PI * i) / 8;
    arc.push([130 + 14 * Math.cos(a), 234 + 14 * Math.sin(a)]);
  }
  const out: Node[] = [];
  if (mode === 'bare' || mode === 'blue') {
    out.push(wash(rectS(t, 108, 214, 44, 70), CREAM, { shade: SHADE, depth: 0.2, bloom: false, lineWidth: 2, wobble: 0.6 }));
    out.push(wash(sub(arc).map(t), GLASS, { shade: deeper(GLASS, 0.3), depth: 0.3, bloom: false, lineWidth: 1.4, wobble: 0.4 }));
    for (const i of [2, 4, 6]) out.push(pen(lineS(t, 130, 234, arc[i][0], arc[i][1]), { width: 1.2, color: '#6b5b50', breaks: 0 }));
  }
  out.push(wash(rectS(t, 116, 236, 28, 48), col, { shade: deeper(col, 0.3), depth: 0.3, bloom: false, lineWidth: 1.8, wobble: 0.5 }));
  out.push(pen(rectS(t, 121, 241, 18, 16), { closed: true, color: deeper(col, 0.5), width: 1.2, breaks: 0, taper: false }));
  out.push(pen(rectS(t, 121, 262, 18, 18), { closed: true, color: deeper(col, 0.5), width: 1.2, breaks: 0, taper: false }));
  const [kx, ky] = t([139, 264]);
  out.push(dot(kx, ky, 2.3, BRASS), dot(kx - 0.6, ky - 0.7, 0.8, '#fff3c4'));
  if (mode === 'wet') {
    out.push(sheen(ellipse(122, 250, 2.6, 12, 4).map(t), 0.7), sheen(ellipse(125, 271, 2.2, 6, 4).map(t), 0.6));
    out.push(pen(lineS(t, 134, 281, 134, 287), { width: 2.4, color: BLUE, breaks: 0 }));
    const [dx, dy] = t([134, 289]);
    out.push(dot(dx, dy, 2.4, BLUE), dot(dx - 0.7, dy - 0.8, 0.8, '#ffffff'));
  }
  return out;
}

function stepsNodes(t: T): Node[] {
  return [
    wash(rectS(t, 100, 284, 60, 8), STONE, { shade: deeper(STONE, 0.3), depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    wash(rectS(t, 92, 292, 76, 8), STONE, { shade: deeper(STONE, 0.3), depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
  ];
}

/** One storey: brick wall, string course, windows with their shutters (and the door on the ground floor). */
function tierNodes(t: T, i: number, mode: 'bare' | 'blue'): Node[] {
  const d = TIERS[i];
  const wall = rectS(t, 34, d.y0, 192, 64);
  const bricks: Node[] = [];
  for (let r = 0; r < 8; r++) {
    const ya = d.y0 + r * 8;
    if (r > 0) bricks.push(pen(lineS(t, 36, ya, 224, ya), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.35, breaks: 0, wobble: 0.3 }));
    for (let x = 40 + (r % 2) * 12; x < 224; x += 24) bricks.push(pen(lineS(t, x, ya, x, ya + 8), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.35, breaks: 0, wobble: 0.3 }));
  }
  const out: Node[] = [
    wash(wall, BRICK, { shade: deeper(BRICK, 0.3), depth: 0.2, bloom: false, lineWidth: 2.4, wobble: 0.8 }),
    clipped(wall, bricks),
  ];
  if (i > 0) out.push(wash(rectS(t, 30, d.y0, 200, 5), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }));
  for (const x of WX) {
    out.push(...windowNodes(t, x, d.wy, WW, d.wh, d.arch));
    out.push(...shutterNodes(t, x, d.wy, WW, d.wh, mode));
    if (mode === 'blue') out.push(...frameNodes(t, x, d.wy, WW, d.wh, d.arch));
  }
  if (i === 2) out.push(...doorNodes(t, mode), ...stepsNodes(t));
  return out;
}

/** Chimneys and the grey scalloped slate roof. */
function roofNodes(t: T): Node[] {
  const chimney = (x: number): Node[] => [
    wash(rectS(t, x, 22, 22, 34), BRICK, { shade: deeper(BRICK, 0.3), depth: 0.3, bloom: false, lineWidth: 2.2, wobble: 0.6 }),
    wash(rectS(t, x - 3, 18, 28, 7), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    pen(lineS(t, x + 2, 34, x + 20, 34), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.4, breaks: 0 }),
    pen(lineS(t, x + 2, 44, x + 20, 44), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.4, breaks: 0 }),
  ];
  const roof = sub(P(22, 98, 54, 40, 206, 40, 238, 98)).map(t);
  const scallops: Node[] = [];
  for (let r = 0; r < 6; r++) {
    const y = 48 + r * 9;
    for (let x = 14 + (r % 2) * 6; x < 240; x += 12) scallops.push(pen(sub(P(x, y, x + 6, y + 5, x + 12, y), 4, false).map(t), { width: 1.1, color: deeper(SLATE, 0.55), opacity: 0.55, breaks: 0 }));
  }
  return [
    ...chimney(76),
    ...chimney(162),
    wash(roof, SLATE, { shade: deeper(SLATE, 0.3), depth: 0.25, bloom: false, lineWidth: 2.6, wobble: 0.8 }),
    clipped(roof, scallops),
    wash(rectS(t, 20, 94, 220, 6), deeper(SLATE, 0.25), { shade: false, bloom: false, lineWidth: 2, wobble: 0.5 }),
    pen(lineS(t, 56, 41, 204, 41), { width: 2, color: deeper(SLATE, 0.6), breaks: 0 }),
  ];
}

const plinth = (t: T): Node =>
  wash(rectS(t, 14, 284, 232, 16), STONE, { shade: deeper(STONE, 0.3), depth: 0.35, bloom: false, lineWidth: 2.4, wobble: 0.7 });

// ---------------------------------------------------------------------------
// 1. The house on the bench
// ---------------------------------------------------------------------------

const dollsHouse = cached(() => {
  const fresh: Node[] = [];
  TIERS.forEach((d, i) => {
    for (const x of WX) {
      fresh.push(...shutterNodes(ID, x, d.wy, WW, d.wh, 'wet'), ...frameNodes(ID, x, d.wy, WW, d.wh, d.arch));
    }
    if (i === 2) fresh.push(...doorNodes(ID, 'wet'));
  });
  return svg({ w: 260, h: 300, name: 'bears-dolls-house' }, [
    plinth(ID),
    ...tierNodes(ID, 0, 'bare'),
    ...tierNodes(ID, 1, 'bare'),
    ...tierNodes(ID, 2, 'bare'),
    ...roofNodes(ID),
    group({ part: 'fresh', opacity: 0 }, fresh),
  ]);
});

// ---------------------------------------------------------------------------
// 2. After the rain
// ---------------------------------------------------------------------------

const dollsHouseWarped = cached(() => {
  const t0 = storey(30, -7, 3.5, 7, 92, 156);
  const t1 = storey(12, -3, -2.5, 9, 156, 220);
  const t2 = storey(23, 0, 1.5, 6, 220, 284);
  const roofT = rotAbout(36, -2, -7);
  const baseT: T = (p) => [p[0] + 20, p[1]];
  const gap = (a: T, b: T, y: number): Node =>
    wash([...sub(P(30, y - 8, 230, y - 8), 12, false).map(a), ...sub(P(230, y + 8, 30, y + 8), 12, false).map(b)], DARK, { line: false, shade: false, bloom: false, wobble: 0.4 });
  const drop = (x: number, y: number): Node[] => [
    pen([[x, y - 15], [x, y - 8]], { width: 1.6, color: '#8aa2bd', opacity: 0.7, breaks: 0 }),
    wash(P(x, y - 7, x + 3.6, y + 1, x, y + 5, x - 3.6, y + 1), '#8fbbe6', { shade: false, bloom: false, lineWidth: 1, wobble: 0.2 }),
    sheen([[x - 1.4, y - 1], [x - 0.4, y + 2], [x - 1.8, y + 2]], 0.9),
  ];
  const plank = (pts: Pt[], endAt: Pt, dir: number): Node[] => [
    wash(band(pts, 9), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.4 }),
    pen(P(pts[0][0] + 6 * dir, pts[0][1] - 1, endAt[0] - 10 * dir, endAt[1] + 1), { width: 1, color: deeper(WOOD, 0.6), opacity: 0.6, breaks: 0 }),
    dot(endAt[0] - 5 * dir, endAt[1] + 0.5, 1.3, deeper(WOOD, 0.7)),
  ];
  const [r1x, r1y] = roofT([70, 100]);
  const [r2x, r2y] = roofT([190, 100]);
  return svg({ w: 300, h: 300, name: 'bears-dolls-house-warped' }, [
    plinth(baseT),
    // dark gaps where the storeys have pulled apart, and under the lifted roof
    gap(t0, t1, 156),
    gap(t1, t2, 220),
    wash([...rectS(t0, 34, 88, 192, 14)], DARK, { line: false, shade: false, bloom: false, wobble: 0.4 }),
    // two floor-boards pushed out through the gaps
    ...plank(P(100, 212, 54, 205, 14, 192), [14, 192], -1),
    ...plank(P(200, 148, 246, 142, 286, 130), [286, 130], 1),
    ...tierNodes(t0, 0, 'blue'),
    ...tierNodes(t1, 1, 'blue'),
    ...tierNodes(t2, 2, 'blue'),
    // cracks at the corners
    wash(P(54, 165, 62, 165, 66, 190, 59, 214, 52, 214), DARK, { line: false, shade: false, bloom: false, wobble: 0.5 }),
    wash(P(246, 100, 238, 100, 234, 126, 240, 148, 248, 148), DARK, { line: false, shade: false, bloom: false, wobble: 0.5 }),
    ...roofNodes(roofT),
    // rain-stained bricks and drips from the eaves
    blot(ellipse(98, 128, 3.5, 14), '#4a5a6e', 0.22),
    blot(ellipse(196, 134, 3.5, 12), '#4a5a6e', 0.22),
    ...drop(r1x, r1y + 4),
    ...drop(r2x, r2y + 4),
    ...drop(90, 266),
    blot(ellipse(150, 296, 40, 3.6), '#8fbbe6', 0.5),
  ]);
});

// ---------------------------------------------------------------------------
// 3. The bird house
// ---------------------------------------------------------------------------

const birdHouse = cached(() => {
  const BX = 44;
  const BW = 192;
  const body = rect(BX, 98, BW, 164);
  const bricks: Node[] = [];
  for (let r = 0; r < 21; r++) {
    const ya = 98 + r * 8;
    if (r > 0) bricks.push(pen(P(BX + 2, ya, BX + BW - 2, ya), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.35, breaks: 0, wobble: 0.3 }));
    for (let x = BX + 6 + (r % 2) * 12; x < BX + BW - 2; x += 24) bricks.push(pen(P(x, ya, x, ya + 8), { width: 1, color: deeper(BRICK, 0.5), opacity: 0.35, breaks: 0, wobble: 0.3 }));
  }
  /** An open hole for birds: cream trim, dark inside, a lighter floor, a little light on the top corner. */
  const hole = (x: number, y: number, w: number, h: number, arched: boolean, trim = CREAM): Node[] => [
    wash(shapeS(ID, x - 4, y - 4, w + 8, h + 7, arched), trim, { shade: trim === CREAM ? SHADE : deeper(trim, 0.3), depth: 0.2, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    wash(shapeS(ID, x, y, w, h, arched), DARK, { shade: false, bloom: false, lineWidth: 1.6, wobble: 0.4 }),
    wash(rectS(ID, x + 2, y + h * 0.7, w - 4, h * 0.3 - 1), '#5d4638', { line: false, shade: false, bloom: false, wobble: 0.3, opacity: 0.8 }),
    blot(ellipse(x + w * 0.3, y + h * 0.3, w * 0.12, h * 0.16), '#8a6e5a', 0.35),
  ];
  const twig = (x0: number, x1: number, y: number, leafX: number): Node[] => [
    pen(P(x0, y + 2, (x0 + x1) / 2, y, x1, y - 2), { width: 4.2, color: '#7b5a3a', breaks: 0 }),
    pen(P(x0 + 8, y + 1, x0 + 14, y - 6), { width: 1.8, color: '#7b5a3a', breaks: 0 }),
    wash(ellipse(leafX, y - 9, 6, 3, -35), '#7fb56f', { shade: deeper('#7fb56f', 0.3), lineWidth: 1.2, bloom: false, depth: 0.4, wobble: 0.3 }),
    dot(x1, y - 2, 2.4, '#5d4228'),
  ];
  const hook = (x: number): Node[] => [
    wash(rect(x - 4, 274, 8, 14), IRON, { shade: deeper(IRON, 0.3), depth: 0.4, bloom: false, lineWidth: 1.6, wobble: 0.3 }),
    pen([...circle(x, 292, 5.5)], { closed: true, color: IRON, width: 3.4, breaks: 0, taper: false, wobble: 0.2 }),
    dot(x, 279, 1.5, '#aab2bb'),
    dot(x, 284, 1.5, '#aab2bb'),
  ];
  const roof = P(16, 100, 52, 32, 228, 32, 264, 100);
  const scallops: Node[] = [];
  for (let r = 0; r < 6; r++) {
    const y = 40 + r * 10;
    for (let x = 10 + (r % 2) * 6; x < 270; x += 12) scallops.push(pen(P(x, y, x + 6, y + 5, x + 12, y), { width: 1.1, color: deeper(SLATE, 0.55), opacity: 0.55, breaks: 0 }));
  }
  const chimney = (x: number): Node[] => [
    wash(rect(x, 12, 22, 34), BRICK, { shade: deeper(BRICK, 0.3), depth: 0.3, bloom: false, lineWidth: 2.2, wobble: 0.6 }),
    wash(rect(x - 3, 8, 28, 7), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
  ];
  return svg({ w: 280, h: 300, name: 'bears-bird-house' }, [
    ...chimney(70),
    ...chimney(188),
    // the brick walls, with the two string courses of the old house
    wash(body, BRICK, { shade: deeper(BRICK, 0.3), depth: 0.2, bloom: false, lineWidth: 2.4, wobble: 0.8 }),
    clipped(body, bricks),
    wash(rect(BX - 4, 152, BW + 8, 5), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    wash(rect(BX - 4, 207, BW + 8, 5), CREAM, { shade: SHADE, depth: 0.4, bloom: false, lineWidth: 1.8, wobble: 0.5 }),
    // top floor: two small round-cornered holes; middle: two arched; ground: two windows and the door
    ...hole(74, 108, 28, 34, false),
    ...hole(178, 108, 28, 34, false),
    ...hole(74, 164, 28, 34, true),
    ...hole(178, 164, 28, 34, true),
    ...hole(74, 220, 28, 32, false),
    ...hole(178, 220, 28, 32, false),
    ...hole(120, 214, 40, 48, true, BLUE),
    // twig perches under the middle holes
    ...twig(68, 112, 207, 100),
    ...twig(168, 212, 207, 200),
    // the thick overhanging roof: slate, a heavy wooden edge, and its shadow on the wall
    blot(ellipse(140, 118, 96, 7), '#3a2a1f', 0.3),
    wash(rect(12, 98, 256, 14, 3), deeper(WOOD, 0.1), { shade: deeper(WOOD, 0.4), depth: 0.4, hatch: 6, lineWidth: 2.4, wobble: 0.6 }),
    wash(roof, SLATE, { shade: deeper(SLATE, 0.3), depth: 0.25, bloom: false, lineWidth: 2.6, wobble: 0.8 }),
    clipped(roof, scallops),
    wash(rect(48, 27, 184, 7, 2), deeper(SLATE, 0.25), { shade: false, bloom: false, lineWidth: 2, wobble: 0.5 }),
    // the feeding ledge, top at y 262, and the iron hooks that hold it to the wall
    ...hook(76),
    ...hook(204),
    wash(P(30, 262, 250, 262, 254, 276, 26, 276), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, hatch: 6, lineWidth: 2.4, wobble: 0.5 }),
    pen(P(40, 268, 140, 270, 240, 268), { width: 1.2, color: deeper(WOOD, 0.6), opacity: 0.5, breaks: 0.2 }),
    sheen(ellipse(110, 265, 50, 1.6), 0.4),
    dot(36, 269, 1.4, '#5d4228'),
    dot(244, 269, 1.4, '#5d4228'),
  ]);
});

export const dollsHouses: Record<string, () => string> = {
  'dolls-house': dollsHouse,
  'dolls-house-warped': dollsHouseWarped,
  'bird-house': birdHouse,
};
