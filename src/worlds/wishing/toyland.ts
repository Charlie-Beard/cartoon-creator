/**
 * Two places in Toyland.
 *
 * toylandStation: Toyland's little station on the morning of the Toy Fair,
 * all in bright primary colours. A far town of building-block houses with
 * painted windows, a red-and-white striped Fair tent on the right with a
 * yellow pennant, strings of bunting across the sky, a tall blue clock on a
 * pole at the left (it shows five to twelve), a little track along the back
 * of the platform (the rail is at y 572: a train's wheels stand on it), and
 * the platform itself: warm wooden planks from y 590, its front edge made of
 * coloured building blocks (a calm band under y 705). At the far right, on
 * the platform, stands the old toy cupboard (x 1020-1170, y 330-620): dull
 * brown, dusty, a dark gap between its doors, out of place among all the
 * colour.
 *
 * Ground line y 640; the open platform is x 250-950. The clock, the tent and
 * the cupboard are painted in.
 *
 * toyCupboard: inside the big old toy cupboard. Dim brown planks, a crack of
 * golden light down the left edge falling across the floor, cobwebs in the
 * top corners, a dusty top shelf (a drum, three skittles and a sleepy doll)
 * and a rocking horse on the floor at the left. On the right, three wooden
 * ledges rise like stairs (tops at y 570, 470 and 360); the top one is wide
 * enough for a toy box and someone standing beside it. Dim, but every face
 * can still be read: a light on the actors helps.
 *
 * Ground line y 640; open floor x 300-760. The ledges, shelf, horse and
 * cobwebs are painted in.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../art/paper';
import { CUT, star } from '../faraway/parts';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const RED = C.toyRed;
const BLUE = C.toyBlue;
const YELLOW = C.toyYellow;
const GREEN = C.toyGreen;
const PAPER = '#fbf6ea';

// ============================================================= the station

/** A cloud: three soft white blobs. */
function cloud(x: number, y: number, s: number): Node[] {
  return [
    piece(ellipse(x, y, 70 * s, 22 * s), PAPER, { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(x - 34 * s, y - 14 * s, 36 * s, 20 * s), PAPER, { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(x + 26 * s, y - 20 * s, 40 * s, 24 * s), PAPER, { edge: 'torn', fibre: false, shadow: false }),
  ];
}

/** A block house: a coloured cube with a roof block, painted windows and a door. */
function house(x: number, base: number, w: number, h: number, body: string, roof: string, roofKind: 'tri' | 'flat' = 'tri'): Node[] {
  const out: Node[] = [piece(rect(x, base - h, w, h, 2), body, { edge: 'cut', shadow: false })];
  if (roofKind === 'tri') out.push(piece(poly([[x - 6, base - h + 2], [x + w / 2, base - h - w * 0.42], [x + w + 6, base - h + 2]]), roof, { edge: 'cut', fibre: false, shadow: false }));
  else out.push(piece(rect(x - 4, base - h - 16, w + 8, 18, 2), roof, { edge: 'cut', fibre: false, shadow: false }));
  const cols = w > 90 ? 2 : 1;
  const rows = h > 110 ? 2 : 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + w * ((c + 0.5) / cols) - 11;
      const wy = base - h + 16 + r * 40;
      if (r === rows - 1 && c === 0 && rows === 1 && cols === 1) continue;
      out.push(piece(rect(wx, wy, 22, 26, 2), PAPER, flat), ink([[wx + 11, wy], [wx + 11, wy + 26]], { width: 2, color: roof }), ink([[wx, wy + 13], [wx + 22, wy + 13]], { width: 2, color: roof }));
    }
  }
  out.push(piece(rect(x + w / 2 - 11, base - 34, 22, 34, 8), roof, flat), dot(x + w / 2 + 5, base - 16, 2.2, YELLOW));
  return out;
}

