/**
 * One-off art for The Dragon's Wobbly Tooth: the apple, the ball of string
 * and the string itself, the teeth, the smoke, the cave eyes, the scorched
 * thatch far below, the pillow and the gold coins. Puff and Dragon Hill are
 * in the wishing world.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, raw, svg, type Node } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** A red apple with a short stalk and a leaf. 100 × 110. */
function appleNodes(): Node[] {
  return [
    piece(circle(38, 66, 34), C.cherry),
    piece(circle(64, 66, 34), C.cherry),
    piece(ellipse(51, 72, 40, 32), C.cherry, { shadow: false }),
    piece(ellipse(32, 54, 10, 16, 30), '#e4776f', { ...flat, opacity: 0.6 }),
    ink([[51, 38], [52, 18], [58, 8]], { width: 5, color: C.brownDark, wobble: 0.3 }),
    piece(poly([[56, 20], [78, 8], [86, 20], [68, 28]]), C.leaf, { edge: 'cut', fibre: false }),
  ];
}

export const apple = cached(() => svg({ w: 100, h: 110, name: 'dragon-tooth-apple', label: 'A red apple' }, appleNodes()));

/** The same apple with a bite out of the right side. 100 × 110. */
export const appleBitten = cached(() =>
  svg({ w: 100, h: 110, name: 'dragon-tooth-apple-bitten', label: 'A bitten apple' }, [
    ...appleNodes(),
    // the bite: pale flesh, with a scalloped edge of tooth marks
    piece(circle(90, 56, 20), C.cream, { edge: 'cut', fibre: false }),
    piece(circle(86, 74, 14), C.cream, { edge: 'cut', fibre: false }),
    piece(circle(78, 44, 10), C.cream, { edge: 'cut', fibre: false }),
    ink([[76, 40], [84, 62], [80, 82]], { width: 2.4, color: C.honeyDark, wobble: 0.4, opacity: 0.6 }),
  ]),
);

/** A ball of string wound round and round, with a loose end curling out. 110 × 110. */
export const stringBall = cached(() =>
  svg({ w: 110, h: 110, name: 'dragon-tooth-string-ball', label: 'A ball of string' }, [
    piece(circle(52, 56, 42), C.sand),
    ...[[-30, -10, 24, 20], [-26, 14, 28, 34], [-8, -26, 40, 14], [6, 22, 44, 38], [16, -12, 34, 6]].map(([x0, y0, x1, y1]) =>
      ink([[52 + x0, 56 + y0], [52 + (x0 + x1) / 2 + 4, 56 + (y0 + y1) / 2 - 8], [52 + x1, 56 + y1]], { width: 2.6, color: C.tan, wobble: 0.5, opacity: 0.9 }),
    ),
    ink([[18, 36], [60, 70], [30, 82], [92, 40]], { width: 2.2, color: C.honeyDark, wobble: 0.4, opacity: 0.7 }),
    ink([[84, 80], [100, 92], [92, 104], [104, 108]], { width: 3, color: C.sand, wobble: 0.5 }),
  ]),
);

/** A dragon's tooth: a big white slab, rounded at the bottom, with a pale edge. 80 × 110. */
export const bigTooth = cached(() =>
  svg({ w: 80, h: 110, name: 'dragon-tooth-tooth', label: 'A tooth' }, [
    piece(curve([[8, 14], [40, 4], [72, 14], [74, 62], [62, 100], [40, 106], [18, 100], [6, 62]], 2), '#fbf8ee', { edge: 'cut', fibre: false }),
    ink([[20, 22], [16, 64], [24, 90]], { width: 4, color: '#cbbf9f', wobble: 0.3, opacity: 0.8 }),
    piece(ellipse(54, 40, 8, 20, 10), C.white, { ...flat, opacity: 0.8 }),
  ]),
);

/** Peter's own tiny tooth: the same shape, drawn small. 40 × 54. */
export const tinyTooth = cached(() =>
  svg({ w: 40, h: 54, name: 'dragon-tooth-tiny', label: 'A tiny tooth' }, [
    piece(curve([[5, 8], [20, 2], [35, 8], [36, 30], [30, 48], [20, 52], [10, 48], [4, 30]], 2), '#fbf8ee', { edge: 'cut', fibre: false }),
    ink([[11, 12], [9, 32]], { width: 2.4, color: '#cbbf9f', wobble: 0.2, opacity: 0.8 }),
  ]),
);

/** A soft grey cloud of smoke, made of overlapping puffs. 460 × 260. */
export const smokeCloud = cached(() =>
  svg({ w: 460, h: 260, name: 'dragon-tooth-smoke', label: 'A cloud of smoke' }, [
    ...[[90, 170, 70], [190, 130, 90], [300, 150, 84], [380, 170, 64], [150, 200, 56], [260, 210, 62], [220, 90, 56], [330, 100, 48]].map(([x, y, r], i) =>
      piece(circle(x, y, r), i % 2 ? '#a7a9b2' : '#b9bbc3', { edge: 'torn', rough: 0.6, shadow: false, fibre: false, opacity: 0.88 }),
    ),
    ...[[170, 110, 36], [290, 130, 34], [110, 160, 28]].map(([x, y, r]) => piece(circle(x, y, r), '#d3d4da', { ...flat, edge: 'torn', rough: 0.5, opacity: 0.6 })),
  ]),
);

