/** From Wizard Words, b2c4 (orreryArt). */
import { C } from '../../../art/palette';
import { circle, ink, piece, svg, type Pt } from '../../../art/paper';

const SILVER = '#c9ccd2';

const SILVER_DARK = '#9aa0aa';

/** The orrery's spinning rings, 120 × 120. */
export function orreryArt(): string {
  const ring = (rr: number): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i < 24; i++) pts.push([60 + Math.cos((i / 24) * Math.PI * 2) * rr, 60 + Math.sin((i / 24) * Math.PI * 2) * rr]);
    return pts;
  };
  const at = (rr: number, deg: number): [number, number] => [60 + Math.cos((deg * Math.PI) / 180) * rr, 60 + Math.sin((deg * Math.PI) / 180) * rr];
  return svg({ w: 120, h: 120, name: 'b2c4-orrery', boil: false }, [
    ink(ring(50), { width: 3, color: SILVER, closed: true, wobble: 0.3 }),
    ink(ring(30), { width: 2.5, color: SILVER_DARK, closed: true, wobble: 0.3 }),
    piece(circle(60, 60, 12), C.gold, { edge: 'cut' }),
    piece(circle(...at(50, 20), 8), C.blue, { edge: 'cut' }),
    piece(circle(...at(50, 160), 6), C.rust, { edge: 'cut' }),
    piece(circle(...at(50, 260), 7), C.goldLight, { edge: 'cut' }),
    piece(circle(...at(30, 300), 5), C.green, { edge: 'cut' }),
  ]);
}
