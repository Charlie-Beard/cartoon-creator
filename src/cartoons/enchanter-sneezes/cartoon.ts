/**
 * The Enchanter's Sneezes: Enchanter Muddle has a dreadful cold, and every
 * sneeze sends a spell flying, one of them shrinking the Wishing-Chair to the
 * size of a teacup. The friends make him honey and lemon and wrap him in a
 * warm scarf, and his very last little sneeze puts everything right.
 *
 *   1. A letter by paper bird (playroom). A sunny morning: Peter stacks
 *      bricks, Mollie reads, Jigs sits on the chair's arm. A paper bird
 *      flutters in at the window. Jigs jumps up, catches it and unfolds it
 *      (a deed): "Help! Ah… TISHOO! Please come quickly. Love, Enchanter
 *      Muddle." He is very kind and very muddled, Peter guesses a cold, and
 *      Jigs knows what a sneeze does to an enchanter. The chair wriggles, its
 *      wings come out and off they fly.
 *   2. Atishoo! (sky, then the tower). Over the hills to a crooked tower with
 *      its window open. In they land. Muddle sits in his armchair with a red
 *      nose and a spotty hanky: "Ah… ah… ah… TISHOO!" Everyone ducks and
 *      sparkles fly. The second sneeze hits the chair and it shrinks to a
 *      teacup, skittering to the edge of the table. Peter dives and catches it
 *      (a deed). The problem, said plainly: "The chair's tiny! It can't fly us
 *      home like that!" Muddle's nose twitches again.
 *   3. The biggest sneeze (the tower, uh-oh). The bottles rattle, the cauldron
 *      bubbles over, a wind swirls, Muddle's hat rises: "Stand BACK! This one's
 *      the BIGGEST yet!" Cut back to Mollie: what does Mum do for a cold?
 *      Honey and lemon! Peter squeezes the lemon, Mollie stirs in the honey,
 *      Jigs carries the scarf to wrap round his neck (the big deed), and Peter
 *      brings the mug. "Ahhh. Lovely and warm." The sneeze comes, and it is only
 *      a little one: it makes Jigs's hat grow HUGE. Everyone laughs, Muddle too.
 *   4. The last little sneeze (the tower, then the playroom). Cosy in his
 *      scarf Muddle sneezes the tiniest "atchoo": the chair grows back to full
 *      size and Jigs's hat shrinks. Home in the playroom, a second paper bird
 *      brings a thank-you note, and Mollie hangs it on the wall. Then Peter
 *      goes "Ah… ah… ah…", everyone freezes, and nothing happens at all.
 *
 * Scary, never cruel (docs/STYLE.md): the big sneeze is a loom of sound and
 * wind, with no villain and nobody hurt; Muddle is cross only by accident and
 * sorry at once. It cuts back to the heroes, and the sneeze that comes is a
 * joke (a big hat), not worse. The chair and its riders are the world's
 * chairRide set piece; Muddle and his tower are in the world. The paper bird
 * and its letter, the bricks, the sky tower, the table, the armchair, the mug,
 * lemon, honey, spoon, scarf, the froth and the thank-you note are drawn here.
 */
import { C, cached, circle, curve, defineCartoon, dot, ellipse, group, ink, noiseBurst, NOTE, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { sounds as anywhere } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { creak, hatBell, highWind } = sounds;
const { laugh, ting, pour } = anywhere;

// ------------------------------------------------------------------- art

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false as const };

/** A folded paper bird, wings out. 140 × 100. Part `wing` flaps. */
const bird = cached(() =>
  svg({ w: 140, h: 100, name: 'enchanter-sneezes-bird', label: 'A paper bird' }, [
    piece(poly([[14, 52], [64, 38], [118, 50], [70, 76]]), C.cream),
    piece(poly([[118, 50], [138, 36], [128, 62]]), C.sand),
    piece(poly([[14, 52], [4, 38], [30, 40], [40, 48]]), C.white),
    piece(poly([[4, 38], [-6, 46], [10, 46]]), C.orange, flat),
    ink([[40, 48], [70, 76]], { width: 1.6, color: C.tan, opacity: 0.7 }),
    ink([[64, 38], [70, 76]], { width: 1.6, color: C.tan, opacity: 0.7 }),
    dot(20, 44, 2.6, C.ink),
    group({ part: 'wing', origin: [70, 48] }, [
      piece(poly([[46, 46], [90, 46], [112, 6], [64, 14]]), C.white),
      ink([[64, 46], [88, 12]], { width: 1.6, color: C.tan, opacity: 0.7 }),
    ]),
  ]),
);

/** The unfolded letter: cream paper, scribbled lines, a big "HELP" scrawl and a sneeze splat. 150 × 190. */
const letter = cached(() =>
  svg({ w: 150, h: 190, name: 'enchanter-sneezes-letter', label: 'A letter' }, [
    piece(rect(6, 6, 138, 178, 3), C.cream),
    ink([[22, 40], [44, 24], [58, 44], [76, 24], [92, 44], [112, 26]], { width: 4.5, color: C.redDark, wobble: 1.2 }),
    ...[70, 88, 106, 124, 142].map((y, i) => ink([[22, y], [128 - (i % 2) * 22, y + (i % 2 ? 2 : -2)]], { width: 2.6, color: C.ink, opacity: 0.7, wobble: 1.4 })),
    piece(poly([[104, 150], [116, 156], [126, 148], [124, 162], [136, 170], [122, 172], [118, 184], [110, 172], [96, 176], [106, 164]]), C.lilac, { ...flat, opacity: 0.8 }),
    ink([[22, 168], [60, 166]], { width: 3, color: C.ink, opacity: 0.7, wobble: 1.4 }),
  ]),
);

