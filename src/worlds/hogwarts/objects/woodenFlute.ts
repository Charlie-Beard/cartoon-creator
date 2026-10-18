/**
 * Harry's wooden flute, for "Harry's Flute" (book 1; original paper art).
 *
 * woodenFlute: a hand-whittled wooden flute lying flat, 220 x 50, with the
 * mouthpiece on the LEFT. Pale honey wood a little crooked and homemade:
 * knife marks and grain lines, a notch cut for the whistle (about x 52 to 70),
 * a row of six uneven finger holes (x 92 to 192, at y 27) and a twist of
 * brown twine round the middle. It looks as if it would sound a bit like an
 * owl. The whole flute sits between y 11 and y 41 with a little shadow under
 * it; swing it by its middle (110, 26) to play, or turn it upright with the
 * mouthpiece at the top.
 */
import { C } from '../../../art/palette';
import { curve, dot, ellipse, ink, piece, poly, svg, type Node } from '../../../art/paper';

const WOOD = '#d6b27a';
const WOOD_LIGHT = '#ead0a0';
const WOOD_DARK = '#a37a47';
const GRAIN = '#b98d55';
const HOLE = '#4a3320';

/** A short slanted knife cut across the wood. */
const knife = (x: number, y: number): Node => ink([[x, y], [x + 5, y + 7]], { width: 1.8, color: WOOD_DARK, opacity: 0.85 });

export function woodenFlute(): string {
  const holes: Array<[number, number, number]> = [
    [94, 27, 4.4],
    [116, 26, 4],
    [138, 27.5, 4.6],
    [158, 26.5, 4.2],
    [178, 27, 4.8],
    [196, 26, 3.8],
  ];
  return svg({ w: 220, h: 50, name: 'hogwarts-wooden-flute' }, [
    // a soft shadow under it
    piece(ellipse(112, 44, 98, 4.5), 'rgba(40,25,10,0.2)', { edge: 'cut', fibre: false, shadow: false }),
    // the tube: a little narrower at the mouthpiece, wider and wonky at the far end
    piece(curve([[8, 21], [12, 15], [60, 14], [140, 12], [208, 12], [214, 19], [214, 33], [208, 40], [140, 40], [60, 38], [12, 37], [8, 31]], 1), WOOD, { edge: 'cut', rough: 0.9 }),
    // a lighter strip along the top, and a darker one along the underside
    piece(poly([[14, 19], [60, 17], [140, 15], [206, 16], [206, 20], [140, 20], [60, 22], [14, 24]]), WOOD_LIGHT, { edge: 'clean', fibre: false, shadow: false, opacity: 0.85 }),
    piece(poly([[14, 33], [60, 34], [140, 36], [206, 35], [206, 39], [140, 39], [60, 37], [14, 36]]), WOOD_DARK, { edge: 'clean', fibre: false, shadow: false, opacity: 0.55 }),
    // grain
    ink([[22, 26], [70, 25], [86, 27]], { width: 1.6, color: GRAIN, opacity: 0.8 }),
    ink([[102, 31], [150, 32], [204, 30]], { width: 1.6, color: GRAIN, opacity: 0.8 }),
    ink([[104, 21], [130, 20], [170, 21]], { width: 1.4, color: GRAIN, opacity: 0.7 }),
    // the whistle: a notch cut in the top, with a pale wedge inside
    piece(poly([[52, 14], [72, 14], [72, 22], [58, 23]]), HOLE, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[58, 16], [70, 16], [70, 21], [60, 22]]), '#2f2013', { edge: 'clean', fibre: false, shadow: false }),
    piece(poly([[52, 14], [58, 12], [76, 13], [72, 16]]), WOOD_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    // a rounded, nibbled mouthpiece end
    piece(ellipse(11, 26, 5, 8), WOOD_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    // the finger holes (a bit uneven, because he whittled them himself)
    ...holes.map(([x, y, r]) => piece(ellipse(x, y, r, r * 0.8), HOLE, { edge: 'cut', fibre: false, shadow: false })),
    ...holes.map(([x, y, r]) => dot(x - r * 0.3, y - r * 0.3, 1, WOOD_LIGHT, 0.8)),
    // knife marks
    knife(30, 18),
    knife(40, 30),
    knife(80, 29),
    knife(124, 17),
    knife(150, 32),
    knife(186, 17),
    knife(205, 28),
    // a twist of brown twine wound round the tube
    piece(poly([[82, 13], [90, 13], [92, 40], [84, 40]]), C.brown, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    ink([[83, 15], [91, 20]], { width: 1.6, color: C.brownDark }),
    ink([[84, 24], [92, 29]], { width: 1.6, color: C.brownDark }),
    ink([[84, 33], [92, 38]], { width: 1.6, color: C.brownDark }),
    // a little carved ring near the far end
    ink([[210, 13], [210, 39]], { width: 2.4, color: WOOD_DARK }),
  ]);
}
