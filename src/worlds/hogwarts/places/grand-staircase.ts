/**
 * The grand staircase landing for "Sir Cadogan" (book 3; original paper art):
 * the stone landing at the top of the moving staircases, outside Gryffindor
 * Tower. A tall stairwell in dim blue-grey stone; flights criss-cross up
 * into the dark across the top and zig-zag up both side edges; a crowd of
 * tiny old portraits in gold frames (a bowl of fruit, a green hill, a
 * silhouette, a cottage, a moon on water, a tree; no likenesses) hangs on
 * the left wall and along the top; warm torches glow at the edges.
 *
 * Layout, 1180 × 820:
 *   floor / ground line   stone landing floor, actors stand at y 670
 *                         (the wall meets the floor at y 655)
 *   left floor space      x 80 to 500, y 330 to 670: room for 3 children
 *                         (the wall behind is quiet; the little portraits
 *                         are all above y 300)
 *   big plain wall        x 520 to 980, y 120 to 660, nothing on it but a
 *                         warm glow: stand the portraitFrame prop (440 ×
 *                         540) here, e.g. left 540, top 130, so its foot
 *                         sits at y 670
 *   torches               x 515 (flame y 270 to 330) and x 995 (flame
 *                         y 200 to 260): add k.light on them if you like
 *   side flights          left edge x -30 to 110, right edge x 1030 to 1210
 *   top                   criss-crossing flights and shadow, y 0 to 130
 *   bottom band           y 690 to 820 is plain flagstones for the captions
 */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#4f4d68';
const WALL_LIGHT = '#5b5976';
const WALL_BLOCK = '#57556f';
const STAIR = '#6b6985';
const STAIR_SIDE = '#43415b';
const FLOOR = '#5f5a74';

/** A flight of steps from (x0, y0) to (x1, y1): a stepped wedge, with a rail. */
function flight(x0: number, y0: number, x1: number, y1: number, thick: number, n: number, top: string, side: string): Node[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const ax = x0 + ((x1 - x0) * i) / n;
    const ay = y0 + ((y1 - y0) * i) / n;
    const bx = x0 + ((x1 - x0) * (i + 1)) / n;
    pts.push([ax, ay], [bx, ay]);
  }
  pts.push([x1, y1], [x1, y1 + thick], [x0, y0 + thick]);
  const out: Node[] = [piece(pts, side, { edge: 'cut', fibre: false, shadow: false })];
  // lit tread edges
  for (let i = 0; i < n; i++) {
    const ax = x0 + ((x1 - x0) * i) / n;
    const ay = y0 + ((y1 - y0) * i) / n;
    const bx = x0 + ((x1 - x0) * (i + 1)) / n;
    out.push(ink([[ax, ay + 1], [bx, ay + 1]], { width: 3, color: top, wobble: 0.2 }));
  }
  // handrail with a few posts
  const rail = 46;
  out.push(ink([[x0, y0 - rail], [x1, y1 - rail]], { width: 3, color: C.brownDark, wobble: 0.3, opacity: 0.8 }));
  for (let i = 0; i <= n; i += 3) {
    const ax = x0 + ((x1 - x0) * i) / n;
    const ay = y0 + ((y1 - y0) * i) / n;
    out.push(ink([[ax, ay], [ax, ay - rail]], { width: 2.4, color: C.brownDark, opacity: 0.7, wobble: 0.2 }));
  }
  return out;
}

/** A tiny old painting in a gold frame. kind picks what is painted. */
function mini(x: number, y: number, w: number, h: number, kind: number): Node[] {
  const f = 5;
  const ix = x + f;
  const iy = y + f;
  const iw = w - 2 * f;
  const ih = h - 2 * f;
  const frame: Node[] = [piece(rect(x, y, w, h, 2), C.gold, { edge: 'cut', fibre: false })];
  switch (kind % 6) {
    case 0: // a bowl of fruit
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), '#d9c9a0', { edge: 'clean', shadow: false }),
        piece(ellipse(ix + iw / 2, iy + ih * 0.72, iw * 0.4, ih * 0.14), C.brown, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.38, iy + ih * 0.58, iw * 0.15), C.red, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.62, iy + ih * 0.56, iw * 0.15), C.orange, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.5, iy + ih * 0.46, iw * 0.14), C.leafLight, { edge: 'clean', shadow: false }),
      ];
    case 1: // a green hill
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), C.sky, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.76, iy + ih * 0.28, iw * 0.13), C.goldLight, { edge: 'clean', shadow: false }),
        piece(curve([[ix, iy + ih], [ix, iy + ih * 0.62], [ix + iw * 0.45, iy + ih * 0.42], [ix + iw, iy + ih * 0.66], [ix + iw, iy + ih]], 2), C.green, { edge: 'clean', shadow: false }),
      ];
    case 2: // a little face silhouette
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), '#6b4f86', { edge: 'clean', shadow: false }),
        piece(ellipse(ix + iw / 2, iy + ih * 0.4, iw * 0.2, ih * 0.22), '#2f2438', { edge: 'clean', shadow: false }),
        piece(curve([[ix + iw * 0.1, iy + ih], [ix + iw * 0.18, iy + ih * 0.72], [ix + iw * 0.5, iy + ih * 0.64], [ix + iw * 0.82, iy + ih * 0.72], [ix + iw * 0.9, iy + ih]], 2), '#2f2438', { edge: 'clean', shadow: false }),
      ];
    case 3: // a cottage
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), '#cfe0e6', { edge: 'clean', shadow: false }),
        piece(rect(ix, iy + ih * 0.72, iw, ih * 0.28), C.leaf, { edge: 'clean', shadow: false }),
        piece(rect(ix + iw * 0.25, iy + ih * 0.46, iw * 0.5, ih * 0.3), C.cream, { edge: 'clean', shadow: false }),
        piece(poly([[ix + iw * 0.2, iy + ih * 0.48], [ix + iw * 0.5, iy + ih * 0.24], [ix + iw * 0.8, iy + ih * 0.48]]), C.rust, { edge: 'clean', shadow: false }),
      ];
    case 4: // a moon on dark water
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), C.night, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.5, iy + ih * 0.36, iw * 0.2), C.cream, { edge: 'clean', shadow: false }),
        piece(rect(ix, iy + ih * 0.66, iw, ih * 0.34), C.blueDark, { edge: 'clean', shadow: false }),
        ink([[ix + iw * 0.3, iy + ih * 0.8], [ix + iw * 0.7, iy + ih * 0.8]], { width: 1.8, color: C.sky, opacity: 0.8, wobble: 0.2 }),
      ];
    default: // a round tree
      return [
        ...frame,
        piece(rect(ix, iy, iw, ih), '#e8dcb4', { edge: 'clean', shadow: false }),
        piece(rect(ix + iw * 0.45, iy + ih * 0.5, iw * 0.1, ih * 0.4), C.brown, { edge: 'clean', shadow: false }),
        piece(circle(ix + iw * 0.5, iy + ih * 0.38, iw * 0.3), C.greenDark, { edge: 'clean', shadow: false }),
      ];
  }
}

