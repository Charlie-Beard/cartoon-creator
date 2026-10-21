/**
 * The four people of "The Doll's House": the Toymaker, Matron, and two of the
 * hospital children, Tom and Daisy. Same watercolour and ink as Goldilocks,
 * Lavinia and Great Aunt Edie (treasuryPeople.ts), and built the same way: a
 * 300 × 340 portrait, the face in the chip box 78 62 144 144, and the same
 * parts (figure, head, eyes, lids, mouth, mouthOpen, armL, armR, hair), so
 * they talk, blink and swing their arms like her.
 *
 * treasuryPeople.ts keeps its helpers to itself, so the small ones here
 * (curls, scallops, an arm, legs, the face) are copies of its, with a few
 * extras: an arm can have a short or rolled sleeve with a bare forearm, and a
 * face can take its own brows. One builder (`person`) lays every portrait out:
 * legs and body, arms that go behind the head, the head, then arms in front
 * (a raised hand, a hand on a cheek), so a pose only changes the arms and the
 * face.
 *
 * Humans are big here and the bears are toys to them: stand them w 280–340.
 * Hands (the arm's `to`) in portrait coordinates are noted at each pose.
 */
import { circle, curve, dot, ellipse, group, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';
import { bandOutline } from './parts';

const WHITE = '#f6f1e6';
const INK_BROWN = '#2a1d17';
const BLACK = '#2c2a30';
const RED = '#d0382f';
const C = { cx: 150, cy: 126 };
const MY = C.cy + 40;

// ---------------------------------------------------------------- shared bits

function curl(x: number, y: number, r: number, hair: string, swirl: string, tone = 0): Node[] {
  return [
    wash(ellipse(x, y, r, r * 0.95), tone ? deeper(hair, tone) : hair, { depth: 0.3, lineWidth: 1.8, wobble: 1.6 }),
    pen([[x - r * 0.45, y + r * 0.2], [x - r * 0.1, y - r * 0.45], [x + r * 0.45, y - r * 0.1], [x + r * 0.1, y + r * 0.35]], { width: 1.4, color: swirl, opacity: 0.8, breaks: 0 }),
  ];
}

function scallops(from: Pt, to: Pt, n: number, r: number, color: string): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    out.push(wash(circle(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, r), color, { lineWidth: 1.5, bloom: false, depth: 0.15 }));
  }
  return out;
}

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Vertical stripes (pyjamas) clipped to a shape. */
function stripes(outline: Pt[], colour: string, x0: number, x1: number, y0: number, y1: number, step = 22, w = 11): Node {
  const bands: Node[] = [];
  for (let x = x0; x < x1; x += step) bands.push(wash(rect(x, y0, x + w, y1), colour, { line: false, depth: 0.35, wobble: 0.5, shade: false, bloom: false, opacity: 0.85 }));
  return clipped(outline, bands);
}

/** Gingham: green bands both ways, each see-through, so the crossings go darker. */
function gingham(outline: Pt[], x0: number, x1: number, y0: number, y1: number, colour: string): Node {
  const bands: Node[] = [];
  for (let x = x0; x < x1; x += 15) bands.push(wash(rect(x, y0, x + 7, y1), colour, { line: false, wobble: 0.4, shade: false, bloom: false, opacity: 0.5 }));
  for (let y = y0; y < y1; y += 15) bands.push(wash(rect(x0, y, x1, y + 7), colour, { line: false, wobble: 0.4, shade: false, bloom: false, opacity: 0.5 }));
  return clipped(outline, bands);
}

interface ArmLook {
  sleeve: string;
  skin: string;
  /** Pattern drawn clipped to the sleeve. */
  pattern?: (sleeve: Pt[]) => Node;
  cuff?: string;
  /** Where the sleeve stops along the arm (0..1); the rest is bare forearm. Default: all the way. */
  sleeveEnd?: number;
  sleeveW?: number;
  forearmW?: number;
  hand?: number;
}

