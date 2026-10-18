/**
 * Fred and George Weasley, Ron's older twin brothers (book 3; original paper
 * art). They are identical on purpose, so the only way to tell them apart is
 * the hand-knitted jumper: Fred's is dark blue with a yellow F, George's is
 * green with a yellow G.
 *
 * Both are drawn from one function. Compared with Ron they are a touch
 * taller in the face, with longer, messier flaming-ginger hair that sticks
 * up in tufts and hangs over the ears, lots of freckles, a big mischievous
 * grin and one eyebrow cocked up. Built on person() with the usual parts
 * (figure, head, lids, mouth, mouthOpen) plus `armR`, which swings from the
 * shoulder at (232, 262) for a wave, or a wink-and-point (the hand ends in
 * a pointing finger). Their faces sit inside 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../../art/paper';
import { fluff } from './heroes';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const HAIR = '#cf5a1e';
const HAIR_LIGHT = '#e07a30';
const YELLOW = '#e8c45a';

/** The letters, stitched in yellow wool on the chest (never flip them: they would mirror). */
const LETTERS: Record<'F' | 'G', Pt[]> = {
  F: [[158, 284], [138, 284], [138, 330], [138, 308], [154, 308]],
  G: [[162, 292], [154, 284], [138, 284], [132, 296], [132, 318], [140, 330], [156, 330], [162, 322], [162, 308], [148, 308]],
};

function jumper(colour: string, shade: string, letter: 'F' | 'G'): Node[] {
  return [
    piece(curve([[40, 345], [52, 262], [104, 230], [150, 226], [196, 230], [248, 262], [260, 345]], 2), colour),
    // knitted ribs down the front and the round neck
    ...[-1, 1].flatMap((s) => [0, 1, 2].map((i) => ink([[150 + s * (46 + i * 14), 262 + i * 6], [150 + s * (50 + i * 15), 342]], { width: 2, color: shade, opacity: 0.6 }))),
    piece(curve([[116, 230], [150, 252], [184, 230], [178, 220], [150, 238], [122, 220]], 2), shade, { fibre: false }),
    ink(LETTERS[letter], { width: 8, color: YELLOW }),
  ];
}

/** A friendly arm from the shoulder at (232, 262), ending in a pointing finger. */
const arm = (colour: string, shade: string): Node =>
  group({ part: 'armR', origin: [232, 262] }, [
    piece(band([[226, 264], [250, 294], [260, 312]], 34), colour),
    piece(band([[252, 306], [262, 320]], 38), shade, { edge: 'cut', fibre: false }),
    piece(circle(266, 328, 14), C.skin, { edge: 'cut' }),
    // the pointing finger, and three curled ones
    piece(band([[270, 322], [284, 336]], 8), C.skin, { edge: 'cut', fibre: false }),
    ...[-6, 0, 6].map((d) => piece(ellipse(262 + d, 340, 3.5, 5), C.skin, { edge: 'clean', fibre: false, shadow: false })),
  ]);

function twin(name: string, label: string, colour: string, shade: string, letter: 'F' | 'G'): string {
  const bush: Pt[] = [
    [cx, cy - 118], [cx + 40, cy - 108], [cx + 78, cy - 84], [cx + 86, cy - 40], [cx + 90, cy + 6], [cx + 76, cy + 40],
    [cx - 76, cy + 40], [cx - 90, cy + 6], [cx - 86, cy - 40], [cx - 78, cy - 84], [cx - 40, cy - 108],
  ];
  return person({
    name,
    label,
    skin: C.skin,
    eyes: C.blue,
    freckles: true,
    face: [60, 78],
    mouth: 'grin',
    brows: 'none',
    body: jumper(colour, shade, letter),
    back: [
      fluff(bush, HAIR, 12),
      // long locks down past the ears
      piece(ellipse(cx - 70, cy + 10, 15, 40, 8), HAIR),
      piece(ellipse(cx + 70, cy + 10, 15, 40, -8), HAIR),
    ],
    front: [
      // messy fringe
      piece(curve([[cx - 72, cy - 6], [cx - 68, cy - 70], [cx - 14, cy - 98], [cx + 52, cy - 88], [cx + 72, cy - 30], [cx + 70, cy - 6], [cx + 40, cy - 46], [cx + 8, cy - 40], [cx - 22, cy - 56], [cx - 50, cy - 36]], 2), HAIR),
      // tufts sticking up
      piece(poly([[cx - 34, cy - 86], [cx - 46, cy - 120], [cx - 16, cy - 94]]), HAIR_LIGHT, { fibre: false }),
      piece(poly([[cx + 6, cy - 94], [cx + 14, cy - 130], [cx + 34, cy - 92]]), HAIR_LIGHT, { fibre: false }),
      piece(poly([[cx + 40, cy - 80], [cx + 66, cy - 108], [cx + 66, cy - 66]]), HAIR_LIGHT, { fibre: false }),
      // one eyebrow flat, the other cocked up high
      ink([[cx - 40, cy - 16], [cx - 26, cy - 20], [cx - 12, cy - 18]], { width: 5, color: '#a8461e' }),
      ink([[cx + 12, cy - 26], [cx + 28, cy - 38], [cx + 42, cy - 28]], { width: 5, color: '#a8461e' }),
      // extra freckles over the nose and cheeks
      ...[[-8, 22], [6, 20], [0, 28], [-46, 36], [46, 36], [-18, 30], [18, 31]].map(([x, y]) => dot(cx + x, cy + y, 2, C.brown, 0.7)),
      // a cheeky dimple at the corner of the grin
      ink([[cx + 26, cy + 38], [cx + 30, cy + 46]], { width: 2.5, color: '#b86a50' }),
    ],
    extra: [arm(colour, shade)],
  });
}

export function fred(): string {
  return twin('fred', 'Fred Weasley', '#2f4f7c', '#243e63', 'F');
}

export function george(): string {
  return twin('george', 'George Weasley', '#3f6b4c', '#2f5239', 'G');
}