/** A string of triangular bunting between two points, sagging in the middle. */
function bunting(x1: number, y1: number, x2: number, y2: number, sag: number, colours: string[]): Node[] {
  const out: Node[] = [];
  const pts: [number, number][] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * sag]);
  }
  out.push(ink(pts, { width: 2.4, color: C.brownDark, opacity: 0.7 }));
  for (let i = 1; i < n; i++) {
    const [x, y] = pts[i];
    out.push(piece(poly([[x - 11, y], [x + 11, y], [x, y + 28]]), colours[i % colours.length], { edge: 'cut', fibre: false, shadow: false }));
  }
  return out;
}

/** The striped Fair tent with a pennant on its peak. */
function tent(): Node[] {
  const cxT = 850;
  const apex: [number, number] = [cxT, 318];
  const out: Node[] = [piece(rect(cxT - 100, 404, 200, 90, 2), PAPER, { edge: 'cut', shadow: false })];
  // red stripes on the walls
  for (let i = 0; i < 5; i++) out.push(piece(rect(cxT - 100 + i * 40, 404, 20, 90, 1), RED, flat));
  // the roof as alternating wedges
  const n = 10;
  for (let i = 0; i < n; i++) {
    const x1 = cxT - 120 + (i * 240) / n;
    const x2 = cxT - 120 + ((i + 1) * 240) / n;
    out.push(piece(poly([[x1, 410], apex, [x2, 410]]), i % 2 ? PAPER : RED, flat));
  }
  // scalloped edge under the roof
  for (let i = 0; i < n; i++) {
    const x1 = cxT - 120 + (i * 240) / n;
    out.push(piece(ellipse(x1 + 12, 410, 12, 9), i % 2 ? PAPER : RED, flat));
  }
  out.push(
    piece(poly([[cxT - 26, 494], [cxT - 26, 440], [cxT, 420], [cxT + 26, 440], [cxT + 26, 494]]), '#5a2c2a', flat),
    ink([[apex[0], apex[1]], [apex[0], apex[1] - 44]], { width: 3, color: C.brownDark }),
    piece(poly([[apex[0], apex[1] - 44], [apex[0] + 40, apex[1] - 34], [apex[0], apex[1] - 22]]), YELLOW, flat),
    piece(star(apex[0] + 12, apex[1] - 34, 6, 0), RED, flat),
  );
  return out;
}

/** The tall blue clock on a pole, showing five to twelve. Face centre (130, 176). */
function clock(): Node[] {
  const x = 130;
  const y = 176;
  const r = 54;
  const out: Node[] = [
    piece(rect(x - 7, y + r - 6, 14, 424, 2), BLUE, { edge: 'cut' }),
    piece(rect(x - 22, 586, 44, 14, 3), '#2e5588', { edge: 'cut', fibre: false }),
    piece(circle(x, y, r + 9), BLUE, { edge: 'cut' }),
    piece(circle(x, y, r), PAPER, { edge: 'clean', fibre: false, shadow: false }),
    piece(poly([[x - 12, y - r - 22], [x + 12, y - r - 22], [x + 6, y - r - 8], [x - 6, y - r - 8]]), YELLOW, flat),
  ];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 === 0 ? r - 14 : r - 9;
    out.push(ink([[x + Math.sin(a) * r0, y - Math.cos(a) * r0], [x + Math.sin(a) * (r - 4), y - Math.cos(a) * (r - 4)]], { width: i % 3 === 0 ? 4 : 2.4, color: C.ink }));
  }
  // five to twelve: the minute hand at 55 (just left of straight up), the hour hand nearly at 12
  const mA = -(Math.PI * 2) / 12;
  const hA = -(Math.PI * 2) / 144;
  out.push(
    ink([[x, y], [x + Math.sin(mA) * (r - 12), y - Math.cos(mA) * (r - 12)]], { width: 4, color: C.ink }),
    ink([[x, y], [x + Math.sin(hA) * (r - 26), y - Math.cos(hA) * (r - 26)]], { width: 6, color: RED }),
    piece(circle(x, y, 5), RED, flat),
  );
  return out;
}

