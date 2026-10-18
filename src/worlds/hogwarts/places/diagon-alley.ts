/**
 * Diagon Alley on a sunny summer morning (made for "The Book That Bites").
 *
 * The winding wizard shopping street: crooked, leaning, colourful old
 * shopfronts squashed together on both sides and across the back, with
 * bow windows, striped awnings, chimneys and picture signs (a cauldron, a
 * book, an owl, an ice-cream cone, a broom; no words anywhere). A blue
 * sky strip runs along the top. Cobbles in front.
 *
 * Layout (stage coordinates):
 *   Ground line     y 670 (cobbles from y 640 down). Bottom band y 690 to 820
 *                   is plain, calm cobble.
 *   LEFT            Florean Fortescue's ice-cream parlour, x 40 to 380:
 *                   a cream-and-mint building with a big bow window
 *                   (x 70 to 350, y 330 to 560), a pink-and-white striped
 *                   awning (y 268 to 340), an ice-cream-cone sign hanging at
 *                   x 322, y 130 to 215. Two little round café tables on the
 *                   cobbles, centres about x 115 and x 300, tops at y 600
 *                   (feet reach y 668).
 *   MIDDLE          x 380 to 820: open cobbles for three actors (feet near
 *                   y 670); far behind them a crooked row of shop fronts
 *                   (y 130 to 560) with a hanging cauldron sign (x 520) and a
 *                   book sign (x 700), and the street curving away between
 *                   them at x 560 to 640.
 *   RIGHT           The sports shop, x 820 to 1120: a tall blue-grey front.
 *                   Its WINDOW is the rectangle x 850 to 1090, y 300 to 560,
 *                   a pale cream, nearly empty inside (only a low shelf at
 *                   the very bottom, y 540 to 560) so a broom prop can stand
 *                   or lie in it. A striped red awning above (y 235 to 300)
 *                   and a broom sign hanging at x 1050, y 130 to 215.
 *   Edges           x 1120 to 1180 an owl-shop sliver with an owl sign
 *                   hanging at x 1150, y 150 to 215; chimneys and a sky strip
 *                   at the top (y 0 to 90).
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const SKY = '#9cc6e4';
const COBBLE = '#a8a095';
const COBBLE_DARK = '#8c857b';
const ROOF = ['#7a4e3a', '#5b6378', '#8a5a3b', '#6b4f6a', '#4f6a60'];

/** A crooked shopfront with a roof, windows and a door; `lean` tilts the top sideways. */
function front(r: () => number, x: number, top: number, w: number, bottom: number, col: string, lean: number): Node[] {
  const roof = ROOF[Math.floor(r() * ROOF.length)];
  const nodes: Node[] = [
    piece(poly([[x, bottom], [x + lean, top + 30], [x + w + lean, top + 30], [x + w, bottom]]), col, { rough: 0.7 }),
    // roof with a chimney
    piece(rect(x + w * 0.62 + lean, top - 24, 22, 40, 2), '#9a5a45', { edge: 'cut' }),
    piece(rect(x + w * 0.62 + lean - 4, top - 30, 30, 10, 2), '#6f4535', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[x + lean - 14, top + 38], [x + lean + w / 2 + 6, top - 18], [x + lean + w + 14, top + 38]]), roof, { rough: 0.8 }),
  ];
  // timber stripe and windows
  nodes.push(piece(rect(x + lean * 0.5 - 2, top + 76, w + 4, 8, 0), C.brownDark, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
  const cols = Math.max(1, Math.floor(w / 62));
  for (let i = 0; i < cols; i++) {
    const wx = x + lean * 0.7 + 14 + (i * (w - 28)) / cols + ((w - 28) / cols - 30) / 2;
    nodes.push(piece(rect(wx - 3, top + 94, 36, 50, 4), C.brownDark, { edge: 'cut', fibre: false }));
    nodes.push(piece(rect(wx, top + 97, 30, 44, 3), r() > 0.5 ? C.candle : '#cfe3ee', { edge: 'cut', fibre: false, shadow: false }));
    nodes.push(ink([[wx + 15, top + 97], [wx + 15, top + 141]], { width: 2, color: C.brownDark }));
  }
  // door
  const dx = x + w * 0.35 + lean * 0.2;
  if (bottom - top > 260) {
    nodes.push(piece(rect(dx, bottom - 96, 40, 96, 4), C.brownDark, { edge: 'cut' }));
    nodes.push(dot(dx + 32, bottom - 46, 3, C.goldLight));
  }
  return nodes;
}

/** A hanging sign: bracket, two cords, and a small painted board with a picture. */
function sign(x: number, y: number, picture: Node[]): Node[] {
  return [
    ink([[x - 40, y - 8], [x + 4, y - 8]], { width: 5, color: C.brownDark }),
    ink([[x - 22, y - 6], [x - 22, y + 10]], { width: 2, color: C.brownDark }),
    ink([[x + 22, y - 6], [x + 22, y + 10]], { width: 2, color: C.brownDark }),
    piece(rect(x - 34, y + 8, 68, 68, 8), '#6f4a2f'),
    piece(rect(x - 28, y + 14, 56, 56, 6), '#f1e4c4', { edge: 'cut', fibre: false, shadow: false }),
    ...picture,
  ];
}

/** A striped awning from (x, y) of width w, drooping to a scalloped edge. */
function awning(x: number, y: number, w: number, h: number, a: string, b: string): Node[] {
  const nodes: Node[] = [piece(poly([[x + 8, y], [x + w - 8, y], [x + w + 14, y + h], [x - 14, y + h]]), a, { edge: 'cut' })];
  const n = Math.round(w / 40);
  const sw = (w + 28) / n;
  for (let i = 0; i < n; i++) {
    const x0 = x - 14 + i * sw;
    if (i % 2 === 1) nodes.push(piece(poly([[x0 + (i % 2 ? 0 : 0) + (8 * i) / n, y], [x0 + sw + (8 * (i + 1)) / n, y], [x0 + sw, y + h], [x0, y + h]]), b, { edge: 'cut', fibre: false, shadow: false }));
    // scallop
    nodes.push(piece(ellipse(x0 + sw / 2, y + h, sw / 2, 9), i % 2 ? b : a, { edge: 'cut', fibre: false, shadow: i === 0 }));
  }
  return nodes;
}

/** A little round café table with a striped cloth. Centre x, top y; feet at y + 68. */
function table(x: number, y: number): Node[] {
  return [
    ink([[x - 24, y + 12], [x - 32, y + 68]], { width: 5, color: '#4a3a30' }),
    ink([[x + 24, y + 12], [x + 32, y + 68]], { width: 5, color: '#4a3a30' }),
    ink([[x, y + 12], [x, y + 66]], { width: 5, color: '#4a3a30' }),
    piece(ellipse(x, y + 12, 52, 12), '#e8a9ad', { edge: 'cut' }),
    piece(ellipse(x, y + 8, 52, 12), '#fbf3e6', { edge: 'cut', fibre: false, shadow: false }),
    // a tiny sundae glass on top
    piece(poly([[x - 8, y - 12], [x + 8, y - 12], [x + 3, y + 4], [x - 3, y + 4]]), '#dcebe9', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }),
    dot(x, y - 16, 7, '#e58aa0'),
    dot(x + 1, y - 26, 3, '#c8392f'),
  ];
}

