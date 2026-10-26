/**
 * Old Barnacle: a huge, slow, grumbling whale, grey-blue and covered in
 * barnacles. Asleep he looks like a little island: a sandy hump with one
 * palm tree, which is the `whale-back` prop (his back, and his tail
 * sticking up at the far end, with a `whale-back-front` lip of sand laid
 * over anyone standing on it). The portrait is his head, raised out of
 * the sea (spy-hopping) and facing left, with one big sleepy eye, a wide
 * mouth and a foam of waves at its bottom edge.
 *
 * Portrait (300 × 340, facing left): a blunt, rounded head filling the
 * box. The eye is at about (178, 136), inside the usual face box; the
 * mouth runs along the pale jaw at about y 245, so the portrait sets a
 * `chip` that frames both. Parts: figure, head, eyes, lids (hidden: fade
 * them out for the eye to open), brows, mouth, mouthOpen.
 * Poses: sleep (eye shut, a snoozing smile) and happy (eye crescent, big
 * smile).
 *
 * `whale-back` (960 × 300): the hump of his back with its sandy top
 * (x 236–734, top at y 186) and one palm tree (part `palm`, origin at its
 * foot), flanks down to the waterline at about y 272 with foam, and his
 * tail at the right (part `tail`, origin at its base): a stalk rising to
 * two flukes, up to x 958. Place riders with their bottoms at about y 232
 * of the prop; `whale-back-front` (same box) is the sand lip that hides
 * their bottom edges.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../art/paper';
import { FLAT, cx, portrait } from '../faraway/parts';

type Mood = 'grump' | 'sleep' | 'happy';

const BODY = '#6f8aa6';
const BODY_SHADE = '#58728e';
const BODY_DEEP = '#4a627c';
const BODY_LIGHT = '#93aac0';
const PALE = '#d3dde2';
const PALE_SHADE = '#b3c2cb';
const FOAM = '#f1f7f5';
const BARN = '#e8e2cf';
const BARN_SHADE = '#b9b199';
const CLEAN = { edge: 'clean' as const, shadow: false };

/** A little cone-shaped barnacle with a dark mouth, `s` for size. */
function barnacle(x: number, y: number, s: number): Node[] {
  return [
    piece(poly([[x - s, y + s * 0.7], [x - s * 0.55, y - s * 0.7], [x + s * 0.55, y - s * 0.7], [x + s, y + s * 0.7]]), BARN, { edge: 'cut', fibre: false }),
    piece(ellipse(x, y - s * 0.7, s * 0.55, s * 0.25), BARN_SHADE, { edge: 'clean', shadow: false }),
    ink([[x - s * 0.3, y + s * 0.5], [x - s * 0.2, y - s * 0.4]], { width: 1.4, color: BARN_SHADE, wobble: 0.2 }),
    ink([[x + s * 0.3, y + s * 0.5], [x + s * 0.2, y - s * 0.4]], { width: 1.4, color: BARN_SHADE, wobble: 0.2 }),
  ];
}

/** A cluster of barnacles around (x, y). */
const cluster = (x: number, y: number, s = 10): Node[] => [
  ...barnacle(x, y, s),
  ...barnacle(x + s * 1.9, y + s * 0.9, s * 0.8),
  ...barnacle(x - s * 1.6, y + s * 1.2, s * 0.7),
  ...barnacle(x + s * 0.4, y + s * 2.1, s * 0.6),
];

/** A row of foam blobs along a waterline from x0 to x1. */
function foam(x0: number, x1: number, y: number, r = 20, seed = 0): Node[] {
  const out: Node[] = [];
  let i = 0;
  for (let x = x0; x < x1; x += r * 1.25) {
    const k = (i++ + seed) % 3;
    out.push(piece(ellipse(x, y + k * 3, r * (0.9 + k * 0.12), r * 0.55), FOAM, { edge: 'torn', rough: 0.6, shadow: false, fibre: false }));
  }
  return out;
}

