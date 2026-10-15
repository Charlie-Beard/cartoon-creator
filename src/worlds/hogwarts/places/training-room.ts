/** From Wizard Words, b5c3 (roomArt). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, raw, rect, rng, svg, type Node } from '../../../art/paper';

/** The Room of Requirement, full stage: shelves, books, cushions, warm lamps. */
export function roomArt(): string {
  const r = rng(77);
  const cols = [C.red, C.blueDark, C.greenDark, C.gold, C.plum, C.teal, C.brown];
  const books: Node[] = [];
  for (const sx of [30, 880]) {
    for (const sy of [250, 360, 470]) {
      let x = sx + 12;
      while (x < sx + 250) {
        const w = 14 + r() * 12;
        const h = 56 + r() * 26;
        books.push(piece(rect(x, sy - h, w, h, 2), cols[Math.floor(r() * cols.length)], { edge: 'cut', fibre: false }));
        x += w + 3;
      }
      books.push(piece(rect(sx, sy, 270, 10, 2), C.wood, { edge: 'cut' }));
    }
  }
  const cushion = (x: number, y: number, c: string): Node[] => [
    piece(ellipse(x, y, 62, 24), c),
    piece(ellipse(x, y - 6, 38, 10), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
  ];
  const lamp = (x: number): Node[] => [
    piece(rect(x - 2, 120, 4, 40, 1), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, 182, 20, 26), C.goldLight, { edge: 'cut' }),
    piece(ellipse(x, 182, 10, 14), C.candle, { edge: 'cut', fibre: false, shadow: false }),
  ];
  return svg({ w: 1180, h: 820, name: 'b5c3-room', boil: false }, [
    piece(rect(-20, -20, 1220, 860), '#5a3f55', { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 44), '#43304a', { rough: 0.8 }),
    piece(rect(300, 40, 580, 540, 6), '#6b4a62', { edge: 'cut', fibre: false, shadow: false }),
    ...lamp(340), ...lamp(840), ...lamp(590),
    // hanging D.A. banner
    piece(rect(470, 60, 240, 170, 6), C.redDark),
    piece(rect(480, 70, 220, 12, 3), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(480, 208, 220, 12, 3), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    raw(`<text x="590" y="170" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="64" fill="${C.goldLight}">D.A.</text>`),
    ink([[590, 230], [590, 258]], { width: 4, color: C.gold }),
    piece(ellipse(590, 268, 10, 14), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    // tall mirror
    piece(rect(322, 192, 126, 236, 56), C.gold, { edge: 'cut', fibre: false }),
    piece(rect(330, 200, 110, 220, 50), '#9fb6c8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    // straw practice dummy
    piece(rect(752, 330, 16, 120, 3), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[730, 330], [744, 270], [776, 270], [790, 330], [760, 346]], 2), C.sand),
    piece(circle(760, 246, 22), C.sand),
    ink([[750, 242], [756, 248]], { width: 3, color: C.brownDark }),
    ink([[766, 242], [772, 248]], { width: 3, color: C.brownDark }),
    ...books,
    piece(curve([[-40, 860], [-40, 620], [590, 606], [1220, 620], [1220, 860]], 2), '#7a5238', { rough: 1.2 }),
    piece(ellipse(590, 700, 420, 56), C.redDark, { edge: 'cut', fibre: false }),
    ...cushion(250, 640, C.blueDark),
    ...cushion(940, 646, C.greenDark),
    ...cushion(430, 676, C.gold),
    ...cushion(760, 672, C.plum),
  ]);
}
