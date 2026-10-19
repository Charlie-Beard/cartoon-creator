/**
 * Teddy Goes Flying's own art, in the bears' watercolour-and-ink look
 * (src/art/watercolour.ts). Nothing here is needed by another episode yet:
 *
 *   stool       the green kitchen stool Teddy stands on to see out of the window (as in the book)
 *   kiteString  Barney's kite string, a thin pen line from its bottom-left corner to its top-right
 *   ropeCoil    the coil of rope at the helicopter's door, for him to tap
 *   longRope    a long rope that unrolls from the helicopter down to Teddy in the mud
 *   mud         blobs of mud to lay over Teddy after the SPLAT (on the 300 × 340 portrait grid)
 */
import { band, cached, ellipse, rect, svg, type Pt } from '../../kit';
import { blot, deeper, pen, wash } from '../../art/watercolour';

const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

const GREEN = '#7fa65a';
const ROPE = '#c9a86a';
const MUD = '#7a5634';

/** The green wooden stool: a round-cornered seat on four splayed legs. 160 × 110. */
export const stool = cached(() =>
  svg({ w: 160, h: 110, name: 'teddy-flying-stool', label: 'a green stool' }, [
    wash(P(30, 30, 18, 106, 34, 106, 46, 30), GREEN, { lineWidth: 2, depth: 0.4, bloom: false }),
    wash(P(114, 30, 126, 106, 142, 106, 130, 30), GREEN, { lineWidth: 2, depth: 0.4, bloom: false }),
    wash(P(60, 30, 58, 96, 70, 96, 72, 30), deeper(GREEN, 0.2), { lineWidth: 1.6, bloom: false, shade: false }),
    wash(P(90, 30, 92, 96, 104, 96, 102, 30), deeper(GREEN, 0.2), { lineWidth: 1.6, bloom: false, shade: false }),
    wash(rect(26, 66, 108, 9, 3), GREEN, { lineWidth: 1.8, bloom: false, shade: false }),
    wash(rect(8, 10, 144, 24, 10), GREEN, { lineWidth: 2.4, depth: 0.35, hatch: 6 }),
    pen(P(24, 18, 70, 16), { width: 1.2, opacity: 0.6 }),
  ]),
);

/**
 * Barney's kite string: a slack pen line from the bottom-left corner of its
 * box (his paw) to the top-right (the kite). Scaled from the paw end as the
 * kite climbs, so it always reaches the kite.
 */
export const kiteString = cached((w: number, h: number) =>
  svg({ w, h, name: 'teddy-flying-string', label: 'a kite string' }, [
    pen(P(0, h, w * 0.3, h * 0.62, w * 0.62, h * 0.3, w, 0), { width: 2, breaks: 0.1, wobble: 0.6 }),
  ]),
);

/** The coil of rope by the helicopter's door, looped three times with a loose end. 90 × 70. */
export const ropeCoil = cached(() =>
  svg({ w: 90, h: 70, name: 'teddy-flying-coil', label: 'a coil of rope' }, [
    wash(ellipse(45, 40, 36, 22), ROPE, { lineWidth: 2.2, depth: 0.35, bloom: false }),
    wash(ellipse(45, 40, 24, 13), '#e9d6ad', { lineWidth: 1.8, shade: false, bloom: false }),
    pen(ellipse(45, 40, 30, 18), { closed: true, width: 1.4, opacity: 0.7 }),
    pen(P(70, 52, 78, 60, 76, 68), { width: 2.6, color: deeper(ROPE, 0.4) }),
  ]),
);

/** A long rope, 20 × 200, hanging straight down from its top, with a knot at the bottom. */
export const longRope = cached(() =>
  svg({ w: 20, h: 200, name: 'teddy-flying-rope', label: 'a rope' }, [
    wash(band(P(10, 0, 12, 60, 8, 120, 11, 196), 7), ROPE, { shade: deeper(ROPE, 0.3), depth: 0.4, lineWidth: 1.8, bloom: false, wobble: 0.5 }),
    ...[24, 54, 84, 114, 144, 174].map((y) => pen(P(6, y, 15, y + 5), { width: 1.2, opacity: 0.7 })),
    wash(ellipse(11, 192, 8, 7), ROPE, { lineWidth: 1.6, bloom: false, shade: false }),
  ]),
);

/** Mud on Teddy: brown blobs on his jumper, a cheek, an ear and his feet, on the portrait's 300 × 340 grid. */
export const mud = cached(() =>
  svg({ w: 300, h: 340, name: 'teddy-flying-mud', label: 'mud' }, [
    blot(ellipse(118, 262, 26, 18, 20), MUD, 0.75),
    blot(ellipse(196, 290, 30, 16, -10), MUD, 0.7),
    blot(ellipse(150, 312, 40, 14), MUD, 0.65),
    blot(ellipse(92, 300, 14, 10), MUD, 0.7),
    blot(ellipse(214, 236, 12, 9), MUD, 0.7),
    blot(ellipse(112, 168, 12, 9, 30), MUD, 0.6),
    blot(ellipse(222, 74, 12, 10), MUD, 0.6),
    blot(ellipse(110, 334, 26, 8), MUD, 0.75),
    blot(ellipse(192, 334, 26, 8), MUD, 0.75),
    pen(P(126, 278, 127, 292), { width: 3, color: MUD, opacity: 0.7 }),
    pen(P(204, 304, 205, 318), { width: 3, color: MUD, opacity: 0.7 }),
  ]),
);