/** A smoke ring: a fat, soft grey ring. 170 × 110. */
export const smokeRing = cached(() =>
  svg({ w: 170, h: 110, name: 'dragon-tooth-smoke-ring', label: 'A ring of smoke' }, [
    ink(ellipse(85, 55, 58, 34), { closed: true, width: 20, color: '#b3b5be', wobble: 2.2, opacity: 0.9 }),
    ink(ellipse(85, 52, 58, 32), { closed: true, width: 8, color: '#dcdde2', wobble: 1.6, opacity: 0.9 }),
  ]),
);

/** Two big yellow eyes opening in the dark: round, glowing, with slit pupils. 150 × 80. */
export const caveEyes = cached(() =>
  svg({ w: 150, h: 80, name: 'dragon-tooth-cave-eyes', label: 'Two yellow eyes' }, [
    ...[38, 112].flatMap((x) => [
      piece(ellipse(x, 40, 40, 32), '#f2d34a', { ...flat, opacity: 0.22 }),
      piece(ellipse(x, 40, 30, 24), '#f0cf3c', { edge: 'clean', shadow: false }),
      piece(ellipse(x, 40, 7, 21), '#1d1520', { edge: 'clean', shadow: false }),
      dot(x - 11, 30, 4, '#fff6c8', 0.9),
    ]),
  ]),
);

/** A black scorch mark over the right half of a far cottage roof (stage-sized: place at x 132, y 464, w 60). 60 × 40. */
export const scorch = cached(() =>
  svg({ w: 60, h: 40, name: 'dragon-tooth-scorch', label: 'A scorched roof' }, [
    piece(poly([[18, 14], [30, 4], [42, 20], [48, 34], [26, 34], [14, 26]]), '#2b2622', { edge: 'torn', rough: 0.5, shadow: false, fibre: false }),
    piece(poly([[26, 20], [34, 14], [40, 28], [30, 32]]), '#4a413a', { ...flat, edge: 'torn', rough: 0.5, opacity: 0.8 }),
  ]),
);

/** A fat blue pillow with a frill and a tassel at each corner. 270 × 130. */
export const pillow = cached(() =>
  svg({ w: 270, h: 130, name: 'dragon-tooth-pillow', label: 'A pillow' }, [
    piece(curve([[16, 22], [70, 8], [135, 14], [200, 8], [254, 22], [244, 66], [254, 108], [200, 120], [135, 114], [70, 120], [16, 108], [26, 66]], 2), '#9db8dc'),
    piece(curve([[34, 34], [90, 24], [135, 28], [180, 24], [236, 34], [228, 64], [236, 96], [180, 104], [135, 100], [90, 104], [34, 96], [42, 64]], 2), '#b4cbe8', { shadow: false, rough: 0.8 }),
    ink([[56, 66], [100, 58], [140, 68], [180, 58], [214, 66]], { width: 3, color: '#7b9ac4', wobble: 0.6, opacity: 0.7 }),
    ...[[14, 20], [256, 20], [14, 110], [256, 110]].flatMap(([x, y]) => [piece(circle(x, y, 8), C.goldLight, { edge: 'cut', fibre: false }), ink([[x, y], [x + (x < 100 ? -6 : 6), y + (y < 60 ? -8 : 10)]], { width: 3, color: C.gold, wobble: 0.3 })]),
  ]),
);

/** A gold coin with a star pressed in the middle. 120 × 120. */
export const coin = cached(() =>
  svg({ w: 120, h: 120, name: 'dragon-tooth-coin', label: 'A gold coin' }, [
    piece(circle(60, 60, 54), C.gold, { edge: 'cut', fibre: false }),
    piece(circle(60, 60, 44), C.goldLight, { ...flat }),
    ink(circle(60, 60, 44), { closed: true, width: 3, color: C.gold, wobble: 0.5 }),
    ...(() => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = ((-90 + i * 36) * Math.PI) / 180;
        const r = i % 2 ? 13 : 28;
        return [60 + Math.cos(a) * r, 60 + Math.sin(a) * r] as [number, number];
      });
      return [piece(pts, C.gold, flat)];
    })(),
    piece(ellipse(36, 34, 8, 14, 40), C.white, { ...flat, opacity: 0.55 }),
  ]),
);

/**
 * The string, as a drawn line the size of the whole stage. Its path (two
 * of them: a darker one under, a pale one over) is rewritten every frame
 * to run from the tooth to the chair; see `setString`.
 */
export const stringLine = cached(() =>
  svg({ w: 1180, h: 820, name: 'dragon-tooth-string-line', label: 'A piece of string' }, [
    raw('<path data-string="under" d="M0 0L0 0" fill="none" stroke="#8a5a3b" stroke-width="7" stroke-linecap="round"/>'),
    raw('<path data-string="over" d="M0 0L0 0" fill="none" stroke="#f1deb0" stroke-width="3.6" stroke-linecap="round"/>'),
  ]),
);

/** A knot-and-loop of string round a tooth. 70 × 40. */
export const stringLoop = cached(() =>
  svg({ w: 70, h: 40, name: 'dragon-tooth-string-loop', label: 'A string tied in a bow' }, [
    ink([[8, 14], [35, 24], [62, 14]], { width: 6, color: '#8a5a3b', wobble: 0.4 }),
    ink([[8, 14], [35, 24], [62, 14]], { width: 3, color: '#f1deb0', wobble: 0.4 }),
    group({}, [
      piece(ellipse(24, 28, 14, 8, -20), '#f1deb0', { edge: 'cut', fibre: false }),
      piece(ellipse(46, 28, 14, 8, 20), '#f1deb0', { edge: 'cut', fibre: false }),
      piece(circle(35, 26, 5), '#d8b878', flat),
    ]),
  ]),
);
