/**
 * Inside the old boat-house (1180 × 820), painted with the watercolour kit in
 * the look of the bear books: a grey-washed stone and plank wall, a flagstone
 * floor, cosy clutter at the edges, and the middle of the floor left open for
 * the big shipwreck heap and a ring of bears. A clear window on the left lets a
 * script lay rain or sunshine over its glass; Uncle Bill's door is on the right.
 * Our own drawing: nothing here is traced from the book.
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, INK, pageNodes, pen, wash } from '../../art/watercolour';

const W = 1180;
const H = 820;
const WALL = '#d9d3c2';
const PLANK = '#b79a6e';
const WOOD = '#a37c4e';
const WOOD_DARK = '#6e4e34';
const TERRA = '#c8805a';
const STONE_FLOOR = '#cfc6b2';

/** A barrel standing at (cx, base): bulging staves with two iron hoops. */
function barrel(cx: number, base: number, w: number, h: number, seed: number): Node[] {
  const hw = w / 2;
  const top = base - h;
  const out: Node[] = [
    wash(curve([[cx - hw * 0.86, top], [cx - hw, top + h * 0.35], [cx - hw, top + h * 0.65], [cx - hw * 0.86, base], [cx + hw * 0.86, base], [cx + hw, top + h * 0.65], [cx + hw, top + h * 0.35], [cx + hw * 0.86, top]], 2), WOOD, { hatch: 7, light: 180, depth: 0.3, lineWidth: 2.6 }),
    wash(ellipse(cx, top, hw * 0.86, 13), '#c9a672', { lineWidth: 2.2, bloom: false, depth: 0.2 }),
  ];
  const r = rng(seed);
  for (let i = -3; i <= 3; i++) out.push(pen([[cx + i * hw * 0.27, top + 8], [cx + i * hw * 0.3 + (r() - 0.5) * 4, base - 2]], { width: 1.3, opacity: 0.55, color: '#4b3422' }));
  for (const f of [0.22, 0.74]) {
    const y = top + h * f;
    out.push(wash([[cx - hw * 1.0, y - 7], [cx + hw * 1.0, y - 7], [cx + hw * 1.0, y + 7], [cx - hw * 1.0, y + 7]], '#59595f', { lineWidth: 1.8, bloom: false, depth: 0.3, wobble: 0.6 }));
  }
  return out;
}

/** A terracotta flowerpot standing at (cx, base), with something green (and maybe a red flower) in it. */
function pot(cx: number, base: number, s: number, flower: boolean): Node[] {
  const P = (x: number, y: number): Pt => [cx + x * s, base + y * s];
  const out: Node[] = [];
  if (flower) {
    out.push(pen([P(0, -34), P(2, -56), P(0, -74)], { width: 2.2, color: '#5d7f3a', breaks: 0 }));
    out.push(wash(curve([P(2, -52), P(22, -62), P(24, -50), P(4, -46)], 2), '#8db35a', { lineWidth: 1.4, bloom: false }));
    out.push(wash(ellipse(cx, base - 80 * s, 11 * s, 11 * s), '#d9553f', { lineWidth: 1.6, bloom: false }));
    out.push(blot(ellipse(cx, base - 80 * s, 4 * s, 4 * s), '#f0cf4f', 0.9));
  } else {
    out.push(wash(curve([P(-14, -34), P(-22, -52), P(-6, -48), P(0, -66), P(8, -48), P(22, -54), P(14, -34)], 2), '#7fa64e', { lineWidth: 1.6, bloom: false }));
  }
  out.push(wash(curve([P(-22, -36), P(-17, 0), P(17, 0), P(22, -36)], 1), TERRA, { hatch: 6, light: -50, depth: 0.25, lineWidth: 2 }));
  out.push(wash(rect(cx - 25 * s, base - 46 * s, 50 * s, 12 * s), '#d99468', { lineWidth: 1.8, bloom: false, depth: 0.3 }));
  return out;
}

