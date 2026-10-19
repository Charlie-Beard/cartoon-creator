/**
 * The Teddy Bear Treasury's props, in the book's watercolour-and-ink look:
 * the birthday cake and the party table with its food, Mr Punch and the
 * old case he was shut in, Grandpa's garden puppet stage, a bush to hide
 * behind, a mug of hot chocolate, a woolly jumper, an umbrella, a bunch of
 * balloons and a pass-the-parcel present.
 *
 * Parts that scripts can move (all drawn at rest):
 *   birthday-cake    'flames': the five flames, fade out to blow them out;
 *                    'smoke' (hidden): fade in after
 *   travelling-case  'lid': hinged at the top back, lifts to show the lining
 *   show-curtains    'curtainL', 'curtainR': hinged at their outer top corners
 *   bush             'leaves': hinged at the bottom middle, shakes
 *   mug              'steam': two curls above the cocoa
 *   balloons         'bunch': hinged at the knot, to sway
 */
import { band, cached, circle, curve, dot, ellipse, group, rect, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, paler, pen, wash } from '../../art/watercolour';
import { leaves, LEAF, LEAF_DARK } from './scenery';

/** Points from a flat list of numbers: P(x0, y0, x1, y1 …). */
const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};
/** The same points mirrored left-right across a drawing `w` wide. */
const mirror = (pts: Pt[], w: number): Pt[] => pts.map(([x, y]) => [w - x, y] as Pt);

const RED = '#d9503f';
const YELLOW = '#f2cd45';
const BLUE = '#6f9bc9';
const GREEN = '#6aa56a';
const PINK = '#f2a6b8';
const CREAM = '#fbf8f0';
const SHADE = '#cfd9e6';
const WOOD = '#c99a5e';
const BROWN = '#8f5f35';
const BRASS = '#d6aa43';
const SKIN = '#f1c9a0';
const INKY = '#2a2220';

/**
 * A drum seen from a little above (a cake, a mug): straight sides, the front
 * of the bottom curved, the back of the top curved. The top ellipse is drawn
 * separately by the caller.
 */
function drum(cx: number, top: number, bottom: number, rx: number, ry: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = (Math.PI * i) / 12;
    out.push([cx - rx * Math.cos(a), bottom + ry * Math.sin(a)]);
  }
  for (let i = 0; i <= 12; i++) {
    const a = (Math.PI * i) / 12;
    out.push([cx + rx * Math.cos(a), top - ry * Math.sin(a)]);
  }
  return out;
}

/** A five-pointed star as a polygon. */
function star(cx: number, cy: number, r: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const k = i % 2 ? r * 0.45 : r;
    out.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k]);
  }
  return out;
}

/** A diamond (a harlequin lozenge) centred on (cx, cy). */
const diamond = (cx: number, cy: number, w: number, h: number): Pt[] => P(cx, cy - h, cx + w, cy, cx, cy + h, cx - w, cy);

/** Soft white sheen on the lit side of a rounded thing. */
const sheen = (x: number, y: number, rx: number, ry: number, rot = 0, a = 0.6): Node => blot(ellipse(x, y, rx, ry, rot), '#ffffff', a);

// ---------------------------------------------------------------------------
// The party
// ---------------------------------------------------------------------------

