/**
 * Mr Grim's School for Bad Brownies: the schoolroom, and his tall cupboard.
 *
 * The room is grey stone, a little gloomy but muted and readable (never
 * dark), with warm wood to cheer it: the floorboards, the blackboard frame,
 * the desks. On the LEFT wall (x 50-270, y 70-420) a tall arched window
 * stands OPEN, its casements swung into the room, showing blue sky and a
 * cloud: the Wishing-Chair flies in through it. A clock hangs between the
 * window and the board (x 335, y 90). In the middle of the back wall a big
 * blackboard in a wooden frame (x 380-800, y 120-380) with a chalk ledge,
 * a few chalk squiggles at its edges and a little star, but no words. Its
 * middle (x 470-720, y 170-330) is left clear for chalk writing as a prop.
 * By the board's right edge (about x 820, y 300) a bare patch of wall is
 * left for a hook: the cartoon hangs a key on it.
 *
 * The RIGHT of the back wall (x 860-1160) is plain stone for the cupboard.
 * Three small brownie desks, seen from behind, stand low at the front left
 * (x 40-330, tops at y 612), so people can stand behind them. Ground line
 * y 640; the open floor x 300-860 is clear for the chair to land. The
 * bottom band (y 690-820) is plain boards.
 *
 * The cupboard is a prop: 280 x 440, dark wood. Its inside is drawn first,
 * then two doors (parts `doorL`, `doorR`) hinged at the outer edges.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const GROUND = 640;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** Coursed grey stone blocks over a region. */
function stones(x0: number, y0: number, x1: number, y1: number, seed: number): Node[] {
  const r = rng(seed);
  const tones = ['#8d8d8a', '#979793', '#84847f', '#92918c', '#8a8b88'];
  const out: Node[] = [];
  let row = 0;
  for (let y = y0; y < y1; y += 52, row++) {
    let x = x0 - (row % 2 ? 50 : 0);
    while (x < x1) {
      const bw = 90 + r() * 60;
      const bx = Math.max(x, x0);
      const bx1 = Math.min(x + bw, x1);
      if (bx1 - bx > 8) out.push(piece(rect(bx + 2, y + 2, bx1 - bx - 4, Math.min(52, y1 - y) - 4, 5), tones[Math.floor(r() * tones.length)], { ...flat, edge: 'torn', rough: 0.5 }));
      x += bw;
    }
  }
  return out;
}

function floorBoards(): Node[] {
  const r = rng(808);
  const tones = ['#a07a52', '#98714b', '#a98258', '#9c7650'];
  const out: Node[] = [piece(rect(-20, GROUND, W + 40, H - GROUND + 40), '#9c7650', { edge: 'clean', shadow: false, fibre: false })];
  const rows = [GROUND, 668, 704, 750, 810, 880];
  for (let i = 0; i < rows.length - 1; i++) {
    let x = -30 - r() * 80;
    while (x < W + 30) {
      const w = 160 + r() * 140;
      out.push(piece(rect(x + 2, rows[i] + 2, w - 4, rows[i + 1] - rows[i] - 4, 3), tones[Math.floor(r() * tones.length)], { ...flat, edge: 'torn', rough: 0.4 }));
      x += w;
    }
  }
  return out;
}

