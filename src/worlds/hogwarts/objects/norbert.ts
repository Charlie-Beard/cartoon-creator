import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

const sparkle = (x: number, y: number, s: number): Node =>
  piece(poly([[x, y - s], [x + s * 0.25, y - s * 0.25], [x + s, y], [x + s * 0.25, y + s * 0.25], [x, y + s], [x - s * 0.25, y + s * 0.25], [x - s, y], [x - s * 0.25, y - s * 0.25]]), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 });

/**
 * Harry's Invisibility Cloak, 260 × 200: a flowing silvery cloth, hooded,
 * with watery pale folds and a few faint sparkles. Draped, so it can be
 * hung up, held, or laid over people (scale it to fit and keep it low).
 */
export function invisibilityCloak(): string {
  const fold = (pts: [number, number][], col: string, op: number) =>
    piece(curve(pts, 2), col, { edge: 'cut', fibre: false, shadow: false, opacity: op });
  return svg({ w: 260, h: 200, name: 'norbert-cloak', boil: false, label: 'the Invisibility Cloak' }, [
    // the big drape, with a wavy hem
    piece(curve([[40, 60], [70, 18], [130, 6], [190, 18], [222, 62], [250, 196], [214, 180], [188, 196], [158, 178], [128, 196], [98, 178], [68, 196], [38, 180], [10, 196]], 2), '#aab6c8', { rough: 0.8 }),
    // the hood on top
    piece(curve([[88, 52], [96, 14], [130, 2], [166, 14], [176, 52], [150, 70], [112, 70]], 2), '#8e9db4', { rough: 0.7 }),
    piece(ellipse(132, 44, 26, 18), '#6f7e98', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // soft watery folds
    fold([[60, 80], [76, 120], [66, 160], [56, 188], [44, 150], [46, 110]], '#c4d0e2', 0.7),
    fold([[104, 76], [118, 124], [108, 164], [100, 176], [90, 140], [92, 100]], '#8e9db4', 0.6),
    fold([[150, 76], [164, 120], [158, 168], [150, 178], [138, 140], [140, 100]], '#c9d5e6', 0.65),
    fold([[196, 78], [214, 126], [220, 176], [206, 168], [186, 132], [184, 98]], '#8e9db4', 0.55),
    ink([[40, 100], [76, 94], [112, 104], [150, 96], [190, 106], [222, 98]], { width: 2.5, color: '#e4ecf6', opacity: 0.6 }),
    ink([[34, 140], [72, 132], [110, 144], [150, 134], [192, 146], [236, 138]], { width: 2.5, color: '#e4ecf6', opacity: 0.5 }),
    // the sparkles
    sparkle(70, 70, 7), sparkle(176, 108, 9), sparkle(118, 150, 6), sparkle(222, 160, 7), sparkle(28, 168, 5),
    dot(96, 110, 2, '#ffffff', 0.8), dot(200, 70, 2, '#ffffff', 0.8), dot(150, 190, 2, '#ffffff', 0.7),
  ]);
}

/**
 * A wooden crate for carrying a baby dragon, 220 × 180: planks and nails,
 * rope handles, a row of round air holes. Flat bottom on the ground.
 * Part `lid` lifts or rattles; its origin is the back hinge corner [8, 42].
 */
export function crate(): string {
  const plank = (y: number, h: number, col: string) => piece(rect(10, y, 200, h, 2), col, { edge: 'cut' });
  const nails: Node[] = [];
  for (const y of [72, 112, 152]) for (const x of [22, 198]) nails.push(dot(x, y, 3, '#4a3b30'));
  const lidNails: Node[] = [22, 198].map((x) => dot(x, 56, 3, '#4a3b30'));
  const holes: Node[] = [60, 90, 120, 150].map((x) => piece(circle(x, 100, 9), '#1d1410', { edge: 'cut', fibre: false, shadow: false }));
  return svg({ w: 220, h: 180, name: 'norbert-crate', boil: false, label: 'a wooden crate' }, [
    // body planks
    plank(62, 38, '#a06d43'),
    plank(100, 38, '#92613a'),
    plank(138, 40, '#a06d43'),
    ink([[10, 100], [210, 100]], { width: 2, color: '#5a3a28', opacity: 0.7 }),
    ink([[10, 138], [210, 138]], { width: 2, color: '#5a3a28', opacity: 0.7 }),
    ...holes,
    // wood grain
    ink([[30, 74], [70, 72], [110, 75]], { width: 1.5, color: '#7d5231', opacity: 0.6 }),
    ink([[130, 152], [160, 150], [190, 153]], { width: 1.5, color: '#7d5231', opacity: 0.6 }),
    ink([[120, 124], [150, 126], [180, 123]], { width: 1.5, color: '#5a3a28', opacity: 0.5 }),
    // corner battens
    piece(rect(10, 62, 16, 116, 2), '#7d5231', { edge: 'cut', fibre: false }),
    piece(rect(194, 62, 16, 116, 2), '#7d5231', { edge: 'cut', fibre: false }),
    ...nails,
    // rope handles on each side
    ink([[10, 84], [-2, 86], [-2, 124], [10, 126]], { width: 6, color: '#d8bf86' }),
    ink([[210, 84], [222, 86], [222, 124], [210, 126]], { width: 6, color: '#d8bf86' }),
    ink([[10, 84], [-2, 86], [-2, 124], [10, 126]], { width: 2, color: '#a88a50' }),
    ink([[210, 84], [222, 86], [222, 124], [210, 126]], { width: 2, color: '#a88a50' }),
    // the lid, hinged at its back corner
    group({ part: 'lid', origin: [8, 42] }, [
      piece(rect(4, 38, 212, 28, 2), '#b27a4a', { edge: 'cut' }),
      ink([[4, 52], [216, 52]], { width: 2, color: '#5a3a28', opacity: 0.6 }),
      piece(rect(18, 38, 16, 28, 1), '#7d5231', { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(186, 38, 16, 28, 1), '#7d5231', { edge: 'cut', fibre: false, shadow: false }),
      ...lidNails,
    ]),
  ]);
}

/** A small worn brown teddy bear, sitting, with a red bow, 120 × 130. */
export function teddy(): string {
  const brown = '#a9774a';
  const light = '#c79a6a';
  return svg({ w: 120, h: 130, name: 'norbert-teddy', boil: false, label: 'a teddy bear' }, [
    // legs, body, arms
    piece(ellipse(34, 112, 22, 14, -10), brown),
    piece(ellipse(86, 112, 22, 14, 10), brown),
    piece(ellipse(60, 88, 34, 36), brown),
    piece(ellipse(60, 94, 20, 24), light, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(26, 82, 12, 20, 25), brown),
    piece(ellipse(94, 82, 12, 20, -25), brown),
    // the head
    piece(circle(26, 28, 14), brown),
    piece(circle(94, 28, 14), brown),
    piece(circle(26, 28, 7), '#7d5231', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(94, 28, 7), '#7d5231', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(60, 40, 36, 30), brown),
    piece(ellipse(60, 50, 16, 12), light, { edge: 'cut', fibre: false, shadow: false }),
    // face
    dot(47, 36, 3.5, C.ink),
    dot(73, 36, 3.5, C.ink),
    piece(ellipse(60, 46, 5, 3.5), C.ink, { edge: 'cut', fibre: false, shadow: false }),
    ink([[60, 50], [60, 54], [54, 57]], { width: 2, color: C.ink }),
    ink([[60, 54], [66, 57]], { width: 2, color: C.ink }),
    // a patch and stitches (well loved)
    piece(rect(68, 80, 16, 14, 2), '#d9b87a', { edge: 'cut', fibre: false, shadow: false }),
    ink([[70, 82], [74, 82], [78, 82], [82, 82]], { width: 1.5, color: '#7d5231' }),
    // red bow at the neck
    piece(poly([[60, 64], [38, 54], [38, 74]]), C.red, { edge: 'cut' }),
    piece(poly([[60, 64], [82, 54], [82, 74]]), C.red, { edge: 'cut' }),
    piece(circle(60, 64, 6), C.redDark, { edge: 'cut' }),
  ]);
}

/** Hagrid's enormous yellow handkerchief with white spots, a bit crumpled, 160 × 120. */
export function hanky(): string {
  const spots: Node[] = [[40, 36, 9], [84, 30, 8], [124, 44, 9], [58, 70, 10], [104, 76, 9], [140, 84, 7], [30, 92, 7], [80, 100, 8]].map(([x, y, r]) =>
    piece(circle(x, y, r), C.white, { edge: 'cut', fibre: false, shadow: false }));
  return svg({ w: 160, h: 120, name: 'norbert-hanky', boil: false, label: "Hagrid's spotted handkerchief" }, [
    piece(curve([[8, 24], [50, 10], [96, 20], [150, 8], [154, 52], [146, 96], [100, 112], [52, 104], [10, 112], [14, 66]], 2), C.yellow, { rough: 0.8 }),
    ...spots,
    // crumples
    piece(curve([[20, 44], [60, 52], [110, 46], [148, 56], [110, 62], [60, 60]], 2), '#c9a23f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    ink([[30, 20], [44, 56], [34, 100]], { width: 2, color: '#b08a2c', opacity: 0.5 }),
    ink([[120, 16], [108, 56], [124, 100]], { width: 2, color: '#b08a2c', opacity: 0.5 }),
    ink([[18, 76], [70, 84], [140, 72]], { width: 2, color: '#f4dd8a', opacity: 0.6 }),
  ]);
}