const birthdayCake = cached(() => {
  const SPONGE = '#e6bf7a';
  const JAM = '#c9262f';
  const body = drum(130, 92, 168, 94, 18);
  const candle = (x: number, i: number): Node[] => {
    const col = [RED, BLUE, YELLOW, GREEN, PINK][i];
    const stick = rect(x - 4.5, 56, 9, 40, 2);
    return [
      wash(stick, CREAM, { shade: SHADE, depth: 0.4, lineWidth: 1.8, bloom: false }),
      clipped(stick, [60, 72, 84].map((y) => wash(rect(x - 6, y, 12, 6), col, { line: false, shade: false, bloom: false, wobble: 0.4 }))),
      pen(P(x, 56, x + 1, 50), { width: 1.4 }),
    ];
  };
  const xs = [70, 100, 130, 160, 190];
  // icing that drips over the edge in soft scallops
  const drips: Pt[] = P(30, 84);
  for (let x = 36; x < 224; x += 30) drips.push(...P(x, 108, x + 8, 124, x + 18, 122, x + 24, 108));
  drips.push([230, 84]);
  return svg({ w: 260, h: 220, name: 'bears-birthday-cake' }, [
    // the stand: a foot, a stem and a plate with a blue rim
    wash(ellipse(130, 208, 54, 9), CREAM, { shade: SHADE, depth: 0.4, lineWidth: 2, bloom: false }),
    wash(rect(121, 184, 18, 26, 3), CREAM, { shade: SHADE, depth: 0.4, lineWidth: 2, bloom: false }),
    wash(ellipse(130, 178, 118, 16), CREAM, { shade: SHADE, light: -100, depth: 0.3, lineWidth: 2.4 }),
    pen(P(24, 184, 70, 192, 130, 194, 190, 192, 236, 184), { width: 1.6, color: BLUE, opacity: 0.8 }),
    // the sponge, with a band of jam through the middle
    wash(body, SPONGE, { light: -130, depth: 0.3, hatch: 7, lineWidth: 2.6 }),
    clipped(body, [
      wash(band(P(30, 120, 80, 128, 130, 131, 180, 128, 230, 120), 11), JAM, { line: false, shade: false, bloom: false, wobble: 0.6 }),
      blot(ellipse(88, 128, 18, 2.6), '#ffffff', 0.45),
      wash(drips, PINK, { line: false, shade: deeper(PINK, 0.3), depth: 0.25, bloom: false, wobble: 0.8 }),
    ]),
    pen(P(37, 94, 37, 160), { width: 1.6 }),
    pen(P(223, 94, 223, 160), { width: 1.6 }),
    sheen(54, 140, 4, 16, 0, 0.35),
    // the pink top
    wash(ellipse(130, 92, 94, 18), PINK, { shade: deeper(PINK, 0.25), light: -110, depth: 0.25, lineWidth: 2.4, wobble: 0.8 }),
    wash(ellipse(130, 92, 66, 10), paler(PINK, 0.35), { line: false, shade: false, bloom: false }),
    ...[[84, 96], [112, 100], [150, 99], [180, 95], [132, 88], [100, 90]].map(([x, y], i) => dot(x, y, 2, [YELLOW, BLUE, GREEN][i % 3])),
    ...xs.flatMap((x, i) => candle(x, i)),
    group({ part: 'flames' }, xs.flatMap((x) => [
      wash(P(x, 52, x - 6, 42, x - 4, 34, x, 26, x + 4, 34, x + 6, 42), '#f09a2c', { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.4 }),
      wash(ellipse(x, 42, 2.6, 6), '#ffe07a', { line: false, shade: false, bloom: false }),
    ])),
    group({ part: 'smoke', opacity: 0 }, xs.map((x, i) =>
      pen(P(x, 44, x + 5, 34, x - 4, 24, x + 5, 14, x - 1, 4), { width: 2.2, color: '#9aa7b6', breaks: 0.1, opacity: 0.85 - (i % 2) * 0.15 }),
    )),
  ]);
});

