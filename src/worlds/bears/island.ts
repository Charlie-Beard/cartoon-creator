/**
 * Plumtree Island (1180 × 820), painted in the book's watercolour-and-ink look
 * with the bears' scenery kit. A wide, calm river after rain: a pale washed
 * sky with soft clouds (the middle of the sky is left clear for a rainbow), low
 * green hills and hedges on the far bank, and on the left a small round grassy
 * island with two leaning plum trees, a white mother duck with three yellow
 * ducklings on its shore and a few red flowers. The water on the right and
 * across the front is open for a motor-boat; y 690–820 is plain pale water so
 * the captions stay calm, and the edges fade into the white page.
 */
import { cached, curve, ellipse, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, deeper, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { bush, cloud, GRASS, GRASS_DARK, LEAF, LEAF_DARK, BARK, leaves, sky, tufts } from './scenery';

const W = 1180;
const H = 820;

const WATER = '#93bdd8';
const PLUM = '#7a4e8e';
const DUCK_WHITE = '#fbf8f0';
const FLUFF = '#f4d54a';
const BILL = '#e8a23a';

/** Soft ripple strokes over a band of water. */
function ripples(x0: number, x1: number, y0: number, y1: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const t = r();
    const x = x0 + r() * (x1 - x0);
    const y = y0 + t * (y1 - y0);
    const len = 40 + t * 90;
    out.push(pen([[x, y], [x + len * 0.3, y - 2 - t * 2], [x + len * 0.65, y + 1], [x + len, y - 1]], { width: 1.2 + t * 0.5, color: '#5b86a8', opacity: 0.5, breaks: 0.4 }));
  }
  return out;
}

/** A white mother duck standing on the shore, facing right, her feet at about (x, y). */
function motherDuck(x: number, y: number, s = 1): Node[] {
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const line = { lineWidth: 1.8, shade: '#d3dfec', bloom: false } as const;
  return [
    pen([P(-8, -2), P(-8, 8)], { width: 3, color: '#d98a2a' }),
    pen([P(10, -2), P(10, 8)], { width: 3, color: '#d98a2a' }),
    wash([P(-8, 8), P(-20, 9), P(-6, 5)], BILL, { lineWidth: 1.2, bloom: false, shade: false }),
    wash([P(10, 8), P(-2, 9), P(12, 5)], BILL, { lineWidth: 1.2, bloom: false, shade: false }),
    // body, with a tail tipped up on the left
    wash(curve([P(-46, -22), P(-30, -40), P(0, -48), P(30, -40), P(42, -18), P(28, 0), P(0, 4), P(-30, -2)], 2), DUCK_WHITE, { ...line, light: -100 }),
    // neck and head
    wash(curve([P(22, -36), P(34, -58), P(40, -80), P(52, -90), P(64, -82), P(58, -62), P(52, -40), P(44, -22)], 2), DUCK_WHITE, line),
    wash(curve([P(60, -88), P(82, -82), P(86, -76), P(62, -72)], 1), BILL, { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.5 }),
    wash(ellipse(x + 10 * s, y - 24 * s, 22 * s, 13 * s, -20), '#e7eef5', { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.6 }),
    pen([P(-14, -26), P(2, -20), P(18, -26)], { width: 1.3, opacity: 0.6 }),
    wash(ellipse(x + 55 * s, y - 82 * s, 2.6 * s, 2.6 * s), '#2c2a30', { line: false, bloom: false, shade: false, wobble: 0 }),
  ];
}

/** A yellow duckling: round fluffy body, small head, orange bill and legs. Feet at (x, y), facing `dir`. */
function duckling(x: number, y: number, dir: 1 | -1 = 1, s = 1): Node[] {
  const P = (px: number, py: number): Pt => [x + px * s * dir, y + py * s];
  return [
    pen([P(-4, -2), P(-5, 7)], { width: 2.4, color: '#d98a2a' }),
    pen([P(5, -2), P(6, 7)], { width: 2.4, color: '#d98a2a' }),
    wash(ellipse(x, y - 14 * s, 18 * s, 13 * s), FLUFF, { lineWidth: 1.6, shade: '#d9a92a', bloom: false, light: -100 }),
    wash(ellipse(x + 14 * dir * s, y - 30 * s, 9 * s, 9 * s), FLUFF, { lineWidth: 1.5, shade: '#d9a92a', bloom: false }),
    wash([P(21, -31), P(31, -28), P(21, -25)], BILL, { lineWidth: 1.2, bloom: false, shade: false, wobble: 0.4 }),
    wash(ellipse(x + 16 * dir * s, y - 32 * s, 1.8 * s, 1.8 * s), '#2c2a30', { line: false, bloom: false, shade: false, wobble: 0 }),
    pen([P(-10, -16), P(-2, -11), P(6, -15)], { width: 1.1, opacity: 0.55, color: '#b8861c' }),
  ];
}

