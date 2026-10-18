/**
 * The Lady in Pink, the lady in the portrait who guards the door to
 * Gryffindor Tower (book 3; original paper art). A plump, cheerful, grand
 * old-fashioned lady: curled grey-brown hair piled high with a pink rose
 * pinned in it, rosy cheeks, pearl earrings and a pearl necklace, and a big
 * pink silk dress with puffed sleeves and a lace collar. She adores singing.
 *
 * Built on person() with the usual parts (figure, head, lids, mouth,
 * mouthOpen) plus `armR`, which swings from the shoulder at (240, 262): lift
 * it to wave her pink lace fan (the hand and the fan go with it). The pearls
 * and the hair sit in the same places on every frame. Her face sits inside
 * 78 62 144 144; the hair pile reaches up to y 18.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const PINK = '#e59bb0';
const PINK_DARK = '#c97690';
const PINK_LIGHT = '#f4bfcd';
const LACE = '#f8efe6';
const HAIR = '#8e7765';
const HAIR_DARK = '#6d5848';
const HAIR_LIGHT = '#aa9380';
const SKIN = '#f1c4a0';
const PEARL = '#fbf5ec';

const pearl = (x: number, y: number, r = 4.6): Node[] => [
  piece(circle(x, y, r), PEARL, { edge: 'clean', fibre: false, shadow: true }),
  dot(x - r * 0.3, y - r * 0.3, r * 0.3, C.white),
];

/** The big pink silk dress: wide shoulders, a scooped lace collar, puffed sleeves. */
function dress(): Node[] {
  return [
    // the wide bodice
    piece(curve([[14, 345], [22, 268], [80, 232], [150, 226], [220, 232], [278, 268], [286, 345]], 2), PINK),
    // folds of silk
    ...[70, 110, 190, 230].map((x) => ink([[x, 290], [x + (x < 150 ? -6 : 6), 340]], { width: 3, color: PINK_DARK, opacity: 0.7 })),
    ink([[150, 276], [150, 340]], { width: 3, color: PINK_DARK, opacity: 0.6 }),
    // a deep lace collar scooped under the chin
    piece(curve([[96, 232], [116, 224], [150, 252], [184, 224], [204, 232], [190, 262], [150, 280], [110, 262]], 2), LACE, { edge: 'cut' }),
    ...[-1, 1].flatMap((s) => [0, 1, 2, 3].map((i) => ink([[150 + s * (20 + i * 20), 238 + i * 6 - (i === 0 ? 0 : 0)], [150 + s * (14 + i * 18), 266 - i * 2]], { width: 1.6, color: '#d9c8b8' }))),
    // a pink bow at the waist
    piece(poly([[132, 316], [150, 324], [132, 338]]), PINK_DARK, { edge: 'cut', fibre: false }),
    piece(poly([[168, 316], [150, 324], [168, 338]]), PINK_DARK, { edge: 'cut', fibre: false }),
    piece(circle(150, 326, 7), PINK_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    // the puffed left sleeve (the right one is the arm)
    piece(ellipse(54, 274, 46, 40, 14), PINK),
    ...[-14, 4, 22].map((d) => ink([[30 + d, 246 + d * 0.3], [26 + d, 300 + d * 0.2]], { width: 2.4, color: PINK_DARK, opacity: 0.7 })),
    piece(curve([[30, 306], [80, 310], [72, 330], [40, 328]], 2), LACE, { edge: 'cut', fibre: false }),
  ];
}

/** Hair piled high in curls, behind and above the head. */
function hairBack(): Node[] {
  return [
    // side curls hanging past the ears
    ...[-1, 1].flatMap((s) => [
      piece(circle(cx + s * 66, cy + 24, 17), HAIR),
      piece(circle(cx + s * 70, cy + 48, 12), HAIR),
    ]),
    // the high pile: layers of fat curls
    piece(ellipse(cx, cy - 36, 74, 56), HAIR),
    piece(ellipse(cx - 30, cy - 76, 34, 26), HAIR),
    piece(ellipse(cx + 30, cy - 78, 34, 26), HAIR),
    piece(ellipse(cx, cy - 98, 30, 22), HAIR_LIGHT),
    ...[[-46, -62], [0, -84], [46, -62], [-20, -104], [22, -106]].map(([x, y]) =>
      ink([[cx + x - 12, cy + y + 6], [cx + x, cy + y - 6], [cx + x + 12, cy + y + 4]], { width: 2.6, color: HAIR_DARK })),
  ];
}

/** Curled fringe over the forehead, a pink rose, and pearl earrings. */
function hairFront(): Node[] {
  return [
    // a wavy parting of curls over the forehead
    piece(curve([[cx - 62, cy - 4], [cx - 62, cy - 44], [cx - 24, cy - 62], [cx + 26, cy - 62], [cx + 62, cy - 44], [cx + 62, cy - 4], [cx + 50, cy - 24], [cx + 28, cy - 36], [cx + 8, cy - 44], [cx - 12, cy - 38], [cx - 36, cy - 32], [cx - 50, cy - 20]], 2), HAIR),
    ...[-40, -16, 10, 36].map((x) => ink([[cx + x - 8, cy - 40], [cx + x, cy - 50], [cx + x + 8, cy - 42]], { width: 2.4, color: HAIR_LIGHT })),
    // a pink rose pinned among the curls
    piece(circle(cx + 48, cy - 70, 17), PINK_DARK),
    piece(circle(cx + 48, cy - 70, 11), PINK),
    piece(circle(cx + 48, cy - 70, 5), PINK_LIGHT, { edge: 'clean', fibre: false, shadow: false }),
    piece(ellipse(cx + 66, cy - 58, 10, 5, 30), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(cx + 32, cy - 56, 10, 5, -30), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    // pearl earrings
    ...pearl(cx - 62, cy + 32, 5),
    ...pearl(cx + 62, cy + 32, 5),
  ];
}

/** The pearls: a double string draped across the collar, below the chin. */
function necklace(): Node[] {
  const row = (y: number, depth: number, n: number): Node[] =>
    Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const x = 104 + t * 92;
      return pearl(x, y + Math.sin(t * Math.PI) * depth, 4.4);
    }).flat();
  return [...row(226, 14, 9), ...row(232, 22, 8)];
}

