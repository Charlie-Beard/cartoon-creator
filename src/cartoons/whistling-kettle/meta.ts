import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'whistling-kettle',
  title: 'The Whistling Kettle',
  world: 'faraway',
  summary: 'The Saucepan Man’s whistling kettle has gone, and Dame Snap has it. Jasper blows away a cloud, then taps the kettle until it whistles so loudly that her ruler snaps.',
  thumb: 'moon-room',
  added: '2026-10-15',
  ledger: {
    problem: 'the Saucepan Man’s whistling kettle is gone, and Dame Snap has it',
    villain: 'dameSnap',
    places: ['snap-school', 'moon-room', 'cloud-top'],
    cast: ['moonface', 'silky', 'saucepan', 'dameSnap'],
    turns: ['tap the tin so the pop biscuits pop out', 'blow the cloud away', 'tap the kettle’s lid to make it whistle', 'drag the kettle home to the Saucepan Man', 'drag a pop biscuit to Moon-Face'],
    jokes: ['Saucepan Man mishears', 'Dame Snap’s ruler snaps', 'pop biscuits'],
    ending: 'tea party',
  },
});
