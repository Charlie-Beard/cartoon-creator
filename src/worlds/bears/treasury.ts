/**
 * The Teddy Bear Treasury's bears: Teddy's Grandpa (and the day he was a
 * ventriloquist), jolly Aunt Bertha, and Grumpy Bertie Bear in every state
 * a grumpy bear can get into: grand, soaked, in a borrowed gown, in a
 * borrowed jumper, sad and happy.
 *
 * All of them are built by `bear()` in parts.ts, like Teddy and his family,
 * so they have the same parts and move the same way.
 */
import { circle, curve, dot, ellipse, group, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';
import { teddyBase } from './family';
import { bear, bearNodes, bowTie, collar, dress, FUR, SKIRT, top, TORSO, waistcoat, type BearOpts } from './parts';

const RED = '#c8433a';
const BLUE = '#4f6fae';
const WHITE = '#f6f1e6';
const GOLD = '#e0b13c';
const PEN = '#5a4636';

/** A raindrop or a tear: a round bottom and a point on top. */
function drop(x: number, y: number, s = 1): Node {
  return wash(curve([[x, y - 9 * s], [x + 5.5 * s, y + 2 * s], [x, y + 8 * s], [x - 5.5 * s, y + 2 * s]], 2), '#8dbbe4', { lineWidth: 1.3, shade: false, bloom: false, wobble: 0.5 });
}

// ------------------------------------------------------------- Grandpa Bear

/** Round spectacles, as Captain Bear's, but thinner and a little lower on the nose. */
function spectacles(): Node[] {
  const lens = (x: number): Node[] => [blot(circle(x, 118, 13), '#cfe3f2', 0.5), pen(circle(x, 118, 15), { closed: true, width: 2, color: PEN, breaks: 0.1 })];
  return [
    ...lens(120),
    ...lens(180),
    pen([[135, 116], [150, 112], [165, 116]], { width: 2, color: PEN }),
    pen([[105, 116], [80, 108]], { width: 2, color: PEN }),
    pen([[195, 116], [220, 108]], { width: 2, color: PEN }),
  ];
}

/** A grey-toffee fur, with a greying muzzle and a few white whisker-tufts over the brows. */
const grandpaBase = (): BearOpts => ({
  name: 'grandpa-bear',
  label: 'Grandpa Bear',
  fur: '#a98863',
  muzzle: '#d6cfc2',
  snout: 1.2,
  sleeve: '#f0ead8',
  cuff: '#f0ead8',
  clothes: [...waistcoat('#7a4a8c', '#f0ead8'), ...bowTie(BLUE)],
  onFace: [
    ...spectacles(),
    // white tufts above the brows, because a showman is allowed his eyebrows
    pen([[96, 90], [108, 82], [118, 88]], { width: 2.6, color: '#efe9de' }),
    pen([[182, 88], [192, 82], [204, 90]], { width: 2.6, color: '#efe9de' }),
  ],
  mouth: 'grin',
  brows: 'kind',
});

export const grandpaBear = (): string => bear(grandpaBase());

/**
 * Grandpa sits with little Teddy on his knee, Teddy pretending to be his
 * dummy. The joke is that Grandpa talks without moving his lips, so
 * Grandpa's mouth is a plain drawing (no `mouth` or `mouthOpen` part) and
 * the only talking mouth in the picture is Teddy's.
 */
export const grandpaMarmaduke = (): string => {
  const dummy = bearNodes({
    ...teddyBase(),
    name: 'grandpa-marmaduke-teddy',
    nested: true,
    legs: 'sit',
    arms: 'down',
    eyes: 'wide',
    brows: 'raised',
    mouth: 'grin',
  });
  return bear({
    ...grandpaBase(),
    name: 'grandpa-bear-marmaduke',
    legs: 'sit',
    arms: 'hips',
    talks: false,
    mouth: 'smile',
    extra: [group({ transform: 'translate(67 156) scale(0.55)' }, [dummy])],
  });
};

// ------------------------------------------------------------- Aunt Bertha

/** Yellow gingham: pale and deeper yellow bands crossing, cut to the dress. */
function checkDress(): Node[] {
  const bands = (outline: Pt[]): Node => {
    const nodes: Node[] = [];
    for (let x = 40; x < 270; x += 26) nodes.push(blot([[x, 170], [x + 11, 170], [x + 11, 350], [x, 350]], '#d99a2a', 0.5));
    for (let y = 180; y < 350; y += 26) nodes.push(blot([[40, y], [270, y], [270, y + 11], [40, y + 11]], '#d99a2a', 0.5));
    return clipped(outline, nodes);
  };
  return [
    ...dress('#f3d86a'),
    bands(TORSO),
    bands(SKIRT),
    pen(SKIRT, { closed: true, width: 2.2, breaks: 0.6 }),
    pen(TORSO, { closed: true, width: 2, breaks: 0.7, opacity: 0.6 }),
  ];
}

/** A cameo at the collar: a pink oval in a gold rim, with a tiny white profile. */
function cameo(): Node[] {
  return [
    wash(ellipse(150, 216, 12, 15), GOLD, { lineWidth: 1.8, shade: false, bloom: false }),
    wash(ellipse(150, 216, 8.5, 11.5), '#d9a5a0', { line: false, shade: false, bloom: false }),
    pen([[148, 210], [152, 211], [153, 215], [155, 217], [152, 218], [152, 222], [148, 221]], { width: 1.2, color: '#fbf3ea', breaks: 0, taper: false }),
  ];
}

/** A frilled mob cap: a soft dome, a scalloped frill all round, a ribbon bow. */
function mobCap(): Node[] {
  const frill: Node[] = [];
  // the frill follows the brim from the left ear, over the brow, to the right ear
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI * (1 + i / 10);
    frill.push(wash(circle(150 + Math.cos(a) * 64, 66 + Math.sin(a) * 14, 13), '#fbf8f0', { lineWidth: 1.8, bloom: false, depth: 0.15 }));
  }
  return [
    wash(curve([[88, 66], [96, 30], [150, 12], [204, 30], [212, 66], [150, 56]], 2), '#f9f5ea', { lineWidth: 2.2, depth: 0.2 }),
    ...frill,
    // a gathered band, and a pink ribbon bow at one side
    pen([[100, 52], [150, 44], [200, 52]], { width: 1.6, opacity: 0.55 }),
    wash(curve([[172, 40], [196, 28], [198, 52]], 1), '#e58aa0', { lineWidth: 1.8, bloom: false }),
    wash(curve([[172, 40], [150, 30], [152, 54]], 1), '#e58aa0', { lineWidth: 1.8, bloom: false }),
    dot(172, 41, 5, '#c9627a'),
  ];
}

