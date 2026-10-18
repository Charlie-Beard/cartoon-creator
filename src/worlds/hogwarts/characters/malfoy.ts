/**
 * Draco Malfoy, the Slytherin Seeker and Harry's show-off rival (book 3;
 * original paper art, not a likeness of anybody).
 *
 * A pale boy with a pointed chin, sleek slicked-back white-blond hair, narrow
 * grey eyes, one eyebrow cocked and a sneery smirk (the right corner of the
 * mouth is up). Green Slytherin Quidditch robes with silver trim. Built on
 * person() with the usual parts (figure, head, lids, mouth, mouthOpen); the
 * face sits inside 78 62 144 144.
 *
 * The `tangled` pose is the same Malfoy after his Dementor costume has
 * collapsed on him: hair stuck up in tufts, the black hood slipped down round
 * his neck and shoulders, wide startled eyes, a blush, and an open mouth. The
 * same parts, so he can still talk and blink.
 */
import { C } from '../../../art/palette';
import { curve, dot, ellipse, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const SKIN = '#f1dcc4';
const HAIR = '#ebdc9c';
const HAIR_SHADE = '#c2b172';
const ROBE = '#2e6a49';
const ROBE_DARK = '#22503a';
const SILVER = '#c9ced6';
const SILVER_DARK = '#8f96a2';
const HOOD = '#26232c';
const HOOD_FOLD = '#3c3844';

/** Green robes with a silver collar, a silver stripe down the front and silver clasps. */
function robes(): Node[] {
  return [
    piece(curve([[40, 345], [52, 262], [104, 230], [150, 226], [196, 230], [248, 262], [260, 345]], 2), ROBE),
    // darker sides of the robe
    piece(poly([[52, 300], [70, 268], [96, 340], [60, 345]]), ROBE_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[248, 300], [230, 268], [204, 340], [240, 345]]), ROBE_DARK, { edge: 'cut', fibre: false, shadow: false }),
    // silver collar, open at the throat
    piece(poly([[116, 228], [150, 270], [184, 228], [176, 220], [150, 248], [124, 220]]), SILVER, { fibre: false }),
    // silver stripe down the front, and two clasps
    piece(poly([[145, 262], [155, 262], [158, 345], [142, 345]]), SILVER, { edge: 'cut', fibre: false }),
    dot(150, 284, 5, SILVER_DARK),
    dot(150, 316, 5, SILVER_DARK),
    // silver trim on the shoulders
    ink([[70, 270], [104, 240], [124, 232]], { width: 5, color: SILVER }),
    ink([[230, 270], [196, 240], [176, 232]], { width: 5, color: SILVER }),
  ];
}

/** The Dementor hood and cloak, slumped round his neck and shoulders. */
function slippedHood(): Node[] {
  return [
    // the heap of black cloth round the neck, with the chin sitting just above it
    piece(curve([[48, 345], [56, 268], [96, 244], [150, 252], [204, 244], [244, 268], [252, 345]], 2), HOOD),
    // the empty hood itself, flopped down on one shoulder
    piece(curve([[196, 252], [236, 262], [258, 300], [236, 332], [196, 322], [182, 290]], 2), HOOD_FOLD),
    // folds
    ink([[92, 262], [104, 300], [92, 340]], { width: 4, color: HOOD_FOLD, opacity: 0.9 }),
    ink([[150, 262], [146, 300], [156, 340]], { width: 4, color: HOOD_FOLD, opacity: 0.9 }),
    ink([[212, 276], [226, 298], [220, 322]], { width: 3, color: HOOD, opacity: 0.9 }),
    // a frayed ragged hem
    piece(poly([[60, 330], [74, 345], [88, 330], [104, 345], [120, 330], [136, 345], [60, 345]]), HOOD, { fibre: false }),
  ];
}