/** The old toy cupboard standing at the right end of the platform: dull and dusty among the colours. */
function oldCupboard(): Node[] {
  const x = 1020;
  const top = 330;
  const bottom = 622;
  return [
    piece(ellipse(1100, bottom + 4, 90, 9), 'rgba(40,25,10,0.22)', flat),
    piece(rect(x, top, 150, bottom - top, 3), '#6b4a33', { edge: 'cut' }),
    piece(rect(x - 8, top - 14, 166, 20, 3), '#4f3626', { edge: 'cut', fibre: false }),
    piece(rect(x + 8, top + 18, 64, bottom - top - 36, 2), '#7d5a40', flat),
    piece(rect(x + 80, top + 18, 62, bottom - top - 36, 2), '#7d5a40', flat),
    // the dark gap where the doors don't quite meet
    piece(rect(x + 72, top + 18, 8, bottom - top - 36, 1), '#201710', flat),
    dot(x + 66, top + 150, 5, C.brass),
    dot(x + 86, top + 150, 5, C.brass),
    // a cobweb across the top corner, and dust
    ink([[x + 8, top + 18], [x + 40, top + 22], [x + 60, top + 18]], { width: 1.6, color: '#e8e2d4', opacity: 0.75 }),
    ink([[x + 8, top + 18], [x + 14, top + 46], [x + 8, top + 62]], { width: 1.6, color: '#e8e2d4', opacity: 0.75 }),
    ink([[x + 8, top + 18], [x + 38, top + 40]], { width: 1.6, color: '#e8e2d4', opacity: 0.75 }),
    ink([[x + 20, top + 20], [x + 22, top + 36], [x + 34, top + 36]], { width: 1.4, color: '#e8e2d4', opacity: 0.7 }),
    piece(ellipse(x + 110, top + 24, 38, 5), '#cfc6b6', { ...flat, opacity: 0.4 }),
  ];
}

/** The platform's front edge: a row of chunky coloured building blocks, kept pale and calm. */
function frontBlocks(): Node[] {
  const cols = ['#e48f84', '#f1db86', '#86aedc', '#8dc59a'];
  const out: Node[] = [piece(rect(-20, 706, 1220, 16, 2), '#9a6a38', { edge: 'cut', fibre: false, shadow: false })];
  for (let i = 0; i < 12; i++) {
    const x = -20 + i * 104;
    out.push(piece(rect(x, 722, 102, 110, 3), cols[i % 4], { edge: 'cut', fibre: false, shadow: false }));
    out.push(piece(circle(x + 51, 750, 14), PAPER, { edge: 'clean', fibre: false, shadow: false, opacity: 0.45 }));
  }
  return out;
}

