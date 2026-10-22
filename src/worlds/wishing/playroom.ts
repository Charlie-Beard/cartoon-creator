/**
 * Mollie and Peter's playroom at the bottom of the garden: warm wooden
 * plank walls, a big small-paned window on the left looking onto the
 * garden, a toy shelf on the back wall (teddy, boats, a drum, books), a
 * rag rug in the middle of the boards, and wide double doors standing open
 * on the right (x 880-1150, y 160-640) onto green garden and blue sky with
 * clouds: the chair flies out through them. Cosy and sunny, with a warm
 * patch of light on the floor.
 *
 * Ground line y 640. The middle (x 250-850) is open for the chair and three
 * actors: only the shelf sits behind them, high on the wall, and the rug
 * lies flat. The bottom band (y 690-820) is plain boards. No chair drawn in.
 */
import { C } from '../../art/palette';
import { band, cached, circle, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../art/paper';

const FRAME = C.barkDark;

/** A tiny sailing boat on a shelf. */
function boat(x: number, base: number, hull: string, sail: string): Node[] {
  return [
    piece(poly([[x, base - 14], [x + 60, base - 14], [x + 50, base], [x + 10, base]]), hull, { edge: 'cut', fibre: false }),
    ink([[x + 30, base - 14], [x + 30, base - 56]], { width: 3, color: C.barkDark }),
    piece(poly([[x + 33, base - 54], [x + 33, base - 18], [x + 56, base - 18]]), sail, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

export const playroom = cached(() =>
  svg({ w: 1180, h: 820, name: 'wishing-playroom', className: 'backdrop' }, [
    // Warm plank walls: light boards with dark seams.
    piece(rect(-20, -20, 1220, 860), C.tan, { edge: 'clean', shadow: false }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) =>
      piece(rect(i * 96 - 20, -20, 94, 640), i % 2 ? C.sand : C.tan, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    ),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => ink([[i * 96 - 20, -20], [i * 96 - 20, 600]], { width: 2.4, color: C.brownDark, opacity: 0.3 })),
    // A picture rail along the top.
    piece(rect(-20, 70, 1220, 12), C.brown, { edge: 'cut', fibre: false }),

    // The big window on the left: the garden outside.
    piece(rect(40, 130, 300, 350, 6), FRAME),
    piece(rect(58, 148, 264, 314, 3), C.sky, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(130, 220, 56, 18), C.cloud, { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(250, 260, 46, 14), C.cloud, { edge: 'torn', fibre: false, shadow: false, opacity: 0.9 }),
    piece(poly([[58, 420], [130, 396], [220, 404], [322, 384], [322, 462], [58, 462]]), C.leafLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[58, 440], [150, 424], [322, 436], [322, 462], [58, 462]]), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    // An apple tree and some flowers.
    piece(rect(256, 340, 12, 100), C.bark, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(262, 320, 44), C.leafDark, { edge: 'cut', fibre: false, shadow: false }),
    ...[[250, 312], [276, 326], [262, 298]].map(([x, y]) => dot(x, y, 5, C.toadRed)),
    ...[[90, 430, C.yellow], [140, 444, C.pink], [200, 438, C.cream]].map(([x, y, c]) => dot(x as number, y as number, 5, c as string)),
    piece(band([[190, 148], [190, 462]], 8), FRAME, { edge: 'cut', fibre: false, shadow: false }),
    piece(band([[58, 305], [322, 305]], 8), FRAME, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(28, 476, 324, 18, 3), FRAME, { edge: 'cut' }),
    // Gingham curtains tied back.
    piece(poly([[30, 120], [90, 120], [76, 300], [96, 470], [30, 470]]), C.rose, { edge: 'cut', opacity: 0.95 }),
    piece(poly([[350, 120], [292, 120], [306, 300], [286, 470], [350, 470]]), C.rose, { edge: 'cut', opacity: 0.95 }),
    ...[0, 1, 2, 3].map((i) => ink([[40 + i * 14, 130], [38 + i * 14, 460]], { width: 3, color: C.cream, opacity: 0.25 })),

    // The toy shelf, high on the back wall (clear of the actors' heads).
    piece(rect(400, 200, 400, 14, 3), C.brown, { edge: 'cut' }),
    piece(poly([[430, 214], [450, 214], [450, 244]]), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[770, 214], [750, 214], [750, 244]]), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    // Teddy.
    piece(circle(430, 140, 16), C.teddy, { edge: 'cut' }),
    piece(circle(430, 168, 28), C.teddy, { edge: 'cut' }),
    piece(circle(450, 124, 8), C.teddy, { edge: 'cut', fibre: false }),
    piece(circle(410, 124, 8), C.teddy, { edge: 'cut', fibre: false }),
    piece(circle(430, 146, 10), C.teddyLight, { edge: 'cut', fibre: false, shadow: false }),
    dot(425, 138, 2.4, C.ink),
    dot(437, 138, 2.4, C.ink),
    piece(ellipse(430, 186, 14, 12), C.teddyLight, { edge: 'cut', fibre: false, shadow: false }),
    ...boat(490, 200, C.toyRed, C.cream),
    ...boat(570, 200, C.toyBlue, C.toyYellow),
    // A drum.
    piece(rect(672, 150, 56, 50, 4), C.toyRed, { edge: 'cut' }),
    piece(ellipse(700, 150, 28, 8), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    ink([[678, 156], [690, 196], [702, 156], [714, 196], [722, 160]], { width: 2, color: C.goldLight }),
    // Books leaning.
    ...[C.toyBlue, C.toyGreen, C.toyYellow].map((c, i) => piece(rect(748 + i * 18, 144 - i * 4, 16, 56 + i * 4, 1), c, { edge: 'cut', fibre: false })),
    // A bunting string across the wall.
    ink([[380, 82], [500, 104], [620, 82], [740, 104], [850, 82]], { width: 2.4, color: C.brownDark, opacity: 0.6 }),
    ...[[500, C.toyYellow], [560, C.toyBlue], [620, C.toyGreen], [690, C.toyRed], [770, C.toyYellow]].map(([x, c]) => {
      const px = x as number;
      const y = 82 + 22 * (1 - Math.abs(((px - 380) % 240) - 120) / 120);
      return piece(poly([[px - 13, y], [px + 13, y], [px, y + 28]]), c as string, { edge: 'cut', fibre: false, shadow: false });
    }),

    // Floorboards and skirting.
    piece(rect(-20, 600, 1220, 240), C.wood, { edge: 'clean', shadow: false }),
    piece(rect(-20, 590, 1220, 16), C.brownDark, { edge: 'cut', fibre: false }),
    ...[-20, 150, 330, 510, 690, 870, 1050].map((x) => ink([[x + 40, 610], [x - 30 - (x % 60), 830]], { width: 2.4, color: C.brownDark, opacity: 0.28 })),
    ...[670, 740, 800].map((y) => ink([[-20, y], [1200, y + 2]], { width: 2, color: C.brownDark, opacity: 0.18 })),
    // Sunlight from the doors lying on the boards.
    piece(poly([[890, 650], [1150, 650], [1100, 760], [800, 760]]), C.goldLight, { edge: 'torn', fibre: false, shadow: false, opacity: 0.22 }),
    // The rag rug, flat in the middle.
    piece(ellipse(540, 668, 290, 46), C.rose, { rough: 0.8 }),
    piece(ellipse(540, 668, 236, 34), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(540, 668, 184, 24), C.toyBlue, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(540, 668, 120, 14), C.toyYellow, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    // The open double doors on the right: sky and garden through the gap.
    piece(rect(868, 138, 296, 510, 4), FRAME),
    piece(rect(886, 160, 262, 480), C.sky, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(886, 160, 262, 200), '#a9cae6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(ellipse(980, 250, 70, 24), C.cloud, { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(1050, 232, 46, 18), C.cloud, { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(1100, 330, 60, 18), C.cloud, { edge: 'torn', fibre: false, shadow: false, opacity: 0.9 }),
    piece(poly([[886, 460], [960, 420], [1040, 440], [1148, 410], [1148, 640], [886, 640]]), C.leafLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[886, 520], [1000, 480], [1148, 520], [1148, 640], [886, 640]]), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    // A garden gate-post, a tree and flowers far off.
    piece(rect(1090, 380, 10, 70), C.bark, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(1095, 362, 34), C.leafDark, { edge: 'cut', fibre: false, shadow: false }),
    ...[[930, 560, C.yellow], [990, 590, C.pink], [1060, 570, C.cream], [1110, 600, C.yellow], [950, 610, C.rose]].map(([x, y, c]) => dot(x as number, y as number, 5, c as string)),
    // The door leaves, swung back against the walls.
    piece(poly([[868, 138], [892, 150], [892, 640], [868, 648]]), C.brown, { edge: 'cut' }),
    piece(poly([[1164, 138], [1140, 150], [1140, 640], [1164, 648]]), C.brown, { edge: 'cut' }),
    piece(poly([[874, 190], [888, 196], [888, 300], [874, 300]]), C.barkLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[1158, 190], [1144, 196], [1144, 300], [1158, 300]]), C.barkLight, { edge: 'cut', fibre: false, shadow: false }),
    dot(889, 420, 4, C.brass),
    dot(1143, 420, 4, C.brass),
    piece(rect(852, 128, 326, 16, 3), FRAME, { edge: 'cut', fibre: false }),

  ]),
);
