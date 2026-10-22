/**
 * Jigs, the merry little pixie who minds the Wishing-Chair, and his red
 * spotted umbrella.
 *
 * Jigs is all point: two big pointed ears, a tall yellow hat that flops
 * over at the tip with a tiny gold bell, and a sandy tuft under the brim.
 * A brown jerkin with a ring of green leaves at the neck, rosy cheeks and a
 * cheeky grin. No wings (he is a house pixie, not a flying one). Yellow hat
 * and brown tunic keep him well apart from Faraway's Angry Pixie (red cap,
 * green tunic).
 *
 * Parts: the usual person() ones, plus `ears` (both ears, to waggle) and
 * `hat` (pivots at the brim; the bell goes with it).
 *
 * The umbrella comes in two drawings: the right way up, and blown inside
 * out (the canopy turned up like a tulip, the spokes showing) for the
 * gust that takes it.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso } from '../faraway/parts';

const SKIN = C.skin;
const HAIR = C.hairSandy;
const HAT = C.yellow;
const HAT_DARK = '#c9962a';
const LEAF = C.green;

/** Jigs: big ears, tall yellow hat with a bell, brown jerkin, leafy collar. */
export const jigs = cached((): string => {
  const leaf = (x: number, y: number, rot: number, col: string = LEAF): Node =>
    piece(ellipse(x, y, 20, 9, rot), col, { ...CUT, rough: 0.8 });
  return person({
    name: 'wishing-jigs',
    label: 'Jigs',
    skin: SKIN,
    face: [56, 58],
    ears: false,
    behindHead: [
      // sandy hair at the back, and the two big ears
      piece(ellipse(cx, cy - 18, 58, 52), HAIR),
      group({ part: 'ears', origin: [cx, cy] }, [
        piece(curve([[cx - 46, cy - 14], [cx - 90, cy - 36], [cx - 128, cy - 78], [cx - 100, cy - 4], [cx - 82, cy + 24], [cx - 48, cy + 26]], 2), SKIN),
        piece(curve([[cx - 52, cy - 6], [cx - 86, cy - 28], [cx - 104, cy - 52], [cx - 88, cy + 4], [cx - 60, cy + 18]], 2), C.pink, { ...FLAT, opacity: 0.55 }),
        piece(curve([[cx + 46, cy - 14], [cx + 90, cy - 36], [cx + 128, cy - 78], [cx + 100, cy - 4], [cx + 82, cy + 24], [cx + 48, cy + 26]], 2), SKIN),
        piece(curve([[cx + 52, cy - 6], [cx + 86, cy - 28], [cx + 104, cy - 52], [cx + 88, cy + 4], [cx + 60, cy + 18]], 2), C.pink, { ...FLAT, opacity: 0.55 }),
      ]),
    ],
    body: [
      torso(C.brown, 0, 232),
      // jerkin: a darker front panel, stitches and a belt
      piece(poly([[112, 244], [188, 244], [196, 345], [104, 345]]), C.brownDark, { ...FLAT, opacity: 0.55 }),
      ink([[150, 252], [150, 340]], { width: 2.5, color: C.cream, opacity: 0.7 }),
      ...[266, 288, 310].map((y) => dot(150, y, 4.5, C.gold)),
      piece(poly([[40, 316], [260, 316], [262, 336], [38, 336]]), C.rust, CUT),
      // leafy collar
      leaf(104, 238, -30, C.greenDark),
      leaf(196, 238, 30, C.greenDark),
      leaf(118, 248, 20),
      leaf(182, 248, -20),
      leaf(136, 254, 50, C.leafLight),
      leaf(164, 254, -50, C.leafLight),
    ],
    neck: SKIN,
    onHead: [],
    front: [
      // a sandy fringe under the hat and a tuft that sticks out
      piece(curve([[96, 96], [112, 84], [150, 92], [190, 82], [206, 98], [196, 112], [170, 100], [150, 108], [126, 100], [104, 112]], 2), HAIR),
      piece(poly([[104, 100], [84, 112], [96, 128], [108, 112]]), HAIR),
      piece(poly([[196, 100], [214, 110], [204, 128], [192, 112]]), HAIR),
    ],
    hat: [
      // tall cone, flopping over at the tip, with a band and a bell
      piece(curve([[96, 86], [114, 60], [134, 30], [160, 12], [192, 12], [208, 30], [192, 28], [176, 38], [176, 58], [204, 86]], 2), HAT),
      piece(curve([[140, 62], [150, 38], [164, 20], [174, 32], [166, 58]], 1), HAT_DARK, { ...FLAT, opacity: 0.4 }),
      piece(band([[96, 78], [150, 84], [206, 78]], 14), C.rust, CUT),
      piece(ellipse(150, 86, 66, 9), HAT_DARK, CUT),
      piece(circle(208, 38, 8), C.gold, CUT),
      dot(206, 35, 2.4, C.goldLight),
      ink([[196, 26], [206, 33]], { width: 2.5, color: HAT_DARK }),
    ],
    eyes: 'big',
    eyeCol: C.green,
    eyeDx: 24,
    eyeY: 2,
    browCol: '#a8741e',
    browY: -22,
    mouth: 'grin',
    mouthY: 38,
    cheeks: C.rose,
    arms: [
      arm('armL', { from: [66, 270], via: [50, 302], to: [56, 334], sleeve: C.brown, cuff: C.greenDark, hand: SKIN }),
      arm('armR', { from: [234, 270], via: [250, 302], to: [244, 334], sleeve: C.brown, cuff: C.greenDark, hand: SKIN }),
    ],
  });
});

