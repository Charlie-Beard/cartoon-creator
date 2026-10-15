/** From Wizard Words, b3c2 (spider). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

function googlyEye(x: number, y: number, r: number, lookX: number, lookY: number): Node[] {
  return [
    piece(circle(x, y, r), C.white, { edge: 'cut' }),
    piece(circle(x + lookX, y + lookY, r * 0.48), C.ink, { edge: 'clean', shadow: false }),
    dot(x + lookX - r * 0.15, y + lookY - r * 0.18, Math.max(2, r * 0.14), C.white),
  ];
}

/** The boggart as a big, round, googly-eyed spider (340 × 280), skates hidden. */
export function spider(): string {
  const cx = 170;
  const legColor = '#3a3244';
  const legs: Node[] = [];
  const feet: number[] = [];
  for (const s of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const hip: Pt = [cx + s * (25 + 12 * i), 160 - 14 * i];
      const knee: Pt = [cx + s * (62 + 28 * i), 110 - 12 * i];
      const foot: Pt = [cx + s * (48 + 30 * i), 238];
      feet.push(foot[0]);
      legs.push(ink([hip, knee, foot], { width: 11, color: legColor, wobble: 0.8 }));
    }
  }
  const fur: Pt[] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const r = i % 2 ? 72 : 84;
    fur.push([cx + Math.cos(a) * r * 1.05, 128 + Math.sin(a) * r * 0.92]);
  }
  const skates = feet.map((x) =>
    group({}, [
      piece(rect(x - 8, 216, 16, 18, 4), C.red, { edge: 'cut' }),
      piece(rect(x - 12, 230, 24, 14, 5), C.red, { edge: 'cut' }),
      piece(rect(x - 12, 239, 24, 5, 2), C.white, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(x - 6, 250, 6), C.gold, { edge: 'cut', fibre: false }),
      piece(circle(x + 6, 250, 6), C.gold, { edge: 'cut', fibre: false }),
    ]),
  );
  return svg({ w: 340, h: 280, name: 'b3c2-spider', label: 'a boggart spider' }, [
    piece(ellipse(cx, 262, 150, 12), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    ...legs,
    piece(curve(fur, 1), '#5b4f6b', { rough: 1.3 }),
    piece(ellipse(cx - 20, 92, 36, 22, -20), '#7a6e8a', { edge: 'cut', fibre: false, shadow: false }),
    ...googlyEye(cx - 30, 116, 26, 7, 8),
    ...googlyEye(cx + 30, 112, 24, -6, -6),
    ...googlyEye(cx - 12, 72, 9, 2, 2),
    ...googlyEye(cx + 14, 70, 9, -2, 3),
    ink([[cx - 30, 166], [cx, 178], [cx + 30, 166]], { width: 5, color: C.ink }),
    piece(poly([[cx - 14, 170], [cx - 6, 172], [cx - 10, 184]]), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[cx + 6, 172], [cx + 14, 170], [cx + 10, 184]]), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'skates', opacity: 0 }, skates),
  ]);
}
