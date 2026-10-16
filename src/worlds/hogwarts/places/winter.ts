/** Two snowy winter places for the Christmas episode: the grounds and the great front doors. */
import { C } from '../../../art/palette';
import { curve, dot, ellipse, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const SNOW = '#f4f7fb';
const SNOW_SHADE = '#dbe5f0';
const SNOW_BLUE = '#c3d2e4';

/** A fir tree: a trunk and three tiers, each with a cap of snow. */
function fir(x: number, base: number, h: number, w: number, col: string, snowy = true): Node[] {
  const tiers: Node[] = [piece(rect(x - w * 0.07, base - h * 0.12, w * 0.14, h * 0.14), C.barkDark, { edge: 'cut', fibre: false, shadow: false })];
  for (let i = 0; i < 3; i++) {
    const bottom = base - h * 0.1 - i * h * 0.27;
    const top = bottom - h * 0.42;
    const hw = w * (0.5 - i * 0.12);
    tiers.push(piece(poly([[x - hw, bottom], [x - hw * 0.2, top + 6], [x, top], [x + hw * 0.2, top + 6], [x + hw, bottom], [x, bottom - 12]]), col, { rough: 1.1, shadow: false }));
    if (snowy) {
      const ph = (bottom - top) * 0.5;
      tiers.push(piece(poly([[x - hw * 0.62, bottom - ph * 0.55], [x - hw * 0.3, bottom - ph * 0.95], [x - hw * 0.1, top + ph * 0.55], [x, top + ph * 0.4], [x + hw * 0.1, top + ph * 0.55], [x + hw * 0.3, bottom - ph * 0.95], [x + hw * 0.62, bottom - ph * 0.55], [x + hw * 0.3, bottom - ph * 0.7], [x, bottom - ph * 0.5], [x - hw * 0.3, bottom - ph * 0.72]]), SNOW, { rough: 0.9, shadow: false, opacity: 0.95 }));
    }
  }
  return tiers;
}

/** The grounds on a snowy afternoon: pale sky, the castle far off, firs at the left, deep snow. */
export function snowyGrounds(): string {
  const r = rng(1225);
  const flakes: Node[] = [];
  for (let i = 0; i < 26; i++) flakes.push(dot(r() * 1180, 20 + r() * 380, 1.6 + r() * 2.2, '#ffffff', 0.5 + r() * 0.4));
  const tower = (x: number, top: number, w: number): Node[] => [
    piece(rect(x, top, w, 440 - top), '#6f7893', { rough: 0.6, shadow: false }),
    piece(poly([[x - 7, top + 4], [x + w / 2, top - w * 1.3], [x + w + 7, top + 4]]), '#566080', { rough: 0.6, shadow: false }),
    // snow on the roof
    piece(poly([[x - 6, top + 2], [x + w / 2 - 2, top - w * 1.05], [x + w / 2 + 2, top - w * 1.05], [x + w + 6, top + 2], [x + w * 0.7, top - 4], [x + w * 0.5, top + 2], [x + w * 0.3, top - 4]]), SNOW, { rough: 0.6, shadow: false }),
  ];
  const win = (x: number, y: number) => piece(rect(x, y, 8, 13, 4), C.candle, { edge: 'cut', fibre: false, shadow: false });
  const mound = (x: number, y: number, w: number, h: number) => piece(ellipse(x, y, w, h), SNOW, { rough: 1.2, shadow: false });
  return svg({ w: 1180, h: 820, name: 'hogwarts-snowy-grounds', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#b9c9da', { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 200), '#a9bad0', { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(rect(-20, 280, 1220, 200), '#d4dfea', { edge: 'clean', shadow: false, opacity: 0.8 }),
    // soft clouds
    piece(ellipse(240, 120, 170, 24), '#e3eaf2', { rough: 1.5, shadow: false, opacity: 0.8 }),
    piece(ellipse(800, 80, 190, 22), '#e3eaf2', { rough: 1.5, shadow: false, opacity: 0.7 }),
    piece(ellipse(980, 220, 130, 18), '#e8eef5', { rough: 1.5, shadow: false, opacity: 0.7 }),
    ...flakes,
    // the far ridge
    piece(curve([[-40, 520], [-40, 430], [300, 405], [640, 430], [900, 396], [1220, 420], [1220, 520]], 2), '#a8b9cf', { rough: 1.4, shadow: false }),
    // the castle on its hill, small and far
    piece(curve([[560, 470], [700, 392], [840, 380], [980, 410], [1060, 470]], 2), SNOW_BLUE, { rough: 1.2, shadow: false }),
    ...tower(700, 300, 34),
    ...tower(752, 250, 44),
    ...tower(818, 290, 38),
    ...tower(872, 340, 30),
    piece(rect(690, 372, 230, 76), '#6f7893', { rough: 0.6, shadow: false }),
    piece(poly([[686, 374], [804, 356], [924, 374], [920, 380], [804, 364], [690, 382]]), SNOW, { rough: 0.5, shadow: false }),
    win(712, 308), win(764, 270), win(764, 300), win(830, 304), win(880, 352),
    win(712, 396), win(742, 410), win(790, 394), win(842, 412), win(886, 398),
    // hills
    piece(curve([[-40, 560], [-40, 470], [240, 450], [520, 478], [820, 452], [1220, 472], [1220, 560]], 2), '#e7eef6', { rough: 1.4, shadow: false }),
    piece(curve([[-40, 640], [-40, 548], [300, 520], [620, 552], [940, 520], [1220, 540], [1220, 640]], 2), SNOW, { rough: 1.4, shadow: false }),
    // distant firs on the hill
    ...fir(560, 540, 80, 44, '#3f5a52'),
    ...fir(610, 548, 58, 34, '#46625a'),
    ...fir(1090, 532, 90, 50, '#3f5a52'),
    ...fir(1140, 540, 66, 38, '#46625a'),
    // the front snow
    piece(curve([[-40, 820], [-40, 650], [360, 628], [700, 660], [1000, 636], [1220, 650], [1220, 820]], 2), SNOW, { rough: 1.5, shadow: false }),
    piece(curve([[-40, 820], [-40, 700], [400, 690], [820, 706], [1220, 692], [1220, 820]], 2), '#eef3f9', { rough: 1.6, shadow: false }),
    // soft blue shadows in the drifts, kept faint
    piece(curve([[430, 640], [560, 628], [760, 640], [650, 650]], 2), SNOW_SHADE, { rough: 1.2, shadow: false, opacity: 0.7 }),
    mound(960, 676, 120, 12),
    // the snowy firs at the left edge (drawn last so they stand in front)
    ...fir(40, 640, 440, 250, '#233a34'),
    ...fir(170, 600, 300, 170, '#2c473f'),
    ...fir(-10, 690, 330, 200, '#1f332e'),
    ...fir(250, 580, 180, 110, '#2c473f'),
    // snow banked at the foot of the trees
    mound(80, 662, 160, 22),
    mound(230, 628, 90, 14),
  ]);
}

/** One block of masonry for a wall course. */
function blocks(x0: number, x1: number, y0: number, y1: number, seed: number, skip?: (x: number, y: number, w: number) => boolean): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  const cols = ['#8d909a', '#868995', '#9396a0', '#7f828e'];
  let row = 0;
  for (let y = y0; y < y1; y += 44, row++) {
    let x = x0 - (row % 2) * 40;
    while (x < x1) {
      const w = 76 + r() * 40;
      if (!skip || !skip(x, y, w)) out.push(piece(rect(x + 1.5, y + 1.5, w - 3, 41, 5), cols[Math.floor(r() * cols.length)], { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }));
      x += w;
    }
  }
  return out;
}

