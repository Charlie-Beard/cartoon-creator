/** From Wizard Words, b2c3 (grounds). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

/** Hogwarts grounds at dusk: the castle far off, the forest at the left. */
export function grounds(): string {
  const r = rng(23);
  const stars: Node[] = [];
  for (let i = 0; i < 24; i++) stars.push(dot(r() * 1180, 20 + r() * 230, 1.4 + r() * 2, C.cream, 0.4 + r() * 0.5));
  const tower = (x: number, top: number, w: number): Node[] => [
    piece(rect(x, top, w, 560 - top), '#3d4470', { rough: 0.7 }),
    piece(poly([[x - 8, top + 4], [x + w / 2, top - w * 1.2], [x + w + 8, top + 4]]), '#4c5480', { rough: 0.7 }),
  ];
  const win = (x: number, y: number) => piece(rect(x, y, 9, 15, 4), C.candle, { edge: 'cut', fibre: false, shadow: false });
  const tree = (x: number, top: number, w: number, col: string) =>
    piece(curve([[x - w, 620], [x - w * 0.8, top + 120], [x - w * 0.4, top + 40], [x, top], [x + w * 0.4, top + 40], [x + w * 0.8, top + 120], [x + w, 620]], 2), col, { rough: 1.3 });
  const tuft = (x: number, y: number) => ink([[x - 8, y], [x - 4, y - 14], [x, y], [x + 4, y - 16], [x + 8, y]], { width: 3, color: '#3f6b4c' });
  return svg({ w: 1180, h: 820, name: 'b2c3-grounds', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.nightLight, { edge: 'clean', shadow: false }),
    piece(curve([[-40, 250], [300, 215], [700, 245], [1220, 205], [1220, 640], [-40, 640]], 2), '#454f7e', { rough: 2, shadow: false }),
    piece(curve([[-40, 370], [400, 340], [800, 362], [1220, 332], [1220, 640], [-40, 640]], 2), '#655f8c', { rough: 2, shadow: false }),
    piece(curve([[-40, 462], [400, 436], [800, 452], [1220, 426], [1220, 640], [-40, 640]], 2), '#b48887', { rough: 2, shadow: false }),
    ...stars,
    // crescent moon
    piece(circle(1090, 84, 32), C.cream, { rough: 0.7 }),
    piece(circle(1104, 76, 28), C.nightLight, { edge: 'cut', fibre: false, shadow: false }),
    // soft far clouds
    piece(ellipse(220, 150, 120, 22), '#7b7aa6', { rough: 1.5, shadow: false, opacity: 0.6 }),
    piece(ellipse(760, 110, 150, 20), '#7b7aa6', { rough: 1.5, shadow: false, opacity: 0.5 }),
    // the castle, far away
    ...tower(540, 360, 40),
    ...tower(600, 300, 54),
    ...tower(676, 340, 44),
    ...tower(736, 400, 36),
    piece(rect(520, 430, 270, 130), '#3d4470', { rough: 0.7 }),
    win(553, 400), win(618, 340), win(636, 380), win(690, 380), win(745, 430),
    win(545, 460), win(590, 480), win(650, 456), win(700, 486), win(760, 462),
    // far hills
    piece(curve([[-40, 640], [-40, 548], [260, 520], [560, 540], [860, 515], [1220, 535], [1220, 640]], 2), '#3e5c55', { rough: 1.4 }),
    // the Forbidden Forest
    tree(10, 340, 80, '#22392d'),
    tree(120, 380, 70, '#28433a'),
    tree(220, 420, 60, '#22392d'),
    tree(70, 430, 70, '#2c4a3a'),
    tree(170, 460, 60, '#2c4a3a'),
    tree(280, 490, 50, '#28433a'),
    // the lawn
    piece(curve([[-40, 860], [-40, 600], [300, 572], [640, 592], [900, 566], [1220, 584], [1220, 860]], 2), '#557f4a', { rough: 1.4 }),
    piece(ellipse(960, 628, 300, 46), '#4b7342', { rough: 1.2 }),
    piece(curve([[-40, 860], [-40, 702], [400, 690], [800, 706], [1220, 690], [1220, 860]], 2), '#5f8b52', { rough: 1.6, shadow: false }),
    ...[[60, 640], [250, 616], [480, 650], [700, 628], [1120, 650], [600, 676]].map(([x, y]) => tuft(x, y)),
  ]);
}
