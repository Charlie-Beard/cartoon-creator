/**
 * Mr Bunloaf, the Birthday Baker of the Land of Birthdays: a small, plump,
 * bustling brownie baker. A tall white chef's hat that puffs up like a loaf
 * and flops over to one side, little pointed brownie ears, a round pink face
 * with big rosy cheeks, a round nose dusted with flour, a curly ginger
 * moustache, a red-and-white striped shirt with the sleeves rolled up to the
 * elbow, a white apron tied round his round tummy, and a wooden spoon with a
 * dab of pink icing on it, always in his right hand.
 *
 * Silhouette: the big floppy white hat and the wooden spoon held up. He faces
 * the front (no flip needed either way).
 *
 * The face sits centred on (150, 136): eyes at y 130, nose at 148, moustache
 * at 162, mouth at 184 under it. Parts: figure, head, eyes, lids, brows,
 * mouth, mouthOpen, armL, armR (the spoon goes with armR), hat (pivots at
 * the crown: wobble it, let it flop).
 *
 * Poses (the plain portrait is him busy and jolly, spoon held up):
 *   fluster  both hands up by his head, brows up and worried, a round "oh!",
 *            the hat flopped right over.
 *   beam     arms flung wide, a huge smile, happy eyes, the hat standing tall.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { CUT, cx, cy, FLAT, fluff, person, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'busy' | 'fluster' | 'beam';

const SKIN = '#f3c2a4';
const SKIN_SHADE = '#dfa283';
const SHIRT = '#efdcc8';
const RED = '#c9473f';
const APRON = '#fffdf7';
const APRON_SHADE = '#ddd5c4';
const HAT = '#fdfaf2';
const HAT_SHADE = '#d9d1bf';
const GINGER = '#cf6d2c';
const GINGER_DARK = '#9c4a1a';
const NOSE = '#e9897f';
const FLOUR = '#fffdf6';
const WOOD = '#c98f52';
const WOOD_DARK = '#9a6533';
const ICING = '#f29bb5';

/** Is (x, y) inside the outline? */
function inside(pts: Pt[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

/** The striped shirt: a wide, round-shouldered body, red stripes cut to its outline. */
function shirt(): Node[] {
  const out = curve([[14, 345], [20, 270], [70, 226], [150, 204], [230, 226], [280, 270], [286, 345]], 2);
  const nodes: Node[] = [piece(out, SHIRT)];
  for (let x = 26; x < 280; x += 18) {
    let start: number | null = null;
    for (let y = 200; y <= 346; y += 3) {
      const ok = inside(out, x, y);
      if (ok && start === null) start = y;
      if ((!ok || y >= 345) && start !== null) {
        if (y - start > 8) nodes.push(ink([[x, start + 4], [x, y]], { width: 5.5, color: RED, opacity: 0.9, wobble: 0.15 }));
        start = null;
      }
    }
  }
  return nodes;
}

/** The apron: a bib on straps round the neck, a wide skirt over the tummy, a tied waistband and a pocket. */
function apron(): Node[] {
  return [
    // the straps up to the neck
    piece(band([[cx - 38, 256], [cx - 32, 232], [cx - 26, 208]], 8), APRON, CUT),
    piece(band([[cx + 38, 256], [cx + 32, 232], [cx + 26, 208]], 8), APRON, CUT),
    // bib and skirt in one, bulging over the tummy
    piece(curve([[cx - 42, 252], [cx + 42, 252], [cx + 48, 288], [cx + 86, 300], [cx + 96, 346], [cx - 96, 346], [cx - 86, 300], [cx - 48, 288]], 2), APRON),
    // a soft shade under the round tummy
    piece(ellipse(cx, 338, 80, 10), APRON_SHADE, { ...FLAT, opacity: 0.5 }),
    // the waistband, its ties trailing at the sides
    piece(band([[cx - 92, 296], [cx, 292], [cx + 92, 296]], 10), APRON_SHADE, CUT),
    ink([[cx - 92, 296], [cx - 108, 312], [cx - 104, 330]], { width: 4, color: APRON_SHADE, wobble: 0.3 }),
    ink([[cx + 92, 296], [cx + 110, 310], [cx + 112, 330]], { width: 4, color: APRON_SHADE, wobble: 0.3 }),
    // a pocket with a red stitch along its top, and a floury handprint
    piece(poly([[cx + 22, 308], [cx + 62, 308], [cx + 60, 336], [cx + 24, 336]]), APRON, CUT),
    ink([[cx + 25, 313], [cx + 59, 313]], { width: 2, color: RED, opacity: 0.7, wobble: 0.15 }),
    piece(ellipse(cx - 40, 322, 13, 9, -18), '#efe3c8', { ...FLAT, opacity: 0.8 }),
    piece(circle(cx - 52, 312, 4), '#efe3c8', { ...FLAT, opacity: 0.8 }),
    piece(circle(cx - 46, 306, 3.5), '#efe3c8', { ...FLAT, opacity: 0.8 }),
    // a little white collar
    piece(poly([[cx - 30, 200], [cx - 2, 206], [cx - 20, 226]]), SHIRT, CUT),
    piece(poly([[cx + 30, 200], [cx + 2, 206], [cx + 20, 226]]), SHIRT, CUT),
  ];
}

/** The wooden spoon, the bowl at (x, y), the handle running down through the fist at (hx, hy). */
function spoon(hx: number, hy: number, x: number, y: number): Node[] {
  const dx = x - hx;
  const dy = y - hy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return [
    piece(band([[hx - ux * 22, hy - uy * 22], [x - ux * 12, y - uy * 12]], 8), WOOD, CUT),
    piece(ellipse(x, y, 12, 17, deg), WOOD, CUT),
    piece(ellipse(x - ux * 2, y - uy * 2, 8, 12, deg), WOOD_DARK, { ...FLAT, opacity: 0.45 }),
    // a dab of pink icing in the bowl
    piece(ellipse(x + ux * 2, y + uy * 2, 7, 6, deg), ICING, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

/** An arm: a striped sleeve rolled up at the elbow, a bare plump forearm, a round hand. */
function arm(part: 'armL' | 'armR', from: Pt, via: Pt, to: Pt, holding: Node[] = []): Node {
  const along = (a: Pt, b: Pt): [number, number] => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
  };
  const [nx, ny] = along(from, via);
  const stripes = [-9, 0, 9].map((o) => ink([[from[0] + nx * o, from[1] + ny * o], [via[0] + nx * o, via[1] + ny * o]], { width: 4.5, color: RED, opacity: 0.9, wobble: 0.15 }));
  // the roll of the sleeve sits just short of the elbow
  const t = 0.82;
  const roll: Pt = [from[0] + (via[0] - from[0]) * t, from[1] + (via[1] - from[1]) * t];
  const [rx, ry] = [via[0] + (via[0] - from[0]) * 0.1, via[1] + (via[1] - from[1]) * 0.1];
  return group({ part, origin: from }, [
    piece(band([via, to], 24), SKIN),
    piece(band([from, via], 34), SHIRT),
    ...stripes,
    piece(band([roll, [rx, ry]], 40), SHIRT, CUT),
    ink([[roll[0] + nx * 19, roll[1] + ny * 19], [roll[0] - nx * 19, roll[1] - ny * 19]], { width: 3, color: RED, opacity: 0.8, wobble: 0.1 }),
    ...holding,
    piece(circle(to[0], to[1], 15), SKIN, CUT),
    ink([[to[0] - 7, to[1] + 2], [to[0] + 2, to[1] + 6]], { width: 1.8, color: SKIN_SHADE, opacity: 0.8, wobble: 0.2 }),
  ]);
}

/** The chef's hat: a band round the brow and a big puff of white on top, flopping over to the right by `flop`. */
function hat(flop: number): Node[] {
  const f = flop;
  return [
    fluff(
      [[cx - 52, 74], [cx - 66, 50], [cx - 58, 30], [cx - 30, 18], [cx + 4, 16 + f * 0.2], [cx + 40, 20 + f * 0.4], [cx + 74, 28 + f * 0.7], [cx + 96, 40 + f], [cx + 94, 64 + f * 1.2], [cx + 70, 66 + f * 0.6], [cx + 52, 74]],
      HAT,
      10,
    ),
    // the shadow under the floppy overhang, and soft pleats running up from the band
    piece(ellipse(cx + 70, 62 + f * 0.7, 26, 8, 20), HAT_SHADE, { ...FLAT, opacity: 0.55 }),
    ink([[cx - 36, 70], [cx - 44, 46], [cx - 40, 30]], { width: 2.4, color: HAT_SHADE, wobble: 0.3 }),
    ink([[cx - 12, 68], [cx - 14, 40], [cx - 8, 24]], { width: 2.4, color: HAT_SHADE, wobble: 0.3 }),
    ink([[cx + 14, 68], [cx + 18, 40], [cx + 28, 28 + f * 0.3]], { width: 2.4, color: HAT_SHADE, wobble: 0.3 }),
    ink([[cx + 40, 70], [cx + 52, 46 + f * 0.4], [cx + 66, 40 + f * 0.6]], { width: 2.4, color: HAT_SHADE, wobble: 0.3 }),
    // the band, curving round the head
    piece(curve([[cx - 62, 98], [cx - 60, 68], [cx, 62], [cx + 60, 68], [cx + 62, 98], [cx, 102]], 2), HAT, CUT),
    ink([[cx - 58, 72], [cx, 66], [cx + 58, 72]], { width: 2, color: HAT_SHADE, opacity: 0.8, wobble: 0.2 }),
    // a smudge of flour on the band
    piece(ellipse(cx - 28, 86, 9, 5, -10), '#efe3c8', { ...FLAT, opacity: 0.9 }),
  ];
}

/** The curly ginger moustache: two plump swoops from under the nose, each curling up at the end. */
function moustache(y: number): Node[] {
  const side = (s: number): Node[] => [
    piece(curve([[cx, y - 4], [cx + s * 16, y - 9], [cx + s * 32, y - 4], [cx + s * 40, y + 6], [cx + s * 32, y + 12], [cx + s * 18, y + 8], [cx + s * 6, y + 9], [cx, y + 6]], 2), GINGER, CUT),
    ink([[cx + s * 36, y + 8], [cx + s * 46, y + 2], [cx + s * 46, y - 8], [cx + s * 38, y - 10], [cx + s * 36, y - 4]], { width: 5, color: GINGER, wobble: 0.2 }),
    ink([[cx + s * 8, y + 2], [cx + s * 26, y + 1]], { width: 1.8, color: GINGER_DARK, opacity: 0.7, wobble: 0.2 }),
  ];
  return [...side(-1), ...side(1)];
}

function draw(mood: Mood, name: string, label: string): string {
  const fluster = mood === 'fluster';
  const beam = mood === 'beam';

  const eyes: EyeStyle = beam ? 'happy' : 'round';
  const brows: BrowStyle = fluster ? 'worried' : beam ? 'raised' : 'kind';
  const mouth: MouthStyle = fluster ? 'o' : beam ? 'beam' : 'grin';

  // --- arms: busy (left hand on his tummy, spoon held up), fluster (both hands up), beam (arms flung wide)
  const arms: Node[] = fluster
    ? [
        arm('armL', [56, 272], [20, 242], [64, 182]),
        arm('armR', [244, 272], [280, 242], [236, 182], spoon(236, 182, 258, 118)),
      ]
    : beam
      ? [
          arm('armL', [56, 272], [22, 258], [14, 206]),
          arm('armR', [244, 272], [278, 258], [282, 206], spoon(282, 206, 278, 140)),
        ]
      : [
          arm('armL', [56, 272], [36, 316], [92, 318]),
          arm('armR', [244, 272], [282, 266], [264, 214], spoon(264, 214, 270, 146)),
        ];

  return person({
    name,
    label,
    skin: SKIN,
    face: [64, 62],
    ears: false,
    neck: false,
    eyes,
    eyeCol: '#5a3a22',
    eyeDx: 28,
    eyeY: -6,
    brows,
    browCol: GINGER,
    browY: -19,
    nose: 'none',
    mouth,
    mouthY: 48,
    cheeks: false,
    body: [...shirt(), ...apron()],
    behindHead: [
      // little pointed brownie ears
      piece(poly([[cx - 58, cy - 10], [cx - 86, cy - 32], [cx - 74, cy + 4], [cx - 58, cy + 22]]), SKIN),
      piece(poly([[cx - 62, cy - 4], [cx - 78, cy - 20], [cx - 70, cy + 4], [cx - 62, cy + 12]]), NOSE, { ...FLAT, opacity: 0.5 }),
      piece(poly([[cx + 58, cy - 10], [cx + 86, cy - 32], [cx + 74, cy + 4], [cx + 58, cy + 22]]), SKIN),
      piece(poly([[cx + 62, cy - 4], [cx + 78, cy - 20], [cx + 70, cy + 4], [cx + 62, cy + 12]]), NOSE, { ...FLAT, opacity: 0.5 }),
    ],
    onHead: [
      // ginger tufts poking out under the hat band
      fluff([[cx - 64, 94], [cx - 52, 98], [cx - 55, 110], [cx - 63, 118], [cx - 68, 106]], GINGER, 4),
      fluff([[cx + 64, 94], [cx + 52, 98], [cx + 55, 110], [cx + 63, 118], [cx + 68, 106]], GINGER, 4),
      // big round rosy cheeks, and a soft double chin
      piece(ellipse(cx - 42, cy + 22, 18, 13), C.pink, { ...FLAT, opacity: 0.75 }),
      piece(ellipse(cx + 42, cy + 22, 18, 13), C.pink, { ...FLAT, opacity: 0.75 }),
      ink([[cx - 22, cy + 62], [cx, cy + 66], [cx + 22, cy + 62]], { width: 2, color: SKIN_SHADE, opacity: 0.7, wobble: 0.2 }),
      // a dab of flour on one cheek
      piece(ellipse(cx + 48, cy + 30, 7, 4, -20), FLOUR, { ...FLAT, opacity: 0.9 }),
    ],
    front: [
      // the round nose, floury on the tip
      piece(ellipse(cx, cy + 13, 14, 12), NOSE, CUT),
      piece(ellipse(cx + 3, cy + 9, 7, 4.5, -10), FLOUR, { ...FLAT, opacity: 0.95 }),
      dot(cx - 5, cy + 16, 2, FLOUR, 0.9),
      dot(cx + 8, cy + 15, 1.6, FLOUR, 0.9),
      ...moustache(cy + 27),
      // a bead of worry by the brow
      ...(fluster ? [piece(ellipse(cx + 54, cy - 30, 4.5, 7, -15), '#bfe1f0', { edge: 'clean', shadow: false }), dot(cx + 53, cy - 32, 1.5, C.white, 0.9)] : []),
    ],
    hat: hat(fluster ? 26 : beam ? 0 : 8),
    arms,
    tilt: fluster ? -4 : undefined,
  });
}

/** Mr Bunloaf, busy and jolly, his wooden spoon held up. */
export const bunloaf = cached((): string => draw('busy', 'wishing-bunloaf', 'Mr Bunloaf'));

/** In a fluster: both hands up by his head, worried brows, a round "oh!". */
export const bunloafFluster = cached((): string => draw('fluster', 'wishing-bunloaf-fluster', 'Mr Bunloaf in a fluster'));

/** Beaming: arms flung wide, a huge smile. */
export const bunloafBeam = cached((): string => draw('beam', 'wishing-bunloaf-beam', 'Mr Bunloaf, beaming'));
