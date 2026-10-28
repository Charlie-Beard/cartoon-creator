/**
 * The Troll's Bridge: a green river valley on a sunny morning, seen side-on.
 * Soft blue sky in torn bands with a few white clouds and far blue-green
 * hills. On the left a grassy near bank; on the right a far bank with a
 * little winding path climbing a hill to three small round thatched cottages
 * (the village the postman wants to reach). Between them a calm river, and
 * across it an old, rickety, humpbacked plank bridge: a deck of uneven
 * boards, sagging rope rails on crooked posts (one leaning badly) and three
 * trestle legs into the water. The dark space under the deck is where the
 * troll lives, with a tiny washing line and one big patched sock. The place
 * is cheerful; the scariness comes from the troll.
 *
 * Ground line y 640 on both banks. Open ground: left bank x 20-320, right
 * bank x 900-1180. Painted in (they can't move):
 *   - the deck: its walking surface (where feet go, minus about 2) is
 *     y 593 at x 300, 568 at x 450, 560 at x 590, 570 at x 750, 598 at
 *     x 900 (a parabola from y 600 at x 270 / x 910 up to y 560 at x 590).
 *     Boards are 36 px deep under that line; the front of the deck is
 *     x 270-910. Rope rails on posts rise 90 px above it.
 *   - THE GAP: two planks missing at the top of the hump, BRIDGE_GAP,
 *     a dark notch x 558-632, y 557-601
 *   - three trestle legs at x 400, 590, 780, going down to y 705
 *   - the dark space under the deck, x 275-905, from the deck's underside
 *     (y 600-640) down to the water at y 650; the sock line is at about
 *     x 420-570, y 618-650
 *   - the river, x 290-900, water surface from y 650 down
 *   - the village, x 900-1160: cottage bases y 530, 476, 430, a path up to it
 * The middle of the bridge (x 420-760) is left plain for the troll. The
 * bottom band (y 690-820) is plain water and grass.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const soft = { edge: 'torn' as const, rough: 1.4, fibre: false as const, shadow: false };

/** The gap in the bridge deck where the broken planks were (stage box). */
export const BRIDGE_GAP = { x: 558, y: 557, w: 74, h: 44 } as const;

/** The deck's top line: y 600 at x 270 and x 910, rising to y 560 at x 590. */
const deckY = (x: number) => 560 + 40 * ((x - 590) / 320) ** 2;

