/** From Wizard Words, b7c1 (kitchen). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const WALL_DARK = '#6f6358';

const IRON = '#4b4f58';

const WALL = '#8a7d70';

/** A hanging pan, drawn into the backdrop. */
function group3(x: number, col: string): Node {
  return piece(circle(x, 170, 26), col, { edge: 'cut' });
}

/** The cleaned-up basement kitchen. */
export function kitchen(): string {
  const r = rng(71);
  const bricks: Node[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 9; col++) {
      if (r() < 0.45) bricks.push(piece(rect(col * 140 + (row % 2) * 60 - 20, 80 + row * 70, 120, 56, 3), r() < 0.5 ? WALL_DARK : '#7e7266', { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }));
    }
  }
  const pots: Node[] = [];
  [[70, C.brown], [150, '#a8794a'], [226, IRON]].forEach(([x, col], i) => {
    pots.push(piece(rect(x as number, 232 - i * 8, 62, 46 + i * 8, 6), col as string, { edge: 'cut' }));
    pots.push(piece(rect((x as number) - 4, 228 - i * 8, 70, 8, 3), C.brownDark, { edge: 'cut', fibre: false }));
  });
  return svg({ w: 1180, h: 820, name: 'b7c1-kitchen', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), WALL, { edge: 'clean', shadow: false }),
    ...bricks,
    // little high window with a bright sky
    piece(rect(470, 70, 190, 130, 6), C.brownDark),
    piece(rect(482, 82, 166, 106), C.sky, { edge: 'cut', fibre: false }),
    piece(rect(561, 82, 8, 106), C.brownDark, { edge: 'cut', fibre: false }),
    piece(ellipse(520, 120, 26, 9), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // shelf with pots
    piece(rect(50, 276, 270, 14, 3), C.wood),
    ...pots,
    ...[100, 270].map((x) => piece(poly([[x - 6, 290], [x + 6, 290], [x, 318]]), C.wood, { edge: 'cut', fibre: false })),
    // hanging copper pans on the wall
    ...[[380, C.orange], [430, C.gold]].map(([x, col]) => group3(x as number, col as string)),
    // oven (right)
    piece(rect(950, 250, 220, 330, 10), IRON),
    piece(rect(970, 300, 180, 180, 10), C.night, { edge: 'cut' }),
    piece(curve([[990, 470], [990, 380], [1060, 330], [1130, 380], [1130, 470]], 2), '#2a1d16', { edge: 'cut', fibre: false }),
    piece(curve([[1004, 466], [1004, 388], [1060, 346], [1116, 388], [1116, 466]], 2), C.orange, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    ...[995, 1060, 1125].map((x) => piece(circle(x, 275, 9), C.stone, { edge: 'cut', fibre: false })),
    piece(rect(940, 238, 240, 16, 4), C.wood),
    piece(rect(980, 575, 30, 16), IRON, { edge: 'cut' }),
    piece(rect(1110, 575, 30, 16), IRON, { edge: 'cut' }),
    // ceiling beam and strings of onions
    piece(rect(-20, 0, 1220, 46), C.brownDark),
    ...[690, 760, 830].flatMap((x) => [
      ink([[x, 40], [x, 120]], { width: 3, color: C.brown }),
      ...[0, 1, 2].map((j) => piece(circle(x + (j % 2 ? 8 : -8), 70 + j * 24, 15), j % 2 ? C.tan : C.orange, { edge: 'cut', fibre: false })),
    ]),
    // floor: flagstones
    piece(curve([[-40, 860], [-40, 590], [300, 580], [590, 576], [880, 580], [1220, 590], [1220, 860]], 2), '#9c8f80', { rough: 1.2 }),
    ...[0, 1, 2].flatMap((row) => [0, 1, 2, 3, 4, 5].map((col) => piece(rect(col * 210 - 30 + (row % 2) * 100, 600 + row * 62, 190, 50, 4), '#a89c8d', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }))),
    // the scrubbed kitchen table
    piece(rect(560, 478, 340, 24, 4), C.wood),
    piece(rect(580, 500, 22, 100), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(858, 500, 22, 100), C.brownDark, { edge: 'cut', fibre: false }),
  ]);
}
