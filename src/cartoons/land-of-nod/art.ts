/**
 * One-off art for The Land of Nod: the glittery grains of sleepy-sand, the
 * sand on the chair's cushion, Peter's hanky, Old Dozy's broom, the swept
 * heap, Mollie's ribbon, the tickly feather, the twist of best-dreams sand,
 * and the sunset through the playroom's window and doors.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** One grain of sleepy-sand: a tiny gold four-pointed twinkle. 30 × 30. */
export const grain = cached(() =>
  svg({ w: 30, h: 30, name: 'land-of-nod-grain' }, [
    piece(circle(15, 15, 10), '#fff2b0', { ...flat, opacity: 0.35 }),
    piece(poly([[15, 2], [18, 12], [28, 15], [18, 18], [15, 28], [12, 18], [2, 15], [12, 12]]), '#f6d860', { edge: 'clean', shadow: false }),
    dot(15, 15, 2.4, '#fffbe6'),
  ]),
);

/** A glittery dusting of sleepy-sand lying on the chair's cushion. 200 × 60. */
export const cushionSand = cached(() =>
  svg({ w: 200, h: 60, name: 'land-of-nod-cushion-sand' }, [
    piece(ellipse(100, 34, 92, 18), '#f2d77a', { edge: 'torn', rough: 1.2, fibre: false, shadow: false, opacity: 0.9 }),
    piece(ellipse(80, 30, 46, 10), '#f8e7a4', { ...flat, opacity: 0.8 }),
    ...[[30, 32], [56, 24], [88, 38], [120, 26], [150, 36], [172, 30], [104, 30], [64, 40]].map(([x, y]) => dot(x, y, 2.6, '#fffbe6')),
  ]),
);

/** Peter's hanky: a white handkerchief with a blue check border, crumpled in a hand-sized bunch. 110 × 90. */
export const hanky = cached(() =>
  svg({ w: 110, h: 90, name: 'land-of-nod-hanky', label: 'A hanky' }, [
    piece(poly([[10, 30], [46, 6], [100, 18], [92, 64], [56, 86], [14, 70]]), C.white),
    ink([[16, 34], [48, 12], [94, 22]], { width: 4, color: C.blue, opacity: 0.8 }),
    ink([[20, 66], [56, 80], [88, 62]], { width: 4, color: C.blue, opacity: 0.8 }),
    ink([[40, 30], [58, 50], [52, 70]], { width: 2, color: C.stone, opacity: 0.5 }),
  ]),
);

/** Old Dozy's broom: a long wooden handle and a bushy straw head at the bottom (part `head` swishes). 90 × 260. */
export const broom = cached(() =>
  svg({ w: 90, h: 260, name: 'land-of-nod-broom', label: 'A broom' }, [
    ink([[46, 6], [44, 190]], { width: 9, color: C.wood, wobble: 0.6 }),
    group({ part: 'head', origin: [45, 190] }, [
      piece(rect(30, 180, 30, 18, 4), '#9a82c0', flat),
      piece(poly([[28, 196], [62, 196], [84, 254], [6, 254]]), C.honey),
      ...[18, 32, 46, 60, 72].map((x) => ink([[45 + (x - 45) * 0.4, 200], [x, 250]], { width: 2, color: C.honeyDark, opacity: 0.7 })),
    ]),
  ]),
);

/** The swept heap of sleepy-sand: a glittery gold mound. 180 × 90. */
export const heap = cached(() =>
  svg({ w: 180, h: 90, name: 'land-of-nod-heap', label: 'A heap of sand' }, [
    piece(ellipse(90, 82, 86, 8), '#7c6aa6', { ...flat, opacity: 0.3 }),
    piece(curve([[6, 84], [30, 54], [70, 20], [96, 14], [130, 30], [168, 70], [176, 86]], 2), '#f0d06a'),
    piece(curve([[44, 60], [76, 28], [100, 24], [120, 40], [100, 52]], 2), '#f8e39a', { ...flat, opacity: 0.85 }),
    ...[[40, 70], [64, 50], [90, 30], [116, 46], [140, 66], [100, 66], [76, 74], [128, 78], [56, 80]].map(([x, y]) => dot(x, y, 2.8, '#fffbe6')),
  ]),
);