/** A leaning plum tree: trunk from the base up to a round crown with purple plums among the leaves. */
function plumTree(bx: number, by: number, tx: number, ty: number, seed: number, crown = 120): Node[] {
  const r = rng(seed + 50);
  const side = tx > bx ? 1 : -1;
  const mx = bx + (tx - bx) * 0.35 - side * 8;
  const my = by + (ty - by) * 0.5;
  const trunk = curve([[bx - 24, by + 8], [mx - 18, my], [tx - 12, ty + 60], [tx + 12, ty + 60], [mx + 16, my], [bx + 26, by + 8]], 2);
  const plums: Node[] = [];
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2;
    const d = 0.35 + r() * 0.55;
    const px = tx + Math.cos(a) * crown * 1.05 * d;
    const py = ty - 10 + Math.sin(a) * crown * 0.85 * d;
    plums.push(wash(ellipse(px, py, 9, 10), PLUM, { lineWidth: 1.4, shade: '#4c2d5e', bloom: true, wobble: 0.6 }));
    plums.push(pen([[px - 2, py - 6], [px, py - 11]], { width: 1.1, color: LEAF_DARK }));
  }
  return [
    wash(trunk, BARK, { hatch: 5, light: 180, depth: 0.3 }),
    pen([[bx - 4, by - 10], [mx - 6, my], [tx - 4, ty + 80]], { width: 1.5, opacity: 0.7 }),
    // a small fork up into the crown
    pen([[tx, ty + 70], [tx + side * 40, ty + 10]], { width: 5, color: deeper(BARK, 0.3) }),
    ...leaves(tx, ty, crown, crown * 0.8, seed),
    ...leaves(tx - side * 60, ty + 20, crown * 0.55, crown * 0.42, seed + 1, paler(LEAF, 0.1)),
    ...plums,
  ];
}

/** A few small red flowers on stalks. */
function redFlowers(pts: Pt[]): Node[] {
  const out: Node[] = [];
  pts.forEach(([x, y], i) => {
    out.push(pen([[x, y], [x + (i % 2 ? 2 : -2), y - 12]], { width: 1.4, color: LEAF_DARK }));
    out.push(wash(ellipse(x + (i % 2 ? 2 : -2), y - 14, 5, 5), '#cf3b3b', { lineWidth: 1.1, bloom: false, shade: false, wobble: 0.5 }));
  });
  return out;
}

/** A hedge: a long low band of dark leaf, with a few lighter clumps. */
function hedge(x0: number, x1: number, y: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let x = x0; x < x1; x += 46) {
    out.push(...leaves(x + r() * 12, y - r() * 6, 36 + r() * 10, 18 + r() * 5, seed + x, r() < 0.5 ? LEAF_DARK : LEAF));
  }
  return out;
}

// ---------------------------------------------------------------------------

/**
 * Plumtree Island on a fresh, sunny day after rain: wide calm river, far bank
 * of green hills and hedges (water from y ~430).
 *
 *   island          x 120–560, shore y 420–560 (grass top y ~470, front edge y ~560)
 *   plum trees      two, leaning, crowns about (215, 255) and (440, 270)
 *   ducks           mother at about (490, 535) facing right; ducklings near x 270–400, y 540
 *   open water      x 450–1180, y 430–680 (boat's waterline about y 600–640)
 *   caption band    plain pale water y 690–820
 */
