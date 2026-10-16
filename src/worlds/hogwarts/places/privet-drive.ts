/**
 * Privet Drive, Surrey: a neat, very ordinary street of identical brick
 * houses (the opening of the first book), by day or by night.
 *
 * The layout is the same in both, because a script depends on it:
 *  - Number Four is the middle-right house (x 500 to 880). Its front door is
 *    x 640 to 740, y 380 to 600, with one stone doorstep in front of it
 *    (top surface y 600, x 615 to 765).
 *  - Mr Dursley's bedroom window is above-left of the door (x 560 to 660,
 *    y 200 to 290). Curtained and dark at night; a script adds the light.
 *  - A low garden wall at the left (x 0 to 420, flat top y 520), and a street
 *    sign on a post above it (plate x 175 to 325, y 372 to 424).
 *  - Pavement from y 640, the road below y 708 plain and calm for captions.
 *  - No street lamps: scripts put them at about x 120, 470 and 1050.
 */
import { C } from '../../../art/palette';
import { circle, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** Andika lettering laid on the art. */
const label = (x: number, y: number, s: string, size: number, fill: string): Node => () =>
  `<text x="${x}" y="${y}" font-family="Andika, sans-serif" font-weight="700" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;

function stars(count: number, seed: number, w: number, maxY: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < count; i++) {
    const x = r() * w;
    const y = r() * maxY;
    const s = 2 + r() * 3.5;
    const pts: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4 + r() * 0.2;
      const rr = k % 2 ? s * 0.4 : s;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    out.push(piece(poly(pts), r() > 0.8 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 + r() * 0.4 }));
  }
  return out;
}

export function privetDrive(night: boolean): string {
  const p = (day: string, nt: string): string => (night ? nt : day);
  const brick = p('#c0714f', '#4b4f6e');
  const brickDark = p('#a85c3f', '#3f4360');
  const roof = p('#6a5f6e', '#2d3350');
  const roofLight = p('#7a6e7d', '#363c5c');
  const trim = p('#f1e8d4', '#7b84a4');
  const hedge = p('#4f8a4c', '#2f4a4e');
  const hedgeLight = p('#6aa45c', '#3a5a5a');
  const stone = p('#c6c1b4', '#6a7088');
  const curtain = p('#d9a05e', '#2a2f4e');
  const glassDark = p('#9cc3dc', '#1d2340');
  const doorCol = p('#3f6b4c', '#26403f');
  const r = rng(41);

  /** A sash window: white frame, glass, glazing bars, sill. Optional curtains. */
  const win = (x: number, y: number, w: number, h: number, glass: string, curtains: boolean): Node[] => [
    piece(rect(x - 6, y - 6, w + 12, h + 12, 3), trim, { edge: 'cut', fibre: false }),
    piece(rect(x, y, w, h, 2), glass, { edge: 'cut', fibre: false, shadow: false }),
    ...(curtains
      ? [
          piece(poly([[x, y], [x + w * 0.42, y], [x + w * 0.34, y + h], [x, y + h]]), curtain, { edge: 'cut', fibre: false, shadow: false }),
          piece(poly([[x + w, y], [x + w * 0.58, y], [x + w * 0.66, y + h], [x + w, y + h]]), curtain, { edge: 'cut', fibre: false, shadow: false }),
        ]
      : []),
    ink([[x + w / 2, y + 1], [x + w / 2, y + h - 1]], { width: 3, color: trim }),
    ink([[x + 1, y + h / 2], [x + w - 1, y + h / 2]], { width: 3, color: trim }),
    piece(rect(x - 12, y + h + 5, w + 24, 8, 2), stone, { edge: 'cut', fibre: false, shadow: false }),
  ];

  /** One of the identical houses. x0 is its left edge; body is 380 wide, y 175 to 640. */
  const house = (x0: number, lit: number[], number4: boolean, door = true): Node[] => {
    const out: Node[] = [];
    // chimney behind the roof
    out.push(piece(rect(x0 + 295, 72, 34, 80), brickDark, { edge: 'cut' }));
    out.push(piece(rect(x0 + 291, 66, 42, 12), stone, { edge: 'cut', fibre: false }));
    // brick walls
    out.push(piece(rect(x0, 170, 380, 470), brick, { edge: 'cut' }));
    for (let y = 190; y < 600; y += 22) {
      out.push(ink([[x0 + 6, y], [x0 + 374, y]], { width: 1.6, color: brickDark, opacity: 0.45, wobble: 0.4 }));
      for (let x = x0 + 20 + ((y / 22) % 2) * 22; x < x0 + 374; x += 44) {
        out.push(ink([[x, y], [x, y + 22]], { width: 1.4, color: brickDark, opacity: 0.35, wobble: 0.4 }));
      }
    }
    // plinth, so the door stands up on the step
    out.push(piece(rect(x0, 600, 380, 40), brickDark, { edge: 'cut', fibre: false }));
    // roof
    out.push(piece(poly([[x0 - 28, 178], [x0 + 70, 104], [x0 + 310, 104], [x0 + 408, 178]]), roof, { edge: 'cut' }));
    out.push(piece(poly([[x0 - 30, 178], [x0 + 410, 178], [x0 + 410, 190], [x0 - 30, 190]]), roofLight, { edge: 'cut', fibre: false }));
    // upstairs windows (left one is the bedroom in Number Four)
    const upL = x0 + 60;
    const upR = x0 + 240;
    out.push(...win(upL, 200, 100, 90, lit.includes(0) ? C.candle : glassDark, !lit.includes(0)));
    out.push(...win(upR, 200, 100, 90, lit.includes(1) ? C.candle : glassDark, !lit.includes(1) && night));
    // downstairs windows
    out.push(...win(x0 + 30, 420, 80, 100, lit.includes(2) ? C.candle : glassDark, false));
    out.push(...win(x0 + 270, 420, 80, 100, lit.includes(3) ? C.candle : glassDark, false));
    if (!door) return out; // the left house's door is hidden behind the wall and sign
    // porch roof, door and step
    out.push(piece(poly([[x0 + 120, 380], [x0 + 142, 346], [x0 + 238, 346], [x0 + 260, 380]]), roof, { edge: 'cut' }));
    out.push(piece(rect(x0 + 140, 380, 100, 220, 4), doorCol, { edge: 'cut' }));
    out.push(piece(rect(x0 + 152, 394, 76, 70, 3), p('#4d8060', '#31504d'), { edge: 'cut', fibre: false, shadow: false }));
    out.push(piece(rect(x0 + 152, 480, 76, 100, 3), p('#4d8060', '#31504d'), { edge: 'cut', fibre: false, shadow: false }));
    out.push(piece(rect(x0 + 143, 500, 5, 18, 2), C.gold, { edge: 'clean', shadow: false }));
    out.push(piece(circle(x0 + 224, 536, 5), C.gold, { edge: 'clean', shadow: false }));
    out.push(piece(rect(x0 + 175, 470, 30, 6, 2), C.gold, { edge: 'clean', shadow: false }));
    if (number4) {
      // the brass 4
      out.push(piece(circle(x0 + 190, 424, 20), C.gold, { edge: 'cut', fibre: false, shadow: false }));
      out.push(label(x0 + 190, 436, '4', 32, C.brownDark));
    }
    out.push(piece(rect(x0 + 115, 600, 150, 40, 3), stone, { edge: 'cut' }));
    out.push(ink([[x0 + 120, 602], [x0 + 260, 602]], { width: 3, color: p('#e6e1d4', '#8a90aa') }));
    return out;
  };

  /** A tidy, clipped hedge with a few leaf flecks. */
  const hedgeRow = (x: number, w: number): Node[] => {
    const out: Node[] = [piece(rect(x, 548, w, 80, 16), hedge, { rough: 0.7 })];
    for (let i = 0; i < w / 18; i++) {
      out.push(piece(ellipse(x + 10 + r() * (w - 20), 562 + r() * 54, 6, 3, r() * 3), hedgeLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
    }
    return out;
  };

  // far-off houses to give the street some depth
  const far: Node[] = [];
  [[-30, 300], [120, 320], [440, 310], [880, 300], [1060, 320]].forEach(([x, y], i) => {
    const c = p(i % 2 ? '#d4c0b4' : '#cbb6ae', i % 2 ? '#3a4062' : '#363b5c');
    far.push(piece(rect(x, y + 50, 150, 300), c, { edge: 'cut', fibre: false, shadow: false }));
    far.push(piece(poly([[x - 10, y + 56], [x + 30, y], [x + 120, y], [x + 160, y + 56]]), p('#a79ba8', '#2f3556'), { edge: 'cut', fibre: false, shadow: false }));
  });

  // the wall's courses of brick
  const wall: Node[] = [
    piece(rect(-20, 538, 440, 102), brick, { edge: 'cut' }),
    piece(rect(-24, 520, 448, 20, 3), stone, { edge: 'cut' }),
  ];
  for (let y = 560; y < 636; y += 20) {
    wall.push(ink([[-10, y], [414, y]], { width: 1.6, color: brickDark, opacity: 0.5, wobble: 0.4 }));
    for (let x = -4 + ((y / 20) % 2) * 22; x < 414; x += 44) wall.push(ink([[x, y], [x, y + 20]], { width: 1.4, color: brickDark, opacity: 0.4, wobble: 0.4 }));
  }

  // the street sign
  const sign: Node[] = [
    piece(rect(247, 424, 8, 108, 2), p('#4a4f58', '#2a2e44'), { edge: 'cut', fibre: false }),
    piece(rect(175, 372, 150, 52, 6), p('#2f4f7c', '#26365a'), { edge: 'cut' }),
    piece(rect(181, 378, 138, 40, 4), p('#f7f2e6', '#c9cfdd'), { edge: 'cut', fibre: false, shadow: false }),
    label(250, 406, 'Privet Drive', 22, p('#2b2620', '#2b3050')),
  ];

  const sky: Node[] = night
    ? [
        piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
        ...stars(60, 17, 1180, 330),
        piece(circle(1080, 62, 38), C.cream, { rough: 0.8 }),
        piece(circle(1098, 52, 33), C.night, { edge: 'cut', fibre: false, shadow: false }),
      ]
    : [
        piece(rect(-20, -20, 1220, 860), '#bcd9ef', { edge: 'clean', shadow: false }),
        piece(circle(150, 80, 70), C.goldLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
        piece(circle(150, 80, 40), C.yellow, { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
        ...[[620, 56, 1], [900, 36, 0.8], [330, 40, 0.7], [1090, 90, 0.6]].flatMap(([x, y, s]) => [
          piece(ellipse(x, y, 90 * s, 24 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.9 }),
          piece(ellipse(x - 30 * s, y - 14 * s, 44 * s, 24 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.9 }),
          piece(ellipse(x + 26 * s, y - 18 * s, 50 * s, 28 * s), C.white, { rough: 1.2, shadow: false, opacity: 0.9 }),
        ]),
      ];

  return svg({ w: 1180, h: 820, name: night ? 'hogwarts-privet-drive-night' : 'hogwarts-privet-drive', boil: false, className: 'backdrop' }, [
    ...sky,
    ...far,
    // front lawns
    piece(rect(-20, 586, 1220, 60), p('#8cb868', '#2c4646'), { edge: 'clean', shadow: false }),
    // the houses: left neighbour, Number Four, right neighbour
    ...house(80, night ? [1] : [], false, false),
    ...house(500, [], true),
    ...house(920, night ? [0] : [], false),
    // hedges, with the gap at Number Four's doorstep left open
    ...hedgeRow(425, 78),
    ...hedgeRow(503, 108),
    ...hedgeRow(778, 108),
    ...hedgeRow(922, 270),
    // the wall and the sign on its post
    ...sign,
    ...wall,
    // pavement, kerb and road
    piece(rect(-20, 640, 1220, 70), p('#d3cdc0', '#5c6280'), { edge: 'clean', shadow: false }),
    ink([[-20, 641], [1200, 641]], { width: 3, color: p('#b3ad9f', '#4a5070') }),
    piece(rect(-20, 698, 1220, 14), p('#a7a398', '#454b69'), { edge: 'clean', shadow: false }),
    piece(rect(-20, 710, 1220, 130), p('#8b8f98', '#343a58'), { edge: 'clean', shadow: false }),
  ]);
}
