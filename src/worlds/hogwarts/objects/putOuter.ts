/** Dumbledore's Put-Outer, 120 × 120. Part `lid` flips up from its hinge. */
import { C } from '../../../art/palette';
import { ellipse, group, ink, piece, poly, rect, svg, type Pt } from '../../../art/paper';

const SILVER = '#c9ced8';
const SILVER_DARK = '#8f96a6';

function starPts(cx: number, cy: number, R: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

export function putOuterArt(): string {
  return svg({ w: 120, h: 120, name: 'hogwarts-putOuter', label: "Dumbledore's Put-Outer" }, [
    // box
    piece(rect(26, 52, 68, 56, 12), SILVER, { edge: 'cut' }),
    piece(rect(26, 90, 68, 18, 10), SILVER_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(32, 56, 10, 34, 5), '#eef1f6', { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    // the mouth of the lighter
    piece(ellipse(60, 52, 22, 5), C.ink, { edge: 'clean', fibre: false, shadow: false }),
    // lid, hinged at the back left (origin 36, 52)
    group({ part: 'lid', origin: [36, 52] }, [
      piece(rect(26, 30, 68, 24, 10), SILVER, { edge: 'cut' }),
      piece(rect(32, 34, 56, 6, 3), '#eef1f6', { edge: 'clean', fibre: false, shadow: false, opacity: 0.7 }),
    ]),
    // hinge
    piece(ellipse(32, 52, 5, 5), SILVER_DARK, { edge: 'cut', fibre: false }),
    // tiny gold star
    piece(poly(starPts(60, 80, 11, 5)), C.gold, { edge: 'cut', fibre: false }),
    ink([[44, 98], [76, 98]], { width: 1.5, color: SILVER_DARK }),
  ]);
}
