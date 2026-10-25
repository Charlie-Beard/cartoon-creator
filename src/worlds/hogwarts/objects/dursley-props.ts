/** Small props for the Dursley cartoons: trunk, cage, bars, pudding, toffee, letters, cake, dog, glass, presents, Floo pot. */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** A soft ground shadow that anchors an object. */
const shade = (cx: number, cy: number, rx: number, ry = rx * 0.14): Node =>
  piece(ellipse(cx, cy, rx, ry), '#2b1f16', { edge: 'clean', shadow: false, opacity: 0.22 });

/** Harry's school trunk: closed, brown wood, brass corners, leather strap. 240 × 160. */
export function trunk(): string {
  const slats = [60, 120, 180].map((x) => ink([[x, 44], [x, 138]], { width: 2, color: C.brownDark, opacity: 0.5 }));
  return svg({ w: 240, h: 160, name: 'dursley-trunk', label: 'a school trunk' }, [
    shade(120, 150, 112),
    // lid, then body
    piece(curve([[12, 62], [14, 36], [34, 22], [206, 22], [226, 36], [228, 62]], 1), C.brown),
    piece(rect(12, 56, 216, 88, 3), C.wood),
    ...slats,
    ink([[12, 62], [228, 62]], { width: 4, color: C.brownDark }),
    // leather strap
    piece(rect(104, 22, 32, 124, 2), '#6b3f26', { edge: 'cut' }),
    piece(rect(104, 56, 32, 12, 1), '#4a2a18', { edge: 'cut', fibre: false, shadow: false }),
    // brass lock and corners
    piece(rect(108, 68, 24, 26, 3), C.gold, { edge: 'cut' }),
    dot(120, 78, 3.5, C.brownDark),
    ink([[120, 79], [120, 88]], { width: 3, color: C.brownDark }),
    ...[[12, 22], [204, 22], [12, 118], [204, 118]].map(([x, y]) => piece(rect(x, y, 24, 26, 2), C.gold, { edge: 'cut' })),
    ...[[28, 100], [212, 100], [28, 40], [212, 40]].map(([x, y]) => dot(x, y, 2.5, C.goldLight)),
  ]);
}

/** Hedwig's empty cage: brass dome, ring on top, bars, a perch. 140 × 200. */
export function owlCage(): string {
  const bars: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const x = 28 + i * 14;
    bars.push(ink([[70 + (x - 70) * 0.35, 54], [x, 160]], { width: 2.5, color: C.gold }));
  }
  return svg({ w: 140, h: 200, name: 'dursley-owlcage', label: 'an empty birdcage' }, [
    shade(70, 192, 60),
    // inside, dim, so bars read
    piece(poly([[34, 70], [106, 70], [114, 160], [26, 160]]), C.night, { edge: 'cut', fibre: false, shadow: false, opacity: 0.22 }),
    ...bars,
    // perch
    ink([[34, 118], [106, 118]], { width: 4, color: C.brown }),
    // dome
    piece(curve([[22, 70], [32, 40], [70, 22], [108, 40], [118, 70], [70, 78]], 2), C.gold),
    piece(curve([[40, 56], [56, 38], [76, 32]], 1), C.goldLight, { edge: 'clean', shadow: false }),
    ink([[70, 22], [70, 74]], { width: 2.5, color: '#a77d28' }),
    // ring
    ink([[70, 22], [70, 14]], { width: 4, color: C.gold }),
    ink([[56, 10], [62, 0], [78, 0], [84, 10], [78, 18], [62, 18], [56, 10]], { width: 4, color: C.gold }),
    // base
    piece(rect(20, 156, 100, 14, 3), C.gold, { edge: 'cut' }),
    piece(rect(26, 170, 88, 8, 2), '#a77d28', { edge: 'cut', fibre: false }),
    // open door on the front
    ink([[58, 110], [58, 156], [82, 156], [82, 110], [58, 110]], { width: 1.8, color: '#a77d28' }),
    dot(78, 134, 2.5, C.goldLight),
  ]);
}

