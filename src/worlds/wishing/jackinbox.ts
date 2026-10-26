/**
 * Jack-in-the-Box: a clown-faced toy on a big curly spring, coming out of a
 * red box with yellow stars. A pointed jester's hat with three bells, a white
 * face with a red nose and round rosy cheeks, a ruff collar. He cannot walk:
 * he lives in his box, and goes where he is carried.
 *
 * The plain portrait is Jack cross: a frown, slanted brows, the spring
 * coiled low, fists on the rim of the box.
 *
 * Poses (same face place, so the caption chip still frames it):
 *   boing  sprung up on a long, stretched spring, arms flung out and up,
 *          mouth wide open, bells flying. Stretch the actor taller from its
 *          bottom edge in the script for the full BOING.
 *   sulk   squashed half-way down into his box, arms folded on the rim, a
 *          small sad frown (the head sits lower: the face is under the chip).
 *   grin   the spring springy, arms up in delight, a big red smile.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR,
 * hat (the three bells jangle if it rocks), spring (scale it up and down
 * about its foot for the boing).
 *
 * Also here: `jackBox`, the same box with its lid shut and a little crank
 * on the side, for before he springs out.
 */
import { C } from '../../art/palette';
import { cached, circle, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cheeks, eyes, brows, FLAT, mouthShape, portrait, star, talkShape } from '../faraway/parts';

type Mood = 'cross' | 'boing' | 'sulk' | 'grin';

const FACE = '#f8f1e4';
const FACE_SHADE = '#e4d8c2';
const BOX = C.toyRed;
const BOX_DARK = '#9c2f28';
const TRIM = C.toyYellow;
const STEEL = '#8d98a8';
const STEEL_DARK = '#5d6878';
const STEEL_LIGHT = '#c3ccd8';
const RUFF = '#f6f3ec';
const RUFF_SHADE = '#c9d4e6';
const BELL = C.brass;
const NOSE = '#d6372f';
const CHEEK = '#e8756a';

/** Stars printed on the front of the box. */
function boxStars(top: number, bottom: number): Node[] {
  const mid = (top + bottom) / 2;
  const spots: [number, number, number, number][] = [
    [74, mid + 6, 13, -8],
    [150, mid + 14, 10, 10],
    [226, mid + 6, 13, 6],
  ];
  return spots.filter(([, y]) => y < bottom - 8).map(([x, y, r, rot]) => piece(star(x, y, r, rot), TRIM, FLAT));
}

/** The box's front, with a yellow band along the rim, from y `top` down past the bottom of the portrait. */
function boxFront(top: number): Node[] {
  return [
    piece(rect(36, top, 228, 360 - top, 3), BOX, { edge: 'cut' }),
    piece(rect(32, top - 2, 236, 16, 3), TRIM, { edge: 'cut', fibre: false }),
    ...[56, 96, 136, 176, 216, 244].map((x) => dot(x, top + 6, 3, BOX_DARK, 0.7)),
    ...boxStars(top + 16, 340),
  ];
}

/** The coiled spring from the foot at (150, bottom) up to (150, top): a line of fat steel loops. */
function spring(top: number, bottom: number, coils: number): Node {
  const step = (bottom - top) / coils;
  const back: Node[] = [];
  const front: Node[] = [];
  for (let i = 0; i < coils; i++) {
    const y = top + i * step + step * 0.35;
    back.push(ink([[116, y], [130, y - 7], [150, y - 9], [170, y - 7], [184, y]], { width: 6, color: STEEL_DARK, wobble: 0.2 }));
    front.push(ink([[116, y], [130, y + 8], [150, y + 11], [170, y + 8], [184, y]], { width: 10, color: STEEL, wobble: 0.2 }));
    front.push(ink([[124, y + 3], [140, y + 8], [156, y + 9]], { width: 3, color: STEEL_LIGHT, wobble: 0.1, opacity: 0.8 }));
  }
  return group({ part: 'spring', origin: [150, bottom] }, [...back, ...front]);
}

/** A scalloped white ruff round the neck, centred at (150, y). */
function ruff(y: number): Node[] {
  const out: Node[] = [piece(ellipse(150, y, 68, 15), RUFF_SHADE, { edge: 'cut', fibre: false })];
  for (let i = 0; i < 9; i++) {
    const t = (i - 4) / 4;
    out.push(piece(circle(150 + t * 62, y + 4 + t * t * 3, 15), RUFF, { edge: 'cut', fibre: false }));
  }
  out.push(piece(ellipse(150, y - 4, 56, 10), RUFF, FLAT));
  return out;
}

