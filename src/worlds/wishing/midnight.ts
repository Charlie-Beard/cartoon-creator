/**
 * Midnight: Witch Hazel's small, fluffy black cat.
 *
 * A round black head with two pointed ears (pink inside), big round green
 * eyes, a pink nose, long pale whiskers, a red collar with a silver bell.
 * Soft lighter flicks in the fur and a pale rim so he reads against a dark
 * night wood. He has no lines: he only miaows and purrs (as sounds).
 *
 * Poses (the portrait itself is Midnight sitting up, curious):
 *   scared  all his fur on end (a spiky outline), eyes huge and round,
 *           ears back, clinging to a bit of branch with both paws.
 *   purr    curled up in a contented ball, eyes shut in happy arcs.
 *
 * Parts: figure, head, eyes, lids, mouth, mouthOpen, tail (pivots at its
 * root: swish it).
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { CUT, FLAT, portrait } from '../faraway/parts';

type Mood = 'plain' | 'scared' | 'purr';

const FUR = '#2e2c3c';
const FUR_LIGHT = '#4a4764';
const FUR_RIM = '#6c6a92';
const EYE = '#9be04f';
const EYE_DARK = '#5da02a';
const NOSE = '#e88aa0';
const WHISKER = '#e6e2f0';
const COLLAR = C.coatRed;
const BELL = '#d6dce4';
const BRANCH = '#6b4a32';
const BRANCH_LIGHT = '#8a6446';

/** Short pale flicks of fur light, scattered along a curve of points. */
function flicks(pts: Pt[], len = 14): Node[] {
  return pts.map(([x, y], i) => ink([[x, y], [x + (i % 2 ? 4 : -4), y + len]], { width: 2.2, color: FUR_RIM, opacity: 0.6, wobble: 0.3 }));
}

/** A spiky "fur on end" outline round a centre, as a ring of points that alternate in and out. */
function spiky(x: number, y: number, rx: number, ry: number, n: number, spike: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const k = i % 2 ? 1 : 1 + spike;
    out.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]);
  }
  return out;
}

