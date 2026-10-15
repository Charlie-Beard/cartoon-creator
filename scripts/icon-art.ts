/**
 * The home-screen icon: a little paper theatre. Red curtains pulled aside
 * on a warm stage, a gold valance across the top and one big gold star in
 * the middle, with no text so it still reads at 60 px. It fills the whole
 * square (iOS rounds the corners itself and fills any transparent pixels
 * with black). Rendered to PNGs by scripts/icons.mjs.
 */
import { C } from '../src/art/palette';
import { circle, curve, piece, poly, rect, svg, type Node, type Pt } from '../src/art/paper';

/** A five-pointed star centred on cx, cy. */
function starPts(cx: number, cy: number, outer: number, inner: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

/** One curtain, pulled to the left edge; `mirror` flips it for the right. */
function curtain(mirror: boolean): Node[] {
  const x = (v: number): number => (mirror ? 512 - v : v);
  const edge: Pt[] = curve([[x(-20), -20], [x(190), -20], [x(196), 110], [x(136), 250], [x(160), 390], [x(112), 532], [x(-20), 532]], 2);
  const folds = [0, 1, 2].map((i) => piece(rect(x(i * 56 + (mirror ? 30 : 0)) - 12, -20, 26, 560), 'rgba(60,10,10,0.2)', { edge: 'torn', fibre: false, shadow: false, rough: 1.6 }));
  return [piece(edge, C.red, { rough: 1.8 }), ...folds];
}

export function iconSvg(): string {
  const scallops: Node[] = [];
  for (let i = 0; i < 7; i++) scallops.push(piece(circle(36 + i * 73, 84, 40), C.gold, { shadow: i % 2 === 0 }));

  const nodes: Node[] = [
    // The stage wall, lit warm from the middle.
    piece(rect(-20, -20, 552, 552), C.candle, { edge: 'clean', shadow: false }),
    piece(circle(256, 270, 230), C.goldLight, { edge: 'clean', shadow: false, opacity: 0.7 }),
    // The floor.
    piece(rect(-20, 440, 552, 100), C.wood, { rough: 1.4, shadow: false }),
    piece(rect(-20, 440, 552, 16), C.brown, { edge: 'cut', shadow: false, fibre: false }),
    // The star.
    piece(poly(starPts(256, 270, 114, 54)), C.starYellow, { rough: 1.4 }),
    piece(poly(starPts(256, 270, 82, 39)), C.starYellowDark, { edge: 'cut', shadow: false, fibre: false, opacity: 0.35 }),
    ...curtain(false),
    ...curtain(true),
    // The valance.
    ...scallops,
    piece(rect(-20, -20, 552, 80), C.gold, { rough: 1.2 }),
    piece(rect(-20, 44, 552, 12), C.brass, { edge: 'cut', shadow: false, fibre: false, opacity: 0.6 }),
  ];
  return svg({ w: 512, h: 512, name: 'cartoon-app-icon' }, nodes);
}
