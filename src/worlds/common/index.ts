/**
 * The common world: plain places and things any cartoon can use, so a new
 * world never has to draw its own sky. It has no characters (everyone
 * belongs to a world), only the narrator.
 *
 * It is also the smallest complete example of a world: copy its shape.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, group, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { star } from '../../art/ui';
import { defineWorld } from '../types';

const W = 1180;
const H = 820;

/** Rolling hills: a soft wavy band from x 0 to 1180, top near `y`. */
function hill(y: number, amp: number, seed: number, color: string): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, H + 20]];
  for (let x = -40; x <= W + 40; x += 120) pts.push([x, y + (r() - 0.5) * amp * 2]);
  pts.push([W + 40, H + 20]);
  return piece(curve(pts, 2), color, { rough: 1.4 });
}

/** A lumpy paper cloud centred on cx, cy. */
function cloudNodes(cx: number, cy: number, s: number, color: string = C.white): Node[] {
  return [
    piece(ellipse(cx, cy + 8 * s, 70 * s, 26 * s), color, { shadow: false }),
    piece(circle(cx - 30 * s, cy, 30 * s), color, { shadow: false }),
    piece(circle(cx + 12 * s, cy - 10 * s, 38 * s), color, { shadow: false }),
    piece(circle(cx + 46 * s, cy + 6 * s, 24 * s), color, { shadow: false }),
  ];
}

/** A daytime sky with clouds over green hills. Ground line at about y 640. */
const meadow = cached(() =>
  svg({ w: W, h: H, name: 'common-meadow', boil: false }, [
    piece(rect(-20, -20, W + 40, H + 40), C.sky, { edge: 'clean', shadow: false, fibre: false }),
    ...cloudNodes(220, 140, 1.1),
    ...cloudNodes(860, 100, 0.8),
    hill(520, 30, 11, C.green),
    hill(600, 24, 12, C.greenDark),
    hill(680, 14, 13, C.greenDeep),
  ]),
);

/** A starry night over dark hills, with a big moon top right. Ground line at about y 640. */
const night = cached(() => {
  const r = rng(77);
  const stars: Node[] = [];
  for (let i = 0; i < 40; i++) stars.push(piece(circle(r() * W, r() * 420, 2 + r() * 2.5), C.cream, { shadow: false, fibre: false, edge: 'clean' }));
  return svg({ w: W, h: H, name: 'common-night', boil: false }, [
    piece(rect(-20, -20, W + 40, H + 40), C.night, { edge: 'clean', shadow: false, fibre: false }),
    ...stars,
    piece(circle(960, 150, 70), C.cream),
    piece(circle(940, 135, 12), C.sand, { shadow: false }),
    hill(560, 26, 21, C.nightLight),
    hill(650, 18, 22, C.plum),
  ]);
});

/** Plain torn parchment: for title cards, a narrator's "meanwhile", or a dream. */
const paper = cached(() =>
  svg({ w: W, h: H, name: 'common-paper', boil: false }, [
    piece(rect(-20, -20, W + 40, H + 40), C.sand, { edge: 'clean', shadow: false }),
    piece(rect(70, 60, W - 140, H - 190), C.cream, { rough: 2 }),
  ]),
);

/** A wrapped present with a bow. */
const present = cached(() =>
  svg({ w: 120, h: 120, name: 'common-present' }, [
    piece(rect(18, 46, 84, 64, 3), C.red),
    piece(rect(54, 46, 12, 64), C.gold, { shadow: false }),
    piece(rect(12, 34, 96, 20, 3), C.redDark),
    group({}, [piece(ellipse(46, 28, 18, 10, -20), C.gold), piece(ellipse(74, 28, 18, 10, 20), C.gold), piece(circle(60, 32, 7), C.goldLight)]),
  ]),
);

/** A soft red heart (kindness, a thank-you). */
const heart = cached(() =>
  svg({ w: 120, h: 120, name: 'common-heart' }, [piece(curve(poly([[60, 104], [16, 60], [20, 26], [44, 18], [60, 36], [76, 18], [100, 26], [104, 60]]), 3), C.rose)]),
);

export default defineWorld({
  id: 'common',
  name: 'Anywhere',
  accent: C.slate,
  about: 'Plain places and things for any world. No characters: the narrator speaks here.',
  characters: {},
  backdrops: {
    meadow: { art: meadow, about: 'Day: blue sky, clouds, green hills. Ground line y ≈ 640; room for 4 actors.' },
    night: { art: night, about: 'Night: stars, a big moon top right, dark hills. Ground line y ≈ 640. Pair with k.dim() off, k.ambient("stars").' },
    paper: { art: paper, about: 'A torn parchment sheet: title cards, "meanwhile…", a memory or a dream.' },
  },
  props: {
    star: { art: () => star(true, 'common-star'), size: [100, 100], about: 'A gold paper star.' },
    present: { art: present, about: 'A wrapped present with a gold bow.' },
    heart: { art: heart, about: 'A soft red heart.' },
  },
});
