/** Christmas props: a wizard cracker, a knitted jumper, a flower bonnet, an admiral's hat and a white mouse. */
import { C } from '../../../art/palette';
import { circle, ellipse, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const GOLD_DEEP = '#b98a2c';
const FESTIVE_RED = '#b8352f';

/** A five-point star outline. */
function star(cx: number, cy: number, r: number, rot = -90): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

/** A flat strip from a to b, `w0` wide at a and `w1` wide at b. */
function strip(a: Pt, b: Pt, w0: number, w1: number): Pt[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return [
    [a[0] + nx * w0, a[1] + ny * w0],
    [b[0] + nx * w1, b[1] + ny * w1],
    [b[0] - nx * w1, b[1] - ny * w1],
    [a[0] - nx * w0, a[1] - ny * w0],
  ];
}

/**
 * A big Christmas cracker lying sideways, 260 × 90. Parts `left` and `right`
 * are the two halves, both pivoting on the middle [130, 45]: pull them apart
 * sideways (left to -x, right to +x). Each half has its own frilly end.
 */
export function cracker(): string {
  const half = (side: 'left' | 'right'): Node => {
    const X = (x: number): number => (side === 'left' ? x : 260 - x);
    const P = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [X(x), y] as Pt);
    // The tube is a little longer than half, so the halves overlap at the seam.
    const tubeA = side === 'left' ? 46 : 46;
    const tubeB = side === 'left' ? 132 : 132;
    const stars: Node[] = [];
    [[78, 36, 9], [100, 58, 8], [66, 60, 7]].forEach(([x, y, r]) => {
      stars.push(piece(star(X(x), y, r), C.goldLight, { edge: 'cut', shadow: false, fibre: false }));
    });
    // Frilly paper fan: long zigzag points, red and gold layers.
    const frill = (inset: number, col: string, h: number): Node => {
      const pts: Pt[] = [[38, 45 - 8]];
      const n = 7;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const y = 45 - h + t * h * 2;
        pts.push([inset + (i % 2 ? 8 : 0), y]);
      }
      pts.push([38, 45 + 8]);
      return piece(poly(P(pts)), col, { edge: 'cut', rough: 0.8 });
    };
    return group({ part: side, origin: [130, 45] }, [
      // outer frill, then a pinched neck, then the tube
      frill(0, GOLD_DEEP, 40),
      frill(8, C.goldLight, 33),
      piece(poly(P([[30, 36], [46, 20], [46, 70], [30, 54]])), C.gold, { edge: 'cut' }),
      ink(P([[34, 37], [34, 53]]), { width: 2, color: GOLD_DEEP }),
      ink(P([[38, 33], [38, 57]]), { width: 2, color: GOLD_DEEP }),
      piece(rect(Math.min(X(tubeA), X(tubeB)), 16, tubeB - tubeA, 58, 6), FESTIVE_RED, { rough: 0.9 }),
      // gold bands near the neck and at the seam
      piece(rect(Math.min(X(52), X(60)), 16, 8, 58), C.gold, { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(Math.min(X(118), X(134)), 16, 16, 58), C.gold, { edge: 'cut', shadow: false, fibre: false }),
      // a paler glossy strip along the tube
      piece(rect(Math.min(X(66), X(114)), 22, 48, 7, 3), '#d9625a', { edge: 'cut', shadow: false, fibre: false, opacity: 0.8 }),
      ...stars,
    ]);
  };
  return svg({ w: 260, h: 90, name: 'hog-christmas-cracker', label: 'a Christmas cracker' }, [half('left'), half('right')]);
}

