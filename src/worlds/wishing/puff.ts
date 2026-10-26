/**
 * Puff: a young dragon, as big as a horse but a baby at heart.
 *
 * A round green body with a cream tummy, a big round head with a lighter
 * muzzle, little orange spines along the crown and fins for ears, small
 * floppy orange wings (they droop; they are far too small to fly with), two
 * stubby arms with cream claws, big worried eyes and ONE big white front
 * tooth that hangs over his lip. The tooth is its own part so it can tilt
 * (wobble) and be hidden for the gap. He breathes grey smoke, never fire:
 * the smoke is the cartoon's own one-off, not painted in.
 *
 * Portrait (300 × 340, front view, the plain look is "worried"): head
 * centred at about (150, 138), eyes at (104, 112) and (196, 112), muzzle
 * below them, the tooth hanging from the lip at (150, 194) down to y 228.
 * The tooth pokes below the usual face box, so the portrait sets a `chip`.
 *
 * Poses:
 *   roar  head up, eyes screwed shut, brows steep, mouth wide open with the
 *         tooth hanging in it (tears: he is sore, not fierce).
 *   sad   head hung low, eyes looking down and wet, a wobbly frown, the
 *         tooth tipped, wings drooping.
 *   grin  eyes happy crescents, a big smile with a GAP where the tooth was
 *         (the `tooth` part is hidden), wings and arms up.
 *
 * Parts: figure, head, eyes, lids (hidden), brows, mouth, mouthOpen
 * (hidden), tooth (origin at the gum: rotate it to wobble it), armL, armR,
 * wingL, wingR (origins at the shoulders).
 */
