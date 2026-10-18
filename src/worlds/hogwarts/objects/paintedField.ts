/**
 * Painted canvases for "Sir Cadogan" (book 3; original paper art).
 *
 * Both are exactly the portraitFrame's inner opening, 360 × 460, so put one
 * at frameLeft + 40, frameTop + 40 (behind the actors, behind the frame).
 * Both are painted-looking: soft, low-contrast shapes with a light blur and
 * a darker varnished edge, so characters in front read as being in the
 * painting. The lower half is kept calm: actors stand there (bottoms at y 460).
 *
 * paintedField: a pale sky with soft clouds, rolling green hills from
 *   y 230 down, a little round tree on the hill at x 292 (trunk y 246 to
 *   298, leaves up to y 190), and a scatter of white painted daisies.
 *
 * paintedParlour: the Lady in Pink's own painting, a pink drawing room.
 *   Striped pink wallpaper with small flowers, a rose dado panel below
 *   y 326, a gold curtain rod across the top, a swagged wine-red curtain at
 *   the left (x 0 to 75), and a little round table at the right (top y 352,
 *   x 253 to 345) with a blue vase of flowers on it (flowers up to y 254).
 */
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

const W = 360;
const H = 460;

/** Wraps nodes in a light blur, so they look painted rather than cut. */
function soft(id: string, sd: number, kids: Node[]): Node {
  return (ctx) =>
    `<defs><filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${sd}"/></filter></defs><g filter="url(#${id})">${kids.map((c) => c(ctx)).join('')}</g>`;
}

const flat = { edge: 'clean', shadow: false } as const;

/** A darker painted edge round the canvas, like old varnish. */
function edgeShade(): Node[] {
  return [
    ink([[0, 0], [W, 0], [W, H], [0, H]], { width: 14, color: '#3a2a1a', closed: true, opacity: 0.28, wobble: 0.2 }),
    ink([[7, 7], [W - 7, 7], [W - 7, H - 7], [7, H - 7]], { width: 6, color: '#3a2a1a', closed: true, opacity: 0.18, wobble: 0.2 }),
  ];
}

function daisy(x: number, y: number, r: number): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    out.push(piece(ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.7, r * 0.45, (a * 180) / Math.PI), '#faf5e6', flat));
  }
  out.push(piece(circle(x, y, r * 0.5), '#e8c45a', flat));
  return out;
}

export function paintedFieldArt(): string {
  return svg({ w: W, h: H, name: 'hogwarts-painted-field' }, [
    soft('pf-soft', 2.2, [
      piece(rect(-10, -10, W + 20, H + 20), '#bcd4e6', flat),
      piece(rect(-10, 120, W + 20, 200), '#d3e2e8', { ...flat, opacity: 0.8 }),
      piece(rect(-10, 200, W + 20, 120), '#e8ecde', { ...flat, opacity: 0.7 }),
      // soft clouds
      piece(ellipse(90, 70, 62, 20), '#f7f2e6', { ...flat, opacity: 0.9 }),
      piece(ellipse(124, 58, 36, 18), '#f7f2e6', { ...flat, opacity: 0.9 }),
      piece(ellipse(270, 120, 54, 16), '#f7f2e6', { ...flat, opacity: 0.85 }),
      piece(ellipse(296, 108, 30, 14), '#f7f2e6', { ...flat, opacity: 0.85 }),
      // far hill, then the near rolling hills
      piece(curve([[-10, 262], [90, 236], [200, 252], [370, 228], [370, 470], [-10, 470]], 3), '#a9c28a', flat),
      piece(curve([[-10, 300], [80, 272], [180, 280], [280, 262], [370, 276], [370, 470], [-10, 470]], 3), '#86ad6c', flat),
      piece(curve([[-10, 370], [120, 344], [250, 356], [370, 340], [370, 470], [-10, 470]], 3), '#729c5c', flat),
      // a little round tree on the hill
      piece(rect(288, 246, 9, 52, 2), '#7a5538', flat),
      piece(circle(292, 224, 34), '#4f7e48', flat),
      piece(circle(282, 214, 20), '#6a9a58', { ...flat, opacity: 0.8 }),
      piece(circle(306, 232, 18), '#43703f', { ...flat, opacity: 0.8 }),
      // daisies, mostly at the sides and low down, away from the faces
      ...daisy(40, 392, 6), ...daisy(70, 420, 5), ...daisy(24, 434, 5), ...daisy(330, 396, 6),
      ...daisy(300, 428, 5), ...daisy(346, 440, 5), ...daisy(180, 440, 4), ...daisy(110, 316, 4),
      ...daisy(236, 330, 4), ...daisy(52, 336, 4),
    ]),
    ...edgeShade(),
  ]);
}

