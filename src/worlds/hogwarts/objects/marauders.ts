/**
 * Props for "The Secret Way to Honeydukes" (book 3; original paper art).
 *
 * maraudersMap: the Marauder's Map unfolded, 380 × 260, old yellowed
 * parchment with fold lines. Part `ink` is a group holding the little drawn
 * plan of the castle (corridors, towers, a staircase, a dotted path ending at
 * a tiny witch-statue mark, a few pairs of footprints and a title of wavy
 * scribbles, not readable). It is drawn visible; a script fades it in from 0.
 * Part `feet` is one pair of tiny footprints on its own, parked at the start
 * of the dotted path (about 92, 196 in the box), for a script to walk along it.
 *
 * oneEyedWitch: the statue of the hunched one-eyed witch, 220 × 340, grey
 * stone on a plinth, base flat on the floor at y 340. Kindly-silly, not
 * scary. Part `hump` is her round back-hump as a lid, origin at its lower
 * edge (156, 168); rotate it to swing open. A dark round hole sits behind it.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const INK = '#4a3320';

/** One pair of tiny footprints at (x, y), pointing up the page. */
function footprints(x: number, y: number, s = 1): Node[] {
  return [-1, 1].flatMap((d) => {
    const fx = x + d * 5 * s;
    const fy = y + (d > 0 ? -4 : 4) * s;
    return [
      piece(ellipse(fx, fy, 2.6 * s, 4 * s), INK, { edge: 'clean', shadow: false }),
      piece(ellipse(fx, fy - 6.4 * s, 1.8 * s, 2.2 * s), INK, { edge: 'clean', shadow: false }),
    ];
  });
}

/** A wavy line of ink scribbles: reads as writing but is not. */
function scribbles(x0: number, x1: number, y: number, amp: number): Node[] {
  const out: Node[] = [];
  const n = Math.round((x1 - x0) / 16);
  for (let i = 0; i < n; i++) {
    const a = x0 + (i * (x1 - x0)) / n;
    const b = a + ((x1 - x0) / n) * 0.8;
    out.push(ink([[a, y + amp], [(a + b) / 2, y - amp * (i % 2 ? 0.4 : 1)], [b, y + amp * 0.3]], { width: 2.4, color: INK, wobble: 1 }));
  }
  return out;
}

