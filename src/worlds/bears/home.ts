/**
 * Bear Cottage and its neighbourhood (1180 × 820 backdrops), painted with the
 * scenery kit: the cosy kitchen, the sunny path through the wood, and the
 * village green across from the cottage. Each leaves the middle of the floor
 * open for three bears and keeps y 690–820 pale for the captions.
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, INK, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { cottage } from './places';
import { bush, cloud, GRASS, GRASS_DARK, ground, BARK, leaves, LEAF, LEAF_DARK, path, pebbles, sky, tree, tufts } from './scenery';

const W = 1180;
const H = 820;

const CREAM = '#f3e4bf';
const BRICK = '#c98660';
const RANGE_GREEN = '#8a9a62';
const BLUE = '#7fa3d0';
const WHITE_CHINA = '#f6f8fa';
const CHECK_GREEN = '#86ad5a';

/** A standing blue-and-white plate (seen nearly edge-on) with its blue ring. */
function plate(cx: number, cy: number, r: number): Node[] {
  return [
    wash(ellipse(cx, cy, r * 0.82, r), WHITE_CHINA, { shade: '#cdd9e8', lineWidth: 1.8, bloom: false }),
    blot(ellipse(cx, cy, r * 0.6, r * 0.76), BLUE, 0.55),
    wash(ellipse(cx, cy, r * 0.34, r * 0.42), WHITE_CHINA, { line: false, shade: false, bloom: false }),
  ];
}

/** A blue-striped jug standing at (x, base). */
function jug(x: number, base: number, s = 1): Node[] {
  const P = (px: number, py: number): Pt => [x + px * s, base + py * s];
  return [
    wash(curve([P(-20, 0), P(-26, -30), P(-16, -52), P(-10, -60), P(12, -60), P(18, -52), P(24, -30), P(20, 0)], 2), WHITE_CHINA, { shade: '#cdd9e8', lineWidth: 1.8 }),
    wash(curve([P(22, -48), P(40, -44), P(42, -22), P(24, -16)], 2), WHITE_CHINA, { shade: '#cdd9e8', lineWidth: 1.6, bloom: false }),
    blot(curve([P(-23, -38), P(23, -38), P(23, -28), P(-23, -28)], 1), BLUE, 0.6),
    blot(curve([P(-21, -16), P(21, -16), P(21, -8), P(-21, -8)], 1), BLUE, 0.5),
  ];
}

/** Rows of little pink and blue flowers for the wallpaper: a pattern, kept pale. */
function wallpaper(x0: number, y0: number, x1: number, y1: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  let row = 0;
  for (let y = y0; y < y1; y += 46, row++) {
    for (let x = x0 + (row % 2) * 30; x < x1; x += 60) {
      const px = x + (r() - 0.5) * 6;
      const py = y + (r() - 0.5) * 6;
      const c = (row + Math.round(x / 60)) % 3 === 0 ? '#9fb8dc' : '#e2a2a2';
      out.push(blot(ellipse(px, py, 6, 6), c, 0.55));
      out.push(pen([[px, py + 6], [px + 2, py + 16]], { width: 1.2, color: '#7c9a52', opacity: 0.6 }));
      out.push(pen([[px + 1, py + 11], [px + 9, py + 8]], { width: 1.1, color: '#7c9a52', opacity: 0.55 }));
    }
  }
  return out;
}

/** Bricks in a rectangle: a red-brown wash, mortar lines in pen, and shade. */
function bricks(x0: number, y0: number, x1: number, y1: number, seed: number): Node[] {
  const out: Node[] = [wash(rect(x0, y0, x1 - x0, y1 - y0), BRICK, { hatch: 8, light: -90, depth: 0.2, lineWidth: 2.2 })];
  const r = rng(seed);
  let row = 0;
  for (let y = y0 + 22; y < y1; y += 22, row++) {
    out.push(pen([[x0 + 2, y], [x1 - 2, y]], { width: 1.3, opacity: 0.5, color: '#5a3a28' }));
    for (let x = x0 + (row % 2) * 24 + 20; x < x1 - 4; x += 48) out.push(pen([[x + (r() - 0.5) * 3, y - 22], [x, y]], { width: 1.2, opacity: 0.5, color: '#5a3a28' }));
  }
  return out;
}

