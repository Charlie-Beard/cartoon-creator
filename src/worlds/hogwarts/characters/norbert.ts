/**
 * Norbert, Hagrid's baby Norwegian Ridgeback (book 1; original paper art).
 *
 * A whole small dragon sitting up and filling the box: a round dark
 * green-black body with a pale belly, a big wide head with a friendly snout
 * and two tiny nostrils, huge round amber eyes with highlights, a row of
 * little bumpy ridges down his back (and up over his head), small crumpled
 * umbrella wings and a curly tail. Cute and a bit daft, never fierce.
 *
 * Parts: figure (everything), lids (hidden, for blinks), mouth and mouthOpen
 * (hidden: he squeaks and hiccups, he doesn't speak), wingL and wingR (origin
 * at each shoulder, so they flap) and tail (origin at its base, so it waves).
 *
 * Layout in the 300 x 340 box: the face sits inside 78 62 144 144 (eyes at
 * y 124, nostrils at y 164, mouth at y 186, snout tip about y 200); the wings
 * rise from shoulders at (96, 226) and (204, 226) out to x 10 and x 290; the
 * tail sprouts at (214, 302) and curls out to the right (x 290, y 270); the
 * feet sit on the ground at y 336.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';
import { H, W } from './people';

const BODY = '#2f4a3d';
const BODY_DARK = '#213629';
const BODY_LIGHT = '#456b56';
const BELLY = '#a9b27a';
const BELLY_LINES = '#7f8a56';
const RIDGE = '#7d5a3a';
const WING = '#5b7f5d';
const WING_BONE = '#1f3027';
const AMBER = '#f2a22c';
const AMBER_DEEP = '#d9701f';

/** A small bumpy ridge (a rounded triangle) standing on a point of the back. */
const ridge = (x: number, y: number, s = 1, rot = 0): Node =>
  piece(
    [[-9 * s, 4 * s], [-5 * s, -8 * s], [0, -14 * s], [5 * s, -8 * s], [9 * s, 4 * s]].map(
      ([dx, dy]) => {
        const a = (rot * Math.PI) / 180;
        return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)] as Pt;
      },
    ),
    RIDGE,
    { edge: 'cut', shadow: false },
  );

/** One crumpled umbrella wing; `s` is -1 for the left wing, 1 for the right. */
function wing(s: -1 | 1): Node {
  const sx = 150 + s * 54; // the shoulder
  const sy = 226;
  const p = (dx: number, dy: number): Pt => [150 + s * dx, dy];
  // fingertips of the umbrella, from low to high; the scallops dip between them
  const tips: Pt[] = [p(142, 196), p(138, 146), p(112, 104), p(80, 96)];
  const dips: Pt[] = [p(126, 192), p(122, 138), p(98, 116)];
  const edge: Pt[] = [[sx, sy + 8], p(110, 252), tips[0], dips[0], tips[1], dips[1], tips[2], dips[2], tips[3], [sx, sy - 14]];
  return group({ part: s < 0 ? 'wingL' : 'wingR', origin: [sx, sy] }, [
    piece(curve(edge, 1), WING, { rough: 1.2 }),
    // a few darker creases, like a crumpled umbrella
    piece(poly([[sx, sy], tips[0], dips[0], p(112, 208)]), '#4a6b4c', { fibre: false, shadow: false, edge: 'cut' }),
    piece(poly([[sx, sy - 6], tips[2], dips[2], p(84, 150)]), '#4a6b4c', { fibre: false, shadow: false, edge: 'cut' }),
    ...tips.map((t) => ink([[sx, sy], t], { width: 4, color: WING_BONE })),
    ...tips.map(([x, y]) => dot(x, y, 4.2, WING_BONE)),
  ]);
}

