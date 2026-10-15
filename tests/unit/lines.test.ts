import { describe, expect, it } from 'vitest';
import { checkLines, estimateSeconds, isKebab } from '../../src/core/cartoon';
import { generic, personalise } from '../../src/core/phrases';

const speakers = new Set(['narrator', 'moonface']);

describe('checkLines', () => {
  it('passes short, kind, UK lines', () => {
    expect(checkLines({ a: { who: 'moonface', text: 'Hello, {name}! What colour is it?' } }, speakers)).toEqual([]);
  });

  it('catches unknown speakers, US spellings, cruelty and long sentences', () => {
    const problems = checkLines(
      {
        who: { who: 'nobody', text: 'Hi.' },
        us: { who: 'narrator', text: 'What color is Mom’s favorite candy?' },
        cruel: { who: 'narrator', text: 'She will kill them.' },
        long: { who: 'narrator', text: 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen.' },
        slot: { who: 'narrator', text: 'Hello {friend}.' },
      },
      speakers,
    ).map((i) => i.key);
    expect(problems).toContain('who');
    expect(problems.filter((k) => k === 'us').length).toBeGreaterThanOrEqual(3);
    expect(problems).toContain('cruel');
    expect(problems).toContain('long');
    expect(problems).toContain('slot');
  });
});

describe('speech helpers', () => {
  it('estimates a few seconds for a short line', () => {
    const s = estimateSeconds('Well done, {name}! You found it.');
    expect(s).toBeGreaterThan(2);
    expect(s).toBeLessThan(5);
  });

  it('fills in or drops the name', () => {
    expect(personalise('Well done, {name}!', 'Jasper')).toBe('Well done, Jasper!');
    expect(generic('Well done, {name}!')).toBe('Well done!');
    expect(generic('{name} found it!')).toBe('You found it!');
  });

  it('knows kebab-case', () => {
    expect(isKebab('lost-kettle')).toBe(true);
    expect(isKebab('LostKettle')).toBe(false);
  });
});
