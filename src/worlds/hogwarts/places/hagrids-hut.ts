/** From Wizard Words, b1c1 (hut). */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#5e4838';

/** Rows of rounded stones filling a rectangle. */
function stones(x0: number, x1: number, y0: number, y1: number, colors: string[], seed: number, rowH = 44): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let row = 0, y = y0; y < y1; row++, y += rowH) {
    let x = x0 - 30 + (row % 2) * 40;
    while (x < x1) {
      const w = 60 + r() * 46;
      const l = Math.max(x, x0);
      const rr = Math.min(x + w, x1);
      if (rr - l > 20) out.push(piece(rect(l + 3, y + 3, rr - l - 6, Math.min(rowH - 6, y1 - y - 6), 13), colors[Math.floor(r() * colors.length)], { rough: 0.7, fibre: false }));
      x += w;
    }
  }
  return out;
}

const STONES = ['#6c5442', '#735a47', '#664e3d', '#7a604b', '#6f5644'];

/** A round-topped arch outline (windows, the fireplace). */
function arch(x0: number, x1: number, top: number, bottom: number): Pt[] {
  const cx = (x0 + x1) / 2;
  const rx = (x1 - x0) / 2;
  const spring = top + rx * 0.7;
  const pts: Pt[] = [[x0, bottom], [x0, spring]];
  for (let i = 1; i < 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push([cx + Math.cos(a) * rx, spring + Math.sin(a) * rx * 0.7]);
  }
  pts.push([x1, spring], [x1, bottom]);
  return pts;
}

const CHIMNEY = ['#8d847a', '#968c80', '#857c72', '#9a9184'];