export function norbert(): string {
  return svg({ w: W, h: H, name: 'hogwarts-norbert', label: 'Norbert the baby dragon', className: 'portrait' }, [
    // a soft shadow on the ground
    piece(ellipse(150, 337, 118, 11), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'figure' }, [
      // the curly tail, behind the body (waves from its base)
      group({ part: 'tail', origin: [208, 304] }, [
        piece(band([[206, 306], [250, 324], [276, 308], [284, 276], [270, 250], [254, 254]], 28), BODY),
        piece(band([[206, 308], [244, 318], [274, 304]], 14), BODY_LIGHT, { fibre: false, shadow: false, edge: 'cut' }),
        ridge(250, 306, 0.8, 10),
        ridge(274, 292, 0.8, 50),
        ridge(284, 268, 0.75, 90),
        // the tip: a little arrow-head of bumpy paper
        piece(poly([[240, 250], [262, 232], [268, 260], [250, 262]]), RIDGE, { edge: 'cut' }),
      ]),
      // wings behind the shoulders
      wing(-1),
      wing(1),

      // ridges along his back, peeking up on either side of the head
      ridge(74, 226, 1.1, -38),
      ridge(226, 226, 1.1, 38),
      ridge(56, 262, 1, -62),
      ridge(244, 262, 1, 62),

      // the round body
      piece(curve([[52, 300], [46, 262], [84, 226], [150, 214], [216, 226], [254, 262], [248, 300], [210, 336], [90, 336]], 2), BODY),
      piece(ellipse(150, 288, 52, 54), BELLY),
      // belly stripes
      ...[260, 280, 300, 320].map((y, i) => ink([[150 - 34 + i * 3, y], [150, y + 7], [150 + 34 - i * 3, y]], { width: 3, color: BELLY_LINES })),
      // tiny arms, hands tucked up on the tummy
      piece(ellipse(100, 272, 14, 24, 28), BODY_LIGHT),
      piece(ellipse(200, 272, 14, 24, -28), BODY_LIGHT),
      ...[-1, 1].flatMap((s) =>
        [-6, 0, 6].map((d) => piece(poly([[150 + s * 82 + d * s, 288], [150 + s * 82 + d * s + 4, 300], [150 + s * 82 + d * s - 4, 300]]), C.cream, { edge: 'clean', fibre: false, shadow: false })),
      ),
      // big feet with little claws
      piece(ellipse(104, 328, 34, 14), BODY_LIGHT),
      piece(ellipse(196, 328, 34, 14), BODY_LIGHT),
      ...[-1, 1].flatMap((s) =>
        [-18, -6, 6, 18].map((d) => piece(poly([[150 + s * 46 + d - 4, 332], [150 + s * 46 + d + 4, 332], [150 + s * 46 + d, 342]]), C.cream, { edge: 'clean', fibre: false, shadow: false })),
      ),

      // the head
      group({ part: 'head', origin: [150, 206] }, [
        // ridges over the crown
        ridge(150, 74, 1.2),
        ridge(118, 80, 1, -24),
        ridge(182, 80, 1, 24),
        // little horns
        piece(poly([[96, 90], [78, 56], [118, 78]]), RIDGE, { edge: 'cut' }),
        piece(poly([[204, 90], [222, 56], [182, 78]]), RIDGE, { edge: 'cut' }),
        // wide round head and cheeks
        piece(curve([[76, 140], [84, 96], [150, 76], [216, 96], [224, 140], [206, 190], [150, 204], [94, 190]], 2), BODY),
        piece(ellipse(150, 100, 52, 14), BODY_LIGHT, { fibre: false, shadow: false, edge: 'cut', opacity: 0.6 }),
        // the wide friendly snout
        piece(ellipse(150, 170, 52, 34), BODY_LIGHT),
        piece(ellipse(150, 186, 40, 17), '#5d8268', { edge: 'cut', fibre: false, shadow: false }),
        // two tiny nostrils (and the pink of a blush)
        piece(ellipse(137, 160, 3.6, 5, 15), C.ink, { edge: 'clean', shadow: false }),
        piece(ellipse(163, 160, 3.6, 5, -15), C.ink, { edge: 'clean', shadow: false }),
        piece(ellipse(100, 160, 13, 8), C.rose, { edge: 'cut', fibre: false, shadow: false, opacity: 0.4 }),
        piece(ellipse(200, 160, 13, 8), C.rose, { edge: 'cut', fibre: false, shadow: false, opacity: 0.4 }),
        // big round amber eyes
        ...[-1, 1].flatMap((s) => {
          const x = 150 + s * 40;
          return [
            piece(circle(x, 124, 25), AMBER, { edge: 'cut', fibre: false }),
            piece(circle(x, 126, 17), AMBER_DEEP, { edge: 'clean', shadow: false }),
            piece(ellipse(x, 127, 7.5, 13), C.ink, { edge: 'clean', shadow: false }),
            dot(x - 8, 116, 6.5, C.white),
            dot(x + 7, 134, 3, C.white),
          ];
        }),
        group({ part: 'lids', opacity: 0 }, [-1, 1].flatMap((s) => [
          piece(circle(150 + s * 40, 124, 26.5), BODY, { edge: 'cut', fibre: false, shadow: false }),
          ink([[150 + s * 40 - 20, 126], [150 + s * 40, 134], [150 + s * 40 + 20, 126]], { width: 3, color: C.ink }),
        ])),
        // a soft frown-less brow ridge over each eye
        ...[-1, 1].map((s) => ink([[150 + s * 62, 98], [150 + s * 40, 92], [150 + s * 20, 98]], { width: 5, color: BODY_DARK })),
        // the mouth: a wide smile ...
        group({ part: 'mouth' }, [
          ink([[110, 180], [130, 192], [150, 194], [170, 192], [190, 180]], { width: 4, color: BODY_DARK }),
          ink([[108, 177], [112, 184]], { width: 3, color: BODY_DARK }),
          ink([[192, 177], [188, 184]], { width: 3, color: BODY_DARK }),
        ]),
        // ... and open for a squeak, a tongue and no teeth to speak of
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(curve([[110, 178], [150, 184], [190, 178], [180, 204], [150, 210], [120, 204]], 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(ellipse(150, 203, 20, 7), C.rose, { edge: 'clean', fibre: false, shadow: false }),
          piece(poly([[126, 180], [133, 180], [129, 189]]), C.cream, { edge: 'clean', fibre: false, shadow: false }),
          piece(poly([[167, 180], [174, 180], [171, 189]]), C.cream, { edge: 'clean', fibre: false, shadow: false }),
        ]),
      ]),
    ]),
  ]);
}
