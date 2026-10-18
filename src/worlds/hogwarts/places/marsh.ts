/**
 * A misty bog at the end of the course, late afternoon (Lupin's exam).
 *
 * What is drawn, back to front: a dull golden sky with a low pale sun; a
 * far dark-green line of reeds and stumpy willows; long soft mist bands;
 * boggy ground of olive and green-brown with dark pools of bog water (each
 * with a dull sheen and a few lily-leaf scraps); tall reeds and bulrushes
 * (brown sausage heads) clumped at the back and sides; and a raised grassy
 * PATH with flat stepping stones that winds from the LEFT FRONT to the
 * RIGHT BACK.
 *
 * The path's centre line, left to right, in stage coordinates:
 *   (-20, 672)  (170, 668)  (330, 648)  (480, 632)  (620, 596)  (760, 572)  (900, 520)  (1060, 498)  (1220, 470)
 * It is about 110 px deep (top to bottom edge) at the left front, narrowing
 * to about 40 px at the right back. Actors on the path: stand them so their feet are on the
 * centre line (x 120 at y 669, x 330 at y 648, x 480 at y 632, x 620 at y 596 and so on).
 * Room for 3 actors at the left and middle, x 100 to 650, feet y 610 to 668.
 * The right part of the path climbs away into the distance: small things
 * only (a far Hinkypunk, a lantern light) there.
 *
 * Layout: ground line at the front about y 660. Bog pools: back left
 * (x 60 to 380, y 500 to 580), a big one front right (x 700 to 1160, y 640
 * to 690, kept above the caption band), a mid one right of centre (x 560 to
 * 780, y 590 to 640) and small ones at the left. The bottom band y 700 to
 * 820 is plain dull olive turf. Reeds only stand at y < 640 (except the
 * edge clumps at x < 60 and x > 1130). No mist below y 690.
 */
import { C } from '../../../art/palette';
import { curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const BOG = '#6f7440';
const BOG_FAR = '#7d8650';
const TURF = '#7a8447';
const POOL = '#34473f';
const POOL_SHEEN = '#587265';
const PATH = '#97a355';
const PATH_EDGE = '#6e7c3d';
const REED_DARK = '#4a5a30';
const REED = '#677a3c';
const REED_LIGHT = '#8c9b55';

/** The path centre line (kept in step with the header comment). */
const SPINE: Pt[] = [[-20, 672], [170, 668], [330, 648], [480, 632], [620, 596], [760, 572], [900, 520], [1060, 498], [1220, 470]];

/** Where the spine is at x, by straight lines between its points. */
function spineY(x: number): number {
  for (let k = 0; k < SPINE.length - 1; k++) {
    const [x0, y0] = SPINE[k];
    const [x1, y1] = SPINE[k + 1];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return SPINE[SPINE.length - 1][1];
}

/** The path outline: the spine pushed up and down by a half-depth that narrows to the back. */
function pathOutline(extra = 0): Pt[] {
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let x = -20; x <= 1220; x += 30) {
    const t = (x + 20) / 1240;
    const hd = 55 - t * 35 + extra;
    const y = spineY(x);
    top.push([x, y - hd]);
    bottom.push([x, y + hd]);
  }
  return [...top, ...bottom.reverse()];
}

/** A tuft of tall reeds: several leaning blades. */
function reeds(x: number, base: number, h: number, n: number, seed: number, cols = [REED_DARK, REED, REED_LIGHT]): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const bx = x + (i - (n - 1) / 2) * 9 + (r() - 0.5) * 6;
    const lean = (r() - 0.5) * 36;
    const hh = h * (0.7 + r() * 0.4);
    out.push(ink([[bx, base], [bx + lean * 0.4, base - hh * 0.55], [bx + lean, base - hh]], { width: 3.4, color: cols[i % cols.length], wobble: 0.5 }));
  }
  return out;
}

