import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'giants-castle',
  title: 'The Giant’s Castle',
  world: 'wishing',
  summary: 'Giant Grumble has taken Jigs to polish his boots. The Wishing-Chair flies Mollie and Peter to his castle, and Jasper strikes bedtime on the giant’s clock, puts on his nightcap and makes his boots shine, so the grumpy giant ends up pleased.',
  thumb: 'giant-castle',
  added: '2026-10-22',
  ledger: {
    problem: 'a grumpy giant has taken Jigs to polish his boots',
    villain: 'grumble',
    places: ['giant-kitchen', 'playroom', 'giant-castle'],
    cast: ['mollie', 'peter', 'jigs', 'grumble'],
    turns: ['catch the note blowing in the wind', 'tap the mouse door open', 'tap the clock to strike bedtime', 'drag the nightcap onto the giant’s head', 'tap the boots to make them shine', 'drag the biscuit to Jigs'],
    jokes: ['Jumping jigs!', 'SHINIER!', 'Not even mine?'],
    ending: 'cocoa and a laugh',
  },
});
