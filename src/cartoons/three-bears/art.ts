/**
 * One-off art for "Teddy and the Three Bears", in the bears' watercolour
 * and ink (src/art/watercolour.ts): Daddy's newspaper, Teddy's scarf, a bowl
 * scraped clean, a dollop of honey, and the story-cloud's table and three
 * chairs (one of which breaks). Nothing here is wanted by a second episode
 * yet; the chairs would move into the world if the story is ever told again.
 */
import { band, cached, curve, dot, ellipse, rect, svg, type Node, type Pt } from '../../kit';
import { blot, clipped, deeper, hatch, pen, wash } from '../../art/watercolour';

/** Points from a flat list of numbers: P(x0, y0, x1, y1 …). */
const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

const WOOD = '#c99a5e';
const DARKWOOD = '#9b6a3c';
const BLUE = '#6f9bc9';
const HONEY = '#e2a93a';

/** Daddy's newspaper, held open: two grey-ruled pages with a fold down the middle (200 × 140). */
export const newspaper = cached(() => {
  const lines: Node[] = [];
  for (const x0 of [16, 106]) {
    // a headline, then rows of print
    lines.push(wash(rect(x0, 16, 74, 10, 2), '#8a8580', { line: false, shade: false, bloom: false, opacity: 0.8 }));
    for (let y = 36; y < 124; y += 9) lines.push(pen(P(x0, y, x0 + 74, y + 0.5), { width: 1.2, color: '#9a948c', opacity: 0.7, breaks: 0.6 }));
  }
  return svg({ w: 200, h: 140, name: 'three-bears-newspaper', label: 'a newspaper' }, [
    wash(P(4, 6, 98, 2, 196, 6, 192, 134, 100, 138, 8, 134), '#f4efe2', { shade: '#d9d0bd', depth: 0.25, lineWidth: 2.2 }),
    ...lines,
    // a little picture box on the right-hand page
    wash(rect(150, 40, 30, 26, 2), '#c7d3dc', { lineWidth: 1.2, shade: false, bloom: false }),
    pen(P(100, 4, 99, 70, 100, 136), { width: 1.6, opacity: 0.7 }),
  ]);
});

/** Teddy's scarf: a red-and-green striped scarf round the neck, one end hanging down with tassels (150 × 110). */
export const scarf = cached(() => {
  const wrap: Pt[] = curve(P(8, 28, 40, 40, 75, 44, 110, 40, 142, 28, 146, 42, 112, 58, 75, 62, 38, 58, 4, 42), 2);
  const tail: Pt[] = P(92, 46, 116, 50, 112, 96, 88, 94);
  return svg({ w: 150, h: 110, name: 'three-bears-scarf', label: 'a striped scarf' }, [
    wash(tail, '#c8433a', { shade: deeper('#c8433a', 0.3), depth: 0.35, lineWidth: 2 }),
    clipped(tail, [
      wash(rect(80, 62, 50, 7), '#4f8a4a', { line: false, shade: false, bloom: false }),
      wash(rect(80, 78, 50, 7), '#4f8a4a', { line: false, shade: false, bloom: false }),
    ]),
    ...[92, 99, 106, 112].map((x) => pen(P(x, 95, x - 1, 106), { width: 1.8, color: '#a8342c' })),
    wash(wrap, '#c8433a', { shade: deeper('#c8433a', 0.3), depth: 0.3, lineWidth: 2.2 }),
    clipped(wrap, [
      ...[30, 62, 94, 124].map((x) => wash(rect(x, 20, 9, 50), '#4f8a4a', { line: false, shade: false, bloom: false })),
    ]),
  ]);
});

