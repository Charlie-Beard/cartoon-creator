/**
 * One-off art for The Toyland Express: Peter's little tin train, the big
 * brass winding key, the toys waiting on the platform, a little block town
 * seen from the chair, and a tall shadow for the wall of the cupboard.
 * (The engine, the truck, Jack's box and the places are in the wishing world.)
 */
import { C, cached, circle, curve, dot, ellipse, ink, piece, poly, rect, svg } from '../../kit';

const FLAT = { edge: 'cut' as const, fibre: false as const, shadow: false };
const CUT = { edge: 'cut' as const, fibre: false as const };

/** Peter's little tin train: a red engine with a blue truck behind, facing right. 170 × 80. */
export const tinTrain = cached(() =>
  svg({ w: 170, h: 80, name: 'toyland-train-tin-train', label: 'A little tin train' }, [
    piece(rect(6, 26, 56, 32, 3), C.toyBlue, { edge: 'cut' }),
    piece(rect(2, 20, 64, 9, 2), C.toyYellow, CUT),
    piece(rect(70, 36, 8, 5, 1), C.steelDark, FLAT),
    piece(rect(80, 20, 78, 38, 5), C.toyRed, { edge: 'cut' }),
    piece(rect(80, 14, 30, 24, 3), C.toyRed, { edge: 'cut', fibre: false }),
    piece(rect(76, 8, 38, 8, 2), C.toyYellow, CUT),
    piece(rect(130, 6, 14, 24, 2), '#2f2c36', CUT),
    piece(rect(126, 2, 22, 8, 2), C.brass, CUT),
    piece(rect(88, 22, 14, 10, 2), '#8fb4d8', FLAT),
    ...[26, 50, 96, 124, 146].map((x) => piece(circle(x, 62, 11), C.steelLight, CUT)),
    ...[26, 50, 96, 124, 146].map((x) => dot(x, 62, 3.4, C.ink)),
  ]),
);

/**
 * The big brass winding key, seen face-on as on a real clockwork toy: a
 * butterfly-shaped handle of two round wings round a brass boss. Turn the
 * whole actor to wind. 140 × 140, the middle of the boss at (70, 70).
 */
export const windingKey = cached(() =>
  svg({ w: 140, h: 140, name: 'toyland-train-key', label: 'A big brass winding key' }, [
    piece(ellipse(32, 70, 28, 40), C.brass, { edge: 'cut' }),
    piece(ellipse(108, 70, 28, 40), C.brass, { edge: 'cut' }),
    piece(ellipse(32, 70, 17, 28), C.goldLight, { ...FLAT, opacity: 0.8 }),
    piece(ellipse(108, 70, 17, 28), C.goldLight, { ...FLAT, opacity: 0.8 }),
    piece(rect(40, 56, 60, 28, 8), C.brass, { edge: 'cut' }),
    piece(circle(70, 70, 16), C.brassDark, CUT),
    piece(circle(70, 70, 9), C.brass, FLAT),
    ink([[18, 52], [22, 44]], { width: 3, color: C.goldLight, opacity: 0.9 }),
  ]),
);

/** A wooden skittle with a red stripe. 60 × 130. */
export const skittleToy = cached(() =>
  svg({ w: 60, h: 130, name: 'toyland-train-skittle', label: 'A skittle' }, [
    piece(curve([[22, 20], [38, 20], [42, 56], [54, 96], [46, 126], [14, 126], [6, 96], [18, 56]], 2), '#efe3c6', { edge: 'cut' }),
    piece(rect(15, 48, 30, 10, 2), C.toyRed, FLAT),
    piece(circle(30, 14, 14), '#efe3c6', CUT),
    dot(25, 12, 2.4, C.ink),
    dot(35, 12, 2.4, C.ink),
    ink([[25, 20], [30, 23], [35, 20]], { width: 2, color: C.redDark }),
  ]),
);

/** A sitting teddy with a blue bow. 110 × 130. */
export const teddyToy = cached(() =>
  svg({ w: 110, h: 130, name: 'toyland-train-teddy', label: 'A teddy bear' }, [
    piece(circle(26, 22, 14), C.teddy, CUT),
    piece(circle(84, 22, 14), C.teddy, CUT),
    piece(ellipse(55, 80, 38, 42), C.teddy, { edge: 'torn', rough: 0.7 }),
    piece(ellipse(55, 90, 22, 26), C.teddyLight, FLAT),
    piece(ellipse(55, 40, 34, 30), C.teddy, { edge: 'torn', rough: 0.7 }),
    piece(ellipse(55, 50, 14, 11), C.teddyLight, FLAT),
    dot(43, 36, 3.4, C.ink),
    dot(67, 36, 3.4, C.ink),
    piece(ellipse(55, 46, 5, 3.6), C.ink, FLAT),
    piece(ellipse(24, 100, 14, 12), C.teddy, CUT),
    piece(ellipse(86, 100, 14, 12), C.teddy, CUT),
    piece(poly([[55, 66], [38, 58], [38, 74]]), C.toyBlue, FLAT),
    piece(poly([[55, 66], [72, 58], [72, 74]]), C.toyBlue, FLAT),
    piece(circle(55, 66, 4), C.toyBlue, FLAT),
  ]),
);