const partyTable = cached(() => {
  const CRUST = '#d99a4a';
  const cloth = P(10, 96, 610, 96, 612, 150, 608, 200, 12, 200, 8, 150);
  const checks: Node[] = [];
  for (let x = 6; x < 620; x += 30) checks.push(wash(rect(x, 80, 13, 130), BLUE, { line: false, shade: false, bloom: false, wobble: 0.3, opacity: 0.45 }));
  for (let y = 100; y < 210; y += 28) checks.push(wash(rect(0, y, 620, 13), BLUE, { line: false, shade: false, bloom: false, wobble: 0.3, opacity: 0.45 }));
  const plate = (x: number, w: number, y = 92): Node => wash(ellipse(x, y, w, 7), CREAM, { shade: SHADE, light: -100, depth: 0.4, lineWidth: 1.8, bloom: false });

  // Iced biscuits piled on a plate
  const biscuit = (x: number, y: number, ice: string): Node[] => [
    wash(ellipse(x, y, 20, 13), '#e0b068', { lineWidth: 1.8, depth: 0.35, bloom: false }),
    wash(ellipse(x, y - 1, 15, 9), ice, { line: false, shade: false, bloom: false }),
    dot(x - 6, y - 2, 1.5, RED),
    dot(x + 3, y + 1, 1.5, BLUE),
    dot(x + 7, y - 4, 1.5, YELLOW),
  ];
  // A moulded jelly on a plate
  const jelly = (x: number, col: string, topper: Node[]): Node[] => [
    plate(x, 38),
    wash(curve(P(x - 28, 91, x - 26, 66, x - 16, 52, x, 48, x + 16, 52, x + 26, 66, x + 28, 91), 2), col, { shade: deeper(col, 0.3), light: -130, depth: 0.3, lineWidth: 2.2, bloom: false }),
    pen(P(x - 14, 84, x - 15, 66, x - 8, 56), { width: 1.4, color: deeper(col, 0.5), opacity: 0.5 }),
    pen(P(x + 14, 84, x + 14, 66, x + 8, 56), { width: 1.4, color: deeper(col, 0.5), opacity: 0.5 }),
    sheen(x - 14, 68, 3.4, 11, 8, 0.7),
    ...topper,
  ];
  const sandwich = (x: number, y: number): Node[] => {
    const tri = P(x - 24, y + 10, x + 24, y + 10, x, y - 22);
    return [
      wash(tri, '#f6e7c4', { shade: '#d9c08a', depth: 0.3, lineWidth: 2, bloom: false }),
      pen(P(x - 20, y + 4, x + 20, y + 4), { width: 3.4, color: '#7fa64e', breaks: 0 }),
      pen(P(x - 16, y - 3, x + 16, y - 3), { width: 2.6, color: PINK, breaks: 0 }),
      pen(P(x - 12, y - 10, x + 12, y - 10), { width: 1.4, opacity: 0.5 }),
    ];
  };
  const banana = (x: number, y: number, flip: number): Node[] => [
    wash(band(P(x - 24 * flip, y - 6, x - 6 * flip, y + 2, x + 14 * flip, y - 6, x + 26 * flip, y - 22), 12), '#f4d24e', { shade: deeper('#f4d24e', 0.3), depth: 0.4, lineWidth: 1.8, bloom: false }),
    pen(P(x - 14 * flip, y - 2, x + 10 * flip, y - 6), { width: 1, color: '#b8902c', opacity: 0.6 }),
  ];
  const boat = (x: number): Node[] => [
    wash(curve(P(x - 36, 78, x - 28, 90, x, 94, x + 28, 90, x + 36, 78, x, 82), 2), '#e9eef4', { shade: '#b8c8d8', depth: 0.35, lineWidth: 2, bloom: false }),
    ...banana(x, 72, 1),
    wash(ellipse(x - 4, 68, 12, 8), '#ffffff', { shade: SHADE, depth: 0.3, lineWidth: 1.4, bloom: false, wobble: 0.8 }),
    dot(x - 4, 61, 4.4, RED),
    dot(x - 5.5, 59.6, 1.2, '#ffffff'),
  ];
  const cherry = (x: number, y: number): Node[] => [dot(x, y, 5, '#b3202a'), dot(x - 1.5, y - 1.6, 1.4, '#ffffff', 0.9), pen(P(x, y - 4, x + 5, y - 11), { width: 1.2 })];

  return svg({ w: 620, h: 200, name: 'bears-party-table' }, [
    // the cloth: a top edge and a front hanging to the bottom of the drawing
    wash(P(24, 86, 596, 86, 612, 100, 8, 100), CREAM, { shade: SHADE, light: -90, depth: 0.5, lineWidth: 2, bloom: false }),
    wash(cloth, CREAM, { shade: SHADE, light: -100, depth: 0.12, line: false, bloom: false }),
    clipped(cloth, [...checks, ...[96, 210, 330, 440, 530].map((x) => pen(P(x, 104, x + 3, 150, x - 1, 200), { width: 1.4, color: '#7f95ad', opacity: 0.45 }))]),
    pen([...cloth.slice(0, 2)], { width: 2.4, breaks: 0.1 }),
    pen(P(9, 100, 7, 150, 11, 200), { width: 2 }),
    pen(P(611, 100, 613, 150, 609, 200), { width: 2 }),
    pen(P(11, 198, 200, 199, 420, 198, 609, 199), { width: 1.4, opacity: 0.5 }),
    // left: biscuits, green jelly, a pie
    plate(70, 48),
    ...biscuit(48, 82, '#f4c6d4'),
    ...biscuit(92, 82, '#d9e6a8'),
    ...biscuit(70, 72, '#fbf1c4'),
    ...jelly(168, '#6fc27a', cherry(168, 46)),
    // the pie: a tin, a golden lid with a fluted edge and a steam hole
    wash(P(222, 91, 226, 74, 280, 74, 284, 91), '#b9c3cf', { shade: '#8f9ba8', depth: 0.4, lineWidth: 2, bloom: false }),
    wash(curve(P(220, 76, 224, 62, 244, 52, 252, 50, 262, 52, 280, 62, 284, 76, 252, 82), 2), CRUST, { shade: deeper(CRUST, 0.3), light: -130, depth: 0.3, hatch: 6, lineWidth: 2.2 }),
    ...[232, 246, 260, 274].map((x) => pen(P(x, 78, x + 2, 71), { width: 1.6, color: deeper(CRUST, 0.6) })),
    pen(P(246, 62, 252, 58, 258, 62), { width: 1.4 }),
    pen(P(238, 68, 246, 64), { width: 1.2, color: deeper(CRUST, 0.6) }),
    pen(P(258, 64, 268, 68), { width: 1.2, color: deeper(CRUST, 0.6) }),
    // right: sandwiches, a red jelly, banana boats
    plate(404, 50),
    ...sandwich(382, 70),
    ...sandwich(426, 70),
    ...sandwich(404, 64),
    ...jelly(498, '#e0535a', cherry(498, 46)),
    ...boat(572),
  ]);
});

// ---------------------------------------------------------------------------
// Grandpa's puppet show
// ---------------------------------------------------------------------------

