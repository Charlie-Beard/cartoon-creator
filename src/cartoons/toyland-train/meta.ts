import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'toyland-train',
  title: 'The Toyland Express',
  world: 'wishing',
  summary:
    'The Wishing-Chair flies the friends to Toyland on the morning of the Toy Fair, but the Toyland Express cannot go: its winding key is missing. A trail of gold stars leads to the old toy cupboard, where grumpy Jack-in-the-Box, who never gets to go anywhere, has hidden it. The friends carry his box to the train, and off they all puff to the Fair.',
  thumb: 'toyland-station',
  added: '2026-10-26',
  ledger: {
    problem: 'the Toyland Express cannot go because its winding key is missing, and the Toy Fair starts at twelve',
    villain: 'a grumpy Jack-in-the-Box who springs up in the dark cupboard, cross because he is always left out',
    places: ['toyland-station', 'playroom', 'wishing-sky', 'toy-cupboard'],
    cast: ['mollie', 'peter', 'jigs', 'jackInBox', 'brass'],
    jokes: ['Peter’s little tin train'],
    ending: 'a toy train ride to the Fair, and the tin train goes by itself',
  },
});
