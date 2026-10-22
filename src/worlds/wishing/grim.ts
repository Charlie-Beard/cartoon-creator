/**
 * Mr Grim, headmaster of Mr Grim's School for Bad Brownies: a tall, thin,
 * stern old brownie schoolmaster. Long pointed nose, bushy black brows that
 * frown, little round spectacles, a long pointed grey beard, pointed brownie
 * ears, a black gown with a dark plum lining over a brown waistcoat, and a
 * black mortarboard with a tassel. In his right hand (the viewer's right) he
 * carries a long ruler. It is drawn as part of `armR`, so it swings with the
 * arm: raise it and snap it down on a desk. Scary-strict but really more
 * silly than scary, and he never hurts anyone.
 *
 * The face is pale so it stands out from a grey-stone schoolroom, and the
 * gown has plum lapels and a pale seam so the black doesn't sink into it.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR (the
 * ruler goes with it), hat (pivots at the crown: tip it, slide it, lift it).
 * Poses: shout, dizzy, laugh, back (from behind, writing on a blackboard).
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso } from '../faraway/parts';

type Mood = 'stern' | 'shout' | 'dizzy' | 'laugh';

const SKIN = C.skinPale;
const GOWN = '#2a2430';
const GOWN_EDGE = '#6d6478';
const LINING = '#5b3f73';
const VEST = '#7a4a2c';
const BEARD = '#bdb8ae';
const BEARD_SHADE = '#8f8a84';
const BROW = '#1d1a1f';
const RULER = '#d9a95c';
const FACE_RX = 50;
const FACE_RY = 64;

const EX = 25; // half the distance between the eyes
const EY = 122;
const MY = 172; // the mouth

/** A flat spiral of ink, for dizzy eyes. */
function swirl(x: number, y: number, r: number, dir: number): Node {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 28; i++) {
    const a = dir * i * 0.45;
    const rr = (r * i) / 28;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return ink(pts, { width: 2.6, color: C.ink, wobble: 0.2 });
}

