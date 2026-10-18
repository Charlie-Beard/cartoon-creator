/** The Gryffindor stand at the Quidditch final, close up. */
import { C } from '../../../art/palette';
import { band, circle, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

const SKY = '#8ec5e6';

function cloud(x: number, y: number, s: number): Node[] {
  const o = { edge: 'cut', fibre: false, shadow: false, opacity: 0.92 } as const;
  return [
    piece(ellipse(x, y, 90 * s, 28 * s), C.white, o),
    piece(ellipse(x - 40 * s, y - 18 * s, 44 * s, 26 * s), C.white, o),
    piece(ellipse(x + 20 * s, y - 26 * s, 50 * s, 32 * s), C.white, o),
  ];
}

/** Far-off goal hoop, small and gold, on a thin pole. */
function farHoop(x: number, top: number, r: number): Node[] {
  return [
    piece(rect(x - 3, top + r, 6, 230 - top - r), C.tan, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(x, top + r, r + 4), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(x, top + r, r - 3), SKY, { edge: 'clean', fibre: false, shadow: false }),
  ];
}

/** The Gryffindor stand by day: crowd on wooden tiers behind a rail. Floor at y 660. */
export function stands(): string {
  const r = rng(717);
  const nodes: Node[] = [
    piece(rect(-20, -20, 1220, 860), SKY, { edge: 'clean', shadow: false }),
    piece(rect(-20, 120, 1220, 140), '#a9d3ec', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ...cloud(170, 70, 1),
    ...cloud(560, 44, 0.8),
    ...cloud(760, 120, 0.7),
    ...cloud(1090, 36, 0.7),
    ...farHoop(940, 40, 34),
    ...farHoop(1060, 90, 40),
  ];

  // The tiers: a dark wooden back wall, then five benches rising behind.
  nodes.push(piece(rect(-20, 214, 1220, 380), C.brownDark, { edge: 'clean', shadow: false }));
  const tiers = [244, 316, 388, 460, 532];
  const WOODS = ['#8a5e3c', '#946540', '#9c6d46', '#a47349', '#ad7a4e'];
  const scarf = [C.red, C.gold, C.red, C.goldLight, C.redDark];
  const skins = [C.skin, C.skinShade, '#c69470', '#8a5a3b', C.skinPale];
  const hair = [C.brownDark, C.ink, C.ginger, C.tan, C.goldLight, C.charcoal];

  tiers.forEach((ty, i) => {
    // Crowd first (heads and scarves), then the bench front hides their knees.
    const step = 46 + (i % 2) * 4;
    for (let x = 18 + (i % 2) * 22; x < 1180; x += step) {
      const px = x + (r() - 0.5) * 10;
      const py = ty + (r() - 0.5) * 6;
      const col = scarf[Math.floor(r() * scarf.length)];
      // Little body in a Gryffindor scarf.
      nodes.push(piece(rect(px - 17, py + 6, 34, 48, 8), r() > 0.5 ? C.charcoal : C.slate, { edge: 'cut', fibre: false, shadow: false }));
      nodes.push(piece(rect(px - 18, py + 8, 36, 10, 4), col, { edge: 'cut', fibre: false, shadow: false }));
      nodes.push(piece(rect(px - 3, py + 12, 8, 24), col === C.gold || col === C.goldLight ? C.red : C.gold, { edge: 'cut', fibre: false, shadow: false }));
      // Head with hair, two dot eyes and a smile.
      nodes.push(piece(circle(px, py - 6, 14), skins[Math.floor(r() * skins.length)], { edge: 'cut', fibre: false, shadow: false }));
      nodes.push(piece(ellipse(px, py - 15, 13, 7), hair[Math.floor(r() * hair.length)], { edge: 'cut', fibre: false, shadow: false }));
      nodes.push(dot(px - 5, py - 6, 1.7, C.ink));
      nodes.push(dot(px + 5, py - 6, 1.7, C.ink));
      nodes.push(ink([[px - 4, py], [px, py + 3], [px + 4, py]], { width: 1.6, color: C.ink }));
      // Some wave a hand, some hold a flag.
      const k = r();
      if (k < 0.22) {
        const side = r() > 0.5 ? 1 : -1;
        nodes.push(ink([[px + side * 14, py + 20], [px + side * 24, py - 12], [px + side * 22, py - 30]], { width: 6, color: C.skinShade }));
        nodes.push(dot(px + side * 22, py - 34, 6, C.skin));
      } else if (k < 0.36) {
        const side = r() > 0.5 ? 1 : -1;
        const fx = px + side * 20;
        nodes.push(ink([[fx, py + 24], [fx, py - 52]], { width: 4, color: C.brownDark }));
        nodes.push(piece(poly([[fx, py - 52], [fx + 34, py - 42], [fx, py - 30]]), r() > 0.5 ? C.red : C.gold, { edge: 'cut', fibre: false, shadow: false }));
      }
    }
    // The bench: a plank face across the front of the tier.
    nodes.push(piece(rect(-20, ty + 38, 1220, 34), WOODS[i], { edge: 'cut', fibre: false, shadow: i > 0 }));
    nodes.push(ink([[-20, ty + 54], [1200, ty + 54]], { width: 2, color: C.brownDark, opacity: 0.35 }));
  });

  // Bunting along the top of the stand.
  nodes.push(ink([[-10, 214], [300, 236], [600, 214], [900, 236], [1190, 214]], { width: 3, color: C.brownDark }));
  const bunt = [C.red, C.gold, C.red, C.gold];
  for (let b = 0; b < 16; b++) {
    const x = 20 + b * 74;
    const y = 214 + Math.sin(((x % 600) / 600) * Math.PI) * 18 * (x < 600 ? 1 : 1);
    nodes.push(piece(poly([[x - 12, y], [x + 12, y], [x, y + 26]]), bunt[b % 4], { edge: 'cut', fibre: false, shadow: false }));
  }

  // The wooden rail across the front, with posts.
  nodes.push(piece(rect(-20, 590, 1220, 20), C.wood, { edge: 'cut' }));
  for (let x = 24; x < 1180; x += 118) nodes.push(piece(rect(x - 9, 544, 18, 70, 3), C.brown, { edge: 'cut', fibre: false }));
  nodes.push(piece(rect(-20, 552, 1220, 22, 4), '#b88556', { edge: 'cut' }));
  nodes.push(piece(rect(-20, 556, 1220, 5), C.goldLight, { edge: 'clean', fibre: false, shadow: false, opacity: 0.5 }));

  // The front floor of boards, calm below y 690.
  nodes.push(piece(rect(-20, 612, 1220, 240), '#b58a5c', { edge: 'clean', shadow: false }));
  nodes.push(piece(rect(-20, 612, 1220, 34), '#8f6a44', { edge: 'clean', shadow: false, opacity: 0.45 }));
  for (const y of [652, 706, 758, 808]) {
    nodes.push(ink([[-20, y], [1200, y + 2]], { width: 3, color: C.brownDark, opacity: 0.28 }));
  }
  [[200, 620, 652], [620, 656, 706], [940, 620, 652], [380, 706, 758], [800, 706, 758], [150, 758, 808], [1020, 758, 808]].forEach(([x, a, b]) => {
    nodes.push(ink([[x, a], [x, b]], { width: 2.5, color: C.brownDark, opacity: 0.22 }));
  });
  nodes.push(piece(band([[-20, 614], [1200, 614]], 6), C.brownDark, { edge: 'clean', fibre: false, shadow: false, opacity: 0.3 }));

  return svg({ w: 1180, h: 820, name: 'b3c-quidditch-stands', boil: false, className: 'backdrop' }, nodes);
}