/** A porridge bowl scraped clean (the world's `porridge-bowl`, 140 × 90, with nothing left in it). */
export const emptyBowl = cached(() => {
  const body = curve(P(8, 38, 14, 60, 38, 80, 70, 86, 102, 80, 126, 60, 132, 38), 3);
  return svg({ w: 140, h: 90, name: 'three-bears-empty-bowl', label: 'an empty bowl' }, [
    wash(body, '#fbf8f0', { shade: '#cfd9e6', light: -130, depth: 0.3, hatch: 6 }),
    clipped(body, [
      wash(rect(0, 50, 140, 7), BLUE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
      wash(rect(0, 64, 140, 5), BLUE, { line: false, shade: false, bloom: false, wobble: 0.6 }),
    ]),
    wash(ellipse(70, 38, 63, 15), '#fbf8f0', { shade: false, bloom: false, lineWidth: 2.2 }),
    // the inside of the bowl, white and clean, with one little smear
    wash(ellipse(70, 40, 54, 11), '#eef2f6', { shade: '#cfd9e6', depth: 0.4, line: false }),
    pen(P(50, 42, 62, 44, 72, 43), { width: 1.4, color: '#d8bd84', opacity: 0.7 }),
    // the spoon, lying in the empty bowl
    wash(band(P(76, 40, 100, 26, 124, 12), 7), WOOD, { shade: deeper(WOOD, 0.3), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(ellipse(72, 42, 11, 6, -30), WOOD, { shade: deeper(WOOD, 0.3), lineWidth: 2, bloom: false }),
  ]);
});

/** A golden dollop of honey to sit in a bowl (70 × 34). */
export const honeyDollop = cached(() =>
  svg({ w: 70, h: 34, name: 'three-bears-honey', label: 'a spoonful of honey' }, [
    wash(curve(P(6, 26, 14, 12, 30, 6, 46, 8, 62, 18, 64, 28, 36, 32), 2), HONEY, { shade: deeper(HONEY, 0.3), depth: 0.35, lineWidth: 1.8 }),
    blot(ellipse(26, 14, 8, 3, -10), '#ffffff', 0.6),
  ]),
);

/** The story's table: a long table top with a green-check cloth, for the three bowls in the cloud (360 × 50). */
export const storyTable = cached(() => {
  const top: Pt[] = P(10, 10, 350, 10, 356, 44, 4, 44);
  return svg({ w: 360, h: 50, name: 'three-bears-story-table', label: 'a table' }, [
    wash(top, '#f6f1e6', { shade: '#dde3cf', depth: 0.3, lineWidth: 2 }),
    clipped(top, [
      ...[40, 90, 140, 190, 240, 290, 340].map((x) => wash(rect(x, 0, 6, 50), '#9cc58f', { line: false, shade: false, bloom: false, opacity: 0.7 })),
      wash(rect(0, 26, 360, 5), '#9cc58f', { line: false, shade: false, bloom: false, opacity: 0.7 }),
    ]),
  ]);
});

/** Daddy Bear's chair in the story: a tall, hard wooden chair (100 × 150). */
export const bigChair = cached(() =>
  svg({ w: 100, h: 150, name: 'three-bears-big-chair', label: 'a big wooden chair' }, [
    wash(rect(14, 4, 72, 14, 4), DARKWOOD, { shade: deeper(DARKWOOD), depth: 0.4, lineWidth: 2, bloom: false }),
    ...[22, 40, 58, 76].map((x) => wash(rect(x - 3, 16, 7, 66), DARKWOOD, { shade: false, lineWidth: 1.6, bloom: false })),
    wash(rect(10, 4, 10, 144, 3), DARKWOOD, { shade: deeper(DARKWOOD), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(rect(80, 4, 10, 144, 3), DARKWOOD, { shade: deeper(DARKWOOD), depth: 0.4, lineWidth: 2, bloom: false }),
    wash(P(4, 82, 96, 82, 98, 96, 2, 96), WOOD, { shade: deeper(WOOD), depth: 0.4, lineWidth: 2.2 }),
    wash(rect(16, 96, 8, 52, 2), DARKWOOD, { shade: false, lineWidth: 1.6, bloom: false }),
    wash(rect(76, 96, 8, 52, 2), DARKWOOD, { shade: false, lineWidth: 1.6, bloom: false }),
  ]),
);

/** Mummy Bear's chair in the story: a squashy pink armchair, much too soft (120 × 110). */
export const softChair = cached(() => {
  const PINK = '#e7a3a8';
  return svg({ w: 120, h: 110, name: 'three-bears-soft-chair', label: 'a soft pink chair' }, [
    wash(curve(P(18, 60, 16, 14, 60, 4, 104, 14, 102, 60), 2), PINK, { shade: deeper(PINK, 0.25), depth: 0.3, lineWidth: 2.2 }),
    wash(curve(P(4, 52, 22, 46, 26, 96, 6, 98), 2), PINK, { shade: deeper(PINK, 0.25), depth: 0.4, lineWidth: 2 }),
    wash(curve(P(116, 52, 98, 46, 94, 96, 114, 98), 2), PINK, { shade: deeper(PINK, 0.25), depth: 0.4, lineWidth: 2 }),
    wash(curve(P(22, 64, 60, 56, 98, 64, 98, 90, 60, 94, 22, 90), 2), '#f2c3c4', { shade: deeper(PINK, 0.2), depth: 0.3, lineWidth: 2 }),
    ...[30, 60, 90].map((x) => dot(x, 32, 2.4, deeper(PINK, 0.5), 0.7)),
    wash(rect(16, 96, 8, 12, 2), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    wash(rect(96, 96, 8, 12, 2), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
  ]);
});

/** Baby Bear's chair in the story: a little wooden chair, just right (70 × 90). */
export const littleChair = cached(() =>
  svg({ w: 70, h: 90, name: 'three-bears-little-chair', label: 'a little wooden chair' }, [
    wash(rect(10, 4, 50, 34, 6), WOOD, { shade: deeper(WOOD), depth: 0.35, lineWidth: 2, hatch: 5 }),
    wash(P(4, 46, 66, 46, 66, 56, 4, 56), WOOD, { shade: deeper(WOOD), depth: 0.4, lineWidth: 2 }),
    wash(rect(10, 38, 6, 10, 2), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    wash(rect(54, 38, 6, 10, 2), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    wash(rect(8, 56, 7, 32, 2), DARKWOOD, { shade: false, lineWidth: 1.6, bloom: false }),
    wash(rect(55, 56, 7, 32, 2), DARKWOOD, { shade: false, lineWidth: 1.6, bloom: false }),
  ]),
);

/** The little chair after CRACK: its seat flat on the floor and its legs and back in bits (110 × 60). */
export const brokenChair = cached(() =>
  svg({ w: 110, h: 60, name: 'three-bears-broken-chair', label: 'a broken little chair' }, [
    wash(rect(4, 30, 46, 24, 5).map(([x, y]) => [x, y] as Pt), WOOD, { shade: deeper(WOOD), depth: 0.35, lineWidth: 2, hatch: 5 }),
    wash(P(30, 44, 92, 40, 94, 50, 32, 54), WOOD, { shade: deeper(WOOD), depth: 0.4, lineWidth: 2 }),
    wash(band(P(60, 30, 76, 18), 6), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    wash(band(P(84, 36, 104, 30), 6), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    wash(band(P(52, 14, 58, 4), 6), DARKWOOD, { shade: false, lineWidth: 1.4, bloom: false }),
    // little crack lines in the air
    hatch(rect(70, 2, 26, 12), { gap: 6, angle: 60 }),
  ]),
);