function draw(mood: Mood, name: string, label: string): string {
  const shout = mood === 'shout';
  const dizzy = mood === 'dizzy';
  const laugh = mood === 'laugh';

  // --- eyes behind little round spectacles
  const eye = (x: number, side: number): Node[] => {
    if (laugh) return [ink([[x - 11, EY + 3], [x, EY - 6], [x + 11, EY + 3]], { width: 4, color: C.ink })];
    if (dizzy) return [piece(circle(x, EY, 13), C.white, FLAT), swirl(x, EY, 11, side)];
    const squint = shout ? 0 : 0;
    return [
      piece(circle(x, EY, 12.5), C.white, FLAT),
      piece(circle(x + squint, EY + 1.5, 5.4), C.ink, { edge: 'clean', shadow: false }),
      dot(x - 1.5, EY - 1, 1.5, C.white),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(circle(x, EY, 13), SKIN, FLAT),
    ink([[x - 10, EY + 2], [x, EY + 6], [x + 10, EY + 2]], { width: 3, color: C.ink }),
  ];
  const glasses = (dy: number): Node[] => [
    ink([[cx - EX - 15, EY - 8 + dy], [cx - EX - 28, EY - 10 + dy]], { width: 2.2, color: C.ink }),
    ink([[cx + EX + 15, EY - 8 + dy], [cx + EX + 28, EY - 10 + dy]], { width: 2.2, color: C.ink }),
    ink([[cx - EX + 15, EY - 2], [cx, EY - 6], [cx + EX - 15, EY - 2]], { width: 2.4, color: C.ink }),
    ...[-1, 1].map((s) => {
      const x = cx + s * EX;
      const pts: [number, number][] = [];
      for (let i = 0; i <= 20; i++) pts.push([x + Math.cos((i / 20) * 6.4) * 16, EY + Math.sin((i / 20) * 6.4) * 16]);
      return ink(pts, { width: 2.6, color: '#3b3440', wobble: 0.15 });
    }),
  ];

  // --- bushy black brows: frowning down at the nose; slammed in a shout; up in a laugh
  const browSide = (s: number): Node => {
    const x = cx + s * EX;
    const y = EY - 24;
    const inner = shout ? 14 : dizzy ? -4 : laugh ? -8 : 7; // how far the inner end drops
    const outer = shout ? -2 : dizzy ? 2 : laugh ? -4 : -5; // and the outer end
    const lift = laugh ? -8 : 0;
    const pts: [number, number][] = [
      [x + s * 24, y + outer - 6 + lift],
      [x + s * 6, y + (outer + inner) / 2 - 12 + lift],
      [x - s * 14, y + inner - 6 + lift],
      [x - s * 15, y + inner + 8 + lift],
      [x + s * 4, y + (outer + inner) / 2 + 2 + lift],
      [x + s * 24, y + outer + 5 + lift],
    ];
    return piece(curve(pts, 1.6), BROW, { rough: 1.8 });
  };

  // --- mouths
  const mouth: Node[] = shout
    ? [piece(curve([[cx - 22, MY - 6], [cx + 22, MY - 6], [cx + 16, MY + 24], [cx - 16, MY + 24]], 2), C.redDark, FLAT)]
    : dizzy
      ? [ink([[cx - 16, MY + 4], [cx - 8, MY - 4], [cx, MY + 5], [cx + 8, MY - 4], [cx + 16, MY + 4]], { width: 3.6, color: C.redDark })]
      : laugh
        ? [ink([[cx - 24, MY - 4], [cx - 8, MY + 10], [cx + 8, MY + 10], [cx + 24, MY - 4]], { width: 4.5, color: C.redDark })]
        : [ink([[cx - 14, MY + 3], [cx - 5, MY - 1], [cx + 5, MY - 1], [cx + 14, MY + 3]], { width: 3.4, color: C.redDark })];
  const mouthOpen: Node[] = laugh
    ? [
        piece(curve([[cx - 26, MY - 6], [cx + 26, MY - 6], [cx + 20, MY + 22], [cx, MY + 30], [cx - 20, MY + 22]], 2), C.redDark, FLAT),
        piece(ellipse(cx, MY + 22, 12, 6), C.rose, { edge: 'clean', shadow: false }),
      ]
    : shout
      ? mouth
      : [
          piece(curve([[cx - 17, MY - 3], [cx + 17, MY - 3], [cx + 12, MY + 18], [cx - 12, MY + 18]], 2), C.redDark, FLAT),
          piece(ellipse(cx, MY + 13, 8, 4), C.rose, { edge: 'clean', shadow: false }),
        ];

  // --- the right arm and its ruler. At rest the arm hangs and the ruler is held
  // upright like a staff; in a shout the arm is up and the ruler is raised high.
  const rulerAt = (a: [number, number], b: [number, number]): Node[] => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const ticks: Node[] = [];
    for (let t = 0.12; t < 0.95; t += 0.1) {
      const px = a[0] + dx * t;
      const py = a[1] + dy * t;
      ticks.push(ink([[px - (dy / len) * 4, py + (dx / len) * 4], [px + (dy / len) * 4, py - (dx / len) * 4]], { width: 1.4, color: '#6b4a1e', wobble: 0 }));
    }
    return [piece(band([a, b], 11), RULER, CUT), ...ticks];
  };
  const armR: Node = shout
    ? arm('armR', { from: [236, 266], via: [262, 220], to: [258, 166], sleeve: GOWN, cuff: LINING, hand: SKIN, width: 32, holding: rulerAt([252, 236], [292, 6]) })
    : arm('armR', { from: [236, 266], via: [254, 302], to: [250, 336], sleeve: GOWN, cuff: LINING, hand: SKIN, width: 32, holding: rulerAt([252, 352], [262, 150]) });
  const armL: Node = arm('armL', { from: [64, 266], via: [48, 302], to: [54, 336], sleeve: GOWN, cuff: LINING, hand: SKIN, width: 32 });

  const hatTilt = dizzy ? 'rotate(-14) translate(-10 4)' : undefined;

  return person({
    name,
    label,
    skin: SKIN,
    face: [FACE_RX, FACE_RY],
    ears: false,
    neck: SKIN,
    eyes: 'none',
    brows: 'none',
    nose: 'none',
    mouth: 'none',
    cheeks: false,
    noTalk: true,
    noBlink: true,
    behindHead: [
      // tall pointed brownie ears
      piece(poly([[cx - FACE_RX + 6, cy - 6], [cx - FACE_RX - 34, cy - 50], [cx - FACE_RX + 2, cy + 22]]), SKIN),
      piece(poly([[cx + FACE_RX - 6, cy - 6], [cx + FACE_RX + 34, cy - 50], [cx + FACE_RX - 2, cy + 22]]), SKIN),
      piece(poly([[cx - FACE_RX - 2, cy - 8], [cx - FACE_RX - 22, cy - 36], [cx - FACE_RX + 2, cy + 10]]), C.pink, { ...FLAT, opacity: 0.5 }),
      piece(poly([[cx + FACE_RX + 2, cy - 8], [cx + FACE_RX + 22, cy - 36], [cx + FACE_RX - 2, cy + 10]]), C.pink, { ...FLAT, opacity: 0.5 }),
    ],
    body: [
      // black gown with a pale seam, plum lapels and a brown waistcoat
      torso(GOWN, 0, 236),
      ink([[48, 276], [100, 244], [150, 238], [200, 244], [252, 276]], { width: 3, color: GOWN_EDGE, wobble: 0.3 }),
      piece(poly([[112, 240], [188, 240], [182, 345], [118, 345]]), VEST),
      ...[270, 296, 322].map((y) => dot(150, y, 4, C.gold)),
      piece(poly([[104, 236], [138, 250], [118, 345], [84, 345], [92, 280]]), LINING, CUT),
      piece(poly([[196, 236], [162, 250], [182, 345], [216, 345], [208, 280]]), LINING, CUT),
      ink([[104, 238], [92, 282], [84, 340]], { width: 2.4, color: GOWN_EDGE, wobble: 0.3 }),
      ink([[196, 238], [208, 282], [216, 340]], { width: 2.4, color: GOWN_EDGE, wobble: 0.3 }),
      // stiff white collar and a thin dark cravat
      piece(poly([[128, 222], [150, 252], [172, 222], [160, 216], [140, 216]]), C.white, CUT),
      piece(poly([[144, 242], [156, 242], [158, 276], [150, 284], [142, 276]]), '#3d2f4d', CUT),
    ],
    front: [
      // the long pointed grey beard, starting below the mouth
      piece(curve([[cx - 46, cy + 30], [cx - 36, cy + 54], [cx - 22, cy + 60], [cx, cy + 56], [cx + 22, cy + 60], [cx + 36, cy + 54], [cx + 46, cy + 30], [cx + 40, cy + 100], [cx + 14, cy + 150], [cx, cy + 190], [cx - 14, cy + 150], [cx - 40, cy + 100]], 2), BEARD),
      piece(curve([[cx - 24, cy + 84], [cx - 8, cy + 120], [cx, cy + 176], [cx + 8, cy + 120], [cx + 24, cy + 84], [cx, cy + 74]], 1.6), BEARD_SHADE, { ...FLAT, opacity: 0.4 }),
      // a thin moustache over the lip
      piece(curve([[cx - 28, cy + 30], [cx - 8, cy + 24], [cx, cy + 28], [cx + 8, cy + 24], [cx + 28, cy + 30], [cx + 14, cy + 40], [cx, cy + 34], [cx - 14, cy + 40]], 1.6), BEARD, CUT),
      // the long pointed nose
      piece(poly([[cx - 6, EY - 4], [cx + 6, EY - 4], [cx + 12, cy + 20], [cx + 2, cy + 30], [cx - 14, cy + 22]]), '#e7c9ae', CUT),
      ink([[cx - 14, cy + 22], [cx + 2, cy + 30]], { width: 2, color: 'rgba(120,70,50,0.6)' }),
      // flushed lines on the cheeks
      ...(laugh ? [piece(ellipse(cx - 36, EY + 22, 10, 6), C.rose, { ...FLAT, opacity: 0.6 }), piece(ellipse(cx + 36, EY + 22, 10, 6), C.rose, { ...FLAT, opacity: 0.6 })] : []),
      group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX, -1), ...eye(cx + EX, 1)]),
      group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
      ...glasses(0),
      group({ part: 'brows', origin: [cx, EY - 24] }, [browSide(-1), browSide(1)]),
      group({ part: 'mouth', origin: [cx, MY] }, mouth),
      group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, mouthOpen),
    ],
    hat: [
      // mortarboard: a close black cap, a flat square board on top, a tassel
      piece(curve([[cx - 52, cy - 52], [cx - 48, cy - 70], [cx + 48, cy - 70], [cx + 52, cy - 52], [cx + 30, cy - 62], [cx - 30, cy - 62]], 2), GOWN),
      piece(poly([[cx - 86, cy - 76], [cx - 20, cy - 98], [cx + 86, cy - 90], [cx + 30, cy - 64]]), '#17141b', CUT),
      ink([[cx - 86, cy - 76], [cx - 20, cy - 98], [cx + 86, cy - 90]], { width: 2.4, color: GOWN_EDGE, wobble: 0.2 }),
      circle_dot(cx + 4, cy - 82),
      ink([[cx + 4, cy - 82], [cx + 70, cy - 82], [cx + 74, cy - 62]], { width: 2.4, color: C.gold }),
      piece(poly([[cx + 68, cy - 64], [cx + 80, cy - 64], [cx + 82, cy - 44], [cx + 66, cy - 44]]), C.gold, CUT),
    ].map((n) => n),
    arms: [armL, armR],
    tilt: undefined,
  }).replace('data-part="hat"', hatTilt ? `data-part="hat" transform="${hatTilt}"` : 'data-part="hat"');
}