/** A pink lace fan, opened. Its pivot is the hand at (x, y). */
function fan(x: number, y: number, r = 62): Node[] {
  const out: Node[] = [];
  const a0 = -148;
  const a1 = -32;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pts = (rr: number, from: number, to: number, n = 8) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = rad(from + ((to - from) * i) / n);
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as [number, number];
    });
  out.push(piece([[x, y] as [number, number], ...pts(r, a0, a1)], LACE, { edge: 'cut' }));
  // pink panels and ribs
  for (let i = 0; i < 6; i++) {
    const from = a0 + ((a1 - a0) * i) / 6;
    const to = a0 + ((a1 - a0) * (i + 1)) / 6;
    if (i % 2 === 0) out.push(piece([[x, y] as [number, number], ...pts(r - 6, from, to, 3)], PINK_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.85 }));
  }
  for (let i = 0; i <= 6; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / 6);
    out.push(ink([[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], { width: 1.8, color: PINK_DARK }));
  }
  out.push(ink(pts(r - 2, a0, a1), { width: 2.4, color: PINK_DARK }));
  return out;
}

/** The right arm from the shoulder at (240, 262): a puffed pink sleeve, a lace cuff, a hand with a fan. */
const arm: Node = group({ part: 'armR', origin: [240, 262] }, [
  ...fan(254, 224, 52),
  piece(curve([[252, 296], [262, 262], [270, 244], [270, 230], [258, 224], [248, 246], [238, 280]], 2), PINK),
  piece(ellipse(256, 270, 36, 36, -10), PINK),
  ...[-12, 4, 18].map((d) => ink([[236 + d, 248 + d * 0.4], [240 + d, 296]], { width: 2.4, color: PINK_DARK, opacity: 0.7 })),
  piece(curve([[256, 238], [274, 240], [276, 254], [260, 254]], 2), LACE, { edge: 'cut', fibre: false }),
  piece(circle(262, 226, 13), SKIN, { edge: 'cut' }),
  ...[-6, 0, 6].map((d) => ink([[256 + d, 222], [258 + d, 234]], { width: 1.6, color: C.skinShade })),
]);

export function pinkLady(): string {
  return person({
    name: 'pink-lady',
    label: 'The Lady in Pink',
    skin: SKIN,
    eyes: '#5a7a96',
    eyeStyle: 'round',
    mouth: 'smile',
    brows: 'kind',
    browColor: HAIR_DARK,
    face: [64, 66],
    nose: 'button',
    blush: true,
    body: dress(),
    back: hairBack(),
    front: hairFront(),
    extra: [...necklace(), arm],
  });
}
