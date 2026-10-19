/**
 * The Treasury's two humans, in the same watercolour and ink as Goldilocks:
 * Lavinia (a girl of seven with ringlets, a big spotted bow and a brand-new
 * doll) and her Great Aunt Edie (grey curls, round glasses, a straw hat), who
 * also has a pose cuddling Bertie Bear.
 *
 * They are built here by a small builder of their own, shaped like
 * Goldilocks's (grownups.ts), so they stand beside her at the same size:
 * a 300 × 340 portrait, the face in the chip box 78 62 144 144, and the same
 * parts (figure, head, eyes, lids, mouth, mouthOpen, armL, armR, hair), so
 * they talk, blink and swing their arms like her.
 *
 * Humans are big here and the bears are toys to them, so the doll and Bertie
 * are drawn small, held against the person's front, in front of the dress
 * and behind the hands that hold them.
 */
import { circle, curve, dot, ellipse, group, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';
import { bandOutline } from './parts';

const WHITE = '#f6f1e6';
const INK_BROWN = '#2a1d17';
const C = { cx: 150, cy: 126 };

// ---------------------------------------------------------------- shared bits

/** One curl of hair: a scalloped wash with a pen swirl in it. */
function curl(x: number, y: number, r: number, hair: string, swirl: string, tone = 0): Node[] {
  return [
    wash(ellipse(x, y, r, r * 0.95), tone ? deeper(hair, tone) : hair, { depth: 0.3, lineWidth: 1.8, wobble: 1.6 }),
    pen([[x - r * 0.45, y + r * 0.2], [x - r * 0.1, y - r * 0.45], [x + r * 0.45, y - r * 0.1], [x + r * 0.1, y + r * 0.35]], { width: 1.4, color: swirl, opacity: 0.8, breaks: 0 }),
  ];
}

/** A row of little scallops along a line: a frill or a lace edge. */
function scallops(from: Pt, to: Pt, n: number, r: number, color: string): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    out.push(wash(circle(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, r), color, { lineWidth: 1.5, bloom: false, depth: 0.15 }));
  }
  return out;
}

interface ArmLook {
  sleeve: string;
  spots?: string;
  skin: string;
  /** Pen-strokes on the hand for fingers. */
  cuff?: string;
}

/** An arm that bends a little at the elbow, swinging from the shoulder. */
function arm(part: 'armL' | 'armR', from: Pt, to: Pt, look: ArmLook, extra: Node[] = [], bend = 5): Node {
  const via: Pt = [(from[0] + to[0]) / 2 + (part === 'armL' ? -bend : bend), (from[1] + to[1]) / 2 + 2];
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const k = 1 - 12 / len;
  const wrist: Pt = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
  const sleeve = bandOutline([from, via, wrist], 30);
  const dots: Node[] = [];
  if (look.spots) for (let i = 0; i < 4; i++) dots.push(dot(from[0] + (wrist[0] - from[0]) * (0.15 + i * 0.22) + (i % 2 ? 4 : -4), from[1] + (wrist[1] - from[1]) * (0.15 + i * 0.22), 3.2, look.spots, 0.95));
  const nodes: Node[] = [wash(sleeve, look.sleeve, { depth: 0.25, lineWidth: 2 }), clipped(sleeve, dots)];
  if (look.cuff) nodes.push(wash(bandOutline([[wrist[0] - (to[0] - from[0]) * 0.1, wrist[1] - (to[1] - from[1]) * 0.1], wrist], 30), look.cuff, { lineWidth: 1.8, bloom: false }));
  nodes.push(wash(circle(to[0], to[1], 13), look.skin, { lineWidth: 2, depth: 0.25 }));
  for (const d of [-5, 0, 5]) nodes.push(pen([[to[0] + d - 1, to[1] + 5], [to[0] + d, to[1] + 11]], { width: 1.2, opacity: 0.6, breaks: 0 }));
  nodes.push(...extra);
  return group({ part, origin: from }, nodes);
}

