/**
 * Dragon Hill: a green hill under a soft evening sky, where a young dragon
 * lives. A pale sun sinks behind far lavender hills; far below on the left, a
 * tiny village of round thatched cottages sits in the valley; on the right,
 * a rocky mound has a big dark cave mouth under a rough stone arch. A
 * trodden path winds from the cave across open grass, with a few boulders
 * and tufts of grass about. Warm and calm; the cave is dark but the hill is
 * not.
 *
 * Ground line y 640. Open ground is x 250-900. Painted in (they can't move):
 *   - the cave mouth, x 845-1075, y 380-640; its dark middle is about (960, 520)
 *   - a big boulder at x 600-790, top y 520, base y 650: friends can crouch
 *     on its left (x 400-580) with it between them and the cave
 *   - two small boulders at x 40-150 and x 1085-1170
 *   - the village, six cottages, x 30-290, bases y 495-530. The fifth one
 *     (the roof at VILLAGE_SCORCH) is where a cartoon can lay a scorch mark.
 * The bottom band (y 690-820) is plain grass.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../art/paper';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** Where the far village's fifth cottage has its thatch (centre of the roof, stage point) and its width, for a scorch patch. */
export const VILLAGE_SCORCH = { x: 262, y: 494, w: 43 } as const;

/** The cave's dark middle, where eyes can open (stage point). */
export const CAVE_DARK = { x: 960, y: 520 } as const;

