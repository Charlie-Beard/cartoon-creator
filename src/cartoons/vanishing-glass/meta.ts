import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'vanishing-glass',
  title: 'The Vanishing Glass',
  world: 'hogwarts',
  summary: 'It’s Dudley’s birthday trip to the zoo, and Uncle Vernon warns Harry: no funny business. But in the reptile house Harry makes friends with a big snake who has never seen Brazil, and the glass of its tank simply disappears.',
  thumb: 'reptile-house',
  added: '2026-10-25',
  ledger: {
    problem: 'a big zoo snake has never been to Brazil and is stuck behind glass, and Harry has been warned: no funny business',
    villain: 'Mr Dursley going purple and looming over Harry, once, in a small scary beat',
    places: ['reptile-house', 'dursley-kitchen', 'dursley-hall', 'paper'],
    cast: ['harry', 'dudleyBig', 'vernon', 'petunia', 'boa'],
    jokes: ['Dudley counts his presents', 'the snake winks', 'Mr Dursley goes purple', 'Dudley stuck in the tank'],
    ending: 'cosy in the cupboard, and the snake sunbathing on the way to Brazil',
  },
});
