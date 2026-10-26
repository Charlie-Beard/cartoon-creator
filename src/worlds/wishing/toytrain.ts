/**
 * The Toyland Express: a little clockwork toy train, seen from the side,
 * facing right. Three props in the same bright primary colours:
 *
 *   toy-train         the engine, 360 × 230: a red cab with a yellow roof, a
 *                     green boiler with brass bands, a tall black chimney, a
 *                     brass dome, three red wheels, and a big round brass
 *                     winding-key hole in the side of the boiler, at (230, 126)
 *                     of the prop. Parts: wheel1, wheel2, wheel3 (each spins
 *                     about its own middle), keyhole.
 *   toy-truck         the open truck behind it, 250 × 170: only its far
 *                     wall and floor (what is seen inside). Anything riding
 *                     in it is placed between this and toy-truck-front.
 *   toy-truck-front   the truck's near wall and its two wheels, same box,
 *                     laid over whoever sits in it. Parts: wheelA, wheelB.
 *
 * The truck's right-hand hook meets the engine's left-hand one when the
 * truck is placed 244 px (at natural size) to the left of the engine and 70
 * px lower than its top, so both sets of wheels stand on the same rail.
 */
import { C } from '../../art/palette';
import { cached, circle, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../art/paper';
import { CUT, FLAT } from '../faraway/parts';

const RED = C.toyRed;
const RED_DARK = '#9c2f28';
const GREEN = C.toyGreen;
const YELLOW = C.toyYellow;
const BLUE = C.toyBlue;
const BLUE_DARK = '#2e5588';
const BRASS = C.brass;

/** A red wheel with a yellow rim, six yellow spokes and a hub, turning about (x, y). */
function wheel(part: string, x: number, y: number, r: number): Node {
  const spokes: Node[] = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    return ink([[x, y], [x + Math.cos(a) * (r - 5), y + Math.sin(a) * (r - 5)]], { width: 3.4, color: YELLOW, wobble: 0.1 });
  });
  return group({ part, origin: [x, y] }, [
    piece(circle(x, y, r), RED, { edge: 'cut' }),
    piece(circle(x, y, r - 5), RED_DARK, { edge: 'clean', fibre: false, shadow: false, opacity: 0.35 }),
    ...spokes,
    piece(circle(x, y, 7), YELLOW, CUT),
    piece(circle(x, y, 2.6), RED_DARK, FLAT),
  ]);
}

/** The engine. 360 × 230. */
export const toyTrain = cached(() =>
  svg({ w: 360, h: 230, name: 'wishing-toy-train', label: 'A little toy train engine' }, [
    // chassis
    piece(rect(6, 164, 350, 18, 3), '#3b3844', { edge: 'cut' }),
    // the boiler, with a rounded nose
    piece(rect(146, 82, 194, 86, 30), GREEN, { edge: 'cut' }),
    piece(rect(150, 86, 186, 22, 12), '#6fbf7c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    ...[176, 268, 312].map((x) => piece(rect(x, 82, 12, 86, 2), BRASS, { edge: 'cut', fibre: false })),
    // the cab
    piece(rect(12, 50, 140, 118, 4), RED, { edge: 'cut' }),
    piece(rect(40, 72, 74, 56, 5), '#27374f', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(48, 80, 58, 40, 3), '#8fb4d8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.75 }),
    ink([[77, 80], [77, 120]], { width: 4, color: RED }),
    piece(rect(2, 34, 162, 22, 4), YELLOW, { edge: 'cut' }),
    // the chimney: black, flaring at the top, with a gold lip
    piece(poly([[286, 90], [292, 34], [320, 34], [326, 90]]), '#2f2c36', { edge: 'cut', fibre: false }),
    piece(rect(282, 24, 48, 14, 4), BRASS, { edge: 'cut', fibre: false }),
    // the brass dome
    piece(ellipse(212, 82, 28, 18), BRASS, { edge: 'cut', fibre: false }),
    piece(rect(184, 82, 56, 6, 1), '#8e6a1e', { edge: 'cut', fibre: false, shadow: false }),
    // headlamp and cowcatcher
    piece(circle(344, 112, 11), '#fff1b8', CUT),
    piece(poly([[330, 180], [358, 226], [322, 226], [316, 182]]), '#6c7480', { edge: 'cut', fibre: false }),
    // the winding-key hole: a big brass disc with a dark slot
    group({ part: 'keyhole', origin: [230, 126] }, [
      piece(circle(230, 126, 27), BRASS, { edge: 'cut' }),
      piece(circle(230, 126, 21), '#e0b858', { edge: 'clean', fibre: false, shadow: false }),
      piece(circle(230, 126, 8), '#2b2620', { edge: 'clean', fibre: false, shadow: false }),
      piece(rect(224, 126, 12, 22, 3), '#2b2620', { edge: 'clean', fibre: false, shadow: false }),
    ]),
    // the rod between the wheels, and the wheels
    ink([[84, 198], [190, 198], [294, 198]], { width: 6, color: '#d8a736' }),
    wheel('wheel1', 84, 198, 30),
    wheel('wheel2', 190, 202, 26),
    wheel('wheel3', 294, 202, 26),
    // the hook at the back
    ink([[6, 172], [-2, 172]], { width: 6, color: '#3b3844' }),
  ]),
);

/** The truck's far wall and floor, what is seen inside it. 250 × 170. */
export const toyTruck = cached(() =>
  svg({ w: 250, h: 170, name: 'wishing-toy-truck', label: 'An open toy truck' }, [
    piece(rect(12, 22, 226, 84, 3), '#b98542', { edge: 'cut' }),
    ...[0, 1, 2, 3].map((i) => ink([[16, 40 + i * 18], [234, 40 + i * 18]], { width: 2, color: '#7d5526', opacity: 0.45 })),
    piece(rect(8, 16, 234, 12, 3), YELLOW, { edge: 'cut', fibre: false }),
  ]),
);

/** The truck's near wall and wheels, laid over the one riding in it. 250 × 170. */
export const toyTruckFront = cached(() =>
  svg({ w: 250, h: 170, name: 'wishing-toy-truck-front', label: 'The front of an open toy truck' }, [
    piece(rect(10, 96, 230, 18, 3), '#3b3844', { edge: 'cut' }),
    piece(rect(8, 70, 234, 52, 4), BLUE, { edge: 'cut' }),
    piece(rect(8, 70, 234, 12, 3), YELLOW, { edge: 'cut', fibre: false }),
    ...[0, 1, 2, 3, 4].map((i) => piece(rect(18 + i * 46, 88, 34, 26, 3), BLUE_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 })),
    ...[0, 1, 2, 3, 4].map((i) => ink([[35 + i * 46, 92], [35 + i * 46, 110]], { width: 2.2, color: YELLOW, opacity: 0.8 })),
    ink([[242, 120], [250, 120]], { width: 6, color: '#3b3844' }),
    ink([[8, 120], [0, 120]], { width: 6, color: '#3b3844' }),
    wheel('wheelA', 62, 134, 24),
    wheel('wheelB', 188, 134, 24),
  ]),
);