/** An arm that bends a little at the elbow, swinging from the shoulder; `to` is the middle of the hand. */
function arm(part: 'armL' | 'armR', from: Pt, to: Pt, look: ArmLook, extra: Node[] = [], bend = 5): Node {
  const via: Pt = [(from[0] + to[0]) / 2 + (part === 'armL' ? -bend : bend), (from[1] + to[1]) / 2 + 2];
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const k = 1 - 12 / len;
  const wrist: Pt = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
  const pt = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * from[0] + 2 * u * t * via[0] + t * t * wrist[0], u * u * from[1] + 2 * u * t * via[1] + t * t * wrist[1]];
  };
  const e = look.sleeveEnd ?? 1;
  const sw = look.sleeveW ?? 30;
  const nodes: Node[] = [];
  if (e < 1) nodes.push(wash(bandOutline([pt(e - 0.05), pt((e + 1) / 2), wrist], look.forearmW ?? 18), look.skin, { depth: 0.25, lineWidth: 1.9 }));
  const sleeve = bandOutline(e < 1 ? [from, pt(e / 2), pt(e)] : [from, via, wrist], sw);
  nodes.push(wash(sleeve, look.sleeve, { depth: 0.25, lineWidth: 2 }));
  if (look.pattern) nodes.push(look.pattern(sleeve));
  if (look.cuff) nodes.push(wash(bandOutline(e < 1 ? [pt(e - 0.1), pt(e)] : [[wrist[0] - (to[0] - from[0]) * 0.1, wrist[1] - (to[1] - from[1]) * 0.1], wrist], sw + (e < 1 ? 4 : 0)), look.cuff, { lineWidth: 1.8, bloom: false }));
  const r = look.hand ?? 13;
  nodes.push(wash(circle(to[0], to[1], r), look.skin, { lineWidth: 2, depth: 0.25 }));
  for (const d of [-5, 0, 5]) nodes.push(pen([[to[0] + d - 1, to[1] + 5], [to[0] + d, to[1] + 11]], { width: 1.2, opacity: 0.6, breaks: 0 }));
  nodes.push(...extra);
  return group({ part, origin: from }, nodes);
}

function legs(skin: string, sock: string, shoe: string, hem: number, half = 28): Node[] {
  return [
    wash(curve([[150 - half, hem], [144, hem], [143, 326], [150 - half + 2, 326]], 1), skin, { depth: 0.2, bloom: false }),
    wash(curve([[156, hem], [150 + half, hem], [150 + half + 2, 326], [157, 326]], 1), skin, { depth: 0.2, bloom: false }),
    wash(curve([[121, 322], [145, 322], [143, 332], [120, 332]], 1), sock, { lineWidth: 1.8, bloom: false }),
    wash(curve([[155, 322], [179, 322], [180, 332], [157, 332]], 1), sock, { lineWidth: 1.8, bloom: false }),
    wash(ellipse(126, 334, 20, 7), shoe, { lineWidth: 2, bloom: false }),
    wash(ellipse(174, 334, 20, 7), shoe, { lineWidth: 2, bloom: false }),
  ];
}

interface FaceLook {
  skin: string;
  brow: string;
  /** Replace the usual brows (the Toymaker's bushy, worried ones). */
  brows?: Node[];
  mouth: Node[];
  mouthOpen: Node[];
  cheeks?: number;
}

function faceNodes(f: FaceLook): Node[] {
  const [x, y] = [C.cx, C.cy];
  const eye = (dx: number): Node[] => [dot(x + dx, y - 4, 5.6, INK_BROWN), dot(x + dx - 2, y - 6.6, 2, '#ffffff')];
  const lid = (dx: number): Node[] => [wash(ellipse(x + dx, y - 4, 10, 10), f.skin, { line: false, shade: false, bloom: false, wobble: 0 }), pen([[x + dx - 8, y - 4], [x + dx, y + 1], [x + dx + 8, y - 4]], { width: 2.4 })];
  const brow = (dx: number, s: number): Node => pen([[x + dx - 9 * s, y - 20], [x + dx, y - 24], [x + dx + 9 * s, y - 21]], { width: 2, color: f.brow });
  const cheek = f.cheeks ?? 0.6;
  return [
    blot(ellipse(x - 40, y + 30, 13, 9), '#e57a72', cheek),
    blot(ellipse(x + 40, y + 30, 13, 9), '#e57a72', cheek),
    group({ part: 'eyes', origin: [x, y - 4] }, [...eye(-26), ...eye(26)]),
    group({ part: 'lids', opacity: 0 }, [...lid(-26), ...lid(26)]),
    ...(f.brows ?? [brow(-26, 1), brow(26, -1)]),
    pen([[x - 4, y + 12], [x - 7, y + 20], [x + 1, y + 21]], { width: 1.8, opacity: 0.8, breaks: 0 }),
    group({ part: 'mouth', origin: [x, MY] }, f.mouth),
    group({ part: 'mouthOpen', origin: [x, MY], opacity: 0 }, f.mouthOpen),
  ];
}

