/**
 * The mermaid's cove: a sunny little cove at low tide, and four props for it.
 *
 * BACKDROP `mermaidCove` (1180 x 820). A soft blue summer sky with a warm
 * pale-gold sun and halo at the top left (170, 110) and a few flat clouds. A
 * grassy headland on the far left (x 0-250, top about y 232-262) slopes down
 * to the sea. The sea is far out: a calm blue-green strip from y 330 to y
 * 420 with a few white crests. Then shiny, darker WET sand (y 420-470) and
 * warm dry sand from y 470 to the bottom.
 *
 * On the right a tall grey-brown rocky outcrop (x 810-1180, top about y 150).
 * Three flat-topped rock STEPS climb its left side, measured as drawn:
 *   - step 1: top y 560, x 800-900
 *   - step 2: top y 460, x 860-960
 *   - the LEDGE: top y 350, x 930-1140, flat (the hoard sits on it)
 * Under the ledge is the dark mouth of Old Nipper's cave, a deep navy-black
 * rounded arch at x 960-1150, y 420-640 with a soft dark inside. In front of
 * it, on the sand, a small rock pool of blue-green water edged with pebbles
 * and seaweed (x 860-1150, y 625-675). Seaweed, limpets and barnacles dot
 * the rocks.
 *
 * Ground line y 640. The middle (x 220-820) is open flat sand with only a few
 * tiny shells near the edges: the chair lands there and three people stand
 * on it. The lower left (x 0-380, y 430-690) is bare sand, because the
 * cove-rock prop sits there with the mermaid behind it. The bottom band
 * (y 690-820) is plain sand with two faint ripple lines.
 *
 * PROPS
 *   coveRock (360 x 200): Pearl's rock. A big, wide, fully opaque rounded
 *     grey-brown rock, flat-ish top at y 40, filling the width at the bottom
 *     (y 200), with limpets, barnacles and green seaweed hanging down its front.
 *   coveTide (1300 x 300): the tide coming in. A scalloped white foam edge
 *     (y 0-40), then opaque blue-green sea in calm paler and darker torn
 *     bands with a few small crests.
 *   coveHoard (240 x 120): Old Nipper's heap of shiny junk (spoons, buttons,
 *     bottle tops, a teapot lid, a key, beads, a thimble, tinsel). Flat
 *     bottom at y 120; the top middle (x 90-150, y about 34) is kept flat for
 *     the comb.
 *   combGolden (140 x 70): the magic golden comb lying flat: curved top
 *     bar, fine teeth along the bottom (y 40-66), a white pearl set in the
 *     middle of the top (70, 19) and a shine highlight.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const soft = { edge: 'torn' as const, rough: 1.4, shadow: false, fibre: false as const };

const ROCK = '#8c8076';
const ROCK_LIGHT = '#aa9e90';
const ROCK_DARK = '#665c54';
const WEED = '#4f7e48';
const WEED_LIGHT = '#78a45a';
const LIMPET = '#d9cdb6';

/** A flat paper cloud. */
function cloud(cx: number, cy: number, w: number): Node[] {
  return [
    piece(ellipse(cx, cy + 6, w / 2, w * 0.07), C.cloudShade, { ...flat, opacity: 0.8 }),
    piece(ellipse(cx - w * 0.2, cy - 2, w * 0.28, w * 0.09), C.cloud, flat),
    piece(ellipse(cx + w * 0.1, cy - 8, w * 0.32, w * 0.12), C.cloud, flat),
    piece(ellipse(cx + w * 0.3, cy, w * 0.2, w * 0.07), C.cloud, flat),
  ];
}

/** A row of little white wave crests. */
function crests(x0: number, x1: number, y: number, w: number, seed: number, opacity = 0.9): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let x = x0 + r() * w; x < x1; x += w * (1.2 + r() * 0.8)) {
    const k = w * (0.8 + r() * 0.5);
    const pts: Pt[] = [[x - k / 2, y + 4], [x - k / 4, y - 3], [x, y - 5], [x + k / 4, y - 3], [x + k / 2, y + 4]];
    out.push(ink(pts, { width: 3, color: '#f2f7f4', wobble: 0.5, opacity }));
  }
  return out;
}

