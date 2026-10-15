/**
 * Everyday things from Wizard Words' picture books (each 400 × 400): the
 * wand, the broomstick, the cauldron, the owl post letter and so on, drawn
 * as the game drew them. Registered as props in index.ts.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const pic = (name: string, label: string, nodes: Parameters<typeof svg>[1]) => svg({ w: 400, h: 400, name, label }, nodes);

/** A soft ground shadow that anchors an object. */
const ground = (cx: number, cy: number, rx: number, ry = rx * 0.18): Node =>
  piece(ellipse(cx, cy, rx, ry), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false });

/** A white highlight streak, for shiny things. */
const shine = (pts: Pt[], opacity = 0.5): Node =>
  piece(curve(pts, 2), C.white, { edge: 'cut', fibre: false, shadow: false, opacity });

/** A friendly cartoon eye with a highlight. */
const eye = (x: number, y: number, r: number, white = true): Node =>
  group({ part: 'eye' }, [
    ...(white ? [piece(ellipse(x, y, r, r * 1.1), C.white, { edge: 'cut', fibre: false })] : []),
    piece(ellipse(x, y + (white ? r * 0.15 : 0), r * (white ? 0.55 : 1), r * (white ? 0.62 : 1.1)), C.ink, { edge: 'clean', shadow: false }),
    dot(x - r * 0.2, y - r * 0.2, Math.max(1.5, r * 0.22), C.white),
  ]);

/** A small smile. */
const smile = (x: number, y: number, w: number, color: string = C.ink, width = 3): Node =>
  ink([[x - w / 2, y], [x, y + w * 0.35], [x + w / 2, y]], { width, color });

/** Cheek blush. */
const blush = (x: number, y: number, r = 9): Node =>
  piece(ellipse(x, y, r, r * 0.7), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 });

/** A four-point sparkle. */
const sparkle = (x: number, y: number, r: number, color: string = C.gold): Node =>
  piece(poly([[x, y - r], [x + r * 0.25, y - r * 0.25], [x + r, y], [x + r * 0.25, y + r * 0.25], [x, y + r], [x - r * 0.25, y + r * 0.25], [x - r, y], [x - r * 0.25, y - r * 0.25]]), color, { edge: 'cut', fibre: false });

function sortingHat(): string {
  return pic('hat', 'a hat', [
    ground(200, 334, 150),
    piece(ellipse(200, 300, 160, 40), C.brownDark),
    piece(curve([[96, 300], [140, 220], [176, 120], [214, 60], [250, 40], [268, 70], [236, 96], [240, 180], [276, 250], [304, 300]], 2), C.brown),
    piece(curve([[236, 96], [268, 70], [250, 40], [292, 74], [262, 110]], 2), C.brown),
    piece(curve([[110, 290], [200, 270], [290, 290], [292, 306], [200, 290], [108, 306]], 2), C.tan),
    piece(rect(150, 196, 46, 40, 6), C.wood, { rough: 1.3 }),
    ink([[154, 200], [192, 200]], { width: 2, color: C.brownDark, opacity: 0.6 }),
    ink([[150, 214], [158, 210], [166, 218], [174, 210], [182, 218], [192, 212]], { width: 2.5, color: C.cream }),
    ink([[170, 168], [190, 156], [212, 166]], { width: 5, color: C.brownDark }),
    ink([[222, 178], [236, 170]], { width: 5, color: C.brownDark }),
    ink([[184, 252], [204, 262], [226, 252]], { width: 5, color: C.brownDark }),
  ]);
}

function cauldron(): string {
  return pic('pot', 'a pot', [
    ground(200, 350, 130),
    piece(curve([[80, 170], [320, 170], [330, 270], [280, 340], [120, 340], [70, 270]]), C.charcoal),
    piece(ellipse(200, 170, 128, 30), C.ink),
    piece(ellipse(200, 168, 112, 22), C.green, { fibre: false }),
    piece(circle(160, 160, 14), C.green),
    piece(circle(232, 154, 10), C.green),
    piece(circle(260, 166, 7), C.green),
    shine([[100, 210], [114, 204], [120, 290], [106, 296]], 0.25),
    piece(rect(116, 330, 24, 26, 6), C.ink),
    piece(rect(260, 330, 24, 26, 6), C.ink),
  ]);
}