/**
 * Iron bars over a window: 236 × 252, the same size and shape as the
 * `bedroom` backdrop's window frame, so place it at x 862, y 72.
 */
export function windowBars(): string {
  const bars: Node[] = [];
  for (let i = 0; i < 5; i++) {
    const x = 36 + i * 41;
    bars.push(piece(rect(x - 5, 8, 10, 236, 1), '#25252c', { edge: 'cut', shadow: true }));
    bars.push(ink([[x - 2, 14], [x - 2, 236]], { width: 1.8, color: '#5b6378', opacity: 0.7 }));
  }
  const bolts: Node[] = [[10, 10], [226, 10], [10, 242], [226, 242]].map(([x, y]) => dot(x, y, 4.5, '#6b6e7a'));
  return svg({ w: 236, h: 252, name: 'dursley-windowbars', label: 'iron bars' }, [
    // frame
    piece(rect(0, 0, 236, 20, 2), '#2f2f37', { edge: 'cut' }),
    piece(rect(0, 232, 236, 20, 2), '#2f2f37', { edge: 'cut' }),
    piece(rect(0, 0, 20, 252, 2), '#2f2f37', { edge: 'cut' }),
    piece(rect(216, 0, 20, 252, 2), '#2f2f37', { edge: 'cut' }),
    ...bars,
    ...bolts,
    ...bolts.map((_, i) => dot([10, 226, 10, 226][i] - 1.5, [10, 10, 242, 242][i] - 1.5, 1.5, '#a8abb8')),
  ]);
}

/** Planks nailed in a cross, 220 × 120. */
export function planks(): string {
  const nail = (x: number, y: number): Node[] => [dot(x, y, 4, '#3a3a42'), dot(x - 1, y - 1, 1.5, '#b5b1a8')];
  return svg({ w: 220, h: 120, name: 'dursley-planks', label: 'boards nailed in a cross' }, [
    shade(110, 114, 90),
    // back plank, slanted one way
    piece(poly([[10, 22], [34, 8], [212, 92], [188, 110]]), C.tan, { rough: 1.2 }),
    ink([[40, 20], [190, 94]], { width: 1.8, color: C.brownDark, opacity: 0.4 }),
    // flat plank across the middle
    piece(poly([[6, 46], [214, 40], [216, 72], [8, 80]]), C.wood, { rough: 1.2 }),
    ink([[20, 58], [120, 55], [196, 57]], { width: 1.8, color: C.brownDark, opacity: 0.45 }),
    // front plank, slanted the other way
    piece(poly([[184, 6], [210, 20], [36, 108], [10, 94]]), C.sand, { rough: 1.2 }),
    ink([[180, 22], [40, 94]], { width: 1.8, color: C.brownDark, opacity: 0.4 }),
    piece(ellipse(120, 58, 6, 4), C.brownDark, { edge: 'clean', shadow: false, opacity: 0.5 }),
    ...nail(30, 22), ...nail(196, 98), ...nail(110, 60), ...nail(20, 62), ...nail(200, 56), ...nail(194, 18), ...nail(26, 100),
  ]);
}

