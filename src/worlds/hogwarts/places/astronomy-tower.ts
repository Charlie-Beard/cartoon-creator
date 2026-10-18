import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

/**
 * The flat top of the Astronomy Tower at midnight, 1180 × 820.
 *
 * A huge deep-blue sky fills the top; a big pale moon sits upper right. The
 * middle and upper left of the sky are left empty on purpose, for brooms to
 * swoop through. Far below: dark hills, the Forbidden Forest's treetops and
 * the tiny lit window of Hagrid's hut, and a few turret tops at the sides.
 * In front: a grey stone parapet with crenellations (y 520 to 650), then
 * the stone floor of the tower top (ground line y 650). A telescope stands
 * at the far left; a little stair hut with an arched door is at the far right.
 * The bottom band (y 690 to 820) is plain floor for the captions.
 */
export function astronomyTower(): string {
  const r = rng(77);
  const stars: Node[] = [];
  for (let i = 0; i < 70; i++) {
    const x = r() * 1180;
    const y = 12 + r() * 440;
    if ((x - 950) ** 2 + (y - 150) ** 2 < 150 * 150) continue; // keep the moon's glow clear
    stars.push(dot(x, y, 1.2 + r() * 2.2, C.cream, 0.4 + r() * 0.5));
  }
  const bigStars: Node[] = [[140, 90], [330, 160], [560, 60], [720, 230], [450, 300]].map(([x, y]) =>
    piece(poly([[x, y - 11], [x + 3, y - 3], [x + 11, y], [x + 3, y + 3], [x, y + 11], [x - 3, y + 3], [x - 11, y], [x - 3, y - 3]]), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }));

  const win = (x: number, y: number) => piece(rect(x, y, 8, 13, 4), C.candle, { edge: 'cut', fibre: false, shadow: false });
  // a turret far away: a body, a pointed roof and a lit window
  const turret = (x: number, top: number, w: number, bottom: number, col: string, roof: string): Node[] => [
    piece(rect(x, top, w, bottom - top), col, { rough: 0.6 }),
    piece(poly([[x - 8, top + 4], [x + w / 2, top - w * 1.35], [x + w + 8, top + 4]]), roof, { rough: 0.6 }),
    win(x + w / 2 - 4, top + 26),
  ];
  const fir = (x: number, top: number, w: number, col: string) =>
    piece(poly([[x - w, top + 90], [x - w * 0.5, top + 50], [x - w * 0.7, top + 50], [x, top], [x + w * 0.7, top + 50], [x + w * 0.5, top + 50], [x + w, top + 90]]), col, { rough: 0.9, shadow: false });

  // the parapet: merlons (the teeth) every 120 px
  const merlons: Node[] = [];
  for (let x = -30; x < 1200; x += 120) {
    merlons.push(piece(rect(x, 520, 76, 60), '#8f93a6', { rough: 0.6 }));
    merlons.push(ink([[x + 8, 546], [x + 68, 548]], { width: 2, color: '#6d7186', opacity: 0.6 }));
  }
  const bricks: Node[] = [];
  for (let row = 0; row < 3; row++) {
    for (let x = row % 2 ? 40 : -10; x < 1200; x += 100) {
      bricks.push(ink([[x, 592 + row * 24], [x + 84, 592 + row * 24 + 1]], { width: 2, color: '#6d7186', opacity: 0.55 }));
      bricks.push(ink([[x + 84, 592 + row * 24], [x + 84, 592 + row * 24 + 22]], { width: 2, color: '#6d7186', opacity: 0.45 }));
    }
  }
  const flags: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 20 + r() * 1140;
    const y = 690 + r() * 120;
    flags.push(ink([[x, y], [x + 30 + r() * 30, y + 2]], { width: 2, color: '#757a8c', opacity: 0.35 }));
  }

  return svg({ w: 1180, h: 820, name: 'hogwarts-astronomy-tower', boil: false, className: 'backdrop' }, [
    // ---- the night sky, in soft bands (darkest at the top)
    piece(rect(-20, -20, 1220, 860), '#1d2a5c', { edge: 'clean', shadow: false }),
    piece(curve([[-40, 170], [300, 150], [700, 185], [1220, 140], [1220, 640], [-40, 640]], 2), '#24336a', { rough: 2, shadow: false, fibre: false }),
    piece(curve([[-40, 320], [400, 295], [800, 325], [1220, 290], [1220, 640], [-40, 640]], 2), '#2e3f7a', { rough: 2, shadow: false, fibre: false }),
    piece(curve([[-40, 410], [400, 392], [800, 410], [1220, 385], [1220, 640], [-40, 640]], 2), '#3a4b88', { rough: 2, shadow: false, fibre: false }),
    ...stars,
    ...bigStars,
    // ---- the moon and its halo
    piece(circle(950, 150, 135), '#6f80b8', { rough: 1.6, shadow: false, opacity: 0.3 }),
    piece(circle(950, 150, 104), '#93a3d2', { rough: 1.3, shadow: false, opacity: 0.35 }),
    piece(circle(950, 150, 78), '#f4ecd2', { rough: 0.7 }),
    piece(ellipse(925, 128, 18, 14, 20), '#e1d8b8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(ellipse(978, 176, 14, 11, -10), '#e1d8b8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(ellipse(968, 110, 9, 7), '#e1d8b8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // a thin cloud across the moon's foot
    piece(ellipse(1060, 262, 150, 15), '#5a6aa0', { rough: 1.5, shadow: false, opacity: 0.55 }),
    piece(ellipse(180, 330, 130, 14), '#53639a', { rough: 1.5, shadow: false, opacity: 0.45 }),

    // ---- far away, the other turrets of the castle (sides only)
    ...turret(22, 360, 54, 560, '#2c3868', '#3a4678'),
    ...turret(96, 410, 40, 560, '#323e70', '#3f4b7e'),
    ...turret(930, 350, 48, 560, '#2c3868', '#3a4678'),
    ...turret(1120, 400, 44, 560, '#323e70', '#3f4b7e'),
    ...turret(372, 468, 30, 560, '#2a3564', '#38437a'),

    // ---- far below: dark hills, the Forbidden Forest and Hagrid's hut
    piece(curve([[-40, 560], [-40, 500], [200, 470], [480, 490], [760, 460], [1000, 480], [1220, 470], [1220, 560]], 2), '#26406a', { rough: 1.3, shadow: false, fibre: false }),
    piece(curve([[-40, 560], [-40, 520], [300, 505], [620, 520], [900, 498], [1220, 515], [1220, 560]], 2), '#1f3558', { rough: 1.3, shadow: false, fibre: false }),
    ...[[480, 482, 26], [524, 476, 30], [570, 484, 24], [620, 478, 28], [668, 486, 24], [716, 478, 28], [770, 484, 26], [820, 480, 30], [868, 486, 24], [260, 496, 24], [210, 490, 26], [160, 498, 22]].map(([x, t, w]) => fir(x, t, w, '#16293f')),
    // Hagrid's hut: a round dark body, a little cone roof and one warm window
    piece(rect(392, 489, 44, 28, 4), '#1b2a42', { rough: 0.5, shadow: false }),
    piece(poly([[386, 492], [414, 470], [442, 492]]), '#141f33', { rough: 0.5, shadow: false }),
    piece(rect(409, 497, 9, 11, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(414, 504, 20, 12), C.candle, { edge: 'clean', fibre: false, shadow: false, opacity: 0.16 }),

    // ---- the parapet
    ...merlons,
    piece(rect(-20, 570, 1220, 90), '#9a9eb0', { rough: 0.7 }),
    piece(rect(-20, 568, 1220, 14), '#adb1c2', { rough: 0.6, shadow: false }),
    ...bricks,
    // shade at the foot of the wall
    piece(rect(-20, 638, 1220, 22), '#7b8096', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),

    // ---- the tower floor: big flagstones, plain and calm
    piece(rect(-20, 650, 1220, 200), '#aeb0be', { edge: 'clean', shadow: false }),
    piece(curve([[-40, 700], [400, 690], [800, 702], [1220, 692], [1220, 860], [-40, 860]], 2), '#a4a7b8', { rough: 1.6, shadow: false, fibre: false }),
    ink([[-10, 700], [1190, 692]], { width: 2.5, color: '#8b8fa4', opacity: 0.5 }),
    ink([[260, 656], [236, 700]], { width: 2.5, color: '#8b8fa4', opacity: 0.45 }),
    ink([[640, 656], [650, 700]], { width: 2.5, color: '#8b8fa4', opacity: 0.45 }),
    ink([[940, 656], [920, 700]], { width: 2.5, color: '#8b8fa4', opacity: 0.45 }),
    ...flags,

    // ---- the stair hut at the far right (x 1000 to 1180)
    piece(rect(1010, 360, 190, 300), '#8d91a6', { rough: 0.6 }),
    piece(poly([[996, 366], [1105, 250], [1200, 250], [1200, 366]]), '#5b4a6e', { rough: 0.6 }),
    piece(poly([[996, 366], [1105, 250], [1110, 250], [1030, 366]]), '#6e5b84', { rough: 0.6, shadow: false }),
    ...[0, 1, 2].map((i) => ink([[1020, 400 + i * 30], [1196, 402 + i * 30]], { width: 2, color: '#6d7186', opacity: 0.5 })),
    piece(curve([[1060, 660], [1060, 520], [1085, 470], [1120, 455], [1155, 470], [1180, 520], [1180, 660]], 2), '#2b2438', { rough: 0.7, shadow: false }),
    piece(curve([[1074, 660], [1074, 526], [1096, 486], [1120, 474], [1144, 486], [1166, 526], [1166, 660]], 2), '#d99a4f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    piece(rect(1054, 650, 132, 14), '#8b8fa4', { rough: 0.5 }),
    piece(ellipse(1120, 640, 16, 5), '#e8c27a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.4 }),
    piece(circle(1146, 588, 5), C.gold, { edge: 'cut', fibre: false }),

    // ---- the brass telescope at the far left (x 0 to 200)
    ...tripodLeg(78, 566, 24, 672),
    ...tripodLeg(78, 566, 134, 672),
    ...tripodLeg(78, 566, 78, 684),
    piece(circle(78, 560, 14), C.gold, { edge: 'cut' }),
    // the long tube, tilted up to the right
    piece(poly([[34, 590], [28, 566], [170, 464], [186, 486]]), '#c28a2e', { rough: 0.5 }),
    piece(poly([[34, 590], [28, 566], [170, 464], [176, 472]]), '#e5b858', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(poly([[136, 502], [128, 486], [148, 472], [156, 488]]), '#f0cd7c', { rough: 0.4, shadow: false }),
    piece(poly([[166, 478], [158, 460], [192, 440], [204, 460]]), '#a8731f', { rough: 0.5 }),
    piece(ellipse(198, 450, 9, 14, 55), '#bcd0e6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(circle(42, 580, 9), '#a8731f', { edge: 'cut' }),
  ]);
}

/** One slim brass leg of the telescope tripod. */
function tripodLeg(x0: number, y0: number, x1: number, y1: number): Node[] {
  const dx = x1 - x0;
  return [piece(poly([[x0 - 4, y0], [x0 + 4, y0], [x1 + 3 + (dx === 0 ? 0 : 0), y1], [x1 - 3, y1]]), '#a8731f', { rough: 0.4 })];
}