function parchmentMap(): string {
  return pic('map', 'a map', [
    ground(200, 330, 160),
    piece(poly([[50, 110], [150, 86], [250, 110], [350, 86], [350, 300], [250, 324], [150, 300], [50, 324]]), C.sand),
    piece(poly([[150, 86], [250, 110], [250, 324], [150, 300]]), C.cream, { fibre: false }),
    ink([[80, 150], [120, 150], [120, 200], [200, 200], [200, 260], [300, 260]], { width: 3, color: C.brown, opacity: 0.7 }),
    ink([[260, 140], [320, 140], [320, 230]], { width: 3, color: C.brown, opacity: 0.7 }),
    ...[[96, 176], [110, 190], [150, 214], [172, 228], [214, 238], [236, 252], [270, 240], [290, 252]].map(([x, y], i) =>
      piece(ellipse(x, y, 5, 8, i % 2 ? 20 : -20), C.ink, { edge: 'cut', fibre: false, shadow: false }),
    ),
    piece(circle(300, 270, 12), C.red, { edge: 'cut' }),
  ]);
}

function schoolBag(): string {
  return pic('bag', 'a bag', [
    ground(200, 340, 140),
    piece(band([[120, 180], [130, 70], [270, 70], [280, 180]], 18), C.brownDark),
    piece(rect(80, 150, 240, 190, 28), C.wood),
    piece(curve([[80, 160], [200, 140], [320, 160], [318, 250], [200, 266], [82, 250]], 2), C.brown),
    piece(rect(184, 236, 32, 40, 6), C.gold, { edge: 'cut' }),
    piece(rect(194, 248, 12, 16, 3), C.brownDark, { edge: 'clean', shadow: false }),
    ink([[96, 300], [304, 300]], { width: 2.5, color: C.brownDark, opacity: 0.5 }),
  ]);
}

function rat(): string {
  return pic('rat', 'a rat', [
    ground(200, 318, 140),
    piece(band([[110, 300], [70, 290], [48, 250], [62, 214]], 10), C.pink),
    piece(curve([[110, 300], [100, 240], [150, 196], [240, 190], [300, 230], [312, 296]]), C.greyDark),
    piece(curve([[140, 300], [150, 260], [210, 240], [270, 262], [280, 300]]), C.stoneLight, { fibre: false }),
    group({ part: 'head', origin: [300, 250] }, [
      piece(curve([[260, 200], [320, 196], [370, 250], [350, 268], [290, 268]]), C.greyDark),
      piece(ellipse(278, 184, 32, 30), C.greyDark),
      piece(ellipse(280, 186, 18, 17), C.pink, { fibre: false }),
      eye(318, 226, 9, false),
      piece(ellipse(366, 252, 9, 8), C.rose, { edge: 'cut' }),
      ink([[352, 254], [390, 240]], { width: 1.8, color: C.stoneLight }),
      ink([[352, 260], [392, 262]], { width: 1.8, color: C.stoneLight }),
    ]),
    piece(ellipse(160, 308, 20, 10), C.pink),
    piece(ellipse(262, 310, 20, 10), C.pink),
  ]);
}

function bat(): string {
  const wing = (s: 1 | -1) =>
    group({ part: s === 1 ? 'wingR' : 'wingL', origin: [200, 190] }, [
      piece(
        poly([
          [200, 170], [200 + s * 70, 110], [200 + s * 160, 120], [200 + s * 178, 170], [200 + s * 146, 168],
          [200 + s * 130, 214], [200 + s * 100, 196], [200 + s * 76, 240], [200 + s * 52, 214], [200, 230],
        ]),
        C.charcoal,
      ),
      ink([[200 + s * 70, 112], [200 + s * 100, 196]], { width: 2, color: C.slate }),
      ink([[200 + s * 70, 112], [200 + s * 130, 210]], { width: 2, color: C.slate }),
    ]);
  return pic('bat', 'a bat', [
    wing(-1),
    wing(1),
    piece(ellipse(200, 214, 46, 58), C.charcoal),
    piece(poly([[166, 160], [170, 110], [194, 150]]), C.charcoal),
    piece(poly([[234, 160], [230, 110], [206, 150]]), C.charcoal),
    piece(ellipse(200, 172, 44, 38), C.charcoal),
    eye(184, 168, 11),
    eye(216, 168, 11),
    piece(poly([[186, 192], [192, 204], [198, 192]]), C.white, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[202, 192], [208, 204], [214, 192]]), C.white, { edge: 'cut', fibre: false, shadow: false }),
    blush(172, 188, 7),
    blush(228, 188, 7),
  ]);
}

