/**
 * passwordList: Neville's long, scrappy list of passwords, 120 × 260.
 *
 * A strip of old parchment, torn at the ends and a little crumpled (soft fold
 * creases, one curled corner at the bottom right). Down the middle runs a
 * column of short wavy ink lines, like writing but not readable. Five of
 * them are struck through with a heavy red-brown line, and one has a
 * scribbled loop round it. A little drawn star sits at the top, and another
 * at the foot. No lettering. Nothing moves; hold it up, wave it, or let it
 * unroll by scaling it from the top edge (y 0).
 */
import { circle, curve, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const INK = '#4a3320';
const STRIKE = '#8a3a2c';

/** A short wavy scribble that reads as a word. */
function word(x: number, y: number, w: number): Node[] {
  const pts: Pt[] = [];
  const n = Math.max(3, Math.round(w / 9));
  for (let i = 0; i <= n; i++) pts.push([x + (w * i) / n, y + (i % 2 ? -3.2 : 3.2) * (i % 3 === 0 ? 0.6 : 1)]);
  return [ink(pts, { width: 2.4, color: INK, wobble: 0.6 })];
}

function star(cx: number, cy: number, r: number): Node {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return ink(pts, { width: 2.4, color: INK, closed: true, wobble: 0.5 });
}

export function passwordListArt(): string {
  // [y, width, crossed out]
  const rows: Array<[number, number, boolean]> = [
    [60, 62, true], [84, 48, true], [108, 70, false], [132, 54, true], [156, 66, true],
    [180, 44, false], [204, 58, true], [228, 50, false],
  ];
  const lines: Node[] = [];
  for (const [y, w, crossed] of rows) {
    const x = 28 + (y % 3) * 3;
    lines.push(...word(x, y, w));
    if (crossed) lines.push(ink([[x - 5, y + 1], [x + w * 0.5, y - 3], [x + w + 5, y + 2]], { width: 3.4, color: STRIKE, wobble: 0.8 }));
  }
  return svg({ w: 120, h: 260, name: 'hogwarts-password-list' }, [
    // the strip, with ragged ends
    piece(curve([[14, 6], [60, 2], [108, 8], [104, 70], [110, 140], [106, 200], [108, 252], [62, 258], [12, 250], [16, 190], [10, 120], [16, 60]], 2), '#e0c78e', { rough: 1.3 }),
    piece(rect(22, 14, 78, 232, 6), '#ecd9a6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.65 }),
    // crumples: a few pale and dark creases across it
    piece(poly([[14, 96], [108, 80], [108, 90], [14, 106]]), '#cdb078', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(poly([[12, 168], [108, 182], [108, 190], [12, 176]]), '#f3e4b8', { edge: 'clean', shadow: false, opacity: 0.55 }),
    ink([[16, 98], [60, 92], [106, 84]], { width: 1.6, color: '#a88a52', opacity: 0.6 }),
    ink([[14, 172], [60, 180], [106, 186]], { width: 1.6, color: '#a88a52', opacity: 0.55 }),
    ink([[40, 8], [52, 70], [44, 130]], { width: 1.4, color: '#a88a52', opacity: 0.4 }),
    // the little drawn star at the top, and a smaller one at the foot
    star(60, 32, 11),
    ...lines,
    star(60, 238, 8),
    // loop scribbled round one of the good words
    ink([[22, 116], [56, 102], [92, 112], [90, 126], [50, 128], [20, 120]], { width: 2, color: STRIKE, opacity: 0.8, wobble: 0.8 }),
    // a curled bottom corner
    piece(poly([[80, 258], [108, 252], [106, 232], [96, 244]]), '#cdb078', { edge: 'cut', fibre: false }),
    piece(circle(100, 250, 3), '#e8d4a0', { edge: 'clean', shadow: false, opacity: 0.5 }),
  ]);
}