/** Diagon Alley, bright summer morning. */
export function diagonAlley(): string {
  const r = rng(4417);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 700), SKY, { edge: 'clean', shadow: false })];

  // the sky strip, with soft clouds
  nodes.push(
    piece(ellipse(220, 40, 90, 20), '#f4f0e6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(300, 52, 60, 14), '#f4f0e6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(860, 36, 100, 20), '#f4f0e6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(940, 50, 56, 12), '#f4f0e6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
  );

  // far buildings across the back (a crooked row, paler for distance)
  const back: Array<[number, number, number, number, string]> = [
    [330, 150, 110, 6, '#d8b8a8'], [430, 110, 120, -8, '#b6c6de'], [540, 140, 100, 5, '#e8d48a'],
    [630, 100, 120, -6, '#c9a8d0'], [740, 135, 110, 7, '#a9cfc0'], [840, 120, 100, -5, '#e3b185'],
  ];
  for (const [x, top, w, lean, col] of back) {
    nodes.push(...front(r, x, top, w, 650, col, lean));
    nodes.push(piece(rect(x + lean, top + 100, w, 550, 0), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.22 }));
  }
  // hanging signs on the back row
  // a cauldron
  nodes.push(...sign(520, 196, [
    piece(ellipse(520, 250, 22, 18), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(520, 234, 22, 6), '#6fae6a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(500, 266, 8, 6), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(532, 266, 8, 6), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
  ]));
  // a book
  nodes.push(...sign(700, 176, [
    piece(rect(678, 218, 44, 42, 3), C.red, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(680, 252, 40, 6, 1), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(684, 224, 6, 28, 0), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(706, 238, 7), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
  ]));

  // LEFT: Florean Fortescue's ice-cream parlour
  const fx = 36;
  nodes.push(
    piece(poly([[fx, 680], [fx + 8, 150], [fx + 350, 140], [fx + 344, 680]]), '#f3e6cf', { rough: 0.7 }),
    piece(poly([[fx - 16, 164], [fx + 180, 70], [fx + 366, 154]]), '#4f6a60', { rough: 0.8 }),
    piece(rect(fx + 250, 60, 26, 60, 2), '#9a5a45', { edge: 'cut' }),
    piece(rect(fx + 245, 52, 36, 12, 2), '#6f4535', { edge: 'cut', fibre: false, shadow: false }),
    // mint panels
    piece(rect(fx + 12, 360, 322, 210, 4), '#a9d4c0', { edge: 'cut', fibre: false, shadow: false }),
    // upper windows
    piece(rect(fx + 40, 190, 70, 56, 4), C.brownDark, { edge: 'cut' }),
    piece(rect(fx + 46, 196, 58, 44, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(fx + 230, 190, 70, 56, 4), C.brownDark, { edge: 'cut' }),
    piece(rect(fx + 236, 196, 58, 44, 3), '#cfe3ee', { edge: 'cut', fibre: false, shadow: false }),
  );
  // the bow window
  nodes.push(
    piece(rect(70, 330, 280, 232, 10), '#6f4a2f'),
    piece(rect(84, 344, 252, 204, 6), '#fbeed6', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(84, 344, 252, 204, 6), '#cfe3ee', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    ink([[210, 344], [210, 548]], { width: 7, color: '#6f4a2f' }),
    ink([[84, 440], [336, 440]], { width: 6, color: '#6f4a2f' }),
    piece(rect(60, 556, 300, 16, 3), '#6f4a2f', { edge: 'cut' }),
  );
  // ice-cream pictures in the window: three tubs of scoops
  [[120, '#e58aa0'], [210, '#7b4a33'], [292, '#f7ecc0']].forEach(([x, col], i) => {
    nodes.push(
      piece(poly([[(x as number) - 22, 470], [(x as number) + 22, 470], [(x as number) + 14, 526], [(x as number) - 14, 526]]), '#e8d6b0', { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(x as number, 462, 25), col as string, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle((x as number) + (i % 2 ? 10 : -10), 440, 19), [ '#f7ecc0', '#e58aa0', '#9fd3ae'][i], { edge: 'cut', fibre: false, shadow: false }),
      dot((x as number) + (i % 2 ? 10 : -10), 420, 5, '#c8392f'),
    );
  });
  // awning, pink and white
  nodes.push(...awning(52, 268, 316, 62, '#e8a9ad', '#fbf3e6'));
  // ice-cream cone sign
  nodes.push(...sign(322, 134, [
    piece(poly([[310, 170], [334, 170], [322, 206]]), '#d9a560', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(322, 164, 12), '#e58aa0', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(322, 152, 8), '#f7ecc0', { edge: 'cut', fibre: false, shadow: false }),
  ]));

  // RIGHT: the sports shop
  nodes.push(
    piece(poly([[822, 680], [830, 140], [1124, 150], [1118, 680]]), '#b6c6de', { rough: 0.7 }),
    piece(poly([[808, 160], [980, 66], [1138, 150]]), '#7a4e3a', { rough: 0.8 }),
    piece(rect(870, 62, 26, 60, 2), '#9a5a45', { edge: 'cut' }),
    piece(rect(865, 54, 36, 12, 2), '#6f4535', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(850, 190, 70, 52, 4), C.brownDark, { edge: 'cut' }),
    piece(rect(856, 196, 58, 40, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    // window frame, then clear pale inside
    piece(rect(836, 288, 268, 288, 10), '#4a3a30'),
    piece(rect(850, 300, 240, 260), '#f6ecd0', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(850, 300, 240, 260), '#cfe3ee', { edge: 'cut', fibre: false, shadow: false, opacity: 0.25 }),
    piece(rect(850, 540, 240, 20, 2), '#a06d43', { edge: 'cut', fibre: false, shadow: false }),
    // a glint across the glass
    ink([[870, 330], [930, 300]], { width: 8, color: '#ffffff', opacity: 0.4 }),
    ink([[1040, 540], [1085, 512]], { width: 6, color: '#ffffff', opacity: 0.35 }),
    piece(rect(826, 572, 288, 16, 3), '#4a3a30', { edge: 'cut' }),
    // a little bench of stone below
    piece(rect(842, 588, 256, 92, 3), '#8a93aa', { edge: 'cut', fibre: false, shadow: false }),
  );
  nodes.push(...awning(846, 232, 252, 58, '#c4506a', '#fbf3e6'));
  // a broom sign
  nodes.push(...sign(1050, 130, [
    ink([[1028, 200], [1070, 170]], { width: 4, color: C.brown }),
    piece(poly([[1064, 164], [1084, 172], [1072, 196], [1056, 180]]), '#d9a560', { edge: 'cut', fibre: false, shadow: false }),
  ]));
  // far right sliver: an owl shop
  nodes.push(
    piece(poly([[1114, 680], [1120, 190], [1200, 180], [1200, 680]]), '#d9b87a', { rough: 0.7 }),
    piece(poly([[1108, 200], [1160, 140], [1200, 190]]), '#5b6378', { rough: 0.8 }),
    piece(rect(1134, 380, 60, 70, 4), C.brownDark, { edge: 'cut' }),
    piece(rect(1140, 386, 48, 58, 3), C.candle, { edge: 'cut', fibre: false, shadow: false }),
  );
  nodes.push(...sign(1152, 150, [
    piece(ellipse(1152, 192, 16, 20), '#a67c52', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(1152, 198, 9, 12), '#f1e4c4', { edge: 'cut', fibre: false, shadow: false }),
    dot(1146, 184, 4, '#ffffff'), dot(1158, 184, 4, '#ffffff'), dot(1146, 184, 2, C.ink), dot(1158, 184, 2, C.ink),
    piece(poly([[1150, 188], [1154, 188], [1152, 194]]), C.gold, { edge: 'cut', fibre: false, shadow: false }),
  ]));

  // bunting across the street
  const strand: Array<[number, number]> = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    strand.push([390 + 430 * t, 110 + Math.sin(t * Math.PI) * 52]);
  }
  nodes.push(ink(strand, { width: 2, color: C.brownDark, opacity: 0.6 }));
  strand.forEach(([x, y], i) => {
    if (i % 2 === 1 && i < 24) nodes.push(piece(poly([[x - 9, y], [x + 9, y], [x, y + 20]]), [C.red, C.gold, C.blue, C.green][(i >> 1) % 4], { edge: 'cut', fibre: false, shadow: false }));
  });

  // the cobbled street
  nodes.push(
    piece(rect(-20, 640, 1220, 220), COBBLE, { rough: 0.6, shadow: false }),
    piece(rect(-20, 632, 1220, 14), '#7d766c', { edge: 'cut' }),
    // a paler worn path down the middle
    piece(curve([[360, 700], [470, 648], [700, 648], [840, 700], [900, 830], [300, 830]], 2), '#b8b0a4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
  );
  // cobbles: neat rows of rounded stones, fewer and fainter low down
  for (let row = 0; row < 9; row++) {
    const y = 652 + row * 14 + row * row * 0.8;
    const sz = 22 + row * 5;
    const fade = row > 3 ? 0.12 : 0.28;
    for (let x = -10 + (row % 2) * (sz / 2); x < 1200; x += sz + 6) {
      nodes.push(piece(ellipse(x + r() * 4, y, sz / 2, 5 + row * 1.2), r() > 0.5 ? COBBLE_DARK : '#bdb5a8', { edge: 'cut', fibre: false, shadow: false, opacity: fade }));
    }
  }

  // the café tables stand on the cobbles, in front of the parlour
  nodes.push(...table(115, 604), ...table(300, 610));

  return svg({ w: 1180, h: 820, name: 'hogwarts-diagon-alley', boil: false, className: 'backdrop' }, nodes);
}
