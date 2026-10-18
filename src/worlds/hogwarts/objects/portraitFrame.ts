/**
 * portraitFrame for "Sir Cadogan" (book 3; original paper art): a big,
 * ornate, old gold picture frame standing upright, 440 × 540, as a HOLLOW
 * border only. The inside is transparent, so actors placed behind it show
 * through, in front of a painted canvas prop (paintedField or
 * paintedParlour, see paintedField.ts) placed behind them. It is the door
 * into Gryffindor Tower.
 *
 *   box 440 × 540
 *   inner opening  x 40 to 400, y 40 to 500   (360 × 460, exactly clear)
 *   border         40 thick all round: top y 0 to 40, bottom y 500 to 540
 *   bottom edge    y 540 sits on the floor (the foot is a flat bar)
 *   corners        carved gold blocks, 40 × 40, with little rosettes
 *   top            a scroll cartouche centred at x 220, y 0 to 40
 *   hinges         two faint dark-gold hinges on the left edge, y 150 and 390
 *
 * To seat a painting behind it: put the canvas (360 × 460) at
 * frameLeft + 40, frameTop + 40, then the actors, at a lower layer than the
 * frame. A portrait 260 wide (295 tall) with its bottom on frameTop + 500
 * fills the opening nicely.
 */
import { circle, curve, dot, ellipse, ink, piece, rect, svg, type Node, type Pt } from '../../../art/paper';

const GOLD = '#d8a43f';
const GOLD_LIGHT = '#f0cd7c';
const GOLD_MID = '#c18f32';
const GOLD_DARK = '#8a5f1f';
const GOLD_DEEP = '#6e4a18';

/** A little carved rosette: petals round a boss. */
function rosette(cx: number, cy: number, r: number): Node[] {
  const out: Node[] = [piece(circle(cx, cy, r), GOLD_MID, { edge: 'cut', fibre: false, shadow: false })];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    out.push(piece(ellipse(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.32, r * 0.32), GOLD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.9 }));
  }
  out.push(piece(circle(cx, cy, r * 0.28), GOLD_DEEP, { edge: 'clean', shadow: false }));
  return out;
}

/** Tiny carved beads along a strip. */
function beads(pts: Pt[]): Node[] {
  return pts.map(([x, y]) => dot(x, y, 2.4, GOLD_DEEP, 0.55));
}

/** A hinge: a dark-gold plate with a pin. */
function hinge(y: number): Node[] {
  return [
    piece(rect(0, y, 30, 26, 4), GOLD_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ink([[3, y + 13], [27, y + 13]], { width: 2, color: GOLD_DEEP, opacity: 0.8 }),
    dot(8, y + 13, 3, GOLD_LIGHT, 0.7),
    dot(22, y + 13, 3, GOLD_LIGHT, 0.7),
  ];
}

export function portraitFrameArt(): string {
  const W = 440;
  const H = 540;
  const B = 40;
  // the four bars (shadows off, so nothing falls into the opening)
  const bar = (x: number, y: number, w: number, h: number): Node =>
    piece(rect(x, y, w, h, 3), GOLD, { edge: 'cut', fibre: false, shadow: false });
  return svg({ w: W, h: H, name: 'hogwarts-portrait-frame' }, [
    bar(0, 0, W, B),
    bar(0, H - B, W, B),
    bar(0, B, B, H - 2 * B),
    bar(W - B, B, B, H - 2 * B),
    // lighter raised middle of each bar, darker outer lips
    piece(rect(10, 10, W - 20, 20, 6), GOLD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.55 }),
    piece(rect(10, H - 30, W - 20, 20, 6), GOLD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(rect(10, 40, 20, H - 80, 6), GOLD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(rect(W - 30, 40, 20, H - 80, 6), GOLD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.4 }),
    ink([[0, 1.5], [W, 1.5]], { width: 3, color: GOLD_DARK, opacity: 0.7, wobble: 0.3 }),
    ink([[1.5, 0], [1.5, H]], { width: 3, color: GOLD_DARK, opacity: 0.7, wobble: 0.3 }),
    ink([[W - 1.5, 0], [W - 1.5, H]], { width: 3, color: GOLD_DARK, opacity: 0.7, wobble: 0.3 }),
    ink([[0, H - 1.5], [W, H - 1.5]], { width: 3, color: GOLD_DEEP, opacity: 0.8, wobble: 0.3 }),
    // the inner moulding line, kept inside the border
    ink([[B - 2, B - 2], [W - B + 2, B - 2], [W - B + 2, H - B + 2], [B - 2, H - B + 2]], { width: 3, color: GOLD_DEEP, closed: true, opacity: 0.85, wobble: 0.2 }),
    ...beads(Array.from({ length: 14 }, (_, i) => [78 + i * 22, 20] as Pt)),
    ...beads(Array.from({ length: 14 }, (_, i) => [78 + i * 22, H - 20] as Pt)),
    ...beads(Array.from({ length: 10 }, (_, i) => [20, 78 + i * 38] as Pt)),
    ...beads(Array.from({ length: 10 }, (_, i) => [W - 20, 78 + i * 38] as Pt)),
    // faint hinges on the left edge: it is a door
    ...hinge(150),
    ...hinge(390),
    // carved corner blocks
    ...[[0, 0], [W - B, 0], [0, H - B], [W - B, H - B]].flatMap(([x, y]) => [
      piece(rect(x, y, B, B, 5), GOLD_MID, { edge: 'cut', fibre: false, shadow: false }),
      ink([[x + 4, y + 4], [x + B - 4, y + 4], [x + B - 4, y + B - 4], [x + 4, y + B - 4]], { width: 1.8, color: GOLD_DEEP, closed: true, opacity: 0.7, wobble: 0.3 }),
      ...rosette(x + B / 2, y + B / 2, 13),
    ]),
    // the scroll at the top: a curly cartouche, kept inside y 0 to 40
    piece(curve([[168, 38], [176, 12], [200, 4], [220, 14], [240, 4], [264, 12], [272, 38], [246, 30], [220, 36], [194, 30]], 2), GOLD_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    ...[[180, 22], [260, 22]].map(([x, y]) => ink([[x - 8, y + 4], [x - 4, y - 6], [x + 6, y - 4], [x + 4, y + 4], [x - 2, y + 2]], { width: 2, color: GOLD_DEEP, opacity: 0.8, wobble: 0.3 })),
    ...rosette(220, 20, 9),
  ]);
}
