/**
 * One-off art for "Jack Frost's Snowy Land": the basket of woolly things,
 * the worn scarf, the snowman in parts, the frost over the chair, the
 * playroom's stove, the frosted window and the picture in it.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false as const };

/** A wicker basket with a green scarf, a red scarf and yellow mittens poking out. 150 × 130. */
export const basket = cached(() =>
  svg({ w: 150, h: 130, name: 'jack-frost-basket', label: 'A basket of scarves and mittens' }, [
    // woolly things first, so the basket's front hides their bottoms
    piece(curve([[24, 60], [36, 20], [66, 12], [84, 30], [74, 70]], 2), C.green),
    ...[0, 1, 2].map((i) => ink([[34 + i * 12, 26 + i * 4], [40 + i * 12, 60]], { width: 5, color: C.leafLight })),
    piece(curve([[70, 66], [82, 14], [112, 10], [124, 36], [108, 74]], 2), C.coatRed),
    ...[0, 1, 2].map((i) => ink([[84 + i * 11, 22 + i * 3], [92 + i * 11, 64]], { width: 5, color: '#f1e4c4' })),
    piece(ellipse(54, 44, 16, 22, -20), C.yellow),
    piece(ellipse(100, 40, 14, 20, 20), C.yellow),
    // the basket
    piece(poly([[10, 62], [140, 62], [124, 124], [26, 124]]), C.tan),
    ...[0, 1, 2, 3].map((i) => ink([[22 + i * 34, 68], [34 + i * 30, 120]], { width: 4, color: C.brown, opacity: 0.7 })),
    ...[0, 1, 2].map((i) => ink([[14 + i * 6, 82 + i * 18], [136 - i * 6, 82 + i * 18]], { width: 4, color: C.brown, opacity: 0.7 })),
    piece(rect(8, 56, 134, 14, 6), C.wood, { edge: 'cut' }),
  ]),
);

/**
 * A woolly scarf round someone's neck, with one end hanging: laid over a
 * portrait, it covers the box x 75–225, y 205–315 of its 300 × 340
 * picture, so place it at the portrait's x + 75s, y + 205s with w 150s
 * (s = portrait width / 300). 150 × 110.
 */
export const wornScarf = cached((color: string, stripe: string, name: string) =>
  svg({ w: 150, h: 110, name: `jack-frost-scarf-${name}`, label: 'A scarf' }, [
    // the hanging end first, under the wrap
    piece(poly([[84, 30], [118, 24], [126, 100], [92, 106]]), color),
    ink([[92, 52], [122, 46]], { width: 5, color: stripe }),
    ink([[94, 78], [124, 72]], { width: 5, color: stripe }),
    ...[0, 1, 2, 3].map((i) => ink([[96 + i * 8, 106], [96 + i * 8, 110]], { width: 3, color, wobble: 0.1 })),
    // the wrap round the neck
    piece(curve([[8, 14], [22, 40], [76, 52], [128, 40], [142, 14], [128, 4], [76, 18], [22, 4]], 2), color),
    ...[-44, -22, 0, 24, 46].map((x) => ink([[75 + x, 14 + Math.abs(x) * 0.14], [80 + x, 44 - Math.abs(x) * 0.12]], { width: 5, color: stripe, wobble: 0.2 })),
  ]),
);

/** The snowman's big body: a round ball of snow with two twig arms and a blue shadow. 240 × 210. */
export const snowBody = cached(() =>
  svg({ w: 240, h: 210, name: 'jack-frost-snow-body', label: 'The snowman’s body' }, [
    piece(circle(120, 108, 98), '#f4f8fc', { rough: 1.1 }),
    piece(curve([[40, 130], [76, 188], [140, 202], [200, 160], [190, 176], [120, 206], [60, 190]], 2), '#c9d9ea', { ...flat, opacity: 0.8 }),
    ink([[56, 70], [90, 52], [130, 48]], { width: 3, color: '#d3e1ee', wobble: 0.6 }),
    ink([[150, 150], [180, 136], [196, 112]], { width: 3, color: '#d3e1ee', wobble: 0.6 }),
  ]),
);

