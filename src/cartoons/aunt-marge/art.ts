/** One-off art for Aunt Marge Floats Away: things only this episode needs. */
import { C, cached, circle, ellipse, ink, piece, poly, rect, svg } from '../../kit';

/** Harry's permission form: a sheet of paper with lines and a tick box, 120 × 150. */
export const form = cached(() =>
  svg({ w: 120, h: 150, name: 'aunt-marge-form', label: 'A permission form' }, [
    piece(rect(8, 6, 104, 138, 2), '#f1ecdc'),
    piece(rect(20, 18, 80, 14, 1), '#7d6a56', { edge: 'cut', fibre: false, shadow: false }),
    ...[48, 64, 80, 96].map((y) => ink([[20, y], [100, y]], { width: 3, color: '#a9a595' })),
    piece(rect(20, 110, 26, 22, 2), C.cream, { edge: 'cut', fibre: false }),
    ink([[26, 120], [32, 128], [42, 112]], { width: 4, color: C.green }),
    ink([[56, 126], [100, 124]], { width: 3, color: '#9b8f7a' }),
  ]),
);

/** Aunt Marge's enormous suitcase: a fat tan case with a strap, brass catches and a tartan band, 330 × 230. */
export const suitcase = cached(() =>
  svg({ w: 330, h: 230, name: 'aunt-marge-suitcase', label: 'A huge suitcase' }, [
    piece(rect(88, 6, 154, 30, 14), C.brownDark),
    piece(rect(104, 14, 122, 14, 7), C.wood, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(10, 28, 310, 188, 24), C.tan),
    piece(rect(10, 96, 310, 44, 2), C.rust, { edge: 'cut', fibre: false, shadow: false }),
    ...[40, 80, 120, 160, 200, 240, 280].map((x) => ink([[x, 98], [x, 138]], { width: 4, color: C.redDark })),
    piece(rect(150, 28, 30, 188, 3), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(60, 28, 14, 188, 3), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(256, 28, 14, 188, 3), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(146, 112, 38, 28, 4), C.gold, { edge: 'cut' }),
    piece(circle(165, 126, 5), C.brownDark, { edge: 'clean', shadow: false }),
    piece(poly([[34, 210], [62, 210], [58, 226], [38, 226]]), C.brownDark, { edge: 'cut', shadow: false }),
    piece(poly([[268, 210], [296, 210], [292, 226], [272, 226]]), C.brownDark, { edge: 'cut', shadow: false }),
  ]),
);

/** A teacup on its saucer, 110 × 70. */
export const teacup = cached(() =>
  svg({ w: 110, h: 70, name: 'aunt-marge-teacup', label: 'A cup of tea' }, [
    piece(ellipse(55, 56, 50, 10), C.white),
    piece(rect(26, 20, 52, 36, 12), C.cream),
    piece(ellipse(52, 22, 25, 6), '#9a6a42', { edge: 'cut', fibre: false, shadow: false }),
    ink([[78, 28], [96, 30], [92, 46], [76, 46]], { width: 5, color: C.cream }),
    ink([[34, 34], [70, 34]], { width: 3, color: C.rose }),
  ]),
);

