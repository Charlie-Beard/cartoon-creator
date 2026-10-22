/**
 * Outside the giant's castle, on a hilltop above the clouds.
 *
 * A slightly moody lilac-grey sky (friendly, not stormy), a few soft clouds
 * far off and a sea of cloud lapping the hill's edge on the left. The
 * RIGHT half is the castle: a long grey stone wall with battlements and two
 * lit windows, a round tower at the far right with a slate cone of a roof,
 * and in the wall a vast arched wooden door (x 640-1020, its foot on the
 * ground at y 640) with iron bands, studs and a keyhole big enough to peer
 * through. The door's lower-left corner (x 660-760, y 540-640) is left as
 * plain planks because the script lays a mouse-sized door over it.
 *
 * The hilltop grass fills the LEFT and MIDDLE (x 60-620, ground line
 * y 640): room for the Wishing-Chair to land and three actors. The bottom
 * band stays plain grass.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

const GROUND = 640;
const DOOR = { x0: 640, x1: 1020 };
const CX = (DOOR.x0 + DOOR.x1) / 2;
const R = (DOOR.x1 - DOOR.x0) / 2;
const ARCH_Y = 440; // where the round top of the door begins

const STONES = ['#8f8d92', '#9b9a9e', '#85838a', '#a3a0a2', '#918f96'];

/** A lumpy cloud bank (a flat shaded underside and puffs). */
function bank(cx: number, cy: number, w: number, seed: number, color = '#ece6ee', shade = '#c9c0d0'): Node[] {
  const r = rng(seed);
  const n = Math.max(3, Math.round(w / 70));
  const out: Node[] = [piece(ellipse(cx, cy + 22, w / 2 + 6, 26), shade, { shadow: false, fibre: false })];
  for (let i = 0; i < n; i++) {
    const x = cx - w / 2 + (i + 0.5) * (w / n);
    out.push(piece(circle(x, cy - r() * 22, Math.min(40 + r() * 26, w / n + 10)), color, { shadow: false }));
  }
  out.push(piece(ellipse(cx, cy + 14, w / 2, 26), color, { shadow: false }));
  return out;
}

/** Courses of stone blocks filling a box, each block a little different. */
function masonry(x0: number, y0: number, x1: number, y1: number, seed: number, rowH = 38, blockW = 70): Node[] {
  const r = rng(seed);
  const out: Node[] = [piece(rect(x0, y0, x1 - x0, y1 - y0), C.stone, { edge: 'cut', shadow: false })];
  let row = 0;
  for (let y = y0; y < y1; y += rowH, row++) {
    const h = Math.min(rowH, y1 - y);
    let x = x0 - (row % 2 ? blockW / 2 : 0);
    while (x < x1) {
      const bw = blockW * (0.8 + r() * 0.4);
      const bx = Math.max(x, x0);
      const bx1 = Math.min(x + bw, x1);
      if (bx1 - bx > 8) out.push(piece(rect(bx + 2, y + 2, bx1 - bx - 4, h - 4, 4), STONES[Math.floor(r() * STONES.length)], flat));
      x += bw;
    }
  }
  return out;
}

/** The arched outline of the door, from its foot on the left round to its foot on the right. */
function arch(pad: number): Pt[] {
  const pts: Pt[] = [[DOOR.x0 - pad, GROUND], [DOOR.x0 - pad, ARCH_Y]];
  for (let a = 180; a <= 360; a += 10) {
    const t = (a * Math.PI) / 180;
    pts.push([CX + Math.cos(t) * (R + pad), ARCH_Y + Math.sin(t) * (R + pad)]);
  }
  pts.push([DOOR.x1 + pad, ARCH_Y], [DOOR.x1 + pad, GROUND]);
  return pts;
}

function door(): Node[] {
  const out: Node[] = [
    piece(poly(arch(24)), C.stoneLight, { edge: 'cut' }),
    piece(poly(arch(8)), C.brownDark, { edge: 'cut', shadow: false }),
    piece(poly(arch(0)), C.wood, { edge: 'cut', shadow: false }),
  ];
  // Plank joins, one long line each.
  for (let x = DOOR.x0 + 54; x < DOOR.x1; x += 54) {
    const dy = Math.sqrt(Math.max(0, R * R - (x - CX) * (x - CX)));
    out.push(ink([[x, ARCH_Y - dy + 6], [x + 1, GROUND - 4]], { width: 3, color: C.brown, opacity: 0.8, wobble: 1 }));
  }
  // Grain on a few planks (only up high or on the right, so the lower left stays plain).
  [[700, 300, 340], [880, 400, 520], [940, 520, 600], [800, 280, 330]].forEach(([x, y0, y1]) =>
    out.push(ink([[x, y0], [x + 3, (y0 + y1) / 2], [x - 2, y1]], { width: 2, color: C.brownDark, opacity: 0.3, wobble: 1.5 })),
  );
  // Iron bands across the door, with studs.
  for (const y of [340, 500]) {
    out.push(piece(rect(DOOR.x0 + 2, y, DOOR.x1 - DOOR.x0 - 4, 26, 3), C.charcoal, { edge: 'cut' }));
    for (let x = DOOR.x0 + 24; x < DOOR.x1; x += 54) out.push(piece(circle(x, y + 13, 7), C.greyDark, flat), piece(circle(x - 2, y + 11, 2.5), C.stone, flat));
  }
  // The huge keyhole: a round top and a tapering slot, in an iron plate.
  out.push(
    piece(ellipse(CX, 470, 52, 60), C.charcoal, { edge: 'cut' }),
    piece(circle(CX, 454, 28), C.snapInk, { ...flat, edge: 'clean' }),
    piece(poly([[CX - 15, 466], [CX + 15, 466], [CX + 24, 534], [CX - 24, 534]]), C.snapInk, { ...flat, edge: 'clean' }),
  );
  // A big iron ring handle hung on the right leaf.
  out.push(ink(Array.from({ length: 21 }, (_, i) => [940 + Math.cos((i / 20) * Math.PI * 2) * 30, 590 + Math.sin((i / 20) * Math.PI * 2) * 30] as Pt), { width: 9, color: C.charcoal, closed: true }));
  // A worn stone step in front.
  out.push(piece(rect(DOOR.x0 - 40, GROUND - 6, DOOR.x1 - DOOR.x0 + 80, 22, 4), C.stoneLight, { edge: 'cut' }));
  return out;
}

