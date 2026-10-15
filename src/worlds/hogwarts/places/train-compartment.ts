/** From Wizard Words, b1c3 (compartment). */
import { C } from '../../../art/palette';
import { dot, ellipse, ink, piece, poly, rect, svg } from '../../../art/paper';

/** Inside a compartment: wood panels, red seats, a table under the window. */
export function compartment(): string {
  const panel = (x: number) => piece(rect(x, 96, 280, 190, 12), '#7d5236', { edge: 'cut', rough: 1.2 });
  const seatBack = (x: number) => [
    piece(rect(x, 286, 350, 320, 30), C.red),
    ...[0, 1, 2].flatMap((i) => [0, 1].map((j) => dot(x + 70 + i * 105, 360 + j * 90, 6, C.redDark))),
  ];
  return svg({ w: 1180, h: 820, name: 'b1c3-compartment', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 700), C.brown, { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 96), C.brownDark, { rough: 1.4 }),
    panel(36),
    panel(864),
    // luggage rack with a trunk and a bag
    piece(rect(100, 14, 180, 52, 6), C.redDark),
    piece(rect(130, 14, 12, 52), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(238, 14, 12, 52), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(890, 24, 150, 42, 14), C.tan),
    piece(rect(942, 12, 46, 16, 8), C.brownDark, { edge: 'cut' }),
    piece(rect(-20, 64, 1220, 10, 4), C.gold, { edge: 'cut' }),
    // little wall lamps
    piece(ellipse(335, 160, 30, 30), C.candle, { edge: 'clean', shadow: false, opacity: 0.25 }),
    piece(rect(325, 146, 20, 30, 6), C.goldLight, { edge: 'cut' }),
    piece(ellipse(845, 160, 30, 30), C.candle, { edge: 'clean', shadow: false, opacity: 0.25 }),
    piece(rect(835, 146, 20, 30, 6), C.goldLight, { edge: 'cut' }),
    ...seatBack(-30),
    ...seatBack(860),
    // the table under the window
    piece(rect(588, 452, 24, 200, 6), C.brownDark),
    piece(ellipse(600, 650, 60, 10), C.brownDark, { edge: 'cut' }),
    piece(rect(396, 436, 408, 22, 6), C.wood),
    piece(rect(396, 452, 408, 8, 3), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    // floor and runner
    piece(rect(-20, 640, 1220, 200), '#4a3326', { rough: 1.2 }),
    piece(poly([[330, 646], [850, 646], [960, 840], [220, 840]]), '#6b2e2a', { rough: 1.2 }),
    ink([[352, 656], [828, 656]], { width: 3, color: C.gold, opacity: 0.6 }),
  ]);
}