/** A little open storybook, for Mollie to read. 130 × 60. */
const storybook = cached(() =>
  svg({ w: 130, h: 60, name: 'enchanter-sneezes-book', label: 'A storybook' }, [
    piece(rect(2, 20, 126, 36, 3), C.blueDark, { edge: 'cut' }),
    piece(poly([[6, 14], [64, 22], [64, 52], [6, 46]]), C.cream, { edge: 'cut', fibre: false }),
    piece(poly([[124, 14], [66, 22], [66, 52], [124, 46]]), C.white, { edge: 'cut', fibre: false }),
    ...[22, 30, 38].map((y) => ink([[14, y - 4 + (y - 22) * 0.2], [56, y + 1]], { width: 1.8, color: C.ink, opacity: 0.45 })),
    ...[22, 30, 38].map((y) => ink([[74, y + 1], [116, y - 4 + (y - 22) * 0.2]], { width: 1.8, color: C.ink, opacity: 0.45 })),
  ]),
);

/** Peter's tower of bricks, wobbling a little. 96 × 190. */
const bricks = cached(() => {
  const cols = [C.toyRed, C.toyBlue, C.toyYellow, C.toyGreen, C.toyRed, C.toyBlue];
  const xs = [8, 0, 10, 2, 8, 4];
  return svg({ w: 96, h: 190, name: 'enchanter-sneezes-bricks', label: 'A tower of bricks' }, [
    ...cols.map((c, i) => piece(rect(xs[i], 156 - i * 30, 80, 28, 3), c, { edge: 'cut', fibre: false })),
    ...cols.map((_, i) => ink([[xs[i] + 8, 164 - i * 30], [xs[i] + 30, 164 - i * 30]], { width: 2, color: C.white, opacity: 0.4 })),
  ]);
});

/** Muddle's crooked tower on its hill, seen from the sky: round, leaning, a pointed purple roof with moons, one window open and lit. 320 × 440. */
const skyTower = cached(() =>
  svg({ w: 320, h: 440, name: 'enchanter-sneezes-tower', label: 'A crooked tower' }, [
    piece(ellipse(160, 420, 190, 56), C.leafDark, { shadow: false }),
    piece(ellipse(130, 410, 120, 36), C.leaf, { ...flat, edge: 'torn' }),
    // the body leans a little to the right
    piece(poly([[96, 410], [112, 150], [208, 140], [226, 410]]), C.stoneLight),
    ...[190, 240, 290, 340, 390].map((y, i) => ink([[100 + i * 2, y], [220 + i * 2, y - 4]], { width: 2, color: C.stone, opacity: 0.6, wobble: 0.8 })),
    piece(poly([[92, 150], [118, 128], [208, 118], [236, 146], [214, 160], [112, 166]]), C.stone),
    // the crooked roof
    piece(curve([[86, 130], [120, 90], [150, 40], [188, 4], [230, 0], [250, 20], [226, 14], [204, 40], [210, 90], [244, 128], [160, 142]], 2), C.violet),
    piece(curve([[104, 122], [128, 80], [152, 44], [168, 40], [150, 90], [132, 126]], 1.4), C.violetDark, { ...flat, opacity: 0.45 }),
    piece(circle(150, 96, 9), '#d4d8de', flat),
    piece(poly([[184, 62], [196, 54], [190, 70]]), '#d4d8de', flat),
    // an open arched window, warm and lit, and a door
    piece(rect(140, 190, 46, 62, 14), C.brownDark, { edge: 'cut' }),
    piece(rect(146, 196, 34, 52, 12), C.candle, { ...flat, edge: 'clean' }),
    piece(poly([[140, 196], [122, 204], [122, 246], [140, 252]]), C.wood, { edge: 'cut' }),
    piece(rect(142, 330, 40, 80, 18), C.brownDark, { edge: 'cut' }),
    dot(172, 372, 3, C.brass),
  ]),
);

/** A round little table, in Muddle's tower. 320 × 120. */
const table = cached(() =>
  svg({ w: 320, h: 120, name: 'enchanter-sneezes-table', label: 'A little table' }, [
    piece(rect(24, 20, 20, 96, 3), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(276, 20, 20, 96, 3), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(46, 28, 228, 18, 3), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(0, 0, 320, 26, 8), C.wood, { edge: 'cut' }),
    piece(rect(10, 2, 300, 7, 3), C.tan, flat),
    // a lace runner
    piece(poly([[40, 4], [280, 4], [270, 26], [50, 26]]), C.cream, { ...flat, opacity: 0.7 }),
  ]),
);

/** The back of Muddle's armchair: tall, squashy, patched. 300 × 290. */
const armchairBack = cached(() =>
  svg({ w: 300, h: 290, name: 'enchanter-sneezes-armchair-back', label: 'An armchair' }, [
    piece(curve([[20, 290], [10, 120], [40, 40], [150, 10], [260, 40], [290, 120], [280, 290]], 2), '#8a3a4a'),
    piece(curve([[56, 290], [48, 130], [74, 70], [150, 50], [226, 70], [252, 130], [244, 290]], 2), '#a54e5e', { ...flat, opacity: 0.8 }),
    ...[[110, 120], [190, 120], [150, 168], [110, 216], [190, 216]].map(([x, y]) => dot(x, y, 5, '#6e2a38')),
    piece(rect(60, 80, 30, 26, 3), C.sand, { ...flat, opacity: 0.8 }),
  ]),
);

/** The front of the armchair: the seat's front and its two rolled arms, laid over Muddle. 300 × 150. */
const armchairFront = cached(() =>
  svg({ w: 300, h: 150, name: 'enchanter-sneezes-armchair-front', label: 'An armchair' }, [
    piece(rect(40, 56, 220, 94, 8), '#8a3a4a'),
    piece(rect(50, 50, 200, 24, 10), '#a54e5e'),
    piece(rect(0, 0, 54, 150, 20), '#7a303f'),
    piece(rect(246, 0, 54, 150, 20), '#7a303f'),
    piece(ellipse(27, 12, 22, 12), '#a54e5e', flat),
    piece(ellipse(273, 12, 22, 12), '#a54e5e', flat),
    piece(rect(66, 130, 18, 20, 3), C.brownDark, flat),
    piece(rect(216, 130, 18, 20, 3), C.brownDark, flat),
  ]),
);

