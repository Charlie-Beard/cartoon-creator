/**
 * Old Dozy, the Sandman of the Land of Nod: a round, kind, very sleepy old
 * fellow. A long floppy nightcap in lilac and cream stripes that flops over
 * to one side with a big white bobble at its tip, a warm sandy-gold dressing
 * gown with a lilac collar, a cream cord and two patch pockets, a big round
 * pink face with heavy half-closed eyelids over dot eyes, bushy white brows,
 * a round rosy nose and a short fluffy white beard round his chin.
 *
 * Silhouette: the long stripy cap drooping to one side, the round face with
 * sleepy eyes, the gold gown. No spectacles, no starry blue coat: he must
 * never be mistaken for the Star-Keeper.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hat
 * (pivots at the crown: wobble it, let it flop). The face sits centred on
 * (150, 136): eyes at y 124, nose at 150, mouth at y 178 over a beard that
 * starts just under it. `lids` cover the eyes completely (a full blink);
 * the plain eyes are already half shut, so a blink only closes the last bit.
 * Poses (same box, same face box):
 *   yawn   arms stretched up, eyes screwed shut, mouth a wide round yawn,
 *   sleep  eyes shut in curves, head tilted, cap flopped right down, a peaceful smile,
 *   beam   eyes open wide for once, a big warm smile, arms out a little.
 * (No "Z"s are drawn in: the script adds them.)
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, fluff, person, torso } from '../faraway/parts';

type Mood = 'plain' | 'yawn' | 'sleep' | 'beam';

const SKIN = '#f3bfa6';
const GOWN = '#d6a84e';
const GOWN_DARK = '#b8893a';
const LILAC = '#b9a2d8';
const LILAC_DARK = '#9a82c0';
const CREAM = '#f7f0dc';
const WHITE = '#fbf8f0';
const WHITE_SHADE = '#d9d2c2';
const NOSE = '#e48a86';
const FACE_RX = 62;
const FACE_RY = 60;
const EX = 25;
const EY = 124;
const MY = 178;

/** Spine of the cap, from the crown to the bobble: each mood flops it differently. */
const SPINE: Record<Mood, Pt[]> = {
  plain: [[150, 92], [152, 68], [170, 48], [204, 46], [234, 70], [246, 104], [242, 128]],
  yawn: [[150, 92], [150, 64], [166, 42], [200, 40], [230, 62], [244, 94], [242, 120]],
  sleep: [[150, 92], [152, 70], [170, 52], [202, 52], [232, 74], [244, 110], [240, 148]],
  beam: [[150, 92], [150, 66], [168, 44], [202, 42], [232, 66], [246, 100], [244, 126]],
};

/** One pass of corner-cutting, so the polyline spine bends smoothly. */
function smooth(pts: Pt[]): Pt[] {
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** The nightcap: a striped cone along a spine, a fluffy brim over the brow and a bobble at the tip. */
function cap(mood: Mood): Node[] {
  const spine = smooth(smooth(SPINE[mood]));
  const n = spine.length;
  const half = (i: number): number => 10 + 52 * (1 - i / (n - 1)); // 64 at the brim to 12 at the tip
  const left: Pt[] = [];
  const right: Pt[] = [];
  const quads: Node[] = [];
  for (let i = 0; i < n; i++) {
    const a = spine[Math.max(0, i - 1)];
    const b = spine[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const h = half(i);
    left.push([spine[i][0] + nx * h, spine[i][1] + ny * h]);
    right.push([spine[i][0] - nx * h, spine[i][1] - ny * h]);
  }
  // stripes: a band across the cap every few spine points, lilac and cream in turn
  const step = 3;
  for (let i = 0; i < n - 1; i += step) {
    const j = Math.min(n - 1, i + step);
    const colour = (i / step) % 2 === 0 ? LILAC : CREAM;
    quads.push(piece(poly([left[i], ...left.slice(i + 1, j + 1), ...right.slice(i, j + 1).reverse()]), colour, { edge: 'cut', fibre: false, shadow: false }));
  }
  const tip = spine[n - 1];
  const outline: Pt[] = [...left, tip, ...right.slice().reverse()];
  return [
    piece(curve(outline, 2), CREAM),
    ...quads,
    // a soft crease along the shaded edge of the cone
    ink(right.slice(2, n - 2), { width: 3, color: LILAC_DARK, opacity: 0.35, wobble: 0.3 }),
    // the fluffy white brim sitting on the forehead
    fluff([[cx - 62, 90], [cx - 40, 78], [cx - 14, 74], [cx + 14, 74], [cx + 40, 78], [cx + 62, 90], [cx + 40, 100], [cx, 104], [cx - 40, 100]], WHITE, 9),
    // the big bobble
    fluff(
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return [tip[0] + Math.cos(a) * 20, tip[1] + 14 + Math.sin(a) * 20] as Pt;
      }),
      WHITE,
      8,
    ),
    piece(ellipse(tip[0] + 4, tip[1] + 24, 12, 7), WHITE_SHADE, { ...FLAT, opacity: 0.5 }),
  ];
}