/**
 * Bear Cottage's kitchen. Wallpapered cream wall; on the left a green range
 * under a brick chimney breast and a mantelpiece of blue-and-white china; a
 * window with blue curtains in the middle; Daddy's green check armchair; and
 * a check-clothed table at the right. Bears stand in front on the stone floor.
 *
 *   hob (saucepan stands here)  x 70–270, top y 480 (centre x 170)
 *   window sill                 x 350–690, top y 372 (clear, nothing on it)
 *   table top                   x 925–1150, y 520
 *   armchair                    x 690–905, y 400–612 (seat top y ~ 530)
 *   floor line                  y 612; bears' feet y 625–650
 */
const kitchen = cached(() =>
  svg({ w: W, h: H, name: 'bears-kitchen' }, pageNodes(W, H, 'bears-kitchen', [
    // wall
    wash(rect(-40, -40, W + 80, 660), CREAM, { light: -90, depth: 0.08, line: false, bloom: false, wobble: 0 }),
    ...wallpaper(30, 40, W - 20, 580, 5),
    // dado rail where the wall meets the floor
    wash(rect(-40, 590, W + 80, 26), '#d9b98a', { line: INK, lineWidth: 1.6, bloom: false, depth: 0.2 }),

    // window: glass, frame, bars, sill
    wash(rect(380, 180, 280, 192), '#cfe3ef', { lineWidth: 2.6, light: -120, depth: 0.2 }),
    blot(ellipse(520, 250, 110, 50), '#ffffff', 0.7),
    ...cloud(540, 300, 0.42, 6).slice(0, 0),
    wash(curve([[420, 330], [470, 300], [520, 322], [575, 296], [620, 326], [620, 372], [420, 372]], 1), '#b9d68c', { line: false, bloom: false, depth: 0.1 }),
    pen([[520, 180], [520, 372]], { width: 3.2 }),
    pen([[380, 276], [660, 276]], { width: 3.2 }),
    wash(rect(350, 372, 340, 20), '#f0e7d2', { lineWidth: 2.2, depth: 0.3, bloom: false }),
    wash(rect(364, 392, 312, 12), '#d8c9a8', { lineWidth: 1.4, bloom: false, depth: 0.1 }),
    // curtains, blue with little white sprigs, tied back
    ...[[380, 392, 1], [660, 392, -1]].flatMap(([cx, , side]) => {
      const sd = side as number;
      const x = cx as number;
      return [
        wash(curve([[x - sd * 4, 160], [x + sd * 50, 164], [x + sd * 58, 260], [x + sd * 40, 330], [x + sd * 56, 420], [x - sd * 4, 420], [x + sd * 10, 330], [x - sd * 4, 250]], 2), '#7fa3d0', { hatch: 7, light: sd > 0 ? -60 : -120, depth: 0.25, lineWidth: 2.2 }),
        ...[190, 230, 280, 360, 410].map((y, i) => blot(ellipse(x + sd * (20 + (i % 2) * 22), y, 4.5, 4.5), '#f3f7fb', 0.85)),
      ];
    }),
    wash(rect(360, 150, 320, 14), '#9a7650', { lineWidth: 2, bloom: false, depth: 0.3 }),

    // a framed picture over the armchair
    wash(rect(770, 190, 100, 80), '#e8dcc0', { lineWidth: 2.4, depth: 0.2, bloom: false }),
    wash(rect(782, 202, 76, 56), '#cddcc4', { lineWidth: 1.6, bloom: false, depth: 0.15 }),
    blot(ellipse(820, 232, 22, 14), '#c9a06c', 0.7),
    pen([[820, 190], [800, 150], [840, 150], [820, 190]], { width: 1.1, opacity: 0.6, breaks: 0 }),

    // chimney breast of brick and the green range below it
    ...bricks(30, 180, 330, 480, 7),
    wash(rect(30, 270, 330, 16), '#e5c690', { lineWidth: 2.4, bloom: false, depth: 0.25 }),
    wash(rect(10, 254, 370, 18), '#8a6540', { lineWidth: 2.4, hatch: 8, depth: 0.3, bloom: false }),
    // dark hole of the chimney, with a warm glow, behind the pan
    wash(curve([[90, 480], [96, 350], [170, 320], [244, 350], [250, 480]], 2), '#7a5444', { hatch: 6, lineWidth: 2.2, shade: false, bloom: false }),
    blot(ellipse(170, 450, 60, 22), '#f0b25a', 0.75),
    // the range: a green iron cooker with a hob, a rail and two oven doors
    wash(rect(40, 480, 250, 134), RANGE_GREEN, { hatch: 7, light: -100, depth: 0.2, lineWidth: 2.6 }),
    wash(rect(30, 470, 270, 20), '#55603c', { lineWidth: 2.4, bloom: false, depth: 0.3 }),
    wash(ellipse(170, 468, 70, 10), '#2e2b28', { lineWidth: 1.8, shade: false, bloom: false }),
    wash(rect(56, 508, 104, 92), '#a2b078', { lineWidth: 2.2, hatch: 6, depth: 0.2 }),
    wash(rect(176, 508, 104, 92), '#a2b078', { lineWidth: 2.2, hatch: 6, depth: 0.2 }),
    pen([[70, 524], [146, 524]], { width: 3.4, color: '#d3b068' }),
    pen([[190, 524], [266, 524]], { width: 3.4, color: '#d3b068' }),
    ...[64, 84, 270].flatMap((x) => [x].map((px) => blot(ellipse(px, 614, 3, 3), INK, 0.5))),
    // mantelpiece china
    ...plate(70, 218, 36),
    ...jug(140, 254, 1.2),
    ...plate(224, 216, 34),
    ...jug(290, 254, 0.95),
    wash(rect(330, 214, 22, 40), '#a8644a', { lineWidth: 1.8, hatch: 5, bloom: false }),
    wash(rect(312, 230, 20, 24), '#7d96b5', { lineWidth: 1.8, hatch: 5, bloom: false }),

    // floor: grey-brown flagstones, pale towards the captions
    wash(rect(-60, 616, W + 120, 300), '#d6c8ac', { light: -90, depth: 0.06, line: INK, lineWidth: 2, bloom: false, wobble: 0.6 }),
    ...[0, 1, 2, 3].flatMap((i) => {
      const y = 650 + i * 46;
      const r = rng(30 + i);
      const out: Node[] = [pen([[-10, y], [W + 10, y + (r() - 0.5) * 4]], { width: 1.4, opacity: 0.32, color: '#7a6a52' })];
      for (let x = (i % 2) * 70 + 30; x < W; x += 140) out.push(pen([[x, y], [x + (r() - 0.5) * 8, y + 46]], { width: 1.3, opacity: 0.28, color: '#7a6a52' }));
      return out;
    }),
    // a round rag rug in front of the range, with soft stripes
    wash(ellipse(480, 668, 190, 34), '#e7d3bf', { lineWidth: 1.8, light: -90, depth: 0.15, bloom: false, opacity: 0.85 }),
    wash(ellipse(480, 668, 140, 24), '#c9d7b8', { line: false, bloom: false, shade: false, opacity: 0.6 }),
    wash(ellipse(480, 668, 90, 14), '#e8b9a8', { line: false, bloom: false, shade: false, opacity: 0.6 }),

    // Daddy's armchair: deep green check, patched, with arms and a cushion
    wash(curve([[704, 612], [698, 470], [720, 404], [790, 392], [860, 404], [892, 470], [900, 612]], 2), '#6f9a5c', { hatch: 7, light: -110, depth: 0.2, lineWidth: 2.6 }),
    ...[430, 470, 510, 550].map((y) => pen([[712, y], [888, y]], { width: 1.5, color: '#3f6a3a', opacity: 0.55 })),
    ...[740, 780, 820, 860].map((x) => pen([[x, 400], [x + 2, 600]], { width: 1.5, color: '#3f6a3a', opacity: 0.55 })),
    wash(curve([[690, 560], [684, 520], [706, 500], [740, 506], [748, 612], [694, 612]], 2), '#7fab68', { hatch: 7, depth: 0.2, lineWidth: 2.4 }),
    wash(curve([[912, 560], [918, 520], [896, 500], [862, 506], [854, 612], [908, 612]], 2), '#7fab68', { hatch: 7, depth: 0.2, lineWidth: 2.4 }),
    wash(curve([[740, 570], [740, 538], [860, 538], [860, 570], [872, 612], [728, 612]], 1), '#8db873', { hatch: 6, depth: 0.2, lineWidth: 2.2 }),
    wash(rect(786, 552, 26, 24), '#a8c8de', { lineWidth: 1.6, bloom: false, depth: 0.1 }),
    pen([[786, 564], [812, 564]], { width: 1.2, opacity: 0.7 }),
    wash(curve([[708, 612], [708, 626], [740, 628], [740, 612]], 1), '#8a6540', { lineWidth: 1.6, bloom: false }),
    wash(curve([[862, 612], [862, 628], [894, 626], [894, 612]], 1), '#8a6540', { lineWidth: 1.6, bloom: false }),
    // shadow on the floor under it
    blot(ellipse(800, 626, 120, 10), '#8f7d5c', 0.45),

    // the table: a round-topped table with a green check cloth (top at y 520)
    wash(rect(930, 520, 232, 112), '#f4f1e2', { hatch: 8, light: -100, depth: 0.2, lineWidth: 2.4 }),
    wash(rect(920, 512, 242, 16), '#f4f1e2', { line: INK, lineWidth: 2.2, bloom: false, depth: 0.2 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => pen([[930 + i * 32, 530], [924 + i * 32, 630]], { width: 3.4, color: CHECK_GREEN, opacity: 0.55, breaks: 0 })),
    ...[0, 1, 2].map((i) => pen([[926, 546 + i * 32], [1168, 546 + i * 32]], { width: 3.4, color: CHECK_GREEN, opacity: 0.55, breaks: 0 })),
    // a patch on the cloth and scalloped hem
    wash(rect(1090, 576, 30, 26), '#a8c0dc', { lineWidth: 1.6, bloom: false, depth: 0.1 }),
    blot(ellipse(1040, 634, 150, 9), '#8f7d5c', 0.4),

    // the floor's calm foreground: a few stones at the edge of the rug
    ...pebbles(40, 660, 220, 26, 4, 3),
  ])),
);

/** Pale flowers scattered along y (little white and yellow ones). */
function flowers(x0: number, x1: number, y0: number, y1: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  const colors = ['#fbf6ea', '#f0cf4f', '#e9a0a0', '#fbf6ea'];
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0);
    const y = y0 + r() * (y1 - y0);
    out.push(pen([[x, y], [x + (r() - 0.5) * 4, y - 12 - r() * 6]], { width: 1.4, color: GRASS_DARK, breaks: 0 }));
    out.push(wash(ellipse(x, y - 15, 4.5, 4.5), colors[i % colors.length], { lineWidth: 1.2, bloom: false, shade: false }));
  }
  return out;
}