export function paintedParlourArt(): string {
  const stripes: Node[] = [];
  for (let x = 10; x < W; x += 36) stripes.push(piece(rect(x, -10, 16, 350), '#e6b0ab', { ...flat, opacity: 0.55 }));
  const sprigs: Node[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 28 + col * 40 + (row % 2) * 20;
      const y = 70 + row * 52;
      if (x < 90 || (x > 240 && y > 200)) continue;
      sprigs.push(dot(x, y, 3.4, '#f7e4dc', 0.8), dot(x, y, 1.4, '#c4706c', 0.8));
    }
  }
  return svg({ w: W, h: H, name: 'hogwarts-painted-parlour' }, [
    soft('pp-soft', 1.4, [
      piece(rect(-10, -10, W + 20, H + 20), '#dca39e', flat),
      ...stripes,
      ...sprigs,
      // picture rail, and the dado panel below
      piece(rect(-10, 22, W + 20, 12), '#f0d8cc', flat),
      piece(rect(-10, 326, W + 20, 140), '#c4706c', flat),
      piece(rect(-10, 320, W + 20, 12), '#f0d8cc', flat),
      ...[0, 1, 2, 3].map((i) => piece(rect(14 + i * 88, 346, 70, 96, 4), '#b45f5c', { ...flat, opacity: 0.7 })),
      // the little table, with a vase and flowers
      piece(rect(295, 376, 8, 70, 2), '#7a4a32', flat),
      piece(ellipse(299, 446, 28, 6), '#7a4a32', flat),
      piece(ellipse(299, 360, 46, 10), '#a06d43', flat),
      piece(ellipse(299, 358, 40, 7), '#b88556', flat),
      piece(curve([[288, 354], [280, 326], [284, 304], [314, 304], [318, 326], [310, 354]], 2), '#6f8fb8', flat),
      ink([[292, 304], [286, 280], [282, 270]], { width: 2.4, color: '#5a7a48', wobble: 0.3 }),
      ink([[300, 304], [300, 274]], { width: 2.4, color: '#5a7a48', wobble: 0.3 }),
      ink([[308, 304], [316, 282], [322, 272]], { width: 2.4, color: '#5a7a48', wobble: 0.3 }),
      piece(circle(282, 266, 9), '#f4d36a', flat),
      piece(circle(300, 264, 10), '#f7f2e6', flat),
      piece(circle(322, 266, 9), '#d94f5a', flat),
      // the curtain at the left: a swagged drape with a tie-back, on a gold rod
      piece(rect(-10, 14, W + 20, 8), '#d8a43f', flat),
      piece(poly([[-10, 18], [70, 18], [78, 120], [58, 190], [66, 330], [-10, 340]]), '#9c3f4c', flat),
      piece(poly([[10, 18], [30, 18], [36, 130], [26, 330], [8, 330]]), '#b5566a', { ...flat, opacity: 0.7 }),
      piece(poly([[50, 18], [70, 18], [76, 120], [60, 190], [54, 190], [58, 120]]), '#7a2e3a', { ...flat, opacity: 0.7 }),
      piece(ellipse(66, 190, 14, 9), '#d8a43f', flat),
      piece(circle(30, 20, 7), '#d8a43f', flat),
    ]),
    ...edgeShade(),
  ]);
}
