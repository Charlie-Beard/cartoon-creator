/**
 * The potion table (made for "The Riddle of the Bottles", book 1; original
 * paper art).
 *
 * potionTable: a small old wooden table, 520 × 260, with SEVEN glass bottles
 * standing in a row on its top, every one a different shape, size and soft
 * colour. The tabletop is at y 152 to 174 and the four legs stand on the floor
 * at the bottom edge (y 260); the bottles' bases sit on y 152.
 * Left to right (centre x, height above the table):
 *   1 tall thin, lilac        x 70,  about 130 high
 *   2 fat ROUND, rose         x 142, about 100 high  (part `round`)
 *   3 squat, soft green       x 218, about 56 high
 *   4 curvy gourd, amber      x 292, about 104 high
 *   5 TINY, pale blue, with a silver glint  x 352, only 36 high  (part `tiny`)
 *   6 conical flask, teal     x 414, about 84 high
 *   7 slim, lemon yellow      x 468, about 96 high
 * Part `round` is the fat round bottle, origin at its base (142, 152): box
 * about x 102 to 182, y 52 to 152. Part `tiny` is the tiny bottle with its
 * glint, origin at its base (352, 152): box about x 334 to 372, y 108 to 152.
 * Rotate or scale either from its base to wobble, glow or pick it out.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const TOP = 152;

/** hw at height h along a profile of [halfWidth, height] pairs (bottom to top). */
function widthAt(profile: Pt[], h: number): number {
  for (let i = 1; i < profile.length; i++) {
    const [w0, h0] = profile[i - 1];
    const [w1, h1] = profile[i];
    if (h <= h1) return w0 + ((w1 - w0) * (h - h0)) / Math.max(1e-6, h1 - h0);
  }
  return profile[profile.length - 1][0];
}

