/**
 * Grizzle: the river troll who lives under the old wooden bridge. Scary to
 * look at, soft underneath: grumpy, loud, then funny. Head and shoulders, big
 * and chunky, so he fills the portrait wider than the children do.
 *
 * He is a knobbly, mossy, sage-grey-green troll: darker moss blotches and a few
 * pale warts on his skin, a big lumpy potato nose, small deep-set eyes under
 * very heavy craggy brows, and big floppy pointed ears with tufts. A mop of
 * rusty orange-brown shaggy hair with a strand of green pondweed in it and a
 * tiny snail shell (cute). Two small BLUNT teeth poke up from his bottom lip
 * (never sharp fangs). He wears a patched oatmeal sackcloth tunic with a rope
 * tied at the neck. His hands are big and knobbly, with thick fingers.
 *
 * Poses: grumpy (default: sulky downturned mouth, arms down), roar (arms
 * wide and raised, brows knotted, a great open mouth), sulk (arms folded,
 * lip pushed out, eyes down and to the side, worried brows) and beam (a huge
 * grin, arched brows, rosy cheeks, arms open).
 *
 * Features sit inside the chip box (78 62 144 144), so no `chip` is needed:
 * eyes at y 118 (x 120 and 180), nose at y 152, mouth at y 190.
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR (origin
 * at each shoulder: armL is on the left of the picture).
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, type Node } from '../../art/paper';
import { CUT, FLAT, cx, fluff, framed, portrait } from '../faraway/parts';

type Mood = 'grump' | 'roar' | 'sulk' | 'beam';

const SKIN = '#9aa58a';
const SKIN_DARK = '#7f8c70';
const MOSS = '#6f7e5c';
const WART = '#b7c1a2';
const NOSE = '#a99f8c';
const BROW = '#56634a';
const HAIR = '#b5642c';
const HAIR_DARK = '#8f4a1f';
const HAIR_LIGHT = '#cf8240';
const TUNIC = '#c9b48a';
const TUNIC_DARK = '#a99468';
const PATCH = '#7e6a4e';
const ROPE = '#7a5a34';
const TOOTH = '#f1e6c8';
const SHELL = '#d9b38a';

const hairPts = (pts: [number, number][]): [number, number][] => pts.map(([x, y]) => [150 + (x - 150) * 0.88, y]);

const EY = 118;
const EX = 30; // half the distance between the eyes
const MY = 190; // the mouth line

/** Big blunt teeth poking up from the bottom lip. */
const teeth = (y: number, h = 11): Node[] => [
  piece(rect(cx - 17, y, 11, h, 4), TOOTH, { edge: 'clean', shadow: false }),
  piece(rect(cx + 6, y, 11, h, 4), TOOTH, { edge: 'clean', shadow: false }),
];

/** A big knobbly fist: a fat palm with four thick knuckles and a thumb. */
function fist(x: number, y: number, s: number): Node[] {
  return [
    piece(ellipse(x - s * 22, y + 2, 10, 14, s * 20), SKIN, CUT),
    piece(ellipse(x, y, 26, 22), SKIN, CUT),
    ...[-16, -6, 5, 15].map((dx, i) => piece(ellipse(x + dx, y - 12 + (i === 1 || i === 2 ? -2 : 0), 8.5, 10), SKIN, CUT)),
    piece(ellipse(x + 8, y + 8, 9, 5), MOSS, { ...FLAT, opacity: 0.4 }),
    piece(circle(x - 10, y - 2, 3), WART, FLAT),
  ];
}