function drawHead(mood: Mood, name: string, label: string): string {
  const sleep = mood === 'sleep';
  const happy = mood === 'happy';
  const EX = 178;
  const EY = 136;

  // Eye: a big pale ring, a dark teal iris looking back over his shoulder.
  const eye: Node[] = [
    piece(ellipse(EX, EY, 43, 45), BODY_DEEP, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(EX, EY, 36, 38), C.cream, FLAT),
    piece(circle(EX + 9, EY + 4, 21), '#3b6a7a', { edge: 'clean', shadow: false }),
    piece(circle(EX + 11, EY + 5, 12), C.ink, { edge: 'clean', shadow: false }),
    dot(EX + 18, EY - 6, 6, C.white),
    dot(EX + 4, EY + 12, 2.6, C.white, 0.7),
  ];
  // Lids: the head's own colour over the eye, with a heavy lash line. Hidden
  // by default (blink); fade them in to close the eye, out to open it.
  const lids: Node[] = [
    piece(ellipse(EX, EY, 40, 42), BODY, { edge: 'clean', shadow: false }),
    ink([[EX - 36, EY + 8], [EX - 12, EY + 20], [EX + 14, EY + 22], [EX + 38, EY + 10]], { width: 5, color: C.ink, wobble: 0.3 }),
    ink([[EX - 30, EY + 14], [EX - 38, EY + 26]], { width: 3, color: C.ink, wobble: 0.2 }),
    ink([[EX + 4, EY + 22], [EX + 4, EY + 34]], { width: 3, color: C.ink, wobble: 0.2 }),
    ink([[EX + 32, EY + 14], [EX + 42, EY + 24]], { width: 3, color: C.ink, wobble: 0.2 }),
  ];
  const shutEye: Node[] = [
    piece(ellipse(EX, EY, 41, 43), BODY_DEEP, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    ...lids,
  ];
  const happyEye: Node[] = [
    piece(ellipse(EX, EY, 41, 43), BODY_DEEP, { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }),
    ink([[EX - 32, EY + 12], [EX - 14, EY - 12], [EX + 14, EY - 12], [EX + 34, EY + 12]], { width: 6, color: C.ink, wobble: 0.3 }),
  ];

  // Mouth along the top of the pale jaw: a frown, a snooze-smile or a grin.
  const line: Pt[] = happy
    ? [[14, 236], [70, 252], [140, 260], [205, 252], [238, 226]]
    : sleep
      ? [[14, 238], [70, 250], [140, 254], [205, 248], [236, 236]]
      : [[14, 240], [70, 246], [140, 244], [200, 246], [234, 266]];
  const mouth: Node[] = [ink(line, { width: 5, color: C.ink, wobble: 0.3 })];
  const mouthOpen: Node[] = [
    piece(curve([[16, 238], [70, 248], [140, 252], [204, 248], [236, happy ? 228 : 240], [240, 292], [180, 322], [100, 318], [42, 292]], 2), C.redDark, FLAT),
    piece(ellipse(130, 302, 54, 15), C.rose, CLEAN),
    ink(line, { width: 5, color: C.ink, wobble: 0.3 }),
  ];

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 340] }, [
      group({ part: 'head', origin: [150, 330] }, [
        // the great blunt head
        piece(curve([[10, 224], [8, 170], [30, 100], [80, 48], [150, 26], [220, 40], [268, 90], [290, 170], [292, 260], [270, 320], [200, 338], [110, 334], [48, 300], [18, 262]], 3), BODY),
        // a darker cap on top, and a lighter cheek
        piece(curve([[24, 130], [50, 76], [100, 44], [160, 34], [226, 50], [262, 92], [210, 74], [150, 70], [90, 84], [48, 124]], 3), BODY_SHADE, { rough: 0.8, shadow: false }),
        piece(ellipse(236, 214, 44, 36, -10), BODY_LIGHT, { rough: 0.8, shadow: false, opacity: 0.7 }),
        // the pale lower jaw, with throat pleats
        piece(curve([[14, 238], [70, 250], [140, 254], [205, 250], [284, 236], [292, 262], [270, 320], [200, 338], [110, 334], [48, 300], [18, 262]], 2), PALE, { rough: 0.8 }),
        ...[272, 288, 304, 320].map((y, i) => ink([[40 + i * 12, y], [120, y + 6], [210 - i * 10, y + 4]], { width: 2.4, color: PALE_SHADE, wobble: 0.5 })),
        // the blowhole on top
        piece(ellipse(104, 46, 15, 6), '#3e556d', { edge: 'clean', shadow: false }),
        // a stubby flipper by his cheek
        piece(curve([[232, 262], [262, 262], [292, 300], [284, 328], [262, 308], [240, 284]], 2), BODY_SHADE),
        piece(curve([[246, 270], [264, 274], [280, 298], [262, 292]], 2), BODY_LIGHT, { shadow: false, fibre: false, opacity: 0.7 }),
        // barnacles on the brow, the snout, the cheek and the chin
        ...cluster(76, 92, 10),
        ...cluster(26, 188, 8),
        ...cluster(252, 160, 8),
        ...cluster(58, 304, 7),
        // a flushed cheek
        piece(ellipse(244, 214, 20, 12), C.rose, { ...FLAT, opacity: happy ? 0.6 : 0.4 }),
        group({ part: 'eyes', origin: [EX, EY] }, sleep ? shutEye : happy ? happyEye : eye),
        group({ part: 'lids', origin: [EX, EY], opacity: 0 }, lids),
        group({ part: 'brows', origin: [EX, 92] }, [
          piece(
            curve(sleep || happy ? [[134, 100], [180, 88], [224, 84], [226, 98], [182, 104], [138, 112]] : [[134, 92], [180, 92], [226, 68], [232, 86], [186, 112], [138, 114]], 2),
            BODY_DEEP,
            { edge: 'cut', fibre: false },
          ),
        ]),
        group({ part: 'mouth', origin: [cx, 246] }, mouth),
        group({ part: 'mouthOpen', origin: [cx, 246], opacity: 0 }, mouthOpen),
      ]),
    ]),
    // the sea foams round his chin
    ...foam(-20, 330, 332, 26, 1),
  ]);
}