/** One round green eye with a pupil: `pupil` is its half-width (a thin slit when calm, round when scared). */
function eye(x: number, y: number, r: number, pupil: number): Node[] {
  return [
    piece(circle(x, y, r + 3), WHISKER, { ...FLAT, opacity: 0.35 }),
    piece(circle(x, y, r), EYE, { edge: 'clean', shadow: false }),
    piece(circle(x, y + 2, r * 0.7), EYE_DARK, { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(ellipse(x, y, pupil, r * 0.85), '#14121c', { edge: 'clean', shadow: false }),
    dot(x - r * 0.3, y - r * 0.32, r * 0.24, '#ffffff'),
    dot(x + r * 0.28, y + r * 0.3, r * 0.1, '#ffffff', 0.8),
  ];
}

function ear(side: -1 | 1, flat: boolean): Node[] {
  const x = 150 + side * 52;
  const tipX = 150 + side * (flat ? 88 : 66);
  const tipY = flat ? 94 : 56;
  return [
    piece(poly([[x - side * 30, 112], [tipX, tipY], [x + side * 18, 134]]), FUR, CUT),
    piece(poly([[x - side * 18, 112], [tipX - side * 4, tipY + 20], [x + side * 8, 128]]), NOSE, { ...FLAT, opacity: 0.8 }),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const scared = mood === 'scared';
  const purr = mood === 'purr';

  // --- the head
  const head: Node[] = [];
  if (scared) {
    head.push(piece(spiky(150, 150, 70, 60, 11, 0.16), FUR, { edge: 'cut', fibre: false, rough: 0.8 }));
  }
  head.push(...ear(-1, scared), ...ear(1, scared));
  head.push(piece(ellipse(150, 150, 70, 60), FUR, { rough: 1.3 }));
  head.push(...flicks([[104, 106], [122, 96], [150, 92], [178, 96], [196, 106]], 12));
  // muzzle: a slightly lighter patch under the nose
  head.push(piece(ellipse(150, 178, 26, 18), FUR_LIGHT, { ...FLAT, opacity: 0.6 }));

  // --- eyes (big and round; huge when scared), lids to blink
  const ex = 31;
  const ey = 142;
  const eyes: Node[] = purr
    ? [
        ink([[ex * -1 + 150 - 15, ey + 4], [150 - ex, ey - 6], [150 - ex + 15, ey + 4]], { width: 4, color: EYE }),
        ink([[150 + ex - 15, ey + 4], [150 + ex, ey - 6], [150 + ex + 15, ey + 4]], { width: 4, color: EYE }),
      ]
    : [...eye(150 - ex, ey, scared ? 24 : 19, scared ? 6 : 5), ...eye(150 + ex, ey, scared ? 24 : 19, scared ? 6 : 5)];
  const lids: Node[] = [
    piece(ellipse(150 - ex, ey, 22, 21), FUR, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(150 + ex, ey, 22, 21), FUR, { edge: 'cut', fibre: false, shadow: false }),
    ink([[150 - ex - 14, ey + 3], [150 - ex, ey + 8], [150 - ex + 14, ey + 3]], { width: 3, color: EYE }),
    ink([[150 + ex - 14, ey + 3], [150 + ex, ey + 8], [150 + ex + 14, ey + 3]], { width: 3, color: EYE }),
  ];

  // --- nose, mouth, whiskers
  const nose: Node[] = [piece(poly([[141, 168], [159, 168], [150, 179]]), NOSE, CUT)];
  const whiskers: Node[] = [-1, 1].flatMap((s) => [
    ink([[150 + s * 30, 178], [150 + s * 70, 168]], { width: 1.8, color: WHISKER, opacity: 0.85, wobble: 0.2 }),
    ink([[150 + s * 30, 184], [150 + s * 74, 186]], { width: 1.8, color: WHISKER, opacity: 0.85, wobble: 0.2 }),
    ink([[150 + s * 28, 190], [150 + s * 66, 204]], { width: 1.8, color: WHISKER, opacity: 0.85, wobble: 0.2 }),
  ]);
  const mouth: Node[] = [
    group({ part: 'mouth', origin: [150, 190] }, [
      ink([[150, 179], [150, 186]], { width: 2.4, color: '#14121c' }),
      ink([[136, 188], [143, 192], [150, 186], [157, 192], [164, 188]], { width: 2.4, color: '#14121c' }),
    ]),
    group({ part: 'mouthOpen', origin: [150, 190], opacity: 0 }, [
      ink([[150, 179], [150, 184]], { width: 2.4, color: '#14121c' }),
      piece(ellipse(150, 194, 11, 10), '#4a1a2a', { edge: 'clean', shadow: false }),
      piece(ellipse(150, 198, 6, 4), NOSE, { edge: 'clean', shadow: false }),
    ]),
  ];

  // --- collar and bell
  const collar: Node[] = [
    piece(curve([[100, 200], [150, 218], [200, 200], [202, 212], [150, 230], [98, 212]], 2), COLLAR, { ...CUT, rough: 0.8 }),
    piece(circle(150, 232, 9), BELL, CUT),
    ink([[146, 228], [154, 228]], { width: 1.6, color: '#8a94a0' }),
    ink([[150, 232], [150, 241]], { width: 2, color: '#8a94a0' }),
    dot(147, 229, 2.2, '#ffffff', 0.9),
  ];

  // --- the body, tail and paws
  const body: Node[] = [];
  const tail = (pts: Pt[]): Node => group({ part: 'tail', origin: pts[0] }, [piece(curve(pts, 2), FUR, { rough: 1.3 }), ...flicks([pts[1]], 10)]);
  if (purr) {
    // a curled-up ball of cat: round back, tail wrapped round the front
    body.push(piece(ellipse(150, 268, 112, 62), FUR, { rough: 1.4 }));
    body.push(...flicks([[70, 236], [96, 224], [130, 218], [170, 218], [204, 224], [232, 236]], 14));
    body.push(tail([[238, 290], [270, 270], [276, 306], [230, 322], [150, 326], [86, 316], [92, 302], [150, 308], [220, 304]]));
    body.push(piece(ellipse(118, 296, 26, 16), FUR_LIGHT, { ...FLAT, opacity: 0.7 }));
    body.push(piece(ellipse(186, 296, 26, 16), FUR_LIGHT, { ...FLAT, opacity: 0.7 }));
  } else if (scared) {
    // crouched on a branch, back arched, fur on end, both paws gripping it
    body.push(piece(spiky(150, 276, 92, 50, 12, 0.14), FUR, { edge: 'cut', fibre: false, rough: 0.8 }));
    body.push(piece(ellipse(150, 276, 92, 50), FUR, { rough: 1.3 }));
    body.push(...flicks([[84, 252], [114, 244], [150, 240], [186, 244], [216, 252]], 12));
    body.push(tail([[236, 280], [270, 262], [282, 224], [264, 196]]));
  } else {
    // sitting up, front paws together, tail curled round
    body.push(piece(curve([[70, 345], [68, 270], [96, 226], [150, 214], [204, 226], [232, 270], [230, 345]], 2), FUR, { rough: 1.3 }));
    body.push(...flicks([[96, 246], [120, 236], [150, 232], [180, 236], [204, 246]], 12));
    body.push(piece(ellipse(130, 322, 20, 22), FUR_LIGHT, { ...FLAT, opacity: 0.8 }));
    body.push(piece(ellipse(170, 322, 20, 22), FUR_LIGHT, { ...FLAT, opacity: 0.8 }));
    body.push(tail([[226, 320], [262, 312], [276, 276], [258, 250]]));
  }

  // --- the branch he clings to (scared)
  const branch: Node[] = scared
    ? [
        piece(curve([[-10, 296], [80, 290], [220, 296], [310, 288], [310, 330], [220, 336], [80, 330], [-10, 336]], 2), BRANCH, { rough: 1.2 }),
        ink([[8, 306], [90, 302], [200, 308], [290, 302]], { width: 3, color: BRANCH_LIGHT, opacity: 0.8, wobble: 0.5 }),
        // two paws wrapped over it
        piece(ellipse(100, 300, 24, 17), FUR, CUT),
        piece(ellipse(200, 300, 24, 17), FUR, CUT),
        ...[88, 100, 112, 188, 200, 212].map((x) => ink([[x, 296], [x, 308]], { width: 1.8, color: FUR_RIM, opacity: 0.8 })),
      ]
    : [];

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 340] }, [
      ...body,
      ...(purr ? [] : []),
      group({ part: 'head', origin: [150, 200] }, [
        ...head,
        group({ part: 'eyes', origin: [150, ey] }, eyes),
        ...(purr ? [] : [group({ part: 'lids', origin: [150, ey], opacity: 0 }, lids)]),
        ...(purr ? [group({ part: 'lids', origin: [150, ey], opacity: 0 }, [])] : []),
        ...nose,
        ...whiskers,
        ...mouth,
        ...collar,
      ]),
      ...branch,
    ]),
  ]);
}

/** Midnight sitting up, curious, his bell on a red collar. */
export const midnight = cached((): string => draw('plain', 'wishing-midnight', 'Midnight the cat'));

/** Scared: fur on end, eyes huge, clinging to a branch. */
export const midnightScared = cached((): string => draw('scared', 'wishing-midnight-scared', 'Midnight, scared, clinging to a branch'));

/** Purring: curled up in a contented ball, eyes shut in happy arcs. */
export const midnightPurr = cached((): string => draw('purr', 'wishing-midnight-purr', 'Midnight, purring'));
