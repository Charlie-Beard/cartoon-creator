/**
 * The Quidditch Cup and Harry's Firebolt (book 3; original paper art).
 * Registered as props in index.ts.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const SILVER = '#c9ced6';
const SILVER_LIGHT = '#e8ebf0';
const SILVER_DARK = '#8f96a2';
const RIBBON_RED = '#b3302c';

/** The big silver Quidditch Cup on a short stand, with red and gold ribbons, 200 × 220. */
export function quidditchCupArt(): string {
  // handles: loops out to each side of the bowl
  const loop = (side: 1 | -1): Node => {
    const pts: Pt[] = [[52, 62], [30, 56], [12, 70], [8, 92], [18, 114], [40, 124], [60, 118]].map(([px, py]) => [side === -1 ? px : 200 - px, py] as Pt);
    return piece(band(curve(pts, 2), 11), SILVER_DARK, { edge: 'cut', fibre: false });
  };
  const loopShine = (side: 1 | -1): Node => {
    const pts: Pt[] = [[48, 60], [28, 56], [14, 70], [10, 90]].map(([px, py]) => [side === -1 ? px : 200 - px, py] as Pt);
    return piece(band(curve(pts, 2), 3), SILVER_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 });
  };
  return svg({ w: 200, h: 220, name: 'hogwarts-quidditch-cup', label: 'the Quidditch Cup' }, [
    // ground shadow
    piece(ellipse(100, 214, 70, 7), 'rgba(40,25,10,0.18)', { edge: 'cut', fibre: false, shadow: false }),
    // wooden stand with a gold plate
    piece(poly([[48, 214], [58, 190], [142, 190], [152, 214]]), C.brownDark, { edge: 'cut' }),
    piece(rect(58, 180, 84, 14, 3), C.brown, { edge: 'cut' }),
    piece(rect(78, 198, 44, 10, 2), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    // stem and knop
    piece(poly([[90, 150], [110, 150], [118, 182], [82, 182]]), SILVER, { edge: 'cut' }),
    piece(ellipse(100, 160, 18, 8), SILVER_DARK, { edge: 'cut', fibre: false }),
    piece(ellipse(100, 176, 24, 6), SILVER_DARK, { edge: 'cut', fibre: false }),
    // handles, behind the bowl
    loop(-1),
    loop(1),
    // the bowl
    piece(curve([[34, 46], [166, 46], [160, 96], [136, 134], [100, 152], [64, 134], [40, 96]], 2), SILVER, { edge: 'cut' }),
    // rim and dark inside
    piece(ellipse(100, 46, 66, 11), SILVER_DARK, { edge: 'cut', fibre: false }),
    piece(ellipse(100, 48, 58, 7), '#4a505c', { edge: 'clean', fibre: false, shadow: false }),
    // shine
    piece(curve([[50, 66], [58, 100], [74, 128], [68, 100], [60, 70]], 2), SILVER_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    loopShine(-1),
    loopShine(1),
    // a gold band round the bowl
    piece(curve([[40, 84], [160, 84], [156, 96], [44, 96]], 1), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    // ribbons: a bow at the stem and a tail of each colour, plus a ribbon tied on a handle
    piece(poly([[100, 168], [82, 158], [76, 178]]), RIBBON_RED, { edge: 'cut', fibre: false }),
    piece(poly([[100, 168], [118, 158], [124, 178]]), C.gold, { edge: 'cut', fibre: false }),
    piece(poly([[98, 170], [86, 204], [98, 198], [106, 210], [104, 172]]), RIBBON_RED, { edge: 'cut', fibre: false }),
    piece(poly([[102, 170], [114, 206], [124, 196], [126, 186], [106, 168]]), C.gold, { edge: 'cut', fibre: false }),
    piece(circle(100, 169, 6), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    // handle ribbons
    piece(poly([[14, 80], [28, 78], [30, 104], [22, 98], [16, 108]]), RIBBON_RED, { edge: 'cut', fibre: false }),
    piece(poly([[186, 80], [172, 78], [170, 104], [178, 98], [184, 108]]), C.gold, { edge: 'cut', fibre: false }),
    dot(21, 80, 5, C.gold),
    dot(179, 80, 5, RIBBON_RED),
  ]);
}

/** Harry's Firebolt, side-on and flying right: dark polished handle, golden-brown twig tail, a gold band. 300 × 90. */
export function fireboltArt(): string {
  const twigs = Array.from({ length: 9 }, (_, i) => {
    const y = 26 + i * 4.5;
    return ink([[118, 42 + (y - 42) * 0.25], [70, y + (y - 42) * 0.2], [14, 42 + (y - 42) * 0.9]], { width: 2.2, color: i % 2 ? '#8a5a2b' : '#d9a85a', opacity: 0.9 });
  });
  return svg({ w: 300, h: 90, name: 'hogwarts-firebolt', label: "Harry's Firebolt" }, [
    // the streamlined tail of twigs, trailing to the left
    piece(curve([[124, 38], [84, 22], [36, 22], [6, 40], [36, 62], [84, 62], [124, 46]], 2), '#b8863f', { edge: 'torn' }),
    piece(curve([[120, 40], [80, 32], [34, 34], [14, 42], [40, 50], [82, 50], [120, 44]], 2), '#d3a354', { edge: 'torn', fibre: false, shadow: false, opacity: 0.8 }),
    ...twigs,
    // the long dark polished handle, a little thinner towards the front
    piece(poly([[112, 36], [286, 38], [292, 42], [286, 46], [112, 48]]), '#3a2418', { edge: 'cut', fibre: false }),
    // a footrest peg
    piece(poly([[190, 46], [202, 46], [206, 60], [194, 60]]), '#2a1a10', { edge: 'cut', fibre: false }),
    // polish
    ink([[140, 39], [262, 40]], { width: 2.5, color: '#9a6a48', opacity: 0.8 }),
    // the little gold band where the tail meets the handle
    piece(rect(112, 33, 12, 18, 2), C.gold, { edge: 'cut', fibre: false }),
    ink([[118, 35], [118, 49]], { width: 2, color: C.goldLight, opacity: 0.9 }),
  ]);
}