/** The ribs, as ink, from the handle top out to each rib tip. */
const spokes = (top: [number, number], tips: [number, number][]): Node[] =>
  tips.map((t) => ink([top, t], { width: 3, color: '#6b3a22' }));

/** Jigs's red umbrella with white spots, open and the right way up. */
export const umbrella = cached((): string => {
  const handle = band([[80, 78], [80, 140], [82, 160], [96, 168], [108, 158]], 8);
  return svg({ w: 160, h: 180, name: 'wishing-umbrella' }, [
    // handle first so the canopy sits over it: a curly wooden crook
    piece(handle, C.brown, CUT),
    ink([[80, 14], [80, 80]], { width: 5, color: '#6b3a22' }),
    // the canopy: a dome with scalloped edge
    piece(curve([[8, 82], [14, 50], [44, 22], [80, 12], [116, 22], [146, 50], [152, 82], [130, 74], [116, 84], [98, 74], [80, 84], [62, 74], [44, 84], [30, 74]], 2), C.coatRed),
    ...[
      [80, 50, 10],
      [48, 56, 8],
      [112, 56, 8],
      [28, 72, 6],
      [132, 72, 6],
      [64, 30, 6],
      [96, 30, 6],
    ].map(([x, y, r]) => piece(circle(x, y, r), C.white, FLAT)),
    ink([[80, 12], [80, 6]], { width: 5, color: HAT_DARK }),
  ]);
});

/** The same umbrella, blown inside out: canopy turned up like a tulip. */
export const umbrellaBlown = cached((): string => {
  const handle = band([[80, 94], [80, 140], [82, 160], [96, 168], [108, 158]], 8);
  const top: [number, number] = [80, 96];
  const tips: [number, number][] = [[8, 22], [34, 8], [80, 4], [126, 8], [152, 22]];
  return svg({ w: 160, h: 180, name: 'wishing-umbrella-blown' }, [
    piece(handle, C.brown, CUT),
    // the back of the cup (white-spotted red turned out the wrong way)
    piece(curve([[10, 24], [28, 74], [80, 100], [132, 74], [150, 24], [80, 40]], 2), C.redDark),
    // the lining, a cup of paler red between the ribs
    piece(curve([[8, 22], [34, 8], [80, 4], [126, 8], [152, 22], [124, 50], [80, 56], [36, 50]], 2), C.coatRed),
    ...[
      [56, 28, 7],
      [100, 26, 7],
      [80, 42, 6],
    ].map(([x, y, r]) => piece(circle(x, y, r), C.white, FLAT)),
    ...spokes(top, tips),
    // bent spoke poking out of the edge
    ink([[152, 22], [160, 12]], { width: 3, color: '#6b3a22' }),
    ink([[8, 22], [0, 14]], { width: 3, color: '#6b3a22' }),
    ink([[80, 96], [80, 100]], { width: 5, color: HAT_DARK }),
  ]);
});