const openMouth = (colour: string): Node[] => [
  wash(curve([[C.cx - 12, MY - 3], [C.cx + 12, MY - 3], [C.cx + 8, MY + 12], [C.cx - 8, MY + 12]], 2), colour, { lineWidth: 1.8, shade: false, bloom: false }),
  blot(ellipse(C.cx, MY + 7, 6, 3), '#e48a7a', 0.95),
];

/** A grin with a flash of teeth, as Lavinia's. */
const grin = (w = 18): Node[] => [
  wash(curve([[C.cx - w, MY - 4], [C.cx + w, MY - 4], [C.cx + w / 2, MY + 9], [C.cx - w / 2, MY + 9]], 2), '#9a3a2c', { lineWidth: 1.8, shade: false, bloom: false }),
  wash([[C.cx - w + 4, MY - 3], [C.cx + w - 4, MY - 3], [C.cx + w - 7, MY + 2], [C.cx - w + 7, MY + 2]], WHITE, { line: false, shade: false, bloom: false, wobble: 0.3 }),
  blot(ellipse(C.cx, MY + 5, 5, 2.2), '#e48a7a', 0.9),
];

interface Person {
  name: string;
  label: string;
  skin: string;
  face: FaceLook;
  /** Behind the face: back of the hair, ears. */
  hairBack?: Node[];
  /** Over the face: fringe, cap, glasses, nose. */
  hairFront?: Node[];
  /** In the head group, over everything on the head (a plait, a cap). */
  headOver?: Node[];
  headRx?: number;
  headRy?: number;
  /** Legs and body, behind the arms. */
  body: Node[];
  /** Arms (and what they hold) that go behind the head. */
  armsBehind?: Node[];
  /** Arms in front of the head: a raised hand, a hand on a cheek. */
  armsFront?: Node[];
  shadowW?: number;
}

function person(p: Person): string {
  const [x, y] = [C.cx, C.cy];
  const figure: Node[] = [
    blot(ellipse(150, 336, p.shadowW ?? 74, 8), '#6b4a30', 0.22),
    ...p.body,
    ...(p.armsBehind ?? []),
    group({ part: 'head', origin: [x, y + 66] }, [
      group({ part: 'hair' }, p.hairBack ?? []),
      wash(ellipse(x, y + 8, p.headRx ?? 62, p.headRy ?? 60), p.skin, { depth: 0.22, lineWidth: 2.2 }),
      ...faceNodes(p.face),
      ...(p.hairFront ?? []),
      ...(p.headOver ?? []),
    ]),
    ...(p.armsFront ?? []),
  ];
  return svg({ w: 300, h: 340, name: p.name, label: p.label, className: 'portrait' }, [group({ part: 'figure', origin: [150, 340] }, figure)]);
}

// ---------------------------------------------------------------- the Toymaker

const T_SKIN = '#f2c4a4';
const T_GINGER = '#d9772f';
const T_SWIRL = '#9a4a14';
const T_GREEN = '#4f8f5a';
const T_BROWN = '#8a5530';
const T_RIM = '#5a82c6';

type ToyPose = 'stand' | 'upset' | 'paint';

