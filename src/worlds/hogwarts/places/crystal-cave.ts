/** From Wizard Words, b6c2 (cave). */
import { C } from '../../../art/palette';
import { curve, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const ROCK_LIGHT = '#566079';

const ROCK = '#3b4157';

const ROCK_DARK = '#2b3045';

const WATER = '#1c2a45';

export function cave(): string {
  const r = rng(62);
  const drips: Node[] = [];
  // stalactites along the ceiling
  for (let x = 20; x < 1180; x += 90 + r() * 50) {
    const hh = 60 + r() * 90;
    drips.push(piece(poly([[x - 28, -10], [x + 28, -10], [x + 3, hh]]), ROCK_LIGHT, { edge: 'torn', fibre: false }));
  }
  const ripples: Node[] = [];
  for (let i = 0; i < 12; i++) {
    const x = 640 + r() * 520;
    const y = 530 + r() * 150;
    ripples.push(ink([[x, y], [x + 40 + r() * 40, y + r() * 3]], { width: 2, color: '#34496e' }));
  }
  return svg({ w: 1180, h: 820, name: 'b6c2-cave', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), ROCK, { edge: 'clean', shadow: false }),
    piece(rect(-20, 295, 900, 400), ROCK_DARK, { edge: 'torn', rough: 1.2 }),
    ...drips,
    // the floor ledge on the left
    piece(curve([[-30, 640], [200, 628], [420, 636], [610, 650], [620, 700], [-30, 700]]), ROCK_LIGHT, { edge: 'torn' }),
    // the dark glassy lake
    piece(rect(560, 470, 700, 260, 8), WATER, { edge: 'torn', fibre: false }),
    ...ripples,
    // the far island
    piece(curve([[700, 560], [820, 500], [1000, 490], [1150, 540], [1190, 600], [1100, 640], [790, 640]]), ROCK_LIGHT, { edge: 'torn' }),
    piece(curve([[760, 600], [900, 570], [1100, 580], [1120, 620], [800, 630]]), ROCK_DARK, { edge: 'clean', fibre: false, shadow: false, opacity: 0.6 }),
    ink([[800, 655], [900, 662], [1000, 656], [1100, 660]], { width: 3, color: C.sky }),
    piece(rect(0, 700, 1180, 130), ROCK_DARK, { edge: 'clean', shadow: false }),
  ]);
}
