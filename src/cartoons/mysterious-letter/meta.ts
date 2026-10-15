import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'mysterious-letter',
  title: 'The Mysterious Letter',
  world: 'hogwarts',
  summary: 'Hedwig brings Harry a letter with nothing written on it. Jasper helps bring the hidden words back, and helps Harry stand up to Voldemort in the Forbidden Forest on the way to a surprise.',
  thumb: 'common-room',
  added: '2026-10-15',
  ledger: {
    problem: 'a mysterious letter comes with no name and no words, and Voldemort wants it',
    villain: 'voldemort',
    places: ['forbidden-forest', 'common-room', 'castle-grounds', 'hagrids-hut'],
    cast: ['harry', 'hermione', 'hedwig', 'voldemort', 'hagrid'],
    turns: ['tap the letter to bring back the invisible ink', 'tap Harry’s wand to cast Expelliarmus'],
    jokes: ['Hagrid’s rock cakes', 'Voldemort hates parties'],
    ending: 'birthday party',
  },
});
