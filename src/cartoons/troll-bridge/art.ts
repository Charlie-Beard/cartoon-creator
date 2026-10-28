/**
 * One-off art for The Troll's Bridge: Peter's bird box and hammer, Mum's
 * blackberry pie (with a slice that comes out) and the picnic basket, a
 * gingham picnic cloth, Grizzle's wobbly green jelly, and the shiny river
 * stone he gives them.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false as const };

/** Peter's bird box, 110 × 130: a little wooden house with a round door and a pitched roof. */
export const birdBox = cached(() =>
  svg({ w: 110, h: 130, name: 'troll-bridge-birdbox', label: 'A bird box' }, [
    piece(rect(16, 46, 78, 80, 3), '#b8865a', { edge: 'cut' }),
    piece(rect(16, 46, 20, 80), '#a2734a', { ...flat, opacity: 0.6 }),
    ink([[36, 50], [36, 122]], { width: 1.6, color: '#7a5434', opacity: 0.6 }),
    ink([[74, 50], [74, 122]], { width: 1.6, color: '#7a5434', opacity: 0.6 }),
    piece(poly([[4, 54], [55, 8], [106, 54], [98, 60], [55, 22], [12, 60]]), '#c0453a', { edge: 'cut' }),
    piece(circle(55, 76, 14), '#3a2616', flat),
    piece(rect(51, 96, 8, 16, 2), '#7a5434', flat),
    dot(24, 116, 2, '#5a3c22'),
    dot(86, 116, 2, '#5a3c22'),
  ]),
);

/** Peter's hammer, 110 × 110: a wooden handle with a grey head. The head is at the top left; it swings from the handle's foot (bottom right). */
export const hammer = cached(() =>
  svg({ w: 110, h: 110, name: 'troll-bridge-hammer', label: 'A hammer' }, [
    piece(poly([[34, 30], [44, 22], [102, 92], [92, 100]]), '#b07a44', { edge: 'cut' }),
    piece(poly([[8, 36], [36, 6], [56, 24], [28, 54]]), '#8a8e96', { edge: 'cut' }),
    piece(poly([[8, 36], [18, 26], [38, 46], [28, 54]]), '#6c7078', { ...flat }),
  ]),
);

/**
 * Mum's blackberry pie, 160 × 100: a golden crust, crimped round the edge,
 * with purple showing through the slits. Its `slice` part is the wedge at
 * the front right, faded out when the slice is taken.
 */
export const pie = cached(() =>
  svg({ w: 160, h: 100, name: 'troll-bridge-pie', label: 'A blackberry pie' }, [
    piece(ellipse(80, 66, 76, 28), '#e8e2d4', { edge: 'cut' }),
    piece(ellipse(80, 58, 66, 26), '#d79a4a'),
    piece(ellipse(80, 54, 58, 20), '#e6b264', { shadow: false }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
      const a = (i / 12) * Math.PI * 2;
      return dot(80 + Math.cos(a) * 62, 58 + Math.sin(a) * 23, 4, '#c88a3e');
    }),
    ink([[60, 46], [70, 54]], { width: 3, color: '#5a2a4a' }),
    ink([[84, 44], [92, 52]], { width: 3, color: '#5a2a4a' }),
    group({ part: 'slice' }, [
      piece(poly([[80, 56], [140, 62], [128, 76], [104, 82]]), '#e6b264', { ...flat }),
      ink([[110, 64], [118, 70]], { width: 3, color: '#5a2a4a' }),
    ]),
    group({ part: 'gap', opacity: 0 }, [
      piece(poly([[80, 56], [140, 62], [128, 76], [104, 82]]), '#6a2c5a', { ...flat }),
      ink([[84, 58], [132, 64]], { width: 4, color: '#d79a4a' }),
    ]),
  ]),
);

/** One slice of the pie, 80 × 60: a golden wedge with purple filling. */
export const pieSlice = cached(() =>
  svg({ w: 80, h: 60, name: 'troll-bridge-slice', label: 'A slice of pie' }, [
    piece(poly([[6, 20], [74, 10], [66, 34], [12, 50]]), '#6a2c5a', { edge: 'cut' }),
    piece(poly([[6, 14], [74, 6], [74, 14], [6, 24]]), '#e6b264', { edge: 'cut' }),
    ink([[30, 12], [40, 16]], { width: 3, color: '#5a2a4a' }),
    piece(poly([[8, 44], [66, 30], [64, 40], [14, 54]]), '#d79a4a', { ...flat }),
  ]),
);

