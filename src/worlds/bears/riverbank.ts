/**
 * The river bank by the old boat-house (1180 × 820), from the Teddy Bear
 * Treasury's "Uncle Sailor Bill", painted with the scenery kit in the book's
 * watercolour-and-ink look. Drawn on a sunny summer's day: the episode darkens
 * it for the storm (dim, rain, storm-cloud props), so the sky is left open at
 * the top for clouds to drift into.
 *
 *   willow tree      left, trunk base (120, 560), fronds hang to y ~470, x < 270
 *   back river       x 0–760, y 400–465, with the far bank beyond
 *   open ground      x 250–820, feet y 620–660 (plain grass and a sandy path)
 *   boat-house       right, wall x 850–1125, ground y 664, gable top y ~395
 *   doorway          x 880–1010, y 535–664 (bottom on the ground line)
 *   weathercock      on the ridge at x 985, y 330–400
 *   stone edge       y ~690–712, water in front (the caption band is calm)
 *   rowing boat      pulled up at x 1000–1150, resting on the edge at y ~712
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, deeper, INK, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { bush, cloud, GRASS, GRASS_DARK, LEAF, LEAF_DARK, leaves, BARK, PATH, pebbles, sky, tufts } from './scenery';

const W = 1180;
const H = 820;

const WATER = '#8fb9d6';
const PLANK = '#8f9eab';
const TILE = '#c4543c';
const STONE = '#b8bec6';

/** A bulrush clump: tall pen stems with brown velvet heads, root at (x, y). */
function bulrushes(x: number, y: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const bx = x + i * 14 + (r() - 0.5) * 8;
    const h = 90 + r() * 60;
    const lean = (r() - 0.5) * 24;
    out.push(pen([[bx, y], [bx + lean * 0.5, y - h * 0.5], [bx + lean, y - h]], { width: 2.4, color: '#5d7f3a', breaks: 0 }));
    out.push(wash(ellipse(bx + lean, y - h - 14, 5.5, 17), '#8a5a3a', { lineWidth: 1.5, bloom: false, depth: 0.4 }));
    out.push(pen([[bx + lean, y - h - 32], [bx + lean, y - h - 42]], { width: 1.4, color: '#5a3a28', breaks: 0 }));
  }
  // two long grassy blades
  out.push(pen([[x - 6, y], [x - 26, y - 50], [x - 20, y - 90]], { width: 2.2, color: '#6f9846', breaks: 0 }));
  out.push(pen([[x + n * 14, y], [x + n * 14 + 24, y - 44], [x + n * 14 + 16, y - 84]], { width: 2.2, color: '#6f9846', breaks: 0 }));
  return out;
}

/** A round lily pad with its little slit. */
function pad(x: number, y: number, s = 1): Node[] {
  return [
    wash(ellipse(x, y, 30 * s, 10 * s), '#74a04a', { lineWidth: 1.6, depth: 0.4, bloom: false, wobble: 0.6 }),
    pen([[x, y], [x + 30 * s, y - 3 * s]], { width: 1.2, color: '#4a6e30', opacity: 0.8, breaks: 0 }),
    blot(ellipse(x - 6 * s, y - 2 * s, 14 * s, 4 * s), '#a3c46c', 0.5),
  ];
}

/** The white water lily on its pad: pointed petals round a yellow heart. */
function lily(x: number, y: number, s = 1): Node[] {
  const petals = [-52, -26, 0, 26, 52].map((a) => {
    const rad = (a * Math.PI) / 180;
    const tx = x + Math.sin(rad) * 40 * s;
    const ty = y - Math.cos(rad) * 34 * s;
    return wash(curve([[x - 9 * s, y], [x + Math.sin(rad) * 16 * s - 8 * s, y - 16 * s], [tx, ty], [x + Math.sin(rad) * 16 * s + 8 * s, y - 16 * s], [x + 9 * s, y]], 1), '#fbfbf6', { shade: '#cfdcea', lineWidth: 1.6, depth: 0.4, bloom: false, wobble: 0.6 });
  });
  return [
    ...pad(x, y + 6 * s, 1.3 * s),
    ...petals,
    wash(ellipse(x, y - 3 * s, 11 * s, 6 * s), '#f0cf4f', { lineWidth: 1.3, bloom: false, shade: '#d89a2a' }),
  ];
}

