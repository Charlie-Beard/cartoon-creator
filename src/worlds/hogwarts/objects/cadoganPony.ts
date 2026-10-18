/**
 * Sir Cadogan's pony (book 3; original paper art): a very fat, round,
 * dapple-grey pony, side-on, facing right, with short stumpy legs, a shaggy
 * charcoal mane and forelock flopping over sleepy eyes, and a red saddle
 * cloth with a gold edge. Not a portrait bust: the whole pony fills the box,
 * hooves on the bottom (y 336).
 *
 * Parts: figure, head (origin at the neck [196, 190], to toss or nod; the
 * mane, forelock, eye, lids, mouth and mouthOpen ride on it), lids (over the
 * sleepy eyes), mouth, mouthOpen (a whinny), tail (origin at its base
 * [20, 196], to swish).
 *
 * Layout in the 300 × 340 box: the round body is x 8 to 206, y 150 to 292
 * with the belly low and the legs short (hooves y 322 to 336, at about x 44,
 * 78, 150, 184). The saddle cloth sits on the back, and the SADDLE TOP, where
 * a rider sits, is at y 148 across x 66 to 150 (centre x 108): stand the
 * knight so the bottom of his box is at about y 150 of the pony's box, his
 * centre at x 108 (i.e. his bottom edge on the saddle). The head hangs low
 * on the right: face about x 210 to 290, y 90 to 180, so the caption chip is
 * `160 70 140 140`.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';

const COAT = '#a7aeb6';
const COAT_LIGHT = '#cdd2d7';
const COAT_DARK = '#868e98';
const DAPPLE = '#8b939d';
const MANE = '#5e656f';
const MANE_LIGHT = '#868e99';
const HOOF = '#4a4a52';
const NOSE = '#d9a9a6';

/** A stumpy leg from the body down to a hoof at the bottom edge. */
function leg(x: number, color: string): Node[] {
  return [
    piece(curve([[x - 17, 262], [x - 14, 300], [x - 15, 324], [x + 15, 324], [x + 14, 300], [x + 17, 262]], 2), color),
    piece(curve([[x - 15, 320], [x + 15, 320], [x + 17, 336], [x - 17, 336]], 1), HOOF, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 12, 312], [x + 12, 312]], { width: 2, color: COAT_DARK, opacity: 0.7 }),
  ];
}

