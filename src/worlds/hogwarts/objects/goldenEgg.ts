/** From Wizard Words, b4c2 (goldenEgg). */
import { C } from '../../../art/palette';
import { dot, ellipse, group, ink, piece, svg, type Pt } from '../../../art/paper';

/** The golden egg, in two halves: the top half lifts off. */
export function goldenEgg(): string {
  const cx = 60;
  const cy = 88;
  const rx = 44;
  const ry = 58;
  const zig: Pt[] = [[16, 80], [30, 70], [44, 84], [58, 70], [72, 84], [86, 70], [104, 80]];
  const a0 = Math.asin(-8 / ry);
  const arc = (from: number, to: number): Pt[] => Array.from({ length: 21 }, (_, i) => {
    const a = from + ((to - from) * i) / 20;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });
  const lower = [...zig, ...arc(a0, Math.PI - a0)];
  const upper = [...zig, ...arc(Math.PI * 2 + a0, Math.PI - a0)];
  return svg({ w: 120, h: 150, name: 'b4c2-egg', boil: false, label: 'the golden egg' }, [
    piece(lower, C.gold, { edge: 'cut' }),
    ink([[30, 112], [60, 120], [90, 112]], { width: 2.5, color: '#9a6f20', opacity: 0.7 }),
    group({ part: 'lid' }, [
      piece(upper, C.gold, { edge: 'cut' }),
      piece(ellipse(42, 52, 9, 16, 20), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
      ink([[34, 74], [60, 62], [86, 74]], { width: 2.5, color: '#9a6f20', opacity: 0.7 }),
    ]),
    dot(78, 104, 4, C.goldLight),
  ]);
}
