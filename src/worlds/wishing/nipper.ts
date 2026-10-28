/**
 * Old Nipper: a big, grumpy, very old red crab, as big as a dog, who hoards
 * shiny things in his dark cave. Cross and clicky, funny-grumpy and never
 * nasty: under the shell he is lonely.
 *
 * A wide oval red shell with knobbly bumps, darker spots and a couple of grey
 * barnacles (he is old), a cream rim and underside, three pointy legs poking
 * out each side, and two eyes on stalks that rise from the top of the shell,
 * each under a bushy grey brow. The mouth sits on the front of the shell.
 * Two HUGE claws, one each side, each a pincer with a fixed finger and a
 * movable one (drawn a little open).
 *
 * Portrait (300 x 340, front view, the plain look is "grumpy"): shell centred
 * at (150, 222), bottom about y 312. Eyes at (108, 100) and (192, 100), brows
 * just above them, mouth at about (150, 186). The face fits the usual box
 * 78 62 144 144. Claws half raised: elbows at (92, 222) and (208, 222),
 * pincer tips about (24, 76) and (276, 76).
 *
 * Poses:
 *   snap  claws HIGH and wide open, cross brows, mouth open in a shout (dark
 *         inside, no teeth), eyes bigger and leaning forward. The looming one.
 *   sulk  claws drooping low and in, a pout, eyes looking down and away,
 *         worried brows. Sad-grumpy, lonely.
 *   grin  claws up happily, a wide toothless smile, happy crescent eyes,
 *         brows raised, rosy patches.
 *
 * Parts: figure, head (the eye stalks, eyes, brows and mouth), eyes, lids
 * (hidden), brows, mouth, mouthOpen (hidden), clawL, clawR (origins at the
 * elbows: rotate them to lift, drop or shake a claw).
 */
