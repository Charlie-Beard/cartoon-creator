/**
 * The bears' home and outdoor props, in the book's watercolour-and-ink look:
 * porridge things, honey, a ladybird, a kite, butterflies, a blackbird, the
 * aeroplane and Uncle Bill's helicopter, a muddy splash, a picnic, a duck,
 * a treasure chest and the big dream cloud.
 *
 * Parts that scripts can move (all drawn at rest):
 *   porridge-bowl, saucepan   'steam' (hidden): fade it in for "too hot"
 *   ladybird                  'wingL', 'wingR': shell halves, hinged near the head
 *   kite                      'tail': hinged at the kite's bottom point, to sway
 *   butterfly                 'wingL', 'wingR': hinged at the body, to flap
 *   helicopter                'rotor': hinged at the hub; 'rope' (hidden)
 *   treasure-chest            'lid': hinged at the back; 'gold' (hidden)
 */
import { band, cached, circle, curve, dot, ellipse, group, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, hatch, paler, pen, wash } from '../../art/watercolour';

/** Points from a flat list of numbers: P(x0, y0, x1, y1 …). */
const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};
/** The same points mirrored left-right across a drawing `w` wide. */
const mirror = (pts: Pt[], w: number): Pt[] => pts.map(([x, y]) => [w - x, y] as Pt);

const STEAM = '#8fb3d6';
const WOOD = '#c99a5e';
const GOLD = '#e2a93a';
const RED = '#d9503f';
const YELLOW = '#f2cd45';
const BLUE = '#6f9bc9';

/** Three wavy pale-blue steam curls rising from y0, spread over x0 … x1. */
function steam(x0: number, x1: number, y0: number, rise = 36): Node {
  const curls: Node[] = [];
  for (let i = 0; i < 3; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / 3;
    const up = rise - (i === 1 ? 0 : 8);
    curls.push(
      pen(P(x, y0, x + 6, y0 - up * 0.25, x - 5, y0 - up * 0.5, x + 6, y0 - up * 0.75, x - 2, y0 - up), { width: 2.4, color: STEAM, breaks: 0.1, opacity: 0.9 }),
    );
  }
  return group({ part: 'steam', opacity: 0 }, curls);
}

// ---------------------------------------------------------------------------
// Kitchen
// ---------------------------------------------------------------------------

