/**
 * Props for Nick's Ghost Party: the gong, the saw band and the rotten feast.
 * All torn paper, in the cold blues and greys of the dungeon hall.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const BRASS = '#c9a24a';
const BRASS_DARK = '#8d6b25';
const BRASS_LIGHT = '#e8cd7c';
const DARK_WOOD = '#3b2a22';
const DARK_WOOD_LIGHT = '#54392c';

/** A big round brass gong on a dark wooden frame, 200 × 240. `disc` swings from the top. */
export function gong(): string {
  const cx = 100;
  const cy = 142;
  const R = 74;
  return svg({ w: 200, h: 240, name: 'hogwarts-gong', boil: false, label: 'a big brass gong' }, [
    // feet and legs
    piece(rect(0, 226, 52, 14, 4), DARK_WOOD),
    piece(rect(148, 226, 52, 14, 4), DARK_WOOD),
    piece(poly([[12, 232], [22, 20], [42, 20], [38, 232]]), DARK_WOOD, { rough: 0.7 }),
    piece(poly([[162, 232], [158, 20], [178, 20], [188, 232]]), DARK_WOOD, { rough: 0.7 }),
    piece(rect(26, 30, 5, 190, 1), DARK_WOOD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.7 }),
    // the top bar, with a knob at each end
    piece(rect(4, 12, 192, 28, 5), DARK_WOOD),
    piece(rect(10, 16, 180, 6, 2), DARK_WOOD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.8 }),
    piece(circle(8, 26, 10), BRASS_DARK, { edge: 'cut' }),
    piece(circle(192, 26, 10), BRASS_DARK, { edge: 'cut' }),
    // the gong itself, hanging from the middle of the bar
    group({ part: 'disc', origin: [cx, 40] }, [
      ink([[cx, 38], [cx - 34, cy - R + 18]], { width: 3, color: '#5b4632', wobble: 0.3 }),
      ink([[cx, 38], [cx + 34, cy - R + 18]], { width: 3, color: '#5b4632', wobble: 0.3 }),
      piece(circle(cx, 40, 6), BRASS_DARK, { edge: 'cut', fibre: false }),
      piece(circle(cx, cy, R + 7), BRASS_DARK, { edge: 'cut' }),
      piece(circle(cx, cy, R), BRASS, { edge: 'cut' }),
      ink(curve([[cx - 56, cy], [cx, cy - 56], [cx + 56, cy], [cx, cy + 56]], 3), { width: 3, color: BRASS_DARK, closed: true, opacity: 0.6, wobble: 0.3 }),
      ink(curve([[cx - 38, cy], [cx, cy - 38], [cx + 38, cy], [cx, cy + 38]], 3), { width: 2.5, color: BRASS_DARK, closed: true, opacity: 0.5, wobble: 0.3 }),
      piece(circle(cx, cy, 20), BRASS_LIGHT, { edge: 'cut', fibre: false }),
      piece(circle(cx, cy, 11), BRASS, { edge: 'cut', fibre: false, shadow: false }),
      // a highlight sweeping across the upper left
      ink([[cx - 62, cy - 20], [cx - 48, cy - 44], [cx - 24, cy - 62]], { width: 5, color: '#fff3c4', opacity: 0.7, wobble: 0.3 }),
      ink([[cx - 4, cy + 66], [cx + 30, cy + 58], [cx + 54, cy + 38]], { width: 3, color: '#6b4f18', opacity: 0.5, wobble: 0.3 }),
    ]),
    // the padded beater, leaning on the right leg
    piece(poly([[184, 236], [190, 236], [180, 156], [176, 158]]), '#7a5a3c', { edge: 'cut', fibre: false }),
    piece(circle(178, 148, 13), '#8d9bc4', { edge: 'cut' }),
    ink([[170, 144], [184, 152]], { width: 2, color: '#5a668c', wobble: 0.3 }),
    ink([[172, 154], [186, 145]], { width: 2, color: '#5a668c', wobble: 0.3 }),
  ]);
}

