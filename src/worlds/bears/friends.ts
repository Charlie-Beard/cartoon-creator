/**
 * Teddy's friends from the green: Barney (his best friend, in green with
 * white stripes), little Teeny Bear, lively Bobby, Posy and Bella.
 *
 * Each is told apart at a glance by fur colour and clothes, and none looks
 * like Teddy (honey fur, red jumper, yellow stripes). The girls wear long
 * dresses, so their legs are hidden; the boys have legs.
 */
import { curve, ellipse, type Node } from '../../art/paper';
import { clipped, wash } from '../../art/watercolour';
import { bear, collar, dress, SKIRT, top, TORSO, type BearOpts } from './parts';

const WHITE = '#f6f1e6';

/** Horizontal stripes across a shape (a jumper or a skirt). */
function bands(shape: ReturnType<typeof curve>, color: string, ys: number[], width: number): Node {
  return clipped(
    shape,
    ys.map((y) => wash([[30, y - width / 2], [270, y - width / 2 - 4], [270, y + width / 2 - 4], [30, y + width / 2]], color, { line: false, depth: 0.5, wobble: 1.6 })),
  );
}

/** A bow: two loops and a knot, centred on (x, y). */
function bow(x: number, y: number, size: number, color: string, spots?: string): Node[] {
  const s = size;
  const out: Node[] = [
    wash(curve([[x, y], [x - 30 * s, y - 20 * s], [x - 36 * s, y + 6 * s], [x - 28 * s, y + 22 * s]], 1), color, { lineWidth: 2, bloom: false }),
    wash(curve([[x, y], [x + 30 * s, y - 20 * s], [x + 36 * s, y + 6 * s], [x + 28 * s, y + 22 * s]], 1), color, { lineWidth: 2, bloom: false }),
  ];
  if (spots) {
    for (const [dx, dy] of [[-24, -2], [-16, 8], [24, -2], [16, 8], [-20, 14], [20, 14]]) {
      out.push(wash(ellipse(x + dx * s, y + dy * s, 2.6 * s, 2.6 * s), spots, { line: false, shade: false, bloom: false, wobble: 0 }));
    }
  }
  out.push(wash(ellipse(x, y, 8 * s, 9 * s), color, { lineWidth: 2, bloom: false, shade: false }));
  return out;
}

// ---------------------------------------------------------------- Barney

const GREEN = '#5f9a5a';

const barneyBase = (): BearOpts => ({
  name: 'barney',
  label: 'Barney',
  fur: '#cdb592',
  sleeve: GREEN,
  cuff: WHITE,
  clothes: top(GREEN, { stripes: { color: WHITE, at: [236, 274, 306], width: 16 }, collar: WHITE }),
});

// ---------------------------------------------------------------- Teeny Bear

const BLUE = '#6f93c6';

const teenyBase = (): BearOpts => ({
  name: 'teeny-bear',
  label: 'Teeny Bear',
  fur: '#ecd9b0',
  sleeve: '#a9c2e4',
  cuff: WHITE,
  clothes: [...dress(BLUE, { spots: WHITE }), ...collar(WHITE)],
  legs: 'hidden',
  onFace: bow(66, 72, 0.95, '#4f77b8'),
});

// ---------------------------------------------------------------- Bobby

const ORANGE = '#e8913a';

const bobbyBase = (): BearOpts => ({
  name: 'bobby',
  label: 'Bobby',
  fur: '#a8754a',
  sleeve: ORANGE,
  cuff: WHITE,
  clothes: top(ORANGE, { stripes: { color: WHITE, at: [222, 252, 282, 310], width: 14 } }),
});

// ---------------------------------------------------------------- Posy

const POSY_RED = '#d2493f';

const posyBase = (): BearOpts => ({
  name: 'posy',
  label: 'Posy',
  fur: '#c9ab8a',
  sleeve: '#e4887f',
  cuff: WHITE,
  clothes: dress(POSY_RED, { spots: WHITE }),
  legs: 'hidden',
  onFace: bow(150, 58, 1.25, POSY_RED, WHITE),
});

// ---------------------------------------------------------------- Bella

const SUN = '#f0cc4a';

const bellaBase = (): BearOpts => ({
  name: 'bella',
  label: 'Bella',
  fur: '#8f6a48',
  sleeve: '#f6e08a',
  cuff: WHITE,
  clothes: [
    wash(TORSO, WHITE, { depth: 0.2 }),
    wash(SKIRT, WHITE, { depth: 0.22 }),
    bands(TORSO, SUN, [200, 226, 252, 278, 304], 14),
    bands(SKIRT, SUN, [256, 284, 312, 340], 15),
    ...collar(WHITE),
  ],
  legs: 'hidden',
});

export const friends: Record<string, () => string> = {
  barney: () => bear(barneyBase()),
  'barney:wave': () => bear({ ...barneyBase(), name: 'barney-wave', arms: 'wave', mouth: 'grin' }),
  'barney:happy': () => bear({ ...barneyBase(), name: 'barney-happy', arms: 'up', eyes: 'happy', mouth: 'grin' }),
  'teeny-bear': () => bear(teenyBase()),
  'teeny-bear:happy': () => bear({ ...teenyBase(), name: 'teeny-bear-happy', arms: 'up', eyes: 'happy', mouth: 'grin' }),
  bobby: () => bear(bobbyBase()),
  'bobby:happy': () => bear({ ...bobbyBase(), name: 'bobby-happy', arms: 'up', eyes: 'happy', mouth: 'grin' }),
  posy: () => bear(posyBase()),
  'posy:happy': () => bear({ ...posyBase(), name: 'posy-happy', arms: 'up', eyes: 'happy', mouth: 'grin' }),
  bella: () => bear(bellaBase()),
  'bella:happy': () => bear({ ...bellaBase(), name: 'bella-happy', arms: 'up', eyes: 'happy', mouth: 'grin' }),
};
