/**
 * Enchanter Muddle: a plump, kind, very muddled old enchanter with a dreadful
 * cold. A tall crooked purple hat dotted with silver moons and stars, a long
 * white beard with a goose quill stuck in it (he put it there and forgot), a
 * starry purple robe with silver cuffs, a big red runny nose and pink,
 * watery eyes. He holds a red-spotted hanky.
 *
 * Silhouette: the tall crooked hat whose tip flops over, the round pink face,
 * and the great white beard spilling down over the purple robe. He is cross
 * only by accident, and more silly than scary.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hat
 * (pivots at the crown: wobble it, tip it, let it rise).
 * Poses (same box, same face box):
 *   sneeze  head thrown back, eyes screwed shut, mouth wide ("ah-ah-"), arms flung out,
 *   cross   brows down, fists up, hat askew (a muddled sort of cross),
 *   cosy    wrapped in a long stripy scarf, eyes closed, a happy smile.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, star, torso } from '../faraway/parts';

type Mood = 'plain' | 'sneeze' | 'cross' | 'cosy';

const SKIN = '#f0bf9c';
const ROBE = '#6b4f86';
const ROBE_DARK = '#4a3560';
const HAT = '#7d55a0';
const HAT_DARK = '#5a3a7a';
const SILVER = '#d4d8de';
const SILVER_DARK = '#9aa4ae';
const BEARD = '#f3eee2';
const BEARD_SHADE = '#c9c0b0';
const NOSE = '#d9473f';
const NOSE_DARK = '#a8302c';
const HANKY = '#f7f2e6';
const FACE_RX = 62;
const FACE_RY = 60;
const EX = 25;
const EY = 118;
const MY = 176;

/** A crescent moon, centred on (x, y), opening towards `rot` degrees. */
function moon(x: number, y: number, r: number, rot: number, fill: string = SILVER): Node {
  const out: Pt[] = [];
  const a0 = (rot * Math.PI) / 180;
  for (let i = 0; i <= 12; i++) {
    const a = a0 - Math.PI / 2 + (i / 12) * Math.PI;
    out.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  for (let i = 12; i >= 0; i--) {
    const a = a0 - Math.PI / 2 + (i / 12) * Math.PI;
    out.push([x + Math.cos(a) * r * 0.55 + Math.cos(a0) * r * 0.32, y + Math.sin(a) * r * 0.78 + Math.sin(a0) * r * 0.32]);
  }
  return piece(poly(out), fill, { edge: 'cut', fibre: false, shadow: false });
}

/** A little silver star. */
const spark = (x: number, y: number, r: number, fill: string = SILVER, rot = 0): Node => piece(poly(star(x, y, r, rot)), fill, FLAT);

/** The tall crooked hat: a cone whose tip flops over to the right, a wide brim, a purple band and silver moons. */
function hat(): Node[] {
  return [
    piece(
      curve(
        [[cx - 78, 92], [cx - 58, 60], [cx - 40, 30], [cx - 14, 12], [cx + 18, 6], [cx + 52, 12], [cx + 76, 34], [cx + 56, 28], [cx + 36, 30], [cx + 22, 46], [cx + 26, 66], [cx + 80, 92]],
        2,
      ),
      HAT,
    ),
    // the shaded side of the cone and the crease where it bends
    piece(curve([[cx - 62, 84], [cx - 44, 50], [cx - 22, 24], [cx - 8, 30], [cx - 22, 62], [cx - 30, 88]], 1), HAT_DARK, { ...FLAT, opacity: 0.4 }),
    ink([[cx + 20, 44], [cx + 30, 62]], { width: 2.4, color: HAT_DARK, opacity: 0.7 }),
    // the brim, a band and a silver buckle
    piece(ellipse(cx, 94, 88, 12), HAT_DARK, CUT),
    piece(band([[cx - 66, 82], [cx, 90], [cx + 68, 82]], 14), ROBE_DARK, CUT),
    piece(poly([[cx - 12, 78], [cx + 12, 78], [cx + 12, 98], [cx - 12, 98]]), SILVER, CUT),
    piece(poly([[cx - 6, 83], [cx + 6, 83], [cx + 6, 93], [cx - 6, 93]]), ROBE_DARK, FLAT),
    // moons and stars across the cone
    moon(cx - 44, 62, 13, 20),
    moon(cx - 4, 36, 12, 200),
    moon(cx + 50, 18, 8, 10),
    spark(cx - 20, 66, 6, SILVER, 10),
    spark(cx + 14, 62, 5, SILVER, -8),
    spark(cx - 56, 40, 4.5),
    spark(cx + 42, 40, 4.5),
  ];
}

/** The long white beard, with the quill stuck in it. Starts below the mouth and spills down the robe. */
function beard(reach: number): Node[] {
  return [
    piece(
      curve(
        [[cx - 56, cy + 22], [cx - 48, cy + 56], [cx - 28, cy + 70], [cx, cy + 66], [cx + 28, cy + 70], [cx + 48, cy + 56], [cx + 56, cy + 22], [cx + 54, cy + 100], [cx + 32, cy + 150 + reach], [cx, cy + 184 + reach], [cx - 32, cy + 150 + reach], [cx - 54, cy + 100]],
        2,
      ),
      BEARD,
    ),
    piece(curve([[cx - 30, cy + 92], [cx - 10, cy + 130], [cx, cy + 170 + reach], [cx + 12, cy + 130], [cx + 28, cy + 92], [cx, cy + 82]], 1.6), BEARD_SHADE, { ...FLAT, opacity: 0.4 }),
    ink([[cx - 18, cy + 100], [cx - 10, cy + 146]], { width: 2, color: BEARD_SHADE, wobble: 0.3 }),
    ink([[cx + 20, cy + 104], [cx + 12, cy + 150]], { width: 2, color: BEARD_SHADE, wobble: 0.3 }),
    // the goose quill, stuck in at the side and forgotten
    piece(band([[cx + 30, cy + 112], [cx + 70, cy + 70], [cx + 96, cy + 22]], 5), SILVER_DARK, CUT),
    piece(curve([[cx + 66, cy + 76], [cx + 100, cy + 18], [cx + 112, cy + 38], [cx + 86, cy + 80]], 1.5), '#8fb4d8', CUT),
    ink([[cx + 66, cy + 80], [cx + 102, cy + 22]], { width: 1.6, color: SILVER_DARK }),
    // a big bushy moustache over the lip
    piece(curve([[cx - 38, cy + 34], [cx - 12, cy + 26], [cx, cy + 32], [cx + 12, cy + 26], [cx + 38, cy + 34], [cx + 22, cy + 48], [cx, cy + 40], [cx - 22, cy + 48]], 1.6), BEARD, CUT),
  ];
}

/** The big red runny nose, with a shine and (unless he is sneezing) a pale drip. */
function nose(drip: boolean, y = cy + 14): Node[] {
  return [
    piece(ellipse(cx, y, 21, 18), NOSE, CUT),
    piece(ellipse(cx + 2, y + 8, 16, 8), NOSE_DARK, { ...FLAT, opacity: 0.35 }),
    dot(cx - 8, y - 6, 4.5, C.white, 0.6),
    ...(drip ? [piece(curve([[cx + 10, y + 16], [cx + 15, y + 26], [cx + 10, y + 32], [cx + 6, y + 26]], 1), '#bfe0ee', { ...FLAT, opacity: 0.85 })] : []),
  ];
}

/** The red-spotted hanky held in a hand: a bunched white cloth with a few spots. */
function hanky(x: number, y: number, rot = 0): Node[] {
  const p = (px: number, py: number): Pt => {
    const a = (rot * Math.PI) / 180;
    return [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)];
  };
  return [
    piece(curve([p(-4, -4), p(-22, -22), p(-6, -34), p(10, -30), p(26, -18), p(14, -2), p(10, 8), p(-6, 6)], 1.6), HANKY, CUT),
    dot(...p(-4, -22), 3, NOSE),
    dot(...p(10, -16), 3, NOSE),
    dot(...p(-10, -10), 2.6, NOSE),
    dot(...p(16, -6), 2.4, NOSE),
  ];
}