function toymaker(pose: ToyPose): string {
  const [x, y] = [C.cx, C.cy];
  const shirtShape = curve([[110, 196], [190, 196], [208, 256], [208, 316], [92, 316], [92, 256]], 2);
  const look: ArmLook = {
    sleeve: WHITE,
    skin: T_SKIN,
    sleeveEnd: 0.58,
    sleeveW: 36,
    forearmW: 22,
    cuff: WHITE,
    hand: 14,
    pattern: (o) => gingham(o, 30, 270, 150, 320, T_GREEN),
  };
  const waistcoat = curve([[118, 198], [182, 198], [190, 264], [192, 302], [108, 302], [110, 264]], 2);

  const body: Node[] = [
    ...legs('#6f7f90', '#6f7f90', '#5a3a26', 316, 30),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), T_SKIN, { depth: 0.2, bloom: false }),
    wash(shirtShape, WHITE, { depth: 0.24 }),
    gingham(shirtShape, 80, 220, 190, 320, T_GREEN),
    pen(shirtShape, { closed: true, width: 2.2, breaks: 0.6 }),
    // the brown waistcoat, open at the front, with its buttons
    wash(waistcoat, T_BROWN, { depth: 0.26 }),
    pen([[150, 224], [150, 276]], { width: 1.6, breaks: 0, opacity: 0.8 }),
    ...[238, 254, 270].map((by) => wash(circle(142, by, 3.6), '#d8b24a', { lineWidth: 1.2, bloom: false, shade: false })),
    // the red spotted neckerchief
    wash(curve([[124, 192], [176, 192], [150, 238]], 1), RED, { lineWidth: 2, depth: 0.2 }),
    ...[[138, 204], [160, 204], [150, 216], [144, 226], [156, 226]].map(([sx, sy]) => dot(sx, sy, 2.4, WHITE, 0.95)),
    // the long white apron, tied at the waist
    wash(curve([[108, 272], [192, 272], [206, 316], [94, 316]], 1), WHITE, { depth: 0.2, lineWidth: 2 }),
    pen(rect(128, 288, 172, 308), { closed: true, width: 1.6, breaks: 0.3 }),
    pen([[108, 274], [88, 290], [94, 306]], { width: 2, breaks: 0 }),
    pen([[192, 274], [212, 290], [206, 306]], { width: 2, breaks: 0 }),
  ];

  // bald, with a shine, and tufts of ginger over each ear
  const tufts = (s: number): Node[] => {
    const cx = 150 + s * 66;
    return [...curl(cx, 120, 15, T_GINGER, T_SWIRL, 0.05), ...curl(cx - s * 2, 142, 14, T_GINGER, T_SWIRL), ...curl(cx - s * 5, 100, 12, T_GINGER, T_SWIRL, 0.1)];
  };
  const hairBack: Node[] = [
    wash(circle(88, 138, 11), T_SKIN, { lineWidth: 1.9, depth: 0.2 }),
    wash(circle(212, 138, 11), T_SKIN, { lineWidth: 1.9, depth: 0.2 }),
    ...tufts(-1),
    ...tufts(1),
  ];

  const worried = pose === 'upset';
  const bushy = (dx: number, s: number): Node =>
    pen(worried ? [[x + dx - 10 * s, y - 25], [x + dx, y - 30], [x + dx + 10 * s, y - 40]] : [[x + dx - 10 * s, y - 29], [x + dx, y - 33], [x + dx + 10 * s, y - 30]], { width: 4, color: T_GINGER, breaks: 0 });
  const lens = (dx: number): Node[] => [
    wash(circle(x + dx, y - 4, 17.5), '#e6f0f6', { line: false, shade: false, bloom: false, opacity: 0.35 }),
    pen(circle(x + dx, y - 4, 17.5), { closed: true, width: 3.2, color: T_RIM, breaks: 0 }),
    blot(ellipse(x + dx - 6, y - 10, 5, 2.4), '#ffffff', 0.8),
  ];
  const hairFront: Node[] = [
    blot(ellipse(x - 14, y - 40, 16, 7), '#ffffff', 0.45),
    ...lens(-26),
    ...lens(26),
    pen([[x - 9, y - 6], [x, y - 10], [x + 9, y - 6]], { width: 2.4, color: T_RIM, breaks: 0 }),
    pen([[x - 43, y - 8], [x - 60, y - 12]], { width: 2.2, color: T_RIM, breaks: 0 }),
    pen([[x + 43, y - 8], [x + 60, y - 12]], { width: 2.2, color: T_RIM, breaks: 0 }),
    // the big nose, round and pink at the end
    wash(ellipse(x, y + 22, 15, 12), deeper(T_SKIN, 0.06), { lineWidth: 2, depth: 0.3, bloom: false }),
    blot(ellipse(x, y + 26, 9, 5), '#e5897e', 0.5),
    pen([[x - 9, y + 22], [x - 5, y + 30], [x + 5, y + 30], [x + 9, y + 22]], { width: 1.4, opacity: 0.6, breaks: 0 }),
  ];

  const smile = [pen([[x - 16, MY - 2], [x - 7, MY + 5], [x, MY + 2], [x + 7, MY + 5], [x + 16, MY - 2]], { width: 2.2, color: '#a8382c' })];
  const wobbly = [pen([[x - 11, MY + 5], [x - 5, MY], [x, MY + 4], [x + 5, MY], [x + 11, MY + 5]], { width: 2.2, color: '#a8382c' })];

  let armsBehind: Node[] = [arm('armL', [112, 214], [96, 284], look, [], 14)];
  let armsFront: Node[] = [arm('armR', [188, 214], [204, 284], look, [], 14)];
  if (pose === 'paint') {
    // his right hand (on the left of the picture) up beside his head, holding the brush
    const brush: Node[] = [
      pen([[56, 196], [54, 128]], { width: 5, color: '#a8794a', breaks: 0, taper: false }),
      wash(curve([[48, 142], [62, 142], [62, 128], [48, 128]], 1), '#aab0b8', { lineWidth: 1.6, bloom: false, shade: false }),
      wash(curve([[44, 130], [66, 130], [64, 98], [55, 90], [46, 98]], 2), '#33302e', { lineWidth: 1.8, bloom: false, depth: 0.2 }),
      wash(curve([[45, 104], [64, 104], [63, 98], [55, 90], [46, 98]], 2), RED, { lineWidth: 1.2, bloom: false, shade: false }),
      wash(circle(56, 196, 14), T_SKIN, { lineWidth: 2, depth: 0.25 }),
      pen([[50, 198], [51, 207], [57, 199], [58, 208], [63, 199]], { width: 1.2, opacity: 0.6, breaks: 0 }),
    ];
    armsBehind = [];
    armsFront = [arm('armL', [112, 214], [58, 178], look, brush, -16), arm('armR', [188, 214], [204, 284], look, [], 14)];
  } else if (pose === 'upset') {
    // one hand to his cheek, the elbow out
    armsFront = [arm('armR', [188, 214], [194, 170], look, [], 22)];
  }

  return person({
    name: pose === 'stand' ? 'toymaker' : `toymaker-${pose}`,
    label: 'The Toymaker',
    skin: T_SKIN,
    body,
    hairBack,
    hairFront,
    armsBehind,
    armsFront,
    face: {
      skin: T_SKIN,
      brow: T_GINGER,
      cheeks: 0.8,
      brows: [bushy(-26, 1), bushy(26, -1)],
      mouth: worried ? wobbly : smile,
      mouthOpen: openMouth('#8a2f26'),
    },
    shadowW: 80,
  });
}

