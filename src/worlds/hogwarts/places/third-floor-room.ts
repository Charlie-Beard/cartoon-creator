import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/**
 * The forbidden room off the third-floor corridor at night, 1180 × 820: the
 * dim stone room where Fluffy lives.
 *
 * Dim blue-grey stone walls in rough courses of blocks fill the back. At the
 * far left (x 20 to 220, y 240 to 660) a heavy dark wooden door, closed, in a
 * stone arch with iron bands and a ring handle: where the friends come in. A
 * wall torch burns just to its right (x 262 to 310, y 300 to 420) and throws
 * a warm glow on the nearby stones. One high arched window with iron bars
 * (x 800 to 920, y 70 to 300) lets in cool blue moonlight, which falls in a
 * pale slanting shaft across the right-hand wall and floor. A few dusty
 * cobwebs hang in the corners and over the door. The floor is bare flagstones
 * (ground line y 660).
 *
 * The right two thirds (x 450 to 1180) are open wall and floor, for a huge
 * dog to lie in. The patch of floor around x 360 to 620, y 600 to 680 is left
 * plain and clear for a trapdoor prop. The bottom band (y 690 to 820) is calm
 * dark flagstone.
 */
export function thirdFloorRoom(): string {
  const r = rng(913);

  // ---- the stone walls: rows of uneven blocks, drawn as faint mortar lines
  const mortar: Node[] = [];
  for (let row = 0; row < 11; row++) {
    const y = 20 + row * 58;
    mortar.push(ink([[-10, y], [1190, y + (row % 2 ? 2 : -2)]], { width: 2.4, color: '#2f3342', opacity: 0.55 }));
    let x = row % 2 ? 30 : -30;
    while (x < 1200) {
      x += 90 + r() * 70;
      mortar.push(ink([[x, y], [x + (r() - 0.5) * 6, y + 58]], { width: 2.2, color: '#2f3342', opacity: 0.45 }));
    }
  }
  // a few lighter, chipped blocks so the wall isn't flat
  const blocks: Node[] = [];
  for (let i = 0; i < 16; i++) {
    const x = 240 + r() * 920;
    const y = 30 + Math.floor(r() * 9) * 58 + 6;
    if (x > 780 && x < 940 && y < 320) continue; // keep clear of the window
    blocks.push(piece(rect(x, y, 70 + r() * 50, 44, 5), r() > 0.5 ? '#5a5f70' : '#454a5a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }));
  }

  // ---- a cobweb in a corner: spokes from (x, y) and sagging threads between them
  const web = (x: number, y: number, dirX: number, dirY: number, len: number): Node[] => {
    const out: Node[] = [];
    const spokes: Pt[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 4) * (Math.PI / 2);
      spokes.push([x + dirX * Math.cos(a) * len, y + dirY * Math.sin(a) * len]);
    }
    spokes.forEach((s) => out.push(ink([[x, y], s], { width: 1.4, color: '#d8dbe6', opacity: 0.5 })));
    for (const f of [0.35, 0.6, 0.85]) {
      for (let i = 0; i < 4; i++) {
        const a = spokes[i];
        const b = spokes[i + 1];
        const m: Pt = [x + (((a[0] + b[0]) / 2 - x) * f) * 0.85, y + (((a[1] + b[1]) / 2 - y) * f) * 0.85];
        out.push(ink([[x + (a[0] - x) * f, y + (a[1] - y) * f], m, [x + (b[0] - x) * f, y + (b[1] - y) * f]], { width: 1.2, color: '#d8dbe6', opacity: 0.42 }));
      }
    }
    return out;
  };

  // ---- the barred window, high on the wall
  const bars: Node[] = [850, 878, 906].map((x) => piece(rect(x - 3, 96, 6, 200), '#23252f', { edge: 'cut', fibre: false, shadow: false }));
  const flames: Node[] = [
    piece(curve([[286, 346], [268, 322], [276, 298], [290, 270], [298, 300], [312, 320], [304, 346]], 2), C.orange, { edge: 'clean', shadow: false }),
    piece(curve([[288, 344], [278, 326], [288, 306], [292, 290], [298, 312], [302, 330], [298, 344]], 2), C.candle, { edge: 'clean', shadow: false }),
  ];

  // ---- the floor: flagstone lines that fan out towards the front
  const flags: Node[] = [];
  for (const x of [-40, 120, 800, 980, 1140]) {
    flags.push(ink([[x * 0.6 + 590 * 0.4, 664], [x, 840]], { width: 2.4, color: '#3c3f4e', opacity: 0.5 }));
  }
  for (const [y, w] of [[716, 2.6], [776, 2.8]] as Array<[number, number]>) {
    flags.push(ink([[-10, y], [1190, y + 2]], { width: w, color: '#3c3f4e', opacity: 0.4 }));
  }

  return svg({ w: 1180, h: 820, name: 'hogwarts-third-floor-room', boil: false, className: 'backdrop' }, [
    // ---- the far wall, dim grey-blue stone, darker towards the corners
    piece(rect(-20, -20, 1220, 860), '#3d4152', { edge: 'clean', shadow: false }),
    piece(rect(-20, -20, 1220, 700), '#4a4f61', { edge: 'clean', shadow: false }),
    ...blocks,
    ...mortar,
    // the top of the wall falls into shadow
    piece(curve([[-40, -30], [1220, -30], [1220, 90], [800, 60], [400, 100], [-40, 70]], 2), '#2a2d3b', { rough: 1.8, shadow: false, fibre: false, opacity: 0.7 }),
    // the right edge falls into shadow too
    piece(curve([[1220, -30], [1220, 680], [1130, 660], [1090, 420], [1120, 100]], 2), '#2a2d3b', { rough: 1.6, shadow: false, fibre: false, opacity: 0.45 }),

    // ---- the barred window (x 800 to 920) and its moonlight
    piece(curve([[790, 300], [790, 160], [820, 90], [860, 68], [900, 90], [930, 160], [930, 300]], 2), '#5a5f72', { rough: 0.7 }),
    piece(curve([[806, 296], [806, 166], [830, 104], [860, 84], [890, 104], [914, 166], [914, 296]], 2), '#8fa6d4', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(886, 150, 20), '#e9eef8', { edge: 'clean', fibre: false, shadow: false, opacity: 0.85 }),
    dot(832, 126, 2.2, C.cream, 0.9),
    dot(826, 196, 1.8, C.cream, 0.8),
    ...bars,
    piece(rect(800, 284, 120, 20), '#6a6f82', { rough: 0.6 }),
    // the moonlight shaft across the wall and floor, pale and faint
    piece(poly([[806, 296], [914, 296], [1130, 660], [900, 660]]), '#c4d4f2', { edge: 'clean', shadow: false, opacity: 0.09 }),
    piece(poly([[836, 296], [896, 296], [1010, 660], [930, 660]]), '#d6e2fa', { edge: 'clean', shadow: false, opacity: 0.07 }),

    // ---- the torch on the wall and its warm glow
    piece(ellipse(290, 340, 230, 210), '#f0a24a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.04 }),
    piece(ellipse(290, 340, 190, 170), '#f0a24a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.05 }),
    piece(ellipse(290, 340, 155, 140), '#f0a24a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.05 }),
    piece(ellipse(290, 340, 120, 110), '#f4b563', { edge: 'clean', fibre: false, shadow: false, opacity: 0.1 }),
    piece(ellipse(290, 335, 60, 60), '#f8cf86', { edge: 'clean', fibre: false, shadow: false, opacity: 0.14 }),
    piece(poly([[278, 350], [304, 350], [300, 410], [282, 410]]), '#4a3220', { edge: 'cut', fibre: false }),
    piece(rect(270, 344, 40, 8, 2), '#23252f', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(284, 402, 12, 22, 2), '#23252f', { edge: 'cut', fibre: false, shadow: false }),
    ...flames,

    // ---- the heavy door at the far left (x 20 to 220) in its stone arch
    piece(curve([[4, 666], [4, 330], [30, 252], [120, 214], [210, 252], [238, 330], [238, 666]], 2), '#666b7e', { rough: 0.7 }),
    piece(curve([[22, 666], [22, 340], [44, 270], [120, 238], [196, 270], [218, 340], [218, 666]], 2), '#3b2a1e', { rough: 0.5, shadow: false }),
    // planks, lit a little on the side nearest the torch
    ...[0, 1, 2, 3].map((i) =>
      piece(rect(24 + i * 48, 262 + Math.abs(1.5 - i) * 22, 46, 404 - Math.abs(1.5 - i) * 22), i % 2 ? '#5a3c28' : '#654430', { edge: 'cut', fibre: false, shadow: false }),
    ),
    piece(rect(168, 270, 48, 396), '#f0a24a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.12 }),
    ...[0, 1, 2].map((i) => ink([[26 + (i + 1) * 48, 280], [26 + (i + 1) * 48, 664]], { width: 2.4, color: '#2a1c12', opacity: 0.7 })),
    // iron bands, studs and a ring handle
    ...[320, 440, 560].map((y) => piece(rect(22, y, 196, 18, 2), '#2b2d38', { edge: 'cut', fibre: false, shadow: false })),
    ...[320, 440, 560].flatMap((y) => [36, 84, 132, 180, 208].map((x) => dot(x, y + 9, 3.4, '#6f7385'))),
    piece(circle(184, 480, 15), '#23252f', { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(184, 480, 9), '#4a3320', { edge: 'clean', fibre: false, shadow: false }),
    piece(circle(184, 466, 5), '#23252f', { edge: 'cut', fibre: false, shadow: false }),
    // a worn stone step at the foot of the door
    piece(rect(-10, 650, 260, 18, 3), '#6f7488', { rough: 0.5 }),

    // ---- cobwebs
    ...web(240, 14, -1, 1, 150),
    ...web(1170, 10, -1, 1, 170),
    ...web(240, 252, 1, 1, 70),
    ...web(8, 8, 1, 1, 130),

    // ---- the floor: bare flagstones, dark and plain (ground line y 660)
    piece(rect(-20, 660, 1220, 200), '#575b6c', { edge: 'clean', shadow: false }),
    piece(curve([[-40, 640], [300, 652], [700, 644], [1220, 650], [1220, 700], [-40, 700]], 2), '#4a4e5f', { rough: 1.4, shadow: false, fibre: false, opacity: 0.8 }),
    piece(curve([[-40, 704], [400, 694], [800, 706], [1220, 696], [1220, 860], [-40, 860]], 2), '#505465', { rough: 1.6, shadow: false, fibre: false }),
    ...flags,
    // a warm patch of torchlight on the floor by the door
    piece(ellipse(300, 690, 170, 26), '#f0a24a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.1 }),
    // and a faint pool of moonlight on the floor under the window's shaft
    piece(poly([[900, 664], [1120, 664], [1160, 734], [860, 734]]), '#c4d4f2', { edge: 'clean', shadow: false, opacity: 0.06 }),
  ]);
}