/** Old Barnacle the whale, awake and grumpy: his head out of the sea, facing left, one big eye glancing back. */
export const whale = (): string => drawHead('grump', 'wishing-whale', 'Old Barnacle the whale');

/** Asleep: eye shut, a snoozing smile. */
export const whaleSleep = (): string => drawHead('sleep', 'wishing-whale-sleep', 'Old Barnacle asleep');

/** Happy at last: eye crescent shut with a smile, a big grin. */
export const whaleHappy = (): string => drawHead('happy', 'wishing-whale-happy', 'Old Barnacle happy');

// ---------------------------------------------------------------------------
// His back: the island
// ---------------------------------------------------------------------------

const W = 960;
const H = 300;
const SAND = C.sand;
const SAND_SHADE = '#c9ad80';

/** A palm leaf fanned out from the crown, drooping at the tip. */
function frond(ox: number, oy: number, angle: number, len: number, fill: string): Node {
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const tip: Pt = [ox + dx * len, oy + dy * len + len * 0.28];
  const mid: Pt = [ox + dx * len * 0.55, oy + dy * len * 0.55 - len * 0.1];
  return piece(
    curve([[ox, oy], [mid[0] + nx * len * 0.16, mid[1] + ny * len * 0.16], tip, [mid[0] - nx * len * 0.12, mid[1] - ny * len * 0.12 + 4]], 3),
    fill,
    { edge: 'cut', fibre: false },
  );
}

/** The tail: a stalk rising to two flukes. Part `tail`, origin at its base. */
const tail: Node = group({ part: 'tail', origin: [800, 262] }, [
  piece(curve([[796, 266], [812, 226], [846, 184], [872, 148], [880, 128], [896, 130], [898, 150], [890, 186], [872, 226], [852, 266]], 2), BODY_SHADE),
  piece(curve([[884, 134], [852, 108], [818, 86], [826, 114], [856, 142], [884, 152]], 2), BODY_SHADE),
  piece(curve([[892, 134], [924, 108], [958, 86], [950, 114], [920, 142], [892, 152]], 2), BODY_SHADE),
  piece(curve([[884, 136], [858, 114], [834, 98], [840, 116], [862, 138]], 2), BODY_LIGHT, { shadow: false, fibre: false, opacity: 0.8 }),
  piece(curve([[892, 136], [918, 114], [942, 98], [936, 116], [914, 138]], 2), BODY_LIGHT, { shadow: false, fibre: false, opacity: 0.8 }),
  ...barnacle(840, 214, 7),
  ...barnacle(856, 196, 5.5),
]);

