/**
 * The bears' outdoor places beyond the garden (1180 × 820), painted with the
 * scenery kit in the book's watercolour-and-ink look: the beach, the dune top,
 * Honeypot Hill and the open sky. Each keeps y 690–820 pale and calm for the
 * captions and leaves open ground for three bears (about 240 wide each).
 */
import { cached, curve, ellipse, svg, rng, type Node, type Pt } from '../../art/paper';
import { blot, deeper, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { cottage } from './places';
import { bush, cloud, ground, GRASS, GRASS_DARK, LEAF_DARK, PEBBLE, pebbles, SAND, SEA, sky, tufts } from './scenery';

const W = 1180;
const H = 820;

const ROCK = '#9ea8b6';
const MUD = '#a98a63';

/** Soft wave lines (pen ripples) across a band of sea, longer and wider-spaced towards the front. */
function ripples(y0: number, y1: number, rows: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < rows; i++) {
    const t = (i + 1) / (rows + 1);
    const y = y0 + (y1 - y0) * t * t;
    const len = 60 + t * 150;
    const n = 3 + Math.round(t * 3);
    for (let k = 0; k < n; k++) {
      const x = -40 + r() * (W + 80);
      out.push(pen([[x, y], [x + len * 0.3, y - 3 - t * 3], [x + len * 0.6, y + 1], [x + len, y - 2]], { width: 1.3 + t * 0.7, color: '#5b7f9f', opacity: 0.55, breaks: 0.6 }));
    }
  }
  return out;
}

/** The sea: a blue wash from the horizon down to a wavy shore, paler to the front, with ripples and a foam line. */
function sea(horizon: number, shore: number, seed: number): Node[] {
  const r = rng(seed);
  const edge: Pt[] = [];
  for (let x = W + 60; x >= -60; x -= 100) edge.push([x, shore + (r() - 0.5) * 30]);
  return [
    wash(curve([[-60, horizon], [W + 60, horizon], ...edge], 2), SEA, { light: -90, depth: 0.1, line: false, bloom: false }),
    blot(curve([[-40, horizon + 4], [W + 40, horizon + 4], [W + 40, horizon + 26], [-40, horizon + 26]], 1), '#5d86a8', 0.35),
    blot(curve([[-40, shore - 50], [W + 40, shore - 50], [W + 40, shore], [-40, shore]], 1), '#dbe9f1', 0.6),
    pen([[-40, horizon], [W + 40, horizon]], { width: 1.6, opacity: 0.7, breaks: 0.8 }),
    ...ripples(horizon + 8, shore - 8, 7, seed + 1),
    pen(edge.slice().reverse(), { width: 1.8, color: '#6a8fae', opacity: 0.7 }),
  ];
}

/** A big grey boulder with hatching and a few cracks. */
function rock(x: number, y: number, w: number, h: number, seed: number): Node[] {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const k = 0.86 + r() * 0.2;
    pts.push([x + Math.cos(a) * w * k * 0.5, y + Math.sin(a) * h * k * 0.5 * (Math.sin(a) > 0 ? 0.5 : 1)]);
  }
  return [
    wash(curve(pts, 2), ROCK, { hatch: 6, light: -120, depth: 0.3 }),
    pen([[x - w * 0.2, y - h * 0.2], [x - w * 0.05, y - h * 0.05], [x + w * 0.1, y - h * 0.1]], { width: 1.4, opacity: 0.6 }),
    blot(ellipse(x, y + h * 0.28, w * 0.5, h * 0.1), '#8b7f6e', 0.35),
  ];
}

/** A cockle shell: a little fan with ribs. */
function shell(x: number, y: number, s = 1, color = '#f2d6c4'): Node[] {
  const fan: Pt[] = [[x - 12 * s, y], [x - 12 * s, y - 8 * s], [x - 4 * s, y - 15 * s], [x + 4 * s, y - 15 * s], [x + 12 * s, y - 8 * s], [x + 12 * s, y]];
  return [
    wash(curve(fan, 1), color, { lineWidth: 1.5, depth: 0.4, bloom: false, wobble: 0.6 }),
    ...[-6, 0, 6].map((d) => pen([[x + d * s * 0.3, y - 1 * s], [x + d * s, y - 13 * s]], { width: 1, opacity: 0.7 })),
  ];
}

