/** From Wizard Words, b3c3 (sky). */
import { C } from '../../../art/palette';
import { circle, ellipse, ink, piece, rect, svg } from '../../../art/paper';

/** The sunset sky for the flight (1180 × 820): the landscape scrolls in front of it. */
export function sky(): string {
  return svg({ w: 1180, h: 820, name: 'b3c3-sky', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#7d82a6', { edge: 'clean', shadow: false }),
    piece(rect(-20, 120, 1220, 300), '#b78fa0', { rough: 2.2, shadow: false }),
    piece(rect(-20, 250, 1220, 260), '#e0a487', { rough: 2.2, shadow: false }),
    piece(rect(-20, 350, 1220, 200), '#f0c98a', { rough: 2.2, shadow: false }),
    piece(circle(930, 400, 120), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(circle(930, 400, 78), C.goldLight, { rough: 0.6 }),
    piece(ellipse(220, 140, 110, 26), '#e9c6c0', { shadow: false, opacity: 0.8 }),
    piece(ellipse(300, 124, 70, 22), '#e9c6c0', { shadow: false, opacity: 0.8 }),
    piece(ellipse(760, 220, 120, 22), '#f2d2b8', { shadow: false, opacity: 0.75 }),
    piece(ellipse(1060, 120, 90, 20), '#d8b4c0', { shadow: false, opacity: 0.75 }),
    ...[[560, 90], [600, 110], [1000, 250]].map(([x, y]) => ink([[x - 12, y - 6], [x, y], [x + 12, y - 6]], { width: 2.5, color: C.charcoal, opacity: 0.55 })),
  ]);
}
