import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'peeves',
  title: 'Peeves the Poltergeist',
  world: 'hogwarts',
  summary: 'On their first night at Hogwarts, Peeves the poltergeist plays tricks on Harry and his friends, and steals Neville’s toad. Only one ghost can make him behave: the Baron.',
  thumb: 'castle-corridor',
  added: '2026-10-16',
  ledger: {
    problem: 'Peeves the poltergeist plays tricks on the first-years and steals Neville’s toad',
    villain: 'peeves, and the Baron, who looks scary but is on their side',
    places: ['castle-corridor', 'classroom', 'potions-dungeon', 'common-room'],
    cast: ['harry', 'ron', 'neville', 'nick', 'peeves', 'baron'],
    turns: ['tap the floating sticks so Peeves has to show himself', 'tap Trevor so he croaks', 'ring the Baron’s bell', 'drag Trevor down to Neville', 'drag the teddy over to Neville for bed'],
    jokes: ['Peeves blows a raspberry', 'Ickle firsties!'],
    ending: 'cosy by the fire, and one last tiny raspberry',
  },
});
