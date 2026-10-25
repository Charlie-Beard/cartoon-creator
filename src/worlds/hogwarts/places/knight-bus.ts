import { C } from '../../../art/palette';
import { circle, dot, ellipse, ink, piece, poly, rect, svg, group, type Node } from '../../../art/paper';

/** Inside the Knight Bus at night: brass bedsteads with patchwork quilts, candles, a swinging chandelier, the street streaking past (1180 × 820). */
export function knightBus(): string {
  const brass = '#d8a43f';
  const brassDark = '#a97a28';
  const quiltColours = ['#c4706c', '#6f9a5a', '#4f78a8', '#e8c45a', '#d9823b', '#8a6aa8'];
  // one bed seen from the side, headboard at the wall edge. dir: 1 = headboard at left, -1 = at right
  const bed = (x: number, y: number, w: number, dir: 1 | -1, seed: number): Node[] => {
    const hx = dir === 1 ? x : x + w;
    const fx = dir === 1 ? x + w : x;
    const patches: Node[] = [];
    for (let i = 0; i < 5; i++) {
      patches.push(piece(rect(Math.min(x, x + w) + 14 + i * ((w - 28) / 5), y + 4, (w - 28) / 5 - 2, 40, 3), quiltColours[(i + seed) % 6], { edge: 'cut', fibre: false, shadow: false }));
    }
    return [
      // legs and frame
      piece(rect(x, y + 44, w, 10, 3), brass, { edge: 'cut', fibre: false }),
      piece(rect(hx - 5, y - 70, 10, 160, 4), brass, { edge: 'cut', fibre: false }),
      piece(rect(fx - 4, y - 10, 8, 100, 4), brass, { edge: 'cut', fibre: false }),
      // headboard rails
      ...[-50, -24].map((dy) => ink([[hx, y + dy], [hx + dir * 0.01, y + dy]], { width: 1, color: brass })),
      piece(circle(hx, y - 74, 9), brass, { edge: 'cut', fibre: false, shadow: false }),
      piece(circle(fx, y - 14, 7), brass, { edge: 'cut', fibre: false, shadow: false }),
      // mattress, quilt, pillow
      piece(rect(x + 2, y + 24, w - 4, 24, 8), '#f0e6d0', { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(Math.min(x, x + w) + 10, y - 4, w - 20, 50, 12), '#9a6aa0', { edge: 'torn', fibre: false }),
      ...patches,
      piece(ellipse(hx + dir * 34, y - 12, 30, 14), '#f7f2e6', { edge: 'cut', fibre: false }),
      // brass bars of the headboard
      ...[0, 1, 2, 3].map((i) => ink([[hx + dir * (-1 + i * 0), y - 62 + i * 0], [hx, y - 62]], { width: 0.1, color: brass, opacity: 0 })),
      piece(rect(Math.min(hx, hx + dir * 20), y - 56, 20, 6, 3), brass, { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(Math.min(hx, hx + dir * 20), y - 30, 20, 6, 3), brass, { edge: 'cut', fibre: false, shadow: false }),
    ];
  };
  const candle = (x: number, y: number): Node[] => [
    piece(ellipse(x, y - 14, 38, 38), C.candle, { edge: 'clean', shadow: false, opacity: 0.22 }),
    piece(rect(x - 10, y + 2, 20, 6, 3), brass, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x - 3, y - 20, 6, 24, 2), '#f7f2e6', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[x, y - 36], [x + 6, y - 24], [x, y - 19], [x - 6, y - 24]]), '#f5b942', { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 14, y + 10], [x, y + 18], [x + 14, y + 10]], { width: 3, color: brassDark }),
  ];
  // street streaks seen through a window
  const streaks = (x: number, y: number, w: number, h: number, s: number): Node[] => {
    const out: Node[] = [];
    const cols = ['#f7d283', '#f5b942', '#fff2c0', '#e98a5a', '#9fd0e8'];
    for (let i = 0; i < 6; i++) {
      const yy = y + 20 + ((i * 41 + s * 17) % (h - 30));
      const len = 60 + ((i * 53 + s * 29) % 90);
      const xx = x + ((i * 67 + s * 43) % (w - len));
      out.push(piece(rect(xx, yy, len, 8, 4), cols[(i + s) % 5], { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }));
      out.push(piece(rect(xx - 10, yy + 2, len + 20, 4, 2), cols[(i + s) % 5], { edge: 'clean', shadow: false, opacity: 0.3 }));
    }
    return out;
  };
  const win = (x: number): Node[] => [
    piece(rect(x - 12, 112, 184, 266, 10), brassDark, { edge: 'cut' }),
    piece(rect(x, 124, 160, 242, 6), '#1c2144', { edge: 'clean', shadow: false }),
    piece(rect(x, 124, 160, 242), '#2f3860', { edge: 'clean', shadow: false, opacity: 0.5 }),
    // blurred dark rooftops
    piece(poly([[x, 300], [x + 30, 276], [x + 70, 300], [x + 100, 270], [x + 160, 296], [x + 160, 366], [x, 366]]), '#161a34', { edge: 'clean', shadow: false, opacity: 0.8 }),
    ...streaks(x, 124, 160, 242, (x / 40) | 0),
    ink([[x + 80, 124], [x + 80, 366]], { width: 6, color: brassDark }),
    piece(rect(x - 16, 374, 192, 12, 4), brass, { edge: 'cut', fibre: false }),
  ];
  const panels: Node[] = [];
  for (let x = -20; x < 1200; x += 90) panels.push(piece(rect(x, 80, 80, 520, 10), '#4a3565', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
  return svg({ w: 1180, h: 820, name: 'hogwarts-knight-bus', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#58406e', { edge: 'clean', shadow: false }),
    ...panels,
    // ceiling with brass trim
    piece(rect(-20, -20, 1220, 96), '#3b2a52', { edge: 'clean', shadow: false }),
    piece(rect(-20, 70, 1220, 12), brassDark, { edge: 'cut', fibre: false }),
    // warm light spread
    piece(ellipse(590, 330, 520, 300), '#f7d283', { edge: 'clean', shadow: false, opacity: 0.1 }),

    // ---- windows at the back, three: x 310, 510, 710 (each 160 wide, y 124 to 366)
    group({ transform: 'translate(0 96)' }, [...win(310), ...win(510), ...win(710)]),

    // ---- brass bedsteads along both sides (a second tier higher up at the edges)
    ...bed(-30, 570, 270, 1, 0),
    ...bed(-30, 400, 230, 1, 2),
    ...bed(940, 570, 270, -1, 3),
    ...bed(980, 400, 230, -1, 5),

    // ---- candles in brackets
    ...candle(262, 330),
    ...candle(910, 330),
    ...candle(60, 150),
    ...candle(1120, 150),
    ...candle(268, 520),
    ...candle(912, 520),

    // ---- purple floor with a runner
    piece(rect(-20, 640, 1220, 200), '#6b4f86', { edge: 'clean', shadow: false }),
    piece(rect(-20, 640, 1220, 10), '#3b2a52', { edge: 'clean', shadow: false, opacity: 0.7 }),
    piece(poly([[290, 646], [890, 646], [1000, 840], [180, 840]]), '#7d5a9a', { edge: 'clean', shadow: false, opacity: 0.6 }),
    ink([[330, 656], [850, 656]], { width: 3, color: brass, opacity: 0.55 }),

    // ---- the chandelier, swinging from the ceiling (pivot 590, 80); arms and little candles
    group({ part: 'chandelier', origin: [590, 80] }, [
      ink([[590, 76], [590, 150]], { width: 4, color: brassDark }),
      piece(circle(590, 158, 14), brass, { edge: 'cut', fibre: false }),
      piece(ellipse(590, 176, 90, 70), C.candle, { edge: 'clean', shadow: false, opacity: 0.18 }),
      ink([[500, 190], [530, 176], [560, 172], [590, 172], [620, 172], [650, 176], [680, 190]], { width: 5, color: brass }),
      ...[500, 545, 590, 635, 680].flatMap((cx) => {
        const cy = cx === 590 ? 172 : cx === 545 || cx === 635 ? 176 : 190;
        return [
          piece(rect(cx - 8, cy - 2, 16, 6, 3), brass, { edge: 'cut', fibre: false, shadow: false }),
          piece(rect(cx - 3, cy - 20, 6, 20, 2), '#f7f2e6', { edge: 'cut', fibre: false, shadow: false }),
          piece(poly([[cx, cy - 36], [cx + 5, cy - 25], [cx, cy - 20], [cx - 5, cy - 25]]), '#f5b942', { edge: 'cut', fibre: false, shadow: false }),
          dot(cx, cy + 12, 3, brass),
        ];
      }),
      piece(poly([[590, 186], [598, 206], [590, 224], [582, 206]]), '#9fd0e8', { edge: 'cut', fibre: false, shadow: false }),
    ]),
  ]);
}