/** Twig arms and three coal buttons, laid over the body's chest. 280 × 130. */
export const snowDress = cached(() =>
  svg({ w: 280, h: 130, name: 'jack-frost-snow-dress', label: 'Twig arms and buttons' }, [
    ink([[56, 70], [24, 40], [6, 34]], { width: 7, color: C.barkDark }),
    ink([[26, 42], [26, 20]], { width: 4, color: C.barkDark }),
    ink([[224, 70], [256, 40], [274, 34]], { width: 7, color: C.barkDark }),
    ink([[254, 42], [254, 20]], { width: 4, color: C.barkDark }),
    ...[30, 66, 102].map((y) => piece(circle(140, y, 7), C.charcoal, { edge: 'cut', fibre: false })),
  ]),
);

/** The snowman's head: a smaller ball of snow. 150 × 140. */
export const snowHead = cached(() =>
  svg({ w: 150, h: 140, name: 'jack-frost-snow-head', label: 'The snowman’s head' }, [
    piece(circle(75, 70, 64), '#f6f9fc', { rough: 1.1 }),
    piece(curve([[22, 86], [44, 120], [84, 132], [120, 110], [112, 122], [80, 138], [40, 124]], 2), '#c9d9ea', { ...flat, opacity: 0.8 }),
  ]),
);

/** Two coal eyes and a smile of five little coals. 90 × 96. */
export const coalFace = cached(() =>
  svg({ w: 90, h: 96, name: 'jack-frost-coal-face', label: 'Coal eyes and smile' }, [
    ...[[20, 10], [70, 10]].map(([x, y]) => piece(circle(x, y, 8), C.charcoal, { edge: 'cut', fibre: false })),
    ...[[12, 64], [26, 74], [45, 78], [64, 74], [78, 64]].map(([x, y]) => piece(circle(x, y, 4.6), C.charcoal, { edge: 'cut', fibre: false })),
  ]),
);

/** A carrot nose pointing left, with a tiny green top. 70 × 28. */
export const carrot = cached(() =>
  svg({ w: 70, h: 28, name: 'jack-frost-carrot', label: 'A carrot' }, [
    piece(poly([[68, 6], [68, 22], [6, 14]]), C.orange, { edge: 'cut', fibre: false }),
    ...[[28, 9, 36, 12], [44, 18, 52, 15]].map(([a, b, c, d]) => ink([[a, b], [c, d]], { width: 2, color: C.ginger })),
    piece(poly([[66, 14], [70, 2], [74, 14], [70, 26]]), C.green, flat),
  ]),
);

/** The clear blue-white of frost: dark enough to show on a white-ish veil. */
const FROST_LINE = '#6fb9e6';

/**
 * Ice over the Wishing-Chair, laid exactly on the chair prop (440 × 400): a
 * pale blue frosting over both wings, the back, the arms and the legs,
 * with white frost-ferns and icicles hanging from the seat.
 */