/** A rag doll in a red dress with yellow plaits. 80 × 130. */
export const dollToy = cached(() =>
  svg({ w: 80, h: 130, name: 'toyland-train-doll', label: 'A rag doll' }, [
    piece(poly([[40, 54], [64, 124], [16, 124]]), C.toyRed, { edge: 'cut' }),
    piece(rect(22, 112, 36, 10, 2), C.white, FLAT),
    piece(ellipse(40, 32, 22, 24), '#f0c8a0', CUT),
    piece(curve([[16, 34], [14, 12], [40, 2], [66, 12], [64, 34], [52, 18], [28, 18]], 2), C.yellow, { edge: 'torn', shadow: false }),
    piece(ellipse(14, 52, 7, 18), C.yellow, { edge: 'torn', shadow: false }),
    piece(ellipse(66, 52, 7, 18), C.yellow, { edge: 'torn', shadow: false }),
    dot(32, 34, 2.6, C.ink),
    dot(48, 34, 2.6, C.ink),
    ink([[34, 44], [40, 47], [46, 44]], { width: 2, color: C.redDark }),
    piece(circle(26, 42, 4), C.pink, { ...FLAT, opacity: 0.7 }),
    piece(circle(54, 42, 4), C.pink, { ...FLAT, opacity: 0.7 }),
  ]),
);

/** A yellow duck on little wheels, facing right. 130 × 110. */
export const duckToy = cached(() =>
  svg({ w: 130, h: 110, name: 'toyland-train-duck', label: 'A duck on wheels' }, [
    piece(rect(18, 82, 94, 12, 3), C.wood, CUT),
    piece(ellipse(60, 62, 44, 26), C.yellow, { edge: 'torn', rough: 0.7 }),
    piece(poly([[18, 52], [4, 40], [26, 62]]), C.yellow, CUT),
    piece(circle(94, 34, 20), C.yellow, { edge: 'torn', rough: 0.7 }),
    piece(poly([[110, 32], [128, 38], [110, 46]]), C.orange, CUT),
    dot(98, 28, 3.2, C.ink),
    piece(ellipse(56, 66, 20, 12, -10), '#e8b838', { ...FLAT, opacity: 0.8 }),
    ...[34, 86].map((x) => piece(circle(x, 98, 11), C.toyRed, CUT)),
    ...[34, 86].map((x) => dot(x, 98, 3.2, C.yellow)),
  ]),
);

/** A little town of building blocks with a flag, seen from the chair in the sky. 460 × 250. */
export const blockTown = cached(() =>
  svg({ w: 460, h: 250, name: 'toyland-train-block-town', label: 'A town made of building blocks' }, [
    piece(curve([[0, 230], [60, 200], [180, 196], [320, 202], [420, 190], [460, 214], [460, 250], [0, 250]], 2), '#8fc87c', { edge: 'torn', shadow: false }),
    // houses
    piece(rect(24, 140, 80, 76, 2), C.toyRed, { edge: 'cut' }),
    piece(poly([[16, 142], [64, 100], [112, 142]]), C.toyYellow, CUT),
    piece(rect(122, 112, 70, 104, 2), C.toyBlue, { edge: 'cut' }),
    piece(rect(116, 100, 82, 16, 2), C.toyRed, CUT),
    piece(rect(206, 150, 90, 66, 2), C.toyYellow, { edge: 'cut' }),
    piece(poly([[198, 152], [251, 112], [304, 152]]), C.toyGreen, CUT),
    piece(rect(314, 124, 72, 92, 2), C.toyGreen, { edge: 'cut' }),
    piece(rect(308, 112, 84, 16, 2), C.toyYellow, CUT),
    piece(rect(398, 160, 50, 56, 2), C.toyRed, { edge: 'cut' }),
    // windows and doors
    ...[[44, 160], [72, 160], [140, 130], [164, 130], [140, 166], [164, 166], [226, 168], [262, 168], [332, 140], [360, 140], [332, 176], [360, 176]].map(([x, y]) => piece(rect(x, y, 16, 20, 2), '#fbf6ea', FLAT)),
    ...[[56, 196], [240, 196], [412, 196]].map(([x, y]) => piece(rect(x - 8, y, 16, 20, 7), C.brownDark, FLAT)),
    // the flag on the tallest tower
    ink([[158, 100], [158, 52]], { width: 3, color: C.brownDark }),
    piece(poly([[158, 52], [198, 62], [158, 74]]), C.toyYellow, FLAT),
    // a little round tree
    piece(rect(444, 180, 5, 24, 1), C.bark, FLAT),
    piece(circle(446, 172, 16), C.leafDark, FLAT),
  ]),
);

/** A tall soft shadow on the cupboard wall, for the looming. 360 × 640. */
export const looming = cached(() =>
  svg({ w: 360, h: 640, name: 'toyland-train-looming', label: '' }, [
    piece(ellipse(180, 380, 150, 260), 'rgba(18,10,6,0.62)', { edge: 'clean', fibre: false, shadow: false }),
    piece(ellipse(180, 120, 110, 120), 'rgba(18,10,6,0.62)', { edge: 'clean', fibre: false, shadow: false }),
    piece(poly([[110, 60], [60, -10], [140, 40]]), 'rgba(18,10,6,0.62)', { edge: 'clean', fibre: false, shadow: false }),
    piece(poly([[250, 60], [300, -10], [220, 40]]), 'rgba(18,10,6,0.62)', { edge: 'clean', fibre: false, shadow: false }),
  ]),
);
