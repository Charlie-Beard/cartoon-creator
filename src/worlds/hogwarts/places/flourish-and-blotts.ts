/**
 * Inside the bookshop in Diagon Alley (made for "The Book That Bites").
 *
 * Warm, dusty and cosy: floor-to-ceiling wooden shelves packed with books
 * in warm colours (no lettering on any spine), a brass rail along the
 * shelves with a rolling ladder on it, a lamp hanging from the ceiling and
 * wooden floorboards. All the clutter is pushed to the sides so the middle
 * and right stay open.
 *
 * Layout (stage coordinates):
 *   Ground line     y 670 (the skirting board is at y 600 to 616; floor
 *                   below). Bottom band y 690 to 820 is plain boards.
 *   LEFT            The counter, x 40 to 330: front panel y 470 to 640, top
 *                   edge y 455 to 475, with a brass till (x 70 to 160,
 *                   y 400 to 458), a small pile of books (x 200 to 290,
 *                   y 410 to 458) and an inkpot and quill.
 *   MIDDLE          x 360 to 820: clear floor for three actors. Behind them
 *                   plain shelves, the rolling ladder leaning at x 650 to 730
 *                   (top y 130, foot y 610) and a hanging lamp at x 590
 *                   (cord from the top, shade y 120 to 175, glow around it).
 *   RIGHT           x 820 to 1160: bare floor, with shelves behind (a little
 *                   dimmer): clear for a big cage prop standing on the floor
 *                   (put its bottom edge at y 670). A short stack of books on
 *                   the floor at the far edge, x 1130 to 1180, y 590 to 670.
 *   Light           Warm lamplight; add dust with k.ambient if wanted.
 */