/** Aunt Petunia's pudding: a tall mountain of cream and sugared violets on a cake stand. 200 × 220. */
export function pudding(): string {
  const violets: Node[] = [[100, 40], [78, 76], [124, 84], [60, 126], [140, 128], [96, 118], [44, 158], [100, 160], [156, 156], [76, 100], [118, 58]]
    .flatMap(([x, y]) => [
      piece(circle(x, y, 7), C.plum, { edge: 'cut', fibre: false, shadow: false }),
      dot(x, y, 2.5, '#c9a8e0'),
    ]);
  return svg({ w: 200, h: 220, name: 'dursley-pudding', label: 'a tall cream pudding' }, [
    shade(100, 212, 86),
    // stand
    piece(rect(88, 176, 24, 30, 2), C.stoneLight, { edge: 'cut' }),
    piece(ellipse(100, 206, 56, 8), C.stoneLight, { edge: 'cut' }),
    piece(ellipse(100, 176, 94, 14), C.white, { edge: 'cut' }),
    // tiers of cream
    piece(curve([[14, 176], [20, 140], [70, 110], [130, 110], [180, 140], [186, 176], [100, 184]], 2), '#fbf4e2'),
    piece(curve([[36, 130], [50, 96], [80, 72], [120, 72], [150, 96], [164, 130], [100, 138]], 2), '#fffaf0'),
    piece(curve([[56, 92], [70, 62], [86, 36], [114, 36], [130, 62], [144, 92], [100, 98]], 2), '#fbf4e2'),
    piece(curve([[80, 54], [90, 30], [100, 6], [110, 30], [120, 54], [100, 60]], 2), '#fffaf0'),
    // swirl shading
    ink([[22, 160], [60, 168], [100, 170], [140, 168], [178, 160]], { width: 3, color: '#e6d8b8', opacity: 0.8 }),
    ink([[44, 118], [80, 124], [120, 124], [156, 118]], { width: 3, color: '#e6d8b8', opacity: 0.8 }),
    ink([[66, 80], [100, 86], [134, 80]], { width: 3, color: '#e6d8b8', opacity: 0.8 }),
    ...violets,
  ]);
}

/** The pudding splatted flat on the floor, 300 × 110. */
export function puddingSplat(): string {
  const blobs: Node[] = [[40, 74, 18], [262, 80, 15], [150, 20, 12], [226, 24, 9], [74, 32, 10]].map(([x, y, r]) =>
    piece(ellipse(x, y, r, r * 0.6), '#fbf4e2'),
  );
  const violets: Node[] = [[90, 52], [130, 64], [176, 48], [210, 66], [60, 72], [150, 38], [240, 56], [112, 80], [196, 84]].flatMap(([x, y]) => [
    piece(circle(x, y, 7), C.plum, { edge: 'cut', fibre: false, shadow: false }),
    dot(x, y, 2.5, '#c9a8e0'),
  ]);
  return svg({ w: 300, h: 110, name: 'dursley-pudding-splat', label: 'a splatted pudding' }, [
    shade(150, 90, 140, 12),
    ...blobs,
    piece(curve([[10, 70], [24, 40], [70, 22], [150, 12], [240, 24], [284, 48], [290, 76], [240, 98], [150, 104], [60, 98]], 2), '#fbf4e2'),
    piece(curve([[50, 66], [90, 38], [160, 30], [220, 44], [250, 68], [200, 86], [120, 90]], 2), '#fffaf0', { edge: 'cut', fibre: false, shadow: false }),
    ink([[40, 78], [90, 86], [150, 90], [220, 84], [262, 74]], { width: 3, color: '#e6d8b8', opacity: 0.8 }),
    ...violets,
  ]);
}

/** A sad little quarter of grapefruit on a plate, 120 × 80. */
export function grapefruit(): string {
  const segs: Node[] = [-1, 0, 1].map((i) => ink([[58, 22], [58 + i * 18, 52]], { width: 2.5, color: '#fff3e0' }));
  return svg({ w: 120, h: 80, name: 'dursley-grapefruit', label: 'a bit of grapefruit' }, [
    shade(60, 72, 50),
    piece(ellipse(60, 62, 54, 10), C.white, { edge: 'cut' }),
    piece(ellipse(60, 60, 36, 6), '#e6e1d4', { edge: 'clean', shadow: false }),
    // the wedge
    piece(curve([[22, 56], [30, 28], [60, 14], [92, 28], [100, 56], [60, 62]], 2), '#ec9a86'),
    piece(curve([[30, 54], [36, 36], [60, 24], [84, 36], [90, 54], [60, 56]], 2), '#f4b3a0', { edge: 'cut', fibre: false, shadow: false }),
    ...segs,
    ink([[22, 56], [30, 28], [60, 14], [92, 28], [100, 56]], { width: 5, color: '#e8c45a' }),
  ]);
}

