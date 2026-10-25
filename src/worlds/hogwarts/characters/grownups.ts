/**
 * Four grown-ups for the Dursley cartoons, all built on person() so they
 * talk, blink and sit like everyone else:
 *
 *  - Mr Weasley: tall and thin, bald on top with a fringe of ginger round the
 *    sides, horn-rimmed glasses, patched green robes, a wand and a swinging arm.
 *  - Stan Shunpike, the Knight Bus conductor: skinny, big ears, a few spots,
 *    a cheeky grin, purple uniform with gold buttons and a peaked cap.
 *  - Mr Mason, a rich builder: portly, bald, neat grey moustache, dinner suit
 *    and bow tie, a polite stiff smile.
 *  - Mrs Mason: a tall stiff silver hairdo, a sparkly pale-blue evening dress
 *    and big pearl earrings.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, ink, piece, poly, rect, group, type Node } from '../../../art/paper';
import { fluff } from './heroes';
import { HEAD, person, squareGlasses, wand } from './people';

const [cx, cy] = HEAD;

// ---------------------------------------------------------------------------
// Mr Weasley
// ---------------------------------------------------------------------------

export function mrWeasley(): string {
  // the same family ginger as Mrs Weasley and the twins
  const HAIR = '#c0501f';
  const HAIR_SHADE = '#9c3d18';
  const ROBE = '#5f7d4e';
  const ROBE_DARK = '#4a6540';
  const PATCH = '#a8793f';
  const [rx, ry] = [56, 80];
  return person({
    name: 'mrWeasley',
    label: 'Mr Weasley',
    skin: C.skin,
    eyes: C.blue,
    eyeStyle: 'wide',
    face: [rx, ry],
    freckles: true,
    brows: 'raised',
    browColor: HAIR_SHADE,
    nose: 'long',
    mouth: 'smile',
    tie: null,
    body: [
      // long green robes on narrow shoulders, buttoned down the front
      piece(curve([[34, 345], [50, 268], [104, 236], [150, 232], [196, 236], [250, 268], [266, 345]], 2), ROBE),
      piece(poly([[122, 234], [150, 276], [178, 234], [168, 226], [150, 250], [132, 226]]), C.white, { fibre: false }),
      piece(poly([[140, 238], [160, 238], [156, 345], [144, 345]]), ROBE_DARK, { fibre: false }),
      ...[266, 292, 318].map((y) => piece(circle(150, y, 4.5), C.gold, { edge: 'cut', fibre: false, shadow: false })),
      // patches: an old brown one on the shoulder, a square one on the chest
      piece(poly([[78, 276], [100, 268], [106, 290], [84, 298]]), PATCH, { edge: 'cut', fibre: false }),
      ink([[82, 280], [100, 274]], { width: 1.8, color: '#6a4a26', opacity: 0.7 }),
      ink([[84, 292], [102, 286]], { width: 1.8, color: '#6a4a26', opacity: 0.7 }),
      piece(poly([[196, 300], [222, 298], [224, 324], [198, 326]]), '#c8b068', { edge: 'cut', fibre: false }),
      ink([[200, 304], [220, 302]], { width: 1.8, color: '#7a6a30', opacity: 0.7 }),
    ],
    back: [
      // ginger hair only at the sides, over the ears
      piece(ellipse(cx - rx + 2, cy - 4, 20, 50, 8), HAIR),
      piece(ellipse(cx + rx - 2, cy - 4, 20, 50, -8), HAIR),
    ],
    front: [
      // a few strands round the sides, and the shiny bald top
      ink([[cx - 54, cy - 44], [cx - 66, cy - 22], [cx - 64, cy + 8]], { width: 5, color: HAIR }),
      ink([[cx + 54, cy - 44], [cx + 66, cy - 22], [cx + 64, cy + 8]], { width: 5, color: HAIR }),
      piece(curve([[cx - 56, cy - 34], [cx - 52, cy - 56], [cx - 38, cy - 62], [cx - 42, cy - 40]], 2), HAIR, { shadow: false }),
      piece(curve([[cx + 56, cy - 34], [cx + 52, cy - 56], [cx + 38, cy - 62], [cx + 42, cy - 40]], 2), HAIR, { shadow: false }),
      // two last wisps across the bald top
      ink([[cx - 22, cy - 76], [cx, cy - 84], [cx + 22, cy - 76]], { width: 2.2, color: HAIR, opacity: 0.8 }),
      // thick horn-rimmed glasses
      ...squareGlasses('#6a4326'),
      ink([[cx - 44, cy - 12], [cx - 10, cy - 12]], { width: 5.5, color: '#6a4326' }),
      ink([[cx + 44, cy - 12], [cx + 10, cy - 12]], { width: 5.5, color: '#6a4326' }),
    ],
    extra: [
      wand(238, 318, C.brownDark),
      // the friendly right arm, swinging from the shoulder at (232, 266)
      group({ part: 'armR', origin: [232, 266] }, [
        piece(band([[226, 268], [250, 298], [260, 316]], 32), ROBE),
        piece(band([[252, 310], [262, 322]], 38), ROBE_DARK, { edge: 'cut', fibre: false }),
        piece(circle(266, 330, 14), C.skin, { edge: 'cut' }),
        ...[-6, 0, 6].map((d) => piece(ellipse(262 + d, 342, 3.5, 5), C.skin, { edge: 'clean', fibre: false, shadow: false })),
      ]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Stan Shunpike
// ---------------------------------------------------------------------------

export function stan(): string {
  const skin = '#ecbc98';
  const UNI = '#6a3f8c';
  const UNI_DARK = '#533070';
  const hair = '#5a3a24';
  const [rx, ry] = [56, 70];
  const spot = (x: number, y: number) => piece(circle(cx + x, cy + y, 3.2), '#d9806e', { edge: 'clean', fibre: false, shadow: false });
  return person({
    name: 'stan',
    label: 'Stan Shunpike',
    skin,
    eyes: C.brown,
    face: [rx, ry],
    ears: false,
    blush: false,
    brows: 'raised',
    browColor: hair,
    nose: 'pointy',
    mouth: 'grin',
    tie: null,
    body: [
      // a purple conductor's jacket with a double row of gold buttons
      piece(curve([[44, 345], [58, 270], [106, 238], [150, 234], [194, 238], [242, 270], [256, 345]], 2), UNI),
      piece(poly([[124, 236], [150, 270], [176, 236], [168, 228], [150, 248], [132, 228]]), C.white, { fibre: false }),
      piece(poly([[138, 240], [162, 240], [160, 345], [140, 345]]), UNI_DARK, { fibre: false }),
      ...[262, 288, 314].flatMap((y) => [-1, 1].map((s) => piece(circle(150 + s * 14, y, 5), C.gold, { edge: 'cut', fibre: false, shadow: false }))),
      // gold shoulder tabs
      piece(poly([[74, 262], [104, 248], [112, 258], [82, 274]]), C.gold, { edge: 'cut', fibre: false }),
      piece(poly([[226, 262], [196, 248], [188, 258], [218, 274]]), C.gold, { edge: 'cut', fibre: false }),
    ],
    back: [
      // great big sticking-out ears
      piece(ellipse(cx - rx - 12, cy - 2, 20, 32, 14), skin),
      piece(ellipse(cx + rx + 12, cy - 2, 20, 32, -14), skin),
      piece(ellipse(cx - rx - 12, cy, 10, 20, 14), '#d8987c', { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(cx + rx + 12, cy, 10, 20, -14), '#d8987c', { edge: 'cut', fibre: false, shadow: false }),
    ],
    front: [
      // a few spots
      spot(-30, 12), spot(-38, 26), spot(32, 6), spot(40, 24), spot(8, -26),
      // untidy hair sticking out under the cap
      piece(poly([[cx - 58, cy - 28], [cx - 74, cy - 6], [cx - 52, cy - 8]]), hair, { fibre: false }),
      piece(poly([[cx + 58, cy - 28], [cx + 74, cy - 6], [cx + 52, cy - 8]]), hair, { fibre: false }),
      // the purple peaked cap: band, crown, shiny peak and a gold badge
      piece(curve([[cx - 62, cy - 34], [cx - 58, cy - 82], [cx, cy - 98], [cx + 58, cy - 82], [cx + 62, cy - 34], [cx, cy - 44]], 2), UNI),
      piece(rect(cx - 62, cy - 52, 124, 18, 6), UNI_DARK, { edge: 'cut', fibre: false }),
      piece(curve([[cx - 56, cy - 44], [cx - 20, cy - 32], [cx + 40, cy - 32], [cx + 72, cy - 44], [cx + 44, cy - 50], [cx - 40, cy - 50]], 2), '#2e1a42', { edge: 'cut', fibre: false }),
      piece(circle(cx, cy - 66, 9), C.gold, { edge: 'cut', fibre: false, shadow: false }),
      dot(cx, cy - 66, 3.5, C.goldLight),
    ],
    extra: [
      group({ part: 'armR', origin: [232, 266] }, [
        piece(band([[226, 268], [250, 298], [260, 316]], 30), UNI),
        piece(band([[252, 310], [262, 322]], 34), C.gold, { edge: 'cut', fibre: false }),
        piece(circle(266, 330, 13), skin, { edge: 'cut' }),
        ...[-6, 0, 6].map((d) => piece(ellipse(262 + d, 342, 3.5, 5), skin, { edge: 'clean', fibre: false, shadow: false })),
      ]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Mr Mason
// ---------------------------------------------------------------------------

export function mrMason(): string {
  const skin = '#efbfa0';
  const SUIT = '#2e2f3a';
  const grey = '#a4a6ac';
  const [rx, ry] = [74, 68];
  return person({
    name: 'mrMason',
    label: 'Mr Mason',
    skin,
    eyes: '#5a6a7a',
    eyeStyle: 'narrow',
    face: [rx, ry],
    blush: true,
    brows: 'raised',
    browColor: grey,
    nose: 'big',
    mouth: 'smile',
    tie: null,
    body: [
      // a broad, round dinner jacket
      piece(curve([[8, 345], [16, 262], [76, 222], [150, 214], [224, 222], [284, 262], [292, 345]], 2), SUIT),
      // stiff white shirt front with studs
      piece(poly([[116, 222], [150, 330], [184, 222], [174, 214], [150, 238], [126, 214]]), C.white, { fibre: false }),
      ...[262, 288, 314].map((y) => dot(150, y, 3.6, C.ink)),
      // satin lapels
      piece(poly([[88, 244], [124, 218], [140, 292], [104, 332]]), '#3e4050', { fibre: false }),
      piece(poly([[212, 244], [176, 218], [160, 292], [196, 332]]), '#3e4050', { fibre: false }),
    ],
    front: [
      // a fringe of grey hair over each ear, nothing on top
      piece(curve([[cx - 74, cy - 6], [cx - 70, cy - 30], [cx - 56, cy - 22], [cx - 62, cy + 14]], 2), grey, { shadow: false }),
      piece(curve([[cx + 74, cy - 6], [cx + 70, cy - 30], [cx + 56, cy - 22], [cx + 62, cy + 14]], 2), grey, { shadow: false }),
      // a shine on the bald head
      piece(ellipse(cx - 20, cy - 58, 14, 6, -18), C.white, { edge: 'clean', fibre: false, shadow: false, opacity: 0.45 }),
      // double chin
      ink([[cx - 30, cy + 62], [cx, cy + 68], [cx + 30, cy + 62]], { width: 2.2, color: '#c8987c', opacity: 0.7 }),
      // the neat grey moustache, a tidy bar with curled ends
      fluff([[cx - 2, cy + 26], [cx - 30, cy + 24], [cx - 54, cy + 34], [cx - 44, cy + 44], [cx - 2, cy + 40]], grey, 6),
      fluff([[cx + 2, cy + 26], [cx + 30, cy + 24], [cx + 54, cy + 34], [cx + 44, cy + 44], [cx + 2, cy + 40]], grey, 6),
    ],
    extra: [
      // the black bow tie
      piece(poly([[150, 244], [114, 230], [114, 260]]), C.ink, { edge: 'cut', fibre: false }),
      piece(poly([[150, 244], [186, 230], [186, 260]]), C.ink, { edge: 'cut', fibre: false }),
      piece(rect(143, 236, 14, 16, 3), '#44444e', { edge: 'cut', fibre: false }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Mrs Mason
// ---------------------------------------------------------------------------

export function mrsMason(): string {
  const skin = '#f3d2b8';
  const silver = '#bfc3cc';
  const silverDark = '#9a9fac';
  const DRESS = '#9cc4e4';
  const [rx, ry] = [56, 68];
  const sparkle = (x: number, y: number, r = 4) =>
    piece(poly([[x, y - r], [x + r * 0.35, y - r * 0.35], [x + r, y], [x + r * 0.35, y + r * 0.35], [x, y + r], [x - r * 0.35, y + r * 0.35], [x - r, y], [x - r * 0.35, y - r * 0.35]]), C.white, { edge: 'clean', fibre: false, shadow: false });
  const earring = (s: number): Node[] => [
    piece(circle(cx + s * (rx + 2), cy + 22, 5), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx + s * (rx + 2), cy + 38, 11), C.white, { edge: 'cut', fibre: false }),
    dot(cx + s * (rx + 2) - 3, cy + 34, 3, '#f4f0ff'),
  ];
  return person({
    name: 'mrsMason',
    label: 'Mrs Mason',
    skin,
    eyes: '#4f7a9a',
    eyeStyle: 'wide',
    face: [rx, ry],
    blush: true,
    brows: 'raised',
    browColor: silverDark,
    nose: 'long',
    mouth: 'smile',
    tie: null,
    back: [
      // the tall stiff hairdo: a swept-up tower with rolls up the sides
      piece(curve([[cx - 62, cy + 6], [cx - 72, cy - 44], [cx - 52, cy - 100], [cx - 20, cy - 134], [cx + 14, cy - 144], [cx + 50, cy - 104], [cx + 72, cy - 44], [cx + 62, cy + 6]], 2), silver),
      ...[[-50, -64], [-34, -98], [-6, -122], [26, -112], [46, -78], [56, -44]].map(([x, y]) => piece(circle(cx + x, cy + y, 17), silver, { edge: 'cut' })),
      ink([[cx - 38, cy - 80], [cx - 6, cy - 110], [cx + 30, cy - 90]], { width: 2.6, color: silverDark, opacity: 0.8 }),
      ink([[cx - 54, cy - 40], [cx - 20, cy - 70], [cx + 26, cy - 62]], { width: 2.6, color: silverDark, opacity: 0.8 }),
    ],
    body: [
      // a sparkly pale-blue evening dress, wide neckline, narrow shoulders
      piece(curve([[14, 345], [30, 282], [92, 252], [150, 246], [208, 252], [270, 282], [286, 345]], 2), DRESS),
      piece(curve([[104, 250], [150, 290], [196, 250], [186, 244], [150, 268], [114, 244]], 2), skin, { fibre: false }),
      piece(poly([[14, 330], [150, 318], [286, 330], [286, 345], [14, 345]]), '#7eaad0', { fibre: false, shadow: false }),
      sparkle(86, 292, 5), sparkle(120, 318, 4), sparkle(170, 300, 5), sparkle(206, 322, 4), sparkle(226, 288, 4), sparkle(64, 326, 4), sparkle(150, 332, 4),
    ],
    front: [
      // a stiff fringe curl, a high pencilled brow, lipstick
      piece(curve([[cx - 50, cy - 18], [cx - 44, cy - 56], [cx, cy - 68], [cx + 44, cy - 56], [cx + 50, cy - 18], [cx + 24, cy - 42], [cx - 24, cy - 42]], 2), silver),
      ink([[cx - 22, cy - 60], [cx - 6, cy - 50]], { width: 2.5, color: silverDark }),
      ink([[cx + 12, cy - 60], [cx + 24, cy - 48]], { width: 2.5, color: silverDark }),
      ...earring(-1),
      ...earring(1),
    ],
    extra: [
      // a double string of pearls
      ...Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        return dot(116 + t * 68, 252 + Math.sin(t * Math.PI) * 26, 4.4, C.white);
      }),
    ],
  });
}