function quill(): string {
  return pic('quill', 'a quill', [
    piece(rect(70, 290, 110, 80, 10), C.charcoal),
    piece(ellipse(125, 292, 55, 14), C.ink, { fibre: false }),
    piece(curve([[110, 300], [170, 200], [270, 90], [330, 40], [320, 100], [240, 200], [130, 300]], 2), C.white),
    ink([[116, 300], [320, 52]], { width: 3, color: C.stoneLight }),
    ...[0, 1, 2, 3].map((k) => ink([[180 + k * 34, 210 - k * 40], [214 + k * 34, 214 - k * 40]], { width: 2, color: C.stoneLight })),
    piece(poly([[104, 296], [120, 290], [100, 330]]), C.ink, { edge: 'cut', fibre: false }),
  ]);
}

function chessKnight(): string {
  return pic('chess', 'a chess piece', [
    ground(200, 350, 110),
    piece(rect(110, 300, 180, 50, 12), C.charcoal),
    piece(rect(140, 270, 120, 40, 8), C.charcoal),
    piece(curve([[150, 280], [150, 200], [120, 170], [130, 110], [200, 70], [280, 110], [280, 170], [250, 200], [260, 280]]), C.charcoal),
    piece(curve([[130, 150], [100, 170], [110, 200], [150, 190]], 2), C.charcoal),
    piece(poly([[210, 74], [226, 40], [240, 84]]), C.charcoal),
    eye(220, 130, 9),
    ink([[180, 90], [160, 140], [176, 200]], { width: 3, color: C.slate }),
  ]);
}

function frog(): string {
  const g = C.green;
  return pic('frog', 'a frog', [
    ground(200, 340, 140),
    piece(ellipse(100, 300, 60, 34, -20), C.greenDark),
    piece(ellipse(300, 300, 60, 34, 20), C.greenDark),
    piece(curve([[70, 320], [80, 220], [200, 180], [320, 220], [330, 320]]), g),
    piece(curve([[130, 320], [140, 260], [200, 248], [260, 260], [270, 320]]), C.goldLight, { fibre: false }),
    piece(circle(140, 180, 40), g),
    piece(circle(260, 180, 40), g),
    eye(140, 176, 24),
    eye(260, 176, 24),
    smile(200, 236, 90, C.greenDeep, 5),
    blush(120, 246, 12),
    blush(280, 246, 12),
    piece(ellipse(130, 330, 30, 12), C.greenDark),
    piece(ellipse(270, 330, 30, 12), C.greenDark),
  ]);
}

function wand(): string {
  return pic('wand', 'a wand', [
    piece(band([[90, 330], [300, 100]], 18), C.brownDark),
    piece(band([[90, 330], [140, 276]], 26), C.wood),
    ...[0, 1, 2].map((k) => ink([[104 + k * 12, 300 - k * 13], [118 + k * 12, 312 - k * 13]], { width: 3, color: C.gold })),
    ...([[318, 76, 22], [276, 54, 12], [350, 120, 12], [340, 46, 9]] as const).map(([x, y, r]) =>
      piece(poly([[x, y - r], [x + r * 0.25, y - r * 0.25], [x + r, y], [x + r * 0.25, y + r * 0.25], [x, y + r], [x - r * 0.25, y + r * 0.25], [x - r, y], [x - r * 0.25, y - r * 0.25]]), C.gold, { edge: 'cut', fibre: false }),
    ),
  ]);
}