/** A hanging or standing wavy strand of seaweed from (x, y); dir 1 grows down, -1 grows up. */
function weed(x: number, y: number, len: number, dir: 1 | -1 = -1, col = WEED): Node[] {
  const strand = (dx: number, l: number, c: string): Node =>
    ink([[x + dx, y], [x + dx + 5, y + dir * l * 0.35], [x + dx - 4, y + dir * l * 0.7], [x + dx + 3, y + dir * l]], { width: 4, color: c, wobble: 0.3 });
  return [strand(-6, len * 0.8, col), strand(0, len, WEED_LIGHT), strand(6, len * 0.7, col)];
}

/** A limpet or barnacle: a small pale cone seen from the front. */
function limpet(x: number, y: number, s = 1): Node[] {
  return [
    piece(ellipse(x, y, 9 * s, 6 * s), LIMPET, { ...flat, opacity: 0.95 }),
    piece(ellipse(x, y - 1 * s, 4.5 * s, 3 * s), '#efe6d2', flat),
    ink([[x - 7 * s, y + 3 * s], [x + 7 * s, y + 3 * s]], { width: 1.6, color: '#7d7060', wobble: 0.2, opacity: 0.6 }),
  ];
}

/** A rock block with a flat, lit top face: (x, top) is the top-left corner. */
function block(x: number, top: number, w: number, h: number): Node[] {
  return [
    piece(rect(x, top, w, h, 14), ROCK, { edge: 'torn', rough: 0.8 }),
    piece(rect(x + 4, top + 16, w - 8, h - 16, 6), ROCK_DARK, { ...flat, edge: 'torn', rough: 0.6, opacity: 0.35 }),
    piece(poly([[x + 2, top + 1], [x + w - 2, top + 1], [x + w - 6, top + 15], [x + 6, top + 15]]), ROCK_LIGHT, { ...flat, edge: 'torn', rough: 0.5 }),
  ];
}