/** Legs, socks and shoes, standing on the ground line. */
function legs(skin: string, sock: string, shoe: string, hem: number): Node[] {
  return [
    wash(curve([[124, hem], [144, hem], [143, 326], [122, 326]], 1), skin, { depth: 0.2, bloom: false }),
    wash(curve([[156, hem], [176, hem], [178, 326], [157, 326]], 1), skin, { depth: 0.2, bloom: false }),
    wash(curve([[121, 322], [145, 322], [143, 332], [120, 332]], 1), sock, { lineWidth: 1.8, bloom: false }),
    wash(curve([[155, 322], [179, 322], [180, 332], [157, 332]], 1), sock, { lineWidth: 1.8, bloom: false }),
    wash(ellipse(126, 334, 20, 7), shoe, { lineWidth: 2, bloom: false }),
    wash(ellipse(174, 334, 20, 7), shoe, { lineWidth: 2, bloom: false }),
  ];
}

interface FaceLook {
  skin: string;
  brow: string;
  /** How far the pupils sit below their usual place (looking down at a bear). */
  gaze?: number;
  mouth: Node[];
  mouthOpen: Node[];
  cheeks?: number;
}

/** Everything that goes on the face: cheeks, eyes, lids, brows, nose, mouth. Returns the nodes and the glasses-free eye positions. */
function faceNodes(f: FaceLook): Node[] {
  const [x, y] = [C.cx, C.cy];
  const my = y + 40;
  const g = f.gaze ?? 0;
  const eye = (dx: number): Node[] => [dot(x + dx, y - 4 + g, 5.6, INK_BROWN), dot(x + dx - 2, y - 6.6 + g, 2, '#ffffff')];
  const lid = (dx: number): Node[] => [wash(ellipse(x + dx, y - 4, 10, 10), f.skin, { line: false, shade: false, bloom: false, wobble: 0 }), pen([[x + dx - 8, y - 4], [x + dx, y + 1], [x + dx + 8, y - 4]], { width: 2.4 })];
  const brow = (dx: number, s: number): Node => pen([[x + dx - 9 * s, y - 20], [x + dx, y - 24], [x + dx + 9 * s, y - 21]], { width: 2, color: f.brow });
  const cheek = f.cheeks ?? 0.6;
  return [
    blot(ellipse(x - 40, y + 30, 13, 9), '#e57a72', cheek),
    blot(ellipse(x + 40, y + 30, 13, 9), '#e57a72', cheek),
    group({ part: 'eyes', origin: [x, y - 4] }, [...eye(-26), ...eye(26)]),
    group({ part: 'lids', opacity: 0 }, [...lid(-26), ...lid(26)]),
    brow(-26, 1),
    brow(26, -1),
    pen([[x - 4, y + 12], [x - 7, y + 20], [x + 1, y + 21]], { width: 1.8, opacity: 0.8, breaks: 0 }),
    group({ part: 'mouth', origin: [x, my] }, f.mouth),
    group({ part: 'mouthOpen', origin: [x, my], opacity: 0 }, f.mouthOpen),
  ];
}

const MY = C.cy + 40;
const openMouth = (colour: string): Node[] => [
  wash(curve([[C.cx - 12, MY - 3], [C.cx + 12, MY - 3], [C.cx + 8, MY + 12], [C.cx - 8, MY + 12]], 2), colour, { lineWidth: 1.8, shade: false, bloom: false }),
  blot(ellipse(C.cx, MY + 7, 6, 3), '#e48a7a', 0.95),
];

// ---------------------------------------------------------------- Lavinia

const L_SKIN = '#f4c8ac';
const L_HAIR = '#dc9d52';
const L_SWIRL = '#a8641c';
const L_BLUE = '#6f9fd8';
const L_RED = '#d0382f';
const L_BLACK = '#2c2a30';

/** The new doll: a black bob, a red spotted dress, tiny legs. Drawn at the origin, then moved. */
function doll(): Node[] {
  const body = curve([[-13, -2], [13, -2], [22, 34], [0, 40], [-22, 34]], 2);
  const spots: Node[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) spots.push(dot(-16 + c * 11 + (r % 2) * 5, 4 + r * 10, 2.2, WHITE, 0.95));
  return [
    // legs and shoes under the hem
    wash(curve([[-10, 36], [-3, 36], [-3, 52], [-10, 52]], 1), L_SKIN, { lineWidth: 1.5, bloom: false, shade: false }),
    wash(curve([[3, 36], [10, 36], [10, 52], [3, 52]], 1), L_SKIN, { lineWidth: 1.5, bloom: false, shade: false }),
    wash(ellipse(-8, 53, 7, 3.4), L_BLACK, { lineWidth: 1.4, bloom: false, shade: false }),
    wash(ellipse(8, 53, 7, 3.4), L_BLACK, { lineWidth: 1.4, bloom: false, shade: false }),
    wash(body, L_RED, { depth: 0.22, lineWidth: 1.8 }),
    clipped(body, spots),
    pen(body, { closed: true, width: 1.8, breaks: 0.4 }),
    // head: the face, then the black bob and a straight fringe
    wash(circle(0, -18, 17), L_SKIN, { depth: 0.2, lineWidth: 1.8 }),
    wash(curve([[-19, -14], [-20, -34], [0, -41], [20, -34], [19, -14], [13, -16], [11, -28], [-11, -28], [-13, -16]], 2), L_BLACK, { depth: 0.2, lineWidth: 1.8, bloom: false }),
    dot(-6, -17, 2, INK_BROWN),
    dot(6, -17, 2, INK_BROWN),
    blot(ellipse(-10, -11, 4, 2.6), '#e57a72', 0.6),
    blot(ellipse(10, -11, 4, 2.6), '#e57a72', 0.6),
    pen([[-4, -10], [0, -7], [4, -10]], { width: 1.3, color: '#a8382c', breaks: 0 }),
  ];
}

