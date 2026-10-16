import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** No. 4 Privet Drive, in the morning: spotless, lemon-coloured and very ordinary (1180 × 820). */
export function dursleyKitchen(): string {
  const wall = '#efe3a8';
  const tileLines: Node[] = [];
  for (let x = -20; x <= 1200; x += 60) tileLines.push(ink([[x, 436], [x, 500]], { width: 2, color: '#cfd6d6', opacity: 0.9 }));
  tileLines.push(ink([[-20, 468], [1200, 468]], { width: 2, color: '#cfd6d6', opacity: 0.9 }));
  // floor lino: faint squares, fading out by the caption band
  const lino: Node[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = -1; col < 11; col++) {
      if ((row + col) % 2) lino.push(piece(rect(col * 120 + (row % 2) * 0, 620 + row * 22, 120, 22), '#c9c0a6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }));
    }
  }
  const handle = (x: number, y: number): Node => piece(rect(x, y, 22, 6, 3), C.stoneLight, { edge: 'cut', fibre: false, shadow: false });
  const doors = (x0: number, x1: number, y: number, h: number): Node[] => {
    const out: Node[] = [];
    const n = Math.round((x1 - x0) / 100);
    const w = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      out.push(piece(rect(x0 + i * w + 5, y + 6, w - 10, h - 12, 4), '#f5f0e2', { edge: 'cut', fibre: false, shadow: false }));
      out.push(handle(x0 + i * w + (i % 2 ? 14 : w - 36), y + h - 30));
    }
    return out;
  };
  return svg({ w: 1180, h: 820, name: 'hogwarts-dursley-kitchen', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    // soft morning light across the wall
    piece(ellipse(590, 220, 380, 220), '#fff6c8', { edge: 'clean', shadow: false, opacity: 0.4 }),

    // ---- the window at the back: garden, fence, blue morning sky
    piece(rect(400, 92, 380, 258, 6), '#f8f6ee', { edge: 'cut' }),
    piece(rect(420, 110, 340, 220), C.sky, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(420, 110, 340, 80), '#a8c8e6', { edge: 'clean', shadow: false, opacity: 0.6 }),
    piece(ellipse(520, 160, 44, 12), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(550, 150, 28, 10), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(670, 138, 34, 9), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // far hedge and the garden
    piece(curve([[420, 268], [470, 250], [540, 258], [620, 246], [700, 256], [760, 250], [760, 330], [420, 330]], 2), C.leafLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[420, 296], [500, 284], [600, 292], [700, 282], [760, 290], [760, 330], [420, 330]], 2), C.green, { edge: 'cut', fibre: false, shadow: false }),
    // a neat round bush and a few flowers
    piece(circle(470, 282, 20), C.leaf, { edge: 'cut', fibre: false, shadow: false }),
    ...[[560, 312, C.rose], [600, 316, C.yellow], [650, 310, C.pink], [720, 314, C.orange]].map(([x, y, c]) => dot(x as number, y as number, 5, c as string, 0.95)),
    // white picket fence
    ...Array.from({ length: 13 }, (_, i) => piece(poly([[426 + i * 26, 330], [426 + i * 26, 270], [434 + i * 26, 260], [442 + i * 26, 270], [442 + i * 26, 330]]), '#faf6ea', { edge: 'cut', fibre: false, shadow: false })),
    ink([[420, 284], [760, 284]], { width: 5, color: '#e6dfca' }),
    ink([[420, 312], [760, 312]], { width: 5, color: '#e6dfca' }),
    // window frame bars and sill
    ink([[590, 110], [590, 330]], { width: 8, color: '#f8f6ee' }),
    ink([[420, 205], [760, 205]], { width: 8, color: '#f8f6ee' }),
    piece(rect(386, 346, 408, 16, 4), '#e8e2d0', { edge: 'cut' }),
    // neat little curtains tied back
    piece(curve([[396, 90], [424, 90], [428, 200], [418, 340], [396, 340]], 2), '#f2a65a', { rough: 0.8, edge: 'cut' }),
    piece(curve([[784, 90], [756, 90], [752, 200], [762, 340], [784, 340]], 2), '#f2a65a', { rough: 0.8, edge: 'cut' }),

    // ---- wall clock, high on the left-middle
    piece(circle(340, 96, 38), '#d7a64a', { edge: 'cut' }),
    piece(circle(340, 96, 30), C.white, { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2, 3].map((i) => dot(340 + Math.sin((i * Math.PI) / 2) * 24, 96 - Math.cos((i * Math.PI) / 2) * 24, 3, C.ink)),
    ink([[340, 96], [340, 74]], { width: 3.5, color: C.ink }),
    ink([[340, 96], [354, 102]], { width: 3.5, color: C.ink }),

    // ---- tidy upper cupboards at the edges
    piece(rect(-20, 30, 300, 210, 4), '#e9dca0', { edge: 'cut' }),
    ...doors(-10, 270, 36, 198),
    piece(rect(870, 30, 330, 210, 4), '#e9dca0', { edge: 'cut' }),
    ...doors(880, 1190, 36, 198),

    // ---- white tiles
    piece(rect(-20, 428, 1220, 80), '#f7f6f0', { edge: 'clean', shadow: false }),
    ...tileLines,
    // pale blue border tiles
    piece(rect(-20, 428, 1220, 10), '#a9c6d8', { edge: 'clean', shadow: false }),

    // ---- floor and the plinth
    piece(rect(-20, 598, 1220, 260), '#dccfae', { edge: 'clean', shadow: false }),
    ...lino,
    // ---- base cupboards and worktop (the front of the counter is calm and low)
    piece(rect(-20, 506, 1220, 94), '#efe9d6', { edge: 'cut' }),
    ...doors(-10, 1190, 512, 82).filter((_, i) => i % 1 === 0),
    piece(rect(-20, 496, 1220, 16, 3), '#b8c0c4', { edge: 'cut', shadow: true }),

    // ---- kettle (between the left and middle actors)
    piece(poly([[352, 496], [352, 458], [366, 436], [404, 436], [418, 458], [418, 496]]), C.stoneLight, { edge: 'cut' }),
    piece(curve([[418, 470], [440, 452], [446, 444]], 2), C.stoneLight, { edge: 'cut', fibre: false }),
    ink([[360, 444], [396, 444]], { width: 6, color: C.white, opacity: 0.5 }),
    piece(rect(372, 424, 24, 12, 4), C.red, { edge: 'cut', fibre: false }),
    ink([[352, 456], [334, 458], [334, 480], [352, 484]], { width: 6, color: C.red }),
    // ---- toaster (between the middle and right actors)
    piece(rect(724, 456, 78, 40, 10), '#c7ccd0', { edge: 'cut' }),
    piece(rect(738, 450, 22, 8, 3), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(766, 450, 22, 8, 3), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(810, 470, 6, 20, 3), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(722, 480, 82, 6), C.red, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ]);
}