export const mermaidCove = cached(() => {
  const r = rng(9021);
  const nodes: Node[] = [
    // sky: soft blue, paler near the sea
    piece(rect(-20, -20, 1220, 860), '#8fc0e2', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 110, 1220, 240), '#a8d2ea', { ...soft, rough: 2 }),
    piece(rect(-20, 220, 1220, 130), '#c6e2ee', { ...soft, rough: 2 }),
    // the warm sun with a soft halo
    piece(circle(170, 110, 118), '#fff2c8', { ...flat, opacity: 0.3 }),
    piece(circle(170, 110, 86), '#fff2c8', { ...flat, opacity: 0.45 }),
    piece(circle(170, 110, 56), '#fbe39a', flat),
    ...cloud(480, 120, 260),
    ...cloud(720, 214, 170),
    ...cloud(340, 250, 130),
    ...cloud(1010, 100, 150),

    // the far sea strip, y 330-420
    piece(rect(-20, 330, 1220, 110), '#86c8cc', { ...soft, rough: 1.2 }),
    piece(rect(-20, 366, 1220, 74), '#6ab6c2', { ...soft, rough: 1.2 }),
    piece(rect(-20, 396, 1220, 44), '#58a6b8', { ...soft, rough: 1.2 }),
    ...crests(250, 900, 346, 30, 31, 0.75),
    ...crests(240, 900, 380, 42, 32, 0.8),
    ...crests(240, 900, 408, 50, 33, 0.7),
    piece(rect(-20, 326, 1220, 10), '#d4ecee', { ...soft, rough: 1, opacity: 0.55 }),

    // the grassy headland on the left, down to the sea
    piece(curve([[-30, 430], [-30, 250], [60, 234], [140, 240], [200, 266], [240, 330], [264, 430]], 2), ROCK_LIGHT, { edge: 'torn', rough: 0.9, shadow: false }),
    piece(curve([[-30, 430], [-30, 330], [80, 326], [190, 340], [236, 400], [250, 430]], 2), ROCK, { ...soft, rough: 0.9, opacity: 0.8 }),
    piece(curve([[-30, 336], [-30, 246], [60, 230], [140, 236], [200, 262], [228, 300], [150, 290], [60, 296]], 2), '#82b35e', { edge: 'torn', rough: 1, shadow: false, fibre: false }),
    piece(curve([[-30, 290], [-30, 246], [60, 232], [140, 238], [100, 262], [30, 272]], 2), '#9cc674', { ...soft, rough: 0.8, opacity: 0.8 }),
    ...[[40, 258], [110, 252], [170, 270]].flatMap(([x, y]) => [dot(x, y, 4, C.white), dot(x, y, 1.6, C.yellow)]),

    // wet sand, shiny and darker, then warm dry sand
    piece(rect(-20, 420, 1220, 420), '#b49b78', { ...soft, rough: 1.6 }),
    piece(rect(-20, 428, 1220, 40), '#a48c6a', { ...soft, rough: 1.2, opacity: 0.6 }),
    ...[[330, 440, 120], [560, 448, 150], [760, 438, 100], [120, 450, 90]].map(([x, y, w]) =>
      ink([[x, y], [x + w * 0.5, y - 2], [x + w, y]], { width: 3, color: '#e9ddc2', wobble: 0.4, opacity: 0.55 }),
    ),
    // a lacy foam line where the sea meets the wet sand
    ...crests(-10, 1190, 421, 56, 34, 0.85),
    piece(rect(-20, 470, 1220, 370), '#e4cd9f', { ...soft, rough: 2 }),
    piece(rect(-20, 600, 1220, 240), '#e8d2a4', { ...soft, rough: 2, opacity: 0.7 }),
    // a soft darker line where wet meets dry
    ink([[-10, 472], [300, 468], [620, 474], [900, 470], [1190, 474]], { width: 3, color: '#c9ae82', wobble: 1.2, opacity: 0.5 }),

    // faint ripples in the bottom band, and a few tiny shells and pebbles near the edges
    ...[[260, 748, 200], [640, 774, 260], [30, 716, 160], [900, 720, 180]].map(([x, y, w]) =>
      ink([[x, y], [x + w * 0.3, y - 3], [x + w * 0.65, y + 2], [x + w, y - 1]], { width: 2.2, color: '#d1b685', wobble: 0.6, opacity: 0.55 }),
    ),
    ...[[250, 548], [300, 600], [766, 530], [780, 618], [244, 650]].map(([x, y]) =>
      piece(ellipse(x, y, 7 + r() * 3, 4.5), '#c9b590', { ...flat, opacity: 0.85 }),
    ),
    piece(ellipse(790, 572, 8, 6), '#f2cdb8', flat),
    ink([[781, 572], [790, 566], [799, 572]], { width: 1.6, color: '#d9a48c', wobble: 0.2 }),
    piece(ellipse(236, 586, 8, 6), '#f4ead6', flat),
    ink([[228, 586], [236, 580], [244, 586]], { width: 1.6, color: '#c9b9a0', wobble: 0.2 }),

    // ---- the rocky outcrop on the right ----
    piece(ellipse(1000, 664, 230, 16), '#a88f6a', { ...flat, opacity: 0.5 }),
    // the tall back of the rock
    piece(curve([[930, 668], [926, 340], [944, 250], [1000, 184], [1090, 152], [1200, 150], [1250, 180], [1250, 668]], 2), ROCK, { edge: 'torn', rough: 1.2 }),
    piece(curve([[960, 330], [972, 250], [1020, 200], [1080, 172], [1070, 214], [1030, 260], [1010, 330]], 2), ROCK_LIGHT, { ...soft, rough: 0.9, opacity: 0.8 }),
    piece(curve([[1130, 190], [1190, 180], [1230, 230], [1230, 330], [1160, 300], [1140, 240]], 2), ROCK_DARK, { ...soft, rough: 0.9, opacity: 0.45 }),
    // cracks
    ink([[1060, 210], [1070, 250], [1056, 290], [1066, 330]], { width: 2.6, color: ROCK_DARK, wobble: 0.5, opacity: 0.6 }),
    ink([[1150, 240], [1138, 280], [1150, 320]], { width: 2.4, color: ROCK_DARK, wobble: 0.5, opacity: 0.6 }),
    // the face under the ledge, with the cave cut into it
    piece(curve([[930, 650], [928, 366], [1150, 366], [1180, 400], [1190, 650]], 1), '#7c7068', { edge: 'torn', rough: 1 }),
    // a ledge slab: top at y 350, x 930-1140
    ...block(930, 350, 210, 40),
    // the cave mouth: a rounded arch, x 960-1150, y 420-640
    piece(curve([[950, 650], [954, 470], [1000, 410], [1055, 398], [1110, 410], [1156, 470], [1160, 650]], 3), '#5a5048', { edge: 'torn', rough: 0.9, shadow: false }),
    piece(curve([[960, 644], [964, 480], [1006, 428], [1055, 420], [1104, 428], [1146, 480], [1150, 644]], 3), '#1d2238', { edge: 'torn', rough: 0.6, shadow: false }),
    piece(curve([[990, 640], [994, 510], [1024, 462], [1056, 454], [1088, 462], [1120, 510], [1126, 640]], 3), '#0f1224', { edge: 'torn', rough: 0.5, shadow: false, fibre: false }),
    piece(ellipse(1056, 560, 52, 70), '#070914', { ...flat, opacity: 0.7 }),
    // stones round the mouth
    ...[[958, 560], [966, 500], [992, 450], [1030, 420], [1080, 416], [1124, 440], [1148, 490], [1158, 560]].map(([x, y], i) =>
      piece(ellipse(x, y, 16, 14), i % 2 ? ROCK_LIGHT : ROCK, { edge: 'torn', rough: 0.6 }),
    ),
    // right-hand flank of the rock beside the cave
    piece(curve([[1150, 440], [1180, 440], [1200, 560], [1200, 660], [1150, 660]], 2), '#74685f', { ...soft, rough: 0.9, opacity: 0.9 }),

    // the steps up the left side: step 2 (top 460, x 860-960) behind step 1 (top 560, x 800-900)
    ...block(860, 460, 100, 200),
    ...block(800, 560, 100, 102),
    piece(ellipse(850, 664, 70, 8), '#a88f6a', { ...flat, opacity: 0.55 }),
    piece(ellipse(910, 664, 60, 8), '#a88f6a', { ...flat, opacity: 0.45 }),

    // limpets and barnacles
    ...limpet(884, 520, 0.9),
    ...limpet(930, 500, 0.8),
    ...limpet(826, 616, 0.9),
    ...limpet(870, 626, 0.8),
    ...limpet(960, 392, 0.8),
    ...limpet(1100, 372, 0.7),
    ...limpet(1170, 300, 0.9),
    ...limpet(1000, 290, 0.8),
    ...limpet(1172, 600, 0.9),
    ...limpet(1176, 520, 0.8),
    // seaweed tufts
    ...weed(812, 662, 26, -1),
    ...weed(950, 660, 30, -1),
    ...weed(944, 395, 24, 1),
    ...weed(1060, 392, 22, 1),
    ...weed(1130, 392, 24, 1),
    ...weed(1180, 662, 34, -1),
    ...weed(890, 562, 20, -1),

    // the little rock pool in front of the cave, x 860-1150, y 625-675
    piece(ellipse(1005, 650, 150, 27), '#8f7f6c', { edge: 'torn', rough: 0.8, shadow: false }),
    piece(ellipse(1005, 650, 142, 22), '#5aaab4', { edge: 'torn', rough: 0.6, shadow: false, fibre: false }),
    piece(ellipse(1005, 654, 108, 14), '#3f8fa2', { ...flat, opacity: 0.55 }),
    ink([[930, 644], [960, 640], [1000, 644]], { width: 2.4, color: '#e6f5f1', wobble: 0.4, opacity: 0.8 }),
    ink([[1040, 658], [1070, 654], [1100, 658]], { width: 2.4, color: '#e6f5f1', wobble: 0.4, opacity: 0.7 }),
    ...[[868, 650], [884, 668], [910, 676], [950, 678], [1000, 680], [1050, 678], [1100, 672], [1130, 662], [1146, 648], [1128, 630], [1096, 626], [900, 630], [940, 627]].map(([x, y], i) =>
      piece(ellipse(x, y, 8 + (i % 3) * 2, 5.5), i % 2 ? '#b6a894' : '#9a8d7c', { edge: 'torn', rough: 0.4, shadow: false }),
    ),
    ...weed(872, 650, 22, -1),
    ...weed(1140, 646, 22, -1),
  ];
  return svg({ w: W, h: H, name: 'wishing-mermaid-cove', className: 'backdrop' }, nodes);
});