/** The short, fluffy white beard that rings the chin, with a hole left for the mouth. */
function beard(): Node[] {
  return [
    fluff(
      [[cx - 60, cy + 6], [cx - 54, cy + 40], [cx - 30, cy + 66], [cx, cy + 74], [cx + 30, cy + 66], [cx + 54, cy + 40], [cx + 60, cy + 6], [cx + 44, cy + 30], [cx + 24, cy + 46], [cx, cy + 50], [cx - 24, cy + 46], [cx - 44, cy + 30]],
      WHITE,
      7,
    ),
    piece(ellipse(cx, cy + 66, 32, 7), WHITE_SHADE, { ...FLAT, opacity: 0.4 }),
  ];
}

function draw(mood: Mood, name: string, label: string): string {
  const yawn = mood === 'yawn';
  const sleep = mood === 'sleep';
  const beam = mood === 'beam';

  // --- eyes: heavy lids over dot eyes (plain); screwed shut (yawn); curves (sleep); wide open (beam)
  const eye = (x: number, side: number): Node[] => {
    if (yawn) {
      return [
        ink([[x - 12, EY - 3], [x, EY + 5], [x + 12, EY - 3]], { width: 3.6, color: C.ink }),
        ink([[x + side * 12, EY - 3], [x + side * 17, EY - 8]], { width: 2.4, color: C.ink }),
      ];
    }
    if (sleep) return [ink([[x - 12, EY - 2], [x, EY + 7], [x + 12, EY - 2]], { width: 3.6, color: C.ink })];
    if (beam) {
      return [
        piece(ellipse(x, EY, 13, 14.5), C.white, FLAT),
        piece(circle(x, EY + 1, 8.5), '#6a4a34', { edge: 'clean', shadow: false }),
        piece(circle(x, EY + 1, 4.2), C.ink, { edge: 'clean', shadow: false }),
        dot(x - 3, EY - 3, 2.8, C.white),
        dot(x + 3.5, EY + 4, 1.4, C.white, 0.8),
      ];
    }
    return [
      piece(ellipse(x, EY + 3, 7.5, 8), C.ink, { edge: 'clean', shadow: false }),
      dot(x - 2.2, EY, 2, C.white),
      // the heavy lid: a skin-coloured half-disc over the top of the eye, with its edge inked
      piece(poly([[x - 14, EY + 3], [x - 12, EY - 8], [x, EY - 12], [x + 12, EY - 8], [x + 14, EY + 3], [x, EY + 5]]), SKIN, FLAT),
      ink([[x - 13, EY + 3], [x, EY + 6], [x + 13, EY + 3]], { width: 3, color: C.ink }),
    ];
  };
  const lid = (x: number): Node[] => [
    piece(ellipse(x, EY, 15, 15), SKIN, FLAT),
    ink([[x - 12, EY + 1], [x, EY + 8], [x + 12, EY + 1]], { width: 3, color: C.ink }),
  ];

  // --- brows: bushy and white, drooping at the outer ends; lifted when he beams
  const browSide = (s: number): Node => {
    const x = cx + s * EX;
    const y = EY - (beam ? 30 : yawn ? 24 : 21);
    const outer = beam ? -2 : sleep ? 3 : 5;
    const inner = beam ? -4 : -2;
    const pts: Pt[] = [
      [x - s * 14, y + inner - 5],
      [x, y - 9 + (outer + inner) / 4],
      [x + s * 18, y + outer - 4],
      [x + s * 20, y + outer + 7],
      [x + s * 2, y + 2],
      [x - s * 14, y + inner + 6],
    ];
    return fluff(pts, WHITE, 3, { shadow: false });
  };

  // --- mouths: a sleepy smile, a wide yawn, a peaceful smile, a big warm beam
  const smile = (w: number, drop: number): Node[] => [ink([[cx - w, MY - 2], [cx - w / 2, MY + drop], [cx + w / 2, MY + drop], [cx + w, MY - 2]], { width: 3.6, color: C.redDark })];
  const mouth: Node[] = yawn
    ? [piece(ellipse(cx, MY + 8, 22, 26), C.redDark, FLAT), piece(ellipse(cx, MY + 22, 14, 8), C.rose, { edge: 'clean', shadow: false })]
    : sleep
      ? smile(14, 7)
      : beam
        ? [
            piece(curve([[cx - 28, MY - 6], [cx + 28, MY - 6], [cx + 18, MY + 18], [cx - 18, MY + 18]], 2), C.redDark, FLAT),
            piece(ellipse(cx, MY + 12, 11, 4.5), C.rose, { edge: 'clean', shadow: false }),
          ]
        : smile(17, 8);
  const mouthOpen: Node[] =
    yawn || beam
      ? mouth
      : [
          piece(curve([[cx - 17, MY - 4], [cx + 17, MY - 4], [cx + 12, MY + 18], [cx - 12, MY + 18]], 2), C.redDark, FLAT),
          piece(ellipse(cx, MY + 12, 8, 4), C.rose, { edge: 'clean', shadow: false }),
        ];

  // --- arms: sandy-gold sleeves with lilac cuffs
  const sleeve = { sleeve: GOWN, cuff: LILAC, hand: SKIN, width: 40 };
  const armL: Node = yawn
    ? arm('armL', { from: [60, 270], via: [22, 236], to: [30, 168], ...sleeve })
    : beam
      ? arm('armL', { from: [60, 270], via: [30, 288], to: [14, 318], ...sleeve })
      : arm('armL', { from: [60, 270], via: [44, 310], to: [56, 340], ...sleeve });
  const armR: Node = yawn
    ? arm('armR', { from: [240, 270], via: [278, 236], to: [270, 168], ...sleeve })
    : beam
      ? arm('armR', { from: [240, 270], via: [270, 288], to: [286, 318], ...sleeve })
      : arm('armR', { from: [240, 270], via: [256, 310], to: [244, 340], ...sleeve });

  return person({
    name,
    label,
    skin: SKIN,
    face: [FACE_RX, FACE_RY],
    ears: true,
    neck: false,
    eyes: 'none',
    brows: 'none',
    nose: 'none',
    mouth: 'none',
    cheeks: false,
    noTalk: true,
    noBlink: true,
    tilt: sleep ? 9 : undefined,
    body: [
      // a round sandy-gold dressing gown, a darker front panel, a lilac shawl collar,
      // two patch pockets and a cream cord with tassels
      torso(GOWN, 30, 232),
      piece(poly([[112, 244], [188, 244], [206, 345], [94, 345]]), GOWN_DARK, { ...FLAT, opacity: 0.4 }),
      piece(poly([[92, 236], [128, 214], [150, 262], [172, 214], [208, 236], [186, 276], [150, 296], [114, 276]]), LILAC, CUT),
      ink([[118, 252], [150, 282], [182, 252]], { width: 2.4, color: LILAC_DARK, opacity: 0.6, wobble: 0.3 }),
      piece(poly([[70, 300], [108, 298], [110, 332], [72, 334]]), GOWN_DARK, CUT),
      piece(poly([[192, 298], [230, 300], [228, 334], [190, 332]]), GOWN_DARK, CUT),
      ink([[74, 304], [106, 302]], { width: 2, color: GOWN, opacity: 0.8 }),
      ink([[194, 302], [226, 304]], { width: 2, color: GOWN, opacity: 0.8 }),
      piece(band([[56, 322], [150, 330], [244, 322]], 10), CREAM, CUT),
      piece(poly([[140, 326], [160, 326], [164, 346], [136, 346]]), CREAM, CUT),
    ],
    onHead: [
      // round rosy cheeks and a flushed brow under the cap
      piece(ellipse(cx - 40, cy + 22, 17, 12), C.pink, { ...FLAT, opacity: 0.7 }),
      piece(ellipse(cx + 40, cy + 22, 17, 12), C.pink, { ...FLAT, opacity: 0.7 }),
    ],
    front: [
      ...beard(),
      group({ part: 'eyes', origin: [cx, EY] }, [...eye(cx - EX, -1), ...eye(cx + EX, 1)]),
      group({ part: 'lids', opacity: 0 }, [...lid(cx - EX), ...lid(cx + EX)]),
      group({ part: 'brows', origin: [cx, EY - 22] }, [browSide(-1), browSide(1)]),
      // the round rosy nose
      piece(ellipse(cx, cy + 14, 13, 11), NOSE, CUT),
      dot(cx - 4, cy + 10, 3, C.white, 0.55),
      group({ part: 'mouth', origin: [cx, MY] }, mouth),
      group({ part: 'mouthOpen', origin: [cx, MY], opacity: 0 }, mouthOpen),
    ],
    hat: cap(mood),
    arms: [armL, armR],
  });
}

/** Old Dozy, plain: a sleepy, kind smile under heavy eyelids. */
export const dozy = cached((): string => draw('plain', 'wishing-dozy', 'Old Dozy'));

/** A great yawn: arms up, eyes screwed shut, mouth wide. */
export const dozyYawn = cached((): string => draw('yawn', 'wishing-dozy-yawn', 'Old Dozy yawning'));

/** Fast asleep: eyes shut, head tilted, cap flopped right down, a peaceful smile. */
export const dozySleep = cached((): string => draw('sleep', 'wishing-dozy-sleep', 'Old Dozy asleep'));

/** Wide awake for once: bright eyes, a big warm smile, arms out. */
export const dozyBeam = cached((): string => draw('beam', 'wishing-dozy-beam', 'Old Dozy beaming'));
