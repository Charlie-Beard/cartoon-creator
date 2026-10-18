/**
 * The Monster Book of Monsters (book 3; original paper art): a big shaggy
 * book standing up on two stubby furry legs, seen from the front a little
 * turned, so its fat spine shows down the left and its cream page-edges down
 * the right. The cover is green-brown fur with ragged tufts, two big googly
 * eyes with wobbly pupils and cross, bushy brows. Across the middle the cover
 * splits into a wide mouth: shut it is a cheeky grin of little paper-white
 * teeth, open it shows rows of teeth and the pages curling inside. Snappy and
 * grumpy like a puppy, never gory.
 *
 * Parts: figure (everything), cover (the furry front with the face, origin at
 * the spine (82, 180): tilt it a few degrees to flap like a jaw), lids
 * (hidden, for blinks), mouth and mouthOpen (the grin; hidden, wide open),
 * spine (the fat spine down the left, origin at its centre (62, 180): this is
 * where you stroke it).
 *
 * Layout in the 300 x 340 box: the cover is x 82 to 252, y 44 to 316; the
 * spine x 44 to 82; the page-edges x 252 to 274; eyes at (130, 112) and
 * (200, 108); the mouth runs x 100 to 230 around y 204 (open, down to y 256);
 * the feet sit on the ground at y 336. The face is inside the chip
 * '50 52 200 200'.
 *
 * The pose `purring` (monsterBookPurring, same box) is the book lying open
 * and calm: the fur flat and smooth, the open pages fanned in front, eyes
 * shut in happy curves and a small smile. It keeps the parts figure, lids,
 * mouth and mouthOpen (hidden, unused) in the same places.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rng, svg, type Node, type Pt } from '../../../art/paper';
import { H, W } from './people';

const FUR = '#6e7a3f';
const FUR_DARK = '#4f5a2d';
const FUR_LIGHT = '#8a9650';
const FUR_BROWN = '#7d6a3c';
const SPINE = '#5a4a2b';
const SPINE_BAND = '#c19a4a';
const PAGE = '#f1e7c9';
const PAGE_LINE = '#cdbf98';
const TOOTH = '#fffaf0';
const MOUTH_DARK = '#3a1d1b';
const BROW = '#3d4622';

/** A pointed tuft of fur standing out from an edge point (x, y) in direction (dx, dy). */
function tuft(x: number, y: number, dx: number, dy: number, len: number, color: string): Node {
  const nx = -dy;
  const ny = dx;
  const w = len * 0.42;
  return piece(
    [[x + nx * w, y + ny * w], [x + dx * len, y + dy * len], [x - nx * w, y - ny * w]] as Pt[],
    color,
    { edge: 'cut', fibre: false, shadow: false },
  );
}

/** Short fur strokes scattered over a rectangle, in two shades. */
function furStrokes(x0: number, y0: number, x1: number, y1: number, n: number, seed: number): Node[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + r() * (x1 - x0);
    const y = y0 + r() * (y1 - y0);
    const l = 8 + r() * 8;
    const lean = (r() - 0.5) * 10;
    return ink([[x, y], [x + lean * 0.5, y + l * 0.5], [x + lean, y + l]], { width: 2.4, color: i % 3 === 0 ? FUR_LIGHT : FUR_DARK, wobble: 0.4 });
  });
}

/** The y of the smile curve at x, for the shut mouth. */
const smileY = (x: number): number => {
  const t = (x - 165) / 65;
  return 204 + 15 * (1 - t * t);
};

/** Rows of small teeth hanging from (dir 1) or standing on (dir -1) a curve. */
function teethAlong(y: (x: number) => number, xs: number[], len: number, w: number, dir: 1 | -1): Node[] {
  return xs.map((x) => piece(poly([[x - w, y(x) - dir * 1], [x + w, y(x) - dir * 1], [x, y(x) + dir * len]]), TOOTH, { edge: 'clean', shadow: false }));
}

function legs(): Node[] {
  return [-1, 1].flatMap((s) => {
    const x = 165 + s * 58;
    return [
      piece(curve([[x - 22, 306], [x - 24, 326], [x - 14, 336], [x + 14, 336], [x + 24, 326], [x + 22, 306]], 2), FUR_BROWN),
      // three little claw nubs
      ...[-10, 0, 10].map((d) => piece(poly([[x + d - 3.5, 334], [x + d + 3.5, 334], [x + d, 341]]), PAGE, { edge: 'clean', fibre: false, shadow: false })),
      ...furStrokes(x - 18, 312, x + 14, 328, 4, 77 + s),
    ];
  });
}

