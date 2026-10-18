/**
 * Professor Lockhart (Gilderoy), the vain and cheerful Defence Against the
 * Dark Arts teacher. Our own paper version: glossy golden waves swept up in
 * a perfect quiff, bright blue eyes, one eyebrow cocked, rosy cheeks and a
 * dazzling toothy grin. For Valentine's Day he wears a bright pink robe, a
 * frilly lilac cravat and a big pink paper heart badge.
 *
 * Built on the shared `person()` template. Extra parts: `wand` (held up on
 * the left of the picture, pivot at his fist) and `armR` (a pink sleeve and
 * hand on the right, pivot at the shoulder, for a flourish or a wave).
 */
import { C } from '../../../art/palette';
import { band, circle, curve, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person, wand } from './people';
import { fluff } from './heroes';

const [cx, cy] = HEAD;

const GOLD_HAIR = '#e2b340';
const GOLD_SHINE = '#f6dc84';
const PINK_ROBE = '#e4789f';
const PINK_DARK = '#c75a84';
const HEART = '#f2a0bd';
const FRILL = '#c7b0e8';
const FRILL_DARK = '#a58ad0';

/** A paper heart: two round lobes and a point. */
function heart(x: number, y: number, s: number, color: string): Node[] {
  return [
    piece(circle(x - s * 0.5, y - s * 0.3, s * 0.58), color, { edge: 'clean', shadow: false }),
    piece(circle(x + s * 0.5, y - s * 0.3, s * 0.58), color, { edge: 'clean', shadow: false }),
    piece(poly([[x - s * 1.04, y - s * 0.1], [x + s * 1.04, y - s * 0.1], [x, y + s * 1.05]]), color, { edge: 'clean', shadow: false }),
  ];
}

export function lockhart(): string {
  const body: Node[] = [
    // the bright pink robe
    piece(curve([[40, 345], [52, 262], [104, 230], [150, 226], [196, 230], [248, 262], [260, 345]], 2), PINK_ROBE),
    // darker lapels folding back
    piece(poly([[112, 232], [150, 300], [128, 345], [96, 345], [100, 262]]), PINK_DARK, { fibre: false }),
    piece(poly([[188, 232], [150, 300], [172, 345], [204, 345], [200, 262]]), PINK_DARK, { fibre: false }),
    // the frilly lilac cravat: a fat froth of scallops under the chin
    piece(poly([[128, 226], [172, 226], [182, 262], [150, 300], [118, 262]]), FRILL, { fibre: false }),
    ...[[130, 246], [170, 246], [150, 262], [136, 276], [164, 276], [150, 290]].map(([x, y]) => piece(circle(x, y, 12), FRILL, { edge: 'clean', shadow: false })),
    ink([[132, 250], [150, 266], [168, 250]], { width: 2.5, color: FRILL_DARK }),
    ink([[140, 278], [150, 290], [160, 278]], { width: 2.5, color: FRILL_DARK }),
    // the big paper heart badge, with a gold pin and a shine
    ...heart(206, 292, 20, C.rose),
    ...heart(206, 292, 15, HEART),
    piece(circle(198, 284, 4), C.white, { edge: 'clean', shadow: false, opacity: 0.7 }),
    piece(circle(206, 310, 3), C.gold, { edge: 'cut', shadow: false }),
  ];

  // the arm on the right of the picture: sleeve, cuff and a hand, pivoting at the shoulder
  const armR = group({ part: 'armR', origin: [226, 258] }, [
    piece(band([[226, 258], [256, 306]], 38), PINK_ROBE),
    piece(band([[252, 298], [259, 310]], 42), FRILL, { edge: 'clean', fibre: false }),
    piece(circle(264, 322, 13), C.skin, { edge: 'cut' }),
  ]);

  return person({
    name: 'lockhart',
    label: 'Professor Lockhart',
    skin: C.skin,
    eyes: '#2f9be8',
    eyeStyle: 'wide',
    face: [60, 70],
    back: [
      // glossy waves rolling down behind the ears
      fluff([[cx - 68, cy - 30], [cx - 82, cy + 20], [cx - 70, cy + 70], [cx - 40, cy + 40], [cx, cy - 20]], GOLD_HAIR, 12),
      fluff([[cx + 68, cy - 30], [cx + 82, cy + 20], [cx + 70, cy + 70], [cx + 40, cy + 40], [cx, cy - 20]], GOLD_HAIR, 12),
      piece(ellipse(cx, cy - 24, 72, 62), GOLD_HAIR),
    ],
    front: [
      // the swept-up quiff, a tall wave rolling back from the brow
      fluff([[cx - 66, cy - 8], [cx - 70, cy - 60], [cx - 36, cy - 96], [cx + 10, cy - 116], [cx + 56, cy - 100], [cx + 72, cy - 56], [cx + 64, cy - 8], [cx + 36, cy - 44], [cx - 6, cy - 56], [cx - 40, cy - 44]], GOLD_HAIR, 10),
      // shine streaks, so it looks glossy
      ink([[cx - 36, cy - 76], [cx - 6, cy - 94], [cx + 30, cy - 92]], { width: 5, color: GOLD_SHINE }),
      ink([[cx - 50, cy - 40], [cx - 38, cy - 62]], { width: 4, color: GOLD_SHINE }),
      ink([[cx + 36, cy - 76], [cx + 56, cy - 56]], { width: 4, color: GOLD_SHINE }),
      // one eyebrow flat, the other cocked high: "Admire me."
      ink([[cx - 40, cy - 16], [cx - 26, cy - 22], [cx - 12, cy - 18]], { width: 5, color: '#c4932c' }),
      ink([[cx + 12, cy - 22], [cx + 28, cy - 38], [cx + 44, cy - 28]], { width: 5, color: '#c4932c' }),
      // a dimple to go with the grin
      ink([[cx - 30, cy + 40], [cx - 34, cy + 48]], { width: 2.5, color: 'rgba(120,60,30,0.4)' }),
      // the dazzling grin (his mouth is drawn here so it can be wide and full of teeth)
      group({ part: 'mouth' }, [
        piece(curve([[cx - 32, cy + 38], [cx + 32, cy + 38], [cx + 22, cy + 60], [cx - 22, cy + 60]], 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
        piece(curve([[cx - 28, cy + 39], [cx + 28, cy + 39], [cx + 26, cy + 50], [cx - 26, cy + 50]], 1), C.white, { edge: 'clean', fibre: false, shadow: false }),
        ink([[cx - 14, cy + 40], [cx - 14, cy + 50]], { width: 1.5, color: 'rgba(120,60,30,0.35)' }),
        ink([[cx, cy + 40], [cx, cy + 50]], { width: 1.5, color: 'rgba(120,60,30,0.35)' }),
        ink([[cx + 14, cy + 40], [cx + 14, cy + 50]], { width: 1.5, color: 'rgba(120,60,30,0.35)' }),
      ]),
      group({ part: 'mouthOpen', opacity: 0 }, [
        piece(ellipse(cx, cy + 52, 28, 20), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
        piece(curve([[cx - 26, cy + 38], [cx + 26, cy + 38], [cx + 24, cy + 50], [cx - 24, cy + 50]], 1), C.white, { edge: 'clean', fibre: false, shadow: false }),
        piece(ellipse(cx, cy + 62, 13, 5), C.rose, { edge: 'clean', fibre: false, shadow: false }),
      ]),
    ],
    brows: 'none',
    mouth: 'none',
    tie: null,
    body,
    extra: [wand(58, 318, '#8a5a34'), armR],
  });
}