function circle_dot(x: number, y: number): Node {
  return piece(circle(x, y, 5), C.gold, CUT);
}

/** Mr Grim, stern: frowning brows, a thin straight mouth, ruler held like a staff. */
export const grim = cached((): string => draw('stern', 'wishing-grim', 'Mr Grim'));

/** Shouting: brows slammed down, mouth wide, ruler raised high. */
export const grimShout = cached((): string => draw('shout', 'wishing-grim-shout', 'Mr Grim shouting'));

/** Dizzy: swirly eyes, hat askew, a wobbly mouth. */
export const grimDizzy = cached((): string => draw('dizzy', 'wishing-grim-dizzy', 'Mr Grim dizzy'));

/** Laughing for the first time in years: crescent eyes, brows up, a great open laugh. */
export const grimLaugh = cached((): string => draw('laugh', 'wishing-grim-laugh', 'Mr Grim laughing'));

/**
 * From behind, writing on a blackboard: the plain black back of the gown, the
 * back of his head (grey hair, ears poking out, the mortarboard from behind),
 * the tip of the beard peeking out at each side, the ruler tucked under his
 * left arm and a stick of chalk in his raised right hand (still `armR`). No
 * face, so no eyes, lids, brows or mouth parts; `head`, `hat`, `armL`, `armR`
 * and `figure` all work as usual.
 */
