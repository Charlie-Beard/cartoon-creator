/** From Wizard Words, b7c3 (courtyard). */
import { C } from '../../../art/palette';
import { curve, dot, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const STONE = '#8c8f98';

const STONE_DARK = '#6c6f7a';

/** The courtyard at sunset, as a pop-up paper scene. */
export function courtyard(): string {
  const r = rng(703);
  const tower = (x: number, w: number, top: number, col: string): Node[] => [
    piece(rect(x, top, w, 520 - top), col, { edge: 'cut', fibre: false }),
    piece(poly([[x - 8, top + 2], [x + w / 2, top - w * 0.9], [x + w + 8, top + 2]]), C.plum, { edge: 'cut', fibre: false }),
    piece(rect(x + w / 2 - 6, top + 40, 12, 26, 6), C.candle, { edge: 'clean', fibre: false, shadow: false }),
  ];
  const stars: Node[] = [];
  for (let i = 0; i < 14; i++) stars.push(dot(30 + r() * 1120, 20 + r() * 160, 1.4 + r() * 1.8, C.cream, 0.5 + r() * 0.4));
  const cobbles: Node[] = [];
  for (let row = 0; row < 4; row++) {
    for (let c = 0; c < 12; c++) {
      cobbles.push(piece(rect(c * 100 + (row % 2) * 50 - 20, 560 + row * 34, 92, 28, 6), row % 2 ? STONE : STONE_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }));
    }
  }
  return svg({ w: 1180, h: 820, name: 'b7c3-courtyard', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#4a3f6b', { edge: 'clean', shadow: false }),
    piece(rect(-20, 200, 1220, 160), '#8a557a', { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(rect(-20, 340, 1220, 200), '#c9795a', { edge: 'clean', shadow: false, opacity: 0.85 }),
    ...stars,
    // castle behind
    ...tower(340, 90, 250, '#3c3550'),
    ...tower(520, 120, 170, '#443b5a'),
    ...tower(720, 80, 260, '#3c3550'),
    ...tower(870, 70, 300, '#443b5a'),
    piece(rect(300, 360, 600, 170), '#3c3550', { edge: 'cut', fibre: false }),
    ...[380, 470, 560, 650, 740, 820].map((x) => piece(rect(x, 400, 16, 30, 7), C.candle, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 })),
    // dark clouds
    piece(curve([[-20, 20], [120, 70], [300, 50], [420, 90], [200, 120], [-20, 110]]), '#2f2a42', { edge: 'torn', fibre: false, opacity: 0.85 }),
    piece(curve([[800, 30], [980, 60], [1200, 40], [1200, 130], [1000, 140], [840, 100]]), '#2f2a42', { edge: 'torn', fibre: false, opacity: 0.85 }),
    // courtyard wall and ground
    piece(rect(-20, 500, 1220, 340), '#5c5668', { edge: 'clean', shadow: false }),
    piece(rect(-20, 500, 1220, 14), C.stone, { edge: 'cut', fibre: false }),
    ...cobbles,
    // empty plinths
    ...[270, 450, 640, 820].map((x) => piece(rect(x, 540, 90, 36, 5), STONE_DARK, { edge: 'cut', fibre: false })),
  ]);
}
