/** From Wizard Words, b2c1 (bedroom). */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

/** Your little bedroom at Privet Drive, at night by lamplight (1180 × 820). */
export function bedroom(): string {
  const r = rng(201);
  const wall = '#c6b38d';
  const stripes: Node[] = [];
  for (let x = 30; x < 1180; x += 72) stripes.push(piece(rect(x, -10, 18, 610), '#b9a580', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
  const sprigs: Node[] = [];
  for (let x = 66; x < 1180; x += 72) for (let y = 60; y < 580; y += 110) sprigs.push(dot(x, y + (x % 144 ? 55 : 0), 4, '#a98f6a', 0.7));
  const stars: Node[] = [];
  for (let i = 0; i < 9; i++) stars.push(dot(890 + r() * 190, 100 + r() * 190, 1.5 + r() * 2, C.goldLight, 0.9));
  const boards: Node[] = [];
  for (const y of [636, 680, 732, 792]) boards.push(ink([[-10, y], [1190, y + 2]], { width: 2.5, color: C.brownDark, opacity: 0.45 }));
  for (let i = 0; i < 12; i++) {
    const y = [606, 636, 680, 732][i % 4];
    const x = 60 + ((i * 397) % 1100);
    const h2 = [30, 44, 52, 60][i % 4];
    boards.push(ink([[x, y + 2], [x + 2, y + h2 - 2]], { width: 2, color: C.brownDark, opacity: 0.35 }));
  }
  const books: Node[] = [];
  const bookCols = [C.red, C.greenDark, C.blue, C.gold, C.plum, C.rust];
  let bx = 440;
  for (let i = 0; i < 6; i++) {
    const w = 18 + (i % 3) * 5;
    const hh = 52 + ((i * 13) % 20);
    books.push(piece(rect(bx, 262 - hh, w, hh, 2), bookCols[i], { edge: 'cut' }));
    bx += w + 3;
  }
  return svg({ w: 1180, h: 820, name: 'b2c1-bedroom', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 640), wall, { edge: 'clean', shadow: false }),
    ...stripes,
    ...sprigs,
    // a warm pool of lamplight on the wall
    piece(ellipse(600, 250, 420, 260), C.candle, { edge: 'clean', shadow: false, opacity: 0.18 }),
    piece(ellipse(600, 220, 240, 160), C.candle, { edge: 'clean', shadow: false, opacity: 0.16 }),

    // ---- the window: a starry night and a big moon
    piece(rect(862, 72, 236, 252, 4), C.wood, { edge: 'cut' }),
    piece(rect(876, 86, 208, 224, 2), C.night, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(876, 210, 208, 100), C.nightLight, { edge: 'clean', shadow: false, opacity: 0.6 }),
    // rooftops of Privet Drive
    piece(poly([[876, 310], [876, 262], [930, 236], [984, 262], [984, 250], [1040, 226], [1084, 252], [1084, 310]]), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(906, 266, 14, 14), C.candle, { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(rect(1030, 260, 14, 14), C.candle, { edge: 'clean', shadow: false, opacity: 0.8 }),
    ...stars,
    piece(circle(1032, 136, 30), C.cream, { edge: 'cut' }),
    piece(circle(1022, 128, 6), '#e2d4b0', { edge: 'clean', shadow: false }),
    piece(circle(1040, 146, 4), '#e2d4b0', { edge: 'clean', shadow: false }),
    ink([[980, 88], [980, 308]], { width: 6, color: C.wood }),
    ink([[878, 198], [1082, 198]], { width: 6, color: C.wood }),
    // sill
    piece(rect(842, 316, 276, 24, 4), C.tan, { edge: 'cut' }),
    // curtains and rail
    piece(curve([[820, 60], [880, 60], [872, 200], [890, 330], [880, 380], [826, 384], [834, 220]], 2), '#8d5a5c', { rough: 1.1 }),
    piece(curve([[1080, 60], [1140, 60], [1132, 220], [1140, 384], [1086, 380], [1074, 330], [1090, 200]], 2), '#8d5a5c', { rough: 1.1 }),
    ink([[846, 80], [850, 370]], { width: 2.5, color: '#6f4246', opacity: 0.6 }),
    ink([[1114, 80], [1110, 370]], { width: 2.5, color: '#6f4246', opacity: 0.6 }),
    piece(band([[806, 58], [1154, 58]], 9), C.brownDark, { edge: 'cut', fibre: false }),

    // ---- a lamp hanging from the ceiling
    ink([[600, -10], [600, 70]], { width: 3, color: C.charcoal }),
    piece(poly([[556, 112], [574, 66], [626, 66], [644, 112]]), '#d9a86a', { edge: 'cut' }),
    piece(ellipse(600, 116, 20, 8), C.candle, { edge: 'clean', shadow: false }),

    // ---- a wonky shelf of school books
    ...books,
    piece(rect(560, 226, 30, 36, 4), C.brown, { edge: 'cut' }),
    piece(rect(424, 262, 210, 12, 3), C.wood, { edge: 'cut' }),
    piece(poly([[440, 274], [452, 274], [452, 292]]), C.brownDark, { edge: 'cut', fibre: false }),
    piece(poly([[606, 274], [618, 274], [606, 292]]), C.brownDark, { edge: 'cut', fibre: false }),

    // ---- skirting board and floorboards
    piece(rect(-20, 586, 1220, 22), C.cream, { edge: 'cut' }),
    piece(rect(-20, 606, 1220, 240), '#946845', { edge: 'clean', shadow: false }),
    ...boards,
    // a soft round rug
    piece(ellipse(620, 752, 420, 58), '#7f6a86', { rough: 1.2 }),
    piece(ellipse(620, 752, 360, 42), '#8f7b94', { edge: 'cut', fibre: false, shadow: false }),
  ]);
}
