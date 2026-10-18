import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'valentine',
  title: 'The Singing Valentine',
  world: 'hogwarts',
  summary: 'Professor Lockhart turns Hogwarts pink for Valentine’s Day and sends grumpy cupids round with singing valentines. One of them is for Harry, and however hard Harry hides, the cupid is going to sing it.',
  thumb: 'castle-corridor',
  added: '2026-10-18',
  ledger: {
    problem: 'a grumpy cupid has a singing valentine for Harry, and Harry would rather hide than hear it in front of everybody',
    villain: 'dwarfCupid, gruff and determined to sing (a chase, played for laughs)',
    places: ['castle-corridor', 'great-hall', 'classroom', 'common-room'],
    cast: ['harry', 'ron', 'hermione', 'ginny', 'lockhart', 'dwarfCupid', 'hedwig'],
    turns: ['hide Harry behind the suit of armour', 'twang the cupid’s harp to start the song', 'pop Lockhart’s giant heart'],
    jokes: ['a fresh pickled toad', 'Lockhart’s forty-six valentines', 'Hmph.'],
    ending: 'a thank-you card for someone shy',
  },
});
