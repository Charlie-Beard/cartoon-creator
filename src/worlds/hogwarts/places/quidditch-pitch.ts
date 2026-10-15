/** From Wizard Words, b6c3 (pitch). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, piece, poly, rect, svg, type Node } from '../../../art/paper';

const SKY = '#8ec5e6';

function cloudShape(x: number, y: number, s: number): Node[] {
  return [
    piece(ellipse(x, y, 90 * s, 30 * s), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 }),
    piece(ellipse(x - 40 * s, y - 20 * s, 44 * s, 28 * s), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 }),
    piece(ellipse(x + 20 * s, y - 28 * s, 50 * s, 34 * s), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 }),
  ];
}

function hoop(x: number, top: number, r: number, col: string): Node[] {
  return [
    piece(rect(x - 6, top + r, 12, 700 - top - r), C.brown, { edge: 'cut', fibre: false }),
    piece(circle(x, top + r, r + 7), col, { edge: 'cut', fibre: false }),
    piece(circle(x, top + r, r - 5), SKY, { edge: 'clean', fibre: false, shadow: false }),
  ];
}

/** The Quidditch pitch on a bright day. */
export function pitch(): string {
  const stands: Node[] = [];
  const cols = [C.red, C.gold, C.blue, C.green];
  for (let i = 0; i < 7; i++) {
    const x = 20 + i * 90;
    const h = 90 + (i % 3) * 30;
    stands.push(piece(rect(x, 520 - h, 70, h + 80, 3), C.sand, { edge: 'cut', fibre: false }));
    stands.push(piece(poly([[x - 4, 520 - h], [x + 74, 520 - h], [x + 35, 520 - h - 44]]), cols[i % 4], { edge: 'cut', fibre: false }));
  }
  return svg({ w: 1180, h: 820, name: 'b6c3-pitch', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), SKY, { edge: 'clean', shadow: false }),
    piece(rect(-20, 380, 1220, 300), '#a9d3ec', { edge: 'clean', shadow: false, opacity: 0.7 }),
    ...cloudShape(180, 110, 1.1),
    ...cloudShape(620, 70, 0.9),
    ...cloudShape(1000, 120, 1),
    ...cloudShape(400, 340, 0.8),
    piece(curve([[-40, 640], [-40, 520], [300, 500], [700, 520], [1220, 500], [1220, 640]], 2), C.greenDark, { rough: 1.4 }),
    ...stands,
    ...hoop(860, 120, 52, C.gold),
    ...hoop(1030, 190, 62, C.gold),
    ...hoop(1130, 300, 46, C.gold),
    piece(curve([[-40, 860], [-40, 650], [300, 640], [600, 636], [900, 640], [1220, 650], [1220, 860]], 2), C.green, { rough: 1.2 }),
    piece(ellipse(590, 760, 480, 60), C.greenDark, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
  ]);
}