// ---------------------------------------------------------------- Matron

const M_SKIN = '#f4c8ac';
const M_HAIR = '#7a4a2a';
const M_SWIRL = '#3f2412';
const M_BLUE = '#5f8cc6';

function matron(pointing: boolean): string {
  const [x, y] = [C.cx, C.cy];
  const dress = curve([[124, 196], [176, 196], [192, 250], [216, 306], [150, 314], [84, 306], [108, 250]], 2);
  const apron = curve([[132, 200], [168, 200], [172, 248], [188, 312], [112, 312], [128, 248]], 1);
  const look: ArmLook = { sleeve: M_BLUE, skin: M_SKIN, sleeveEnd: 0.3, sleeveW: 36, forearmW: 18 };

  const body: Node[] = [
    // black stockings and shoes
    ...legs(BLACK, BLACK, BLACK, 304, 26),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), M_SKIN, { depth: 0.2, bloom: false }),
    wash(dress, M_BLUE, { depth: 0.24 }),
    pen(dress, { closed: true, width: 2.2, breaks: 0.6 }),
    // white apron with a bib, and a dark belt at the waist
    wash(apron, WHITE, { depth: 0.2, lineWidth: 2 }),
    pen([[138, 222], [162, 222]], { width: 1.4, opacity: 0.6, breaks: 0 }),
    wash(rect(118, 246, 182, 256), BLACK, { lineWidth: 1.6, bloom: false, shade: false }),
    // a small white collar
    wash(curve([[128, 194], [150, 208], [172, 194], [162, 184], [138, 184]], 2), WHITE, { lineWidth: 1.6, bloom: false, depth: 0.15 }),
  ];

  // brown hair in a ponytail, tied with a red bobbin, a side-swept fringe
  const hairBack: Node[] = [
    wash(curve([[196, 96], [236, 104], [252, 168], [240, 236], [222, 176], [206, 132]], 2), M_HAIR, { depth: 0.3, lineWidth: 2 }),
    pen([[226, 120], [238, 170], [234, 214]], { width: 1.4, color: M_SWIRL, opacity: 0.6, breaks: 0 }),
    wash(ellipse(x, y - 14, 68, 56), M_HAIR, { depth: 0.3, lineWidth: 2.2 }),
    wash(circle(88, 140, 10), M_SKIN, { lineWidth: 1.8, depth: 0.2 }),
    wash(circle(212, 140, 10), M_SKIN, { lineWidth: 1.8, depth: 0.2 }),
  ];
  const cross = (): Node[] => [
    wash(rect(145, 44, 155, 68), RED, { line: false, shade: false, bloom: false, wobble: 0.5 }),
    wash(rect(138, 51, 162, 61), RED, { line: false, shade: false, bloom: false, wobble: 0.5 }),
  ];
  const hairFront: Node[] = [
    wash(curve([[92, 124], [96, 82], [150, 68], [206, 84], [208, 124], [194, 100], [170, 88], [140, 92], [112, 104]], 2), M_HAIR, { depth: 0.3, lineWidth: 2, bloom: false }),
    pen([[120, 96], [140, 84], [170, 88]], { width: 1.4, color: M_SWIRL, opacity: 0.7, breaks: 0 }),
    // the white nurse's cap with its little red cross, and the bobbin
    wash(curve([[104, 88], [112, 46], [150, 36], [190, 46], [198, 88], [150, 78]], 2), WHITE, { depth: 0.22, lineWidth: 2.2 }),
    wash(curve([[100, 84], [150, 76], [200, 84], [200, 92], [150, 86], [100, 92]], 1), WHITE, { lineWidth: 1.8, bloom: false, depth: 0.15 }),
    ...cross(),
  ];
  const bobbin: Node[] = [wash(circle(212, 108, 6), RED, { lineWidth: 1.4, bloom: false, shade: false })];

  const downL = arm('armL', [124, 214], [112, 284], look, [], 12);
  const downR = arm('armR', [176, 214], [188, 284], look, [], 12);
  // pointing up and to the side (the picture's right, at the wall): hand at (258, 132), finger out beyond it
  const finger: Node[] = [
    wash(curve([[262, 128], [284, 112], [288, 118], [268, 138]], 1), M_SKIN, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
  ];
  const armsFront = pointing ? [arm('armR', [176, 214], [256, 140], look, finger, -6)] : [downR];
  return person({
    name: pointing ? 'matron-point' : 'matron',
    label: 'Matron',
    skin: M_SKIN,
    body,
    hairBack,
    hairFront,
    headOver: bobbin,
    armsBehind: [downL],
    armsFront,
    face: {
      skin: M_SKIN,
      brow: M_SWIRL,
      cheeks: 0.65,
      // a kind, slightly wistful small smile
      mouth: [pen([[x - 12, MY - 1], [x - 5, MY + 4], [x + 5, MY + 4], [x + 12, MY - 1]], { width: 2.2, color: '#a8382c' })],
      mouthOpen: openMouth('#8a2f26'),
    },
    shadowW: 70,
  });
}

