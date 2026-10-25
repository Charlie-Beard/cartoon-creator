import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/**
 * The front hall at No. 4 Privet Drive (1180 × 820): peach wallpaper, flowery
 * carpet, the front door at the left with its brass letterbox, the stairs
 * climbing to the right and Harry's cupboard tucked under them.
 *
 * Fixed spots a script can rely on:
 *   front door  x 40–250, y 150–612 (frosted panel x 90–200, y 200–380)
 *   letterbox   x 90–200, y 452–498 (brass plate, flap, waist height)
 *   cupboard    door x 780–900, y 418–606 (latch at x 872, y 520; grille x 810–870, y 440–470)
 */
export function dursleyHall(): string {
  const wall = '#f2d9cf';
  const white = '#f8f4ea';
  const brass = '#d8a43f';
  // stairs: the underside (soffit) runs from (560, 596) rising to the right at 0.9
  const S = (x: number): number => 596 - 0.9 * (x - 560);
  const T = (x: number): number => S(x) - 120;

  // wallpaper: tiny pale sprigs high on the wall only
  const sprigs: Node[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 18; c++) {
      const x = 30 + c * 68 + (r % 2) * 34;
      sprigs.push(dot(x, 60 + r * 80, 4, '#e9bfb2', 0.7));
    }
  }
  // carpet flowers, only in a band at the feet and fading before the caption band
  const flowers: Node[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = -1; c < 12; c++) {
      const x = c * 110 + (r % 2) * 55 + 20;
      const y = 632 + r * 26;
      flowers.push(dot(x, y, 7, r === 1 ? '#e8a8a0' : '#f2cf8a', 0.55), dot(x, y, 2.5, '#fff4d8', 0.8));
    }
  }
  // stair treads along the top of the staircase
  const treads: Node[] = [];
  for (let x = 580; x < 1200; x += 60) {
    const y = T(x);
    treads.push(piece(poly([[x, y], [x + 60, y - 54], [x + 60, y - 40], [x, y + 14]]), '#c9847f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }));
  }
  const spindles: Node[] = [];
  for (let x = 600; x < 1190; x += 40) spindles.push(ink([[x, T(x) - 4], [x, T(x) - 96]], { width: 5, color: white }));

  return svg({ w: 1180, h: 820, name: 'hogwarts-dursley-hall', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    ...sprigs,
    // pale dado rail and panelling below
    piece(rect(-20, 540, 1220, 70), '#ecc9bd', { edge: 'clean', shadow: false }),
    piece(rect(-20, 534, 1220, 10), white, { edge: 'cut', fibre: false, shadow: false }),

    // ---- hanging lamp
    ink([[420, -10], [420, 60]], { width: 4, color: C.stoneLight }),
    piece(poly([[388, 100], [400, 60], [440, 60], [452, 100]]), '#fbeed2', { edge: 'cut' }),

    // ---- the front door (left)
    piece(rect(30, 140, 230, 478, 6), white, { edge: 'cut' }),
    piece(rect(44, 154, 202, 456, 4), '#f1ead8', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(90, 200, 110, 180, 8), '#cfe3ea', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(100, 210, 90, 160, 6), '#e6f1f4', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    ink([[145, 210], [145, 370]], { width: 4, color: '#f8f4ea', opacity: 0.8 }),
    // lower panels
    piece(rect(70, 410, 150, 40, 4), '#e9dfc8', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(70, 510, 150, 80, 4), '#e9dfc8', { edge: 'cut', fibre: false, shadow: false }),
    // the brass letterbox: plate, dark slot, flap and two screws
    piece(rect(88, 452, 114, 46, 8), brass, { edge: 'cut' }),
    piece(rect(100, 468, 90, 16, 4), '#4a3a28', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(98, 458, 94, 12, 5), '#e8bd5c', { edge: 'cut', fibre: false, shadow: false }),
    dot(96, 475, 3, '#8a6a22'),
    dot(194, 475, 3, '#8a6a22'),
    // door knob, and the brass 4
    piece(circle(232, 430, 9), brass, { edge: 'cut', fibre: false }),
    // doormat
    piece(rect(50, 622, 220, 30, 6), '#8a6b4a', { edge: 'cut' }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ink([[66 + i * 22, 630], [66 + i * 22, 646]], { width: 3, color: '#b89870', opacity: 0.8 })),

    // ---- coat hooks with a hat
    piece(rect(286, 176, 90, 10, 4), '#b88a5c', { edge: 'cut', fibre: false }),
    ...[304, 330, 356].map((x) => piece(circle(x, 190, 5), brass, { edge: 'cut', fibre: false, shadow: false })),
    piece(curve([[322, 196], [340, 196], [342, 226], [320, 226]], 2), '#7f8fa8', { edge: 'cut' }),
    piece(ellipse(331, 228, 26, 5), '#7f8fa8', { edge: 'cut', fibre: false }),

    // ---- the little hall table, vase of plastic flowers and a photo
    piece(rect(358, 540, 150, 12, 4), '#b88a5c', { edge: 'cut' }),
    piece(rect(368, 552, 10, 58), '#a67848', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(488, 552, 10, 58), '#a67848', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[386, 540], [392, 496], [420, 496], [426, 540]]), '#7fb0c8', { edge: 'cut' }),
    ...[[394, 478, '#e87a8a'], [406, 464, '#f2cf5a'], [418, 478, '#ffffff'], [400, 484, '#c47ab8'], [414, 488, '#e87a8a']].map(([x, y, c]) => dot(x as number, y as number, 9, c as string, 0.95)),
    ink([[400, 494], [403, 480]], { width: 3, color: C.leaf }),
    ink([[414, 494], [411, 484]], { width: 3, color: C.leaf }),
    piece(rect(450, 488, 44, 52, 3), '#d8a43f', { edge: 'cut' }),
    piece(rect(456, 494, 32, 40, 2), '#efe6d0', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(472, 510, 8), C.skin, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(462, 520, 20, 12, 4), '#b5583b', { edge: 'cut', fibre: false, shadow: false }),
    // mirror above the table, above head height
    piece(rect(372, 170, 120, 100, 8), '#d8a43f', { edge: 'cut' }),
    piece(rect(382, 180, 100, 80, 5), '#dbe9ee', { edge: 'cut', fibre: false, shadow: false }),

    // ---- the staircase going up to the right
    piece(poly([[560, T(560)], [1200, T(1200)], [1200, S(1200)], [560, 596]]), '#f6e8dc', { edge: 'cut' }),
    ...treads,
    // the wall beneath the stairs, a deeper shade, and a skirting
    piece(poly([[560, 596], [1200, S(1200) + 0], [1200, 612], [560, 612]]), '#e6bfb2', { edge: 'clean', shadow: false }),
    ink([[560, T(560) - 96], [560, 600]], { width: 12, color: white }),
    piece(circle(560, T(560) - 100, 12), white, { edge: 'cut', fibre: false }),
    ink([[560, T(560) - 96], [1200, T(1200) - 96]], { width: 8, color: white }),
    ...spindles,

    // ---- Harry's cupboard under the stairs
    piece(rect(772, 410, 138, 202, 5), '#d9b890', { edge: 'cut' }),
    piece(rect(782, 420, 118, 186, 4), '#c9a07a', { edge: 'cut', fibre: false, shadow: false }),
    // a little grille at the top
    piece(rect(810, 440, 62, 30, 3), '#4a3a30', { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2, 3, 4].map((i) => ink([[820 + i * 12, 442], [820 + i * 12, 468]], { width: 3, color: '#a88a68' })),
    // planks and a latch
    ink([[790, 520], [892, 520]], { width: 3, color: '#a88a68' }),
    ink([[790, 570], [892, 570]], { width: 3, color: '#a88a68' }),
    piece(rect(862, 508, 28, 26, 4), '#7a7a80', { edge: 'cut', fibre: false }),
    piece(rect(868, 516, 16, 5, 2), '#3a3a42', { edge: 'cut', fibre: false, shadow: false }),

    // ---- skirting and flowery carpet
    piece(rect(-20, 598, 1220, 16), white, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(-20, 612, 1220, 220), '#e9b6ae', { edge: 'clean', shadow: false }),
    piece(rect(-20, 612, 1220, 12), '#d99a95', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ...flowers,
    // plain softer floor for the caption band
    piece(rect(-20, 700, 1220, 130), '#e4aea6', { edge: 'clean', shadow: false }),
  ]);
}
