/**
 * The Land of Winter, where Jack Frost lives: a pale lemon winter sky with
 * thin cloud, a little ice palace far off on a blue ridge (icicles hanging
 * from its towers), rolling snowy hills in soft blue-whites, frosted fir
 * trees crowded at the left and right edges, and a wide drift of open snow
 * in front.
 *
 * Open snow x 250-950; the ground line is y 640. The firs are painted in
 * (they cannot move): left of x 230 and right of x 960. The palace sits at
 * x 700-920, y 250-470 on the far ridge, so it shows over the heads of anyone
 * on the right. The bottom band (y 690-820) is plain soft snow. Falling snow
 * is added by the script with k.ambient('snow').
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../art/paper';

const W = 1180;
const H = 820;
const SNOW = '#f6f9fc';
const SNOW_SHADE = '#d6e3f0';
const SNOW_BLUE = '#bccfe3';
const ICE = '#a9d4ea';
const ICE_DARK = '#6fa6c9';
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** A frosted fir: a trunk and four tiers, each with a cap and hanging snow. */
function fir(x: number, base: number, h: number, w: number, col: string): Node[] {
  const out: Node[] = [piece(rect(x - w * 0.06, base - h * 0.14, w * 0.12, h * 0.16), C.barkDark, flat)];
  for (let i = 0; i < 4; i++) {
    const bottom = base - h * 0.1 - i * h * 0.22;
    const top = bottom - h * 0.36;
    const hw = w * (0.5 - i * 0.1);
    out.push(piece(poly([[x - hw, bottom], [x - hw * 0.2, top + 6], [x, top], [x + hw * 0.2, top + 6], [x + hw, bottom], [x, bottom - 12]]), col, { rough: 1.1, shadow: false }));
    // snow laid along the upper edges, and a frosty rim
    out.push(
      piece(
        poly([[x - hw * 0.8, bottom - 4], [x - hw * 0.2, top + 10], [x, top + 2], [x + hw * 0.2, top + 10], [x + hw * 0.8, bottom - 4], [x + hw * 0.4, bottom - h * 0.1], [x, bottom - h * 0.06], [x - hw * 0.4, bottom - h * 0.1]]),
        SNOW,
        { rough: 0.9, shadow: false, opacity: 0.93 },
      ),
    );
  }
  return out;
}

/** A tower of the ice palace, with a pointed roof, icicles and a lit window. */
function tower(x: number, top: number, w: number, base: number): Node[] {
  const out: Node[] = [
    piece(rect(x, top, w, base - top), ICE, { rough: 0.5, shadow: false }),
    piece(rect(x + w * 0.62, top, w * 0.38, base - top), ICE_DARK, { ...flat, opacity: 0.45 }),
    piece(poly([[x - 8, top + 4], [x + w / 2, top - w * 1.5], [x + w + 8, top + 4]]), '#d9eef8', { rough: 0.5, shadow: false }),
    piece(poly([[x + w / 2, top - w * 1.5], [x + w + 8, top + 4], [x + w * 0.62, top + 4]]), ICE, { ...flat, opacity: 0.6 }),
    piece(rect(x + w * 0.34, top + w * 0.5, w * 0.3, w * 0.5, 6), '#fff2c0', flat),
  ];
  // icicles hanging from the roof's rim
  for (let i = 0; i < 5; i++) {
    const ix = x - 4 + (i + 0.5) * ((w + 8) / 5);
    const il = 16 + ((i * 7) % 3) * 10;
    out.push(piece(poly([[ix - 4, top + 3], [ix + 4, top + 3], [ix, top + 3 + il]]), '#e8f6fc', flat));
  }
  return out;
}

/** The far ice palace: a wide hall between two tall towers and a gate, on its ridge. */
function palace(): Node[] {
  return [
    // the hall
    piece(rect(722, 372, 190, 96), ICE, { rough: 0.5, shadow: false }),
    piece(rect(722, 372, 190, 14), '#e8f6fc', flat),
    ...[0, 1, 2, 3, 4].map((i) => piece(poly([[724 + i * 38, 384], [740 + i * 38, 384], [732 + i * 38, 384 + 20 + (i % 2) * 10]]), '#e8f6fc', flat)),
    // the gate: an arch of pale light
    piece(curve([[790, 468], [790, 424], [816, 404], [842, 424], [842, 468]], 2), '#fff2c0', { rough: 0.4, shadow: false }),
    ...tower(700, 300, 44, 470),
    ...tower(886, 262, 52, 470),
    ...tower(796, 330, 36, 380),
  ];
}