/** A big open hand, fingers fanned out and pointing up (rotated by `a` degrees). */
function openHand(x: number, y: number, a: number, spread: number): Node[] {
  const at = (t: number, len: number): [number, number] => {
    const r = ((a + t) * Math.PI) / 180;
    return [x + Math.sin(r) * len, y - Math.cos(r) * len];
  };
  const fingers = [-32, -11, 10, 30].map((t, i) => {
    const [fx, fy] = at(t * spread, 30 + (i === 1 || i === 2 ? 6 : 0));
    return piece(ellipse(fx, fy, 10, 23, a + t * spread), SKIN, CUT);
  });
  const [tx, ty] = at(a < 0 ? -78 : 78, 24);
  return [
    ...fingers,
    piece(ellipse(tx, ty, 10, 17, a + (a < 0 ? -62 : 62)), SKIN, CUT),
    piece(ellipse(x, y, 27, 23), SKIN, CUT),
    piece(ellipse(x + 8, y + 8, 10, 6), MOSS, { ...FLAT, opacity: 0.4 }),
    piece(circle(x - 6, y - 4, 3), WART, FLAT),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const roar = mood === 'roar';
  const sulk = mood === 'sulk';
  const beam = mood === 'beam';

  // ---- eyes: small, deep-set ----
  const eye = (x: number, side: number): Node[] => {
    const sock = piece(ellipse(x, EY, 18, 13), SKIN_DARK, { ...FLAT, opacity: 0.8 });
    if (beam) {
      // happy arcs
      return [sock, ink([[x - 11, EY + 4], [x, EY - 6], [x + 11, EY + 4]], { width: 4.4, color: C.ink })];
    }
    const big = roar ? 12.5 : 10;
    const px = sulk ? side * 0 - 3 : 0;
    const py = sulk ? 4 : 0.5;
    return [
      sock,
      piece(ellipse(x, EY, 11.5, big), C.white, { edge: 'clean', shadow: false }),
      piece(circle(x + px, EY + py, roar ? 5.6 : 5.2), C.ink, { edge: 'clean', shadow: false }),
      dot(x + px - 1.6, EY + py - 1.8, 1.7, C.white),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(ellipse(x, EY, 16, 12), SKIN, FLAT),
    ink([[x - 11, EY + 2], [x, EY + 7], [x + 11, EY + 2]], { width: 3, color: C.ink }),
  ];

  // ---- heavy craggy brows ----
  const brow = (s: number): Node[] => {
    const yi = roar ? 103 : sulk ? 90 : beam ? 87 : 99;
    const yo = roar ? 85 : sulk ? 102 : beam ? 86 : 91;
    const pts = (t: number): [number, number, number] => [cx + s * (7 + 48 * t), yi + (yo - yi) * t, 0];
    const top: [number, number][] = [0, 0.3, 0.65, 1].map((t, i) => {
      const [x, y] = pts(t);
      return [x, y - 10 - (i === 1 ? 3 : i === 2 ? 2 : 0)];
    });
    const bot: [number, number][] = [1, 0.65, 0.3, 0].map((t, i) => {
      const [x, y] = pts(t);
      return [x, y + 8 + (i === 1 ? 2 : 0)];
    });
    return [
      piece(curve([...top, ...bot], 1), BROW, { rough: 1.5 }),
      piece(curve([top[1], top[2], [top[2][0], top[2][1] + 7], [top[1][0], top[1][1] + 7]], 1), MOSS, { rough: 1, opacity: 0.55 }),
    ];
  };

  // ---- mouths ----
  const lip = (y: number, rx = 22, ry = 7): Node => piece(ellipse(cx, y, rx, ry), '#8a8f77', { ...FLAT });
  const grin = (fill: boolean): Node[] => {
    const shape = curve([[cx - 40, MY - 6], [cx - 20, MY + 2], [cx + 20, MY + 2], [cx + 40, MY - 6], [cx + 30, MY + 16], [cx, MY + 26], [cx - 30, MY + 16]], 2);
    return fill
      ? [piece(shape, C.redDark, FLAT), piece(ellipse(cx, MY + 19, 14, 6), C.rose, { edge: 'clean', shadow: false }), ...teeth(MY + 3, 12)]
      : [
          ink([[cx - 40, MY - 6], [cx - 20, MY + 14], [cx + 20, MY + 14], [cx + 40, MY - 6]], { width: 5, color: C.redDark }),
          ...teeth(MY + 4, 10),
        ];
  };
  const bigHole: Node[] = [
    piece(ellipse(cx, MY + 8, 36, 27), C.redDark, FLAT),
    piece(ellipse(cx, MY + 24, 21, 8), C.rose, { edge: 'clean', shadow: false }),
    ...teeth(MY + 11, 16),
  ];

  let mouth: Node[];
  let mouthOpen: Node[];
  if (roar) {
    mouth = bigHole;
    mouthOpen = bigHole;
  } else if (beam) {
    mouth = grin(false);
    mouthOpen = grin(true);
  } else if (sulk) {
    mouth = [
      ink([[cx - 22, MY + 3], [cx - 8, MY - 3], [cx + 8, MY - 3], [cx + 22, MY + 3]], { width: 4.2, color: C.redDark }),
      lip(MY + 9, 24, 9),
      ...teeth(MY - 2, 10),
      ink([[cx - 14, MY + 14], [cx, MY + 17], [cx + 14, MY + 14]], { width: 2.4, color: SKIN_DARK }),
    ];
    mouthOpen = [
      piece(curve([[cx - 20, MY - 1], [cx + 20, MY - 1], [cx + 15, MY + 12], [cx - 15, MY + 12]], 2), C.redDark, FLAT),
      lip(MY + 13, 25, 9),
      ...teeth(MY + 1, 10),
    ];
  } else {
    mouth = [
      ink([[cx - 26, MY + 7], [cx - 12, MY - 1], [cx + 12, MY - 1], [cx + 26, MY + 7]], { width: 4.6, color: C.redDark }),
      lip(MY + 9, 22, 6),
      ...teeth(MY - 2, 11),
    ];
    mouthOpen = [
      piece(curve([[cx - 24, MY + 1], [cx + 24, MY + 1], [cx + 18, MY + 16], [cx - 18, MY + 16]], 2), C.redDark, FLAT),
      piece(ellipse(cx, MY + 13, 10, 3.6), C.rose, { edge: 'clean', shadow: false }),
      lip(MY + 17, 23, 6),
      ...teeth(MY + 4, 11),
    ];
  }

  // ---- arms: the shoulder is at (X(88), 272); s is -1 for the left of the picture ----
  const arm = (part: 'armL' | 'armR', s: number): Node => {
    const X = (d: number): number => cx + s * d;
    const sleeve = (pts: [number, number][]): Node => piece(curve(pts, 2), TUNIC, { rough: 1.1 });
    const cuff = (x: number, y: number): Node => piece(ellipse(x, y, 22, 7), TUNIC_DARK, FLAT);
    let kids: Node[];
    if (roar || beam) {
      const hx = 126;
      const hy = roar ? 196 : 208;
      kids = [
        sleeve([[X(60), 262], [X(112), 250], [X(148), hy + 10], [X(142), hy + 22], [X(104), hy + 22], [X(100), hy + 6], [X(74), 240]]),
        cuff(X(hx - 2), hy + 20),
        ...openHand(X(hx), hy, s * (roar ? 14 : 28), 0.8),
      ];
    } else if (sulk) {
      kids = [
        sleeve([[X(66), 256], [X(114), 256], [X(138), 290], [X(130), 324], [X(40), 320], [X(-24), 316], [X(-34), 298], [X(-24), 280], [X(40), 278], [X(88), 286], [X(76), 270]]),
        piece(rect(X(36) - 6, 278, 12, 40, 3), TUNIC_DARK, { ...FLAT, opacity: 0.45 }),
        ...(s > 0 ? fist(X(-22), 298, s) : []),
      ];
    } else {
      kids = [
        sleeve([[X(60), 258], [X(116), 258], [X(134), 284], [X(128), 306], [X(88), 306], [X(78), 284]]),
        cuff(X(108), 306),
        ...fist(X(108), 324, s),
      ];
    }
    return group({ part, origin: [X(88), 272] }, kids);
  };

  // ---- ears, with tufts ----
  const ear = (s: number): Node[] => {
    const X = (d: number): number => cx + s * d;
    return [
      piece(curve([[X(76), 104], [X(106), 94], [X(140), 116], [X(130), 148], [X(102), 168], [X(76), 162]], 1), SKIN),
      piece(curve([[X(82), 118], [X(106), 114], [X(120), 128], [X(102), 148], [X(86), 148]], 2), '#a99282', { ...FLAT, opacity: 0.7 }),
      fluff([[X(128), 118], [X(142), 108], [X(150), 124], [X(142), 134]], HAIR, 5),
    ];
  };

  // ---- skin marks ----
  const moss = (x: number, y: number, rx: number, ry: number, o = 0.4): Node => piece(ellipse(x, y, rx, ry, (x * 7) % 40), MOSS, { ...FLAT, opacity: o });
  const wart = (x: number, y: number, r: number): Node => piece(circle(x, y, r), WART, CUT);

  const cheek = (x: number): Node => piece(ellipse(x, 166, 18, 11), C.rose, { ...FLAT, opacity: beam ? 0.7 : 0.28 });

  const pondweed: Node[] = [
    ink([[206, 56], [214, 74], [204, 92], [214, 110], [208, 128]], { width: 4.2, color: '#4f7a3a' }),
    piece(curve([[208, 100], [226, 94], [232, 106], [216, 112]], 2), '#5f8e45', FLAT),
    piece(curve([[206, 120], [222, 118], [226, 130], [210, 134]], 2), '#5f8e45', FLAT),
  ];
  const snail: Node[] = [
    piece(circle(104, 50, 11), SHELL, CUT),
    ink([[104, 50], [108, 48], [106, 44], [100, 44], [97, 50], [102, 57]], { width: 1.8, color: '#8a6440', wobble: 0.3 }),
    piece(ellipse(92, 57, 7, 3.5), '#b9c2a5', FLAT),
  ];

  return portrait(name, label, [
    framed(name, [
      group({ part: 'figure', origin: [150, 340] }, [
        // the sackcloth tunic, wide shoulders
        piece(curve([[-4, 372], [4, 300], [38, 266], [100, 250], [150, 262], [200, 250], [262, 266], [296, 300], [304, 372]], 2), TUNIC),
        piece(poly([[110, 250], [190, 250], [150, 304]]), SKIN_DARK, { rough: 0.8 }),
        piece(ellipse(60, 332, 40, 20), TUNIC_DARK, { ...FLAT, opacity: 0.35 }),
        // a stitched-on patch
        piece(poly([[184, 300], [226, 296], [230, 334], [188, 338]]), PATCH, { edge: 'cut' }),
        ink([[188, 304], [222, 300], [225, 330], [191, 333], [188, 304]], { width: 1.8, color: 'rgba(240,225,190,0.8)', wobble: 0.4 }),
        // the rope tied at the neck
        ink([[106, 252], [128, 274], [150, 282], [172, 274], [194, 252]], { width: 6, color: ROPE }),
        ink([[150, 282], [142, 312]], { width: 4.5, color: ROPE }),
        ink([[150, 282], [160, 308]], { width: 4.5, color: ROPE }),
        dot(150, 282, 6, ROPE),
        group({ part: 'head', origin: [150, 250] }, [
          ...ear(-1),
          ...ear(1),
          piece(ellipse(150, 152, 92, 94), SKIN),
          piece(ellipse(150, 224, 70, 22), SKIN_DARK, { ...FLAT, opacity: 0.35 }),
          // mossy blotches, and a few pale warts
          moss(78, 138, 22, 14),
          moss(228, 150, 20, 13),
          moss(150, 232, 36, 9, 0.35),
          moss(214, 190, 14, 10, 0.3),
          moss(88, 196, 13, 9, 0.3),
          wart(86, 170, 4.5),
          wart(214, 126, 4),
          wart(206, 172, 3.5),
          wart(116, 224, 3.5),
          wart(184, 228, 4),
          cheek(cx - 56),
          cheek(cx + 56),
          // shaggy rusty hair: a mop with fringe, and tufts by the ears
          fluff(hairPts([[44, 140], [38, 92], [60, 52], [104, 30], [150, 24], [196, 30], [240, 52], [262, 92], [256, 140], [236, 98], [208, 76], [182, 82], [150, 72], [118, 82], [92, 76], [64, 98]]), HAIR, 12),
          fluff(hairPts([[46, 120], [48, 86], [74, 62], [66, 94]]), HAIR_DARK, 9, { opacity: 0.75 }),
          fluff(hairPts([[254, 120], [252, 86], [226, 62], [234, 94]]), HAIR_DARK, 9, { opacity: 0.75 }),
          fluff([[120, 40], [150, 34], [182, 42], [160, 62], [130, 60]], HAIR_LIGHT, 8, { opacity: 0.8 }),
          ...pondweed,
          ...snail,
          group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX, -1), ...eye(cx + EX, 1)]),
          group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
          // the big lumpy potato nose
          piece(curve([[cx - 28, 160], [cx - 22, 140], [cx, 132], [cx + 22, 140], [cx + 28, 160], [cx + 16, 176], [cx - 16, 176]], 2), NOSE, CUT),
          piece(ellipse(cx - 8, 148, 9, 6), '#c8bfab', { ...FLAT, opacity: 0.6 }),
          piece(ellipse(cx - 11, 172, 4.2, 3), '#5c4a40', FLAT),
          piece(ellipse(cx + 11, 172, 4.2, 3), '#5c4a40', FLAT),
          wart(cx + 16, 152, 3.6),
          group({ part: 'mouth', origin: [cx, MY] }, mouth),
          group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, mouthOpen),
          group({ part: 'brows', origin: [cx, 96] }, [...brow(-1), ...brow(1)]),
        ]),
        arm('armL', -1),
        arm('armR', 1),
      ]),
    ]),
  ]);
}

/** Grizzle, grumpy: brows down, a sulky mouth, arms hanging at his sides. */
export const grizzle = cached((): string => draw('grump', 'wishing-grizzle', 'Grizzle'));

/** Roaring: arms wide and raised, brows knotted, a great open mouth. */
export const grizzleRoar = cached((): string => draw('roar', 'wishing-grizzle-roar', 'Grizzle roaring'));

/** Sulking: arms folded, bottom lip pushed out, eyes down and to the side. */
export const grizzleSulk = cached((): string => draw('sulk', 'wishing-grizzle-sulk', 'Grizzle sulking'));

/** Beaming: a huge happy grin, brows up, rosy cheeks, arms open. */
export const grizzleBeam = cached((): string => draw('beam', 'wishing-grizzle-beam', 'Grizzle beaming'));
