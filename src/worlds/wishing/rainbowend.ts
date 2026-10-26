/**
 * rainbow-end: on top of the clouds, where the rainbow starts.
 *
 * A pale blue sky, a soft cloud floor (its top at y ≈ 620, open from x 300 to
 * 950) and a great arch of SEVEN grey stripes rising out of the cloud at the
 * left and sweeping up and off the top of the stage. At the right stands
 * Mother Dabble's little paint shed, made of cloud, with a wooden pot rack
 * that is empty (three rings on the shelf where the pots stand).
 *
 * The stripes are grey here on purpose: a cartoon lays the colours over them
 * one at a time with `rainbowStripe(i, colour)` (i = 0 is the top, outer
 * stripe: red; 6 is the inner one), added as an actor at x 0, y 0, w 1180
 * with a z of 3 to 4 (above the backdrop, below the actors).
 */
import { C } from '../../art/palette';
import { band, cached, circle, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** The middle of the arch, from inside the cloud at the left up and off the top. */
const SPINE: Pt[] = [[150, 740], [165, 600], [215, 440], [330, 280], [490, 150], [650, 50], [780, -70]];
const STRIPE_W = 27;
const STRIPES = 7;

/** One stripe's centre line: the spine pushed out (i < 3) or in (i > 3) from the middle. */
function stripeLine(i: number): Pt[] {
  const off = (3 - i) * (STRIPE_W - 1);
  return SPINE.map((p, k) => {
    const a = SPINE[Math.max(0, k - 1)];
    const b = SPINE[Math.min(SPINE.length - 1, k + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    // (dy, -dx) points up and out (away from the arch's inside).
    return [p[0] + (dy / len) * off, p[1] - (dx / len) * off] as Pt;
  });
}

/** One coloured stripe of the arch, alone, in a transparent 1180 × 820 picture. i = 0 (top, outer) to 6. */
export const rainbowStripe = cached((i: number, colour: string): string =>
  svg({ w: W, h: H, name: `wishing-rainbow-stripe-${i}-${colour}`, boil: false }, [
    piece(band(stripeLine(i), STRIPE_W), colour, { edge: 'cut', fibre: false, shadow: false, rough: 0.6 }),
  ]),
  8,
);

/** A lumpy cloud heap along y, with the top at about `top`. */
function heap(seed: number, top: number, from: number, to: number, size: number, tints: string[]): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  let i = 0;
  for (let x = from; x < to; x += size * 0.55) {
    const rr = size * (0.6 + r() * 0.7);
    out.push(piece(circle(x + (r() - 0.5) * 24, top + size * 0.8 - rr * 0.5 + (r() - 0.5) * 14, rr), tints[i++ % tints.length], { rough: 1.3, shadow: i % 4 === 0 }));
  }
  return out;
}

/** Lumpy puffs along the cloud floor's top edge, bottoms sunk into the slab. */
function floorPuffs(): Node[] {
  const r = rng(7);
  const tints = ['#eaf2f9', '#f6fafd', '#f0f6fb', '#e1ecf5'];
  const out: Node[] = [];
  let i = 0;
  for (let x = -50; x < W + 70; x += 46 + r() * 22) {
    const rr = 34 + r() * 30;
    out.push(piece(circle(x, 648 - rr * 0.5 + r() * 6, rr), tints[i++ % tints.length], { rough: 1.3, shadow: false }));
  }
  return out;
}

export const rainbowEnd = cached(() => {
  const grey = ['#b3b8c0', '#a9aeb7', '#bdc2c9', '#b0b5be', '#b7bcc4', '#a7acb5', '#bbc0c7'];
  const arch: Node[] = [];
  for (let i = 0; i < STRIPES; i++) arch.push(piece(band(stripeLine(i), STRIPE_W), grey[i], { edge: 'torn', rough: 0.5, shadow: i === 0 }));

  // A few small far clouds in the sky.
  const far: Node[] = [
    piece(ellipse(760, 200, 90, 12), C.white, { ...flat, opacity: 0.7 }),
    piece(ellipse(900, 160, 60, 9), C.white, { ...flat, opacity: 0.6 }),
    piece(ellipse(980, 300, 110, 12), C.white, { ...flat, opacity: 0.6 }),
    piece(ellipse(420, 380, 70, 9), C.white, { ...flat, opacity: 0.5 }),
  ];

  // The paint shed on the right: cloud walls, a cloud roof, a doorway, a pot rack.
  const shed: Node[] = [
    piece(rect(968, 480, 190, 180, 6), '#e3ecf5', { rough: 1.1 }),
    piece(poly([[950, 492], [1060, 410], [1170, 492]]), '#c9bfe0', { edge: 'torn', rough: 0.8 }),
    ...heap(31, 440, 970, 1160, 26, ['#f4f8fc', '#e9f0f8']),
    piece(rect(986, 500, 150, 124, 4), '#b79568', { edge: 'cut', fibre: false }),
    piece(rect(992, 506, 138, 112, 2), '#d4b684', { edge: 'cut', fibre: false, shadow: false }),
    // the empty rack: two shelves and three rings where the pots stood
    piece(rect(988, 566, 146, 12, 2), '#8c6a40', { edge: 'cut', fibre: false }),
    piece(rect(988, 528, 146, 10, 2), '#8c6a40', { edge: 'cut', fibre: false }),
    ...[1018, 1062, 1106].map((x) => ink([[x - 16, 564], [x - 14, 548], [x, 544], [x + 14, 548], [x + 16, 564]], { width: 3, color: '#a28258', opacity: 0.8, wobble: 0.4 })),
    ...[1018, 1062, 1106].map((x) => piece(ellipse(x, 524, 14, 4), '#bfa077', { ...flat, opacity: 0.7 })),
    // a small hook with a rag
    piece(poly([[1010, 596], [1026, 596], [1022, 614], [1012, 614]]), '#c9a3d6', flat),
  ];

  return svg({ w: W, h: H, name: 'wishing-rainbow-end', boil: false, className: 'backdrop' }, [
    // Sky: pale blue, paler towards the cloud.
    piece(rect(-20, -20, W + 40, H + 40), '#a9d3ee', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 180, W + 40, 300), '#bde0f3', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 360, W + 40, 300), '#d2ebf7', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    ...far,
    // The grey arch, behind the cloud floor.
    ...arch,
    // Cloud floor: a plain white-blue slab, then lumpy puffs along its top (about y 600-620).
    piece(rect(-20, 636, W + 40, 200), '#e4eef6', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    ...floorPuffs(),
    piece(rect(-20, 690, W + 40, 140), '#e4eef6', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    ...shed,
    piece(ellipse(560, 628, 220, 9), C.white, { ...flat, opacity: 0.6 }),
  ]);
});

/**
 * The front of the cloud floor, alone, to lay over coloured stripes so their
 * feet sink into the cloud as the grey ones do. Place at x 0, y 540, w 640
 * (its viewBox is cropped to 0 540 640 200), z 4.
 */
export const rainbowFoot = cached(() =>
  svg({ w: 640, h: 200, name: 'wishing-rainbow-foot', boil: false }, [
    piece(rect(-20, 636, W + 40, 200), '#e4eef6', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    ...floorPuffs(),
    piece(rect(-20, 690, W + 40, 140), '#e4eef6', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
  ]).replace(/viewBox="[^"]*"/, 'viewBox="0 540 640 200"'),
);