function lavinia(): string {
  const [x, y] = [C.cx, C.cy];
  const dressShape = curve([[122, 196], [178, 196], [196, 250], [226, 304], [150, 314], [74, 304], [104, 250]], 2);
  const bluesLook: ArmLook = { sleeve: L_BLUE, spots: WHITE, skin: L_SKIN, cuff: WHITE };

  // The mop of ginger-blonde ringlets: a ring round the head, then long
  // ringlets that hang down past the cheeks, and a few over the forehead.
  const ring: [number, number, number, number?][] = [
    [84, 140, 22], [74, 114, 24], [80, 90, 25, 0.1], [98, 70, 25], [124, 58, 25, 0.1], [150, 54, 25], [176, 58, 25, 0.1], [202, 70, 25],
    [220, 90, 25, 0.1], [226, 114, 24], [216, 140, 22],
  ];
  const ringlets: [number, number, number][] = [
    [74, 158, 17], [70, 178, 16], [76, 198, 15], [226, 158, 17], [230, 178, 16], [224, 198, 15],
  ];
  const fringe: [number, number, number][] = [[114, 90, 14], [134, 86, 14], [156, 86, 14], [176, 90, 14]];
  // a big red bow with white spots, perched on top of the curls
  const loop = (s: number): Node => wash(curve([[150 + s * 6, 38], [150 + s * 62, 4], [150 + s * 66, 66]], 1), L_RED, { lineWidth: 2.2, bloom: false });
  const bowSpots: Node[] = [[104, 22], [96, 38], [112, 44], [196, 22], [204, 38], [188, 44]].map(([bx, by]) => dot(bx, by, 3.2, WHITE));

  const figure: Node[] = [
    blot(ellipse(150, 336, 78, 8), '#6b4a30', 0.22),
    ...legs(L_SKIN, WHITE, '#a8382c', 304),
    wash(dressShape, L_BLUE, { depth: 0.24 }),
    pen(dressShape, { closed: true, width: 2.2, breaks: 0.6 }),
    // a frilled white collar, wide and round, with a scalloped edge
    wash(curve([[120, 190], [150, 200], [180, 190], [196, 210], [150, 228], [104, 210]], 2), WHITE, { lineWidth: 1.8, bloom: false, depth: 0.2 }),
    ...scallops([106, 212], [150, 230], 4, 6, WHITE),
    ...scallops([194, 212], [150, 230], 4, 6, WHITE),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), L_SKIN, { depth: 0.2, bloom: false }),
    // the doll, held in the crook of both arms
    group({ transform: 'translate(150 244) rotate(-6) scale(1.12)' }, doll()),
    arm('armL', [126, 216], [128, 280], bluesLook, [], 14),
    group({ part: 'head', origin: [x, y + 66] }, [
      // ringlets behind the face
      group({ part: 'hair' }, [...ring.flatMap(([cx, cy, r, t]) => curl(cx, cy, r, L_HAIR, L_SWIRL, t ?? 0)), ...ringlets.flatMap(([cx, cy, r]) => curl(cx, cy, r, L_HAIR, L_SWIRL, 0.06)), ...fringe.flatMap(([cx, cy, r]) => curl(cx, cy, r, L_HAIR, L_SWIRL))]),
      wash(ellipse(x, y + 8, 62, 60), L_SKIN, { depth: 0.22, lineWidth: 2.2 }),
      ...faceNodes({
        skin: L_SKIN,
        brow: L_SWIRL,
        cheeks: 0.75,
        // a bright, breezy smile with a flash of teeth
        mouth: [
          wash(curve([[x - 18, MY - 4], [x + 18, MY - 4], [x + 9, MY + 9], [x - 9, MY + 9]], 2), '#9a3a2c', { lineWidth: 1.8, shade: false, bloom: false }),
          wash([[x - 14, MY - 3], [x + 14, MY - 3], [x + 11, MY + 2], [x - 11, MY + 2]], WHITE, { line: false, shade: false, bloom: false, wobble: 0.3 }),
          blot(ellipse(x, MY + 5, 5, 2.2), '#e48a7a', 0.9),
        ],
        mouthOpen: openMouth('#8a2f26'),
      }),
      // fringe curls and the bow go over the face again so they sit on top
      group({ part: 'hair' }, fringe.flatMap(([cx, cy, r]) => curl(cx, cy - 4, r - 1, L_HAIR, L_SWIRL))),
      loop(-1),
      loop(1),
      wash(ellipse(150, 38, 11, 13), deeper(L_RED, 0.15), { lineWidth: 2, bloom: false, shade: false }),
      ...bowSpots,
    ]),
    arm('armR', [174, 216], [172, 280], bluesLook, [], 14),
  ];
  return svg({ w: 300, h: 340, name: 'lavinia', label: 'Lavinia', className: 'portrait' }, [group({ part: 'figure', origin: [150, 340] }, figure)]);
}

