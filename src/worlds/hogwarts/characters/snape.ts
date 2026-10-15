/**
 * Professor Snape: new for the cartoon world (Wizard Words never needed him).
 * Drawn with the same portrait template as everyone else: sallow skin, long
 * black hair framing the face, a long nose, a thin flat mouth, and a plain
 * black robe buttoned up to a high collar. He looks stern, never cruel.
 */
import { curve, ellipse, ink, piece, poly, band, circle, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;

export function snape(): string {
  const hair = '#1e1b22';
  const robe: Node[] = [
    piece(curve([[40, 345], [52, 262], [104, 230], [150, 226], [196, 230], [248, 262], [260, 345]], 2), '#25222b'),
    // the high stand-up collar, and a line of tiny buttons
    piece(poly([[112, 232], [124, 214], [150, 238], [176, 214], [188, 232], [150, 262]]), '#17151c', { fibre: false }),
    ...[262, 280, 298, 316, 334].map((y) => piece(circle(150, y, 3.5), '#4a4654', { edge: 'clean', shadow: false })),
    ink([[150, 262], [150, 345]], { width: 2, color: '#4a4654', opacity: 0.7 }),
  ];
  return person({
    name: 'snape',
    label: 'Professor Snape',
    skin: '#e4d5bd',
    eyes: '#2b2630',
    eyeStyle: 'narrow',
    face: [54, 72],
    back: [
      piece(ellipse(cx, cy - 22, 70, 62), hair),
      piece(band([[cx - 58, cy - 20], [cx - 70, cy + 50], [cx - 60, cy + 104]], 30), hair),
      piece(band([[cx + 58, cy - 20], [cx + 70, cy + 50], [cx + 60, cy + 104]], 30), hair),
    ],
    front: [
      // a centre parting, the hair falling to either side of the face
      piece(curve([[cx - 62, cy + 8], [cx - 58, cy - 62], [cx - 4, cy - 82], [cx + 4, cy - 60], [cx - 20, cy - 32], [cx - 40, cy + 6]], 2), hair),
      piece(curve([[cx + 62, cy + 8], [cx + 58, cy - 62], [cx + 4, cy - 82], [cx - 4, cy - 60], [cx + 20, cy - 32], [cx + 40, cy + 6]], 2), hair),
    ],
    body: robe,
    tie: null,
    brows: 'cross',
    browColor: hair,
    nose: 'long',
    mouth: 'flat',
    blush: false,
  });
}
