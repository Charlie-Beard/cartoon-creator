/**
 * Sir Cadogan, the mad little knight who guards the Gryffindor Tower portrait
 * for a while (book 3; original paper art). Short, squat, very brave and very
 * silly: dented silver armour that is a size too big (the pauldrons droop off
 * his shoulders), a helmet with the visor pushed up, a round pink face, a
 * huge bristly ginger moustache, fierce bushy eyebrows, a red plume, and a
 * sword held high in his right hand. He never actually fights anybody.
 *
 * Parts: figure, head (origin at the neck [150, 196], so it can nod or
 * wobble; the plume, mouth, mouthOpen and lids are inside it), lids, mouth,
 * mouthOpen, plume (origin at its base [150, 56], to wobble; it rides on the
 * head) and armR (the sword arm, origin at the shoulder [232, 236]: swing it
 * to brandish; the sword goes with it).
 *
 * Layout in the 300 × 340 box: the plume tops out at y 6, the helmet dome is
 * y 40 to 108 with the raised visor on its front, the round face is centred
 * on (150, 144) (about 112 wide) with the moustache across y 158 to 190 and
 * the mouth under it at y 192, the gorget is y 186 to 226, and the squat
 * breastplate runs to the bottom. The sword stands at x 272 (blade to y 14).
 *
 * Pose `fallen`: the same face, in the same place, but he is sitting on the
 * ground in a heap, helmet knocked sideways, boots stuck out in front, dazed
 * and fine (the sword is still held up, crooked, as if nothing happened).
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';

const FX = 150;
const FY = 138;

const STEEL = '#b4bec7';
const STEEL_LIGHT = '#dde4ea';
const STEEL_DARK = '#7e8a95';
const DENT = '#8d98a3';
const FACE = '#eba296';
const FACE_SHADE = '#d4837a';
const GINGER = '#c8622e';
const GINGER_DARK = '#9a4420';
const GINGER_LIGHT = '#e08a4c';
const PLUME = '#b3302c';
const PLUME_LIGHT = '#d4574c';
const LEATHER = '#8a5a3b';
const NECK = '#e0897f';

const rectPts = (x: number, y: number, w: number, h: number) =>
  poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

/** A rivet: a tiny round bolt with a highlight. */
const rivet = (x: number, y: number): Node[] => [
  piece(circle(x, y, 3.6), STEEL_DARK, { edge: 'clean', fibre: false, shadow: false }),
  dot(x - 1, y - 1, 1.3, STEEL_LIGHT),
];

/** A dent: a darker patch with a bright edge, as if someone sat on it. */
const dent = (x: number, y: number, rx: number, ry: number, rot = 0): Node[] => [
  piece(ellipse(x, y, rx, ry, rot), DENT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.75 }),
  piece(ellipse(x - rx * 0.25, y - ry * 0.35, rx * 0.6, ry * 0.3, rot), STEEL_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
];

/** The plume: a fat, curling red feather, wobbling from its base at (150, 56). */
function plume(): Node {
  return group({ part: 'plume', origin: [150, 56] }, [
    // a holder on top of the helmet
    piece(poly([[140, 62], [160, 62], [156, 50], [144, 50]]), STEEL_DARK, { edge: 'cut', fibre: false, shadow: false }),
    // the feather: a big curl that flops forward over the top
    piece(curve([[144, 54], [126, 30], [138, 8], [168, 6], [196, 18], [200, 40], [182, 34], [172, 26], [160, 30], [160, 54]], 2), PLUME),
    piece(curve([[150, 48], [138, 30], [146, 16], [164, 14], [182, 22]], 2), PLUME_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.75 }),
    ink([[152, 50], [150, 32], [160, 18], [182, 24]], { width: 2, color: '#7d2a26' }),
  ]);
}

