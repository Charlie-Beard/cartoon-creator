/**
 * The Toymaker's workshop (1180 × 820), painted in the book's watercolour and
 * ink: a warm, cosy room with a long wooden bench on the left and a green
 * shelf of old books and tins above it, shelves of wooden toys on the wall, an
 * open window on the right with curtains (night rain can be laid over its
 * glass), and a flagstone floor. The middle of the bench top is left clear for
 * the doll's house prop, and the floor in front is open for Teddy and the
 * Toymaker, with y 690–820 plain and pale for the captions.
 *
 *   bench top        y 470, x 120–700 (paint pots at x 130–290; clear x 300–620)
 *   green shelf      x 90–350, top y 290, books and tins on it
 *   toy shelves      x 380–740 at y 190 (horse, soldier); x 1070–1180 at y 330 (top, boat)
 *   window glass     x 760–1040, y 130–360, sill y 360–385
 *   floor line       y 600; feet y 640–670; open floor x 0–1180
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, INK, pageNodes, pen, wash } from '../../art/watercolour';

const W = 1180;
const H = 820;

const WALL = '#efe1bd';
const WOOD = '#c39a64';
const WOOD_DARK = '#8a6540';
const SHELF_GREEN = '#7f9a5a';

/** A plank of wood: a wash with a darker edge line. */
const plank = (x: number, y: number, w: number, h: number, c = WOOD, hatch = 6): Node =>
  wash(rect(x, y, w, h), c, { hatch, light: -100, depth: 0.2, lineWidth: 2.2 });

/** An upright book on a shelf with bands on its spine. */
function book(x: number, base: number, w: number, h: number, c: string): Node[] {
  return [
    wash(rect(x, base - h, w, h), c, { hatch: 5, light: -110, depth: 0.25, lineWidth: 2 }),
    pen([[x + 2, base - h + 10], [x + w - 2, base - h + 10]], { width: 1.4, color: '#e8d6a0', opacity: 0.8, breaks: 0 }),
    pen([[x + 2, base - 10], [x + w - 2, base - 10]], { width: 1.4, color: '#e8d6a0', opacity: 0.8, breaks: 0 }),
  ];
}

/** A tin with a lid and a paper label. */
function tin(x: number, base: number, w: number, h: number, c: string): Node[] {
  return [
    wash(rect(x, base - h, w, h), c, { hatch: 5, light: -110, depth: 0.2, lineWidth: 2 }),
    wash(rect(x - 3, base - h - 6, w + 6, 9), paler2(c), { lineWidth: 1.6, bloom: false, depth: 0.2 }),
    wash(rect(x + 5, base - h * 0.7, w - 10, h * 0.4), '#f3ead0', { lineWidth: 1.2, bloom: false, shade: false }),
  ];
}
const paler2 = (c: string): string => (c === '#7fa3d0' ? '#a9c3e2' : '#d9b27a');

/** A rocking horse: curved rockers, a stout body, a long head and a mane. Base centre (x, y), ~90 wide. */
function rockingHorse(x: number, y: number): Node[] {
  const P = (px: number, py: number): Pt => [x + px, y + py];
  return [
    wash(curve([P(-46, -4), P(-30, 4), P(0, 8), P(30, 4), P(46, -4), P(40, -8), P(0, 0), P(-40, -8)], 1), '#a8723e', { lineWidth: 2, bloom: false }),
    pen([[x - 24, y - 4], [x - 22, y - 34]], { width: 3.2, color: '#6e4e34', breaks: 0 }),
    pen([[x + 24, y - 4], [x + 22, y - 34]], { width: 3.2, color: '#6e4e34', breaks: 0 }),
    wash(curve([P(-34, -32), P(-34, -52), P(10, -56), P(34, -52), P(36, -32)], 2), '#e8e0cc', { hatch: 5, depth: 0.2, lineWidth: 2 }),
    wash(curve([P(22, -50), P(34, -84), P(54, -92), P(66, -78), P(52, -66), P(44, -52)], 2), '#e8e0cc', { hatch: 5, depth: 0.2, lineWidth: 2 }),
    wash(curve([P(26, -62), P(34, -88), P(40, -90), P(34, -56)], 1), '#6e4e34', { lineWidth: 1.4, bloom: false }),
    blot(ellipse(x + 52, y - 80, 2.6, 2.6), INK, 0.8),
    pen([[x - 34, y - 48], [x - 52, y - 40]], { width: 3, color: '#6e4e34', breaks: 0 }),
    wash(rect(x - 14, y - 60, 28, 8), '#c9553a', { lineWidth: 1.6, bloom: false, depth: 0.2 }),
  ];
}