/** A jester's bell: a brass ball with a little slot, at (x, y). */
function bell(x: number, y: number): Node[] {
  return [
    piece(circle(x, y, 9.5), BELL, CUT),
    ink([[x - 6, y + 1], [x + 6, y + 1]], { width: 1.6, color: C.brassDark }),
    dot(x - 3, y - 3, 2.2, C.goldLight, 0.9),
  ];
}

/** The three-horned jester's hat, its band on the top of the head at y `base` (the face top is about base + 10). */
function hat(base: number): Node[] {
  return [
    // left horn (red), curling out and down
    piece(poly([[102, base + 6], [92, base - 34], [66, base - 62], [32, base - 52], [30, base - 40], [58, base - 38], [76, base - 14], [84, base + 6]]), C.toyRed, CUT),
    ...bell(30, base - 46),
    // right horn (red)
    piece(poly([[198, base + 6], [208, base - 34], [234, base - 62], [268, base - 52], [270, base - 40], [242, base - 38], [224, base - 14], [216, base + 6]]), C.toyRed, CUT),
    ...bell(270, base - 46),
    // the tall middle horn (yellow)
    piece(poly([[122, base + 6], [136, base - 40], [152, base - 56], [166, base - 40], [178, base + 6]]), TRIM, CUT),
    ...bell(152, base - 60),
    // the band
    piece(rect(94, base - 2, 112, 20, 4), C.toyBlue, { edge: 'cut', fibre: false }),
    ...[110, 132, 154, 176, 192].map((x) => dot(x, base + 8, 3.4, C.white, 0.9)),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const sulk = mood === 'sulk';
  const boing = mood === 'boing';
  const grin = mood === 'grin';
  /** How far the head sits lower than the plain portrait. */
  const dy = sulk ? 30 : 0;
  const hx = 150;
  const hy = 136 + dy;
  const boxTop = sulk ? 236 : boing ? 318 : grin ? 296 : 290;

  const o = {
    skin: FACE,
    at: [hx, hy] as Pt,
    eyes: boing ? ('big' as const) : sulk ? ('round' as const) : grin ? ('happy' as const) : ('round' as const),
    eyeCol: C.toyBlue,
    eyeDx: 24,
    eyeY: -8,
    brows: boing ? ('cross' as const) : mood === 'cross' ? ('cross' as const) : sulk ? ('worried' as const) : ('raised' as const),
    browCol: C.ink,
    browY: -22,
    cheeks: false,
  };

  // The mouth: painted red, thick. Each mood has its own, and a talking twin.
  const my = hy + 36;
  const mouthNodes: Node[] = boing
    ? mouthShape('o', hx, my - 6, 1.7)
    : sulk
      ? [ink([[hx - 14, my + 8], [hx, my + 1], [hx + 14, my + 8]], { width: 4, color: NOSE })]
      : grin
        ? mouthShape('beam', hx, my - 2, 1.15)
        : [ink([[hx - 24, my + 12], [hx - 10, my + 1], [hx + 10, my + 1], [hx + 24, my + 12]], { width: 8, color: NOSE, wobble: 0.3 })];
  const talkScale = boing ? 1.7 : sulk ? 0.9 : 1.25;
  const features: Node[] = [
    // round rosy cheeks, painted on
    piece(circle(hx - 38, hy + 20, 11), CHEEK, { ...FLAT, opacity: 0.85 }),
    piece(circle(hx + 38, hy + 20, 11), CHEEK, { ...FLAT, opacity: 0.85 }),
    ...cheeks({ ...o, cheeks: false }),
    ...eyes(o),
    ...brows(o),
    // the red clown nose
    piece(circle(hx, hy + 12, 11), NOSE, CUT),
    dot(hx - 4, hy + 8, 3, C.white, 0.7),
    group({ part: 'mouth', origin: [hx, my] }, mouthNodes),
    group({ part: 'mouthOpen', origin: [hx, my], opacity: 0 }, talkShape(hx, my - 2, talkScale)),
  ];

  // --- the arms: yellow sleeves with red cuffs and white mitts.
  const sleeve = (part: 'armL' | 'armR', from: Pt, via: Pt, to: Pt): Node => arm(part, { from, via, to, sleeve: TRIM, cuff: C.toyRed, hand: C.white, width: 26 });
  const arms: Node[] = sulk
    ? [sleeve('armL', [100, 262], [128, 282], [182, 280]), sleeve('armR', [200, 262], [170, 288], [118, 288])]
    : boing
      ? [sleeve('armL', [100, 236], [52, 214], [26, 150]), sleeve('armR', [200, 236], [248, 214], [274, 150])]
      : grin
        ? [sleeve('armL', [100, 236], [62, 218], [44, 168]), sleeve('armR', [200, 236], [238, 218], [256, 168])]
        : [sleeve('armL', [100, 238], [64, 262], [76, 292]), sleeve('armR', [200, 238], [236, 262], [224, 292])];

  // --- the open lid of the box, leaning back behind him
  const lid: Node[] = [
    piece(poly([[40, boxTop - 2], [18, boxTop - 62], [92, boxTop - 74], [118, boxTop - 4]]), TRIM, { edge: 'cut' }),
    piece(poly([[48, boxTop - 8], [30, boxTop - 54], [84, boxTop - 62], [104, boxTop - 10]]), C.toyRed, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
  ];

  const coils = boing ? 7 : grin ? 4 : 4;
  const springTop = 212 + dy;

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 340] }, [
      ...lid,
      // the dark opening of the box
      piece(ellipse(150, boxTop + 2, 104, 12), '#3c2a24', { edge: 'cut', fibre: false, shadow: false }),
      ...(sulk ? [] : [spring(springTop, boxTop, coils)]),
      ...boxFront(boxTop),
      group({ part: 'head', origin: [hx, hy + 70] }, [
        ...ruff(hy + 70),
        piece(ellipse(hx, hy, 56, 62), FACE),
        piece(ellipse(hx, hy + 44, 40, 14), FACE_SHADE, { ...FLAT, opacity: 0.45 }),
        ...features,
        group({ part: 'hat', origin: [hx, hy - 52] }, hat(hy - 52)),
      ]),
      ...arms,
    ]),
  ]);
}

