/**
 * One-off art for "Teddy Bear's Surprise", in the bears' watercolour-and-ink
 * look (src/art/watercolour.ts, the scenery kit in src/worlds/bears/scenery.ts).
 *
 *   barneysDoor()   a backdrop: Barney's cottage close up, so his front door
 *                   is bear-sized (the garden's cottage is Teddy's own home,
 *                   and too far away to knock on). Green door, like Barney's
 *                   green jumper. Door x 250–410, ground line y ≈ 650; open
 *                   ground for bears x 600–1100.
 *   knocker()       the brass door knocker, its own actor so it can rap (70 × 80)
 *   stone()         a big grey stone in the wood for Teddy to sit on (260 × 120)
 *   mapRoll()       a rolled-up treasure map with a red ribbon (120 × 56)
 *   treasureMap()   the map opened: a duck pond with ducks, a dotted path and a red X (340 × 240)
 *
 * Only this episode needs them; nothing here is a reusable character or place.
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../kit';
import { blot, deeper, hatch, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { bush, cloud, ground, GRASS, GRASS_DARK, LEAF, pebbles, sky, tree, tufts } from '../../worlds/bears/scenery';

const W = 1180;
const H = 820;
const THATCH = '#d9b25e';
const WALL = '#f1e6cc';
const DOOR = '#5f9150';
const BRASS = '#e0b84a';
const PARCHMENT = '#f2e3bd';

/** A few little flowers: a dot of colour on a pen stalk. */
function flowers(x0: number, x1: number, y0: number, y1: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  const cols = ['#e67a8a', '#f2cd45', '#ffffff', '#d9503f'];
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0);
    const y = y0 + r() * (y1 - y0);
    out.push(pen([[x, y], [x + (r() - 0.5) * 4, y - 12]], { width: 1.3, color: deeper(GRASS_DARK, 0.2) }));
    out.push(wash(ellipse(x, y - 14, 4.5, 4), cols[i % cols.length], { lineWidth: 1, shade: false, bloom: false, wobble: 0.4 }));
  }
  return out;
}

/** Barney's cottage, close up: thatch along the top, a cream wall, a green round-topped door, a window with a flower box. */
export const barneysDoor = cached(() =>
  svg({ w: W, h: H, name: 'teddy-surprise-barneys-door' }, pageNodes(W, H, 'teddy-surprise-barneys-door', [
    ...sky(460),
    ...cloud(900, 190, 0.9, 71),
    // the lane and fields beyond, on the right
    ground(450, paler(GRASS, 0.4), { amp: 22, seed: 72, line: false }),
    ...tree(1040, 470, 300, 73),
    ...bush(820, 470, 0.7, 74),
    ground(520, GRASS, { amp: 16, seed: 75 }),
    // the cottage wall
    wash([[-60, 150], [660, 150], [660, 652], [-60, 652]], WALL, { light: -150, depth: 0.18, lineWidth: 2.6 }),
    hatch([[560, 190], [660, 190], [660, 652], [560, 652]], { gap: 7, angle: 70, color: '#b9a37c' }),
    // a stone door surround, then the door: planks, hinges and a little brass handle
    wash(curve([[222, 652], [222, 400], [240, 352], [330, 320], [420, 352], [438, 400], [438, 652]], 2), '#d8ccb2', { lineWidth: 2.2, hatch: 6 }),
    wash(curve([[250, 652], [250, 410], [264, 370], [330, 346], [396, 370], [410, 410], [410, 652]], 2), DOOR, { hatch: 6, light: -120, depth: 0.25, lineWidth: 2.6 }),
    ...[290, 330, 370].map((x) => pen([[x, 360 + Math.abs(x - 330) * 0.4], [x, 648]], { width: 1.6, opacity: 0.6 })),
    ...[430, 580].map((y) => pen([[254, y], [330, y + 2]], { width: 4, color: '#3d3a33', breaks: 0 })),
    wash(ellipse(392, 520, 7, 7), BRASS, { lineWidth: 1.4, shade: false, bloom: false }),
    // the doorstep
    wash([[206, 648], [454, 648], [462, 672], [198, 672]], '#b9bfc8', { lineWidth: 2.2, hatch: 6, depth: 0.3 }),
    // a window with a flower box
    wash(rect(470, 300, 140, 120), '#b9d2e2', { lineWidth: 2.4 }),
    blot(ellipse(510, 330, 26, 16), '#ffffff', 0.7),
    pen([[540, 300], [540, 420]], { width: 2.2 }),
    pen([[470, 360], [610, 360]], { width: 2.2 }),
    wash(rect(458, 420, 164, 26), '#8a5a3a', { lineWidth: 2.2, hatch: 5 }),
    ...[476, 500, 526, 552, 578, 604].map((x, i) => blot(ellipse(x, 414 - (i % 2) * 6, 13, 11), i % 2 ? '#e67a8a' : '#d9503f', 0.9)),
    ...[488, 540, 592].map((x) => blot(ellipse(x, 422, 16, 7), LEAF, 0.9)),
    // the thatch along the top, thick and hatched, with a fringe over the wall
    wash(curve([[-80, -40], [740, -40], [740, 120], [700, 196], [520, 176], [330, 200], [140, 178], [-80, 196]], 2), THATCH, { hatch: 6, light: -120, depth: 0.3, lineWidth: 2.6 }),
    ...[-20, 60, 140, 220, 300, 380, 460, 540, 620, 690].map((x) => pen([[x, 60], [x + 10, 180]], { width: 1.5, opacity: 0.6 })),
    hatch([[-60, 190], [700, 190], [700, 222], [-60, 222]], { gap: 5, angle: 75 }),
    // a rose bush by the wall, and the garden in front
    ...bush(120, 600, 0.9, 76),
    ...flowers(60, 200, 560, 610, 7, 77),
    ground(652, paler(GRASS, 0.12), { amp: 10, seed: 78, line: false }),
    ...tufts(460, 1160, 660, 12, 79),
    ...pebbles(560, 680, 360, 40, 7, 80),
    ...flowers(640, 1120, 600, 660, 10, 81),
  ])),
);