function toffeeNodes(cx: number, cy: number, s: number, rot: number, col: string): Node[] {
  const t = (x: number, y: number) => `translate(${cx} ${cy}) rotate(${rot}) scale(${s}) translate(${-x} ${-y})`;
  return [
    group({ transform: t(35, 20) }, [
      // twisted ends
      piece(poly([[2, 6], [16, 18], [16, 24], [2, 36]]), col, { edge: 'cut' }),
      piece(poly([[68, 6], [54, 18], [54, 24], [68, 36]]), col, { edge: 'cut' }),
      piece(rect(14, 6, 42, 28, 12), col),
      piece(rect(18, 10, 34, 8, 4), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.4 }),
      dot(35, 24, 6, C.goldLight),
      ink([[26, 24], [44, 24]], { width: 2, color: C.redDark }),
    ]),
  ];
}

/** A Ton-Tongue Toffee in a twist of bright wrapper, 70 × 40. */
export function toffee(): string {
  return svg({ w: 70, h: 40, name: 'dursley-toffee', label: 'a toffee' }, toffeeNodes(35, 20, 1, 0, '#e0457b'));
}

/** A little scatter of Ton-Tongue Toffees, 200 × 70. */
export function toffeePile(): string {
  const cols = ['#e0457b', '#3fa9c9', '#f0b030', '#7fc060', '#e0457b', '#8a5cc0'];
  const at: Array<[number, number, number]> = [[34, 36, -20], [84, 48, 12], [128, 30, 30], [168, 48, -10], [64, 22, 40], [112, 56, -35]];
  return svg({ w: 200, h: 70, name: 'dursley-toffee-pile', label: 'some toffees' }, [
    shade(100, 62, 92, 6),
    ...at.flatMap(([x, y, r], i) => toffeeNodes(x + 6, y, 0.8, r, cols[i])),
  ]);
}

/** A big heap of cream envelopes, as owlPostLetter, 300 × 160. */
export function letterPile(): string {
  const env = (cx: number, cy: number, rot: number, s: number, seal: boolean): Node =>
    group({ transform: `translate(${cx} ${cy}) rotate(${rot}) scale(${s})` }, [
      piece(rect(-50, -32, 100, 64, 2), C.cream),
      piece(poly([[-50, -32], [0, 4], [50, -32]]), C.sand, { edge: 'cut', fibre: false, shadow: false }),
      ink([[-50, 32], [0, -2], [50, 32]], { width: 1.5, color: C.sand }),
      ...(seal ? [dot(0, 4, 8, C.red), ink([[-4, 0], [-2, 8], [0, 3], [2, 8], [4, 0]], { width: 1.5, color: '#f6e3c6' })] : []),
    ]);
  const heap: Array<[number, number, number, number, boolean]> = [
    [60, 122, -8, 1, true], [150, 128, 5, 1, false], [240, 122, 10, 1, true],
    [100, 96, 14, 1, false], [196, 98, -12, 1, true],
    [70, 72, -22, 0.95, false], [150, 78, 4, 1, true], [228, 70, 20, 0.95, false],
    [112, 46, 18, 0.95, true], [190, 44, -14, 0.95, false], [150, 26, 6, 0.9, true],
  ];
  return svg({ w: 300, h: 160, name: 'dursley-letterpile', label: 'a heap of letters' }, [
    shade(150, 152, 138),
    ...heap.map(([x, y, r, s, seal]) => env(x, y, r, s, seal)),
  ]);
}