import { C } from '../../art/palette';
import { cached, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../art/paper';

type Mood = 'grumpy' | 'snap' | 'sulk' | 'grin';

const RED = '#c8452f';
const RED_LIGHT = '#dc6a4a';
const RED_SHADE = '#a5331f';
const RED_DEEP = '#7c2417';
const CREAM = '#f0d6a8';
const BROW = '#b9b6ae';
const BROW_DARK = '#8f8c86';
const BARNACLE = '#cfc9b8';
const MOUTH_IN = '#4a1410';
const CHEEK = '#ee8c78';

const FLATP = { edge: 'cut', fibre: false, shadow: false } as const;
const CUTP = { edge: 'cut', fibre: false } as const;

const mx = ([x, y]: Pt): Pt => [300 - x, y];
const mirror = (pts: Pt[]): Pt[] => pts.map(mx);

/** Places points drawn around the origin (pointing up): scale, turn clockwise by `deg`, move to (tx, ty). */
function place(pts: Pt[], tx: number, ty: number, deg: number, s = 1): Pt[] {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const sn = Math.sin(a);
  return pts.map(([x, y]) => [tx + (x * c - y * sn) * s, ty + (x * sn + y * c) * s]);
}

interface ClawPose {
  wrist: Pt;
  /** Which way the pincer points, in degrees clockwise from straight up (left claw). */
  turn: number;
  /** How far the movable finger swings open, in degrees. */
  gape: number;
  scale: number;
}

const ELBOW: Pt = [92, 222];

const CLAWS: Record<Mood, ClawPose> = {
  grumpy: { wrist: [50, 158], turn: -14, gape: 20, scale: 0.88 },
  snap: { wrist: [40, 136], turn: -22, gape: 40, scale: 0.98 },
  sulk: { wrist: [48, 252], turn: 152, gape: 6, scale: 0.84 },
  grin: { wrist: [46, 142], turn: -20, gape: 26, scale: 0.88 },
};

/** The pincer drawn upright with the wrist at (0, 0): a big round palm and two horns that curve in; the right-hand one swings out by `gape`. */
function pincer(gape: number): { palm: Pt[]; fixed: Pt[]; mover: Pt[] } {
  const hinge: Pt = [18, -44];
  const mover = curve([[40, -40], [42, -70], [30, -98], [8, -118], [10, -90], [2, -66], [-4, -44]], 2);
  const swung = mover.map(([x, y]): Pt => {
    const a = (gape * Math.PI) / 180;
    const dx = x - hinge[0];
    const dy = y - hinge[1];
    return [hinge[0] + dx * Math.cos(a) - dy * Math.sin(a), hinge[1] + dx * Math.sin(a) + dy * Math.cos(a)];
  });
  return {
    palm: curve([[-28, 8], [-42, -22], [-38, -52], [-8, -62], [34, -56], [42, -26], [26, 8]], 2),
    fixed: curve([[-38, -40], [-42, -70], [-30, -98], [-6, -118], [-8, -90], [0, -66], [4, -44]], 2),
    mover: swung,
  };
}

/** One whole claw: an arm from the elbow to the wrist, then the pincer. Drawn for the left; mirrored for the right. */
function claw(side: 'L' | 'R', mood: Mood): Node {
  const p = CLAWS[mood];
  const m = (pts: Pt[]): Pt[] => (side === 'L' ? pts : mirror(pts));
  const at = (pts: Pt[]): Pt[] => m(place(pts, p.wrist[0], p.wrist[1], p.turn, p.scale));
  const pc = pincer(p.gape);
  const [ex, ey] = ELBOW;
  const [wx, wy] = p.wrist;
  // the arm: a fat strip from elbow to wrist
  const len = Math.hypot(wx - ex, wy - ey) || 1;
  const nx = (-(wy - ey) / len) * 15;
  const ny = ((wx - ex) / len) * 15;
  const arm: Pt[] = [[ex + nx, ey + ny], [(ex + wx) / 2 + nx * 1.2, (ey + wy) / 2 + ny * 1.2], [wx + nx * 0.8, wy + ny * 0.8], [wx - nx * 0.8, wy - ny * 0.8], [(ex + wx) / 2 - nx * 1.2, (ey + wy) / 2 - ny * 1.2], [ex - nx, ey - ny]];
  const origin = m([ELBOW])[0];
  return group({ part: side === 'L' ? 'clawL' : 'clawR', origin }, [
    piece(curve(m(arm), 2), RED_SHADE),
    piece(curve(at(pc.mover), 1), RED_LIGHT, CUTP),
    piece(curve(at(pc.fixed), 1), RED_LIGHT, CUTP),
    piece(curve(at(pc.palm), 2), RED),
    // a pale highlight and a few dark knobbles on the knuckle
    piece(ellipse(...(at([[-8, -34]])[0] as Pt), 9 * p.scale, 13 * p.scale, side === 'L' ? p.turn : -p.turn), RED_LIGHT, { ...FLATP, opacity: 0.6 }),
    ...[[-14, -14], [12, -18], [4, -4]].map(([x, y]) => dot(...(at([[x, y]])[0] as Pt), 3.2 * p.scale, RED_DEEP, 0.55)),
    // the joint where the arm meets the body
    piece(ellipse(...(m([ELBOW])[0] as Pt), 17, 15), RED_SHADE, CUTP),
  ]);
}

/** One eye on a stalk: a white ball, a pupil looking (dx, dy), a shine. */
function eye(x: number, y: number, r: number, dx: number, dy: number, mood: Mood): Node[] {
  if (mood === 'grin') {
    // happy crescents
    return [
      piece(ellipse(x, y, r, r), '#fbf8ee', FLATP),
      ink([[x - r * 0.9, y + r * 0.35], [x - r * 0.45, y - r * 0.4], [x + r * 0.45, y - r * 0.4], [x + r * 0.9, y + r * 0.35]], { width: 6, color: C.ink, wobble: 0.3 }),
    ].slice(1);
  }
  return [
    piece(ellipse(x, y, r + 3, r + 3), RED_DEEP, { ...FLATP }),
    piece(ellipse(x, y, r, r), '#fbf8ee', FLATP),
    piece(ellipse(x + dx, y + dy, r * 0.55, r * 0.55), '#3a1f14', { edge: 'clean', shadow: false }),
    piece(ellipse(x + dx, y + dy, r * 0.3, r * 0.3), C.ink, { edge: 'clean', shadow: false }),
    dot(x + dx + 3.5, y + dy - 4, 3.2, C.white),
  ];
}

/** A bushy grey brow over an eye at (x, y); `tilt` > 0 drops the inner end (cross), < 0 lifts it (worried). */
function brow(side: 'L' | 'R', x: number, y: number, r: number, tilt: number, lift: number): Node {
  // drawn for the left eye: outer end to the left, inner end toward the middle
  const xo = x - r - 6;
  const yo = y - r - 6 - lift - tilt * 0.5;
  const xi = x + r + 2;
  const yi = y - r - 4 - lift + tilt;
  const ym = (yo + yi) / 2 - 6;
  const L: Pt[] = [[xo, yo], [(xo + xi) / 2, ym - 4], [xi, yi], [xi, yi + 13], [(xo + xi) / 2, ym + 12], [xo, yo + 12]];
  const f = (p: Pt[]): Pt[] => (side === 'L' ? p : mirror(p));
  const tufts = [0.15, 0.4, 0.65, 0.9].map((t) => {
    const tx = xo + (xi - xo) * t;
    const ty = yo + (yi - yo) * t - (t > 0.2 && t < 0.8 ? 4 : 0);
    return ink(f([[tx, ty + 6], [tx + 3, ty - 7]]), { width: 3.2, color: BROW_DARK, wobble: 0.5 });
  });
  return group({}, [piece(curve(f(L), 1), BROW, { rough: 1.2 }), ...tufts]);
}

function draw(mood: Mood, name: string, label: string): string {
  const snap = mood === 'snap';
  const sulk = mood === 'sulk';
  const grin = mood === 'grin';

  // ---------------------------------------------------------------- eyes on stalks
  const EY = sulk ? 110 : snap ? 104 : 100;
  const R = snap ? 24 : 21;
  const LX = snap ? 104 : 108;
  const RX = 300 - LX;
  const look: Pt = sulk ? [-3, 9] : snap ? [0, 3] : grin ? [0, 0] : [4, 2];
  const eyeNodes: Node[] = [...eye(LX, EY, R, look[0], look[1], mood), ...eye(RX, EY, R, -look[0], look[1], mood)];
  const lids: Node[] = [LX, RX].flatMap((x) => [
    piece(ellipse(x, EY, R + 2, R + 2), RED, { edge: 'clean', shadow: false }),
    ink([[x - R + 2, EY + 4], [x - 7, EY + 10], [x + 7, EY + 10], [x + R - 2, EY + 4]], { width: 4.5, color: RED_DEEP, wobble: 0.3 }),
  ]);
  const tilt = snap ? 16 : sulk ? -12 : grin ? -3 : 15;
  const lift = grin ? 8 : sulk ? -2 : 0;
  const brows: Node[] = [brow('L', LX, EY, R, tilt, lift), brow('R', LX, EY, R, tilt, lift)];

  // stalks lean forward when he snaps: they are drawn wider and the eyes sit lower
  const stalk = (x: number, topX: number): Node =>
    piece(curve([[x - 12, 156], [topX - 9, EY + 8], [topX + 9, EY + 8], [x + 12, 156]], 2), RED_SHADE, CUTP);
  const stalks: Node[] = [stalk(116, LX + 2), stalk(184, RX - 2)];

  // ---------------------------------------------------------------- mouth on the shell front
  const MY = snap ? 190 : 186;
  const smile: Pt[] = [[104, 178], [124, 196], [150, 202], [176, 196], [196, 178]];
  const grumpyLine: Pt[] = [[112, 196], [128, 184], [150, 180], [172, 184], [188, 196]];
  const pout: Pt[] = [[126, 194], [140, 186], [160, 186], [174, 194]];
  const mouth: Node[] = snap
    ? [
        piece(curve([[104, 176], [150, 166], [196, 176], [200, 198], [178, 216], [150, 220], [122, 216], [100, 198]], 2), MOUTH_IN, FLATP),
        piece(ellipse(150, 208, 26, 8), '#a8453a', FLATP),
        ink([[100, 178], [150, 168], [200, 178]], { width: 4, color: RED_DEEP, wobble: 0.3 }),
      ]
    : grin
      ? [
          piece(curve([[100, 176], [124, 198], [150, 204], [176, 198], [200, 176], [150, 184]], 2), MOUTH_IN, FLATP),
          piece(ellipse(150, 196, 20, 6), '#a8453a', FLATP),
          ink(smile, { width: 4, color: RED_DEEP, wobble: 0.3 }),
        ]
      : sulk
        ? [ink(pout, { width: 5, color: RED_DEEP, wobble: 0.3 }), ink([[120, 198], [126, 194]], { width: 3.5, color: RED_DEEP }), ink([[180, 198], [174, 194]], { width: 3.5, color: RED_DEEP })]
        : [ink(grumpyLine, { width: 5, color: RED_DEEP, wobble: 0.3 }), ink([[108, 198], [114, 192]], { width: 3.5, color: RED_DEEP }), ink([[192, 198], [186, 192]], { width: 3.5, color: RED_DEEP })];
  const mouthOpen: Node[] = [
    piece(ellipse(150, MY + 2, 34, 18), MOUTH_IN, FLATP),
    piece(ellipse(150, MY + 12, 18, 6), '#a8453a', FLATP),
  ];

  // ---------------------------------------------------------------- legs: three a side, poking out under the shell
  const sag = sulk ? 6 : 0;
  const leg = (pts: Pt[]): Node => ink(pts, { width: 8, color: RED_DEEP, wobble: 0.4 });
  const legs: Node[] = [
    leg([[84, 262], [54, 276 + sag], [34, 300 + sag], [30, 324]]),
    leg([[78, 282], [48, 300 + sag], [34, 322]]),
    leg([[92, 296], [68, 316], [60, 334]]),
    leg([[216, 262], [246, 276 + sag], [266, 300 + sag], [270, 324]]),
    leg([[222, 282], [252, 300 + sag], [266, 322]]),
    leg([[208, 296], [232, 316], [240, 334]]),
  ];

  // ---------------------------------------------------------------- shell
  const bump = (x: number, y: number, r: number): Node => piece(ellipse(x, y, r, r * 0.8), RED_LIGHT, { ...FLATP, opacity: 0.7 });
  const spot = (x: number, y: number, r: number): Node => piece(ellipse(x, y, r, r * 0.8), RED_SHADE, { ...FLATP, opacity: 0.6 });
  const barnacle = (x: number, y: number, s: number): Node[] => [
    piece(poly([[x - 8 * s, y + 5 * s], [x - 4 * s, y - 7 * s], [x + 4 * s, y - 7 * s], [x + 8 * s, y + 5 * s]]), BARNACLE, CUTP),
    ink([[x - 3 * s, y - 4 * s], [x + 3 * s, y - 4 * s]], { width: 2.4, color: BROW_DARK, wobble: 0.2 }),
  ];
  const shell: Node[] = [
    // the cream underside peeks out below the rim
    piece(curve([[56, 262], [80, 304], [150, 322], [220, 304], [244, 262], [200, 300], [150, 310], [100, 300]], 2), CREAM, { rough: 0.8 }),
    // the knobbly red shell
    piece(
      curve(
        [[44, 232], [46, 196], [64, 164], [96, 142], [124, 132], [150, 128], [176, 132], [204, 142], [236, 164], [254, 196], [256, 232], [240, 274], [200, 300], [150, 308], [100, 300], [60, 274]],
        3,
      ),
      RED,
    ),
    // a darker rim round the front and a paler domed back
    piece(curve([[62, 250], [100, 288], [150, 296], [200, 288], [238, 250], [214, 280], [150, 288], [86, 280]], 2), RED_SHADE, { rough: 0.8, shadow: false }),
    piece(curve([[70, 188], [100, 156], [150, 146], [200, 156], [230, 188], [200, 170], [150, 162], [100, 170]], 2), RED_LIGHT, { rough: 0.8, shadow: false, opacity: 0.8 }),
    bump(84, 214, 11), bump(212, 222, 12), bump(106, 252, 9), bump(194, 256, 10), bump(150, 150, 9), bump(70, 240, 7), bump(232, 246, 7),
    spot(70, 206, 7), spot(228, 204, 8), spot(126, 262, 6), spot(176, 270, 7), spot(150, 232, 5),
    ...barnacle(204, 164, 1), ...barnacle(86, 262, 0.8), ...barnacle(222, 262, 0.7),
  ];
  const cheeks: Node[] = grin ? [piece(ellipse(92, 204, 16, 10), CHEEK, { ...FLATP, opacity: 0.8 }), piece(ellipse(208, 204, 16, 10), CHEEK, { ...FLATP, opacity: 0.8 })] : [];
  // a worn-out crab has a little dent above the mouth
  const nose: Node[] = [ink([[132, 166], [150, 170], [168, 166]], { width: 3, color: RED_SHADE, wobble: 0.3, opacity: 0.7 })];

  return svg({ w: 300, h: 340, name, label, className: 'portrait' }, [
    group({ part: 'figure', origin: [150, 340] }, [
      ...legs,
      ...shell,
      ...nose,
      ...cheeks,
      claw('L', mood),
      claw('R', mood),
      group({ part: 'head', origin: [150, 160] }, [
        ...stalks,
        group({ part: 'eyes', origin: [150, EY] }, eyeNodes),
        group({ part: 'lids', origin: [150, EY], opacity: 0 }, lids),
        group({ part: 'brows', origin: [150, EY - 22] }, brows),
        group({ part: 'mouth', origin: [150, MY] }, mouth),
        group({ part: 'mouthOpen', origin: [150, MY], opacity: 0 }, mouthOpen),
      ]),
    ]),
  ]);
}

/** Old Nipper, grumpy: cross brows, a downturned mouth, claws half raised and a little open. */
export const nipper = cached((): string => draw('grumpy', 'wishing-nipper', 'Old Nipper the crab'));

/** Looming: claws high and gaping, a shout with a dark mouth, eyes bulging forward. */
export const nipperSnap = cached((): string => draw('snap', 'wishing-nipper-snap', 'Old Nipper snapping'));

/** Sulking: claws drooping low and in, a pout, eyes down and away, worried brows. */
export const nipperSulk = cached((): string => draw('sulk', 'wishing-nipper-sulk', 'Old Nipper sulking'));

/** Grinning: claws up, a wide toothless smile, happy crescent eyes, rosy patches. */
export const nipperGrin = cached((): string => draw('grin', 'wishing-nipper-grin', 'Old Nipper grinning'));
