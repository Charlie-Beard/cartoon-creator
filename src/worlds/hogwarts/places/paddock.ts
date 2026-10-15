/** From Wizard Words, b3c3 (paddock). */
import { C } from '../../../art/palette';
import { band, circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const WOOD = '#8f6c4a';

/** A pumpkin with a stem. */
const pumpkin = (x: number, y: number, r: number): Node[] => [
  piece(ellipse(x, y, r * 1.25, r), C.orange, { rough: 0.8 }),
  ink([[x, y - r + 4], [x - 2, y + r - 4]], { width: 2.5, color: C.ginger, opacity: 0.8 }),
  ink([[x - r * 0.6, y - r + 8], [x - r * 0.7, y + r - 8]], { width: 2, color: C.ginger, opacity: 0.6 }),
  ink([[x + r * 0.6, y - r + 8], [x + r * 0.7, y + r - 8]], { width: 2, color: C.ginger, opacity: 0.6 }),
  piece(band([[x, y - r + 2], [x + 4, y - r - 10]], 6), C.greenDark, { edge: 'cut', fibre: false }),
];

/** Hagrid's paddock at sunset, with his hut, the pumpkins and the forest (1180 × 820). */
export function paddock(): string {
  const r = rng(303);
  const crowns: Node[] = [];
  for (let x = -30; x < 1220; x += 38) {
    const y = 392 - r() * 34;
    crowns.push(piece(circle(x, y, 32 + r() * 12), r() > 0.5 ? '#3d5f4c' : '#34544a', { rough: 1.2, shadow: false }));
  }
  const tower = (x: number, top: number, w: number): Node[] => [
    piece(rect(x, top, w, 400 - top), '#8a88a6', { rough: 0.6, shadow: false }),
    piece(poly([[x - 5, top + 2], [x + w / 2, top - w * 1.3], [x + w + 5, top + 2]]), '#76739a', { rough: 0.6, shadow: false }),
  ];
  const posts: Node[] = [];
  for (let x = 20; x < 1200; x += 150) posts.push(piece(rect(x, 462, 22, 96, 3), WOOD, { edge: 'cut' }));
  const tufts: Node[] = [];
  for (let i = 0; i < 18; i++) {
    const x = 20 + r() * 1140;
    const y = 580 + r() * 70;
    tufts.push(ink([[x - 8, y], [x - 4, y - 14]], { width: 2.5, color: C.greenDark, opacity: 0.6 }));
    tufts.push(ink([[x, y], [x + 2, y - 18]], { width: 2.5, color: C.greenDark, opacity: 0.6 }));
    tufts.push(ink([[x + 8, y], [x + 10, y - 12]], { width: 2.5, color: C.greenDark, opacity: 0.6 }));
  }
  return svg({ w: 1180, h: 820, name: 'b3c3-paddock', boil: false, className: 'backdrop' }, [
    // sunset sky
    piece(rect(-20, -20, 1220, 860), '#a3aec6', { edge: 'clean', shadow: false }),
    piece(rect(-20, 150, 1220, 300), '#d6b0a2', { rough: 2, shadow: false }),
    piece(rect(-20, 270, 1220, 200), '#ecc38f', { rough: 2, shadow: false }),
    piece(circle(240, 250, 90), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(circle(240, 250, 54), C.goldLight, { rough: 0.6 }),
    piece(ellipse(520, 120, 90, 24), C.cream, { shadow: false, opacity: 0.75 }),
    piece(ellipse(590, 104, 60, 20), C.cream, { shadow: false, opacity: 0.75 }),
    piece(ellipse(880, 160, 80, 20), '#f2d9c0', { shadow: false, opacity: 0.7 }),
    // the castle far away, then the Forbidden Forest
    ...tower(560, 300, 22),
    ...tower(596, 262, 28),
    ...tower(636, 290, 22),
    piece(rect(550, 320, 120, 80), '#8a88a6', { rough: 0.6, shadow: false }),
    ...crowns,
    piece(rect(-20, 392, 1220, 70), '#34544a', { rough: 1, shadow: false }),
    // the meadow
    piece(curve([[-40, 452], [300, 436], [700, 446], [1220, 436], [1220, 860], [-40, 860]], 2), '#9ab06e', { rough: 1.3 }),
    // Hagrid's hut
    piece(rect(930, 300, 210, 170, 24), '#a89a84', { rough: 1 }),
    ...[[950, 330], [1010, 318], [1070, 336], [960, 400], [1100, 392], [1040, 430]].map(([x, y]) => piece(ellipse(x, y, 22, 13), '#958772', { edge: 'cut', fibre: false, shadow: false })),
    piece(rect(1090, 196, 30, 90), '#958772', { rough: 0.8 }),
    piece(circle(1108, 168, 18), C.stoneLight, { shadow: false, opacity: 0.7 }),
    piece(circle(1124, 136, 14), C.stoneLight, { shadow: false, opacity: 0.55 }),
    piece(poly([[904, 318], [1036, 206], [1166, 318]]), '#7a5a3a', { rough: 1.2 }),
    ...[960, 1000, 1040, 1080, 1120].map((x) => ink([[1036, 214], [x, 312]], { width: 2, color: '#5a3e26', opacity: 0.5 })),
    piece(rect(1006, 380, 54, 90, 26), C.brownDark, { edge: 'cut' }),
    piece(circle(966, 360, 16), C.candle, { edge: 'cut' }),
    // pumpkins by the fence
    ink([[330, 478], [420, 486], [520, 474]], { width: 3, color: C.greenDark, opacity: 0.7 }),
    ...pumpkin(360, 470, 22),
    ...pumpkin(430, 484, 17),
    ...pumpkin(690, 462, 26),
    ...pumpkin(860, 474, 20),
    ...pumpkin(910, 482, 16),
    // the paddock fence
    piece(band([[-20, 488], [1200, 484]], 14), WOOD, { rough: 0.8 }),
    piece(band([[-20, 528], [1200, 524]], 14), WOOD, { rough: 0.8 }),
    ...posts,
    // the tall post the clock sits on
    piece(rect(334, 410, 26, 150, 3), WOOD, { edge: 'cut' }),
    // nearer grass, calm at the bottom for the captions
    piece(curve([[-40, 566], [400, 556], [800, 566], [1220, 552], [1220, 860], [-40, 860]], 2), '#86a35f', { rough: 1.3 }),
    ...tufts,
  ]);
}