/** Pearl's rock: wide, rounded and opaque, laid over the mermaid. */
export const coveRock = cached(() => {
  const nodes: Node[] = [
    piece(curve([[2, 200], [0, 150], [14, 96], [60, 54], [130, 40], [230, 40], [300, 56], [346, 100], [360, 152], [358, 200]], 2), ROCK, { edge: 'torn', rough: 0.9, shadow: false }),
    // the flat, lit top
    piece(curve([[50, 78], [80, 52], [140, 42], [230, 42], [290, 58], [320, 84], [250, 70], [140, 68]], 2), ROCK_LIGHT, { ...flat, edge: 'torn', rough: 0.6 }),
    // a shaded lower belly
    piece(curve([[4, 200], [8, 150], [60, 130], [180, 138], [300, 128], [352, 152], [356, 200]], 2), ROCK_DARK, { ...flat, edge: 'torn', rough: 0.7, opacity: 0.45 }),
    piece(curve([[40, 120], [100, 98], [160, 112], [110, 150]], 2), ROCK_LIGHT, { ...flat, edge: 'torn', rough: 0.6, opacity: 0.5 }),
    ink([[220, 90], [236, 120], [226, 150], [240, 176]], { width: 2.6, color: ROCK_DARK, wobble: 0.5, opacity: 0.6 }),
    ink([[84, 140], [96, 164], [90, 190]], { width: 2.4, color: ROCK_DARK, wobble: 0.5, opacity: 0.5 }),
    // seaweed hanging down the front, from the shoulders of the rock
    ...weed(40, 112, 70, 1),
    ...weed(96, 140, 44, 1),
    ...weed(268, 100, 74, 1),
    ...weed(318, 130, 46, 1),
    ...weed(180, 150, 40, 1),
    // limpets and barnacles
    ...limpet(30, 160, 1.1),
    ...limpet(120, 90, 1),
    ...limpet(150, 170, 1.2),
    ...limpet(210, 130, 1),
    ...limpet(250, 178, 1.1),
    ...limpet(330, 176, 1),
    ...limpet(300, 80, 0.9),
    ...limpet(70, 186, 0.9),
  ];
  return svg({ w: 360, h: 200, name: 'wishing-cove-rock' }, nodes);
});

