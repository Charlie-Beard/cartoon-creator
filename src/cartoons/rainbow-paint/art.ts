/**
 * One-off art for "The Grey Rainbow": the grey rainbow seen through the
 * playroom doors, the three paint pots, the dollops and the mixing palette,
 * the red splash on Peter's nose, the cloud Mother Dabble stands on, the
 * streaks of sideways rain, and the little rainbow in the window.
 */
import { band, C, cached, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../kit';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false as const };

/** The seven colours of the rainbow, outside in (red is the top stripe). */
export const COLOURS = ['#e0453a', '#f08a30', '#f4cf3c', '#58b05a', '#3f8fd0', '#4a5bb8', '#9b5cc4'];
export const RED = COLOURS[0];
export const ORANGE = COLOURS[1];
export const YELLOW = COLOURS[2];
export const GREEN = COLOURS[3];
export const BLUE = COLOURS[4];
export const PURPLE = COLOURS[6];

/** An arc of stripes, centre (cx, cy), the outermost stripe radius r0, stripes `w` wide, from angle a0 to a1 (degrees, 180 = left). */
function arcs(cx: number, cy: number, r0: number, w: number, a0: number, a1: number, colour: (i: number) => string, o: { shadow?: boolean } = {}): Node[] {
  return Array.from({ length: 7 }, (_, i) => {
    const r = r0 - i * (w - 1);
    const pts: Pt[] = [];
    for (let s = 0; s <= 14; s++) {
      const a = ((a0 + ((a1 - a0) * s) / 14) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return piece(band(pts, w), colour(i), { edge: 'cut', fibre: false, shadow: !!o.shadow && i === 0, rough: 0.5 });
  });
}

/**
 * The grey rainbow in the open doorway of the playroom (the doorway's glass
 * x 892–1140, y 160–640 on the backdrop): place it at x 892, y 160, w 248.
 * Drawn with a cropped viewBox 892 160 248 480, so it shows only the doorway.
 */
export const greyBow = cached(() => {
  const greys = ['#b7bcc4', '#a8adb6', '#bfc4cb', '#aeb3bc', '#b9bec6', '#a6abb4', '#bcc1c8'];
  return svg({ w: 248, h: 480, name: 'rainbow-paint-grey-bow', label: 'A grey rainbow', boil: false }, [
    group({ part: 'bow' }, arcs(1180, 600, 380, 15, 180, 270, (i) => greys[i]).map((n) => n)),
  ]).replace(/viewBox="[^"]*"/, 'viewBox="892 160 248 480"');
});

/** A little round paint pot: a dumpy jar with a rim, a handle and a drip of colour. 110 × 120. */
export const pot = cached((colour: string, name: string) =>
  svg({ w: 110, h: 120, name: `rainbow-paint-pot-${name}`, label: 'A paint pot' }, [
    piece(curve([[16, 40], [94, 40], [100, 100], [92, 112], [18, 112], [10, 100]], 2), '#c9a36a'),
    piece(ellipse(55, 40, 42, 12), '#8a6a3a'),
    piece(ellipse(55, 40, 36, 8), colour, flat),
    // a drip over the rim
    piece(poly([[40, 44], [52, 44], [51, 70], [46, 76], [41, 70]]), colour, flat),
    piece(ellipse(55, 40, 12, 3), '#ffffff', { ...flat, opacity: 0.35 }),
    ink([[16, 66], [94, 66]], { width: 4, color: '#a07c48', opacity: 0.7 }),
    ink([[12, 56], [2, 66], [6, 84], [18, 90]], { width: 5, color: '#8a6a3a', wobble: 0.2 }),
  ]),
);

/** A blob of wet paint. 70 × 56. */
export const dollop = cached((colour: string, name: string) =>
  svg({ w: 70, h: 56, name: `rainbow-paint-dollop-${name}`, label: 'A dollop of paint' }, [
    piece(curve([[8, 34], [14, 14], [36, 8], [58, 14], [64, 34], [50, 48], [20, 48]], 2), colour, { rough: 0.8 }),
    piece(ellipse(26, 20, 10, 5, -20), '#ffffff', { ...flat, opacity: 0.4 }),
    dot(50, 34, 3, '#ffffff', 0.3),
  ]),
);

/** Mother Dabble's wooden palette, with a thumb-hole and a smooth middle for mixing. 300 × 190. */
export const palette = cached(() =>
  svg({ w: 300, h: 190, name: 'rainbow-paint-palette', label: 'A mixing palette' }, [
    piece(curve([[16, 90], [40, 30], [140, 10], [250, 26], [292, 80], [270, 150], [180, 178], [70, 166]], 3), '#d3a566'),
    piece(ellipse(150, 90, 100, 52), '#e9cc9a', { ...flat, opacity: 0.8 }),
    piece(ellipse(52, 100, 12, 9), '#7d5a2e', flat),
    ink([[40, 60], [80, 36]], { width: 3, color: '#b08846', opacity: 0.6 }),
  ]),
);

/** A splash of red on a nose. 34 × 30. */
export const splash = cached((colour: string) =>
  svg({ w: 34, h: 30, name: `rainbow-paint-splash-${colour}`, label: 'A splash of paint' }, [
    piece(curve([[4, 18], [8, 6], [20, 2], [30, 10], [30, 22], [16, 28]], 2), colour, { ...flat, rough: 0.8 }),
    dot(30, 4, 2.4, colour),
    dot(3, 8, 2, colour),
  ]),
);

/** A bank of white cloud for someone to stand on. 420 × 150. */
export const cloudBank = cached(() =>
  svg({ w: 420, h: 150, name: 'rainbow-paint-cloud-bank', label: 'A cloud' }, [
    piece(ellipse(210, 96, 200, 40), C.cloudShade, { shadow: false, fibre: false }),
    ...[[60, 84, 46], [130, 66, 56], [206, 56, 62], [284, 66, 56], [352, 84, 46], [210, 92, 70]].map(([x, y, r], i) => piece(circle(x, y, r), i % 2 ? '#ffffff' : '#f2f6fa', { rough: 1.2, shadow: i < 5 })),
  ]),
);

/** A long, thin streak of blown rain. 150 × 26. */
export const streak = cached(() =>
  svg({ w: 150, h: 26, name: 'rainbow-paint-streak', label: 'Blown rain', boil: false }, [ink([[4, 20], [60, 12], [146, 4]], { width: 3, color: '#cfdcea', opacity: 0.85, wobble: 0.2 })]),
);

/** A rainbow arch, small and bright, for the window: 260 × 140. */
export const miniBow = cached(() =>
  svg({ w: 260, h: 140, name: 'rainbow-paint-mini-bow', label: 'A tiny rainbow', boil: false }, [group({ part: 'bow' }, arcs(130, 136, 124, 12, 180, 360, (i) => COLOURS[i]))]),
);