/** A big mug (parts `drink` and `steam` start hidden). 90 × 90. */
const mug = cached(() =>
  svg({ w: 90, h: 90, name: 'enchanter-sneezes-mug', label: 'A mug' }, [
    ink([[78, 36], [92, 40], [90, 60], [76, 62]], { width: 7, color: C.china }),
    piece(rect(10, 24, 66, 60, 8), C.china),
    piece(rect(10, 40, 66, 10, 2), C.chinaBlue, flat),
    piece(ellipse(43, 26, 33, 8), C.cream, flat),
    group({ part: 'drink', opacity: 0 }, [piece(ellipse(43, 27, 29, 6), C.honey, { ...flat, edge: 'clean' })]),
    group({ part: 'steam', origin: [43, 22], opacity: 0 }, [
      ink([[30, 20], [26, 10], [32, 2]], { width: 3, color: C.white, opacity: 0.8 }),
      ink([[44, 20], [48, 8], [42, 0]], { width: 3, color: C.white, opacity: 0.8 }),
      ink([[58, 20], [54, 10], [60, 2]], { width: 3, color: C.white, opacity: 0.8 }),
    ]),
  ]),
);

/** A lemon, cut in half, the cut face towards us. 80 × 70. */
const lemon = cached(() =>
  svg({ w: 80, h: 70, name: 'enchanter-sneezes-lemon', label: 'A lemon' }, [
    piece(ellipse(40, 36, 36, 30), C.lemon),
    piece(ellipse(40, 36, 28, 22), C.cream, flat),
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * Math.PI * 2;
      return ink([[40, 36], [40 + Math.cos(a) * 24, 36 + Math.sin(a) * 18]], { width: 2.2, color: C.yellow });
    }),
    piece(poly([[72, 30], [80, 24], [78, 38]]), C.lemon, flat),
  ]),
);

/** A drip of lemon juice. 16 × 24. */
const drip = cached(() =>
  svg({ w: 16, h: 24, name: 'enchanter-sneezes-drip', label: 'A drip' }, [piece(curve([[8, 0], [14, 14], [8, 22], [2, 14]], 1), C.lemon, flat)]),
);

/** A jar of honey with a lid and a label. 70 × 90. */
const honey = cached(() =>
  svg({ w: 70, h: 90, name: 'enchanter-sneezes-honey', label: 'A jar of honey' }, [
    piece(rect(8, 20, 54, 66, 10), C.honey),
    piece(rect(14, 28, 14, 48, 5), C.goldLight, { ...flat, opacity: 0.55 }),
    piece(rect(6, 8, 58, 16, 4), C.brown, { edge: 'cut' }),
    piece(rect(16, 44, 38, 24, 3), C.cream, flat),
    ink([[22, 54], [48, 54]], { width: 2.4, color: C.honeyDark }),
    ink([[22, 62], [42, 62]], { width: 2.4, color: C.honeyDark }),
  ]),
);

/** A spoon. 24 × 100, handle up. */
const spoon = cached(() =>
  svg({ w: 24, h: 100, name: 'enchanter-sneezes-spoon', label: 'A spoon' }, [
    piece(rect(9, 0, 7, 68, 3), C.steelLight, { edge: 'cut', fibre: false }),
    piece(ellipse(12, 82, 11, 17), C.steelLight, { edge: 'cut', fibre: false }),
    piece(ellipse(11, 80, 5, 9), C.white, { ...flat, opacity: 0.7 }),
  ]),
);

/** A long stripy scarf, laid out flat, with fringe. 190 × 70. */
const scarf = cached(() => {
  const cols = [C.coatRed, C.cream, C.blue, C.cream];
  return svg({ w: 190, h: 70, name: 'enchanter-sneezes-scarf', label: 'A long stripy scarf' }, [
    ...Array.from({ length: 9 }, (_, i) => piece(poly([[10 + i * 19, 12 + (i % 2) * 2], [30 + i * 19, 10], [30 + i * 19, 52], [10 + i * 19, 54 - (i % 2) * 2]]), cols[i % 4], { edge: 'torn', fibre: false })),
    ...[0, 1, 2, 3, 4, 5, 6].flatMap((i) => [
      ink([[10, 16 + i * 6], [2, 18 + i * 6]], { width: 2.2, color: C.coatRed }),
      ink([[180, 16 + i * 6], [188, 18 + i * 6]], { width: 2.2, color: C.coatRed }),
    ]),
  ]);
});

/** Green froth boiling over the cauldron's rim. 260 × 130. */
const froth = cached(() =>
  svg({ w: 260, h: 130, name: 'enchanter-sneezes-froth', label: 'Green froth' }, [
    piece(curve([[10, 70], [20, 36], [60, 24], [90, 10], [140, 8], [180, 18], [230, 30], [250, 70], [244, 120], [200, 100], [170, 126], [130, 104], [90, 124], [60, 100], [20, 118]], 2), '#8fd06a', { edge: 'torn', rough: 1.4 }),
    ...[[50, 50, 18], [110, 36, 22], [180, 46, 20], [220, 70, 14], [80, 86, 14], [150, 80, 16]].map(([x, y, r]) => piece(circle(x, y, r), '#b6e88a', { ...flat, edge: 'clean' })),
    ...[[44, 44], [104, 28], [174, 38], [74, 80]].map(([x, y]) => dot(x, y, 4, C.white, 0.6)),
  ]),
);