const mrPunch = cached(() => {
  const cloak = P(36, 116, 22, 160, 18, 226, 78, 230, 132, 226, 128, 160, 114, 116);
  const sleeve = (flip: boolean): Node[] => {
    const arm = band(P(36, 128, 20, 150, 14, 172), 22);
    const hand = ellipse(14, 178, 10, 9);
    return [
      wash(flip ? mirror(arm, 150) : arm, RED, { shade: deeper(RED, 0.3), depth: 0.35, lineWidth: 2, bloom: false }),
      wash(flip ? mirror(hand, 150) : hand, SKIN, { shade: deeper(SKIN, 0.2), lineWidth: 1.8, bloom: false }),
    ];
  };
  const harlequin: Node[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r + c) % 2) continue;
      harlequin.push(wash(diamond(14 + c * 30, 128 + r * 28, 15, 14), YELLOW, { line: false, shade: false, bloom: false, wobble: 0.4 }));
    }
  }
  const hat = curve(P(40, 66, 42, 42, 64, 26, 96, 22, 124, 30, 140, 50, 134, 60, 112, 50, 96, 46, 110, 66), 1);
  return svg({ w: 150, h: 230, name: 'bears-mr-punch' }, [
    wash(cloak, RED, { shade: deeper(RED, 0.3), light: -120, depth: 0.28, hatch: 7, lineWidth: 2.6, bloom: false }),
    clipped(cloak, harlequin),
    pen(P(75, 128, 77, 180, 74, 228), { width: 1.4, color: deeper(RED, 0.6), opacity: 0.5 }),
    ...sleeve(false),
    ...sleeve(true),
    // the ruff: a scalloped white collar
    wash(curve(P(30, 112, 36, 100, 50, 106, 62, 98, 76, 106, 90, 98, 102, 106, 116, 100, 122, 112, 112, 126, 94, 122, 76, 130, 58, 122, 40, 126), 2), CREAM, { shade: SHADE, depth: 0.35, lineWidth: 2, bloom: false }),
    // the head, with cheeks and a chin that sticks out a little
    wash(curve(P(40, 80, 42, 56, 74, 48, 108, 56, 112, 80, 106, 100, 90, 112, 74, 114, 56, 108), 2), SKIN, { shade: deeper(SKIN, 0.2), light: -130, depth: 0.3, lineWidth: 2.4 }),
    blot(ellipse(52, 88, 8, 6), '#e98a82', 0.55),
    blot(ellipse(100, 90, 8, 6), '#e98a82', 0.55),
    // sorry eyes, brows tilted up in the middle, a small downturned mouth
    dot(62, 78, 3.4, INKY),
    dot(90, 78, 3.4, INKY),
    dot(61, 77, 1.1, '#ffffff'),
    dot(89, 77, 1.1, '#ffffff'),
    pen(P(54, 68, 62, 66, 70, 70), { width: 1.8 }),
    pen(P(82, 70, 90, 66, 98, 68), { width: 1.8 }),
    pen(P(66, 106, 74, 102, 84, 106), { width: 1.8 }),
    // the hat first drawn over the brow, then its band and bell
    wash(hat, RED, { shade: deeper(RED, 0.3), light: -120, depth: 0.3, lineWidth: 2.4, bloom: false }),
    wash(rect(38, 56, 76, 12, 5), YELLOW, { shade: deeper(YELLOW, 0.3), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(circle(136, 58, 7), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.8, depth: 0.4 }),
    dot(135, 56, 1.6, '#fff3c4'),
    // the big nose, squashed sideways, with the sticking plaster across it
    wash(ellipse(80, 90, 18, 12, 24), '#e8786a', { shade: deeper('#e8786a', 0.3), light: -130, depth: 0.3, lineWidth: 2.2 }),
    sheen(74, 86, 4, 2.6, 24, 0.55),
    wash(rect(66, 84, 28, 11, 2), '#f0cfa6', { shade: deeper('#f0cfa6', 0.2), lineWidth: 1.6, depth: 0.3, bloom: false }),
    dot(72, 90, 1, '#b8946a'),
    dot(79, 90, 1, '#b8946a'),
    dot(86, 90, 1, '#b8946a'),
  ]);
});

