import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'teddy-flying',
  title: 'Teddy Goes Flying',
  world: 'bears',
  summary: 'Teddy wants to fly like the birds, but bears haven’t got wings. He jumps off Honeypot Hill, lands SPLAT in the muddy stream, and Uncle Bill’s helicopter flies him home on a rope.',
  thumb: 'honeypot-hill',
  added: '2026-10-18',
  ledger: {
    problem: 'Teddy wants to fly like the birds, but bears haven’t got wings',
    villain: 'the big jump off the top of Honeypot Hill',
    places: ['honeypot-hill', 'bear-kitchen', 'bear-garden', 'bear-sky'],
    cast: ['teddy', 'mummy-bear', 'barney', 'uncle-bill'],
    turns: ['tap the ladybird so she flies out of the window', 'tap the kite to send it up into the sky', 'let the helicopter’s rope down to Teddy'],
    jokes: ['I forgot to flap!'],
    ending: 'flown home muddy on a rope, a bath and honey on hot toast',
  },
});
