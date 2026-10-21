/**
 * Things for "The Doll's House": the paintbrush for the door, the little
 * yellow songbirds, and what the bears give the birds. Watercolour and ink.
 *
 * Parts that scripts can move (all drawn at rest):
 *   songbird      'wingL', 'wingR': the far and near wing, hinged at the shoulder, to flap
 *   berry-basket  'berries' (hidden): the heap of berries and nuts; fade it in when they are picked
 *   saucer        'water' (hidden): a pale blue shine of water; fade it in when it is filled
 * The paintbrush and bird-food have no parts. Bird food sits low and wide,
 * its base along the bottom edge, to lie on a tray or a ledge.
 */
import { band, cached, circle, curve, dot, ellipse, group, rect, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, paler, pen, wash } from '../../art/watercolour';

const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

const DOOR_BLUE = '#3f82c8';
const WOOD = '#c99a5e';
const RED = '#d9503f';
const WICKER = '#c89a58';
const NUT = '#a8723a';
const CREAM = '#f1e2bd';

// ---------------------------------------------------------------------------
// The paintbrush
// ---------------------------------------------------------------------------

const paintbrush = cached(() => {
  const handle = curve(P(22, 6, 38, 6, 36, 60, 34, 84, 26, 84, 24, 60), 2);
  const bristles = curve(P(14, 108, 46, 108, 52, 150, 50, 172, 30, 178, 10, 172, 8, 150), 2);
  return svg({ w: 60, h: 180, name: 'bears-paintbrush' }, [
    wash(handle, WOOD, { shade: deeper(WOOD, 0.3), light: -150, depth: 0.4, lineWidth: 2.2, bloom: false }),
    // a hanging hole and a wood-grain line
    dot(30, 16, 2.4, deeper(WOOD, 0.6)),
    pen(P(29, 28, 30, 50, 30, 74), { width: 1.2, color: deeper(WOOD, 0.6), opacity: 0.5 }),
    blot(ellipse(26, 40, 2, 14), '#ffffff', 0.4),
    // the bristles, soaked in blue
    wash(bristles, DOOR_BLUE, { shade: deeper(DOOR_BLUE, 0.3), light: -130, depth: 0.3, lineWidth: 2.2 }),
    clipped(bristles, [
      pen(P(18, 114, 17, 140, 16, 168), { width: 1.2, color: deeper(DOOR_BLUE, 0.5), opacity: 0.6 }),
      pen(P(30, 112, 30, 140, 30, 172), { width: 1.2, color: deeper(DOOR_BLUE, 0.5), opacity: 0.6 }),
      pen(P(42, 114, 43, 140, 44, 168), { width: 1.2, color: deeper(DOOR_BLUE, 0.5), opacity: 0.6 }),
    ]),
    blot(ellipse(20, 140, 3, 20), '#ffffff', 0.4),
    // the metal ferrule, over the top of the bristles
    wash(P(20, 80, 40, 80, 48, 112, 12, 112), '#b9c2cb', { shade: '#8693a0', light: -150, depth: 0.35, lineWidth: 2.2, bloom: false }),
    pen(P(18, 92, 42, 92), { width: 1.2, color: '#6d7a88', opacity: 0.7 }),
    pen(P(16, 102, 44, 102), { width: 1.2, color: '#6d7a88', opacity: 0.7 }),
    blot(ellipse(24, 96, 2.5, 12), '#ffffff', 0.7),
    // a drip of wet paint
    wash(ellipse(52, 150, 3.4, 5), DOOR_BLUE, { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.4 }),
  ]);
});

// ---------------------------------------------------------------------------
// The songbird
// ---------------------------------------------------------------------------

const songbird = cached(() => {
  const YEL = '#f2cd45';
  const wingShape = curve(P(46, 32, 38, 18, 24, 8, 12, 8, 18, 22, 28, 34), 2);
  return svg({ w: 90, h: 70, name: 'bears-songbird' }, [
    // legs
    pen(P(42, 58, 41, 66), { width: 1.6, color: '#c07a3a' }),
    pen(P(52, 58, 54, 66), { width: 1.6, color: '#c07a3a' }),
    // the far wing, behind the body, tipped a little darker
    group({ part: 'wingL', origin: [46, 34] }, [
      wash(curve(P(48, 32, 44, 16, 34, 4, 22, 2, 26, 16, 34, 32), 2), deeper(YEL, 0.12), { lineWidth: 1.8, bloom: false, depth: 0.3 }),
    ]),
    // tail, body, head
    wash(P(22, 40, 2, 34, 4, 46, 26, 52), '#e4b83a', { lineWidth: 1.8, depth: 0.3, bloom: false, wobble: 0.5 }),
    wash(ellipse(46, 42, 28, 20, 6), YEL, { light: -130, depth: 0.3, hatch: 6, lineWidth: 2.2 }),
    wash(ellipse(48, 50, 17, 10, 4), paler(YEL, 0.55), { line: false, shade: false, bloom: false, wobble: 0.6 }),
    wash(circle(68, 28, 13), YEL, { light: -130, depth: 0.3, lineWidth: 2.2 }),
    // a tiny orange beak, a dot eye and a pink cheek
    wash(P(79, 25, 90, 29, 79, 34), '#f0932a', { lineWidth: 1.5, depth: 0.4, bloom: false, wobble: 0.3 }),
    dot(72, 25, 2.4, '#1d1512'),
    dot(71.4, 24.4, 0.8, '#ffffff'),
    blot(ellipse(70, 34, 4, 2.6), '#f4a8a0', 0.6),
    // the near wing, over the body
    group({ part: 'wingR', origin: [46, 34] }, [
      wash(wingShape, '#e8b83a', { light: -130, depth: 0.3, lineWidth: 2, bloom: false }),
      pen(P(40, 28, 30, 20, 20, 14), { width: 1.1, color: deeper('#e8b83a', 0.5), opacity: 0.7 }),
      pen(P(42, 31, 30, 27, 22, 24), { width: 1.1, color: deeper('#e8b83a', 0.5), opacity: 0.7 }),
    ]),
    blot(ellipse(58, 18, 7, 2.6, -20), '#ffffff', 0.5),
  ]);
});

