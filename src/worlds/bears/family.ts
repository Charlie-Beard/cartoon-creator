/**
 * Bear Cottage's family: Teddy and his Mummy and Daddy.
 *
 * Teddy wears his red jumper with the yellow stripes and a white collar,
 * every time: it is how he is found in a crowd of bears. Mummy has her blue
 * spotted dress, striped sleeves and white apron; Daddy his cream waistcoat,
 * checked shirt and red spotted bow tie.
 */
import { pen } from '../../art/watercolour';
import { apron, bear, bowTie, collar, dress, FUR, top, waistcoat, type BearOpts } from './parts';

const RED = '#c8433a';
const YELLOW = '#f0c43c';
const WHITE = '#f6f1e6';

/** Teddy's own options, so his poses only change what moves. */
const teddyBase = (): BearOpts => ({
  name: 'teddy',
  label: 'Teddy',
  fur: FUR.honey,
  sleeve: RED,
  cuff: YELLOW,
  clothes: top(RED, { stripes: { color: YELLOW, at: [244, 282], width: 20 }, collar: WHITE }),
});

export const teddy = (): string => bear(teddyBase());
export const teddyWave = (): string => bear({ ...teddyBase(), name: 'teddy-wave', arms: 'wave', mouth: 'grin' });
export const teddyFly = (): string => bear({ ...teddyBase(), name: 'teddy-fly', arms: 'out', legs: 'walk', mouth: 'grin', eyes: 'happy' });
export const teddySit = (): string => bear({ ...teddyBase(), name: 'teddy-sit', legs: 'sit', arms: 'out', mouth: 'o', eyes: 'wide', brows: 'raised' });
export const teddySad = (): string => bear({ ...teddyBase(), name: 'teddy-sad', mouth: 'frown', brows: 'worried', tilt: -6 });
export const teddyCross = (): string => bear({ ...teddyBase(), name: 'teddy-cross', arms: 'hips', mouth: 'frown', brows: 'cross' });
export const teddyHappy = (): string => bear({ ...teddyBase(), name: 'teddy-happy', arms: 'up', eyes: 'happy', mouth: 'grin' });

const BLUE = '#7c9fd0';

const mummyBase = (): BearOpts => ({
  name: 'mummy-bear',
  label: 'Mummy Bear',
  fur: FUR.golden,
  snout: 1.12,
  sleeve: '#a9c2e4',
  cuff: WHITE,
  clothes: [...dress(BLUE, { spots: WHITE, bodice: '#3b3040' }), ...apron(), ...collar(WHITE)],
  legs: 'hidden',
});

export const mummyBear = (): string => bear(mummyBase());
export const mummyBearHold = (): string => bear({ ...mummyBase(), name: 'mummy-bear-hold', arms: 'hold' });
export const mummyBearWave = (): string => bear({ ...mummyBase(), name: 'mummy-bear-wave', arms: 'wave', mouth: 'grin' });

const daddyBase = (): BearOpts => ({
  name: 'daddy-bear',
  label: 'Daddy Bear',
  fur: FUR.toffee,
  snout: 1.2,
  sleeve: '#dfe7f0',
  cuff: '#dfe7f0',
  clothes: [...waistcoat('#ead9a8', '#dfe7f0'), ...[146, 154].map((x) => pen([[x, 200], [x, 312]], { width: 1.4, color: '#6f93c6', opacity: 0.8 })), ...bowTie('#c8433a')],
});

export const daddyBear = (): string => bear(daddyBase());