export const toylandStation = cached(() =>
  svg({ w: W, h: H, name: 'wishing-toyland-station', className: 'backdrop' }, [
    // sky
    piece(rect(-20, -20, 1220, 860), '#9fd0ee', { edge: 'clean', shadow: false }),
    piece(rect(-20, 240, 1220, 330), '#c6e4f4', { edge: 'clean', shadow: false, opacity: 0.8 }),
    ...cloud(300, 120, 1),
    ...cloud(640, 70, 0.8),
    ...cloud(960, 150, 1.1),
    // far hills
    piece(curve([[-40, 520], [120, 450], [300, 470], [480, 440], [680, 470], [900, 430], [1100, 460], [1240, 440], [1240, 560], [-40, 560]], 2), '#8fc87c', { edge: 'torn', shadow: false }),
    piece(curve([[-40, 540], [200, 500], [420, 520], [700, 490], [960, 520], [1240, 500], [1240, 580], [-40, 580]], 2), '#6fae62', { edge: 'torn', shadow: false }),
    // the Fair tent behind the town
    ...tent(),
    // Toyland town: block houses
    ...house(10, 540, 110, 120, RED, YELLOW),
    ...house(150, 540, 80, 90, YELLOW, BLUE, 'flat'),
    ...house(240, 540, 100, 150, BLUE, RED),
    ...house(360, 540, 84, 100, GREEN, YELLOW),
    ...house(458, 540, 108, 118, YELLOW, RED, 'flat'),
    ...house(586, 540, 92, 140, RED, BLUE),
    ...house(966, 540, 100, 110, GREEN, RED),
    ...house(1080, 540, 100, 150, YELLOW, BLUE),
    // bunting across the sky
    ...bunting(-10, 60, 640, 90, 36, [RED, YELLOW, BLUE, GREEN]),
    ...bunting(640, 90, 1190, 56, 40, [YELLOW, GREEN, RED, BLUE]),
    // the track along the back of the platform: gravel, sleepers, and the rail
    piece(rect(-20, 530, 1220, 60, 2), '#a89d8a', { edge: 'cut', shadow: false }),
    ...Array.from({ length: 34 }, (_, i) => piece(rect(-10 + i * 36, 574, 24, 14, 1), '#6d5238', { edge: 'cut', fibre: false, shadow: false })),
    ink([[-20, 573], [1200, 573]], { width: 6, color: '#c9d0d6' }),
    ink([[-20, 578], [1200, 578]], { width: 2.5, color: '#5f6870', opacity: 0.7 }),
    // the platform
    piece(rect(-20, 590, 1220, 120, 2), '#e8cf9c', { edge: 'clean', shadow: false }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ink([[i * 120 - 40, 592], [i * 120 - 80, 708]], { width: 2.2, color: C.brownDark, opacity: 0.22 })),
    ...[626, 664].map((y) => ink([[-20, y], [1200, y + 2]], { width: 2, color: C.brownDark, opacity: 0.18 })),
    piece(rect(-20, 590, 1220, 8), '#c9a66a', { edge: 'clean', shadow: false, opacity: 0.8 }),
    // the clock, the old cupboard, then the block front
    ...clock(),
    ...oldCupboard(),
    ...frontBlocks(),
  ]),
);

// ========================================================== the toy cupboard

const WALL = '#6a4b36';
const WALL_DARK = '#5a3f2c';
const BOARD = '#8a6244';
const BOARD_DARK = '#684a32';
const DUST = '#d9cfbb';

/** A cobweb fanning out from a corner (x, y), towards the direction (sx, sy). */
function cobweb(x: number, y: number, sx: number, sy: number, size: number): Node[] {
  const out: Node[] = [];
  const spokes = [[1, 0], [0.9, 0.45], [0.6, 0.8], [0.25, 1], [0, 1]];
  for (const [dx, dy] of spokes) out.push(ink([[x, y], [x + sx * dx * size, y + sy * dy * size]], { width: 1.5, color: '#e6e0d2', opacity: 0.7, wobble: 0.3 }));
  for (const t of [0.35, 0.65, 0.95]) {
    const pts: [number, number][] = spokes.map(([dx, dy]) => [x + sx * dx * size * t, y + sy * dy * size * t] as [number, number]);
    out.push(ink(pts, { width: 1.3, color: '#e6e0d2', opacity: 0.65, wobble: 0.4 }));
  }
  return out;
}

/** A wooden drum: red sides with a zigzag cord, a cream top. */
function drum(x: number, base: number): Node[] {
  return [
    piece(rect(x, base - 62, 84, 62, 4), RED, { edge: 'cut' }),
    piece(ellipse(x + 42, base - 62, 42, 11), '#e8dcc0', { edge: 'cut', fibre: false, shadow: false }),
    ink([[x + 4, base - 56], [x + 22, base - 8], [x + 42, base - 56], [x + 62, base - 8], [x + 80, base - 56]], { width: 3, color: YELLOW, opacity: 0.9, wobble: 0.3 }),
    piece(ellipse(x + 40, base - 70, 40, 5), DUST, { ...flat, opacity: 0.4 }),
  ];
}

/** A skittle: a round-bellied wooden pin with a red stripe. */
function skittle(x: number, base: number, h: number): Node[] {
  return [
    piece(curve([[x - 8, base - h], [x + 8, base - h], [x + 12, base - h * 0.62], [x + 20, base - h * 0.28], [x + 14, base], [x - 14, base], [x - 20, base - h * 0.28], [x - 12, base - h * 0.62]], 2), '#e9dcc0', { edge: 'cut' }),
    piece(rect(x - 12, base - h * 0.78, 24, 8, 2), RED, flat),
    piece(circle(x, base - h - 8, 11), '#e9dcc0', CUT),
  ];
}