/** A little steamer far out: hull, cabin, funnel and a curl of smoke. Centre of its waterline at (x, y). */
function steamer(x: number, y: number, s = 1): Node[] {
  const P = (px: number, py: number): Pt => [x + px * s, y + py * s];
  return [
    wash([P(-34, -10), P(34, -10), P(26, 4), P(-26, 4)], '#c85a4a', { lineWidth: 1.6, depth: 0.35, bloom: false, wobble: 0.5 }),
    wash([P(-16, -24), P(14, -24), P(14, -10), P(-16, -10)], '#f6efe0', { lineWidth: 1.4, bloom: false, wobble: 0.5 }),
    wash([P(-4, -38), P(6, -38), P(6, -24), P(-4, -24)], '#3f5a78', { lineWidth: 1.4, bloom: false, wobble: 0.5 }),
    blot(ellipse(x + 14 * s, y - 50 * s, 12 * s, 6 * s), '#ffffff', 0.9),
    blot(ellipse(x + 30 * s, y - 58 * s, 16 * s, 7 * s), '#ffffff', 0.8),
    pen([[x - 30 * s, y + 7 * s], [x + 30 * s, y + 7 * s]], { width: 1.2, color: '#5b7f9f', opacity: 0.6 }),
  ];
}

/** A few gulls as little ink Vs. */
function gulls(seed: number, area: [number, number, number, number], n = 5): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    out.push(pen([[x - 9, y - 3], [x - 4, y - 6], [x, y], [x + 4, y - 6], [x + 9, y - 3]], { width: 1.4, opacity: 0.8 }));
  }
  return out;
}

/** A tuft of marram grass: long arching blades from one root. */
function marram(x: number, y: number, s = 1, seed = 1): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const lean = (i / (n - 1) - 0.5) * 2;
    const hgt = (50 + r() * 40) * s;
    const bend = lean * 36 * s + (r() - 0.5) * 12;
    const col = i % 2 ? '#8fae5a' : '#a9b86a';
    out.push(pen([[x + lean * 4, y], [x + bend * 0.5, y - hgt * 0.65], [x + bend * 1.15, y - hgt * 0.95 + Math.abs(lean) * 12 * s]], { width: 2.4 * s, color: deeper(col, 0.25), taper: true }));
  }
  return out;
}

// ---------------------------------------------------------------------------

/**
 * A sunny beach. Sea to a horizon at y 320 with a steamer far out, the book's
 * clouds, grey rocks on the left, sand from y ~480 with pebbles, shells and
 * grass. Feet go on y 620–650; the open sand is x 300–1000. No sand-castles:
 * they are props.
 */
const beach = cached(() =>
  svg({ w: W, h: H, name: 'bears-beach' }, pageNodes(W, H, 'bears-beach', [
    ...sky(330),
    ...cloud(300, 215, 1.3, 11),
    ...cloud(800, 175, 0.9, 12),
    ...cloud(1080, 250, 0.6, 15),
    ...gulls(3, [560, 110, 760, 190], 4),
    ...sea(320, 478, 21),
    ...steamer(890, 318, 0.85),
    // wet sand where the water has just been
    ground(486, paler(SAND, 0.2), { amp: 14, seed: 31, line: false }),
    ground(508, SAND, { amp: 16, seed: 32 }),
    ...rock(110, 560, 250, 130, 41),
    ...rock(230, 592, 130, 70, 42),
    ...rock(1085, 545, 120, 62, 43),
    // the sand is mottled with darker, drier patches
    ...[[600, 580, 260, 12], [380, 650, 200, 10], [860, 640, 220, 10], [1030, 610, 120, 8]].map(([x, y, rx, ry]) => blot(ellipse(x, y, rx, ry), '#d8b570', 0.35)),
    ...pebbles(380, 610, 520, 50, 8, 51),
    ...pebbles(10, 640, 360, 50, 6, 52),
    ...pebbles(900, 590, 260, 90, 6, 53),
    ...shell(470, 600, 1.2),
    ...shell(755, 660, 1, '#f6e2d0'),
    ...shell(960, 625, 1.1, '#efc9b6'),
    ...shell(260, 665, 1, '#f6e2d0'),
    ...tufts(0, 360, 650, 4, 61, GRASS_DARK),
    ...marram(70, 660, 1, 71),
    ...marram(1120, 650, 0.9, 72),
    ...tufts(820, 1180, 570, 5, 62, GRASS_DARK),
  ])),
);

/**
 * The top of a sand dune. The sea is a thin band far below the dune's lip, at
 * the back. The flat dune-top is on the right: put Captain Bear's castle
 * (360 × 300) with its base middle at about (860, 645). Open sand for three
 * bears is on the left, x 60–560, feet at y 625–650.
 */
