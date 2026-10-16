/** Hagrid's enormous Christmas fir, and a snowball (for the Christmas episode). */
import { C } from '../../../art/palette';
import { circle, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const CX = 180;

/** One fir tier: a triangle with a drooping, zig-zag hem, apex (CX, top), hem at `base`. */
function tierOutline(top: number, base: number, hw: number, teeth: number): Pt[] {
  const pts: Pt[] = [[CX, top]];
  // right side down, a little ragged
  pts.push([CX + hw * 0.52, top + (base - top) * 0.52], [CX + hw * 0.78, top + (base - top) * 0.8]);
  pts.push([CX + hw, base]);
  // hem: drooping points across to the left
  for (let i = 1; i < teeth; i++) {
    const x = CX + hw - (2 * hw * i) / teeth;
    pts.push([x + hw / teeth * 0.2, base - 16], [x, base + (i % 2 ? 8 : 2)]);
  }
  pts.push([CX - hw, base]);
  pts.push([CX - hw * 0.78, top + (base - top) * 0.8], [CX - hw * 0.52, top + (base - top) * 0.52]);
  return pts;
}

const TIERS: Array<{ top: number; base: number; hw: number; teeth: number; col: string }> = [
  { top: 40, base: 170, hw: 82, teeth: 4, col: '#3f6b4c' },
  { top: 100, base: 262, hw: 118, teeth: 6, col: '#2c4a3a' },
  { top: 176, base: 362, hw: 152, teeth: 8, col: '#3f6b4c' },
  { top: 256, base: 470, hw: 178, teeth: 10, col: '#2c4a3a' },
];

/** A lumpy cloud of snow: an ellipse with scalloped edges. */
function lump(cx: number, cy: number, rx: number, ry: number, seed: number): Pt[] {
  const r = rng(seed);
  const pts: Pt[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const bump = i % 2 ? 0.84 : 1.05 + r() * 0.08;
    pts.push([cx + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * bump]);
  }
  return pts;
}

/** Hagrid's Christmas tree, 360 × 520. Trunk foot at y 520.
 *  Parts: `branches` (the green body, origin [180, 520]), `snow`, `baubles`, `star` (origin [180, 40]). */
export function christmasTree(): string {
  const r = rng(2412);

  // Branches: tiers, back (top) to front (bottom is drawn first so upper tiers overlap it).
  const tiers: Node[] = [];
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const t = TIERS[i];
    tiers.push(piece(poly(tierOutline(t.top, t.base, t.hw, t.teeth)), t.col, { rough: 1.1 }));
    // lighter feathery strokes down the tier
    for (let j = 0; j < 4 + i; j++) {
      const y = t.top + (t.base - t.top) * (0.35 + 0.1 * j);
      const half = t.hw * ((y - t.top) / (t.base - t.top));
      const x = CX + (r() * 2 - 1) * half * 0.7;
      tiers.push(ink([[x - 12, y + 6], [x, y - 4], [x + 12, y + 6]], { width: 3, color: i % 2 ? '#55804a' : '#6f9a5a', wobble: 0.4 }));
    }
  }

  // Snow lying on the branch tips: the corners of each tier hem and a few on the slopes.
  const snow: Node[] = [];
  TIERS.forEach((t, i) => {
    const s = 30 + i * 4;
    const edge = Math.min(t.hw - 30, 150); // keep the clumps inside the 360 box
    snow.push(piece(lump(CX - edge, t.base - 8, s * 0.85, s * 0.55, 700 + i), C.snow, { rough: 1.0 }));
    snow.push(piece(lump(CX + edge, t.base - 8, s * 0.85, s * 0.55, 720 + i), C.snow, { rough: 1.0 }));
    snow.push(piece(lump(CX - t.hw * 0.4, t.base - 4, s * 0.6, s * 0.38, 740 + i), C.snow, { rough: 1.0 }));
    snow.push(piece(lump(CX + t.hw * 0.42, t.base - 2, s * 0.6, s * 0.38, 760 + i), C.snow, { rough: 1.0 }));
    if (i > 0) snow.push(piece(lump(CX + (i % 2 ? -1 : 1) * t.hw * 0.12, t.top + 22, s * 0.7, s * 0.34, 780 + i), C.snow, { rough: 1.0 }));
    // soft blue shade under each clump edge
    snow.push(piece(lump(CX - edge + 4, t.base + 6, s * 0.6, s * 0.12, 800 + i), C.snowShade, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
    snow.push(piece(lump(CX + edge - 4, t.base + 6, s * 0.6, s * 0.12, 820 + i), C.snowShade, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
  });
  snow.push(piece(lump(CX, 56, 34, 20, 840), C.snow, { rough: 1.0 }));

  // Decorations.
  const deco: Node[] = [];
  // gold tinsel swags across the tiers
  const swag = (y: number, hw: number, sag: number, w: number): Node =>
    ink([[CX - hw, y], [CX - hw / 2, y + sag * 0.8], [CX, y + sag], [CX + hw / 2, y + sag * 0.8], [CX + hw, y]], { width: w, color: C.gold, wobble: 0.5 });
  deco.push(swag(128, 52, 26, 6), swag(205, 90, 34, 7), swag(300, 122, 40, 7), swag(410, 150, 44, 8));
  // baubles: [x, y, radius, colour]
  const B: Array<[number, number, number, string]> = [
    [150, 112, 11, C.red], [212, 128, 10, C.blue], [180, 80, 9, C.gold],
    [118, 215, 14, C.gold], [172, 235, 13, C.red], [235, 218, 14, C.blue], [138, 258, 10, C.red],
    [92, 318, 15, C.blue], [150, 335, 16, C.red], [214, 312, 15, C.gold], [270, 336, 14, C.blue],
    [60, 410, 16, C.gold], [118, 430, 17, C.red], [186, 408, 17, C.blue], [250, 432, 17, C.gold], [304, 408, 15, C.red],
  ];
  B.forEach(([x, y, rr, col], i) => {
    deco.push(ink([[x, y - rr], [x, y - rr - 7]], { width: 2, color: C.goldLight, wobble: 0.1 }));
    deco.push(piece(circle(x, y, rr), col, { edge: 'cut' }));
    deco.push(piece(rect(x - 4, y - rr - 5, 8, 6), C.goldLight, { edge: 'clean', shadow: false }));
    deco.push(piece(circle(x - rr * 0.35, y - rr * 0.35, rr * 0.25), C.white, { edge: 'clean', shadow: false, opacity: 0.75 }));
    if (i % 3 === 0) deco.push(ink([[x - rr * 0.8, y + 1], [x, y + rr * 0.35], [x + rr * 0.8, y + 1]], { width: 2, color: C.goldLight, wobble: 0.2 }));
  });
  // little candles with flames, near the hem points
  const candles: Array<[number, number]> = [[118, 160], [242, 160], [88, 252], [272, 252], [60, 350], [300, 350], [40, 456], [320, 456], [140, 462], [220, 462]];
  candles.forEach(([x, y]) => {
    deco.push(piece(rect(x - 4, y - 22, 8, 22), C.cream, { edge: 'cut', shadow: false }));
    deco.push(piece(poly([[x, y - 36], [x + 5, y - 26], [x, y - 22], [x - 5, y - 26]]), C.orange, { edge: 'clean', shadow: false }));
    deco.push(piece(poly([[x, y - 31], [x + 2, y - 26], [x - 2, y - 26]]), C.candle, { edge: 'clean', shadow: false }));
  });
  // icicles hanging from the hem
  const icicles: Array<[number, number, number]> = [[136, 172, 20], [224, 172, 16], [120, 266, 22], [200, 268, 18], [62, 366, 20], [150, 368, 24], [240, 368, 18], [300, 366, 22], [50, 474, 22], [160, 476, 24], [230, 476, 20], [310, 474, 22]];
  icicles.forEach(([x, y, l]) => {
    deco.push(piece(poly([[x - 4, y], [x + 4, y], [x, y + l]]), '#dcecf7', { edge: 'cut', shadow: false, fibre: false }));
  });

  // Star on the very top.
  const star = (): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? 11 : 27;
      pts.push([CX + Math.cos(a) * rad, 30 + Math.sin(a) * rad]);
    }
    return pts;
  };

  return svg({ w: 360, h: 520, name: 'hog-christmas-tree', label: "Hagrid's Christmas tree" }, [
    piece(rect(CX - 28, 452, 56, 68), C.brownDark, { rough: 0.9 }),
    piece(rect(CX - 16, 458, 12, 60), C.brown, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
    group({ part: 'branches', origin: [CX, 520] }, tiers),
    group({ part: 'baubles', origin: [CX, 520] }, deco),
    group({ part: 'snow', origin: [CX, 520] }, snow),
    group({ part: 'star', origin: [CX, 30] }, [
      piece(poly(star()), C.gold, { edge: 'cut', rough: 0.8 }),
      piece(circle(CX, 30, 8), C.goldLight, { edge: 'clean', shadow: false }),
    ]),
  ]);
}

/** A small round snowball, 70 × 70. */
export function snowball(): string {
  return svg({ w: 70, h: 70, name: 'hog-snowball', label: 'a snowball' }, [
    piece(circle(35, 36, 31), C.snow, { rough: 0.8 }),
    piece(ellipse2(), C.snowShade, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    piece(circle(24, 24, 7), C.white, { edge: 'clean', fibre: false, shadow: false, opacity: 0.9 }),
    ink([[44, 44], [52, 36]], { width: 2, color: C.snowShade, wobble: 0.3 }),
  ]);
}

function ellipse2(): Pt[] {
  // a crescent of shade along the lower right
  const pts: Pt[] = [];
  for (let i = -2; i <= 8; i++) {
    const a = (i / 8) * Math.PI * 0.75 - 0.2;
    pts.push([35 + Math.cos(a) * 30, 36 + Math.sin(a) * 30]);
  }
  for (let i = 8; i >= -2; i--) {
    const a = (i / 8) * Math.PI * 0.75 - 0.2;
    pts.push([35 + Math.cos(a) * 20 + 4, 36 + Math.sin(a) * 20 + 4]);
  }
  return pts;
}