/** A wide trunk with hatched bark and a few scribbled cracks, from the canopy down to the ground at `base`. */
function trunk(x0: number, x1: number, base: number, seed: number, lean = 0): Node[] {
  const r = rng(seed);
  const xm = (x0 + x1) / 2;
  const out: Node[] = [
    wash(curve([[x0 - 40, base + 18], [x0 + 8, base - 40], [x0 + lean, 300], [x0 + 18 + lean, -30], [x1 - 18 + lean, -30], [x1 + lean, 300], [x1 - 8, base - 40], [x1 + 44, base + 18], [xm, base + 30]], 2), BARK, { hatch: 5, light: 180, depth: 0.28, lineWidth: 2.6 }),
  ];
  for (let i = 0; i < 6; i++) {
    const x = x0 + 14 + (i / 5) * (x1 - x0 - 28);
    const y = 80 + r() * 200;
    out.push(pen([[x + lean * 0.6, y], [x + (r() - 0.5) * 12 + lean * 0.4, y + 140 + r() * 140], [x + (r() - 0.5) * 16, y + 300 + r() * 140]], { width: 1.7, opacity: 0.65, color: '#4b3422' }));
  }
  out.push(wash(ellipse(xm - 10, base - 190, 20, 30), '#5e4630', { lineWidth: 1.8, bloom: false, hatch: 5 }));
  return out;
}

