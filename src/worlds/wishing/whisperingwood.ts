/**
 * The Whispering Wood: a wood at night under a big round moon.
 *
 * Blue-violet and kind, never black, so faces read. A huge pale moon at the
 * upper left with a soft halo; far trees as dim violet shapes; twisty dark
 * trees at the left with branches like long fingers; ONE VERY TALL TREE at
 * the right (trunk x 900-1010, running off the top of the picture) with a
 * long bare branch reaching left at y 240-280 (its tip about x 716), a place
 * for a stuck cat, and a few finger-branches lower down it (y 330, 450) for a
 * rising chair to pass. Glowing toadstools (pink, mint, amber) with soft
 * halos along the edges, a mossy path winding to the front, and a silvery
 * mist lying low over the ground.
 *
 * Ground line y ≈ 640; the open ground is x 250-850. The bottom band
 * (y 690+) is plain mossy ground and mist.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const soft = { edge: 'torn' as const, rough: 1.4, fibre: false as const, shadow: false };

/** A glowing toadstool: a halo, a stalk and a spotted cap. */
function toadstool(x: number, base: number, s: number, cap: string, glow: string): Node[] {
  return [
    piece(circle(x, base - 18 * s, 34 * s), glow, { ...flat, opacity: 0.2 }),
    piece(circle(x, base - 18 * s, 22 * s), glow, { ...flat, opacity: 0.22 }),
    piece(poly([[x - 5 * s, base], [x - 4 * s, base - 22 * s], [x + 4 * s, base - 22 * s], [x + 5 * s, base]]), '#e8e2cc', { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[x - 20 * s, base - 20 * s], [x - 14 * s, base - 36 * s], [x, base - 42 * s], [x + 14 * s, base - 36 * s], [x + 20 * s, base - 20 * s], [x, base - 16 * s]], 2), cap, { edge: 'cut', fibre: false }),
    dot(x - 8 * s, base - 30 * s, 2.6 * s, '#fffbe6', 0.9),
    dot(x + 7 * s, base - 26 * s, 2 * s, '#fffbe6', 0.9),
  ];
}

/** A twisty tree: a curving trunk with finger-like branches. `lean` bends it. */
function twisty(x: number, base: number, h: number, lean: number, color: string, seed: number, thick = 38): Node[] {
  const r = rng(seed);
  const trunk: Pt[] = [
    [x - thick / 2, base],
    [x - thick / 2 + lean * 0.2, base - h * 0.3],
    [x - thick / 3 + lean * 0.8, base - h * 0.6],
    [x + lean, base - h],
    [x + thick / 4 + lean, base - h],
    [x + thick / 3 + lean * 0.8, base - h * 0.6],
    [x + thick / 2 + lean * 0.2, base - h * 0.3],
    [x + thick / 2, base],
  ];
  const out: Node[] = [piece(curve(trunk, 2), color, { edge: 'torn', rough: 1.2, shadow: false, fibre: false })];
  // finger branches reaching out and curling up at the tip
  for (let i = 0; i < 6; i++) {
    const t = 0.35 + i * 0.11;
    const side = i % 2 ? 1 : -1;
    const bx = x + lean * t + side * thick * 0.2;
    const by = base - h * t;
    const len = 70 + r() * 70;
    const mid: Pt = [bx + side * len * 0.55, by - 18 - r() * 18];
    const tip: Pt = [bx + side * len, by - 46 - r() * 30];
    out.push(piece(band([[bx, by + 6], mid, tip], 12 - i), color, { edge: 'torn', rough: 1.1, shadow: false, fibre: false }));
    // two little twig-fingers at the tip
    out.push(ink([tip, [tip[0] + side * 22, tip[1] - 18]], { width: 4, color, wobble: 0.5 }));
    out.push(ink([tip, [tip[0] + side * 26, tip[1] + 4]], { width: 4, color, wobble: 0.5 }));
    out.push(ink([mid, [mid[0] + side * 4, mid[1] - 26]], { width: 4, color, wobble: 0.5 }));
  }
  return out;
}