function windowAt(x: number, y: number): Node[] {
  return [
    piece(rect(x - 30, y - 10, 60, 90, 28), C.greyDark, { edge: 'cut' }),
    piece(rect(x - 22, y - 2, 44, 78, 20), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x - 2, y - 2, 4, 78), C.greyDark, { edge: 'clean', shadow: false }),
    piece(rect(x - 22, y + 30, 44, 4), C.greyDark, { edge: 'clean', shadow: false }),
  ];
}

function crenels(x0: number, x1: number, y: number): Node[] {
  const out: Node[] = [];
  for (let x = x0; x < x1; x += 56) out.push(piece(rect(x, y - 30, 36, 34), C.stoneLight, { edge: 'cut' }));
  return out;
}

export const giantCastle = cached(() => {
  const r = rng(808);
  const grass: Node[] = [];
  for (let i = 0; i < 26; i++) {
    const x = 70 + r() * 540;
    const y = 655 + r() * 150;
    grass.push(ink([[x - 5, y + 6], [x - 1, y - 6], [x + 1, y + 6]], { width: 2.5, color: C.greenDark, opacity: 0.55, wobble: 0.8 }));
  }
  const flowers: Node[] = [[120, 676], [250, 668], [455, 672], [570, 664]].flatMap(([x, y], i) => [
    piece(circle(x, y, 5), i % 2 ? C.white : C.goldLight, flat),
    piece(circle(x, y, 2), C.gold, flat),
  ]);
  return svg({ w: W, h: H, name: 'wishing-castle', boil: false, className: 'backdrop' }, [
    // Moody lilac-grey sky, lighter toward the horizon.
    piece(rect(-20, -20, W + 40, H + 40), '#9a90b4', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 200, W + 40, 300), '#aba1c2', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 380, W + 40, 300), '#c2b8cf', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    // Soft clouds in the sky (a darker lilac, and a pale one), over on the left.
    piece(ellipse(180, 140, 150, 18), '#8a80a6', { ...flat, opacity: 0.6 }),
    piece(ellipse(420, 230, 130, 14), '#d9d0e0', { ...flat, opacity: 0.6 }),
    ...bank(150, 400, 240, 3, '#d9d0e0', '#b9afc9'),
    // The castle: wall, battlements, windows.
    ...masonry(560, 130, 1200, GROUND + 4, 31),
    ...crenels(560, 1010, 130),
    ...windowAt(730, 170),
    ...windowAt(930, 170),
    // The round tower at the right, shaded round and capped with slate.
    piece(rect(1040, 60, 200, GROUND - 56), '#a09ea3', { edge: 'cut' }),
    piece(rect(1120, 60, 120, GROUND - 56), '#8a888e', { ...flat, opacity: 0.55 }),
    ...[110, 150, 190, 230, 270].map((y) => ink([[1048, y], [1180, y + 2]], { width: 2.5, color: '#74727a', opacity: 0.55, wobble: 1.2 })),
    piece(rect(1030, 52, 216, 22, 5), C.stoneLight, { edge: 'cut' }),
    piece(poly([[1018, 56], [1120, 4], [1222, 56]]), C.plum, { edge: 'cut' }),
    piece(poly([[1070, 56], [1120, 10], [1170, 56]]), C.purple, { ...flat, opacity: 0.6 }),
    ...windowAt(1120, 300),
    // The great door.
    ...door(),
    // The hilltop: a shadow where the wall meets the grass, then the grass.
    piece(ellipse(800, GROUND + 18, 450, 18), C.greenDeep, { ...flat, opacity: 0.5 }),
    piece(curve([[-40, H + 40], [-40, 790], [18, 720], [64, 664], [140, 644], [320, 640], [700, 640], [1240, 640], [1300, 640], [1300, 700], [1300, H + 40]], 2), C.green, { rough: 1.2 }),
    piece(rect(70, 700, 1150, 140), '#79a263', { edge: 'clean', shadow: false, fibre: false, opacity: 0.55 }),
    ...grass,
    ...flowers,
    // A sea of cloud below the hill's edge, lapping it on the left.
    ...bank(10, 770, 230, 7),
    ...bank(-40, 700, 150, 8),
  ]);
});
