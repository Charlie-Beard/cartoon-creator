/**
 * The tabby cat (Professor McGonagall as an Animagus, new for the cartoons).
 *
 * Built the way Crookshanks is (torn fluff for fur, a flat face on top), but
 * sitting bolt upright, front view, stiff as a poker. The hint is the
 * markings: a dark square round each eye, like her square glasses.
 *
 * Layout in the 300 × 340 box: the paws end at y 330 (that is where she sits
 * on a wall), the chest runs up to the head, and the tail curls round
 * beside her on the right. The face sits inside 78 62 144 144.
 */
import { C } from '../../../art/palette';
import { band, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';
import { fluff } from './heroes';

const FUR = '#a89a88';
const FUR_LIGHT = '#d6cbb9';
const STRIPE = '#5a4c40';
const SPEC = '#3a3028';

/** A closed square of ink: one lens of the spectacles marking. */
const lens = (x: number, y: number, s: number): Node =>
  ink([[x, y], [x + s, y], [x + s, y + s], [x, y + s]], { width: 4.5, color: SPEC, closed: true, wobble: 0.8 });

export function tabbyCat(): string {
  const stripes = (list: Pt[][], w = 5): Node[] => list.map((p) => ink(p, { width: w, color: STRIPE, wobble: 0.8 }));
  // Eyes at (122, 130) and (178, 130); lenses are 42 wide round them.
  const eye = (x: number): Node[] => [
    piece(ellipse(x, 130, 13, 11), C.yellow, { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, 130, 3.8, 10), C.ink, { edge: 'clean', fibre: false, shadow: false }),
    dot(x - 4, 125, 2.2, C.white),
  ];
  return svg({ w: 300, h: 340, name: 'hogwarts-tabbyCat', label: 'The tabby cat', className: 'portrait' }, [
    piece(ellipse(150, 330, 100, 12), 'rgba(40,25,10,0.16)', { edge: 'cut', fibre: false, shadow: false }),
    // the tail, curling round beside her
    group({ part: 'tail', origin: [200, 318] }, [
      piece(band([[200, 322], [246, 330], [276, 304], [276, 264], [256, 244]], 22), FUR, { fibre: FUR_LIGHT }),
      ...stripes([[[236, 322], [236, 336]], [[262, 318], [272, 330]], [[270, 286], [286, 288]], [[266, 258], [282, 250]]], 4),
      piece(ellipse(256, 246, 11, 10), STRIPE, { edge: 'torn', fibre: false }),
    ]),
    // the body: narrow chest, neat haunches, two straight front legs
    fluff([[96, 330], [92, 270], [112, 214], [150, 196], [188, 214], [208, 270], [204, 330]], FUR, 8),
    piece(curve([[120, 330], [118, 262], [128, 222], [150, 214], [172, 222], [182, 262], [180, 330]], 2), FUR_LIGHT, { fibre: false }),
    ...stripes([
      [[100, 250], [116, 256]], [[98, 276], [116, 280]], [[100, 302], [114, 304]],
      [[200, 250], [184, 256]], [[202, 276], [184, 280]], [[200, 302], [186, 304]],
    ]),
    // front legs and paws, side by side
    ink([[150, 262], [150, 326]], { width: 3, color: FUR, opacity: 0.9 }),
    ...[128, 172].map((x) => piece(ellipse(x, 322, 20, 11), FUR_LIGHT, { fibre: false })),
    ...[128, 172].map((x) => ink([[x - 4, 316], [x - 4, 328]], { width: 2, color: STRIPE })),
    ...[128, 172].map((x) => ink([[x + 6, 316], [x + 6, 328]], { width: 2, color: STRIPE })),
    group({ part: 'figure' }, []),
    group({ part: 'head', origin: [150, 206] }, [
      piece(poly([[84, 118], [86, 58], [130, 90]]), FUR),
      piece(poly([[216, 118], [214, 58], [170, 90]]), FUR),
      piece(poly([[94, 104], [95, 74], [118, 92]]), C.pink, { edge: 'cut', fibre: false, shadow: false }),
      piece(poly([[206, 104], [205, 74], [182, 92]]), C.pink, { edge: 'cut', fibre: false, shadow: false }),
      fluff([[150, 70], [196, 82], [220, 124], [212, 168], [180, 198], [120, 198], [88, 168], [80, 124], [104, 82]], FUR, 7),
      // pale muzzle
      piece(ellipse(150, 168, 34, 24), FUR_LIGHT, { fibre: false, shadow: false }),
      // the tabby "M" on the brow and stripes down the cheeks
      ...stripes([[[132, 84], [136, 102]], [[150, 80], [150, 100]], [[168, 84], [164, 102]]], 5),
      ...stripes([[[84, 140], [100, 144]], [[84, 158], [102, 158]], [[216, 140], [200, 144]], [[216, 158], [198, 158]]], 4),
      // square markings round the eyes, like spectacles
      lens(101, 109, 42),
      lens(157, 109, 42),
      ink([[143, 124], [157, 124]], { width: 4, color: SPEC }),
      ...eye(122),
      ...eye(178),
      group({ part: 'lids', opacity: 0 }, [
        ...[122, 178].map((x) => piece(ellipse(x, 130, 15, 13), FUR, { edge: 'cut', fibre: false, shadow: false })),
        ...[122, 178].map((x) => ink([[x - 12, 132], [x, 137], [x + 12, 132]], { width: 3, color: C.ink })),
      ]),
      piece(poly([[141, 156], [159, 156], [150, 167]]), C.rose, { edge: 'cut', fibre: false, shadow: false }),
      group({ part: 'mouth' }, [
        ink([[150, 167], [150, 174]], { width: 2.5 }),
        ink([[136, 178], [150, 173], [164, 178]], { width: 3 }),
      ]),
      group({ part: 'mouthOpen', opacity: 0 }, [
        piece(ellipse(150, 180, 10, 11), C.redDark, { edge: 'clean', fibre: false, shadow: false }),
        piece(ellipse(150, 186, 6, 5), C.pink, { edge: 'clean', fibre: false, shadow: false }),
        ink([[150, 167], [150, 172]], { width: 2.5 }),
      ]),
      ink([[116, 168], [66, 160]], { width: 2, color: C.white }),
      ink([[116, 174], [68, 178]], { width: 2, color: C.white }),
      ink([[184, 168], [234, 160]], { width: 2, color: C.white }),
      ink([[184, 174], [232, 178]], { width: 2, color: C.white }),
    ]),
  ]);
}