function archWindow(): Node[] {
  const x0 = 50;
  const x1 = 270;
  const top = 70;
  const bottom = 420;
  const mid = (x0 + x1) / 2;
  const arch = (pad: number): Pt[] =>
    poly([
      [x0 + pad, bottom - pad],
      [x0 + pad, top + 110],
      [x0 + pad + 14, top + 52],
      [mid, top + pad],
      [x1 - pad - 14, top + 52],
      [x1 - pad, top + 110],
      [x1 - pad, bottom - pad],
    ]);
  return [
    // Stone surround and a deep sill.
    piece(arch(-16), '#a3a29c', { edge: 'cut' }),
    piece(arch(0), '#6e7f94', { edge: 'cut', shadow: false }),
    // Sky, brighter toward the bottom, and a fat cloud.
    piece(arch(10), C.sky, { ...flat, edge: 'clean' }),
    piece(rect(x0 + 10, 270, x1 - x0 - 20, 140), '#b3cfe6', { ...flat, edge: 'clean', opacity: 0.7 }),
    piece(ellipse(150, 200, 52, 24), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(186, 188, 34, 22), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(122, 188, 28, 18), C.cloud, { ...flat, edge: 'torn', rough: 1.2 }),
    piece(ellipse(160, 212, 56, 10), C.cloudShade, { ...flat, opacity: 0.6 }),
    piece(ellipse(220, 320, 30, 12), C.cloud, { ...flat, edge: 'torn', rough: 1.2, opacity: 0.85 }),
    // The two casements swung open into the room: narrow, foreshortened, slanting in.
    piece(poly([[x0 + 10, 160], [x0 + 52, 188], [x0 + 52, 390], [x0 + 10, 408]]), C.wood, { edge: 'cut' }),
    piece(poly([[x0 + 20, 176], [x0 + 44, 194], [x0 + 44, 380], [x0 + 20, 392]]), '#a8c6dc', { ...flat, opacity: 0.8 }),
    piece(poly([[x1 - 10, 160], [x1 - 52, 188], [x1 - 52, 390], [x1 - 10, 408]]), C.wood, { edge: 'cut' }),
    piece(poly([[x1 - 20, 176], [x1 - 44, 194], [x1 - 44, 380], [x1 - 20, 392]]), '#a8c6dc', { ...flat, opacity: 0.8 }),
    ink([[x0 + 32, 182], [x0 + 32, 394]], { width: 3, color: C.brownDark, opacity: 0.7 }),
    ink([[x1 - 32, 182], [x1 - 32, 394]], { width: 3, color: C.brownDark, opacity: 0.7 }),
    // The sill.
    piece(rect(x0 - 26, bottom - 4, x1 - x0 + 52, 24, 4), '#aeada6', { edge: 'cut' }),
    piece(rect(x0 - 26, bottom - 4, x1 - x0 + 52, 7, 3), '#c4c3bb', flat),
  ];
}

function clock(): Node[] {
  const cx = 335;
  const cy = 92;
  const hand = (a: number, len: number): Pt[] => [[cx, cy], [cx + Math.sin(a) * len, cy - Math.cos(a) * len]];
  return [
    piece(circle(cx, cy, 38), C.brown, { edge: 'cut' }),
    piece(circle(cx, cy, 31), C.cream, flat),
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return ink([[cx + Math.sin(a) * 25, cy - Math.cos(a) * 25], [cx + Math.sin(a) * 29, cy - Math.cos(a) * 29]], { width: 2.5, color: C.charcoal });
    }),
    ink(hand(0.9, 17), { width: 4, color: C.charcoal }),
    ink(hand(3.6, 24), { width: 3, color: C.charcoal }),
    piece(circle(cx, cy, 3.5), C.redDark, flat),
  ];
}

