/**
 * The Wishing-Chair: a little red-painted wooden armchair seen from the
 * front, 440 × 400, centred on x 220, with small feathery red-and-gold
 * wings that the scripts fade in and flap (`wingL`, `wingR`, both
 * starting at opacity 0 and turning about the top of the chair back).
 *
 * Geometry (scripts depend on it):
 *   back      x 120–320, carved top rail at y 30
 *   seat      cushion top y 215–245, x 110–330
 *   arms      left x 88–132, right x 308–352, tops at y 175
 *   apron     y 245–290, x 100–340
 *   legs      y 290–392, at about x 112 and x 328
 *
 * Two pictures are drawn from the same parts. `wishingChair` is the whole
 * chair. `wishingChairFront` holds only what is in front of someone
 * sitting in it (the cushion's front lip, the apron, both arms, the
 * legs), to be laid exactly over the chair at the same size, with the
 * riders' portraits between the two. Their bottom edges sit around y 260
 * and are hidden by the front layer.
 *
 * Paper is torn from a seed that depends on the picture's name, so the
 * shared parts are "pinned": each carries its own seed and counter, and
 * tears the same in either picture. The overlay then matches the chair
 * pixel for pixel (apart from the soft shadows being laid on twice).
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, group, hashString, ink, piece, poly, rect, svg, type Ctx, type Node, type Pt } from '../../art/paper';

/** Nodes that tear the same wherever they are drawn. */
const pinned =
  (name: string, nodes: Node[]): Node =>
  (ctx: Ctx) => {
    const seed = hashString(name);
    let n = 0;
    const own: Ctx = { seed, next: () => (seed + ++n * 104729) >>> 0, frames: ctx.frames };
    return nodes.map((c) => c(own)).join('');
  };

const flat = (o: Pt[], fill: string, opacity?: number): Node =>
  piece(o, fill, { edge: 'cut', fibre: false, shadow: false, opacity });

// ---------------------------------------------------------------------------
// Wings: layered feathers fanned out from the top of the chair back
// ---------------------------------------------------------------------------

/** Directions measured from "straight out sideways", positive = downwards. */
const wing = (side: 'L' | 'R'): Node => {
  const dir = side === 'L' ? -1 : 1;
  const ox = side === 'L' ? 128 : 312;
  const oy = 120;
  const nodes: Node[] = [];
  // Back row: big red feathers; then gold; then small red coverts.
  const rows: [number[], number, number, string][] = [
    [[-52, -33, -14, 5, 24, 43], 122, 15, C.redDark],
    [[-45, -27, -9, 9, 28, 46], 108, 14, C.coatRed],
    [[-38, -20, -2, 16, 34], 84, 12, C.gold],
    [[-30, -10, 10, 30], 56, 10, C.goldLight],
  ];
  for (const [angles, len, wid, fill] of rows) {
    for (const d of angles) {
      // A feather pointing out and down by d degrees (screen y is down).
      const a = (d * Math.PI) / 180;
      const cx = ox + dir * Math.cos(a) * (len / 2);
      const cy = oy + Math.sin(a) * (len / 2);
      const rot = dir === 1 ? d : 180 - d;
      nodes.push(piece(ellipse(cx, cy, len / 2, wid, rot), fill, { rough: 0.6 }));
      // A quill line down the middle of the bigger feathers.
      if (len > 80) {
        const x2 = ox + dir * Math.cos(a) * (len - 8);
        const y2 = oy + Math.sin(a) * (len - 8);
        nodes.push(ink([[ox, oy], [(ox + x2) / 2, (oy + y2) / 2], [x2, y2]], { width: 1.6, color: 'rgba(60,20,14,0.35)', wobble: 0.3 }));
      }
    }
  }
  nodes.push(piece(circle(ox, oy, 11), C.gold, { rough: 0.6 }));
  return group({ part: side === 'L' ? 'wingL' : 'wingR', origin: [ox, oy], opacity: 0 }, nodes);
};

// ---------------------------------------------------------------------------
// The chair, behind a rider
// ---------------------------------------------------------------------------

const backLegs = (): Node[] => [
  flat(rect(138, 286, 20, 92, 6), C.redDark),
  flat(rect(282, 286, 20, 92, 6), C.redDark),
];