/** Hagrid's hut: stone walls, rafters, a night window and a big warm fireplace. */
export function hut(): string {
  const r = rng(1101);
  const nodes: Node[] = [
    piece(rect(-20, -20, 1220, 600), WALL, { edge: 'clean', shadow: false }),
    ...stones(-20, 1200, 96, 552, STONES, 11),
    // Ceiling and the big rafter beam.
    piece(rect(-20, -20, 1220, 70), '#3a2a1f', { edge: 'clean', shadow: false }),
    ...[90, 330, 760, 1000].map((x) => piece(rect(x, -10, 26, 64), '#4a3426', { edge: 'cut' })),
    piece(rect(-20, 50, 1220, 38), C.brownDark, { rough: 0.8 }),
  ];

  // The window: a starry night over the Forbidden Forest.
  nodes.push(
    piece(arch(60, 260, 136, 322), C.wood, { rough: 0.8 }),
    piece(arch(76, 244, 152, 306), C.night, { edge: 'cut', fibre: false, shadow: false }),
  );
  for (let i = 0; i < 9; i++) nodes.push(dot(90 + r() * 140, 170 + r() * 60, 1.5 + r() * 1.5, C.cream, 0.8));
  nodes.push(
    piece(circle(206, 190, 16), C.cream, { edge: 'cut', fibre: false }),
    piece(circle(198, 184, 14), C.night, { edge: 'clean', shadow: false }),
  );
  for (let x = 80; x < 240; x += 22) {
    const top = 246 + r() * 26;
    nodes.push(piece(poly([[x - 4, 306], [x + 11, top], [x + 26, 306]]), r() > 0.5 ? C.greenDeep : '#24402f', { edge: 'cut', fibre: false, shadow: false }));
  }
  nodes.push(
    piece(rect(155, 150, 10, 158), C.wood, { edge: 'cut' }),
    piece(rect(76, 228, 168, 9), C.wood, { edge: 'cut' }),
    piece(rect(50, 314, 220, 16, 3), C.brownDark, { rough: 0.8 }),
  );

  // Things hanging from the rafter: onions, herbs, copper pans and a ham.
  nodes.push(ink([[132, 88], [134, 180]], { width: 2, color: C.ink, opacity: 0.7 }));
  [[128, 108], [140, 126], [128, 146], [140, 164], [132, 182]].forEach(([x, y], i) =>
    nodes.push(piece(circle(x, y, 11), i % 2 ? C.tan : C.sand, { edge: 'cut' })),
  );
  nodes.push(ink([[290, 88], [290, 104]], { width: 2, color: C.ink, opacity: 0.7 }));
  [[-22, 160], [-8, 170], [6, 166], [20, 156]].forEach(([dx, y], i) =>
    nodes.push(piece(band([[290, 102], [290 + dx, y]], 9), i % 2 ? C.green : C.greenDark, { edge: 'cut', fibre: false })),
  );
  nodes.push(piece(rect(282, 98, 16, 10, 3), C.red, { edge: 'cut', fibre: false }));
  nodes.push(
    piece(rect(690, 186, 110, 8, 2), C.brownDark, { edge: 'cut' }),
    piece(band([[722, 192], [722, 222]], 6), C.brownDark, { edge: 'cut', fibre: false }),
    piece(circle(722, 248, 27), C.rust, { edge: 'cut' }),
    piece(circle(714, 240, 8), C.orange, { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(band([[770, 192], [770, 268]], 6), C.stoneLight, { edge: 'cut', fibre: false }),
    piece(ellipse(770, 274, 13, 9), C.stoneLight, { edge: 'cut' }),
    ink([[1132, 88], [1132, 108]], { width: 2, color: C.ink, opacity: 0.7 }),
    piece(curve([[1132, 108], [1160, 140], [1152, 194], [1112, 194], [1104, 140]]), C.rose, { rough: 0.8 }),
    piece(curve([[1132, 150], [1146, 170], [1132, 186], [1118, 170]]), C.pink, { fibre: false, shadow: false }),
    piece(circle(1132, 110, 8), C.cream, { edge: 'cut' }),
  );

  // The fireplace, glowing warm.
  nodes.push(
    piece(circle(520, 450, 260), C.candle, { edge: 'clean', shadow: false, opacity: 0.1 }),
    piece(rect(370, 86, 300, 470), '#7d746a', { rough: 0.8 }),
    ...stones(370, 670, 96, 300, CHIMNEY, 23, 40),
    piece(rect(345, 288, 350, 26, 4), C.wood, { rough: 0.8 }),
    piece(rect(362, 312, 316, 10), C.brownDark, { edge: 'cut' }),
    ...stones(370, 670, 322, 552, CHIMNEY, 29, 40),
    piece(arch(402, 638, 312, 540), C.stoneLight, { rough: 0.8 }),
    piece(arch(420, 620, 330, 540), '#22160e', { rough: 0.8 }),
    piece(ellipse(520, 500, 90, 46), C.orange, { edge: 'clean', shadow: false, opacity: 0.25 }),
    // On the mantelpiece: jars, a candle and a big blue teapot.
    piece(rect(380, 246, 30, 42, 6), C.teal, { edge: 'cut' }),
    piece(rect(420, 256, 26, 32, 6), C.sand, { edge: 'cut' }),
    piece(rect(417, 250, 32, 8, 2), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(500, 240, 14, 48, 3), C.cream, { edge: 'cut' }),
    piece(ellipse(507, 230, 6, 10), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(band([[630, 268], [656, 246]], 8), C.blue, { edge: 'cut', fibre: false }),
    piece(ellipse(606, 266, 32, 23), C.blue, { edge: 'cut' }),
    piece(circle(606, 242, 8), C.blueDark, { edge: 'cut', fibre: false }),
    ink([[576, 258], [566, 266], [576, 276]], { width: 4, color: C.blueDark }),
  );

  // The floor.
  nodes.push(
    piece(rect(-20, 552, 1220, 300), '#7b5538', { rough: 0.8, shadow: false }),
    piece(rect(-20, 544, 1220, 14), '#4e3424', { edge: 'cut' }),
    ...[600, 646].map((y) => ink([[-10, y], [1190, y + 2]], { width: 2.5, color: '#4e3424', opacity: 0.45 })),
    ...[[160, 558, 600], [880, 558, 600], [300, 602, 646], [1000, 602, 646]].map(([x, a, b]) =>
      ink([[x, a], [x + 2, b]], { width: 2.5, color: '#4e3424', opacity: 0.45 }),
    ),
    piece(rect(384, 528, 272, 30, 4), C.stoneLight, { rough: 0.8 }),
    piece(ellipse(520, 610, 300, 60), C.candle, { edge: 'clean', shadow: false, opacity: 0.1 }),
  );

  return svg({ w: 1180, h: 820, name: 'b1c1-hut', boil: false, className: 'backdrop' }, nodes);
}