/** A stripy scarf wound twice round the neck, with two ends hanging down the front. */
function scarf(): Node[] {
  const stripes = [C.coatRed, C.cream, C.blue, C.cream];
  const ends: Node[] = [];
  for (let i = 0; i < 8; i++) {
    const y0 = 262 + i * 11;
    ends.push(piece(poly([[176, y0], [208, y0 + 4], [210, y0 + 15], [178, y0 + 11]]), stripes[i % 4], CUT));
  }
  for (let i = 0; i < 6; i++) {
    const y0 = 270 + i * 11;
    ends.push(piece(poly([[146, y0], [172, y0 - 2], [174, y0 + 9], [148, y0 + 11]]), stripes[(i + 2) % 4], CUT));
  }
  const wrap = (y: number, h: number, flip: number): Node[] =>
    [0, 1, 2, 3, 4, 5].map((i) => {
      const x0 = 70 + i * 26;
      return piece(poly([[x0, y + Math.abs(i - 2.5) * 5 - flip], [x0 + 28, y + Math.abs(i - 1.5) * 5 - flip], [x0 + 28, y + h + Math.abs(i - 1.5) * 5 - flip], [x0, y + h + Math.abs(i - 2.5) * 5 - flip]]), stripes[i % 4], CUT);
    });
  return [
    ...ends,
    ...wrap(228, 20, 0),
    ...wrap(246, 20, -2),
    ink([[70, 246], [230, 246]], { width: 1.6, color: C.ink, opacity: 0.15 }),
    // fringe on the hanging ends
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[180 + i * 5, 350], [180 + i * 5, 358]], { width: 2.2, color: C.coatRed })),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const sneeze = mood === 'sneeze';
  const cross = mood === 'cross';
  const cosy = mood === 'cosy';

  // --- the eyes: watery and pink-rimmed; screwed shut in a sneeze, happy arcs when cosy
  const eye = (x: number): Node[] => {
    if (sneeze) {
      return [
        ink([[x - 12, EY - 2], [x, EY + 6], [x + 12, EY - 2]], { width: 3.6, color: C.ink }),
        ink([[x - 12, EY - 2], [x - 17, EY - 7]], { width: 2.4, color: C.ink }),
        ink([[x + 12, EY - 2], [x + 17, EY - 7]], { width: 2.4, color: C.ink }),
      ];
    }
    if (cosy) return [ink([[x - 11, EY + 3], [x, EY - 6], [x + 11, EY + 3]], { width: 3.8, color: C.ink })];
    return [
      piece(ellipse(x, EY, 14, 15), C.rose, { ...FLAT, opacity: 0.45 }),
      piece(ellipse(x, EY, 11.5, 12.5), C.white, FLAT),
      piece(circle(x, EY + 1.5, 7), '#5a82b2', { edge: 'clean', shadow: false }),
      piece(circle(x, EY + 1.5, 3.4), C.ink, { edge: 'clean', shadow: false }),
      dot(x - 2.6, EY - 2.6, 2.2, C.white),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(ellipse(x, EY, 15, 15), SKIN, FLAT),
    ink([[x - 11, EY + 2], [x, EY + 7], [x + 11, EY + 2]], { width: 3, color: C.ink }),
  ];

  // --- brows: bushy and white, worried when plain, slammed down when cross
  const browSide = (s: number): Node => {
    const x = cx + s * EX;
    const y = EY - 26;
    const inner = cross ? 12 : sneeze ? 4 : cosy ? -2 : -6; // how far the inner end drops (plain: worried, inner end up)
    const outer = cross ? -4 : sneeze ? -3 : cosy ? -2 : 4;
    const pts: Pt[] = [
      [x + s * 22, y + outer - 5],
      [x + s * 6, y + (outer + inner) / 2 - 11],
      [x - s * 14, y + inner - 6],
      [x - s * 14, y + inner + 7],
      [x + s * 4, y + (outer + inner) / 2 + 2],
      [x + s * 22, y + outer + 5],
    ];
    return piece(curve(pts, 1.6), BEARD, { rough: 1.6 });
  };

  // --- mouths
  const mouth: Node[] = sneeze
    ? [piece(ellipse(cx, MY + 6, 24, 26), C.redDark, FLAT), piece(ellipse(cx, MY + 20, 15, 8), C.rose, { edge: 'clean', shadow: false })]
    : cross
      ? [piece(curve([[cx - 22, MY - 2], [cx + 22, MY - 2], [cx + 16, MY + 24], [cx - 16, MY + 24]], 2), C.redDark, FLAT)]
      : cosy
        ? [ink([[cx - 22, MY], [cx - 8, MY + 12], [cx + 8, MY + 12], [cx + 22, MY]], { width: 4, color: C.redDark })]
        : [ink([[cx - 16, MY + 6], [cx - 6, MY + 1], [cx + 6, MY + 1], [cx + 16, MY + 6]], { width: 3.4, color: C.redDark })];
  const mouthOpen: Node[] =
    sneeze || cross
      ? mouth
      : [
          piece(curve([[cx - 20, MY - 2], [cx + 20, MY - 2], [cx + 14, MY + 20], [cx - 14, MY + 20]], 2), C.redDark, FLAT),
          piece(ellipse(cx, MY + 14, 9, 4.5), C.rose, { edge: 'clean', shadow: false }),
        ];

  // --- arms. Plain: one hand up at the chest with the hanky, one hanging. Sneeze: flung wide.
  // Cross: fists up. Cosy: tucked in under the scarf.
  const cuffed = { sleeve: ROBE, cuff: SILVER, hand: SKIN, width: 40 };
  const armL: Node = sneeze
    ? arm('armL', { from: [60, 270], via: [24, 244], to: [10, 196], ...cuffed })
    : cross
      ? arm('armL', { from: [60, 270], via: [30, 258], to: [44, 214], ...cuffed })
      : cosy
        ? arm('armL', { from: [60, 270], via: [58, 320], to: [100, 330], ...cuffed })
        : arm('armL', { from: [60, 270], via: [44, 310], to: [56, 340], ...cuffed });
  const armR: Node = sneeze
    ? arm('armR', { from: [240, 270], via: [276, 244], to: [292, 196], ...cuffed })
    : cross
      ? arm('armR', { from: [240, 270], via: [270, 258], to: [256, 214], ...cuffed })
      : cosy
        ? arm('armR', { from: [240, 270], via: [242, 320], to: [200, 330], ...cuffed })
        : arm('armR', { from: [240, 270], via: [268, 290], to: [232, 262], ...cuffed, holding: hanky(232, 252, -10) });

  const hatTilt = cross ? 'rotate(-12) translate(-14 6)' : sneeze ? 'rotate(10) translate(8 -12)' : undefined;

  return person({
    name,
    label,
    skin: SKIN,
    face: [FACE_RX, FACE_RY],
    ears: false,
    neck: false,
    eyes: 'none',
    brows: 'none',
    nose: 'none',
    mouth: 'none',
    cheeks: false,
    noTalk: true,
    noBlink: true,
    tilt: sneeze ? -14 : undefined,
    behindHead: [
      // wispy white hair over the ears
      piece(curve([[cx - 64, cy - 30], [cx - 80, cy + 4], [cx - 70, cy + 40], [cx - 56, cy + 10]], 1.6), BEARD, { rough: 1.4 }),
      piece(curve([[cx + 64, cy - 30], [cx + 80, cy + 4], [cx + 70, cy + 40], [cx + 56, cy + 10]], 1.6), BEARD, { rough: 1.4 }),
    ],
    body: [
      // a round, plump, starry purple robe with a darker panel and silver trim
      torso(ROBE, 30, 232),
      piece(poly([[104, 250], [196, 250], [214, 345], [86, 345]]), ROBE_DARK, { ...FLAT, opacity: 0.45 }),
      ink([[100, 246], [150, 262], [200, 246]], { width: 3, color: SILVER, wobble: 0.3 }),
      spark(86, 296, 8, SILVER, 6),
      spark(214, 304, 9, SILVER, -10),
      spark(66, 330, 6),
      spark(240, 332, 6),
      moon(110, 322, 9, 30),
      moon(196, 280, 8, 200),
      spark(150, 326, 6),
      // a crumpled white collar
      piece(poly([[112, 226], [128, 242], [150, 232], [172, 242], [188, 226], [170, 214], [130, 214]]), HANKY, CUT),
    ],
    onHead: [
      // plump pink cheeks and a rosy forehead flush
      piece(ellipse(cx - 42, cy + 22, 16, 11), C.pink, { ...FLAT, opacity: 0.55 }),
      piece(ellipse(cx + 42, cy + 22, 16, 11), C.pink, { ...FLAT, opacity: 0.55 }),
    ],
    front: [
      ...beard(cosy ? -30 : 0),
      group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX), ...eye(cx + EX)]),
      group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
      group({ part: 'brows', origin: [cx, EY - 26] }, [browSide(-1), browSide(1)]),
      ...nose(!sneeze && !cosy),
      group({ part: 'mouth', origin: [cx, MY] }, mouth),
      group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, mouthOpen),
    ],
    hat: hat(),
    arms: [...(cosy ? scarf() : []), armL, armR],
  }).replace('data-part="hat"', hatTilt ? `data-part="hat" transform="${hatTilt}"` : 'data-part="hat"');
}

/** Enchanter Muddle, plain: a worried face, red nose, hanky in hand. */
export const muddle = cached((): string => draw('plain', 'wishing-muddle', 'Enchanter Muddle'));

/** Mid-sneeze: head back, eyes screwed shut, mouth wide, arms flung out. */
export const muddleSneeze = cached((): string => draw('sneeze', 'wishing-muddle-sneeze', 'Enchanter Muddle sneezing'));

/** A muddled sort of cross: brows down, fists up, hat askew. */
export const muddleCross = cached((): string => draw('cross', 'wishing-muddle-cross', 'Enchanter Muddle cross'));

/** Wrapped up warm in a long stripy scarf, smiling with his eyes shut. */
export const muddleCosy = cached((): string => draw('cosy', 'wishing-muddle-cosy', 'Enchanter Muddle cosy'));