function blackboard(): Node[] {
  const x0 = 380;
  const x1 = 800;
  const y0 = 120;
  const y1 = 380;
  const chalk = { color: C.chalk, opacity: 0.8, wobble: 1.4 };
  return [
    // Wooden frame, then the slate-green board.
    piece(rect(x0 - 16, y0 - 16, x1 - x0 + 32, y1 - y0 + 32, 5), C.brown, { edge: 'cut' }),
    piece(rect(x0 - 16, y0 - 16, x1 - x0 + 32, 8, 3), C.wood, flat),
    piece(rect(x0, y0, x1 - x0, y1 - y0, 3), '#43554f', { edge: 'cut', shadow: false }),
    // Wiped chalk smears so it looks used.
    piece(ellipse(590, 250, 190, 70, -4), '#566a62', { ...flat, edge: 'torn', rough: 1.5, opacity: 0.35 }),
    // A chalk sum-like squiggle at the left, and underline.
    ink([[404, 160], [420, 150], [436, 160], [452, 150]], { width: 3, ...chalk }),
    ink([[404, 196], [452, 196]], { width: 3, ...chalk }),
    ink([[408, 218], [430, 230], [412, 244], [448, 250]], { width: 3, ...chalk }),
    ink([[404, 290], [452, 290]], { width: 3, ...chalk }),
    ink([[404, 296], [452, 296]], { width: 3, ...chalk }),
    // A little chalk star at the top right.
    ink([[752, 150], [761, 176], [786, 176], [766, 192], [774, 216], [752, 202], [730, 216], [738, 192], [718, 176], [743, 176]].map(([x, y]) => [x + 10, y - 2] as Pt), { width: 3, ...chalk, closed: true }),
    // A wobbly chalk line low on the right, and a wee house.
    ink([[740, 330], [770, 322], [782, 332]], { width: 3, ...chalk }),
    // The chalk ledge with two sticks and a duster.
    piece(rect(x0 - 24, y1 + 14, x1 - x0 + 48, 16, 4), C.wood, { edge: 'cut' }),
    piece(rect(x0 - 24, y1 + 14, x1 - x0 + 48, 5, 2), C.tan, flat),
    piece(rect(430, y1 + 6, 30, 8, 3), C.chalk, flat),
    piece(rect(466, y1 + 8, 22, 6, 3), C.chalk, flat),
    piece(rect(690, y1 + 2, 54, 13, 4), C.rust, { edge: 'cut' }),
    // A bare patch for the hook (x 820, y 300): just a slightly paler stone, left empty.
  ];
}

function desks(): Node[] {
  const out: Node[] = [];
  for (const x of [40, 140, 240]) {
    // Seen from behind: a back rail with legs, the sloped lid and a little stool.
    out.push(
      piece(rect(x + 6, 626, 8, 54, 2), C.brownDark, { edge: 'cut', shadow: false }),
      piece(rect(x + 76, 626, 8, 54, 2), C.brownDark, { edge: 'cut', shadow: false }),
      piece(rect(x + 2, 612, 86, 22, 4), C.wood, { edge: 'cut' }),
      piece(rect(x + 2, 612, 86, 6, 3), C.tan, flat),
      piece(rect(x + 14, 640, 62, 14, 3), C.brown, { ...flat, opacity: 0.55 }),
    );
  }
  return out;
}

export const grimSchoolroom = cached(() => {
  return svg({ w: W, h: H, name: 'wishing-grim-schoolroom', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, W + 40, H + 40), '#8c8c88', { edge: 'clean', shadow: false, fibre: false }),
    ...stones(-20, -20, W + 20, GROUND + 4, 77),
    // Gloom gathers softly in the high corners; the middle stays light.
    piece(rect(-20, -20, W + 40, 90), '#5f6068', { ...flat, edge: 'torn', rough: 2, opacity: 0.3 }),
    piece(rect(1040, -20, 180, GROUND + 20), '#5f6068', { ...flat, edge: 'torn', rough: 2, opacity: 0.18 }),
    // Light slanting in from the window onto the floor.
    ...archWindow(),
    ...clock(),
    ...blackboard(),
    // Skirting and floor.
    piece(rect(-20, GROUND - 22, W + 40, 26, 3), '#6b4f38', { edge: 'cut', shadow: false }),
    ...floorBoards(),
    piece(poly([[110, GROUND], [250, GROUND], [420, 750], [220, 750]]), C.goldLight, { ...flat, edge: 'torn', rough: 1.5, opacity: 0.1 }),
    ...desks(),
  ]);
});