/** The tide coming in: foam on top, calm bands below. */
export const coveTide = cached(() => {
  const nodes: Node[] = [
    piece(rect(-10, 24, 1320, 290), '#4fa8b4', { edge: 'torn', rough: 0.6, shadow: false, fibre: false }),
    piece(rect(-10, 84, 1320, 240), '#68bcc0', { ...soft, rough: 1.2 }),
    piece(rect(-10, 150, 1320, 170), '#46a0ae', { ...soft, rough: 1.2 }),
    piece(rect(-10, 214, 1320, 110), '#5db4bc', { ...soft, rough: 1.2 }),
    piece(rect(-10, 268, 1320, 60), '#4297a8', { ...soft, rough: 1.2 }),
    ...crests(0, 1300, 106, 60, 41, 0.8),
    ...crests(0, 1300, 176, 76, 42, 0.65),
    ...crests(0, 1300, 240, 90, 43, 0.5),
    // the foam: a white sheet with a scalloped edge, then a lacy second row
    piece(rect(-10, 4, 1320, 22), '#f4f9f6', { edge: 'torn', rough: 0.5, shadow: false, fibre: false }),
    ...Array.from({ length: 24 }, (_, i) => piece(ellipse(i * 56 + 14, 24, 32, 16), '#f4f9f6', { ...flat, edge: 'torn', rough: 0.4 })),
    ...Array.from({ length: 24 }, (_, i) => piece(ellipse(i * 56 + 42, 32, 24, 9), '#dff0ee', { ...flat, edge: 'torn', rough: 0.4, opacity: 0.9 })),
  ];
  return svg({ w: 1300, h: 300, name: 'wishing-cove-tide' }, nodes);
});