export function maraudersMapArt(): string {
  const dots: Pt[] = [[92, 198], [108, 192], [124, 194], [140, 202], [156, 208], [172, 206], [188, 198], [204, 194], [220, 196], [234, 200]];
  return svg({ w: 380, h: 260, name: 'hogwarts-marauders-map' }, [
    // the parchment, with a darker rim and fold lines
    piece(rect(10, 10, 360, 240, 6), '#d9bd82', { rough: 1.1 }),
    piece(rect(18, 18, 344, 224, 4), '#e8d4a0', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(190, 130, 130, 80), '#efdcaa', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ink([[190, 12], [190, 248]], { width: 2, color: '#a88a52', opacity: 0.55 }),
    ink([[12, 130], [368, 130]], { width: 2, color: '#a88a52', opacity: 0.55 }),
    ink([[100, 12], [100, 248]], { width: 1.5, color: '#b89a60', opacity: 0.35 }),
    ink([[280, 12], [280, 248]], { width: 1.5, color: '#b89a60', opacity: 0.35 }),
    group({ part: 'ink' }, [
      // title
      ...scribbles(78, 302, 44, 7),
      ...scribbles(116, 264, 64, 5),
      // the castle: main block, towers, a keep
      piece(rect(210, 96, 120, 70, 2), '#d0b57a', { edge: 'clean', shadow: false, opacity: 0.6 }),
      ink([[210, 96], [330, 96], [330, 166], [210, 166]], { width: 2.6, color: INK, closed: true }),
      ink([[210, 124], [330, 124]], { width: 2, color: INK }),
      ...[[222, 84], [270, 78], [318, 84]].flatMap(([x, y]) => [
        ink([[x - 9, y + 12], [x - 9, y - 8], [x, y - 20], [x + 9, y - 8], [x + 9, y + 12]], { width: 2.4, color: INK }),
      ]),
      // corridors
      ink([[210, 142], [180, 142], [180, 176], [120, 176]], { width: 2.2, color: INK }),
      ink([[330, 142], [350, 142], [350, 224], [262, 224]], { width: 2.2, color: INK }),
      ink([[270, 166], [270, 200]], { width: 2.2, color: INK }),
      ink([[60, 100], [150, 100], [150, 150]], { width: 2.2, color: INK }),
      // a spiral staircase: a coil of little steps
      ...[0, 1, 2, 3, 4].map((i) => ink([[96 - 14 + i * 3, 122 + i * 8], [96 + 14 - i * 3, 118 + i * 8]], { width: 2, color: INK })),
      ink(Array.from({ length: 16 }, (_, i) => [96 + Math.cos(i * 0.5) * 18, 138 + i * 2 - 10] as Pt), { width: 1.6, color: INK }),
      // the dotted path to the witch
      ...dots.map(([x, y]) => dot(x, y, 2.3, INK)),
      // the witch statue mark: a tiny hunched figure with a hat
      piece(poly([[258, 192], [250, 212], [270, 212], [266, 198]]), INK, { edge: 'clean', shadow: false }),
      piece(poly([[254, 192], [262, 178], [270, 192]]), INK, { edge: 'clean', shadow: false }),
      ink([[244, 214], [276, 214]], { width: 2.4, color: INK }),
      // footprints about the place
      ...footprints(44, 170, 1.1),
      ...footprints(310, 214, 1.1),
      ...footprints(150, 232, 1),
      ...footprints(335, 60, 1),
      // a compass-ish flourish
      ink([[50, 70], [50, 40]], { width: 2.4, color: INK }),
      ink([[40, 52], [50, 40], [60, 52]], { width: 2.4, color: INK }),
    ]),
    // the walking footprints, parked at the start of the path
    group({ part: 'feet', origin: [92, 198] }, footprints(92, 198, 1.3)),
  ]);
}

const STONE = '#8c8f98';
const STONE_DARK = '#6c6f7a';
const STONE_LIGHT = '#a9acb4';

export function oneEyedWitchArt(): string {
  return svg({ w: 220, h: 340, name: 'hogwarts-one-eyed-witch' }, [
    // plinth
    piece(rect(26, 276, 168, 64, 4), STONE_DARK, { edge: 'cut' }),
    piece(rect(18, 262, 184, 22, 4), STONE, { edge: 'cut', fibre: false }),
    ink([[40, 306], [180, 306]], { width: 2, color: '#575a66', opacity: 0.6 }),
    // robe: a hunched, lumpy bell
    piece(curve([[56, 266], [60, 200], [78, 150], [122, 138], [160, 170], [168, 230], [170, 266]], 2), STONE),
    piece(curve([[64, 266], [70, 214], [86, 172], [110, 160], [100, 210], [104, 266]], 2), STONE_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 }),
    ink([[116, 190], [122, 266]], { width: 2.4, color: STONE_DARK }),
    ink([[140, 206], [146, 264]], { width: 2.4, color: STONE_DARK }),
    // a bony arm holding a walking stick
    piece(poly([[64, 190], [48, 232], [60, 240], [78, 206]]), STONE_DARK, { edge: 'cut', fibre: false }),
    piece(rect(40, 210, 8, 60, 3), '#5a5560', { edge: 'cut', fibre: false }),
    piece(circle(44, 208, 9), STONE_LIGHT, { edge: 'cut', fibre: false }),
    // hole in her back, with the hump on top (drawn after, so it hides the hole)
    piece(ellipse(156, 150, 22, 20), '#1c1822', { edge: 'clean', shadow: false }),
    group({ part: 'hump', origin: [156, 168] }, [
      piece(circle(156, 138, 34), STONE, { edge: 'cut' }),
      piece(ellipse(146, 126, 16, 12, -30), STONE_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 }),
      ink([[134, 156], [180, 156]], { width: 2, color: STONE_DARK, opacity: 0.7 }),
    ]),
    // head: big nose and chin, tipped forward
    piece(ellipse(98, 112, 32, 36), STONE, { edge: 'cut' }),
    piece(poly([[74, 118], [52, 140], [78, 140]]), STONE, { edge: 'cut', fibre: false }),
    piece(ellipse(94, 148, 18, 12), STONE, { edge: 'cut', fibre: false }),
    // the one big eye, and the closed one under a patch
    piece(circle(84, 104, 13), C.white, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(82, 106, 7), C.ink, { edge: 'clean', shadow: false }),
    dot(79, 103, 2.4, C.white),
    ink([[70, 90], [84, 86], [98, 92]], { width: 3.5, color: STONE_DARK }),
    piece(ellipse(114, 104, 11, 10), '#4a4650', { edge: 'cut', fibre: false, shadow: false }),
    ink([[104, 94], [124, 112]], { width: 2, color: '#4a4650' }),
    // little smile
    ink([[82, 134], [92, 140], [106, 134]], { width: 2.6, color: STONE_DARK }),
    // crooked pointy hat
    piece(ellipse(98, 82, 50, 10, -8), STONE_DARK, { edge: 'cut' }),
    piece(poly([[64, 80], [76, 30], [112, 8], [124, 14], [96, 40], [128, 82]]), STONE, { edge: 'cut' }),
    piece(poly([[68, 70], [128, 76], [126, 84], [66, 80]]), STONE_DARK, { edge: 'cut', fibre: false, shadow: false }),
  ]);
}
