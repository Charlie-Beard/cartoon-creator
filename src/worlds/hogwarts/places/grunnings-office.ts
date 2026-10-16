import { C } from '../../../art/palette';
import { circle, dot, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

/** Mr Dursley's office at Grunnings, who make drills: beige, tidy and dull (1180 × 820). */
export function grunningsOffice(): string {
  const wall = '#d9c9a3';
  const panelling: Node[] = [];
  for (let x = 30; x < 1180; x += 110) panelling.push(ink([[x, 20], [x, 620]], { width: 2, color: '#c7b68e', opacity: 0.5 }));
  const stripes: Node[] = [];
  // a town by day: far rooftops, low in the window
  const roofs: Node[] = [
    piece(poly([[660, 420], [660, 372], [700, 372], [700, 350], [740, 332], [780, 350], [780, 380], [840, 380], [840, 420]]), '#8f98a8', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[800, 420], [800, 388], [850, 366], [900, 388], [900, 362], [960, 362], [960, 400], [1020, 400], [1020, 376], [1060, 376], [1060, 420]]), '#7c8698', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[1000, 420], [1000, 392], [1040, 372], [1080, 392], [1080, 410], [1100, 410], [1100, 420]]), '#8f98a8', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(704, 340, 10, 22), '#a56b55', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(930, 346, 10, 20), '#a56b55', { edge: 'cut', fibre: false, shadow: false }),
  ];
  const blinds: Node[] = [];
  for (let i = 0; i < 4; i++) blinds.push(piece(rect(640, 100 + i * 12, 480, 7, 2), '#efe6cc', { edge: 'cut', fibre: false, shadow: true }));
  const deskX = 80;
  const deskW = 540;
  const drawers: Node[] = [];
  for (const [x, w] of [[110, 150], [290, 190], [490, 100]]) {
    drawers.push(piece(rect(x, 600, w, 90, 4), '#9a6a40', { edge: 'cut', fibre: false, shadow: false }));
    drawers.push(piece(rect(x + w / 2 - 18, 636, 36, 8, 4), C.gold, { edge: 'cut', fibre: false, shadow: false }));
  }
  return svg({ w: 1180, h: 820, name: 'hogwarts-grunnings-office', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), wall, { edge: 'clean', shadow: false }),
    ...panelling,
    ...stripes,
    // dado rail
    piece(rect(-20, 600, 1220, 14), '#b9a67c', { edge: 'cut', fibre: false }),
    piece(rect(-20, 614, 1220, 240), '#a9a7a2', { edge: 'clean', shadow: false }),
    // carpet tiles
    ...[0, 1, 2, 3, 4, 5].map((i) => piece(rect(i * 220 - 60, 640, 110, 190), '#9f9d98', { edge: 'clean', shadow: false, opacity: 0.5 })),

    // ---- the big window at the back right: sky, town, venetian blind
    piece(rect(626, 86, 508, 348, 6), '#f3ecd8', { edge: 'cut' }),
    piece(rect(640, 100, 480, 320), C.sky, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(640, 100, 480, 110), '#a7c6e4', { edge: 'clean', shadow: false, opacity: 0.55 }),
    piece(poly([[640, 420], [640, 396], [700, 400], [900, 392], [1120, 398], [1120, 420]]), '#a3b27f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...roofs,
    ...blinds,
    ink([[880, 100], [880, 420]], { width: 8, color: '#f3ecd8' }),
    piece(rect(612, 428, 534, 16, 4), '#e8dfc4', { edge: 'cut' }),

    // ---- left wall: framed picture of a drill, and a certificate
    piece(rect(86, 120, 180, 130, 4), C.wood, { edge: 'cut' }),
    piece(rect(98, 132, 156, 106, 2), '#f6efd8', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(114, 176, 70, 26, 8), C.blueDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(180, 184, 50, 10, 2), C.stone, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(130, 196, 18, 32, 4), C.blueDark, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(226, 188, 18, 2), C.stone, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(310, 112, 120, 92, 3), C.brownDark, { edge: 'cut' }),
    piece(rect(318, 120, 104, 76, 2), '#f6efd8', { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 1, 2].map((i) => ink([[330, 138 + i * 14], [410 - i * 12, 138 + i * 14]], { width: 3, color: '#a99a78' })),
    piece(circle(392, 184, 8), C.red, { edge: 'cut', fibre: false, shadow: false }),

    // ---- a filing cabinet behind the desk's right end
    piece(rect(522, 356, 98, 200, 4), '#8c98a2', { edge: 'cut' }),
    ...[0, 1, 2].flatMap((i) => [
      piece(rect(530, 364 + i * 62, 82, 54, 3), '#a2adb6', { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(560, 384 + i * 62, 22, 6, 3), C.charcoal, { edge: 'cut', fibre: false, shadow: false }),
    ]),

    // ---- the big wooden desk, front left
    piece(rect(deskX, 540, deskW, 24, 4), '#b98652', { edge: 'cut' }),
    piece(rect(deskX + 12, 564, deskW - 24, 270), '#8f6038', { edge: 'cut' }),
    piece(rect(deskX + 12, 564, deskW - 24, 10), '#7a502e', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ...drawers,
    // telephone
    piece(rect(104, 514, 64, 26, 6), C.charcoal, { edge: 'cut' }),
    piece(rect(98, 502, 76, 14, 7), C.ink, { edge: 'cut', fibre: false }),
    piece(circle(136, 526, 8), C.stoneLight, { edge: 'cut', fibre: false, shadow: false }),
    // neat papers
    piece(rect(178, 528, 44, 12, 1), C.white, { edge: 'cut', fibre: false }),
    piece(rect(182, 520, 44, 10, 1), '#efe6cc', { edge: 'cut', fibre: false }),
    // a drill on its side
    piece(rect(500, 518, 74, 22, 8), C.red, { edge: 'cut' }),
    piece(rect(570, 524, 38, 8, 3), C.stone, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[512, 540], [526, 540], [520, 504], [506, 504]]), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
    dot(536, 529, 4, C.goldLight),
  ]);
}
