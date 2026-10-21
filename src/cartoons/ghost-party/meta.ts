import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'ghost-party',
  title: 'Nick’s Ghost Party',
  world: 'hogwarts',
  summary: 'On Hallowe’en, Nearly Headless Nick invites Harry, Ron and Hermione to his five hundredth Ghost Day party in the dungeons: blue candles, a band of musical saws and very mouldy food. Then the Headless Hunt gallops in through the wall, and Nick shows them his best trick.',
  thumb: 'ghost-party',
  added: '2026-10-18',
  ledger: {
    problem: 'Nick is never allowed to join the Headless Hunt, because his head is only nearly off',
    villain: 'sirPatrick and the Headless Hunt, who tease Nick (and cheer him in the end)',
    places: ['ghost-party', 'castle-corridor', 'great-hall'],
    cast: ['harry', 'ron', 'hermione', 'nick', 'myrtle', 'sirPatrick'],
    turns: [
      'drag Nick’s gold invitation across to Hermione',
      'bang the gong to start the ghost band',
      'tap Moaning Myrtle to wave hello',
      'tap Nick’s ruff so his head flops right over',
      'drag a pumpkin pie to Nick so he can smell it',
    ],
    jokes: ['Ron is starving', 'mouldy ghost food', 'Sir Patrick tosses his own head'],
    ending: 'pumpkin pie at the Hallowe’en feast',
  },
});
