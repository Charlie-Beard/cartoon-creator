import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'goblin-market',
  title: 'The Goblin Market',
  world: 'wishing',
  summary: 'One morning the Wishing-Chair is gone: a sly pedlar whistled it away in the night to sell at the Goblin Market. The friends float after it under Jigs’s umbrella, and when Jigs whistles the chair’s favourite tune it wriggles free of its rope and flies them home.',
  thumb: 'goblin-market',
  added: '2026-10-26',
  ledger: {
    problem: 'a sly pedlar has stolen the Wishing-Chair in the night to sell it at the Goblin Market',
    villain: 'slyboots',
    places: ['goblin-market', 'playroom', 'wishing-sky'],
    cast: ['mollie', 'peter', 'jigs', 'slyboots'],
    jokes: ['Got any MONEY? Then SHOO!', 'the chair’s favourite whistled tune'],
    ending: 'a little bell on the door, and Jigs asleep on the chair',
  },
});