/** Ripper's saucer of tea on the floor, 130 × 50: a wide dish with a puddle and a few spills. */
export const saucer = cached(() =>
  svg({ w: 130, h: 50, name: 'aunt-marge-saucer', label: 'A saucer of tea' }, [
    piece(ellipse(65, 32, 60, 15), C.white),
    piece(ellipse(65, 29, 46, 9), '#9a6a42', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(124, 40, 5, 3), '#9a6a42', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A coat button, 40 × 40: cream with four holes, popped off Aunt Marge. */
export const button = cached(() =>
  svg({ w: 40, h: 40, name: 'aunt-marge-button', label: 'A button' }, [
    piece(circle(20, 20, 17), C.cream, { edge: 'cut' }),
    piece(circle(20, 20, 11), C.sand, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(15, 15, 2.5), C.brownDark, { edge: 'clean', shadow: false }),
    piece(circle(25, 15, 2.5), C.brownDark, { edge: 'clean', shadow: false }),
    piece(circle(15, 25, 2.5), C.brownDark, { edge: 'clean', shadow: false }),
    piece(circle(25, 25, 2.5), C.brownDark, { edge: 'clean', shadow: false }),
  ]),
);

/** A mug of hot chocolate with a little steam, 110 × 120. */
export const mug = cached(() =>
  svg({ w: 110, h: 120, name: 'aunt-marge-mug', label: 'A mug of hot chocolate' }, [
    ink([[40, 30], [34, 14], [42, 2]], { width: 4, color: '#e4ddd0' }),
    ink([[62, 30], [68, 14], [60, 2]], { width: 4, color: '#e4ddd0' }),
    piece(rect(18, 36, 62, 74, 10), C.red),
    piece(ellipse(49, 38, 31, 7), '#5a3a28', { edge: 'cut', fibre: false, shadow: false }),
    ink([[80, 54], [100, 56], [98, 84], [78, 86]], { width: 7, color: C.red }),
    piece(rect(18, 70, 62, 10, 1), C.cream, { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A folded newspaper held up to read, 230 × 160. */
export const newspaper = cached(() =>
  svg({ w: 230, h: 160, name: 'aunt-marge-newspaper', label: 'A newspaper' }, [
    piece(rect(6, 8, 218, 144, 2), '#ecebe2'),
    piece(rect(18, 20, 194, 24, 1), '#5b5b5b', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(18, 54, 70, 50, 2), '#bdb9a4', { edge: 'cut', fibre: false, shadow: false }),
    ...[64, 80, 96, 112, 128].map((y) => ink([[96, y], [210, y]], { width: 3, color: '#9a9a92' })),
    ...[118, 132].map((y) => ink([[18, y], [86, y]], { width: 3, color: '#9a9a92' })),
  ]),
);

/** A brass-framed bunk bed from the Knight Bus, seen from the side, quilt up to the pillow, 440 × 200. */
export const bed = cached(() =>
  svg({ w: 440, h: 200, name: 'aunt-marge-bed', label: 'A brass bed' }, [
    ink([[14, 40], [14, 190]], { width: 9, color: C.gold }),
    ink([[426, 70], [426, 190]], { width: 9, color: C.gold }),
    ink([[14, 70], [426, 100]], { width: 4, color: C.gold }),
    piece(ellipse(60, 66, 52, 22), C.white),
    piece(rect(10, 90, 420, 84, 14), C.purple),
    ...[
      [28, C.yellow], [100, C.orange], [172, C.green], [244, C.blue], [316, C.rose],
    ].map(([x, col]) => piece(rect(x as number, 98, 68, 68, 6), col as string, { edge: 'cut', fibre: false, shadow: false })),
    piece(circle(14, 36, 9), C.gold, { edge: 'cut' }),
    piece(circle(426, 66, 9), C.gold, { edge: 'cut' }),
    piece(rect(24, 176, 8, 22, 2), C.gold, { edge: 'clean', shadow: false }),
    piece(rect(408, 176, 8, 22, 2), C.gold, { edge: 'clean', shadow: false }),
  ]),
);

/** Two pale, gleaming eyes in the dark with a soft glow round them, 130 × 60. */
export const eyes = cached(() =>
  svg({ w: 130, h: 60, name: 'aunt-marge-eyes', label: 'Two pale eyes' }, [
    piece(ellipse(34, 30, 24, 14), '#dfe8e0', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(ellipse(96, 30, 24, 14), '#dfe8e0', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(ellipse(34, 30, 15, 9), '#f4f1d6', { edge: 'clean', shadow: false }),
    piece(ellipse(96, 30, 15, 9), '#f4f1d6', { edge: 'clean', shadow: false }),
    piece(ellipse(36, 30, 4, 8), C.ink, { edge: 'clean', shadow: false }),
    piece(ellipse(98, 30, 4, 8), C.ink, { edge: 'clean', shadow: false }),
  ]),
);