/** A bulrush: a thin stalk with a brown sausage head, and a couple of leaves. */
function bulrush(x: number, base: number, h: number, lean: number): Node[] {
  const tipX = x + lean;
  const tipY = base - h;
  return [
    ink([[x, base], [x + lean * 0.4, base - h * 0.55], [tipX, tipY]], { width: 3.4, color: REED, wobble: 0.4 }),
    ink([[x + 4, base], [x + 22, base - h * 0.5]], { width: 3, color: REED_DARK, wobble: 0.4 }),
    piece(ellipse(tipX, tipY - 14, 6, 17, lean * 0.02), C.brownDark, { rough: 0.5, shadow: false }),
    ink([[tipX, tipY - 34], [tipX, tipY - 40]], { width: 2.2, color: C.brown }),
  ];
}

/** A soft band of mist. */
function mist(cx: number, cy: number, rx: number, ry: number, op: number): Node {
  return piece(ellipse(cx, cy, rx, ry), '#f1e8c8', { rough: 1.6, shadow: false, opacity: op });
}

/** A dark bog pool with a dull sheen and a couple of leaf scraps. */
function pool(cx: number, cy: number, rx: number, ry: number, seed: number): Node[] {
  const r = rng(seed);
  return [
    piece(ellipse(cx, cy, rx + 8, ry + 4), PATH_EDGE, { rough: 1.3, shadow: false }),
    piece(ellipse(cx, cy, rx, ry), POOL, { rough: 1.1, shadow: false }),
    piece(ellipse(cx - rx * 0.18, cy - ry * 0.22, rx * 0.55, ry * 0.3), POOL_SHEEN, { rough: 1.2, shadow: false, opacity: 0.7 }),
    ...[0, 1].map((i) => piece(ellipse(cx + (r() - 0.5) * rx * 1.1, cy + (r() - 0.3) * ry * 0.6, 9 + i * 3, 3.5), '#6f8a4c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 })),
  ];
}

/** The bog at the end of the course: reeds, pools, mist and a stepping-stone path. */
export function marsh(): string {
  const r = rng(4417);
  const stones: Node[] = [];
  // flat stepping stones laid along the path spine, bigger at the front
  for (let i = 0; i < 17; i++) {
    const t = i / 16;
    const sx = -10 + t * 1190;
    // find the spine y by linear interpolation
    const sy = spineY(sx) + (i % 2 ? 6 : -6) * (1 - t);
    const w = 34 - t * 18;
    const h = 11 - t * 5;
    stones.push(piece(ellipse(sx, sy, w, h, (r() - 0.5) * 0.1), i % 3 ? '#a6a395' : '#8e8d82', { rough: 0.8, shadow: false }));
    stones.push(piece(ellipse(sx - w * 0.15, sy - h * 0.25, w * 0.6, h * 0.4), '#c3bfae', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
  }
  const bgReeds: Node[] = [];
  for (let i = 0; i < 26; i++) bgReeds.push(...reeds(i * 48 + r() * 20, 470 + r() * 24, 70 + r() * 40, 4, 100 + i, ['#4d5a3c', '#566444', '#5f6d49']));
  const midReeds: Node[] = [];
  [[40, 590], [100, 560], [170, 530], [260, 512], [340, 540], [430, 520], [610, 536], [700, 506], [790, 500], [880, 470], [980, 464], [1090, 452]].forEach(([x, y], i) => {
    midReeds.push(...reeds(x, y, 90 + (i % 3) * 22, 5, 300 + i));
  });
  const bulrushes: Node[] = [
    ...bulrush(52, 590, 150, 8), ...bulrush(124, 556, 120, -6), ...bulrush(236, 520, 100, 6),
    ...bulrush(404, 536, 110, -8), ...bulrush(668, 528, 120, 7), ...bulrush(836, 490, 100, -6),
    ...bulrush(1000, 476, 90, 6),
  ];
  const edgeReeds: Node[] = [
    ...reeds(14, 700, 170, 7, 700), ...bulrush(30, 706, 210, 10), ...bulrush(58, 700, 160, -8),
    ...reeds(1160, 690, 190, 7, 710), ...bulrush(1140, 698, 220, -10), ...bulrush(1118, 690, 150, 8),
  ];
  return svg({ w: 1180, h: 820, name: 'hogwarts-marsh', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#d3ac66', { edge: 'clean', shadow: false }),
    piece(rect(-20, 150, 1220, 190), '#dfc07f', { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(rect(-20, 300, 1220, 200), '#e8d19a', { edge: 'clean', shadow: false, opacity: 0.8 }),
    // a low, pale sun in the haze, right of centre
    piece(ellipse(820, 330, 110, 110), '#f3e2ae', { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(ellipse(820, 330, 54, 54), '#f6e8b8', { rough: 0.6, shadow: false, opacity: 0.9 }),
    // a few dull streaky clouds
    piece(ellipse(260, 140, 200, 14), '#c59a58', { rough: 1.6, shadow: false, opacity: 0.55 }),
    piece(ellipse(900, 90, 240, 12), '#c59a58', { rough: 1.6, shadow: false, opacity: 0.5 }),
    piece(ellipse(560, 230, 160, 10), '#c59a58', { rough: 1.6, shadow: false, opacity: 0.45 }),
    // far low land with stumpy dark willows
    piece(curve([[-40, 520], [-40, 420], [240, 398], [560, 418], [860, 396], [1220, 412], [1220, 520]], 2), '#6a7352', { rough: 1.4, shadow: false, opacity: 0.85 }),
    ...[[90, 410, 34], [200, 404, 26], [430, 410, 30], [980, 400, 36], [1100, 404, 28]].map(([x, y, s]) =>
      piece(curve([[x - s * 1.3, y + 30], [x - s, y - s * 0.4], [x, y - s], [x + s, y - s * 0.4], [x + s * 1.3, y + 30]], 2), '#4f5a3d', { rough: 1.3, shadow: false, opacity: 0.85 }),
    ),
    mist(300, 430, 380, 22, 0.55),
    mist(900, 420, 340, 18, 0.5),
    // boggy ground
    piece(curve([[-40, 600], [-40, 466], [300, 448], [640, 470], [940, 440], [1220, 456], [1220, 600]], 2), BOG_FAR, { rough: 1.4, shadow: false }),
    ...bgReeds,
    mist(560, 490, 560, 22, 0.6),
    piece(curve([[-40, 700], [-40, 520], [300, 500], [640, 528], [940, 492], [1220, 508], [1220, 700]], 2), BOG, { rough: 1.5, shadow: false }),
    // dark pools
    ...pool(230, 548, 160, 26, 11),
    ...pool(940, 566, 130, 20, 12),
    ...pool(150, 620, 70, 12, 13),
    ...pool(680, 618, 100, 16, 14),
    // reeds and bulrushes behind the path
    ...midReeds,
    ...bulrushes,
    mist(420, 560, 420, 22, 0.55),
    mist(960, 540, 300, 18, 0.55),
    // the near turf, and the big front-right pool above the caption band
    piece(curve([[-40, 860], [-40, 650], [300, 664], [640, 676], [980, 660], [1220, 668], [1220, 860]], 2), TURF, { rough: 1.5, shadow: false }),
    ...pool(930, 664, 210, 22, 15),
    // the raised grassy path with its edge shadow, then the stepping stones
    piece(poly(pathOutline(10)), PATH_EDGE, { rough: 1.3, shadow: false }),
    piece(poly(pathOutline()), PATH, { rough: 1.2, shadow: false }),
    piece(poly(pathOutline(-22)), '#a8b365', { rough: 1.2, shadow: false, opacity: 0.7 }),
    ...stones,
    // front plain turf strip for the caption band
    piece(curve([[-40, 860], [-40, 726], [400, 716], [820, 730], [1220, 716], [1220, 860]], 2), '#80894c', { rough: 1.6, shadow: false }),
    // clumps at the very edges, kept out of the middle
    ...edgeReeds,
    // soft mist drifting low across the pools, never over the band
    mist(700, 640, 380, 14, 0.3),
    mist(200, 600, 260, 12, 0.3),
  ]);
}