/** Muddle's thank-you note: a folded card with a heart and wobbly writing. 120 × 140. */
const note = cached(() =>
  svg({ w: 120, h: 140, name: 'enchanter-sneezes-note', label: 'A thank-you note' }, [
    piece(rect(8, 8, 104, 124, 3), C.cream),
    piece(poly([[60, 30], [44, 18], [30, 30], [36, 46], [60, 66], [84, 46], [90, 30], [76, 18]]), C.coatRed, flat),
    ...[84, 98, 112].map((y, i) => ink([[22, y], [96 - i * 16, y + (i % 2 ? 2 : -2)]], { width: 2.4, color: C.ink, opacity: 0.7, wobble: 1.4 })),
    piece(circle(96, 118, 8), C.lilac, flat),
  ]),
);

// ---------------------------------------------------------------- sounds

/** "Ah… ah… ah…" three rising breaths, then the big TISHOO burst. */
function bigSneeze(breaths = 3): void {
  const t = now();
  for (let i = 0; i < breaths; i++) tone(260 + i * 60, t + i * 0.45, { wave: 'triangle', peak: 0.04, attack: 0.1, decay: 0.3, glideTo: 320 + i * 70 });
  const b = t + breaths * 0.45 + 0.1;
  noiseBurst(b, { freq: 1800, q: 0.8, peak: 0.14, attack: 0.01, decay: 0.35, sweepTo: 500 });
  tone(420, b, { wave: 'triangle', peak: 0.06, decay: 0.3, glideTo: 180 });
}

/** A tiny, soft "atchoo": one little puff. */
function littleSneeze(): void {
  const t = now();
  tone(520, t, { wave: 'triangle', peak: 0.025, attack: 0.05, decay: 0.15, glideTo: 600 });
  noiseBurst(t + 0.2, { freq: 2400, q: 0.8, peak: 0.05, attack: 0.01, decay: 0.2, sweepTo: 1200 });
  tone(640, t + 0.2, { wave: 'triangle', peak: 0.03, decay: 0.18, glideTo: 360 });
}

/** A runny-nose sniffle: two wet little sniffs. */
function sniffle(): void {
  const t = now();
  noiseBurst(t, { freq: 2600, q: 2, peak: 0.04, attack: 0.02, decay: 0.12, sweepTo: 1800 });
  noiseBurst(t + 0.22, { freq: 2200, q: 2, peak: 0.035, attack: 0.02, decay: 0.12, sweepTo: 1500 });
}

/** Bottles rattling on their shelves: a tiny jangle of high clinks. */
function rattle(seconds = 2): void {
  const t = now();
  for (let i = 0; i < seconds * 8; i++) tone(NOTE.E6 + ((i * 97) % 380), t + i * 0.12 + (i % 3) * 0.02, { wave: 'sine', peak: 0.012, attack: 0.005, decay: 0.12 });
}

/** The cauldron glooping up and over: a rolling bubble-and-slosh. */
function gloop(): void {
  const t = now();
  for (let i = 0; i < 6; i++) tone(140 + i * 22, t + i * 0.16, { wave: 'sine', peak: 0.05, attack: 0.02, decay: 0.2, glideTo: 260 + i * 20 });
  noiseBurst(t, { freq: 400, type: 'lowpass', peak: 0.05, attack: 0.3, decay: 0.8, sweepTo: 200 });
}

/** A squeeze: a wet little squelch. */
function squeeze(): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 2, peak: 0.05, attack: 0.02, decay: 0.35, sweepTo: 300 });
  tone(300, t, { wave: 'sine', peak: 0.03, decay: 0.3, glideTo: 180 });
}

/** A slurp: a falling bubbly "sluuurp" and a satisfied sigh. */
function slurp(): void {
  const t = now();
  tone(700, t, { wave: 'sine', peak: 0.04, attack: 0.05, decay: 0.7, glideTo: 240, vibrato: [14, 20] });
  tone(300, t + 0.9, { wave: 'triangle', peak: 0.03, attack: 0.1, decay: 0.7, glideTo: 220 });
}

/** The spell shrinking or growing the chair: a quick sliding whizz, down or up. */
function whizzy(up: boolean): void {
  const t = now();
  tone(up ? 300 : 1100, t, { wave: 'sine', peak: 0.05, attack: 0.02, decay: 0.5, glideTo: up ? 1100 : 300 });
  tone(up ? 450 : 1500, t + 0.05, { wave: 'triangle', peak: 0.025, attack: 0.02, decay: 0.45, glideTo: up ? 1500 : 450 });
}

/** A fat "pop" for the hat growing. */
function bigPop(): void {
  const t = now();
  tone(200, t, { wave: 'sine', peak: 0.08, attack: 0.01, decay: 0.3, glideTo: 480 });
  noiseBurst(t, { freq: 1500, q: 0.7, peak: 0.06, attack: 0.01, decay: 0.15 });
}

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'muddle'
  | 'bricks' | 'book' | 'bird' | 'letter' | 'note'
  | 'table' | 'mug' | 'lemon' | 'honey' | 'spoon' | 'scarf' | 'froth'
  | 'armBack' | 'armFront' | 'sky';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** Muddle, his armchair, and the table, where they always are in the tower. */
const MUDDLE = { x: 730, y: 350, w: 230 };
const TABLE = { x: 390, y: 540, w: 320, z: 16 };
/** The little chair's place on the table (its middle, in stage points), and the real chair's landing spot (top-left, width). */
const TINY_AT: [number, number] = [640, 506];
const CHAIR_AT = { x: 120, y: 290, w: 360 };
/** Where the friends stand in the tower. */
const MOLLIE_AT = { x: 50, y: 408, w: 190 };
const PETER_AT = { x: 200, y: 414, w: 190 };
const JIGS_AT = { x: 466, y: 378, w: 150 };