/** A little model sailing ship on the sill: hull, two masts, three white sails. */
function modelShip(cx: number, base: number): Node[] {
  return [
    wash(curve([[cx - 44, base - 22], [cx - 34, base - 4], [cx + 34, base - 4], [cx + 48, base - 24]], 1), '#7a5a3a', { hatch: 5, lineWidth: 2, depth: 0.3 }),
    pen([[cx - 12, base - 22], [cx - 12, base - 92]], { width: 2.6, color: WOOD_DARK, breaks: 0 }),
    pen([[cx + 20, base - 22], [cx + 20, base - 78]], { width: 2.4, color: WOOD_DARK, breaks: 0 }),
    wash([[cx - 10, base - 88], [cx + 8, base - 58], [cx - 10, base - 30]], '#f6f1e2', { lineWidth: 1.6, bloom: false, shade: '#cfd8e2' }),
    wash([[cx - 14, base - 82], [cx - 38, base - 54], [cx - 14, base - 32]], '#efe8d6', { lineWidth: 1.6, bloom: false, shade: '#cfd8e2' }),
    wash([[cx + 22, base - 74], [cx + 40, base - 50], [cx + 22, base - 32]], '#f6f1e2', { lineWidth: 1.6, bloom: false, shade: '#cfd8e2' }),
    pen([[cx - 44, base - 22], [cx - 12, base - 92], [cx + 20, base - 78], [cx + 48, base - 24]], { width: 1, opacity: 0.55, breaks: 0 }),
  ];
}

/** A life ring hung on the wall: red with white quarters and a rope loop. */
function lifeRing(cx: number, cy: number, r: number): Node[] {
  const out: Node[] = [
    pen([[cx - 6, cy - r - 30], [cx, cy - r + 2]], { width: 1.8, color: '#7a6a52', breaks: 0 }),
    wash(ellipse(cx, cy, r, r), '#f6f1e2', { lineWidth: 2.4, depth: 0.25 }),
    wash(ellipse(cx, cy, r * 0.46, r * 0.46), WALL, { lineWidth: 2.2, shade: false, bloom: false }),
  ];
  for (let i = 0; i < 4; i++) {
    const a0 = (i * Math.PI) / 2 + Math.PI / 4 - 0.4;
    const a1 = a0 + 0.8;
    const seg: Pt[] = [];
    for (let k = 0; k <= 6; k++) seg.push([cx + Math.cos(a0 + ((a1 - a0) * k) / 6) * r * 0.97, cy + Math.sin(a0 + ((a1 - a0) * k) / 6) * r * 0.97]);
    for (let k = 6; k >= 0; k--) seg.push([cx + Math.cos(a0 + ((a1 - a0) * k) / 6) * r * 0.5, cy + Math.sin(a0 + ((a1 - a0) * k) / 6) * r * 0.5]);
    out.push(wash(seg, '#c9503c', { lineWidth: 1.4, bloom: false, depth: 0.3, wobble: 0.5 }));
  }
  return out;
}

/** A pinned-up paper (map or picture) with curled corners and a pin. */
function paper(x: number, y: number, w: number, h: number, seed: number, tilt = 0): Node[] {
  const t = tilt;
  return [
    wash([[x, y + t], [x + w, y - t], [x + w + 4, y + h * 0.5], [x + w - 2, y + h - t], [x + 6, y + h + t]], '#eadcb6', { lineWidth: 2, depth: 0.2, bloom: false }),
    wash(curve([[x + w - 22, y + h - t - 2], [x + w - 2, y + h - t - 26], [x + w - 4, y + h - t]], 1), '#d2c08e', { lineWidth: 1.4, bloom: false, shade: false }),
    blot(ellipse(x + w / 2, y + h * 0.55, w * 0.34, h * 0.28), '#c8d8a0', 0.5 + (seed % 2) * 0.05),
    blot(ellipse(x + w * 0.62, y + h * 0.6, w * 0.15, h * 0.12), '#7fa9c9', 0.5),
    wash(ellipse(x + w / 2, y + 7, 4, 4), '#c9503c', { lineWidth: 1.2, shade: false, bloom: false }),
  ];
}