/**
 * A sunny path through the wood. Big hatched trunks frame the left and right
 * edges under a leafy canopy; a sandy path winds back to a little thatched
 * cottage at the wood's edge in the middle distance, with the sunlit field
 * beyond. Open grass across the middle front.
 *
 *   left trunk       x 30–180
 *   right trunk      x 905–1075, base y 660 (someone can stand "behind" it at x 880–960)
 *   cottage          centre x 620, base y 410 (distant)
 *   ground line      y 630–660; open ground x 230–860
 */
const wood = cached(() =>
  svg({ w: W, h: H, name: 'bears-wood' }, pageNodes(W, H, 'bears-wood', [
    ...sky(360, '#b6d3e8'),
    ...cloud(560, 160, 0.7, 4),
    // distant hills and trees at the edge of the wood
    ground(330, paler(GRASS, 0.55), { amp: 22, seed: 12, line: false }),
    ...[210, 330, 430, 800, 900].flatMap((x, i) => tree(x, 400 + (i % 2) * 8, 200 + (i % 3) * 20, 40 + i).map((n) => n)),
    ground(405, paler(GRASS, 0.3), { amp: 14, seed: 13, line: false }),
    ...cottage(620, 412, 0.5),
    ...bush(510, 410, 0.55, 23),
    ...bush(748, 412, 0.6, 24),
    ground(450, GRASS, { amp: 18, seed: 14 }),
    ground(640, paler(GRASS, 0.12), { amp: 14, seed: 15, line: false }),
    path(580, 620, 424),
    ...flowers(230, 860, 560, 660, 16, 31),
    ...tufts(240, 860, 640, 14, 32),
    ...pebbles(380, 650, 340, 36, 7, 33),
    ...tufts(240, 880, 600, 8, 35, GRASS),

    // framing trunks
    ...trunk(30, 180, 660, 51, 6),
    ...trunk(905, 1075, 660, 52, -6),
    ...tufts(20, 220, 674, 7, 36),
    ...tufts(880, 1130, 680, 8, 37),
    ...bush(90, 650, 0.6, 25),
    ...flowers(870, 960, 670, 690, 3, 38),
    // leafy canopy across the top: dark leaf masses at the edges, bright sun-gaps between
    ...leaves(120, 60, 200, 110, 61, LEAF_DARK),
    ...leaves(420, 20, 210, 80, 62, LEAF),
    ...leaves(760, 14, 220, 80, 63, LEAF),
    ...leaves(1040, 60, 210, 120, 64, LEAF_DARK),
    ...leaves(280, 130, 120, 60, 65, LEAF),
    ...leaves(900, 140, 120, 60, 66, LEAF),
  ])),
);

