import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'christmas',
  title: 'Christmas at Hogwarts',
  world: 'hogwarts',
  summary: 'Harry has never had a proper Christmas. On Christmas Eve, Hagrid’s enormous tree gets stuck in the castle doors, and then come presents, wizard crackers and the best Christmas dinner ever.',
  thumb: 'snowy-grounds',
  added: '2026-10-16',
  ledger: {
    problem: 'Hagrid’s giant Christmas tree is stuck in the castle doors, and Harry has never had a proper Christmas',
    villain: 'a tree too fat with snow to fit through the door',
    places: ['castle-doors', 'snowy-grounds', 'dormitory', 'great-hall', 'common-room'],
    cast: ['harry', 'ron', 'hagrid', 'dumbledore'],
    jokes: ['Uncle Vernon’s old socks', 'Dumbledore’s flowery bonnet'],
    ending: 'by the fire in Harry’s new jumper, with a white mouse from the cracker',
  },
});
