/** The Monster Book cage and a pile of ordinary books (made for "The Book That Bites"). */
import { C } from '../../../art/palette';
import { dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

const IRON = '#2c2a30';
const IRON_LIGHT = '#4a4852';

/**
 * A big black iron cage standing on the floor, 320 × 360, like a giant
 * birdcage: a low base, straight bars, a domed top and a ring. Between the
 * bars it is nearly transparent (only a faint shade), so characters placed
 * BEHIND it (lower z) show through.
 *
 *   Bottom edge y 360 stands on the floor. Inside rectangle (where
 *   things in the cage go): x 40 to 280, y 92 to 322, so something about
 *   200 wide fits.
 *   Part `door`: the latch door in the front, x 118 to 202, y 190 to 322.
 *   Origin [118, 256], its left hinge edge: rotate it about y (or swing it)
 *   to open. It is also see-through.
 */
export function bookCage(): string {
  const nodes: Node[] = [];
  // a faint shade inside: the bars carry the picture, not a wall
  nodes.push(piece(rect(40, 92, 240, 230), '#1a1820', { edge: 'clean', shadow: false, opacity: 0.1 }));
  nodes.push(piece(ellipse(160, 326, 120, 10), '#1a1820', { edge: 'clean', shadow: false, opacity: 0.18 }));
  // the dome: curved ribs from the ring down to the top rail
  for (const x of [40, 86, 124, 160, 196, 234, 280]) {
    const spread = (x - 160) / 120;
    const arch: Array<[number, number]> = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      // ribs bow outward, so the top reads as a dome
      arch.push([160 + (x - 160) * t + spread * Math.sin(t * Math.PI) * 12, 26 + 66 * t - Math.sin(t * Math.PI) * 10 * (1 - Math.abs(spread) * 0.4)]);
    }
    nodes.push(ink(arch, { width: 5, color: IRON }));
  }
  // the ring on the very top
  nodes.push(
    ink([[148, 22], [148, 8], [172, 8], [172, 22]], { width: 6, color: IRON }),
    piece(ellipse(160, 28, 16, 7), IRON, { edge: 'cut', fibre: false, shadow: false }),
  );
  // upright bars all round (the front ones soften where the door is)
  for (let x = 40; x <= 280; x += 24) {
    const behindDoor = x > 118 && x < 202;
    nodes.push(ink([[x, 92], [x, 322]], { width: 5, color: IRON_LIGHT, opacity: behindDoor ? 0.45 : 0.9 }));
  }
  // rails: top and middle
  nodes.push(
    piece(rect(30, 86, 260, 12, 3), IRON, { edge: 'cut', fibre: false }),
    ink([[40, 190], [118, 190]], { width: 5, color: IRON }),
    ink([[202, 190], [280, 190]], { width: 5, color: IRON }),
  );
  // the door: a see-through frame with bars and a latch
  nodes.push(
    group({ part: 'door', origin: [118, 256] }, [
      ink([[118, 190], [160, 190], [202, 190]], { width: 6, color: IRON }),
      ink([[202, 190], [202, 256], [202, 322]], { width: 6, color: IRON }),
      ink([[202, 322], [160, 322], [118, 322]], { width: 6, color: IRON }),
      ink([[118, 322], [118, 256], [118, 190]], { width: 6, color: IRON }),
      ...[146, 174].map((x) => ink([[x, 192], [x, 320]], { width: 4, color: IRON_LIGHT })),
      ink([[118, 256], [202, 256]], { width: 4, color: IRON_LIGHT }),
      piece(rect(194, 246, 14, 20, 3), '#b08a3a', { edge: 'cut', fibre: false }),
      dot(201, 256, 2.5, C.ink),
      dot(118, 214, 4, '#b08a3a'),
      dot(118, 300, 4, '#b08a3a'),
    ]),
  );
  // the base: a heavy iron tray with feet
  nodes.push(
    piece(rect(18, 322, 284, 24, 5), IRON),
    piece(rect(18, 322, 284, 6, 3), IRON_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[34, 346], [60, 346], [54, 360], [40, 360]]), IRON, { edge: 'cut', fibre: false }),
    piece(poly([[260, 346], [286, 346], [280, 360], [266, 360]]), IRON, { edge: 'cut', fibre: false }),
    piece(poly([[146, 346], [174, 346], [170, 360], [150, 360]]), IRON, { edge: 'cut', fibre: false }),
    ink([[44, 90], [270, 90]], { width: 2, color: '#8a8896', opacity: 0.6 }),
  );
  return svg({ w: 320, h: 360, name: 'hogwarts-book-cage', label: 'a big iron cage' }, nodes);
}

/** A few ordinary books stacked up, a little crooked, 200 × 160. Bottom edge y 160 is flat. */
export function bookPile(): string {
  const books: Array<[number, number, number, number, string]> = [
    // x, y (top), w, h, cover
    [14, 112, 172, 44, '#8a3a34'],
    [30, 76, 148, 38, '#34507c'],
    [20, 44, 160, 34, '#3f6b4c'],
    [44, 16, 120, 30, '#d0a24a'],
  ];
  const nodes: Node[] = [];
  books.forEach(([x, y, w, h, col], i) => {
    const t = i % 2 ? 2 : 0;
    nodes.push(
      piece(poly([[x, y + h], [x, y + t], [x + w, y + 2 - t], [x + w, y + h]]), col, { edge: 'cut' }),
      piece(rect(x + 12, y + 8, w - 14, h - 16, 1), C.cream, { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(x + 4, y + 4, 10, h - 8, 1), col, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
      piece(rect(x + 4, y + h * 0.3, 10, 4, 0), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(x + 4, y + h * 0.7, 10, 4, 0), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    );
  });
  // a bookmark ribbon hanging out of the second book
  nodes.push(ink([[150, 114], [154, 132], [150, 140]], { width: 4, color: '#c4506a' }));
  return svg({ w: 200, h: 160, name: 'hogwarts-book-pile', label: 'a pile of books' }, nodes);
}