/** A weeping willow: a leaning trunk, a crown, and long drooping fronds. */
function willow(x: number, base: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [
    wash(curve([[x - 46, base + 10], [x - 22, base - 120], [x - 8, 330], [x + 4, 270], [x + 30, 270], [x + 28, 330], [x + 24, base - 120], [x + 52, base + 10]], 2), BARK, { hatch: 5, light: 180, depth: 0.3, lineWidth: 2.4 }),
    pen([[x - 4, base - 10], [x - 6, base - 140], [x, 340]], { width: 1.6, opacity: 0.7 }),
    pen([[x + 14, base - 6], [x + 14, base - 100]], { width: 1.4, opacity: 0.6 }),
    ...leaves(x + 10, 250, 150, 62, seed + 1, LEAF),
  ];
  for (let i = 0; i < 30; i++) {
    const sx = x - 120 + (i / 29) * 260 + (r() - 0.5) * 8;
    const sy = 255 + Math.sin((i / 29) * Math.PI) * 18 + r() * 10;
    const len = 130 + r() * 110 + Math.sin((i / 29) * Math.PI) * 30;
    const sway = (r() - 0.5) * 16;
    const col = i % 3 === 0 ? '#8db25a' : i % 3 === 1 ? '#6f9846' : '#a3c06a';
    out.push(pen([[sx, sy], [sx + sway * 0.4, sy + len * 0.5], [sx + sway, sy + len]], { width: 2.1, color: col, breaks: 0.1 }));
    for (let k = 1; k <= 5; k++) {
      const ly = sy + (len * k) / 6;
      const lx = sx + sway * (k / 6) * (k / 6);
      out.push(pen([[lx - 5, ly - 2], [lx + 1, ly + 9], [lx + 5, ly - 1]], { width: 1.5, color: deeper(col, 0.35), opacity: 0.8, breaks: 0 }));
    }
  }
  return out;
}

/** The weathercock on the ridge at (x, y): a pole, N S E W arms with arrow heads, a black cockerel on top. */
function weathercock(x: number, y: number): Node[] {
  const arm = 46;
  const arrow = (ax: number, ay: number, dx: number, dy: number): Node =>
    wash([[ax, ay], [ax - dx * 9 - dy * 5, ay - dy * 9 + dx * 5], [ax - dx * 9 + dy * 5, ay - dy * 9 - dx * 5]], INK, { line: false, shade: false, bloom: false, wobble: 0.3 });
  const cy = y - 62;
  return [
    pen([[x, y], [x, y - 74]], { width: 3, breaks: 0 }),
    pen([[x - arm, cy + 30], [x + arm, cy + 30]], { width: 2.4, breaks: 0 }),
    pen([[x, cy + 30 - 22], [x, cy + 30 + 22]], { width: 2.2, breaks: 0 }),
    arrow(x + arm + 6, cy + 30, 1, 0),
    arrow(x - arm - 6, cy + 30, -1, 0),
    arrow(x, cy + 30 - 26, 0, -1),
    arrow(x, cy + 30 + 26, 0, 1),
    // the cockerel: body, tail plume, neck and head, comb and beak
    wash(curve([[x - 22, cy + 2], [x - 6, cy - 8], [x + 12, cy - 4], [x + 16, cy + 8], [x - 8, cy + 14]], 2), INK, { line: false, shade: false, bloom: false, wobble: 0.4 }),
    wash(curve([[x - 20, cy + 2], [x - 38, cy - 22], [x - 30, cy - 34], [x - 18, cy - 12], [x - 10, cy - 6]], 2), INK, { line: false, shade: false, bloom: false, wobble: 0.4 }),
    wash(curve([[x + 6, cy - 4], [x + 14, cy - 22], [x + 24, cy - 24], [x + 22, cy - 10], [x + 14, cy]], 2), INK, { line: false, shade: false, bloom: false, wobble: 0.4 }),
    wash(ellipse(x + 22, cy - 26, 6, 5), INK, { line: false, shade: false, bloom: false, wobble: 0.3 }),
    wash([[x + 27, cy - 28], [x + 36, cy - 24], [x + 27, cy - 23]], INK, { line: false, shade: false, bloom: false, wobble: 0.2 }),
    wash([[x + 18, cy - 31], [x + 21, cy - 40], [x + 24, cy - 32], [x + 27, cy - 38], [x + 27, cy - 30]], INK, { line: false, shade: false, bloom: false, wobble: 0.2 }),
    pen([[x - 4, cy + 14], [x - 4, cy + 28]], { width: 1.8, breaks: 0 }),
    pen([[x + 6, cy + 14], [x + 6, cy + 28]], { width: 1.8, breaks: 0 }),
  ];
}

