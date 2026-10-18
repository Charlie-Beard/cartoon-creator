/** Honeydukes sweets and the trapdoor (made for "The Secret Way to Honeydukes"). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../../art/paper';

/** A Fizzing Whizzbee: a round pink-and-white sherbet ball, 100 × 100. */
export function fizzingWhizbee(): string {
  const fizz: Array<[number, number]> = [[34, 34], [62, 28], [72, 52], [46, 60], [30, 66], [60, 76], [78, 74]];
  return svg({ w: 100, h: 100, name: 'honeydukes-whizbee', label: 'a fizzing whizzbee' }, [
    piece(circle(50, 50, 44), '#e58aa0'),
    piece(curve([[16, 50], [24, 26], [50, 12], [76, 26], [84, 50], [50, 40]], 2), '#f7d3dc', { edge: 'cut', fibre: false, shadow: false }),
    ink([[18, 62], [50, 50], [82, 62]], { width: 5, color: '#f7f2e6', opacity: 0.9 }),
    ink([[26, 76], [50, 66], [74, 76]], { width: 4, color: '#f7f2e6', opacity: 0.8 }),
    ...fizz.map(([x, y], i) => dot(x, y, 3.5 + (i % 3), '#fff8e8', 0.95)),
    piece(ellipse(34, 30, 10, 6, -0.6), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
  ]);
}

/** A Pepper Imp: a little red-hot pepper with a cheeky face, 90 × 110. */
export function pepperImp(): string {
  return svg({ w: 90, h: 110, name: 'honeydukes-imp', label: 'a pepper imp' }, [
    piece(curve([[30, 22], [58, 20], [76, 50], [66, 90], [46, 104], [26, 82], [14, 50]], 2), '#c8392f'),
    piece(curve([[28, 36], [36, 28], [34, 60], [26, 76], [22, 56]], 2), '#e8655a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(poly([[36, 24], [46, 4], [58, 8], [54, 26]]), C.greenDark),
    piece(poly([[40, 8], [30, 0], [34, 12]]), C.greenDark, { edge: 'cut', fibre: false, shadow: false }),
    // cheeky face
    dot(36, 56, 6, '#fff8e8'), dot(56, 56, 6, '#fff8e8'),
    dot(38, 57, 3, C.ink), dot(58, 55, 3, C.ink),
    ink([[28, 46], [42, 50]], { width: 3, color: C.ink }),
    ink([[50, 49], [64, 44]], { width: 3, color: C.ink }),
    piece(curve([[34, 72], [46, 80], [60, 70], [58, 76], [46, 88], [36, 78]], 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
    dot(34, 68, 4, '#f08a7a', 0.8), dot(64, 66, 4, '#f08a7a', 0.8),
    // little puffs of heat
    ink([[70, 16], [76, 8], [72, 0]], { width: 2.5, color: C.orange, opacity: 0.8 }),
    ink([[18, 22], [12, 14], [16, 6]], { width: 2.5, color: C.orange, opacity: 0.8 }),
  ]);
}

/** An Ice Mouse: a pale icy-blue sugar mouse with a string tail, 120 × 80. */
export function iceMouse(): string {
  return svg({ w: 120, h: 80, name: 'honeydukes-icemouse', label: 'an ice mouse' }, [
    ink([[24, 62], [10, 56], [14, 40], [4, 32]], { width: 3, color: '#f1e4c4' }),
    piece(curve([[24, 66], [20, 46], [44, 26], [84, 24], [104, 44], [104, 66], [60, 72]], 2), '#bfe0f2'),
    piece(curve([[40, 40], [58, 32], [88, 32], [98, 46]], 2), '#e4f4fb', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(circle(84, 22, 15), '#a9d2ea'),
    piece(circle(84, 22, 8), '#f0b6c4', { edge: 'cut', fibre: false, shadow: false }),
    dot(102, 54, 4, '#e58aa0'),
    dot(94, 44, 3, C.ink),
    dot(95, 43, 1, '#ffffff'),
    ink([[102, 56], [116, 52]], { width: 1.5, color: C.slate }),
    ink([[102, 60], [116, 62]], { width: 1.5, color: C.slate }),
    ...[[56, 50], [70, 42], [40, 58], [80, 58]].map(([x, y]) => dot(x, y, 2, '#ffffff', 0.9)),
  ]);
}

/** A big glass sweet jar with a lid, full of colourful sweets, 140 × 180. */
export function sweetJar(): string {
  const cols = ['#e58aa0', '#f0d25a', '#9fd3ae', '#a8643c', '#f2b8c6', '#f4a76a', '#c9a8e0', '#7fc4a0'];
  const sweets = [];
  let i = 0;
  for (let y = 150; y > 70; y -= 24) {
    for (let x = 36 + ((y / 24) % 2) * 12; x < 108; x += 26) {
      sweets.push(piece(circle(x, y, 12), cols[i++ % cols.length], { edge: 'cut', fibre: false, shadow: false }));
      sweets.push(dot(x - 4, y - 4, 3, '#ffffff', 0.7));
    }
  }
  return svg({ w: 140, h: 180, name: 'honeydukes-jar', label: 'a jar of sweets' }, [
    piece(curve([[28, 40], [18, 70], [14, 140], [26, 170], [70, 176], [114, 170], [126, 140], [122, 70], [112, 40]], 2), '#dcebe9', { edge: 'cut' }),
    piece(curve([[32, 56], [26, 80], [24, 142], [32, 164], [70, 168], [108, 164], [116, 142], [114, 80], [108, 56]], 2), '#c3d9d6', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
    ...sweets,
    piece(rect(32, 28, 76, 16, 4), '#e6f0ee', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(24, 14, 92, 18, 6), C.gold, { edge: 'cut' }),
    piece(circle(70, 8, 8), C.goldLight, { edge: 'cut', fibre: false }),
    piece(rect(30, 60, 8, 90, 4), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }),
  ]);
}

/** A trapdoor in the floor, 220 × 90. Part `door` swings up on its back hinge edge. */
export function trapdoor(): string {
  return svg({ w: 220, h: 90, name: 'honeydukes-trapdoor', label: 'a trapdoor' }, [
    // frame and the dark hole beneath
    piece(poly([[34, 28], [186, 28], [214, 80], [6, 80]]), '#6a4a30', { edge: 'cut' }),
    piece(poly([[44, 34], [176, 34], [200, 74], [20, 74]]), '#120d0b', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[60, 44], [160, 44], [176, 66], [44, 66]]), '#2a1d16', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // the door lies flat across the hole; origin is its back hinge edge
    group({ part: 'door', origin: [110, 30] }, [
      piece(poly([[30, 30], [190, 30], [212, 78], [8, 78]]), '#a06d43'),
      ...[0.25, 0.5, 0.75].map((t) => ink([[30 - 22 * t + 22 * 0, 30 + 48 * t], [190 + 22 * t, 30 + 48 * t]], { width: 2.5, color: C.brownDark, opacity: 0.55 })),
      piece(ellipse(110, 56, 14, 6), C.stone, { edge: 'cut', fibre: false, shadow: false }),
      ellipseRing(),
      piece(poly([[28, 70], [38, 70], [32, 80]]), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
      dot(46, 40, 3, C.stoneLight), dot(174, 40, 3, C.stoneLight),
      dot(22, 72, 3, C.stoneLight), dot(198, 72, 3, C.stoneLight),
    ]),
  ]);
}

function ellipseRing() {
  return ink([[100, 54], [104, 62], [116, 62], [120, 54]], { width: 3, color: C.greyDark });
}
