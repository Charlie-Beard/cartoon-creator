/**
 * Old Mother Dabble: the little round old woman who paints the rainbow
 * every day.
 *
 * A round, rosy-cheeked face with round glasses, grey curls peeping out
 * under a floppy straw hat with a paintbrush tucked in its band (the hat is
 * part hat), and a lilac smock spattered with every colour of paint. She is
 * cheerful, chirpy and a bit flustered when things go wrong.
 *
 * Poses (the plain portrait is her cheery self, her big brush held low):
 *   sad    empty-handed: arms dropped, worried brows, a small frown.
 *   paint  the huge brush raised high in her right hand (it goes with
 *          armR), tip dripping red, a big grin.
 *   happy  both arms flung wide, eyes shut in a beam of a smile.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hat.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, ring, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'cheery' | 'sad' | 'paint' | 'happy';

const SKIN = '#f2c7a6';
const SMOCK = '#b7a2d6';
const SMOCK_DARK = '#9580bb';
const HAIR = '#d9d6d2';
const STRAW = '#e5c46e';
const STRAW_DARK = '#c49a3f';
const BAND = '#d9534a';
const WOOD = '#a8743c';
const BRISTLE = '#e3a13a';

const SPLOTCHES: [number, number, number, string][] = [
  [92, 290, 13, C.coatRed], [200, 300, 15, '#3f8fd0'], [150, 322, 12, '#f2cf3e'], [112, 332, 10, '#4fae5c'],
  [222, 262, 11, '#b05cc4'], [78, 262, 9, '#f08a3a'], [178, 276, 8, C.coatRed], [136, 284, 7, '#3f8fd0'],
];

/** A big paintbrush from its handle end (hx, hy) to its bristle tip (tx, ty). */
function brush(hx: number, hy: number, tx: number, ty: number, tipColor: string, scale = 1): Node[] {
  const dx = tx - hx;
  const dy = ty - hy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const mid: Pt = [hx + dx * 0.62, hy + dy * 0.62];
  const base: Pt = [hx + dx * 0.72, hy + dy * 0.72];
  const w = 9 * scale;
  return [
    piece(poly([[hx + px * w * 0.5, hy + py * w * 0.5], [mid[0] + px * w * 0.6, mid[1] + py * w * 0.6], [mid[0] - px * w * 0.6, mid[1] - py * w * 0.6], [hx - px * w * 0.5, hy - py * w * 0.5]]), WOOD, CUT),
    piece(poly([[mid[0] + px * w * 0.8, mid[1] + py * w * 0.8], [base[0] + px * w * 0.9, base[1] + py * w * 0.9], [base[0] - px * w * 0.9, base[1] - py * w * 0.9], [mid[0] - px * w * 0.8, mid[1] - py * w * 0.8]]), C.brassDark, CUT),
    piece(poly([[base[0] + px * w * 1.1, base[1] + py * w * 1.1], [tx + px * w * 0.35, ty + py * w * 0.35], [tx - px * w * 0.35, ty - py * w * 0.35], [base[0] - px * w * 1.1, base[1] - py * w * 1.1]]), BRISTLE, CUT),
    piece(poly([[tx + px * w * 0.7, ty + py * w * 0.7], [tx + ux * w * 1.4, ty + uy * w * 1.4], [tx - px * w * 0.7, ty - py * w * 0.7]]), tipColor, FLAT),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const sad = mood === 'sad';
  const paint = mood === 'paint';
  const happy = mood === 'happy';

  const eyes: EyeStyle = happy ? 'happy' : 'round';
  const browS: BrowStyle = sad ? 'worried' : happy || paint ? 'raised' : 'kind';
  const mouthS: MouthStyle = sad ? 'frown' : happy ? 'beam' : paint ? 'grin' : 'smile';

  // --- a round smock with paint splotches
  const body: Node[] = [
    piece(curve([[28, 345], [38, 262], [86, 226], [150, 220], [214, 226], [262, 262], [272, 345]], 2), SMOCK),
    piece(poly([[112, 226], [150, 252], [188, 226], [176, 220], [150, 232], [124, 220]]), SMOCK_DARK, CUT),
    ...SPLOTCHES.map(([x, y, r, c]) => piece(ellipse(x, y, r, r * 0.8, x * 3), c, { ...FLAT, rough: 1.4 })),
  ];

  // --- grey curls under the hat, either side of the face
  const curls: Node[] = [-1, 1].flatMap((s) => [
    piece(circle(cx + s * 56, cy - 10, 22), HAIR, CUT),
    piece(circle(cx + s * 62, cy + 14, 20), HAIR, CUT),
    piece(circle(cx + s * 52, cy + 34, 16), HAIR, CUT),
  ]);

  // --- round glasses, in front of the face
  const specs: Node[] = [
    ink(ring(cx - 26, cy + 2, 21), { width: 3.2, color: C.brassDark, wobble: 0.15 }),
    ink(ring(cx + 26, cy + 2, 21), { width: 3.2, color: C.brassDark, wobble: 0.15 }),
    ink([[cx - 6, cy], [cx + 6, cy]], { width: 3, color: C.brassDark }),
    piece(ellipse(cx - 34, cy - 8, 6, 3, -35), C.white, { ...FLAT, opacity: 0.45 }),
    piece(ellipse(cx + 18, cy - 8, 6, 3, -35), C.white, { ...FLAT, opacity: 0.45 }),
  ];

  // --- the straw hat: wide brim, a crown, a red band, a brush tucked in
  const hat: Node[] = [
    ...brush(cx + 34, cy - 84, cx + 76, cy - 150, C.coatRed, 0.9),
    piece(ellipse(cx, cy - 56, 100, 18), STRAW_DARK, { rough: 1.1 }),
    piece(curve([[cx - 56, cy - 56], [cx - 52, cy - 96], [cx - 20, cy - 114], [cx + 20, cy - 114], [cx + 52, cy - 96], [cx + 56, cy - 56]], 2), STRAW),
    piece(poly([[cx - 56, cy - 60], [cx + 56, cy - 60], [cx + 55, cy - 72], [cx - 55, cy - 72]]), BAND, CUT),
    ...[-80, -52, -20, 18, 56, 84].map((x) => ink([[cx + x * 0.9, cy - 52], [cx + x * 0.82, cy - 60]], { width: 2, color: STRAW, opacity: 0.8 })),
  ];

  // --- arms
  const sleeve = SMOCK;
  const cuff = SMOCK_DARK;
  const arms: Node[] = [];
  if (sad) {
    arms.push(
      arm('armL', { from: [64, 268], via: [44, 306], to: [64, 336], sleeve, cuff, hand: SKIN, width: 32 }),
      arm('armR', { from: [236, 268], via: [256, 306], to: [236, 336], sleeve, cuff, hand: SKIN, width: 32 }),
    );
  } else if (paint) {
    arms.push(
      arm('armL', { from: [64, 268], via: [44, 306], to: [60, 334], sleeve, cuff, hand: SKIN, width: 32 }),
      arm('armR', { from: [236, 268], via: [270, 236], to: [262, 170], sleeve, cuff, hand: SKIN, width: 32, holding: brush(264, 214, 248, 20, C.coatRed, 1.5) }),
    );
  } else if (happy) {
    arms.push(
      arm('armL', { from: [64, 268], via: [24, 262], to: [8, 220], sleeve, cuff, hand: SKIN, width: 32 }),
      arm('armR', { from: [236, 268], via: [276, 262], to: [292, 220], sleeve, cuff, hand: SKIN, width: 32 }),
    );
  } else {
    arms.push(
      arm('armL', { from: [64, 268], via: [44, 306], to: [60, 334], sleeve, cuff, hand: SKIN, width: 32 }),
      arm('armR', { from: [236, 268], via: [262, 296], to: [246, 330], sleeve, cuff, hand: SKIN, width: 32, holding: brush(246, 336, 270, 212, '#3f8fd0', 1.4) }),
    );
  }

  return person({
    name,
    label,
    skin: SKIN,
    face: [60, 62],
    ears: false,
    neck: SKIN,
    eyes,
    eyeCol: '#4d6a8c',
    eyeDx: 26,
    eyeY: 2,
    brows: browS,
    browCol: '#a7a29c',
    browY: -22,
    nose: 'round',
    mouth: mouthS,
    mouthY: 38,
    cheeks: '#ee8f84',
    behindHead: curls,
    body,
    onHead: [piece(ellipse(cx, cy + 46, 36, 10), '#d99a7a', { ...FLAT, opacity: 0.25 })],
    front: [...specs, dot(cx - 40, cy + 40, 2, '#b05cc4', 0.8), dot(cx + 38, cy + 44, 2.4, '#f2cf3e', 0.9)],
    hat,
    arms,
  });
}

/** Mother Dabble, cheery, her big brush held low at her side. */
export const dabble = cached((): string => draw('cheery', 'wishing-dabble', 'Mother Dabble'));

/** Sad and empty-handed: arms dropped, worried brows, a small frown. */
export const dabbleSad = cached((): string => draw('sad', 'wishing-dabble-sad', 'Mother Dabble sad'));

/** The huge brush raised high, dripping red, a big grin. */
export const dabblePaint = cached((): string => draw('paint', 'wishing-dabble-paint', 'Mother Dabble painting'));

/** Both arms flung wide, a beaming smile. */
export const dabbleHappy = cached((): string => draw('happy', 'wishing-dabble-happy', 'Mother Dabble happy'));