/** Barney's brass knocker: a ring hanging from a little plate. 70 × 80. */
export const knocker = cached(() =>
  svg({ w: 70, h: 80, name: 'teddy-surprise-knocker', label: 'a brass door knocker' }, [
    wash(rect(22, 4, 26, 20, 4), deeper(BRASS, 0.15), { lineWidth: 1.8, bloom: false }),
    wash(ellipse(35, 48, 26, 26), BRASS, { lineWidth: 2.2, light: -130, depth: 0.3 }),
    wash(ellipse(35, 48, 15, 15), DOOR, { lineWidth: 2, shade: false, bloom: false }),
    blot(ellipse(26, 36, 6, 4), '#fff6d8', 0.9),
  ]),
);

/** A big grey stone in the wood, low and wide, for sitting on. 260 × 120. */
export const stone = cached(() => {
  const pts: Pt[] = [[14, 112], [8, 70], [30, 32], [80, 14], [150, 10], [210, 22], [246, 56], [252, 112]];
  return svg({ w: 260, h: 120, name: 'teddy-surprise-stone', label: 'a big grey stone' }, [
    blot(ellipse(130, 112, 128, 12), '#6f7f55', 0.45),
    wash(curve(pts, 2), '#a3acb8', { hatch: 6, light: -120, depth: 0.32, lineWidth: 2.4 }),
    pen([[70, 50], [96, 64], [120, 58]], { width: 1.4, opacity: 0.6 }),
    pen([[170, 40], [186, 70]], { width: 1.3, opacity: 0.55 }),
    blot(ellipse(110, 34, 50, 10), '#d9dee6', 0.7),
    ...tufts(10, 250, 116, 5, 82),
  ]);
});

/** The rolled-up treasure map: a parchment roll tied with a red ribbon. 120 × 56. */
export const mapRoll = cached(() =>
  svg({ w: 120, h: 56, name: 'teddy-surprise-map-roll', label: 'a rolled-up map' }, [
    wash(rect(10, 12, 100, 32, 14), PARCHMENT, { lineWidth: 2.2, light: -90, depth: 0.35 }),
    wash(ellipse(104, 28, 8, 16), paler(PARCHMENT, 0.3), { lineWidth: 1.8, shade: false, bloom: false }),
    wash(ellipse(104, 28, 3, 7), deeper(PARCHMENT, 0.3), { lineWidth: 1, shade: false, bloom: false }),
    wash(rect(54, 8, 12, 40), '#d9503f', { lineWidth: 1.6, bloom: false }),
    pen([[60, 48], [52, 56]], { width: 3, color: '#d9503f', breaks: 0 }),
    pen([[60, 48], [70, 56]], { width: 3, color: '#d9503f', breaks: 0 }),
  ]),
);

/** The treasure map, open: curled parchment, a pond with two ducks, trees, a dotted path and a red X by the pond. 340 × 240. */
export const treasureMap = cached(() =>
  svg({ w: 340, h: 240, name: 'teddy-surprise-map', label: 'the treasure map' }, [
    wash(curve([[20, 22], [170, 12], [320, 22], [326, 120], [320, 220], [170, 230], [20, 220], [14, 120]], 2), PARCHMENT, { lineWidth: 2.4, light: -120, depth: 0.2 }),
    // rolled ends top and bottom
    wash(rect(10, 8, 320, 22, 10), paler(PARCHMENT, 0.2), { lineWidth: 2, depth: 0.4, bloom: false }),
    wash(rect(10, 212, 320, 22, 10), paler(PARCHMENT, 0.2), { lineWidth: 2, depth: 0.4, bloom: false }),
    // trees on the left
    ...[[60, 96], [92, 128], [56, 160]].flatMap(([x, y]) => [
      wash(ellipse(x, y, 20, 17), '#7fa64e', { lineWidth: 1.6, bloom: false, depth: 0.3 }),
      pen([[x, y + 16], [x, y + 28]], { width: 2.4, color: '#7a5a3a', breaks: 0 }),
    ]),
    // the dotted path from the trees to the pond
    ...Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      const x = 112 + t * 110;
      const y = 150 - Math.sin(t * Math.PI) * 40 + t * 10;
      return blot(ellipse(x, y, 3.5, 3.5), '#7a5a3a', 0.9);
    }),
    // the pond, with two ducks
    wash(ellipse(258, 130, 52, 34), '#8fb9d6', { lineWidth: 2, hatch: 7, depth: 0.2 }),
    ...[[244, 120], [272, 142]].flatMap(([x, y]) => [
      wash(ellipse(x, y, 9, 5), '#fbf8f0', { lineWidth: 1.2, shade: false, bloom: false }),
      wash(ellipse(x + 7, y - 6, 3.5, 4), '#fbf8f0', { lineWidth: 1, shade: false, bloom: false }),
      wash([[x + 10, y - 6], [x + 15, y - 5], [x + 10, y - 3]], '#e8a23a', { line: false, shade: false, bloom: false }),
    ]),
    // the red X, on the bank by the pond
    pen([[206, 160], [226, 182]], { width: 5, color: '#c8433a', breaks: 0 }),
    pen([[226, 160], [206, 182]], { width: 5, color: '#c8433a', breaks: 0 }),
  ]),
);