// ---------------------------------------------------------------------------
// The berry basket
// ---------------------------------------------------------------------------

const berryBasket = cached(() => {
  const body = curve(P(20, 80, 160, 80, 148, 142, 32, 142), 1);
  const weave: Node[] = [];
  for (let y = 94; y < 142; y += 10) weave.push(pen(P(18, y, 90, y + 3, 162, y), { width: 1.3, color: deeper(WICKER, 0.5), opacity: 0.6, breaks: 0 }));
  for (let x = 40; x < 150; x += 15) weave.push(pen(P(x, 84, x - 3, 112, x + 1, 142), { width: 1.2, color: deeper(WICKER, 0.5), opacity: 0.5, breaks: 0 }));
  const berry = (x: number, y: number, rad: number, fill: string): Node[] => [
    wash(circle(x, y, rad), fill, { lineWidth: 1.4, depth: 0.4, bloom: false, wobble: 0.4 }),
    dot(x - rad * 0.35, y - rad * 0.35, Math.max(1, rad * 0.25), '#ffffff', 0.85),
  ];
  const heap: Node[] = [
    // a mound first, so there are no gaps
    wash(curve(P(26, 84, 30, 62, 56, 40, 90, 34, 124, 40, 150, 62, 154, 84), 2), '#8f2f3a', { line: false, shade: false, bloom: false, wobble: 0.6 }),
    ...berry(40, 70, 9, RED),
    ...berry(58, 54, 9, '#352a40'),
    ...berry(76, 66, 10, RED),
    ...berry(90, 46, 10, RED),
    ...berry(106, 62, 9, '#352a40'),
    wash(ellipse(124, 58, 10, 8, 20), NUT, { lineWidth: 1.5, depth: 0.4, bloom: false, wobble: 0.4 }),
    wash(ellipse(120, 55, 5, 3.4, 20), deeper(NUT, 0.2), { line: false, shade: false, bloom: false, wobble: 0.3 }),
    ...berry(140, 72, 9, RED),
    ...berry(70, 80, 9, '#352a40'),
    ...berry(100, 80, 9, RED),
    wash(ellipse(50, 82, 9, 7, -15), NUT, { lineWidth: 1.5, depth: 0.4, bloom: false, wobble: 0.4 }),
    ...berry(124, 82, 8, '#352a40'),
    // a little green leaf
    wash(ellipse(104, 40, 9, 4, -35), '#7fa64e', { lineWidth: 1.2, bloom: false, shade: false }),
  ];
  return svg({ w: 180, h: 150, name: 'bears-berry-basket' }, [
    // the big arched handle
    wash(band(P(24, 82, 28, 30, 90, 6, 152, 30, 156, 82), 8), deeper(WICKER, 0.15), { shade: deeper(WICKER, 0.4), depth: 0.4, lineWidth: 2, bloom: false }),
    pen(P(34, 70, 38, 38, 90, 16, 144, 38), { width: 1.1, color: deeper(WICKER, 0.6), opacity: 0.5 }),
    group({ part: 'berries', opacity: 0 }, heap),
    wash(body, WICKER, { shade: deeper(WICKER, 0.3), light: -150, depth: 0.3, lineWidth: 2.6 }),
    clipped(body, weave),
    wash(rect(14, 74, 152, 16, 6), deeper(WICKER, 0.18), { shade: deeper(WICKER, 0.4), depth: 0.4, lineWidth: 2.4, bloom: false }),
    pen(P(22, 82, 60, 84, 100, 82, 158, 84), { width: 1.2, color: deeper(WICKER, 0.6), opacity: 0.6 }),
    blot(ellipse(40, 114, 6, 16), '#ffffff', 0.25),
  ]);
});

