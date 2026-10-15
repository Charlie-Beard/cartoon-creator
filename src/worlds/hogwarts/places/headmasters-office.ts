/** From Wizard Words, b2c4 (office). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** A sleeping portrait on the wall. */
function sleeper(x: number, y: number, w: number, h: number, bg: string, robe: string, o: { hat?: string; beard?: boolean; hair?: string }): Node[] {
  const cx = x + w / 2;
  const cy = y + h * 0.5;
  const r = w * 0.22;
  return [
    piece(rect(x - 9, y - 9, w + 18, h + 18, 4), C.gold, { edge: 'cut' }),
    piece(rect(x, y, w, h), bg, { edge: 'clean', shadow: false }),
    piece(curve([[x + 6, y + h], [x + 10, y + h * 0.8], [cx, y + h * 0.7], [x + w - 10, y + h * 0.8], [x + w - 6, y + h]], 2), robe, { fibre: false, shadow: false }),
    ...(o.hair ? [piece(ellipse(cx, cy - r * 0.2, r * 1.25, r * 1.1), o.hair, { fibre: false, shadow: false })] : []),
    piece(circle(cx, cy, r), C.skin, { edge: 'cut', fibre: false }),
    ...(o.beard ? [piece(curve([[cx - r * 0.9, cy + r * 0.3], [cx, cy + r * 2.3], [cx + r * 0.9, cy + r * 0.3]], 2), '#ece8e0', { fibre: false })] : []),
    ink([[cx - r * 0.62, cy - r * 0.05], [cx - r * 0.35, cy + r * 0.15], [cx - r * 0.1, cy - r * 0.05]], { width: 2.5 }),
    ink([[cx + r * 0.1, cy - r * 0.05], [cx + r * 0.35, cy + r * 0.15], [cx + r * 0.62, cy - r * 0.05]], { width: 2.5 }),
    ...(o.beard ? [] : [ink([[cx - r * 0.2, cy + r * 0.55], [cx + r * 0.2, cy + r * 0.55]], { width: 2.5 })]),
    ...(o.hat ? [piece(poly([[cx - r * 1.3, cy - r * 0.6], [cx + r * 0.3, cy - r * 2.7], [cx + r * 1.3, cy - r * 0.6]]), o.hat, { edge: 'cut', fibre: false })] : []),
    // a sleepy "z"
    ink([[x + w - 24, y + 12], [x + w - 13, y + 12], [x + w - 24, y + 24], [x + w - 13, y + 24]], { width: 2.5, color: C.cream, wobble: 0.2 }),
  ];
}

const SILVER_DARK = '#9aa0aa';

const SILVER = '#c9ccd2';