export const whisperingWood = cached(() => {
  const r = rng(7117);
  const stars: Node[] = [];
  for (let i = 0; i < 34; i++) {
    const x = 380 + r() * 800;
    const y = 16 + r() * 260;
    stars.push(dot(x, y, 1.4 + r() * 1.8, i % 3 ? C.cream : C.goldLight, 0.85));
  }

  // far, dim trees: soft violet cones and blobs along the horizon
  const far: Node[] = [];
  for (let i = 0; i < 12; i++) {
    const x = -20 + i * 106 + (r() - 0.5) * 30;
    const h = 150 + r() * 120;
    far.push(piece(poly([[x - 36, 560], [x - 8, 560 - h], [x + 8, 560 - h - 30], [x + 24, 560 - h], [x + 56, 560]]), i % 2 ? '#3b3c78' : '#42447f', soft));
  }

  // toadstools along the edges and a few on the open ground's margins
  const caps: [number, number, number, string, string][] = [
    [90, 662, 1.5, '#e07aa8', '#ff9fd0'],
    [150, 690, 1.0, '#7fe0b8', '#9fffd8'],
    [214, 654, 0.9, '#f0b45a', '#ffd88a'],
    [880, 656, 1.1, '#e07aa8', '#ff9fd0'],
    [826, 664, 0.8, '#7fe0b8', '#9fffd8'],
    [1090, 668, 1.5, '#f0b45a', '#ffd88a'],
    [1010, 692, 1.0, '#7fe0b8', '#9fffd8'],
    [296, 646, 0.7, '#f0b45a', '#ffd88a'],
  ];

  // the tall tree on the right: trunk x 900-1010, roots, a long branch at y ~200, finger branches lower
  const tall: Node[] = [
    piece(curve([[884, 660], [900, 560], [906, 420], [904, 260], [912, 120], [908, -30], [1004, -30], [1002, 120], [1008, 280], [1006, 440], [1016, 570], [1040, 660]], 2), '#1d1a46', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    // lighter moon-side edge on the left of the trunk
    piece(curve([[900, 560], [906, 420], [904, 260], [912, 120], [908, -30], [924, -30], [926, 120], [920, 260], [924, 420], [918, 560]], 2), '#3a3a7a', { ...soft, opacity: 0.8 }),
    // the long top branch, reaching left at y ~ 240 (the cat's), with fingers
    piece(band([[912, 278], [860, 258], [790, 250], [716, 240]], 20), '#1d1a46', { edge: 'torn', rough: 1.1, shadow: false, fibre: false }),
    piece(band([[912, 278], [860, 260], [790, 252], [716, 242]], 8), '#3a3a7a', { ...soft, opacity: 0.8 }),
    ink([[716, 240], [690, 222]], { width: 6, color: '#1d1a46', wobble: 0.6 }),
    ink([[716, 242], [694, 250]], { width: 5, color: '#1d1a46', wobble: 0.6 }),
    ink([[800, 252], [790, 214], [796, 192]], { width: 6, color: '#1d1a46', wobble: 0.6 }),
    ink([[850, 258], [846, 226]], { width: 5, color: '#1d1a46', wobble: 0.6 }),
    // a branch above, reaching out right, and finger branches lower down
    piece(band([[1004, 130], [1060, 96], [1120, 90]], 16), '#1d1a46', { edge: 'torn', rough: 1.1, shadow: false, fibre: false }),
    piece(band([[906, 342], [860, 328], [814, 308]], 16), '#1d1a46', { edge: 'torn', rough: 1.1, shadow: false, fibre: false }),
    ink([[814, 308], [796, 290]], { width: 5, color: '#1d1a46', wobble: 0.6 }),
    ink([[814, 308], [792, 316]], { width: 5, color: '#1d1a46', wobble: 0.6 }),
    piece(band([[1006, 400], [1060, 380], [1110, 330]], 16), '#1d1a46', { edge: 'torn', rough: 1.1, shadow: false, fibre: false }),
    piece(band([[908, 470], [868, 462], [832, 440]], 14), '#1d1a46', { edge: 'torn', rough: 1.1, shadow: false, fibre: false }),
    ink([[832, 440], [812, 424]], { width: 5, color: '#1d1a46', wobble: 0.6 }),
    // a few leaves left on the high branches
    ...[[1090, 110], [1110, 96], [1070, 120], [1040, 396], [1090, 352]].map(([x, y]) => piece(ellipse(x, y, 16, 9, -20), '#3a3a7a', flat)),
  ];

  const mist: Node[] = [
    piece(ellipse(300, 640, 360, 26), '#d4d8f4', { ...flat, opacity: 0.2 }),
    piece(ellipse(760, 656, 340, 22), '#d4d8f4', { ...flat, opacity: 0.2 }),
    piece(ellipse(560, 700, 520, 30), '#d4d8f4', { ...flat, opacity: 0.18 }),
    piece(ellipse(160, 690, 240, 18), '#d4d8f4', { ...flat, opacity: 0.2 }),
    piece(ellipse(1040, 700, 220, 18), '#d4d8f4', { ...flat, opacity: 0.2 }),
  ];

  return svg({ w: W, h: H, name: 'wishing-whispering-wood', boil: false, className: 'backdrop' }, [
    // the night sky: blue-violet, lighter near the horizon
    piece(rect(-20, -20, W + 40, H + 40), '#2c3070', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 120, W + 40, 300), '#363b82', { ...soft, rough: 2 }),
    piece(rect(-20, 280, W + 40, 300), '#42478f', { ...soft, rough: 2 }),
    piece(rect(-20, 420, W + 40, 300), '#4d529a', { ...soft, rough: 2 }),
    ...stars,
    // the big round moon, with a halo
    piece(circle(300, 190, 190), '#e6e6ff', { ...flat, opacity: 0.08 }),
    piece(circle(300, 190, 146), '#e6e6ff', { ...flat, opacity: 0.1 }),
    piece(circle(300, 190, 112), '#f4f0cc', { edge: 'torn', rough: 0.7, fibre: false, shadow: false }),
    piece(circle(300, 190, 98), '#fbf7da', { edge: 'clean', shadow: false }),
    piece(ellipse(268, 170, 24, 18, -20), '#ece6bc', { ...flat, opacity: 0.7 }),
    piece(ellipse(330, 218, 18, 13, 10), '#ece6bc', { ...flat, opacity: 0.7 }),
    piece(circle(344, 148, 11), '#ece6bc', { ...flat, opacity: 0.7 }),
    // far trees
    ...far,
    piece(rect(-20, 556, W + 40, 120), '#363a78', soft),
    // a drift of mist behind the near trees
    piece(ellipse(560, 560, 640, 30), '#d4d8f4', { ...flat, opacity: 0.16 }),

    // the tall tree on the right
    ...tall,

    // twisty dark trees at the left, and one far back in the middle
    ...twisty(150, 664, 520, -26, '#1d1a46', 11, 52),
    ...twisty(60, 680, 400, 20, '#17153c', 12, 46),
    ...twisty(540, 600, 250, 18, '#2c2b62', 13, 26),
    ...twisty(780, 600, 230, -16, '#2c2b62', 14, 24),
    ...twisty(260, 640, 330, 30, '#232152', 15, 34),

    // the ground: mossy blue-green, with a paler path winding forward
    piece(rect(-20, 612, W + 40, 240), '#2f5a6a', soft),
    piece(rect(-20, 654, W + 40, 200), '#2b5260', soft),
    piece(curve([[420, 610], [560, 612], [660, 640], [740, 690], [820, 760], [760, 830], [330, 830], [400, 760], [500, 690], [470, 650]], 2), '#5f7e86', { ...soft, rough: 1.2 }),
    piece(curve([[460, 620], [560, 622], [640, 646], [700, 690], [750, 750], [700, 830], [440, 830], [480, 760], [560, 690], [520, 650]], 2), '#7692a0', { ...soft, opacity: 0.6 }),
    // moss tufts and stones along the path's edges
    ...[[380, 700], [830, 730], [300, 770], [880, 790]].map(([x, y]) => piece(ellipse(x, y, 28, 9), '#3f7a6a', flat)),
    ...[[470, 668], [606, 656], [700, 720]].map(([x, y]) => piece(ellipse(x, y, 12, 6), '#97aab8', flat)),

    // the glowing toadstools, and low mist on top of everything but the front band
    ...caps.flatMap(([x, y, s, cap, glow]) => toadstool(x, y, s * 1.6, cap, glow)),
    ...mist,
  ]);
});
