/** From Wizard Words, b7c2 (london). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** London at sunset: sky bands, a low sun, a tower, a dome, the river and a bridge. */
export function london(): string {
  const bands: Node[] = [];
  const cols = ['#4d4a7a', '#7c5a8a', '#b8688a', '#e8887a', '#f4b07a', '#f8d08a'];
  cols.forEach((c, i) => bands.push(piece(rect(-20, i * 100, 1220, 120), c, { edge: 'clean', shadow: false, fibre: false })));
  const skyline: Node[] = [
    piece(rect(150, 520, 110, 160), '#3a3350', { edge: 'cut', fibre: false }),
    piece(rect(300, 470, 54, 210), '#3a3350', { edge: 'cut', fibre: false }),
    piece(poly([[290, 470], [327, 400], [364, 470]]), '#2e2842', { edge: 'cut', fibre: false }),
    piece(circle(327, 506, 15), C.cream, { edge: 'cut', fibre: false }),
    piece(rect(420, 540, 90, 140), '#3a3350', { edge: 'cut', fibre: false }),
    piece(curve([[560, 680], [560, 560], [620, 500], [680, 560], [680, 680]], 2), '#2e2842'),
    piece(rect(740, 520, 60, 160), '#3a3350', { edge: 'cut', fibre: false }),
    piece(rect(840, 560, 130, 120), '#3a3350', { edge: 'cut', fibre: false }),
    piece(rect(1010, 500, 80, 180), '#3a3350', { edge: 'cut', fibre: false }),
    piece(rect(-20, 676, 1220, 160), '#4a4468', { edge: 'clean', shadow: false }),
    ink([[-20, 700], [1220, 700]], { width: 3, color: '#6a6490' }),
  ];
  return svg({ w: 1180, h: 820, name: 'b7c2-london', boil: false, className: 'backdrop' }, [
    ...bands,
    piece(circle(840, 430, 82), C.goldLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(circle(840, 430, 56), C.yellow, { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    ...[[160, 90], [390, 160], [980, 70], [690, 110]].map(([x, y]) => piece(ellipse(x, y, 90, 20), '#f0a8a0', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 })),
    ...skyline,
  ]);
}