/** A sleepy rag doll sitting with her head on one side, eyes shut. */
function sleepyDoll(x: number, base: number): Node[] {
  return [
    piece(poly([[x - 26, base], [x - 18, base - 42], [x + 18, base - 42], [x + 26, base]]), '#c98aa0', { edge: 'cut' }),
    piece(circle(x + 4, base - 62, 20), '#ecc9a4', CUT),
    piece(curve([[x - 18, base - 66], [x - 12, base - 88], [x + 10, base - 90], [x + 24, base - 70], [x + 18, base - 62], [x - 10, base - 70]], 2), '#a8642a', { edge: 'torn', shadow: false }),
    ink([[x - 4, base - 62], [x + 2, base - 59], [x + 8, base - 62]], { width: 2, color: C.ink }),
    ink([[x + 12, base - 62], [x + 17, base - 59], [x + 22, base - 62]], { width: 2, color: C.ink }),
    ink([[x + 6, base - 52], [x + 12, base - 50]], { width: 2, color: C.redDark }),
  ];
}

/** A rocking horse, dappled grey with a red saddle, standing on its rockers. */
function rockingHorse(x: number, base: number): Node[] {
  return [
    piece(band([[x - 14, base - 34], [x + 40, base - 10], [x + 110, base - 6], [x + 180, base - 12], [x + 232, base - 34]], 14), '#7d5a40', { edge: 'cut' }),
    // legs
    piece(poly([[x + 28, base - 100], [x + 52, base - 100], [x + 36, base - 16], [x + 18, base - 16]]), '#8d8a90', { edge: 'cut', fibre: false }),
    piece(poly([[x + 128, base - 100], [x + 152, base - 100], [x + 168, base - 16], [x + 148, base - 16]]), '#8d8a90', { edge: 'cut', fibre: false }),
    // body
    piece(ellipse(x + 90, base - 112, 86, 42), '#9c9aa2', { edge: 'torn', rough: 0.7 }),
    piece(ellipse(x + 90, base - 128, 40, 12), RED, flat),
    // neck and head
    piece(poly([[x + 140, base - 130], [x + 176, base - 196], [x + 210, base - 190], [x + 176, base - 100]]), '#9c9aa2', { edge: 'torn', rough: 0.7 }),
    piece(poly([[x + 176, base - 196], [x + 222, base - 190], [x + 244, base - 150], [x + 226, base - 138], [x + 196, base - 160]]), '#9c9aa2', { edge: 'torn', rough: 0.7 }),
    // mane and tail
    piece(curve([[x + 160, base - 196], [x + 150, base - 160], [x + 142, base - 130], [x + 174, base - 150], [x + 184, base - 190]], 2), '#f1e4c4', { edge: 'torn', shadow: false }),
    piece(curve([[x + 6, base - 126], [x - 22, base - 100], [x - 14, base - 66], [x + 6, base - 100]], 2), '#f1e4c4', { edge: 'torn', shadow: false }),
    dot(x + 208, base - 172, 4, C.ink),
    piece(ellipse(x + 190, base - 200, 10, 7, -30), '#9c9aa2', CUT),
    ink([[x + 238, base - 146], [x + 230, base - 140]], { width: 2.4, color: C.ink }),
    // dust on its back
    piece(ellipse(x + 80, base - 150, 60, 5), DUST, { ...flat, opacity: 0.3 }),
  ];
}

/** A wooden ledge: a thick board with a darker front edge, and a bracket below. */
function ledge(x: number, y: number, w: number): Node[] {
  return [
    piece(rect(x, y, w, 20, 2), BOARD, { edge: 'cut' }),
    piece(rect(x, y + 14, w, 8, 1), BOARD_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x + w * 0.45, y + 2, w * 0.28, 3.5), DUST, { ...flat, opacity: 0.4 }),
    piece(poly([[x + 24, y + 22], [x + 24, y + 68], [x + 68, y + 22]]), BOARD_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ];
}

