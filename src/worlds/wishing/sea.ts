/**
 * The open sea: the Wishing-Chair's seaside backdrop.
 *
 * A wide, warm summer sky (soft blue, a pale sun at top right, a few flat
 * clouds), a far line of white cliffs with a grassy top and a small
 * red-and-white lighthouse on the left, where the sea meets the sky at
 * about y 310, and blue-green sea all the way down in torn bands with
 * scalloped paper waves. Nothing else: the middle, from x 300 to 1180, is
 * open water. The waves are small and calm near the bottom so the caption
 * band (y 690+) stays quiet.
 *
 * Open water, no ground. A whale's back or a chair's wheels sit with their
 * waterline at about y 520-580; riders' heads then stay above y 330.
 */
import { C } from '../../art/palette';
import { cached, curve, ellipse, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const HORIZON = 312;

/** A flat paper cloud: a few overlapping ovals with a pale underside. */
function cloud(cx: number, cy: number, w: number): Node[] {
  return [
    piece(ellipse(cx, cy + 6, w / 2, w * 0.07), C.cloudShade, { ...flat, opacity: 0.8 }),
    piece(ellipse(cx - w * 0.2, cy - 2, w * 0.28, w * 0.09), C.cloud, flat),
    piece(ellipse(cx + w * 0.1, cy - 8, w * 0.32, w * 0.12), C.cloud, flat),
    piece(ellipse(cx + w * 0.3, cy, w * 0.2, w * 0.07), C.cloud, flat),
  ];
}

/** The white cliffs on the left, and the lighthouse on top. */
function cliffs(): Node[] {
  const chalk = '#f2eee2';
  const chalkShade = '#d9d3c2';
  return [
    // a hazy far headland behind
    piece(curve([[-30, HORIZON + 6], [-30, 262], [120, 244], [260, 262], [340, 298], [360, HORIZON + 6]], 2), '#c8d4d2', { ...flat, opacity: 0.8 }),
    // the near chalk face
    piece(poly([[-30, HORIZON + 14], [-30, 226], [60, 218], [150, 232], [214, 226], [262, 250], [292, 286], [320, HORIZON + 14]]), chalk, { edge: 'torn', rough: 0.8, shadow: false }),
    piece(poly([[40, 240], [60, 300], [92, HORIZON + 10], [70, 238]]), chalkShade, { ...flat, opacity: 0.7 }),
    piece(poly([[170, 240], [190, 296], [212, HORIZON + 10], [196, 244]]), chalkShade, { ...flat, opacity: 0.7 }),
    ...[[100, 270], [150, 288], [240, 288]].map(([x, y]) => ink([[x, y], [x + 22, y + 3]], { width: 2.4, color: '#bfb8a6', wobble: 0.4 })),
    // grass on top
    piece(poly([[-30, 226], [-30, 212], [60, 204], [150, 218], [214, 212], [264, 236], [262, 250], [214, 226], [150, 232], [60, 218]]), C.leaf, { edge: 'torn', rough: 0.8, shadow: false, fibre: false }),
    // the lighthouse: a white tower with two red bands, a lamp room and a roof
    group({ transform: 'translate(90 0)' }, [
      piece(poly([[104, 212], [116, 140], [136, 140], [148, 212]]), C.white, { edge: 'cut', shadow: false }),
      piece(poly([[108, 192], [112, 172], [140, 172], [144, 192]]), C.red, flat),
      piece(poly([[113, 160], [115, 148], [137, 148], [139, 160]]), C.red, flat),
      piece(rect(114, 124, 24, 16, 2), C.goldLight, flat),
      piece(rect(110, 138, 32, 4, 1), C.charcoal, flat),
      piece(poly([[112, 124], [126, 106], [140, 124]]), C.red, flat),
    ]),
  ];
}

/** A row of little scalloped white waves along y, from x0 to x1. */
function crests(x0: number, x1: number, y: number, w: number, seed: number, opacity = 0.9): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let x = x0 + r() * w; x < x1; x += w * (1.1 + r() * 0.7)) {
    const k = w * (0.8 + r() * 0.5);
    const pts: Pt[] = [[x - k / 2, y + 5], [x - k / 4, y - 3], [x, y - 6], [x + k / 4, y - 3], [x + k / 2, y + 5]];
    out.push(ink(pts, { width: 3, color: '#f2f7f4', wobble: 0.5, opacity }));
  }
  return out;
}

export const openSea = cached(() => {
  const bands: [number, string, number][] = [
    [HORIZON, '#8fcdd0', 1],
    [352, '#7bc0c8', 2],
    [410, '#68b2c0', 3],
    [490, '#559eb4', 4],
    [580, '#478eaa', 5],
    [680, '#3f84a2', 6],
  ];
  const nodes: Node[] = [
    // sky: soft blue, paler near the sea
    piece(rect(-20, -20, W + 40, H + 40), '#8fbfe0', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 120, W + 40, 260), '#a7d0e8', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 220, W + 40, 120), '#c4e0ee', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    // the sun, pale, with a soft ring
    piece(ellipse(980, 120, 92, 92), '#fff6d8', { ...flat, opacity: 0.45 }),
    piece(ellipse(980, 120, 58, 58), '#fbe9a8', flat),
    ...cloud(560, 130, 280),
    ...cloud(820, 226, 190),
    ...cloud(330, 192, 150),
    ...cloud(1080, 272, 120),
    ...cliffs(),
  ];
  // the sea, band by band, each torn along its top edge
  bands.forEach(([y, fill, i]) => {
    nodes.push(piece(rect(-20, y, W + 40, H + 40 - y), fill, { edge: 'torn', rough: 1.6, shadow: false, fibre: i === 1 ? '#e6f4f0' : false }));
  });
  // little white wave crests, smaller and calmer toward the bottom
  nodes.push(
    ...crests(330, W, 330, 34, 21, 0.7),
    ...crests(-10, W, 374, 44, 22, 0.75),
    ...crests(-10, W, 436, 56, 23, 0.8),
    ...crests(-10, W, 516, 70, 24, 0.7),
    ...crests(-10, W, 606, 84, 25, 0.5),
    ...crests(-10, W, 660, 100, 26, 0.3),
  );
  // a haze along the horizon so far waves fade away
  nodes.push(piece(rect(-20, HORIZON - 6, W + 40, 14), '#d4ecee', { edge: 'torn', rough: 1.4, shadow: false, fibre: false, opacity: 0.6 }));
  return svg({ w: W, h: H, name: 'wishing-open-sea', className: 'backdrop' }, nodes);
});