/** Rolling hills of snow with a blue shadow under each rise. */
function hills(): Node[] {
  return [
    // the far blue ridge the palace stands on
    piece(curve([[-40, 520], [-40, 450], [180, 430], [420, 450], [640, 456], [900, 440], [1240, 450], [1240, 520]], 2), SNOW_BLUE, { rough: 1.4, shadow: false }),
    piece(curve([[560, 482], [680, 462], [940, 452], [1100, 470], [1100, 520], [560, 520]], 2), SNOW_SHADE, { rough: 1, shadow: false }),
    // middle hills
    piece(curve([[-40, 560], [-40, 500], [160, 484], [380, 512], [560, 540], [760, 516], [1000, 500], [1240, 520], [1240, 600]], 2), SNOW_SHADE, { rough: 1.3, shadow: false }),
    piece(curve([[-40, 600], [-40, 548], [240, 530], [460, 560], [700, 548], [940, 530], [1240, 560], [1240, 640]], 2), '#e6eff8', { rough: 1.3, shadow: false }),
    // the near open snow: a wide soft drift
    piece(curve([[-40, 640], [-40, 600], [200, 590], [500, 606], [800, 592], [1000, 598], [1240, 590], [1240, 840], [-40, 840]], 2), SNOW, { rough: 1.2, shadow: false }),
    piece(rect(-20, 700, W + 40, 140), SNOW, { edge: 'clean', shadow: false, fibre: false }),
    // blue shadows in the drifts
    piece(ellipse(300, 700, 200, 16), SNOW_SHADE, { rough: 1.4, shadow: false, opacity: 0.7 }),
    piece(ellipse(860, 740, 240, 18), SNOW_SHADE, { rough: 1.4, shadow: false, opacity: 0.6 }),
    piece(ellipse(560, 780, 300, 14), SNOW_SHADE, { rough: 1.4, shadow: false, opacity: 0.5 }),
  ];
}

export const snowLand = cached(() => {
  const r = rng(1226);
  const sparkles: Node[] = [];
  for (let i = 0; i < 26; i++) sparkles.push(dot(210 + r() * 760, 600 + r() * 90, 1.4 + r() * 1.6, '#ffffff', 0.7));
  return svg({ w: W, h: H, name: 'wishing-snow-land', boil: false, className: 'backdrop' }, [
    // pale lemon winter sky, a little greyer high up, paler at the horizon
    piece(rect(-20, -20, W + 40, H + 40), '#e7ecd0', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, -20, W + 40, 190), '#d8e2cf', { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.8 }),
    piece(rect(-20, 300, W + 40, 200), '#f6f0cf', { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.8 }),
    // thin pale clouds and a weak, low sun
    piece(circle(350, 190, 46), '#fbf3c4', { edge: 'clean', shadow: false, fibre: false, opacity: 0.85 }),
    piece(ellipse(180, 120, 150, 14), '#f7f6ec', { ...flat, edge: 'torn', opacity: 0.8 }),
    piece(ellipse(520, 90, 170, 12), '#f7f6ec', { ...flat, edge: 'torn', opacity: 0.7 }),
    piece(ellipse(980, 150, 130, 12), '#f7f6ec', { ...flat, edge: 'torn', opacity: 0.7 }),
    ...hills(),
    // the ice palace stands on the far ridge, over the hills
    ...palace(),
    // a fold of snow over the palace's feet
    piece(curve([[660, 480], [760, 466], [900, 462], [1000, 476], [1000, 500], [660, 500]], 2), '#e6eff8', { rough: 1, shadow: false }),
    // frosted firs: a wood at each edge, big at the front, smaller behind
    ...fir(40, 560, 200, 150, C.greenDeep),
    ...fir(170, 548, 170, 120, '#355c4a'),
    ...fir(1130, 566, 210, 150, C.greenDeep),
    ...fir(1010, 552, 170, 120, '#355c4a'),
    ...fir(100, 640, 330, 230, C.greenDark),
    ...fir(1090, 640, 310, 220, C.greenDark),
    ...fir(-10, 660, 380, 240, C.greenDeep),
    // the near drift again, laid over the feet of the trees
    piece(curve([[-40, 650], [-40, 628], [120, 626], [230, 640], [250, 660], [-40, 670]], 2), SNOW, { rough: 1, shadow: false }),
    piece(curve([[960, 660], [980, 638], [1080, 626], [1240, 628], [1240, 670], [960, 670]], 2), SNOW, { rough: 1, shadow: false }),
    ...sparkles,
    ink([[240, 668], [320, 662]], { width: 2, color: SNOW_SHADE, opacity: 0.6, wobble: 1 }),
  ]);
});