/** Jack-in-the-Box, cross: a frown, slanted brows, the spring coiled low. */
export const jackInBox = cached((): string => draw('cross', 'wishing-jack-in-box', 'Jack-in-the-Box'));

/** Sprung up tall, arms flung out, mouth wide: BOING! */
export const jackInBoxBoing = cached((): string => draw('boing', 'wishing-jack-in-box-boing', 'Jack-in-the-Box sprung up'));

/** Squashed half into his box, arms folded, a small sad frown. */
export const jackInBoxSulk = cached((): string => draw('sulk', 'wishing-jack-in-box-sulk', 'Jack-in-the-Box sulking'));

/** Delighted: a big red smile, arms up. */
export const jackInBoxGrin = cached((): string => draw('grin', 'wishing-jack-in-box-grin', 'Jack-in-the-Box grinning'));

/** Jack's box with its lid shut and a crank on the side, a little dusty. 250 × 170. */
export const jackBox = cached(() =>
  svg({ w: 250, h: 170, name: 'wishing-jack-box', label: 'A toy box with a crank' }, [
    piece(ellipse(110, 160, 104, 9), 'rgba(40,25,10,0.18)', FLAT),
    piece(rect(10, 56, 200, 104, 3), BOX, { edge: 'cut' }),
    piece(rect(4, 28, 212, 36, 4), TRIM, { edge: 'cut' }),
    piece(rect(10, 40, 200, 10, 2), BOX, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    ...[[50, 112, 15, -8], [110, 124, 11, 8], [168, 110, 15, 6]].map(([x, y, r, rot]) => piece(star(x, y, r, rot), TRIM, FLAT)),
    // the crank
    ink([[210, 108], [234, 108], [234, 128]], { width: 7, color: STEEL_DARK }),
    piece(circle(234, 134, 9), C.toyBlue, CUT),
    // dust on the lid
    piece(ellipse(80, 34, 44, 5), C.cloudShade, { ...FLAT, opacity: 0.55 }),
    ink([[20, 34], [200, 34]], { width: 2, color: C.brassDark, opacity: 0.5 }),
  ]),
);
