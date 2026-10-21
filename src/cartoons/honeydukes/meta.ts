import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'honeydukes',
  title: 'The Secret Way to Honeydukes',
  world: 'hogwarts',
  summary: 'Everyone is off to Hogsmeade except Harry, until Fred and George give him the Marauder’s Map. It shows a secret tunnel behind the one-eyed witch, all the way to Honeydukes sweet shop, where the Fizzing Whizbees make Ron float.',
  thumb: 'honeydukes',
  added: '2026-10-18',
  ledger: {
    problem: 'Harry isn’t allowed to go to Hogsmeade with his friends',
    villain: 'a dark tunnel and a big shadow (only a little mouse)',
    places: ['honeydukes', 'common-room', 'castle-corridor', 'secret-tunnel'],
    cast: ['harry', 'ron', 'hermione', 'fred', 'george'],
    turns: ['tap the Marauder’s Map to wake it', 'tap the one-eyed witch’s hump to open the secret way', 'tap the wand tip so Lumos fills the dark', 'drag the Pepper Imp to Ron', 'drag the Fizzing Whizbee to Ron', 'tap the map to hide it again'],
    jokes: ['Mischief managed!', 'Pepper Imps puff smoke', 'Ron floats'],
    ending: 'sweets by the common-room fire',
  },
});