const chairBack = (): Node[] => [
  // The back: a tall rounded panel under a carved, rounded top rail.
  piece(rect(124, 56, 192, 175, 14), C.coatRed),
  piece(
    curve([[116, 70], [128, 40], [170, 30], [220, 22], [270, 30], [312, 40], [324, 70], [312, 80], [128, 80]], 3),
    C.red,
  ),
  // Gold carving on the rail.
  flat(circle(220, 44, 11), C.gold),
  flat(circle(220, 44, 5), C.redDark),
  ink([[140, 60], [165, 52], [190, 58]], { width: 3, color: C.gold }),
  ink([[300, 60], [275, 52], [250, 58]], { width: 3, color: C.gold }),
  // Back posts and a darker inset panel the riders lean on.
  flat(rect(142, 92, 156, 126, 12), C.redDark, 0.55),
  ink([[142, 92], [298, 92]], { width: 2.5, color: C.gold, wobble: 0.4 }),
  ink([[160, 112], [175, 104], [190, 112]], { width: 2.4, color: C.gold }),
  ink([[250, 112], [265, 104], [280, 112]], { width: 2.4, color: C.gold }),
  // The cushion's top, plumped up behind the riders.
  piece(rect(110, 214, 220, 32, 14), C.blueDark),
];

// ---------------------------------------------------------------------------
// The front: lip of the cushion, apron, arms, legs
// ---------------------------------------------------------------------------

const check = (x: number, y: number, w: number, h: number, cell: number): Node[] => {
  const out: Node[] = [];
  for (let i = 0; i * cell < w; i++) {
    const cw = Math.min(cell, w - i * cell);
    if (i % 2 === 0) out.push(flat(rect(x + i * cell, y, cw, h), C.cream, 0.85));
  }
  return out;
};

const leg = (cx: number): Node[] => [
  piece(poly([[cx - 11, 288], [cx + 11, 288], [cx + 10, 312], [cx + 15, 328], [cx + 8, 342], [cx + 9, 372], [cx + 13, 392], [cx - 13, 392], [cx - 9, 372], [cx - 8, 342], [cx - 15, 328], [cx - 10, 312]]), C.red),
  flat(ellipse(cx, 328, 14, 5), C.gold),
  flat(rect(cx - 12, 384, 24, 5), C.redDark),
];

const arm = (cx: number, dir: 1 | -1): Node[] => [
  // Post running from the rest down to the seat, with a scroll of gold.
  piece(rect(cx - 17, 180, 34, 80, 8), C.red),
  // The padded arm rest, a rounded top reaching a little forward.
  piece(rect(cx - 25, 168, 50, 24, 11), C.coatRed),
  flat(rect(cx - 19, 173, 38, 6, 3), C.goldLight, 0.7),
  flat(circle(cx, 216, 8), C.gold),
  flat(circle(cx, 216, 3.5), C.redDark),
  ink([[cx - 8, 238], [cx, 244 + dir * 0], [cx + 8, 238]], { width: 2.4, color: C.gold }),
];

const frontParts = (): Node[] => [
  ...leg(112),
  ...leg(328),
  // The seat apron, with a gold trim along its bottom.
  piece(rect(100, 246, 240, 44, 8), C.red),
  flat(rect(112, 255, 216, 22, 6), C.redDark, 0.5),
  ink([[120, 266], [160, 258], [200, 266], [240, 258], [280, 266], [320, 258]], { width: 2.6, color: C.gold }),
  ink([[104, 286], [336, 286]], { width: 3, color: C.gold, wobble: 0.4 }),
  // The cushion's front lip, blue and cream check, with tassel dots.
  piece(rect(106, 230, 228, 24, 11), C.blue),
  ...check(112, 234, 216, 16, 16),
  flat(circle(112, 254, 5), C.gold),
  flat(circle(328, 254, 5), C.gold),
  ...arm(110, 1),
  ...arm(330, -1),
];

// ---------------------------------------------------------------------------

export const wishingChair = cached((): string =>
  svg({ w: 440, h: 400, name: 'wishing-chair' }, [
    // Wings first, so they sit behind the chair back.
    wing('L'),
    wing('R'),
    pinned('wishing-chair-backlegs', backLegs()),
    pinned('wishing-chair-back', chairBack()),
    pinned('wishing-chair-front', frontParts()),
  ]),
);

export const wishingChairFront = cached((): string =>
  svg({ w: 440, h: 400, name: 'wishing-chair-front' }, [pinned('wishing-chair-front', frontParts())]),
);