const dunes = cached(() =>
  svg({ w: W, h: H, name: 'bears-dunes' }, pageNodes(W, H, 'bears-dunes', [
    ...sky(360),
    ...cloud(250, 190, 1.15, 13),
    ...cloud(820, 150, 0.8, 14),
    ...cloud(1100, 235, 0.55, 16),
    ...gulls(4, [480, 120, 680, 200], 4),
    ...sea(330, 420, 22),
    ...steamer(250, 330, 0.55),
    // a far dune: a pale sandy shoulder behind, dropping away to the sea
    ground(440, paler(SAND, 0.35), { amp: 20, seed: 33 }),
    // the sea-side slope of the dune: hatched, falling away below the lip
    wash(curve([[-60, 470], [300, 462], [700, 470], [1240, 474], [1240, 585], [1000, 572], [620, 585], [200, 590], [-60, 600]], 2), deeper(SAND, 0.12), { hatch: 9, light: -90, depth: 0.2, line: false }),
    // a sandy hump rising from the left, its crest edged with marram grass
    wash(curve([[-60, 610], [-60, 520], [60, 470], [180, 440], [300, 442], [420, 480], [520, 540], [600, 595]], 2), paler(SAND, 0.1), { hatch: 10, light: -60, depth: 0.22, lineWidth: 2 }),
    blot(ellipse(190, 490, 110, 22), '#fff4d8', 0.5),
    ...marram(70, 478, 0.9, 81),
    ...marram(170, 446, 0.85, 82),
    ...marram(270, 446, 0.8, 83),
    ...marram(380, 470, 0.75, 86),
    // the dune top: broad and flat on the right, sloping to the left lip
    wash(curve([[-60, 900], [-60, 600], [200, 585], [480, 590], [620, 585], [760, 575], [1000, 572], [1240, 580], [1240, 900]], 2), SAND, { light: -100, depth: 0.1, lineWidth: 2 }),
    blot(ellipse(860, 640, 260, 18), '#d8b570', 0.35),
    blot(ellipse(300, 650, 240, 14), '#d8b570', 0.3),
    // ripples the wind has left in the sand
    ...[[120, 640, 120], [420, 665, 150], [650, 610, 120], [1040, 655, 110], [700, 672, 130]].map(([x, y, l]) =>
      pen([[x, y], [x + l * 0.3, y - 4], [x + l * 0.7, y + 1], [x + l, y - 3]], { width: 1.3, color: '#b79556', opacity: 0.55 })),
    ...pebbles(300, 620, 300, 40, 5, 54),
    ...pebbles(980, 610, 180, 50, 4, 55),
    ...shell(180, 665, 1.1),
    ...shell(1090, 640, 1, '#f6e2d0'),
    ...marram(1130, 625, 1.05, 84),
    ...marram(26, 640, 1, 85),
    ...tufts(0, 600, 590, 4, 63, GRASS_DARK),
  ])),
);

/**
 * Honeypot Hill on a summer day. The hill rises from the left to a rounded
 * top at about (800, 270) (the crown, where Teddy jumps from); the winding
 * path goes up to it. At the bottom left the muddy stream: its centre is about
 * (280, 600), x 60–450 and y 555–647, with stones along the bank. Open grass
 * for bears on x 520–1100, feet at y 620–650.
 */
const honeypotHill = cached(() =>
  svg({ w: W, h: H, name: 'bears-honeypot-hill' }, pageNodes(W, H, 'bears-honeypot-hill', [
    ...sky(400),
    ...cloud(210, 160, 1.0, 17),
    ...cloud(560, 120, 0.7, 18),
    ...cloud(1010, 150, 0.8, 19),
    // far green hills behind
    wash(curve([[-60, 470], [150, 380], [380, 360], [560, 420], [600, 520], [-60, 520]], 2), paler(GRASS, 0.45), { light: -100, depth: 0.12 }),
    // the hill itself: a long rise to a rounded top, then a short slope away
    wash(curve([[-60, 640], [-60, 520], [200, 470], [420, 400], [600, 320], [720, 272], [800, 262], [890, 280], [1000, 350], [1120, 430], [1240, 470], [1240, 700]], 2), GRASS, { light: -100, depth: 0.14, hatch: 12 }),
    wash(curve([[-60, 700], [-60, 580], [260, 540], [560, 530], [900, 500], [1240, 520], [1240, 700]], 2), paler(GRASS, 0.2), { light: -90, depth: 0.1, line: false }),
    // bushes along the hill's flank
    ...bush(150, 500, 1.1, 91),
    ...bush(400, 440, 0.8, 92),
    ...bush(1080, 440, 0.9, 93),
    ...bush(960, 330, 0.55, 94),
    // the path up to the top
    wash(curve([[560, 585], [700, 585], [690, 520], [600, 470], [700, 420], [760, 370], [780, 300], [796, 272], [812, 272], [820, 300], [830, 372], [790, 430], [720, 480], [800, 520], [850, 585], [900, 600], [430, 600]], 2), '#e8d3a0', { light: -90, depth: 0.15, lineWidth: 1.8 }),
    // the front lawn
    ground(560, GRASS, { amp: 14, seed: 95 }),
    ...tufts(380, 1160, 640, 12, 96),
    ...tufts(0, 330, 560, 4, 97, GRASS_DARK),
    ...pebbles(560, 620, 480, 40, 7, 98),
    // the muddy stream on the left of the lawn, with stones round it
    wash(curve([[60, 593], [120, 565], [240, 555], [370, 565], [450, 590], [410, 633], [280, 647], [140, 639]], 2), MUD, { light: -90, depth: 0.25, hatch: 8, lineWidth: 2 }),
    wash(curve([[140, 599], [230, 583], [350, 589], [400, 607], [330, 625], [220, 627]], 2), '#7f6644', { line: false, depth: 0.3, bloom: false }),
    blot(ellipse(260, 597, 80, 8), '#c8b490', 0.55),
    pen([[180, 610], [230, 606], [280, 611]], { width: 1.2, color: '#e9dcc0', opacity: 0.8 }),
    pen([[290, 620], [340, 616]], { width: 1.2, color: '#e9dcc0', opacity: 0.8 }),
    ...pebbles(60, 566, 400, 90, 12, 99),
    ...[[48, 585], [90, 645], [462, 612], [430, 655], [280, 660]].map(([x, y], i) =>
      wash(ellipse(x, y, 20, 11, (i - 2) * 8), PEBBLE, { lineWidth: 1.6, depth: 0.4 })),
    ...tufts(40, 470, 575, 4, 100, LEAF_DARK),
  ])),
);

