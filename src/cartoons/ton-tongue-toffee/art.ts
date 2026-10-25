/**
 * One-off art for Ton-Tongue Toffee: the letter plastered in stamps, the
 * breakfast table, the glass of water, the boarded-up fireplace and the bits
 * that burst out of it, and the green Floo flames. Nothing here would suit a
 * second cartoon, so it stays in this folder.
 */
import { C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../kit';

const flat = { edge: 'cut', fibre: false, shadow: false } as const;

/** A cream envelope covered all over in little coloured stamps, 230 × 160. */
export const stampedLetter = cached(() => {
  const colours = [C.red, C.blue, C.green, C.yellow, C.purple, C.orange, C.teal, C.pink, C.gold, C.rose];
  const stamps: ReturnType<typeof piece>[] = [];
  // Five rows of seven stamps, each a different colour and a little crooked.
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const i = row * 7 + col;
      const x = 12 + col * 30 + (row % 2) * 5;
      const y = 12 + row * 28;
      const w = 24 + (i % 3) * 2;
      const h = 22 + (i % 2) * 3;
      stamps.push(piece(rect(x, y, w, h, 1), colours[(i * 3 + row) % colours.length], flat));
      stamps.push(piece(rect(x + 4, y + 4, w - 8, h - 8, 1), colours[(i * 3 + row + 4) % colours.length], { ...flat, opacity: 0.75 }));
    }
  }
  return svg({ w: 230, h: 160, name: 'ton-tongue-toffee-letter', label: 'A letter covered in stamps' }, [
    piece(rect(6, 6, 218, 148, 4), C.cream),
    ...stamps,
    // a few round postmarks over the top
    ink([[40, 100], [90, 92], [140, 104]], { width: 3, color: C.charcoal, opacity: 0.45 }),
    piece(circle(170, 70, 22), C.charcoal, { ...flat, opacity: 0.18 }),
  ]);
});

/** The breakfast table in front of everyone: a wooden top and a checked cloth, 1180 × 210. */
export const breakfastTable = cached(() => {
  const checks = [] as ReturnType<typeof ink>[];
  for (let x = 40; x < 1180; x += 80) checks.push(ink([[x, 52], [x, 206]], { width: 14, color: C.rose, opacity: 0.35 }));
  for (let y = 78; y < 206; y += 56) checks.push(ink([[0, y], [1180, y]], { width: 14, color: C.rose, opacity: 0.35 }));
  return svg({ w: 1180, h: 210, name: 'ton-tongue-toffee-table', label: 'The breakfast table' }, [
    piece(rect(0, 44, 1180, 166, 2), C.white),
    ...checks,
    piece(rect(0, 8, 1180, 50, 6), C.sand),
    ink([[20, 22], [1160, 22]], { width: 2, color: C.tan, opacity: 0.6 }),
  ]);
});

/** A glass of water, 70 × 110: the water is the `water` part. */
export const glass = cached(() =>
  svg({ w: 70, h: 110, name: 'ton-tongue-toffee-glass', label: 'A glass of water' }, [
    piece(poly([[10, 10], [60, 10], [54, 102], [16, 102]]), '#dff0f6', { edge: 'clean', shadow: true, opacity: 0.9 }),
    group({ part: 'water', origin: [35, 100] }, [piece(poly([[13, 38], [57, 38], [53, 98], [17, 98]]), '#8fc4e0', flat)]),
    ink([[20, 20], [22, 90]], { width: 3, color: C.white, opacity: 0.8 }),
  ]),
);

// ------------------------------------------------------ the fireplace
// The lounge backdrop has the boarded-up opening (x 460–720, y 380–602) and the
// electric fire painted in. These pieces go over exactly that spot so the
// boards and the fire can burst out, and the hearth can be shown behind them.

const BOARD = '#e3d9c3';
const RIM = '#6b5d57';

/** The dark, sooty hearth behind the boards, 260 × 222; `flames` is a cosy orange fire, hidden. */
export const hearth = cached(() =>
  svg({ w: 260, h: 222, name: 'ton-tongue-toffee-hearth', label: 'The hearth' }, [
    piece(rect(0, 0, 260, 222, 3), '#2a2422', flat),
    piece(rect(14, 14, 232, 208, 3), '#3a302c', flat),
    ink([[40, 214], [220, 214]], { width: 10, color: '#1c1715' }),
    group({ part: 'flames', origin: [130, 214], opacity: 0 }, [
      piece(poly([[70, 214], [84, 160], [98, 186], [112, 140], [128, 190], [146, 150], [158, 190], [176, 168], [190, 214]]), C.orange, flat),
      piece(poly([[96, 214], [108, 184], [120, 200], [132, 170], [148, 214]]), C.yellow, flat),
    ]),
  ]),
);