/** The fat spine down the left: dark leathery fur with raised gold bands. */
function spine(): Node {
  return group({ part: 'spine', origin: [62, 180] }, [
    piece(poly([[44, 54], [82, 44], [82, 316], [44, 308]]), SPINE, { edge: 'cut' }),
    ...[88, 150, 212, 274].map((y, i) => piece(poly([[45, y + i * -0.4 + 2], [82, y - 6], [82, y + 6], [45, y + 14]]), SPINE_BAND, { edge: 'cut', fibre: false, shadow: false })),
    ...furStrokes(48, 60, 78, 304, 14, 31),
    // fur poking out along the far edge
    ...[70, 118, 168, 222, 270].map((y, i) => tuft(45, y, -1, (i % 2 ? 0.3 : -0.3), 14, FUR_DARK)),
  ]);
}

/** The page-edges down the right, so the book looks turned. */
function pageEdges(): Node[] {
  return [
    piece(poly([[248, 46], [274, 58], [274, 304], [248, 316]]), PAGE, { edge: 'cut' }),
    ...Array.from({ length: 12 }, (_, i) => ink([[252, 70 + i * 20], [272, 78 + i * 20]], { width: 1.6, color: PAGE_LINE, wobble: 0.3 })),
  ];
}

function eyeWhite(x: number, y: number, px: number, py: number): Node[] {
  return [
    piece(circle(x, y, 28), C.white, { edge: 'cut', fibre: false }),
    piece(circle(x + px, y + py, 14), C.ink, { edge: 'clean', shadow: false }),
    dot(x + px - 4, y + py - 5, 4.5, C.white),
  ];
}

export function monsterBook(): string {
  const eyes: Node[] = [...eyeWhite(130, 112, 5, 7), ...eyeWhite(200, 108, -5, 8)];
  return svg({ w: W, h: H, name: 'hogwarts-monsterBook', label: 'The Monster Book of Monsters', className: 'portrait' }, [
    piece(ellipse(160, 337, 118, 10), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      ...legs(),
      ...pageEdges(),
      spine(),
      group({ part: 'cover', origin: [82, 180] }, [
        // ragged tufts round the edge of the cover, behind it
        ...[56, 92, 130, 170, 214, 258, 296].map((y, i) => tuft(84, y, -0.7, i % 2 ? 0.5 : -0.5, 16, FUR_DARK)),
        ...[100, 132, 164, 198, 232].map((x, i) => tuft(x, 46, i % 2 ? 0.4 : -0.4, -0.9, 16, FUR_DARK)),
        ...[104, 140, 176, 212, 242].map((x, i) => tuft(x, 314, i % 2 ? 0.4 : -0.4, 0.9, 14, FUR_DARK)),
        ...[70, 112, 160, 208, 262, 300].map((y, i) => tuft(251, y, 0.9, i % 2 ? 0.4 : -0.4, 16, FUR_DARK)),
        // the shaggy cover
        piece(curve([[82, 48], [166, 40], [250, 50], [254, 180], [250, 312], [166, 320], [82, 312], [78, 180]], 1), FUR),
        piece(ellipse(166, 300, 80, 14), FUR_BROWN, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
        piece(ellipse(166, 64, 76, 12), FUR_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
        ...furStrokes(90, 56, 244, 304, 70, 5),
        // cross, bushy brows
        piece(poly([[100, 80], [136, 76], [158, 92], [140, 90], [104, 90]]), BROW, { edge: 'cut', fibre: false, shadow: false }),
        piece(poly([[232, 76], [196, 70], [176, 88], [194, 86], [228, 88]]), BROW, { edge: 'cut', fibre: false, shadow: false }),
        // two big googly eyes
        ...eyes,
        group({ part: 'lids', opacity: 0 }, [[130, 112], [200, 108]].flatMap(([x, y]) => [
          piece(circle(x, y, 29.5), FUR, { edge: 'cut', fibre: false, shadow: false }),
          ink([[x - 20, y + 2], [x, y + 11], [x + 20, y + 2]], { width: 3.5, color: C.ink }),
        ])),
        // a small furry snout bump with two nostrils
        piece(ellipse(166, 158, 20, 13), FUR_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(158, 158, 3.4, 4.6), C.ink, { edge: 'clean', shadow: false }),
        piece(ellipse(174, 158, 3.4, 4.6), C.ink, { edge: 'clean', shadow: false }),
        // the mouth, shut: a cheeky grin with teeth meeting
        group({ part: 'mouth' }, [
          ink(Array.from({ length: 14 }, (_, i) => [100 + i * 10, smileY(100 + i * 10)] as Pt), { width: 9, color: MOUTH_DARK }),
          ...teethAlong(smileY, [112, 134, 156, 178, 200, 222], 9, 6, 1),
          ...teethAlong((x) => smileY(x) + 2, [123, 145, 167, 189, 211], 8, 6, -1),
        ]),
        // the mouth, wide open: rows of teeth and the pages curling inside
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(
            [
              ...Array.from({ length: 14 }, (_, i) => {
                const x = 98 + i * 10.2;
                const t = (x - 165) / 67;
                return [x, 205 - 7 * Math.sqrt(Math.max(0, 1 - t * t))] as Pt;
              }),
              ...Array.from({ length: 14 }, (_, i) => {
                const x = 231 - i * 10.2;
                const t = (x - 165) / 67;
                return [x, 205 + 52 * Math.sqrt(Math.max(0, 1 - t * t))] as Pt;
              }),
            ],
            MOUTH_DARK,
            { edge: 'cut', fibre: false, shadow: false },
          ),
          // pages curling up from the bottom of the mouth
          piece(curve([[116, 238], [140, 226], [166, 232], [192, 224], [216, 238], [196, 252], [166, 258], [136, 252]], 2), PAGE, { edge: 'cut', fibre: false, shadow: false }),
          ink([[128, 240], [150, 234], [172, 240]], { width: 2, color: PAGE_LINE }),
          ink([[160, 246], [184, 238], [204, 244]], { width: 2, color: PAGE_LINE }),
          ...teethAlong((x) => 200 - 6 * Math.sqrt(Math.max(0, 1 - ((x - 165) / 67) ** 2)) + 2, [112, 130, 148, 166, 184, 202, 220], 15, 7, 1),
          ...teethAlong((x) => 205 + 52 * Math.sqrt(Math.max(0, 1 - ((x - 165) / 67) ** 2)) - 2, [124, 144, 166, 188, 208], 12, 6.5, -1),
        ]),
      ]),
    ]),
  ]);
}

