import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** The zoo's reptile house: dim and green-lit, a wall of glass tanks, one big empty-of-animals tank in the middle (1180 × 820). */
export function reptileHouse(): string {
  const wall = '#2f4a3f';
  // a small dim tank: frame, a murky green inside, a rock and a leaf (nothing alive)
  const smallTank = (x: number, y: number, w: number, h: number, tint: string): Node[] => [
    piece(rect(x - 8, y - 8, w + 16, h + 16, 4), '#1d2a26', { edge: 'cut' }),
    piece(rect(x, y, w, h), tint, { edge: 'clean', shadow: false }),
    piece(rect(x, y, w, h * 0.5), '#cfe6b0', { edge: 'clean', shadow: false, opacity: 0.12 }),
    piece(rect(x, y + h - 26, w, 26), '#8a8a5c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 }),
    piece(poly([[x + w * 0.55, y + h - 26], [x + w * 0.62, y + h - 58], [x + w * 0.78, y + h - 62], [x + w * 0.86, y + h - 26]]), '#5d6a5a', { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[x + 14, y + h - 26], [x + 22, y + h - 70], [x + 44, y + h - 40], [x + 52, y + h - 26]], 2), '#4f7a48', { edge: 'cut', fibre: false, shadow: false }),
    // a dim glass shine
    ink([[x + 12, y + 12], [x + 12 + w * 0.3, y + 12]], { width: 4, color: C.white, opacity: 0.18 }),
  ];

  // leafy plants in the big tank
  const frond = (x: number, y: number, lean: number, h: number, c: string): Node =>
    piece(curve([[x, y], [x + lean * 0.4 - 10, y - h * 0.5], [x + lean, y - h], [x + lean * 0.5 + 12, y - h * 0.5], [x + 14, y]], 2), c, { edge: 'cut', fibre: false, shadow: false });

  return svg({ w: 1180, h: 820, name: 'hogwarts-reptile-house', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    // green light from the tanks, a darker ceiling
    piece(ellipse(590, 330, 520, 300), '#6fa17a', { edge: 'clean', shadow: false, opacity: 0.18 }),
    piece(rect(-20, -20, 1220, 90), '#1f332b', { edge: 'clean', shadow: false }),
    piece(rect(-20, 62, 1220, 10), '#182720', { edge: 'cut', fibre: false, shadow: false }),
    // dim wall lamps
    ...[150, 1030].map((x) => piece(ellipse(x, 100, 50, 28), '#e7d68f', { edge: 'clean', shadow: false, opacity: 0.22 })),
    ...[150, 1030].map((x) => piece(rect(x - 26, 76, 52, 16, 6), '#cdbb72', { edge: 'cut', fibre: false })),

    // ---- tanks to the left (two, stacked) and the right (two, with the sign between)
    ...smallTank(40, 130, 270, 140, '#2c5a4a'),
    ...smallTank(40, 330, 270, 270, '#33604a'),
    ...smallTank(960, 130, 180, 110, '#2c5a4a'),
    ...smallTank(960, 400, 180, 200, '#365f48'),
    // low cabinets under the side tanks
    piece(rect(20, 612, 310, 70, 4), '#1d2a26', { edge: 'cut' }),
    piece(rect(940, 612, 220, 70, 4), '#1d2a26', { edge: 'cut' }),

    // ---- the big tank: frame, then the habitat (the glass is a separate prop over x 390 to 890, y 170 to 590)
    piece(rect(358, 140, 564, 490, 6), '#1b2622', { edge: 'cut' }),
    piece(rect(370, 152, 540, 466, 4), '#2a3b34', { edge: 'cut', fibre: false, shadow: false }),
    // inside: back wall of the habitat, warm up top and cool down below
    piece(rect(390, 170, 500, 420), '#4d6e4c', { edge: 'clean', shadow: false }),
    piece(rect(390, 170, 500, 150), '#a8a05a', { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(rect(390, 320, 500, 270), '#3d5c40', { edge: 'clean', shadow: false, opacity: 0.55 }),
    // a warm lamp glow from above
    piece(poly([[560, 170], [720, 170], [850, 520], [430, 520]]), '#ffe7a0', { edge: 'clean', shadow: false, opacity: 0.2 }),
    piece(ellipse(640, 176, 70, 14), '#fff2c0', { edge: 'clean', shadow: false, opacity: 0.55 }),
    // far rocks on the back wall
    piece(poly([[390, 420], [420, 330], [480, 300], [540, 350], [560, 430], [560, 520], [390, 520]]), '#7a766a', { edge: 'torn', fibre: false, shadow: false }),
    piece(poly([[430, 440], [470, 360], [520, 370], [540, 440]]), '#8d8878', { edge: 'torn', fibre: false, shadow: false }),
    piece(poly([[780, 400], [830, 340], [890, 330], [890, 520], [770, 520]]), '#756f62', { edge: 'torn', fibre: false, shadow: false }),
    // a dead branch across the back
    piece(curve([[560, 300], [650, 280], [740, 300], [800, 262]], 2), '#6b4a32', { edge: 'cut', fibre: false, shadow: false }),
    ink([[560, 304], [740, 304]], { width: 12, color: '#6b4a32', opacity: 0.001 }),
    // leaves at both sides
    frond(430, 520, -20, 140, '#5f9a52'),
    frond(452, 520, 30, 110, '#79b05e'),
    frond(850, 520, 20, 150, '#5f9a52'),
    frond(830, 520, -30, 110, '#79b05e'),
    frond(880, 520, -10, 90, '#4f8a48'),
    // sand and gravel floor of the tank
    piece(poly([[390, 520], [490, 510], [640, 518], [800, 508], [890, 516], [890, 590], [390, 590]]), '#d8c28e', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[390, 556], [890, 552], [890, 590], [390, 590]]), '#c4a972', { edge: 'clean', shadow: false, opacity: 0.55 }),
    // flat basking rock in the middle (a snake can sit on or behind it)
    piece(poly([[600, 520], [630, 492], [720, 488], [760, 520]]), '#8d8878', { edge: 'torn', fibre: false }),
    // little pool at the front
    piece(ellipse(560, 566, 100, 17), '#6e5a3c', { edge: 'clean', shadow: false, opacity: 0.6 }),
    piece(ellipse(560, 565, 92, 13), '#5a98a8', { edge: 'clean', shadow: false }),
    piece(ellipse(540, 562, 50, 5), '#bfe0e8', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ...[[470, 570, 9], [650, 566, 8], [488, 578, 6]].map(([x, y, r]) => piece(circle(x, y, r), '#8d8878', { edge: 'torn', fibre: false, shadow: false })),
    // front-left stones and a leaf pile
    piece(poly([[394, 590], [402, 566], [440, 560], [458, 590]]), '#8d8878', { edge: 'torn', fibre: false, shadow: false }),
    frond(760, 586, 10, 40, '#79b05e'),
    // the tank's metal lip at the very bottom, and the lamp housing at the top
    piece(rect(380, 590, 520, 22, 3), '#1b2622', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(380, 160, 520, 14, 3), '#1b2622', { edge: 'cut', fibre: false, shadow: false }),
    // the cabinet below the big tank
    piece(rect(358, 628, 564, 54, 4), '#1d2a26', { edge: 'cut' }),

    // ---- the sign beside the big tank (right): a snake and a map shape, no words
    piece(rect(988, 288, 8, 90), '#1d2a26', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(928, 258, 130, 100, 8), '#e9dfbf', { edge: 'cut' }),
    piece(rect(936, 266, 114, 84, 5), '#f4ecd2', { edge: 'cut', fibre: false, shadow: false }),
    // map shape (a blobby country) on the left of the sign
    piece(poly([[944, 300], [960, 286], [984, 290], [992, 310], [980, 334], [958, 340], [946, 324]]), '#9cbf7a', { edge: 'cut', fibre: false, shadow: false }),
    // snake on the right of the sign
    ink([[1000, 336], [1010, 314], [1022, 334], [1032, 310], [1040, 288]], { width: 7, color: '#4f7a48', wobble: 0.4 }),
    dot(1042, 284, 6, '#4f7a48'),
    dot(1044, 283, 1.8, C.ink),
    ink([[1048, 286], [1056, 289]], { width: 1.8, color: C.red }),
    // two thin rule lines for "words"
    ink([[946, 346], [1040, 346]], { width: 3, color: '#8a7a56', opacity: 0.6 }),

    // ---- floor: dark green-grey tiles, calm at the bottom
    piece(rect(-20, 676, 1220, 160), '#3e4a42', { edge: 'clean', shadow: false }),
    piece(rect(-20, 676, 1220, 12), '#2a342d', { edge: 'clean', shadow: false, opacity: 0.7 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ink([[-20 + i * 160, 690], [-80 + i * 190, 830]], { width: 2, color: '#2f3a33', opacity: 0.5 })),
  ]);
}