export const toyCupboard = cached(() =>
  svg({ w: W, h: H, name: 'wishing-toy-cupboard', className: 'backdrop' }, [
    // back wall: dim planks
    piece(rect(-20, -20, 1220, 860), WALL, { edge: 'clean', shadow: false }),
    ...Array.from({ length: 14 }, (_, i) => piece(rect(i * 92 - 20, -20, 90, 670), i % 2 ? WALL : WALL_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 })),
    ...Array.from({ length: 14 }, (_, i) => ink([[i * 92 - 20, -20], [i * 92 - 20, 640]], { width: 2.4, color: '#2f2016', opacity: 0.4 })),
    // the golden light from the crack, soft across the wall and floor
    piece(poly([[58, -20], [58, 640], [520, 640], [380, -20]]), '#f6dca0', { edge: 'torn', fibre: false, shadow: false, opacity: 0.16 }),
    piece(poly([[58, -20], [58, 640], [330, 640], [210, -20]]), '#f6dca0', { edge: 'torn', fibre: false, shadow: false, opacity: 0.13 }),

    // the top shelf, with its dusty things
    piece(rect(-20, 252, 780, 20, 2), BOARD, { edge: 'cut' }),
    piece(rect(-20, 266, 780, 8, 1), BOARD_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[120, 274], [120, 330], [176, 274]]), BOARD_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(poly([[640, 274], [640, 330], [696, 274]]), BOARD_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...drum(250, 252),
    ...skittle(430, 252, 74),
    ...skittle(468, 252, 74),
    ...skittle(506, 252, 74),
    ...sleepyDoll(600, 252),

    // the crack of light, bright (behind the horse)
    piece(rect(22, -20, 38, 670), '#fff0c0', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(30, -20, 22, 670), '#fffbe6', { edge: 'clean', fibre: false, shadow: false }),
    // the rocking horse on the floor at the left
    ...rockingHorse(100, 636),

    // the ledges on the right: three steps up. A dark panel behind them.
    piece(rect(870, -20, 330, 700, 2), '#4a3626', { edge: 'cut', shadow: false, opacity: 0.55 }),
    ...ledge(740, 570, 460),
    ...ledge(820, 470, 380),
    ...ledge(890, 360, 310),
    // a ball and some blocks on the low ledge, a spinning top on the middle one
    piece(circle(790, 548, 22), RED, CUT),
    piece(ellipse(790, 548, 22, 7), YELLOW, { ...flat, opacity: 0.8 }),
    piece(rect(1040, 524, 42, 46, 2), BLUE, CUT),
    piece(rect(1084, 534, 36, 36, 2), YELLOW, CUT),
    piece(rect(1054, 484, 34, 40, 2), GREEN, CUT),
    piece(poly([[868, 440], [892, 440], [880, 468]]), YELLOW, CUT),
    piece(rect(864, 428, 32, 14, 3), RED, flat),

    // cobwebs and dust in the corners
    ...cobweb(-10, -10, 1, 1, 190),
    ...cobweb(1190, -10, -1, 1, 170),
    ...cobweb(728, 252, -1, 1, 70),

    // the floor
    piece(rect(-20, 640, 1220, 200), '#4a3424', { edge: 'clean', shadow: false }),
    piece(rect(-20, 636, 1220, 10), '#2f2016', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ink([[i * 170 - 60, 646], [i * 170 - 120, 830]], { width: 2.4, color: '#2b1c12', opacity: 0.4 })),
    // the crack of light, bright, and its pool on the floor
    piece(poly([[46, 644], [86, 644], [420, 800], [-40, 800]]), '#f6dca0', { edge: 'torn', fibre: false, shadow: false, opacity: 0.2 }),
    // a dark vignette at the edges keeps the middle brightest
    piece(rect(1100, -20, 120, 860), '#1c130c', { edge: 'clean', fibre: false, shadow: false, opacity: 0.28 }),
  ]),
);

