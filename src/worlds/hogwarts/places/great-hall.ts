/** From Wizard Words, b1c4 (greatHall). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** A rounded arch outline (windows). */
function arch(x: number, y: number, w: number, h: number): Pt[] {
  const r = w / 2;
  const pts: Pt[] = [[x, y + h]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  pts.push([x + w, y + h]);
  return pts;
}

/** One small floating candle with its glow. */
function candleNodes(x: number, y: number, s = 1): Node[] {
  return [
    piece(circle(x, y - 4 * s, 22 * s), C.candle, { edge: 'clean', shadow: false, opacity: 0.16 }),
    piece(rect(x - 5 * s, y, 10 * s, 30 * s, 2), C.cream, { edge: 'cut', fibre: false }),
    piece(curve([[x, y - 18 * s], [x + 6 * s, y - 6 * s], [x, y - 1 * s], [x - 6 * s, y - 6 * s]], 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, y - 5 * s, 2.5 * s, 4 * s), C.white, { edge: 'clean', shadow: false }),
  ];
}

function stars(count: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < count; i++) {
    const x = 50 + r() * 1080;
    const y = 10 + r() * 270;
    const s = 2 + r() * 4;
    const pts: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4 + r() * 0.2;
      pts.push([x + Math.cos(a) * (k % 2 ? s * 0.4 : s), y + Math.sin(a) * (k % 2 ? s * 0.4 : s)]);
    }
    out.push(piece(poly(pts), r() > 0.75 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 + r() * 0.45 }));
  }
  return out;
}

/** A Gryffindor-coloured banner hanging from the ledge. */
function banner(cx: number, top: number, w: number, h: number): Node[] {
  const x = cx - w / 2;
  return [
    piece(poly([[x, top], [x + w, top], [x + w, top + h], [cx, top + h - w * 0.4], [x, top + h]]), C.red, { rough: 0.8 }),
    piece(poly([[x + 7, top + 8], [x + w - 7, top + 8], [x + w - 7, top + h - 14], [cx, top + h - w * 0.4 - 8], [x + 7, top + h - 14]]), C.redDark, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(rect(x + 4, top + 20, w - 8, 9), C.gold, { edge: 'cut', fibre: false }),
    piece(poly([[cx, top + 44], [cx + w * 0.22, top + 44 + w * 0.3], [cx, top + 44 + w * 0.6], [cx - w * 0.22, top + 44 + w * 0.3]]), C.gold, { edge: 'cut', fibre: false }),
    piece(rect(x - 6, top - 6, w + 12, 10, 3), C.brownDark, { edge: 'cut', fibre: false }),
  ];
}

/** The Great Hall: starry ceiling, stone wall, windows, banners and candles. */
export function greatHall(): string {
  const r = rng(404);
  const blocks: Node[] = [];
  for (let row = 0; row < 8; row++) {
    const y = 330 + row * 42;
    for (let x = -60 + (row % 2) * 48; x < 1200; x += 96) {
      const shade = ['#67647a', '#56536a', '#615e75', '#5b586f'][Math.floor(r() * 4)];
      blocks.push(piece(rect(x + 3, y + 3, 90, 36, 3), shade, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
    }
  }
  const win = (cx: number): Node[] => [
    piece(arch(cx - 42, 352, 84, 170), '#3c3a4c', { rough: 0.8 }),
    piece(arch(cx - 32, 362, 64, 160), '#33406e', { edge: 'cut', fibre: false }),
    ink([[cx, 366], [cx, 520]], { width: 3, color: '#26283a' }),
    ink([[cx - 32, 430], [cx + 32, 430]], { width: 3, color: '#26283a' }),
    dot(cx - 14, 400, 2.5, C.cream, 0.8),
    dot(cx + 16, 466, 2, C.cream, 0.7),
  ];
  const pillar = (x: number): Node[] => [
    piece(rect(x, -20, 64, 760), '#4a4759', { rough: 0.8 }),
    piece(rect(x + 10, -20, 12, 760), '#57546a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x - 10, 290, 84, 30, 4), '#3c3a4c', { edge: 'cut', fibre: false }),
  ];
  const candles: Node[] = [];
  const cr = rng(9);
  for (let i = 0; i < 16; i++) {
    const x = 90 + (i / 16) * 1000 + cr() * 50;
    const y = 70 + cr() * 190;
    candles.push(...candleNodes(x, y, 0.7 + cr() * 0.4));
  }
  return svg({ w: 1180, h: 820, name: 'b1c4-hall', boil: false, className: 'backdrop' }, [
    // The enchanted ceiling.
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    piece(curve([[100, 120], [300, 70], [520, 110], [420, 160], [180, 170]], 2), '#2c3560', { shadow: false, fibre: false, opacity: 0.8 }),
    piece(curve([[680, 200], [900, 150], [1100, 190], [980, 240], [760, 245]], 2), '#2c3560', { shadow: false, fibre: false, opacity: 0.8 }),
    ...stars(60, 12),
    piece(circle(980, 92, 40), C.cream, { rough: 0.8 }),
    piece(circle(998, 82, 34), C.night, { edge: 'cut', fibre: false, shadow: false }),
    // The stone wall.
    piece(rect(-20, 312, 1220, 420), '#504d62', { rough: 0.6 }),
    ...blocks,
    piece(rect(-20, 292, 1220, 32), '#3c3a4c', { rough: 0.8 }),
    piece(rect(-20, 318, 1220, 6), C.gold, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    ...win(450),
    ...win(730),
    ...banner(330, 324, 62, 150),
    ...banner(590, 324, 84, 190),
    ...banner(850, 324, 62, 150),
    ...pillar(-30),
    ...pillar(1146),
    ...candles,
    // The floor.
    piece(rect(-20, 640, 1220, 200), '#2f2c3a', { rough: 0.6 }),
    ink([[-20, 740], [1200, 736]], { width: 2, color: '#252330', opacity: 0.6 }),
  ]);
}