// ---------------------------------------------------------------- Great Aunt Edie

const E_SKIN = '#efc7ae';
const E_HAIR = '#cfcdd2';
const E_SWIRL = '#8d8a94';
const E_LILAC = '#b9a2d8';
const STRAW = '#e6c677';

/** Bertie Bear, small and pale: drawn around the origin (head above, blazer below). */
function bertie(): Node[] {
  const FURC = '#ecd3a0';
  const body = curve([[-22, 4], [22, 4], [30, 30], [20, 48], [-20, 48], [-30, 30]], 2);
  const stripes: Node[] = [];
  const cols = [L_RED, WHITE, L_BLUE];
  for (let i = -6; i < 6; i++) stripes.push(wash([[i * 6, -4], [i * 6 + 6, -4], [i * 6 + 6, 56], [i * 6, 56]], cols[((i % 3) + 3) % 3], { line: false, depth: 0.4, wobble: 0.4, shade: false, bloom: false }));
  return [
    // feet stick out below the blazer
    wash(ellipse(-12, 52, 11, 7), deeper(FURC, 0.15), { lineWidth: 1.6, bloom: false, shade: false }),
    wash(ellipse(12, 52, 11, 7), deeper(FURC, 0.15), { lineWidth: 1.6, bloom: false, shade: false }),
    wash(body, WHITE, { depth: 0.2, lineWidth: 1.8 }),
    clipped(body, stripes),
    pen(body, { closed: true, width: 1.8, breaks: 0.4 }),
    // lapels
    pen([[-8, 4], [0, 22], [8, 4]], { width: 1.6, breaks: 0 }),
    // round ears, then the head
    wash(circle(-22, -34, 11), FURC, { lineWidth: 1.8, depth: 0.2 }),
    wash(circle(22, -34, 11), FURC, { lineWidth: 1.8, depth: 0.2 }),
    wash(circle(-22, -33, 5.5), deeper(FURC, 0.25), { line: false, bloom: false }),
    wash(circle(22, -33, 5.5), deeper(FURC, 0.25), { line: false, bloom: false }),
    wash(ellipse(0, -14, 30, 27), FURC, { lineWidth: 1.9, depth: 0.2 }),
    wash(ellipse(0, -5, 15, 11), '#f8ecd2', { lineWidth: 1.5, depth: 0.15, bloom: false }),
    dot(-11, -20, 2.8, INK_BROWN),
    dot(11, -20, 2.8, INK_BROWN),
    dot(-12, -21, 1, '#ffffff'),
    dot(10, -21, 1, '#ffffff'),
    // the big shiny black nose
    wash(ellipse(0, -11, 8, 5.4), INK_BROWN, { lineWidth: 1.4, shade: false, bloom: false, wobble: 0.3 }),
    blot(ellipse(-2.5, -13, 3, 1.6), '#ffffff', 0.9),
    pen([[0, -6], [0, -2]], { width: 1.4, breaks: 0 }),
    pen([[-6, -1], [0, 3], [6, -1]], { width: 1.6, breaks: 0 }),
    blot(ellipse(-19, -6, 5, 3.4), '#e59a8a', 0.5),
    blot(ellipse(19, -6, 5, 3.4), '#e59a8a', 0.5),
  ];
}

