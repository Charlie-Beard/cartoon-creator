/** Props for Gryffindor Wins the Cup: the fake Dementors (boys in black robes) and the red banner. */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, group, piece, poly, rect, svg, type Node } from '../../../art/paper';

const ROBE = '#26242c';
const ROBE_MID = '#34313c';
const ROBE_LIGHT = '#454150';

/** A tall hooded figure in a ragged black cloak, 220 × 420. It is really three boys; `hood` droops from the neck. */
export function fakeDementor(): string {
  const hood = group({ part: 'hood', origin: [110, 96] }, [
    piece(curve([[110, 14], [150, 28], [166, 80], [156, 112], [110, 118], [64, 112], [54, 80], [70, 28]], 3), ROBE_MID, { edge: 'cut' }),
    // Deep, empty dark opening: just darkness, no face.
    piece(ellipse(110, 70, 36, 44), '#0d0c11', { edge: 'clean', fibre: false, shadow: false }),
    piece(ellipse(110, 82, 28, 32), '#050408', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    piece(curve([[70, 40], [90, 24], [110, 20]], 2), ROBE_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
  ]);
  return svg({ w: 220, h: 420, name: 'b3-fake-dementor', label: 'a tall hooded figure in a ragged black cloak' }, [
    // The tall robe, a little lumpy and wobbly.
    piece(curve([[90, 104], [60, 190], [48, 270], [24, 340], [10, 408], [60, 400], [90, 414], [128, 400], [160, 412], [210, 406], [196, 330], [172, 262], [160, 190], [130, 104]], 2), ROBE, { edge: 'torn' }),
    // Folds.
    piece(poly([[92, 150], [108, 150], [102, 410], [78, 404]]), ROBE_MID, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    piece(poly([[130, 160], [146, 180], [160, 404], [136, 410]]), ROBE_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    // A knee poking out on the left, and a lump of shoulder.
    piece(ellipse(52, 300, 22, 30, -0.4), ROBE_MID, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(ellipse(158, 214, 20, 26, 0.3), ROBE_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    // Tattered hem: ragged points along the bottom.
    piece(poly([[10, 400], [24, 420], [38, 402], [52, 418], [66, 400], [84, 420], [100, 404], [118, 420], [134, 402], [152, 418], [168, 402], [186, 420], [210, 400], [210, 396], [10, 396]]), ROBE, { edge: 'cut', fibre: false, shadow: false }),
    // A trainer-like shoe peeping from the hem.
    piece(curve([[116, 400], [116, 414], [146, 418], [158, 412], [154, 404]], 2), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(116, 414, 42, 5, 2), C.red, { edge: 'clean', fibre: false, shadow: false }),
    ink([[130, 406], [146, 408]], { width: 2, color: C.red }),
    // Sleeves hanging, ragged, with no hands.
    piece(curve([[62, 140], [30, 200], [20, 280], [34, 316], [54, 300], [60, 230], [84, 160]], 2), ROBE_MID, { edge: 'torn' }),
    piece(poly([[20, 280], [26, 306], [34, 290], [42, 316], [50, 296], [56, 310], [56, 298], [34, 280]]), ROBE_MID, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[160, 140], [192, 200], [200, 280], [186, 316], [166, 300], [160, 230], [138, 160]], 2), ROBE_MID, { edge: 'torn' }),
    piece(poly([[200, 280], [194, 306], [186, 290], [178, 316], [170, 296], [164, 310], [164, 298], [186, 280]]), ROBE_MID, { edge: 'cut', fibre: false, shadow: false }),
    // Shoulders under the hood.
    piece(curve([[50, 150], [70, 108], [110, 96], [150, 108], [170, 150], [110, 140]], 2), ROBE_MID, { edge: 'torn' }),
    hood,
  ]);
}

/** The same robes in a big tangled heap on the grass, 360 × 160, flat bottom. */
export function robeHeap(): string {
  const lump = (cx: number, cy: number, rx: number, ry: number, fill: string, rot = 0): Node =>
    piece(ellipse(cx, cy, rx, ry, rot), fill, { edge: 'torn' });
  return svg({ w: 360, h: 160, name: 'b3-robe-heap', label: 'a heap of black robes' }, [
    piece(ellipse(180, 152, 170, 12), '#2f4a2c', { edge: 'clean', fibre: false, shadow: false, opacity: 0.4 }),
    piece(curve([[8, 156], [20, 100], [80, 60], [150, 30], [220, 36], [290, 70], [346, 110], [352, 156]], 3), ROBE, { edge: 'torn' }),
    lump(90, 112, 76, 40, ROBE_MID, -0.3),
    lump(250, 106, 80, 44, ROBE_MID, 0.3),
    lump(176, 76, 70, 38, ROBE_LIGHT, 0.1),
    // Tangled folds.
    piece(poly([[40, 150], [70, 90], [96, 96], [78, 152]]), ROBE, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(poly([[210, 150], [236, 70], [262, 76], [248, 152]]), ROBE, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // A hood flopped over on the left, empty.
    piece(curve([[110, 108], [130, 76], [172, 70], [196, 96], [180, 132], [130, 134]], 3), ROBE_LIGHT, { edge: 'torn' }),
    piece(ellipse(158, 102, 22, 20, 0.3), '#0d0c11', { edge: 'clean', fibre: false, shadow: false }),
    // A green-and-silver sleeve sticking out on the right.
    piece(curve([[280, 90], [330, 72], [356, 82], [352, 106], [312, 120], [284, 118]], 2), C.greenDeep, { edge: 'cut' }),
    piece(poly([[318, 76], [334, 72], [342, 112], [326, 116]]), C.grey, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[340, 78], [352, 82], [350, 106], [344, 110]]), C.grey, { edge: 'cut', fibre: false, shadow: false }),
    // A trainer-like shoe poking up.
    piece(curve([[216, 54], [226, 18], [248, 14], [270, 30], [276, 52]], 2), C.cream, { edge: 'cut' }),
    piece(rect(216, 48, 60, 8, 3), C.red, { edge: 'clean', fibre: false, shadow: false }),
    ink([[234, 24], [250, 30]], { width: 2, color: C.red }),
    ink([[236, 36], [254, 42]], { width: 2, color: C.red }),
  ]);
}

/** A big red Gryffindor banner with a friendly gold lion, held on two poles, 420 × 220. `cloth` waves from the top centre. */
export function gryffindorBanner(): string {
  const cloth = group({ part: 'cloth', origin: [210, 30] }, [
    piece(rect(30, 30, 360, 170, 4), C.red, { edge: 'cut' }),
    // Gold border and fringe.
    piece(rect(40, 40, 340, 6, 2), C.gold, { edge: 'clean', fibre: false, shadow: false }),
    piece(rect(40, 176, 340, 6, 2), C.gold, { edge: 'clean', fibre: false, shadow: false }),
    ...Array.from({ length: 20 }, (_, i) => piece(rect(36 + i * 18, 200, 6, 18, 2), C.gold, { edge: 'cut', fibre: false, shadow: false })),
    // The lion: mane of gold points, a round face, ears, muzzle, nose, eyes, smile.
    piece(poly(Array.from({ length: 24 }, (_, i): [number, number] => {
      const a = (i / 24) * Math.PI * 2;
      const rr = i % 2 ? 62 : 82;
      return [210 + Math.cos(a) * rr, 112 + Math.sin(a) * rr * 0.88];
    })), C.gold, { edge: 'cut' }),
    piece(circle(210, 112, 50), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(176, 74, 14), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(244, 74, 14), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(210, 128, 26, 20), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[198, 112], [222, 112], [210, 126]]), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    dot(192, 100, 5, C.ink),
    dot(228, 100, 5, C.ink),
    ink([[210, 126], [210, 132]], { width: 3, color: C.brownDark }),
    ink([[194, 132], [202, 140], [210, 132], [218, 140], [226, 132]], { width: 3, color: C.brownDark }),
  ]);
  return svg({ w: 420, h: 220, name: 'b3-gryffindor-banner', label: 'a red Gryffindor banner with a gold lion' }, [
    piece(rect(24, 6, 6, 214, 2), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(390, 6, 6, 214, 2), C.brown, { edge: 'cut', fibre: false }),
    piece(rect(24, 20, 372, 8, 3), C.brownDark, { edge: 'cut', fibre: false }),
    piece(circle(27, 6, 6), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(393, 6, 6), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    cloth,
  ]);
}