/** The castle's great front doors, seen from outside in the snow, standing open. */
export function castleDoors(): string {
  const r = rng(1224);
  const flakes: Node[] = [];
  for (let i = 0; i < 22; i++) flakes.push(dot(r() * 1180, 10 + r() * 140, 1.6 + r() * 2, '#ffffff', 0.45 + r() * 0.4));
  // the arch: a pointed-round top, opening x 430 to 750, springing at y 300, apex y 150
  const arch = (grow: number, apex: number): Pt[] => {
    const l = 430 - grow;
    const rr = 750 + grow;
    return curve([[l, 660], [l, 330], [l + 8, 250], [l + 50, 200], [590, apex], [rr - 50, 200], [rr - 8, 250], [rr, 330], [rr, 660]], 3);
  };
  const inOpening = (x: number, y: number, w: number) => x + w > 392 && x < 788 && y > 120;
  const glow: Node[] = [
    piece(arch(0, 150), '#c98a2e', { edge: 'clean', shadow: false }),
    piece(curve([[450, 660], [450, 335], [458, 262], [496, 220], [590, 178], [684, 220], [722, 262], [730, 335], [730, 660]], 3), '#e8a840', { edge: 'clean', shadow: false }),
    piece(curve([[480, 660], [480, 345], [490, 280], [525, 245], [590, 215], [655, 245], [690, 280], [700, 345], [700, 660]], 3), C.candle, { edge: 'clean', shadow: false, opacity: 0.9 }),
    piece(ellipse(590, 500, 80, 150), '#fbe7ae', { edge: 'clean', shadow: false, opacity: 0.6 }),
  ];
  // far-hall details inside the doorway: a pillar of floor, a far arch and torches, kept soft
  const hall: Node[] = [
    piece(rect(430, 560, 320, 100), '#c9893a', { edge: 'clean', shadow: false, opacity: 0.7 }),
    piece(curve([[520, 560], [520, 420], [545, 372], [590, 356], [635, 372], [660, 420], [660, 560]], 2), '#fff3c9', { edge: 'clean', shadow: false, opacity: 0.55 }),
    piece(rect(466, 400, 10, 60, 4), '#fff1c4', { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(rect(704, 400, 10, 60, 4), '#fff1c4', { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(ellipse(471, 394, 10, 14), '#fff8dc', { edge: 'clean', shadow: false }),
    piece(ellipse(709, 394, 10, 14), '#fff8dc', { edge: 'clean', shadow: false }),
  ];
  const door = (side: 'l' | 'r'): Node[] => {
    // seen almost edge on: a slim slab against the wall, tapering to the arch
    const near = side === 'l' ? 430 : 750;
    const dir = side === 'l' ? -1 : 1;
    const far = near + dir * 66;
    const slab: Pt[] = [[near, 668], [near, 250], [far, 232], [far, 640]];
    const planks: Node[] = [];
    for (let i = 1; i < 4; i++) {
      const x = near + dir * i * 16.5;
      planks.push(piece(rect(Math.min(x, x + 1.5), 242, 2, 395), '#4a2d1a', { edge: 'clean', shadow: false, opacity: 0.6 }));
    }
    return [
      piece(slab, '#7b4f2f', { rough: 0.5 }),
      piece([[near, 668], [near, 250], [near + dir * 14, 246], [near + dir * 14, 654]], '#8f6038', { edge: 'cut', fibre: false, shadow: false }),
      ...planks,
      // iron bands and hinges
      ...[300, 440, 580].map((y) => piece(rect(Math.min(near, far), y, 66, 12, 3), '#2f2a2b', { edge: 'cut', fibre: false, shadow: false })),
      ...[306, 446, 586].map((y) => dot(far - dir * 8, y + 6, 3, '#b8a78a')),
    ];
  };
  const ledgeSnow = (x: number, y: number, w: number): Node =>
    piece(curve([[x, y + 8], [x + w * 0.12, y - 6], [x + w * 0.4, y - 10], [x + w * 0.7, y - 6], [x + w * 0.9, y - 9], [x + w, y + 8]], 2), SNOW, { rough: 0.8, shadow: false });
  return svg({ w: 1180, h: 820, name: 'hogwarts-castle-doors', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#aebfd3', { edge: 'clean', shadow: false }),
    ...flakes,
    // the stone wall, rising out of sight at the top
    piece(rect(-20, -20, 1220, 700), '#7a7d89', { edge: 'clean', shadow: false }),
    ...blocks(-20, 1200, -4, 660, 9, inOpening),
    // darker band at the top, where the wall goes up into shadow
    piece(rect(-20, -20, 1220, 70), '#5f6272', { edge: 'clean', shadow: false, opacity: 0.55 }),
    // great arch: stone surround, then the glowing opening
    piece(arch(34, 118), '#5b5e6c', { rough: 0.5 }),
    piece(arch(20, 134), '#a3a6b0', { rough: 0.5, shadow: false }),
    ...glow,
    ...hall,
    // keystone and carved sill over the door
    piece(poly([[560, 108], [620, 108], [630, 150], [550, 150]]), '#b5b1a8', { edge: 'cut', fibre: false }),
    // soft inner glow spilling over the surround and snow
    piece(ellipse(590, 650, 260, 40), '#f6d58a', { edge: 'clean', shadow: false, opacity: 0.35 }),
    ...door('l'),
    ...door('r'),
    // two lit lanterns on the wall, one at each side of the doors
    ...[260, 920].flatMap((x) => [
      piece(rect(x - 4, 205, 8, 20, 2), '#2f2a2b', { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(x - 11, 225, 22, 34, 8), C.candle, { edge: 'clean', fibre: false, shadow: false }),
      piece(ellipse(x, 242, 30, 36), '#f7d283', { edge: 'clean', shadow: false, opacity: 0.25 }),
      piece(rect(x - 14, 258, 28, 6, 2), '#2f2a2b', { edge: 'cut', fibre: false, shadow: false }),
    ]),
    // snow on the stonework ledges
    ledgeSnow(398, 140, 66),
    ledgeSnow(716, 140, 66),
    ledgeSnow(540, 98, 100),
    ...[[40, 330, 150], [940, 330, 190], [250, 470, 120], [820, 500, 130]].flatMap(([x, y, w]) => [
      piece(rect(x, y, w, 14, 3), '#a3a6b0', { edge: 'cut', fibre: false }),
      ledgeSnow(x - 4, y, w + 8),
    ]),
    // the wall's foot, a plinth with snow along it
    piece(rect(-20, 640, 1220, 30), '#656876', { edge: 'clean', shadow: false }),
    // the ground
    piece(curve([[-40, 820], [-40, 664], [300, 654], [590, 662], [900, 654], [1220, 664], [1220, 820]], 2), SNOW, { rough: 1.3, shadow: false }),
    // steps up to the doorway
    piece(rect(402, 660, 376, 20, 4), '#b9bcc6', { edge: 'cut', fibre: false }),
    piece(curve([[396, 664], [420, 654], [590, 650], [760, 654], [786, 664], [790, 672], [390, 672]], 2), SNOW, { rough: 0.7, shadow: false }),
    piece(rect(380, 680, 420, 18, 4), '#a9acb7', { edge: 'cut', fibre: false }),
    piece(curve([[374, 684], [400, 676], [590, 674], [780, 676], [806, 684], [810, 694], [370, 694]], 2), SNOW, { rough: 0.7, shadow: false }),
    // light on the snow outside the door
    piece(ellipse(590, 706, 190, 16), '#f9e3a6', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(curve([[-40, 820], [-40, 724], [400, 714], [820, 726], [1220, 714], [1220, 820]], 2), '#eef3f9', { rough: 1.6, shadow: false }),
    // drifts at the corners
    piece(ellipse(60, 668, 150, 22), SNOW, { rough: 1.2, shadow: false }),
    piece(ellipse(1130, 668, 150, 22), SNOW, { rough: 1.2, shadow: false }),
  ]);
}