// ---------------------------------------------------------------- the children

const SANDY = '#d7a65a';
const SANDY_SWIRL = '#9a6a24';
const PJ_BLUE = '#7fa6d8';
const K_SKIN = '#f6cdb2';

function tom(waving: boolean): string {
  // (no head-relative coordinates needed here)
  const top = curve([[118, 196], [182, 196], [198, 250], [206, 312], [94, 312], [102, 250]], 2);
  const look: ArmLook = { sleeve: WHITE, skin: K_SKIN, pattern: (o) => stripes(o, PJ_BLUE, 30, 270, 150, 320, 16, 8), hand: 12, sleeveW: 28 };
  const body: Node[] = [
    // striped pyjama bottoms and slippers
    ...legs('#cfe0f2', '#cfe0f2', '#c9564a', 306, 28),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), K_SKIN, { depth: 0.2, bloom: false }),
    wash(top, WHITE, { depth: 0.24 }),
    stripes(top, PJ_BLUE, 90, 215, 190, 320, 22, 11),
    pen(top, { closed: true, width: 2.2, breaks: 0.6 }),
    // turned-down collar, buttons
    wash(curve([[128, 192], [150, 214], [172, 192], [162, 184], [138, 184]], 2), WHITE, { lineWidth: 1.7, bloom: false, depth: 0.15 }),
    pen([[150, 214], [150, 300]], { width: 1.3, opacity: 0.55, breaks: 0 }),
    ...[232, 254, 276].map((by) => dot(150, by, 3, '#5a82c6', 0.95)),
  ];
  const ring: [number, number, number, number?][] = [
    [88, 114, 17], [86, 136, 14], [100, 90, 18, 0.06], [124, 74, 19], [150, 68, 19, 0.08], [176, 74, 19], [200, 90, 18, 0.06], [212, 114, 17], [214, 136, 14],
  ];
  const fringe: [number, number, number][] = [[118, 90, 13], [138, 88, 13], [160, 88, 13], [180, 92, 12]];
  const hairBack: Node[] = [
    wash(circle(88, 140, 11), K_SKIN, { lineWidth: 1.9, depth: 0.2 }),
    wash(circle(212, 140, 11), K_SKIN, { lineWidth: 1.9, depth: 0.2 }),
    ...ring.flatMap(([cx, cy, r, t]) => curl(cx, cy, r, SANDY, SANDY_SWIRL, t ?? 0)),
  ];
  const hairFront = fringe.flatMap(([cx, cy, r]) => curl(cx, cy - 2, r, SANDY, SANDY_SWIRL));
  const pjL = arm('armL', [124, 214], [110, 282], look, [], 12);
  // waving: the picture's right hand up beside the face, at about (246, 138)
  const armR = waving ? arm('armR', [176, 214], [246, 138], look, [], 16) : arm('armR', [176, 214], [190, 282], look, [], 12);
  return person({
    name: waving ? 'tom-wave' : 'tom',
    label: 'Tom',
    skin: K_SKIN,
    body,
    hairBack,
    hairFront,
    armsBehind: [pjL],
    armsFront: [armR],
    face: { skin: K_SKIN, brow: SANDY_SWIRL, cheeks: 0.85, mouth: grin(), mouthOpen: openMouth('#8a2f26') },
    shadowW: 60,
  });
}

