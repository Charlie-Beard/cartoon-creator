/**
 * Witch Hazel: a young, kind, scatterbrained witch. Never warty, never scary.
 *
 * A tall, floppy black hat whose tip flops over, with a purple band and a
 * little gold moon; wild red curly hair springing out from under the brim;
 * freckles; a green dress with a round collar; a purple cloak patched with
 * squares of other colours; stripy stockings (seen when she sits on her
 * broom). She is quick, warm and a bit flustered.
 *
 * Poses (the portrait itself is her cheerful, ready-to-talk self, a broom
 * held upright at her side):
 *   worried  both hands up to her cheeks, brows up and together, an "oh!" mouth.
 *   flying   sat sideways on her broomstick, left hand on the handle, right
 *            hand up holding a star-tipped wand (armR waves it).
 *   flyingCat  the same, with Midnight sat on the broom in front of her, purring
 *   happy    hugging a little black cat to her chest, eyes shut in a big smile.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hat
 * (pivots at the crown: wobble it). In `worried` and `happy` the arms are
 * drawn crossed or raised, so lifting one still reads as a gesture.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, fluff, person, torso, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'plain' | 'worried' | 'flying' | 'flyingCat' | 'happy';

const SKIN = '#f6d3b4';
const HAIR = '#cf5a2c';
const HAIR_LIGHT = '#e8803c';
const HAIR_DARK = '#9a3a1c';
const HAT = '#34303f';
const HAT_LIGHT = '#4a4560';
const BAND = '#8a58b8';
const CLOAK = '#7a56a4';
const CLOAK_DARK = '#5a3d82';
const DRESS = '#4f9a5a';
const STRIPE_A = '#d9473f';
const STRIPE_B = '#f1e4c4';
const BROOM_STICK = '#a06d43';
const BROOM_STRAW = '#d8b050';
const BROOM_STRAW_DARK = '#a8802a';

/** A little crescent moon, as two paper circles (the second takes a bite). */
function moon(x: number, y: number, r: number, bite: string): Node[] {
  return [piece(circle(x, y, r), C.goldLight, FLAT), piece(circle(x + r * 0.45, y - r * 0.2, r * 0.82), bite, FLAT)];
}

/** Wild curly hair: round fluffy bunches either side of the face, a few spirals. */
function hairBack(): Node[] {
  return [
    fluff([[84, 70], [64, 104], [52, 150], [58, 200], [86, 226], [100, 170]], HAIR_DARK, 14),
    fluff([[216, 70], [236, 104], [248, 150], [242, 200], [214, 226], [200, 170]], HAIR_DARK, 14),
    fluff([[92, 74], [76, 108], [66, 150], [74, 196], [94, 214], [104, 160]], HAIR, 14),
    fluff([[208, 74], [224, 108], [234, 150], [226, 196], [206, 214], [196, 160]], HAIR, 14),
    piece(ellipse(cx, cy - 20, 62, 54), HAIR),
    // a few curls sticking out at odd angles
    fluff([[40, 122], [30, 142], [46, 158], [58, 140]], HAIR_LIGHT, 8),
    fluff([[260, 118], [272, 140], [256, 158], [244, 138]], HAIR_LIGHT, 8),
    fluff([[58, 206], [48, 228], [68, 240], [80, 220]], HAIR_LIGHT, 8),
    fluff([[242, 204], [254, 226], [234, 240], [222, 220]], HAIR_LIGHT, 8),
    ink([[56, 150], [48, 170], [60, 188]], { width: 2.4, color: HAIR_DARK, opacity: 0.7 }),
    ink([[244, 150], [252, 170], [240, 188]], { width: 2.4, color: HAIR_DARK, opacity: 0.7 }),
  ];
}

/** Curly ringlets in front of the brim, over the forehead. */
function fringe(): Node[] {
  return [
    fluff([[96, 96], [108, 80], [128, 84], [124, 108], [106, 116]], HAIR, 7),
    fluff([[126, 90], [146, 80], [168, 86], [160, 108], [138, 110]], HAIR_LIGHT, 7),
    fluff([[170, 90], [190, 80], [206, 96], [198, 116], [176, 108]], HAIR, 7),
  ];
}

