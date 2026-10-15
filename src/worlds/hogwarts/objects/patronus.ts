/** From Wizard Words, b5c3 (patronus). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, svg, type Node } from '../../../art/paper';

const SILVER_BLUE = '#bfe6ff';

const SILVER_EDGE = '#8cc4ee';

/** A glowing silver-blue Patronus, 220 × 170, facing right. */
export function patronus(kind: 'stag' | 'otter' | 'hare'): string {
  const o = { fibre: false, shadow: false, opacity: 0.88 } as const;
  const f = (outline: ReturnType<typeof ellipse>, extra = {}) => piece(outline, SILVER_BLUE, { edge: 'cut', ...o, ...extra });
  const glow = piece(ellipse(110, 90, 100, 66), '#e9f6ff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.25 });
  let body: Node[];
  if (kind === 'stag') {
    body = [
      ...[60, 80, 140, 160].map((x) => piece(poly([[x - 5, 110], [x + 5, 110], [x + 3, 162], [x - 3, 162]]), SILVER_EDGE, { edge: 'cut', ...o })),
      f(ellipse(105, 100, 60, 28)),
      piece(poly([[140, 90], [166, 40], [186, 52], [160, 110]]), SILVER_BLUE, { edge: 'cut', ...o }),
      f(ellipse(182, 42, 22, 13, -20)),
      ink([[176, 30], [172, 6], [160, 0]], { width: 3, color: '#e9f6ff' }),
      ink([[172, 18], [184, 6]], { width: 3, color: '#e9f6ff' }),
      ink([[168, 28], [150, 22], [142, 10]], { width: 3, color: '#e9f6ff' }),
      dot(190, 40, 2.5, C.ink),
    ];
  } else if (kind === 'otter') {
    body = [
      piece(curve([[20, 130], [48, 108], [80, 100], [120, 98], [146, 110], [140, 124], [90, 122], [50, 138]], 2), SILVER_BLUE, { edge: 'cut', ...o }),
      piece(curve([[8, 134], [30, 144], [54, 138], [30, 122]], 2), SILVER_EDGE, { edge: 'cut', ...o }),
      ...[96, 130].map((x) => piece(ellipse(x, 126, 9, 16), SILVER_EDGE, { edge: 'cut', ...o })),
      f(circle(160, 90, 24)),
      f(circle(150, 68, 8)),
      piece(ellipse(178, 98, 10, 7), '#e9f6ff', { edge: 'cut', ...o }),
      dot(166, 84, 2.5, C.ink),
      dot(184, 96, 2.5, C.ink),
    ];
  } else {
    body = [
      f(ellipse(100, 108, 52, 32, -8)),
      ...[70, 130].map((x) => piece(ellipse(x, 146, 22, 8), SILVER_EDGE, { edge: 'cut', ...o })),
      piece(circle(44, 104, 11), '#e9f6ff', { edge: 'cut', ...o }),
      f(circle(154, 82, 22)),
      f(ellipse(150, 30, 9, 30, 8)),
      f(ellipse(166, 32, 9, 30, 20)),
      dot(162, 80, 2.5, C.ink),
    ];
  }
  return svg({ w: 220, h: 170, name: 'b5c3-' + kind, boil: false, label: 'a Patronus' }, [glow, ...body]);
}
