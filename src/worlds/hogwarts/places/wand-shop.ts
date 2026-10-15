/** From Wizard Words, b1c2 (shop). */
import { C } from '../../../art/palette';
import { band, circle, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const WALL = '#4e3a2e';

const BOX_COLORS = [C.tan, C.sand, C.stone, C.cream, C.wood, C.stoneLight, '#8a6f8f', '#6d7f86', C.brown];

/** Ollivander's shop: a Diagon Alley window, and wand boxes up to the ceiling. */
export function shop(): string {
  const r = rng(1902);
  const nodes: Node[] = [
    piece(rect(-20, -20, 1220, 600), WALL, { edge: 'clean', shadow: false }),
  ];

  // The shop window, with Diagon Alley outside.
  nodes.push(piece(rect(50, 70, 380, 330), C.wood, { rough: 0.8 }));
  nodes.push(piece(rect(66, 86, 348, 298), '#d7e0e2', { edge: 'clean', shadow: false }));
  const shops: Array<[number, number, number, string]> = [
    [60, 84, 172, C.rose],
    [140, 76, 148, C.teal],
    [214, 90, 188, C.sand],
    [302, 62, 140, '#8a6f8f'],
    [362, 60, 176, C.green],
  ];
  for (const [x, w, top, col] of shops) {
    const lean = (r() - 0.5) * 14;
    nodes.push(piece(poly([[x, 390], [x, top + 10], [x + w / 2 + lean, top - 34], [x + w, top + 10], [x + w, 390]]), col, { rough: 0.7 }));
    nodes.push(piece(rect(x + w / 2 - 12, top + 26, 24, 30, 4), C.candle, { edge: 'cut', fibre: false, shadow: false }));
    nodes.push(piece(rect(x + 10, top + 76, w - 20, 26, 3), r() > 0.5 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }));
  }
  // Bunting across the street.
  nodes.push(ink([[66, 120], [160, 140], [250, 122], [340, 142], [414, 124]], { width: 2, color: C.brownDark, opacity: 0.6 }));
  [[96, 128], [130, 136], [190, 136], [222, 128], [282, 130], [314, 138], [372, 134]].forEach(([x, y], i) =>
    nodes.push(piece(poly([[x - 9, y], [x + 9, y], [x, y + 16]]), [C.red, C.gold, C.blue][i % 3], { edge: 'cut', fibre: false, shadow: false })),
  );
  // Frame bars and the cross of the window.
  nodes.push(
    piece(rect(50, 70, 380, 18), C.wood, { edge: 'cut' }),
    piece(rect(50, 382, 380, 18), C.wood, { edge: 'cut' }),
    piece(rect(50, 70, 18, 330), C.wood, { edge: 'cut' }),
    piece(rect(412, 70, 18, 330), C.wood, { edge: 'cut' }),
    piece(rect(233, 84, 14, 300), C.wood, { edge: 'cut' }),
    piece(rect(66, 228, 348, 12), C.wood, { edge: 'cut' }),
    // The single wand on its faded purple cushion.
    piece(ellipse(240, 374, 70, 16), '#7d6890', { rough: 0.8 }),
    piece(band([[192, 368], [286, 360]], 6), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(36, 394, 410, 20, 3), C.brown, { rough: 0.8 }),
  );

  // A hanging lamp.
  nodes.push(
    piece(circle(470, 140, 70), C.candle, { edge: 'clean', shadow: false, opacity: 0.12 }),
    ink([[470, 20], [470, 104]], { width: 3, color: C.ink, opacity: 0.7 }),
    piece(poly([[446, 104], [494, 104], [484, 150], [456, 150]]), C.brownDark, { edge: 'cut' }),
    piece(rect(458, 112, 24, 30, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
  );

  // Wall-to-ceiling shelves of thin wand boxes.
  nodes.push(piece(rect(508, 30, 18, 540), C.brownDark, { edge: 'cut' }));
  for (let y = 36; y < 520; y += 56) {
    let x = 530;
    while (x < 1190) {
      const w = 15 + r() * 12;
      const hh = 36 + r() * 10;
      const col = BOX_COLORS[Math.floor(r() * BOX_COLORS.length)];
      nodes.push(piece(rect(x, y + 46 - hh, w, hh, 2), col, { edge: 'cut', fibre: false }));
      if (r() > 0.55) nodes.push(dot(x + w / 2, y + 46 - hh * 0.55, 3, C.cream, 0.8));
      x += w + 2 + r() * 3;
    }
    nodes.push(piece(rect(512, y + 46, 700, 9), C.brownDark, { edge: 'cut' }));
  }

  // The floor.
  nodes.push(
    piece(rect(-20, 560, 1220, 300), C.wood, { rough: 0.8, shadow: false }),
    piece(rect(-20, 548, 1220, 16), C.brownDark, { edge: 'cut' }),
    ...[598, 640].map((y) => ink([[-10, y], [1190, y + 2]], { width: 2.5, color: C.brownDark, opacity: 0.45 })),
    ...[[180, 564, 598], [520, 564, 598], [860, 564, 598], [340, 600, 640], [700, 600, 640], [1040, 600, 640]].map(([x, a, b]) =>
      ink([[x, a], [x + 2, b]], { width: 2.5, color: C.brownDark, opacity: 0.45 }),
    ),
  );
  // Dust floating in the lamplight.
  for (let i = 0; i < 14; i++) nodes.push(dot(380 + r() * 220, 120 + r() * 340, 1.5 + r() * 2, C.cream, 0.35));

  return svg({ w: 1180, h: 820, name: 'b1c2-shop', boil: false, className: 'backdrop' }, nodes);
}