function crescentMoon(): string {
  return pic('moon', 'the moon', [
    piece(curve([[260, 60], [170, 90], [130, 200], [180, 310], [280, 340], [210, 280], [200, 180], [230, 110]], 3), C.yellow),
    eye(196, 190, 9, false),
    smile(206, 240, 26, C.brown, 3),
    blush(214, 214, 9),
    sparkle(320, 120, 16, C.gold),
    sparkle(90, 140, 10, C.gold),
    sparkle(320, 280, 10, C.gold),
  ]);
}

function broomstick(): string {
  const bristles = Array.from({ length: 9 }, (_, i) => ink([[220 + i * 3, 240 - i * 3], [314 + i * 6, 296 - i * 13]], { width: 4, color: C.brown }));
  return pic('broom', 'a broom', [
    piece(band([[20, 110], [240, 230]], 16), C.wood),
    piece(curve([[220, 210], [300, 190], [350, 250], [340, 320], [260, 280], [220, 250]], 2), C.yellow),
    ...bristles,
    piece(band([[210, 210], [232, 254]], 18), C.brownDark),
    ink([[70, 136], [90, 146]], { width: 4, color: C.gold }),
  ]);
}

function spellbook(): string {
  return pic('book', 'a book', [
    ground(200, 340, 150),
    piece(poly([[70, 140], [200, 120], [330, 140], [330, 320], [200, 300], [70, 320]]), C.brownDark),
    piece(poly([[84, 130], [200, 112], [200, 290], [84, 306]]), C.cream),
    piece(poly([[316, 130], [200, 112], [200, 290], [316, 306]]), C.white),
    ...[150, 180, 210, 240].map((y) => ink([[104, y], [184, y - 10]], { width: 3, color: C.tan })),
    ...[150, 180, 210, 240].map((y) => ink([[216, y - 10], [296, y]], { width: 3, color: C.tan })),
    piece(poly([[240, 112], [262, 112], [262, 170], [251, 160], [240, 170]]), C.red, { edge: 'cut', fibre: false }),
  ]);
}

function toad(): string {
  const wart = (x: number, y: number, r = 6) => piece(circle(x, y, r), '#6d5a3a', { edge: 'cut', fibre: false, shadow: false });
  return pic('toad', 'a toad', [
    ground(200, 340, 140),
    piece(ellipse(100, 300, 56, 32, -20), '#8a7650'),
    piece(ellipse(300, 300, 56, 32, 20), '#8a7650'),
    piece(curve([[70, 320], [80, 220], [200, 190], [320, 220], [330, 320]]), '#9a8660'),
    wart(130, 240), wart(270, 236), wart(110, 280, 5), wart(296, 276, 5), wart(200, 220, 7),
    piece(circle(150, 200, 30), '#9a8660'),
    piece(circle(250, 200, 30), '#9a8660'),
    piece(circle(150, 198, 18), C.orange, { edge: 'cut' }),
    piece(circle(250, 198, 18), C.orange, { edge: 'cut' }),
    piece(ellipse(150, 199, 11, 6), C.ink, { edge: 'clean', shadow: false }),
    piece(ellipse(250, 199, 11, 6), C.ink, { edge: 'clean', shadow: false }),
    ink([[130, 262], [200, 276], [270, 262]], { width: 5, color: '#5a4a2a' }),
  ]);
}

function owl(): string {
  return pic('owl', 'an owl', [
    piece(band([[60, 330], [340, 320]], 20), C.brownDark),
    piece(curve([[200, 80], [290, 120], [300, 240], [260, 320], [140, 320], [100, 240], [110, 120]]), C.wood),
    piece(curve([[200, 180], [250, 210], [250, 290], [200, 316], [150, 290], [150, 210]]), C.sand, { fibre: false }),
    piece(poly([[120, 110], [130, 60], [170, 100]]), C.wood),
    piece(poly([[280, 110], [270, 60], [230, 100]]), C.wood),
    piece(circle(160, 150, 38), C.cream, { fibre: false }),
    piece(circle(240, 150, 38), C.cream, { fibre: false }),
    eye(160, 150, 22),
    eye(240, 150, 22),
    piece(poly([[190, 180], [210, 180], [200, 204]]), C.orange, { edge: 'cut' }),
    ...[[180, 240], [220, 250], [196, 280]].map(([x, y]) => ink([[x - 8, y], [x, y + 6], [x + 8, y]], { width: 3, color: C.brown })),
    piece(ellipse(170, 326, 14, 8), C.orange),
    piece(ellipse(230, 326, 14, 8), C.orange),
  ]);
}