export const auntBertha = (): string =>
  bear({
    name: 'aunt-bertha',
    label: 'Aunt Bertha Bear',
    fur: FUR.golden,
    snout: 1.12,
    sleeve: '#f6e594',
    cuff: WHITE,
    clothes: [...checkDress(), ...collar(WHITE), ...cameo()],
    legs: 'hidden',
    arms: 'hips',
    // bright dot eyes, not 'happy' arcs: the portrait must keep its blinking `lids`
    mouth: 'grin',
    brows: 'raised',
    tilt: 4,
    hat: mobCap(),
  });

// ------------------------------------------------------------- Bertie Bear

/** Older and paler than the cubs: a cream-honey fur. */
const BERTIE_FUR = '#e6cf9f';

/** The red, white and blue blazer: vertical stripes, navy lapels, a pocket square. */
function blazer(wet = false): Node[] {
  const bands: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 50 + i * 24;
    bands.push(wash([[x, 170], [x + 13, 170], [x + 13, 330], [x, 330]], i % 2 ? BLUE : RED, { line: false, depth: 0.5, wobble: 1.4 }));
  }
  const out: Node[] = [
    wash(TORSO, '#fbf7ec', { depth: 0.2 }),
    clipped(TORSO, bands),
    pen(TORSO, { closed: true, width: 2.2, breaks: 0.6 }),
    // the shirt, a V down the front
    wash(curve([[122, 186], [178, 186], [150, 262]], 1), '#fbf7ec', { lineWidth: 1.8, bloom: false, depth: 0.15 }),
    // lapels
    wash(curve([[104, 188], [128, 190], [150, 258], [122, 250], [112, 222]], 2), '#2f4670', { lineWidth: 2, depth: 0.2 }),
    wash(curve([[196, 188], [172, 190], [150, 258], [178, 250], [188, 222]], 2), '#2f4670', { lineWidth: 2, depth: 0.2 }),
    // a red bow tie, because he is a bit grand
    ...bowTie(RED, WHITE),
    dot(150, 276, 4, GOLD),
    dot(150, 300, 4, GOLD),
    // pocket square
    wash(curve([[184, 254], [204, 250], [206, 262], [186, 266]], 1), WHITE, { lineWidth: 1.6, bloom: false }),
  ];
  if (wet) out.push(blot(TORSO, '#46678c', 0.3));
  return out;
}

const bertieBase = (): BearOpts => ({
  name: 'bertie',
  label: 'Grumpy Bertie Bear',
  fur: BERTIE_FUR,
  snout: 1.15,
  sleeve: '#fbf7ec',
  sleeveStripes: [RED, BLUE],
  cuff: '#2f4670',
  clothes: blazer(),
  brows: 'cross',
  mouth: 'frown',
});

export const bertie = (): string => bear(bertieBase());