/** Hagrid's slightly squashed pink birthday cake, 200 × 150. */
export function hagridCake(): string {
  return svg({ w: 200, h: 150, name: 'dursley-hagrid-cake', label: 'a squashed pink cake' }, [
    shade(100, 142, 92),
    // lopsided body
    piece(curve([[8, 134], [10, 80], [22, 54], [110, 44], [180, 52], [192, 84], [190, 134], [100, 142]], 2), '#e88aa6'),
    piece(curve([[8, 134], [10, 112], [100, 120], [190, 112], [190, 134], [100, 142]], 1), '#c96a88', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    // sagging top icing, higher on the right
    piece(curve([[10, 78], [22, 46], [100, 34], [180, 36], [196, 66], [180, 78], [150, 70], [110, 86], [70, 72], [40, 86]], 2), '#f9d6e0'),
    // green squiggles
    ink([[34, 54], [48, 44], [60, 56], [74, 44], [88, 56], [102, 42], [116, 54], [130, 42], [144, 54], [158, 42], [172, 52]], { width: 5, color: '#4fa05a' }),
    ink([[40, 100], [54, 92], [68, 104], [82, 92], [96, 104], [110, 92], [124, 104], [138, 92], [152, 104], [166, 94]], { width: 4.5, color: '#4fa05a' }),
    // a dent and a smear
    piece(ellipse(130, 96, 22, 8, -0.2), '#c96a88', { edge: 'clean', shadow: false, opacity: 0.35 }),
    dot(172, 120, 4, '#f9d6e0'),
  ]);
}

/** A huge shaggy black dog crouched in the shadows, with pale eyes (part `eyes`). 260 × 180. */
export function blackDog(): string {
  const fur = '#16161d';
  return svg({ w: 260, h: 180, name: 'dursley-blackdog', label: 'a big black dog in the shadows' }, [
    piece(ellipse(130, 170, 118, 10), '#000000', { edge: 'clean', shadow: false, opacity: 0.35 }),
    // body, crouched, hunched at the left
    piece(curve([[10, 170], [8, 110], [44, 60], [100, 56], [150, 76], [190, 100], [200, 170], [100, 176]], 2), fur, { rough: 1.6 }),
    // shaggy fringe
    ...[24, 54, 84, 114, 144, 174].map((x) => piece(poly([[x, 150], [x + 10, 176], [x + 22, 148]]), fur, { rough: 1.4, shadow: false })),
    // front legs
    piece(poly([[170, 110], [212, 130], [232, 172], [176, 174]]), '#1d1d26', { rough: 1.5 }),
    // head, low, facing right
    piece(curve([[168, 54], [196, 34], [232, 44], [250, 80], [240, 110], [200, 118], [170, 96]], 2), '#1d1d26', { rough: 1.5 }),
    piece(poly([[184, 44], [180, 14], [204, 36]]), fur, { rough: 1.3 }),
    piece(poly([[212, 40], [226, 14], [232, 44]]), fur, { rough: 1.3 }),
    piece(curve([[232, 86], [254, 90], [256, 104], [236, 108]], 1), '#101016', { rough: 1.2, shadow: false }),
    dot(252, 92, 3, '#3a3a46'),
    // fur flecks so the dark shape has some paper in it
    ink([[40, 90], [70, 76]], { width: 2, color: '#2c2c38', opacity: 0.8 }),
    ink([[90, 110], [130, 96]], { width: 2, color: '#2c2c38', opacity: 0.8 }),
    ink([[140, 130], [176, 120]], { width: 2, color: '#2c2c38', opacity: 0.8 }),
    // gleaming eyes
    group({ part: 'eyes', origin: [218, 68] }, [
      piece(ellipse(206, 68, 14, 9), '#dfe8c8', { edge: 'clean', shadow: false, opacity: 0.25 }),
      piece(ellipse(236, 68, 14, 9), '#dfe8c8', { edge: 'clean', shadow: false, opacity: 0.25 }),
      piece(ellipse(206, 68, 8, 5, 0.2), '#eef3d8', { edge: 'clean', shadow: false }),
      piece(ellipse(234, 68, 8, 5, -0.2), '#eef3d8', { edge: 'clean', shadow: false }),
      dot(207, 68, 2.2, '#16161d'), dot(233, 68, 2.2, '#16161d'),
    ]),
  ]);
}

/** The glass front of a zoo tank, mostly see-through, 520 × 440. */
export function snakeGlass(): string {
  return svg({ w: 520, h: 440, name: 'dursley-snakeglass', label: 'a glass pane' }, [
    piece(rect(10, 10, 500, 420, 6), '#a9dcd8', { edge: 'clean', shadow: false, opacity: 0.35 }),
    // shine streaks
    piece(poly([[60, 30], [100, 30], [40, 200], [10, 200]]), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.45 }),
    piece(poly([[120, 30], [136, 30], [76, 200], [60, 200]]), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(poly([[440, 260], [470, 260], [420, 410], [396, 410]]), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.35 }),
    // thin frame
    ink([[10, 10], [510, 10], [510, 430], [10, 430]], { width: 7, color: '#5b6378', closed: true, opacity: 0.85 }),
    ink([[18, 18], [502, 18], [502, 422], [18, 422]], { width: 1.5, color: '#ffffff', closed: true, opacity: 0.5 }),
  ]);
}

