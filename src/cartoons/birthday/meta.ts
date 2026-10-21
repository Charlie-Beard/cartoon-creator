import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'birthday',
  title: 'A Party in the Clouds',
  world: 'faraway',
  summary: 'The Land of Birthdays is at the top of the Tree, and every visitor gets a party, so today the party is his. He starts it with a boom of the drum, lights the candles in a windy sky and makes a wish.',
  thumb: 'birthdays',
  added: '2026-10-16',
  ledger: {
    problem: 'the birthday candles won’t light in the wind at the top of the world',
    villain: 'a gusty wind that blows the spell away',
    places: ['birthdays', 'moon-room', 'tree'],
    cast: ['moonface', 'silky', 'saucepan', 'oomBoomBoom'],
    turns: ['tap the Saucepan Man’s hat (clang)', 'drag the drumstick to the drum to start the party', 'light the birthday candles', 'blow out the candles and make a wish', 'drag a balloon to the Saucepan Man'],
    jokes: ['Saucepan Man mishears', 'the Saucepan Man’s best hat is his saucepan'],
    ending: 'floating home by balloon, and a balloon for him',
  },
});