/** A glass bottle from a profile: glass, liquid, cork, a shine. Base on y = TOP. */
function bottle(cx: number, profile: Pt[], glass: string, liquid: string, fill: number, corkHW: number, corkColor = '#b98a56'): Node[] {
  const top = profile[profile.length - 1][1];
  const left = profile.map(([w, h]) => [cx - w, TOP - h] as Pt);
  const right = profile.map(([w, h]) => [cx + w, TOP - h] as Pt).reverse();
  const outline = [...left, ...right];
  // the liquid: the same profile, a little narrower, cut off at the fill level
  const cut = profile.filter(([, h]) => h < fill);
  const wl = widthAt(profile, fill);
  const inner = [...cut.map(([w, h]) => [w - 4, h] as Pt), [wl - 4, fill] as Pt];
  const liq = [...inner.map(([w, h]) => [cx - w, TOP - h + (h === 0 ? -3 : 0)] as Pt), ...inner.map(([w, h]) => [cx + w, TOP - h + (h === 0 ? -3 : 0)] as Pt).reverse()];
  const mid = profile.reduce((a, p) => (p[0] > a[0] ? p : a), profile[0]);
  return [
    piece(curve(outline, 2), glass, { edge: 'cut', fibre: false, opacity: 0.9 }),
    piece(curve(liq, 2), liquid, { edge: 'clean', shadow: false, opacity: 0.88 }),
    // a shine down one side
    ink([[cx - mid[0] * 0.62, TOP - mid[1] * 1.15], [cx - mid[0] * 0.68, TOP - mid[1] * 0.65]], { width: 3, color: '#ffffff', opacity: 0.7, wobble: 0.2 }),
    piece(rect(cx - corkHW, TOP - top - 9, corkHW * 2, 14, 3), corkColor, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

export function potionTableArt(): string {
  const tinyX = 352;
  return svg({ w: 520, h: 260, name: 'hogwarts-potion-table', boil: false }, [
    // soft shadow on the floor
    piece(ellipse(260, 256, 236, 8), '#000000', { edge: 'clean', shadow: false, opacity: 0.2 }),
    // back legs (darker, shorter), then front legs
    piece(rect(104, 172, 18, 76, 2), C.barkDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(398, 172, 18, 76, 2), C.barkDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[50, 190], [78, 190], [76, 260], [54, 260]]), C.bark, { edge: 'cut', fibre: false }),
    piece(poly([[442, 190], [470, 190], [466, 260], [444, 260]]), C.bark, { edge: 'cut', fibre: false }),
    ink([[63, 206], [64, 252]], { width: 2, color: C.barkDark, opacity: 0.5 }),
    ink([[457, 206], [456, 252]], { width: 2, color: C.barkDark, opacity: 0.5 }),
    // a cross-bar between the legs
    piece(rect(68, 226, 384, 10, 2), C.barkLight, { edge: 'cut', fibre: false, shadow: false }),
    // apron and tabletop
    piece(rect(40, 168, 440, 34, 3), C.barkLight, { edge: 'cut' }),
    ink([[70, 186], [460, 186]], { width: 2, color: C.bark, opacity: 0.45, wobble: 1 }),
    piece(rect(24, 150, 472, 24, 4), C.wood, { rough: 0.8 }),
    ink([[40, 160], [200, 158]], { width: 2, color: C.brown, opacity: 0.5, wobble: 1 }),
    ink([[260, 164], [470, 162]], { width: 2, color: C.brown, opacity: 0.5, wobble: 1 }),

    // 1 tall thin, lilac
    ...bottle(70, [[10, 0], [11, 30], [11, 96], [6, 112], [6, 126]], '#dbe0f0', '#b79be0', 80, 6),
    // 2 fat round, rose (a part)
    group2('round', 142, roundBottle(142)),
    // 3 squat, soft green
    ...bottle(218, [[22, 0], [29, 10], [29, 32], [14, 44], [9, 52], [9, 56]], '#dcebdf', '#92c79a', 30, 8),
    // 4 curvy gourd, amber
    ...bottle(292, [[14, 0], [24, 8], [26, 24], [14, 42], [11, 58], [16, 72], [18, 82], [9, 96], [8, 104]], '#f0e6d2', '#e2a64e', 66, 7),
    // 5 TINY, pale blue, with a silver glint (a part)
    group2('tiny', tinyX, [
      ...bottle(tinyX, [[8, 0], [9, 8], [8, 18], [4, 26], [4, 30]], '#c6dcf2', '#4f93e0', 22, 4, '#cfd3da'),
      // a four-point silver glint, and two sparkles
      piece(poly([[tinyX + 14, TOP - 38], [tinyX + 17, TOP - 30], [tinyX + 25, TOP - 27], [tinyX + 17, TOP - 24], [tinyX + 14, TOP - 16], [tinyX + 11, TOP - 24], [tinyX + 3, TOP - 27], [tinyX + 11, TOP - 30]]), '#f5f7fb', { edge: 'clean', shadow: false }),
      dot(tinyX - 14, TOP - 40, 3, '#ffffff', 0.9),
      dot(tinyX + 22, TOP - 12, 1.8, '#ffffff', 0.85),
    ]),
    // 6 conical flask, teal
    ...bottle(414, [[28, 0], [24, 14], [16, 38], [8, 62], [8, 76]], '#d9ecec', '#6fb5b0', 30, 7),
    // 7 slim, lemon yellow
    ...bottle(468, [[15, 0], [16, 12], [16, 52], [10, 68], [7, 78], [7, 88]], '#f4efd0', '#ecd163', 48, 5),
  ]);
}

/** The fat round bottle's nodes, drawn here so `round` can wrap them. */
function roundBottle(cx: number): Node[] {
  const r = 38;
  const body: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    body.push([cx + Math.cos(a) * r, TOP - r + 1 + Math.sin(a) * r]);
  }
  const neck = rect(cx - 8, TOP - 2 * r - 22, 16, 30, 2);
  const liq: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    liq.push([cx + Math.cos(a) * (r - 4), TOP - r + 1 + Math.sin(a) * (r - 4)]);
  }
  return [
    piece(neck, '#f3e4e6', { edge: 'cut', fibre: false, opacity: 0.9 }),
    piece(body, '#f3e1e4', { edge: 'cut', fibre: false, opacity: 0.92 }),
    // the liquid fills the lower two-thirds
    piece(liq.map(([x, y]) => [x, Math.max(y, TOP - r - 6)] as Pt), '#e48f9b', { edge: 'clean', shadow: false, opacity: 0.88 }),
    piece(ellipse(cx, TOP - r - 6, r - 5, 4), '#f2b3bb', { edge: 'clean', shadow: false, opacity: 0.8 }),
    ink([[cx - 24, TOP - r - 16], [cx - 28, TOP - r + 6]], { width: 3.4, color: '#ffffff', opacity: 0.7, wobble: 0.2 }),
    piece(rect(cx - 8, TOP - 2 * r - 30, 16, 14, 3), '#b98a56', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx + 10, TOP - r + 14, 3), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.4 }),
  ];
}

/** A named part whose origin is the bottle's base. */
function group2(part: string, cx: number, children: Node[]): Node {
  return group({ part, origin: [cx, TOP] }, children);
}
