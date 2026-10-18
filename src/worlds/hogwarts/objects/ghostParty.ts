/**
 * Props for Nick's Ghost Party: the Headless Hunt's ghost horse and a
 * waltzing ghost couple. Original paper art, see-through like the ghosts.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

// ---------------------------------------------------------------------------
// The ghost horse
// ---------------------------------------------------------------------------

const BODY = '#a6cfc0';
const BODY_FAR = '#8fb8ab';
const BODY_LIGHT = '#d3e9e1';
const MISTY = '#e6f4ef';
const HOOF = '#e9f3ef';

/** One leg: a thick upper band, a thinner lower band, a hoof. Points are shoulder/hip, knee, hoof. */
function leg(top: [number, number], knee: [number, number], hoof: [number, number], color: string): Node[] {
  const [hx, hy] = hoof;
  return [
    piece(band([top, knee], 26), color, { edge: 'cut' }),
    piece(band([knee, [hx, hy - 8]], 16), color, { edge: 'cut' }),
    piece(ellipse(hx + 3, hy, 12, 8, 10), HOOF, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

/**
 * A ghost horse in full gallop, side-on, facing right, 420 × 300. The back
 * line (and the top of the saddle) is at y 96 between x 130 and 270; the
 * neck and head are to the right of x 290, the tail streams out to the
 * left, so the space above the saddle is empty for a rider to stand behind.
 */
export function ghostHorseArt(): string {
  return svg({ w: 420, h: 300, name: 'hogwarts-ghostHorse', label: 'A ghost horse, galloping' }, [
    group({ part: 'figure', opacity: 0.8 }, [
      // the far legs first (darker), then the body over their tops
      group({ part: 'legsBack', origin: [110, 160] }, [
        ...leg([118, 164], [152, 212], [128, 262], BODY_FAR),
        ...leg([108, 164], [76, 214], [30, 240], BODY),
      ]),
      group({ part: 'legsFront', origin: [296, 160] }, [
        ...leg([288, 164], [262, 214], [228, 252], BODY_FAR),
        ...leg([300, 164], [338, 206], [384, 232], BODY),
      ]),
      // tail: long misty streamers flying out behind
      piece(curve([[96, 112], [60, 96], [20, 108], [-10, 140], [30, 128], [4, 168], [50, 142], [30, 186], [84, 150], [108, 138]], 2), MISTY, { edge: 'clean', fibre: false, shadow: false, opacity: 0.9 }),
      piece(curve([[96, 116], [64, 112], [30, 138], [56, 134], [40, 162], [90, 140]], 2), BODY_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
      // barrel and quarters
      piece(ellipse(200, 140, 126, 54), BODY),
      piece(ellipse(130, 132, 52, 46), BODY),
      piece(ellipse(280, 128, 44, 44), BODY),
      piece(ellipse(206, 162, 100, 20), BODY_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.55 }),
      // neck, head and snout, stretched forward
      piece(curve([[262, 100], [300, 70], [336, 40], [372, 38], [374, 74], [330, 128], [286, 176]], 2), BODY),
      piece(curve([[348, 44], [392, 50], [412, 84], [402, 108], [376, 100], [350, 78]], 2), BODY),
      piece(curve([[378, 80], [406, 86], [410, 108], [388, 110]], 1), BODY_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
      // ear, eye, nostril, a cheerful open mouth line
      piece(poly([[352, 44], [350, 16], [366, 40]]), BODY_FAR, { edge: 'cut' }),
      piece(ellipse(374, 62, 6, 7), C.white, { edge: 'cut', fibre: false, shadow: false }),
      dot(375, 63, 3.4, C.ink),
      dot(404, 92, 2.6, '#587a74'),
      ink([[390, 104], [402, 104]], { width: 2, color: '#587a74' }),
      // bridle
      ink([[356, 48], [372, 92], [396, 96]], { width: 2.5, color: C.redDark }),
      ink([[348, 70], [388, 78]], { width: 2.5, color: C.redDark }),
      // mane: flowing back along the neck
      piece(curve([[346, 36], [326, 16], [292, 22], [262, 56], [276, 56], [246, 84], [282, 80], [262, 106], [306, 90], [330, 60]], 2), MISTY, { edge: 'clean', fibre: false, shadow: false, opacity: 0.92 }),
      piece(curve([[336, 40], [310, 40], [284, 66], [306, 62], [292, 84], [322, 68]], 2), BODY_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
      // saddle blanket and saddle: top at y 96
      piece(rect(138, 100, 124, 26, 8), '#4f8f94', { edge: 'cut' }),
      piece(rect(150, 94, 100, 22, 11), C.redDark, { edge: 'cut' }),
      piece(rect(160, 96, 80, 5, 2), C.red, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
      piece(poly([[254, 96], [268, 88], [266, 104]]), C.redDark, { edge: 'cut', fibre: false }),
      piece(rect(194, 116, 10, 34, 3), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(199, 154, 11), C.gold, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(199, 154, 6), BODY, { edge: 'clean', fibre: false, shadow: false }),
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// The waltzing ghost couple
// ---------------------------------------------------------------------------

const GOWN = '#a9c6e6';
const GOWN_DARK = '#86a8d2';
const GOWN_LIGHT = '#dbe8f7';
const DOUBLET = '#7f9fcb';
const SKINB = '#e3edf7';
const HAIR = '#c9d6e8';

function face(x: number, y: number): Node[] {
  return [
    ink([[x - 11, y - 2], [x - 6, y - 5], [x - 2, y - 2]], { width: 2, color: '#5d7699' }),
    ink([[x + 2, y - 2], [x + 6, y - 5], [x + 11, y - 2]], { width: 2, color: '#5d7699' }),
    ink([[x - 6, y + 8], [x, y + 12], [x + 6, y + 8]], { width: 2, color: '#5d7699' }),
    piece(ellipse(x - 13, y + 5, 5, 3.5), '#f0c5d5', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
    piece(ellipse(x + 13, y + 5, 5, 3.5), '#f0c5d5', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
  ];
}

/**
 * A ghost couple waltzing, 220 × 280: a lady in a big bell-shaped gown on
 * the left and a gentleman in a ruff and doublet on the right, holding
 * hands out between them. Parts `lady` (origin at her feet, 66, 270) and
 * `gent` (origin at his feet, 160, 270) can each sway; `couple` moves both.
 */
export function ghostDancersArt(): string {
  return svg({ w: 220, h: 280, name: 'hogwarts-ghostDancers', label: 'Two ghosts waltzing' }, [
    group({ part: 'couple', origin: [110, 270], opacity: 0.78 }, [
      // the gentleman: legs, doublet, ruff, head, a feathered cap
      group({ part: 'gent', origin: [160, 270] }, [
        piece(band([[150, 190], [146, 268]], 18), '#6e8ec0', { edge: 'cut' }),
        piece(band([[172, 190], [180, 266]], 18), '#6e8ec0', { edge: 'cut' }),
        piece(ellipse(144, 272, 16, 6), '#5f7ba8', { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(184, 270, 16, 6), '#5f7ba8', { edge: 'cut', fibre: false, shadow: false }),
        piece(curve([[128, 200], [130, 150], [150, 126], [174, 126], [194, 150], [196, 200]], 2), DOUBLET),
        piece(poly([[161, 130], [161, 200]]), DOUBLET, { fibre: false }),
        ...[142, 158, 174].map((y) => dot(162, y, 2.6, GOWN_LIGHT)),
        // his free arm, bent up behind him
        piece(band([[190, 140], [208, 120], [200, 96]], 14), DOUBLET),
        piece(circle(200, 92, 7), SKINB),
        // ruff and head
        ...Array.from({ length: 7 }, (_, i) => piece(ellipse(140 + i * 8.5, 122, 8, 7), '#d3e2f3', { edge: 'cut', fibre: false, shadow: false })),
        piece(ellipse(165, 98, 22, 25), SKINB),
        ...face(165, 100),
        piece(curve([[142, 90], [146, 70], [165, 66], [184, 70], [188, 90], [176, 82], [152, 82]], 2), HAIR),
        piece(curve([[146, 76], [158, 58], [182, 60], [186, 76]], 2), DOUBLET, { edge: 'cut' }),
        piece(poly([[176, 62], [200, 40], [196, 62]]), GOWN_LIGHT, { edge: 'clean', fibre: false, shadow: false }),
      ]),
      // the lady: a big bell gown, tight bodice, piled-up hair
      group({ part: 'lady', origin: [66, 270] }, [
        piece(curve([[66, 150], [100, 200], [132, 252], [124, 272], [66, 278], [8, 272], [0, 252], [32, 200]], 2), GOWN),
        piece(curve([[66, 180], [90, 220], [112, 262], [66, 270], [22, 262], [42, 220]], 2), GOWN_DARK, { fibre: false, opacity: 0.6 }),
        piece(curve([[4, 258], [66, 244], [128, 258], [124, 272], [66, 278], [8, 272]], 2), GOWN_LIGHT, { fibre: false, opacity: 0.85 }),
        ...[34, 66, 98].map((x) => ink([[x, 214], [x + (x - 66) * 0.3, 262]], { width: 1.8, color: '#7f9ec6' })),
        piece(curve([[44, 156], [48, 124], [66, 114], [84, 124], [88, 156], [66, 172]], 2), GOWN),
        piece(poly([[50, 126], [66, 142], [82, 126], [66, 118]]), GOWN_LIGHT, { fibre: false }),
        // her arm, out to meet his hand
        piece(band([[84, 140], [108, 134], [128, 124]], 12), SKINB),
        piece(circle(130, 122, 7), SKINB),
        // head and a tall pile of hair with a bow
        piece(ellipse(66, 92, 21, 24), SKINB),
        ...face(66, 94),
        piece(curve([[42, 90], [42, 62], [66, 50], [90, 62], [90, 90], [78, 74], [54, 74]], 2), HAIR),
        piece(circle(66, 46, 14), HAIR),
        piece(poly([[60, 36], [72, 36], [66, 46]]), GOWN_DARK, { edge: 'cut', fibre: false }),
        dot(66, 34, 4, GOWN_LIGHT),
      ]),
      // their joined hands, in the middle
      piece(circle(130, 120, 7), SKINB),
    ]),
  ]);
}
