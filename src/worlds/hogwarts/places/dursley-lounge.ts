import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/**
 * The Dursleys' sitting room at No. 4 Privet Drive, by day (1180 × 820):
 * mint wallpaper, a boarded-up fireplace with an electric fire in the middle,
 * a flowery sofa under the window at the left, an armchair, a standard lamp
 * and a television at the right.
 *
 * Fixed spots a script can rely on:
 *   fireplace opening  x 460–720, y 380–600 (a flat cream board covers it)
 *   electric fire      x 490–690, y 500–600; two glowing bars at y 538–550 and 562–574
 *   mantelpiece        shelf x 390–790, y 268–290; clock x 560–620, y 196–266
 */
export function dursleyLounge(): string {
  const wall = '#d9ead8';
  const cream = '#f4eddc';
  const flowerCloth = (x: number, y: number, w: number, h: number): Node[] => {
    const out: Node[] = [];
    for (let j = 0; j < Math.floor(h / 36); j++) {
      for (let i = 0; i < Math.floor(w / 40); i++) {
        const px = x + 22 + i * 40 + (j % 2) * 18;
        const py = y + 22 + j * 36;
        if (px < x + w - 8) out.push(dot(px, py, 6, j % 2 ? '#f2cf8a' : '#fff0e0', 0.8), dot(px, py, 2, '#c4706c', 0.9));
      }
    }
    return out;
  };

  const stripes: Node[] = [];
  for (let x = 20; x < 1200; x += 70) stripes.push(ink([[x, 0], [x, 600]], { width: 14, color: '#cfe2cf', opacity: 0.6 }));

  return svg({ w: 1180, h: 820, name: 'hogwarts-dursley-lounge', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    ...stripes,
    // skirting and carpet
    piece(rect(-20, 590, 1220, 18), cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(-20, 606, 1220, 230), '#c9b8d4', { edge: 'clean', shadow: false }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].flatMap((c) => [0, 1].map((r) => dot(c * 100 + (r % 2) * 50, 628 + r * 24, 4, '#e0d2e8', 0.7))),
    piece(rect(-20, 700, 1220, 130), '#c4b2d0', { edge: 'clean', shadow: false }),

    // ---- the big window with net curtains (left, daytime)
    piece(rect(60, 80, 290, 330, 6), cream, { edge: 'cut' }),
    piece(rect(76, 96, 258, 298), C.sky, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(76, 96, 258, 90), '#a8c8e6', { edge: 'clean', shadow: false, opacity: 0.6 }),
    piece(ellipse(150, 150, 40, 11), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(280, 130, 30, 9), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    // the house across the road and a hedge
    piece(rect(120, 270, 150, 124), '#c98a6a', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[110, 272], [195, 220], [280, 272]]), '#7f6a74', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(180, 310, 30, 84), '#f8f4ea', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(76, 366, 258, 28), C.green, { edge: 'cut', fibre: false, shadow: false }),
    ink([[205, 96], [205, 394]], { width: 8, color: cream }),
    ink([[76, 245], [334, 245]], { width: 8, color: cream }),
    piece(rect(48, 404, 314, 16, 4), '#e8e2d0', { edge: 'cut' }),
    // net curtains: pale and see-through, looped at the sides
    piece(curve([[62, 70], [200, 70], [200, 100], [190, 400], [62, 400]], 2), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(curve([[348, 70], [210, 70], [210, 100], [220, 400], [348, 400]], 2), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(curve([[46, 70], [88, 70], [92, 240], [80, 410], [46, 410]], 2), '#fbf3e4', { edge: 'cut', opacity: 0.9 }),
    piece(curve([[364, 70], [322, 70], [318, 240], [330, 410], [364, 410]], 2), '#fbf3e4', { edge: 'cut', opacity: 0.9 }),
    piece(rect(40, 62, 332, 12, 5), '#b88a5c', { edge: 'cut', fibre: false }),

    // ---- the fireplace: tiled surround, mantelpiece, board and electric fire
    piece(rect(400, 296, 380, 306, 4), '#c9a07a', { edge: 'cut' }),
    piece(rect(430, 330, 320, 272, 4), '#efe3cf', { edge: 'cut', fibre: false, shadow: false }),
    // the opening, boarded over with a flat panel
    piece(rect(460, 380, 260, 222, 3), '#8a7868', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(466, 386, 248, 216, 2), '#e3d8c4', { edge: 'cut', fibre: false, shadow: false }),
    ...[[474, 394], [706, 394]].map(([x, y]) => dot(x, y, 3.5, '#a89c88')),
    ink([[590, 392], [590, 500]], { width: 2, color: '#cfc3ac', opacity: 0.7 }),
    // electric fire
    piece(rect(486, 496, 208, 106, 6), '#6a5a52', { edge: 'cut' }),
    piece(rect(496, 506, 188, 86, 4), '#3a302c', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(590, 556, 100, 40), '#f2a65a', { edge: 'clean', shadow: false, opacity: 0.3 }),
    piece(rect(512, 536, 156, 14, 7), '#f08a30', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(512, 560, 156, 14, 7), '#f08a30', { edge: 'cut', fibre: false, shadow: false }),
    ink([[524, 543], [656, 543]], { width: 4, color: '#ffd27a', opacity: 0.9 }),
    ink([[524, 567], [656, 567]], { width: 4, color: '#ffd27a', opacity: 0.9 }),
    piece(rect(496, 580, 188, 12, 3), '#5a4a44', { edge: 'cut', fibre: false, shadow: false }),
    // mantelpiece shelf
    piece(rect(386, 268, 408, 24, 5), '#b88a5c', { edge: 'cut' }),
    // the clock in the middle
    piece(rect(568, 206, 44, 62, 8), '#d8a43f', { edge: 'cut' }),
    piece(circle(590, 232, 18), C.white, { edge: 'cut', fibre: false, shadow: false }),
    ink([[590, 232], [590, 219]], { width: 2.5, color: C.ink }),
    ink([[590, 232], [599, 236]], { width: 2.5, color: C.ink }),
    // framed photos of Dudley, one at each end
    piece(rect(420, 216, 56, 52, 3), '#d8a43f', { edge: 'cut' }),
    piece(rect(427, 223, 42, 38, 2), '#f6efdc', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(448, 240, 11), '#f0b7ae', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(448, 232, 9, 4), '#e8c45a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(704, 220, 56, 48, 3), '#d8a43f', { edge: 'cut' }),
    piece(rect(711, 227, 42, 34, 2), '#f6efdc', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(732, 244, 11), '#f0b7ae', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(732, 236, 9, 4), '#e8c45a', { edge: 'cut', fibre: false, shadow: false }),
    // a bigger portrait high on the wall above the mantel
    piece(rect(520, 70, 140, 100, 4), '#d8a43f', { edge: 'cut' }),
    piece(rect(530, 80, 120, 80, 3), '#f2e4cc', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(590, 122, 24), '#f0b7ae', { edge: 'cut', fibre: false, shadow: false }),

    // ---- the flowery sofa under the window (left)
    piece(rect(20, 436, 320, 100, 24), '#e8a8a0', { edge: 'cut' }),
    ...flowerCloth(30, 446, 300, 80),
    piece(rect(10, 484, 70, 124, 22), '#d99a95', { edge: 'cut' }),
    piece(rect(284, 484, 70, 124, 22), '#d99a95', { edge: 'cut' }),
    piece(rect(70, 520, 220, 84, 16), '#f0b7ae', { edge: 'cut' }),
    ...flowerCloth(80, 524, 200, 72),
    piece(rect(40, 604, 20, 10, 3), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(304, 604, 20, 10, 3), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),

    // ---- standard lamp, right of the fireplace
    ink([[840, 300], [840, 600]], { width: 7, color: '#b88a5c' }),
    piece(ellipse(840, 602, 34, 8), '#b88a5c', { edge: 'cut', fibre: false }),
    piece(poly([[808, 300], [820, 238], [860, 238], [872, 300]]), '#fbeed2', { edge: 'cut' }),

    // ---- armchair
    piece(rect(890, 440, 150, 150, 26), '#9fc0d8', { edge: 'cut' }),
    ...flowerCloth(900, 450, 130, 100),
    piece(rect(876, 510, 40, 92, 16), '#8bb0cc', { edge: 'cut' }),
    piece(rect(1014, 510, 40, 92, 16), '#8bb0cc', { edge: 'cut' }),
    piece(rect(912, 540, 106, 60, 12), '#b4cfe2', { edge: 'cut' }),

    // ---- television on a stand (far right)
    piece(rect(1076, 488, 120, 12, 3), '#b88a5c', { edge: 'cut', fibre: false }),
    piece(rect(1086, 500, 8, 104), '#a67848', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(1170, 500, 8, 104), '#a67848', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(1082, 398, 130, 92, 12), '#6a5a52', { edge: 'cut' }),
    piece(rect(1092, 408, 100, 70, 8), '#8aa09a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(1110, 414, 40, 20, 8), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.25 }),
  ]);
}
