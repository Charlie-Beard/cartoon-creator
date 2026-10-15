/** From Wizard Words, b5c3 (corridor). */
import { C } from '../../../art/palette';
import { curve, piece, rect, rng, svg, type Node } from '../../../art/paper';

const STONE = '#6c6a78';

const STONE_DARK = '#57556a';

/** The corridor: a long, blank stretch of castle wall with a torch each side. */
export function corridor(): string {
  const r = rng(503);
  const blocks: Node[] = [];
  for (let row = 0; row < 7; row++) {
    let x = -30 + (row % 2) * 60;
    while (x < 1200) {
      const w = 110 + r() * 50;
      blocks.push(piece(rect(x, row * 96 - 10, w - 6, 90, 4), r() > 0.5 ? STONE : '#726f80', { edge: 'cut', fibre: false, shadow: false }));
      x += w;
    }
  }
  const torch = (x: number): Node[] => [
    piece(rect(x - 6, 250, 12, 70, 3), C.brownDark, { edge: 'cut', fibre: false }),
    piece(curve([[x, 190], [x + 20, 232], [x, 258], [x - 20, 232]], 2), C.orange, { edge: 'cut' }),
    piece(curve([[x, 214], [x + 10, 238], [x, 252], [x - 10, 238]], 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
  ];
  return svg({ w: 1180, h: 820, name: 'b5c3-corridor', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), STONE_DARK, { edge: 'clean', shadow: false }),
    ...blocks,
    ...torch(150),
    ...torch(1030),
    piece(curve([[-40, 860], [-40, 640], [590, 628], [1220, 640], [1220, 860]], 2), '#4a4256', { rough: 1.2 }),
    piece(rect(-20, 636, 1220, 8), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
  ]);
}
