/**
 * Mrs Weasley, Ron's mum: plump and kind, a round rosy face, ginger hair
 * pinned in a messy bun with strands escaping, a plum cardigan and a
 * flowery apron, a wand in her hand. Built on the shared `person()`
 * template like the other portraits, so she talks, blinks and holds her
 * wand (`wand` part) the same way.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person, wand } from './people';

const [cx, cy] = HEAD;

// The Weasley ginger, a touch deeper than Ron's so a grown-up reads at once.
const HAIR = '#c0501f';
const HAIR_SHADE = '#9c3d18';
const CARDIGAN = '#7a4f86';
const APRON = '#f1e4c4';

/** A small paper flower: five petals round a gold middle. */
function flower(x: number, y: number, petal: string, r = 6): Node[] {
  return [
    ...[0, 72, 144, 216, 288].map((a) => {
      const rad = (a * Math.PI) / 180;
      return piece(circle(x + Math.cos(rad) * r, y + Math.sin(rad) * r, r * 0.7), petal, { edge: 'clean', fibre: false, shadow: false });
    }),
    piece(circle(x, y, r * 0.6), C.gold, { edge: 'clean', fibre: false, shadow: false }),
  ];
}

export function mrsWeasley(): string {
  const body: Node[] = [
    // a wide, comfortable cardigan
    piece(curve([[22, 345], [36, 266], [96, 232], [150, 228], [204, 232], [264, 266], [278, 345]], 2), CARDIGAN),
    // cream blouse collar showing at the neck
    piece(poly([[120, 230], [150, 262], [180, 230], [170, 222], [150, 244], [130, 222]]), C.white, { fibre: false }),
    // the apron: straps over the shoulders and a bib down the front
    piece(poly([[112, 236], [126, 230], [134, 262], [118, 262]]), APRON, { fibre: false }),
    piece(poly([[188, 236], [174, 230], [166, 262], [182, 262]]), APRON, { fibre: false }),
    piece(curve([[100, 262], [150, 270], [200, 262], [224, 345], [76, 345]], 1), APRON),
    // a little frill along the top of the bib
    ink([[104, 264], [150, 272], [196, 264]], { width: 3, color: C.pink }),
    ...flower(122, 304, C.pink, 7),
    ...flower(176, 296, C.rose, 7),
    ...flower(150, 328, C.pink, 6),
    ...flower(110, 332, C.goldLight, 5),
    ...flower(194, 332, C.goldLight, 5),
  ];

  return person({
    name: 'mrsWeasley',
    label: 'Mrs Weasley',
    skin: C.skin,
    eyes: C.brown,
    face: [70, 72],
    freckles: true,
    back: [
      // the bun, with a curl in it
      piece(circle(cx, cy - 98, 32), HAIR),
      piece(circle(cx + 8, cy - 100, 18), HAIR_SHADE, { shadow: false, opacity: 0.8 }),
      ink([[cx - 14, cy - 98], [cx, cy - 112], [cx + 18, cy - 102], [cx + 10, cy - 88], [cx - 2, cy - 94]], { width: 3, color: HAIR }),
      // a fat round halo of hair behind the head
      piece(ellipse(cx, cy - 22, 84, 70), HAIR),
    ],
    front: [
      // fringe pinned back, parted in a soft swoop
      piece(curve([[cx - 74, cy - 4], [cx - 70, cy - 60], [cx - 14, cy - 88], [cx + 50, cy - 80], [cx + 74, cy - 8], [cx + 50, cy - 44], [cx + 6, cy - 54], [cx - 44, cy - 40]], 2), HAIR),
      // the pin
      piece(circle(cx + 40, cy - 66, 5), C.gold, { edge: 'cut', shadow: false }),
      // loose strands escaping at the sides
      ink([[cx - 62, cy - 52], [cx - 84, cy - 26], [cx - 78, cy + 8], [cx - 86, cy + 38]], { width: 4, color: HAIR }),
      ink([[cx + 64, cy - 52], [cx + 86, cy - 22], [cx + 78, cy + 14], [cx + 88, cy + 42]], { width: 4, color: HAIR }),
      ink([[cx - 8, cy - 80], [cx - 22, cy - 100], [cx - 12, cy - 118]], { width: 3, color: HAIR }),
      dot(cx - 12, cy - 118, 3, HAIR),
    ],
    browColor: HAIR_SHADE,
    mouth: 'smile',
    tie: null,
    extra: [wand(238, 318, C.brownDark)],
    body,
  });
}
