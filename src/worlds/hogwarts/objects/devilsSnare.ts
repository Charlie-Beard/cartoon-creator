/**
 * Devil's Snare (made for "The Riddle of the Bottles", book 1; original paper
 * art).
 *
 * devilsSnare: a big low tangle of dark green creeper, 600 × 220, spread over
 * the floor like a soft springy mat (the friends land on it). Flat bottom on
 * the floor at y 218; the mat is about 70 high at the edges and 100 high in the
 * middle, covered in curling tendrils and a few leaves. Never grabs anyone:
 * it's a bouncy cushion that wriggles and then shrinks away from light.
 *
 * Part `tendrils` is a group of four tall tendrils curling up from the middle
 * of the mat (x 190 to 410, tips as high as y 30); origin is its bottom centre
 * (300, 214). Wiggle it with rotate or skewX from there, or scale it to 0 to
 * shrink the plant back. Everything else stays still.
 */
import { ellipse, group, ink, piece, poly, svg, curve, type Node, type Pt } from '../../../art/paper';

const DEEP = '#2c4a34';
const MID = '#3f6b45';
const LIGHT = '#5b8a54';
const HI = '#7da66a';

/** A tendril: a wavy spine rising from (x, y) leaning `lean`, ending in a curl. */
function spine(x: number, y: number, h: number, lean: number, curl: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    pts.push([x + lean * t * t + Math.sin(t * 4.2 + x) * 9, y - h * t]);
  }
  const [lx, ly] = pts[pts.length - 1];
  const dir = curl;
  for (let i = 1; i <= 9; i++) {
    const a = i * 0.62;
    const rr = 20 - i * 1.8;
    pts.push([lx + dir * (1 - Math.cos(a)) * rr, ly - Math.sin(a) * rr]);
  }
  return pts;
}

/** A tendril drawn as a fat dark line with a lighter one on top. */
function tendril(x: number, y: number, h: number, lean: number, curl: number, width = 10): Node[] {
  const pts = spine(x, y, h, lean, curl);
  return [
    ink(pts, { width: width + 3, color: DEEP, wobble: 0.2 }),
    ink(pts, { width, color: MID, wobble: 0.2 }),
    ink(pts.slice(1, -2), { width: Math.max(2, width * 0.28), color: HI, opacity: 0.6, wobble: 0.2 }),
  ];
}

/** A pointed leaf at (x, y) pointing at `ang` radians. */
function leaf(x: number, y: number, len: number, ang: number, fill = LIGHT): Node {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const p = (u: number, v: number): Pt => [x + u * c - v * s, y + u * s + v * c];
  return piece(curve([p(0, 0), p(len * 0.4, -len * 0.3), p(len, 0), p(len * 0.4, len * 0.3)], 3), fill, { edge: 'cut', fibre: false, rough: 0.8 });
}

export function devilsSnareArt(): string {
  const nodes: Node[] = [
    // soft shadow under the mat
    piece(ellipse(300, 216, 290, 6), '#000000', { edge: 'clean', shadow: false, opacity: 0.2 }),
    // the mat: three overlapping lumpy mounds with flat bottoms
    piece(curve([[10, 218], [6, 170], [60, 146], [150, 140], [250, 120], [350, 124], [450, 140], [540, 146], [594, 170], [590, 218]], 3), DEEP, { rough: 1.3 }),
    piece(curve([[40, 218], [44, 178], [110, 156], [200, 146], [300, 126], [400, 146], [490, 156], [556, 178], [560, 218]], 3), MID, { rough: 1.3, shadow: false }),
    piece(curve([[110, 218], [120, 190], [200, 170], [300, 150], [400, 170], [480, 190], [490, 218]], 3), LIGHT, { rough: 1.2, shadow: false, opacity: 0.8 }),
    piece(ellipse(300, 175, 140, 18), HI, { edge: 'clean', shadow: false, opacity: 0.3 }),
  ];

  // low, curling tendrils woven over the mat
  const low: Array<[number, number, number, number, number, number]> = [
    [24, 205, 70, -26, -1, 11], [70, 212, 92, 30, 1, 10], [120, 214, 80, -30, -1, 10],
    [168, 208, 78, 24, 1, 9], [236, 214, 70, -22, -1, 9], [366, 214, 72, 24, 1, 9],
    [430, 208, 78, -24, -1, 9], [480, 214, 84, 30, 1, 10], [530, 212, 90, -30, -1, 10], [576, 205, 66, 24, 1, 11],
  ];
  low.forEach(([x, y, h, lean, curl, w]) => nodes.push(...tendril(x, y, h, lean, curl, w)));

  // leaves among them
  const leaves: Array<[number, number, number, number]> = [
    [60, 180, 36, -2.4], [150, 190, 32, -0.5], [210, 160, 30, -2.2], [270, 150, 34, -1.2],
    [330, 150, 34, -1.9], [400, 162, 30, -0.9], [470, 188, 32, -2.6], [540, 178, 36, -0.5], [100, 160, 28, -1.4], [505, 156, 28, -1.7],
  ];
  leaves.forEach(([x, y, l, a], i) => nodes.push(leaf(x, y, l, a, i % 2 ? LIGHT : MID)));

  // the tall tendrils, a part
  nodes.push(
    group({ part: 'tendrils', origin: [300, 214] }, [
      ...tendril(214, 214, 130, -30, -1, 12),
      ...tendril(266, 210, 160, 14, 1, 12),
      ...tendril(334, 210, 168, -16, -1, 12),
      ...tendril(388, 214, 146, 34, 1, 12),
      leaf(240, 150, 32, -2.0, LIGHT),
      leaf(360, 140, 32, -1.1, LIGHT),
      leaf(300, 130, 30, -1.6, MID),
    ]),
  );
  // a few small foot-curls at the very front to soften the edge
  nodes.push(piece(poly([[0, 218], [600, 218], [600, 222], [0, 222]]), DEEP, { edge: 'clean', shadow: false, opacity: 0 }));
  return svg({ w: 600, h: 220, name: 'hogwarts-devils-snare', boil: false }, nodes);
}
