/**
 * The bears' places (1180 × 820 backdrops), painted with the scenery kit
 * (scenery.ts). Bear Cottage's garden comes first: it sets the look the
 * others follow.
 */
import { cached, curve, ellipse, rect, svg, type Node } from '../../art/paper';
import { hatch, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { bush, cloud, ground, GRASS, GRASS_DARK, path, pebbles, sky, tree, tufts } from './scenery';

const W = 1180;
const H = 820;

const THATCH = '#d9b25e';
const WALL = '#f1e6cc';
const DOOR = '#8a5a3a';

/** Bear Cottage from outside: a thatched cottage with a chimney, a round-topped door and two windows. Base at (x, y), about 300 wide at s = 1. */
export function cottage(x: number, y: number, s = 1): Node[] {
  const P = (px: number, py: number): [number, number] => [x + px * s, y + py * s];
  return [
    wash([P(-150, -150), P(150, -150), P(150, 0), P(-150, 0)], WALL, { light: -150, depth: 0.25 }),
    wash(curve([P(-176, -130), P(-110, -230), P(0, -262), P(110, -230), P(176, -130), P(120, -118), P(0, -124), P(-120, -118)], 2), THATCH, { hatch: 6, light: -120, depth: 0.3 }),
    wash([P(60, -296), P(98, -296), P(100, -214), P(58, -220)], '#c27d5a', { hatch: 5 }),
    wash(rect(x + 54 * s, y - 306 * s, 50 * s, 14 * s), '#a8644a', { lineWidth: 2, bloom: false }),
    ...[-120, -60, 0, 60, 120].map((dx) => pen([P(dx * 0.9, -240 + Math.abs(dx) * 0.6), P(dx * 1.2, -124)], { width: 1.4, opacity: 0.6 })),
    wash(curve([P(-26, 0), P(-26, -78), P(0, -100), P(26, -78), P(26, 0)], 2), DOOR, { hatch: 5 }),
    wash(ellipse(x + 14 * s, y - 40 * s, 3.5 * s, 3.5 * s), '#e0b84a', { lineWidth: 1, shade: false, bloom: false }),
    ...[-90, 90].flatMap((dx) => [
      wash(rect(x + (dx - 30) * s, y - 104 * s, 60 * s, 50 * s), '#b9d2e2', { lineWidth: 2 }),
      pen([P(dx, -104), P(dx, -54)], { width: 1.8 }),
      pen([P(dx - 30, -79), P(dx + 30, -79)], { width: 1.8 }),
    ]),
    hatch(curve([P(-150, -118), P(150, -118), P(150, -96), P(-150, -96)], 1), { gap: 5, angle: 75 }),
  ];
}

/**
 * Bear Cottage's front garden on a sunny day: the cottage at the back on
 * the left, a winding path, a big tree on the right, a picket fence.
 */
const garden = cached(() =>
  svg({ w: W, h: H, name: 'bears-garden' }, pageNodes(W, H, 'bears-garden', [
    ...sky(440),
    ...cloud(640, 200, 1.1, 2),
    ...cloud(250, 150, 0.75, 3),
    ground(470, paler(GRASS, 0.3), { amp: 26, seed: 4, line: false }),
    ...bush(80, 450, 1.2, 21),
    ...cottage(330, 520, 0.9),
    ground(540, GRASS, { amp: 20, seed: 5 }),
    path(560, 340, 528),
    ...tree(960, 600, 470, 6),
    ...bush(700, 520, 0.8, 22),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => wash(curve([[40 + i * 46, 600], [52 + i * 46, 586], [64 + i * 46, 600], [64 + i * 46, 660], [40 + i * 46, 660]], 1), '#f3eee2', { lineWidth: 1.8, bloom: false })),
    wash(rect(20, 612, 330, 12), '#f3eee2', { lineWidth: 1.6, bloom: false }),
    ...tufts(380, 1160, 640, 14, 12),
    ...pebbles(420, 660, 360, 60, 9, 14),
    ...tufts(0, 360, 680, 6, 13, GRASS_DARK),
  ])),
);

export const places: Record<string, () => string> = { garden };