// ---------------------------------------------------------------------------
// The saucer
// ---------------------------------------------------------------------------

const saucer = cached(() => {
  const BLUE = '#6f9bc9';
  const WHITE = '#fbf8f0';
  const rim = ellipse(70, 34, 66, 20);
  return svg({ w: 140, h: 60, name: 'bears-saucer' }, [
    // the little foot underneath
    wash(ellipse(70, 52, 30, 5), '#e8e4d8', { lineWidth: 1.8, bloom: false, shade: false, wobble: 0.5 }),
    wash(rim, WHITE, { shade: '#cfd9e6', light: -100, depth: 0.3, lineWidth: 2.4 }),
    // the blue rim, as a ring
    wash(ellipse(70, 34, 60, 17), BLUE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
    wash(ellipse(70, 35, 54, 14), WHITE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
    // the well of the saucer
    wash(ellipse(70, 36, 42, 9), '#eef0ee', { shade: '#cfd9e6', light: -130, depth: 0.4, lineWidth: 1.6, bloom: false }),
    // a chip out of the rim, on the right, and a crack
    wash(P(120, 22, 130, 24, 126, 30), '#fdfaf3', { line: false, shade: false, bloom: false, wobble: 0.3 }),
    pen(P(120, 22, 125, 28, 122, 31), { width: 1.2, opacity: 0.8 }),
    pen(P(112, 44, 105, 40, 100, 42), { width: 1, color: '#7f95ad', opacity: 0.6 }),
    // the water, filling the well
    group({ part: 'water', opacity: 0 }, [
      wash(ellipse(70, 35, 46, 11), '#b9d6ee', { shade: '#8fb6dc', light: -130, depth: 0.3, lineWidth: 1.4, bloom: false }),
      blot(ellipse(52, 32, 14, 3, -8), '#ffffff', 0.8),
      pen(P(78, 38, 92, 40, 102, 37), { width: 1.2, color: '#5f88b0', opacity: 0.8 }),
      pen(P(44, 40, 56, 42, 66, 41), { width: 1.2, color: '#5f88b0', opacity: 0.8 }),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// Bird food
// ---------------------------------------------------------------------------

const birdFood = cached(() => {
  const SEED = '#d9b46a';
  const crumb = (x: number, y: number, s: number, tilt: number): Node =>
    wash(ellipse(x, y, s, s * 0.7, tilt), CREAM, { lineWidth: 1.2, depth: 0.4, bloom: false, shade: '#d8c28f', wobble: 0.5 });
  const berry = (x: number, y: number, rad: number): Node[] => [
    wash(circle(x, y, rad), RED, { lineWidth: 1.4, depth: 0.4, bloom: false, wobble: 0.4 }),
    dot(x - rad * 0.35, y - rad * 0.35, 1.5, '#ffffff', 0.85),
  ];
  const nut = (x: number, y: number, tilt: number): Node[] => [
    wash(ellipse(x, y, 11, 8.5, tilt), NUT, { lineWidth: 1.6, depth: 0.4, bloom: false, wobble: 0.4 }),
    wash(ellipse(x + 1, y - 4, 6, 3, tilt), deeper(NUT, 0.25), { line: false, shade: false, bloom: false, wobble: 0.3 }),
  ];
  const seeds: Node[] = [];
  const xs = [14, 30, 44, 60, 78, 96, 112, 128, 146, 160, 176, 186, 52, 88, 138];
  xs.forEach((x, i) => {
    const y = 70 + ((i * 7) % 6);
    seeds.push(wash(ellipse(x, y, 3.6, 1.8, (i * 37) % 60 - 30), SEED, { lineWidth: 1, bloom: false, shade: false, wobble: 0.2 }));
  });
  return svg({ w: 200, h: 80, name: 'bears-bird-food' }, [
    // a low drift of seed along the bottom edge
    wash(curve(P(4, 76, 10, 66, 60, 62, 100, 60, 150, 62, 192, 66, 198, 76), 1), SEED, { line: false, shade: deeper(SEED, 0.3), light: -130, depth: 0.25, bloom: false, wobble: 0.8 }),
    ...seeds,
    ...nut(38, 58, -10),
    ...nut(150, 56, 15),
    ...berry(70, 56, 8.5),
    ...berry(86, 61, 7.5),
    ...berry(112, 55, 8.5),
    ...berry(128, 62, 7),
    ...berry(178, 62, 7),
    crumb(20, 66, 6, -15),
    crumb(56, 66, 5, 20),
    crumb(100, 66, 6.5, -10),
    crumb(166, 68, 5, 30),
    crumb(190, 70, 4, -20),
    dot(24, 74, 1.8, CREAM),
    dot(124, 73, 1.6, CREAM),
    dot(94, 74, 1.6, CREAM),
  ]);
});

export const birdThings: Record<string, () => string> = {
  'paintbrush': paintbrush,
  'songbird': songbird,
  'berry-basket': berryBasket,
  'saucer': saucer,
  'bird-food': birdFood,
};