/** Drenched: damp dark fur, drips everywhere, a sneeze coming. */
const bertieSoaked = (): string =>
  bear({
    ...bertieBase(),
    name: 'bertie-soaked',
    fur: '#bb9d70',
    sleeveStripes: [RED, BLUE],
    clothes: blazer(true),
    eyes: 'shut',
    brows: 'worried',
    mouth: 'o',
    tilt: -4,
    onFace: [
      // drips off the ears, the nose and the chin
      drop(78, 98),
      drop(222, 96, 1.1),
      drop(150, 188, 1.2),
      drop(112, 74, 0.9),
      // plastered fringe
      pen([[112, 70], [134, 82], [150, 70], [166, 82], [188, 70]], { width: 2.4, color: deeper('#bb9d70', 0.4), opacity: 0.8 }),
    ],
    extra: [drop(44, 230), drop(262, 250, 1.2), drop(30, 300, 0.9), drop(214, 320), drop(96, 336, 0.9), drop(270, 200, 0.9)],
  });

/** Teddy's red dressing gown with its cord, round an older bear sitting down. */
function gown(): Node[] {
  const robe = '#c04038';
  return [
    wash(TORSO, robe, { depth: 0.24 }),
    // the shawl collar and the gap down the front
    wash(curve([[104, 188], [132, 190], [150, 316], [78, 306], [68, 270], [78, 222]], 2), deeper(robe, 0.04), { line: false, bloom: false }),
    wash(curve([[108, 186], [150, 196], [192, 186], [180, 206], [150, 262], [120, 206]], 2), '#a4332e', { lineWidth: 2, depth: 0.2 }),
    pen([[150, 262], [150, 316]], { width: 2, opacity: 0.6 }),
    // the cord belt, with a knot and two tassels
    pen([[74, 262], [150, 270], [226, 262]], { width: 6, color: '#f0d890', breaks: 0, taper: false }),
    pen([[74, 262], [150, 270], [226, 262]], { width: 1.4, color: PEN, breaks: 0.2, opacity: 0.6 }),
    wash(ellipse(150, 270, 11, 9), '#f0d890', { lineWidth: 1.8, shade: false, bloom: false }),
    pen([[146, 278], [138, 304]], { width: 3.2, color: '#f0d890', breaks: 0, taper: false }),
    pen([[154, 278], [162, 302]], { width: 3.2, color: '#f0d890', breaks: 0, taper: false }),
    dot(138, 306, 4, '#e0b95a'),
    dot(162, 304, 4, '#e0b95a'),
  ];
}

const bertieGown = (): string =>
  bear({
    ...bertieBase(),
    name: 'bertie-gown',
    sleeve: '#c04038',
    sleeveStripes: undefined,
    cuff: '#a4332e',
    clothes: gown(),
    legs: 'sit',
    arms: 'hold',
    brows: 'cross',
    mouth: 'frown',
  });

/** A green woolly jumper with cream stripes and a red patch on each elbow. */
const GREEN = '#58935a';
const elbow = (x: number, y: number, tilt: number): Node => wash(ellipse(x, y, 11, 15, tilt), '#c8433a', { lineWidth: 1.8, shade: false, bloom: false, wobble: 0.8 });
const bertieJumper = (): string =>
  bear({
    ...bertieBase(),
    name: 'bertie-jumper',
    sleeve: GREEN,
    sleeveStripes: undefined,
    cuff: '#efe6c8',
    clothes: [
      ...top(GREEN, { stripes: { color: '#efe6c8', at: [236, 276], width: 18 }, collar: '#efe6c8' }),
      // knitting: little stitches between the stripes
      ...[0, 1, 2, 3, 4, 5].flatMap((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => pen([[96 + c * 18 + (r % 2) * 9, 214 + r * 18], [100 + c * 18 + (r % 2) * 9, 224 + r * 18]], { width: 1.2, color: '#3d6f40', opacity: 0.7, breaks: 0, taper: false })),
      ),
    ],
    holdL: [elbow(75, 253, 18)],
    holdR: [elbow(225, 253, -18)],
    arms: 'down',
    brows: 'raised',
    mouth: 'flat',
    tilt: 3,
  });

/** Blazer, worried and about to cry, head tilted, one small tear. */
const bertieSad = (): string =>
  bear({
    ...bertieBase(),
    name: 'bertie-sad',
    brows: 'worried',
    mouth: 'frown',
    tilt: -7,
    onFace: [drop(116, 144, 0.9)],
  });

const bertieHappy = (): string =>
  bear({
    ...bertieBase(),
    name: 'bertie-happy',
    arms: 'out',
    eyes: 'happy',
    brows: 'kind',
    mouth: 'grin',
    tilt: 3,
  });

export const treasury: Record<string, () => string> = {
  'grandpa-bear': grandpaBear,
  'grandpa-bear:marmaduke': grandpaMarmaduke,
  'aunt-bertha': auntBertha,
  bertie,
  'bertie:soaked': bertieSoaked,
  'bertie:gown': bertieGown,
  'bertie:jumper': bertieJumper,
  'bertie:sad': bertieSad,
  'bertie:happy': bertieHappy,
};
