/** The Gryffindor boys' dormitory on a snowy Christmas morning (new for the Christmas episode). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#a79c8e';
const VELVET = '#8e2c2c';
const VELVET_DARK = '#6e2022';
const COVER = '#b03a35';

function archOutline(x: number, y: number, w: number, h: number): Pt[] {
  const r = w / 2;
  const pts: Pt[] = [[x, y + h]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  pts.push([x + w, y + h]);
  return pts;
}

/** The tall arched window: pale morning sky, snowy roofs and falling flakes. */
function windowArt(): Node[] {
  const x = 490, y = 40, w = 200, h = 330;
  const gx = x + 14, gw = w - 28;
  const r = rng(77);
  const flakes: Node[] = [];
  for (let i = 0; i < 26; i++) flakes.push(dot(gx + 8 + r() * (gw - 16), y + 50 + r() * (h - 110), 2 + r() * 2.5, C.white, 0.95));
  return [
    // pale light spilling round the window
    piece(ellipse(590, 220, 250, 230), '#f4efe2', { edge: 'clean', shadow: false, opacity: 0.2 }),
    piece(archOutline(x - 14, y - 14, w + 28, h + 28), '#6d655b', { rough: 0.8 }),
    piece(archOutline(x, y, w, h), C.stoneLight, { edge: 'cut' }),
    piece(archOutline(gx, y + 14, gw, h - 24), '#c9d8e6', { edge: 'cut', fibre: false }),
    piece(archOutline(gx + 6, y + 120, gw - 12, h - 130), '#e4ecf2', { edge: 'clean', shadow: false, opacity: 0.7 }),
    // far snowy hills and a tower tip
    piece(curve([[gx, y + h - 70], [x + 60, y + h - 96], [x + 120, y + h - 78], [gx + gw, y + h - 92], [gx + gw, y + h - 12], [gx, y + h - 12]], 2), '#f3f1ea', { fibre: false, shadow: false }),
    piece(curve([[gx, y + h - 40], [x + 80, y + h - 62], [gx + gw, y + h - 44], [gx + gw, y + h - 12], [gx, y + h - 12]], 2), '#dfe6ec', { fibre: false, shadow: false }),
    ...flakes,
    // leading
    ink([[x + w / 2, y + 18], [x + w / 2, y + h - 12]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    ink([[gx, y + 150], [gx + gw, y + 150]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    // snow on the sill
    piece(rect(x - 24, y + h - 6, w + 48, 20, 3), C.stoneLight, { rough: 0.8 }),
    piece(curve([[x - 8, y + h - 4], [x + 40, y + h - 18], [x + 100, y + h - 10], [x + 160, y + h - 20], [x + w + 8, y + h - 4], [x + w, y + h + 2], [x, y + h + 2]], 2), C.white, { fibre: false }),
  ];
}

/** A holly wreath with a red bow. */
function wreath(cx: number, cy: number): Node[] {
  const leaves: Node[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    leaves.push(piece(ellipse(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30, 11, 6, a + Math.PI / 2), i % 2 ? C.greenDark : C.green, { edge: 'cut', fibre: false, shadow: false }));
  }
  return [
    piece(circle(cx, cy, 34), C.greenDeep, { edge: 'cut', fibre: false }),
    ...leaves,
    dot(cx - 14, cy + 22, 4, C.red),
    dot(cx + 8, cy + 26, 4, C.red),
    dot(cx + 20, cy + 14, 4, C.red),
    piece(ellipse(cx - 9, cy - 30, 12, 7, -0.5), C.red, { edge: 'cut', fibre: false }),
    piece(ellipse(cx + 9, cy - 30, 12, 7, 0.5), C.red, { edge: 'cut', fibre: false }),
    dot(cx, cy - 30, 4.5, C.redDark),
  ];
}

/** A stocking hung from a bedpost. */
function stocking(x: number, y: number, flip = false): Node[] {
  const s = flip ? -1 : 1;
  return [
    piece(curve([[x - 12 * s, y], [x + 12 * s, y], [x + 12 * s, y + 40], [x + 30 * s, y + 56], [x + 22 * s, y + 70], [x - 12 * s, y + 52]], 1), C.red, { edge: 'cut' }),
    piece(rect(Math.min(x - 14 * s, x + 14 * s), y - 6, 28, 14, 4), C.white, { edge: 'cut', fibre: false }),
    dot(x + 20 * s, y + 62, 4, C.goldLight),
  ];
}

/** One four-poster bed seen side-on: head (tall) at the outer edge, foot at the inner edge. */
function bed(left: boolean): Node[] {
  // x0 = outer edge, x1 = inner edge (the foot)
  const x0 = left ? 20 : 1160;
  const x1 = left ? 380 : 800;
  const d = left ? 1 : -1; // direction from head to foot
  const px = (t: number) => x0 + (x1 - x0) * t;
  const post = (x: number, top: number): Node => piece(rect(x - 11, top, 22, 650 - top, 4), C.brownDark, { edge: 'cut' });
  const knob = (x: number, y: number): Node => piece(circle(x, y, 13), C.gold, { edge: 'cut', fibre: false });
  const headX = x0 + d * 12;
  const footX = x1 - d * 12;
  const midX = (headX + footX) / 2;
  return [
    // soft shadow on the floor
    piece(ellipse(midX, 662, 200, 20), '#4a3322', { edge: 'clean', shadow: false, opacity: 0.35 }),
    // back posts and canopy frame
    post(headX, 130),
    // the head of the bed: a tall carved board
    piece(rect(Math.min(x0, x0 + d * 30), 340, 30, 270, 4), C.brown, { edge: 'cut' }),
    // curtain hanging from the canopy at the head, tied back
    piece(curve([[headX - 8, 150], [headX + d * 70, 150], [headX + d * 66, 280], [headX + d * 40, 330], [headX + d * 50, 450], [headX + d * 18, 520], [headX - d * 14, 520]], 2), VELVET, { rough: 1.1 }),
    piece(curve([[headX + d * 10, 160], [headX + d * 30, 250], [headX + d * 24, 330], [headX + d * 32, 480]], 2), VELVET_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    // golden tie-back rope
    piece(rect(headX + d * 8 - 3, 322, 70, 9, 3), C.gold, { edge: 'cut', fibre: false }),
    // mattress, sheets, red-and-gold cover
    piece(rect(Math.min(x0, x1), 520, 360, 90, 8), C.cream, { edge: 'cut' }),
    piece(rect(Math.min(x0, x1) + 8, 490, 344, 90, 14), COVER, { rough: 1.1 }),
    piece(rect(Math.min(x0, x1) + 8, 536, 344, 14, 2), C.gold, { edge: 'cut', fibre: false }),
    piece(rect(Math.min(x0, x1) + 8, 556, 344, 8, 2), C.gold, { edge: 'cut', fibre: false, opacity: 0.8 }),
    // lion-gold stripes down the cover
    ...[0.38, 0.5, 0.62].map((t) => piece(rect(px(t) - 4, 494, 8, 40, 2), C.goldLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 })),
    // pillow
    piece(ellipse(px(0.14), 488, 44, 20), C.white, { rough: 0.9 }),
    piece(ellipse(px(0.14), 492, 28, 10), '#e6dcc6', { edge: 'clean', shadow: false, opacity: 0.6 }),
    // the foot board
    piece(rect(footX - 14, 470, 28, 150, 5), C.brown, { edge: 'cut' }),
    // the foot posts and the canopy
    post(footX, 160),
    piece(rect(Math.min(x0, x1) - 4, 118, 368, 28, 4), VELVET, { rough: 0.8 }),
    piece(rect(Math.min(x0, x1) - 4, 138, 368, 10, 2), C.gold, { edge: 'cut', fibre: false }),
    ...[0.1, 0.3, 0.5, 0.7, 0.9].map((t) => piece(curve([[px(t) - 22, 146], [px(t) + 22, 146], [px(t), 170]], 1), VELVET_DARK, { edge: 'cut', fibre: false, shadow: false })),
    knob(headX, 126),
    knob(footX, 156),
    // curtain at the foot, tied back and drawn to the post
    piece(curve([[footX - d * 6, 150], [footX - d * 56, 150], [footX - d * 50, 250], [footX - d * 30, 310], [footX - d * 36, 400], [footX - d * 12, 450], [footX + d * 8, 450], [footX + d * 8, 200]], 2), VELVET, { rough: 1.1 }),
    piece(rect(footX - d * 38 - 24 + (d > 0 ? 24 : 0), 304, 52, 9, 3), C.gold, { edge: 'cut', fibre: false }),
    // little brass feet
    piece(rect(headX - 12, 640, 24, 14, 3), C.gold, { edge: 'cut', fibre: false }),
    piece(rect(footX - 12, 640, 24, 14, 3), C.gold, { edge: 'cut', fibre: false }),
  ];
}

/** A wooden trunk with brass straps. */
function trunk(x: number, y: number, w: number, h: number): Node[] {
  return [
    piece(ellipse(x + w / 2, y + h + 4, w * 0.6, 8), '#4a3322', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(rect(x, y, w, h, 6), '#7a4c2e', { rough: 0.9 }),
    piece(rect(x - 2, y - 14, w + 4, 22, 8), C.wood, { edge: 'cut' }),
    piece(rect(x + 14, y - 14, 10, h + 14, 2), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x + w - 24, y - 14, 10, h + 14, 2), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x + w / 2 - 9, y + 6, 18, 18, 3), C.goldLight, { edge: 'cut', fibre: false }),
    dot(x + w / 2, y + 15, 3, C.brownDark),
  ];
}

/** The Gryffindor boys' dormitory on Christmas morning, 1180 × 820. */
export function dormitory(): string {
  const stones: Node[] = [];
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 12; col++) {
      const sx = -30 + col * 108 + (row % 2) * 54;
      const sy = -4 + row * 58;
      if (sy > 580) continue;
      stones.push(piece(rect(sx, sy, 100, 50, 6), (row + col) % 3 ? '#b2a89a' : '#9e9486', { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }));
    }
  }
  // flagstones: big pale slabs
  const slabs: Node[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const sx = -40 + col * 190 + (row % 2) * 95;
      const sy = 628 + row * 62;
      slabs.push(piece(rect(sx, sy, 180, 56, 6), (row + col) % 2 ? '#8e8a85' : '#9b9791', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
    }
  }
  return svg({ w: 1180, h: 820, name: 'hogwarts-dormitory', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 700), WALL, { edge: 'clean', shadow: false }),
    ...stones,
    // the round tower: the wall curves away and darkens at both sides
    piece(ellipse(-60, 330, 200, 420), '#5e5348', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(ellipse(1240, 330, 200, 420), '#5e5348', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(ellipse(10, 330, 110, 380), '#5e5348', { edge: 'clean', shadow: false, opacity: 0.22 }),
    piece(ellipse(1170, 330, 110, 380), '#5e5348', { edge: 'clean', shadow: false, opacity: 0.22 }),
    // the window and its light
    ...windowArt(),
    // wreaths and a banner between window and beds
    ...wreath(430, 240),
    ...wreath(750, 240),
    // skirting
    piece(rect(-20, 612, 1220, 22, 3), '#6f675d', { rough: 1 }),
    // the stone floor
    piece(rect(-20, 628, 1220, 230), '#827d76', { edge: 'clean', shadow: false }),
    ...slabs,
    piece(ellipse(590, 650, 330, 50), C.white, { edge: 'clean', shadow: false, opacity: 0.14 }),
    // the red rug in the middle
    piece(ellipse(590, 668, 300, 42), '#8a2f30', { rough: 1.2 }),
    piece(ellipse(590, 668, 270, 33), C.gold, { edge: 'cut', fibre: false, opacity: 0.6 }),
    piece(ellipse(590, 668, 258, 29), '#a13a36', { edge: 'cut', fibre: false, shadow: false }),
    // the beds
    ...bed(true),
    ...bed(false),
    // the trunk at the foot of the left bed (x 250 to 372)
    ...trunk(250, 612, 122, 56),
    ...stocking(380, 330, false),
    ...stocking(800, 330, true),
  ]);
}
