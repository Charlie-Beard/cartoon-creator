/**
 * The Hinkypunk (book 3; original art): a frail little one-legged creature
 * made of curling smoke, see-through pale grey-blue. Big sly yellow-green
 * eyes under heavy half-closed lids, a sneaky lopsided grin, wispy hair that
 * streams up like smoke, and one thin leg to hop on. It holds up a little
 * lantern on a pole to tempt people off the path. It is sneaky, not scary.
 *
 * The smoke is made of overlapping translucent torn pieces; the face is
 * solid so it stays easy to read.
 *
 * Parts: figure (everything), head (origin 150, 230), lids, mouth,
 * mouthOpen (the usual) and `lantern`: the pole and lantern as one group,
 * origin at the hand (222, 252) so it can swing; the pole runs from the hand
 * up to y 90 and the lantern hangs from a hook at about (264, 130).
 * Inside the lantern group is `glow` (origin 264, 130): a soft yellow-green
 * light, radius 36, for a script to fade.
 *
 * Layout in the 300 × 340 box: face inside 78 62 144 144 (eyes at y 128,
 * grin at y 176), smoky shoulders at y 232, the body narrows to one leg at
 * x 150, y 296-326 and a pointed foot on the ground at y 332.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';
import { H, W } from './people';

const SMOKE = '#aebfd2';
const SMOKE_MID = '#9db0c8';
const SMOKE_DARK = '#7f93ae';
const SMOKE_LIGHT = '#d3deea';
const LIGHT = '#d8e86a';
const WOOD = '#6b4a32';

const wisp = (pts: Pt[], fill = SMOKE, opacity = 0.7): Node =>
  piece(curve(pts, 2), fill, { fibre: false, shadow: false, opacity });

/** A curl of smoke: a spiral drawn as an ink line. */
function swirl(cx: number, cy: number, r0: number, turns: number, color = SMOKE_LIGHT, width = 3): Node {
  const pts: Pt[] = [];
  const n = Math.round(turns * 10);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = r0 * (1 - t * 0.85);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return ink(pts, { width, color, opacity: 0.8 });
}

/** The heavy sly lid: the top part of an eye, slanted. */
function slyLid(x: number, y: number, rx: number, ry: number, tilt: number): Node {
  const pts: Pt[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = (i / 8) * Math.PI;
    pts.push([x - Math.cos(t) * rx * 1.08, y - Math.sin(t) * ry * 1.1]);
  }
  pts.push([x + rx * 1.08, y - ry * 0.1 + tilt]);
  pts.push([x - rx * 1.08, y - ry * 0.1 - tilt]);
  return piece(poly(pts), SMOKE_MID, { edge: 'cut', fibre: false, shadow: false });
}