/** The round room: backdrop, cauldron light, the armchair around Muddle, the table, and the froth (hidden). */
function tower<K extends string>(k: Kit<K>, o: { pose?: string; things?: boolean } = {}): void {
  k.backdrop('enchanter-tower');
  k.light(1000, 560, 230, { color: '#ffb866', strength: 0.3, z: 5, flicker: true });
  cast.armBack = k.add(armchairBack(), { x: 685, y: 350, w: 300, z: 8 });
  cast.muddle = k.character('muddle', { ...MUDDLE, z: 10, flip: true, pose: o.pose });
  cast.armFront = k.add(armchairFront(), { x: 685, y: 490, w: 300, z: 11 });
  cast.table = k.add(table(), TABLE);
  cast.froth = k.add(froth(), { x: 870, y: 330, w: 260, z: 6 });
  k.set(cast.froth, { opacity: 0, scale: 0.3 });
  if (o.things) {
    cast.lemon = k.add(lemon(), { x: 408, y: 482, w: 66, z: 17 });
    cast.mug = k.add(mug(), { x: 492, y: 468, w: 82, z: 17 });
    cast.honey = k.add(honey(), { x: 666, y: 474, w: 52, z: 17 });
    cast.scarf = k.add(scarf(), { x: 90, y: 372, w: 150, z: 17 });
  }
}

/** The chair, shrunk to teacup size, on the table (in `set`: no motion). */
function tinyChair<K extends string>(k: Kit<K>): void {
  ride = chairRide.set(k, { ...CHAIR_AT, z: 14 });
  const [tx, ty] = TINY_AT;
  k.set([ride.chair, ride.front], { x: tx - (CHAIR_AT.x + CHAIR_AT.w / 2), y: ty - (CHAIR_AT.y + (CHAIR_AT.w * 400) / 880), scale: 0.2 });
}

/** The three friends on the tower floor. */
function friends<K extends string>(k: Kit<K>): void {
  cast.mollie = k.character('mollie', { ...MOLLIE_AT, z: 12 });
  cast.peter = k.character('peter', { ...PETER_AT, z: 13 });
  cast.jigs = k.character('jigs', { ...JIGS_AT, z: 14 });
}

/** Everyone ducks. */
async function duck(k: Kit, ...who: HTMLElement[]): Promise<void> {
  await k.all(...who.map((el) => k.to(el, 0.25, { y: '+=36', ease: 'power2.out' })));
  await k.wait(500);
  await k.all(...who.map((el) => k.to(el, 0.35, { y: '-=36', ease: 'power2.inOut' })));
}