export const frostOverChair = cached(() => {
  const ice = (pts: [number, number][], op = 0.6): ReturnType<typeof piece> => piece(curve(pts, 2), '#eaf8ff', { ...flat, opacity: Math.min(0.95, op + 0.4) });
  const fern = (x: number, y: number, len: number, lean: number): ReturnType<typeof ink>[] => {
    const out = [ink([[x, y], [x + lean, y + len]], { width: 3, color: FROST_LINE, wobble: 0.2, opacity: 0.95 })];
    for (let i = 1; i < 5; i++) {
      const t = i / 5;
      const px = x + lean * t;
      const py = y + len * t;
      out.push(ink([[px, py], [px - 14, py - 9]], { width: 2, color: FROST_LINE, wobble: 0.1, opacity: 0.95 }));
      out.push(ink([[px, py], [px + 14, py - 9]], { width: 2, color: FROST_LINE, wobble: 0.1, opacity: 0.95 }));
    }
    return out;
  };
  const icicle = (x: number, y: number, l: number): ReturnType<typeof piece> => piece(poly([[x - 5, y], [x + 5, y], [x, y + l]]), '#bfe6fa', flat);
  return svg({ w: 440, h: 400, name: 'jack-frost-chair-frost', label: 'Ice on the chair' }, [
    // the wings, left and right
    ice([[8, 130], [30, 90], [100, 100], [130, 118], [128, 150], [90, 190], [40, 180]], 0.62),
    ice([[432, 130], [410, 90], [340, 100], [310, 118], [312, 150], [350, 190], [400, 180]], 0.62),
    // the back, the arms, the seat and the legs
    ice([[116, 62], [150, 28], [290, 28], [324, 62], [322, 230], [118, 230]], 0.5),
    ice([[84, 168], [136, 166], [136, 262], [86, 262]], 0.6),
    ice([[304, 166], [356, 168], [354, 262], [304, 262]], 0.6),
    ice([[98, 246], [342, 246], [340, 294], [100, 294]], 0.55),
    ice([[98, 290], [128, 290], [124, 394], [100, 394]], 0.6),
    ice([[312, 290], [342, 290], [340, 394], [316, 394]], 0.6),
    ...fern(50, 104, 66, 14),
    ...fern(392, 104, 66, -14),
    ...fern(220, 60, 120, 0),
    ...fern(112, 176, 70, 2),
    ...fern(328, 176, 70, -2),
    // icicles hanging from the seat and arms
    ...[[120, 292, 30], [160, 292, 20], [220, 292, 34], [280, 292, 22], [320, 292, 30]].map(([x, y, l]) => icicle(x, y, l)),
    ...[[96, 262, 22], [346, 262, 22]].map(([x, y, l]) => icicle(x, y, l)),
    ...[[30, 140], [410, 140], [220, 90], [150, 120], [290, 120]].map(([x, y]) => dot(x, y, 3.4, '#7cc3ea', 0.95)),
  ]);
});

/** A little black iron stove with a pipe and a glowing door (part `glow`). 190 × 300. */
export const stove = cached(() =>
  svg({ w: 190, h: 300, name: 'jack-frost-stove', label: 'A little stove' }, [
    piece(rect(78, 0, 28, 120, 4), C.charcoal, { edge: 'cut' }),
    piece(rect(70, 106, 44, 14, 3), C.greyDark, { edge: 'cut' }),
    piece(rect(20, 120, 150, 150, 10), C.charcoal, { edge: 'cut' }),
    piece(rect(14, 114, 162, 16, 6), C.greyDark, { edge: 'cut' }),
    piece(rect(34, 270, 14, 28, 3), C.greyDark, { edge: 'cut' }),
    piece(rect(142, 270, 14, 28, 3), C.greyDark, { edge: 'cut' }),
    piece(rect(48, 150, 94, 90, 8), '#2a2a30', { edge: 'cut', fibre: false }),
    group({ part: 'glow', origin: [95, 200], opacity: 1 }, [
      piece(rect(56, 160, 78, 70, 6), '#f2a74a', flat),
      piece(ellipse(95, 214, 28, 14), '#ffd98a', flat),
      piece(poly([[74, 220], [88, 176], [100, 206], [112, 180], [120, 222]]), '#ffe9a8', flat),
    ]),
    ...[0, 1, 2].map((i) => ink([[56, 168 + i * 26], [134, 168 + i * 26]], { width: 4, color: '#2a2a30' })),
    piece(circle(150, 200, 5), C.brass, { edge: 'cut', fibre: false }),
  ]),
);

/**
 * The window's frosted pane: a milky frosting with fern patterns round the
 * edges, laid over the playroom window glass (x 58–322, y 148–462). 264 × 314.
 */