const travellingCase = cached(() => {
  const body = rect(14, 66, 192, 78, 8);
  const lid = rect(10, 36, 200, 36, 10);
  const strap = (x: number): Node[] => [wash(rect(x, 40, 14, 100), deeper(BROWN, 0.35), { lineWidth: 1.8, bloom: false, shade: false, wobble: 0.5 })];
  return svg({ w: 220, h: 150, name: 'bears-travelling-case' }, [
    // the red lining, hidden until the lid lifts
    wash(P(18, 68, 202, 68, 196, 52, 24, 52), '#b73a3f', { shade: deeper('#b73a3f', 0.3), depth: 0.4, lineWidth: 1.8, bloom: false }),
    wash(body, BROWN, { shade: deeper(BROWN, 0.3), light: -130, depth: 0.28, hatch: 6, lineWidth: 2.8 }),
    pen(P(18, 80, 110, 82, 202, 80), { width: 1.2, color: deeper(BROWN, 0.6), opacity: 0.55 }),
    clipped(body, [...strap(44), ...strap(162)]),
    // brass corners and the catch plates on the body
    ...[[20, 138], [200, 138]].map(([x, y]) => wash(rect(x - 8, y - 12, 16, 14, 3), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 })),
    ...[88, 132].map((x) => wash(rect(x - 6, 66, 12, 12, 2), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 })),
    blot(ellipse(30, 108, 4, 18), '#ffffff', 0.18),
    group({ part: 'lid', origin: [110, 40] }, [
      // handle on the lid
      wash(band(P(86, 38, 90, 24, 110, 20, 130, 24, 134, 38), 7), '#6f4526', { shade: '#4a2c1c', depth: 0.4, lineWidth: 1.8, bloom: false }),
      wash(lid, BROWN, { shade: deeper(BROWN, 0.3), light: -130, depth: 0.28, hatch: 6, lineWidth: 2.8 }),
      pen(P(16, 44, 110, 42, 204, 44), { width: 1.2, color: deeper(BROWN, 0.6), opacity: 0.55 }),
      clipped(lid, [...strap(44), ...strap(162)].map((s) => s)),
      ...[88, 132].map((x) => wash(rect(x - 7, 56, 14, 22, 3), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 })),
      ...[88, 132].map((x) => dot(x, 62, 2, '#3d2a1c')),
      ...[[20, 44], [200, 44]].map(([x, y]) => wash(rect(x - 8, y - 4, 16, 14, 3), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 })),
      blot(ellipse(52, 50, 14, 3.4, -4), '#e6c08a', 0.5),
    ]),
  ]);
});

const showCurtains = cached(() => {
  const POST = '#b98a52';
  const CURTAIN = '#c9423a';
  const hem = (x0: number, x1: number): Pt[] => {
    const out: Pt[] = [];
    const n = 6;
    for (let i = 0; i <= n; i++) out.push([x1 + (x0 - x1) * (i / n), 498 + (i % 2 ? 0 : 5)]);
    return out;
  };
  const folds = (x0: number, x1: number): Node[] => {
    const out: Node[] = [];
    const n = 4;
    for (let i = 1; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      out.push(wash(rect(x - 7, 90, 14, 410), deeper(CURTAIN, 0.4), { line: false, shade: false, bloom: false, wobble: 1.5, opacity: 0.22 }));
      out.push(pen(P(x + 4, 100, x + 7, 300, x + 3, 496), { width: 1.4, color: deeper(CURTAIN, 0.6), opacity: 0.55 }));
    }
    return out;
  };
  const stars = (pts: number[][]): Node[] => pts.map(([x, y, r]) => wash(star(x, y, r), YELLOW, { shade: deeper(YELLOW, 0.3), depth: 0.4, lineWidth: 1.6, bloom: false, wobble: 0.5 }));
  const left = P(50, 86, 288, 86, 286, 300, 284, 498, ...hem(50, 284).flatMap(([x, y]) => [x, y]).slice(2));
  const right = mirror(left, 560);
  const flags = ['#d9503f', '#f2cd45', '#6f9bc9', '#7fb56f'];
  const bunting: Node[] = [pen(P(26, 20, 140, 32, 280, 36, 420, 32, 534, 20), { width: 1.8 })];
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9.6;
    const x = 30 + t * 500;
    const y = 20 + Math.sin(t * Math.PI) * 16;
    bunting.push(wash(P(x - 15, y, x + 15, y + 1, x, y + 30), flags[i % 4], { lineWidth: 1.6, bloom: false, shade: deeper(flags[i % 4], 0.3), depth: 0.3, wobble: 0.5 }));
  }
  const posts = (x: number): Node[] => [
    wash(rect(x, 40, 30, 470, 3), POST, { shade: deeper(POST, 0.3), light: -150, depth: 0.35, hatch: 7, lineWidth: 2.6, wobble: 1.6 }),
    pen(P(x + 10, 80, x + 12, 300, x + 9, 480), { width: 1.2, color: deeper(POST, 0.6), opacity: 0.5 }),
  ];
  const scallops: Pt[] = P(30, 62, 530, 62);
  for (let i = 0; i <= 10; i++) {
    const x = 530 - i * 50;
    scallops.push([x - 4, 102], [x - 25, 118], [x - 46, 102]);
  }
  return svg({ w: 560, h: 520, name: 'bears-show-curtains' }, [
    blot(ellipse(280, 506, 270, 8), '#8f9b7a', 0.35),
    ...posts(18),
    ...posts(512),
    // curtains behind the rail and pelmet, hinged at their outer top corners
    group({ part: 'curtainL', origin: [50, 90] }, [
      wash(left, CURTAIN, { shade: deeper(CURTAIN, 0.3), light: -150, depth: 0.2, lineWidth: 2.6, wobble: 1.4, bloom: false }),
      clipped(left, [...folds(50, 286), ...stars([[100, 180, 15], [200, 150, 13], [150, 270, 16], [244, 330, 14], [92, 380, 14], [196, 430, 16], [250, 220, 12]])]),
    ]),
    group({ part: 'curtainR', origin: [510, 90] }, [
      wash(right, CURTAIN, { shade: deeper(CURTAIN, 0.3), light: -30, depth: 0.2, lineWidth: 2.6, wobble: 1.4, bloom: false }),
      clipped(right, [...folds(274, 510), ...stars([[460, 180, 15], [360, 150, 13], [410, 270, 16], [316, 330, 14], [468, 380, 14], [364, 430, 16], [310, 220, 12]])]),
    ]),
    // the top rail, the scalloped pelmet and the bunting
    wash(scallops, '#e9c75c', { shade: deeper('#e9c75c', 0.3), light: -90, depth: 0.2, lineWidth: 2.4, wobble: 1 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => dot(52 + i * 50, 100, 3.4, RED)),
    wash(rect(10, 40, 540, 26, 4), POST, { shade: deeper(POST, 0.3), light: -140, depth: 0.35, hatch: 7, lineWidth: 2.6 }),
    ...bunting,
  ]);
});

