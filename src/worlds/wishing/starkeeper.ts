/**
 * The Star-Keeper and the little fallen star.
 *
 * The Star-Keeper is a small, round old man of the sky: a pink round face,
 * round spectacles, a bushy white moustache, a long silver beard tucked
 * into his belt (its tip pokes out below), a midnight-blue coat and a floppy
 * nightcap, both sprinkled with tiny gold stars, and a brass lantern. Fussy
 * and short-tempered at first, then twinkly and kind.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR (the
 * lantern goes with armR), hat (the nightcap: tip it, wobble it).
 * Poses: cross (lantern raised high, brows down, booming), kind (smiling
 * eyes, hands clasped). The plain portrait is the fussy old keeper, lantern
 * held low.
 *
 * littleStar is a soft yellow star with a face, small and shy. Parts:
 * figure, head, eyes, lids, brows, mouth, mouthOpen.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, group, ink, piece, poly, rect, type Node, type Pt } from '../../art/paper';
import { arm, brows, CUT, cx, cy, eyes, FLAT, mouth, person, portrait, cheeks, torso } from '../faraway/parts';

type Mood = 'fussy' | 'cross' | 'kind';

const SKIN = '#efc2a2';
const COAT = '#27346a';
const COAT_LIGHT = '#3b4c8c';
const COAT_EDGE = '#8d9bd0';
const CAP = '#2d3b78';
const BEARD = '#e4e6ea';
const BEARD_SHADE = '#aab0bd';
const BRASS = C.brass;

/** A brass lantern with a warm light in it, hanging from its ring at (x, y). About 56 × 80. */
function lantern(x: number, y: number): Node[] {
  return [
    ink([[x, y], [x, y + 8]], { width: 3, color: C.brassDark }),
    ink([[x - 9, y + 8], [x, y - 6], [x + 9, y + 8]], { width: 3, color: BRASS, wobble: 0.2 }),
    piece(poly([[x - 16, y + 10], [x + 16, y + 10], [x + 12, y + 20], [x - 12, y + 20]]), BRASS, CUT),
    piece(circle(x, y + 44, 26), C.candle, { ...FLAT, opacity: 0.55 }),
    piece(poly([[x - 12, y + 20], [x + 12, y + 20], [x + 17, y + 62], [x - 17, y + 62]]), C.goldLight, { ...CUT, opacity: 0.95 }),
    piece(poly([[x - 4, y + 54], [x + 4, y + 54], [x + 7, y + 38], [x, y + 28], [x - 7, y + 38]]), C.flame, FLAT),
    ink([[x, y + 20], [x, y + 62]], { width: 2, color: BRASS }),
    piece(poly([[x - 19, y + 62], [x + 19, y + 62], [x + 14, y + 72], [x - 14, y + 72]]), BRASS, CUT),
  ];
}

/** A little five-pointed gold star printed on the cloth. */
function twinkle(x: number, y: number, r: number, rot = 0): Node {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot - 90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return piece(pts, C.starGold, FLAT);
}

