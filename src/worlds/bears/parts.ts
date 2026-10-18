/**
 * The bears' puppet: one body every bear is built from, in watercolour and
 * ink (src/art/watercolour.ts).
 *
 * A bear is a whole small teddy in the 300 × 340 portrait (a big round head,
 * a stubby body, short legs, paws), standing with its feet on the bottom
 * edge, so stand them with their bottom edge on the backdrop's ground line.
 * The face sits in the chip box 78 62 144 144 like every portrait.
 *
 * The book's bears are recognised by their big shiny black noses, a pale
 * muzzle, dot eyes and round ears; each one by their clothes. All of that is
 * here; a character file only chooses colours and clothes.
 *
 * Parts, on every bear:
 *
 *   figure     everything (bob, lean, shake)
 *   head       the head and all it carries; pivots at the neck (nod, tilt)
 *   eyes       the open eyes;  lids  hidden blink lids
 *   brows      the eyebrows (raise in surprise: nudge y)
 *   mouth      the resting mouth;  mouthOpen  the hidden talking mouth
 *   armL armR  arms on the viewer's left and right, pivoting at the shoulder
 *   legL legR  legs, pivoting at the hip (a little kick, a march)
 *   hat        only if the bear wears one
 */
import { circle, curve, dot, ellipse, group, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, INK, paler, pen, wash } from '../../art/watercolour';

export const W = 300;
export const H = 340;
/** The middle of the face (and of the chip box). */
export const HEAD: Pt = [150, 128];
const [hx, hy] = HEAD;

/** The bears' fur colours, light to dark. */
export const FUR = {
  honey: '#d4a466',
  golden: '#c99555',
  toffee: '#b98048',
  cocoa: '#9c6a3e',
} as const;

/** The nose: nearly black, with a shine. */
const NOSE = '#2a1d17';

export type Arms = 'down' | 'out' | 'up' | 'wave' | 'hips' | 'hold' | 'face';
export type Legs = 'stand' | 'sit' | 'walk' | 'hidden';
export type Eyes = 'dot' | 'happy' | 'shut' | 'wide';
export type Brows = 'kind' | 'cross' | 'worried' | 'raised' | 'none';
export type Mouth = 'smile' | 'grin' | 'o' | 'flat' | 'frown' | 'smirk';

export interface BearOpts {
  /** Seeds the drawing, and the portrait's label. */
  name: string;
  label: string;
  fur: string;
  /** The colour of the sleeves (the top's colour), or the fur for bare arms. */
  sleeve: string;
  /** Clothes over the torso (from `top`, `dress` …), drawn after the body. */
  clothes: Node[];
  /** Over the sleeve near the paw (a cuff), optional. */
  cuff?: string;
  arms?: Arms;
  legs?: Legs;
  eyes?: Eyes;
  brows?: Brows;
  mouth?: Mouth;
  /** Head tilt in degrees. */
  tilt?: number;
  /** Bigger snout for grown-ups (1 = a cub's). */
  snout?: number;
  /** Behind everything (a cape, a kite string). */
  back?: Node[];
  /** In a `hat` part on top of the head. */
  hat?: Node[];
  /** On the head over the face (glasses, a bow, a curl). */
  onFace?: Node[];
  /** In front of everything (a held bucket, a letter). */
  extra?: Node[];
  /** Held in the right arm's paw, moving with the arm. */
  holdR?: Node[];
  holdL?: Node[];
}

// ---------------------------------------------------------------- the body

/** The torso outline: shoulders to hips, the shape clothes are cut to. */
export const TORSO: Pt[] = curve(
  [
    [104, 188], [150, 182], [196, 188], [222, 222], [232, 270], [222, 306], [150, 316], [78, 306], [68, 270], [78, 222],
  ],
  2,
);

/** A skirt from the waist to the feet, for dresses (it hides the legs). */
export const SKIRT: Pt[] = curve([[90, 246], [150, 240], [210, 246], [236, 300], [250, 338], [150, 342], [50, 338], [64, 300]], 2);