/** A hand-knitted emerald jumper with a cream H, laid out flat, 220 × 190. */
export function jumper(): string {
  const GREEN = '#2f8a58';
  const GREEN_D = '#1f6a42';
  const GREEN_L = '#4aa573';
  const CREAM = '#f3e8c6';
  const r = rng(77);
  const sleeve = (sx: 1 | -1): Node[] => {
    const X = (x: number): number => (sx === 1 ? x : 220 - x);
    const P = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [X(x), y] as Pt);
    const a: Pt = [58, 62];
    const b: Pt = [18, 128];
    const cuffA: Pt = [26, 116];
    const ribs: Node[] = [];
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const cx = cuffA[0] + (b[0] - cuffA[0]) * t;
      const cy = cuffA[1] + (b[1] - cuffA[1]) * t;
      ribs.push(ink(P([[cx - 12, cy - 8], [cx + 12, cy + 8]].map(([x, y]) => [x + 3, y - 1] as Pt)), { width: 2, color: GREEN_D }));
    }
    return [
      piece(poly(P(strip(a, b, 24, 18))), GREEN, { rough: 1.1 }),
      piece(poly(P(strip(cuffA, [b[0] - 3, b[1] + 5], 19, 19))), GREEN_D, { rough: 0.8 }),
      ...ribs,
    ];
  };
  // Knitted look: little "v" stitches in rows over a region, in a lighter tone.
  const stitches: Node[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 62 + col * 12.2 + (row % 2 ? 6 : 0);
      const y = 52 + row * 14 + (r() - 0.5) * 2;
      if (x > 156) continue;
      stitches.push(ink([[x - 3, y], [x, y + 5], [x + 3, y]], { width: 1.6, color: GREEN_L, wobble: 0.3 }));
    }
  }
  // The H: big and cream, with a slightly wonky outline to look homemade.
  const H = poly([
    [82, 74], [102, 72], [103, 98], [118, 99], [118, 73], [138, 75], [136, 146], [117, 148], [117, 121], [103, 120], [103, 146], [83, 144],
  ]);
  const hStitches: Node[] = [];
  for (let i = 0; i < 8; i++) {
    const y = 80 + i * 8.5;
    hStitches.push(ink([[87, y], [96, y + 3]], { width: 1.6, color: '#d9c999', wobble: 0.3 }));
    hStitches.push(ink([[122, y], [131, y + 3]], { width: 1.6, color: '#d9c999', wobble: 0.3 }));
  }
  const hem: Node[] = [];
  for (let i = 0; i < 13; i++) {
    hem.push(ink([[58 + i * 8.4, 166], [58 + i * 8.4, 184]], { width: 2, color: GREEN_D }));
  }
  const collar: Node[] = [];
  for (let i = 0; i < 6; i++) {
    collar.push(ink([[86 + i * 9, 38], [87 + i * 9, 48]], { width: 2, color: GREEN_D }));
  }
  return svg({ w: 220, h: 190, name: 'hog-christmas-jumper', label: 'a green knitted Christmas jumper' }, [
    ...sleeve(1),
    ...sleeve(-1),
    piece(poly([[58, 34], [90, 24], [130, 24], [162, 34], [166, 184], [54, 184]]), GREEN, { rough: 1.1 }),
    ...stitches,
    // ribbed neck: a dark inner hole and a ring of rib
    piece(ellipse(110, 30, 28, 11), GREEN_D, { rough: 0.7 }),
    piece(ellipse(110, 33, 20, 6), '#154a2e', { edge: 'cut', shadow: false, fibre: false }),
    ...collar,
    piece(H, CREAM, { rough: 1.3 }),
    ...hStitches,
    // ribbed hem
    piece(rect(54, 164, 112, 22, 3), GREEN_D, { rough: 0.7 }),
    ...hem,
    // a tiny mended patch: homemade
    piece(rect(142, 150, 14, 12, 2), '#c4706c', { edge: 'cut', rough: 0.8 }),
    ink([[142, 150], [156, 162]], { width: 1.4, color: C.cream, wobble: 0.2 }),
  ]);
}