function draw(mood: Mood, name: string, label: string): string {
  const cross = mood === 'cross';
  const kind = mood === 'kind';
  const MY = cy + 40;

  // --- the arms. Fussy: lantern low at his side. Cross: lantern raised high. Kind: hands clasped.
  const armL: Node = kind
    ? arm('armL', { from: [66, 268], via: [70, 312], to: [128, 312], sleeve: COAT, cuff: COAT_EDGE, hand: SKIN, width: 32 })
    : arm('armL', { from: [66, 268], via: [46, 304], to: [52, 338], sleeve: COAT, cuff: COAT_EDGE, hand: SKIN, width: 32 });
  const armR: Node = kind
    ? arm('armR', { from: [234, 268], via: [230, 312], to: [172, 312], sleeve: COAT, cuff: COAT_EDGE, hand: SKIN, width: 32 })
    : cross
      ? arm('armR', { from: [234, 268], via: [272, 236], to: [262, 128], sleeve: COAT, cuff: COAT_EDGE, hand: SKIN, width: 32, holding: lantern(262, 134) })
      : arm('armR', { from: [234, 268], via: [266, 262], to: [256, 238], sleeve: COAT, cuff: COAT_EDGE, hand: SKIN, width: 32, holding: lantern(256, 240) });

  // --- spectacles: two round rims and a bridge
  const rim = (x: number): Node => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 20; i++) pts.push([x + Math.cos((i / 20) * 6.4) * 19, cy + 2 + Math.sin((i / 20) * 6.4) * 19]);
    return ink(pts, { width: 3, color: C.brassDark, wobble: 0.15 });
  };
  const glasses: Node[] = [
    piece(circle(cx - 25, cy + 2, 19), '#dff1ff', { ...FLAT, opacity: 0.22 }),
    piece(circle(cx + 25, cy + 2, 19), '#dff1ff', { ...FLAT, opacity: 0.22 }),
    rim(cx - 25),
    rim(cx + 25),
    ink([[cx - 7, cy - 2], [cx, cy - 5], [cx + 7, cy - 2]], { width: 2.6, color: C.brassDark }),
  ];

  // --- the moustache, in two bushy halves either side of the mouth, and the long beard
  const moustache: Node[] = [
    piece(curve([[cx - 4, MY - 12], [cx - 34, MY - 20], [cx - 54, MY - 4], [cx - 46, MY + 10], [cx - 24, MY + 2]], 2), BEARD, CUT),
    piece(curve([[cx + 4, MY - 12], [cx + 34, MY - 20], [cx + 54, MY - 4], [cx + 46, MY + 10], [cx + 24, MY + 2]], 2), BEARD, CUT),
  ];
  const beard: Node[] = [
    // framing the jaw, then falling in a soft wide sweep to the belt
    piece(curve([[cx - 56, cy + 8], [cx - 50, cy + 44], [cx - 22, MY + 20], [cx, MY + 22], [cx + 22, MY + 20], [cx + 50, cy + 44], [cx + 56, cy + 8], [cx + 66, cy + 80], [cx + 52, 276], [cx + 18, 300], [cx - 18, 300], [cx - 52, 276], [cx - 66, cy + 80]], 2), BEARD),
    piece(curve([[cx - 30, MY + 30], [cx - 10, MY + 56], [cx - 8, 270], [cx - 24, 292], [cx - 40, 270]], 1.6), BEARD_SHADE, { ...FLAT, opacity: 0.22 }),
    piece(curve([[cx + 30, MY + 30], [cx + 10, MY + 56], [cx + 8, 270], [cx + 24, 292], [cx + 40, 270]], 1.6), BEARD_SHADE, { ...FLAT, opacity: 0.22 }),
    ink([[cx - 4, MY + 34], [cx - 6, 246], [cx - 2, 290]], { width: 2, color: BEARD_SHADE, wobble: 0.4, opacity: 0.8 }),
    ink([[cx + 16, MY + 30], [cx + 20, 250], [cx + 14, 288]], { width: 2, color: BEARD_SHADE, wobble: 0.4, opacity: 0.8 }),
    // the belt across it, and the tip of the beard tucked under, poking out below
    piece(rect(cx - 96, 298, 192, 22, 3), C.brownDark, CUT),
    piece(rect(cx - 14, 294, 28, 30, 3), BRASS, CUT),
    piece(rect(cx - 7, 301, 14, 16, 2), C.brownDark, FLAT),
    piece(curve([[cx - 22, 322], [cx + 22, 322], [cx + 16, 344], [cx + 4, 352], [cx - 8, 344]], 1.6), BEARD, CUT),
  ];

  // --- the nightcap: a floppy cone flopping to one side with a gold pom-pom
  // a soft cap that flops down over his left side (the viewer's left), clear of the lantern
  const cap: Node[] = [
    piece(curve([[cx + 62, cy - 34], [cx + 54, cy - 82], [cx + 6, cy - 98], [cx - 44, cy - 92], [cx - 84, cy - 66], [cx - 104, cy - 28], [cx - 100, cy + 6], [cx - 84, cy - 4], [cx - 78, cy - 36], [cx - 48, cy - 56], [cx - 60, cy - 34]], 2), CAP),
    piece(rect(cx - 68, cy - 46, 136, 13, 6), COAT_EDGE, CUT),
    piece(circle(cx - 100, cy + 8, 14), C.starGold, { rough: 1.4 }),
    twinkle(cx + 16, cy - 74, 8),
    twinkle(cx - 24, cy - 80, 6, 15),
    twinkle(cx - 74, cy - 52, 7, -10),
  ];

  const browStyle = cross ? 'cross' : kind ? 'kind' : 'worried';
  const mouthStyle = cross ? 'frown' : kind ? 'smile' : 'flat';

  return person({
    name,
    label,
    skin: SKIN,
    face: [56, 58],
    ears: true,
    eyes: 'round',
    eyeCol: C.blueDark,
    eyeDx: 25,
    eyeY: 2,
    brows: browStyle,
    browCol: BEARD_SHADE,
    browY: -22,
    nose: 'round',
    mouth: mouthStyle,
    mouthY: 40,
    cheeks: C.rose,
    body: [
      torso(COAT, 6, 232),
      // lapels, a pale seam and two rows of gold stars
      piece(poly([[104, 238], [150, 262], [128, 345], [84, 345], [88, 284]]), COAT_LIGHT, CUT),
      piece(poly([[196, 238], [150, 262], [172, 345], [216, 345], [212, 284]]), COAT_LIGHT, CUT),
      ink([[44, 280], [100, 246], [150, 240], [200, 246], [256, 280]], { width: 3, color: COAT_EDGE, wobble: 0.3 }),
      twinkle(70, 300, 9),
      twinkle(230, 304, 9, 20),
      twinkle(54, 270, 6),
      twinkle(248, 272, 6, 12),
      twinkle(100, 330, 7, -15),
      twinkle(204, 332, 7, 8),
    ],
    front: [...beard, ...moustache, ...glasses],
    hat: cap,
    arms: [armL, armR],
  });
}

