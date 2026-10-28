/**
 * One-off art for The Mermaid's Golden Comb: Jigs's birthday bell, Peter's
 * seaside bucket, a dull grey pebble and the same pebble polished silver,
 * and a big flung splash of water.
 */
import { C, cached, curve, dot, ellipse, ink, piece, poly, rect, svg } from '../../kit';

const CUT = { edge: 'cut' as const, fibre: false as const };

/** Jigs's birthday bell: a little gold hand bell with a red ribbon bow on its loop and a clapper. 60 × 72. */
export const birthdayBell = cached(() =>
  svg({ w: 60, h: 72, name: 'mermaid-comb-bell', label: 'A little gold bell' }, [
    // the bow on the loop
    piece(poly([[30, 14], [12, 4], [10, 22]]), C.red, CUT),
    piece(poly([[30, 14], [48, 4], [50, 22]]), C.red, CUT),
    piece(ellipse(30, 14, 5, 5), '#a82a22', CUT),
    // the bell
    piece(curve([[30, 18], [18, 24], [14, 44], [6, 58], [54, 58], [46, 44], [42, 24]], 2), '#e8b830'),
    piece(rect(4, 56, 52, 7, 3), '#c99420', CUT),
    piece(ellipse(22, 36, 4, 12), '#f8de7a', { ...CUT, shadow: false, opacity: 0.8 }),
    // the clapper
    piece(ellipse(30, 66, 6, 5), '#a87a18', CUT),
    dot(20, 30, 2.4, C.white, 0.9),
  ]),
);

/** Peter's seaside bucket: a red tin bucket with a white stripe, a wire handle and a yellow spade in it. 100 × 104. */
export const bucket = cached(() =>
  svg({ w: 100, h: 104, name: 'mermaid-comb-bucket', label: 'A red seaside bucket' }, [
    // the spade's handle sticking out
    piece(rect(62, 4, 8, 46, 3), C.yellow, CUT),
    piece(rect(56, 2, 20, 8, 3), '#d9a32a', CUT),
    // the wire handle
    ink([[14, 38], [20, 14], [50, 6], [80, 14], [86, 38]], { width: 3, color: '#6b6b6b', wobble: 0.2 }),
    // the bucket, wider at the top
    piece(poly([[8, 34], [92, 34], [80, 100], [20, 100]]), '#d4463a'),
    piece(ellipse(50, 35, 42, 7), '#8f2a22', CUT),
    piece(poly([[12, 58], [88, 58], [86, 68], [14, 68]]), C.white, { ...CUT, shadow: false, opacity: 0.9 }),
    piece(poly([[22, 40], [30, 40], [26, 92], [22, 92]]), '#e9786a', { ...CUT, shadow: false, opacity: 0.6 }),
  ]),
);

/** A plain grey pebble, round and smooth, not shiny at all. 60 × 44. */
export const pebble = cached(() =>
  svg({ w: 60, h: 44, name: 'mermaid-comb-pebble', label: 'A grey pebble' }, [
    piece(ellipse(30, 24, 26, 17), '#8f8a82'),
    piece(ellipse(24, 18, 10, 5), '#a9a49b', { ...CUT, shadow: false, opacity: 0.8 }),
  ]),
);

/** The same pebble, polished until it shines like silver, with a bright glint. 60 × 44. */
export const shinyPebble = cached(() =>
  svg({ w: 60, h: 44, name: 'mermaid-comb-pebble-shiny', label: 'A polished silver pebble' }, [
    piece(ellipse(30, 24, 26, 17), '#c9d2da'),
    piece(ellipse(30, 28, 22, 10), '#a8b4bf', { ...CUT, shadow: false, opacity: 0.6 }),
    piece(ellipse(22, 16, 11, 5), '#f4f8fb', { ...CUT, shadow: false }),
    dot(40, 14, 3, C.white),
    ink([[46, 6], [46, 14]], { width: 2, color: C.white }),
    ink([[42, 10], [50, 10]], { width: 2, color: C.white }),
  ]),
);

/** A little parcel wrapped in green seaweed and tied with a strand of it: Nipper's present. 50 × 40. */
export const parcel = cached(() =>
  svg({ w: 50, h: 40, name: 'mermaid-comb-parcel', label: 'A seaweed parcel' }, [
    piece(ellipse(25, 22, 22, 15), '#4f8a4a'),
    piece(ellipse(18, 16, 9, 5), '#78b064', { ...CUT, shadow: false, opacity: 0.8 }),
    ink([[25, 8], [25, 36]], { width: 3, color: '#2f5e2c', wobble: 0.3 }),
    ink([[5, 22], [45, 22]], { width: 3, color: '#2f5e2c', wobble: 0.3 }),
    ink([[25, 8], [16, 2], [22, 10]], { width: 2.4, color: '#2f5e2c' }),
    ink([[25, 8], [34, 2], [28, 10]], { width: 2.4, color: '#2f5e2c' }),
  ]),
);

/** A big splash of water flung through the air: a blob of blue with droplets round it. 140 × 90. */
export const splash = cached(() =>
  svg({ w: 140, h: 90, name: 'mermaid-comb-splash', label: 'A splash of water' }, [
    piece(curve([[20, 50], [34, 26], [64, 20], [96, 22], [122, 38], [118, 62], [90, 70], [56, 72], [28, 66]], 2), '#8fd0dc', { ...CUT, shadow: false, opacity: 0.9 }),
    piece(ellipse(74, 40, 30, 10), '#d6f0f4', { ...CUT, shadow: false, opacity: 0.9 }),
    ...[[10, 30], [130, 22], [134, 66], [12, 76], [44, 10], [100, 82]].map(([x, y]) => piece(ellipse(x, y, 6, 8), '#a9dce6', { ...CUT, shadow: false })),
  ]),
);
