/**
 * One-off art for The Witch's Lost Cat: the carved pumpkin lantern, the big
 * moon for the flight, an owl, a bat, a pair of glowing green eyes, the
 * spiky shadow and the holly bush it turns out to be, Midnight's saucer of
 * milk, and the tin of cat-shaped biscuits.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Pt } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false as const };

/** The carved face's cut-outs: two eyes, a nose and a jagged smile, in a 160 × 150 box. */
const FACE: Pt[][] = [
  [[42, 74], [66, 74], [54, 52]],
  [[94, 74], [118, 74], [106, 52]],
  [[73, 88], [87, 88], [80, 74]],
  [[38, 94], [50, 104], [60, 98], [70, 108], [80, 100], [90, 108], [100, 98], [110, 104], [122, 94], [116, 112], [100, 124], [80, 128], [60, 124], [44, 112]],
];

/**
 * The pumpkin lantern, 160 × 150: round and orange with a green stalk and a
 * carved, smiling face. Unlit the face is dark holes; its `glow` part (hidden
 * at first) fades up to fill the face with warm light.
 */
export const pumpkin = cached(() =>
  svg({ w: 160, h: 150, name: 'witchs-cat-pumpkin', label: 'A carved pumpkin lantern' }, [
    piece(ellipse(80, 86, 70, 54), '#c9631e'),
    piece(ellipse(46, 86, 38, 52), '#dc7a26', { shadow: false }),
    piece(ellipse(114, 86, 38, 52), '#dc7a26', { shadow: false }),
    piece(ellipse(80, 86, 34, 54), '#ec8f34', { shadow: false }),
    ink([[56, 40], [48, 86], [56, 132]], { width: 2.4, color: '#a64d14', opacity: 0.7 }),
    ink([[104, 40], [112, 86], [104, 132]], { width: 2.4, color: '#a64d14', opacity: 0.7 }),
    piece(poly([[72, 38], [76, 16], [92, 10], [90, 40]]), '#5f8a3a', { edge: 'cut' }),
    ...FACE.map((pts) => piece(pts, '#3a2210', flat)),
    group({ part: 'glow', opacity: 0 }, [
      piece(circle(80, 86, 84), '#ffd36a', { ...flat, opacity: 0.22 }),
      piece(ellipse(80, 90, 56, 40), '#ffb040', { ...flat, opacity: 0.5 }),
      ...FACE.map((pts) => piece(pts, '#fff0a0', flat)),
    ]),
  ]),
);

/** A big pale moon, 300 × 300, with a halo, for the flight. */
export const bigMoon = cached(() =>
  svg({ w: 300, h: 300, name: 'witchs-cat-moon', label: 'The moon' }, [
    piece(circle(150, 150, 150), '#e8e8ff', { ...flat, opacity: 0.1 }),
    piece(circle(150, 150, 124), '#e8e8ff', { ...flat, opacity: 0.12 }),
    piece(circle(150, 150, 100), '#f4f0cc', { edge: 'torn', rough: 0.7, fibre: false, shadow: false }),
    piece(circle(150, 150, 90), '#fbf7da', { edge: 'clean', shadow: false }),
    piece(ellipse(124, 130, 22, 16, -20), '#ece6bc', { ...flat, opacity: 0.7 }),
    piece(ellipse(180, 172, 16, 12, 10), '#ece6bc', { ...flat, opacity: 0.7 }),
    piece(circle(190, 118, 10), '#ece6bc', { ...flat, opacity: 0.7 }),
  ]),
);