export const starKeeper = cached((): string => draw('fussy', 'wishing-starkeeper', 'The Star-Keeper'));
export const starKeeperCross = cached((): string => draw('cross', 'wishing-starkeeper-cross', 'The Star-Keeper, cross'));
export const starKeeperKind = cached((): string => draw('kind', 'wishing-starkeeper-kind', 'The Star-Keeper, kind'));

// ---------------------------------------------------------------- littleStar

/** A fat five-pointed star outline (inner points at 60%), softened. */
function fatStar(x: number, y: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * 0.62 : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return pts;
}

/** The little fallen star: soft yellow, a halo, big shy eyes and a small smile. */
export const littleStar = cached((): string => {
  const at: Pt = [150, 164];
  const o = { skin: C.starGold, at, eyes: 'big' as const, eyeCol: C.brownDark, eyeDx: 24, eyeY: -2, brows: 'worried' as const, browCol: C.starYellowDark, browY: -20, nose: 'none' as const, mouth: 'smile' as const, mouthY: 30, cheeks: C.pink };
  return portrait('wishing-littlestar', 'The little star', [
    group({ part: 'figure', origin: [150, 300] }, [
      piece(circle(150, 160, 148), C.candle, { ...FLAT, opacity: 0.2 }),
      piece(circle(150, 160, 122), C.candle, { ...FLAT, opacity: 0.2 }),
      group({ part: 'head', origin: [150, 170] }, [
        piece(curve(fatStar(150, 168, 136), 2), C.starYellowDark, { rough: 0.8 }),
        piece(curve(fatStar(150, 164, 126), 2), C.starGold, { rough: 0.8, shadow: false }),
        piece(ellipse(130, 120, 34, 22, -30), C.moonLight, { ...FLAT, opacity: 0.4 }),
        ...cheeks(o),
        ...eyes(o),
        ...brows(o),
        ...mouth(o),
      ]),
    ]),
  ]);
});