/** Lying open, calm and smooth, purring like a stroked cat. */
export function monsterBookPurring(): string {
  const eyeCurve = (x: number, y: number) => ink([[x - 18, y + 4], [x, y - 10], [x + 18, y + 4]], { width: 5, color: C.ink });
  return svg({ w: W, h: H, name: 'hogwarts-monsterBook-purring', label: 'The Monster Book of Monsters, purring', className: 'portrait' }, [
    piece(ellipse(150, 322, 140, 12), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      // the upright, smooth furry cover at the back, with the face
      piece(curve([[62, 250], [58, 120], [78, 62], [150, 50], [222, 62], [242, 120], [238, 250]], 2), FUR),
      piece(ellipse(150, 70, 70, 12), FUR_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
      // smooth, long, tidy strokes of fur: flat, not shaggy
      ...Array.from({ length: 9 }, (_, i) => ink([[84 + i * 17, 74], [86 + i * 17, 130], [84 + i * 17, 190]], { width: 2.2, color: i % 2 ? FUR_LIGHT : FUR_DARK, opacity: 0.55, wobble: 0.5 })),
      // soft round cheeks and a happy shut-eyed face
      piece(ellipse(104, 150, 17, 11), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
      piece(ellipse(196, 150, 17, 11), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
      eyeCurve(122, 112),
      eyeCurve(178, 112),
      piece(ellipse(150, 138, 15, 10), FUR_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(150, 134, 5, 3.4), C.ink, { edge: 'clean', shadow: false }),
      // the lids are already shut; kept (hidden) so blinking does nothing odd
      group({ part: 'lids', opacity: 0 }, []),
      group({ part: 'mouth' }, [ink([[132, 154], [150, 166], [168, 154]], { width: 4, color: MOUTH_DARK })]),
      group({ part: 'mouthOpen', opacity: 0 }, [
        piece(curve([[134, 152], [150, 150], [166, 152], [160, 172], [150, 176], [140, 172]], 2), MOUTH_DARK, { edge: 'cut', fibre: false, shadow: false }),
      ]),
      // the open pages in front: two fanned spreads meeting in a gutter
      piece(curve([[150, 292], [150, 214], [112, 196], [52, 204], [20, 228], [26, 290], [86, 306]], 1), PAGE_LINE, { edge: 'cut', fibre: false }),
      piece(curve([[150, 292], [150, 214], [188, 196], [248, 204], [280, 228], [274, 290], [214, 306]], 1), PAGE_LINE, { edge: 'cut', fibre: false }),
      piece(curve([[150, 284], [150, 208], [114, 190], [56, 196], [26, 220], [32, 280], [90, 296]], 1), PAGE),
      piece(curve([[150, 284], [150, 208], [186, 190], [244, 196], [274, 220], [268, 280], [210, 296]], 1), PAGE),
      // lines of squiggles (no lettering) and a soft gutter shadow
      ...[-1, 1].flatMap((s) => [0, 1, 2, 3, 4].map((i) => ink([[150 + s * 24, 224 + i * 14 - i * 1], [150 + s * 62, 214 + i * 14], [150 + s * 100, 220 + i * 14]], { width: 2, color: PAGE_LINE, wobble: 1.2 }))),
      ink([[150, 212], [150, 288]], { width: 5, color: PAGE_LINE, opacity: 0.8 }),
      // a few tufts of fur on the cover's top edge, lying down
      ...[96, 126, 174, 204].map((x, i) => tuft(x, 54 + (i % 2) * 4, i < 2 ? -0.5 : 0.5, -0.8, 12, FUR_DARK)),
    ]),
  ]);
}
