/** A huge ice-cream sundae (made for "The Book That Bites"). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

/**
 * A huge sundae in a tall glass, 140 × 200. A glass goblet with a stem and a
 * flat foot (bottom edge y 200 is flat, so it stands on a table), pink,
 * cream and brown layers showing through the glass, a strawberry, a
 * chocolate and a vanilla scoop piled on top with a swirl of cream, nuts
 * and sprinkles, and a long spoon leaning out at the top right.
 *
 * Part `cherry`: the cherry on the very top (about x 56 to 84, y 0 to 30).
 * Origin [70, 30] is where its stalk meets the cream: wobble or bounce it
 * from there.
 */
export function sundae(): string {
  const r = rng(77);
  const nodes: Node[] = [];
  // the long spoon, behind the scoops
  nodes.push(
    ink([[118, 150], [112, 70], [124, 26]], { width: 5, color: '#b9bcc4' }),
    piece(ellipse(126, 20, 9, 14, 0.25), '#c9ccd4', { edge: 'cut', fibre: false }),
  );
  // the glass: foot, stem, bowl
  nodes.push(
    piece(ellipse(70, 192, 42, 8), '#dcebe9', { edge: 'cut', opacity: 0.95 }),
    piece(rect(64, 146, 12, 46, 3), '#dcebe9', { edge: 'cut', fibre: false, opacity: 0.95 }),
    piece(curve([[16, 100], [20, 130], [46, 150], [70, 154], [94, 150], [120, 130], [124, 100]], 2), '#dcebe9', { edge: 'cut', opacity: 0.95 }),
    // coloured layers inside the glass
    piece(poly([[26, 128], [114, 128], [96, 146], [70, 150], [44, 146]]), '#7b4a33', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[20, 112], [120, 112], [114, 128], [26, 128]]), '#f7ecc0', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[17, 100], [123, 100], [120, 112], [20, 112]]), '#e58aa0', { edge: 'cut', fibre: false, shadow: false }),
    // a glassy shine
    piece(rect(26, 106, 6, 30, 3), '#ffffff', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    piece(rect(12, 96, 116, 8, 4), '#eef6f4', { edge: 'cut', fibre: false, shadow: false }),
  );
  // scoops piled above the rim
  nodes.push(
    piece(circle(38, 88, 25), '#e58aa0'),
    piece(circle(102, 88, 25), '#7b4a33'),
    piece(circle(70, 66, 28), '#f7ecc0'),
    dot(60, 56, 6, '#ffffff', 0.5),
    dot(30, 80, 5, '#f7c6d2', 0.7),
    dot(96, 80, 5, '#a8704f', 0.7),
    // drippy edges
    piece(curve([[14, 92], [20, 100], [24, 112], [30, 98]], 2), '#e58aa0', { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[116, 94], [112, 108], [108, 118], [102, 98]], 2), '#7b4a33', { edge: 'cut', fibre: false, shadow: false }),
  );
  // a swirl of cream on top
  nodes.push(
    piece(ellipse(70, 42, 24, 9), '#fbf6ea', { edge: 'cut' }),
    piece(ellipse(70, 34, 17, 8), '#fbf6ea', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(70, 27, 10, 6), '#fbf6ea', { edge: 'cut', fibre: false, shadow: false }),
  );
  // sprinkles and chopped nuts
  const sprinkle = ['#d4504f', '#4f78a8', '#f0d25a', '#6fae6a', '#c9a8e0'];
  for (let i = 0; i < 16; i++) {
    const x = 30 + r() * 80;
    const y = 52 + r() * 36;
    nodes.push(ink([[x, y], [x + 5, y + 2 - r() * 4]], { width: 2.5, color: sprinkle[i % 5] }));
  }
  for (let i = 0; i < 7; i++) nodes.push(piece(ellipse(34 + r() * 74, 38 + r() * 14, 3.5, 2.5, r() * 3), '#c9a06a', { edge: 'cut', fibre: false, shadow: false }));
  // the cherry
  nodes.push(
    group({ part: 'cherry', origin: [70, 30] }, [
      ink([[70, 30], [74, 12], [82, 4]], { width: 2.5, color: C.greenDark }),
      piece(circle(68, 22, 10), '#c8392f'),
      dot(65, 18, 3, '#ffffff', 0.7),
    ]),
  );
  return svg({ w: 140, h: 200, name: 'hogwarts-sundae', label: 'a huge ice-cream sundae' }, nodes);
}