export const frostPane = cached(() => {
  const fern = (x: number, y: number, len: number, ang: number): ReturnType<typeof ink>[] => {
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const out = [ink([[x, y], [x + dx * len, y + dy * len]], { width: 3, color: '#ffffff', wobble: 0.3, opacity: 0.95 })];
    for (let i = 1; i < 6; i++) {
      const t = (i / 6) * len;
      const px = x + dx * t;
      const py = y + dy * t;
      const l = 22 * (1 - i / 8);
      out.push(ink([[px, py], [px + Math.cos(ang - 0.8) * l, py + Math.sin(ang - 0.8) * l]], { width: 2, color: '#ffffff', wobble: 0.2, opacity: 0.95 }));
      out.push(ink([[px, py], [px + Math.cos(ang + 0.8) * l, py + Math.sin(ang + 0.8) * l]], { width: 2, color: '#ffffff', wobble: 0.2, opacity: 0.95 }));
    }
    return out;
  };
  return svg({ w: 264, h: 314, name: 'jack-frost-frost-pane', label: 'A frosted window' }, [
    piece(rect(0, 0, 264, 314, 4), '#e4f1f8', { edge: 'cut', fibre: false, shadow: false, opacity: 0.88 }),
    piece(ellipse(132, 160, 100, 120), '#f5fbfe', { ...flat, opacity: 0.7 }),
    ...fern(6, 6, 90, 0.8),
    ...fern(258, 6, 90, 2.3),
    ...fern(6, 308, 90, -0.8),
    ...fern(258, 308, 90, -2.3),
    ...fern(132, 4, 50, 1.57),
    ...fern(132, 310, 50, -1.57),
  ]);
});

/**
 * The picture in the window: a clear round hole in the frost, dark blue
 * evening behind, and a snowman with a coal smile in a little red scarf
 * (part `glow` is a soft halo behind it). 200 × 200.
 */
export const frostPicture = cached(() =>
  svg({ w: 200, h: 200, name: 'jack-frost-frost-picture', label: 'A frost picture of a snowman in a red scarf' }, [
    piece(circle(100, 100, 92), '#cfe3f0', { edge: 'torn', fibre: '#ffffff', shadow: false }),
    piece(circle(100, 100, 82), '#3f5a86', { edge: 'clean', shadow: false, fibre: false }),
    group({ part: 'glow', origin: [100, 100] }, [piece(circle(100, 108, 62), '#ffe9a8', { edge: 'clean', shadow: false, fibre: false, opacity: 0.28 })]),
    // a few stars
    ...[[40, 50], [160, 44], [150, 80], [52, 90]].map(([x, y]) => dot(x, y, 2.4, '#ffffff', 0.9)),
    // snow on the ground
    piece(curve([[16, 150], [60, 134], [140, 138], [184, 152], [170, 182], [30, 182]], 2), '#f6f9fc', { ...flat, edge: 'torn' }),
    // the snowman
    piece(circle(100, 138, 32), '#f4f8fc', { rough: 0.8, shadow: false }),
    piece(circle(100, 90, 22), '#f6f9fc', { rough: 0.8, shadow: false }),
    dot(93, 86, 2.6, C.charcoal),
    dot(107, 86, 2.6, C.charcoal),
    piece(poly([[100, 92], [118, 96], [100, 99]]), C.orange, flat),
    ...[[88, 98], [94, 102], [100, 103], [106, 102], [112, 98]].map(([x, y]) => dot(x, y, 1.6, C.charcoal)),
    // the red scarf, with an end blowing
    piece(curve([[76, 106], [100, 114], [124, 106], [124, 116], [100, 124], [76, 116]], 1), C.coatRed, flat),
    piece(poly([[112, 116], [128, 118], [140, 138], [126, 140]]), C.coatRed, flat),
    ink([[88, 114], [90, 122]], { width: 3, color: '#f1e4c4' }),
    ink([[104, 116], [106, 124]], { width: 3, color: '#f1e4c4' }),
    ink([[74, 128], [48, 112]], { width: 4, color: C.barkDark }),
    ink([[126, 128], [152, 112]], { width: 4, color: C.barkDark }),
  ]),
);

/** A far-off hill of snow seen from the sky, for Jack Frost to stand on. 300 × 110. */
export const farSnow = cached(() =>
  svg({ w: 300, h: 110, name: 'jack-frost-far-snow', label: 'A snowy hill far below' }, [
    piece(curve([[0, 110], [10, 70], [80, 40], [160, 30], [240, 46], [292, 76], [300, 110]], 2), '#f6f9fc', { rough: 1.1 }),
    piece(curve([[40, 100], [90, 78], [150, 70], [230, 84], [250, 100]], 2), '#d3e1ee', { ...flat, opacity: 0.8 }),
  ]),
);