/** The old boat-house: grey-blue planks, a red-tiled gable, a wide dark doorway, ivy at the side. */
function boathouse(): Node[] {
  const L = 850;
  const R = 1125;
  const G = 664;
  const out: Node[] = [
    // wall of overlapping planks
    wash(rect(L, 490, R - L, G - 490), PLANK, { hatch: 8, light: -120, depth: 0.2, lineWidth: 2.6, wobble: 1.4 }),
  ];
  for (let y = 508; y < G; y += 20) {
    out.push(pen([[L + 2, y], [R - 2, y + 1]], { width: 1.5, opacity: 0.6, color: '#42505e', breaks: 0.5 }));
    out.push(pen([[L + 4, y + 3], [R - 4, y + 4]], { width: 1, opacity: 0.3, color: '#dfe6ec', breaks: 0.5 }));
  }
  const r = rng(77);
  for (let i = 0; i < 9; i++) {
    const x = L + 20 + r() * (R - L - 40);
    out.push(pen([[x, 500 + r() * 120], [x + (r() - 0.5) * 4, 540 + r() * 110]], { width: 1.2, opacity: 0.4, color: '#42505e' }));
  }
  // red-tiled roof: a wide gable with an overhang, scalloped tiles in rows
  out.push(wash([[L - 30, 504], [986, 392], [R + 30, 504], [R + 20, 520], [L - 20, 520]], TILE, { hatch: 7, light: -100, depth: 0.28, lineWidth: 2.6, wobble: 1.2 }));
  for (let row = 0; row < 5; row++) {
    const y = 420 + row * 22;
    const half = (y - 392) * 1.18 + 6;
    for (let x = 986 - half + 6; x < 986 + half - 6; x += 24) {
      out.push(pen([[x - 10, y], [x, y + 8], [x + 10, y]], { width: 1.4, color: '#7a2c20', opacity: 0.65, breaks: 0 }));
    }
  }
  out.push(wash(rect(L - 24, 512, R - L + 48, 12), '#7a2c20', { lineWidth: 1.8, bloom: false, depth: 0.3 }));
  // a little heart-shaped hole in the gable, as in the book
  out.push(wash(curve([[986, 462], [972, 452], [974, 442], [986, 446], [998, 442], [1000, 452]], 1), '#3b2b2b', { lineWidth: 1.2, bloom: false, shade: false }));
  // the wide dark doorway, bottom on the ground line
  out.push(wash(rect(880, 535, 130, G - 535), '#2f2e33', { lineWidth: 2.8, shade: false, bloom: false, wobble: 1 }));
  out.push(blot(rect(890, 550, 110, G - 550), '#4a4a54', 0.5));
  out.push(wash(rect(870, 528, 150, 10), '#6e4e34', { lineWidth: 2, bloom: false, depth: 0.3 }));
  out.push(pen([[872, 536], [872, G]], { width: 5, color: '#6e4e34', breaks: 0 }));
  out.push(pen([[1018, 536], [1018, G]], { width: 5, color: '#6e4e34', breaks: 0 }));
  // a worn stone step and a little shadow
  out.push(wash(rect(862, G - 6, 166, 14), '#bdb7ab', { lineWidth: 1.8, bloom: false, depth: 0.3, wobble: 0.8 }));
  out.push(blot(ellipse(1090, G + 6, 60, 7), '#6f7d6a', 0.4));
  // ivy climbing the right corner
  out.push(...leaves(1120, 600, 52, 90, 91, LEAF_DARK));
  out.push(...leaves(1138, 520, 36, 50, 92, LEAF));
  return out;
}

/** The old wooden rowing boat pulled up on the stones: a curved hull with planks, a seat and an oar. Bow at the left. */
function rowboat(x: number, y: number): Node[] {
  const P = (px: number, py: number): Pt => [x + px, y + py];
  return [
    wash(curve([P(0, -34), P(14, -8), P(52, 6), P(110, 8), P(146, 0), P(150, -30), P(70, -26)], 2), '#b98f5a', { hatch: 6, light: -120, depth: 0.3, lineWidth: 2.4 }),
    wash(curve([P(0, -34), P(70, -26), P(150, -30), P(140, -36), P(70, -34), P(8, -40)], 1), '#8a6540', { lineWidth: 1.8, bloom: false, depth: 0.3 }),
    pen([[x + 12, y - 12], [x + 70, y - 8], [x + 140, y - 12]], { width: 1.3, opacity: 0.6, color: '#5b4026' }),
    pen([[x + 30, y - 2], [x + 76, y + 2], [x + 126, y - 2]], { width: 1.3, opacity: 0.6, color: '#5b4026' }),
    pen([[x + 70, y - 26], [x + 72, y + 4]], { width: 1.3, opacity: 0.5, color: '#5b4026' }),
    wash(rect(x + 62, y - 36, 18, 6), '#9a7650', { lineWidth: 1.4, bloom: false }),
    blot(ellipse(x + 76, y + 10, 78, 6), '#5e7f98', 0.4),
  ];
}

