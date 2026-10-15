/**
 * The top of the ladder, above the cloud: where every land arrives.
 *
 * In the books you climb the ladder from Moon-Face's branch, up through
 * the cloud, and step out into whichever land has come. This is the view
 * from the top rung, before you step in: a dusk sky over a sea of cloud,
 * the ladder poking up on the left, the very top of the Faraway Tree's
 * leaves on the right, and an open sky in the middle where a land's far
 * view (the `far-<land>` props) sits. Episodes that visit a land can start
 * here, so he sees where they are going before they go.
 *
 * Also here, because they go with it or come back often:
 *   cloudFront  a strip of cloud to stand actors in (their busts sink into it)
 *   kettle      the Saucepan Man's whistling kettle, with a `lid` that lifts
 *   LAND_FARS   the far view of every land (600 × 180), as props by id
 */
import { C } from '../../art/palette';
import { band, cached, circle, ellipse, group, ink, piece, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import type { PropDef } from '../types';
import { LAND_ART } from './lands';
import { cloudBank, flat, sky, stars } from './lands/common';

const W = 1180;
const H = 820;

/** A lumpy cloud floor whose top wanders round `y`, from x -40 to w + 40, down to `bottom`. */
function cloudFloor(y: number, w: number, bottom: number, seed: number, color: string): Node[] {
  const r = rng(seed);
  const out: Node[] = [piece(rect(-40, y + 30, w + 80, bottom - y), color, { edge: 'clean', shadow: false, fibre: false })];
  for (let x = -40; x <= w + 40; x += 70 + r() * 30) out.push(piece(circle(x, y + 30 - r() * 18, 48 + r() * 26), color, { shadow: false, rough: 0.9 }));
  return out;
}

/** A long thin wisp of high cloud centred on cx, cy. */
function wisp(cx: number, cy: number, w: number, seed: number, color = '#c4cddd'): Node[] {
  const r = rng(seed * 13);
  return [
    piece(ellipse(cx, cy, w / 2, 12 + r() * 6), color, { ...flat, opacity: 0.8 }),
    piece(ellipse(cx - w * 0.18, cy - 10, w * 0.22, 14), color, { ...flat, opacity: 0.8 }),
    piece(ellipse(cx + w * 0.16, cy - 6, w * 0.18, 11), color, { ...flat, opacity: 0.8 }),
  ];
}

/** The ladder's top rungs, rising out of the cloud on the left. */
function ladderTop(): Node[] {
  const rails: Node[] = [
    piece(band([[104, 720], [112, 420]], 14), C.wood, { edge: 'cut' }),
    piece(band([[188, 720], [180, 420]], 14), C.wood, { edge: 'cut' }),
    piece(circle(112, 418, 9), C.barkLight, { edge: 'cut' }),
    piece(circle(180, 418, 9), C.barkLight, { edge: 'cut' }),
  ];
  const rungs = [450, 510, 570, 630].map((y) => piece(rect(108, y, 76, 10, 3), C.tan, { edge: 'cut', fibre: false }));
  return [...rails, ...rungs];
}

/** The very top of the Faraway Tree: a few leafy clumps poking up through the cloud on the right. */
function treeTop(): Node[] {
  const r = rng(305);
  const out: Node[] = [piece(band([[1110, 700], [1100, 560], [1080, 500]], 26), C.bark, { edge: 'cut' })];
  const clumps: [number, number, number][] = [[1060, 500, 56], [1120, 470, 62], [1150, 540, 58], [1030, 560, 48], [1100, 580, 52]];
  clumps.forEach(([x, y, s], i) => out.push(piece(circle(x + (r() - 0.5) * 8, y, s), [C.leafDark, C.leaf, C.moss][i % 3], { rough: 1.3, shadow: i % 2 === 0 })));
  return out;
}

/**
 * Above the cloud at dusk, from the top of the ladder (1180 × 820). The
 * middle of the sky (x 260 to 920, y 80 to 440) is open for a land's far
 * view; actors stand in the cloud along the bottom with their busts sunk
 * into a `cloud-front` strip.
 */
export const cloudTop = cached(() =>
  svg({ w: W, h: H, name: 'faraway-cloud-top', boil: false, className: 'backdrop' }, [
    ...sky([
      ['#6f84aa', 0],
      ['#8499ba', 110],
      ['#a3b1c9', 200],
      ['#c9bfc0', 280],
      ['#e2c3a4', 350],
      ['#efbb88', 420],
    ]),
    ...stars(22, 61, W, 130, [C.cream, C.goldLight]),
    // Thin wisps of evening cloud, high up and out of the middle.
    ...wisp(150, 190, 220, 3),
    ...wisp(1010, 150, 260, 4),
    ...wisp(860, 330, 180, 5, '#f3d9bd'),
    // The low sun, setting behind the cloud sea.
    piece(circle(930, 470, 96), C.goldLight, { ...flat, opacity: 0.3 }),
    piece(circle(930, 470, 58), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    // The far cloud sea, pink-gold in the dusk, then a nearer row.
    ...[100, 340, 600, 860, 1110].flatMap((cx, i) => cloudBank(cx, 512 + (i % 2) * 10, 300, 70 + i, i % 2 ? '#e8d3c2' : '#e4cdbb', '#c9ad98')),
    ...cloudFloor(560, W, 700, 81, '#e8e1d6'),
    ...treeTop(),
    ...ladderTop(),
    // The cloud they stand in: calm and plain along the bottom, where captions go.
    ...cloudFloor(640, W, H + 40, 91, C.cloud),
    ink([[160, 700], [320, 694], [460, 702]], { width: 3, color: C.cloudShade, opacity: 0.7, wobble: 2 }),
    ink([[700, 712], [880, 706], [1000, 714]], { width: 3, color: C.cloudShade, opacity: 0.7, wobble: 2 }),
  ]),
);

/**
 * A strip of cloud (1180 × 220) to lay in front of actors on `cloud-top`
 * (or anywhere up in the sky) so they stand *in* the cloud: place it at
 * x 0, y 600, z above the actors.
 */
export const cloudFront = cached(() => {
  const r = rng(117);
  const puffs: Node[] = [];
  for (let x = -30; x <= W + 30; x += 64 + r() * 26) puffs.push(piece(circle(x, 70 - r() * 22, 40 + r() * 22), C.cloud, { shadow: false, rough: 0.9 }));
  return svg({ w: W, h: 220, name: 'faraway-cloud-front', boil: false }, [
    piece(rect(-20, 70, W + 40, 170), C.cloud, { edge: 'clean', shadow: false, fibre: false }),
    ...puffs,
    ink([[60, 120], [220, 112], [360, 122]], { width: 3, color: C.cloudShade, opacity: 0.6, wobble: 2 }),
    ink([[760, 130], [920, 122], [1080, 132]], { width: 3, color: C.cloudShade, opacity: 0.6, wobble: 2 }),
  ]);
});

/**
 * The Saucepan Man's whistling kettle (180 × 160): round and copper, with
 * a curly spout (its whistle at the tip, top left), a black handle and a
 * `lid` that bobs when it whistles (origin at its middle).
 */
export const kettle = cached(() => {
  const spout: Pt[] = [[52, 112], [30, 98], [18, 74], [20, 54]];
  return svg({ w: 180, h: 160, name: 'faraway-kettle', label: 'a copper kettle' }, [
    // The handle arching over the top.
    ink([[56, 66], [64, 26], [116, 26], [124, 66]], { width: 10, color: C.charcoal }),
    piece(band(spout, 18), C.ginger, { edge: 'cut' }),
    piece(ellipse(20, 52, 10, 7, -20), C.brass, { edge: 'cut' }),
    piece(circle(18, 50, 3.5), C.brassDark, { ...flat }),
    // The round body, its shine and its base.
    piece(ellipse(92, 104, 64, 48), C.ginger),
    piece(ellipse(72, 92, 22, 14, -25), C.orange, { ...flat, opacity: 0.9 }),
    piece(ellipse(62, 86, 8, 5, -25), C.goldLight, { ...flat, opacity: 0.8 }),
    piece(rect(34, 136, 116, 14, 6), C.rust, { edge: 'cut' }),
    ink([[40, 120], [92, 128], [144, 120]], { width: 2.5, color: C.rust, opacity: 0.7 }),
    group({ part: 'lid', origin: [92, 62] }, [piece(ellipse(92, 62, 36, 10), C.orange, { edge: 'cut' }), piece(circle(92, 50, 9), C.charcoal, { edge: 'cut' })]),
  ]);
});

/** Every land's far view (the land sitting on its own cloud, 600 × 180), by id. */
const FARS: [number, string, string][] = [
  [1, 'enchanted-wood', 'The Enchanted Wood'],
  [2, 'topsy-turvy', 'The Land of Topsy-Turvy'],
  [3, 'goodies', 'The Land of Goodies'],
  [4, 'snap-school', 'Dame Snap’s School'],
  [5, 'birthdays', 'The Land of Birthdays'],
  [6, 'giants', 'The Land of Giants'],
  [7, 'spells', 'The Land of Spells'],
  [8, 'toys', 'The Land of Toys'],
  [9, 'snow', 'The Land of Snow'],
  [10, 'snap-prison', 'Dame Snap’s Prison'],
  [11, 'shoe', 'The Old Woman’s Shoe'],
  [12, 'music', 'The Land of Music'],
  [13, 'roundabouts', 'The Land of Roundabouts'],
  [14, 'goblin-caves', 'The Red Goblins’ caves'],
];

/**
 * `far-<land>` props: a land seen from a distance, sitting on its cloud,
 * as it arrives at the top of the tree. Put one in the open sky of
 * `cloud-top` (about x 290, y 160, w 600), or anywhere a land comes or goes.
 */
export const LAND_FARS: Record<string, PropDef> = Object.fromEntries(
  FARS.map(([n, id, label]) => [
    `far-${id}`,
    { art: () => LAND_ART[n].far(`faraway-far-${id}`), size: [600, 180], about: `${label}, far off, sitting on its own cloud (600 × 180): a land arriving at the top of the tree.` },
  ]),
);
