/**
 * One-off art for The Island That Swam Away: the closed playroom doors, a
 * sandcastle, a pink shell, a seagull feather, the old fishing net on the
 * whale's tail, a spout of water and a puddle on the playroom floor.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../kit';

const CUT = { edge: 'cut' as const, fibre: false as const };

/**
 * The playroom's double doors, shut: two wooden leaves that fill the doorway
 * (x 892-1140, y 150-642 on the stage). Parts `leafL`, `leafR`, each hinged at
 * its outer edge: shrink their scaleX to open them. 248 × 492.
 */
export const doors = cached(() => {
  const leaf = (part: string, x0: number, hinge: number, handleX: number): ReturnType<typeof group> =>
    group({ part, origin: [hinge, 246] }, [
      piece(rect(x0, 0, 124, 492), C.wood, CUT),
      ...[1, 2, 3].map((i) => ink([[x0 + i * 31, 6], [x0 + i * 31, 486]], { width: 2.4, color: C.brownDark, opacity: 0.5, wobble: 0.5 })),
      piece(rect(x0, 70, 124, 22), C.brown, CUT),
      piece(rect(x0, 400, 124, 22), C.brown, CUT),
      piece(circle(handleX, 250, 9), C.brass, CUT),
      piece(circle(handleX, 250, 4), C.brassDark, { ...CUT, shadow: false }),
    ]);
  return svg({ w: 248, h: 492, name: 'whale-island-doors', label: 'Shut double doors' }, [
    leaf('leafL', 0, 0, 108),
    leaf('leafR', 124, 248, 140),
  ]);
});

/** A bucket sandcastle: two little towers with flags, a wall between and a door. 150 × 130. */
export const sandcastle = cached(() =>
  svg({ w: 150, h: 130, name: 'whale-island-sandcastle', label: 'A sandcastle' }, [
    piece(rect(10, 70, 130, 54, 6), C.sand),
    ...[0, 1, 2, 3].map((i) => piece(rect(18 + i * 30, 56, 18, 20, 2), C.sand, { ...CUT })),
    piece(rect(16, 24, 38, 76, 4), C.sand),
    piece(rect(96, 24, 38, 76, 4), C.sand),
    ...[0, 1].flatMap((i) => [0, 1].map((j) => piece(rect(16 + i * 80 + j * 22, 12, 16, 16, 2), C.sand, CUT))),
    piece(rect(62, 92, 26, 32, 12), '#a98f66', CUT),
    ink([[22, 50], [48, 50]], { width: 2.4, color: '#b99d70', wobble: 0.4 }),
    ink([[102, 50], [128, 50]], { width: 2.4, color: '#b99d70', wobble: 0.4 }),
    ink([[75, 12], [75, 0]], { width: 2.4, color: C.twig, wobble: 0.2 }),
    piece(poly([[75, 0], [92, 5], [75, 10]]), C.red, { ...CUT, shadow: false }),
  ]),
);

/** A pink scallop shell, ribbed, with a cream hinge. 70 × 62. */
export const shell = cached(() =>
  svg({ w: 70, h: 62, name: 'whale-island-shell', label: 'A pink shell' }, [
    piece(curve([[35, 56], [6, 34], [8, 16], [22, 6], [35, 8], [48, 6], [62, 16], [64, 34]], 2), '#f0a8b8'),
    ...[-26, -14, 0, 14, 26].map((dx) => ink([[35, 52], [35 + dx * 0.55, 30], [35 + dx * 1.1, 12]], { width: 2.2, color: '#d17e92', wobble: 0.3 })),
    piece(poly([[26, 56], [44, 56], [40, 46], [30, 46]]), C.cream, CUT),
  ]),
);

/** A white seagull feather with a grey tip, long and curved. 40 × 120. */
export const feather = cached(() =>
  svg({ w: 40, h: 120, name: 'whale-island-feather', label: 'A seagull feather' }, [
    piece(curve([[20, 116], [8, 80], [8, 40], [18, 4], [30, 30], [32, 76]], 2), C.white),
    piece(curve([[18, 4], [10, 24], [12, 44], [24, 40], [30, 30]], 2), C.stoneLight, { ...CUT, shadow: false }),
    ink([[20, 116], [19, 70], [18, 8]], { width: 2.4, color: C.stone, wobble: 0.3 }),
  ]),
);

