/**
 * The manager of Flourish and Blotts, the bookshop in Diagon Alley (book 3;
 * original paper art). A thin, frazzled wizard: a long narrow face, wispy
 * sandy-grey hair sticking straight up, wide worried eyes behind small round
 * spectacles, raised brows, a long nose and a nervous little smile. A neat
 * but rumpled plum waistcoat with gold buttons, a white shirt and a crooked
 * teal bow tie under a tired brown jacket. He wears enormous thick
 * dragon-hide gloves (stitched, with big cuffs) for the Monster Books; on the
 * left of the picture one glove has a worn fingertip with a sticking plaster
 * poking out. Nothing worse than a plaster.
 *
 * Built on person() with the usual parts (figure, head, lids, mouth,
 * mouthOpen) plus `armR`, which swings from the shoulder at (222, 264): lift
 * it for a fluster or to hold the gloves up. The face sits inside
 * 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const SKIN = '#ecc9a6';
const HAIR = '#b7a58a';
const HAIR_DARK = '#8f7e66';
const JACKET = '#6d5d4b';
const PLUM = '#6b3d5c';
const PLUM_DARK = '#522e47';
const BOW = '#3f7f7c';
const GLOVE = '#6a4a2c';
const GLOVE_DARK = '#4a331e';
const GLOVE_LIGHT = '#85603a';

/** A big stitched dragon-hide glove held up, fingers spread, hand centre (x, y). `plaster` shows one worn fingertip with a sticking plaster poking out. */
function glove(x: number, y: number, plaster = false): Node[] {
  return [
    // the flared cuff
    piece(poly([[x - 20, y + 10], [x + 20, y + 10], [x + 30, y + 44], [x - 30, y + 44]]), GLOVE_DARK, { edge: 'cut' }),
    ink([[x - 24, y + 24], [x + 24, y + 24]], { width: 2, color: C.cream }),
    // four fat fingers and a thumb
    ...[-18, -6, 6, 18].map((d, i) => piece(ellipse(x + d * 1.1, y - 26 - (i === 1 || i === 2 ? 6 : 0), 8.5, 20, d * 0.5), GLOVE_LIGHT, { edge: 'cut' })),
    piece(ellipse(x - 30, y - 2, 8, 16, -50), GLOVE_LIGHT, { edge: 'cut' }),
    // the puffy palm
    piece(curve([[x - 26, y - 14], [x - 26, y + 12], [x, y + 18], [x + 26, y + 12], [x + 26, y - 14], [x, y - 20]], 2), GLOVE, { edge: 'cut' }),
    // seams between the fingers and stitches on the cuff
    ...[-12, 0, 12].map((d) => ink([[x + d * 1.1, y - 22], [x + d, y - 4]], { width: 2, color: GLOVE_DARK })),
    ...[0, 1, 2, 3].map((i) => dot(x - 18 + i * 12, y + 34, 1.8, C.cream)),
    ...(plaster
      ? [
          // a worn fingertip poking out, wrapped in a sticking plaster
          piece(ellipse(x - 19.8, y - 52, 6.5, 7), SKIN, { edge: 'cut', fibre: false, shadow: false }),
          piece(poly([[x - 27, y - 50], [x - 13, y - 50], [x - 13, y - 42], [x - 27, y - 42]]), '#eab6a0', { edge: 'clean', shadow: false }),
          ink([[x - 26, y - 46], [x - 14, y - 46]], { width: 1.4, color: '#c98c70' }),
        ]
      : []),
  ];
}