const porridgeBowl = cached(() => {
  const body = curve(P(8, 38, 14, 60, 38, 80, 70, 86, 102, 80, 126, 60, 132, 38), 3);
  return svg({ w: 140, h: 90, name: 'bears-porridge-bowl' }, [
    wash(body, '#fbf8f0', { shade: '#cfd9e6', light: -130, depth: 0.3, hatch: 6 }),
    clipped(body, [
      wash(rect(0, 50, 140, 7), BLUE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
      wash(rect(0, 64, 140, 5), BLUE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
    ]),
    wash(ellipse(70, 38, 63, 15), '#fbf8f0', { shade: false, bloom: false, lineWidth: 2.2 }),
    wash(ellipse(70, 39, 54, 11), '#ecd9ac', { shade: '#d8bd84', depth: 0.3, line: false }),
    pen(P(26, 40, 40, 44, 56, 45), { width: 1.4, color: deeper('#ecd9ac', 0.5), opacity: 0.7 }),
    pen(P(80, 34, 98, 36, 110, 40), { width: 1.4, color: deeper('#ecd9ac', 0.5), opacity: 0.7 }),
    // the wooden spoon standing in the porridge
    wash(band(P(86, 38, 106, 22, 126, 6), 7), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(ellipse(84, 38, 11, 6, -30), WOOD, { shade: deeper(WOOD, 0.3), lineWidth: 2, bloom: false }),
    steam(30, 82, 26, 24),
  ]);
});

const saucepan = cached(() => {
  const body = rect(30, 34, 122, 76, 12);
  const SILVER = '#c3ccd5';
  return svg({ w: 200, h: 120, name: 'bears-saucepan' }, [
    // handle first, so the pan overlaps its root
    wash(band(P(146, 52, 170, 52, 196, 60), 10), '#35302e', { shade: '#1c1816', depth: 0.4, lineWidth: 2, bloom: false }),
    dot(190, 60, 3.2, '#8a817a', 0.8),
    wash(body, SILVER, { shade: '#8f9ba8', light: -150, depth: 0.32, hatch: 6, lineWidth: 2.6 }),
    // a dent, a scratch and a bright streak
    wash(ellipse(66, 78, 13, 9, -20), '#9fabb8', { shade: '#7a8795', lineWidth: 1.5, bloom: false, hatch: 4, depth: 0.5 }),
    pen(P(100, 62, 108, 74, 112, 90), { width: 1.4, opacity: 0.55 }),
    blot(ellipse(46, 62, 4, 22), '#ffffff', 0.85),
    wash(rect(28, 32, 126, 8, 4), '#aeb9c4', { shade: false, bloom: false, lineWidth: 2 }),
    // the rim from above, with porridge in it
    wash(ellipse(91, 33, 60, 10), '#aeb9c4', { shade: false, bloom: false, lineWidth: 2 }),
    wash(ellipse(91, 34, 53, 7), '#ecd9ac', { shade: '#d8bd84', depth: 0.3, line: false, bloom: false }),
    dot(80, 34, 2, '#c9a96a', 0.8),
    dot(110, 33, 2, '#c9a96a', 0.8),
    steam(50, 134, 24, 22),
    // a little ear handle on the near side
    pen(P(30, 56, 20, 58, 20, 70, 30, 72), { width: 3 }),
  ]);
});

const woodenSpoon = cached(() => {
  const spoon: Pt[] = band(P(19, 148, 21, 100, 20, 56), 9);
  return svg({ w: 40, h: 150, name: 'bears-wooden-spoon' }, [
    wash(spoon, WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, light: 180, lineWidth: 2.2, bloom: false }),
    wash(ellipse(20, 32, 15, 27, 2), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.3, light: -150, lineWidth: 2.4 }),
    wash(ellipse(21, 34, 9, 19, 2), deeper(WOOD, 0.2), { line: false, shade: false, bloom: false }),
    pen(P(20, 58, 20, 100, 19, 140), { width: 1.2, color: deeper(WOOD, 0.6), opacity: 0.5 }),
    blot(ellipse(15, 28, 3, 11), '#ffffff', 0.45),
  ]);
});

const honeyPot = cached(() => {
  const body = curve(P(14, 44, 8, 74, 16, 104, 40, 116, 70, 116, 94, 104, 102, 74, 96, 44), 3);
  const honey = '#d98a1c';
  const bee: Node[] = [
    wash(ellipse(48, 82, 6, 9, 70), '#ffffff', { line: false, shade: false, bloom: false, opacity: 0.8 }),
    wash(ellipse(58, 76, 6, 9, 20), '#ffffff', { lineWidth: 1, shade: false, bloom: false, opacity: 0.9 }),
    wash(ellipse(51, 86, 11, 7, -10), YELLOW, { lineWidth: 1.6, bloom: false, depth: 0.4 }),
    wash(ellipse(52, 85, 2, 6, -10), '#2a2220', { line: false, shade: false, bloom: false }),
    wash(ellipse(58, 84, 2, 6, -10), '#2a2220', { line: false, shade: false, bloom: false }),
    dot(43, 85, 3.2, '#2a2220'),
    pen(P(38, 84, 33, 81, 31, 83), { width: 1, opacity: 0.8 }),
    pen(P(30, 94, 40, 91, 47, 93, 54, 90), { width: 1, color: '#bbaa88', opacity: 0.6 }),
  ];
  return svg({ w: 110, h: 120, name: 'bears-honey-pot' }, [
    // the dipper leaning out of the pot
    wash(band(P(66, 30, 82, 16, 98, 4), 6), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, lineWidth: 1.8, bloom: false }),
    wash(ellipse(66, 28, 9, 5, -30), '#b8731a', { lineWidth: 1.4, bloom: false, shade: false }),
    wash(body, GOLD, { shade: deeper(GOLD, 0.3), light: -150, depth: 0.28, hatch: 7, lineWidth: 2.6 }),
    // label: a cream oval with a bee, no words
    wash(ellipse(52, 82, 28, 22), '#f8efd3', { shade: '#e4d6a8', depth: 0.3, lineWidth: 1.8, bloom: false }),
    ...bee,
    // the lip, then honey spilling over it
    wash(rect(16, 32, 80, 16, 7), deeper(GOLD, 0.1), { shade: deeper(GOLD, 0.35), lineWidth: 2.4, bloom: false }),
    wash(ellipse(56, 36, 36, 7), honey, { shade: deeper(honey, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    wash(curve(P(22, 40, 30, 48, 32, 62, 38, 62, 40, 50, 46, 46, 56, 50, 60, 66, 66, 66, 68, 48, 78, 44, 86, 52, 88, 38), 2), honey, { line: false, shade: false, bloom: false, wobble: 0.6 }),
    blot(ellipse(40, 62, 3, 7), paler(honey, 0.5), 0.9),
    blot(ellipse(63, 64, 3, 7), paler(honey, 0.5), 0.9),
    pen(P(31, 50, 33, 62), { width: 1.6, color: deeper(honey, 0.4) }),
    pen(P(66, 50, 67, 66), { width: 1.6, color: deeper(honey, 0.4) }),
    blot(ellipse(26, 70, 3, 14), '#fff3c4', 0.7),
  ]);
});

// ---------------------------------------------------------------------------
// Garden and sky
// ---------------------------------------------------------------------------

const ladybird = cached(() => {
  const shellL = curve(P(30, 12, 20, 13, 14, 22, 13, 34, 18, 44, 30, 48), 2);
  const shellR = mirror(shellL, 60);
  const spots = (flip: boolean): Node[] => {
    const s = (x: number, y: number, r: number): Node => dot(flip ? 60 - x : x, y, r, '#24201e');
    return [s(21, 24, 3.6), s(22, 38, 3.4), s(26, 30, 2.4)];
  };
  const legs = (s: number): Node[] => [
    pen(P(30 + s * 15, 22, 30 + s * 24, 17), { width: 1.6 }),
    pen(P(30 + s * 17, 30, 30 + s * 27, 30), { width: 1.6 }),
    pen(P(30 + s * 15, 38, 30 + s * 24, 44), { width: 1.6 }),
  ];
  return svg({ w: 60, h: 50, name: 'bears-ladybird' }, [
    ...legs(-1),
    ...legs(1),
    // the black back that shows when the shell opens
    wash(ellipse(30, 30, 15, 18), '#2c2624', { line: false, shade: false, bloom: false }),
    wash(ellipse(30, 10, 9, 7), '#2c2624', { lineWidth: 1.8, shade: false, bloom: false }),
    dot(26, 9, 1.8, '#f5f0e0'),
    dot(34, 9, 1.8, '#f5f0e0'),
    pen(P(26, 5, 22, 1, 19, 1), { width: 1.2 }),
    pen(P(34, 5, 38, 1, 41, 1), { width: 1.2 }),
    group({ part: 'wingL', origin: [30, 12] }, [wash(shellL, RED, { light: -150, depth: 0.3, lineWidth: 2 }), ...spots(false)]),
    group({ part: 'wingR', origin: [30, 12] }, [wash(shellR, RED, { light: -30, depth: 0.3, lineWidth: 2 }), ...spots(true)]),
    blot(ellipse(22, 20, 2.5, 5, 20), '#ffffff', 0.7),
  ]);
});

const kite = cached(() => {
  const T: Pt = [80, 6];
  const R: Pt = [150, 88];
  const B: Pt = [80, 170];
  const L: Pt = [10, 88];
  const C: Pt = [80, 88];
  const quad = (pts: Pt[], fill: string, spot: string, sx: number, sy: number): Node[] => [
    wash(pts, fill, { light: -120, depth: 0.25, lineWidth: 2.2, wobble: 0.8 }),
    wash(circle(sx, sy, 8), spot, { lineWidth: 1.4, bloom: false, shade: false }),
  ];
  // the tail: a long wavy string with little bows, hinged at the kite's point
  const tail: Pt[] = P(80, 170, 70, 188, 90, 206, 70, 224, 86, 242, 76, 256);
  const bow = (x: number, y: number, fill: string, lean: number): Node[] => [
    wash(P(x, y, x - 11, y - 7 + lean, x - 11, y + 7 + lean), fill, { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.4 }),
    wash(P(x, y, x + 11, y - 7 - lean, x + 11, y + 7 - lean), fill, { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.4 }),
    dot(x, y, 2.2, deeper(fill, 0.5)),
  ];
  return svg({ w: 160, h: 260, name: 'bears-kite' }, [
    group({ part: 'tail', origin: [80, 170] }, [
      pen(tail, { width: 2, breaks: 0.05 }),
      ...bow(71, 186, RED, 1),
      ...bow(88, 206, YELLOW, -1),
      ...bow(71, 224, RED, 1),
      ...bow(86, 242, YELLOW, -1),
    ]),
    ...quad([T, C, L], RED, YELLOW, 52, 62),
    ...quad([T, R, C], YELLOW, RED, 108, 62),
    ...quad([L, C, B], YELLOW, RED, 52, 116),
    ...quad([C, R, B], RED, YELLOW, 108, 116),
    pen([T, B], { width: 1.8, breaks: 0.1 }),
    pen([L, R], { width: 1.8, breaks: 0.1 }),
    wash(circle(80, 88, 5), '#f8efd3', { lineWidth: 1.4, shade: false, bloom: false }),
    blot(ellipse(46, 50, 3, 12, 40), '#ffffff', 0.5),
  ]);
});

const butterfly = cached(() => {
  const wing = P(38, 36, 30, 14, 14, 6, 4, 16, 6, 30, 16, 38, 10, 50, 16, 62, 30, 58, 38, 44);
  const left: Node[] = [
    wash(curve(wing, 2), '#f6e39a', { light: -130, depth: 0.3, lineWidth: 1.8, wobble: 0.6 }),
    wash(ellipse(16, 22, 6, 5, 20), '#e7a24c', { lineWidth: 1.2, bloom: false, shade: false }),
    dot(26, 50, 3, '#e7a24c', 0.9),
    pen(P(36, 36, 24, 24, 12, 18), { width: 1, opacity: 0.6 }),
    pen(P(36, 38, 22, 42, 12, 40), { width: 1, opacity: 0.6 }),
  ];
  const right: Node[] = [
    wash(curve(mirror(wing, 80), 2), '#f6e39a', { light: -50, depth: 0.3, lineWidth: 1.8, wobble: 0.6 }),
    wash(ellipse(64, 22, 6, 5, -20), '#e7a24c', { lineWidth: 1.2, bloom: false, shade: false }),
    dot(54, 50, 3, '#e7a24c', 0.9),
    pen(P(44, 36, 56, 24, 68, 18), { width: 1, opacity: 0.6 }),
    pen(P(44, 38, 58, 42, 68, 40), { width: 1, opacity: 0.6 }),
  ];
  return svg({ w: 80, h: 70, name: 'bears-butterfly' }, [
    group({ part: 'wingL', origin: [40, 38] }, left),
    group({ part: 'wingR', origin: [40, 38] }, right),
    wash(ellipse(40, 38, 3.4, 15), '#5a4636', { lineWidth: 1.4, shade: false, bloom: false }),
    wash(circle(40, 22, 3.6), '#5a4636', { lineWidth: 1.2, shade: false, bloom: false }),
    pen(P(39, 20, 33, 8, 28, 5), { width: 1.1 }),
    pen(P(41, 20, 47, 8, 52, 5), { width: 1.1 }),
  ]);
});

const blackbird = cached(() => {
  const BLK = '#3a3c48';
  return svg({ w: 110, h: 80, name: 'bears-blackbird' }, [
    // the twig, with a leaf and a side shoot
    wash(band(P(2, 70, 40, 69, 80, 66, 108, 62), 5), '#8a6840', { shade: deeper('#8a6840', 0.3), depth: 0.4, lineWidth: 1.8, bloom: false }),
    pen(P(84, 66, 94, 54, 100, 48), { width: 2.2, color: '#6f5232' }),
    wash(ellipse(100, 44, 7, 3.6, -50), '#7fa64e', { lineWidth: 1.2, bloom: false, shade: false }),
    // tail, body, wing, head
    wash(P(78, 40, 108, 54, 106, 60, 74, 52), BLK, { lineWidth: 2, depth: 0.3, bloom: false }),
    wash(ellipse(54, 40, 34, 23, 8), BLK, { light: -130, depth: 0.28, hatch: 6, lineWidth: 2.4 }),
    wash(curve(P(40, 34, 62, 30, 82, 42, 70, 54, 48, 52), 2), '#2a2b35', { lineWidth: 1.6, bloom: false, shade: false }),
    pen(P(52, 38, 66, 40, 76, 46), { width: 1.2, color: '#8b8da0', opacity: 0.6 }),
    blot(ellipse(46, 26, 12, 4, 10), '#8b8da0', 0.5),
    wash(circle(30, 25, 15), BLK, { light: -130, depth: 0.3, lineWidth: 2.2 }),
    wash(P(17, 21, 3, 26, 17, 31), '#f0a830', { lineWidth: 1.6, bloom: false, shade: false, wobble: 0.4 }),
    wash(circle(26, 21, 4.6), '#f0a830', { line: false, shade: false, bloom: false }),
    dot(26, 21, 2.4, '#14110f'),
    dot(25, 20, 0.9, '#ffffff'),
    // legs gripping the twig
    pen(P(48, 60, 47, 68), { width: 1.8, color: '#7a5a3a' }),
    pen(P(60, 60, 62, 67), { width: 1.8, color: '#7a5a3a' }),
  ]);
});

const aeroplane = cached(() => {
  const body = curve(P(24, 42, 40, 30, 110, 24, 182, 28, 212, 42, 196, 58, 110, 64, 40, 58), 3);
  const GREEN = '#5e9a64';
  return svg({ w: 220, h: 90, name: 'bears-aeroplane' }, [
    // far wing and tail fin behind the body
    wash(P(120, 40, 150, 38, 118, 66, 96, 66), paler(GREEN, 0.3), { lineWidth: 1.8, bloom: false, shade: false }),
    wash(P(22, 44, 10, 8, 28, 8, 64, 38), GREEN, { lineWidth: 2, depth: 0.3, bloom: false }),
    wash(P(26, 44, 6, 34, 10, 44, 46, 48), paler(GREEN, 0.15), { lineWidth: 1.8, bloom: false, shade: false }),
    wash(body, '#fbf8f0', { shade: '#cfd9e6', light: -100, depth: 0.3, hatch: 7, lineWidth: 2.4 }),
    clipped(body, [wash(rect(0, 44, 230, 7), GREEN, { line: false, shade: false, bloom: false, wobble: 0.6 })]),
    // cockpit and passenger windows
    wash(P(176, 32, 202, 38, 186, 42, 172, 42), '#b9d8ea', { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.3 }),
    ...[56, 76, 96, 116, 136, 156].map((x) => wash(ellipse(x, 38, 4.4, 5), '#b9d8ea', { lineWidth: 1.4, bloom: false, shade: false })),
    // near wing, with its engine
    wash(ellipse(112, 74, 16, 6), '#9fb0c0', { lineWidth: 1.6, bloom: false, depth: 0.4 }),
    wash(P(104, 54, 140, 54, 100, 84, 70, 84), GREEN, { lineWidth: 2.2, depth: 0.3, bloom: false }),
    pen(P(204, 46, 214, 46), { width: 1.4, opacity: 0.7 }),
  ]);
});

// ---------------------------------------------------------------------------
// Uncle Bill's helicopter
// ---------------------------------------------------------------------------

const helicopter = cached(() => {
  const HELI = '#f4c92e';
  const NAVY = '#2f4a7a';
  const FUR = '#c9955a';
  const body = curve(P(100, 132, 120, 84, 200, 66, 290, 82, 330, 128, 312, 192, 220, 232, 140, 214, 106, 176), 3);
  const bubble = ellipse(128, 138, 64, 60);
  const boom = curve(P(300, 118, 360, 110, 424, 100, 428, 122, 360, 152, 304, 172), 2);
  const rotor: Node[] = [
    // the blur of the spinning blades, a wide flat sweep with the blades faint inside it
    blot(ellipse(220, 48, 214, 10), '#9aa7b6', 0.55),
    blot(ellipse(220, 48, 190, 6), '#7f8b9a', 0.5),
    pen(P(24, 49, 110, 47, 220, 46, 330, 47, 416, 49), { width: 3, color: '#4b5663', breaks: 0.05 }),
    wash(ellipse(220, 47, 20, 8), NAVY, { lineWidth: 2, bloom: false, shade: false }),
  ];
  return svg({ w: 440, h: 320, name: 'bears-helicopter' }, [
    // skids under the belly, struts first
    pen(P(150, 214, 140, 262), { width: 5, color: '#4b5663' }),
    pen(P(270, 208, 280, 262), { width: 5, color: '#4b5663' }),
    pen(P(100, 270, 96, 258, 112, 262, 190, 264, 300, 264, 322, 260), { width: 6, color: '#4b5663', breaks: 0.05 }),
    // tail boom, fin and tail rotor
    wash(P(396, 104, 394, 56, 424, 52, 428, 104), HELI, { lineWidth: 2.4, depth: 0.3, bloom: false }),
    wash(boom, HELI, { light: -110, depth: 0.3, hatch: 8, lineWidth: 2.6 }),
    wash(ellipse(424, 110, 4, 22), '#9aa7b6', { lineWidth: 1.6, bloom: false, shade: false, opacity: 0.85 }),
    wash(rect(398, 56, 26, 8), NAVY, { lineWidth: 1.4, bloom: false, shade: false, wobble: 0.5 }),
    // the mast and body
    wash(rect(212, 50, 16, 24), '#55606e', { lineWidth: 2, bloom: false, shade: false, wobble: 0.5 }),
    wash(body, HELI, { light: -120, depth: 0.28, hatch: 8, lineWidth: 3 }),
    clipped(body, [wash(rect(80, 186, 280, 10), NAVY, { line: false, shade: false, bloom: false, wobble: 0.6 })]),
    // a side door and a round window
    wash(rect(206, 116, 60, 64, 8), paler(HELI, 0.3), { lineWidth: 2, bloom: false, shade: false }),
    wash(circle(236, 138, 15), '#b9d8ea', { lineWidth: 2, bloom: false, shade: false }),
    pen(P(272, 148, 270, 160), { width: 3 }),
    wash(circle(310, 150, 13), NAVY, { lineWidth: 1.8, bloom: false, shade: false }),
    // the glass bubble with Uncle Bill inside
    wash(bubble, '#d7ecf4', { shade: '#a9cfe0', light: -140, depth: 0.25, bloom: false, line: false }),
    wash(ellipse(128, 168, 46, 30), FUR, { line: false, bloom: false, depth: 0.2 }),
    wash(circle(128, 130, 33), FUR, { light: -130, depth: 0.28, fur: 6, lineWidth: 2.2 }),
    wash(circle(98, 108, 11), FUR, { lineWidth: 2, bloom: false, shade: false }),
    wash(circle(158, 108, 11), FUR, { lineWidth: 2, bloom: false, shade: false }),
    wash(ellipse(128, 144, 15, 11), paler(FUR, 0.45), { lineWidth: 1.8, bloom: false, shade: false }),
    wash(ellipse(128, 140, 5.5, 4), '#3a2a1f', { line: false, shade: false, bloom: false }),
    pen(P(128, 144, 128, 150, 120, 154), { width: 1.6 }),
    pen(P(128, 150, 136, 154), { width: 1.6 }),
    dot(114, 124, 3.4, '#1d1512'),
    dot(142, 124, 3.4, '#1d1512'),
    dot(115, 123, 1.1, '#ffffff'),
    dot(143, 123, 1.1, '#ffffff'),
    // the white sailor's cap with a navy band and a pom-pom
    wash(curve(P(94, 112, 98, 92, 128, 84, 158, 92, 162, 112, 128, 106), 2), '#fbf8f0', { light: -130, depth: 0.3, lineWidth: 2.2, bloom: false }),
    wash(curve(P(92, 112, 96, 104, 128, 100, 160, 104, 164, 112, 160, 118, 128, 114, 96, 118), 2), '#fbf8f0', { lineWidth: 2.2, bloom: false, shade: false }),
    wash(rect(100, 106, 56, 5, 2), NAVY, { line: false, shade: false, bloom: false, wobble: 0.4 }),
    dot(128, 84, 4, '#d9503f'),
    // sheen and a pen outline for the glass
    blot(ellipse(88, 106, 7, 22, 25), '#ffffff', 0.7),
    blot(ellipse(170, 168, 9, 18, 60), '#ffffff', 0.35),
    pen(ellipse(128, 138, 64, 60).concat([ellipse(128, 138, 64, 60)[0]]), { width: 2.6, breaks: 0.4 }),
    group({ part: 'rotor', origin: [220, 48] }, rotor),
    // the rope hangs from the belly to the bottom of the picture; Teddy hangs at (215, 316)
    group({ part: 'rope', opacity: 0 }, [
      wash(band(P(215, 230, 218, 260, 213, 290, 216, 318), 7), '#c9a86a', { shade: deeper('#c9a86a', 0.3), depth: 0.4, lineWidth: 1.8, bloom: false, wobble: 0.5 }),
      pen(P(212, 244, 220, 249), { width: 1.2, opacity: 0.7 }),
      pen(P(210, 262, 219, 267), { width: 1.2, opacity: 0.7 }),
      pen(P(210, 280, 219, 285), { width: 1.2, opacity: 0.7 }),
      pen(P(212, 298, 220, 303), { width: 1.2, opacity: 0.7 }),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// Mud, picnic, pond, treasure
// ---------------------------------------------------------------------------

const splash = cached(() => {
  const MUD = '#8a6038';
  const r = rng(77);
  // a crown of splash: spiky lobes up from a flat base
  const pts: Pt[] = [[14, 126]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    const spike = i % 2 === 1;
    const k = spike ? 0.92 + r() * 0.1 : 0.5 + r() * 0.08;
    pts.push([120 + Math.cos(a) * 104 * (spike ? k * 0.9 : k + 0.1), 118 + Math.sin(a) * 100 * k]);
  }
  pts.push([226, 126], [120, 134]);
  const drops: [number, number, number][] = [
    [18, 52, 8], [40, 22, 6], [76, 10, 7], [168, 8, 6], [204, 28, 9], [226, 62, 6], [12, 86, 5], [232, 94, 5], [118, 6, 5],
  ];
  return svg({ w: 240, h: 140, name: 'bears-splash' }, [
    wash(curve(pts, 1), MUD, { light: -110, depth: 0.3, hatch: 7, lineWidth: 2.6, wobble: 1.5 }),
    wash(ellipse(120, 124, 80, 9), deeper(MUD, 0.3), { line: false, shade: false, bloom: false }),
    blot(ellipse(88, 70, 10, 28, 20), paler(MUD, 0.5), 0.7),
    blot(ellipse(158, 66, 8, 22, -20), paler(MUD, 0.5), 0.6),
    ...drops.map(([x, y, rad]) => wash(ellipse(x, y, rad, rad * 1.15), MUD, { lineWidth: 1.8, depth: 0.4, bloom: false, wobble: 0.5 })),
    ...drops.slice(0, 5).map(([x, y]) => dot(x - 2, y - 2, 1.6, '#e4c9a3', 0.8)),
    pen(P(52, 100, 60, 106), { width: 1.4, color: deeper(MUD, 0.5) }),
    pen(P(170, 96, 178, 102), { width: 1.4, color: deeper(MUD, 0.5) }),
  ]);
});

const picnicBasket = cached(() => {
  const WICKER = '#c89a58';
  const body = curve(P(18, 62, 142, 62, 134, 122, 26, 122), 1);
  const check: Node[] = [];
  for (let i = 0; i < 9; i++) {
    check.push(wash(rect(10 + i * 18, 20, 9, 60), RED, { line: false, shade: false, bloom: false, wobble: 0.3, opacity: 0.55 }));
  }
  for (let j = 0; j < 5; j++) {
    check.push(wash(rect(10, 26 + j * 12, 140, 6), RED, { line: false, shade: false, bloom: false, wobble: 0.3, opacity: 0.55 }));
  }
  const cloth = curve(P(24, 66, 22, 44, 44, 30, 80, 28, 118, 32, 140, 46, 138, 66), 2);
  const weave: Node[] = [];
  for (let y = 78; y < 122; y += 9) weave.push(pen(P(14, y, 80, y + 3, 146, y), { width: 1.3, color: deeper(WICKER, 0.5), opacity: 0.6, breaks: 0 }));
  for (let x = 34; x < 140; x += 14) weave.push(pen(P(x, 66, x - 3, 94, x + 1, 122), { width: 1.2, color: deeper(WICKER, 0.5), opacity: 0.5, breaks: 0 }));
  return svg({ w: 160, h: 130, name: 'bears-picnic-basket' }, [
    // handle arch behind the cloth
    wash(band(P(30, 66, 36, 26, 80, 8, 124, 26, 130, 66), 7), deeper(WICKER, 0.15), { shade: deeper(WICKER, 0.4), depth: 0.4, lineWidth: 1.8, bloom: false }),
    clipped(cloth, [wash(cloth, '#fbf8f0', { shade: '#d9d4c8', light: -100, depth: 0.25, line: false, bloom: false }), ...check]),
    pen([...cloth, cloth[0]], { width: 2.2, closed: true }),
    wash(body, WICKER, { shade: deeper(WICKER, 0.3), light: -150, depth: 0.3, lineWidth: 2.6 }),
    clipped(body, weave),
    wash(rect(12, 60, 136, 16, 6), deeper(WICKER, 0.18), { shade: deeper(WICKER, 0.4), depth: 0.4, lineWidth: 2.4, bloom: false }),
    pen(P(24, 68, 60, 70, 100, 68, 138, 70), { width: 1.2, color: deeper(WICKER, 0.6), opacity: 0.6 }),
    blot(ellipse(40, 98, 6, 18), '#ffffff', 0.25),
  ]);
});

const cakePlate = cached(() => {
  const BUN = '#d9a25c';
  const ICING = '#f2a6b8';
  const bun = (x: number, by: number): Node[] => {
    const dome = curve(P(x - 23, by, x - 25, by - 14, x - 14, by - 28, x, by - 32, x + 14, by - 28, x + 25, by - 14, x + 23, by), 3);
    const icing = curve(P(x - 24, by - 14, x - 14, by - 28, x, by - 32, x + 14, by - 28, x + 24, by - 14, x + 17, by - 9, x + 9, by - 16, x, by - 9, x - 9, by - 16, x - 17, by - 9), 2);
    return [
      wash(dome, BUN, { light: -130, depth: 0.3, hatch: 6, lineWidth: 2.2 }),
      wash(icing, ICING, { light: -130, depth: 0.28, lineWidth: 1.8, bloom: false, wobble: 0.6 }),
      wash(circle(x, by - 35, 6.5), '#c9262f', { lineWidth: 1.8, depth: 0.4 }),
      dot(x - 2, by - 37, 1.6, '#ffffff', 0.9),
      pen(P(x + 1, by - 41, x + 5, by - 48), { width: 1.4 }),
    ];
  };
  return svg({ w: 160, h: 90, name: 'bears-cake-plate' }, [
    wash(ellipse(80, 72, 76, 15), '#fbf8f0', { shade: '#cfd9e6', light: -100, depth: 0.3, lineWidth: 2.4 }),
    wash(ellipse(80, 70, 62, 10), '#f4f1e8', { line: false, shade: false, bloom: false }),
    clipped(ellipse(80, 72, 76, 15), [wash(rect(0, 80, 160, 3), BLUE, { line: false, shade: false, bloom: false, wobble: 0.4 })]),
    ...bun(38, 68),
    ...bun(122, 68),
    ...bun(80, 62),
    pen(P(20, 74, 40, 80, 80, 84, 120, 80), { width: 1.2, color: '#7f95ad', opacity: 0.5 }),
  ]);
});

const duck = cached(() => {
  const ORANGE = '#f0932a';
  const bodyPts = curve(P(10, 48, 24, 44, 66, 38, 92, 44, 98, 58, 84, 76, 50, 80, 22, 72), 3);
  const neck = curve(P(74, 46, 76, 24, 84, 10, 104, 12, 106, 28, 98, 44, 92, 52), 2);
  return svg({ w: 120, h: 100, name: 'bears-duck' }, [
    // tail up at the back, body and head
    wash(P(16, 56, 6, 38, 30, 48), '#fbf8f0', { lineWidth: 2, bloom: false, depth: 0.4 }),
    wash(bodyPts, '#fbf8f0', { shade: '#cfd9e6', light: -110, depth: 0.3, hatch: 6, lineWidth: 2.4 }),
    wash(neck, '#fbf8f0', { shade: '#cfd9e6', light: -120, depth: 0.28, lineWidth: 2.4 }),
    wash(curve(P(36, 56, 56, 50, 78, 54, 74, 66, 52, 70), 2), '#e8eef4', { lineWidth: 1.6, bloom: false, depth: 0.4, shade: '#c3d0de' }),
    pen(P(44, 60, 60, 60, 70, 62), { width: 1.2, opacity: 0.6 }),
    wash(P(104, 20, 118, 26, 104, 32), ORANGE, { lineWidth: 1.8, depth: 0.4, bloom: false, wobble: 0.4 }),
    dot(98, 20, 2.8, '#1d1512'),
    dot(97, 19, 0.9, '#ffffff'),
    blot(ellipse(94, 28, 5, 3), '#f4a8a0', 0.6),
    // the water, in front of the bottom of the duck
    blot(ellipse(60, 82, 60, 12), '#a9c8e6', 0.7),
    blot(ellipse(60, 84, 44, 8), '#7fa9c9', 0.45),
    pen(P(2, 80, 14, 76, 28, 80, 40, 76), { width: 1.8, color: '#5f88b0', breaks: 0.2 }),
    pen(P(76, 78, 90, 82, 104, 78, 118, 82), { width: 1.8, color: '#5f88b0', breaks: 0.2 }),
    pen(P(22, 92, 40, 88, 58, 92, 76, 88, 94, 92), { width: 1.6, color: '#7fa9c9', opacity: 0.9, breaks: 0.2 }),
  ]);
});

const treasureChest = cached(() => {
  const BOX = '#9a6a3a';
  const BRASS = '#d6aa43';
  const box = rect(14, 58, 132, 64, 6);
  const lid = curve(P(12, 62, 12, 42, 28, 24, 80, 16, 132, 24, 148, 42, 148, 62), 2);
  const coin = (x: number, y: number, rad: number): Node[] => [
    wash(ellipse(x, y, rad, rad * 0.8, -15), '#f3c842', { lineWidth: 1.4, depth: 0.4, bloom: false, shade: deeper('#f3c842', 0.3), wobble: 0.5 }),
    pen(P(x - rad * 0.4, y - 1, x + rad * 0.3, y - 1), { width: 0.9, color: deeper('#f3c842', 0.5), opacity: 0.7 }),
  ];
  const glint = (x: number, y: number, s: number): Node =>
    pen(P(x - s, y, x, y, x + s, y), { width: 1.6, color: '#ffffff', taper: false }) as Node;
  return svg({ w: 160, h: 130, name: 'bears-treasure-chest' }, [
    wash(P(16, 60, 144, 60, 138, 48, 22, 48), '#3d2a1c', { line: false, shade: false, bloom: false, wobble: 0.5 }),
    group({ part: 'gold', opacity: 0 }, [
      wash(curve(P(24, 62, 28, 44, 56, 34, 80, 32, 108, 34, 132, 44, 136, 62), 2), '#e8b936', { lineWidth: 1.8, shade: deeper('#e8b936', 0.3), depth: 0.3, bloom: false }),
      ...[[40, 50, 9], [58, 42, 9], [78, 38, 10], [98, 42, 9], [118, 50, 9], [66, 54, 9], [92, 55, 9], [48, 58, 8], [112, 59, 8]].flatMap(([x, y, rad]) => coin(x, y, rad)),
      wash(circle(70, 33, 5), '#d9503f', { lineWidth: 1.2, bloom: false, shade: false }),
      wash(circle(104, 34, 5), '#6f9bc9', { lineWidth: 1.2, bloom: false, shade: false }),
      glint(58, 36, 6),
      glint(100, 30, 5),
      glint(126, 44, 4),
    ]),
    wash(box, BOX, { shade: deeper(BOX, 0.3), light: -130, depth: 0.28, hatch: 6, lineWidth: 2.8 }),
    pen(P(16, 84, 80, 86, 144, 84), { width: 1.4, color: deeper(BOX, 0.6), opacity: 0.6 }),
    pen(P(16, 104, 80, 106, 144, 104), { width: 1.4, color: deeper(BOX, 0.6), opacity: 0.6 }),
    wash(rect(34, 58, 12, 64), BRASS, { lineWidth: 1.8, bloom: false, shade: deeper(BRASS, 0.3), depth: 0.4, wobble: 0.5 }),
    wash(rect(114, 58, 12, 64), BRASS, { lineWidth: 1.8, bloom: false, shade: deeper(BRASS, 0.3), depth: 0.4, wobble: 0.5 }),
    ...[[40, 66], [40, 114], [120, 66], [120, 114]].map(([x, y]) => dot(x, y, 2, deeper(BRASS, 0.6))),
    group({ part: 'lid', origin: [80, 60] }, [
      wash(lid, BOX, { shade: deeper(BOX, 0.3), light: -130, depth: 0.3, hatch: 6, lineWidth: 2.8 }),
      wash(P(12, 54, 148, 54, 148, 64, 12, 64), deeper(BRASS, 0.1), { lineWidth: 2, bloom: false, shade: false, wobble: 0.5 }),
      clipped(lid, [
        wash(rect(34, 0, 12, 70), BRASS, { lineWidth: 1.8, bloom: false, shade: deeper(BRASS, 0.3), depth: 0.4, wobble: 0.5 }),
        wash(rect(114, 0, 12, 70), BRASS, { lineWidth: 1.8, bloom: false, shade: deeper(BRASS, 0.3), depth: 0.4, wobble: 0.5 }),
      ]),
      wash(rect(70, 48, 20, 22, 4), BRASS, { lineWidth: 2, bloom: false, shade: deeper(BRASS, 0.3), depth: 0.4 }),
      dot(80, 56, 2.6, '#3d2a1c'),
      pen(P(80, 57, 80, 63), { width: 1.6, color: '#3d2a1c' }),
      blot(ellipse(52, 34, 12, 4, -10), '#e6c08a', 0.5),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// The dream cloud
// ---------------------------------------------------------------------------

const thoughtCloud = cached(() => {
  const r = rng(49);
  const n = 15;
  const bumps: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    bumps.push([262 + Math.cos(a) * 194, 165 + Math.sin(a) * 100, 48 + r() * 10]);
  }
  const GREYBLUE = '#c9d7e6';
  // a crescent of shade hugging the cloud's flat belly
  const belly: Pt[] = [];
  for (let a = 18; a <= 162; a += 9) belly.push([260 + Math.cos((a * Math.PI) / 180) * 236, 165 + Math.sin((a * Math.PI) / 180) * 134]);
  for (let a = 162; a >= 18; a -= 9) belly.push([260 + Math.cos((a * Math.PI) / 180) * 214, 165 + Math.sin((a * Math.PI) / 180) * 112]);
  return svg({ w: 520, h: 360, name: 'bears-thought-cloud' }, [
    ...bumps.map(([x, y, rad]) => wash(ellipse(x, y, rad, rad * 0.92), '#ffffff', { shade: GREYBLUE, light: -90, depth: 0.3, lineWidth: 2.6, wobble: 0.9, bloom: false })),
    wash(ellipse(260, 165, 215, 112), '#ffffff', { shade: GREYBLUE, light: -90, depth: 0.14, line: false, wobble: 0.6, bloom: false }),
    // paint out the lines inside, leaving only the outer scallops inked
    ...bumps.map(([x, y, rad]) => blot(ellipse(x, y + rad * 0.1, rad * 0.88, rad * 0.8), '#ffffff', 1)),
    // plain white room to put people in
    blot(ellipse(260, 160, 212, 108), '#ffffff', 1),
    blot(ellipse(260, 160, 200, 100), '#ffffff', 1),
    hatch(belly, { gap: 7, angle: 70, color: '#7f95ad' }),
    // the little puffs trailing off
    wash(circle(72, 316, 20), '#ffffff', { shade: GREYBLUE, light: -90, depth: 0.3, lineWidth: 2.4, bloom: false }),
    wash(circle(30, 346, 12), '#ffffff', { shade: GREYBLUE, light: -90, depth: 0.3, lineWidth: 2.2, bloom: false }),
    hatch(ellipse(72, 324, 16, 8), { gap: 5, angle: 0, color: '#7f95ad' }),
  ]);
});

export const homeProps: Record<string, () => string> = {
  'porridge-bowl': porridgeBowl,
  saucepan,
  'wooden-spoon': woodenSpoon,
  'honey-pot': honeyPot,
  ladybird,
  kite,
  butterfly,
  blackbird,
  aeroplane,
  helicopter,
  splash,
  'picnic-basket': picnicBasket,
  'cake-plate': cakePlate,
  duck,
  'treasure-chest': treasureChest,
  'thought-cloud': thoughtCloud,
};