const plumtreeIsland = cached(() =>
  svg({ w: W, h: H, name: 'bears-plumtree-island' }, pageNodes(W, H, 'bears-plumtree-island', [
    ...sky(430, '#b7d2ea'),
    ...cloud(130, 150, 0.7, 31),
    ...cloud(1050, 130, 0.65, 32),
    ...cloud(790, 70, 0.45, 33),
    // far bank: gentle hills behind, a nearer rounder one, then hedges at the water's edge
    wash(curve([[-60, 440], [-60, 360], [140, 330], [380, 322], [620, 345], [820, 330], [1000, 345], [1240, 360], [1240, 440]], 2), paler(GRASS, 0.5), { light: -100, depth: 0.1, line: false, bloom: false }),
    wash(curve([[-60, 450], [-60, 400], [180, 372], [420, 380], [560, 410], [700, 384], [900, 360], [1100, 372], [1240, 392], [1240, 450]], 2), paler(GRASS, 0.2), { light: -100, depth: 0.12, hatch: 12, lineWidth: 1.8 }),
    ...bush(960, 372, 0.55, 61),
    ...bush(1110, 392, 0.5, 62),
    ...bush(720, 400, 0.4, 63),
    ...hedge(560, 1220, 428, 71),
    wash(curve([[-60, 452], [1240, 446], [1240, 460], [-60, 466]], 1), GRASS_DARK, { light: -100, line: false, depth: 0.2, bloom: false }),
    // the water: a pale blue wash from the bank, paler towards the front
    wash(curve([[-60, 440], [300, 436], [700, 442], [1240, 438], [1240, 900], [-60, 900]], 2), WATER, { light: -100, depth: 0.08, line: false, bloom: false }),
    blot(curve([[-40, 446], [W + 40, 442], [W + 40, 490], [-40, 494]], 1), '#5f8fb4', 0.3),
    blot(curve([[-40, 640], [W + 40, 636], [W + 40, 900], [-40, 900]], 1), '#e8f1f7', 0.7),
    blot(ellipse(860, 560, 260, 30), '#d4e6f1', 0.6),
    blot(ellipse(640, 470, 220, 14), '#fff4d8', 0.3),
    // reflections of the far hedges
    blot(curve([[600, 450], [1100, 450], [1100, 478], [600, 484]], 1), '#5d8a6a', 0.22),
    ...ripples(560, 1180, 478, 670, 22, 81),
    ...ripples(-20, 140, 520, 640, 6, 82),

    // --- the island ---
    // its reflection and a pale ring of ripples round its shore
    blot(ellipse(335, 585, 235, 22), '#4f7a6a', 0.3),
    wash(curve([[116, 520], [150, 468], [250, 440], [370, 438], [480, 458], [558, 505], [540, 548], [450, 568], [320, 574], [200, 566], [135, 548]], 2), '#8d7a52', { light: -90, depth: 0.2, hatch: 8, lineWidth: 2 }),
    wash(curve([[118, 508], [150, 462], [250, 432], [370, 430], [480, 448], [556, 492], [520, 530], [420, 540], [300, 546], [190, 540], [130, 530]], 2), GRASS, { light: -100, depth: 0.14, lineWidth: 2.2 }),
    blot(ellipse(340, 470, 130, 16), '#d6e68a', 0.5),
    blot(ellipse(330, 534, 190, 10), '#5f8c3f', 0.3),
    ...tufts(130, 540, 470, 14, 91, GRASS_DARK),
    ...tufts(160, 520, 528, 10, 92, GRASS_DARK),
    pen([[130, 566], [160, 572], [190, 568]], { width: 1.3, color: '#f4fafc', opacity: 0.85 }),
    pen([[330, 578], [400, 582], [460, 574]], { width: 1.3, color: '#f4fafc', opacity: 0.85 }),
    pen([[100, 550], [130, 560]], { width: 1.2, color: '#5b86a8', opacity: 0.6 }),
    pen([[540, 562], [580, 556]], { width: 1.2, color: '#5b86a8', opacity: 0.6 }),
    // the two leaning plum trees
    ...plumTree(268, 462, 196, 262, 101, 118),
    ...plumTree(350, 466, 438, 272, 111, 112),
    // red flowers, ducklings and mother duck on the shore
    ...redFlowers([[150, 508], [172, 516], [520, 512], [540, 500], [498, 516], [405, 540], [236, 534], [258, 538]]),
    ...duckling(262, 548, -1, 0.95),
    ...duckling(322, 556, 1, 1),
    ...duckling(384, 546, 1, 0.92),
    ...motherDuck(472, 538, 1),
    // wet green at the very front of the shore
    ...tufts(190, 460, 556, 5, 93, LEAF_DARK),
  ])),
);

export const island: Record<string, () => string> = {
  'plumtree-island': plumtreeIsland,
};
