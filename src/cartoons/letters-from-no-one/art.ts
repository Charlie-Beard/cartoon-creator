/**
 * One-off art for Letters from No One: the egg with a letter in it, the
 * newspaper, the torn letter, the door of the hut (standing, so it can fall)
 * and the dark night behind it, the front of the hut's sofa (for hiding
 * behind), Hagrid's cake box, umbrella and sausages, and the cake Harry
 * draws in the dust.
 */
import { C, cached, circle, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../kit';

/** An egg with a letter poking out of a crack in the top, 140 × 170. */
export const egg = cached(() =>
  svg({ w: 140, h: 170, name: 'letters-egg', label: 'An egg with a letter in it' }, [
    // the letter, sticking out of the top
    piece(poly([[40, 56], [96, 20], [112, 60], [60, 84]]), C.cream),
    piece(poly([[40, 56], [74, 74], [96, 20]]), C.sand, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(76, 54, 9), C.red, { edge: 'cut' }),
    // the egg
    piece(ellipse(70, 118, 48, 56), '#f3e6c8'),
    piece(ellipse(56, 100, 14, 22, -0.4), '#fff7e2', { edge: 'clean', shadow: false, opacity: 0.7 }),
    ...[[44, 134], [88, 128], [76, 150], [96, 104], [52, 156]].map(([x, y]) => dot(x, y, 3, '#c9a874')),
    ink([[34, 78], [48, 70], [58, 80], [72, 68], [86, 80], [104, 72]], { width: 3, color: '#a88a5a' }),
  ]),
);

/** Mr Dursley's newspaper, held up low in front of him, 220 × 150. */
export const newspaper = cached(() =>
  svg({ w: 220, h: 150, name: 'letters-newspaper', label: 'A newspaper' }, [
    piece(rect(6, 8, 208, 136, 2), '#ecebe2'),
    piece(rect(18, 20, 184, 20, 1), '#5b5b5b', { edge: 'cut', fibre: false, shadow: false }),
    ...[56, 72, 88, 104, 120].map((y) => ink([[18, y], [100, y]], { width: 3, color: '#9a9a92' })),
    ...[56, 72, 88, 104, 120].map((y) => ink([[120, y], [202, y]], { width: 3, color: '#9a9a92' })),
  ]),
);

/** Half of a letter torn in two: a scrap of cream paper, 90 × 70. */
export const scrap = cached(() =>
  svg({ w: 90, h: 70, name: 'letters-scrap', label: 'A scrap of paper' }, [
    piece(poly([[8, 12], [74, 6], [82, 36], [60, 62], [14, 56]]), C.cream),
    ink([[22, 24], [64, 20]], { width: 2, color: C.sand }),
  ]),
);

/** The letter, opened out: cream paper with lines of writing and a torn red seal, 150 × 195. */
export const openedLetter = cached(() =>
  svg({ w: 150, h: 195, name: 'letters-opened', label: 'An opened letter' }, [
    piece(rect(8, 8, 134, 179, 3), '#f7efd9'),
    ink([[26, 34], [124, 34]], { width: 4, color: '#8a5a3a' }),
    ...[58, 76, 94, 112, 130, 148].map((y, i) => ink([[26, y], [i === 5 ? 80 : 124, y]], { width: 3, color: '#a99c80' })),
    piece(circle(112, 164, 12), C.red, { edge: 'cut' }),
  ]),
);

/** The hut's door, standing: planks, two iron straps and a handle, 200 × 550 (placed on the backdrop's door at 50, 110). */
export const doorLeaf = cached(() =>
  svg({ w: 200, h: 550, name: 'letters-door-leaf', label: 'A door' }, [
    piece(rect(0, 0, 200, 550, 4), '#7a5638', { edge: 'cut', fibre: false }),
    ...[1, 2, 3].map((i) => ink([[i * 50, 2], [i * 50, 548]], { width: 3, color: '#4a3424', opacity: 0.8 })),
    piece(rect(0, 100, 200, 18, 3), '#3e3e46', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(0, 430, 200, 18, 3), '#3e3e46', { edge: 'cut', fibre: false, shadow: false }),
    ...[[20, 109], [180, 109], [20, 439], [180, 439]].map(([x, y]) => dot(x, y, 4, '#6b6b72')),
    piece(circle(172, 290, 12), '#6b6b72', { edge: 'cut' }),
    piece(rect(160, 282, 24, 8, 3), '#55555c', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** The dark stormy night behind the door when it has gone, 200 × 550 (placed at 50, 110). */
export const nightDoorway = cached(() => {
  const rain = Array.from({ length: 22 }, (_, i) => ink([[16 + ((i * 53) % 170), 20 + ((i * 97) % 480)], [8 + ((i * 53) % 170), 52 + ((i * 97) % 480)]], { width: 2, color: '#9fb3cc', opacity: 0.45, wobble: 0.3 }));
  return svg({ w: 200, h: 550, name: 'letters-night', label: 'The dark night' }, [
    piece(rect(0, 0, 200, 550), '#0d1424', { edge: 'clean', shadow: false }),
    piece(rect(0, 0, 200, 260), '#17233c', { edge: 'clean', shadow: false, opacity: 0.8 }),
    ...rain,
  ]);
});

/** The front of the hut's sofa, drawn to match the backdrop's, so people can hide behind it. 320 × 230 (placed at 870, 440). */
export const sofaFront = cached(() =>
  svg({ w: 320, h: 230, name: 'letters-sofa-front', label: 'A lumpy sofa' }, [
    piece(rect(20, 0, 300, 130, 40), '#7a5a4a', { edge: 'torn', fibre: false }),
    piece(rect(20, 80, 300, 140, 22), '#8a6a56', { edge: 'torn', fibre: false }),
    piece(rect(34, 164, 270, 56, 10), '#7a5a4a', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(170, 100, 70, 18), '#6a4a3c', { edge: 'clean', shadow: false, opacity: 0.45 }),
    piece(ellipse(90, 80, 40, 14), '#9a7a64', { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(rect(220, 30, 56, 44, 6), '#a37a56', { edge: 'cut', fibre: false, shadow: false }),
    ink([[224, 34], [272, 34], [272, 70], [224, 70], [224, 34]], { width: 2, color: '#4a3424', opacity: 0.7 }),
    piece(rect(60, 100, 90, 40, 18), '#8f6a58', { edge: 'torn', fibre: false, shadow: false }),
    piece(rect(0, 80, 40, 140, 16), '#6a4a3c', { edge: 'torn', fibre: false }),
  ]),
);

/** Hagrid's cake box: brown card with a string bow and a lid that lifts off, 220 × 150. */
export const cakeBox = cached(() =>
  svg({ w: 220, h: 150, name: 'letters-cake-box', label: 'A cake box' }, [
    piece(rect(14, 50, 192, 92, 4), '#d9b98a'),
    ink([[110, 52], [110, 140]], { width: 5, color: '#a07a4a' }),
    group({ part: 'lid', origin: [110, 40] }, [
      piece(rect(6, 18, 208, 40, 4), '#e6c898'),
      ink([[110, 20], [110, 56]], { width: 5, color: '#a07a4a' }),
      piece(poly([[110, 20], [78, 4], [90, 24]]), '#a07a4a', { edge: 'cut', shadow: false }),
      piece(poly([[110, 20], [142, 4], [130, 24]]), '#a07a4a', { edge: 'cut', shadow: false }),
    ]),
  ]),
);

/** Hagrid's pink umbrella, closed, pointing right: a hooked handle on the left, a furled pink cloth tapering to the tip. 300 × 70. */
export const umbrella = cached(() =>
  svg({ w: 300, h: 70, name: 'letters-umbrella', label: 'A pink umbrella' }, [
    ink([[14, 38], [8, 22], [24, 12], [36, 24], [40, 36]], { width: 7, color: '#6b3f26' }),
    ink([[38, 36], [120, 34]], { width: 6, color: '#55555c' }),
    piece(poly([[110, 22], [200, 14], [290, 34], [200, 54], [110, 48]]), '#f08fb0'),
    piece(poly([[130, 26], [220, 22], [288, 34], [220, 40], [130, 40]]), '#f9b9d0', { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    piece(rect(150, 12, 12, 44, 3), '#b5476b', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(210, 14, 10, 40, 3), '#b5476b', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** Two sausages on a long stick, pointing right, 260 × 70. */
export const sausages = cached(() =>
  svg({ w: 260, h: 70, name: 'letters-sausages', label: 'Sausages on a stick' }, [
    ink([[8, 52], [252, 28]], { width: 5, color: '#6b4a32' }),
    piece(ellipse(170, 38, 34, 11, -0.1), '#b9573a'),
    piece(ellipse(214, 34, 32, 11, -0.1), '#c4663f'),
    ink([[150, 34], [190, 32]], { width: 2, color: '#f0a070', opacity: 0.7 }),
    ink([[196, 30], [234, 28]], { width: 2, color: '#f0a070', opacity: 0.7 }),
  ]),
);

/**
 * The birthday cake Harry draws in the dust, 240 × 190. Chalky strokes
 * (parts `s1` to `s6`, then `candles`, then `flames`), each hidden until it
 * is drawn.
 */
export const dustCake = cached(() => {
  const chalk = { width: 5, color: '#e6dfc8', opacity: 0.9, wobble: 1.2 };
  return svg({ w: 240, h: 190, name: 'letters-dust-cake', label: 'A cake drawn in the dust' }, [
    group({ part: 's1', opacity: 0 }, [ink([[30, 168], [210, 168]], chalk)]),
    group({ part: 's2', opacity: 0 }, [ink([[30, 168], [28, 96]], chalk), ink([[210, 168], [212, 96]], chalk)]),
    group({ part: 's3', opacity: 0 }, [ink([[28, 96], [70, 84], [120, 90], [170, 84], [212, 96]], chalk)]),
    group({ part: 's4', opacity: 0 }, [ink([[30, 120], [60, 132], [90, 118], [120, 132], [150, 118], [180, 132], [210, 120]], { ...chalk, width: 4 })]),
    group({ part: 's5', opacity: 0 }, [ink([[28, 96], [40, 84], [120, 76], [200, 84], [212, 96]], { ...chalk, width: 4 })]),
    group({ part: 'candles', opacity: 0 }, [
      ...[70, 120, 170].map((x) => ink([[x, 82], [x, 40]], { width: 6, color: '#f0d890', opacity: 0.95 })),
    ]),
    group({ part: 'flames', opacity: 0 }, [
      ...[70, 120, 170].map((x) => piece(ellipse(x, 28, 7, 12), '#ffd36b', { edge: 'clean', shadow: false })),
    ]),
  ]);
});
