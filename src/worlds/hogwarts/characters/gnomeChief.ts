/**
 * The Gnome Chief: the big, grumpy old leader of the garden gnomes at the
 * Burrow. The same kind of creature as the little `gnome` in hosts1.ts (bald,
 * bumpy, potato-brown, big pointy ears), but older and grander: a long
 * scruffy grey beard, huge bushy eyebrows in a frown, a twig crown with a
 * daisy in it and a little leaf cape. He glares and stomps; he is grumpy in a
 * funny way, never truly frightening.
 *
 * Unlike the gnome he talks and blinks, so he has the standard parts:
 * `figure` (everything), `head`, `lids`, `mouth` and `mouthOpen`. The mouth
 * sits in a gap below the moustache so the beard never hides it.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, svg } from '../../../art/paper';
import { H, W } from './people';

export function gnomeChief(): string {
  const skin = '#b08a60';
  const bump = '#9a7650';
  const grey = '#c9c6bd';
  const greyDark = '#9d9a92';
  const leaf = '#6f8f4a';
  const leafDark = '#557238';
  const twig = '#6b4a32';
  const leafShape = (x: number, y: number, rot: number, col: string) =>
    piece(ellipse(x, y, 30, 13, rot), col, { edge: 'cut' });
  // one bristly tuft of eyebrow, pointing down towards the nose
  const brow = (s: number) => [
    piece(curve([[150 + s * 8, 122], [150 + s * 14, 104], [150 + s * 50, 92], [150 + s * 88, 82], [150 + s * 94, 98], [150 + s * 70, 108], [150 + s * 40, 118]], 1), grey, { rough: 1.8 }),
    piece(poly([[150 + s * 66, 88], [150 + s * 100, 84], [150 + s * 82, 106]]), greyDark, { fibre: false, shadow: false }),
    piece(poly([[150 + s * 14, 108], [150 + s * 52, 92], [150 + s * 40, 114]]), '#dcd9d0', { fibre: false, shadow: false }),
  ];

  return svg({ w: W, h: H, name: 'hogwarts-gnomeChief', label: 'the Gnome Chief', className: 'portrait' }, [
    piece(ellipse(150, 332, 122, 14), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      // body in a plain brown tunic
      piece(curve([[62, 334], [70, 244], [150, 218], [230, 244], [238, 334]]), '#8a6a46'),
      // hands, folded on the tummy
      piece(ellipse(104, 296, 18, 30, 24), skin),
      piece(ellipse(196, 296, 18, 30, -24), skin),
      // leaf cape over the shoulders
      leafShape(84, 240, -30, leafDark),
      leafShape(216, 240, 30, leafDark),
      leafShape(98, 254, -12, leaf),
      leafShape(202, 254, 12, leaf),
      leafShape(120, 244, 8, leaf),
      leafShape(180, 244, -8, leaf),
      ink([[84, 242], [118, 246]], { width: 2, color: leafDark }),
      ink([[216, 242], [182, 246]], { width: 2, color: leafDark }),

      group({ part: 'head', origin: [150, 230] }, [
        // big pointy ears
        piece(poly([[58, 154], [6, 108], [70, 118]]), skin),
        piece(poly([[242, 154], [294, 108], [230, 118]]), skin),
        piece(poly([[58, 148], [24, 120], [66, 126]]), bump, { fibre: false, shadow: false }),
        piece(poly([[242, 148], [276, 120], [234, 126]]), bump, { fibre: false, shadow: false }),
        // the head, a little bigger than the little gnome's
        piece(curve([[66, 142], [84, 66], [150, 44], [216, 66], [234, 142], [204, 214], [96, 214]]), skin),
        piece(circle(112, 80, 9), bump, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(194, 92, 7), bump, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(100, 166, 6), bump, { edge: 'cut', fibre: false, shadow: false }),

        // twig crown with a daisy
        piece(curve([[96, 70], [112, 56], [150, 50], [188, 56], [204, 70], [190, 66], [150, 60], [110, 66]], 1), twig, { edge: 'cut' }),
        piece(poly([[110, 62], [102, 38], [120, 56]]), twig, { edge: 'cut', fibre: false, shadow: false }),
        piece(poly([[190, 62], [198, 38], [180, 56]]), twig, { edge: 'cut', fibre: false, shadow: false }),
        piece(poly([[146, 56], [150, 32], [156, 56]]), twig, { edge: 'cut', fibre: false, shadow: false }),
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return piece(ellipse(150 + Math.cos(a) * 12, 46 + Math.sin(a) * 12, 8, 4.5, (a * 180) / Math.PI), C.white, { edge: 'cut', fibre: false, shadow: false });
        }),
        piece(circle(150, 46, 6), C.yellow, { edge: 'clean', fibre: false, shadow: false }),

        // eyes: small, round and glaring
        piece(circle(122, 134, 12), C.white, { edge: 'cut', fibre: false }),
        piece(circle(178, 134, 12), C.white, { edge: 'cut', fibre: false }),
        piece(circle(125, 137, 6), C.ink, { edge: 'clean', shadow: false }),
        piece(circle(175, 137, 6), C.ink, { edge: 'clean', shadow: false }),
        dot(123, 135, 2, C.white),
        dot(173, 135, 2, C.white),
        group({ part: 'lids', opacity: 0 }, [-1, 1].flatMap((s) => [
          piece(ellipse(150 + s * 28, 134, 14, 14), skin, { edge: 'cut', fibre: false, shadow: false }),
          ink([[150 + s * 28 - 12, 138], [150 + s * 28, 142], [150 + s * 28 + 12, 138]], { width: 2.5, color: C.ink }),
        ])),
        // huge bushy frowning brows, drawn over the lids so they stay put
        ...brow(-1),
        ...brow(1),

        // big knobbly nose
        piece(ellipse(150, 160, 24, 19), bump),

        // long scruffy beard behind the moustache
        piece(curve([[84, 176], [96, 214], [100, 262], [124, 292], [150, 312], [176, 292], [200, 262], [204, 214], [216, 176], [150, 196]], 1), grey, { rough: 2 }),
        piece(poly([[104, 250], [116, 300], [132, 262]]), greyDark, { fibre: false, shadow: false }),
        piece(poly([[168, 262], [186, 304], [196, 250]]), greyDark, { fibre: false, shadow: false }),
        piece(poly([[132, 280], [150, 328], [168, 280]]), grey, { rough: 2 }),
        ink([[120, 232], [126, 270]], { width: 2.5, color: greyDark }),
        ink([[180, 232], [174, 270]], { width: 2.5, color: greyDark }),
        // gap for the mouth, then the moustache over it
        piece(ellipse(150, 198, 22, 12), skin, { edge: 'cut', fibre: false, shadow: false }),
        group({ part: 'mouth' }, [
          ink([[132, 200], [150, 194], [168, 200]], { width: 4, color: C.brownDark }),
        ]),
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(ellipse(150, 202, 16, 11), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(ellipse(150, 207, 9, 4), C.rose, { edge: 'clean', fibre: false, shadow: false }),
        ]),
        piece(curve([[150, 180], [130, 174], [102, 182], [92, 198], [118, 190], [140, 190]], 1), '#dcd9d0', { rough: 1.4 }),
        piece(curve([[150, 180], [170, 174], [198, 182], [208, 198], [182, 190], [160, 190]], 1), '#dcd9d0', { rough: 1.4 }),
      ]),
    ]),
  ]);
}