/** A heap of shiny junk-treasure. */
export const coveHoard = cached(() => {
  const spoon = (x: number, y: number, rot: number): Node[] => [
    piece(ellipse(x, y, 12, 8, rot), '#d9dee2', { ...flat, edge: 'cut' }),
    ink([[x - 12 * Math.cos((rot * Math.PI) / 180), y - 12 * Math.sin((rot * Math.PI) / 180)], [x - 34 * Math.cos((rot * Math.PI) / 180), y - 34 * Math.sin((rot * Math.PI) / 180)]], { width: 5, color: '#c3cad0', wobble: 0.2 }),
    dot(x + 3, y - 2, 2.4, '#ffffff', 0.95),
  ];
  const button = (x: number, y: number, col: string): Node[] => [
    piece(circle(x, y, 9), col, flat),
    dot(x - 2.5, y - 1, 1.6, '#4a4038'),
    dot(x + 2.5, y + 1, 1.6, '#4a4038'),
    dot(x - 3, y - 4, 1.8, '#ffffff', 0.9),
  ];
  const cap = (x: number, y: number, col: string): Node[] => [
    piece(circle(x, y, 10), col, flat),
    piece(circle(x, y, 6), '#ffffff', { ...flat, opacity: 0.35 }),
    dot(x - 4, y - 4, 2, '#ffffff', 0.95),
  ];
  const nodes: Node[] = [
    piece(curve([[6, 118], [10, 90], [40, 62], [80, 44], [100, 38], [140, 38], [160, 44], [200, 62], [232, 92], [236, 118]], 1), '#9aa3ab', { edge: 'torn', rough: 0.7, shadow: false }),
    piece(curve([[16, 118], [24, 94], [56, 70], [100, 52], [150, 52], [190, 66], [222, 94], [226, 118]], 1), '#b9c1c8', { ...flat, edge: 'torn', rough: 0.5, opacity: 0.9 }),
    // tinsel across the back
    ink([[20, 96], [34, 84], [44, 94], [58, 76], [68, 88], [84, 62], [92, 74]], { width: 3, color: '#e6c14f', wobble: 0.3 }),
    ink([[150, 66], [162, 78], [172, 64], [186, 82], [196, 70], [214, 94]], { width: 3, color: '#d96b8a', wobble: 0.3 }),
    ...spoon(48, 78, 200),
    ...spoon(190, 82, -20),
    // the teapot lid with its knob
    piece(ellipse(116, 66, 26, 10), '#e8ecee', flat),
    piece(ellipse(116, 64, 18, 6), '#f6f8f8', flat),
    piece(circle(116, 56, 5), '#c9a14e', flat),
    ...button(32, 108, '#d96b5a'),
    ...button(70, 104, '#4f78a8'),
    ...button(196, 108, '#e8c45a'),
    ...button(160, 96, '#8f5fa6'),
    ...cap(100, 96, '#c0392f'),
    ...cap(208, 96, '#4f9aa8'),
    ...cap(134, 108, '#e8c45a'),
    // a little key
    piece(circle(52, 100, 7), '#d8a43f', flat),
    piece(circle(52, 100, 3), '#9aa3ab', flat),
    ink([[58, 104], [84, 114]], { width: 4, color: '#c8922f', wobble: 0.2 }),
    ink([[76, 112], [76, 118]], { width: 3.5, color: '#c8922f', wobble: 0.1 }),
    ink([[84, 114], [84, 119]], { width: 3.5, color: '#c8922f', wobble: 0.1 }),
    // glass beads
    dot(22, 100, 5, '#5ab4c8', 0.95),
    dot(176, 70, 5, '#e0688c', 0.95),
    dot(222, 104, 5, '#8ac878', 0.95),
    dot(124, 86, 4.5, '#a98ae0', 0.95),
    // a thimble
    piece(poly([[170, 100], [172, 88], [188, 88], [190, 100]]), '#e0e4e6', { ...flat, edge: 'cut' }),
    ...[[176, 93], [182, 93], [177, 97], [184, 97]].map(([x, y]) => dot(x, y, 1.1, '#9aa3ab')),
    // glints
    ...[[30, 82], [60, 62], [90, 52], [150, 50], [200, 76], [220, 98], [112, 100], [172, 60], [140, 76]].map(([x, y], i) => dot(x, y, 2 + (i % 3) * 0.5, '#ffffff', 0.95)),
  ];
  return svg({ w: 240, h: 120, name: 'wishing-cove-hoard' }, nodes);
});

