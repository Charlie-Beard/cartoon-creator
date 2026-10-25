import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** Inside the miserable little hut on a rock in the sea, on a stormy night: bare boards, a cold hearth, a lumpy sofa (1180 × 820). */
export function hutOnTheRock(): string {
  const planks: Node[] = [];
  for (let x = -20; x < 1200; x += 70) {
    planks.push(ink([[x, -10], [x + 2, 660]], { width: 3, color: '#2e3540', opacity: 0.7, wobble: 1.2 }));
  }
  const floorBoards: Node[] = [];
  for (let i = 0; i < 6; i++) floorBoards.push(ink([[-20, 664 + i * 26], [1200, 664 + i * 26]], { width: 2, color: '#2c3039', opacity: 0.45 }));
  const rain: Node[] = [];
  for (let i = 0; i < 16; i++) rain.push(ink([[330 + i * 14, 150 + (i * 37) % 90], [320 + i * 14, 180 + (i * 37) % 90]], { width: 2, color: '#b9cadd', opacity: 0.5, wobble: 0.3 }));
  return svg({ w: 1180, h: 820, name: 'hogwarts-hut-on-the-rock', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#4a5566', { edge: 'clean', shadow: false }),
    ...planks,
    // darker corners, a soft lighter middle (storm light through the window)
    piece(ellipse(420, 260, 330, 240), '#8aa0b8', { edge: 'clean', shadow: false, opacity: 0.18 }),
    // roof beams and a crooked rafter
    piece(rect(-20, -20, 1220, 70), '#2d3440', { edge: 'cut' }),
    piece(poly([[-20, 40], [1200, 24], [1200, 56], [-20, 74]]), '#3a4350', { edge: 'torn', fibre: false }),
    piece(poly([[0, 70], [140, 150], [130, 166], [-20, 90]]), '#343c48', { edge: 'torn', fibre: false, shadow: false }),
    piece(poly([[1180, 60], [1060, 140], [1068, 154], [1200, 80]]), '#343c48', { edge: 'torn', fibre: false, shadow: false }),

    // ---- the door (left): big, clear, planked. Frame x 30 to 270, door x 50 to 250, y 110 to 660
    piece(rect(30, 90, 240, 580, 6), '#2b2420', { edge: 'cut' }),
    piece(rect(50, 110, 200, 550, 4), '#7a5638', { edge: 'cut', fibre: false }),
    ...[0, 1, 2].map((i) => ink([[50 + (i + 1) * 50, 112], [50 + (i + 1) * 50, 658]], { width: 3, color: '#4a3424', opacity: 0.8 })),
    piece(rect(50, 210, 200, 18, 3), '#3e3e46', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(50, 540, 200, 18, 3), '#3e3e46', { edge: 'cut', fibre: false, shadow: false }),
    ...[[70, 219], [230, 219], [70, 549], [230, 549]].map(([x, y]) => dot(x, y, 4, '#6b6b72')),
    piece(circle(222, 400, 12), '#6b6b72', { edge: 'cut' }),
    piece(rect(210, 392, 24, 8, 3), '#55555c', { edge: 'cut', fibre: false, shadow: false }),
    // cold draught under the door
    piece(rect(50, 650, 200, 10), '#8aa0b8', { edge: 'clean', shadow: false, opacity: 0.25 }),

    // ---- the window (upper middle-left): stormy sea beyond. Opening x 340 to 560, y 130 to 330
    piece(rect(322, 112, 256, 238, 6), '#2b2420', { edge: 'cut' }),
    piece(rect(340, 130, 220, 200), '#2a3a58', { edge: 'clean', shadow: false }),
    piece(rect(340, 130, 220, 80), '#3d4c6c', { edge: 'clean', shadow: false }),
    // stormy clouds
    piece(curve([[340, 170], [380, 150], [430, 170], [480, 148], [560, 168], [560, 130], [340, 130]], 2), '#1f2a44', { edge: 'cut', fibre: false, shadow: false }),
    // waves
    piece(curve([[340, 250], [372, 232], [404, 252], [440, 230], [480, 252], [520, 232], [560, 250], [560, 330], [340, 330]], 2), '#1d3a5a', { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[340, 288], [380, 270], [420, 292], [470, 268], [520, 290], [560, 276], [560, 330], [340, 330]], 2), '#16304c', { edge: 'cut', fibre: false, shadow: false }),
    ...[[372, 232], [440, 230], [520, 232]].map(([x, y]) => piece(ellipse(x, y + 2, 14, 4), '#cfdbe8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 })),
    ...rain,
    ink([[450, 130], [450, 330]], { width: 8, color: '#2b2420' }),
    ink([[340, 230], [560, 230]], { width: 8, color: '#2b2420' }),
    piece(rect(312, 346, 276, 14, 3), '#3a3028', { edge: 'cut' }),
    // puddle on the sill
    piece(ellipse(500, 344, 22, 3), '#8aa0b8', { edge: 'clean', shadow: false, opacity: 0.4 }),

    // ---- the cold fireplace (middle-right): stone surround x 600 to 860, hearth opening x 650 to 810, y 360 to 660
    piece(rect(590, 220, 280, 450, 6), '#6a6a70', { edge: 'torn', fibre: false }),
    ...[[600, 240], [690, 240], [780, 240], [610, 290], [700, 290], [790, 290], [600, 340], [800, 340]].map(([x, y]) =>
      piece(rect(x, y, 78, 40, 5), '#7a7a80', { edge: 'cut', fibre: false, shadow: false })),
    piece(rect(570, 196, 320, 30, 5), '#55555c', { edge: 'cut' }),
    piece(rect(650, 360, 160, 300, 4), '#1d1c22', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[650, 360], [810, 360], [790, 390], [670, 390]]), '#2b2a30', { edge: 'clean', shadow: false }),
    // ash and a few sticks, unlit
    piece(ellipse(730, 650, 70, 9), '#3a393f', { edge: 'torn', fibre: false, shadow: false }),
    ink([[690, 650], [748, 618]], { width: 8, color: '#6b4a32' }),
    ink([[770, 652], [726, 616]], { width: 7, color: '#5a3d28' }),
    ink([[708, 640], [776, 630]], { width: 7, color: '#6b4a32' }),
    // a hook and a damp dishcloth
    piece(rect(640, 168, 6, 20, 2), '#3e3e46', { edge: 'cut', fibre: false, shadow: false }),

    // ---- the lumpy old sofa (right), floor y 660: x 880 to 1180
    piece(rect(890, 440, 300, 130, 40), '#7a5a4a', { edge: 'torn', fibre: false }),
    piece(rect(890, 520, 300, 140, 22), '#8a6a56', { edge: 'torn', fibre: false }),
    piece(rect(904, 604, 270, 56, 10), '#7a5a4a', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(1040, 540, 70, 18), '#6a4a3c', { edge: 'clean', shadow: false, opacity: 0.45 }),
    piece(ellipse(960, 520, 40, 14), '#9a7a64', { edge: 'clean', shadow: false, opacity: 0.4 }),
    // patches and a sagging cushion
    piece(rect(1090, 470, 56, 44, 6), '#a37a56', { edge: 'cut', fibre: false, shadow: false }),
    ink([[1094, 474], [1142, 474], [1142, 510], [1094, 510], [1094, 474]], { width: 2, color: '#4a3424', opacity: 0.7 }),
    piece(rect(930, 540, 90, 40, 18), '#8f6a58', { edge: 'torn', fibre: false, shadow: false }),
    piece(rect(870, 520, 40, 140, 16), '#6a4a3c', { edge: 'torn', fibre: false }),
    // stubby feet
    ...[[910, 660], [1150, 660]].map(([x, y]) => piece(rect(x, y - 6, 18, 12, 3), '#3a2a20', { edge: 'cut', fibre: false, shadow: false })),

    // ---- bare floorboards (dim, calm band at the bottom)
    piece(rect(-20, 660, 1220, 180), '#3a3d48', { edge: 'clean', shadow: false }),
    piece(rect(-20, 660, 1220, 10), '#2b2e38', { edge: 'clean', shadow: false, opacity: 0.8 }),
    ...floorBoards,
  ]);
}