/** An owl sat on a branch, a soft violet silhouette with two big round yellow eyes. 140 × 160. */
export const owl = cached(() =>
  svg({ w: 140, h: 160, name: 'witchs-cat-owl', label: 'An owl' }, [
    piece(curve([[10, 134], [140, 134], [140, 150], [10, 150]], 1), '#1d1a46', { ...flat }),
    piece(curve([[34, 140], [30, 92], [46, 54], [70, 46], [94, 54], [110, 92], [106, 140]], 2), '#2a2860', { edge: 'torn', rough: 1.1, fibre: false, shadow: false }),
    piece(poly([[40, 62], [36, 28], [56, 48]]), '#2a2860', flat),
    piece(poly([[100, 62], [104, 28], [84, 48]]), '#2a2860', flat),
    piece(ellipse(70, 62, 34, 28), '#34327a', { edge: 'torn', rough: 0.9, fibre: false, shadow: false }),
    piece(circle(54, 62, 14), '#f6e8a0', { edge: 'clean', shadow: false }),
    piece(circle(86, 62, 14), '#f6e8a0', { edge: 'clean', shadow: false }),
    piece(circle(54, 63, 6), '#2b2620', { edge: 'clean', shadow: false }),
    piece(circle(86, 63, 6), '#2b2620', { edge: 'clean', shadow: false }),
    piece(poly([[64, 70], [76, 70], [70, 84]]), '#e8a84a', flat),
    ...[0, 1, 2].map((i) => ink([[52 + i * 18, 96], [56 + i * 18, 112]], { width: 2.4, color: '#4a4890', opacity: 0.8 })),
  ]),
);

/** A little bat, wings spread, a dark violet silhouette. 120 × 60. */
export const bat = cached(() =>
  svg({ w: 120, h: 60, name: 'witchs-cat-bat', label: 'A bat' }, [
    piece(curve([[60, 22], [44, 6], [22, 10], [2, 28], [18, 24], [28, 34], [42, 28], [52, 38], [60, 32]], 1), '#1d1a46', flat),
    piece(curve([[60, 22], [76, 6], [98, 10], [118, 28], [102, 24], [92, 34], [78, 28], [68, 38], [60, 32]], 1), '#1d1a46', flat),
    piece(ellipse(60, 30, 9, 13), '#2a2860', flat),
    piece(poly([[53, 20], [54, 8], [59, 18]]), '#2a2860', flat),
    piece(poly([[67, 20], [66, 8], [61, 18]]), '#2a2860', flat),
    dot(57, 28, 1.6, '#f6e8a0'),
    dot(63, 28, 1.6, '#f6e8a0'),
  ]),
);

/** Two glowing green eyes in the dark: soft halos and bright slit-pupilled eyes. 100 × 56. */
export const glowEyes = cached(() =>
  svg({ w: 100, h: 56, name: 'witchs-cat-eyes', label: 'Two glowing green eyes' }, [
    piece(circle(26, 28, 26), '#9be04f', { ...flat, opacity: 0.18 }),
    piece(circle(74, 28, 26), '#9be04f', { ...flat, opacity: 0.18 }),
    piece(circle(26, 28, 15), '#a8f060', { edge: 'clean', shadow: false }),
    piece(circle(74, 28, 15), '#a8f060', { edge: 'clean', shadow: false }),
    piece(ellipse(26, 28, 4, 11), '#14121c', { edge: 'clean', shadow: false }),
    piece(ellipse(74, 28, 4, 11), '#14121c', { edge: 'clean', shadow: false }),
    dot(21, 22, 3, '#ffffff'),
    dot(69, 22, 3, '#ffffff'),
  ]),
);

/**
 * The spiky shadow, 620 × 360: a long dark violet shape spread across the
 * ground with a big head of wild, spiky "hair" on top. Only a shadow.
 */
export const spikyShadow = cached(() => {
  const spikes: Pt[] = [];
  const n = 15;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = 80 + t * 460;
    const hump = Math.sin(t * Math.PI);
    const base = 330 - hump * 150;
    spikes.push([x - 14, base]);
    spikes.push([x, base - 40 - hump * 90 - ((i * 37) % 5) * 12]);
  }
  return svg({ w: 620, h: 360, name: 'witchs-cat-shadow', label: 'A long spiky shadow' }, [
    piece(poly([[0, 350], [40, 330], ...spikes, [580, 330], [620, 350]]), '#0d0b28', { edge: 'torn', rough: 1.2, fibre: false, shadow: false, opacity: 0.8 }),
  ]);
});

