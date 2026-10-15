/**
 * Pictures of a world's art, to Read and pick ids from: the art lab
 * (lab.html, see src/lab.ts) in screenshots.
 *
 *   npm run lab -- faraway                  every set, one set of PNGs each
 *   npm run lab -- faraway chars            just the characters (chars | poses | backdrops | props)
 *   npm run lab -- faraway chars --p silky,moonface    only these ids
 *   npm run lab -- faraway --backdrop meadow           one backdrop at stage size, 1180 × 820
 *   npm run lab -- --list                   the worlds there are
 *
 * It starts `vite` on a free port itself (unless --url is given), opens
 * /lab.html?world=<world>&set=<set> in Playwright (chromium, scale 1) and
 * saves screenshots/lab/<world>-<set>.png. Every card carries its id under
 * the picture (that is what you pass to k.character, k.backdrop and so on),
 * so a Read of the PNG is enough to choose. A page taller than ~2000 px is
 * cut between rows of cards into <world>-<set>-1.png, -2.png ..., so each
 * stays readable. A set with nothing in it is skipped. The paths are printed.
 *
 *   --backdrop <id>   screenshots/lab/<world>-backdrop-<id>.png: the backdrop alone, at 1180 × 820
 *                     (with no world, the first world that has it answers, as in a cartoon)
 *   --p a,b,c         only these ids (the lab's own &p=)
 *   --size N          card width in px (the lab's &size=, default 210)
 *   --width N         page width in px (default 1280)
 *   --max-height N    tallest PNG in px (default 2000)
 *   --out DIR         where the PNGs go (default screenshots/lab)
 *   --url URL         use a dev server that is already running
 *
 * Chromium comes from PW_CHROMIUM (or /opt/pw-browsers/chromium if that
 * exists, else Playwright's own).
 */
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { chromiumPath, createDevServer } from './lib/dev-server.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SETS = ['chars', 'poses', 'backdrops', 'props'];

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const valueFlags = new Set(['backdrop', 'p', 'size', 'width', 'max-height', 'out', 'url']);
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && valueFlags.has(args[i - 1].slice(2))));

const USAGE = `Usage: npm run lab -- <world> [chars|poses|backdrops|props] [options]
       npm run lab -- <world> --backdrop <id>
       npm run lab -- --list

  Saves the art lab as PNGs in screenshots/lab/<world>-<set>.png (split into -1, -2 ... when tall),
  with every card's id under it. No set means one set of PNGs for each of the four.

  --backdrop <id>  one backdrop alone at 1180 x 820: screenshots/lab/<world>-backdrop-<id>.png
  --p a,b,c        only these ids        --size N     card width (default 210)
  --width N        page width (1280)     --max-height N  tallest PNG (2000)
  --out DIR        output folder         --url URL    use a dev server already running
  --list           list the worlds       --help       this`;

if (flag('help') || flag('h')) {
  console.log(USAGE);
  process.exit(0);
}

const world = positional[0];
const setArg = positional[1];
const backdrop = option('backdrop');
const only = option('p');
const size = option('size');
const WIDTH = Number(option('width', 1280));
const MAX_HEIGHT = Number(option('max-height', 2000));
const OUT = resolve(ROOT, option('out', join('screenshots', 'lab')));
if (!flag('list') && !world && !backdrop) {
  console.error(USAGE);
  process.exit(2);
}
if (setArg && !SETS.includes(setArg)) {
  console.error(`"${setArg}" is not a set. The sets are: ${SETS.join(', ')}.`);
  process.exit(2);
}

// ------------------------------------------------------------------ helpers

const dev = createDevServer(ROOT);
process.on('SIGINT', () => {
  dev.stop();
  process.exit(130);
});

const labUrl = (base, params) => {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null));
  return `${base}/lab.html?${q}`;
};