/** A chain of stones along the water's edge, following the points of `edge`. */
function stoneEdge(edge: Pt[], seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < edge.length - 1; i++) {
    const [x0, y0] = edge[i];
    const [x1, y1] = edge[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 34));
    for (let k = 0; k < n; k++) {
      const t = (k + r() * 0.5) / n;
      const sx = x0 + (x1 - x0) * t;
      const sy = y0 + (y1 - y0) * t - 6;
      out.push(wash(ellipse(sx, sy, 20 + r() * 8, 9 + r() * 3, (r() - 0.5) * 12), r() < 0.5 ? STONE : paler(STONE, 0.3), { lineWidth: 1.6, depth: 0.35, bloom: false, wobble: 0.8 }));
    }
  }
  return out;
}

// The water's top edge in front, from the left bay across to the right.
const EDGE: Pt[] = [[-60, 570], [100, 580], [190, 622], [255, 688], [400, 704], [700, 708], [1000, 706], [1240, 712]];

const bearRiver = cached(() =>
  svg({ w: W, h: H, name: 'bears-bear-river' }, pageNodes(W, H, 'bears-bear-river', [
    ...sky(400),
    ...cloud(560, 150, 0.55, 14),
    // far bank, trees and the back river
    wash(curve([[-60, 900], [-60, 360], [200, 350], [460, 372], [760, 360], [1240, 380], [1240, 900]], 2), paler(GRASS, 0.5), { light: -90, depth: 0.08, line: false, bloom: false }),
    ...[330, 470, 640, 740].flatMap((x, i) => bush(x, 372 + (i % 2) * 6, 0.9 + (i % 3) * 0.15, 120 + i)),
    wash(curve([[-60, 405], [180, 398], [380, 410], [560, 402], [770, 420], [770, 478], [560, 470], [300, 480], [-60, 480]], 2), WATER, { light: -100, depth: 0.15, lineWidth: 2, hatch: 9 }),
    blot(ellipse(520, 430, 150, 10), '#d6e8f2', 0.8),
    ...[[180, 440], [400, 452], [600, 438]].map(([x, y]) => pen([[x - 30, y], [x - 8, y + 3], [x + 12, y], [x + 34, y + 3]], { width: 1.5, color: '#4f7da0', opacity: 0.65, breaks: 0 })),
    // the grassy bank
    wash(curve([[-60, 900], [-60, 420], [120, 404], [250, 432], [330, 468], [560, 470], [790, 458], [1000, 446], [1240, 440], [1240, 900]], 2), GRASS, { light: -90, depth: 0.12, lineWidth: 2, bloom: false }),
    wash(curve([[-60, 900], [-60, 560], [400, 560], [900, 570], [1240, 560], [1240, 900]], 2), paler(GRASS, 0.12), { light: -90, depth: 0.05, line: false, bloom: false }),
    ...tufts(250, 880, 520, 10, 131, GRASS),
    ...tufts(0, 250, 520, 6, 132),
    // sandy path from the doorway, along the bank in front of the bears
    wash(curve([[1018, 664], [1000, 692], [800, 698], [520, 700], [330, 706], [236, 688], [320, 654], [560, 642], [790, 646], [872, 664]], 2), PATH, { light: -90, depth: 0.14, lineWidth: 1.8 }),
    ...pebbles(300, 664, 560, 28, 9, 133),
    ...pebbles(880, 668, 140, 14, 3, 134),
    ...tufts(250, 850, 640, 5, 135, GRASS_DARK),
    ...tufts(820, 1180, 690, 4, 136),
    // the willow and bulrushes at the left
    ...willow(110, 560, 140),
    ...bush(260, 470, 0.5, 141),
    // the boat-house on the right
    ...bush(1135, 470, 0.7, 142),
    ...boathouse(),
    ...weathercock(986, 398),
    // the water in front, with its stone edge
    wash(curve([...EDGE, [1240, 900], [-60, 900]], 2), WATER, { light: -100, depth: 0.1, lineWidth: 2, hatch: 9 }),
    blot(curve([[-40, 760], [W + 40, 760], [W + 40, 800], [-40, 800]], 1), '#bcd8e8', 0.35),
    ...stoneEdge(EDGE.slice(2), 150),
    ...stoneEdge(EDGE.slice(0, 3), 151),
    ...[[330, 730], [620, 752], [900, 740], [1090, 770], [140, 790]].map(([x, y]) => pen([[x - 40, y], [x - 12, y + 4], [x + 16, y], [x + 44, y + 4]], { width: 1.4, color: '#5b7f9f', opacity: 0.45, breaks: 0.6 })),
    // lily pads, a white lily and bulrushes in the bay at the left
    ...pad(70, 640, 0.9),
    ...pad(235, 656, 0.7),
    ...pad(70, 692, 1.1),
    ...lily(160, 664, 1),
    ...bulrushes(20, 586, 4, 160),
    ...bulrushes(190, 618, 3, 161),
    ...rowboat(1000, 712),
  ])),
);

export const riverbank: Record<string, () => string> = {
  'bear-river': bearRiver,
};
