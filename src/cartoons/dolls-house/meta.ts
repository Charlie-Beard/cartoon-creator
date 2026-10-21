import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'dolls-house',
  title: 'The Doll’s House',
  world: 'bears',
  summary: 'From the Teddy Bear Treasury: the rain spoils the Toymaker’s doll’s house for the Children’s Hospital, so Teddy has an idea: turn it into a house for the birds, on the ugly old wall the children look at. Jasper paints the door, picks the berries and fills the birds’ saucer.',
  thumb: 'toy-workshop',
  added: '2026-10-21',
  ledger: {
    problem: 'the rain spoils the doll’s house for the hospital party, and the children have only an ugly wall to look at',
    villain: 'the rain in the night, which makes the wood swell',
    places: ['hospital-garden', 'toy-workshop', 'bear-wood', 'bear-kitchen'],
    cast: ['teddy', 'toymaker', 'matron', 'tom', 'daisy', 'daddy-bear', 'mummy-bear'],
    turns: ['paint the doll’s house door blue', 'tap the bush to shake the berries down', 'drag the bread into the berry basket', 'drag the basket of berries to the bird house', 'fill the birds’ saucer with water'],
    jokes: ['It’s not for dolls. It’s for the birds!'],
    ending: 'birds flying in and out, and thank-yous both ways',
  },
});