/** A silly old-lady's bonnet piled with flowers, seen from the front, 170 × 120. Brim bottom at y 100. */
export function flowerBonnet(): string {
  const r = rng(31);
  const flower = (x: number, y: number, rr: number, col: string, centre: string): Node[] => {
    const out: Node[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + r();
      out.push(piece(circle(x + Math.cos(a) * rr * 0.7, y + Math.sin(a) * rr * 0.7, rr * 0.55), col, { edge: 'cut', shadow: false, fibre: false }));
    }
    out.push(piece(circle(x, y, rr * 0.4), centre, { edge: 'clean', shadow: false }));
    return out;
  };
  const leaves: Node[] = [];
  [[30, 70], [60, 36], [100, 30], [128, 52], [144, 78], [84, 56], [46, 90], [124, 92]].forEach(([x, y], i) => {
    leaves.push(piece(ellipse(x, y, 12, 5, i * 40), C.green, { edge: 'cut', shadow: false, fibre: false }));
  });
  const spots: Array<[number, number, number, string, string]> = [
    [36, 62, 11, C.pink, C.yellow],
    [62, 38, 12, C.yellow, C.rose],
    [88, 24, 11, C.pink, C.goldLight],
    [112, 36, 12, '#e8a8b8', C.yellow],
    [136, 62, 11, C.yellow, C.rose],
    [84, 56, 13, C.rose, C.goldLight],
    [52, 82, 12, C.yellow, C.rose],
    [112, 80, 12, C.pink, C.yellow],
    [24, 90, 10, '#e8a8b8', C.yellow],
    [146, 90, 10, C.pink, C.goldLight],
    [86, 90, 11, C.yellow, C.rose],
    [70, 62, 8, C.pink, C.yellow],
    [104, 60, 8, C.yellow, C.rose],
  ];
  const flowers = spots.flatMap(([x, y, rr, col, cen]) => flower(x, y, rr, col, cen));
  return svg({ w: 170, h: 120, name: 'hog-christmas-flower-bonnet', label: 'a flowery bonnet' }, [
    // ribbon ties hanging from each side, with a floppy bow on the left
    piece(poly([[24, 92], [38, 94], [34, 118], [22, 112]]), '#a77bb8', { edge: 'cut', rough: 0.8 }),
    piece(poly([[132, 94], [146, 92], [150, 112], [138, 118]]), '#a77bb8', { edge: 'cut', rough: 0.8 }),
    piece(poly([[14, 90], [34, 96], [14, 108]]), '#c39ad2', { edge: 'cut', rough: 0.8 }),
    piece(poly([[54, 96], [34, 96], [54, 108]]), '#c39ad2', { edge: 'cut', rough: 0.8, shadow: false }),
    // straw brim and crown
    piece(ellipse(85, 88, 82, 18), C.sand, { rough: 0.9 }),
    piece(ellipse(85, 92, 74, 11), C.tan, { edge: 'cut', shadow: false, fibre: false, opacity: 0.7 }),
    piece(poly([[14, 86], [18, 56], [40, 30], [85, 14], [130, 30], [152, 56], [156, 86], [120, 96], [50, 96]]), C.sand, { rough: 1.1 }),
    // ribbon band round the crown
    piece(rect(18, 80, 134, 12, 3), '#a77bb8', { edge: 'cut', shadow: false }),
    ...leaves,
    ...flowers,
    // a floppy bow on top
    piece(poly([[85, 14], [66, 2], [64, 22]]), '#c39ad2', { edge: 'cut', rough: 0.8 }),
    piece(poly([[85, 14], [106, 2], [108, 22]]), '#c39ad2', { edge: 'cut', rough: 0.8 }),
    piece(circle(85, 14, 5), '#a77bb8', { edge: 'cut', shadow: false }),
  ]);
}

