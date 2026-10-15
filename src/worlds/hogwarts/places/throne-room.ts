/** From Wizard Words, b6c4 (throneRoom). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const WALL = '#3c3446';

const WALL_DARK = '#2d2736';

/** A paper candle with a little flame, as backdrop nodes. */
function candle(x: number, y: number, h: number): Node[] {
  return [
    piece(rect(x - 9, y, 18, h, 3), C.cream, { edge: 'cut', fibre: false }),
    piece(ellipse(x, y + h, 16, 5), C.sand, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x, y], [x, y - 6]], { width: 2, color: C.ink }),
    piece(curve([[x, y - 30], [x + 8, y - 14], [x, y - 4], [x - 8, y - 14]], 2), C.orange, { edge: 'cut', fibre: false }),
    piece(curve([[x, y - 22], [x + 4, y - 13], [x, y - 7], [x - 4, y - 13]], 2), C.yellow, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

/** The gloomy throne room, with a tall spiky throne. */
export function throneRoom(): string {
  const r = rng(64);
  const bricks: Node[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 9; col++) {
      const bx = col * 140 - (row % 2 ? 70 : 0);
      bricks.push(piece(rect(bx + 4, row * 70 + 4, 132, 62, 3), r() > 0.5 ? WALL : '#40384a', { edge: 'cut', fibre: false, shadow: false }));
    }
  }
  const spikes: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const sx = 770 + i * 40;
    const sh = i === 3 ? 150 : 90 + (i % 2) * 28;
    spikes.push(piece(poly([[sx - 17, 250], [sx, 250 - sh], [sx + 17, 250]]), C.greenDeep, { edge: 'cut' }));
  }
  return svg({ w: 1180, h: 820, name: 'b6c4-room', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), WALL_DARK, { edge: 'clean', shadow: false }),
    ...bricks,
    // tall pillars
    piece(rect(40, -10, 70, 650), C.slate, { rough: 0.8 }),
    piece(rect(1070, -10, 70, 650), C.slate, { rough: 0.8 }),
    piece(rect(30, 600, 90, 36, 4), C.stone, { edge: 'cut' }),
    piece(rect(1060, 600, 90, 36, 4), C.stone, { edge: 'cut' }),
    // two long banners
    piece(poly([[210, 40], [300, 40], [300, 330], [255, 290], [210, 330]]), C.greenDark, { edge: 'cut' }),
    piece(poly([[880, 40], [970, 40], [970, 330], [925, 290], [880, 330]]), C.greenDark, { edge: 'cut' }),
    piece(circle(255, 120, 22), C.grey, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(925, 120, 22), C.grey, { edge: 'cut', fibre: false, shadow: false }),
    // floor
    piece(curve([[-40, 860], [-40, 600], [300, 590], [590, 586], [880, 590], [1220, 600], [1220, 860]], 2), '#524a5a', { rough: 1.2 }),
    piece(rect(-20, 600, 1220, 8), C.slate, { edge: 'cut', fibre: false, shadow: false }),
    // dark green carpet runner
    piece(poly([[470, 586], [860, 586], [980, 830], [350, 830]]), C.greenDeep, { rough: 0.8 }),
    // the spiky throne
    piece(rect(760, 250, 290, 320, 8), C.brownDark),
    ...spikes,
    piece(rect(790, 290, 230, 220, 6), C.plum, { edge: 'cut' }),
    piece(rect(740, 470, 330, 40, 6), C.brown),
    piece(rect(740, 510, 330, 80, 4), C.brownDark),
    piece(rect(710, 590, 390, 24, 4), C.stone, { edge: 'cut' }),
    // candles on the floor and ledges
    ...candle(150, 540, 60),
    ...candle(190, 556, 44),
    ...candle(1010, 596, 44),
    ...candle(1105, 560, 40),
  ]);
}