/** The tail: a thick shaggy tuft hanging from the back, swishing from its base. */
function tail(): Node {
  return group({ part: 'tail', origin: [20, 196] }, [
    piece(curve([[30, 180], [8, 184], [-2, 214], [4, 258], [18, 262], [22, 236], [32, 232], [36, 206]], 2), MANE),
    piece(curve([[22, 188], [8, 204], [10, 240], [18, 252]], 2), MANE_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    ink([[14, 210], [12, 244]], { width: 2, color: MANE_LIGHT }),
    ink([[22, 214], [20, 250]], { width: 2, color: MANE_LIGHT }),
  ]);
}

/** The head, neck and shaggy mane, hanging low and sleepy on the right. */
function head(): Node {
  return group({ part: 'head', origin: [196, 190] }, [
    // neck, thick and short, from the shoulder up to the head
    piece(curve([[168, 168], [186, 118], [222, 96], [240, 150], [226, 204], [190, 214]], 2), COAT),
    // ear (far one darker, near one in front)
    piece(poly([[212, 92], [208, 62], [228, 88]]), COAT_DARK, { edge: 'cut' }),
    piece(poly([[226, 90], [232, 62], [246, 94]]), COAT, { edge: 'cut' }),
    piece(poly([[230, 88], [233, 72], [240, 90]]), NOSE, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    // skull and a big soft muzzle hanging down to the right
    piece(ellipse(236, 128, 36, 36), COAT),
    piece(curve([[246, 128], [284, 138], [290, 164], [270, 182], [244, 176], [232, 150]], 2), COAT),
    piece(ellipse(274, 168, 17, 13), NOSE, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    dot(284, 160, 2.8, C.ink, 0.75),
    // dapples on the neck and cheek
    ...[[196, 150, 7], [208, 174, 6], [224, 160, 5], [246, 106, 4]].map(([x, y, r]) =>
      piece(ellipse(x, y, r, r * 0.8), DAPPLE, { edge: 'clean', fibre: false, shadow: false, opacity: 0.65 })),
    // rosy fat cheek
    piece(ellipse(234, 156, 12, 8), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    // the sleepy eye: a round white with a big dark pupil, heavy lid pulled half-down
    piece(ellipse(246, 124, 9, 9), C.white, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(248, 127, 5.2), C.ink, { edge: 'clean', shadow: false }),
    dot(246, 124, 1.6, C.white),
    piece(poly([[235, 112], [259, 112], [258, 124], [236, 125]]), COAT, { edge: 'cut', fibre: false, shadow: false }),
    ink([[236, 124], [247, 126], [258, 123]], { width: 2.4, color: C.ink }),
    group({ part: 'lids', opacity: 0 }, [
      piece(ellipse(247, 124, 11, 11), COAT, { edge: 'cut', fibre: false, shadow: false }),
      ink([[237, 126], [247, 131], [258, 126]], { width: 2.6, color: C.ink }),
    ]),
    // mouth: a gentle line along the bottom of the muzzle; open: a whinny
    group({ part: 'mouth' }, [
      ink([[256, 180], [270, 184], [284, 176]], { width: 2.6, color: COAT_DARK }),
    ]),
    group({ part: 'mouthOpen', opacity: 0 }, [
      piece(ellipse(272, 186, 14, 10, 12), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(274, 190, 8, 4, 12), C.rose, { edge: 'clean', fibre: false, shadow: false }),
      ...[[264, 180], [272, 181], [280, 178]].map(([x, y]) => dot(x, y, 1.8, C.white)),
    ]),
    // shaggy mane along the neck and a big forelock flopping over the eyes
    piece(curve([[196, 112], [208, 78], [236, 66], [226, 82], [244, 78], [232, 94], [214, 124], [214, 160], [200, 190], [188, 150]], 2), MANE),
    piece(curve([[204, 116], [214, 92], [228, 82]], 2), MANE_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    piece(curve([[216, 74], [244, 70], [268, 84], [262, 108], [256, 106], [250, 118], [244, 100], [234, 110], [230, 94], [218, 98]], 2), MANE),
    ink([[232, 80], [236, 100]], { width: 2.2, color: MANE_LIGHT }),
    ink([[248, 80], [252, 102]], { width: 2.2, color: MANE_LIGHT }),
  ]);
}

export function cadoganPony(): string {
  return svg({ w: 300, h: 340, name: 'cadogan-pony', label: "Sir Cadogan's fat pony", className: 'portrait' }, [
    group({ part: 'figure' }, [
      tail(),
      // far legs (darker) first, then the body over their tops, then the near legs
      ...leg(80, COAT_DARK),
      ...leg(152, COAT_DARK),
      // the huge round barrel and a rounder bottom
      piece(ellipse(108, 224, 100, 70), COAT),
      piece(ellipse(60, 214, 52, 56), COAT),
      piece(ellipse(166, 214, 48, 54), COAT),
      // a plump pale tummy
      piece(ellipse(108, 270, 80, 22), COAT_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
      // dapples all over
      ...[[44, 204, 9], [72, 188, 7], [96, 238, 9], [128, 232, 7], [150, 252, 8], [176, 200, 7], [60, 244, 8], [186, 238, 6], [28, 236, 6], [118, 176, 5]].map(([x, y, r]) =>
        piece(ellipse(x, y, r, r * 0.8), DAPPLE, { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 })),
      ...leg(44, COAT),
      ...leg(184, COAT),
      // red saddle cloth with a gold edge, and a little saddle on top
      piece(curve([[56, 166], [66, 156], [150, 156], [160, 166], [164, 224], [150, 234], [66, 234], [52, 224]], 2), C.red, { edge: 'cut' }),
      ink([[56, 226], [108, 238], [160, 226]], { width: 5, color: C.gold }),
      ink([[60, 172], [60, 224]], { width: 3, color: C.gold }),
      ink([[156, 172], [156, 224]], { width: 3, color: C.gold }),
      piece(curve([[66, 156], [72, 146], [144, 146], [150, 156], [108, 160]], 1), C.redDark, { edge: 'cut', fibre: false }),
      piece(ellipse(108, 192, 20, 14), C.redDark, { edge: 'clean', fibre: false, shadow: false, opacity: 0.35 }),
      head(),
    ]),
  ]);
}
