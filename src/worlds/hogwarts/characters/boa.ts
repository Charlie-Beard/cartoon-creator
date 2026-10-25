/**
 * The boa constrictor from the zoo's reptile house: a huge, friendly, funny
 * snake. Fat olive-and-brown coils on the floor, the front of the body
 * rising in a curve to a big kind face looking straight out. Her eyes are
 * bigger and rounder than Nagini's or the basilisk's, with a small smile,
 * so she can never look scary.
 *
 * Parts: head (origin at the neck, so it can sway or rise), lids (both
 * blink), wink (ONE eye's lid, hidden until a script shows it: the gag),
 * mouth / mouthOpen (talking), tongue (hidden, flicks).
 */
import { C } from '../../../art/palette';
import { band, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../../art/paper';

const OLIVE = '#7d8a3c';
const OLIVE_LIGHT = '#9aa650';
const OLIVE_DARK = '#5c6a2c';
const BROWN = '#6a4a26';
const BELLY = '#e8d9a0';

/** A dark diamond blotch on the back, like a real boa's saddle marks. */
const blotch = (x: number, y: number, s = 1, rot = 0): Node =>
  piece(
    ellipse(x, y, 11 * s, 7 * s, rot),
    BROWN,
    { edge: 'cut', fibre: false, shadow: false },
  );

export function boa(): string {
  const eye = (x: number): Node[] => [
    piece(ellipse(x, 124, 19, 20), C.white, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, 126, 12, 13), '#b8782e', { edge: 'clean', shadow: false }),
    piece(ellipse(x, 126, 7, 8), C.ink, { edge: 'clean', shadow: false }),
    dot(x - 4, 120, 4, C.white),
  ];
  const lid = (x: number): Node[] => [
    piece(ellipse(x, 124, 21, 22), OLIVE_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 16, 128], [x, 134], [x + 16, 128]], { width: 3, color: OLIVE_DARK }),
  ];

  return svg({ w: 300, h: 340, name: 'hogwarts-boa', label: 'The boa constrictor', className: 'portrait' }, [
    // shadow on the floor
    piece(ellipse(150, 322, 138, 12), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    // the coils on the ground: a fat bottom loop, a second on top of it
    piece(ellipse(150, 290, 140, 40), OLIVE),
    piece(ellipse(150, 296, 118, 22), OLIVE_LIGHT, { fibre: false, shadow: false, opacity: 0.55 }),
    ...[30, 70, 112, 156, 200, 242, 272].map((x, i) => blotch(x, 284 + (i % 2) * 10, 1.1, i % 2 ? -20 : 20)),
    piece(ellipse(160, 246, 104, 34), OLIVE_DARK),
    piece(ellipse(160, 244, 98, 29), OLIVE),
    ...[88, 128, 170, 212].map((x, i) => blotch(x, 240 + (i % 2) * 6, 1, i % 2 ? -15 : 15)),
    // the neck rising from the coil in a gentle S, with a pale belly down the front
    piece(band([[198, 250], [226, 214], [206, 176], [160, 150]], 64), OLIVE),
    ...[[222, 222], [214, 190], [192, 166]].map(([x, y]) => blotch(x, y, 0.9, 40)),
    piece(band([[198, 252], [218, 218], [200, 184], [162, 160]], 20), BELLY, { fibre: false, shadow: false, opacity: 0.85 }),
    // the head, hinged at the neck so it can sway and rise
    group({ part: 'head', origin: [152, 168] }, [
      // tongue first, so it flicks out from under the smile
      group({ part: 'tongue', origin: [152, 172], opacity: 0 }, [
        ink([[152, 168], [152, 192], [152, 208]], { width: 4, color: C.red }),
        ink([[152, 208], [142, 222]], { width: 4, color: C.red }),
        ink([[152, 208], [164, 222]], { width: 4, color: C.red }),
      ]),
      // wide, soft head with a pale chin
      piece(curve([[86, 130], [96, 90], [152, 76], [208, 90], [218, 130], [204, 168], [152, 184], [100, 168]], 3), OLIVE_LIGHT),
      piece(curve([[104, 150], [152, 142], [200, 150], [190, 174], [152, 182], [114, 174]], 3), BELLY, { fibre: false, shadow: false, opacity: 0.9 }),
      // brown stripe over the top of the head and little markings
      piece(poly([[132, 82], [172, 82], [162, 104], [142, 104]]), BROWN, { edge: 'cut', fibre: false, shadow: false }),
      // cheeks
      piece(ellipse(100, 150, 11, 7), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
      piece(ellipse(204, 150, 11, 7), C.pink, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
      // nostrils
      dot(144, 146, 2, OLIVE_DARK),
      dot(160, 146, 2, OLIVE_DARK),
      // big kind eyes
      ...eye(120),
      ...eye(184),
      // both lids: a blink
      group({ part: 'lids', opacity: 0 }, [...lid(120), ...lid(184)]),
      // just the viewer's-right eye: a wink
      group({ part: 'wink', opacity: 0 }, lid(184)),
      // little eyebrow ridges, raised and pleased
      ink([[100, 98], [118, 92], [138, 98]], { width: 3, color: OLIVE_DARK }),
      ink([[166, 98], [186, 92], [204, 98]], { width: 3, color: OLIVE_DARK }),
      // a small smile, and the same place open for talking
      group({ part: 'mouth' }, [ink([[118, 164], [136, 174], [152, 176], [168, 174], [186, 164]], { width: 3.5, color: BROWN })]),
      group({ part: 'mouthOpen', opacity: 0 }, [
        piece(curve([[116, 162], [152, 160], [188, 162], [176, 184], [152, 192], [128, 184]], 3), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(152, 184, 16, 6), C.rose, { edge: 'clean', fibre: false, shadow: false }),
      ]),
    ]),
  ]);
}