/** A wooden toy soldier in a red coat and tall black hat. Base centre (x, y), ~80 tall. */
function soldier(x: number, y: number): Node[] {
  return [
    wash(rect(x - 12, y - 30, 9, 30), '#3f5a8a', { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    wash(rect(x + 3, y - 30, 9, 30), '#3f5a8a', { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    wash(rect(x - 16, y - 62, 32, 36), '#c9553a', { hatch: 5, light: -100, depth: 0.25, lineWidth: 2 }),
    pen([[x - 6, y - 60], [x - 6, y - 28]], { width: 1.6, color: '#e8d6a0', breaks: 0 }),
    pen([[x + 6, y - 60], [x + 6, y - 28]], { width: 1.6, color: '#e8d6a0', breaks: 0 }),
    wash(ellipse(x, y - 70, 10, 10), '#f2c9a2', { lineWidth: 1.6, bloom: false, shade: false }),
    wash(rect(x - 9, y - 96, 18, 22), '#2e2b28', { lineWidth: 1.6, bloom: false, depth: 0.2 }),
    blot(ellipse(x + 8, y - 98, 3, 3), '#e8d6a0', 0.9),
  ];
}

/** A spinning top: striped cone with a handle. Base centre (x, y), ~50 tall. */
function top(x: number, y: number): Node[] {
  return [
    wash(curve([[x - 20, y - 34], [x - 14, y - 12], [x, y], [x + 14, y - 12], [x + 20, y - 34]], 1), '#d9a63a', { hatch: 5, depth: 0.25, lineWidth: 2 }),
    blot(curve([[x - 17, y - 24], [x + 17, y - 24], [x + 13, y - 17], [x - 13, y - 17]], 1), '#c9553a', 0.7),
    wash(ellipse(x, y - 36, 22, 7), '#7fa3d0', { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    pen([[x, y - 42], [x, y - 58]], { width: 3.4, color: '#6e4e34', breaks: 0 }),
  ];
}

/** A toy boat with a sail, ~90 wide. */
function boat(x: number, y: number): Node[] {
  return [
    wash(curve([[x - 44, y - 22], [x + 44, y - 22], [x + 30, y], [x - 30, y]], 1), '#c9553a', { hatch: 5, depth: 0.25, lineWidth: 2 }),
    blot(curve([[x - 40, y - 14], [x + 40, y - 14], [x + 36, y - 9], [x - 36, y - 9]], 1), '#f3ead0', 0.8),
    pen([[x, y - 22], [x, y - 80]], { width: 3.2, color: '#6e4e34', breaks: 0 }),
    wash([[x + 4, y - 78], [x + 40, y - 30], [x + 4, y - 30]], '#f6f1e2', { shade: '#d3dfec', lineWidth: 1.8, bloom: false }),
    wash([[x - 4, y - 70], [x - 30, y - 30], [x - 4, y - 30]], '#f6f1e2', { shade: '#d3dfec', lineWidth: 1.8, bloom: false }),
  ];
}

/** A shelf: a board on two little brackets, top edge at (x, y). */
function shelf(x: number, y: number, w: number, c: string): Node[] {
  return [
    wash(rect(x, y, w, 14), c, { hatch: 6, light: -100, depth: 0.3, lineWidth: 2.2, bloom: false }),
    wash([[x + 14, y + 14], [x + 14, y + 36], [x + 36, y + 14]], c, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    wash([[x + w - 14, y + 14], [x + w - 14, y + 36], [x + w - 36, y + 14]], c, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    blot(ellipse(x + w / 2, y + 20, w * 0.4, 4), '#8f7d5c', 0.3),
  ];
}

/** A paint pot (bucket) with a handle: base centre (x, y). */
function bucket(x: number, y: number, w: number, h: number, c: string, handle: string): Node[] {
  return [
    pen([[x - w / 2 + 4, y - h], [x - w / 2 + 6, y - h - 34], [x + w / 2 - 6, y - h - 34], [x + w / 2 - 4, y - h]], { width: 2.4, color: handle, breaks: 0 }),
    wash(curve([[x - w / 2, y - h], [x - w / 2 + 6, y], [x + w / 2 - 6, y], [x + w / 2, y - h]], 1), c, { hatch: 6, light: -110, depth: 0.3, lineWidth: 2.2 }),
    wash(ellipse(x, y - h, w / 2, 9), '#4a5260', { lineWidth: 2, shade: false, bloom: false }),
    pen([[x - w / 2 + 8, y - h * 0.6], [x + w / 2 - 8, y - h * 0.6]], { width: 1.4, opacity: 0.5, breaks: 0 }),
  ];
}

/** A cupboard door with panel lines and a round knob. */
function door(x: number, y: number, w: number, h: number, knobAt: 'l' | 'r'): Node[] {
  const kx = knobAt === 'r' ? x + w - 16 : x + 16;
  return [
    wash(rect(x, y, w, h), '#b48a54', { hatch: 6, light: -100, depth: 0.2, lineWidth: 2.2 }),
    pen([[x + 10, y + 10], [x + w - 10, y + 10], [x + w - 10, y + h - 10], [x + 10, y + h - 10], [x + 10, y + 10]], { width: 1.3, opacity: 0.45, color: '#5a3a28', breaks: 0 }),
    wash(ellipse(kx, y + h * 0.32, 9, 9), '#d4d8dc', { lineWidth: 1.8, bloom: false, shade: '#98a2ae' }),
  ];
}

/** Curtain on one side of the window, tied back. */
function curtain(x: number, sd: number): Node[] {
  return [
    wash(curve([[x, 110], [x + sd * 52, 116], [x + sd * 58, 230], [x + sd * 40, 300], [x + sd * 54, 400], [x, 400], [x + sd * 12, 300], [x, 220]], 2), '#d1857a', { hatch: 7, light: sd > 0 ? -60 : -120, depth: 0.25, lineWidth: 2.2 }),
    ...[150, 200, 260, 340, 380].map((y, i) => blot(ellipse(x + sd * (18 + (i % 2) * 20), y, 4.5, 4.5), '#f6e6c8', 0.8)),
  ];
}

const toyWorkshop = cached(() =>
  svg({ w: W, h: H, name: 'bears-toy-workshop' }, pageNodes(W, H, 'bears-toy-workshop', [
    // wall: warm cream with a few boards' worth of lower panelling
    wash(rect(-40, -40, W + 80, 660), WALL, { light: -90, depth: 0.08, line: false, bloom: false, wobble: 0 }),
    ...[60, 330, 600, 900].map((x, i) => pen([[x, 20 + i * 6], [x + 4, 590]], { width: 1.2, opacity: 0.14, color: '#7a6a52', breaks: 0 })),
    wash(rect(-40, 586, W + 80, 22), '#d9b98a', { line: INK, lineWidth: 1.6, bloom: false, depth: 0.2 }),

    // the open window: glass, frame, bars, sill and curtains
    wash(rect(760, 130, 280, 230), '#cfe3ef', { lineWidth: 2.8, light: -120, depth: 0.2 }),
    blot(ellipse(900, 210, 100, 40), '#ffffff', 0.7),
    wash(curve([[780, 330], [830, 300], [890, 322], [950, 296], [1020, 326], [1020, 360], [780, 360]], 1), '#b9d68c', { line: false, bloom: false, depth: 0.1 }),
    pen([[900, 130], [900, 360]], { width: 3.4 }),
    pen([[760, 245], [1040, 245]], { width: 3.4 }),
    wash(rect(740, 360, 320, 20), '#f0e7d2', { lineWidth: 2.2, depth: 0.3, bloom: false }),
    wash(rect(752, 380, 296, 12), '#d8c9a8', { lineWidth: 1.4, bloom: false, depth: 0.1 }),
    wash(rect(730, 108, 330, 14), WOOD_DARK, { lineWidth: 2, bloom: false, depth: 0.3 }),
    ...curtain(742, 1),
    ...curtain(1058, -1),

    // the green shelf of old books and tins over the bench
    ...book(104, 290, 26, 100, '#6e4a3a'),
    ...book(134, 290, 28, 112, '#8a5a3a'),
    ...tin(172, 290, 74, 84, '#7fa3d0'),
    ...book(258, 290, 62, 16, '#a8723e'),
    ...book(262, 274, 56, 14, '#6f8a5a'),
    ...shelf(90, 290, 260, SHELF_GREEN),

    // shelves of wooden toys
    ...rockingHorse(450, 190),
    ...soldier(560, 190),
    ...top(640, 190),
    ...book(690, 190, 24, 56, '#3f5a8a'),
    ...shelf(380, 190, 360, '#a8723e'),
    ...boat(1110, 330),
    ...shelf(1070, 330, 110, '#a8723e'),

    // floor: grey-brown flagstones, pale towards the captions
    wash(rect(-60, 608, W + 120, 300), '#d6c8ac', { light: -90, depth: 0.06, line: INK, lineWidth: 2, bloom: false, wobble: 0.6 }),
    ...[0, 1, 2, 3].flatMap((i) => {
      const y = 640 + i * 46;
      const r = rng(70 + i);
      const out: Node[] = [pen([[-10, y], [W + 10, y + (r() - 0.5) * 4]], { width: 1.4, opacity: 0.3, color: '#7a6a52' })];
      for (let x = (i % 2) * 90 + 40; x < W; x += 180) out.push(pen([[x, y], [x + (r() - 0.5) * 8, y + 46]], { width: 1.3, opacity: 0.26, color: '#7a6a52' }));
      return out;
    }),

    // the bench: cupboards below, a thick top, paint pots at the left end
    wash(rect(124, 486, 572, 120), '#a9814f', { hatch: 7, light: -100, depth: 0.2, lineWidth: 2.4 }),
    ...door(136, 500, 130, 98, 'r'),
    ...door(274, 500, 130, 98, 'l'),
    ...door(412, 500, 130, 98, 'r'),
    ...door(550, 500, 134, 98, 'l'),
    blot(ellipse(410, 608, 300, 9), '#8f7d5c', 0.45),
    plank(104, 462, 616, 26, '#d2ac74', 7),
    pen([[112, 470], [712, 470]], { width: 1.4, opacity: 0.3, color: '#7a5a38', breaks: 0 }),
    ...bucket(176, 462, 100, 88, '#8b97a8', '#4a5260'),
    ...bucket(262, 462, 66, 76, '#c9453a', '#4a5260'),
    blot(curve([[236, 462], [300, 460], [306, 468], [250, 472], [226, 468]], 2), '#c9453a', 0.75),
  ])),
);

export const workshop: Record<string, () => string> = {
  'toy-workshop': toyWorkshop,
};