/** A jumper or top over the torso, with optional stripes and a collar. */
export function top(color: string, o: { stripes?: { color: string; at: number[]; width?: number }; collar?: string } = {}): Node[] {
  const out: Node[] = [wash(TORSO, color, { depth: 0.22 })];
  if (o.stripes) {
    const w = o.stripes.width ?? 18;
    out.push(clipped(TORSO, o.stripes.at.map((y) => wash([[40, y - w / 2], [260, y - w / 2 - 4], [260, y + w / 2 - 4], [40, y + w / 2]], o.stripes!.color, { line: false, depth: 0.5, wobble: 1.6 }))));
    out.push(pen(TORSO, { closed: true, width: 2.2, breaks: 0.6 }));
  }
  if (o.collar) out.push(...collar(o.collar));
  return out;
}

/** A round white collar at the neck, two little flaps. */
export function collar(color: string): Node[] {
  return [
    wash(curve([[112, 186], [148, 192], [146, 214], [118, 210]], 2), color, { lineWidth: 2, bloom: false, depth: 0.2 }),
    wash(curve([[188, 186], [152, 192], [154, 214], [182, 210]], 2), color, { lineWidth: 2, bloom: false, depth: 0.2 }),
  ];
}

/** A long dress (bodice and skirt), with optional spots. */
export function dress(color: string, o: { spots?: string; bodice?: string } = {}): Node[] {
  const out: Node[] = [wash(TORSO, o.bodice ?? color, { depth: 0.22 }), wash(SKIRT, color, { depth: 0.24 })];
  if (o.spots) {
    const spots: Node[] = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 46 + col * 30 + (row % 2) * 15;
        const y = 254 + row * 16;
        spots.push(dot(x, y, 5.2, o.spots, 0.95));
      }
    }
    out.push(clipped(SKIRT, spots));
    if (!o.bodice) out.push(clipped(TORSO, [0, 1, 2, 3, 4].flatMap((row) => [0, 1, 2, 3, 4, 5, 6].map((col) => dot(78 + col * 26 + (row % 2) * 13, 196 + row * 18, 5, o.spots!, 0.95)))));
    out.push(pen(SKIRT, { closed: true, width: 2.2, breaks: 0.6 }));
  }
  return out;
}

/** A white apron tied over a dress. */
export function apron(color = '#f6f1e6'): Node[] {
  return [
    wash(curve([[104, 248], [196, 248], [214, 330], [150, 338], [86, 330]], 2), color, { depth: 0.18 }),
    wash(curve([[122, 196], [178, 196], [182, 250], [118, 250]], 1), color, { depth: 0.18, bloom: false }),
    pen([[86, 250], [214, 250]], { width: 2.6 }),
  ];
}

/** A waistcoat over a shirt: the shirt shows in a V down the front, with buttons. */
export function waistcoat(color: string, shirt: string): Node[] {
  return [
    wash(TORSO, shirt, { depth: 0.2 }),
    wash(curve([[104, 188], [140, 192], [146, 316], [78, 306], [68, 270], [78, 222]], 2), color, { depth: 0.22 }),
    wash(curve([[196, 188], [160, 192], [154, 316], [222, 306], [232, 270], [222, 222]], 2), color, { depth: 0.22 }),
    ...[244, 270, 296].map((y) => dot(140, y, 3.6, '#8a6a3a')),
  ];
}

/** A bow tie at the collar. */
export function bowTie(color: string, spots = '#f6f1e6'): Node[] {
  const l = curve([[150, 200], [120, 186], [116, 214]], 1);
  const r = curve([[150, 200], [180, 186], [184, 214]], 1);
  return [
    wash(l, color, { lineWidth: 2, bloom: false }),
    wash(r, color, { lineWidth: 2, bloom: false }),
    ...[[126, 196], [124, 206], [174, 196], [176, 206]].map(([x, y]) => dot(x, y, 2.6, spots)),
    wash(ellipse(150, 200, 8, 9), deeper(color, 0.15), { lineWidth: 2, bloom: false, shade: false }),
  ];
}