/** The page has drawn: the lab fills #lab in one go, and Andika must be in before the captions are photographed. */
async function ready(page) {
  await page.waitForFunction(() => document.getElementById('lab')?.children.length > 0, null, { timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

/**
 * Where to cut a tall page into PNGs of at most `max` px, without cutting a
 * card in half: just above a heading or a row of cards. Returns [y0, y1]
 * pairs that cover the whole page.
 */
async function slices(page, max) {
  const { total, tops } = await page.evaluate(() => {
    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    const marks = [...document.querySelectorAll('.lab-h, .lab-card')].map(top);
    return { total: Math.ceil(document.documentElement.scrollHeight), tops: [...new Set(marks.map(Math.floor))].sort((a, b) => a - b) };
  });
  const cuts = [0];
  let prev = 0; // the last place a cut could have gone, since the start of this slice
  for (const y of tops.map((t) => Math.max(0, t - 10))) {
    const start = cuts.at(-1);
    if (y <= start) continue;
    if (y - start > max) {
      // Too far: cut at the last row start that fitted (or here, if one row alone is taller than max).
      cuts.push(prev > start ? prev : y);
      prev = y;
    } else prev = y;
  }
  // The tail: whatever is left may still be too tall for one slice.
  while (total - cuts.at(-1) > max) cuts.push(cuts.at(-1) + max);
  cuts.push(total);
  return cuts.slice(0, -1).map((y, i) => [y, cuts[i + 1]]);
}

/** Saves the page as <name>.png, or <name>-1.png, <name>-2.png ...; returns the paths. */
async function save(page, name) {
  for (const f of readdirSync(OUT)) if (new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.png$`).test(f)) rmSync(join(OUT, f));
  const parts = await slices(page, MAX_HEIGHT);
  const paths = [];
  for (const [i, [y0, y1]] of parts.entries()) {
    const file = join(OUT, parts.length === 1 ? `${name}.png` : `${name}-${i + 1}.png`);
    await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: y0, width: WIDTH, height: y1 - y0 } });
    paths.push(file);
  }
  return paths;
}

// ---------------------------------------------------------------------- run

let exitCode = 0;
try {
  mkdirSync(OUT, { recursive: true });
  const base = (option('url') ?? (await dev.start())).replace(/\/$/, '');
  const browser = await chromium.launch({ executablePath: chromiumPath() });
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push(e.message));

  // The worlds there are, from the lab's own navigation (the first load also warms the dev server).
  await page.goto(labUrl(base, {}));
  await ready(page);
  const worlds = await page.evaluate(() => [...document.querySelectorAll('.lab-nav a')].map((a) => new URL(a.href).searchParams.get('world')).filter(Boolean));
  if (flag('list')) {
    console.log(`Worlds: ${worlds.join(', ')}`);
  } else if (world && !worlds.includes(world)) {
    console.error(`There is no world "${world}". The worlds are: ${worlds.join(', ')}.`);
    exitCode = 2;
  } else if (backdrop) {
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.goto(labUrl(base, { backdrop, world }));
    await ready(page);
    const found = await page.evaluate(() => !!document.querySelector('.lab-full svg'));
    if (!found) {
      console.error(`There is no backdrop "${backdrop}"${world ? ` (looked in ${world}, then common and the other worlds)` : ''}. Try: npm run lab -- ${world ?? '<world>'} backdrops`);
      exitCode = 2;
    } else {
      const file = join(OUT, `${world ? world + '-' : ''}backdrop-${backdrop}.png`);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1180, height: 820 } });
      console.log(file);
    }
  } else {
    const sets = setArg ? [setArg] : SETS;
    for (const set of sets) {
      await page.goto(labUrl(base, { world, set, p: only, size }));
      await ready(page);
      const cards = await page.locator('.lab-card').count();
      if (!cards) {
        console.log(`${world} ${set}: nothing${only ? ' (none of those ids)' : ''}, skipped`);
        continue;
      }
      const paths = await save(page, `${world}-${set}`);
      console.log(`${world} ${set}: ${cards} card${cards === 1 ? '' : 's'}, ${paths.length} PNG${paths.length === 1 ? '' : 's'}`);
      for (const f of paths) console.log(`  ${f}`);
    }
  }
  if (problems.length) {
    console.error(`The lab page threw:\n  ${problems.join('\n  ')}`);
    exitCode = 1;
  }
  await browser.close();
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  exitCode = 1;
} finally {
  dev.stop();
}
process.exit(exitCode);