/** Dumbledore's round office at night, as a pop-up paper scene. */
export function office(): string {
  const wall = '#4d4262';
  const wallDark = '#3d3452';
  const r = rng(424);
  const bookCols = [C.red, C.blueDark, C.greenDark, C.gold, C.plum, C.rust, C.teal, C.brown, C.sand];
  const books: Node[] = [];
  for (const sy of [300, 395, 490, 585]) {
    let x = 54;
    while (x < 262) {
      const w = Math.min(14 + r() * 12, 266 - x);
      const bh = 54 + r() * 26;
      books.push(piece(rect(x, sy - bh, w, bh, 2), bookCols[Math.floor(r() * bookCols.length)], { edge: 'cut', fibre: false }));
      x += w + 3;
    }
  }
  // The arched window behind Fawkes.
  const arch = (x0: number, x1: number, top: number, bottom: number): Pt[] => {
    const cx = (x0 + x1) / 2;
    const rr = (x1 - x0) / 2;
    const pts: Pt[] = [[x0, bottom]];
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI + (i / 16) * Math.PI;
      pts.push([cx + Math.cos(a) * rr, top + rr + Math.sin(a) * rr]);
    }
    pts.push([x1, bottom]);
    return pts;
  };
  const stars: Node[] = [];
  for (let i = 0; i < 14; i++) stars.push(dot(486 + r() * 208, 110 + r() * 340, 1.5 + r() * 2, C.cream, 0.6 + r() * 0.4));
  return svg({ w: 1180, h: 820, name: 'b2c4-office', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    // curved-wall pillars and a ceiling band
    piece(rect(306, -10, 34, 620), wallDark, { rough: 0.8 }),
    piece(rect(842, -10, 34, 620), wallDark, { rough: 0.8 }),
    piece(rect(-20, -20, 1220, 42), wallDark, { rough: 0.8 }),
    piece(rect(-20, 18, 1220, 6), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    // window
    piece(arch(452, 728, 62, 488), C.brownDark, { rough: 0.8 }),
    piece(arch(468, 712, 78, 476), C.night, { edge: 'cut', fibre: false }),
    ...stars,
    piece(circle(652, 150, 26), C.cream, { edge: 'cut', fibre: false }),
    piece(circle(664, 142, 22), C.night, { edge: 'clean', shadow: false }),
    piece(rect(585, 78, 10, 400), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(468, 300, 244, 8), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(444, 474, 292, 18, 3), C.wood),
    // bookshelf
    piece(rect(36, 196, 250, 420, 4), C.brownDark),
    piece(rect(50, 212, 222, 392), '#33241c', { edge: 'cut', fibre: false, shadow: false }),
    ...books,
    ...[300, 395, 490, 585].map((y) => piece(rect(44, y, 234, 10, 2), C.wood, { edge: 'cut' })),
    // sleeping portraits
    ...sleeper(56, 52, 104, 120, C.greenDeep, C.blueDark, { hat: C.blueDark, beard: true }),
    ...sleeper(192, 62, 92, 108, C.redDark, C.plum, { hair: C.stoneLight }),
    ...sleeper(748, 96, 76, 96, C.blueDark, C.brownDark, { hair: C.brownDark }),
    ...sleeper(1012, 40, 104, 116, C.plum, C.greenDark, { hat: C.greenDark, beard: true }),
    // the gadget shelf (the whirring parts are actors)
    piece(rect(882, 280, 272, 14, 3), C.wood),
    ...[900, 1130].map((x) => piece(poly([[x - 6, 294], [x + 6, 294], [x, 320]]), C.wood, { edge: 'cut', fibre: false })),
    piece(rect(926, 226, 8, 56), SILVER_DARK, { edge: 'cut', fibre: false }),
    piece(ellipse(930, 278, 26, 7), SILVER, { edge: 'cut' }),
    piece(ellipse(1030, 252, 24, 28), SILVER),
    piece(rect(1024, 206, 12, 28), SILVER_DARK, { edge: 'cut', fibre: false }),
    piece(poly([[1016, 196], [1044, 196], [1036, 210], [1024, 210]]), SILVER, { edge: 'cut' }),
    ink([[1012, 252], [1048, 252]], { width: 2, color: SILVER_DARK }),
    piece(rect(1106, 216, 6, 64), SILVER_DARK, { edge: 'cut', fibre: false }),
    piece(ellipse(1109, 278, 18, 5), SILVER, { edge: 'cut' }),
    // floor and round rug
    piece(curve([[-40, 860], [-40, 612], [300, 598], [590, 594], [880, 598], [1220, 612], [1220, 860]], 2), '#6b4a36', { rough: 1.2 }),
    piece(ellipse(590, 712, 440, 74), C.gold, { rough: 1.2 }),
    piece(ellipse(590, 712, 418, 64), C.redDark, { edge: 'cut', fibre: false }),
    piece(ellipse(590, 712, 300, 40), '#8a3a32', { edge: 'cut', fibre: false, shadow: false }),
    // Fawkes's golden perch (the bar matches the one in his portrait)
    piece(ellipse(590, 650, 66, 14), C.gold),
    piece(rect(583, 470, 14, 182, 4), C.gold),
    piece(rect(480, 462, 220, 14, 6), C.wood),
  ]);
}