function owlPostLetter(): string {
  return pic('letter', 'a letter', [
    ground(200, 320, 170, 22),
    piece(poly([[50, 110], [350, 100], [356, 300], [44, 306]]), C.cream),
    piece(poly([[50, 110], [200, 220], [350, 100]]), C.sand),
    ink([[44, 304], [200, 200], [356, 298]], { width: 3, color: C.sand }),
    piece(circle(200, 214, 34), C.red),
    ink([[188, 200], [194, 226], [200, 210], [206, 226], [212, 200]], { width: 4, color: '#f6e3c6' }),
  ]);
}

function galleon(): string {
  return pic('coin', 'a coin', [
    ground(200, 340, 120),
    piece(circle(200, 200, 140), '#b8862f'),
    piece(circle(200, 194, 132), C.gold, { fibre: false }),
    piece(circle(200, 194, 104), C.goldLight, { fibre: false, shadow: false }),
    ink([[200, 130], [230, 194], [200, 258], [170, 194], [200, 130]], { width: 6, color: '#b8862f' }),
    shine([[110, 150], [140, 110], [150, 118], [122, 160]], 0.6),
  ]);
}

function birthdayCake(): string {
  return pic('cake', 'a cake', [
    ground(200, 350, 150),
    piece(ellipse(200, 334, 150, 26), C.stoneLight),
    piece(rect(70, 200, 260, 130, 20), C.pink),
    piece(curve([[70, 220], [100, 196], [200, 186], [300, 196], [330, 220], [310, 250], [280, 226], [250, 254], [220, 228], [190, 256], [160, 228], [130, 254], [100, 228], [80, 250]], 2), C.white),
    piece(ellipse(200, 196, 130, 24), C.white, { fibre: false }),
    ...[140, 200, 260].map((x) => piece(rect(x - 8, 110, 16, 80, 4), [C.sky, C.yellow, C.green][(x - 140) / 60])),
    ...[140, 200, 260].map((x) => piece(curve([[x, 80], [x + 10, 100], [x, 112], [x - 10, 100]], 2), C.orange, { edge: 'cut' })),
    ...[[110, 290], [170, 300], [230, 290], [290, 300]].map(([x, y]) => dot(x, y, 6, C.red)),
  ]);
}

function redStone(): string {
  return pic('stone', 'a stone', [
    ground(200, 320, 120),
    piece(circle(200, 220, 120), 'rgba(255,190,170,0.35)', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[140, 180], [200, 130], [270, 170], [280, 260], [210, 310], [130, 270]]), C.red),
    piece(poly([[140, 180], [200, 130], [210, 210], [130, 270]]), '#c25a50', { fibre: false, shadow: false }),
    piece(poly([[200, 130], [270, 170], [210, 210]]), '#d77a70', { fibre: false, shadow: false }),
    shine([[176, 160], [196, 146], [200, 156], [182, 170]], 0.7),
  ]);
}

function flame(): string {
  return pic('flame', 'a flame', [
    piece(curve([[200, 40], [290, 160], [300, 260], [250, 340], [150, 340], [100, 260], [120, 170], [160, 200]], 2), C.orange),
    piece(curve([[200, 120], [256, 210], [250, 290], [200, 330], [150, 290], [150, 220]], 2), C.yellow, { fibre: false }),
    piece(curve([[200, 220], [226, 270], [214, 316], [186, 316], [176, 270]], 2), C.white, { fibre: false, shadow: false }),
  ]);
}