import { C } from '../../art/palette';
import { cached, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { CUT, cx, FLAT, portrait } from '../faraway/parts';

type Mood = 'worried' | 'roar' | 'sad' | 'grin';

const GREEN = '#7bb26b';
const GREEN_SHADE = '#5f9a58';
const GREEN_DEEP = '#3f6f45';
const GREEN_LIGHT = '#a3cf8e';
const BELLY = C.cream;
const BELLY_SHADE = '#dcc9a0';
const SPINE = C.orange;
const SPINE_DARK = C.ginger;
const WING = '#e8b070';
const WING_RIB = '#b9733a';
const TOOTH = '#fbf8ee';
const TOOTH_EDGE = '#cbbf9f';
const MOUTH_IN = '#7d2a26';

/** Mirrors a point across the portrait's middle. */
const mx = ([x, y]: Pt): Pt => [300 - x, y];
const mirror = (pts: Pt[]): Pt[] => pts.map(mx);

/** One floppy wing, left side, rooted at the shoulder (88, 246); `lift` 1 up, 0 floppy, -1 drooping. */
function wingPts(lift: number): Pt[] {
  if (lift > 0) return [[90, 244], [52, 190], [16, 168], [8, 206], [22, 246], [60, 256], [88, 268]];
  if (lift < 0) return [[90, 248], [38, 252], [14, 292], [30, 326], [58, 312], [74, 316], [88, 284]];
  return [[90, 242], [46, 214], [10, 240], [8, 276], [30, 294], [48, 280], [70, 296], [88, 272]];
}

function wing(side: 'L' | 'R', lift: number): Node {
  const pts = wingPts(lift);
  const p = side === 'L' ? pts : mirror(pts);
  const root: Pt = side === 'L' ? [88, 252] : [212, 252];
  const tips: Pt[] = [pts[2], pts[3], pts[4]].map((t) => (side === 'L' ? t : mx(t)));
  return group({ part: side === 'L' ? 'wingL' : 'wingR', origin: root }, [
    piece(curve(p, 2), WING),
    ...tips.map((t) => ink([root, [(root[0] + t[0]) / 2, (root[1] + t[1]) / 2 + 4], t], { width: 3, color: WING_RIB, wobble: 0.4, opacity: 0.75 })),
  ]);
}

/** One stubby arm with three cream claws, on the left (shoulder at (86, 262)); `up` raises it for joy. */
function armPts(up: boolean): { shape: Pt[]; claws: Pt[][] } {
  if (up) {
    return {
      shape: [[90, 256], [106, 282], [70, 286], [38, 270], [16, 248], [30, 230], [58, 244]],
      claws: [[[16, 248], [4, 244], [12, 232]], [[22, 236], [12, 224], [26, 222]], [[32, 230], [32, 216], [42, 224]]],
    };
  }
  return {
    shape: [[84, 254], [112, 266], [104, 304], [86, 330], [60, 326], [58, 296]],
    claws: [[[60, 326], [52, 336], [66, 334]], [[72, 330], [68, 340], [82, 336]], [[84, 328], [86, 338], [96, 328]]],
  };
}

function arm(side: 'L' | 'R', up: boolean): Node {
  const { shape, claws } = armPts(up);
  const m = (pts: Pt[]): Pt[] => (side === 'L' ? pts : mirror(pts));
  return group({ part: side === 'L' ? 'armL' : 'armR', origin: side === 'L' ? [90, 260] : [210, 260] }, [
    piece(curve(m(shape), 2), GREEN_SHADE),
    ...claws.map((c) => piece(poly(m(c)), BELLY, CUT)),
  ]);
}

/** The big front tooth, hanging from the gum at (150, top): a rounded white slab. */
function tooth(top: number, h = 44): Node[] {
  return [
    piece(curve([[129, top - 3], [171, top - 3], [174, top + h * 0.7], [164, top + h], [136, top + h], [126, top + h * 0.7]], 2), TOOTH, { edge: 'cut', fibre: false }),
    ink([[136, top + 6], [134, top + h - 10]], { width: 3, color: TOOTH_EDGE, wobble: 0.2, opacity: 0.8 }),
    ink([[128, top + h * 0.72], [138, top + h - 1], [162, top + h - 1], [172, top + h * 0.72]], { width: 2.4, color: TOOTH_EDGE, wobble: 0.2, opacity: 0.8 }),
  ];
}

/** A big wet eye with a dark pupil looking (dx, dy). */
function eye(x: number, y: number, dx: number, dy: number): Node[] {
  return [
    piece(ellipse(x, y, 30, 34), GREEN_DEEP, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, y, 26, 30), '#fbf8ee', FLAT),
    piece(ellipse(x + dx, y + dy, 15, 17), '#2f4a2a', { edge: 'clean', shadow: false }),
    piece(ellipse(x + dx, y + dy, 8.5, 10), C.ink, { edge: 'clean', shadow: false }),
    dot(x + dx + 6, y + dy - 7, 5.2, C.white),
    dot(x + dx - 5, y + dy + 7, 2.4, C.white, 0.7),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const roar = mood === 'roar';
  const sad = mood === 'sad';
  const grin = mood === 'grin';
  const EY = 112;
  const LX = 104;
  const RX = 196;
  // The whole head sits a little lower when sad and a little higher when roaring.
  const dy = sad ? 16 : roar ? -4 : 0;
  const lipY = roar ? 176 : 196;

  // ---------------------------------------------------------------- eyes
  const lookX = sad ? 0 : 2;
  const lookY = sad ? 12 : -2;
  const eyesOpen: Node[] = [...eye(LX, EY, lookX + 3, lookY), ...eye(RX, EY, lookX - 3, lookY)];
  const eyesShut: Node[] = [
    // screwed up tight: two "> <" creases
    ink([[LX - 24, EY - 14], [LX + 6, EY + 2], [LX - 24, EY + 18]], { width: 6, color: C.ink, wobble: 0.3 }),
    ink([[RX + 24, EY - 14], [RX - 6, EY + 2], [RX + 24, EY + 18]], { width: 6, color: C.ink, wobble: 0.3 }),
  ];
  const eyesHappy: Node[] = [
    ink([[LX - 24, EY + 8], [LX - 8, EY - 12], [LX + 10, EY - 12], [LX + 24, EY + 8]], { width: 6, color: C.ink, wobble: 0.3 }),
    ink([[RX - 24, EY + 8], [RX - 8, EY - 12], [RX + 10, EY - 12], [RX + 24, EY + 8]], { width: 6, color: C.ink, wobble: 0.3 }),
  ];
  const eyeNodes = roar ? eyesShut : grin ? eyesHappy : eyesOpen;
  const lids: Node[] = [LX, RX].flatMap((x) => [
    piece(ellipse(x, EY, 28, 32), GREEN, { edge: 'clean', shadow: false }),
    ink([[x - 24, EY + 6], [x - 8, EY + 14], [x + 8, EY + 14], [x + 24, EY + 6]], { width: 4.5, color: C.ink, wobble: 0.3 }),
  ]);

  // Tears when he is sore: a droplet at each eye's lower corner.
  const tear = (x: number, y: number, s = 1): Node =>
    piece(poly([[x, y - 14 * s], [x + 8 * s, y + 2 * s], [x, y + 10 * s], [x - 8 * s, y + 2 * s]]), '#a8d4ec', { edge: 'cut', fibre: false, shadow: false, opacity: 0.95 });
  const tears: Node[] = sad ? [tear(LX - 14, EY + 46), tear(RX + 14, EY + 50), tear(LX + 8, EY + 58, 0.8)] : roar ? [tear(LX - 30, EY + 34, 0.9), tear(RX + 30, EY + 34, 0.9)] : [];

  // ---------------------------------------------------------------- brows (worried: inner ends up)
  const browL: Pt[] = roar
    ? [[LX - 34, EY - 22], [LX + 2, EY - 52], [LX + 6, EY - 40], [LX - 28, EY - 12]]
    : sad
      ? [[LX - 32, EY - 26], [LX + 8, EY - 54], [LX + 12, EY - 42], [LX - 26, EY - 16]]
      : grin
        ? [[LX - 30, EY - 40], [LX, EY - 54], [LX + 12, EY - 46], [LX - 20, EY - 34]]
        : [[LX - 32, EY - 30], [LX + 6, EY - 50], [LX + 10, EY - 38], [LX - 28, EY - 20]];
  const brows: Node[] = [
    piece(curve(browL, 2), SPINE_DARK, { edge: 'cut', fibre: false }),
    piece(curve(mirror(browL), 2), SPINE_DARK, { edge: 'cut', fibre: false }),
  ];
  // mirror() flips across x = 150; the right eye is at 196 = 300 - 104, so this lines up.

  // ---------------------------------------------------------------- mouth
  const smile: Pt[] = [[100, 192], [124, 214], [150, 222], [176, 214], [200, 192]];
  const worried: Pt[] = [[100, 204], [122, 196], [150, 202], [178, 196], [200, 204]];
  const frown: Pt[] = [[106, 214], [126, 200], [150, 196], [174, 200], [194, 214]];
  const closedLine = grin ? smile : sad ? frown : worried;
  const mouth: Node[] = roar
    ? [
        // wide open: dark inside, a tongue, a lower jaw dropped under it
        piece(curve([[80, 176], [150, 168], [220, 176], [226, 214], [196, 256], [150, 266], [104, 256], [74, 214]], 2), MOUTH_IN, FLAT),
        piece(ellipse(150, 246, 44, 15), C.rose, { edge: 'cut', fibre: false, shadow: false }),
        piece(curve([[84, 238], [108, 268], [150, 278], [192, 268], [216, 238], [198, 256], [150, 264], [102, 256]], 2), GREEN_LIGHT, { edge: 'cut', fibre: false }),
      ]
    : grin
      ? [
          piece(curve([[96, 190], [120, 220], [150, 230], [180, 220], [204, 190], [150, 196]], 2), MOUTH_IN, FLAT),
          piece(ellipse(150, 218, 26, 9), C.rose, { edge: 'cut', fibre: false, shadow: false }),
          // a row of little teeth along the top, with a GAP in the middle where the big one was
          ...[-46, -32, -18, 18, 32, 46].map((dx) => piece(poly([[150 + dx - 6, 194], [150 + dx + 6, 194], [150 + dx + 5, 205], [150 + dx - 5, 205]]), TOOTH, FLAT)),
          ink(closedLine, { width: 4, color: C.ink, wobble: 0.3 }),
        ]
      : [ink(closedLine, { width: 4.5, color: C.ink, wobble: 0.3 })];
  const mouthOpen: Node[] = roar
    ? [piece(curve([[76, 176], [150, 166], [224, 176], [232, 216], [200, 262], [150, 274], [100, 262], [68, 216]], 2), MOUTH_IN, FLAT)]
    : [
        piece(ellipse(150, lipY + 12, 42, 20), MOUTH_IN, FLAT),
        piece(ellipse(150, lipY + 22, 24, 8), C.rose, { edge: 'cut', fibre: false, shadow: false }),
      ];

  // ---------------------------------------------------------------- the tooth, its own part
  const wobble = sad ? -14 : roar ? 0 : 6;
  const toothPart = group({ part: 'tooth', origin: [150, lipY], opacity: grin ? 0 : 1, transform: wobble ? `rotate(${wobble})` : undefined }, tooth(lipY));

  const lift = grin ? 1 : sad ? -1 : 0;

  const headInner: Node[] = [
    // ear fins and crown spines sit behind the head
    piece(poly([[64, 112], [18, 86], [30, 136], [58, 148]]), SPINE, CUT),
    piece(poly([[236, 112], [282, 86], [270, 136], [242, 148]]), SPINE, CUT),
    piece(poly([[58, 120], [34, 106], [40, 134], [56, 140]]), C.goldLight, { ...FLAT, opacity: 0.7 }),
    piece(poly([[242, 120], [266, 106], [260, 134], [244, 140]]), C.goldLight, { ...FLAT, opacity: 0.7 }),
    piece(poly([[108, 62], [120, 18], [138, 52]]), SPINE, CUT),
    piece(poly([[136, 50], [150, 2], [166, 50]]), SPINE_DARK, CUT),
    piece(poly([[162, 52], [180, 18], [192, 62]]), SPINE, CUT),
    // the round head, a darker crown and a pale muzzle
    piece(curve([[46, 140], [52, 86], [92, 48], [150, 40], [208, 48], [248, 86], [254, 140], [246, 196], [206, 234], [150, 240], [94, 234], [54, 196]], 3), GREEN),
    piece(curve([[60, 92], [96, 56], [150, 48], [204, 56], [240, 92], [200, 72], [150, 66], [100, 72]], 2), GREEN_SHADE, { rough: 0.8, shadow: false }),
    piece(ellipse(70, 168, 22, 13), '#e8907e', { ...FLAT, opacity: 0.55 }),
    piece(ellipse(230, 168, 22, 13), '#e8907e', { ...FLAT, opacity: 0.55 }),
    piece(roar ? ellipse(150, 154, 68, 26) : ellipse(150, 178, 68, 46), GREEN_LIGHT, { rough: 0.8, shadow: false }),
    // nostrils
    piece(ellipse(130, roar ? 146 : 156, 7, 5), GREEN_DEEP, { edge: 'clean', shadow: false }),
    piece(ellipse(170, roar ? 146 : 156, 7, 5), GREEN_DEEP, { edge: 'clean', shadow: false }),
    group({ part: 'eyes', origin: [cx, EY] }, eyeNodes),
    group({ part: 'lids', origin: [cx, EY], opacity: 0 }, lids),
    group({ part: 'brows', origin: [cx, EY - 40] }, brows),
    ...tears,
    group({ part: 'mouth', origin: [cx, lipY + 10] }, mouth),
    group({ part: 'mouthOpen', origin: [cx, lipY + 10], opacity: 0 }, mouthOpen),
    toothPart,
  ];

  const headTransform = roar ? 'translate(0 -4) rotate(-4 150 210)' : `translate(0 ${dy})`;

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 340] }, [
      // wings behind the body
      wing('L', lift),
      wing('R', lift),
      // the round body and its cream tummy
      piece(curve([[44, 300], [50, 238], [96, 204], [150, 198], [204, 204], [250, 238], [256, 300], [226, 340], [150, 346], [74, 340]], 3), GREEN),
      piece(curve([[82, 252], [150, 238], [218, 252], [214, 306], [186, 336], [150, 340], [114, 336], [86, 306]], 3), BELLY, { rough: 0.8 }),
      ...[262, 280, 298, 316].map((y, i) => ink([[96 + i * 4, y], [150, y + 6], [204 - i * 4, y]], { width: 2.4, color: BELLY_SHADE, wobble: 0.5 })),
      // a few orange spines down the back peeping over the shoulders
      piece(poly([[62, 244], [48, 222], [80, 232]]), SPINE, CUT),
      piece(poly([[238, 244], [252, 222], [220, 232]]), SPINE, CUT),
      arm('L', grin),
      arm('R', grin),
      group({ part: 'head', origin: [150, 210] }, [group({ transform: headTransform }, headInner)]),
    ]),
  ]);
}

/** Puff, a young dragon, worried: big eyes, brows up in the middle, a wobbly little mouth, and the big wobbly tooth. */
export const puff = cached((): string => draw('worried', 'wishing-puff', 'Puff the young dragon'));

/** Roaring: head up, eyes screwed shut, mouth wide, tears. He is sore, not fierce. */
export const puffRoar = cached((): string => draw('roar', 'wishing-puff-roar', 'Puff roaring'));

/** Sad: head hung low, wet eyes looking down, a wobbly frown. */
export const puffSad = cached((): string => draw('sad', 'wishing-puff-sad', 'Puff feeling sad'));

/** Grinning, with a gap where the tooth was: happy crescent eyes, arms and wings up. */
export const puffGrin = cached((): string => draw('grin', 'wishing-puff-grin', 'Puff grinning with a gap'));
