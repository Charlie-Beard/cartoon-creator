/** From Wizard Words, b1c3 (hillsBackdrop). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, piece, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** A torn-paper hill line across a width. */
function hills(y: number, amp: number, color: string, seed: number, w = 1180, step = 90): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, 900]];
  for (let x = -40; x <= w + 40; x += step) pts.push([x, y - r() * amp]);
  pts.push([w + 40, 900]);
  return piece(curve(pts, 2), color, { rough: 1.4 });
}

/** Sunset hills with a railway line along them. */
export function hillsBackdrop(): string {
  const sleepers: Node[] = [];
  for (let x = -10; x < 1200; x += 34) sleepers.push(piece(rect(x, 604, 16, 12), C.brownDark, { edge: 'cut', fibre: false, shadow: false }));
  return svg({ w: 1180, h: 820, name: 'b1c3-hills', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#3d3a66', { edge: 'clean', shadow: false }),
    piece(rect(-20, 150, 1220, 300), '#6b5a8a', { rough: 2 }),
    piece(rect(-20, 280, 1220, 200), '#b9707a', { rough: 2.2 }),
    piece(rect(-20, 370, 1220, 120), '#e0a070', { rough: 2.2 }),
    piece(circle(860, 420, 74), C.goldLight, { rough: 0.8 }),
    piece(ellipse(260, 170, 110, 22), '#8a6f9a', { rough: 1.4, shadow: false }),
    piece(ellipse(330, 152, 70, 18), '#9a7faa', { rough: 1.4, shadow: false }),
    piece(ellipse(980, 230, 120, 20), '#c48a8a', { rough: 1.4, shadow: false }),
    hills(420, 70, '#5a4f7a', 11),
    hills(480, 50, C.greenDeep, 23),
    hills(545, 40, C.greenDark, 37),
    // the railway embankment and track
    piece(rect(-20, 598, 1220, 40), '#6b5040', { rough: 1.2 }),
    ...sleepers,
    piece(rect(-20, 598, 1220, 8), C.greyDark, { edge: 'cut', fibre: false }),
    hills(650, 24, C.green, 51, 1180, 120),
    hills(720, 16, '#5e8a4c', 63, 1180, 140),
  ]);
}