function dragon(): string {
  return pic('dragon', 'a dragon', [
    ground(200, 352, 150),
    piece(band([[270, 320], [330, 330], [370, 290], [360, 250]], 26), C.green),
    piece(poly([[360, 250], [380, 220], [344, 236]]), C.greenDark, { edge: 'cut' }),
    piece(poly([[160, 200], [80, 110], [120, 190], [60, 180], [140, 240]]), C.greenDark),
    piece(curve([[120, 340], [130, 240], [220, 210], [290, 250], [300, 340]]), C.green),
    piece(curve([[170, 340], [180, 270], [220, 256], [250, 280], [256, 340]], 2), C.goldLight, { fibre: false }),
    piece(curve([[190, 220], [170, 140], [210, 90], [280, 100], [300, 150], [270, 190], [230, 200]]), C.green),
    piece(poly([[220, 96], [214, 56], [240, 92]]), C.goldLight, { edge: 'cut' }),
    piece(poly([[262, 98], [270, 58], [284, 104]]), C.goldLight, { edge: 'cut' }),
    eye(240, 132, 13),
    dot(290, 160, 4, C.greenDeep),
    smile(266, 170, 30, C.greenDeep, 4),
    ...[[140, 234], [180, 214], [214, 210]].map(([x, y]) => piece(poly([[x - 10, y + 6], [x, y - 14], [x + 10, y + 6]]), C.goldLight, { edge: 'cut' })),
    ink([[310, 150], [340, 140], [360, 150]], { width: 4, color: C.stoneLight }),
  ]);
}

function pumpkin(): string {
  return pic('pumpkin', 'a pumpkin', [
    ground(200, 340, 150),
    piece(ellipse(130, 240, 70, 96), C.ginger),
    piece(ellipse(270, 240, 70, 96), C.ginger),
    piece(ellipse(200, 240, 80, 104), C.orange),
    ink([[200, 140], [200, 340]], { width: 4, color: C.ginger }),
    piece(band([[200, 146], [214, 100]], 16), C.greenDark),
    piece(ellipse(244, 116, 30, 14, -20), C.green),
    shine([[160, 180], [172, 170], [176, 260], [164, 266]], 0.35),
  ]);
}

function cobweb(): string {
  const ends: Pt[] = [[60, 20], [100, 160], [200, 260], [300, 340], [380, 360]];
  const threads = ends.map(([x, y]) => ink([[380, 20], [x, y]], { width: 3, color: C.greyDark }));
  const rings = [0.3, 0.55, 0.8].map((t) =>
    ink(ends.map(([x, y]) => [380 + (x - 380) * t, 20 + (y - 20) * t] as Pt), { width: 3, color: C.greyDark }),
  );
  return pic('cobweb', 'a cobweb', [
    piece(poly([[40, 20], [380, 20], [380, 380]]), C.stoneLight, { shadow: false }),
    ...threads,
    ...rings,
    piece(circle(240, 180, 16), C.charcoal),
    ...[-1, 1].flatMap((s) => [0, 1].map((k) => ink([[240, 180], [240 + s * 24, 170 + k * 16]], { width: 3, color: C.charcoal }))),
    eye(234, 176, 4),
    eye(246, 176, 4),
  ]);
}

function lantern(): string {
  return pic('lantern', 'a lantern', [
    ground(200, 350, 100),
    ink([[160, 90], [200, 50], [240, 90]], { width: 8, color: C.charcoal }),
    piece(rect(140, 90, 120, 30, 8), C.charcoal),
    piece(rect(150, 116, 100, 180, 10), 'rgba(255,225,150,0.85)'),
    piece(curve([[200, 250], [176, 210], [200, 160], [224, 210]], 2), C.orange, { edge: 'cut', fibre: false }),
    piece(curve([[200, 244], [188, 216], [200, 186], [212, 216]], 2), C.yellow, { edge: 'cut', fibre: false, shadow: false }),
    ...[150, 250].map((x) => piece(rect(x - 6, 116, 12, 180, 3), C.charcoal, { edge: 'cut' })),
    piece(rect(134, 290, 132, 40, 8), C.charcoal),
  ]);
}

function magicWand(): string {
  return pic('magic', 'magic', [
    piece(band([[80, 340], [240, 170]], 16), C.charcoal),
    piece(band([[230, 180], [250, 160]], 16), C.white),
    sparkle(280, 120, 36),
    sparkle(200, 90, 16, C.goldLight),
    sparkle(340, 180, 18, C.goldLight),
    sparkle(330, 80, 12, C.sky),
    sparkle(240, 40, 10, C.pink),
    sparkle(360, 250, 10, C.sky),
    ink([[256, 150], [290, 100], [320, 120], [340, 80]], { width: 3, color: C.gold, opacity: 0.6 }),
  ]);
}