// ---------------------------------------------------------------- the face

function face(o: BearOpts): Node[] {
  const s = o.snout ?? 1;
  const out: Node[] = [];
  // cheeks
  out.push(blot(ellipse(hx - 46, hy + 26, 13, 9), '#e59a8a', 0.55), blot(ellipse(hx + 46, hy + 26, 13, 9), '#e59a8a', 0.55));
  // muzzle
  out.push(wash(ellipse(hx, hy + 32 * s, 40 * s, 30 * s), paler(o.fur, 0.5), { line: INK, lineWidth: 1.6, depth: 0.2, light: -110 }));
  // eyes
  const ex = 30;
  const ey = hy - 10;
  const eye = (x: number): Node[] => {
    switch (o.eyes ?? 'dot') {
      case 'happy':
        return [pen([[x - 9, ey + 3], [x, ey - 5], [x + 9, ey + 3]], { width: 3.2 })];
      case 'shut':
        return [pen([[x - 9, ey - 1], [x, ey + 5], [x + 9, ey - 1]], { width: 3.2 })];
      case 'wide':
        return [wash(ellipse(x, ey, 9, 11), '#f9f6ee', { lineWidth: 1.8, shade: false, bloom: false }), dot(x, ey + 1, 6, NOSE), dot(x - 2, ey - 2, 2, '#ffffff')];
      default:
        return [dot(x, ey, 7, NOSE), dot(x - 2.4, ey - 2.6, 2.4, '#ffffff')];
    }
  };
  out.push(group({ part: 'eyes', origin: [hx, ey] }, [...eye(hx - ex), ...eye(hx + ex)]));
  if ((o.eyes ?? 'dot') === 'dot' || o.eyes === 'wide') {
    const lid = (x: number): Node[] => [wash(ellipse(x, ey, 12, 12), o.fur, { line: false, shade: false, bloom: false, wobble: 0 }), pen([[x - 9, ey], [x, ey + 5], [x + 9, ey]], { width: 2.6 })];
    out.push(group({ part: 'lids', opacity: 0 }, [...lid(hx - ex), ...lid(hx + ex)]));
  }
  // brows
  const by = ey - 18;
  const brow = (pts: Pt[]): Node =>
    group({ part: 'brows', origin: [hx, by] }, [
      pen(pts.map(([x, y]) => [hx - ex + x, by + y] as Pt), { width: 2.6 }),
      pen(pts.map(([x, y]) => [hx + ex - x, by + y] as Pt).reverse(), { width: 2.6 }),
    ]);
  switch (o.brows ?? 'kind') {
    case 'cross':
      out.push(brow([[-11, -6], [0, -1], [12, 5]]));
      break;
    case 'worried':
      out.push(brow([[-11, 4], [0, -2], [10, -7]]));
      break;
    case 'raised':
      out.push(brow([[-10, 0], [0, -7], [10, -2]]));
      break;
    case 'none':
      break;
    default:
      out.push(brow([[-10, 1], [0, -3], [10, -1]]));
  }
  // nose
  const ny = hy + 16 * s;
  out.push(wash(curve([[hx - 19 * s, ny - 6], [hx, ny - 12], [hx + 19 * s, ny - 6], [hx + 12 * s, ny + 8], [hx, ny + 11], [hx - 12 * s, ny + 8]], 2), NOSE, { shade: false, bloom: false, lineWidth: 1.6, wobble: 0.6 }));
  out.push(blot(ellipse(hx - 6 * s, ny - 5, 7 * s, 3.6), '#ffffff', 0.9));
  // mouth: a line down from the nose, then the mouth itself
  const my = ny + 22 * s;
  out.push(pen([[hx, ny + 10], [hx, my - 4]], { width: 2.2 }));
  const shape = (style: Mouth): Node[] => {
    switch (style) {
      case 'grin':
        return [wash(curve([[hx - 18, my - 4], [hx + 18, my - 4], [hx + 8, my + 9], [hx - 8, my + 9]], 2), '#8a3a2c', { lineWidth: 2, shade: false, bloom: false }), blot(ellipse(hx, my + 4, 7, 3), '#d9786a', 0.9)];
      case 'o':
        return [wash(ellipse(hx, my + 3, 7, 8), '#7a3328', { lineWidth: 2, shade: false, bloom: false })];
      case 'flat':
        return [pen([[hx - 11, my], [hx + 11, my]], { width: 2.6 })];
      case 'frown':
        return [pen([[hx - 13, my + 5], [hx, my - 1], [hx + 13, my + 5]], { width: 2.6 })];
      case 'smirk':
        return [pen([[hx - 14, my + 1], [hx + 2, my + 3], [hx + 15, my - 6]], { width: 2.8 })];
      default:
        return [pen([[hx - 15, my - 3], [hx - 7, my + 4], [hx, my - 1], [hx + 7, my + 4], [hx + 15, my - 3]], { width: 2.6 })];
    }
  };
  out.push(group({ part: 'mouth', origin: [hx, my] }, shape(o.mouth ?? 'smile')));
  out.push(
    group({ part: 'mouthOpen', origin: [hx, my], opacity: 0 }, [
      wash(curve([[hx - 13, my - 3], [hx + 13, my - 3], [hx + 8, my + 12], [hx - 8, my + 12]], 2), '#7a3328', { lineWidth: 2, shade: false, bloom: false }),
      blot(ellipse(hx, my + 7, 7, 3.2), '#d9786a', 0.95),
    ]),
  );
  return out;
}