/** The tall floppy black hat, its tip flopping over to the right. */
function hat(): Node[] {
  return [
    piece(curve([[102, 86], [112, 56], [128, 30], [152, 14], [180, 10], [208, 18], [230, 38], [236, 60], [220, 48], [200, 40], [184, 48], [182, 64], [200, 88]], 2), HAT),
    piece(curve([[134, 66], [142, 40], [158, 22], [170, 34], [160, 62]], 1), HAT_LIGHT, { ...FLAT, opacity: 0.5 }),
    piece(ellipse(cx, 88, 86, 14), HAT, { edge: 'cut' }),
    piece(ellipse(cx, 86, 86, 12), HAT_LIGHT, { ...FLAT, opacity: 0.35 }),
    piece(band([[104, 76], [150, 84], [198, 76]], 15), BAND, CUT),
    ...moon(150, 80, 8, BAND),
    dot(176, 78, 2.2, C.goldLight),
  ];
}

/** A star-tipped wand, from the hand at (x, y) up and to the right. */
function wand(x: number, y: number): Node[] {
  const tx = x + 26;
  const ty = y - 58;
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? 6 : 14;
    pts.push([tx + Math.cos(a) * rr, ty + Math.sin(a) * rr]);
  }
  return [ink([[x, y], [tx, ty + 8]], { width: 5, color: C.brownDark }), piece(pts, C.starGold, { edge: 'cut', fibre: false })];
}

/** A little black cat clutched to her chest (the `happy` pose): head, ears, eyes shut, collar and bell. */
function hugCat(): Node[] {
  const FUR = '#2c2a38';
  return [
    // body and a tail curling out behind her arm
    piece(curve([[142, 310], [146, 262], [182, 244], [226, 262], [236, 310], [230, 345], [150, 345]], 2), FUR, { rough: 1.3 }),
    ink([[232, 318], [262, 300], [270, 268], [256, 254]], { width: 9, color: FUR, wobble: 0.4 }),
    // head, two pointed ears with pink insides
    piece(poly([[158, 256], [160, 214], [184, 238]]), FUR, CUT),
    piece(poly([[212, 256], [208, 214], [186, 238]]), FUR, CUT),
    piece(poly([[164, 248], [165, 226], [178, 240]]), C.pink, { ...FLAT, opacity: 0.8 }),
    piece(poly([[206, 248], [205, 226], [192, 240]]), C.pink, { ...FLAT, opacity: 0.8 }),
    piece(ellipse(186, 262, 38, 32), FUR, { rough: 1.2 }),
    // happy shut eyes, pink nose, a silver bell on a red collar
    ink([[166, 260], [172, 254], [178, 260]], { width: 3, color: '#a5e66a' }),
    ink([[194, 260], [200, 254], [206, 260]], { width: 3, color: '#a5e66a' }),
    piece(poly([[181, 270], [191, 270], [186, 277]]), C.pink, FLAT),
    ink([[160, 290], [186, 298], [212, 290]], { width: 6, color: C.coatRed }),
    piece(circle(186, 302, 6), '#d6dce4', CUT),
  ];
}

/** Midnight sat on the broom handle, looking out, his head at (x, y): ears, bright eyes, bell. */
function sitCat(x: number, y: number): Node[] {
  const FUR = '#2c2a38';
  return [
    piece(curve([[x - 36, y + 62], [x - 34, y + 22], [x, y + 8], [x + 34, y + 22], [x + 36, y + 62]], 2), FUR, { rough: 1.3 }),
    ink([[x + 34, y + 54], [x + 62, y + 44], [x + 66, y + 14]], { width: 8, color: FUR, wobble: 0.4 }),
    piece(poly([[x - 28, y - 4], [x - 26, y - 40], [x - 6, y - 16]]), FUR, CUT),
    piece(poly([[x + 28, y - 4], [x + 26, y - 40], [x + 6, y - 16]]), FUR, CUT),
    piece(poly([[x - 24, y - 12], [x - 23, y - 30], [x - 11, y - 16]]), C.pink, { ...FLAT, opacity: 0.8 }),
    piece(poly([[x + 24, y - 12], [x + 23, y - 30], [x + 11, y - 16]]), C.pink, { ...FLAT, opacity: 0.8 }),
    piece(ellipse(x, y + 4, 36, 30), FUR, { rough: 1.2 }),
    // eyes shut in a purr
    ink([[x - 22, y + 2], [x - 15, y - 4], [x - 8, y + 2]], { width: 3, color: '#a5e66a' }),
    ink([[x + 8, y + 2], [x + 15, y - 4], [x + 22, y + 2]], { width: 3, color: '#a5e66a' }),
    piece(poly([[x - 5, y + 12], [x + 5, y + 12], [x, y + 18]]), C.pink, FLAT),
    ink([[x - 24, y + 28], [x, y + 36], [x + 24, y + 28]], { width: 5, color: C.coatRed }),
    piece(circle(x, y + 38, 5), '#d6dce4', CUT),
  ];
}