/** The magic golden comb, lying flat, teeth down. */
export const combGolden = cached(() => {
  const teeth = Array.from({ length: 11 }, (_, i) => 10 + i * 12);
  const nodes: Node[] = [
    // teeth, each a little rounded tongue of gold
    ...teeth.map((x) => piece(rect(x - 3.5, 36, 7, 30, 3), '#d8a43f', { ...flat, edge: 'cut' })),
    ...teeth.map((x) => ink([[x + 1, 42], [x + 1, 62]], { width: 1.6, color: '#f6dc8a', wobble: 0.1, opacity: 0.8 })),
    // the curved top bar
    piece(poly([[2, 46], [10, 28], [34, 14], [70, 8], [106, 14], [130, 28], [138, 46], [120, 42], [104, 36], [70, 32], [36, 36], [20, 42]]), '#e8b84a', { edge: 'cut', rough: 0.4, shadow: false }),
    piece(poly([[8, 38], [18, 26], [40, 17], [70, 12], [60, 17], [34, 24], [16, 36]]), '#f8de8a', { ...flat, opacity: 0.95 }),
    ink([[14, 40], [40, 36], [70, 33], [100, 36], [126, 40]], { width: 2.2, color: '#b98a2c', wobble: 0.2, opacity: 0.8 }),
    // the pearl set in the middle of the top
    piece(circle(70, 20, 9.5), '#c08a2c', flat),
    piece(circle(70, 20, 7.5), '#fbf8f0', flat),
    dot(67, 17, 2.4, '#ffffff'),
    // the shine
    ink([[30, 20], [46, 14]], { width: 3, color: '#fffbe6', wobble: 0.1, opacity: 0.9 }),
    ink([[100, 16], [114, 22]], { width: 2.4, color: '#fffbe6', wobble: 0.1, opacity: 0.8 }),
  ];
  return svg({ w: 140, h: 70, name: 'wishing-comb-golden' }, nodes);
});