const bush = cached(() => {
  // three overlapping clumps: the ends rise higher than the dip in the middle
  const clumps: Node[] = [
    ...leaves(190, 175, 150, 52, 4, LEAF_DARK),
    ...leaves(98, 128, 84, 66, 6, LEAF_DARK),
    ...leaves(282, 128, 84, 66, 8, LEAF_DARK),
    ...leaves(190, 158, 100, 40, 12, LEAF),
    ...leaves(76, 172, 56, 34, 14, LEAF),
    ...leaves(304, 172, 56, 34, 16, LEAF),
  ];
  const berries = [[60, 108], [120, 92], [176, 126], [236, 118], [300, 100], [330, 150], [84, 160], [210, 168], [150, 176], [276, 170]];
  return svg({ w: 380, h: 230, name: 'bears-bush' }, [
    group({ part: 'leaves', origin: [190, 230] }, [
      blot(ellipse(190, 214, 170, 14), '#4f6f34', 0.5),
      ...clumps,
      ...berries.flatMap(([x, y]) => [dot(x, y, 5.4, '#b3202a'), dot(x - 1.6, y - 1.8, 1.5, '#ffffff', 0.9), pen(P(x, y - 5, x + 3, y - 9), { width: 1, color: '#3d4a28' })]),
    ]),
  ]);
});