function body(): Node[] {
  return [
    // narrow shoulders in a tired jacket
    piece(curve([[62, 345], [70, 272], [112, 238], [150, 232], [188, 238], [230, 272], [238, 345]], 2), JACKET),
    // shirt and plum waistcoat
    piece(poly([[120, 236], [150, 232], [180, 236], [184, 345], [116, 345]]), C.white, { fibre: false }),
    piece(poly([[118, 240], [144, 262], [144, 345], [110, 345]]), PLUM, { edge: 'cut', fibre: false }),
    piece(poly([[182, 240], [156, 262], [156, 345], [190, 345]]), PLUM, { edge: 'cut', fibre: false }),
    // rumples
    ink([[122, 286], [134, 292], [128, 304]], { width: 2.4, color: PLUM_DARK }),
    ink([[178, 300], [168, 308], [176, 320]], { width: 2.4, color: PLUM_DARK }),
    ...[272, 298, 324].map((y) => dot(150, y, 3.4, C.gold)),
    // jacket lapels
    piece(poly([[112, 234], [126, 236], [146, 266], [130, 270]]), '#5c4e3e', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[188, 234], [174, 236], [154, 266], [170, 270]]), '#5c4e3e', { edge: 'cut', fibre: false, shadow: false }),
    // a crooked teal bow tie
    piece(poly([[148, 244], [120, 232], [122, 256]]), BOW, { edge: 'cut', fibre: false }),
    piece(poly([[152, 244], [182, 238], [180, 260]]), BOW, { edge: 'cut', fibre: false }),
    piece(circle(150, 245, 6), '#2f6361', { edge: 'clean', shadow: false }),
    // the other hand (left of the picture): a huge glove with a plaster finger poking out
    ...glove(58, 282, true),
  ];
}

const armR: Node = group({ part: 'armR', origin: [222, 264] }, [
  piece(band([[222, 266], [240, 290], [248, 318]], 38), JACKET),
  ...glove(250, 278),
]);

function circlePts(x: number, y: number, r: number): Pt[] {
  return Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r] as Pt;
  });
}

export function bookManager(): string {
  return person({
    name: 'bookManager',
    label: 'The shop manager',
    skin: SKIN,
    eyes: C.brownDark,
    eyeStyle: 'wide',
    mouth: 'smile',
    brows: 'raised',
    browColor: HAIR_DARK,
    face: [50, 72],
    nose: 'long',
    blush: false,
    body: body(),
    back: [
      // wispy hair sticking straight up
      ...[-34, -20, -8, 6, 20, 34].map((x, i) => ink([[cx + x, cy - 56], [cx + x * 1.2 + (i % 2 ? 4 : -4), cy - 90 - (i % 3) * 8]], { width: 4, color: HAIR })),
      piece(ellipse(cx, cy - 36, 50, 38), HAIR),
    ],
    front: [
      // small round spectacles on a thin wire
      ink(circlePts(cx - 26, cy + 2, 14), { width: 2.6, color: C.greyDark, closed: true }),
      ink(circlePts(cx + 26, cy + 2, 14), { width: 2.6, color: C.greyDark, closed: true }),
      ink([[cx - 12, cy], [cx + 12, cy]], { width: 2.6, color: C.greyDark }),
      ink([[cx - 40, cy], [cx - 50, cy - 4]], { width: 2.4, color: C.greyDark }),
      ink([[cx + 40, cy], [cx + 50, cy - 4]], { width: 2.4, color: C.greyDark }),
      // a combed fringe and a few loose wisps
      piece(curve([[cx - 50, cy - 24], [cx - 36, cy - 54], [cx - 8, cy - 58], [cx + 20, cy - 56], [cx + 44, cy - 50], [cx + 50, cy - 24], [cx + 28, cy - 40], [cx - 6, cy - 44], [cx - 34, cy - 38]], 2), HAIR),
      ink([[cx - 10, cy - 52], [cx - 18, cy - 70]], { width: 3, color: HAIR_DARK }),
      ink([[cx + 16, cy - 52], [cx + 26, cy - 72]], { width: 3, color: HAIR_DARK }),
      // a sweat drop: he is a bit jumpy
      piece(poly([[cx + 58, cy - 38], [cx + 52, cy - 24], [cx + 64, cy - 24]]), C.sky, { edge: 'clean', shadow: false, opacity: 0.85 }),
      piece(circle(cx + 58, cy - 22, 6.4), C.sky, { edge: 'clean', shadow: false, opacity: 0.85 }),
    ],
    extra: [armR],
  });
}
