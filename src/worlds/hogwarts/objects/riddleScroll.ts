/**
 * The riddle scroll (made for "The Riddle of the Bottles", book 1; original
 * paper art).
 *
 * riddleScroll: an unrolled parchment scroll, 200 × 260. A rolled-up tube
 * curls along the top (y 10 to 44) and the bottom (y 214 to 248), each with a
 * round spiral end showing at x 14 and x 186. Between them the sheet (x 32 to
 * 168, y 36 to 226) is covered in neat wavy ink lines (two verses of short
 * lines with a gap at y 121; squiggles, not readable), and a tiny doodle of a
 * bottle sits at the bottom (about x 100, y 190 to 206). Nothing moves.
 */
import { circle, curve, ellipse, ink, piece, rect, svg, type Node, type Pt } from '../../../art/paper';

const INK = '#4a3320';
const PAPER = '#ead7a6';
const ROLL = '#d3b57a';

/** A rolled end: tube body and a round spiral cap. */
function roll(y: number): Node[] {
  return [
    piece(rect(20, y, 160, 34, 16), ROLL, { rough: 0.7 }),
    ink([[34, y + 8], [166, y + 8]], { width: 2, color: '#b8975a', opacity: 0.6, wobble: 0.5 }),
    ink([[34, y + 26], [166, y + 26]], { width: 2, color: '#b8975a', opacity: 0.5, wobble: 0.5 }),
    piece(circle(20, y + 17, 17), '#c4a367', { edge: 'cut', fibre: false }),
    piece(circle(180, y + 17, 17), '#c4a367', { edge: 'cut', fibre: false }),
    ...[20, 180].map((x) => ink(Array.from({ length: 12 }, (_, i) => [x + Math.cos(i * 0.9) * (12 - i), y + 17 + Math.sin(i * 0.9) * (12 - i)] as Pt), { width: 1.8, color: INK, opacity: 0.6, wobble: 0.2 })),
  ];
}

/** One line of verse: a run of small waves. */
function verse(x0: number, x1: number, y: number, seed: number): Node {
  const pts: Pt[] = [];
  const n = Math.round((x1 - x0) / 5);
  for (let i = 0; i <= n; i++) {
    const wob = Math.sin(i * 1.7 + seed) * 2.6 + Math.sin(i * 0.6 + seed * 2) * 1.2;
    pts.push([x0 + (i * (x1 - x0)) / n, y + wob]);
  }
  return ink(pts, { width: 2, color: INK, wobble: 0.35 });
}

export function riddleScrollArt(): string {
  const lines: Node[] = [];
  const ends = [118, 134, 128, 140, 110, 124, 136, 120, 132, 116];
  [0, 1, 2, 3, 4].forEach((i) => lines.push(verse(48, 48 + ends[i] * 0.88, 64 + i * 11, i)));
  [5, 6, 7, 8, 9].forEach((i) => lines.push(verse(48, 48 + ends[i] * 0.88, 134 + (i - 5) * 11, i)));
  return svg({ w: 200, h: 260, name: 'hogwarts-riddle-scroll', boil: false }, [
    piece(curve([[32, 40], [30, 90], [34, 140], [31, 190], [33, 226], [100, 230], [168, 226], [170, 190], [166, 140], [169, 90], [167, 40], [100, 36]], 2), PAPER, { rough: 0.8 }),
    piece(ellipse(100, 130, 54, 80), '#f4e7bf', { edge: 'clean', shadow: false, opacity: 0.55 }),
    // shadows where the sheet curls into the rolls
    piece(rect(32, 44, 136, 8, 0), '#bfa066', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(rect(32, 206, 136, 8, 0), '#bfa066', { edge: 'clean', shadow: false, opacity: 0.35 }),
    // a small flourish above the first verse
    ink([[78, 56], [90, 52], [100, 56], [110, 52], [122, 56]], { width: 2, color: INK, opacity: 0.8, wobble: 0.3 }),
    ...lines,
    // the little bottle doodle
    ink([[94, 208], [92, 200], [96, 196], [96, 190], [104, 190], [104, 196], [108, 200], [106, 208]], { width: 2.2, color: INK, wobble: 0.3 }),
    ink([[93, 202], [107, 202]], { width: 1.6, color: INK, opacity: 0.7, wobble: 0.2 }),
    ...roll(10),
    ...roll(214),
  ]);
}
