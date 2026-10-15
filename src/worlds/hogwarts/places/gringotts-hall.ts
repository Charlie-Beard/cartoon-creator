/** From Wizard Words, b7c2 (bankHall). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const MARBLE = '#e6dfd0';

const GOLD_DK = '#c79a26';

/** The marble banking hall. */
export function bankHall(): string {
  const r = rng(702);
  const tiles: Node[] = [];
  for (let i = 0; i < 9; i++) tiles.push(piece(poly([[i * 140 - 60, 700], [i * 140 + 10, 700], [i * 140 - 10, 820], [i * 140 - 120, 820]]), i % 2 ? '#c9c0ad' : '#ddd3bf', { edge: 'cut', fibre: false, shadow: false }));
  const columns = [90, 330, 850, 1090].map((x) => [
    piece(rect(x - 36, 110, 72, 520, 4), MARBLE, { rough: 0.8 }),
    piece(rect(x - 48, 96, 96, 26, 3), C.sand, { edge: 'cut' }),
    piece(rect(x - 48, 620, 96, 26, 3), C.sand, { edge: 'cut' }),
    ink([[x - 12, 140], [x - 12, 610]], { width: 2, color: C.sand }),
    ink([[x + 12, 140], [x + 12, 610]], { width: 2, color: C.sand }),
  ]).flat();
  const lamps: Node[] = [];
  for (const x of [200, 590, 980]) {
    lamps.push(ink([[x, 40], [x, 130]], { width: 3, color: C.brownDark }));
    lamps.push(piece(ellipse(x, 150, 28, 22), C.candle, { edge: 'cut', fibre: false }));
    lamps.push(piece(rect(x - 20, 126, 40, 10, 3), C.gold, { edge: 'cut', fibre: false }));
  }
  const stars: Node[] = [];
  for (let i = 0; i < 10; i++) stars.push(dot(130 + r() * 920, 200 + r() * 260, 2 + r() * 2, C.goldLight, 0.4 + r() * 0.3));
  return svg({ w: 1180, h: 820, name: 'b7c2-hall', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#bfb49c', { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 70), C.brownDark, { edge: 'clean', shadow: false }),
    // the great doors in the back wall
    piece(curve([[440, 650], [440, 330], [520, 250], [590, 232], [660, 250], [740, 330], [740, 650]], 2), C.brownDark),
    piece(curve([[462, 650], [462, 342], [530, 268], [590, 252], [650, 268], [718, 342], [718, 650]], 2), C.wood, { edge: 'cut', fibre: false }),
    ink([[590, 252], [590, 650]], { width: 4, color: C.brownDark }),
    piece(circle(572, 470, 9), C.gold, { edge: 'cut', fibre: false }),
    piece(circle(608, 470, 9), C.gold, { edge: 'cut', fibre: false }),
    ...columns,
    ...lamps,
    ...stars,
    // a long counter with brass scales
    piece(rect(150, 520, 880, 150, 6), C.brownDark),
    piece(rect(130, 500, 920, 30, 6), C.wood),
    ...[250, 930].flatMap((x) => [
      ink([[x, 500], [x, 430]], { width: 4, color: GOLD_DK }),
      ink([[x - 40, 440], [x + 40, 440]], { width: 4, color: GOLD_DK }),
      piece(ellipse(x - 40, 462, 20, 8), C.gold, { edge: 'cut' }),
      piece(ellipse(x + 40, 450, 20, 8), C.gold, { edge: 'cut' }),
    ]),
    piece(rect(-40, 660, 1260, 200), '#d8cdb6', { edge: 'clean', shadow: false }),
    ...tiles,
  ]);
}