function build(tangled: boolean): string {
  // The pointed chin: a skin-coloured wedge below the mouth, over the round face.
  const chin = piece(poly([[cx - 28, cy + 58], [cx + 28, cy + 58], [cx + 4, cy + 96], [cx - 4, cy + 96]]), SKIN, { fibre: false });

  const sleek: Node[] = [
    // hair cap swept back off the forehead, with a pointed widow's peak
    piece(curve([[cx - 64, cy - 4], [cx - 70, cy - 58], [cx - 24, cy - 94], [cx + 30, cy - 96], [cx + 70, cy - 56], [cx + 62, cy - 4], [cx + 54, cy - 32], [cx + 20, cy - 52], [cx, cy - 40], [cx - 20, cy - 52], [cx - 52, cy - 32]], 2), HAIR),
    // comb lines running back
    ...[-34, -14, 8, 30].map((x) => ink([[cx + x, cy - 50], [cx + x * 1.15 + 6, cy - 72], [cx + x * 1.3 + 14, cy - 84]], { width: 2.5, color: HAIR_SHADE })),
  ];

  const messy: Node[] = [
    piece(curve([[cx - 66, cy - 2], [cx - 72, cy - 56], [cx - 26, cy - 84], [cx + 30, cy - 86], [cx + 70, cy - 52], [cx + 66, cy - 2], [cx + 54, cy - 28], [cx + 18, cy - 44], [cx - 14, cy - 40], [cx - 50, cy - 26]], 2), HAIR),
    // tufts sticking up and out every which way
    piece(poly([[cx - 56, cy - 50], [cx - 92, cy - 76], [cx - 40, cy - 70]]), HAIR, { fibre: false }),
    piece(poly([[cx - 36, cy - 76], [cx - 52, cy - 120], [cx - 12, cy - 82]]), HAIR, { fibre: false }),
    piece(poly([[cx - 8, cy - 84], [cx + 2, cy - 130], [cx + 24, cy - 84]]), HAIR_SHADE, { fibre: false }),
    piece(poly([[cx + 18, cy - 82], [cx + 50, cy - 122], [cx + 52, cy - 70]]), HAIR, { fibre: false }),
    piece(poly([[cx + 50, cy - 58], [cx + 94, cy - 70], [cx + 60, cy - 36]]), HAIR, { fibre: false }),
    // one loose strand flopped over the forehead
    ink([[cx - 4, cy - 40], [cx - 14, cy - 22], [cx - 6, cy - 8], [cx - 16, cy + 2]], { width: 4, color: HAIR }),
    ink([[cx + 14, cy - 40], [cx + 24, cy - 26], [cx + 18, cy - 14]], { width: 3.5, color: HAIR_SHADE }),
  ];

  // Brows: calm and one cocked for the smirk; both high and bent for the tangle.
  const smugBrows: Node[] = [
    ink([[cx - 40, cy - 14], [cx - 26, cy - 17], [cx - 12, cy - 12]], { width: 4, color: HAIR_SHADE }),
    ink([[cx + 12, cy - 22], [cx + 28, cy - 32], [cx + 42, cy - 24]], { width: 4, color: HAIR_SHADE }),
  ];
  const startledBrows: Node[] = [
    ink([[cx - 42, cy - 18], [cx - 28, cy - 32], [cx - 12, cy - 22]], { width: 4, color: HAIR_SHADE }),
    ink([[cx + 42, cy - 18], [cx + 28, cy - 32], [cx + 12, cy - 22]], { width: 4, color: HAIR_SHADE }),
  ];

  return person({
    name: tangled ? 'malfoy-tangled' : 'malfoy',
    label: tangled ? 'Malfoy tangled in his costume' : 'Draco Malfoy',
    skin: SKIN,
    eyes: '#8c98a6',
    eyeStyle: tangled ? 'wide' : 'narrow',
    mouth: tangled ? 'open' : 'smirk',
    brows: 'none',
    face: [54, 72],
    blush: tangled,
    nose: 'pointy',
    body: tangled ? [...robes(), ...slippedHood()] : robes(),
    back: [piece(ellipse(cx, cy - 24, 66, 64), HAIR)],
    front: [
      chin,
      // a sharp nose, drawn with a shadow line so it shows on pale skin
      ink([[cx + 2, cy + 4], [cx + 10, cy + 24], [cx + 2, cy + 30]], { width: 3, color: '#b98f70' }),
      ...(tangled ? messy : sleek),
      ...(tangled ? startledBrows : smugBrows),
      // a sweat drop for the embarrassed one
      ...(tangled ? [piece(poly([[cx + 62, cy - 30], [cx + 70, cy - 12], [cx + 62, cy - 4], [cx + 54, cy - 12]]), C.sky, { edge: 'clean', fibre: false, shadow: false })] : []),
    ],
  });
}

export function malfoy(): string {
  return build(false);
}

export function malfoyTangled(): string {
  return build(true);
}