/** A broomstick lying across the picture from (x0, y0) (bristles) to (x1, y1) (the handle tip). */
function broom(x0: number, y0: number, x1: number, y1: number): Node[] {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const hx = x0 + ux * 66;
  const hy = y0 + uy * 66;
  const straw = (spread: number): Pt => [hx + ux * -70 + nx * spread, hy + uy * -70 + ny * spread];
  return [
    ink([[hx, hy], [x1, y1]], { width: 9, color: BROOM_STICK, wobble: 0.3 }),
    piece(poly([[hx + nx * 8, hy + ny * 8], straw(30), straw(10), straw(-10), straw(-30), [hx - nx * 8, hy - ny * 8]]), BROOM_STRAW, { rough: 1.3 }),
    ...[-20, -6, 8, 22].map((s) => ink([[hx + nx * s * 0.3, hy + ny * s * 0.3], straw(s * 1.3)], { width: 2, color: BROOM_STRAW_DARK, opacity: 0.8, wobble: 0.3 })),
    piece(band([[hx - ux * 6 + nx * 0, hy - uy * 6], [hx + ux * 12, hy + uy * 12]], 22), C.brownDark, CUT),
  ];
}

/** A couple of cloak patches: squares with stitches. */
function patch(x: number, y: number, w: number, h: number, fill: string, rot = 0): Node[] {
  const pts: Pt[] = [
    [x, y],
    [x + w, y + rot],
    [x + w - rot, y + h],
    [x + rot, y + h + rot],
  ];
  return [piece(pts, fill, { edge: 'cut', fibre: false, shadow: false }), ink([[x + 3, y + 3], [x + w - 3, y + 3 + rot]], { width: 1.6, color: C.cream, opacity: 0.8 })];
}