/** Mollie's blue hair ribbon, pulled out of her plait: a loose wavy strip. 120 × 50. */
export const ribbon = cached(() =>
  svg({ w: 120, h: 50, name: 'land-of-nod-ribbon', label: 'A blue ribbon' }, [
    ink([[6, 30], [30, 14], [56, 30], [84, 16], [114, 26]], { width: 12, color: '#4a78c8', wobble: 0.4 }),
    ink([[10, 26], [30, 12], [54, 26]], { width: 3, color: '#7aa2e0', opacity: 0.8 }),
  ]),
);

/** A long soft curly feather from Old Dozy's pillow. 70 × 170. */
export const feather = cached(() =>
  svg({ w: 70, h: 170, name: 'land-of-nod-feather', label: 'A feather' }, [
    piece(curve([[36, 8], [58, 40], [60, 90], [44, 140], [36, 150], [24, 120], [14, 70], [20, 28]], 2), C.cream),
    piece(curve([[36, 20], [50, 50], [48, 100], [38, 130], [30, 100], [24, 56]], 2), C.lilac, { ...flat, opacity: 0.45 }),
    ink([[36, 12], [38, 80], [36, 166]], { width: 2.6, color: C.stone }),
    ...[40, 60, 80, 100, 120].map((y) => ink([[37, y], [52, y - 12]], { width: 1.4, color: C.stone, opacity: 0.5 })),
  ]),
);

/** A little twist of lilac paper holding a pinch of the best-dreams sand, glittering at its top. 80 × 100. */
export const twist = cached(() =>
  svg({ w: 80, h: 100, name: 'land-of-nod-twist', label: 'A twist of sand' }, [
    piece(poly([[14, 34], [66, 34], [44, 96], [36, 96]]), C.lilac),
    ink([[24, 40], [38, 92]], { width: 2, color: '#8a6fa8', opacity: 0.6 }),
    piece(ellipse(40, 32, 27, 9), '#f2d77a', { edge: 'torn', rough: 0.8, fibre: false, shadow: false }),
    dot(30, 30, 2.4, '#fffbe6'),
    dot(46, 28, 2.4, '#fffbe6'),
    piece(poly([[40, 4], [43, 14], [53, 17], [43, 20], [40, 30], [37, 20], [27, 17], [37, 14]]), '#f6d860', { edge: 'clean', shadow: false }),
  ]),
);

/** A sunset sky for one opening of the playroom: rose and gold low down, the first star high up. */
function sunset(w: number, h: number, name: string, window: boolean): string {
  return svg({ w, h, name }, [
    piece(rect(0, 0, w, h), '#7d6ab0', { edge: 'clean', shadow: false }),
    piece(rect(0, h * 0.3, w, h * 0.3), '#c48ab8', { edge: 'clean', shadow: false }),
    piece(rect(0, h * 0.52, w, h * 0.2), '#f0a890', { edge: 'clean', shadow: false }),
    piece(circle(w * 0.5, h * 0.74, window ? 30 : 40), '#ffd27a', { edge: 'clean', shadow: false }),
    piece(curve([[0, h], [0, h * 0.72], [w * 0.35, h * 0.66], [w, h * 0.76], [w, h]], 2), '#5c6a8a', { edge: 'clean', shadow: false }),
    piece(curve([[0, h], [0, h * 0.84], [w * 0.6, h * 0.8], [w, h * 0.88], [w, h]], 2), '#46536e', { edge: 'clean', shadow: false }),
    dot(w * 0.24, h * 0.14, 3.2, '#fff6d8'),
    dot(w * 0.78, h * 0.08, 2.2, '#fff6d8', 0.8),
    ...(window ? [ink([[w / 2 - 5, 0], [w / 2 - 5, h]], { width: 8, color: '#4a3322' }), ink([[0, h * 0.4], [w, h * 0.4]], { width: 8, color: '#4a3322' })] : []),
  ]);
}

/** The sunset over the playroom window panes, 200 × 316. */
export const sunsetWindow = cached(() => sunset(200, 316, 'land-of-nod-sunset-window', true));
/** The sunset through the playroom's open doorway, 248 × 480. */
export const sunsetDoor = cached(() => sunset(248, 480, 'land-of-nod-sunset-door', false));
