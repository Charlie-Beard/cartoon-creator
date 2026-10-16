/**
 * Hagrid's huge flying motorbike, 440 × 260, side-on, facing right.
 * Seat top is y 108 (x 110 to 262) and nothing rises above y 100 except
 * the handlebars at the far right (x 336 to 372), so a portrait standing
 * behind the bike shows head and shoulders over the seat.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../../art/paper';

const BLACK = '#25252c';
const BLACK_LIGHT = '#3a3a45';
const CHROME = '#cfd4de';
const CHROME_DARK = '#8d94a4';

function wheel(cx: number, cy: number): Array<ReturnType<typeof piece>> {
  return [
    piece(circle(cx, cy, 54), BLACK, { edge: 'cut' }),
    piece(circle(cx, cy, 40), BLACK_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx, cy, 30), CHROME_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx, cy, 22), CHROME, { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 60, 120].map((a) => {
      const r = (a * Math.PI) / 180;
      return ink([[cx - Math.cos(r) * 28, cy - Math.sin(r) * 28], [cx + Math.cos(r) * 28, cy + Math.sin(r) * 28]], { width: 3, color: CHROME_DARK });
    }),
    piece(circle(cx, cy, 7), BLACK, { edge: 'cut', fibre: false, shadow: false }),
  ];
}

export function flyingMotorbikeArt(): string {
  return svg({ w: 440, h: 260, name: 'hogwarts-flyingMotorbike', label: "Hagrid's flying motorbike" }, [
    // rear mudguard and wheel
    ...wheel(92, 200),
    piece(curve([[28, 168], [60, 128], [110, 130], [150, 150], [110, 146], [70, 150], [44, 176]], 2), BLACK, { edge: 'cut' }),
    // front fork (behind front wheel hub) and wheel
    piece(poly([[338, 98], [350, 98], [372, 200], [360, 200]]), CHROME, { edge: 'cut', fibre: false }),
    ...wheel(362, 200),
    piece(curve([[316, 176], [330, 140], [386, 138], [416, 178], [394, 164], [346, 164]], 2), BLACK, { edge: 'cut' }),
    // engine and frame
    piece(rect(130, 124, 160, 70, 14), BLACK, { edge: 'cut' }),
    piece(rect(150, 150, 70, 38, 8), CHROME_DARK, { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2, 3].map((i) => piece(rect(156 + i * 16, 154, 8, 30, 2), CHROME, { edge: 'cut', fibre: false, shadow: false })),
    piece(rect(236, 152, 38, 40, 10), CHROME, { edge: 'cut', fibre: false }),
    // exhaust pipes along the side
    piece(rect(60, 192, 140, 14, 7), CHROME, { edge: 'cut' }),
    piece(rect(60, 196, 140, 4, 2), '#eef1f6', { edge: 'clean', fibre: false, shadow: false }),
    ink([[92, 200], [150, 180], [250, 184]], { width: 6, color: BLACK }),
    // petrol tank in front of the seat
    piece(ellipse(292, 120, 46, 24, -6), BLACK_LIGHT, { edge: 'cut' }),
    piece(curve([[260, 112], [292, 100], [326, 110]], 2), CHROME, { edge: 'cut', fibre: false, shadow: false }),
    // long seat, top at y 108
    piece(rect(104, 106, 160, 20, 10), C.redDark, { edge: 'cut' }),
    piece(rect(114, 108, 140, 5, 2), C.red, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    // handlebars, headlamp
    piece(rect(334, 88, 40, 10, 5), CHROME, { edge: 'cut' }),
    piece(rect(366, 80, 14, 22, 5), BLACK, { edge: 'cut', fibre: false }),
    piece(rect(358, 100, 28, 40, 8), CHROME, { edge: 'cut', fibre: false }),
    piece(circle(400, 138, 32), CHROME, { edge: 'cut' }),
    piece(circle(400, 138, 25), CHROME_DARK, { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'lamp', origin: [404, 138] }, [
      piece(circle(404, 138, 44), 'rgba(255,240,170,0.25)', { edge: 'clean', fibre: false, shadow: false }),
      piece(circle(404, 138, 22), '#fff3b0', { edge: 'cut', fibre: false, shadow: false }),
      dot(398, 132, 6, '#fffbe0', 0.9),
    ]),
    // rivets
    dot(140, 134, 2.5, CHROME), dot(280, 134, 2.5, CHROME), dot(210, 134, 2.5, CHROME),
  ]);
}