/** A paper admiral's hat (a bicorne) from the front, navy with gold trim, 180 × 90. */
export function admiralHat(): string {
  const NAVY = C.blueDark;
  const NAVY_D = '#243c60';
  const top: Pt[] = [[4, 14], [22, 34], [56, 45], [90, 49], [124, 45], [158, 34], [176, 14]];
  const body = poly([...top, [172, 60], [146, 79], [90, 88], [34, 79], [8, 60]]);
  const braid: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 22 + i * 17;
    braid.push(piece(star(x, 72 + Math.sin(i) * 0, 3.5), C.goldLight, { edge: 'clean', shadow: false }));
  }
  return svg({ w: 180, h: 90, name: 'hog-christmas-admiral-hat', label: 'an admiral\'s hat' }, [
    piece(body, NAVY, { rough: 1.1 }),
    // darker underside crescent for depth
    piece(poly([[14, 56], [48, 66], [90, 70], [132, 66], [166, 56], [146, 78], [90, 86], [34, 78]]), NAVY_D, { edge: 'cut', shadow: false, fibre: false, opacity: 0.8 }),
    // gold braid along the top edge and the tips
    ink(top, { width: 6, color: C.gold, wobble: 0.4 }),
    ink(top.map(([x, y]) => [x, y + 7] as Pt), { width: 2, color: C.goldLight, wobble: 0.3 }),
    piece(poly([[2, 10], [14, 12], [8, 28], [2, 22]]), C.gold, { edge: 'cut', shadow: false }),
    piece(poly([[178, 10], [166, 12], [172, 28], [178, 22]]), C.gold, { edge: 'cut', shadow: false }),
    ...braid,
    // cockade: a red ribbon rosette with a gold star
    piece(circle(90, 46, 16), C.red, { edge: 'cut' }),
    piece(circle(90, 46, 11), C.cream, { edge: 'cut', shadow: false, fibre: false }),
    piece(star(90, 46, 9), C.gold, { edge: 'clean', shadow: false }),
  ]);
}

/** A little white mouse, side view, facing right, 110 × 70. */
export function whiteMouse(): string {
  const PINK = '#eba0a6';
  return svg({ w: 110, h: 70, name: 'hog-christmas-white-mouse', label: 'a little white mouse' }, [
    // curly pink tail, behind everything
    ink([[22, 50], [10, 58], [3, 48], [8, 38], [18, 38], [20, 30]], { width: 4, color: PINK, wobble: 0.3 }),
    // back foot and body
    piece(ellipse(34, 62, 9, 4.5), PINK, { edge: 'cut', shadow: false }),
    piece(ellipse(50, 44, 34, 20), C.white, { rough: 0.9 }),
    piece(ellipse(52, 52, 24, 10), C.skinPale, { edge: 'cut', shadow: false, fibre: false, opacity: 0.8 }),
    // head and pointed snout
    piece(poly([[72, 30], [90, 24], [108, 44], [92, 58], [72, 56]]), C.white, { rough: 0.8 }),
    piece(circle(77, 44, 17), C.white, { rough: 0.8, shadow: false }),
    // big round pink ear
    piece(circle(78, 26, 12), C.white, { edge: 'cut' }),
    piece(circle(79, 27, 7.5), PINK, { edge: 'cut', shadow: false, fibre: false }),
    // face
    piece(circle(106, 43, 4.5), '#e0688c', { edge: 'clean', shadow: false }),
    circleDot(92, 38, 3, C.ink),
    circleDot(93, 37, 1, C.white),
    ink([[98, 46], [86, 42]], { width: 1.2, color: C.greyDark, wobble: 0.2 }),
    ink([[98, 48], [88, 50]], { width: 1.2, color: C.greyDark, wobble: 0.2 }),
    // front foot
    piece(ellipse(78, 63, 8, 4), PINK, { edge: 'cut', shadow: false }),
  ]);
}

function circleDot(cx: number, cy: number, rr: number, fill: string): Node {
  return piece(circle(cx, cy, rr), fill, { edge: 'clean', shadow: false });
}
