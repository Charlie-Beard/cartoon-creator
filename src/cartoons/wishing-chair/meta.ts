import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'wishing-chair',
  title: 'The Wishing-Chair',
  world: 'wishing',
  summary: 'Mollie and Peter buy a little red chair for Mum, and it grows wings. They make the wish, rescue Jigs the pixie from a cloud that is breaking up, and fly home before the wings fold away.',
  thumb: 'playroom',
  added: '2026-10-22',
  ledger: {
    problem: 'a pixie is stuck on a cloud that is breaking up, and the chair’s wings are getting tired',
    villain: 'a cloud breaking up, and the wings drooping',
    places: ['wishing-sky', 'curiosity-shop', 'playroom'],
    cast: ['mollie', 'peter', 'jigs'],
    jokes: ['Chairs don’t wriggle, do they?', 'Jumping jigs!'],
    ending: 'cosy goodnight, and a secret',
  },
});