export function hinkypunk(): string {
  const eye = (x: number, tilt: number): Node[] => [
    piece(ellipse(x, 130, 22, 17), '#eef3d0', { edge: 'cut', fibre: false }),
    piece(circle(x + 3, 133, 11.5), LIGHT, { edge: 'clean', fibre: false, shadow: false }),
    piece(ellipse(x + 3, 133, 3.2, 9), C.ink, { edge: 'clean', fibre: false, shadow: false }),
    dot(x - 2, 127, 3, C.white),
    dot(x + 9, 137, 1.8, C.white),
    slyLid(x, 130, 22, 17, tilt),
  ];

  const lantern = group({ part: 'lantern', origin: [222, 252] }, [
    // the pole, leaning a little, with the hand's grip at the bottom
    piece(band([[218, 306], [226, 252], [240, 150], [250, 96]], 7), WOOD, { edge: 'cut', fibre: false }),
    // hook and chain
    ink([[250, 96], [262, 88], [270, 100], [264, 108]], { width: 3, color: C.charcoal }),
    ink([[264, 108], [264, 114]], { width: 2.5, color: C.charcoal }),
    group({ part: 'glow', origin: [264, 134], opacity: 1 }, [
      (): string =>
        `<defs><radialGradient id="hinky-glow"><stop offset="0" stop-color="${LIGHT}" stop-opacity="0.95"/><stop offset="0.45" stop-color="${LIGHT}" stop-opacity="0.45"/><stop offset="1" stop-color="${LIGHT}" stop-opacity="0"/></radialGradient></defs>` +
        `<circle cx="264" cy="134" r="38" fill="url(#hinky-glow)"/>`,
    ]),
    // the lantern: cap, glass, frame and base
    piece(poly([[250, 116], [278, 116], [270, 106], [258, 106]]), C.charcoal, { edge: 'cut', fibre: false }),
    piece(poly([[252, 116], [276, 116], [274, 150], [254, 150]]), '#f6f2a8', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(264, 134, 6, 9), '#ffffe0', { edge: 'clean', fibre: false, shadow: false, opacity: 0.9 }),
    ink([[264, 116], [264, 150]], { width: 2.5, color: C.charcoal }),
    ink([[252, 116], [254, 150]], { width: 3, color: C.charcoal }),
    ink([[276, 116], [274, 150]], { width: 3, color: C.charcoal }),
    piece(poly([[250, 150], [278, 150], [274, 158], [254, 158]]), C.charcoal, { edge: 'cut', fibre: false }),
  ]);

  return svg({ w: W, h: H, name: 'hogwarts-hinkypunk', label: 'the Hinkypunk', className: 'portrait' }, [
    group({ part: 'figure' }, [
      // trailing curls of smoke behind
      wisp([[120, 252], [84, 256], [56, 272], [48, 290], [72, 284], [100, 280], [132, 276]], SMOKE_MID, 0.5),
      wisp([[180, 254], [214, 262], [236, 276], [228, 288], [204, 280], [176, 274]], SMOKE_MID, 0.45),
      swirl(52, 288, 11, 1.5),
      swirl(231, 283, 9, 1.4),
      // the body: a shoulder cloud narrowing to a waist
      wisp([[92, 244], [114, 226], [150, 222], [186, 226], [208, 244], [196, 278], [168, 302], [150, 304], [132, 302], [104, 278]], SMOKE, 0.78),
      wisp([[112, 250], [150, 240], [190, 250], [176, 284], [150, 298], [126, 284]], SMOKE_LIGHT, 0.55),
      swirl(128, 266, 12, 1.4),
      swirl(176, 262, 10, 1.3),
      // the one thin leg, with a pointed foot, mid-hop
      piece(band([[152, 298], [146, 316], [150, 326]], 12), SMOKE_MID, { fibre: false, shadow: false, opacity: 0.85 }),
      wisp([[140, 326], [166, 324], [186, 332], [162, 336], [140, 334]], SMOKE_DARK, 0.85),
      // left arm: a thin wisp drooping, with spindly fingers
      piece(band([[104, 246], [80, 270], [76, 296]], 11), SMOKE_MID, { fibre: false, shadow: false, opacity: 0.8 }),
      ...[-10, 0, 10].map((d) => ink([[76, 296], [76 + d * 0.9, 312]], { width: 3, color: SMOKE_MID })),
      // right arm, up to the pole
      piece(band([[196, 246], [212, 254], [222, 252]], 11), SMOKE_MID, { fibre: false, shadow: false, opacity: 0.85 }),

      group({ part: 'head', origin: [150, 230] }, [
        // wispy hair streaming up and back like smoke
        wisp([[106, 84], [96, 56], [106, 32], [114, 54], [124, 78]], SMOKE_MID, 0.7),
        wisp([[138, 72], [144, 40], [158, 20], [160, 46], [158, 72]], SMOKE, 0.75),
        wisp([[172, 76], [188, 46], [210, 38], [198, 60], [190, 86]], SMOKE_MID, 0.7),
        wisp([[84, 124], [48, 108], [30, 86], [56, 92], [86, 100]], SMOKE_MID, 0.6),
        swirl(98, 36, 9, 1.4),
        swirl(207, 40, 8, 1.4),
        // a long, thin, wispy head
        piece(curve([[88, 136], [92, 86], [150, 66], [208, 86], [212, 136], [194, 196], [150, 212], [106, 196]], 2), SMOKE, { fibre: false, opacity: 0.92 }),
        wisp([[104, 100], [150, 84], [196, 100], [190, 130], [150, 118], [110, 130]], SMOKE_LIGHT, 0.5),
        // sly eyes
        ...eye(120, 4),
        ...eye(180, -4),
        group({ part: 'lids', opacity: 0 }, [120, 180].flatMap((x) => [
          piece(ellipse(x, 130, 24, 19), SMOKE, { edge: 'cut', fibre: false, shadow: false }),
          ink([[x - 16, 133], [x, 139], [x + 16, 133]], { width: 3, color: SMOKE_DARK }),
        ])),
        // one brow cocked
        ink([[98, 108], [120, 98], [142, 108]], { width: 3.2, color: SMOKE_DARK }),
        ink([[162, 112], [182, 104], [204, 110]], { width: 3.2, color: SMOKE_DARK }),
        // a tiny hooked nose
        ink([[150, 140], [147, 156], [155, 158]], { width: 3, color: SMOKE_DARK }),

        // sneaky lopsided grin, shut ...
        group({ part: 'mouth' }, [
          ink([[112, 180], [132, 190], [158, 190], [182, 174], [194, 164]], { width: 3.6, color: '#45566f' }),
          ink([[194, 164], [198, 172]], { width: 3, color: '#45566f' }),
          piece(poly([[140, 190], [148, 190], [144, 199]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
          piece(poly([[162, 188], [170, 184], [168, 194]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
        ]),
        // ... and open (for the whispery giggle)
        group({ part: 'mouthOpen', opacity: 0 }, [
          piece(curve([[112, 178], [132, 188], [160, 188], [184, 172], [196, 164], [190, 192], [162, 208], [134, 204]], 2), '#45566f', { edge: 'cut', fibre: false, shadow: false }),
          piece(poly([[140, 188], [150, 188], [145, 198]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
          piece(poly([[166, 184], [176, 178], [172, 190]]), C.white, { edge: 'clean', fibre: false, shadow: false }),
        ]),
      ]),
      lantern,
    ]),
  ]);
}
