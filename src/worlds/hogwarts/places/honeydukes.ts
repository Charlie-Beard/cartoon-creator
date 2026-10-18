/** Honeydukes, the sweet shop in Hogsmeade (made for "The Secret Way to Honeydukes"). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const CREAM = '#f3e6cf';
const STRIPE = '#e8a9ad';
const SHELF = '#7a4e30';
/** Pinks, lemon yellows, mint greens and chocolate browns. */
const SWEETS = ['#e58aa0', '#f0d25a', '#9fd3ae', '#7b4a33', '#f2b8c6', '#f7e58c', '#7fc4a0', '#a8643c', '#f4a76a', '#c9a8e0'];

/** A row of jars and boxes sitting on a shelf board whose top is at `y`. */
function row(r: () => number, x0: number, x1: number, y: number): Node[] {
  const out: Node[] = [];
  let x = x0;
  while (x < x1 - 20) {
    const col = SWEETS[Math.floor(r() * SWEETS.length)];
    const kind = r();
    const w = 26 + r() * 20;
    const h = 40 + r() * 16;
    if (kind < 0.5) {
      // a glass jar full of sweets, with a lid
      out.push(piece(rect(x, y - h, w, h, 6), '#e6f0ee', { edge: 'cut', fibre: false, shadow: false, opacity: 0.9 }));
      out.push(piece(rect(x + 3, y - h * 0.8, w - 6, h * 0.8 - 3, 5), col, { edge: 'cut', fibre: false, shadow: false }));
      out.push(dot(x + w * 0.35, y - h * 0.55, 3, CREAM, 0.7));
      out.push(piece(rect(x + 3, y - h - 7, w - 6, 8, 2), r() > 0.5 ? C.gold : C.redDark, { edge: 'cut', fibre: false, shadow: false }));
    } else {
      // a box with a pale label
      out.push(piece(rect(x, y - h + 6, w, h - 6, 2), col, { edge: 'cut', fibre: false }));
      out.push(piece(rect(x + 4, y - h * 0.6, w - 8, 12, 2), CREAM, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }));
    }
    x += w + 4 + r() * 4;
  }
  return out;
}

/** A tall wooden unit of shelves, crammed with sweets. */
function shelves(r: () => number, x: number, y: number, w: number, rows: number, gap: number): Node[] {
  const out: Node[] = [piece(rect(x, y, w, rows * gap + 14, 3), '#5d3a24', { edge: 'cut' })];
  for (let i = 0; i < rows; i++) {
    const by = y + 10 + (i + 1) * gap - 4;
    out.push(...row(r, x + 8, x + w - 8, by));
    out.push(piece(rect(x - 4, by, w + 8, 9, 2), SHELF, { edge: 'cut' }));
  }
  return out;
}

