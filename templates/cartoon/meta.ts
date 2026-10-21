import { defineMeta } from '../shelf';

export default defineMeta({
  id: '<id>',
  title: '<Title>',
  world: '<world>',
  summary: '<One or two sentences for grown-ups.>',
  thumb: '<backdrop-id>',
  added: '<YYYY-MM-DD>',
  // The episode ledger: one short line per field, so the series doesn't repeat
  // itself. Read the others first: `npm run check -- --ledger`. Replace every
  // <placeholder> (the check fails while any is left), and delete `villain`
  // and `jokes` if there are none.
  ledger: {
    problem: '<one line: what goes wrong>',
    villain: '<a character id such as dameSnap, or a gentler danger in words such as a storm>',
    places: ['<backdrop id of the MAIN place, then any others in order>'],
    cast: ['<character ids of everyone who appears>'],
    turns: ['<one short phrase per tapToHelp or dragToHelp, as in: blow the cloud away>'],
    jokes: ['<running jokes used, always worded the same, as in: Saucepan Man mishears>'],
    ending: '<a word or two: tea party, cosy, funny>',
  },
});