/** The left half of the cream board over the opening, 130 × 222. */
export const boardLeft = cached(() =>
  svg({ w: 130, h: 222, name: 'ton-tongue-toffee-board-l', label: 'A board' }, [
    piece(rect(0, 0, 130, 222, 2), RIM),
    piece(rect(5, 5, 125, 212, 2), BOARD, flat),
    dot(14, 14, 4, '#8a7d76'),
    dot(14, 208, 4, '#8a7d76'),
  ]),
);

/** The right half of the board, 130 × 222. */
export const boardRight = cached(() =>
  svg({ w: 130, h: 222, name: 'ton-tongue-toffee-board-r', label: 'A board' }, [
    piece(rect(0, 0, 130, 222, 2), RIM),
    piece(rect(0, 5, 125, 212, 2), BOARD, flat),
    dot(116, 14, 4, '#8a7d76'),
    dot(116, 208, 4, '#8a7d76'),
  ]),
);

/** The electric fire with its two glowing bars, 208 × 106 (it stands in front of the board). */
export const electricFire = cached(() =>
  svg({ w: 208, h: 106, name: 'ton-tongue-toffee-fire', label: 'An electric fire' }, [
    piece(ellipse(104, 62, 100, 38), C.orange, { ...flat, opacity: 0.35 }),
    piece(rect(0, 0, 208, 106, 4), '#6b5d57'),
    piece(rect(10, 10, 188, 90, 2), '#2f2926', flat),
    piece(rect(26, 40, 156, 14, 6), C.orange, flat),
    piece(rect(26, 64, 156, 14, 6), C.orange, flat),
    ink([[34, 47], [172, 47]], { width: 3, color: C.goldLight, opacity: 0.8 }),
    ink([[34, 71], [172, 71]], { width: 3, color: C.goldLight, opacity: 0.8 }),
  ]),
);

/** The electric fire's plug on a bit of wire, 90 × 70. */
export const plug = cached(() =>
  svg({ w: 90, h: 70, name: 'ton-tongue-toffee-plug', label: 'A plug' }, [
    ink([[4, 60], [22, 40], [34, 52], [48, 34]], { width: 4, color: C.charcoal }),
    piece(rect(44, 14, 40, 40, 6), '#2f6fa8'),
    piece(rect(84, 22, 4, 8, 1), C.steel, flat),
    piece(rect(84, 38, 4, 8, 1), C.steel, flat),
    piece(rect(52, 22, 18, 24, 3), '#4a8cc8', flat),
  ]),
);

/** A leaping green Floo fire, 260 × 250, with its flames as one part so it can lick and swell. */
export const greenFlames = cached(() =>
  svg({ w: 260, h: 250, name: 'ton-tongue-toffee-floo', label: 'Green flames' }, [
    group({ part: 'flames', origin: [130, 250] }, [
      piece(curve([[20, 250], [28, 170], [50, 120], [60, 190], [78, 90], [98, 170], [118, 40], [140, 150], [162, 70], [176, 160], [200, 110], [214, 180], [240, 250]], 1), '#2f9a5c', flat),
      piece(curve([[56, 250], [70, 190], [92, 130], [104, 190], [124, 90], [146, 190], [166, 120], [182, 190], [204, 250]], 1), '#5fd68a', flat),
      piece(curve([[96, 250], [112, 200], [126, 150], [140, 200], [162, 250]], 1), '#d2f7c9', flat),
    ]),
  ]),
);

/** A pinch of glittering Floo powder, 40 × 40. */
export const pinch = cached(() =>
  svg({ w: 40, h: 40, name: 'ton-tongue-toffee-pinch', label: 'A pinch of Floo powder' }, [
    dot(20, 20, 14, '#7be0a0', 0.5),
    dot(14, 16, 5, '#d2f7c9'),
    dot(26, 22, 6, '#5fd68a'),
    dot(20, 28, 4, '#d2f7c9'),
    dot(24, 11, 3.5, '#a8f0c0'),
  ]),
);