const GHOST = '#b9d7f4';
const GHOST_DARK = '#7ea6d4';
const GHOST_LINE = '#4d6fa3';
const SAW = '#c8d4e2';

/** One see-through ghost musician with a musical saw. `dir` is the saw side. */
function musician(cx: number, kind: 'tophat' | 'ruff' | 'whiskers'): Node[] {
  const out: Node[] = [];
  const hy = 66;
  // The body is a long, wavy-hemmed sheet of see-through ghost.
  const hem: Pt[] = [];
  for (let i = 0; i <= 6; i++) hem.push([cx + 46 - i * 15.3, 206 + (i % 2 ? 12 : -4)]);
  out.push(
    piece(curve([[cx - 28, 96], [cx - 40, 130], [cx - 46, 190], ...hem.slice(0, 7).reverse(), [cx + 46, 190], [cx + 40, 130], [cx + 28, 96], [cx, 88]], 2), GHOST, { shadow: false, opacity: 0.78 }),
    piece(curve([[cx - 28, 104], [cx - 36, 140], [cx - 30, 188], [cx - 10, 150]], 2), GHOST_DARK, { edge: 'clean', shadow: false, opacity: 0.25 }),
    // head
    piece(ellipse(cx, hy, 25, 29), GHOST, { shadow: false, opacity: 0.85 }),
    // cheerful face
    dot(cx - 9, hy - 3, 3.2, '#2b3a5c'),
    dot(cx + 9, hy - 3, 3.2, '#2b3a5c'),
    ink([[cx - 9, hy + 12], [cx, hy + 17], [cx + 9, hy + 12]], { width: 2.4, color: GHOST_LINE }),
    piece(ellipse(cx - 17, hy + 8, 5, 3.5), '#e6a9c8', { edge: 'clean', shadow: false, opacity: 0.45 }),
    piece(ellipse(cx + 17, hy + 8, 5, 3.5), '#e6a9c8', { edge: 'clean', shadow: false, opacity: 0.45 }),
  );
  if (kind === 'tophat') {
    out.push(
      // a tall hat, a waistcoat and a bow tie
      piece(poly([[cx - 22, 120], [cx - 12, 150], [cx, 190], [cx + 12, 150], [cx + 22, 120]]), '#6f8fc4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
      piece(poly([[cx - 10, 100], [cx, 106], [cx + 10, 100], [cx + 10, 112], [cx, 108], [cx - 10, 112]]), '#3f5a8c', { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(cx - 36, 36, 72, 8, 3), '#1d2740', { edge: 'cut', fibre: false }),
      piece(rect(cx - 20, 2, 40, 38, 3), '#1d2740', { edge: 'cut' }),
      piece(rect(cx - 20, 27, 40, 7, 1), '#6f8fc4', { edge: 'clean', shadow: false, opacity: 0.9 }),
      ink([[cx - 14, hy - 12], [cx - 4, hy - 14]], { width: 2.5, color: GHOST_LINE }),
      ink([[cx + 14, hy - 12], [cx + 4, hy - 14]], { width: 2.5, color: GHOST_LINE }),
    );
  } else if (kind === 'ruff') {
    out.push(
      // a stiff ruff, a bonnet and a long dress front
      piece(poly([[cx - 36, 100], [cx - 26, 88], [cx - 14, 100], [cx, 86], [cx + 14, 100], [cx + 26, 88], [cx + 36, 100], [cx + 22, 114], [cx - 22, 114]]), '#eef6ff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 }),
      piece(curve([[cx - 28, hy - 8], [cx - 26, 30], [cx, 22], [cx + 26, 30], [cx + 28, hy - 8], [cx, hy - 24]], 2), '#8aa7d6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
      piece(poly([[cx - 28, 120], [cx, 134], [cx + 28, 120], [cx + 22, 196], [cx - 22, 196]]), '#6f8fc4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
      dot(cx + 22, 28, 4, '#e6a9c8', 0.9),
    );
  } else {
    out.push(
      // a big curly moustache, a flat cap and a striped waistcoat
      ink([[cx - 4, hy + 8], [cx - 18, hy + 6], [cx - 26, hy + 12], [cx - 22, hy + 18]], { width: 3.5, color: '#eaf3ff' }),
      ink([[cx + 4, hy + 8], [cx + 18, hy + 6], [cx + 26, hy + 12], [cx + 22, hy + 18]], { width: 3.5, color: '#eaf3ff' }),
      piece(curve([[cx - 28, hy - 14], [cx - 20, 34], [cx + 12, 30], [cx + 30, hy - 14], [cx + 38, hy - 12], [cx, hy - 20]], 2), '#4a5f8c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 }),
      piece(poly([[cx - 24, 108], [cx, 116], [cx + 24, 108], [cx + 22, 168], [cx - 22, 168]]), '#8aa7d6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
      ...[0, 1, 2, 3].map((i) => ink([[cx - 20, 122 + i * 12], [cx + 20, 122 + i * 12]], { width: 2, color: '#4a5f8c', opacity: 0.7 })),
      dot(cx, 126, 2.5, '#4a5f8c'),
      dot(cx, 150, 2.5, '#4a5f8c'),
    );
  }
  // The musical saw: a long flexed blade held upright by its handle, with teeth along the edge.
  const sx = cx + 34;
  const blade: Pt[] = [[sx, 196], [sx + 6, 164], [sx - 2, 124], [sx + 6, 84]];
  out.push(
    piece(band(blade, 20), SAW, { edge: 'cut', fibre: false, shadow: false, opacity: 0.95 }),
    ink([[sx + 1, 190], [sx + 7, 164], [sx - 1, 124], [sx + 6, 88]], { width: 2, color: '#8296b4', opacity: 0.7, wobble: 0.3 }),
  );
  for (let i = 0; i < 8; i++) {
    const y = 92 + i * 12;
    const wob = Math.sin(i * 0.9) * 4;
    out.push(piece(poly([[sx + 12 + wob, y], [sx + 19 + wob, y + 6], [sx + 12 + wob, y + 12]]), SAW, { edge: 'clean', fibre: false, shadow: false, opacity: 0.95 }));
  }
  out.push(
    piece(rect(sx - 8, 190, 16, 20, 4), '#8a6a4a', { edge: 'cut', fibre: false, shadow: false }),
    // hands: one on the saw handle, one reaching up to the bow
    ink([[cx + 22, 112], [cx + 28, 160], [sx - 2, 196]], { width: 11, color: GHOST, opacity: 0.85, wobble: 0.3 }),
    ink([[cx - 24, 112], [cx - 30, 150], [cx - 10, 122]], { width: 11, color: GHOST, opacity: 0.85, wobble: 0.3 }),
  );
  return out;
}

/** A bow for each musician: a thin stick with a pale strip of hair, drawn across the saw. */
function bow(cx: number): Node[] {
  const x0 = cx - 12;
  const y0 = 122;
  const x1 = cx + 56;
  const y1 = 106;
  return [
    ink([[x0, y0], [x1, y1]], { width: 3.5, color: '#5b4632', wobble: 0.2 }),
    ink([[x0 + 6, y0 + 3], [x1 - 4, y1 + 3]], { width: 1.8, color: '#f3efe2', wobble: 0.2 }),
    piece(circle(x0, y0, 5), '#33324a', { edge: 'cut', fibre: false, shadow: false }),
  ];
}

/** A ghost band: three see-through musicians playing musical saws, 340 × 240. `bows` wiggle. */
export function sawBand(): string {
  const xs = [62, 172, 280];
  return svg({ w: 340, h: 240, name: 'hogwarts-sawband', boil: false, label: 'three ghosts playing musical saws' }, [
    ...musician(xs[0], 'tophat'),
    ...musician(xs[1], 'ruff'),
    ...musician(xs[2], 'whiskers'),
    group({ part: 'bows', origin: [170, 114] }, xs.flatMap(bow)),
  ]);
}

const GREY_DARK = '#4b5058';
const GREY = '#7d838c';
const GREY_LIGHT = '#aeb4bc';
const GREEN = '#6f8a4a';
const GREEN_DARK = '#4a6030';
const GREEN_LIGHT = '#9bb06a';

/** A stink line: a wavy rising squiggle. */
function stink(x: number, y: number): Node {
  return ink([[x, y], [x - 5, y - 9], [x + 5, y - 18], [x - 4, y - 27], [x + 3, y - 34]], { width: 2.2, color: GREEN_LIGHT, opacity: 0.8, wobble: 0.2 });
}

/** A long table with a black cloth and a very yucky ghost feast, 600 × 200. */
export function ghostFeast(): string {
  const top = 130;
  const bottom = 200;
  return svg({ w: 600, h: 200, name: 'hogwarts-ghostfeast', boil: false, label: 'a table of rotten ghost food' }, [
    // the black cloth hanging to the floor, with folds
    piece(rect(6, top, 588, bottom - top), '#17161f', { rough: 0.5 }),
    piece(rect(0, top - 4, 600, 14, 3), '#2a2937', { edge: 'cut', fibre: false }),
    ...[60, 130, 200, 270, 340, 410, 480, 550].map((x, i) =>
      piece(rect(x, top + 10, 14, bottom - top - 10, 3), '#272636', { edge: 'clean', shadow: false, opacity: i % 2 ? 0.7 : 0.4 }),
    ),
    piece(rect(6, bottom - 8, 588, 8, 1), '#0e0d14', { edge: 'clean', shadow: false, opacity: 0.6 }),

    // the big green fish on a pewter plate
    piece(ellipse(88, top - 4, 84, 10), '#8d93a0', { edge: 'cut' }),
    piece(poly([[148, top - 26], [182, top - 52], [178, top - 30], [184, top - 8], [150, top - 16]]), GREEN_DARK, { edge: 'cut' }),
    piece(curve([[12, top - 24], [40, top - 52], [96, top - 58], [148, top - 36], [150, top - 22], [96, top - 10], [40, top - 10]], 2), GREEN),
    piece(curve([[30, top - 22], [70, top - 12], [120, top - 20], [130, top - 26], [70, top - 18]], 2), GREEN_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...[0, 1, 2, 3].map((i) => piece(circle(60 + i * 18, top - 34 + (i % 2) * 6, 7), GREEN_DARK, { edge: 'clean', shadow: false, opacity: 0.45 })),
    piece(circle(34, top - 38, 9), '#e8efd0', { edge: 'cut', fibre: false, shadow: false }),
    ink([[29, top - 43], [39, top - 33]], { width: 2.2, color: '#2b3a22' }),
    ink([[39, top - 43], [29, top - 33]], { width: 2.2, color: '#2b3a22' }),
    ink([[14, top - 30], [24, top - 24], [30, top - 28]], { width: 2.2, color: GREEN_DARK }),
    stink(70, top - 62),
    stink(100, top - 66),

    // a grey mouldy cheese wedge, spotted and with holes
    piece(poly([[196, top - 2], [270, top - 2], [270, top - 36], [214, top - 52]]), GREY, { rough: 0.7 }),
    piece(poly([[196, top - 2], [270, top - 2], [270, top - 14], [196, top - 14]]), GREY_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    piece(circle(232, top - 24, 7), GREY_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(252, top - 12, 5), GREY_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(258, top - 32, 4), GREY_DARK, { edge: 'cut', fibre: false, shadow: false }),
    ...[[222, top - 40, 5], [244, top - 38, 4], [214, top - 14, 4], [238, top - 8, 3.5], [262, top - 24, 4]].map(([x, y, rr]) =>
      piece(circle(x, y, rr), GREEN_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    ),
    stink(240, top - 58),

    // the lumpy grey cake with its "500"
    piece(curve([[292, top - 2], [290, top - 36], [304, top - 48], [396, top - 48], [410, top - 36], [408, top - 2]], 2), GREY),
    piece(curve([[304, top - 40], [310, top - 78], [352, top - 94], [394, top - 78], [398, top - 40]], 2), GREY_DARK),
    ...[[300, top - 46], [322, top - 52], [352, top - 50], [380, top - 52], [402, top - 44]].map(([x, y]) => piece(circle(x, y, 11), GREY_LIGHT, { edge: 'torn', fibre: false, shadow: false })),
    ...[[310, top - 20], [336, top - 30], [372, top - 18], [396, top - 26]].map(([x, y]) => piece(ellipse(x, y, 8, 5), GREEN_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 })),
    // 5
    ink([[330, top - 82], [322, top - 82], [321, top - 72], [328, top - 74], [333, top - 68], [330, top - 61], [321, top - 60]], { width: 4, color: GREY_LIGHT, wobble: 0.2 }),
    // 0
    ink(ellipse(344, top - 71, 6, 11), { width: 4, color: GREY_LIGHT, closed: true, wobble: 0.2 }),
    // 0
    ink(ellipse(364, top - 71, 6, 11), { width: 4, color: GREY_LIGHT, closed: true, wobble: 0.2 }),
    // one grey, sad candle on top
    piece(rect(349, top - 112, 6, 22, 1), GREY_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[352, top - 124], [356, top - 116], [352, top - 112], [348, top - 116]], 2), GREEN_LIGHT, { edge: 'clean', fibre: false, shadow: false }),

    // a tray of burnt black sausages
    piece(rect(420, top - 10, 92, 10, 3), '#8d93a0', { edge: 'cut' }),
    ...[0, 1, 2, 3].map((i) => piece(curve([[426 + i * 20, top - 12], [432 + i * 20, top - 40 - (i % 2) * 6], [446 + i * 20, top - 40 - (i % 2) * 6], [446 + i * 20, top - 12]], 2), '#14131a', { edge: 'cut' })),
    ...[0, 1, 2, 3].map((i) => ink([[432 + i * 20, top - 30 - (i % 2) * 6], [438 + i * 20, top - 34 - (i % 2) * 6]], { width: 2.5, color: '#3d3c48', opacity: 0.8 })),
    ...[0, 1, 2].map((i) => piece(circle(436 + i * 22, top - 14, 5), '#3d3c48', { edge: 'clean', shadow: false, opacity: 0.6 })),
    stink(468, top - 50),

    // a silver dish with a cloche over it
    piece(ellipse(552, top - 2, 44, 8), '#c4cad6', { edge: 'cut' }),
    piece(curve([[512, top - 6], [516, top - 44], [552, top - 66], [588, top - 44], [592, top - 6]], 2), '#b4bccb'),
    piece(curve([[522, top - 22], [526, top - 44], [546, top - 58], [540, top - 36]], 2), '#eef2f8', { edge: 'clean', shadow: false, opacity: 0.7 }),
    piece(circle(552, top - 70, 7), '#98a1b3', { edge: 'cut', fibre: false }),
    // something green and wobbly peeking out underneath
    piece(curve([[540, top - 4], [544, top - 12], [556, top - 12], [562, top - 4]], 2), GREEN, { edge: 'cut', fibre: false, shadow: false }),
    stink(556, top - 80),
    // the black cloth's silvery trim
    ink([[8, top + 4], [592, top + 4]], { width: 2, color: C.stone, opacity: 0.5, wobble: 0.3 }),
  ]);
}
