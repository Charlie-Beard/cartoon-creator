/** From Wizard Words, b4c3 (underwater). */
import { band, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const STONE = { light: '#97a29a', mid: '#7d8a83', dark: '#606d68', moss: '#5f7d55' };

/** A ring of a bubble (an outline with a shine). */
function bubble(x: number, y: number, r: number): Node[] {
  return [
    ink(Array.from({ length: 17 }, (_, i) => [x + Math.cos((i / 16) * Math.PI * 2) * r, y + Math.sin((i / 16) * Math.PI * 2) * r] as Pt), { width: 2.5, color: '#d8ece4', opacity: 0.6 }),
    dot(x - r * 0.35, y - r * 0.35, Math.max(1.5, r * 0.22), '#eef7f0', 0.7),
  ];
}

const WATER = { top: '#6fa49a', a: '#5e968f', b: '#4e8584', c: '#41767a', far: '#386a70', deep: '#2f5d64' };

/** A wavy-topped layer that runs off the bottom of the stage. */
function layer(y: number, amp: number, color: string, seed: number, step = 90): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, 900]];
  for (let x = -40; x <= 1220; x += step) pts.push([x, y - r() * amp]);
  pts.push([1220, 900]);
  return piece(curve(pts, 2), color, { rough: 1.3 });
}

/** A tall wavy strand of lake weed. */
function strand(x: number, base: number, height: number, lean: number, w: number, color: string): Node {
  const pts: Pt[] = [];
  for (let i = 0; i <= 5; i++) pts.push([x + Math.sin(i * 1.3) * 14 + (lean * i) / 5, base - (height * i) / 5]);
  return piece(band(pts, w), color, { rough: 1.1 });
}

const WEED_DARK = '#2c4a3a';

const WEED = '#3f6b4c';

/** The stone merperson statue your friend is tied to. */
function statue(): Node[] {
  return [
    // rock it stands on
    piece(curve([[840, 720], [850, 580], [910, 540], [1090, 536], [1150, 590], [1160, 720]], 2), STONE.dark),
    piece(ellipse(930, 600, 46, 18), STONE.moss, { fibre: false, opacity: 0.8 }),
    piece(ellipse(1100, 580, 34, 12), STONE.moss, { fibre: false, opacity: 0.8 }),
    // the tail curling down into the rock, with a fin
    piece(band([[985, 545], [1000, 470], [975, 410], [990, 350]], 64), STONE.mid),
    piece(poly([[1005, 520], [1070, 488], [1052, 530], [1078, 566], [1010, 552]]), STONE.mid),
    // a trident
    piece(band([[1092, 110], [1092, 540]], 12), STONE.dark),
    piece(poly([[1066, 150], [1070, 96], [1080, 140], [1092, 80], [1104, 140], [1114, 96], [1118, 150]]), STONE.dark, { edge: 'cut' }),
    // body, arm and head
    piece(curve([[925, 390], [935, 280], [985, 250], [1040, 280], [1052, 390]], 2), STONE.light),
    piece(band([[1035, 290], [1070, 320], [1088, 300]], 22), STONE.light),
    piece(ellipse(990, 196, 44, 50), STONE.light),
    piece(curve([[946, 190], [952, 150], [990, 136], [1030, 150], [1036, 190], [1010, 170], [970, 170]], 2), STONE.mid),
    ink([[968, 200], [976, 196], [984, 200]], { width: 3, color: STONE.dark }),
    ink([[996, 200], [1004, 196], [1012, 200]], { width: 3, color: STONE.dark }),
    ink([[978, 222], [990, 226], [1002, 222]], { width: 3, color: STONE.dark }),
    piece(ellipse(960, 300, 14, 8), STONE.moss, { fibre: false, opacity: 0.7 }),
  ];
}

/** Under the Black Lake: green-blue water, sunbeams, weed, mer-houses and the statue. */
export function underwater(): string {
  const r = rng(77);
  const shafts: Node[] = [180, 470, 760, 1010].map((x, i) =>
    piece(poly([[x - 30, -20], [x + 40, -20], [x + 150 + i * 10, 620], [x - 40, 620]]), '#e9f4dc', { edge: 'cut', fibre: false, shadow: false, opacity: 0.1 }),
  );
  const hut = (x: number, y: number, s: number): Node[] => [
    piece(curve([[x - 50 * s, y], [x - 44 * s, y - 50 * s], [x, y - 70 * s], [x + 44 * s, y - 50 * s], [x + 50 * s, y]], 2), '#3b6e74'),
    piece(ellipse(x, y - 14 * s, 13 * s, 18 * s), '#24474e', { edge: 'cut', fibre: false, shadow: false }),
  ];
  const pebbles: Node[] = Array.from({ length: 12 }, () => {
    const x = 60 + r() * 1060;
    return piece(ellipse(x, 640 + r() * 40, 14 + r() * 16, 7 + r() * 6), r() > 0.5 ? STONE.dark : '#56625c', { fibre: false });
  });
  const bubbles: Node[] = [];
  for (let i = 0; i < 14; i++) bubbles.push(...bubble(40 + r() * 1100, 30 + r() * 480, 4 + r() * 8));
  return svg({ w: 1180, h: 820, name: 'b4c3-lake', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), WATER.top, { edge: 'clean', shadow: false }),
    layer(150, 30, WATER.a, 3, 120),
    layer(300, 34, WATER.b, 5, 120),
    layer(430, 30, WATER.c, 7, 120),
    // the surface far above, rippling
    piece(curve([[-40, -40], [1220, -40], [1220, 26], [900, 40], [600, 22], [300, 42], [-40, 24]], 2), '#a6cfc2', { fibre: false, opacity: 0.55 }),
    ...shafts,
    // far rocks and the merpeople's round stone houses
    layer(500, 40, WATER.far, 11, 100),
    ...hut(620, 520, 1),
    ...hut(740, 510, 0.75),
    ...hut(190, 520, 0.8),
    layer(560, 26, WATER.deep, 13, 110),
    // weed along the edges
    strand(20, 700, 520, 30, 26, WEED_DARK),
    strand(70, 700, 420, -20, 22, WEED),
    strand(1150, 700, 560, -30, 26, WEED_DARK),
    strand(800, 640, 220, 20, 18, WEED_DARK),
    strand(560, 640, 180, -16, 16, WEED_DARK),
    ...statue(),
    // the muddy lake bed
    layer(620, 22, '#55704f', 17, 100),
    ...pebbles,
    layer(668, 14, '#465f45', 19, 120),
    ...bubbles,
  ]);
}
