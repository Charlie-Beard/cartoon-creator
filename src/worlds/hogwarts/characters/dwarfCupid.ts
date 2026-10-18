/**
 * The cupid: one of Lockhart's grumpy dwarfs on Valentine's Day (book 2),
 * made to wear golden wings and a heart crown and deliver singing
 * valentines, which he does with a scowl. Short and stocky, but drawn as a
 * head-and-shoulders bust like everyone: a bald ruddy head with a few brown
 * tufts, a gold crown of paper hearts, heavy frowning brows, a bulbous nose,
 * and a huge bushy brown beard over a cream tunic with a raspberry sash.
 *
 * Parts: `figure` (everything), `head`, `lids`, `mouth` and `mouthOpen` (in
 * a gap under the moustache, so the beard never hides it), and two golden
 * wings, `wingL` and `wingR`, drawn behind the shoulders with their origins
 * at the shoulder joints (112, 256) and (188, 256) so they can flap.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';
import { heartPts } from '../objects/valentine';
import { H, W } from './people';

export function dwarfCupid(): string {
  const skin = '#d9a27c';
  const skinDark = '#c0866a';
  const nose = '#cf7a62';
  const hair = '#6b4428';
  const hairDark = '#47301d';
  const hairLight = '#8f6238';
  const sash = C.raspberry;

  // One golden wing: three feathers fanned from the shoulder (bx, by).
  // s is -1 for the left wing, 1 for the right.
  const wing = (s: -1 | 1, bx: number, by: number): Node[] => {
    const feathers: Array<[number, number, string]> = [
      [20, 96, C.gold],
      [-12, 104, C.goldLight],
      [-44, 90, C.gold],
    ];
    return feathers.map(([deg, len, col]) => {
      // left wing points left and up; mirror for the right
      const a = s < 0 ? Math.PI + (deg * Math.PI) / 180 : -(deg * Math.PI) / 180;
      const rot = (a * 180) / Math.PI;
      const cx = bx + Math.cos(a) * (len / 2);
      const cy = by + Math.sin(a) * (len / 2);
      return piece(ellipse(cx, cy, len / 2, 15, rot), col, { edge: 'cut' });
    });
  };

  // one heavy, scowling eyebrow: low at the nose, high at the outside
  const brow = (s: number): Node[] => [
    piece(band([[150 + s * 12, 128], [150 + s * 40, 114], [150 + s * 66, 104]], 15), hairDark, { rough: 1.6 }),
    piece(band([[150 + s * 16, 124], [150 + s * 44, 109], [150 + s * 60, 104]], 8), hair, { rough: 1.6, fibre: false, shadow: false }),
  ];

  return svg({ w: W, h: H, name: 'hogwarts-dwarfCupid', label: 'the cupid', className: 'portrait' }, [
    piece(ellipse(150, 334, 120, 12), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      // golden wings, behind the shoulders
      group({ part: 'wingL', origin: [112, 256] }, wing(-1, 112, 256)),
      group({ part: 'wingR', origin: [188, 256] }, wing(1, 188, 256)),

      // cream tunic, with a raspberry sash from the left shoulder to the right hip
      piece(curve([[38, 345], [48, 266], [102, 236], [150, 230], [198, 236], [252, 266], [262, 345]], 2), C.cream),
      piece(poly([[70, 252], [100, 240], [264, 330], [264, 358], [236, 358]]), sash, { edge: 'cut' }),
      ink([[80, 252], [250, 342]], { width: 2, color: C.raspberryDark, opacity: 0.6 }),
      piece(heartPts(228, 320, 15, -10), C.white, { edge: 'cut', fibre: false }),
      piece(heartPts(228, 320, 8, -10), C.red, { edge: 'clean', fibre: false, shadow: false }),

      group({ part: 'head', origin: [150, 230] }, [
        // little ears
        piece(ellipse(80, 148, 11, 15), skin),
        piece(ellipse(220, 148, 11, 15), skin),
        // the round, ruddy head
        piece(ellipse(150, 140, 68, 64), skin),
        // a few brown tufts either side of the bald top
        piece(curve([[84, 116], [78, 96], [96, 88], [102, 108]], 2), hair, { rough: 1.8 }),
        piece(curve([[216, 116], [222, 96], [204, 88], [198, 108]], 2), hair, { rough: 1.8 }),
        // rosy cheeks
        piece(ellipse(104, 160, 15, 10), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
        piece(ellipse(196, 160, 15, 10), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),

        // gold crown of hearts
        piece(curve([[96, 98], [108, 80], [150, 72], [192, 80], [204, 98], [190, 92], [150, 86], [110, 92]], 1), C.gold, { edge: 'cut' }),
        piece(heartPts(112, 72, 13, -14), C.red, { edge: 'cut', fibre: false }),
        piece(heartPts(150, 60, 18), C.raspberry, { edge: 'cut', fibre: false }),
        piece(heartPts(188, 72, 13, 14), C.red, { edge: 'cut', fibre: false }),
        dot(144, 52, 3, C.white, 0.8),

        // small, cross eyes
        piece(circle(122, 146, 11), C.white, { edge: 'cut', fibre: false }),
        piece(circle(178, 146, 11), C.white, { edge: 'cut', fibre: false }),
        piece(circle(124, 149, 6), C.brownDark, { edge: 'clean', shadow: false }),
        piece(circle(176, 149, 6), C.brownDark, { edge: 'clean', shadow: false }),
        dot(122, 147, 2, C.white),
        dot(174, 147, 2, C.white),
        group({ part: 'lids', opacity: 0 }, [122, 178].flatMap((x) => [
          piece(ellipse(x, 146, 13, 13), skin, { edge: 'cut', fibre: false, shadow: false }),
          ink([[x - 11, 150], [x, 154], [x + 11, 150]], { width: 2.5, color: C.ink }),
        ])),
        // heavy brows, over the lids so they stay put
        ...brow(-1),
        ...brow(1),

        // big bulbous nose
        piece(ellipse(150, 168, 26, 21), nose),
        piece(ellipse(142, 161, 9, 6, -20), '#e3a08a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
        ink([[138, 182], [150, 186], [162, 182]], { width: 2.5, color: skinDark }),

        // huge bushy beard, with a gap for the mouth and the moustache over it
        piece(curve([[76, 164], [82, 212], [94, 262], [120, 300], [150, 318], [180, 300], [206, 262], [218, 212], [224, 164], [150, 188]], 1), hair, { rough: 2 }),
        piece(poly([[96, 232], [110, 296], [130, 250]]), hairDark, { fibre: false, shadow: false }),
        piece(poly([[170, 250], [190, 296], [204, 232]]), hairDark, { fibre: false, shadow: false }),
        piece(poly([[126, 270], [150, 324], [174, 270]]), hairLight, { rough: 2, fibre: false }),
        ink([[112, 222], [118, 262]], { width: 2.5, color: hairDark }),
        ink([[188, 222], [182, 262]], { width: 2.5, color: hairDark }),
        ink([[150, 240], [150, 280]], { width: 2.5, color: hairDark }),
        piece(ellipse(150, 204, 24, 13), skinDark, { edge: 'cut', fibre: false, shadow: false }),
        group({ part: 'mouth' }, [
          ink([[130, 210], [150, 201], [170, 210]], { width: 4.5, color: C.redDark }),
        ]),
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(ellipse(150, 207, 19, 14), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(ellipse(150, 213, 10, 5), C.rose, { edge: 'clean', fibre: false, shadow: false }),
        ]),
        // the moustache: two bristly curls
        piece(curve([[150, 182], [128, 176], [96, 186], [84, 208], [112, 198], [140, 196]], 1), hairLight, { rough: 1.5 }),
        piece(curve([[150, 182], [172, 176], [204, 186], [216, 208], [188, 198], [160, 196]], 1), hairLight, { rough: 1.5 }),
      ]),
    ]),
  ]);
}