/**
 * The old fishing net, caught over the whale's tail: a ragged drape of
 * rope mesh, frayed at the edges, with red floats. 200 × 250.
 */
export const net = cached(() => {
  const rope = '#b08a54';
  const lines: Node[] = [];
  for (let i = -6; i <= 12; i++) {
    lines.push(ink([[i * 22, 0], [i * 22 + 130, 250]], { width: 2.6, color: rope, wobble: 0.8 }));
    lines.push(ink([[i * 22 + 190, 0], [i * 22 + 60, 250]], { width: 2.6, color: rope, wobble: 0.8 }));
  }
  return svg({ w: 200, h: 250, name: 'whale-island-net', label: 'An old fishing net' }, [
    piece(curve([[40, 14], [100, 4], [170, 18], [196, 90], [188, 170], [176, 244], [120, 232], [74, 246], [24, 226], [6, 150], [10, 70]], 2), '#d8c79a', { ...CUT, shadow: false, opacity: 0.35 }),
    // the mesh is clipped to the drape by only drawing lines inside it
    (ctx) => `<clipPath id="net-clip"><path d="M40 14 L170 18 L196 90 L188 170 L176 244 L120 232 L74 246 L24 226 L6 150 L10 70 Z"/></clipPath><g clip-path="url(#net-clip)">${lines.map((l) => l(ctx)).join('')}</g>`,
    ink([[40, 14], [100, 4], [170, 18], [196, 90], [188, 170], [176, 244]], { width: 4.4, color: '#8a6a3a', wobble: 1 }),
    ink([[176, 244], [120, 232], [74, 246], [24, 226], [6, 150], [10, 70], [40, 14]], { width: 4.4, color: '#8a6a3a', wobble: 1 }),
    piece(circle(60, 238, 11), C.balloon, CUT),
    piece(circle(150, 236, 11), C.white, CUT),
    piece(circle(190, 120, 10), C.balloon, CUT),
    dot(56, 234, 3, C.white, 0.7),
  ]);
});

/** A spout of water: a tall fountain of paper droplets, widest at the top. Part `plume`. 140 × 270. */
export const spout = cached(() =>
  svg({ w: 140, h: 270, name: 'whale-island-spout', label: 'A spout of water' }, [
    group({ part: 'plume' }, [
      piece(curve([[62, 270], [58, 180], [50, 110], [70, 60], [90, 110], [82, 180], [78, 270]], 2), '#d9eef2', { ...CUT, shadow: false, opacity: 0.9 }),
      piece(ellipse(70, 70, 54, 40), '#e9f6f8', { ...CUT, shadow: false, opacity: 0.95 }),
      piece(ellipse(34, 96, 26, 18), '#d9eef2', { ...CUT, shadow: false, opacity: 0.9 }),
      piece(ellipse(108, 96, 26, 18), '#d9eef2', { ...CUT, shadow: false, opacity: 0.9 }),
      ...[[20, 40], [118, 44], [44, 14], [96, 12], [70, 24]].map(([x, y]) => piece(ellipse(x, y, 7, 10), '#bfe0ea', { ...CUT, shadow: false })),
    ]),
  ]),
);

/** A damp puddle on the floor, with a little shine. 200 × 50. */
export const puddle = cached(() =>
  svg({ w: 200, h: 50, name: 'whale-island-puddle', label: 'A puddle' }, [
    piece(ellipse(100, 26, 92, 20), '#6f9fbf', { edge: 'torn', rough: 0.7, shadow: false, fibre: false, opacity: 0.7 }),
    piece(ellipse(80, 20, 34, 6), '#bcd8e8', { edge: 'clean', shadow: false, opacity: 0.8 }),
  ]),
);