import { C } from '../../../art/palette';
import { circle, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const WALL = '#5a3d2c';
const BOARD = '#3f2a1e';
/** Burgundy, forest, navy, mustard, rust, plum, cream and tan: old leather and cloth. */
const SPINES = ['#8a3a34', '#3f6b4c', '#34507c', '#d0a24a', '#b5583b', '#5a3f6e', '#e6d4aa', '#a67c52', '#6b4a32', '#4c8a8a', '#a9413a', '#7d6a3a'];

/** One shelf's worth of books standing on a board whose top is at `y`, with a few leaning or lying. */
function row(r: () => number, x0: number, x1: number, y: number, maxH: number): Node[] {
  const out: Node[] = [];
  let x = x0;
  while (x < x1 - 14) {
    const col = SPINES[Math.floor(r() * SPINES.length)];
    const w = 12 + r() * 14;
    const h = maxH * (0.62 + r() * 0.38);
    if (r() < 0.12 && x + 60 < x1) {
      // a few books lying flat in a stack
      const n = 2 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) {
        out.push(piece(rect(x + (i % 2) * 3, y - 12 * (i + 1), 54 - i * 4, 12, 1), SPINES[Math.floor(r() * SPINES.length)], { edge: 'cut', fibre: false, shadow: false }));
      }
      x += 58;
      continue;
    }
    const lean = r() < 0.1 ? 4 : 0;
    out.push(piece(poly([[x, y], [x + lean, y - h], [x + w + lean, y - h], [x + w, y]]), col, { edge: 'cut', fibre: false, shadow: false }));
    // a gold band or two on the spine, a lighter edge
    if (r() > 0.4) out.push(piece(rect(x + 1 + lean / 2, y - h * 0.8, w - 2, 3, 0), C.goldLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
    if (r() > 0.5) out.push(piece(rect(x + 1 + lean / 2, y - h * 0.25, w - 2, 3, 0), C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }));
    x += w + 1 + (lean ? 5 : 0);
  }
  return out;
}

/** A wall of shelves from x0 to x1, rows from y 36 down to the skirting board. */
function bay(r: () => number, x0: number, x1: number, dim: number): Node[] {
  const out: Node[] = [piece(rect(x0, 20, x1 - x0, 590, 0), BOARD, { edge: 'cut', fibre: false, shadow: false })];
  for (let y = 100; y <= 600; y += 72) {
    out.push(...row(r, x0 + 8, x1 - 8, y, 62));
    out.push(piece(rect(x0 - 2, y, x1 - x0 + 4, 9, 1), '#7a4e30', { edge: 'cut', fibre: false }));
  }
  if (dim > 0) out.push(piece(rect(x0, 20, x1 - x0, 590, 0), '#2a1a10', { edge: 'clean', shadow: false, opacity: dim }));
  return out;
}

/** The bookshop: shelves of books, a rolling ladder, a counter and till at the left. */
export function flourishAndBlotts(): string {
  const r = rng(5521);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 700), WALL, { edge: 'clean', shadow: false })];

  // the shelves: three bays with wooden uprights between them
  nodes.push(...bay(r, -10, 360, 0.0), ...bay(r, 360, 820, 0.08), ...bay(r, 820, 1190, 0.18));
  [356, 818].forEach((x) => nodes.push(piece(rect(x, 10, 16, 604, 0), '#6a4429', { edge: 'cut' })));
  nodes.push(piece(rect(-10, 4, 1200, 22, 0), '#6a4429', { edge: 'cut' }));
  // a gentle gold shine on the shelf tops from the lamp
  nodes.push(piece(ellipse(590, 300, 300, 260), C.candle, { edge: 'clean', shadow: false, opacity: 0.1 }));

  // the brass rail and the rolling ladder
  nodes.push(
    piece(rect(360, 126, 460, 7, 2), '#c9a24a', { edge: 'cut', fibre: false }),
    ink([[640, 133], [640, 118]], { width: 4, color: '#c9a24a' }),
    ink([[740, 133], [740, 118]], { width: 4, color: '#c9a24a' }),
    piece(poly([[650, 124], [668, 124], [704, 612], [684, 612]]), '#b9854f', { edge: 'cut' }),
    piece(poly([[704, 124], [722, 124], [742, 612], [722, 612]]), '#b9854f', { edge: 'cut' }),
  );
  for (let i = 0; i < 9; i++) {
    const t = 0.1 + i * 0.1;
    const y = 124 + 488 * t;
    nodes.push(piece(rect(662 + 38 * t, y - 4, 52 - 8 * 0 + t * 0, 8, 1), '#d3a366', { edge: 'cut', fibre: false, shadow: false }));
  }

  // a hanging lamp with a warm glow
  nodes.push(
    piece(circle(590, 150, 120), C.candle, { edge: 'clean', shadow: false, opacity: 0.16 }),
    piece(circle(590, 150, 70), C.candle, { edge: 'clean', shadow: false, opacity: 0.2 }),
    ink([[590, 0], [590, 116]], { width: 3, color: '#2a1a10', opacity: 0.8 }),
    piece(poly([[560, 168], [572, 116], [608, 116], [620, 168]]), '#2f6a52', { edge: 'cut' }),
    piece(rect(568, 164, 44, 10, 3), '#c9a24a', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(590, 178, 12, 8), C.candle, { edge: 'clean', shadow: false }),
  );

  // the skirting board and floor
  nodes.push(
    piece(rect(-20, 612, 1220, 240), '#a8774a', { rough: 0.8, shadow: false }),
    piece(rect(-20, 598, 1220, 22), '#3f2a1e', { edge: 'cut' }),
    ...[644, 690, 740, 792].map((y) => ink([[-10, y], [1190, y + 2]], { width: 2.5, color: C.brownDark, opacity: 0.35 })),
    ...[[200, 620, 644], [560, 620, 644], [940, 620, 644], [380, 648, 690], [780, 648, 690], [60, 648, 690], [1100, 648, 690], [260, 694, 740], [660, 694, 740], [1020, 694, 740], [140, 746, 792], [520, 746, 792], [900, 746, 792]].map(([x, a, b]) =>
      ink([[x, a], [x + 2, b]], { width: 2.5, color: C.brownDark, opacity: 0.28 }),
    ),
    // soft window-light on the boards in the middle
    piece(ellipse(590, 680, 300, 30), C.candle, { edge: 'clean', shadow: false, opacity: 0.1 }),
  );

  // the counter, at the left
  nodes.push(
    piece(rect(40, 470, 290, 172, 4), '#6f4429'),
    piece(rect(54, 484, 262, 144, 3), '#82552f', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(70, 496, 100, 120, 3), '#6f4429', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(190, 496, 100, 120, 3), '#6f4429', { edge: 'cut', fibre: false, shadow: false }),
    dot(120, 556, 5, C.goldLight), dot(240, 556, 5, C.goldLight),
    piece(rect(30, 454, 310, 22, 4), '#9b6a45'),
  );
  // the till: a brass box with round buttons and a drawer
  nodes.push(
    piece(rect(70, 408, 92, 48, 4), '#c9a24a'),
    piece(poly([[78, 408], [88, 380], [146, 380], [156, 408]]), '#d8b45a', { edge: 'cut' }),
    piece(rect(94, 386, 44, 16, 2), '#f1e4c4', { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2, 3].map((i) => dot(84 + i * 22, 424, 5, '#7d6a3a')),
    piece(rect(84, 436, 64, 14, 2), '#a8832f', { edge: 'cut', fibre: false, shadow: false }),
    dot(116, 443, 3, C.goldLight),
  );
  // a pile of books on the counter, and an inkpot with a quill
  nodes.push(
    piece(rect(196, 442, 92, 14, 2), '#34507c', { edge: 'cut', fibre: false }),
    piece(rect(204, 428, 80, 14, 2), '#8a3a34', { edge: 'cut', fibre: false }),
    piece(rect(200, 414, 84, 14, 2), '#3f6b4c', { edge: 'cut', fibre: false }),
    piece(rect(210, 400, 70, 14, 2), '#d0a24a', { edge: 'cut', fibre: false }),
    piece(poly([[300, 454], [296, 432], [320, 432], [316, 454]]), C.charcoal, { edge: 'cut', fibre: false }),
    ink([[308, 434], [322, 398], [330, 380]], { width: 3, color: C.cream }),
  );

  // loose piles of books on the floor at the far left and far right
  const pile = (x: number, y: number, cols: string[]) =>
    cols.map((c, i) => piece(rect(x + (i % 2) * 5 - i, y - 14 * (i + 1), 66 - i * 5, 14, 2), c, { edge: 'cut', fibre: false, shadow: i === 0 }));
  nodes.push(...pile(1112, 668, ['#5a3f6e', '#b5583b', '#4c8a8a', '#e6d4aa']));
  nodes.push(...pile(344, 660, ['#a9413a', '#34507c']));

  return svg({ w: 1180, h: 820, name: 'hogwarts-flourish-and-blotts', boil: false, className: 'backdrop' }, nodes);
}