/** Mr Grim's cupboard: dark wood, 280 x 440. Doors are parts `doorL` and `doorR` (hinged at the outer edges). */
export const schoolCupboard = cached(() => {
  const dark = '#4a3022';
  const mid = '#5f3f2c';
  const light = '#76513a';
  const door = (x0: number, x1: number, hingeX: number, part: string, knobX: number): Node =>
    group({ part, origin: [hingeX, 230] }, [
      piece(rect(x0, 44, x1 - x0, 378, 4), mid, { edge: 'cut' }),
      piece(rect(x0 + 14, 62, x1 - x0 - 28, 150, 5), light, { ...flat, opacity: 0.55 }),
      piece(rect(x0 + 22, 70, x1 - x0 - 44, 134, 4), dark, { ...flat, opacity: 0.55 }),
      piece(rect(x0 + 14, 242, x1 - x0 - 28, 156, 5), light, { ...flat, opacity: 0.55 }),
      piece(rect(x0 + 22, 250, x1 - x0 - 44, 140, 4), dark, { ...flat, opacity: 0.55 }),
      ink([[x0 + 20, 120], [x0 + 28, 160], [x0 + 22, 196]], { width: 2.5, color: dark, opacity: 0.4, wobble: 1.5 }),
      piece(circle(knobX, 230, 7), C.gold, { edge: 'cut' }),
    ]);
  return svg({ w: 280, h: 440, name: 'wishing-school-cupboard', label: 'Mr Grim’s cupboard', boil: false }, [
    // Plinth, body and the dark inside (big enough to hold a little armchair).
    piece(rect(4, 414, 272, 26, 4), dark, { edge: 'cut' }),
    piece(rect(0, 20, 280, 400, 6), dark, { edge: 'cut' }),
    piece(rect(20, 44, 240, 378), '#1e1714', { edge: 'cut', shadow: false }),
    piece(rect(20, 44, 240, 30), '#0f0b0a', { ...flat, opacity: 0.6 }),
    piece(rect(20, 400, 240, 22), '#2c211b', flat),
    // Cornice.
    piece(rect(-6, 0, 292, 30, 5), light, { edge: 'cut' }),
    piece(rect(-6, 0, 292, 8, 3), '#8c6347', flat),
    piece(rect(6, 28, 268, 10, 3), dark, flat),
    // Doors, then the lock plate on top of the right door.
    door(20, 140, 20, 'doorL', 124),
    group({ part: 'doorR', origin: [260, 230] }, [
      piece(rect(140, 44, 120, 378, 4), mid, { edge: 'cut' }),
      piece(rect(154, 62, 92, 150, 5), light, { ...flat, opacity: 0.55 }),
      piece(rect(162, 70, 76, 134, 4), dark, { ...flat, opacity: 0.55 }),
      piece(rect(154, 242, 92, 156, 5), light, { ...flat, opacity: 0.55 }),
      piece(rect(162, 250, 76, 140, 4), dark, { ...flat, opacity: 0.55 }),
      ink([[236, 116], [230, 160], [238, 196]], { width: 2.5, color: dark, opacity: 0.4, wobble: 1.5 }),
      // Big brass plate with a keyhole.
      piece(curve([[134, 196], [166, 190], [170, 232], [166, 276], [134, 272], [130, 232]], 2), C.gold, { edge: 'cut' }),
      piece(ellipse(150, 232, 15, 30), C.goldLight, { ...flat, opacity: 0.45 }),
      piece(circle(150, 218, 10), C.snapInk, { edge: 'cut', shadow: false }),
      piece(poly([[145, 224], [155, 224], [158, 254], [142, 254]]), C.snapInk, { edge: 'cut', shadow: false }),
      piece(circle(138, 200, 3), C.brownDark, flat),
      piece(circle(162, 200, 3), C.brownDark, flat),
      piece(circle(138, 264, 3), C.brownDark, flat),
      piece(circle(162, 264, 3), C.brownDark, flat),
    ]),
    // Little feet.
    piece(rect(10, 430, 30, 10, 3), C.brownDark, { edge: 'cut', shadow: false }),
    piece(rect(240, 430, 30, 10, 3), C.brownDark, { edge: 'cut', shadow: false }),
  ]);
});