// ---------------------------------------------------------------- limbs

const ARM_TO: Record<Arms, [Pt, Pt]> = {
  down: [[62, 292], [238, 292]],
  out: [[22, 200], [278, 200]],
  up: [[44, 120], [256, 120]],
  wave: [[62, 292], [258, 118]],
  hips: [[74, 270], [226, 270]],
  hold: [[118, 262], [182, 262]],
  face: [[116, 168], [184, 168]],
};

function arm(part: 'armL' | 'armR', from: Pt, to: Pt, o: BearOpts, hold?: Node[]): Node {
  const via: Pt = [(from[0] + to[0]) / 2 + (part === 'armL' ? -6 : 6), (from[1] + to[1]) / 2];
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const k = 1 - 22 / len;
  const wrist: Pt = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
  const sleeve = bandOutline([from, via, wrist], 38);
  const kids: Node[] = [wash(sleeve, o.sleeve, { depth: 0.25, lineWidth: 2.2 })];
  if (o.cuff) kids.push(wash(bandOutline([[wrist[0] - (to[0] - from[0]) * 0.08, wrist[1] - (to[1] - from[1]) * 0.08], wrist], 38), o.cuff, { lineWidth: 2, bloom: false }));
  kids.push(...(hold ?? []));
  kids.push(wash(circle(to[0], to[1], 19), o.fur, { fur: 5, lineWidth: 2.2, depth: 0.25 }));
  return group({ part, origin: from }, kids);
}

/** A thick smooth band along points (an arm, a leg), as a closed outline. */
export function bandOutline(points: Pt[], width: number): Pt[] {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(points.length - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    left.push([points[i][0] - (dy * width) / 2, points[i][1] + (dx * width) / 2]);
    right.push([points[i][0] + (dy * width) / 2, points[i][1] - (dx * width) / 2]);
  }
  return curve([...left, ...right.reverse()], 2);
}

