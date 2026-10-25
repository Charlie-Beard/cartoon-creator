/**
 * The rest of the Dursley family, for the Dursley cartoons: Dudley at eleven
 * to fourteen (huge, pink and greedy, with a toffee tongue that grows), Aunt
 * Marge (Vernon's sister, as beefy as he is, who swells up like a balloon) and
 * her bulldog Ripper. Built on person() like the other Dursleys, with the same
 * pinks, so they look like one family on a shelf.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';
import { fluff } from './heroes';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;

/** A shut mouth and its open twin in the same place, drawn over whatever is in front. */
function talkingMouth(shut: Node[], open: Node[]): Node[] {
  return [group({ part: 'mouth' }, shut), group({ part: 'mouthOpen', opacity: 0 }, open)];
}

const flat = { edge: 'cut', fibre: false, shadow: false } as const;

// ---------------------------------------------------------------------------
// Dudley, eleven or more: enormous, round and pink, a tight striped jumper
// ---------------------------------------------------------------------------

export function dudleyBig(): string {
  const skin = '#f0aa9c';
  const skinDark = '#cf8678';
  const hair = '#e4c56e';
  const hairDark = '#b8943e';
  const jumper = '#8a2c3c';
  const jumperDark = '#6c1e2e';
  const stripe = '#e08a36';
  const [rx, ry] = [80, 70];
  return person({
    name: 'dudley-big',
    label: 'Dudley',
    skin,
    eyes: C.blue,
    eyeStyle: 'narrow',
    face: [rx, ry],
    blush: true,
    ears: true,
    back: [piece(ellipse(cx, cy - 18, 84, 62), hair)],
    body: [
      // a huge round body in a maroon jumper that is far too small
      piece(curve([[-2, 345], [-6, 270], [34, 226], [150, 210], [266, 226], [306, 270], [302, 345]], 2), jumper),
      // orange stripes, stretched wide over the tummy
      ...[[254, 14], [284, 15], [314, 16]].map(([y, h]) =>
        piece(curve([[8, y + h], [6, y + 2], [150, y - 8], [294, y + 2], [292, y + h], [150, y + h - 8]], 2), stripe, { edge: 'cut', fibre: false }),
      ),
      // the pulled-tight wrinkles round the middle
      ...[[40, 300, 70, 288], [100, 330, 130, 318], [200, 330, 230, 318], [230, 300, 262, 288], [150, 270, 150, 262]].map(([x1, y1, x2, y2]) =>
        ink([[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2 + 6], [x2, y2]], { width: 2.2, color: jumperDark, opacity: 0.6 }),
      ),
      // a white collar peeping out under the chins
      piece(poly([[104, 214], [150, 238], [196, 214], [190, 200], [150, 222], [110, 200]]), C.white, { fibre: false }),
    ],
    brows: 'raised',
    browColor: hairDark,
    nose: 'button',
    mouth: 'none',
    front: [
      // the double chin, two soft rolls under the jaw
      piece(ellipse(cx, cy + 64, 66, 22), skin, { edge: 'cut', fibre: false }),
      ink([[cx - 50, cy + 60], [cx, cy + 74], [cx + 50, cy + 60]], { width: 2.2, color: skinDark, opacity: 0.7 }),
      ink([[cx - 36, cy + 80], [cx, cy + 90], [cx + 36, cy + 80]], { width: 2.2, color: skinDark, opacity: 0.55 }),
      // fat cheeks pushing the eyes into small slits
      piece(ellipse(cx - 46, cy + 22, 28, 20), skin, { ...flat, opacity: 0.8 }),
      piece(ellipse(cx + 46, cy + 22, 28, 20), skin, { ...flat, opacity: 0.8 }),
      // a pouting little mouth, and an open whinge
      ...talkingMouth(
        [
          piece(ellipse(cx, cy + 46, 15, 7), C.rose, { edge: 'clean', fibre: false, shadow: false }),
          ink([[cx - 14, cy + 49], [cx, cy + 42], [cx + 14, cy + 49]], { width: 3, color: C.redDark }),
        ],
        [
          piece(ellipse(cx, cy + 52, 24, 17), C.redDark, flat),
          piece(rect(cx - 16, cy + 38, 32, 7, 2), C.white, { edge: 'clean', shadow: false }),
          piece(ellipse(cx, cy + 62, 14, 6), C.rose, { edge: 'clean', fibre: false, shadow: false }),
        ],
      ),
      // the Ton-Tongue Toffee tongue: long, purple and hidden until a script shows it
      group({ part: 'tongue', origin: [cx, cy + 50], opacity: 0 }, [
        piece(
          curve([[cx - 16, cy + 46], [cx - 19, cy + 100], [cx - 15, cy + 160], [cx, cy + 186], [cx + 15, cy + 160], [cx + 19, cy + 100], [cx + 16, cy + 46]], 2),
          '#8f4fa6',
          { edge: 'cut', fibre: false },
        ),
        ink([[cx, cy + 56], [cx, cy + 120], [cx, cy + 172]], { width: 2.4, color: '#6a3480', opacity: 0.7 }),
        ...[[-8, 80], [7, 100], [-6, 130], [8, 152], [0, 112]].map(([dx, dy]) => dot(cx + dx, cy + dy, 2.4, '#b784c8', 0.8)),
      ]),
      // thick, neat blond hair, brushed flat across the forehead
      piece(curve([[cx - 80, cy - 4], [cx - 78, cy - 50], [cx, cy - 76], [cx + 78, cy - 50], [cx + 80, cy - 4], [cx + 54, cy - 40], [cx + 10, cy - 36], [cx - 28, cy - 44], [cx - 54, cy - 36]], 2), hair),
      ink([[cx - 10, cy - 72], [cx - 24, cy - 42]], { width: 2.2, color: hairDark, opacity: 0.8 }),
      ink([[cx + 20, cy - 70], [cx + 36, cy - 44]], { width: 2.2, color: hairDark, opacity: 0.6 }),
      // the face going red for a tantrum
      group({ part: 'cross', opacity: 0 }, [
        piece(ellipse(cx, cy + 4, rx - 4, ry - 4), '#e0405a', { ...flat, opacity: 0.5 }),
        piece(ellipse(cx - 46, cy + 24, 26, 18), '#b8223c', { ...flat, opacity: 0.4 }),
        piece(ellipse(cx + 46, cy + 24, 26, 18), '#b8223c', { ...flat, opacity: 0.4 }),
      ]),
    ],
    extra: [
      // left arm hanging down, a sausage-fingered fist
      piece(band([[66, 256], [36, 318]], 50), jumper),
      piece(band([[56, 300], [42, 322]], 52), stripe, { edge: 'cut', fibre: false }),
      piece(circle(34, 332, 22), skin),
      // right arm, swung from the shoulder: grabs, points, waves a fist
      group({ part: 'armR', origin: [234, 258] }, [
        piece(band([[234, 256], [266, 318]], 50), jumper),
        piece(band([[256, 300], [270, 322]], 52), stripe, { edge: 'cut', fibre: false }),
        piece(circle(270, 334, 22), skin),
        ...[-8, 0, 8].map((dx) => ink([[270 + dx, 326], [270 + dx, 344]], { width: 1.8, color: skinDark })),
      ]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Aunt Marge: Vernon's sister, big and beefy, tweed and pearls
// ---------------------------------------------------------------------------

const MARGE = {
  skin: '#e29fa2',
  skinDark: '#bf7a84',
  hair: '#8f7c6a',
  hairDark: '#6c5a4a',
  tweed: '#8d8560',
  tweedDark: '#6a6444',
  blouse: '#f2e8d2',
};

function pearls(from: [number, number], to: [number, number], sag: number, n: number): Node[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * sag;
    return [piece(circle(x, y, 5.4), '#f6f1e6', { edge: 'clean', fibre: false, shadow: true }), dot(x - 1.6, y - 1.8, 1.6, C.white)];
  }).flat();
}

function tweedFlecks(x0: number, x1: number, y0: number, y1: number, inside: (x: number, y: number) => boolean): Node[] {
  const out: Node[] = [];
  let row = 0;
  for (let y = y0; y <= y1; y += 14, row++) {
    for (let x = x0 + (row % 2) * 9; x <= x1; x += 18) if (inside(x, y)) out.push(dot(x, y, 2, MARGE.tweedDark, 0.55));
  }
  return out;
}

function marge(swollen: boolean): string {
  const { skin, skinDark, hair, hairDark, tweed, tweedDark, blouse } = MARGE;
  const [rx, ry] = [76, 68];
  const body: Node[] = swollen
    ? [
        // stiff stocking legs sticking out at the bottom corners, with sensible shoes
        piece(band([[84, 300], [50, 326]], 30), '#c99a98'),
        piece(ellipse(46, 334, 22, 10, -26), '#4a3426', { edge: 'cut', fibre: false }),
        piece(band([[216, 300], [250, 326]], 30), '#c99a98'),
        piece(ellipse(254, 334, 22, 10, 26), '#4a3426', { edge: 'cut', fibre: false }),
        // the left arm flung out like a starfish
        piece(band([[70, 214], [26, 142]], 38), tweed),
        piece(circle(18, 130, 17), skin),
        ...[-8, 0, 8].map((dx) => ink([[18 + dx, 124], [18 + dx * 1.6, 112]], { width: 2, color: skinDark })),
        // the great round balloon of a body, her jacket stretched shiny-tight
        piece(ellipse(cx, 232, 124, 106), tweed),
        ...tweedFlecks(40, 260, 150, 330, (x, y) => ((x - cx) / 112) ** 2 + ((y - 232) / 96) ** 2 < 1),
        piece(ellipse(88, 214, 30, 14, -50), C.white, { ...flat, opacity: 0.22 }),
        // the blouse bulging through the gap in the jacket
        piece(ellipse(cx, 268, 24, 56), blouse, { edge: 'cut', fibre: false }),
        // buttons popping off, with little lines showing they flew
        ...[[84, 262, -1], [222, 256, 1], [186, 312, 1]].flatMap(([x, y, s]) => [
          piece(circle(x, y, 7), '#4a3a28', { edge: 'cut', fibre: false }),
          dot(x - 2, y - 2, 1.8, '#8a7a60'),
          ink([[x + s * 12, y - 6], [x + s * 22, y - 12]], { width: 2.2, color: tweedDark }),
          ink([[x + s * 13, y + 2], [x + s * 24, y + 2]], { width: 2.2, color: tweedDark }),
        ]),
        // stretch lines
        // the pearls pulled into a wide, tight smile across the middle
        ...pearls([70, 240], [230, 240], 46, 12),
      ]
    : [
        // broad tweed shoulders, right up to the jaw
        piece(curve([[-2, 345], [4, 252], [66, 212], [150, 206], [234, 212], [296, 252], [302, 345]], 2), tweed),
        ...tweedFlecks(16, 284, 236, 336, () => true),
        // cream blouse and lapels
        piece(poly([[110, 214], [150, 270], [190, 214], [178, 206], [150, 238], [122, 206]]), blouse, { fibre: false }),
        piece(poly([[84, 238], [122, 208], [140, 296], [100, 334]]), tweedDark, { fibre: false }),
        piece(poly([[216, 238], [178, 208], [160, 296], [200, 334]]), tweedDark, { fibre: false }),
        // buttons
        ...[318, 336].map((y) => piece(circle(150, y, 5), '#4a3a28', { edge: 'cut', fibre: false, shadow: false })),
        // a long string of pearls hanging over the blouse
        ...pearls([118, 214], [182, 214], 62, 11),
      ];
  return person({
    name: swollen ? 'aunt-marge-swollen' : 'aunt-marge',
    label: 'Aunt Marge',
    skin,
    eyes: '#4a4036',
    eyeStyle: swollen ? 'wide' : 'narrow',
    face: [rx, ry],
    blush: false,
    ears: true,
    back: [piece(ellipse(cx, cy - 18, 74, 56), hair)],
    body,
    brows: swollen ? 'raised' : 'cross',
    browColor: hairDark,
    nose: 'big',
    mouth: 'none',
    front: [
      // ruddy cheeks and jowls, Vernon's family face
      piece(ellipse(cx - 46, cy + 26, 24, 16), '#c9707e', { ...flat, opacity: 0.5 }),
      piece(ellipse(cx + 46, cy + 26, 24, 16), '#c9707e', { ...flat, opacity: 0.5 }),
      piece(ellipse(cx - 34, cy + 56, 28, 13), skin, flat),
      piece(ellipse(cx + 34, cy + 56, 28, 13), skin, flat),
      // short grey-brown hair, waved flat and stiff
      piece(curve([[cx - 70, cy - 12], [cx - 62, cy - 52], [cx, cy - 64], [cx + 62, cy - 52], [cx + 70, cy - 12], [cx + 44, cy - 40], [cx, cy - 42], [cx - 44, cy - 40]], 2), hair),
      ink([[cx - 44, cy - 52], [cx - 16, cy - 60]], { width: 2.2, color: hairDark, opacity: 0.7 }),
      ink([[cx + 14, cy - 60], [cx + 44, cy - 52]], { width: 2.2, color: hairDark, opacity: 0.7 }),
      // the mouth: a bossy wide one, or a round surprised O when swollen
      ...talkingMouth(
        swollen
          ? [piece(ellipse(cx, cy + 56, 11, 13), C.redDark, flat), piece(ellipse(cx, cy + 62, 6, 4), C.rose, { edge: 'clean', fibre: false, shadow: false })]
          : [ink([[cx - 18, cy + 56], [cx, cy + 60], [cx + 18, cy + 56]], { width: 3.5, color: C.redDark })],
        [
          piece(ellipse(cx, cy + 58, swollen ? 16 : 22, swollen ? 19 : 13), C.redDark, flat),
          ...(swollen ? [] : [piece(rect(cx - 15, cy + 49, 30, 5, 1), C.white, { edge: 'clean', shadow: false })]),
          piece(ellipse(cx, cy + 66, swollen ? 9 : 11, 4), C.rose, { edge: 'clean', fibre: false, shadow: false }),
        ],
      ),
      // a little moustache, much smaller than her brother's
      fluff([[cx - 2, cy + 36], [cx - 22, cy + 32], [cx - 42, cy + 38], [cx - 46, cy + 48], [cx - 26, cy + 48], [cx - 2, cy + 45]], hair, 6),
      fluff([[cx + 2, cy + 36], [cx + 22, cy + 32], [cx + 42, cy + 38], [cx + 46, cy + 48], [cx + 26, cy + 48], [cx + 2, cy + 45]], hair, 6),
      // pearl earrings
      dot(cx - rx - 8, cy + 26, 6, '#f6f1e6'),
      dot(cx + rx + 8, cy + 26, 6, '#f6f1e6'),
    ],
    extra: [
      // right arm, swung from the shoulder; stiffly out when swollen
      swollen
        ? group({ part: 'armR', origin: [230, 214] }, [
            piece(band([[230, 214], [274, 142]], 38), tweed),
            piece(circle(282, 130, 17), skin),
            ...[-8, 0, 8].map((dx) => ink([[282 + dx, 124], [282 + dx * 1.6, 112]], { width: 2, color: skinDark })),
          ])
        : group({ part: 'armR', origin: [240, 252] }, [
            piece(band([[240, 252], [272, 318]], 52), tweed),
            piece(band([[262, 302], [276, 324]], 54), tweedDark, { edge: 'cut', fibre: false }),
            piece(circle(276, 334, 22), skin),
            ...[-8, 0, 8].map((dx) => ink([[276 + dx, 326], [276 + dx, 344]], { width: 1.8, color: skinDark })),
          ]),
    ],
  });
}

export const auntMarge = (): string => marge(false);
export const auntMargeSwollen = (): string => marge(true);

// ---------------------------------------------------------------------------
// Ripper: Aunt Marge's bulldog, wrinkly, bandy-legged and bad-tempered
// ---------------------------------------------------------------------------

export function ripper(): string {
  const fawn = '#c99a68';
  const fawnDark = '#9a6c42';
  const patch = '#7e5434';
  const cream = '#ecd9b4';
  const [hx, hy] = [122, 166];
  const eye = (x: number) => [
    piece(ellipse(x, hy - 14, 10, 8), C.white, flat),
    piece(circle(x, hy - 12, 5), '#3a2a1c', { edge: 'clean', shadow: false }),
    dot(x - 1.5, hy - 14, 1.6, C.white),
    // a heavy bad-tempered lid over the top half of each eye
    piece(poly([[x - 13, hy - 14], [x + 13, hy - 22], [x + 12, hy - 15], [x - 12, hy - 8]].map(([a, b]) => [a, b] as [number, number])), fawnDark, flat),
  ];
  return svg({ w: 300, h: 340, name: 'hogwarts-ripper', label: 'Ripper', className: 'portrait' }, [
    group({ part: 'figure' }, [
      // the stub of a tail, behind everything
      group({ part: 'tail', origin: [276, 214] }, [piece(band([[268, 218], [286, 194]], 16), fawn), piece(circle(287, 192, 8), fawnDark)]),
      // hind leg and haunch
      piece(ellipse(236, 250, 54, 50), fawn),
      piece(band([[240, 280], [262, 306], [250, 334]], 30), fawn),
      piece(ellipse(246, 336, 26, 10), cream, { edge: 'cut', fibre: false }),
      // the long, low barrel of a body, brown patch on the back
      piece(ellipse(196, 224, 96, 62), fawn),
      piece(ellipse(220, 200, 46, 26, -8), patch, { ...flat, opacity: 0.85 }),
      // the great barrel chest, white, under the head
      piece(ellipse(110, 258, 56, 48), cream),
      // front bandy legs: bowed right out at the knees
      piece(band([[80, 270], [52, 302], [66, 332]], 28), fawn),
      piece(ellipse(66, 336, 26, 10), cream, { edge: 'cut', fibre: false }),
      piece(band([[142, 270], [170, 302], [156, 332]], 28), fawn),
      piece(ellipse(158, 336, 26, 10), cream, { edge: 'cut', fibre: false }),
      // studded collar
      piece(band([[56, 226], [124, 244], [190, 228]], 20), '#3a2a22', { edge: 'cut', fibre: false }),
      ...[70, 92, 114, 136, 158, 178].map((x, i) => piece(circle(x, 238 + Math.sin((i / 5) * Math.PI) * 6 + (i < 1 ? -4 : 0), 4.4), '#d9d9d2', { edge: 'clean', shadow: false })),
      // the head: wide, wrinkled and wearing a scowl
      group({ part: 'head', origin: [hx, hy + 50] }, [
        // folded rose ears on top
        piece(poly([[hx - 66, hy - 36], [hx - 54, hy - 78], [hx - 24, hy - 52]]), patch, { fibre: false }),
        piece(poly([[hx + 66, hy - 36], [hx + 54, hy - 78], [hx + 24, hy - 52]]), patch, { fibre: false }),
        piece(ellipse(hx, hy, 76, 66), fawn),
        // a white blaze down the middle and brown patch over one eye
        piece(poly([[hx - 12, hy - 62], [hx + 12, hy - 62], [hx + 18, hy + 10], [hx - 18, hy + 10]]), cream, { edge: 'torn' }),
        piece(ellipse(hx + 36, hy - 20, 22, 20), patch, { ...flat, opacity: 0.85 }),
        // forehead wrinkles
        ink([[hx - 40, hy - 40], [hx - 14, hy - 46]], { width: 2.4, color: fawnDark }),
        ink([[hx + 14, hy - 46], [hx + 40, hy - 38]], { width: 2.4, color: fawnDark }),
        ink([[hx - 32, hy - 32], [hx - 10, hy - 36]], { width: 2.4, color: fawnDark, opacity: 0.7 }),
        ...eye(hx - 30),
        ...eye(hx + 30),
        group({ part: 'lids', opacity: 0 }, [-30, 30].flatMap((dx) => [
          piece(ellipse(hx + dx, hy - 14, 12, 10), fawnDark, flat),
          ink([[hx + dx - 10, hy - 12], [hx + dx, hy - 8], [hx + dx + 10, hy - 12]], { width: 2.4, color: C.ink }),
        ])),
        // the big pale muzzle with a flat black nose
        piece(ellipse(hx, hy + 24, 54, 34), cream),
        piece(ellipse(hx, hy + 4, 24, 15), '#2a2220', { edge: 'cut', fibre: false }),
        dot(hx - 6, hy, 3.4, '#6a5a52'),
        ink([[hx - 2, hy + 14], [hx - 2, hy + 24]], { width: 2.4, color: '#4a3a2e' }),
        // hanging jowls drooping over the jaw
        piece(ellipse(hx - 38, hy + 38, 26, 22), cream, { edge: 'cut', fibre: false }),
        piece(ellipse(hx + 38, hy + 38, 26, 22), cream, { edge: 'cut', fibre: false }),
        // the mouth: shut with the underbite teeth poking up, or open and barking
        ...talkingMouth(
          [
            ink([[hx - 44, hy + 30], [hx - 20, hy + 40], [hx, hy + 34], [hx + 20, hy + 40], [hx + 44, hy + 30]], { width: 3.2, color: '#4a2a22' }),
            piece(poly([[hx - 24, hy + 38], [hx - 16, hy + 38], [hx - 20, hy + 26]]), C.white, { edge: 'clean', shadow: false }),
            piece(poly([[hx + 16, hy + 38], [hx + 24, hy + 38], [hx + 20, hy + 26]]), C.white, { edge: 'clean', shadow: false }),
            // a string of slobber
            ink([[hx + 40, hy + 44], [hx + 44, hy + 58], [hx + 42, hy + 70]], { width: 2.2, color: '#cfe0ea' }),
            dot(hx + 42, hy + 74, 4, '#cfe0ea'),
          ],
          [
            piece(ellipse(hx, hy + 44, 40, 28), '#5a1f24', flat),
            piece(rect(hx - 28, hy + 24, 56, 7, 2), C.white, { edge: 'clean', shadow: false }),
            piece(poly([[hx - 26, hy + 64], [hx - 16, hy + 64], [hx - 21, hy + 50]]), C.white, { edge: 'clean', shadow: false }),
            piece(poly([[hx + 16, hy + 64], [hx + 26, hy + 64], [hx + 21, hy + 50]]), C.white, { edge: 'clean', shadow: false }),
            piece(ellipse(hx, hy + 62, 22, 9), '#e08a8c', { edge: 'clean', fibre: false, shadow: false }),
            ink([[hx + 30, hy + 70], [hx + 34, hy + 84], [hx + 32, hy + 94]], { width: 2.2, color: '#cfe0ea' }),
            dot(hx + 32, hy + 98, 4, '#cfe0ea'),
          ],
        ),
      ]),
    ]),
  ]);
}
