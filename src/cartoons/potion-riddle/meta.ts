import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'potion-riddle',
  title: 'The Riddle of the Bottles',
  world: 'hogwarts',
  summary: 'Deep under the trapdoor, purple fire and black fire shut Harry and Hermione in a little stone room. The way on is a riddle about seven bottles, and Hermione loves riddles. Then a golden mirror gives Harry the stone to keep it safe.',
  thumb: 'potion-chamber',
  added: '2026-10-18',
  ledger: {
    problem: 'magic fire shuts Harry and Hermione in, and only the right bottle will let them through',
    villain: 'leaping purple and black fire (and a riddle)',
    places: ['potion-chamber', 'headmasters-office'],
    cast: ['harry', 'hermione', 'ron', 'dumbledore'],
    turns: ['unroll the riddle scroll', 'find the smallest bottle', 'pass Hermione the round bottle', 'look in the golden mirror', 'pass the sherbet lemon jar'],
    jokes: ['nettle juice, yuck', 'Snape was helping?'],
    ending: 'sherbet lemons in Dumbledore’s office',
  },
});