/** A tiny round thatched cottage whose base is at (x, base). */
function cottage(x: number, base: number, s = 1): Node[] {
  return [
    piece(ellipse(x, base - 14 * s, 17 * s, 15 * s), '#efe3c8', flat),
    piece(poly([[x - 24 * s, base - 22 * s], [x, base - 54 * s], [x + 24 * s, base - 22 * s]]), '#c9a14e', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    piece(rect(x - 4 * s, base - 14 * s, 8 * s, 14 * s, 3), '#6b4a32', flat),
    piece(rect(x + 7 * s, base - 22 * s, 6 * s, 6 * s, 1), '#f2d27a', flat),
    piece(rect(x + 10 * s, base - 52 * s, 6 * s, 14 * s), '#8c8a86', flat),
  ];
}

/** A tuft of grass: three blades. */
function tuft(x: number, y: number, s: number, col: string): Node[] {
  return [
    ink([[x - 6 * s, y], [x - 9 * s, y - 14 * s]], { width: 3, color: col, wobble: 0.3 }),
    ink([[x, y], [x, y - 18 * s]], { width: 3, color: col, wobble: 0.3 }),
    ink([[x + 6 * s, y], [x + 10 * s, y - 13 * s]], { width: 3, color: col, wobble: 0.3 }),
  ];
}

/** A bulrush: a green stem with a brown velvety head. */
function bulrush(x: number, base: number, h: number, lean: number): Node[] {
  const tx = x + lean;
  const ty = base - h;
  return [
    ink([[x, base], [x + lean * 0.4, base - h * 0.5], [tx, ty]], { width: 3, color: '#5b8f4f', wobble: 0.3 }),
    piece(ellipse(tx, ty - 8, 4.5, 11, lean * 2), '#7a5434', flat),
  ];
}

/** A flat reed blade. */
function reed(x: number, base: number, h: number, lean: number): Node {
  return ink([[x, base], [x + lean * 0.5, base - h * 0.6], [x + lean, base - h]], { width: 3, color: '#6fa05a', wobble: 0.3 });
}

/** A trestle leg: two slanting posts and a cross-brace, from the deck down into the water. */
function trestle(x: number, top: number, bottom: number): Node[] {
  const post = (x0: number, x1: number): Node =>
    piece(poly([[x0 - 6, top], [x0 + 6, top], [x1 + 7, bottom], [x1 - 7, bottom]]), '#5e4430', { edge: 'torn', rough: 0.5, fibre: false, shadow: false });
  const mid = top + (bottom - top) * 0.45;
  return [
    post(x - 20, x - 32),
    post(x + 20, x + 32),
    piece(poly([[x - 26, mid - 6], [x + 26, mid + 14], [x + 26, mid + 24], [x - 26, mid + 4]]), '#6e5238', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    piece(poly([[x - 26, mid + 18], [x + 26, mid - 2], [x + 26, mid + 8], [x - 26, mid + 28]]), '#7a5c40', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
  ];
}

export const trollBridge = cached(() => {
  const r = rng(9091);

  // The deck: individual boards, a little uneven and crooked, in alternating browns.
  const browns = ['#8a6440', '#7a5836', '#9a7248', '#6f4f32', '#85603c'];
  const tops = ['#b08a58', '#a07c4c', '#b8925e', '#9a7648', '#a88454'];
  const deck: Node[] = [];
  for (let k = 0; k < 36; k++) {
    const x = 272 + k * 18;
    const w = 16;
    if (x + w > BRIDGE_GAP.x && x < BRIDGE_GAP.x + BRIDGE_GAP.w) continue; // the missing planks
    const j = () => (r() - 0.5) * 4;
    const t0 = deckY(x) + j();
    const t1 = deckY(x + w) + j();
    const depth = 35 + r() * 5;
    const col = k % 5;
    deck.push(
      piece(poly([[x, t0], [x + w, t1], [x + w + (r() - 0.5) * 2, t1 + depth], [x, t0 + depth]]), browns[col], { edge: 'cut', fibre: false, shadow: false }),
      // the plank top, seen a touch from above
      piece(poly([[x - 1, t0 - 6], [x + w + 1, t1 - 6], [x + w, t1 + 1], [x, t0 + 1]]), tops[col], { edge: 'cut', fibre: false, shadow: false }),
      ink([[x + w / 2, t0 + 8], [x + w / 2 + (r() - 0.5) * 3, t0 + depth * 0.7]], { width: 1.6, color: '#4a3422', wobble: 0.4, opacity: 0.55 }),
    );
    if (k % 3 !== 1) deck.push(dot(x + 4, t0 + 5, 1.7, '#3b2a1c', 0.8), dot(x + w - 4, t1 + 5, 1.7, '#3b2a1c', 0.8));
  }

  // Rails: crooked posts and sagging ropes.
  const posts: Array<[number, number]> = [[292, 0], [380, 0], [470, -34], [545, 0], [645, 0], [720, 0], [805, 4], [895, 0]];
  const postTops: Pt[] = posts.map(([x, lean]) => [x + lean, deckY(x) - 92 + (lean ? 12 : 0)]);
  const railPosts: Node[] = posts.map(([x], i) =>
    piece(poly([[x - 5, deckY(x) + 6], [x + 5, deckY(x) + 6], [postTops[i][0] + 4, postTops[i][1]], [postTops[i][0] - 4, postTops[i][1]]]), i % 2 ? '#6a4c32' : '#7a5a3c', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
  );
  const ropes: Node[] = [];
  for (let i = 0; i < postTops.length - 1; i++) {
    const [a, b] = [postTops[i], postTops[i + 1]];
    const sag = i === 2 || i === 1 ? 24 : 14;
    ropes.push(ink([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag], b], { width: 3.4, color: '#d2b98a', wobble: 0.5 }));
    // a second, lower rope
    const a2: Pt = [a[0] + (posts[i][0] - a[0]) * 0.45, a[1] + (deckY(posts[i][0]) - a[1]) * 0.5];
    const b2: Pt = [b[0] + (posts[i + 1][0] - b[0]) * 0.45, b[1] + (deckY(posts[i + 1][0]) - b[1]) * 0.5];
    ropes.push(ink([a2, [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2 + sag * 0.6], b2], { width: 2.6, color: '#c3a878', wobble: 0.5, opacity: 0.9 }));
  }

  // The deck's underside beams, either side of the gap.
  const beam = (x0: number, x1: number): Node => {
    const pts: Pt[] = [];
    for (let x = x0; x <= x1; x += 40) pts.push([x, deckY(x) + 40]);
    pts.push([x1, deckY(x1) + 40]);
    return ink(pts, { width: 7, color: '#4a3524', wobble: 0.4 });
  };

  // The shadow under the deck, and the washing line with its big patched sock.
  const shadowTop: Pt[] = [];
  for (let x = 275; x <= 905; x += 35) shadowTop.push([x, deckY(x) + 36]);
  const underShadow = piece(curve([...shadowTop, [905, 668], [830, 672], [700, 666], [560, 670], [400, 666], [275, 668]], 1), '#2f2a3a', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.62 });
  const sock: Node[] = [
    ink([[418, 617], [470, 625], [522, 619], [572, 616]], { width: 2, color: '#4d3d2c', wobble: 0.3 }),
    piece(poly([[466, 622], [494, 624], [494, 640], [504, 646], [500, 654], [480, 656], [468, 648]]), '#d9824f', { edge: 'torn', rough: 0.4, fibre: false, shadow: false }),
    piece(rect(466, 622, 28, 6), '#f0e2c0', flat),
    piece(rect(474, 636, 11, 9, 2), '#7fa6c8', flat),
    ink([[474, 636], [485, 645]], { width: 1.2, color: '#5a4636', wobble: 0.2 }),
    dot(470, 621, 2.6, '#c9a14e'),
    dot(496, 621, 2.6, '#c9a14e'),
  ];

  return svg({ w: 1180, h: 820, name: 'wishing-troll-bridge', className: 'backdrop' }, [
    // Morning sky in soft torn bands.
    piece(rect(-20, -20, 1220, 860), '#a6cfe8', { edge: 'clean', shadow: false }),
    piece(rect(-20, 130, 1220, 400), '#b9dbef', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 260, 1220, 300), '#cfe7f2', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 360, 1220, 220), '#e2f1ee', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(circle(150, 120, 46), '#fff3c4', { ...flat, opacity: 0.9 }),
    piece(circle(150, 120, 72), '#fff3c4', { ...flat, opacity: 0.25 }),
    piece(ellipse(520, 150, 130, 24), C.white, { ...soft, opacity: 0.9 }),
    piece(ellipse(590, 128, 80, 18), C.white, { ...soft, opacity: 0.9 }),
    piece(ellipse(860, 230, 150, 22), C.white, { ...soft, opacity: 0.85 }),
    piece(ellipse(930, 210, 84, 15), C.white, { ...soft, opacity: 0.85 }),
    piece(ellipse(330, 290, 110, 16), C.white, { ...soft, opacity: 0.75 }),

    // Far blue-green hills in two layers.
    piece(curve([[-40, 470], [100, 420], [260, 410], [420, 450], [580, 430], [760, 450], [900, 410], [1060, 430], [1220, 410], [1220, 600], [-40, 600]], 3), '#9dbfb4', { ...soft, rough: 1.6 }),
    piece(curve([[-40, 520], [140, 490], [320, 500], [520, 470], [700, 500], [880, 480], [1060, 500], [1220, 490], [1220, 620], [-40, 620]], 3), '#8fb89a', { ...soft, rough: 1.6 }),
    // the far shore, a thin line of darker green behind the bridge
    piece(curve([[240, 640], [400, 626], [590, 632], [780, 626], [920, 640], [920, 670], [240, 670]], 2), '#6f9f70', soft),

    // The right-hand hill, with its path and three cottages.
    piece(curve([[850, 660], [880, 590], [930, 535], [1000, 495], [1060, 458], [1120, 430], [1190, 420], [1240, 420], [1240, 700], [850, 700]], 3), '#93be70', { ...soft, rough: 1.2 }),
    piece(curve([[960, 570], [1020, 520], [1100, 470], [1180, 450], [1180, 560], [1060, 600]], 3), '#a6cc7e', { ...soft, opacity: 0.7 }),
    ...cottage(938, 532, 1.1),
    ...cottage(1042, 478, 1),
    ...cottage(1132, 432, 0.9),
    piece(circle(990, 500, 12), '#6f9a5a', { ...flat, opacity: 0.85 }),
    piece(circle(1090, 448, 11), '#6f9a5a', { ...flat, opacity: 0.85 }),
    piece(circle(900, 560, 10), '#6f9a5a', { ...flat, opacity: 0.85 }),
    ink([[915, 640], [950, 610], [995, 590], [960, 568], [1000, 550], [1040, 530], [1010, 508], [1050, 494]], { width: 8, color: '#dccb98', wobble: 0.8, opacity: 0.9 }),

    // The river: calm blue-green water with soft ripple strokes.
    piece(rect(270, 650, 660, 200), '#6fb1b3', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    piece(rect(270, 730, 660, 120), '#62a5ac', { edge: 'torn', rough: 1.6, shadow: false, fibre: false, opacity: 0.8 }),
    piece(ellipse(590, 690, 150, 10), '#98d0cc', { ...flat, opacity: 0.35 }),
    ...([[330, 668, 54], [450, 676, 40], [660, 672, 50], [740, 664, 36], [860, 676, 40], [370, 704, 40], [820, 710, 44], [520, 712, 34]] as const).map(([x, y, w]) =>
      ink([[x, y], [x + w * 0.5, y - 2], [x + w, y]], { width: 2.4, color: '#c4e6e2', wobble: 0.5, opacity: 0.75 }),
    ),

    // Banks: the near one on the left, the far one on the right, then plain grass at the bottom.
    piece(curve([[-40, 560], [80, 540], [220, 556], [330, 600], [350, 660], [-40, 660]], 3), '#8cbb68', { ...soft, rough: 1.2 }),
    piece(curve([[-40, 646], [140, 640], [260, 640], [304, 654], [332, 690], [336, 750], [336, 840], [-40, 840]], 3), '#86b261', { ...soft, rough: 1.4 }),
    piece(curve([[-40, 700], [200, 690], [336, 720], [336, 840], [-40, 840]], 2), '#7aa656', { ...soft, rough: 1.4 }),
    piece(curve([[846, 700], [868, 654], [900, 640], [1000, 638], [1240, 638], [1240, 840], [846, 840]], 3), '#86b261', { ...soft, rough: 1.4 }),
    piece(curve([[846, 720], [900, 712], [1240, 704], [1240, 840], [846, 840]], 2), '#7aa656', { ...soft, rough: 1.4 }),
    // a little bush on the left bank, behind where friends stand
    piece(circle(60, 590, 38), '#6f9a5a', { ...flat, opacity: 0.9 }),
    piece(circle(104, 600, 30), '#7aa862', { ...flat, opacity: 0.9 }),
    // tufts and daisies
    ...[[40, 660], [150, 654], [290, 660], [60, 704], [940, 656], [1110, 654], [1000, 652], [1160, 700]].flatMap(([x, y]) => tuft(x, y, 0.8 + r() * 0.4, r() > 0.5 ? '#5f9a58' : '#a3cf8e')),
    ...[[100, 652], [240, 654], [310, 648], [980, 650], [1070, 660], [1140, 648]].flatMap(([x, y]) => [dot(x, y, 4, C.white), dot(x, y, 1.7, C.yellow)]),

    // Under the bridge: the troll's shady space, then the legs standing in the water.
    underShadow,
    ...trestle(400, deckY(400) + 36, 706),
    ...trestle(590, deckY(590) + 36, 708),
    ...trestle(780, deckY(780) + 36, 706),
    ...sock,
    ...[[400, 706], [590, 708], [780, 706]].map(([x, y]) => ink([[x - 40, y + 2], [x - 20, y - 2], [x, y + 1], [x + 20, y - 2], [x + 40, y + 2]], { width: 3, color: '#cfeae6', wobble: 0.5, opacity: 0.85 })),

    // The deck, with the notch where two planks are missing.
    beam(272, 556),
    beam(634, 908),
    piece(rect(BRIDGE_GAP.x, BRIDGE_GAP.y, BRIDGE_GAP.w, BRIDGE_GAP.h), '#2b2230', { edge: 'torn', rough: 0.6, shadow: false, fibre: false }),
    piece(rect(BRIDGE_GAP.x + 6, BRIDGE_GAP.y + 26, BRIDGE_GAP.w - 12, 18), '#1c1624', { edge: 'torn', rough: 0.6, shadow: false, fibre: false, opacity: 0.7 }),
    ...deck,
    // splintered stubs at the gap's edges
    piece(poly([[552, 602], [558, 600], [560, 590], [556, 580], [552, 586]]), '#5e4430', { edge: 'torn', rough: 0.8, shadow: false, fibre: false }),
    piece(poly([[632, 602], [640, 600], [638, 584], [630, 592]]), '#5e4430', { edge: 'torn', rough: 0.8, shadow: false, fibre: false }),
    ...railPosts,
    ...ropes,

    // Reeds and bulrushes at the water's edges.
    ...bulrush(322, 664, 56, -4),
    ...bulrush(338, 672, 44, 6),
    reed(310, 668, 40, -8),
    reed(330, 676, 36, 4),
    ...bulrush(884, 664, 52, 4),
    ...bulrush(868, 674, 40, -6),
    reed(896, 670, 38, 8),
    reed(860, 680, 32, -4),
  ]);
});

/** A new, pale, fresh board pair; placed at BRIDGE_GAP (x, y, w) it fills the gap. */
export const bridgePlank = cached(() => {
  const w = BRIDGE_GAP.w;
  const h = BRIDGE_GAP.h;
  const half = (x: number, bw: number, col: string): Node[] => [
    piece(rect(x, 0, bw, h), col, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x, 0, bw, 7), '#f3dcae', { edge: 'cut', fibre: false, shadow: false }),
    ink([[x + bw * 0.3, 12], [x + bw * 0.34, h - 4]], { width: 1.4, color: '#c4985c', wobble: 0.3, opacity: 0.8 }),
    ink([[x + bw * 0.66, 10], [x + bw * 0.62, h - 6]], { width: 1.4, color: '#c4985c', wobble: 0.3, opacity: 0.8 }),
    dot(x + 5, 15, 1.8, '#7a6a52'),
    dot(x + bw - 5, h - 8, 1.8, '#7a6a52'),
  ];
  return svg({ w, h, name: 'wishing-bridge-plank' }, [...half(0, w / 2 - 1, '#e6c48c'), ...half(w / 2 + 1, w / 2 - 1, '#ebcb96')]);
});

/** The old broken board: hinged at the top left, dangling down at an angle, with a jagged end. */
export const bridgePlankBroken = cached(() =>
  svg({ w: 90, h: 110, name: 'wishing-bridge-plank-broken' }, [
    piece(poly([[26, 1], [3, 12], [49, 88], [52, 101], [58, 94], [62, 104], [68, 92], [74, 99], [71, 86]]), '#5e4430', { edge: 'torn', rough: 0.7, fibre: false }),
    piece(poly([[24, 3], [5, 13], [46, 84], [56, 90], [70, 88], [50, 52]]), '#7b5a3a', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    ink([[22, 14], [28, 40], [24, 62], [32, 76]], { width: 1.8, color: '#3b2a1c', wobble: 0.4, opacity: 0.7 }),
    ink([[34, 38], [42, 32]], { width: 1.8, color: '#3b2a1c', wobble: 0.3, opacity: 0.7 }),
    dot(16, 12, 2, '#2f2218'),
    // pale splinters at the broken end
    ink([[58, 94], [60, 108]], { width: 2, color: '#c9a56c', wobble: 0.3 }),
    ink([[68, 92], [76, 106]], { width: 2, color: '#c9a56c', wobble: 0.3 }),
  ]),
);

/** A small stack of spare old boards on the grass, tied with rope: stand it with its bottom on the ground. */
export const bridgePlanks = cached(() => {
  const boards: Array<[number, number, number, string]> = [
    [8, 100, 196, '#7a5836'],
    [14, 84, 200, '#8a6440'],
    [4, 68, 204, '#6f4f32'],
    [12, 52, 192, '#85603c'],
    [18, 36, 184, '#7a5836'],
  ];
  return svg({ w: 220, h: 120, name: 'wishing-bridge-planks' }, [
    piece(ellipse(110, 114, 108, 7), '#4e6f3c', { ...flat, opacity: 0.45 }),
    ...boards.flatMap(([x, y, w, col], i) => [
      piece(rect(x, y, w, 16, 1), col, { edge: 'torn', rough: 0.5, fibre: false, shadow: i === 4 }),
      piece(rect(x, y, w, 4), '#b08a58', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
      ink([[x + 20, y + 10], [x + w * 0.5, y + 9], [x + w - 16, y + 11]], { width: 1.4, color: '#3f2d1e', wobble: 0.4, opacity: 0.5 }),
    ]),
    // the rope: two loops round the stack, with a knot
    piece(rect(62, 32, 9, 86, 2), '#d2b98a', { edge: 'torn', rough: 0.4, fibre: false, shadow: false }),
    piece(rect(150, 32, 9, 86, 2), '#d2b98a', { edge: 'torn', rough: 0.4, fibre: false, shadow: false }),
    piece(circle(66, 76, 6), '#c3a878', flat),
    ink([[66, 78], [58, 96], [54, 110]], { width: 3, color: '#c3a878', wobble: 0.3 }),
    ink([[66, 78], [76, 92], [78, 108]], { width: 3, color: '#c3a878', wobble: 0.3 }),
  ]);
});
