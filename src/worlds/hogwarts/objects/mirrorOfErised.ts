/**
 * A tall old mirror in a gold frame (made for "The Riddle of the Bottles" and
 * mirror scenes, book 1; original paper art).
 *
 * mirrorOfErised: 280 × 460, as high as a grown-up. An ornate gold frame with
 * a round arch at the top, standing on two clawed feet; the feet's claws touch
 * the bottom edge (y 458). An engraved band of unreadable squiggles runs round
 * the arch and down both sides. Box coordinates:
 *   frame: x 30 to 250, y 14 to 420 (arch springs at y 124)
 *   glass: x 72 to 208, y 56 to 392, a soft silvery-blue with pale streaks
 *   feet: x 50 and x 230, y 410 to 458
 * Part `glass` (origin at its centre, 140, 224) is the glass with its streaks:
 * glow it, tint it or fade it from a script. The glass is empty; draw whatever
 * it shows as a separate prop in front of it.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const CX = 140;
const SPRING = 124;
const BOTTOM = 420;

/** A tall arch: straight sides from the bottom up to the spring line, then a half circle. */
function arch(hw: number, bottom = BOTTOM): Pt[] {
  const pts: Pt[] = [[CX - hw, bottom], [CX - hw, SPRING]];
  for (let i = 1; i < 16; i++) {
    const a = Math.PI - (i / 16) * Math.PI;
    pts.push([CX + Math.cos(a) * hw, SPRING - Math.sin(a) * hw]);
  }
  pts.push([CX + hw, SPRING], [CX + hw, bottom]);
  return pts;
}

/** A band between two arches' radii (top half arc), as a closed piece outline. */
function arcBand(r0: number, r1: number): Pt[] {
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI - (i / 20) * Math.PI;
    outer.push([CX + Math.cos(a) * r1, SPRING - Math.sin(a) * r1]);
    inner.push([CX + Math.cos(a) * r0, SPRING - Math.sin(a) * r0]);
  }
  return [...outer, ...inner.reverse()];
}

/** A clawed foot: a gold ball gripped by three curved toes. */
function foot(x: number, dir: number): Node[] {
  return [
    piece(poly([[x - 16, 408], [x + 16, 408], [x + 12, 428], [x - 12, 428]]), C.gold, { edge: 'cut', fibre: false }),
    piece(circle(x, 436, 14), '#c9993a', { edge: 'cut', fibre: false }),
    ...[-1, 0, 1].map((d) =>
      piece(curve([[x + d * 11 - 5, 436], [x + d * 15 + dir * 4, 446], [x + d * 17 + dir * 8, 456], [x + d * 11 + dir * 3, 454], [x + d * 8, 446], [x + d * 11 + 5, 436]], 2), '#b0832e', { edge: 'cut', fibre: false, shadow: false }),
    ),
    piece(ellipse(x - 4, 432, 5, 3, -0.4), '#f0cd7c', { edge: 'clean', shadow: false, opacity: 0.7 }),
  ];
}

export function mirrorOfErisedArt(): string {
  // engraved squiggles round the arch and down the sides (writing that isn't)
  const squiggles: Node[] = [];
  const rm = 89;
  const n = 34;
  const arcPts: Pt[] = [];
  for (let i = 0; i <= n * 3; i++) {
    const a = Math.PI - (i / (n * 3)) * Math.PI;
    const rr = rm + Math.sin(i * 1.9) * 3.2;
    arcPts.push([CX + Math.cos(a) * rr, SPRING - Math.sin(a) * rr]);
  }
  for (let i = 0; i < n; i++) squiggles.push(ink(arcPts.slice(i * 3, i * 3 + 4), { width: 2.4, color: '#6b4a14', wobble: 0.3 }));
  for (const side of [-1, 1]) {
    const x = CX + side * rm;
    for (let y = SPRING + 6; y < 396; y += 12) {
      squiggles.push(ink([[x - 4, y], [x + 3, y + 4], [x - 3, y + 8], [x + 4, y + 11]], { width: 2.2, color: '#6b4a14', wobble: 0.3 }));
    }
  }

  const glassNodes: Node[] = [
    piece(arch(68, 392).map(([x, y]) => [x, Math.max(y, 56)] as Pt), '#b4c9de', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(CX, 210, 52, 130), '#d3e3f0', { edge: 'clean', shadow: false, opacity: 0.55 }),
    piece(ellipse(CX, 190, 34, 90), '#e8f1f8', { edge: 'clean', shadow: false, opacity: 0.4 }),
    // pale diagonal streaks
    piece(poly([[92, 140], [106, 140], [84, 300], [72, 300]]), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.32 }),
    piece(poly([[116, 150], [124, 150], [100, 330], [93, 330]]), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.22 }),
  ];

  return svg({ w: 280, h: 460, name: 'hogwarts-mirror-of-erised', boil: false }, [
    piece(ellipse(CX, 444, 116, 8), '#000000', { edge: 'clean', shadow: false, opacity: 0.18 }),
    ...foot(54, -1),
    ...foot(226, 1),
    // a crossbar between the feet
    piece(rect(40, 404, 200, 20, 6), '#c9993a', { edge: 'cut', fibre: false }),
    // the frame, layer by layer
    piece(arch(112), '#c9993a', { rough: 0.8 }),
    piece(arch(104), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(arcBand(79, 99).concat([[CX + 99, BOTTOM - 8], [CX + 79, BOTTOM - 8]], [[CX - 79, BOTTOM - 8], [CX - 99, BOTTOM - 8]]), '#a97c2c', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(CX - 99, SPRING, 20, BOTTOM - 8 - SPRING, 0), '#a97c2c', { edge: 'clean', shadow: false }),
    piece(rect(CX + 79, SPRING, 20, BOTTOM - 8 - SPRING, 0), '#a97c2c', { edge: 'clean', shadow: false }),
    piece(arch(77, 396), '#8f6a24', { edge: 'cut', fibre: false, shadow: false }),
    ...squiggles,
    // the glass (a part), with the studs of the frame drawn after
    group({ part: 'glass', origin: [CX, 224] }, glassNodes),
    // a scroll-shaped crest at the top and gold studs round the frame
    piece(ellipse(CX, 24, 22, 11), '#e0b552', { edge: 'cut', fibre: false }),
    piece(circle(CX, 20, 8), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    ...[-1, 1].map((s) => piece(curve([[CX + s * 22, 30], [CX + s * 42, 22], [CX + s * 58, 34], [CX + s * 48, 44], [CX + s * 40, 36]], 2), '#e0b552', { edge: 'cut', fibre: false, shadow: false })),
    ...[-1, 1].flatMap((s) => [150, 214, 278, 342, 400].map((y) => dot(CX + s * 106, y, 3.6, '#8f6a24'))),
    ...[-1, 1].map((s) => piece(circle(CX + s * 104, 112, 9), '#e0b552', { edge: 'cut', fibre: false })),
    piece(rect(CX - 112, 406, 224, 16, 5), '#c9993a', { edge: 'cut', fibre: false, shadow: false }),
    ink([[CX - 100, 414], [CX + 100, 414]], { width: 2, color: '#8f6a24', opacity: 0.6, wobble: 0.5 }),
  ]);
}
