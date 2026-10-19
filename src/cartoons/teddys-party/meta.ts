import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'teddys-party',
  title: 'Teddy’s Birthday Party',
  world: 'bears',
  summary: 'From the Teddy Bear Treasury: at Aunt Bertha Bear’s birthday party, Grandpa’s Mr Punch puppet is squashed, so Teddy saves the show by being Marmaduke, Grandpa’s talking dummy. Jasper opens the show’s curtains and blows out the candles.',
  thumb: 'bear-garden',
  added: '2026-10-18',
  ledger: {
    problem: 'Grandpa’s Mr Punch puppet is squashed, so there is no birthday show',
    villain: 'a broken puppet, and no show for the party',
    places: ['bear-garden'],
    cast: ['teddy', 'mummyBear', 'grandpaBear', 'auntBertha', 'barney', 'marmaduke'],
    turns: ['open the show’s starry curtains', 'blow out Aunt Bertha’s birthday candles'],
    jokes: ['Who’s Marmaduke?', 'Marmaduke’s squeaky voice is really Grandpa’s'],
    ending: 'birthday cake and a laugh',
  },
});