/** Jigs's hat part, ready to scale about the crown. */
const hatOf = (k: Kit, jigs: HTMLElement): SVGGElement[] => k.pivot(k.part(jigs, 'hat'));

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A letter by paper bird
    morning: { who: 'narrator', text: 'One sunny morning, Peter built a very tall tower of bricks, and Mollie read her book.' },
    paperBird: { who: 'jigs', text: 'A paper bird! That means a letter!' },
    letterRead: { who: 'jigs', text: 'It says, “Help! Ah… TISHOO! Please come quickly. Love, Enchanter Muddle.”' },
    whoIs: { who: 'mollie', text: 'Who is Enchanter Muddle?' },
    kindMuddled: { who: 'jigs', text: 'A very kind enchanter. And very, very muddled.' },
    aCold: { who: 'peter', text: 'He sounds as if he’s got a cold.' },
    spellsFly: { who: 'jigs', text: 'A cold? Oh no! When an enchanter sneezes, his spells fly out!' },
    helpHim: { who: 'mollie', text: 'Then we must help him. Into the chair, everyone!' },
    offWeGo: { who: 'peter', text: 'Hooray! Off we go!' },
    // 2. Atishoo!
    thereTower: { who: 'mollie', text: 'There’s his tower! And the window’s open.' },
    comeIn: { who: 'muddle', text: 'Oh, thank goodness! Come in, come in!' },
    hello: { who: 'mollie', text: 'Hello, Enchanter Muddle. We got your letter.' },
    sneezeOne: { who: 'muddle', text: 'Ah… ah… ah… TISHOO!' },
    sparkles: { who: 'jigs', text: 'Sparkles! Those are his spells!' },
    sneezeTwo: { who: 'muddle', text: 'Ah… ah… TISHOO!' },
    chairGone: { who: 'jigs', text: 'The chair! It’s gone teeny-weeny!' },
    gotIt: { who: 'peter', text: 'Got it!' },
    chairTiny: { who: 'mollie', text: 'The chair’s tiny! It can’t fly us home like that!' },
    sorry: { who: 'muddle', text: 'Oh dear, oh dear! I’m so sorry!' },
    noseTwitch: { who: 'jigs', text: 'Uh-oh. His nose is twitching again!' },
    // 3. The biggest sneeze
    standBack: { who: 'muddle', text: 'Stand BACK! This one’s the BIGGEST yet!' },
    quick: { who: 'mollie', text: 'Quick! What does Mum do when we’ve got a cold?' },
    honeyLemon: { who: 'peter', text: 'Honey and lemon, in a big hot mug!' },
    squeezeLemon: { who: 'peter', text: 'I’ll squeeze the lemon!' },
    stirHoney: { who: 'mollie', text: 'And I’ll stir in the honey.' },
    warmScarf: { who: 'jigs', text: 'And a warm scarf for his neck! I’ll wrap it round.' },
    drinkUp: { who: 'peter', text: 'Here you are, Enchanter Muddle. Drink it up!' },
    lovelyWarm: { who: 'muddle', text: 'Ahhh. Lovely and warm.' },
    hatHuge: { who: 'jigs', text: 'Oh! My hat’s gone enormous!' },
    bigAsTent: { who: 'peter', text: 'Ha ha! It’s as big as a tent!' },
    muddleSorry: { who: 'muddle', text: 'Oh, ha ha! I’m sorry, Jigs. But I do feel much better.' },
    oneLeft: { who: 'muddle', text: 'I think there’s just one tiny sneeze left.' },
    // 4. The last little sneeze
    hereItComes: { who: 'muddle', text: 'Here it comes… atchoo.' },
    itWorked: { who: 'peter', text: 'Hooray! The chair’s big again, and so is Jigs’s hat!' },
    thanks: { who: 'muddle', text: 'Thank you, my dears. Honey and lemon! I must write that in my spell book.' },
    goodbye: { who: 'jigs', text: 'Get well soon, Enchanter Muddle! Home, chair!' },
    whatMuddle: { who: 'mollie', text: 'What a muddle that was!' },
    thankNote: { who: 'mollie', text: 'Look, a thank-you note from Enchanter Muddle. I’ll hang it on the wall.' },
    peterSneeze: { who: 'peter', text: 'Ah… ah… ah… TISHOO!' },
    phew: { who: 'jigs', text: 'Phew! Nothing happened. You’re not an enchanter!' },
    peterLaugh: { who: 'peter', text: 'Ha ha! I’m just Peter!' },
    end: { who: 'narrator', text: 'And the friends all had a lovely, quiet, sneeze-free day.' },
  },
  scenes: [
    // ============================================ 1. A letter by paper bird
    {
      name: 'A letter by paper bird',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        ride = chairRide.set(k, { x: 660, y: 300, w: 380, riders: [{ id: 'jigs', slot: 'arm', flip: true }] });
        cast.jigs = ride.riders[0];
        cast.peter = k.character('peter', { x: 250, y: 410, w: 190, z: 13 });
        cast.bricks = k.add(bricks(), { x: 450, y: 460, w: 96, z: 14 });
        cast.mollie = k.character('mollie', { x: 556, y: 410, w: 190, z: 18 });
        cast.book = k.add(storybook(), { x: 591, y: 556, w: 120, z: 19 });
        cast.bird = k.add(bird(), { x: -220, y: 200, w: 130, z: 30 });
      },
      async play(k) {
        const { mollie, peter, jigs, bricks: tower1, bird: paper } = cast;
        await k.say('morning');
        await k.wait(300);

        // The paper bird flutters in at the window and over everyone's heads.
        k.sfx.rustle();
        const [wing] = k.pivot(k.part(paper, 'wing'));
        void k.to(wing, 0.22, { rotation: -26, yoyo: true, repeat: 7, ease: 'sine.inOut' });
        await k.to(paper, 2.6, { x: 1060, y: 90, ease: 'sine.inOut' });

        // Jigs jumps up and catches it.
        await k.say('paperBird', jigs);
        hatBell();
        await k.hop(jigs, 36, 1);
        await k.carry(paper, jigs, 0.5);
        k.sfx.page();
        await k.vanish(paper, 0.2);
        cast.letter = k.add(letter(), { x: 905, y: 205, w: 120, z: 30 });
        await k.appear(cast.letter, 0.4);
        k.flourish(cast.letter);
        await k.wait(400);

        await k.say('letterRead', jigs);
        await k.say('whoIs', mollie);
        await k.say('kindMuddled', jigs);
        await k.all(k.say('aCold', peter), k.shake(tower1, 3, 4));
        await k.all(k.say('spellsFly', jigs), k.shake(jigs, 4, 2));

        // Mollie decides; the chair wriggles and grows its wings.
        await k.say('helpHim', mollie);
        await wishing.wriggle(k, ride.chair, 3);
        hatBell();
        k.remove(mollie);
        k.remove(peter);
        k.remove(cast.book);
        await k.vanish(tower1, 0.3);
        await k.vanish(cast.letter, 0.3);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        cast.peter = await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        k.music('adventure');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await k.all(k.say('offWeGo', cast.peter), k.shake(cast.peter, 4, 2));
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ============================================ 2. Atishoo!
    {
      name: 'Atishoo!',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 300,
          y: 170,
          w: 420,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -800, y: 0 });
        cast.sky = k.add(skyTower(), { x: 1200, y: 250, w: 320, z: 4 });
      },
      async play(k) {
        highWind(3);
        void k.to(cast.sky, 2.2, { x: -420, ease: 'sine.out' });
        await k.all(chairRide.fly(k, ride, { x: 0, s: 1.8 }), k.wait(700).then(() => k.say('thereTower', cast.mollie)));
        k.sparkle(840, 330, 8, 70);
        await chairRide.fly(k, ride, { x: 200, y: 60, s: 1.4 });

        // In at the window: a quick change of place, and in they bump.
        await k.cut(() => {
          tower(k, { things: true });
          friends(k);
          k.set([cast.mollie, cast.peter, cast.jigs], { opacity: 0 });
          ride = chairRide.set(k, {
            ...CHAIR_AT,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'armL' }],
          });
          chairRide.jump(k, ride, { x: -620, y: -230 });
          k.remove(cast.mollie);
          k.remove(cast.peter);
          k.remove(cast.jigs);
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        });
        k.music('magic');
        highWind(1.5);
        await chairRide.land(k, ride);
        creak();
        await k.say('comeIn', cast.muddle);

        // Everyone hops down to the floor.
        await chairRide.hopOff(k, ride, cast.jigs, JIGS_AT);
        await chairRide.hopOff(k, ride, cast.mollie, MOLLIE_AT);
        await chairRide.hopOff(k, ride, cast.peter, PETER_AT);
        await k.say('hello', cast.mollie);

        // First sneeze: sparkles all over the room.
        const { muddle, mollie, peter, jigs } = cast;
        sniffle();
        await k.wait(300);
        k.pose(muddle, 'sneeze');
        bigSneeze(3);
        void duck(k, mollie, peter, jigs);
        await k.say('sneezeOne', muddle);
        k.fx.spell();
        void k.glow('#d9c3ff', 0.35, 1);
        for (const [x, y] of [[560, 200], [300, 260], [900, 240], [620, 420], [420, 150]]) {
          k.sparkle(x, y, 10, 110);
          await k.wait(160);
        }
        k.pose(muddle, 'default');
        await k.say('sparkles', jigs);

        // Second sneeze: a spell hits the chair and shrinks it to a teacup.
        k.pose(muddle, 'sneeze');
        bigSneeze(2);
        void duck(k, mollie, peter, jigs);
        await k.say('sneezeTwo', muddle);
        k.pose(muddle, 'default');
        await k.beam([840, 400], [300, 460], '#d9c3ff');
        whizzy(false);
        await k.to([ride.chair, ride.front], 0.7, { scale: 0.2, x: TINY_AT[0] - (CHAIR_AT.x + CHAIR_AT.w / 2) - 80, y: TINY_AT[1] - (CHAIR_AT.y + (CHAIR_AT.w * 400) / 880) - 20, ease: 'power2.in' });
        k.sparkle(560, 480, 8, 60);
        await k.say('chairGone', jigs);

        // It skitters across the table and over the edge: Peter dives and catches it.
        const edge = TINY_AT[0] + 70;
        k.fx.patter(5);
        await k.to([ride.chair, ride.front], 0.7, { x: `+=${edge - TINY_AT[0] + 80}`, y: `+=${TINY_AT[1] - 506 + 30}`, rotation: 30, ease: 'sine.inOut' });
        k.fx.uhoh();
        await k.all(k.to(peter, 0.35, { x: '+=130', y: '+=10' }), k.to([ride.chair, ride.front], 0.45, { y: '+=90', rotation: 140, ease: 'power2.in' }));
        const b = k.box(peter);
        await k.all(...[ride.chair, ride.front].map((el) => k.to(el, 0.3, { x: b.x + b.w / 2 - 5 - (CHAIR_AT.x + CHAIR_AT.w / 2), y: b.y + b.h * 0.6 - (CHAIR_AT.y + (CHAIR_AT.w * 400) / 880), rotation: 0 })));
        k.flourish(peter);
        await k.say('gotIt', peter);

        // Peter sets it safely back in the middle of the table.
        await k.all(...[ride.chair, ride.front].map((el) => k.to(el, 0.7, { x: TINY_AT[0] - (CHAIR_AT.x + CHAIR_AT.w / 2), y: TINY_AT[1] - (CHAIR_AT.y + (CHAIR_AT.w * 400) / 880), ease: 'sine.inOut' })));
        await k.to(peter, 0.4, { x: '-=130', y: '-=10' });
        k.music('sneaky');
        await k.say('chairTiny', mollie);
        await k.all(k.say('sorry', muddle), k.shake(muddle, 3, 2));
        sniffle();
        await k.all(k.say('noseTwitch', jigs), k.shake(jigs, 4, 2));
      },
    },

    // ============================================ 3. The biggest sneeze
    {
      name: 'The biggest sneeze',
      set(k) {
        tower(k, { things: true });
        friends(k);
        tinyChair(k);
        k.music('sneaky');
      },
      async play(k) {
        const { muddle, mollie, peter, jigs, froth: bubbling, mug: cup, lemon: lem, honey: jar } = cast;

        // The biggest sneeze is coming: bottles rattle, the cauldron boils over, a wind swirls.
        k.silence();
        rattle(1.6);
        await k.all(k.quake(5), k.shake(muddle, 3, 5));
        gloop();
        k.fx.wind(2.4);
        k.ambient('bubbles', { count: 14, z: 7, area: [900, 250, 200, 160] });
        void k.to(bubbling, 1.4, { opacity: 1, scale: 1, ease: 'sine.out' });
        void k.to(k.pivot(k.part(muddle, 'hat')), 1.6, { y: -48, rotation: 4, ease: 'sine.inOut' });
        await k.wait(500);

        // He looms.
        k.sfx.ominous();
        k.pose(muddle, 'cross');
        await k.camera({ zoom: 1.35, x: 840, y: 400 }, 0.9);
        k.music('spooky');
        await k.say('standBack', muddle);
        k.fx.drumroll(1.6);
        await k.all(k.shake(mollie, 4, 3), k.shake(peter, 4, 3), k.shake(jigs, 4, 3));
        await k.camera({}, 0.9);

        // Cut back to the heroes: a plan.
        k.music('sneaky');
        await k.say('quick', mollie);
        await k.say('honeyLemon', peter);

        // Peter squeezes the lemon over the mug.
        await k.all(k.say('squeezeLemon', peter), k.to(peter, 0.5, { x: '+=40' }));
        await k.to(lem, 0.6, { x: 456 - 408 + 4, y: -50, rotation: 20, ease: 'sine.inOut' });
        squeeze();
        await k.pop(lem, 0.8);
        const drops = [0, 1, 2].map((i) => k.add(drip(), { x: 520 + i * 14, y: 440, w: 14, z: 18 }));
        for (const d of drops) {
          void k.to(d, 0.5, { y: '+=44', opacity: 0, ease: 'power2.in' });
          await k.wait(130);
        }
        void k.vanish(lem, 0.3);
        k.set(k.part(cup, 'drink'), { opacity: 1 });
        k.flourish(cup);
        await k.wait(500);

        // Mollie stirs in the honey.
        await k.say('stirHoney', mollie);
        await k.carry(jar, cup);
        pour();
        await k.to(jar, 0.5, { rotation: -50, ease: 'sine.inOut' });
        await k.to(jar, 0.5, { rotation: 0, ease: 'sine.inOut' });
        await k.to(jar, 0.6, { x: 0, y: 0, ease: 'sine.inOut' });
        cast.spoon = k.add(spoon(), { x: 522, y: 410, w: 24, z: 18 });
        const spoonEl = cast.spoon;
        k.fx.pop();
        for (let i = 0; i < 3; i++) {
          ting();
          await k.to(spoonEl, 0.22, { rotation: i % 2 ? 14 : -14, x: i % 2 ? 6 : -6 });
        }
        await k.to(spoonEl, 0.2, { rotation: 0, x: 0 });
        void k.vanish(spoonEl, 0.3);
        k.set(k.part(cup, 'drink'), { opacity: 1 });
        await k.fade(k.part(cup, 'steam'), 1, 0.5);
        k.flourish(cup);
        await k.wait(500);

        // Jigs fetches the scarf and wraps it round Muddle's neck.
        await k.say('warmScarf', jigs);
        hatBell();
        await k.all(k.walk(jigs, 120, 0.9, 3));
        await k.carry(cast.scarf, muddle, 1.1);
        k.pose(muddle, 'cosy');
        await k.vanish(cast.scarf, 0.25);
        k.sparkle(840, 470, 12, 90);
        await k.say('drinkUp', peter);
        await k.carry(cup, muddle, 0.9);
        slurp();
        await k.wait(900);
        await k.vanish(cup, 0.4);
        await k.wait(200);
        await k.say('lovelyWarm', muddle);

        // The big sneeze: only a little one, and Jigs's hat grows HUGE.
        k.silence();
        void k.to(bubbling, 0.8, { opacity: 0, scale: 0.4, ease: 'sine.in' });
        k.pose(muddle, 'default');
        k.set(muddle, { opacity: 1 });
        sniffle();
        await k.wait(500);
        k.pose(muddle, 'sneeze');
        bigSneeze(2);
        await k.say('sneezeOne', muddle);
        k.pose(muddle, 'cosy');
        bigPop();
        k.fx.spell();
        void k.glow('#d9c3ff', 0.3, 1);
        await k.to(hatOf(k, jigs), 0.55, { scale: 2.4, ease: 'back.out(2)' });
        k.sparkle(k.box(jigs).face.cx, k.box(jigs).face.cy - 80, 14, 120);
        await k.wait(400);
        await k.all(k.say('hatHuge', jigs), k.shake(jigs, 3, 2));
        laugh();
        await k.all(k.say('bigAsTent', peter), k.hop(mollie, 22, 2));
        await k.say('muddleSorry', muddle);
        await k.say('oneLeft', muddle);
      },
    },

    // ============================================ 4. The last little sneeze
    {
      name: 'The last little sneeze',
      set(k) {
        tower(k, { pose: 'cosy', things: true });
        k.remove(cast.scarf);
        k.set(k.part(cast.mug, 'drink'), { opacity: 0 });
        k.set(cast.lemon, { opacity: 0 });
        friends(k);
        k.set([cast.mollie, cast.peter], { zIndex: 20 });
        k.set(hatOf(k, cast.jigs), { scale: 2.4 });
        tinyChair(k);
        k.music('cosy');
      },
      async play(k) {
        const { muddle, mollie, peter, jigs } = cast;
        await k.say('hereItComes', muddle);
        littleSneeze();
        k.pose(muddle, 'sneeze');
        await k.wait(450);
        k.pose(muddle, 'cosy');
        k.fx.twinkle();
        await k.glow('#fff1c0', 0.3, 0.9);

        // The chair grows back to full size, and Jigs's hat to its own.
        whizzy(true);
        await k.to([ride.chair, ride.front], 0.8, { scale: 1, x: 0, y: 0, ease: 'back.out(1.3)' });
        k.flourish(ride.chair);
        await k.wait(300);
        bigPop();
        await k.to(hatOf(k, jigs), 0.6, { scale: 1, ease: 'back.out(1.8)' });
        k.flourish(jigs);
        await k.all(k.say('itWorked', peter), k.hop(mollie, 24, 2));
        await k.say('thanks', muddle);

        // Back into the chair, wave goodbye and off home.
        k.remove(mollie);
        k.remove(peter);
        k.remove(jigs);
        await chairRide.wings(k, ride);
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        const pixie = await chairRide.seat(k, ride, { id: 'jigs', slot: 'armL' });
        highWind(2);
        await k.all(k.say('goodbye', pixie), chairRide.fly(k, ride, { x: -40, s: 4.6 }));
        await chairRide.fly(k, ride, { x: -900, s: 1 });

        // Home to the playroom.
        await k.cut(() => {
          k.backdrop('playroom');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          ride = chairRide.set(k, {
            x: 380,
            y: 230,
            w: 420,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: 800 });
        });
        k.music('cosy');
        highWind(2);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 1.6, flaps: 3 }), k.wait(500).then(() => k.say('whatMuddle', cast.mollie)));
        await chairRide.land(k, ride);
        creak();
        await chairRide.hopOff(k, ride, cast.jigs, { x: 180, y: 480, w: 140 });
        await chairRide.hopOff(k, ride, cast.mollie, { x: 370, y: 408, w: 200 });
        await chairRide.hopOff(k, ride, cast.peter, { x: 620, y: 412, w: 200 });

        // A second paper bird, and Mollie hangs the thank-you note on the wall.
        cast.bird = k.add(bird(), { x: -220, y: 200, w: 120, z: 30 });
        k.sfx.rustle();
        const [wing] = k.pivot(k.part(cast.bird, 'wing'));
        void k.to(wing, 0.22, { rotation: -26, yoyo: true, repeat: 6, ease: 'sine.inOut' });
        await k.to(cast.bird, 2.2, { x: 360, y: 190, ease: 'sine.inOut' });
        k.sfx.page();
        await k.vanish(cast.bird, 0.2);
        cast.note = k.add(note(), { x: 400, y: 170, w: 100, z: 30 });
        await k.appear(cast.note, 0.4);
        await k.say('thankNote', cast.mollie);
        await k.carry(cast.note, [640, 320], 1);
        k.sparkle(640, 320, 10, 70);
        await k.wait(500);

        // Then Peter goes "Ah… ah…" and everyone freezes. Nothing happens at all.
        k.music('sneaky');
        sniffle();
        bigSneeze(3);
        await k.say('peterSneeze', cast.peter);
        k.silence();
        await k.wait(1600);
        k.music('cosy');
        await k.all(k.say('phew', cast.jigs), k.hop(cast.jigs, 20, 1));
        laugh();
        await k.all(k.say('peterLaugh', cast.peter), k.hop(cast.peter, 22, 2));
        await warmEnding(k, { cast: [cast.mollie, cast.peter, cast.jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});
