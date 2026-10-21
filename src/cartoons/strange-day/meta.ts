import { defineMeta } from '../shelf';

export default defineMeta({
  id: 'strange-day',
  title: 'Mr Dursley’s Strange Day',
  world: 'hogwarts',
  summary: 'Mr Dursley of Privet Drive likes everything normal, but today a cat reads a map, owls fly in the daytime and a wizard hugs him. That night Dumbledore, Professor McGonagall and Hagrid leave a very special baby on his doorstep.',
  thumb: 'privet-drive-night',
  added: '2026-10-16',
  ledger: {
    problem: 'nothing strange ever happens on Privet Drive, until today strange things happen all day long',
    villain: 'a deep rumble and a big light coming down out of the night sky (it is only Hagrid)',
    places: ['privet-drive-night', 'privet-drive', 'dursley-kitchen', 'grunnings-office'],
    cast: ['vernon', 'petunia', 'dudley', 'tabbyCat', 'slughorn', 'dumbledore', 'mcgonagall', 'hagrid'],
    turns: ['drag the porridge pot over to Dudley', 'tap the cat’s map so the cat reads it', 'tap the radio to switch it on', 'tap Dumbledore’s Put-Outer to click the street lamps out', 'drag baby Harry down onto the doorstep'],
    jokes: ['Mr Dursley never sees the owls', 'Mr Dursley goes purple', 'Sherbet lemon?'],
    ending: 'baby Harry asleep on the doorstep, and Mr Dursley snoring on',
  },
});
