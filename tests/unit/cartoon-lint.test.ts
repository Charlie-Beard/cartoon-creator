import { describe, expect, it } from 'vitest';
import { SHELF } from '../../src/cartoons';
import type { Line } from '../../src/core/cartoon';
import { callArguments, stripComments, tapCalls, undefinedLines, unknownIds, unusedLines, withoutLinesTable } from '../../scripts/lib/cartoon-lint';
import { catalogue } from '../../scripts/lib/catalogue';

const cat = {
  speakers: new Set(['narrator', 'moonface']),
  characters: { moonface: ['loom', 'point'] },
  backdrops: new Set(['meadow']),
  props: new Set(['star']),
};
const lines: Record<string, Line> = {
  hello: { who: 'narrator', text: 'Hello, {name}! It’s a "test" (really).' },
  bye: { who: 'moonface', text: "Goodbye // not a comment /* nor this */ {name}." },
};

describe('reading the script source', () => {
  it('blanks comments but not "//" inside strings', () => {
    const out = stripComments("const a = 'http://x'; // k.say('gone')\n/* k.say('also gone') */ k.say('kept');");
    expect(out).toContain("'http://x'");
    expect(out).not.toContain('gone');
    expect(out).toContain("k.say('kept')");
    expect(out.length).toBe("const a = 'http://x'; // k.say('gone')\n/* k.say('also gone') */ k.say('kept');".length);
  });

  it('blanks the lines table, whatever is in the strings', () => {
    const src = `defineCartoon({ lines: { hello: { who: 'narrator', text: "Don't {stop} }" }, bye: { who: 'a', text: 'b' } }, scenes: [k.say('x')] })`;
    const out = withoutLinesTable(src);
    expect(out).not.toContain('hello');
    expect(out).toContain("k.say('x')");
  });

  it('finds the arguments of every call, nested brackets and all', () => {
    const args = callArguments("k.tapToHelp(cast.star, { ask: 'a', size: Math.max(1, 2) }); k.tapToHelp(x)", 'tapToHelp');
    expect(args).toHaveLength(2);
    expect(args[0]).toContain('Math.max(1, 2)');
  });
});

describe('unused and undefined lines', () => {
  const src = `
    defineCartoon({
      lines: { hello: { who: 'narrator', text: 'Hi.' }, bye: { who: 'moonface', text: 'Bye.' }, spare: { who: 'narrator', text: 'Spare.' } },
      scenes: [{ async play(k) { await k.say('hello'); await k.tapToHelp(a, { ask: 'bye' }); } }],
    });`;
  const l = { hello: lines.hello, bye: lines.bye, spare: { who: 'narrator', text: 'Spare.' } };

  it('reports a line nothing says, but counts ask, nudge and helped as saying', () => {
    expect(unusedLines(src, l)).toEqual(['spare']);
  });

  it('is not fooled by a key that only appears in a comment or in its own definition', () => {
    expect(unusedLines(src.replace("k.say('hello')", "/* k.say('hello') */ 0"), l)).toEqual(['hello', 'spare']);
  });

  it('reports a line the script says that does not exist', () => {
    expect(undefinedLines(src + "k.say('typo'); { nudge: 'oops' }", l).sort()).toEqual(['oops', 'typo']);
  });
});

describe('unknown ids', () => {
  it('passes real characters, backdrops, props and poses', () => {
    const src = `k.backdrop('meadow'); k.prop('star', {}); k.character('moonface', { x: 1, pose: 'loom' }); k.pose(a, 'point'); k.pose(a, 'default');`;
    expect(unknownIds(src, cat)).toEqual([]);
  });

  it('reports ones no world has', () => {
    const problems = unknownIds(`k.backdrop('nowhere'); k.prop('nothing'); k.character('nobody', {}); k.character('moonface', { pose: 'fly' }); k.pose(a, 'swim');`, cat);
    expect(problems.join('\n')).toMatch(/backdrop "nowhere"/);
    expect(problems.join('\n')).toMatch(/prop "nothing"/);
    expect(problems.join('\n')).toMatch(/character "nobody"/);
    expect(problems.join('\n')).toMatch(/moonface has no pose "fly"/);
    expect(problems.join('\n')).toMatch(/pose "swim"/);
  });

  it('leaves one-off SVG backdrops alone', () => {
    expect(unknownIds(`k.backdrop('<svg></svg>'); k.backdrop(mine)`, cat)).toEqual([]);
  });
});

describe('tapToHelp', () => {
  it('counts turns and those that never say what to tap', () => {
    expect(tapCalls("k.tapToHelp(a, { ask: 'x' }); k.tapToHelp(b, { nudge: 'y' }); // k.tapToHelp(c)")).toEqual({ total: 2, withoutAsk: 1 });
  });
});

/**
 * Every cartoon on the shelf, read straight from its source file: no line
 * recorded for nothing, and nothing in the script that no world can draw.
 * (scripts/check-cartoon.ts also checks the rest: npm run check.)
 */
const sources = import.meta.glob('../../src/cartoons/*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

describe('every cartoon on the shelf', () => {
  for (const entry of SHELF) {
    describe(entry.id, () => {
      const source = sources[`../../src/cartoons/${entry.id}.ts`];

      it('is a file named after its id', () => {
        expect(source, `src/cartoons/${entry.id}.ts`).toBeTypeOf('string');
      });

      it('uses every line it lists, and only lines it lists', async () => {
        if (!source) return;
        const c = (await entry.load()).default;
        expect(unusedLines(source, c.lines), 'lines that are never said').toEqual([]);
        expect(undefinedLines(source, c.lines), 'lines said that do not exist').toEqual([]);
      });

      it('asks only for characters, backdrops, props and poses that exist', () => {
        if (!source) return;
        expect(unknownIds(source, catalogue())).toEqual([]);
      });
    });
  }
});