/** A wall torch: bracket, flame, and a soft warm glow. */
function torch(x: number, y: number): Node[] {
  return [
    ...[150, 118, 88, 60].map((r, i) => piece(ellipse(x, y + 10, r, r * 1.1), '#e8a050', { edge: 'clean', shadow: false, opacity: 0.045 + i * 0.01 })),
    piece(rect(x - 6, y + 20, 12, 62, 3), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(x - 12, y + 16, 24, 9, 3), '#3a3a42', { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[x, y - 56], [x + 18, y - 14], [x, y + 12], [x - 18, y - 14]], 2), C.orange, { edge: 'cut' }),
    piece(curve([[x, y - 34], [x + 9, y - 10], [x, y + 6], [x - 9, y - 10]], 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

export function grandStaircase(): string {
  const r = rng(1103);
  const blocks: Node[] = [];
  for (let row = 0; row < 8; row++) {
    let x = -30 + (row % 2) * 55;
    while (x < 1200) {
      const w = 100 + r() * 50;
      blocks.push(piece(rect(x, row * 90 - 20, w - 6, 84, 4), r() > 0.5 ? WALL_BLOCK : WALL, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
      x += w;
    }
  }
  const flags: Node[] = [];
  for (const [y, off] of [[702, 0], [748, 90], [796, 30]] as const) {
    flags.push(ink([[-10, y], [1190, y + 2]], { width: 2.2, color: '#3d3850', opacity: 0.35 }));
    for (let x = 120 + off; x < 1200; x += 230) flags.push(ink([[x, y - 40], [x, y]], { width: 2, color: '#3d3850', opacity: 0.28 }));
  }
  const minis: Node[] = [
    // the left wall cluster, all above y 300
    ...mini(140, 150, 50, 62, 0), ...mini(206, 128, 38, 48, 2), ...mini(256, 164, 56, 44, 1),
    ...mini(330, 130, 46, 60, 5), ...mini(392, 168, 40, 54, 4), ...mini(444, 138, 52, 44, 3),
    ...mini(160, 232, 44, 52, 5), ...mini(236, 234, 56, 42, 3), ...mini(318, 236, 40, 50, 0), ...mini(386, 240, 44, 40, 1),
    // along the top of the plain wall
    ...mini(560, 44, 44, 54, 2), ...mini(640, 36, 52, 40, 4), ...mini(730, 46, 38, 50, 0),
    ...mini(800, 34, 50, 44, 1), ...mini(890, 44, 44, 54, 5),
    // beside the plain wall, right
    ...mini(998, 98, 36, 46, 3),
  ];
  return svg({ w: 1180, h: 820, name: 'hogwarts-grand-staircase', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), WALL, { edge: 'clean', shadow: false }),
    ...blocks,
    // far flights criss-crossing up into the dark
    ...flight(-20, 176, 380, 44, 20, 12, '#5a5876', '#3f3d57'),
    ...flight(1200, 210, 700, 34, 20, 14, '#5a5876', '#3f3d57'),
    ...flight(200, 104, 640, -10, 18, 12, '#504e6a', '#383650'),
    // the side flights: zig-zags up each edge
    ...flight(-30, 650, 100, 330, 44, 12, STAIR, STAIR_SIDE),
    ...flight(110, 300, -30, 130, 40, 10, STAIR, STAIR_SIDE),
    ...flight(1210, 660, 1040, 330, 44, 12, STAIR, STAIR_SIDE),
    ...flight(1030, 304, 1210, 130, 40, 10, STAIR, STAIR_SIDE),
    // darkness gathering at the top
    piece(ellipse(590, -70, 820, 210), C.night, { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(ellipse(590, -100, 640, 150), C.night, { edge: 'clean', shadow: false, opacity: 0.35 }),
    // the big plain wall, with warm torchlight on it
    piece(rect(520, 120, 460, 540, 6), WALL_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    ...minis,
    ...torch(515, 300),
    ...torch(995, 230),
    // the landing floor, and the skirting where the wall meets it
    piece(rect(-20, 654, 1220, 200), FLOOR, { edge: 'cut', fibre: false, shadow: false }),
    ...flags,
    piece(rect(-20, 646, 1220, 10, 2), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(-20, 656, 1220, 6), '#7a758c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ]);
}