const mug = cached(() => {
  const body = drum(42, 30, 78, 28, 7);
  const handle = band(P(68, 40, 86, 42, 86, 62, 68, 66), 7);
  return svg({ w: 90, h: 90, name: 'bears-mug' }, [
    wash(handle, BLUE, { shade: deeper(BLUE, 0.3), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(body, CREAM, { shade: SHADE, light: -130, depth: 0.3, hatch: 6, lineWidth: 2.4 }),
    clipped(body, [
      wash(rect(0, 42, 90, 8), BLUE, { line: false, shade: false, bloom: false, wobble: 0.5 }),
      wash(rect(0, 60, 90, 8), BLUE, { line: false, shade: false, bloom: false, wobble: 0.5 }),
    ]),
    sheen(21, 56, 2.6, 14, 0, 0.6),
    // the hot chocolate and a pink marshmallow
    wash(ellipse(42, 30, 28, 7), CREAM, { shade: false, bloom: false, lineWidth: 2 }),
    wash(ellipse(42, 31, 24, 5), '#7a4a2c', { shade: deeper('#7a4a2c', 0.3), line: false, bloom: false }),
    wash(ellipse(44, 28, 10, 6.5, -8), PINK, { shade: deeper(PINK, 0.25), lineWidth: 1.6, bloom: false, depth: 0.4 }),
    dot(41, 26, 1.4, '#ffffff', 0.9),
    group({ part: 'steam' }, [
      pen(P(30, 20, 35, 14, 27, 8, 33, 2), { width: 2.2, color: '#8fb3d6', breaks: 0.1, opacity: 0.9 }),
      pen(P(56, 18, 51, 12, 59, 6, 54, 1), { width: 2.2, color: '#8fb3d6', breaks: 0.1, opacity: 0.9 }),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// Things to wear, hold and give
// ---------------------------------------------------------------------------

const jumper = cached(() => {
  const WOOL = '#6aa56a';
  const CREAMY = '#f2e8c4';
  const body = rect(58, 40, 84, 138, 8);
  const sleeveL = band(P(66, 52, 38, 96, 14, 140), 42);
  const sleeveR = mirror(sleeveL, 200);
  const stripes = (): Node[] => [52, 80, 108, 136, 164].map((y) => wash(rect(0, y, 200, 9), CREAMY, { line: false, shade: false, bloom: false, wobble: 0.6 }));
  return svg({ w: 200, h: 190, name: 'bears-jumper' }, [
    // sleeves out to the sides, behind the body
    wash(sleeveL, WOOL, { shade: deeper(WOOL, 0.3), light: -130, depth: 0.3, fur: 5, lineWidth: 2.4 }),
    wash(sleeveR, WOOL, { shade: deeper(WOOL, 0.3), light: -50, depth: 0.3, fur: 5, lineWidth: 2.4 }),
    clipped(sleeveL, stripes()),
    clipped(sleeveR, stripes()),
    // red patches at the elbows, and ribbed cuffs
    wash(ellipse(36, 98, 15, 11, -55), RED, { shade: deeper(RED, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    wash(ellipse(164, 98, 15, 11, 55), RED, { shade: deeper(RED, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    pen(P(30, 94, 42, 102), { width: 1.2, color: '#f2cdb8', opacity: 0.8 }),
    pen(P(170, 94, 158, 102), { width: 1.2, color: '#f2cdb8', opacity: 0.8 }),
    wash(band(P(22, 134, 12, 150), 34), deeper(WOOL, 0.15), { shade: deeper(WOOL, 0.4), lineWidth: 2, bloom: false, depth: 0.4 }),
    wash(band(P(178, 134, 188, 150), 34), deeper(WOOL, 0.15), { shade: deeper(WOOL, 0.4), lineWidth: 2, bloom: false, depth: 0.4 }),
    wash(body, WOOL, { shade: deeper(WOOL, 0.3), light: -130, depth: 0.3, fur: 5, lineWidth: 2.6 }),
    clipped(body, stripes()),
    // ribbed hem and neck
    wash(rect(56, 168, 88, 14, 4), deeper(WOOL, 0.15), { shade: deeper(WOOL, 0.4), lineWidth: 2.2, bloom: false, depth: 0.4 }),
    ...[64, 74, 84, 94, 104, 114, 124, 134].map((x) => pen(P(x, 170, x, 180), { width: 1.2, color: deeper(WOOL, 0.6), opacity: 0.6 })),
    wash(ellipse(100, 42, 24, 10), deeper(WOOL, 0.35), { shade: false, lineWidth: 2, bloom: false }),
    wash(ellipse(100, 40, 17, 6), '#e6dcb8', { line: false, shade: false, bloom: false, opacity: 0.8 }),
    blot(ellipse(76, 80, 5, 22), '#ffffff', 0.18),
  ]);
});

const umbrella = cached(() => {
  const cols = [RED, CREAM, BLUE, RED, CREAM, BLUE];
  const apex: Pt = [150, 28];
  const base = (k: number): Pt => [10 + k * (280 / 6), 174];
  const rib = (k: number): Pt[] => {
    const b = base(k);
    const side = (b[0] - 150) / 140;
    const c: Pt = [(apex[0] + b[0]) / 2 + side * 46, (apex[1] + b[1]) / 2 - 8 + Math.abs(side) * 12];
    const out: Pt[] = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      out.push([(1 - t) ** 2 * apex[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * apex[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]);
    }
    return out;
  };
  const panel = (k: number): Pt[] => {
    const a = base(k);
    const b = base(k + 1);
    const scallop: Pt[] = [];
    for (let i = 1; i < 6; i++) {
      const t = i / 6;
      scallop.push([a[0] + (b[0] - a[0]) * t, 174 - Math.sin(t * Math.PI) * 12]);
    }
    return [...rib(k), ...scallop, ...rib(k + 1).reverse()];
  };
  return svg({ w: 300, h: 300, name: 'bears-umbrella' }, [
    // the shaft and the hooked wooden handle behind the canopy
    wash(band(P(150, 170, 150, 240, 148, 270, 138, 288, 120, 290, 110, 276), 9), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, light: 180, lineWidth: 2.2, bloom: false }),
    ...cols.map((c, k) => wash(panel(k), c, { shade: c === CREAM ? SHADE : deeper(c, 0.3), light: k < 3 ? -130 : -60, depth: 0.28, hatch: c === CREAM ? false : 7, lineWidth: 2.4, wobble: 0.8 })),
    ...[1, 2, 3, 4, 5].map((k) => pen(rib(k), { width: 1.8, breaks: 0 })),
    pen(P(150, 20, 150, 32), { width: 3.4, color: '#6f4526' }),
    blot(ellipse(100, 82, 5, 28, 28), '#ffffff', 0.4),
    ...[1, 2, 3, 4, 5].map((k) => dot(base(k)[0], 176, 2.4, '#6f4526')),
  ]);
});

const balloons = cached(() => {
  const knot: Pt = [100, 214];
  const one = (cx: number, cy: number, rx: number, ry: number, rot: number, col: string): { tip: Pt; art: Node[] } => {
    const a = (rot * Math.PI) / 180;
    const tip: Pt = [cx - Math.sin(a) * (ry + 6), cy + Math.cos(a) * (ry + 6)];
    const baseL: Pt = [cx - Math.sin(a) * ry - Math.cos(a) * 5, cy + Math.cos(a) * ry - Math.sin(a) * 5];
    const baseR: Pt = [cx - Math.sin(a) * ry + Math.cos(a) * 5, cy + Math.cos(a) * ry + Math.sin(a) * 5];
    return {
      tip,
      art: [
        wash([baseL, tip, baseR], col, { shade: deeper(col, 0.3), lineWidth: 1.6, bloom: false, depth: 0.5, wobble: 0.3 }),
        wash(ellipse(cx, cy, rx, ry, rot), col, { shade: deeper(col, 0.3), light: -130, depth: 0.3, lineWidth: 2.4 }),
        sheen(cx - rx * 0.4, cy - ry * 0.4, 5, 12, 30, 0.7),
      ],
    };
  };
  const g = one(54, 96, 36, 46, 12, '#7fc27a');
  const r = one(108, 58, 36, 46, -5, '#e0535a');
  const y = one(148, 104, 35, 45, -14, '#f4d24e');
  const b = one(100, 138, 34, 43, 0, '#7aa9dc');
  const strings = [g, r, y, b].map((o) => pen([o.tip, knot], { width: 1.4, breaks: 0 }));
  return svg({ w: 200, h: 300, name: 'bears-balloons' }, [
    group({ part: 'bunch', origin: knot }, [
      ...strings,
      ...g.art,
      ...r.art,
      ...y.art,
      ...b.art,
      dot(knot[0], knot[1], 3.6, deeper(RED, 0.2)),
      pen(P(100, 214, 104, 232, 96, 252, 103, 272, 98, 296), { width: 1.8, breaks: 0 }),
    ]),
  ]);
});

const parcel = cached(() => {
  const PAPER = '#7aa9dc';
  const front = rect(10, 40, 116, 74, 2);
  const top = P(10, 40, 30, 20, 136, 20, 126, 40);
  const side = P(126, 40, 136, 20, 136, 94, 126, 114);
  const spots = (x0: number, y0: number, x1: number, y1: number): Node[] => {
    const out: Node[] = [];
    for (let y = y0, row = 0; y < y1; y += 22, row++) {
      for (let x = x0 + (row % 2 ? 11 : 0); x < x1; x += 22) out.push(dot(x, y, 4.6, YELLOW));
    }
    return out;
  };
  return svg({ w: 140, h: 120, name: 'bears-parcel' }, [
    wash(side, deeper(PAPER, 0.25), { shade: deeper(PAPER, 0.5), light: -30, depth: 0.3, lineWidth: 2.2, bloom: false }),
    clipped(side, spots(120, 30, 140, 112).map((d) => d)),
    wash(front, PAPER, { shade: deeper(PAPER, 0.3), light: -130, depth: 0.28, hatch: 7, lineWidth: 2.6 }),
    clipped(front, spots(16, 50, 126, 114)),
    wash(top, paler(PAPER, 0.25), { shade: deeper(PAPER, 0.2), light: -110, depth: 0.2, lineWidth: 2.2, bloom: false }),
    clipped(top, spots(28, 26, 140, 40)),
    // the ribbon over the front and the top, then the bow
    wash(rect(56, 40, 20, 74), RED, { shade: deeper(RED, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.5 }),
    wash(P(56, 40, 76, 40, 96, 20, 76, 20), deeper(RED, 0.1), { shade: deeper(RED, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.4 }),
    wash(P(62, 28, 52, 6, 70, 4, 74, 24), RED, { shade: deeper(RED, 0.3), light: -130, depth: 0.3, lineWidth: 1.8, bloom: false, wobble: 0.4 }),
    wash(P(74, 26, 88, 2, 104, 10, 84, 30), RED, { shade: deeper(RED, 0.3), light: -50, depth: 0.3, lineWidth: 1.8, bloom: false, wobble: 0.4 }),
    wash(ellipse(72, 26, 7, 6), deeper(RED, 0.15), { shade: false, lineWidth: 1.8, bloom: false }),
    sheen(24, 70, 3, 14, 0, 0.3),
  ]);
});

export const treasuryProps: Record<string, () => string> = {
  'birthday-cake': birthdayCake,
  'mr-punch': mrPunch,
  'travelling-case': travellingCase,
  'show-curtains': showCurtains,
  bush,
  mug,
  jumper,
  umbrella,
  balloons,
  'party-table': partyTable,
  parcel,
};
