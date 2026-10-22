import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'three-bears',
  title: 'Teddy and the Three Bears',
  world: 'bears',
  summary: 'Teddy wants honey, not porridge. While it cools, Mummy tells him the story of Goldilocks, and on their walk Teddy spots golden curls heading for the cottage. He races home to save his porridge.',
  thumb: 'bear-kitchen',
  added: '2026-10-18',
  ledger: {
    problem: 'Teddy wants honey and won’t eat his porridge, until he hears someone might eat it for him',
    villain: 'golden curls bobbing behind a tree, heading for the cottage (it is only Goldilocks, waving)',
    places: ['bear-kitchen', 'bear-wood'],
    cast: ['teddy', 'mummy-bear', 'daddy-bear', 'goldilocks'],
    turns: ['stir the porridge round and round', 'tap the little bowl that was just right', 'drag the scarf to Teddy', 'tap the tree to see who is hiding', 'drag the honey pot to the bowl'],
    jokes: ['Someone might come along and eat it for you', 'too hot, too cold, just right'],
    ending: 'porridge all eaten, honey on top, and Goldilocks waving at the window',
  },
});
