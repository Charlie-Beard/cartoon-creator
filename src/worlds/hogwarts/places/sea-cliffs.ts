/** From Wizard Words, b6c2 (cliffs). */
import { C } from '../../../art/palette';
import { circle, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const ROCK = '#3b4157';

const ROCK_DARK = '#2b3045';

export function cliffs(): string {
  const r = rng(61);
  const stars: Node[] = [];
  for (let i = 0; i < 14; i++) stars.push(dot(r() * 1180, r() * 260, 1.8, C.cream, 0.8));
  const waveInk: Node[] = [];
  for (let i = 0; i < 10; i++) {
    const x = 560 + r() * 560;
    const y = 540 + r() * 150;
    waveInk.push(ink([[x, y], [x + 30, y - 8], [x + 70, y]], { width: 3, color: C.white }));
  }
  return svg({ w: 1180, h: 820, name: 'b6c2-cliffs', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    ...stars,
    piece(circle(980, 120, 40), C.cream, { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 520, 1220, 320), C.blueDark, { edge: 'torn', fibre: false }),
    ...waveInk,
    piece(poly([[-20, 220], [200, 200], [400, 230], [520, 330], [540, 520], [500, 700], [-20, 700]]), ROCK, { edge: 'torn', rough: 1.4 }),
    piece(ellipse(380, 600, 90, 110), ROCK_DARK, { edge: 'clean', shadow: false }),
    piece(rect(0, 700, 1180, 130), C.blueDark, { edge: 'clean', shadow: false }),
  ]);
}