const boatHouse = cached(() =>
  svg({ w: W, h: H, name: 'bears-boat-house' }, pageNodes(W, H, 'bears-boat-house', [
    // grey-washed stone wall, with plank panelling low down and stone courses above
    wash(rect(-40, -40, W + 80, 640), WALL, { light: -90, depth: 0.08, line: false, bloom: false, wobble: 0 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].flatMap((row) => {
      const r = rng(70 + row);
      const y = 40 + row * 46;
      const out: Node[] = [pen([[-10, y], [W + 10, y + (r() - 0.5) * 5]], { width: 1.2, opacity: 0.22, color: '#7a6a52' })];
      for (let x = (row % 2) * 60 + 20; x < W; x += 120) out.push(pen([[x + (r() - 0.5) * 6, y], [x + (r() - 0.5) * 8, y + 46]], { width: 1.1, opacity: 0.2, color: '#7a6a52' }));
      return out;
    }),
    blot(ellipse(300, 300, 230, 150), '#ffffff', 0.4),
    blot(ellipse(900, 420, 160, 120), '#8f8a78', 0.18),
    // cobwebby damp stains
    blot(ellipse(60, 170, 70, 120), '#a8a28c', 0.25),
    // planks along the lower wall
    wash(rect(-40, 440, W + 80, 140), PLANK, { light: -100, depth: 0.1, line: INK, lineWidth: 2, bloom: false, wobble: 0.6, opacity: 0.8 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => pen([[20 + i * 82, 442], [24 + i * 82, 578]], { width: 1.5, opacity: 0.45, color: '#5a3a28' })),
    wash(rect(-40, 432, W + 80, 14), '#8a6a44', { lineWidth: 2, bloom: false, depth: 0.3 }),

    // the window: clear glass (x 330–620, y 120–340), wooden frame and bars
    wash(rect(310, 100, 330, 262), WOOD, { hatch: 8, light: -120, depth: 0.18, lineWidth: 2.8 }),
    wash(rect(330, 120, 290, 220), '#dcebf1', { lineWidth: 2.4, light: -120, depth: 0.15, bloom: false }),
    blot(ellipse(420, 170, 70, 26), '#ffffff', 0.6),
    pen([[475, 120], [475, 340]], { width: 5, color: WOOD_DARK, breaks: 0 }),
    pen([[330, 230], [620, 230]], { width: 5, color: WOOD_DARK, breaks: 0 }),
    pen([[620 - 145, 120], [620 - 145, 340]], { width: 5, color: WOOD_DARK, breaks: 0 }),
    // stone sill (top y 340–372) holding the pots and the model ship
    wash(rect(290, 340, 380, 34), '#b4b0a6', { lineWidth: 2.4, hatch: 7, depth: 0.25, light: -100 }),
    wash(rect(280, 368, 400, 14), '#a29e94', { lineWidth: 2, bloom: false, depth: 0.2 }),
    ...pot(365, 340, 1.1, true),
    ...pot(425, 340, 0.95, false),
    ...modelShip(560, 340),
    ...pot(625, 340, 0.8, true),
    blot(ellipse(480, 392, 190, 12), '#8f8a78', 0.3),

    // map (top left) and the picture of a sailing boat (top right of the window)
    ...paper(34, 100, 150, 112, 1, 4),
    pen([[70, 160], [90, 150], [112, 164], [140, 150]], { width: 1.5, color: '#7a5a3a', opacity: 0.7 }),
    wash(rect(156, 168, 12, 12), '#c9503c', { lineWidth: 1, shade: false, bloom: false, wobble: 0.4 }),
    ...paper(690, 78, 120, 104, 2, 3),
    pen([[724, 140], [800 - 20, 140], [790 - 20, 156], [734, 156]], { width: 1.6, color: '#7a5a3a', opacity: 0.8 }),
    wash([[760, 90 + 14], [782, 136], [750, 136]], '#f6f1e2', { lineWidth: 1.2, bloom: false, shade: '#cfd8e2' }),

    // the shelf: a mug and books (shelf top y 262)
    wash(rect(700, 262, 270, 14), WOOD, { lineWidth: 2.2, hatch: 6, depth: 0.3, bloom: false }),
    pen([[720, 276], [712, 304]], { width: 4, color: WOOD_DARK, breaks: 0 }),
    pen([[950, 276], [958, 304]], { width: 4, color: WOOD_DARK, breaks: 0 }),
    wash(rect(722, 222, 26, 40), '#3f6f93', { lineWidth: 1.8, bloom: false, depth: 0.25 }),
    wash(rect(750, 214, 22, 48), '#b4553f', { lineWidth: 1.8, bloom: false, depth: 0.25 }),
    wash(rect(774, 226, 24, 36), '#6f8f55', { lineWidth: 1.8, bloom: false, depth: 0.25 }),
    pen([[726, 232], [744, 232]], { width: 1.4, color: '#e9d9a8', breaks: 0 }),
    pen([[754, 226], [768, 226]], { width: 1.4, color: '#e9d9a8', breaks: 0 }),
    wash(curve([[870, 226], [866, 262], [904, 262], [900, 226]], 1), '#f6f8fa', { shade: '#cdd9e8', lineWidth: 1.9 }),
    wash(curve([[900, 234], [918, 236], [918, 252], [900, 254]], 1), '#f6f8fa', { shade: '#cdd9e8', lineWidth: 1.7, bloom: false }),
    blot(curve([[868, 236], [902, 236], [902, 244], [868, 244]], 1), '#3f6f93', 0.6),
    wash(rect(810, 232, 40, 30), '#d6c08e', { lineWidth: 1.8, bloom: false, depth: 0.25 }),
    pen([[814, 242], [846, 242]], { width: 1.2, opacity: 0.6 }),

    // life ring on the wall, left of the window
    ...lifeRing(130, 330, 48),

    // the door on the far right: plain planks, a dark iron latch (x 1000–1150, bottom y 578)
    wash(rect(996, 214, 160, 366), '#8a6a44', { hatch: 8, light: 180, depth: 0.1, lineWidth: 2.8, bloom: false }),
    wash(rect(1006, 226, 140, 354), '#b08a58', { hatch: 8, light: -120, depth: 0.2, lineWidth: 2.4 }),
    ...[1052, 1098].map((x) => pen([[x, 228], [x + 1, 578]], { width: 1.8, opacity: 0.6, color: '#4b3422', breaks: 0 })),
    pen([[1006, 300], [1146, 300]], { width: 4, color: '#4a4a52', breaks: 0 }),
    pen([[1006, 500], [1146, 500]], { width: 4, color: '#4a4a52', breaks: 0 }),
    wash(ellipse(1032, 420, 8, 8), '#4a4a52', { lineWidth: 1.4, shade: false, bloom: false }),
    wash(rect(1026, 404, 40, 7), '#4a4a52', { lineWidth: 1.4, shade: false, bloom: false, wobble: 0.4 }),

    // the floor: flagstones, grey-warm, pale towards the captions
    wash(rect(-60, 578, W + 120, 300), STONE_FLOOR, { light: -90, depth: 0.05, line: INK, lineWidth: 2, bloom: false, wobble: 0.6 }),
    ...[0, 1, 2, 3, 4].flatMap((i) => {
      const y = 612 + i * 40;
      const r = rng(90 + i);
      const out: Node[] = [pen([[-10, y], [W + 10, y + (r() - 0.5) * 4]], { width: 1.4, opacity: 0.3, color: '#7a6a52' })];
      for (let x = (i % 2) * 60 + 30; x < W; x += 120) out.push(pen([[x, y], [x + (r() - 0.5) * 8, y + 40]], { width: 1.3, opacity: 0.26, color: '#7a6a52' }));
      return out;
    }),
    // damp patches between the stones, kept faint
    ...[[260, 700], [540, 740], [800, 705], [150, 760]].map(([x, y]) => blot(ellipse(x, y, 46, 7), '#aab4be', 0.22)),

    // the old rowing boat, upturned along the back wall, low down
    blot(ellipse(500, 586, 270, 14), '#7a6a52', 0.4),
    wash(curve([[230, 584], [262, 520], [380, 492], [560, 486], [700, 502], [780, 540], [800, 584]], 2), '#a8805a', { hatch: 7, light: -120, depth: 0.22, lineWidth: 2.8 }),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => pen([[270 + i * 74, 574 - Math.abs(i - 3) * 12], [282 + i * 74, 506 + Math.abs(i - 3) * 5]], { width: 1.6, opacity: 0.45, color: '#4b3422' })),
    wash(rect(236, 568, 566, 14), '#6e4e34', { lineWidth: 2.2, bloom: false, depth: 0.3, wobble: 0.8 }),
    wash(ellipse(250, 560, 7, 7), '#4a4a52', { lineWidth: 1.4, shade: false, bloom: false }),

    // barrels at the left edge, one with a blue bottle on top
    ...barrel(52, 640, 150, 210, 11),
    ...barrel(172, 596, 96, 140, 12),
    wash(ellipse(172, 456, 14, 18), '#3f6f93', { lineWidth: 1.8, bloom: false, depth: 0.3 }),
    wash(rect(166, 430, 12, 14), '#3f6f93', { lineWidth: 1.6, bloom: false, shade: false, wobble: 0.5 }),
    blot(ellipse(60, 440, 70, 10), '#7a6a52', 0.2),

    // a coil of rope on the floor at the far right, beside the door
    blot(ellipse(1082, 640, 80, 12), '#7a6a52', 0.35),
    ...[0, 1, 2, 3].map((i) => wash(ellipse(1082, 628 - i * 6, 58 - i * 6, 20 - i * 1.5), i % 2 ? '#c9a66b' : '#b8935a', { lineWidth: 1.8, bloom: false, shade: false, line: i === 3 ? INK : '#5a3a28' })),
    wash(ellipse(1082, 604, 22, 8), STONE_FLOOR, { lineWidth: 1.6, bloom: false, shade: false }),
    pen([[1130, 626], [1150, 640], [1166, 650]], { width: 3.2, color: '#b8935a', breaks: 0 }),
  ])),
);

export const boathouse: Record<string, () => string> = {
  'boat-house': boatHouse,
};
