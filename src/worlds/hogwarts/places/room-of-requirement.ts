/** From Wizard Words, b5c4 (room). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ink, piece, rect, rng, svg, type Node } from '../../../art/paper';

/** A heap of old junk: a wobbly mound of boxes, chair legs, books and lamps. */
function pile(x: number, base: number, w: number, h: number, seed: number, shades: string[]): Node[] {
  const r = rng(seed);
  const nodes: Node[] = [];
  nodes.push(piece(curve([[x, base], [x + w * 0.08, base - h * 0.5], [x + w * 0.3, base - h * 0.85], [x + w * 0.5, base - h], [x + w * 0.72, base - h * 0.8], [x + w * 0.94, base - h * 0.45], [x + w, base]], 2), shades[0], { rough: 1.4 }));
  for (let i = 0; i < 11; i++) {
    const px = x + w * (0.1 + r() * 0.7);
    const py = base - h * (0.08 + r() * 0.72);
    const bw = 40 + r() * 46;
    const bh = 18 + r() * 24;
    nodes.push(piece(rect(px, py, bw, bh, 3), shades[1 + Math.floor(r() * (shades.length - 1))], { edge: 'cut', fibre: false, rough: 0.8 }));
  }
  // an upside-down chair with legs in the air
  const cx = x + w * 0.5;
  const cy = base - h * 0.96;
  nodes.push(piece(rect(cx - 26, cy - 8, 52, 12, 2), C.wood, { edge: 'cut' }));
  for (const dx of [-22, -8, 8, 22]) nodes.push(ink([[cx + dx, cy - 8], [cx + dx * 1.3, cy - 58]], { width: 5, color: C.brownDark }));
  return nodes;
}

export function room(): string {
  const wall = '#4a4258';
  const wallDark = '#38314a';
  const r = rng(54);
  const shelves: Node[] = [];
  for (let i = 0; i < 6; i++) {
    shelves.push(piece(rect(60 + i * 190, 40, 150, 10, 2), wallDark, { edge: 'cut', fibre: false, shadow: false }));
    shelves.push(piece(rect(70 + i * 190 + r() * 30, 20 + r() * 8, 26 + r() * 20, 22, 2), [C.redDark, C.blueDark, C.greenDark, C.plum][i % 4], { edge: 'cut', fibre: false, shadow: false }));
  }
  const dust: Node[] = [];
  for (let i = 0; i < 14; i++) dust.push(dot(60 + r() * 1060, 70 + r() * 360, 1.5 + r() * 2, C.cream, 0.25 + r() * 0.3));
  return svg({ w: 1180, h: 820, name: 'b5c4-room', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    // far wall of tall, dim junk
    piece(curve([[-20, 600], [-20, 300], [140, 230], [330, 270], [520, 200], [760, 250], [960, 190], [1200, 280], [1200, 600]], 2), wallDark, { rough: 1.4 }),
    ...shelves,
    ...dust,
    // a high round window of dim light
    piece(circle(590, 120, 56), C.brownDark, { edge: 'cut' }),
    piece(circle(590, 120, 44), '#6d6a8a', { edge: 'cut', fibre: false, shadow: false }),
    ink([[590, 76], [590, 164]], { width: 4, color: C.brownDark }),
    ink([[546, 120], [634, 120]], { width: 4, color: C.brownDark }),
    // floor
    piece(curve([[-40, 860], [-40, 612], [300, 600], [590, 596], [880, 600], [1220, 612], [1220, 860]], 2), '#6a5642', { rough: 1.2 }),
    // junk piles
    ...pile(-30, 620, 400, 400, 11, [C.brownDark, C.wood, C.blueDark, C.redDark, C.tan, C.greenDark]),
    ...pile(420, 610, 270, 250, 23, [C.brownDark, C.wood, C.plum, C.sand, C.teal]),
    ...pile(1020, 620, 220, 330, 37, [C.brownDark, C.wood, C.redDark, C.blueDark, C.tan]),
  ]);
}