/** A cup of cocoa. 110 × 100. */
export const cocoa = cached(() =>
  svg({ w: 110, h: 100, name: 'jack-frost-cocoa', label: 'A cup of cocoa' }, [
    piece(ellipse(55, 90, 48, 9), C.china, { edge: 'cut' }),
    piece(poly([[18, 30], [92, 30], [84, 86], [26, 86]]), C.chinaBlue, { edge: 'cut' }),
    piece(ellipse(55, 32, 37, 9), C.brownDark, { shadow: false }),
    ink([[92, 44], [106, 52], [90, 70]], { width: 6, color: C.chinaBlue }),
  ]),
);

/** A puff of warm breath on the glass: a soft fog patch. 120 × 120. */
export const breath = cached(() =>
  svg({ w: 120, h: 120, name: 'jack-frost-breath', label: 'A patch of breath on glass' }, [
    piece(circle(60, 60, 54), '#ffffff', { edge: 'torn', fibre: false, shadow: false, opacity: 0.55 }),
    piece(circle(60, 60, 36), '#ffffff', { edge: 'torn', fibre: false, shadow: false, opacity: 0.45 }),
  ]),
);

/**
 * A low drift of snow laid across the front of the stage, over the bottom
 * edges of the portraits, so the friends stand in the snow rather than
 * float on it. Same colour as the backdrop's near snow, with a soft blue
 * line along its lumpy top. 1180 × 150, placed at y 610.
 */
export const drift = cached(() =>
  svg({ w: 1180, h: 150, name: 'jack-frost-drift', label: 'A low snowdrift' }, [
    piece(curve([[-30, 160], [-30, 40], [90, 22], [210, 34], [330, 18], [470, 30], [610, 14], [760, 30], [900, 16], [1040, 32], [1160, 20], [1230, 36], [1230, 160]], 2), '#f6f9fc', { edge: 'torn', fibre: false, shadow: false, rough: 1.1 }),
    ink([[-10, 36], [90, 26], [210, 38], [330, 22], [470, 34], [610, 18], [760, 34], [900, 20], [1040, 36], [1160, 24]], { width: 3, color: '#d6e3f0', opacity: 0.9, wobble: 1 }),
  ]),
);

/**
 * A whirl of snow for Jack Frost to ride in: a wide, soft cloud at the top
 * (hiding the bottom of his portrait) tapering down to a curling tip, with
 * pale blue swirl lines going round it. 460 × 200.
 */
export const snowWhirl = cached(() =>
  svg({ w: 460, h: 200, name: 'jack-frost-snow-whirl', label: 'A whirl of snow' }, [
    piece(curve([[10, 40], [70, 6], [160, 0], [230, 12], [310, 0], [400, 8], [450, 40], [400, 74], [330, 96], [290, 140], [260, 192], [220, 190], [190, 140], [130, 96], [60, 74]], 2), '#f6fafe', { edge: 'torn', fibre: false, shadow: false, rough: 1.3, opacity: 0.96 }),
    piece(curve([[60, 50], [150, 30], [230, 44], [320, 28], [400, 48], [330, 80], [270, 110], [240, 168], [214, 164], [196, 112], [140, 82]], 2), '#d8e8f6', { ...flat, opacity: 0.7 }),
    ink([[30, 44], [120, 18], [230, 30], [340, 14], [430, 42]], { width: 4, color: '#a9cdea', wobble: 0.5, opacity: 0.9 }),
    ink([[80, 70], [170, 52], [260, 64], [370, 50]], { width: 4, color: '#a9cdea', wobble: 0.5, opacity: 0.9 }),
    ink([[160, 100], [230, 88], [300, 102]], { width: 4, color: '#a9cdea', wobble: 0.5, opacity: 0.9 }),
    ink([[205, 140], [245, 128], [270, 142]], { width: 3, color: '#a9cdea', wobble: 0.4, opacity: 0.9 }),
    ...[[40, 20], [100, 4], [250, 2], [360, 6], [430, 20], [20, 56], [450, 58], [340, 100]].map(([x, y]) => dot(x, y, 4, '#ffffff', 0.95)),
  ]),
);
