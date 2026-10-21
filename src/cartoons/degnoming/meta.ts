import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'degnoming',
  title: 'De-gnoming the Garden',
  world: 'hogwarts',
  summary: 'On Harry’s first morning at the Burrow, Mrs Weasley sends the boys out to clear the garden of gnomes: you swing them round and round and over the hedge. But the gnomes keep coming back, and then the grumpy Gnome Chief stomps out.',
  thumb: 'the-burrow',
  added: '2026-10-16',
  ledger: {
    problem: 'the Weasleys’ garden is full of gnomes, and they keep coming back',
    villain: 'gnomeChief, who only wants a go on the spin',
    places: ['the-burrow', 'kitchen'],
    cast: ['mrsWeasley', 'harry', 'ron', 'gnome', 'gnomeChief'],
    turns: ['tap the gnome at the window to shoo him', 'tap the rustling bush so a gnome pops out', 'tap the gnome to spin him over the hedge', 'tap the Gnome Chief to start his spin', 'drag the pie to the Gnome Chief'],
    jokes: ['Wheee! Again!', 'the gnomes always come back'],
    ending: 'pie in the garden, and the Gnome Chief wants another go',
  },
});