function legs(o: BearOpts): Node[] {
  const pad = deeper(o.fur, 0.35);
  switch (o.legs ?? 'stand') {
    case 'hidden':
      return [];
    case 'sit':
      // Sitting: legs stuck out towards us, soles showing (the book's bump in the puddle).
      return [
        group({ part: 'legL', origin: [116, 300] }, [wash(ellipse(98, 312, 40, 26, -12), o.fur, { fur: 5 }), wash(ellipse(76, 316, 17, 21, -12), pad, { lineWidth: 2 })]),
        group({ part: 'legR', origin: [184, 300] }, [wash(ellipse(202, 312, 40, 26, 12), o.fur, { fur: 5 }), wash(ellipse(224, 316, 17, 21, 12), pad, { lineWidth: 2 })]),
      ];
    case 'walk':
      return [
        group({ part: 'legL', origin: [118, 292] }, [wash(curve([[94, 288], [138, 288], [136, 336], [92, 338]], 2), o.fur, { fur: 5 }), wash(ellipse(114, 334, 26, 7), pad, { lineWidth: 2, bloom: false })]),
        group({ part: 'legR', origin: [182, 292], transform: 'rotate(-18)' }, [wash(curve([[162, 288], [206, 288], [208, 334], [164, 332]], 2), o.fur, { fur: 5 }), wash(ellipse(186, 330, 26, 7), pad, { lineWidth: 2, bloom: false })]),
      ];
    default:
      return [
        group({ part: 'legL', origin: [118, 292] }, [wash(curve([[92, 286], [140, 286], [138, 336], [90, 338]], 2), o.fur, { fur: 5 }), wash(ellipse(114, 334, 27, 7), pad, { lineWidth: 2, bloom: false })]),
        group({ part: 'legR', origin: [182, 292] }, [wash(curve([[160, 286], [208, 286], [210, 338], [162, 336]], 2), o.fur, { fur: 5 }), wash(ellipse(186, 334, 27, 7), pad, { lineWidth: 2, bloom: false })]),
      ];
  }
}

// ---------------------------------------------------------------- the bear

/** A whole bear, as a 300 × 340 portrait SVG. */
export function bear(o: BearOpts): string {
  const arms = o.arms ?? 'down';
  const [toL, toR] = ARM_TO[arms];
  const shL: Pt = [100, 214];
  const shR: Pt = [200, 214];
  const earL: Pt = [hx - 62, hy - 56];
  const earR: Pt = [hx + 62, hy - 56];
  const armNodes = [arm('armL', shL, toL, o, o.holdL), arm('armR', shR, toR, o, o.holdR)];
  return svg({ w: W, h: H, name: o.name, label: o.label, className: 'portrait' }, [
    group({ part: 'figure', origin: [150, 340] }, [
      ...(o.back ?? []),
      // a soft shadow on the ground
      blot(ellipse(150, 336, 104, 9), '#6b4a30', 0.22),
      ...legs(o),
      wash(TORSO, o.fur, { fur: 6 }),
      ...o.clothes,
      ...(arms === 'wave' ? [armNodes[0]] : []),
      group({ part: 'head', origin: [hx, hy + 66], transform: o.tilt ? `rotate(${o.tilt})` : undefined }, [
        wash(circle(earL[0], earL[1], 30), o.fur, { fur: 6 }),
        wash(circle(earR[0], earR[1], 30), o.fur, { fur: 6 }),
        wash(circle(earL[0] + 3, earL[1] + 4, 15), deeper(o.fur, 0.3), { line: false, bloom: false }),
        wash(circle(earR[0] - 3, earR[1] + 4, 15), deeper(o.fur, 0.3), { line: false, bloom: false }),
        wash(curve([[hx - 82, hy - 4], [hx - 70, hy - 54], [hx, hy - 72], [hx + 70, hy - 54], [hx + 82, hy - 4], [hx + 70, hy + 50], [hx, hy + 70], [hx - 70, hy + 50]], 2), o.fur, { fur: 8, depth: 0.22 }),
        ...face(o),
        ...(o.onFace ?? []),
        ...(o.hat ? [group({ part: 'hat', origin: [hx, hy - 70] }, o.hat)] : []),
      ]),
      ...(arms === 'wave' ? [armNodes[1]] : armNodes),
      ...(o.extra ?? []),
    ]),
  ]);
}