/** The helmet dome, the raised visor on its front, and cheek plates. */
function helmet(): Node[] {
  return [
    // cheek plates down the sides of the face
    piece(curve([[94, 112], [90, 150], [100, 182], [112, 174], [108, 130]], 2), STEEL),
    piece(curve([[206, 112], [210, 150], [200, 182], [188, 174], [192, 130]], 2), STEEL),
    ...rivet(100, 134),
    ...rivet(200, 134),
    // the dome
    piece(curve([[84, 118], [80, 80], [112, 48], [150, 40], [188, 48], [220, 80], [216, 118], [186, 104], [150, 98], [114, 104]], 2), STEEL, { edge: 'cut' }),
    piece(ellipse(124, 66, 22, 9, -30), STEEL_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    ...dent(186, 70, 12, 8, 30),
    // the visor, pushed up and resting on the front of the dome: a rounded plate with slits
    piece(curve([[100, 108], [104, 80], [150, 66], [196, 80], [200, 108], [150, 100]], 2), STEEL_DARK, { edge: 'cut' }),
    ...[0, 1, 2].map((i) => ink([[116 + i * 2, 84 + i * 6], [150, 78 + i * 6], [184 - i * 2, 84 + i * 6]], { width: 2.4, color: '#4e5862' })),
    // the rim of the helmet over the brow
    piece(curve([[84, 118], [150, 100], [216, 118], [214, 126], [150, 110], [86, 126]], 1), STEEL, { edge: 'cut', fibre: false }),
    ...rivet(92, 120),
    ...rivet(208, 120),
    ...rivet(150, 106),
  ];
}

/** One half of the huge bristly moustache, sweeping out and curling up at the tip. */
function whisker(s: 1 | -1): Node[] {
  const x = (v: number) => FX + s * v;
  return [
    piece(curve([[x(2), 166], [x(22), 160], [x(50), 166], [x(70), 158], [x(78), 144], [x(88), 148], [x(88), 168], [x(68), 186], [x(36), 190], [x(8), 184]], 2), GINGER, { edge: 'torn' }),
    // bristles on the lower edge
    ...[10, 26, 42, 58, 72].map((v, i) => ink([[x(v), 180 + (i > 2 ? -2 : 2)], [x(v + 3), 192 - i * 2]], { width: 2.4, color: GINGER_DARK })),
    // lighter strands across it
    ink([[x(8), 168], [x(32), 166], [x(58), 170]], { width: 2, color: GINGER_LIGHT }),
    ink([[x(14), 176], [x(44), 176], [x(70), 166]], { width: 2, color: GINGER_LIGHT }),
  ];
}

/** Fierce, bushy eyebrows, slanting down to the nose; `lift` raises them (fallen: surprised). */
function brows(lift = 0): Node[] {
  return [-1, 1].flatMap((s) => {
    const x = (v: number) => FX + s * v;
    const y = 116 + lift;
    return [
      piece(curve([[x(52), y - 4], [x(40), y - 8], [x(18), y - 2], [x(4), y + 10], [x(18), y + 6], [x(38), y + 2]], 2), GINGER_DARK, { edge: 'torn', shadow: false }),
      ...[44, 30, 16].map((v) => ink([[x(v), y - 2], [x(v - 3), y - 11]], { width: 3, color: GINGER })),
    ];
  });
}

/**
 * The head part: round pink face, eyes, brows, nose, moustache, mouth, and the
 * helmet and plume on top. `dazed` points the eyes in different directions;
 * `tilt` knocks the whole head sideways about the neck.
 */
function head(dazed = false, tilt = 0): Node {
  const eye = (s: 1 | -1): Node[] => {
    const x = FX + s * 27;
    const y = FY + 8;
    // fierce: eyes look straight out; dazed: one up-left, one down-right
    const px = dazed ? (s === -1 ? 3 : -4) : 0;
    const py = dazed ? (s === -1 ? -4 : 4) : 1;
    return [
      piece(ellipse(x, y, 13, 14), C.white, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(x + px, y + py, 7.5), '#3f6f96', { edge: 'clean', shadow: false }),
      piece(circle(x + px, y + py, 3.8), C.ink, { edge: 'clean', shadow: false }),
      dot(x + px - 3, y + py - 3, 2.2, C.white),
    ];
  };
  const inner: Node[] = [
    // neck, ears, the round face
    piece(ellipse(FX, 196, 26, 16), NECK, { edge: 'cut', fibre: false }),
    piece(ellipse(FX - 56, FY + 12, 10, 15), FACE, { edge: 'cut' }),
    piece(ellipse(FX + 56, FY + 12, 10, 15), FACE, { edge: 'cut' }),
    piece(ellipse(FX, FY + 8, 56, 58), FACE),
    // very rosy cheeks
    piece(ellipse(FX - 38, FY + 32, 15, 10), C.rose, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    piece(ellipse(FX + 38, FY + 32, 15, 10), C.rose, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    ...eye(-1),
    ...eye(1),
    group({ part: 'lids', opacity: 0 }, [-1, 1].flatMap((s) => [
      piece(ellipse(FX + s * 27, FY + 8, 14.5, 15.5), FACE, { edge: 'cut', fibre: false, shadow: false }),
      ink([[FX + s * 27 - 11, FY + 10], [FX + s * 27, FY + 16], [FX + s * 27 + 11, FY + 10]], { width: 2.6, color: C.ink }),
    ])),
    // a round bulb of a nose
    piece(ellipse(FX, FY + 28, 15, 13), FACE_SHADE, { edge: 'cut', fibre: false }),
    piece(ellipse(FX - 4, FY + 24, 5, 3.5), C.rose, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    // the mouth, under the moustache
    group({ part: 'mouth' }, [
      ink([[FX - 14, 194], [FX, dazed ? 192 : 199], [FX + 14, 194]], { width: 3.2, color: C.redDark }),
    ]),
    group({ part: 'mouthOpen', opacity: 0 }, [
      piece(ellipse(FX, 196, 17, 12), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(FX, 202, 10, 5), C.rose, { edge: 'clean', fibre: false, shadow: false }),
    ]),
    ...whisker(-1),
    ...whisker(1),
    ...helmet(),
    ...brows(dazed ? -4 : 0),
    plume(),
  ];
  return group({ part: 'head', origin: [FX, 196] }, [
    group({ transform: tilt ? `rotate(${tilt} ${FX} 196)` : undefined }, inner),
  ]);
}

/** The sword: a long blade with a notch in it, a gold cross-guard, a leather grip. */
function sword(x: number, top: number, bottom: number): Node[] {
  return [
    piece(poly([[x - 7, bottom - 28], [x - 7, top + 16], [x, top], [x + 7, top + 16], [x + 7, bottom - 28]]), STEEL_LIGHT, { edge: 'cut' }),
    ink([[x, top + 20], [x, bottom - 32]], { width: 2.4, color: STEEL }),
    // a nick in the blade, because he has never fought anyone with it
    piece(poly([[x + 8, top + 70], [x + 1, top + 74], [x + 8, top + 80]]), C.cream, { edge: 'clean', fibre: false, shadow: false }),
    piece(poly([[x - 26, bottom - 28], [x + 26, bottom - 28], [x + 22, bottom - 20], [x - 22, bottom - 20]]), C.gold, { edge: 'cut', fibre: false }),
    piece(circle(x - 26, bottom - 24, 5), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(x + 26, bottom - 24, 5), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(band([[x, bottom - 20], [x, bottom]], 9), LEATHER, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

/** The sword arm from the shoulder at (232, 236): armour sleeve, a gauntlet fist, the sword high. */
function armR(sway = 0): Node {
  return group({ part: 'armR', origin: [232, 236] }, [
    group({ transform: sway ? `rotate(${sway} 232 236)` : undefined }, [
      ...sword(272, 14, 218),
      // upper arm out to the elbow, forearm up to the fist
      piece(band([[236, 244], [268, 258]], 36), STEEL),
      piece(band([[268, 258], [272, 222]], 32), STEEL),
      ...rivet(268, 256),
      // gauntlet: a chunky mitten with finger ridges round the grip
      piece(ellipse(272, 210, 20, 17), STEEL_DARK, { edge: 'cut' }),
      ...[-10, -3, 4, 11].map((d) => ink([[272 + d, 200], [272 + d, 218]], { width: 1.8, color: '#4e5862' })),
    ]),
  ]);
}

/** The squat body: breastplate, pauldrons, red belt, left arm on hip. */
function armour(): Node[] {
  return [
    // left arm, bent with the fist on the hip
    piece(band([[66, 240], [36, 276], [66, 306]], 32), STEEL),
    piece(ellipse(70, 308, 15, 13), STEEL_DARK, { edge: 'cut' }),
    // breastplate: broad, short, a bit too big
    piece(curve([[38, 345], [44, 262], [96, 216], [150, 210], [204, 216], [256, 262], [262, 345]], 2), STEEL, { edge: 'cut' }),
    piece(ellipse(118, 262, 24, 40, 10), STEEL_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.55 }),
    ink([[150, 232], [150, 300]], { width: 2.6, color: STEEL_DARK }),
    ...dent(94, 288, 15, 10, -20),
    ...dent(196, 252, 12, 8, 15),
    // gorget round the neck
    piece(curve([[104, 214], [112, 192], [150, 186], [188, 192], [196, 214], [150, 228]], 2), STEEL_DARK, { edge: 'cut' }),
    ...rivet(124, 208),
    ...rivet(176, 208),
    // droopy, oversized pauldrons
    piece(curve([[42, 262], [36, 232], [66, 208], [104, 212], [112, 232], [92, 252]], 2), STEEL, { edge: 'cut' }),
    piece(curve([[258, 262], [264, 232], [234, 208], [196, 212], [188, 232], [208, 252]], 2), STEEL, { edge: 'cut' }),
    ...[0, 1].map((i) => ink([[50 + i * 6, 244 - i * 6], [76 + i * 6, 222 - i * 4], [104, 224]], { width: 2, color: STEEL_DARK })),
    // red leather belt with a gold buckle
    piece(poly([[40, 312], [260, 312], [262, 330], [38, 330]]), C.redDark, { edge: 'cut', fibre: false }),
    piece(rectPts(138, 310, 24, 22), C.gold, { edge: 'cut', fibre: false }),
    piece(rectPts(145, 316, 10, 10), C.redDark, { edge: 'clean', fibre: false, shadow: false }),
  ];
}

export function sirCadogan(): string {
  return svg({ w: 300, h: 340, name: 'sir-cadogan', label: 'Sir Cadogan, the little knight', className: 'portrait' }, [
    group({ part: 'figure' }, [
      ...armour(),
      head(),
      armR(),
    ]),
  ]);
}

/** Cadogan sitting in a heap on the ground, helmet askew, a bit dazed but fine. */
export function sirCadoganFallen(): string {
  return svg({ w: 300, h: 340, name: 'sir-cadogan-fallen', label: 'Sir Cadogan sitting in a heap', className: 'portrait' }, [
    group({ part: 'figure' }, [
      // soft dust puffs on the ground
      ...[[34, 322, 30, 12], [266, 324, 32, 12], [150, 334, 70, 8]].map(([x, y, rx, ry]) =>
        piece(ellipse(x, y, rx, ry), C.cream, { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 })),
      // left arm flopped down on the ground
      piece(band([[70, 244], [44, 282], [48, 308]], 30), STEEL),
      piece(ellipse(50, 312, 14, 12), STEEL_DARK, { edge: 'cut' }),
      // slumped body, wider and lower
      piece(curve([[36, 328], [44, 270], [96, 224], [150, 218], [204, 224], [256, 270], [264, 328], [200, 312], [150, 316], [100, 312]], 2), STEEL, { edge: 'cut' }),
      piece(ellipse(118, 266, 22, 34, 10), STEEL_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.5 }),
      ...dent(98, 290, 17, 11, -20),
      ...dent(194, 262, 12, 8, 15),
      // a big new dent in the belly
      ...dent(160, 296, 20, 12, 5),
      piece(poly([[60, 300], [240, 300], [244, 316], [56, 316]]), C.redDark, { edge: 'cut', fibre: false }),
      piece(rectPts(138, 298, 24, 20), C.gold, { edge: 'cut', fibre: false }),
      // legs stuck out in front, boots up
      piece(band([[112, 296], [84, 316], [62, 322]], 38), STEEL),
      piece(band([[188, 296], [216, 316], [240, 320]], 38), STEEL),
      piece(ellipse(54, 318, 24, 14, -20), STEEL_DARK, { edge: 'cut' }),
      piece(ellipse(248, 316, 24, 14, 20), STEEL_DARK, { edge: 'cut' }),
      ...rivet(86, 314),
      ...rivet(214, 314),
      // gorget and drooping pauldrons
      piece(curve([[104, 222], [112, 198], [150, 192], [188, 198], [196, 222], [150, 232]], 2), STEEL_DARK, { edge: 'cut' }),
      piece(curve([[42, 270], [38, 240], [68, 216], [104, 220], [112, 240], [92, 260]], 2), STEEL, { edge: 'cut' }),
      piece(curve([[258, 270], [262, 240], [232, 216], [196, 220], [188, 240], [208, 260]], 2), STEEL, { edge: 'cut' }),
      // head knocked sideways: the helmet askew, the face the same size and place
      head(true, -14),
      armR(8),
    ]),
  ]);
}
