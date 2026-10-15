/** From Wizard Words, b7c1 (pieArt). */
import { C } from '../../../art/palette';
import { curve, ellipse, ink, piece, svg, type Node } from '../../../art/paper';

/** A golden pie, 200 × 120. */
export function pieArt(): string {
  const slits: Node[] = [-40, 0, 40].map((dx) => ink([[100 + dx - 10, 40], [100 + dx + 10, 50]], { width: 4, color: C.brownDark }));
  return svg({ w: 200, h: 120, name: 'b7c1-pie', label: 'a pie' }, [
    piece(ellipse(100, 92, 90, 20), C.tan),
    piece(curve([[14, 88], [26, 52], [100, 24], [174, 52], [186, 88], [100, 108]], 2), C.gold),
    piece(curve([[40, 80], [60, 56], [100, 40], [140, 56], [160, 80], [100, 92]], 2), C.goldLight, { fibre: false, shadow: false, opacity: 0.6 }),
    ...slits,
    // steam
    ink([[70, 20], [64, 8], [72, -2]], { width: 3, color: C.white }),
    ink([[130, 20], [136, 8], [128, -2]], { width: 3, color: C.white }),
  ]);
}
