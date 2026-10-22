/**
 * The odd little curiosity shop where Mollie and Peter find the
 * Wishing-Chair. Dim, dusty and cosy: plum-brown walls, dusty gold, a
 * small-paned window on the left letting in soft daylight, tall back
 * shelves crowded with odd things (clocks, jars, a ship in a bottle, a
 * globe, old books, a birdcage), a wooden counter on the right with a clear
 * top (the script adds a bell and a money dish), and plain floorboards.
 *
 * Ground line y 640. The floor and wall in front of the shelves are left
 * open from x 120 to 760 for the chair and two children; the bottom band
 * (y 690-820) is bare boards. No chair, bell or dish is drawn in: those are
 * props.
 */
import { C } from '../../art/palette';
import { band, cached, circle, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../art/paper';

const WALL = '#6b4a45';
const WALL_DARK = '#4f3640';
const SHELF = C.barkDark;
const BOARD = C.barkLight;

/** A round clock face with two hands. */
function clock(x: number, y: number, r: number, face: string): Node[] {
  return [
    piece(circle(x, y, r), C.brassDark, { edge: 'cut' }),
    piece(circle(x, y, r * 0.8), face, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x, y], [x, y - r * 0.55]], { width: 2.5, color: C.ink }),
    ink([[x, y], [x + r * 0.38, y + r * 0.1]], { width: 2.5, color: C.ink }),
  ];
}

/** A glass jar sitting on a shelf at (x, base). */
function jar(x: number, base: number, w: number, h: number, fill: string): Node[] {
  return [
    piece(rect(x, base - h, w, h, 6), C.glass, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(rect(x + 3, base - h * 0.6, w - 6, h * 0.6 - 3, 4), fill, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x + 2, base - h - 7, w - 4, 8, 2), C.brassDark, { edge: 'cut', fibre: false }),
  ];
}

/** A row of leaning books starting at x. */
function books(x: number, base: number, cols: string[]): Node[] {
  const out: Node[] = [];
  let cx = x;
  cols.forEach((c, i) => {
    const w = 15 + (i % 3) * 6;
    const h = 56 + ((i * 7) % 4) * 9;
    out.push(piece(rect(cx, base - h, w, h, 1), c, { edge: 'cut', fibre: false }));
    out.push(ink([[cx + 3, base - h + 10], [cx + w - 3, base - h + 10]], { width: 1.6, color: C.gold, opacity: 0.8 }));
    cx += w + 1;
  });
  return out;
}