const D_HAIR = '#3b2a26';
const D_SWIRL = '#1c1210';
const D_PINK = '#f0a8b8';
const D_TEDDY = '#c8934a';

/** A small teddy, drawn around the origin (ears above, feet below). */
function minibear(): Node[] {
  const fur = D_TEDDY;
  return [
    wash(ellipse(-12, 18, 6, 8), deeper(fur, 0.1), { lineWidth: 1.4, bloom: false, shade: false }),
    wash(ellipse(12, 18, 6, 8), deeper(fur, 0.1), { lineWidth: 1.4, bloom: false, shade: false }),
    wash(ellipse(0, 12, 14, 17), fur, { lineWidth: 1.8, depth: 0.2 }),
    wash(circle(-10, -18, 6), fur, { lineWidth: 1.5, depth: 0.2 }),
    wash(circle(10, -18, 6), fur, { lineWidth: 1.5, depth: 0.2 }),
    wash(circle(0, -6, 13), fur, { lineWidth: 1.8, depth: 0.2 }),
    wash(ellipse(0, -2, 6, 4.6), '#f0d9a8', { lineWidth: 1.2, bloom: false, shade: false }),
    dot(0, -3.4, 2.2, INK_BROWN),
    dot(-5, -9, 1.5, INK_BROWN),
    dot(5, -9, 1.5, INK_BROWN),
    pen([[-3, 1], [0, 3], [3, 1]], { width: 1, breaks: 0 }),
    wash(circle(-14, 8, 4.4), fur, { lineWidth: 1.3, bloom: false, shade: false }),
    wash(circle(14, 8, 4.4), fur, { lineWidth: 1.3, bloom: false, shade: false }),
  ];
}