function draw(mood: Mood, name: string, label: string): string {
  const worried = mood === 'worried';
  const flying = mood === 'flying' || mood === 'flyingCat';
  const happy = mood === 'happy';

  const eyes: EyeStyle = happy ? 'happy' : 'big';
  const brows: BrowStyle = worried ? 'worried' : 'raised';
  const mouthStyle: MouthStyle = worried ? 'o' : happy ? 'beam' : 'smile';

  // --- the body: a patched purple cloak over a green dress
  const body: Node[] = [
    torso(CLOAK, 6, 228),
    // the dress showing in a V between the cloak fronts, and a round white collar
    piece(poly([[112, 230], [150, 270], [188, 230], [196, 345], [104, 345]]), DRESS, { fibre: false }),
    piece(poly([[124, 232], [150, 262], [176, 232], [170, 226], [150, 244], [130, 226]]), C.cream, FLAT),
    piece(circle(150, 266, 5), C.gold, FLAT),
    // cloak fronts with a darker lining at the edge
    piece(curve([[34, 345], [42, 272], [96, 236], [124, 232], [132, 345]], 2), CLOAK),
    piece(curve([[266, 345], [258, 272], [204, 236], [176, 232], [168, 345]], 2), CLOAK),
    ink([[124, 234], [132, 345]], { width: 3, color: CLOAK_DARK, opacity: 0.8 }),
    ink([[176, 234], [168, 345]], { width: 3, color: CLOAK_DARK, opacity: 0.8 }),
    ...patch(56, 288, 34, 30, '#e0b24a', 3),
    ...patch(212, 276, 30, 34, '#4f9a5a', -3),
    ...patch(94, 310, 22, 20, '#d9473f', 2),
    // a star clasp at the throat
    piece(circle(150, 238, 7), C.gold, CUT),
  ];

  // --- the broom behind her in the portrait, sat upon in `flying`
  const back: Node[] = !flying && !worried && !happy ? broom(262, 342, 262, 6) : [];

  // --- arms
  let arms: Node[];
  let extra: Node[] = [];
  if (worried) {
    // both hands up to her cheeks
    arms = [
      arm('armL', { from: [66, 268], via: [34, 236], to: [96, 182], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [266, 236], to: [204, 182], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
    ];
  } else if (happy) {
    // hugging the cat: both arms cross in front of it
    arms = [
      arm('armL', { from: [66, 268], via: [78, 318], to: [168, 306], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [250, 318], to: [196, 316], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
    ];
    extra = [];
  } else if (flying) {
    // left hand forward on the broom handle, right hand up with the wand
    arms = [
      arm('armL', { from: [66, 268], via: [44, 296], to: [34, 316], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [262, 250], to: [262, 214], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28, holding: wand(262, 214) }),
    ];
  } else {
    arms = [
      arm('armL', { from: [66, 268], via: [48, 302], to: [52, 336], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [252, 304], to: [262, 330], sleeve: CLOAK, cuff: CLOAK_DARK, hand: SKIN, width: 28 }),
    ];
  }

  if (flying) {
    // the broom is across her lap, bristles trailing at the right; stripy legs dangle below it
    const legs: Node[] = [
      piece(band([[118, 318], [112, 345]], 22), STRIPE_A, CUT),
      piece(band([[176, 318], [184, 345]], 22), STRIPE_A, CUT),
      ...[326, 336].flatMap((y) => [
        ink([[106, y], [128, y]], { width: 5, color: STRIPE_B }),
        ink([[166, y], [188, y]], { width: 5, color: STRIPE_B }),
      ]),
    ];
    return person({
      name,
      label,
      skin: SKIN,
      face: [56, 62],
      eyes,
      eyeCol: '#5b8a3c',
      eyeDx: 24,
      eyeY: 2,
      brows,
      browCol: HAIR_DARK,
      browY: -22,
      nose: 'button',
      mouth: mouthStyle,
      mouthY: 40,
      cheeks: C.rose,
      freckles: true,
      back: [],
      behindHead: hairBack(),
      body: [...legs, ...body, ...broomLap(), ...(mood === 'flyingCat' ? sitCat(66, 238) : [])],
      front: fringe(),
      hat: hat(),
      arms,
    });
  }

  return person({
    name,
    label,
    skin: SKIN,
    face: [56, 62],
    eyes,
    eyeCol: '#5b8a3c',
    eyeDx: 24,
    eyeY: 2,
    brows,
    browCol: HAIR_DARK,
    browY: -22,
    nose: 'button',
    mouth: mouthStyle,
    mouthY: 40,
    cheeks: C.rose,
    freckles: true,
    back,
    behindHead: hairBack(),
    body,
    front: fringe(),
    hat: hat(),
    arms,
    extra: happy ? hugCat() : extra,
  });
}

/** The broom lying across her lap in `flying`: a thick handle, bristles trailing off to the right. */
function broomLap(): Node[] {
  return [
    piece(band([[8, 318], [200, 304]], 12), BROOM_STICK, CUT),
    piece(poly([[198, 296], [292, 276], [298, 306], [292, 336], [198, 318]]), BROOM_STRAW, { rough: 1.3 }),
    ...[282, 296, 310, 324].map((y, i) => ink([[212, 306], [294, y - 4 + (i - 1.5) * 2]], { width: 2, color: BROOM_STRAW_DARK, opacity: 0.8, wobble: 0.3 })),
    piece(band([[196, 298], [210, 316]], 20), C.brownDark, CUT),
  ];
}

/** Witch Hazel, ready to talk: a cheerful smile, her broom upright beside her. */
export const hazel = cached((): string => draw('plain', 'wishing-hazel', 'Witch Hazel'));

/** Worried: both hands to her cheeks, brows up, an "oh!" mouth. */
export const hazelWorried = cached((): string => draw('worried', 'wishing-hazel-worried', 'Witch Hazel, worried'));

/** Sat on her broomstick, a star-tipped wand in her right hand. */
export const hazelFlying = cached((): string => draw('flying', 'wishing-hazel-flying', 'Witch Hazel on her broom'));

/** Happy, hugging her black cat to her chest. */
export const hazelHappy = cached((): string => draw('happy', 'wishing-hazel-happy', 'Witch Hazel hugging Midnight'));

/** Sat on her broomstick with Midnight purring on the handle in front of her. */
export const hazelFlyingCat = cached((): string => draw('flyingCat', 'wishing-hazel-flying-cat', 'Witch Hazel flying with Midnight'));