/** A duck's little reed: a tall pen blade with a brown top. */
function reeds(x: number, y: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const bx = x + i * 11 + (r() - 0.5) * 8;
    const h = 50 + r() * 50;
    out.push(pen([[bx, y], [bx + (r() - 0.5) * 12, y - h * 0.5], [bx + (r() - 0.5) * 18, y - h]], { width: 2, color: '#5d7f3a', breaks: 0 }));
    if (i % 3 === 1) out.push(wash(ellipse(bx + 2, y - h - 6, 3.2, 10), '#8a5a3a', { lineWidth: 1.4, bloom: false, shade: false }));
  }
  return out;
}

/** The little wishing well: a stone ring, two posts and a tiled roof, base at (x, y), 110 wide at s = 1. */
function well(x: number, y: number, s = 1): Node[] {
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  return [
    wash(curve([P(-50, 0), P(-52, -34), P(-44, -44), P(44, -44), P(52, -34), P(50, 0)], 1), '#bfc4cc', { hatch: 6, light: -120, depth: 0.25, lineWidth: 2.2 }),
    wash(ellipse(x, y - 44 * s, 46 * s, 9 * s), '#4a5a6c', { lineWidth: 1.8, shade: false, bloom: false }),
    ...[-40, -16, 12, 38].map((dx) => pen([[x + dx * s, y - 40 * s], [x + (dx + 4) * s, y - 4 * s]], { width: 1.2, opacity: 0.5 })),
    pen([[x - 40 * s, y - 44 * s], [x - 40 * s, y - 112 * s]], { width: 5, color: '#6e4e34', breaks: 0 }),
    pen([[x + 40 * s, y - 44 * s], [x + 40 * s, y - 112 * s]], { width: 5, color: '#6e4e34', breaks: 0 }),
    wash([P(-62, -108), P(0, -158), P(62, -108)], '#7d96b5', { hatch: 5, light: -120, depth: 0.25, lineWidth: 2.2 }),
    ...[-30, -10, 10, 30].map((dx) => pen([[x + dx * 0.6 * s, y - 150 * s + Math.abs(dx) * 0.2], [x + dx * s, y - 110 * s]], { width: 1.1, opacity: 0.55 })),
  ];
}

