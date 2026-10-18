/**
 * A Red Cap (book 3; original art): a tiny knobbly goblin-ish creature that
 * lurks in potholes. A big pointy, woolly RED cap with a bobble, pointy ears,
 * a turnip nose (with a little green sprout), small beady eyes under a cheeky
 * scowl, a patched brown tunic with a rope belt and little bare feet. It
 * carries no weapon: it pops up to tug shoelaces and blow raspberries.
 *
 * It is small: the figure takes the lower 70% of the box (cap tip at y 44,
 * feet at y 336) with a short body, so it reads as a little thing next to
 * the others. The face sits inside the face box 78 62 144 144 (eyes at
 * y 150, nose y 168, mouth y 190), so no `chip` is needed.
 *
 * Parts: figure, head (origin 150, 230), lids, mouth, mouthOpen, tongue
 * (hidden, origin at the mouth 150, 192: show it with mouthOpen for a
 * raspberry) and armR (origin at the shoulder, 196, 240; a grabby little
 * hand at about 238, 288).
 *
 * Layout in the 300 × 340 box: cap 82-230 × 44-148, ears out to x 56 / 244,
 * tunic 98-202 × 216-318, bare feet along y 330.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';
import { H, W } from './people';

const SKIN = '#c4a07a';
const SKIN_DARK = '#a8825c';
const CAP = '#c23a32';
const CAP_DARK = '#8f2824';
const BRIM = '#d9766c';
const TUNIC = '#8a5a3b';
const TUNIC_DARK = '#6b4430';
const TURNIP = '#dcaab6';
const TURNIP_TOP = '#a8688c';

export function redCap(): string {
  const stitch = (x1: number, y1: number, x2: number, y2: number) => ink([[x1, y1], [x2, y2]], { width: 2.4, color: CAP_DARK });
  const arm = (side: 1 | -1): Node[] => [
    piece(band([[150 + side * 46, 242], [150 + side * 78, 262], [150 + side * 90, 284]], 15), SKIN),
    piece(circle(150 + side * 91, 288, 10), SKIN, { edge: 'cut' }),
    ...[-6, 0, 6].map((d) => piece(circle(150 + side * (91 + d * 0.6), 297 + Math.abs(d) * 0.1, 3.6), SKIN, { edge: 'cut', fibre: false, shadow: false })),
  ];

  return svg({ w: W, h: H, name: 'hogwarts-redCap', label: 'a Red Cap', className: 'portrait' }, [
    piece(ellipse(150, 334, 70, 8), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      // bare feet and skinny legs
      piece(band([[126, 306], [124, 322]], 12), SKIN_DARK),
      piece(band([[174, 306], [176, 322]], 12), SKIN_DARK),
      piece(ellipse(120, 330, 20, 8), SKIN),
      piece(ellipse(180, 330, 20, 8), SKIN),
      ...[104, 112, 120, 128, 172, 180, 188, 196].map((x) => piece(circle(x - (x < 150 ? 4 : -4) + (x < 150 ? 0 : 0), 328 + (x % 16 === 0 ? 1 : 0), 3.4), SKIN, { edge: 'cut', fibre: false, shadow: false })),
      // tunic, ragged at the hem, with a patch and a rope belt
      piece(curve([[94, 322], [98, 244], [150, 214], [202, 244], [206, 322], [184, 312], [166, 322], [150, 312], [132, 322], [114, 312]], 1), TUNIC),
      piece(poly([[120, 270], [146, 270], [144, 292], [122, 292]]), '#b99a6a', { edge: 'torn', fibre: false, shadow: false }),
      ink([[124, 274], [142, 274]], { width: 1.8, color: TUNIC_DARK }),
      ink([[124, 288], [140, 288]], { width: 1.8, color: TUNIC_DARK }),
      piece(band([[98, 276], [150, 288], [202, 276]], 9), C.sand, { edge: 'cut', fibre: false }),
      piece(circle(172, 286, 7), C.sand, { edge: 'cut', fibre: false }),
      ...arm(-1),

      group({ part: 'head', origin: [150, 230] }, [
        // pointy ears, poking out below the cap
        piece(poly([[98, 152], [54, 128], [98, 176]]), SKIN),
        piece(poly([[202, 152], [246, 128], [202, 176]]), SKIN),
        piece(poly([[94, 154], [68, 140], [94, 170]]), SKIN_DARK, { fibre: false, shadow: false }),
        piece(poly([[206, 154], [232, 140], [206, 170]]), SKIN_DARK, { fibre: false, shadow: false }),
        // the knobbly head
        piece(curve([[92, 150], [100, 120], [150, 112], [200, 120], [208, 150], [196, 202], [150, 214], [104, 202]], 2), SKIN),
        piece(circle(118, 182, 5), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(190, 178, 4.5), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(172, 128, 4), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),

        // small beady eyes
        piece(circle(126, 150, 11), C.white, { edge: 'cut', fibre: false }),
        piece(circle(174, 150, 11), C.white, { edge: 'cut', fibre: false }),
        piece(circle(129, 153, 5.5), C.ink, { edge: 'clean', shadow: false }),
        piece(circle(177, 153, 5.5), C.ink, { edge: 'clean', shadow: false }),
        dot(127.5, 151, 1.8, C.white),
        dot(175.5, 151, 1.8, C.white),
        group({ part: 'lids', opacity: 0 }, [126, 174].flatMap((x) => [
          piece(circle(x, 150, 12.5), SKIN, { edge: 'cut', fibre: false, shadow: false }),
          ink([[x - 9, 152], [x, 157], [x + 9, 152]], { width: 2.5, color: C.ink }),
        ])),
        // a cheeky scowl: brows slanting in, one a bit higher
        ink([[110, 134], [140, 144]], { width: 5, color: C.brownDark }),
        ink([[190, 138], [160, 144]], { width: 5, color: C.brownDark }),

        // turnip nose with a sprout
        piece(ellipse(150, 170, 19, 16), TURNIP),
        piece(curve([[134, 164], [150, 156], [166, 164], [150, 168]], 1), TURNIP_TOP, { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(146, 156, 3.5, 7, -30), C.green, { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(155, 155, 3.5, 7, 30), C.green, { edge: 'cut', fibre: false, shadow: false }),

        // mouth: a sulky smirk, with one tooth
        group({ part: 'mouth' }, [
          ink([[128, 194], [142, 190], [158, 190], [172, 186]], { width: 4, color: C.brownDark }),
          piece(poly([[148, 191], [155, 191], [152, 198]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
        ]),
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(ellipse(150, 194, 20, 11), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(poly([[138, 186], [146, 186], [142, 194]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
        ]),
        // the raspberry tongue (hidden; show it with the open mouth)
        group({ part: 'tongue', origin: [150, 192], opacity: 0 }, [
          piece(curve([[140, 194], [160, 194], [162, 208], [150, 216], [138, 208]], 2), '#e0707a', { edge: 'cut', fibre: false, shadow: false }),
          ink([[150, 196], [150, 208]], { width: 2, color: C.rose }),
        ]),

        // the big, pointy, woolly red cap, its tip flopping over to one side
        piece(curve([[82, 138], [96, 102], [128, 72], [168, 50], [208, 44], [230, 54], [204, 68], [182, 92], [208, 122], [218, 140], [150, 126]], 2), CAP),
        piece(poly([[120, 98], [150, 82], [168, 100], [140, 118]]), '#d4504a', { edge: 'torn', fibre: false, shadow: false }),
        piece(curve([[182, 90], [204, 68], [230, 54], [206, 46], [190, 70]], 1), CAP_DARK, { fibre: false, shadow: false }),
        stitch(104, 118, 112, 108), stitch(122, 108, 132, 98), stitch(140, 96, 150, 86),
        stitch(160, 100, 168, 112), stitch(186, 112, 196, 122), stitch(108, 128, 118, 124),
        // woolly rolled brim
        piece(curve([[80, 138], [88, 124], [150, 120], [212, 124], [220, 138], [212, 148], [150, 140], [88, 148]], 2), BRIM, { rough: 1.6 }),
        ...[96, 116, 136, 156, 176, 196].map((x) => ink([[x, 130], [x + 6, 138]], { width: 2, color: CAP_DARK })),
      ]),
      // right arm, from the shoulder: a grabby little hand
      group({ part: 'armR', origin: [196, 240] }, arm(1)),
    ]),
  ]);
}