/**
 * Up in the sky: soft blue sky full of clouds, with a patchwork of tiny
 * fields, hedges and a thatched cottage far below in the bottom third,
 * fading into the page. The middle band (y 250–560) is open for a helicopter
 * and Teddy on his rope.
 */
const bearSky = cached(() => {
  const r = rng(77);
  const fieldCols = [GRASS, paler(GRASS, 0.35), '#d9c76a', '#b8c97a', '#e0cf86', paler(GRASS_DARK, 0.2)];
  const fields: Node[] = [];
  let i = 0;
  // a loose grid of tilted fields, rows getting taller towards the viewer
  const ys = [575, 635, 705, 790];
  const xs: number[] = [];
  for (let x = -100; x < W + 200; x += 150) xs.push(x);
  const grid = ys.map((y) => xs.map((x) => [x + (r() - 0.5) * 50, y + (r() - 0.5) * 26] as Pt));
  for (let j = 0; j < ys.length - 1; j++) {
    for (let k = 0; k < xs.length - 1; k++) {
      const pts: Pt[] = [grid[j][k], grid[j][k + 1], grid[j + 1][k + 1], grid[j + 1][k]];
      fields.push(wash(pts, fieldCols[i++ % fieldCols.length], { light: -100, depth: 0.12, lineWidth: 1.6, hatch: i % 3 === 0 ? 7 : false, bloom: false, wobble: 2 }));
      fields.push(pen([grid[j][k], grid[j][k + 1]], { width: 3.2, color: LEAF_DARK, opacity: 0.8 }));
    }
  }
  return svg({ w: W, h: H, name: 'bears-sky' }, pageNodes(W, H, 'bears-sky', [
    ...sky(520),
    blot(curve([[-40, 130], [W + 40, 110], [W + 40, 330], [-40, 340]], 2), '#bcd5ec', 0.3),
    ...cloud(190, 170, 1.15, 23),
    ...cloud(900, 150, 1.0, 24),
    ...cloud(1080, 330, 0.7, 25),
    ...cloud(80, 430, 0.75, 26),
    ...cloud(560, 80, 0.7, 27),
    ...cloud(300, 500, 0.8, 28),
    ...cloud(980, 520, 0.9, 29),
    ...fields,
    // a little round tree and the tiny cottage with its path
    ...bush(880, 610, 0.3, 101),
    ...bush(130, 650, 0.35, 102),
    ...cottage(520, 668, 0.24),
    // the page's white seeps up over the far land so it fades out below
    blot(curve([[-60, 700], [W + 60, 690], [W + 60, 900], [-60, 900]], 2), '#fdfaf3', 0.9),
    blot(curve([[-60, 740], [W + 60, 730], [W + 60, 900], [-60, 900]], 2), '#fdfaf3', 0.9),
  ]));
});

export const outdoors: Record<string, () => string> = {
  'bear-beach': beach,
  'bear-dunes': dunes,
  'honeypot-hill': honeypotHill,
  'bear-sky': bearSky,
};