/** A swing: an A-frame of poles with a bar, and a seat on two ropes. Base centre (x, y), ~150 wide. */
function swing(x: number, y: number): Node[] {
  return [
    pen([[x - 70, y], [x - 12, y - 120]], { width: 4.2, color: '#6e4e34', breaks: 0 }),
    pen([[x - 50, y + 4], [x + 8, y - 120]], { width: 4.2, color: '#6e4e34', breaks: 0 }),
    pen([[x + 70, y], [x + 12, y - 120]], { width: 4.2, color: '#6e4e34', breaks: 0 }),
    pen([[x + 50, y + 4], [x - 8, y - 120]], { width: 4.2, color: '#6e4e34', breaks: 0 }),
    pen([[x - 24, y - 122], [x + 24, y - 122]], { width: 5, color: '#4b3422', breaks: 0 }),
    pen([[x - 22, y - 122], [x - 22, y - 38]], { width: 1.4, breaks: 0 }),
    pen([[x + 22, y - 122], [x + 22, y - 38]], { width: 1.4, breaks: 0 }),
    wash(rect(x - 28, y - 40, 56, 10), '#c9553a', { lineWidth: 1.8, bloom: false, depth: 0.2 }),
  ];
}

/** A small round stone fountain: a basin on a pillar with arcs of water, base centre (x, y). */
function fountain(x: number, y: number): Node[] {
  return [
    wash(curve([[x - 38, y], [x - 28, y - 70], [x - 12, y - 110], [x + 12, y - 110], [x + 28, y - 70], [x + 38, y]], 1), '#bfc4cc', { hatch: 6, light: -120, depth: 0.3, lineWidth: 2.2 }),
    wash(ellipse(x, y + 4, 74, 15), '#bfc4cc', { lineWidth: 2.2, hatch: 6, depth: 0.2 }),
    wash(ellipse(x, y + 2, 60, 10), '#a9cde0', { line: false, shade: false, bloom: false }),
    wash(curve([[x - 66, y - 110], [x - 54, y - 92], [x + 54, y - 92], [x + 66, y - 110]], 1), '#aeb4bc', { lineWidth: 2.2, hatch: 6, depth: 0.25 }),
    wash(ellipse(x, y - 110, 66, 12), '#a9cde0', { lineWidth: 2.2, shade: false, bloom: false }),
    // spray
    ...[-1, 1].flatMap((sd) => [
      pen([[x, y - 118], [x + sd * 20, y - 168], [x + sd * 46, y - 120]], { width: 2, color: '#6f9ac2', breaks: 0 }),
      pen([[x, y - 118], [x + sd * 8, y - 160], [x + sd * 26, y - 122]], { width: 1.8, color: '#8fb6d6', breaks: 0 }),
    ]),
    pen([[x, y - 118], [x, y - 172]], { width: 2, color: '#6f9ac2', breaks: 0 }),
    ...[-30, -8, 20, 36].map((dx, i) => blot(ellipse(x + dx, y - 130 - (i % 2) * 22, 4, 4), '#9cc4de', 0.8)),
  ];
}