/** The black handbag with its handle, drawn from the top of the handle. */
function handbag(x: number, y: number): Node[] {
  return [
    pen([[x - 12, y + 6], [x - 10, y - 8], [x + 10, y - 8], [x + 12, y + 6]], { width: 3.2, color: L_BLACK, breaks: 0, taper: false }),
    wash(curve([[x - 22, y + 6], [x + 22, y + 6], [x + 26, y + 36], [x - 26, y + 36]], 1), L_BLACK, { depth: 0.2, lineWidth: 2, bloom: false }),
    pen([[x - 22, y + 14], [x + 22, y + 14]], { width: 1.3, color: '#6c6a72', breaks: 0 }),
    wash(ellipse(x, y + 14, 4, 3.4), '#d8b24a', { lineWidth: 1.2, bloom: false, shade: false }),
  ];
}

function greatAunt(name: string, cuddle: boolean): string {
  const [x, y] = [C.cx, C.cy];
  // a slimmer, smaller dress than the girls', with a little taper to the hem
  const dressShape = curve([[124, 196], [176, 196], [192, 250], [212, 306], [150, 314], [88, 306], [108, 250]], 2);
  const spots: Node[] = [];
  for (let row = 0; row < 6; row++) for (let col = 0; col < 8; col++) spots.push(dot(86 + col * 18 + (row % 2) * 9, 208 + row * 18, 3.8, WHITE, 0.95));
  const look: ArmLook = { sleeve: E_LILAC, spots: WHITE, skin: E_SKIN, cuff: WHITE };

  // grey curls round the head, mostly hidden by the hat
  const ring: [number, number, number, number?][] = [
    [82, 138, 18], [76, 116, 19], [82, 94, 19, 0.06], [218, 94, 19, 0.06], [224, 116, 19], [218, 138, 18], [90, 156, 15], [210, 156, 15],
  ];
  const fringe: [number, number, number][] = [[118, 90, 11], [136, 87, 11], [154, 87, 11], [172, 90, 11]];

  const glass = (dx: number): Node[] => [
    wash(circle(x + dx, y - 4, 17), '#e6f0f6', { lineWidth: 2.2, shade: false, bloom: false, depth: 0.1 }),
    pen(circle(x + dx, y - 4, 17), { closed: true, width: 2.2, color: '#5a4a3c', breaks: 0 }),
    blot(ellipse(x + dx - 6, y - 10, 5, 2.4), '#ffffff', 0.8),
  ];

  // the hat: a round crown, a floppy brim and a black ribbon bow
  const hat: Node[] = [
    wash(ellipse(150, 70, 92, 17), STRAW, { lineWidth: 2.2, depth: 0.25 }),
    wash(curve([[102, 70], [106, 34], [150, 24], [194, 34], [198, 70], [150, 78]], 2), STRAW, { lineWidth: 2.2, depth: 0.25 }),
    // weave
    ...[40, 48, 56, 64].map((wy) => pen([[110, wy], [150, wy + 4], [190, wy]], { width: 1.1, color: '#b08a3c', opacity: 0.6, breaks: 0 })),
    wash(curve([[103, 62], [150, 70], [197, 62], [198, 72], [150, 80], [102, 72]], 1), L_BLACK, { lineWidth: 1.8, bloom: false }),
    wash(curve([[168, 66], [196, 50], [200, 84]], 1), L_BLACK, { lineWidth: 1.8, bloom: false }),
    wash(curve([[168, 66], [140, 50], [138, 84]], 1), L_BLACK, { lineWidth: 1.8, bloom: false }),
    wash(ellipse(168, 68, 7, 8), '#4a4850', { lineWidth: 1.6, bloom: false, shade: false }),
  ];

  const brooch: Node[] = [
    wash(ellipse(150, 214, 8, 10), '#d8b24a', { lineWidth: 1.5, bloom: false, shade: false }),
    wash(ellipse(150, 214, 5.6, 7.6), '#e8b4a4', { line: false, bloom: false, shade: false }),
    pen([[148, 211], [151, 210], [152, 214], [150, 217]], { width: 1.2, color: WHITE, breaks: 0 }),
  ];

  // the lace collar: a round white yoke with a scalloped edge
  const lace: Node[] = [
    wash(curve([[126, 192], [150, 200], [174, 192], [186, 208], [150, 222], [114, 208]], 2), WHITE, { lineWidth: 1.6, bloom: false, depth: 0.15 }),
    ...scallops([116, 208], [150, 223], 4, 4.4, WHITE),
    ...scallops([184, 208], [150, 223], 4, 4.4, WHITE),
    ...[[130, 204], [140, 210], [160, 210], [170, 204]].map(([lx, ly]) => dot(lx, ly, 1.4, E_SWIRL, 0.7)),
  ];

  const bag = cuddle ? handbag(216, 250) : handbag(196, 286);
  const armLTo: Pt = cuddle ? [124, 284] : [106, 288];
  const armRTo: Pt = cuddle ? [176, 284] : [196, 288];

  const figure: Node[] = [
    blot(ellipse(150, 336, 70, 8), '#6b4a30', 0.22),
    ...legs('#dcc3b0', '#ece4e4', L_BLACK, 304),
    wash(dressShape, E_LILAC, { depth: 0.24 }),
    clipped(dressShape, spots),
    pen(dressShape, { closed: true, width: 2.2, breaks: 0.6 }),
    wash(curve([[136, 184], [164, 184], [160, 200], [140, 200]], 1), E_SKIN, { depth: 0.2, bloom: false }),
    ...lace,
    ...brooch,
    // Cuddling: the arms go round first, then Bertie sits in front of them
    // with only the hands showing at his sides, so he reads as held, not hidden.
    ...(cuddle ? [arm('armL', [126, 216], armLTo, look, [], 14), arm('armR', [174, 216], armRTo, look, bag, 14), group({ transform: 'translate(150 250)' }, bertie())] : [arm('armL', [126, 216], armLTo, look)]),
    group({ part: 'head', origin: [x, y + 66], transform: cuddle ? `rotate(4 ${x} ${y + 66})` : undefined }, [
      group({ part: 'hair' }, ring.flatMap(([cx, cy, r, t]) => curl(cx, cy, r, E_HAIR, E_SWIRL, t ?? 0))),
      wash(ellipse(x, y + 8, 60, 58), E_SKIN, { depth: 0.22, lineWidth: 2.2 }),
      ...faceNodes({
        skin: E_SKIN,
        brow: E_SWIRL,
        // eyes cast down at Bertie when she cuddles him
        gaze: cuddle ? 3 : 0,
        mouth: [pen([[x - 13, MY - 2], [x - 6, MY + 4], [x, MY + 1], [x + 6, MY + 4], [x + 13, MY - 2]], { width: 2.2, color: '#a8382c' })],
        mouthOpen: openMouth('#8a2f26'),
      }),
      // little smile lines by the eyes
      ...[-1, 1].flatMap((s) => [pen([[x + s * 44, y - 6], [x + s * 50, y - 10]], { width: 1.1, opacity: 0.55, breaks: 0 }), pen([[x + s * 44, y + 0], [x + s * 51, y + 1]], { width: 1.1, opacity: 0.55, breaks: 0 })]),
      ...glass(-26),
      ...glass(26),
      pen([[x - 9, y - 6], [x, y - 10], [x + 9, y - 6]], { width: 2, color: '#5a4a3c', breaks: 0 }),
      pen([[x - 43, y - 8], [x - 60, y - 14]], { width: 1.8, color: '#5a4a3c', breaks: 0 }),
      pen([[x + 43, y - 8], [x + 60, y - 14]], { width: 1.8, color: '#5a4a3c', breaks: 0 }),
      group({ part: 'hair' }, fringe.flatMap(([cx, cy, r]) => curl(cx, cy, r, E_HAIR, E_SWIRL))),
      ...hat,
    ]),
    ...(cuddle ? [] : [arm('armR', [174, 216], armRTo, look, bag)]),
  ];
  return svg({ w: 300, h: 340, name, label: 'Great Aunt Edie', className: 'portrait' }, [group({ part: 'figure', origin: [150, 340] }, figure)]);
}

export const treasuryPeople: Record<string, () => string> = {
  lavinia,
  'great-aunt': () => greatAunt('great-aunt', false),
  'great-aunt:cuddle': () => greatAunt('great-aunt-cuddle', true),
};