export const grimBack = cached((): string => {
  const HAIR = '#a9a399';
  const chalk = [piece(band([[262, 118], [270, 100]], 6), C.white, CUT)];
  return person({
    name: 'wishing-grim-back',
    label: 'Mr Grim from behind',
    skin: HAIR,
    face: [FACE_RX, FACE_RY],
    ears: false,
    neck: SKIN,
    eyes: 'none',
    brows: 'none',
    nose: 'none',
    mouth: 'none',
    cheeks: false,
    noTalk: true,
    noBlink: true,
    behindHead: [
      piece(poly([[cx - FACE_RX + 6, cy - 6], [cx - FACE_RX - 34, cy - 50], [cx - FACE_RX + 2, cy + 22]]), SKIN),
      piece(poly([[cx + FACE_RX - 6, cy - 6], [cx + FACE_RX + 34, cy - 50], [cx + FACE_RX - 2, cy + 22]]), SKIN),
      // the beard's tip peeking out at the sides of the jaw
      piece(curve([[cx - FACE_RX + 4, cy + 30], [cx - FACE_RX - 10, cy + 56], [cx - FACE_RX + 12, cy + 74], [cx - FACE_RX + 20, cy + 50]], 2), BEARD),
      piece(curve([[cx + FACE_RX - 4, cy + 30], [cx + FACE_RX + 10, cy + 56], [cx + FACE_RX - 12, cy + 74], [cx + FACE_RX - 20, cy + 50]], 2), BEARD),
    ],
    body: [
      torso(GOWN, 0, 236),
      // a pale seam down the back and along the shoulders, so the black reads
      ink([[48, 276], [100, 244], [150, 238], [200, 244], [252, 276]], { width: 3, color: GOWN_EDGE, wobble: 0.3 }),
      ink([[150, 250], [150, 345]], { width: 2.4, color: GOWN_EDGE, wobble: 0.3 }),
      piece(poly([[112, 236], [188, 236], [176, 258], [124, 258]]), LINING, CUT),
      // the ruler tucked under his left arm, its end sticking out behind
      piece(band([[34, 330], [96, 268]], 10), RULER, CUT),
    ],
    front: [
      // a few strands of grey hair over the crown and a fringe round the neck
      piece(curve([[cx - 46, cy - 40], [cx - 30, cy - 56], [cx + 30, cy - 56], [cx + 46, cy - 40], [cx + 50, cy + 20], [cx + 30, cy + 40], [cx - 30, cy + 40], [cx - 50, cy + 20]], 2), HAIR, { ...FLAT, opacity: 0.5 }),
      ink([[cx - 20, cy - 20], [cx - 14, cy + 20]], { width: 2, color: BEARD_SHADE }),
      ink([[cx + 6, cy - 22], [cx + 10, cy + 26]], { width: 2, color: BEARD_SHADE }),
      ink([[cx + 26, cy - 14], [cx + 30, cy + 18]], { width: 2, color: BEARD_SHADE }),
    ],
    hat: [
      piece(curve([[cx - 52, cy - 52], [cx - 48, cy - 70], [cx + 48, cy - 70], [cx + 52, cy - 52], [cx + 30, cy - 62], [cx - 30, cy - 62]], 2), GOWN),
      piece(poly([[cx - 86, cy - 76], [cx - 20, cy - 98], [cx + 86, cy - 90], [cx + 30, cy - 64]]), '#17141b', CUT),
      ink([[cx - 86, cy - 76], [cx - 20, cy - 98], [cx + 86, cy - 90]], { width: 2.4, color: GOWN_EDGE, wobble: 0.2 }),
      circle_dot(cx + 4, cy - 82),
    ],
    arms: [
      arm('armL', { from: [64, 266], via: [48, 302], to: [60, 330], sleeve: GOWN, cuff: LINING, hand: SKIN, width: 32 }),
      // raised to write: elbow out, hand up by the board, chalk in it
      arm('armR', { from: [236, 266], via: [270, 224], to: [262, 128], sleeve: GOWN, cuff: LINING, hand: SKIN, width: 32, holding: chalk }),
    ],
  });
});