/**
 * The village green, across the path from Bear Cottage: a sunny open lawn
 * with the cottage's thatched roof and picket fence glimpsed at the far left,
 * a big tree behind, a stone fountain in the middle distance, and on the
 * right a duck pond with reeds, a wishing well and a swing beyond it.
 *
 *   ground line      y 600–650; open ground x 0–700 (and the lawn in front of the pond)
 *   pond             x 740–1180, y 520–640 (edge on the left curves in at x ~740)
 *   fountain         centre x 600, base y 560
 */
const green = cached(() =>
  svg({ w: W, h: H, name: 'bears-green' }, pageNodes(W, H, 'bears-green', [
    ...sky(440),
    ...cloud(700, 190, 1.0, 7),
    ...cloud(260, 120, 0.7, 8),
    ground(395, paler(GRASS, 0.45), { amp: 18, seed: 41, line: false }),
    // Bear Cottage and its fence, far left (cut by the page edge)
    ...cottage(90, 480, 0.78),
    ...[0, 1, 2, 3, 4, 5].map((i) => wash(curve([[214 + i * 40, 498], [226 + i * 40, 484], [238 + i * 40, 498], [238 + i * 40, 540], [214 + i * 40, 540]], 1), '#f3eee2', { lineWidth: 1.6, bloom: false })),
    wash(rect(206, 508, 240, 10), '#f3eee2', { lineWidth: 1.4, bloom: false }),
    ground(480, GRASS, { amp: 20, seed: 42 }),
    // the big tree behind the lawn
    ...tree(470, 500, 360, 43),
    // wishing well and swing on the far bank
    ...well(840, 500, 0.95),
    ...swing(1030, 500),
    ...bush(690, 490, 0.7, 26),
    ...bush(1110, 490, 0.6, 27),
    // pond: a wash of water with ripples and a bank
    wash(curve([[760, 560], [790, 528], [890, 516], [1060, 520], [1240, 524], [1240, 650], [1060, 668], [900, 654], [800, 630], [754, 594]], 2), '#8fb9d6', { light: -100, depth: 0.2, lineWidth: 2.4, hatch: 9 }),
    blot(ellipse(960, 560, 130, 16), '#d6e8f2', 0.8),
    ...[[880, 590], [1030, 612], [980, 636], [1110, 580]].map(([x, y]) => pen([[x - 26, y], [x - 8, y + 4], [x + 10, y], [x + 28, y + 4]], { width: 1.6, color: '#4f7da0', opacity: 0.7, breaks: 0 })),
    ...reeds(752, 596, 5, 44),
    ...reeds(1100, 530, 4, 45),
    // a couple of ducks, small and white
    wash(ellipse(900, 560, 26, 13), '#fbf8f0', { lineWidth: 1.8, shade: '#d3dfec', bloom: false }),
    wash(ellipse(922, 538, 9, 11), '#fbf8f0', { lineWidth: 1.6, shade: '#d3dfec', bloom: false }),
    wash([[928, 538], [942, 541], [928, 546]], '#e8a23a', { lineWidth: 1.4, bloom: false, shade: false }),
    wash(ellipse(1010, 608, 24, 12), '#fbf8f0', { lineWidth: 1.8, shade: '#d3dfec', bloom: false }),
    wash(ellipse(1030, 588, 8, 10), '#fbf8f0', { lineWidth: 1.6, shade: '#d3dfec', bloom: false }),
    wash([[1036, 588], [1050, 591], [1036, 596]], '#e8a23a', { lineWidth: 1.4, bloom: false, shade: false }),
    // fountain on the lawn
    ...fountain(600, 560),
    // the open lawn in front
    path(300, 330, 560),
    ...flowers(40, 690, 590, 670, 14, 47),
    ...tufts(0, 740, 640, 12, 48),
    ...tufts(740, 1160, 680, 8, 49),
    ...pebbles(300, 670, 380, 30, 5, 50),
  ])),
);

export const home: Record<string, () => string> = {
  'bear-kitchen': kitchen,
  'bear-wood': wood,
  'bear-green': green,
};
// referenced so the shared palette stays imported where it reads naturally