const backParts = (): Node[] => [
  // the sea round his sides, as a little shadow of deeper water
  piece(ellipse(480, 284, 470, 18), '#3f8aa6', { edge: 'torn', rough: 0.6, shadow: false, fibre: false, opacity: 0.55 }),
  // the body: a long low arch, mostly under the water
  piece(curve([[10, 270], [80, 250], [170, 230], [250, 214], [480, 206], [700, 212], [790, 232], [860, 256], [906, 272], [560, 284], [200, 284]], 3), BODY),
  piece(curve([[60, 262], [170, 244], [320, 238], [320, 262], [170, 270]], 2), BODY_SHADE, { shadow: false, fibre: false, opacity: 0.55 }),
  piece(curve([[560, 244], [700, 240], [820, 256], [700, 270], [580, 266]], 2), BODY_SHADE, { shadow: false, fibre: false, opacity: 0.55 }),
  // skin lines and barnacles on the flanks
  ...[[110, 252, 230, 244], [330, 252, 470, 250], [560, 252, 690, 248], [760, 258, 840, 262]].map(([x0, y0, x1, y1]) => ink([[x0, y0], [(x0 + x1) / 2, y0 + 6], [x1, y1]], { width: 2.4, color: BODY_DEEP, wobble: 0.6, opacity: 0.6 })),
  ...cluster(150, 248, 8),
  ...cluster(420, 258, 7),
  ...cluster(640, 252, 8),
  ...cluster(770, 252, 7),
  // the sandy top, with a few speckles
  piece(curve([[236, 224], [262, 200], [330, 190], [480, 186], [640, 190], [712, 204], [734, 226], [640, 244], [330, 246]], 3), SAND),
  piece(curve([[300, 204], [400, 194], [560, 196], [680, 208], [560, 214], [380, 214]], 2), '#ecd8b4', { shadow: false, fibre: false, opacity: 0.8 }),
  ...[[300, 232], [350, 226], [420, 236], [500, 230], [560, 238], [620, 230], [680, 226], [390, 208], [470, 202], [610, 206]].map(([x, y]) => dot(x, y, 2.4, SAND_SHADE, 0.8)),
  // one little palm tree, near the right of the sand
  group({ part: 'palm', origin: [684, 204] }, [
    piece(curve([[676, 210], [682, 150], [690, 100], [686, 52], [698, 52], [704, 100], [700, 150], [698, 210]], 2), C.brown, { edge: 'cut' }),
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[678 + (i % 2) * 2, 190 - i * 24], [702 - (i % 2) * 2, 184 - i * 24]], { width: 2, color: C.brownDark, wobble: 0.3, opacity: 0.7 })),
    frond(692, 54, 188, 124, C.greenDark),
    frond(692, 54, 352, 124, C.greenDark),
    frond(692, 54, 214, 108, C.green),
    frond(692, 54, 326, 108, C.green),
    frond(692, 54, 238, 84, C.leafLight),
    frond(692, 54, 302, 84, C.leafLight),
    piece(circle(684, 62, 7), C.brownDark, { edge: 'cut', fibre: false }),
    piece(circle(699, 64, 7), C.brownDark, { edge: 'cut', fibre: false }),
  ]),
  tail,
  // foam along the waterline, both sides and round the tail
  ...foam(-10, 960, 276, 22, 0),
];

/** Old Barnacle's back, asleep: a sandy island with one palm tree and, at the far end, his tail. 960 × 300. */
export const whaleBack = cached(() => svg({ w: W, h: H, name: 'wishing-whale-back', label: 'A little island with a palm tree' }, backParts()));

/** The sand lip along the near side of his back, laid over `whale-back` to hide the bottoms of anyone standing on it. 960 × 300. */
export const whaleBackFront = cached(() =>
  svg({ w: W, h: H, name: 'wishing-whale-back-front' }, [
    piece(curve([[240, 230], [300, 222], [480, 220], [640, 224], [724, 232], [700, 252], [480, 258], [300, 254]], 3), SAND_SHADE),
    piece(curve([[270, 232], [400, 226], [560, 228], [690, 236], [560, 242], [400, 242]], 2), SAND, { shadow: false, fibre: false, opacity: 0.9 }),
    ...[[330, 246], [420, 250], [540, 248], [640, 244]].map(([x, y]) => dot(x, y, 2.4, '#a98f66', 0.8)),
  ]),
);
