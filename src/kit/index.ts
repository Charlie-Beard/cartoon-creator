/**
 * Everything a cartoon script imports, in one place:
 *
 *   import { C, defineCartoon, piece, circle, svg, type Kit } from '../kit';
 */
export { defineCartoon, type Cartoon, type CartoonDef, type SceneDef } from './cartoon';
export { Kit, cloud, type PlaceOpts, type Side } from './kit';
export type { Line } from '../core/cartoon';
export type { Mood } from '../audio/synth';

/** So scripts can draw their own one-off scenery and props, and make their own sounds. */
export { C } from '../art/palette';
export { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, raw, rect, rng, svg, type Node, type Pt } from '../art/paper';
export { bell, noiseBurst, NOTE, now, tone, tune } from '../audio/synth';
