/**
 * A pothole in the grass that something can pop up out of, in two aligned halves.
 *
 * Both props are 220 × 110 and go at the SAME x, y. Put a small creature
 * between them in z (potholeBack behind, potholeFront in front) and slide
 * it up from below the opening: it appears to come out of the hole.
 *
 * The opening (the dark oval) is centred at (110, 54) in the box, rx 84,
 * ry 28: x 26 to 194, y 26 to 82. The front lip covers everything below
 * the oval's lower edge (y 54 at the sides curving down to y 84 at x 110),
 * so a creature whose bottom is at box y 80 or lower is hidden up to
 * there. A creature up to about 90 px wide fits in the opening; its head
 * can rise above the box (negative y). Flat grass bottom at y 108.
 */
import { curve, ellipse, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';

const EARTH = '#7c5a3c';
const EARTH_DARK = '#5a3f2a';
const HOLE = '#241a16';
const HOLE_MID = '#33261f';
const GRASS = '#6fa157';
const GRASS_LIGHT = '#86b668';

/** The hole and its far rim: dark oval, earth rim, a few grass tufts behind. */
export function potholeBack(): string {
  const tuft = (x: number, y: number): Node => ink([[x - 6, y], [x - 3, y - 12], [x, y], [x + 3, y - 14], [x + 6, y]], { width: 3, color: '#4f8a46' });
  return svg({ w: 220, h: 110, name: 'hog-pothole-back', label: 'a hole in the ground' }, [
    piece(ellipse(110, 54, 104, 38), GRASS, { rough: 1.1, shadow: false }),
    piece(ellipse(110, 54, 96, 34), EARTH, { rough: 1.1, shadow: false }),
    piece(ellipse(110, 54, 84, 28), HOLE, { rough: 0.8, shadow: false }),
    piece(ellipse(110, 46, 70, 18), HOLE_MID, { edge: 'clean', shadow: false, opacity: 0.8 }),
    tuft(20, 40), tuft(40, 24), tuft(190, 38), tuft(176, 22), tuft(110, 14),
  ]);
}

/** The near lip: grass and earth below the opening's lower edge, covering a creature's feet. */
export function potholeFront(): string {
  const arc: Pt[] = [];
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI;
    arc.push([110 + Math.cos(a) * 86, 54 + Math.sin(a) * 30]);
  }
  // runs from the right end of the oval round its lower edge to the left end, then out and down
  const lip: Pt[] = [...arc, [8, 70], [4, 92], [20, 108], [200, 108], [216, 92], [212, 70], [196, 54]];
  return svg({ w: 220, h: 110, name: 'hog-pothole-front', label: 'the near edge of a hole' }, [
    piece(poly(lip), EARTH, { rough: 1, shadow: false }),
    // a darker earth shadow where the lip meets the hole
    piece(curve([[24, 56], [60, 78], [110, 84], [160, 78], [196, 56], [190, 62], [110, 72], [30, 62]], 1), EARTH_DARK, { edge: 'clean', shadow: false, opacity: 0.8 }),
    // the grassy front, with a wavy top over the earth
    piece(poly([[6, 78], [30, 84], [70, 90], [110, 92], [150, 90], [190, 84], [214, 78], [216, 94], [200, 108], [20, 108], [4, 94]]), GRASS, { rough: 1.1, shadow: false }),
    piece(poly([[40, 96], [110, 98], [180, 96], [170, 104], [50, 104]]), GRASS_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ink([[30, 90], [34, 80], [38, 90]], { width: 3, color: '#4f8a46' }),
    ink([[170, 90], [174, 78], [178, 90]], { width: 3, color: '#4f8a46' }),
  ]);
}
