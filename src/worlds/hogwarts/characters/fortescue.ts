/**
 * Florean Fortescue, the jolly owner of the ice-cream parlour in Diagon
 * Alley (book 3; original paper art). Round and twinkly: a broad rosy face
 * with crinkly smiling eyes, a big curly brown moustache with curled-up
 * ends, curls of brown hair over the ears, a folded white paper hat set a
 * little crooked, and a pink-and-white striped apron over a white shirt with
 * pink cuffs. In his right hand (on the right of the picture) he holds an
 * ice-cream scoop with a ball of pink ice cream on it.
 *
 * Built on person() with the usual parts (figure, head, lids, mouth,
 * mouthOpen) plus `armR`, which swings from the shoulder at (232, 262): lift
 * it to offer the scoop. The face sits inside 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const SKIN = '#f0be94';
const HAIR = '#6a4428';
const HAIR_LIGHT = '#85582f';
const APRON_PINK = '#e58aa0';
const SHIRT = '#cfdcea';
const STRIPE_WHITE = C.white;
const SCOOP = '#a9adb3';
const SCOOP_DARK = '#7d8189';
const ICE = '#f4a8b8';
const ICE_DARK = '#dd8499';

/** Half-width of the apron bib at height y. */
const hw = (y: number): number => 44 + (y - 238) * 0.46;

function body(): Node[] {
  const stripes: Node[] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const u0 = -1 + (2 * i) / n;
    const u1 = -1 + (2 * (i + 1)) / n;
    stripes.push(
      piece(poly([[150 + u0 * hw(238), 238], [150 + u1 * hw(238), 238], [150 + u1 * hw(345), 345], [150 + u0 * hw(345), 345]]), i % 2 ? STRIPE_WHITE : APRON_PINK, { edge: 'cut', fibre: false, shadow: i === 0 }),
    );
  }
  return [
    // a round white shirt
    piece(curve([[14, 345], [28, 266], [90, 232], [150, 226], [210, 232], [272, 266], [286, 345]], 2), SHIRT),
    ink([[48, 292], [60, 270]], { width: 3, color: C.skinPale }),
    ink([[252, 292], [240, 270]], { width: 3, color: C.skinPale }),
    // the striped apron, with straps over the shoulders
    ...stripes,
    piece(poly([[108, 240], [120, 228], [134, 238], [122, 252]]), APRON_PINK, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[192, 240], [180, 228], [166, 238], [178, 252]]), APRON_PINK, { edge: 'cut', fibre: false, shadow: false }),
    // a little pocket with a spoon
    piece(poly([[160, 300], [196, 300], [194, 326], [162, 326]]), APRON_PINK, { edge: 'cut', fibre: false }),
    ink([[176, 296], [180, 280]], { width: 3.4, color: SCOOP }),
    dot(180, 279, 4, SCOOP),
  ];
}

const armR: Node = group({ part: 'armR', origin: [232, 262] }, [
  // a puffed white sleeve with a pink cuff
  piece(band([[230, 266], [254, 296], [262, 308]], 44), SHIRT),
  piece(band([[256, 298], [262, 308]], 48), APRON_PINK, { edge: 'cut', fibre: false }),
  // the scoop: a wooden handle, a steel bowl and a ball of pink ice cream
  piece(band([[268, 318], [272, 262]], 9), C.brownDark, { edge: 'cut' }),
  piece(curve([[254, 250], [262, 232], [284, 232], [292, 250], [284, 262], [262, 262]], 2), SCOOP, { edge: 'cut' }),
  ink([[260, 252], [288, 252]], { width: 2.4, color: SCOOP_DARK }),
  piece(circle(273, 226, 20), ICE, { edge: 'cut' }),
  piece(ellipse(273, 242, 20, 6), ICE_DARK, { edge: 'cut', fibre: false, shadow: false }),
  dot(266, 218, 3.6, C.white, 0.8),
  // the hand round the handle
  piece(circle(270, 316, 14), SKIN, { edge: 'cut' }),
  ...[-6, 2, 10].map((d) => ink([[258, 314 + d], [282, 314 + d]], { width: 2, color: C.skinShade })),
]);

/** A curl at the end of the moustache. */
function curl(s: -1 | 1): Node[] {
  const x = cx + s * 54;
  return [
    piece(circle(x, cy + 22, 11), HAIR, { edge: 'cut' }),
    ink([[x - s * 4, cy + 24], [x + s * 4, cy + 20], [x + s * 2, cy + 26]], { width: 2.4, color: HAIR_LIGHT }),
  ];
}

export function fortescue(): string {
  return person({
    name: 'fortescue',
    label: 'Florean Fortescue',
    skin: SKIN,
    eyes: C.brownDark,
    eyeStyle: 'round',
    mouth: 'grin',
    brows: 'kind',
    browColor: HAIR,
    face: [70, 68],
    nose: 'big',
    blush: true,
    body: body(),
    back: [
      // curls of brown hair over the ears
      ...([-1, 1] as const).flatMap((s) => [
        piece(circle(cx + s * 66, cy + 4, 16), HAIR),
        piece(circle(cx + s * 70, cy + 24, 13), HAIR),
        piece(circle(cx + s * 60, cy - 14, 14), HAIR),
      ]),
    ],
    front: [
      // crinkles at the corners of his eyes
      ...[-1, 1].map((s) => ink([[cx + s * 46, cy - 2], [cx + s * 54, cy - 6]], { width: 2.4, color: C.skinShade })),
      // the big curly moustache, over the top of the grin, ends curled up
      piece(curve([[cx - 52, cy + 26], [cx - 36, cy + 34], [cx - 10, cy + 30], [cx, cy + 36], [cx + 10, cy + 30], [cx + 36, cy + 34], [cx + 52, cy + 26], [cx + 40, cy + 44], [cx + 10, cy + 38], [cx, cy + 40], [cx - 10, cy + 38], [cx - 40, cy + 44]], 2), HAIR),
      ...curl(-1),
      ...curl(1),
      ink([[cx - 40, cy + 34], [cx - 20, cy + 36]], { width: 2.4, color: HAIR_LIGHT }),
      ink([[cx + 40, cy + 34], [cx + 20, cy + 36]], { width: 2.4, color: HAIR_LIGHT }),
      // the folded white paper hat, a little crooked, with a fold line and a pink band
      piece(poly([[cx - 52, cy - 38], [cx - 46, cy - 82], [cx + 6, cy - 98], [cx + 52, cy - 80], [cx + 54, cy - 36], [cx, cy - 46]]), C.white, { edge: 'torn' }),
      ink([[cx - 4, cy - 94], [cx + 2, cy - 48]], { width: 2.2, color: C.skinPale }),
      piece(poly([[cx - 54, cy - 40], [cx + 56, cy - 38], [cx + 54, cy - 30], [cx - 52, cy - 32]]), APRON_PINK, { edge: 'cut', fibre: false, shadow: false }),
    ],
    extra: [armR],
  });
}