/** Inside Honeydukes: striped walls, shelves of sweets, a long counter, snow at the window. */
export function honeydukes(): string {
  const r = rng(3301);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 640), CREAM, { edge: 'clean', shadow: false })];

  // striped wallpaper
  for (let x = 0; x < 1200; x += 80) nodes.push(piece(rect(x, -10, 40, 580), STRIPE, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
  // wooden dado rail
  nodes.push(piece(rect(-20, 500, 1220, 70, 0), '#8a5a3b', { rough: 0.7, shadow: false }));
  for (let x = 40; x < 1200; x += 110) nodes.push(piece(rect(x, 512, 80, 46, 3), '#9b6a45', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));

  // the window with snowy Hogsmeade
  nodes.push(piece(rect(430, 90, 250, 230, 6), C.wood, { rough: 0.7 }));
  nodes.push(piece(rect(446, 106, 218, 198), '#cfe0ec', { edge: 'cut', fibre: false, shadow: false }));
  nodes.push(piece(poly([[446, 304], [446, 250], [520, 232], [600, 246], [664, 236], [664, 304]]), '#f7fbff', { rough: 0.6, shadow: false }));
  [[470, 70, 60, '#b88f86'], [540, 56, 80, '#9aa6b8'], [606, 70, 52, '#c4a285']].forEach(([x, w, top, col]) => {
    nodes.push(piece(poly([[x as number, 262], [x as number, (top as number) + 150], [(x as number) + (w as number) / 2, (top as number) + 122], [(x as number) + (w as number), (top as number) + 150], [(x as number) + (w as number), 262]]), col as string, { edge: 'cut', fibre: false, shadow: false }));
    nodes.push(piece(poly([[x as number - 3, (top as number) + 152], [(x as number) + (w as number) / 2, (top as number) + 118], [(x as number) + (w as number) + 3, (top as number) + 152]]), '#f7fbff', { edge: 'cut', fibre: false, shadow: false }));
  });
  for (let i = 0; i < 16; i++) nodes.push(dot(456 + r() * 198, 114 + r() * 150, 2 + r() * 2, '#ffffff', 0.9));
  nodes.push(
    piece(rect(546, 106, 10, 198), C.wood, { edge: 'cut' }),
    piece(rect(446, 196, 218, 10), C.wood, { edge: 'cut' }),
    piece(rect(420, 316, 270, 16, 3), C.wood, { edge: 'cut' }),
  );

  // tall shelves on the walls, left and right
  nodes.push(...shelves(r, 6, 60, 190, 7, 70));
  nodes.push(...shelves(r, 980, 60, 194, 7, 70));
  // a short run of shelves over the counter, each side of the window
  nodes.push(...shelves(r, 214, 120, 196, 3, 70));
  nodes.push(...shelves(r, 704, 120, 250, 3, 70));

  // the long counter at the back, with glass jars on top
  nodes.push(
    piece(rect(220, 440, 740, 120, 4), '#6f4429'),
    piece(rect(210, 428, 760, 22, 4), C.wood),
    ...[250, 420, 590, 760].map((x) => piece(rect(x, 462, 140, 84, 4), '#82552f', { edge: 'cut', fibre: false, shadow: false })),
  );
  [[270, '#e58aa0'], [350, '#f0d25a'], [430, '#9fd3ae'], [680, '#f2b8c6'], [760, '#7b4a33'], [850, '#f4a76a']].forEach(([x, col], i) => {
    const h = 56 + (i % 3) * 8;
    nodes.push(piece(rect(x as number, 428 - h, 52, h, 10), '#e6f0ee', { edge: 'cut', fibre: false, opacity: 0.92 }));
    nodes.push(piece(rect((x as number) + 4, 428 - h * 0.78, 44, h * 0.78 - 4, 8), col as string, { edge: 'cut', fibre: false, shadow: false }));
    nodes.push(piece(rect((x as number) + 8, 428 - h - 9, 36, 10, 3), C.gold, { edge: 'cut', fibre: false, shadow: false }));
  });
  // a cake stand and a scoop on the counter
  nodes.push(piece(ellipse(560, 424, 42, 8), '#d9c9a8', { edge: 'cut' }), piece(curve([[524, 422], [530, 396], [590, 396], [596, 422]], 2), '#d77a8d', { edge: 'cut' }));

  // a hanging sign (no words): a pink-and-gold scalloped board with a lollipop
  nodes.push(
    ink([[740, 0], [740, 54]], { width: 3, color: C.brownDark }),
    ink([[860, 0], [860, 54]], { width: 3, color: C.brownDark }),
  );
  nodes.push(
    piece(rect(710, 52, 180, 70, 10), '#7a4e30'),
    piece(rect(722, 62, 156, 50, 8), '#f3b9c4', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(800, 87, 18), '#e58aa0', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(800, 87, 9), CREAM, { edge: 'cut', fibre: false, shadow: false }),
    ...[752, 848].map((x) => dot(x, 87, 6, C.gold)),
  );

  // strings of candy-cane colours looped across the top
  [[[10, 18], [300, 56], [590, 18]], [[590, 18], [880, 56], [1170, 18]]].forEach((pts, k) => {
    const curvePts: Array<[number, number]> = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      curvePts.push([pts[0][0] + (pts[2][0] - pts[0][0]) * t, pts[0][1] + Math.sin(t * Math.PI) * 44]);
    }
    nodes.push(ink(curvePts, { width: 2, color: C.brownDark, opacity: 0.6 }));
    curvePts.forEach(([x, y], i) => {
      if (i % 2 === 0 && (k === 0 ? x > 200 : x < 980)) {
        nodes.push(piece(rect(x - 5, y + 2, 10, 26, 4), i % 4 === 0 ? '#d4504f' : CREAM, { edge: 'cut', fibre: false, shadow: false }));
        nodes.push(piece(rect(x - 5, y + 12, 10, 5, 0), i % 4 === 0 ? CREAM : '#d4504f', { edge: 'cut', fibre: false, shadow: false }));
      }
    });
  });

  // the floor: wide floorboards, plain and calm
  nodes.push(
    piece(rect(-20, 560, 1220, 300), '#a8774a', { rough: 0.8, shadow: false }),
    piece(rect(-20, 552, 1220, 16), C.brownDark, { edge: 'cut' }),
    ...[600, 650, 702, 756].map((y) => ink([[-10, y], [1190, y + 2]], { width: 2.5, color: C.brownDark, opacity: 0.35 })),
    ...[[240, 568, 600], [620, 568, 600], [980, 568, 600], [420, 604, 650], [820, 604, 650], [90, 604, 650], [1100, 604, 650], [300, 654, 702], [700, 654, 702], [1000, 654, 702], [140, 706, 756], [520, 706, 756], [900, 706, 756]].map(([x, a, b]) =>
      ink([[x, a], [x + 2, b]], { width: 2.5, color: C.brownDark, opacity: 0.3 }),
    ),
  );

  return svg({ w: 1180, h: 820, name: 'honeydukes', boil: false, className: 'backdrop' }, nodes);
}
