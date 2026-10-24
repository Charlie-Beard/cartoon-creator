import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'monster-book',
  title: 'The Book That Bites',
  world: 'hogwarts',
  summary: 'Harry spends the summer in Diagon Alley eating free ice creams, and has to buy the Monster Book of Monsters, which snaps and scuttles round the bookshop until a note from Hagrid tells him the trick: stroke the spine.',
  thumb: 'flourish-and-blotts',
  added: '2026-10-18',
  ledger: {
    problem: 'Harry needs the Monster Book of Monsters, and it snaps, scuttles and won’t be caught',
    villain: 'a snapping book (a grumpy puppy, really)',
    places: ['flourish-and-blotts', 'diagon-alley'],
    cast: ['harry', 'ron', 'hermione', 'fortescue', 'bookManager', 'monsterBook', 'hedwig', 'crookshanks'],
    jokes: ['free ice cream every day', 'the manager’s enormous gloves', 'Crookshanks sits on Ron’s head'],
    ending: 'ice creams in the sunshine',
  },
});
