/**
 * Keepsakes: small 200 × 200 paper illustrations of things from the tree and
 * the lands (Moon-Face's lamp, Mr Watzisname's nightcap, Dame Snap's snapped
 * ruler …). They are drawn for the game's treasure room but make good props.
 * Where one is built from a counting prop (props.ts) it reuses that drawing.
 */
import { C } from '../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, raw, rect, svg, type Node } from '../../art/paper';
import { flat, glint, ground, propNodes, scallop, shine, starPts } from './props';

export type Draw = () => Node[];

/** Any nodes moved and scaled. */
export const at = (x: number, y: number, s: number, nodes: Node[], rot = 0): Node =>
  group({ transform: `translate(${x} ${y}) scale(${s})${rot ? ` rotate(${rot})` : ''}` }, nodes);

/** Andika lettering laid on the art (sums on a blackboard, £1 on a coin). */
export const text = (x: number, y: number, s: string, size: number, fill: string, rot = 0): Node =>
  raw(
    `<text x="${x}" y="${y}" font-family="Andika, sans-serif" font-weight="700" font-size="${size}" fill="${fill}" text-anchor="middle"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${s}</text>`,
  );

export const cut = { edge: 'cut' as const };
export const cutFlat = { edge: 'cut' as const, fibre: false as const };

/** Mixes two #rrggbb colours (t = 0 → a, 1 → b). */
export function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

