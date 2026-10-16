/** Garden hedge and bush for the Burrow's garden (match places/burrow.ts). */
import { C } from '../../../art/palette';
import { circle, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** A leafy lump: an ellipse with scalloped edges, kept above `floor` so bottoms stay flat. */
function clump(cx: number, cy: number, rx: number, ry: number, seed: number, floor = 1e9, n = 14): Pt[] {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const bump = i % 2 ? 0.86 : 1.06 + r() * 0.08;
    pts.push([cx + Math.cos(a) * rx * bump, Math.min(floor, cy + Math.sin(a) * ry * bump)]);
  }
  return pts;
}

/** A long, tall, scruffy garden hedge, 520 × 230. Flat bottom at y 228. */
export function hedge(): string {
  const r = rng(61);
  const W = 520;
  const B = 228;
  // Uneven top edge: the solid dark body (no holes anywhere).
  const top: Pt[] = [];
  for (let x = 0; x <= W; x += 40) top.push([x, 34 + r() * 40 + (x % 80 ? 10 : 0)]);
  const body: Pt[] = [[0, B], ...top, [W, B]];
  const clumps: Node[] = [];
  // Rows of leafy clumps, dark at the back to mid and light at the front.
  const rows: Array<[number, number, string[], number]> = [
    [70, 7, [C.greenDark, '#4a7a4e'], 52],
    [118, 8, ['#55804a', C.greenDark], 56],
    [166, 9, [C.green, '#55804a'], 56],
    [208, 9, ['#55804a', C.green, '#7fa768'], 46],
  ];
  rows.forEach(([cy, n, cols, rx], ri) => {
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (W / n) + (r() - 0.5) * 24;
      const y = cy + (r() - 0.5) * 18;
      const w = rx * (0.8 + r() * 0.35);
      const h = 34 + r() * 14;
      clumps.push(piece(clump(x, y, w, h, 100 + ri * 31 + i, B), cols[i % cols.length], { rough: 1.1 }));
    }
  });
  // Scruffy bits: little tufts and twigs poking out of the top.
  const tufts: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 20 + i * 58 + r() * 24;
    const y = 52 + r() * 36;
    tufts.push(ink([[x, y + 14], [x + (r() - 0.5) * 22, y - 10 - r() * 10]], { width: 4, color: i % 2 ? C.greenDark : '#55804a' }));
  }
  // Pale leaf highlights.
  const lights: Node[] = [];
  for (let i = 0; i < 14; i++) {
    lights.push(piece(clump(24 + r() * 470, 70 + r() * 140, 12 + r() * 8, 7 + r() * 4, 400 + i, B), '#8db674', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
  }
  // A shadow strip along the bottom where it meets the grass.
  const foot = piece(poly([[0, B - 14], [W, B - 12], [W, B], [0, B]]), C.greenDeep, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 });
  return svg({ w: W, h: 230, name: 'hog-hedge', label: 'a garden hedge' }, [
    piece(poly(body), C.greenDeep, { rough: 1.2 }),
    ...clumps,
    ...tufts,
    ...lights,
    foot,
  ]);
}

/** A round leafy garden bush, 220 × 170. Flat bottom at y 166. Part `leaves` (top layer) wobbles from [110, 166]. */
export function bush(): string {
  const B = 166;
  const flower = (x: number, y: number, color: string, rr = 8): Node[] => [
    piece(circle(x, y, rr), color, { edge: 'cut' }),
    piece(circle(x, y, rr * 0.38), C.goldLight, { edge: 'clean', shadow: false }),
  ];
  return svg({ w: 220, h: 170, name: 'hog-bush', label: 'a bush' }, [
    // solid base: one filled dome, flat bottom, nothing to see through
    piece(clump(110, 96, 102, 76, 7, B, 24), C.greenDark, { rough: 0.8 }),
    piece(rect(12, 120, 196, B - 120), C.greenDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(clump(58, 128, 52, 40, 8, B, 18), '#55804a', { rough: 1.1 }),
    piece(clump(162, 128, 52, 40, 9, B, 18), '#55804a', { rough: 1.1 }),
    group({ part: 'leaves', origin: [110, B] }, [
      piece(clump(110, 74, 78, 52, 10, 1e9, 20), C.green, { rough: 1.1 }),
      piece(clump(60, 100, 42, 34, 11, 1e9, 16), '#7fa768', { rough: 1.1 }),
      piece(clump(160, 98, 42, 34, 12, 1e9, 16), '#7fa768', { rough: 1.1 }),
      piece(clump(108, 52, 38, 24, 13, 1e9, 16), '#8db674', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
      ...flower(70, 84, C.pink),
      ...flower(142, 66, C.yellow, 7),
      ...flower(168, 100, C.rose, 7),
    ]),
  ]);
}