/** A tiny round thatched cottage whose base is at (x, base). */
function cottage(x: number, base: number, s = 1): Node[] {
  return [
    piece(ellipse(x, base - 14 * s, 17 * s, 15 * s), '#efe3c8', { edge: 'cut', fibre: false, shadow: false }),
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

/** A rounded boulder with a pale lit side and a dark shaded base; (x, base) is the bottom middle. */
function boulder(x: number, base: number, w: number, h: number): Node[] {
  return [
    piece(curve([[x - w / 2, base], [x - w * 0.5, base - h * 0.5], [x - w * 0.3, base - h * 0.92], [x + w * 0.05, base - h], [x + w * 0.38, base - h * 0.84], [x + w * 0.52, base - h * 0.4], [x + w / 2, base]], 2), '#8a8076', { edge: 'torn', rough: 0.7 }),
    piece(curve([[x - w * 0.4, base - h * 0.5], [x - w * 0.26, base - h * 0.84], [x + w * 0.04, base - h * 0.92], [x - w * 0.06, base - h * 0.6]], 2), '#a8a094', { ...flat, edge: 'torn', rough: 0.6, opacity: 0.85 }),
    piece(curve([[x - w * 0.48, base], [x - w * 0.4, base - h * 0.2], [x + w * 0.45, base - h * 0.24], [x + w * 0.5, base]], 2), '#6a6159', { ...flat, edge: 'torn', rough: 0.6, opacity: 0.7 }),
    ink([[x + w * 0.1, base - h * 0.6], [x + w * 0.2, base - h * 0.4], [x + w * 0.14, base - h * 0.3]], { width: 2.4, color: '#5a5149', wobble: 0.4, opacity: 0.7 }),
  ];
}

export const dragonHill = cached(() => {
  const r = rng(4242);
  return svg({ w: 1180, h: 820, name: 'wishing-dragon-hill', className: 'backdrop' }, [
    // Evening sky in soft torn bands: lavender, rose, peach, then a pale gold glow low down.
    piece(rect(-20, -20, 1220, 860), '#9aa6cf', { edge: 'clean', shadow: false }),
    piece(rect(-20, 120, 1220, 340), '#b7aed0', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 230, 1220, 260), '#e2b2b8', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 320, 1220, 200), '#f3c294', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(ellipse(520, 430, 400, 60), '#f8dca0', { ...flat, opacity: 0.8 }),
    // a pale sun sinking behind the far hills, and a couple of soft pink clouds
    piece(circle(520, 410, 74), '#fbe6b0', { ...flat, opacity: 0.95 }),
    piece(circle(520, 410, 104), '#fbe6b0', { ...flat, opacity: 0.25 }),
    piece(ellipse(250, 170, 130, 22), '#f4d2d0', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.85 }),
    piece(ellipse(310, 150, 80, 16), '#f9e4de', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.85 }),
    piece(ellipse(760, 250, 150, 20), '#f4d2d0', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.8 }),
    piece(ellipse(840, 232, 90, 14), '#f9e4de', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.8 }),
    piece(ellipse(1040, 120, 100, 16), '#d9d0e6', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.7 }),
    ...[[90, 60], [640, 40], [960, 70]].map(([x, y]) => dot(x, y, 2.4, '#f8ecd0', 0.8)),

    // Far lavender hills in two layers.
    piece(curve([[-40, 470], [60, 430], [200, 410], [340, 440], [470, 420], [620, 400], [790, 430], [940, 410], [1100, 440], [1220, 430], [1220, 560], [-40, 560]], 3), '#a89cc0', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    piece(curve([[-40, 500], [120, 470], [300, 480], [520, 450], [700, 478], [900, 458], [1100, 480], [1220, 470], [1220, 580], [-40, 580]], 3), '#a2b79e', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),

    // The valley on the left with its tiny village, far below.
    piece(curve([[-40, 480], [100, 466], [260, 486], [330, 520], [330, 580], [-40, 580]], 3), '#9ec088', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    piece(ellipse(160, 520, 150, 12), '#7fa070', { ...flat, opacity: 0.45 }),
    ...cottage(52, 518, 0.9),
    ...cottage(104, 504, 0.8),
    ...cottage(156, 520, 1),
    ...cottage(212, 508, 0.85),
    ...cottage(262, 528, 0.9),
    ...cottage(128, 530, 0.8),
    ...[[30, 470], [70, 466], [186, 474], [236, 480], [282, 500]].map(([x, y]) => piece(circle(x, y, 9 + r() * 4), '#6f9a5a', { ...flat, opacity: 0.8 })),
    // a path of little lamps from the village up the hill is left to the script; a winding lane here
    ink([[40, 540], [120, 534], [200, 540], [270, 556], [330, 590]], { width: 5, color: '#d3bf8d', wobble: 0.8, opacity: 0.8 }),

    // The rocky mound on the right, with its cave.
    piece(curve([[690, 700], [740, 520], [800, 380], [880, 290], [980, 250], [1090, 280], [1180, 330], [1240, 450], [1240, 700]], 3), '#7d716a', { edge: 'torn', rough: 1.2 }),
    piece(curve([[790, 520], [830, 400], [900, 320], [980, 290], [1060, 306], [1000, 340], [920, 380], [860, 480], [830, 600]], 3), '#9a8f86', { edge: 'torn', rough: 1, shadow: false, fibre: false, opacity: 0.8 }),
    piece(curve([[1100, 360], [1160, 400], [1200, 520], [1200, 680], [1130, 640], [1120, 500]], 2), '#665b55', { edge: 'torn', rough: 1, shadow: false, fibre: false, opacity: 0.7 }),
    // grassy cap on the mound
    piece(curve([[830, 332], [900, 280], [990, 252], [1080, 276], [1030, 300], [940, 304], [870, 350]], 2), '#8fbb6c', { edge: 'torn', rough: 1, shadow: false, fibre: false }),
    // the arch of stones round the opening
    piece(curve([[826, 650], [830, 500], [870, 410], [960, 366], [1050, 410], [1090, 500], [1094, 650]], 3), '#a39a8e', { edge: 'torn', rough: 0.9 }),
    ...[[836, 560, 30, 48], [842, 490, 34, 44], [868, 428, 36, 40], [912, 392, 38, 34], [964, 378, 40, 30], [1016, 392, 38, 34], [1056, 430, 36, 40], [1080, 494, 34, 44], [1086, 560, 30, 48]].map(([x, y, w, h], i) =>
      piece(rect(x - w / 2, y - h / 2, w, h, 8), i % 2 ? '#b3aa9c' : '#8c8378', { edge: 'torn', rough: 0.7 }),
    ),
    // the dark mouth, and a darker deep inside
    piece(curve([[852, 650], [856, 510], [890, 430], [960, 396], [1030, 430], [1066, 510], [1070, 650]], 3), '#2a2230', { edge: 'torn', rough: 0.6, shadow: false }),
    piece(curve([[884, 650], [888, 530], [916, 466], [960, 440], [1004, 466], [1032, 530], [1038, 650]], 3), '#17121c', { edge: 'torn', rough: 0.6, shadow: false, fibre: false }),
    // scuffed ground at the cave's foot
    piece(ellipse(960, 650, 150, 16), '#6e5f4a', { ...flat, opacity: 0.7 }),

    // The green hill underfoot, brighter in the middle, darker at the edges.
    piece(curve([[-40, 640], [-40, 560], [120, 548], [300, 556], [480, 540], [660, 548], [800, 600], [1000, 640], [1240, 650], [1240, 840], [-40, 840]], 3), '#86b261', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    piece(curve([[100, 640], [300, 590], [520, 580], [700, 600], [820, 640], [600, 700], [300, 700]], 3), '#9cc674', { edge: 'torn', rough: 1.4, shadow: false, fibre: false, opacity: 0.8 }),
    piece(rect(-20, 700, 1220, 140), '#7aa656', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    // a trodden path from the cave mouth out across the grass
    piece(curve([[900, 650], [800, 624], [640, 620], [480, 636], [330, 660], [200, 700], [300, 720], [520, 690], [700, 676], [860, 690], [1010, 668]], 3), '#cdb882', { edge: 'torn', rough: 1.4, shadow: false, fibre: false, opacity: 0.8 }),
    // grass tufts, daisies
    ...[[210, 610], [330, 600], [470, 596], [570, 604], [830, 612], [1120, 640], [60, 650], [160, 690], [260, 640], [540, 650], [820, 660], [1010, 700]].flatMap(([x, y]) => tuft(x, y, 0.9 + r() * 0.5, r() > 0.5 ? '#5f9a58' : '#a3cf8e')),
    ...[[250, 640], [410, 612], [540, 640], [760, 660], [90, 610], [1130, 600]].flatMap(([x, y]) => [dot(x, y, 4.2, C.white), dot(x, y, 1.8, C.yellow)]),

    // Boulders: a big one by the path (a place to hide), and two small ones at the edges.
    ...boulder(695, 652, 190, 130),
    ...boulder(96, 656, 110, 70),
    ...boulder(1130, 662, 100, 62),
  ]);
});
