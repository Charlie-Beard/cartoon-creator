/** From Wizard Words, b5c2 (windChimes). */
import { C } from '../../../art/palette';
import { ellipse, ink, piece, poly, rect, svg, type Pt } from '../../../art/paper';

function starPts(cx: number, cy: number, R: number, r: number, n = 5): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const rr = i % 2 ? r : R;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

/** Wind chimes hanging from the tree, 140 × 230. Sways from the top. */
export function windChimes(): string {
  const tubes: Array<[number, number, string]> = [
    [30, 90, '#cfd6e6'],
    [48, 120, C.goldLight],
    [66, 140, '#c9b6e0'],
    [84, 110, '#b8dcd8'],
    [102, 80, '#e8c7cf'],
  ];
  return svg({ w: 140, h: 230, name: 'b5c2-chimes', label: 'wind chimes' }, [
    ink([[70, 0], [70, 26]], { width: 2.5, color: C.cream }),
    ...tubes.map(([x]) => ink([[x + 5, 32], [x + 5, 48]], { width: 1.5, color: C.cream })),
    ...tubes.map(([x, len, c]) => piece(rect(x, 48, 10, len, 4), c, { edge: 'cut' })),
    ink([[70, 32], [70, 170]], { width: 1.5, color: C.cream }),
    piece(poly(starPts(70, 186, 18, 8)), C.goldLight, { edge: 'cut' }),
    piece(ellipse(70, 30, 46, 8), C.brown, { edge: 'cut' }),
  ]);
}