function daisy(waving: boolean): string {
  const [x, y] = [C.cx, C.cy];
  const dress = curve([[122, 196], [178, 196], [194, 250], [214, 304], [150, 310], [86, 304], [106, 250]], 2);
  const spots: Node[] = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 8; col++) spots.push(dot(88 + col * 17 + (row % 2) * 8, 206 + row * 18, 3.4, WHITE, 0.95));
  const look: ArmLook = {
    sleeve: D_PINK,
    skin: K_SKIN,
    sleeveEnd: 0.34,
    sleeveW: 32,
    forearmW: 17,
    hand: 12,
    pattern: (o) => clipped(o, [[100, 160], [124, 180], [150, 200], [176, 180], [200, 160], [112, 230], [188, 230], [70, 190], [230, 190], [60, 210], [240, 210]].map(([dx, dy]) => dot(dx, dy, 3.4, WHITE, 0.95))),
  };
  const body: Node[] = [
    ...legs(K_SKIN, WHITE, '#e58aa0', 304, 26),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), K_SKIN, { depth: 0.2, bloom: false }),
    wash(dress, D_PINK, { depth: 0.24 }),
    clipped(dress, spots),
    pen(dress, { closed: true, width: 2.2, breaks: 0.6 }),
    // a frilled white collar and hem
    wash(curve([[122, 190], [150, 202], [178, 190], [192, 208], [150, 224], [108, 208]], 2), WHITE, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    ...scallops([110, 210], [150, 226], 4, 5.6, WHITE),
    ...scallops([190, 210], [150, 226], 4, 5.6, WHITE),
    ...scallops([90, 306], [210, 306], 9, 7, WHITE),
  ];
  // a long dark plait over one shoulder, a pink ribbon at the end
  const plait: Node[] = [];
  for (let i = 0; i < 6; i++) plait.push(...curl(x + 62 + i * 2 - (i > 3 ? 2 : 0), 170 + i * 17, 11 - i * 0.4, D_HAIR, D_SWIRL, i % 2 ? 0.08 : 0));
  plait.push(wash(curve([[x + 66, 270], [x + 80, 262], [x + 84, 280], [x + 70, 280]], 1), '#e58aa0', { lineWidth: 1.4, bloom: false }), wash(curve([[x + 66, 270], [x + 52, 262], [x + 48, 280], [x + 62, 280]], 1), '#e58aa0', { lineWidth: 1.4, bloom: false }));
  const hairBack: Node[] = [
    wash(ellipse(x, y - 8, 68, 58), D_HAIR, { depth: 0.3, lineWidth: 2.2 }),
    wash(circle(88, 140, 10), K_SKIN, { lineWidth: 1.8, depth: 0.2 }),
    wash(circle(212, 140, 10), K_SKIN, { lineWidth: 1.8, depth: 0.2 }),
  ];
  const hairFront: Node[] = [
    // a centre parting, the hair swept over each side of the forehead
    wash(curve([[90, 128], [94, 82], [150, 66], [206, 82], [210, 128], [196, 100], [166, 90], [150, 82], [134, 90], [104, 100]], 2), D_HAIR, { depth: 0.3, lineWidth: 2, bloom: false }),
    pen([[150, 68], [150, 84]], { width: 1.4, color: '#6a5a56', opacity: 0.7, breaks: 0 }),
    pen([[116, 94], [132, 86]], { width: 1.3, color: '#6a5a56', opacity: 0.6, breaks: 0 }),
    pen([[184, 94], [168, 86]], { width: 1.3, color: '#6a5a56', opacity: 0.6, breaks: 0 }),
  ];
  // teddy held at the chest on the picture's left; the left arm hugs him
  const teddy: Node = group({ transform: 'translate(106 254) rotate(-8) scale(1.45)' }, minibear());
  const armL = arm('armL', [124, 214], [118, 284], look, [], 14);
  // waving: the picture's right hand up beside the face, at about (244, 138)
  const armR = waving ? arm('armR', [178, 214], [244, 138], look, [], 16) : arm('armR', [178, 214], [190, 284], look, [], 12);
  return person({
    name: waving ? 'daisy-wave' : 'daisy',
    label: 'Daisy',
    skin: K_SKIN,
    body: [...body, teddy],
    hairBack,
    hairFront,
    headOver: plait,
    armsBehind: [armL],
    armsFront: [armR],
    face: { skin: K_SKIN, brow: D_SWIRL, cheeks: 0.85, mouth: grin(16), mouthOpen: openMouth('#8a2f26') },
    shadowW: 60,
  });
}

export const dollsHousePeople: Record<string, () => string> = {
  toymaker: () => toymaker('stand'),
  'toymaker:upset': () => toymaker('upset'),
  'toymaker:paint': () => toymaker('paint'),
  matron: () => matron(false),
  'matron:point': () => matron(true),
  tom: () => tom(false),
  'tom:wave': () => tom(true),
  daisy: () => daisy(false),
  'daisy:wave': () => daisy(true),
};