export const curiosityShop = cached(() =>
  svg({ w: 1180, h: 820, name: 'wishing-shop', className: 'backdrop' }, [
    // Plum-brown wall, darker toward the corners.
    piece(rect(-20, -20, 1220, 860), WALL, { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 90), WALL_DARK, { edge: 'torn', shadow: false, opacity: 0.6 }),
    // Faint wallpaper stripes.
    ...[40, 140, 240, 340].map((x) => ink([[x, 70], [x, 600]], { width: 22, color: WALL_DARK, opacity: 0.18 })),
    // Dado rail and skirting where the wall meets the floor.
    piece(rect(-20, 520, 1220, 16), SHELF, { edge: 'cut', fibre: false }),
    piece(rect(-20, 536, 1220, 70), WALL_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),

    // The window on the left: bright small panes, soft daylight.
    piece(rect(40, 120, 300, 330, 6), SHELF),
    piece(rect(58, 138, 264, 294, 3), '#f6e6b8', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(58, 138, 264, 150), C.sky, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    piece(rect(58, 288, 264, 144), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(150, 200, 70, 22), C.cloud, { edge: 'torn', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(262, 250, 60, 18), C.cloud, { edge: 'torn', fibre: false, shadow: false, opacity: 0.8 }),
    // Sunlit leaves of a tree outside.
    piece(ellipse(120, 410, 60, 24), C.leafLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(170, 420, 50, 18), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    piece(band([[190, 138], [190, 432]], 8), SHELF, { edge: 'cut', fibre: false, shadow: false }),
    piece(band([[58, 285], [322, 285]], 8), SHELF, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(28, 446, 324, 18, 3), SHELF, { edge: 'cut' }),
    // A pot plant on the sill.
    piece(poly([[236, 446], [292, 446], [284, 410], [244, 410]]), C.rust, { edge: 'cut' }),
    piece(ellipse(264, 396, 30, 22), C.leaf, { edge: 'torn' }),
    piece(ellipse(278, 384, 18, 14), C.leafLight, { edge: 'torn', fibre: false }),
    // Soft light pooling on the boards below the window.
    piece(poly([[60, 606], [340, 606], [440, 760], [120, 760]]), C.goldLight, { edge: 'torn', fibre: false, shadow: false, opacity: 0.16 }),

    // Tall shelves at the back, behind the middle and right.
    piece(rect(380, 50, 430, 548, 4), SHELF),
    piece(rect(392, 62, 406, 524, 2), '#3d2a2a', { edge: 'cut', fibre: false, shadow: false }),
    ...[200, 320, 440, 560].map((y) => piece(rect(386, y, 418, 12, 2), C.barkLight, { edge: 'cut' })),
    // Top shelf: a clock, a ship in a bottle, a birdcage.
    ...clock(440, 150, 34, C.cream),
    piece(rect(500, 120, 90, 14, 3), C.brassDark, { edge: 'cut', fibre: false }),
    piece(rect(500, 134, 90, 62, 12), C.glass, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(rect(504, 168, 82, 26, 6), C.blue, { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 }),
    piece(poly([[520, 166], [574, 166], [566, 176], [528, 176]]), C.red, { edge: 'cut', fibre: false, shadow: false }),
    ink([[547, 166], [547, 140]], { width: 2, color: C.ink }),
    piece(poly([[547, 140], [547, 164], [566, 164]]), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[547, 144], [547, 164], [530, 164]]), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    // Birdcage.
    piece(ellipse(700, 118, 36, 14), C.brass, { edge: 'cut', fibre: false }),
    ...[-26, -10, 8, 24].map((dx) => ink([[700 + dx, 120], [700 + dx * 0.9, 192]], { width: 2.4, color: C.brassDark })),
    piece(rect(664, 190, 72, 8, 2), C.brass, { edge: 'cut', fibre: false }),
    ink([[700, 100], [700, 84]], { width: 2.4, color: C.brassDark }),
    piece(ellipse(700, 176, 12, 9), C.yellow, { edge: 'cut', fibre: false, shadow: false }),
    // Second shelf: jars and books.
    ...jar(410, 320, 36, 66, C.rose),
    ...jar(454, 320, 30, 50, C.leaf),
    ...jar(492, 320, 40, 78, C.goldLight),
    ...books(560, 320, [C.red, C.blueDark, C.green, C.plum, C.ochre, C.teal, C.rust]),
    ...clock(740, 270, 36, C.cream),
    // Third shelf: a globe, a stack of books, a teapot.
    piece(rect(432, 428, 46, 8, 2), C.brassDark, { edge: 'cut', fibre: false }),
    piece(band([[455, 436], [455, 440]], 10), C.brassDark, { edge: 'cut', fibre: false }),
    piece(circle(455, 388, 40), C.blue, { edge: 'cut' }),
    piece(ellipse(446, 380, 18, 12, 0.5), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(470, 400, 10, 14, -0.4), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    ink([[418, 360], [492, 416]], { width: 3, color: C.brassDark }),
    ...[0, 1, 2].map((i) => piece(rect(540 + i * 4, 428 - (i + 1) * 20, 100 - i * 14, 20, 2), [C.plum, C.rust, C.greenDark][i], { edge: 'cut', fibre: false })),
    piece(ellipse(700, 396, 40, 30), C.china, { edge: 'cut' }),
    ink([[668, 384], [650, 372], [660, 396]], { width: 4, color: C.chinaBlue }),
    ink([[736, 380], [756, 394], [740, 404]], { width: 4, color: C.chinaBlue }),
    piece(rect(690, 358, 20, 8, 3), C.chinaBlue, { edge: 'cut', fibre: false }),
    // Bottom shelf: baskets and boxes, tucked low.
    piece(rect(420, 520, 90, 40, 4), C.tan, { edge: 'cut' }),
    piece(rect(530, 508, 70, 52, 3), C.plum, { edge: 'cut' }),
    piece(rect(620, 526, 120, 34, 4), C.rust, { edge: 'cut' }),
    ink([[620, 540], [740, 540]], { width: 2, color: C.gold }),

    // A second, shorter shelf unit on the right, behind the counter.
    piece(rect(850, 70, 300, 360, 4), SHELF),
    piece(rect(862, 82, 276, 336, 2), '#3d2a2a', { edge: 'cut', fibre: false, shadow: false }),
    ...[200, 316].map((y) => piece(rect(856, y, 288, 12, 2), C.barkLight, { edge: 'cut' })),
    ...clock(930, 156, 32, C.cream),
    ...clock(1040, 150, 26, C.goldLight),
    piece(poly([[1090, 190], [1130, 190], [1120, 120], [1100, 120]]), C.violet, { edge: 'cut' }),
    ...jar(880, 316, 36, 70, C.pink),
    ...jar(924, 316, 34, 56, C.mint),
    // A round hatbox with a ribbon.
    piece(rect(980, 262, 64, 54, 6), C.rose, { edge: 'cut' }),
    piece(rect(974, 252, 76, 14, 5), C.pink, { edge: 'cut', fibre: false }),
    ink([[980, 290], [1044, 290]], { width: 5, color: C.goldLight }),
    ...books(1070, 316, [C.teal, C.red, C.gold, C.blueDark]),
    ...books(880, 412, [C.plum, C.green, C.rust, C.blueDark, C.ochre]),
    // A hanging lantern with a warm glow.
    ink([[790, -10], [790, 56]], { width: 3, color: C.ink }),
    piece(poly([[772, 56], [808, 56], [814, 94], [766, 94]]), C.brassDark, { edge: 'cut' }),
    piece(rect(774, 66, 32, 24, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),

    // Floorboards from the skirting down: warm brown with seams.
    piece(rect(-20, 600, 1220, 240), BOARD, { edge: 'clean', shadow: false }),
    piece(rect(-20, 598, 1220, 12), C.barkDark, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    ...[-20, 130, 290, 470, 640, 810, 990, 1160].map((x) => ink([[x, 610], [x - 40 - (x % 70), 830]], { width: 2.4, color: C.barkDark, opacity: 0.3 })),
    ...[660, 730, 790].map((y) => ink([[-20, y], [1200, y + 2]], { width: 2, color: C.barkDark, opacity: 0.2 })),
    // A faded rug-edge shadow under the shelves.
    piece(rect(380, 598, 430, 26), C.ink, { edge: 'torn', fibre: false, shadow: false, opacity: 0.18 }),

    // The counter on the right: top at y 470, panelled front down to the floor.
    piece(rect(820, 470, 380, 14, 2), C.tan, { edge: 'cut', fibre: false }),
    piece(rect(824, 484, 380, 170, 3), C.wood),
    piece(rect(840, 504, 160, 120, 3), C.brown, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(1020, 504, 160, 120, 3), C.brown, { edge: 'cut', fibre: false, shadow: false }),
    dot(920, 564, 6, C.brass),
    dot(1100, 564, 6, C.brass),
    piece(rect(824, 640, 380, 14, 2), C.barkDark, { edge: 'cut', fibre: false, shadow: false }),
    // Soft shadow of the counter on the floor.
    piece(ellipse(1010, 660, 210, 14), C.ink, { edge: 'torn', fibre: false, shadow: false, opacity: 0.18 }),
    // Dust motes of light across the middle.
    ...[[520, 300, 3], [600, 420, 2.4], [660, 250, 2], [760, 520, 2.6]].map(([x, y, r]) => dot(x, y, r, C.candle, 0.5)),
  ]),
);
