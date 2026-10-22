/**
 * Giant Grumble: the grumpy giant of the Wishing-Chair stories. Like Giant
 * Rumbletum (faraway) he is so big that only his face and one great hand fit
 * in the portrait, and the face fills it. Where Rumbletum is ginger and
 * jolly, Grumble is a big grey bush: wild grey hair, a bushy beard, huge
 * shaggy eyebrows, a round red nose, small cross eyes, and a patched
 * dark-green coat collar at the bottom. Grumpy, never horrible: his mouth is
 * a sulky bump in his moustache and his teeth never show.
 *
 * The top of his head is left as plain hair so a nightcap can be dragged on.
 * Features sit inside the chip box (78 62 144 144), so no `chip` is needed.
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, hand (origin at
 * the wrist).
 */
import { C } from '../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, type Node } from '../../art/paper';
import { CUT, FLAT, cx, fluff, framed, portrait } from '../faraway/parts';

type Mood = 'grump' | 'roar' | 'sleep' | 'beam';

const HAIR = C.hairGrey;
const HAIR_SHADE = '#a9a398';
const BROW = '#8b867d';
const SKIN = C.skinShade;
const NOSE = '#cf5b4a';
const COAT = C.greenDeep;
const PATCH = '#b8864a';

function draw(mood: Mood, name: string, label: string): string {
  const roar = mood === 'roar';
  const sleep = mood === 'sleep';
  const beam = mood === 'beam';
  const EX = 36; // half the distance between his eyes
  const EY = 118;

  // one small cross-eyed eye: pupils turn in toward the big nose
  const eye = (x: number, side: number): Node[] => {
    if (sleep) return [ink([[x - 14, EY - 2], [x, EY + 6], [x + 14, EY - 2]], { width: 3.6, color: C.ink })];
    return [
      piece(ellipse(x, EY, 14, 13), C.white, FLAT),
      piece(circle(x + side * 6.5, EY + 1.5, 6.6), C.greenDark, { edge: 'clean', shadow: false }),
      piece(circle(x + side * 6.5, EY + 1.5, 3.4), C.ink, { edge: 'clean', shadow: false }),
      dot(x + side * 4.5, EY - 1, 1.5, C.white),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(ellipse(x, EY, 15, 14), SKIN, FLAT),
    ink([[x - 12, EY + 1], [x, EY + 7], [x + 12, EY + 1]], { width: 3, color: C.ink }),
  ];

  // shaggy brows: a few overlapping tufts each side
  const tuft = (x: number, y: number, tilt: number, len: number): Node =>
    piece(curve([[x - len, y - tilt], [x - len * 0.2, y - 12 - tilt * 0.4], [x + len, y - 7 + tilt], [x + len * 0.7, y + 9 + tilt], [x - len * 0.3, y + 8]], 2), BROW, { rough: 1.6 });
  const browSide = (side: number): Node[] => {
    const x = cx + side * 40;
    // roar: slanting down toward the nose and knotted; sleep: soft and high
    const t = (roar ? 18 : sleep || beam ? -3 : 5) * side * -1; // tilt of the outer end
    const y = roar ? 92 : sleep ? 90 : beam ? 86 : 96;
    return [tuft(x, y, t * 0.6, 34), tuft(x - side * 6, y - 10 + (roar ? 6 : 0), t * 0.4, 28), tuft(x + side * 12, y + 2, t * 0.8, 22)];
  };

  // the mouth sits in a gap in the moustache
  const MY = 208;
  // a great round roaring mouth: no teeth, just a big red hole and a tongue
  const roarMouth: Node[] = [
    piece(ellipse(cx, MY + 6, 32, 26), C.redDark, FLAT),
    piece(ellipse(cx, MY + 20, 20, 9), C.rose, { edge: 'clean', shadow: false }),
  ];
  const mouth: Node[] = sleep
    ? [piece(ellipse(cx, MY + 2, 9, 11), C.redDark, FLAT), piece(ellipse(cx, MY + 8, 6, 3), C.rose, { edge: 'clean', shadow: false })]
    : roar
      ? roarMouth
      : beam
        ? [ink([[cx - 26, MY - 2], [cx - 8, MY + 12], [cx + 8, MY + 12], [cx + 26, MY - 2]], { width: 5, color: C.redDark })]
        : [ink([[cx - 16, MY + 8], [cx - 6, MY], [cx + 6, MY], [cx + 16, MY + 8]], { width: 4.2, color: C.redDark })];
  const mouthOpen: Node[] = roar
    ? roarMouth
    : [
        piece(curve([[cx - 17, MY - 2], [cx + 17, MY - 2], [cx + 13, MY + 17], [cx - 13, MY + 17]], 2), C.redDark, FLAT),
        piece(ellipse(cx, MY + 12, 9, 4), C.rose, { edge: 'clean', shadow: false }),
      ];

  // his hand: resting at the bottom right, or raised in a roar
  const sleeve = piece(curve([[212, 352], [214, 312], [244, 304], [286, 306], [300, 330], [300, 352]], 2), COAT);
  const hand: Node = roar
    ? group({ part: 'hand', origin: [252, 330] }, [
        piece(curve([[214, 352], [220, 330], [244, 322], [284, 324], [300, 340], [300, 352]], 2), COAT),
        // a big open hand held up beside his face, fingers spread
        piece(curve([[222, 300], [226, 262], [252, 250], [284, 262], [292, 300], [284, 326], [236, 326]], 2), SKIN),
        ...[
          [214, 214, -14],
          [236, 196, -5],
          [260, 192, 3],
          [284, 202, 13],
        ].map(([x, y, r]) => piece(ellipse(x, y + 24, 11, 30, r), SKIN, CUT)),
        piece(ellipse(210, 288, 11, 24, -50), SKIN, CUT),
      ])
    : group({ part: 'hand', origin: [256, 330] }, [
        // a big hand resting on the bottom edge, fingers curled
        piece(curve([[214, 350], [222, 312], [250, 300], [284, 306], [300, 330], [300, 350]], 2), SKIN),
        ...[0, 1, 2].map((i) => piece(rect(226 + i * 22, 282 - (i === 1 ? 7 : 0), 20, 40, 10), SKIN, CUT)),
        piece(ellipse(212, 316, 11, 22, -30), SKIN, CUT),
        sleeve,
      ]);

  return portrait(name, label, [
    framed(name, [
      group({ part: 'figure', origin: [150, 340] }, [
        // the patched dark-green coat collar at the bottom
        piece(curve([[8, 372], [12, 300], [40, 276], [110, 290], [150, 316], [190, 290], [260, 276], [288, 300], [292, 372]], 2), COAT),
        piece(poly([[40, 276], [104, 296], [70, 350], [20, 320]]), '#3a5c48', { rough: 0.8 }),
        piece(poly([[260, 276], [196, 296], [230, 350], [280, 320]]), '#3a5c48', { rough: 0.8 }),
        // a square patch, stitched on
        piece(rect(34, 308, 34, 30, 2), PATCH, { edge: 'cut' }),
        ink([[38, 312], [64, 312], [64, 334], [38, 334], [38, 312]], { width: 1.8, color: 'rgba(60,40,20,0.7)', wobble: 0.4 }),
        group({ part: 'head', origin: [150, 340] }, [
          piece(ellipse(24, 172, 22, 44), SKIN),
          piece(ellipse(276, 172, 22, 44), SKIN),
          piece(ellipse(150, 168, 132, 140), SKIN),
          // wild grey hair, standing out at the sides, plain on top
          fluff([[15, 150], [23, 60], [57, 39], [103, 25], [150, 22], [197, 25], [243, 39], [277, 60], [285, 150], [253, 92], [227, 60], [198, 48], [150, 55], [102, 48], [73, 60], [47, 92]], HAIR, 12),
          fluff([[15, 150], [8, 110], [21, 84], [40, 112], [49, 150]], HAIR_SHADE, 14),
          fluff([[285, 150], [292, 110], [279, 84], [260, 112], [251, 150]], HAIR_SHADE, 14),
          // cheeks flushed a grumpy pink
          piece(ellipse(cx - 62, 160, 17, 11), C.rose, { ...FLAT, opacity: 0.55 }),
          piece(ellipse(cx + 62, 160, 17, 11), C.rose, { ...FLAT, opacity: 0.55 }),
          group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX, -1), ...eye(cx + EX, 1)]),
          group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
          // the big round red nose
          piece(ellipse(cx, 160, 26, 23), NOSE, CUT),
          dot(cx - 9, 151, 6, C.white, 0.4),
          // the bushy beard, with the moustache over the top of the mouth
          fluff([[16, 120], [47, 170], [90, 192], [124, 202], [150, 198], [176, 202], [210, 192], [253, 170], [284, 120], [279, 250], [253, 296], [215, 304], [184, 292], [150, 312], [116, 292], [85, 304], [47, 296], [21, 250]], HAIR, 12),
          fluff([[40, 250], [90, 236], [130, 280], [150, 262], [170, 280], [210, 236], [260, 250], [230, 290], [150, 300], [70, 290]], HAIR_SHADE, 12, { opacity: 0.55 }),
          group({ part: 'mouth', origin: [cx, MY] }, mouth),
          group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, mouthOpen),
          fluff([[cx - 74, 188], [cx - 36, 176], [cx, 184], [cx + 36, 176], [cx + 74, 188], [cx + 62, 214], [cx + 24, 198], [cx, 199], [cx - 24, 198], [cx - 62, 214]], '#dcd6cb', 12),
          group({ part: 'brows', origin: [cx, 96] }, [...browSide(-1), ...browSide(1)]),
        ]),
        hand,
      ]),
    ]),
  ]);
}

/** Giant Grumble, grumbling: eyes crossed, a sulky mouth, one hand at the bottom. */
export const grumble = (): string => draw('grump', 'wishing-grumble', 'Giant Grumble');

/** Roaring: mouth wide, brows down and knotted, the hand raised. */
export const grumbleRoar = (): string => draw('roar', 'wishing-grumble-roar', 'Giant Grumble roaring');

/** Beaming: brows up and a big smile under the moustache (when he's pleased at last). */
export const grumbleBeam = (): string => draw('beam', 'wishing-grumble-beam', 'Giant Grumble beaming');

/** Asleep and snoring, with a little smile. */
export const grumbleSleep = (): string => draw('sleep', 'wishing-grumble-sleep', 'Giant Grumble asleep');