/** The picnic basket, 160 × 130: woven wicker with a hooped handle and a gingham cloth peeping out. */
export const basket = cached(() =>
  svg({ w: 160, h: 130, name: 'troll-bridge-basket', label: 'A picnic basket' }, [
    ink([[28, 62], [36, 16], [80, 4], [124, 16], [132, 62]], { width: 9, color: '#a8783e' }),
    piece(poly([[14, 56], [146, 56], [134, 124], [26, 124]]), '#c8964e', { edge: 'cut' }),
    ...[70, 86, 102, 116].map((y) => ink([[20, y], [140, y]], { width: 2.4, color: '#9a6a32', opacity: 0.7 })),
    ...[40, 64, 88, 112].map((x) => ink([[x, 58], [x - 2, 122]], { width: 2, color: '#9a6a32', opacity: 0.5 })),
    piece(poly([[22, 50], [138, 50], [146, 62], [14, 62]]), '#b0803e', { edge: 'cut' }),
    piece(poly([[60, 48], [100, 48], [92, 62], [66, 62]]), '#d8453c', { ...flat }),
    ...[64, 76, 88].map((x) => dot(x, 54, 3, C.white, 0.9)),
  ]),
);

/** A red-and-white gingham picnic cloth hanging over the bridge's deck, 300 × 70. */
export const cloth = cached(() =>
  svg({ w: 300, h: 70, name: 'troll-bridge-cloth', label: 'A picnic cloth' }, [
    piece(curve([[4, 6], [150, 2], [296, 6], [290, 64], [240, 56], [190, 66], [150, 58], [110, 66], [60, 56], [10, 64]], 1), '#f4ece0', { edge: 'torn', rough: 0.6 }),
    ...[24, 60, 96, 132, 168, 204, 240, 276].map((x) => piece(rect(x - 9, 6, 18, 54), '#d8453c', { ...flat, opacity: 0.55 })),
    ...[14, 34].map((y) => piece(rect(6, y, 288, 12), '#d8453c', { ...flat, opacity: 0.45 })),
  ]),
);

/** Grizzle's gooseberry jelly, 140 × 130: a tall wobbly green dome on a plate, with a shine. */
export const jelly = cached(() =>
  svg({ w: 140, h: 130, name: 'troll-bridge-jelly', label: 'A green jelly' }, [
    piece(ellipse(70, 116, 64, 12), '#e8e2d4', { edge: 'cut' }),
    group({ part: 'wobble', origin: [70, 114] }, [
      piece(curve([[22, 112], [20, 70], [34, 36], [70, 24], [106, 36], [120, 70], [118, 112]], 2), '#8cc04a', { edge: 'torn', rough: 0.6 }),
      piece(curve([[34, 108], [34, 74], [44, 50], [56, 44], [50, 80], [52, 108]], 2), '#a8d86a', { ...flat, opacity: 0.8 }),
      piece(ellipse(52, 52, 7, 14, -20), C.white, { ...flat, opacity: 0.6 }),
      ...[[62, 26], [72, 22], [80, 26]].map(([x, y]) => dot(x, y, 4, '#6a9a34')),
    ]),
  ]),
);

/** The shiny river stone, 70 × 56: a smooth blue-grey pebble with a pale streak and a sparkle. */
export const stone = cached(() =>
  svg({ w: 70, h: 56, name: 'troll-bridge-stone', label: 'A shiny river stone' }, [
    piece(ellipse(35, 32, 30, 20, -8), '#7d93a8', { edge: 'cut' }),
    piece(ellipse(30, 26, 20, 11, -8), '#a9bccb', { ...flat, opacity: 0.85 }),
    ink([[16, 36], [30, 30], [52, 34]], { width: 2.4, color: '#e6eef4', opacity: 0.8 }),
    piece(poly([[50, 10], [53, 18], [61, 20], [53, 22], [50, 30], [47, 22], [39, 20], [47, 18]]), '#fff8d0', { ...flat }),
  ]),
);