/** The holly bush it really was, 260 × 200: dark glossy spiky leaves and red berries. */
export const hollyBush = cached(() => {
  const r: [number, number, number, number][] = [
    [60, 150, 52, 30], [130, 160, 64, 34], [200, 150, 52, 30], [90, 108, 48, 28], [170, 106, 48, 28], [130, 82, 44, 26],
  ];
  return svg({ w: 260, h: 200, name: 'witchs-cat-holly', label: 'A holly bush' }, [
    ...r.map(([x, y, rx, ry], i) =>
      piece(
        poly(Array.from({ length: 14 }, (_, j) => {
          const a = (j / 14) * Math.PI * 2;
          const k = j % 2 ? 1 : 1.3;
          return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k] as Pt;
        })),
        i % 2 ? '#2f6a4a' : '#3b7d55',
        { edge: 'cut', fibre: false },
      ),
    ),
    ...[[80, 120], [118, 96], [150, 130], [182, 96], [104, 156], [190, 158], [140, 70]].map(([x, y]) => piece(circle(x, y, 7), '#d9473f', { edge: 'clean', shadow: false })),
    ...[[80, 120], [118, 96], [150, 130], [182, 96]].map(([x, y]) => dot(x - 2, y - 2, 2, '#ffd0c8')),
  ]);
});

/** A saucer of milk, 130 × 60. */
export const saucer = cached(() =>
  svg({ w: 130, h: 60, name: 'witchs-cat-saucer', label: 'A saucer of milk' }, [
    piece(ellipse(65, 38, 60, 16), C.china, { edge: 'cut' }),
    piece(ellipse(65, 34, 54, 13), C.chinaBlue, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(65, 34, 46, 10), '#fbf8ee', { edge: 'clean', shadow: false }),
    piece(ellipse(52, 31, 14, 3), '#ffffff', { ...flat, opacity: 0.8 }),
  ]),
);

/** A cat-shaped biscuit: a round face with two pointed ears and a tiny face drawn on. 90 × 84. */
export const catBiscuit = cached(() =>
  svg({ w: 90, h: 84, name: 'witchs-cat-biscuit', label: 'A cat-shaped biscuit' }, [
    piece(poly([[14, 38], [16, 6], [38, 24]]), '#c98f4a', { edge: 'cut' }),
    piece(poly([[76, 38], [74, 6], [52, 24]]), '#c98f4a', { edge: 'cut' }),
    piece(ellipse(45, 50, 38, 30), '#d9a35a'),
    piece(ellipse(45, 50, 30, 22), '#e8b96e', { shadow: false, fibre: false }),
    dot(34, 46, 3, '#5a3a28'),
    dot(56, 46, 3, '#5a3a28'),
    piece(poly([[41, 54], [49, 54], [45, 60]]), '#a9502c', flat),
    ink([[45, 60], [45, 64]], { width: 1.8, color: '#5a3a28' }),
    ink([[36, 66], [45, 64], [54, 66]], { width: 1.8, color: '#5a3a28' }),
  ]),
);

/** The biscuit tin, 170 × 130: a round red tin with a cat's face on the lid (part `lid` tips up). */
export const biscuitTin = cached(() =>
  svg({ w: 170, h: 130, name: 'witchs-cat-tin', label: 'A tin of cat biscuits' }, [
    piece(rect(18, 40, 134, 84, 8), '#b5403a', { edge: 'cut' }),
    piece(rect(18, 40, 134, 14, 4), '#8e2c28', { ...flat }),
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[30 + i * 22, 62], [30 + i * 22, 116]], { width: 2.4, color: '#e8a8a0', opacity: 0.5 })),
    group({ part: 'lid', origin: [24, 40] }, [
      piece(rect(10, 22, 150, 24, 8), '#d9544c', { edge: 'cut' }),
      piece(poly([[58, 26], [60, 4], [74, 22]]), '#2c2a38', flat),
      piece(poly([[112, 26], [110, 4], [96, 22]]), '#2c2a38', flat),
      piece(ellipse(85, 30, 28, 14), '#2c2a38', { ...flat }),
      dot(76, 28, 2.6, '#a8f060'),
      dot(94, 28, 2.6, '#a8f060'),
    ]),
  ]),
);