export const KEEPSAKE_ART: Record<string, Draw> = {
  moonLamp: () => [
    ground(100, 182, 52, 7),
    piece(curve([[64, 180], [72, 160], [128, 160], [136, 180]], 1), C.bark),
    piece(rect(94, 128, 12, 36, 3), C.barkLight),
    flat(circle(100, 82, 66), C.candle, 0.35),
    piece(circle(100, 82, 50), C.goldLight),
    flat(circle(112, 70, 30), C.candle, 0.7),
    ink([[78, 76], [84, 80], [90, 76]], { width: 3, color: C.brown }),
    ink([[110, 76], [116, 80], [122, 76]], { width: 3, color: C.brown }),
    ink([[84, 98], [100, 108], [116, 98]], { width: 3.5, color: C.brown }),
    flat(ellipse(76, 92, 7, 5), C.pink, 0.7),
    flat(ellipse(124, 92, 7, 5), C.pink, 0.7),
  ],
  nightcap: () => [
    ground(92, 174, 70, 8),
    piece(curve([[30, 156], [56, 96], [100, 60], [150, 58], [178, 92], [176, 130], [164, 130], [156, 98], [128, 92], [148, 158]], 2), C.sky),
    ink([[66, 98], [118, 150]], { width: 7, color: C.white }),
    ink([[96, 72], [140, 120]], { width: 7, color: C.white }),
    ink([[138, 64], [158, 108]], { width: 7, color: C.white }),
    piece(rect(24, 146, 132, 24, 10), C.white, { fibre: C.snowShade }),
    piece(scallop(172, 138, 14, 2, 8), C.white, { fibre: C.snowShade }),
    text(40, 60, 'z', 22, C.blueDark, -10),
    text(56, 40, 'z', 28, C.blueDark, -10),
    text(78, 22, 'Z', 32, C.blueDark, -10),
  ],
  pixieCap: () => [
    ground(98, 172, 70, 8),
    piece(curve([[44, 150], [64, 96], [104, 48], [150, 22], [178, 36], [160, 52], [134, 70], [146, 150]], 2), C.leafDark),
    flat(curve([[70, 120], [100, 76], [130, 52], [136, 60], [108, 90], [84, 126]], 2), C.leaf, 0.6),
    piece(curve([[34, 152], [96, 136], [160, 150], [154, 168], [96, 158], [40, 170]], 2), C.toadRed),
    piece(circle(178, 44, 11), C.ribbon, cut),
    ink([[172, 48], [184, 48]], { width: 2.5, color: C.brassDark }),
    dot(178, 50, 2.5, C.brassDark),
  ],
  peg: () => [
    ink([[0, 46], [60, 54], [140, 54], [200, 44]], { width: 4, color: C.tan }),
    piece(curve([[76, 70], [124, 70], [124, 132], [150, 142], [154, 168], [104, 172], [78, 150]], 1), C.sky),
    flat(curve([[118, 136], [150, 144], [154, 168], [130, 170]], 1), C.white),
    flat(rect(76, 74, 48, 12), C.white),
    flat(rect(77, 100, 47, 8), C.blue),
    piece(rect(88, 26, 12, 70, 5), C.sand),
    piece(rect(102, 26, 12, 70, 5), C.sand),
    ink(circle(101, 48, 7), { width: 3, color: C.steelDark, closed: true }),
  ],
  lemonade: () => [
    ground(96, 178, 64, 8),
    ink(ellipse(150, 108, 18, 30), { width: 10, color: C.glass, closed: true }),
    piece(curve([[44, 44], [148, 44], [150, 170], [42, 170]], 1), C.glass),
    flat(curve([[46, 80], [146, 80], [148, 168], [44, 168]], 1), C.lemon),
    piece(poly([[36, 34], [52, 44], [52, 52]]), C.glass, cutFlat),
    dot(70, 120, 4, C.white, 0.8),
    dot(110, 140, 3, C.white, 0.8),
    dot(92, 100, 3.5, C.white, 0.8),
    shine([[56, 54], [64, 54], [64, 150], [56, 150]], 0.5),
    piece(band([[110, 70], [124, 20], [140, 12]], 6), C.topsyPink, cut),
    piece(circle(156, 44, 20), C.lemon),
    ink(circle(156, 44, 14), { width: 2, color: C.white, closed: true }),
    ...[0, 1, 2].map((i) => ink([[156 - 14 * Math.cos(i), 44 - 14 * Math.sin(i * 2.1)], [156 + 14 * Math.cos(i), 44 + 14 * Math.sin(i * 2.1)]], { width: 2, color: C.white })),
  ],
  biscuitTin: () => [
    ground(100, 176, 76, 9),
    piece(ellipse(140, 70, 54, 16, -28), mix(C.teal, '#000000', 0.15)),
    flat(ellipse(140, 70, 44, 10, -28), C.ribbon, 0.8),
    at(54, 50, 0.55, propNodes('popBiscuit')),
    at(94, 40, 0.55, propNodes('popBiscuit')),
    piece(rect(28, 86, 144, 82, 12), C.teal),
    flat(rect(28, 98, 144, 10), C.ribbon),
    flat(rect(28, 148, 144, 8), C.ribbon),
    ...[52, 84, 116, 148].map((x) => dot(x, 128, 6, C.sherbet)),
    piece(ellipse(100, 86, 74, 10), mix(C.teal, '#000000', 0.25)),
  ],
  blackboard: () => [
    ground(100, 186, 70, 6),
    ink([[56, 150], [40, 186]], { width: 6, color: C.wood }),
    ink([[144, 150], [160, 186]], { width: 6, color: C.wood }),
    piece(rect(20, 30, 160, 120, 6), C.wood),
    piece(rect(30, 40, 140, 100, 3), C.greenDeep, cutFlat),
    text(92, 104, '1 + 1 = 2', 32, C.chalk),
    ink([[136, 120], [146, 130], [164, 108]], { width: 4, color: C.chalk }),
    piece(rect(50, 144, 30, 8, 3), C.chalk, cut),
  ],
  bell: () => [
    ground(100, 180, 56, 7),
    piece(rect(90, 12, 20, 50, 6), C.wood),
    piece(curve([[56, 150], [62, 84], [100, 56], [138, 84], [144, 150], [160, 162], [40, 162]], 2), C.brass),
    flat(curve([[64, 140], [70, 90], [86, 74], [80, 110], [78, 148]], 2), C.goldLight, 0.6),
    piece(circle(100, 168, 10), C.brassDark, cut),
    ink([[30, 110], [22, 100]], { width: 3, color: C.snapInk }),
    ink([[34, 128], [20, 128]], { width: 3, color: C.snapInk }),
    ink([[170, 110], [178, 100]], { width: 3, color: C.snapInk }),
    ink([[166, 128], [180, 128]], { width: 3, color: C.snapInk }),
  ],
  snappedRuler: () => [
    ground(100, 168, 82, 8),
    group({ transform: 'rotate(-24 60 110)' }, [
      piece(poly([[10, 96], [100, 96], [92, 104], [104, 112], [96, 124], [10, 124]]), C.ruler),
      ...[20, 32, 44, 56, 68, 80].map((x, i) => ink([[x, 96], [x, i % 2 ? 106 : 112]], { width: 2.5, color: C.chalk })),
    ]),
    group({ transform: 'rotate(20 140 110)' }, [
      piece(poly([[112, 96], [104, 104], [116, 112], [108, 124], [196, 124], [196, 96]]), C.ruler),
      ...[124, 136, 148, 160, 172, 184].map((x, i) => ink([[x, 96], [x, i % 2 ? 106 : 112]], { width: 2.5, color: C.chalk })),
    ]),
    piece(poly([[100, 70], [106, 60], [104, 74]]), C.wood, cutFlat),
    piece(poly([[92, 140], [100, 150], [90, 148]]), C.wood, cutFlat),
    glint(100, 40, 1, C.ribbon),
  ],
  wand: () => [
    ground(84, 178, 56, 6),
    piece(band([[34, 174], [130, 70]], 12), C.snapInk),
    piece(band([[34, 174], [54, 152]], 13), C.ribbon, cut),
    piece(curve(starPts(142, 56, 30, 13), 1), C.starYellow),
    glint(70, 40, 0.8, C.goldLight),
    glint(178, 104, 0.6, C.goldLight),
    glint(168, 18, 0.5, C.goldLight),
    dot(100, 30, 3, C.goldLight),
    dot(184, 70, 3, C.goldLight),
  ],
  spellbook: () => [
    ground(100, 168, 86, 9),
    piece(curve(poly([[10, 150], [100, 166], [190, 150], [184, 82], [100, 96], [16, 82]]), 1), C.blueDark),
    piece(curve(poly([[20, 144], [98, 156], [98, 92], [24, 76]]), 1), C.cream),
    piece(curve(poly([[180, 144], [102, 156], [102, 92], [176, 76]]), 1), C.cream),
    ...[96, 108, 120, 132].map((y) => ink([[34, y - 8], [86, y + 2]], { width: 2.5, color: C.tan })),
    ...[96, 108, 120, 132].map((y) => ink([[114, y + 2], [166, y - 8]], { width: 2.5, color: C.tan })),
    ink([[100, 90], [88, 60], [112, 40], [92, 18]], { width: 4, color: C.lilac, opacity: 0.8 }),
    glint(118, 26, 0.7, C.goldLight),
    glint(76, 40, 0.5, C.goldLight),
  ],
  cauldron: () => [
    piece(curve([[72, 196], [80, 172], [100, 184], [120, 168], [130, 196]], 1), C.flame, cut),
    piece(band([[52, 150], [40, 184]], 9), C.snapInk),
    piece(band([[148, 150], [160, 184]], 9), C.snapInk),
    piece(curve([[26, 80], [174, 80], [168, 136], [130, 170], [70, 170], [32, 136]], 2), C.snapInk),
    piece(ellipse(100, 80, 80, 16), C.charcoal),
    piece(curve([[28, 82], [50, 66], [80, 72], [110, 62], [150, 70], [172, 82], [100, 92]], 2), C.topsyGreen),
    piece(circle(76, 50, 10), C.topsyGreen, cut),
    piece(circle(120, 36, 7), C.topsyGreen, cut),
    piece(circle(100, 16, 5), C.topsyGreen, cut),
    shine([[44, 104], [52, 98], [60, 130], [52, 132]], 0.2),
  ],
  snowGlobe: () => [
    ground(100, 184, 62, 7),
    piece(circle(100, 88, 70), C.glass),
    piece(curve([[40, 120], [100, 108], [160, 120], [150, 140], [50, 140]], 2), C.snow, cutFlat),
    piece(poly([[100, 44], [124, 84], [112, 84], [130, 112], [70, 112], [88, 84], [76, 84]]), C.sledgeGreen, cut),
    piece(rect(95, 112, 10, 12), C.bark, cut),
    ...[[60, 60], [80, 40], [130, 50], [146, 80], [56, 92], [120, 30], [142, 106]].map(([x, y]) => dot(x, y, 3, C.white)),
    shine([[50, 50], [70, 30], [76, 34], [56, 56]], 0.6),
    piece(curve([[42, 150], [50, 136], [150, 136], [158, 150], [166, 180], [34, 180]], 1), C.wood),
    flat(rect(46, 156, 108, 8), C.ribbon),
  ],
  lantern: () => [
    ground(100, 186, 50, 6),
    flat(circle(100, 112, 70), C.candle, 0.3),
    ink(ellipse(100, 30, 22, 20), { width: 5, color: C.charcoal }),
    piece(poly([[64, 56], [136, 56], [124, 40], [76, 40]]), C.charcoal),
    piece(rect(62, 56, 76, 108, 4), C.candle),
    piece(curve([[100, 92], [110, 110], [108, 122], [92, 122], [90, 110]], 2), C.flame, cut),
    piece(rect(92, 122, 16, 30, 3), C.china, cut),
    piece(rect(58, 160, 84, 18, 4), C.charcoal),
    piece(rect(58, 56, 8, 108), C.charcoal, cut),
    piece(rect(134, 56, 8, 108), C.charcoal, cut),
  ],
  padlock: () => [
    ground(100, 184, 60, 7),
    ink([[60, 96], [60, 52], [80, 22], [116, 22], [136, 46]], { width: 16, color: C.steel }),
    piece(rect(40, 88, 120, 92, 14), C.steelDark),
    piece(circle(100, 124, 12), C.brass, cut),
    piece(poly([[94, 128], [106, 128], [110, 156], [90, 156]]), C.brass, cut),
    shine([[50, 98], [58, 98], [58, 168], [50, 168]], 0.3),
    glint(160, 36, 0.8, C.ribbon),
  ],
  crown: () => [
    ground(100, 168, 76, 8),
    piece(poly([[30, 156], [24, 64], [64, 104], [100, 44], [136, 104], [176, 64], [170, 156]]), C.gold),
    piece(rect(28, 136, 144, 26, 6), C.starYellowDark),
    ...[[24, 60], [100, 40], [176, 60]].map(([x, y]) => piece(circle(x, y, 9), C.goldLight, cut)),
    piece(circle(64, 149, 8), C.cherry, cut),
    piece(circle(100, 149, 9), C.giftBlue, cut),
    piece(circle(136, 149, 8), C.sledgeGreen, cut),
    shine([[40, 120], [48, 96], [52, 98], [46, 124]], 0.5),
  ],
  silkyRibbon: () => [
    piece(curve([[96, 96], [70, 130], [56, 186], [76, 176], [88, 188], [100, 110]], 2), C.goldLight),
    piece(curve([[104, 96], [134, 130], [150, 186], [130, 176], [118, 188], [100, 110]], 2), C.goldLight),
    piece(curve([[100, 96], [60, 50], [22, 64], [26, 108], [70, 112]], 2), C.goldLight),
    piece(curve([[100, 96], [140, 50], [178, 64], [174, 108], [130, 112]], 2), C.goldLight),
    flat(curve([[90, 92], [56, 62], [36, 74], [42, 96]], 2), C.candle, 0.8),
    flat(curve([[110, 92], [144, 62], [164, 74], [158, 96]], 2), C.candle, 0.8),
    piece(ellipse(100, 96, 16, 18), C.gold),
    glint(40, 30, 0.7, C.goldLight),
    glint(172, 150, 0.6, C.goldLight),
  ],
  drum: () => [
    ground(100, 180, 72, 9),
    piece(rect(32, 70, 136, 96, 10), C.coatRed),
    ink([[34, 82], [56, 156], [78, 82], [100, 156], [122, 82], [144, 156], [166, 82]], { width: 4, color: C.ribbon }),
    piece(rect(28, 156, 144, 14, 6), C.china),
    piece(ellipse(100, 72, 70, 18), C.china),
    flat(ellipse(100, 72, 60, 12), C.cream),
    piece(band([[40, 18], [100, 66]], 8), C.wood, cut),
    piece(band([[160, 18], [104, 66]], 8), C.wood, cut),
    piece(circle(40, 18, 9), C.cream, cut),
    piece(circle(160, 18, 9), C.cream, cut),
  ],
  magicHat: () => [
    ground(100, 178, 84, 8),
    piece(curve([[100, 18], [120, 60], [144, 154], [56, 154], [80, 60]], 1), C.blueDark),
    piece(curve(poly([[94, 24], [130, 8], [162, 22], [126, 20], [106, 36]]), 1), C.blueDark),
    piece(ellipse(100, 158, 86, 16), C.blueDark),
    flat(rect(60, 136, 82, 12), C.ribbon),
    piece(curve(starPts(96, 96, 14, 6), 1), C.starYellow, cutFlat),
    piece(curve([[116, 60], [108, 66], [110, 78], [120, 82], [112, 72]], 1), C.goldLight, cutFlat),
    dot(86, 64, 3, C.goldLight),
    dot(118, 118, 3, C.goldLight),
  ],
  rulebook: () => [
    ground(100, 178, 72, 8),
    piece(rect(40, 26, 124, 146, 6), C.snapInk),
    piece(rect(40, 26, 20, 146, 4), C.ruler),
    flat(rect(166, 32, 8, 134), C.cream),
    piece(rect(78, 52, 70, 34, 4), C.chalk, cut),
    ink([[88, 64], [138, 64]], { width: 3, color: C.snapInk }),
    ink([[88, 74], [124, 74]], { width: 3, color: C.snapInk }),
    piece(poly([[132, 166], [146, 166], [146, 196], [139, 188], [132, 196]]), C.ruler, cut),
    text(112, 136, '!', 44, C.ruler),
  ],
};

/** A keepsake's picture, 200 × 200. */
export const keepsake = (id: string, label: string): string => svg({ w: 200, h: 200, name: 'ks-' + id, label, className: 'keepsake' }, KEEPSAKE_ART[id]());