/** A tumbling heap of wrapped presents, 360 × 220. */
export function presentPile(): string {
  const box = (x: number, y: number, w: number, h: number, rot: number, paper: string, ribbon: string): Node =>
    group({ transform: `translate(${x} ${y}) rotate(${rot})` }, [
      piece(rect(-w / 2, -h / 2, w, h, 2), paper, { edge: 'cut' }),
      piece(rect(-w / 2, -h / 2, w, h * 0.16, 1), '#ffffff', { edge: 'clean', shadow: false, opacity: 0.25 }),
      piece(rect(-5, -h / 2, 10, h, 0), ribbon, { edge: 'clean', shadow: false }),
      piece(rect(-w / 2, -4, w, 8, 0), ribbon, { edge: 'clean', shadow: false }),
      piece(poly([[0, -h / 2], [-18, -h / 2 - 16], [-6, -h / 2 + 1]]), ribbon, { edge: 'cut' }),
      piece(poly([[0, -h / 2], [18, -h / 2 - 16], [6, -h / 2 + 1]]), ribbon, { edge: 'cut' }),
      dot(0, -h / 2, 5, ribbon),
    ]);
  const items: Array<[number, number, number, number, number, string, string]> = [
    [60, 186, 90, 60, -4, '#4f78a8', '#f0cd7c'],
    [170, 190, 100, 56, 3, '#d9823b', '#a9413a'],
    [290, 184, 100, 66, -3, '#6f9a5a', '#f7f2e6'],
    [110, 128, 80, 66, 12, '#a9413a', '#f0cd7c'],
    [230, 126, 90, 70, -9, '#6b4f86', '#f0cd7c'],
    [320, 130, 50, 56, 14, '#e8c45a', '#a9413a'],
    [170, 70, 70, 60, 6, '#d99a95', '#4f78a8'],
    [250, 60, 56, 50, -14, '#4c8a8a', '#f7f2e6'],
    [190, 22, 44, 36, 10, '#c4706c', '#f0cd7c'],
  ];
  return svg({ w: 360, h: 220, name: 'dursley-presentpile', label: 'a heap of presents' }, [
    shade(180, 214, 170, 8),
    ...items.map(([x, y, w, h, r, p, rb]) => box(x, y, w, h, r, p, rb)),
  ]);
}

/** A little flowerpot of glittering green Floo powder, 90 × 90. */
export function flooPot(): string {
  const glints: Array<[number, number]> = [[30, 24], [44, 14], [58, 22], [70, 12], [38, 34], [64, 34], [50, 28]];
  return svg({ w: 90, h: 90, name: 'dursley-floopot', label: 'a pot of green powder' }, [
    shade(45, 84, 34, 5),
    // pot
    piece(poly([[16, 36], [74, 36], [66, 82], [24, 82]]), C.ginger),
    piece(rect(10, 28, 70, 14, 2), C.rust, { edge: 'cut' }),
    ink([[26, 56], [64, 56]], { width: 2, color: C.brownDark, opacity: 0.4 }),
    // heap of powder
    piece(curve([[14, 30], [24, 14], [45, 6], [66, 14], [76, 30], [45, 34]], 2), '#3fcf7c'),
    piece(curve([[26, 26], [34, 16], [50, 14]], 1), '#9af0b8', { edge: 'clean', shadow: false }),
    ...glints.map(([x, y], i) => dot(x, y, 1.6 + (i % 2), '#e8fff0', 0.95)),
  ]);
}
