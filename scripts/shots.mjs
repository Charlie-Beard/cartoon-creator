/**
 * Screenshots and pacing for one cartoon: look at every scene, and find out
 * how long the episode really runs.
 *
 *   npm run shots -- lost-kettle
 *   npm run shots -- lost-kettle --scene 2          # one scene only
 *   npm run shots -- lost-kettle --url http://localhost:5173   # use a dev server already running
 *   npm run shots -- lost-kettle --fast             # iterating on frames: seconds, not minutes (see below)
 *   npm run shots -- lost-kettle --openings         # only each scene's opening set, in seconds (see below)
 *   npm run shots -- lost-kettle --strict           # exit 1 if anything is flagged (pacing or layout)
 *   npm run shots -- --help
 *
 * It starts `vite` on a free port itself (unless --url is given), opens
 * /?cartoon=<id>&scene=<n> for each scene in Playwright (chromium at
 * 1180 × 820, scale 1), waits for the curtains to open, and saves
 *
 *   screenshots/<id>/scene<n>-0.png    the scene's opening set
 *   screenshots/<id>/scene<n>-<k>.png  frames while it plays: one every 3 s until
 *                                      the scene ends
 *   screenshots/<id>/sheet.png, openings.png, flags.png, sheet-scene<n>.png
 *                                      sheets sized to be read as one image each
 *                                      (see "sheets" below): read these, not the frames
 *
 * and prints a pacing report. The time is measured, not guessed: each
 * scene runs in real time (or on the fake clock with --fast, below), one at a time (see --parallel), and is timed
 * from the player starting it to the player starting the next, so it
 * includes the little beat between scenes. Lines with no recording are
 * "spoken" by a stand-in for the iPad's voice that takes as long as
 * estimateSeconds says; recorded lines (public/audio) play for real.
 *
 * The report also lists every caption of every scene (when it came on and
 * for how long), and flags silent stretches: more than 4 s with no caption
 * showing.
 *
 * Flags: a scene over 90 s, an episode outside 2–6 minutes, a silent
 * stretch, and the layout problems below. Exits 1 on an error (the script
 * threw, a scene never finished); --strict also exits 1 on a flag.
 *
 * --fast: for iterating on frames. The page runs on Playwright's fake clock
 * (page.clock, the way tests/e2e/cartoons.spec.ts plays an episode), pushed
 * on a quarter of a second at a time, so a 3-minute episode takes under a
 * minute of wall-clock time instead of 3-4 (and the scenes run 4 at a time,
 * since the story clock doesn't care how busy the machine is). The frames
 * are the same: one every --every seconds of STORY time, the same sheets. The times in the report are
 * story-clock times: GSAP, the captions, and the stand-in voice (estimateSeconds per line) all run on that clock, so they
 * match a real run closely, and the report says so. One difference: with
 * --fast, recordings in public/audio are not played, and every line is
 * "spoken" by the stand-in, so the times are the estimates, not the
 * recorded lengths. FOR THE FINAL PACING CHECK RUN WITHOUT --fast (real
 * time, recordings playing for real); --fast is for fixing frames.
 *
 * LAYOUT CHECKS: at every frame (the page is asked, just before the screenshot,
 * where every character and prop is, who is speaking, where the caption
 * is), scripts/lib/frame-check.mjs looks for: an actor 25%+
 * off the stage (and still so a frame later); a face reaching into the
 * caption band (y 690+) under a caption; two characters overlapping by more
 * than 35% of the smaller; more than 4 characters at once; the speaker off stage or
 * invisible while their line is captioned. After the pacing report it prints
 * "Frames to look at": each flagged frame's file and why. The same goes in
 * screenshots/<id>/flags.json, and flags.png shows every flagged frame with
 * the actors boxed. So: read sheet.png, openings.png and flags.png, not every
 * frame. --strict exits 1
 * if anything is flagged (pacing or layout). The page marks its actors with
 * data-actor / data-prop (src/kit/kit.ts) for this.
 *
 * --openings: only each scene's opening set, as fast as the machine allows
 * (a few seconds), for a quick layout check after moving people around. No
 * play-through, so no pacing report. The page runs on the fake clock only
 * until the scene's set() has built the stage, then the curtains and the
 * title banner are hidden and the frame taken: it is the set as it stands
 * before play() has moved anything. Frames go to <out>/openings/scene<n>.png
 * with sheet.png (all of them, half size), flags.png and flags.json beside them (a full run's files are
 * left alone). The frame checks run on them (no caption is showing yet, so
 * not the caption-band or speaker checks: a set often parks people out of
 * sight behind a foreground prop for play() to bring up). Scenes run
 * --parallel at once (default 4).
 *
 * Options: --every S (seconds between frames, default 3), --frames N (cap on
 * frames per scene after the opening set; default no cap but a safety cap of
 * 60), --parallel N (scenes at once, default 1, or 4 with --fast or
 * --openings: in real time more are quicker but a busy machine makes GSAP
 * lag-smooth and the times read high), --fast, --openings,
 * --strict, --captions (print every line's timing), --out DIR, --help.
 *
 * Chromium comes from PW_CHROMIUM (or /opt/pw-browsers/chromium if that
 * exists, else Playwright's own).
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { chromiumPath, createDevServer } from './lib/dev-server.mjs';
import { checkScene } from './lib/frame-check.mjs';
import { SHELF } from './lib/shelf.ts';
import { spokenSeconds } from '../src/core/cartoon.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const valueFlags = new Set(['url', 'scene', 'frames', 'every', 'parallel', 'out']);
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && valueFlags.has(args[i - 1].slice(2))));
const USAGE = `Usage: npm run shots -- <cartoonId> [options]

  --fast         iterate on frames: play on a fake clock (seconds, not minutes). Frames are
                 still one every --every seconds of story time and the times in the report
                 are story-clock times (recordings are not played; the stand-in voice speaks
                 every line at its estimateSeconds). Do the FINAL pacing check without it.
  --openings     only each scene's opening set, in seconds: for a quick layout check after
                 moving people around. Frames and a small sheet go in <out>/openings/. No pacing.
  --scene N      one scene only (numbered from 1)
  --every S      seconds between frames (default 3)
  --frames N     most frames per scene after the opening set (default and cap 60)
  --parallel N   scenes at once (default 1; 4 with --fast or --openings)
  --url URL      use a dev server that is already running
  --out DIR      where the PNGs go (default screenshots/<id>)
  --strict       exit 1 on a flag too (pacing or layout), not only on an error
  --captions     print every line's timing too (long: silences are flagged anyway)
  --help         this

Layout checks run on every frame (scripts/lib/frame-check.mjs): an actor 25%+ off stage, a face in
the caption band (y 690+), characters overlapping 35%+, more than 4 characters, the speaker off stage. See "Frames to look at"
in the report. Read sheet.png (the episode), openings.png (each scene's set) and flags.png (the flagged frames, actors
boxed), not the frames one by one; sheet-scene<n>.png has one scene's every frame.`;
if (flag('help') || flag('h')) {
  console.log(USAGE);
  process.exit(0);
}
const id = positional[0];
if (!id) {
  console.error(USAGE);
  console.error(`On the shelf: ${SHELF.map((c) => c.id).join(', ') || '(nothing yet)'}`);
  process.exit(2);
}
const entry = SHELF.find((c) => c.id === id);
if (!entry) {
  console.error(`"${id}" is not on the shelf (src/cartoons/<id>/). On the shelf: ${SHELF.map((c) => c.id).join(', ') || '(nothing yet)'}`);
  process.exit(2);
}
const cartoon = (await entry.load()).default;
const EVERY = Number(option('every', 3));
/** Most frames kept per scene after the opening set: --frames N, but never more than the safety cap. */
const MAX_FRAMES = 60;
const FRAMES = Math.min(MAX_FRAMES, option('frames') === undefined ? MAX_FRAMES : Number(option('frames')));
const OPENINGS = flag('openings');
const CAPTIONS = flag('captions');
const FAST = flag('fast') || OPENINGS; // the openings are shot on the fake clock too
const PARALLEL = Math.max(1, Number(option('parallel', FAST ? 4 : 1)));
const OUT = resolve(ROOT, option('out', join('screenshots', id)), OPENINGS ? 'openings' : '.');
const only = option('scene') === undefined ? null : Number(option('scene')) - 1;
/** Scenes are numbered from 1 for people (scene 1 is `?scene=0`). */
const sceneIndexes = only === null ? cartoon.scenes.map((_, i) => i) : [only];
if (sceneIndexes.some((i) => !cartoon.scenes[i])) {
  console.error(`${id} has ${cartoon.scenes.length} scenes; there is no scene ${only + 1}.`);
  process.exit(2);
}

// Longest a scene may take (the player gives up on one after 180 s, plus the curtains).
const STUCK_SECONDS = 200;
const SILENT_SECONDS = 4; // a stretch with no caption longer than this is flagged
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// --fast: the fake clock is pushed on STEP_MS of story time at a time (frames are noticed
// to within that), with REAL_PAUSE_MS of real time after each push for the page's fetches and decodes.
const STEP_MS = 250;
const REAL_PAUSE_MS = 15;
const FAKE_START = 1_700_000_000_000;
const CONTEXT = { viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1, hasTouch: true };

// ------------------------------------------------------------------ server

const dev = createDevServer(ROOT);
const startServer = () => dev.start();
const stopServer = () => dev.stop();
process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

// --------------------------------------------------------------- in the page

/**
 * Runs in every page before the app: a stand-in for the iPad's voice that
 * takes as long as estimateSeconds says (Chromium has no voices, so lines
 * with no recording would otherwise take no time at all), and a log of
 * what the player is doing, sampled every 40 ms.
 *
 * Under --fast the page's clock is fake (page.clock), installed BEFORE this
 * script so that the setInterval below, performance.now() and the stand-in's
 * setTimeout are all the story clock's: everything this logs is story time.
 */
function installProbe() {
  const estimate = (text) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    const stops = (text.match(/[.!?…]+/g) ?? []).length;
    return words / 2.4 + stops * 0.3;
  };
  let current = null;
  window.SpeechSynthesisUtterance = class {
    constructor(text = '') {
      this.text = text;
    }
  };
  const synth = {
    onvoiceschanged: null,
    speaking: false,
    getVoices: () => [],
    cancel() {
      if (!current) return;
      clearTimeout(current.timer);
      const u = current.utterance;
      current = null;
      u.onerror?.({ error: 'interrupted' });
    },
    speak(utterance) {
      current = { utterance, timer: setTimeout(() => ((current = null), utterance.onend?.({})), estimate(utterance.text) * 1000) };
    },
    pause() {},
    resume() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });

  const log = (window.__probe = { events: [], scene: null, sceneT: 0, end: false });
  const note = (type, extra = {}) => log.events.push({ t: performance.now(), type, ...extra });
  let capOn = false;
  let capText = '';
  setInterval(() => {
    const scene = document.querySelector('[data-scene]')?.getAttribute('data-scene') ?? null;
    if (scene !== log.scene) {
      log.scene = scene;
      note('scene', { scene });
      log.sceneT = performance.now();
    }
    const end = !!document.querySelector('[data-end]');
    if (end && !log.end) note('end');
    log.end = end;
    // The caption box fades in and out with the class "on"; a new line may replace the text while it stays on.
    const box = document.querySelector('.story-caption');
    const on = !!box?.classList.contains('on');
    const text = on ? (box.querySelector('.story-caption-text > span:last-child')?.textContent ?? '') : '';
    if (on && (!capOn || text !== capText)) note('cap', { text });
    if (!on && capOn) note('cap-off');
    capOn = on;
    capText = text;
  }, 40);
}

/**
 * Runs in the page (page.evaluate: it must not use anything outside itself):
 * where everything is NOW, in stage coordinates, as a Frame for
 * scripts/lib/frame-check.mjs (the shape is described there). Stage
 * coordinates come from the stage element's own scale, so the numbers hold
 * at any window size; the camera's zoom is included, as it is what he sees.
 */
function collectFrame() {
  const stage = document.querySelector('.story-stage');
  if (!stage) return null;
  const s = stage.getBoundingClientRect();
  const k = s.width / 1180 || 1;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  };
  const world = stage.querySelector('.story-world');
  const zoom = world ? world.getBoundingClientRect().width / s.width : 1;
  // A name for each element that stays the same from frame to frame: "moonface#1".
  const ids = (window.__frameIds ??= { map: new WeakMap(), counts: {} });
  const keyOf = (el, name) => {
    let key = ids.map.get(el);
    if (!key) {
      ids.counts[name] = (ids.counts[name] ?? 0) + 1;
      key = `${name}#${ids.counts[name]}`;
      ids.map.set(el, key);
    }
    return key;
  };
  /** Its own opacity times its parents' (up to the stage), and whether it is displayed at all. */
  const look = (el) => {
    let opacity = 1;
    let shown = true;
    for (let e = el; e && e !== stage; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') shown = false;
      opacity *= parseFloat(cs.opacity);
    }
    return { opacity, shown };
  };
  const actors = [...stage.querySelectorAll('.story-actor')]
    .filter((el) => el.dataset.actor || el.dataset.prop)
    .map((el) => {
      const character = !!el.dataset.actor;
      const name = el.dataset.actor || el.dataset.prop;
      return { key: keyOf(el, name), kind: character ? 'character' : 'prop', name, box: box(el), ...look(el), speaking: el.dataset.speaking !== undefined };
    });
  const cap = stage.querySelector('.story-caption');
  const bubble = cap?.querySelector('.story-caption-text');
  const on = !!cap?.classList.contains('on');
  return {
    stage: { w: 1180, h: 820 },
    zoom,
    actors,
    // The bubble is hidden for good (no captions on screen), so it measures 0 × 0: leave the box
    // out and the band check falls back to the whole caption band.
    caption: { on, box: bubble && bubble.getBoundingClientRect().width ? box(bubble) : null },
  };
}
const NO_FRAME = { stage: { w: 1180, h: 820 }, zoom: 1, actors: [], caption: null };

/** Runs the layout checks over a scene's frames and writes each one's reasons on it. */
function checkFrames(frames, opts) {
  const reasons = checkScene(
    frames.map((f) => f.data ?? NO_FRAME),
    opts,
  );
  frames.forEach((f, i) => (f.reasons = reasons[i]));
}

// ------------------------------------------------------------ the timeline

/**
 * From the probe's events (from = the scene's start, to = the next scene's
 * start or the end, -1 if it never came): every caption with when it came
 * on (seconds from the scene's start) and how long it stayed, and the
 * silent stretches: no caption showing for longer than SILENT_SECONDS.
 */
function timeline(events, from, to) {
  const t0 = events[from].t;
  const tEnd = to >= 0 ? events[to].t : events.at(-1).t;
  const sec = (t) => (t - t0) / 1000;
  const captions = [];
  const busy = []; // [start, end] in seconds: a caption showing
  let cur = null;
  const close = (t) => {
    if (!cur) return;
    captions.push({ text: cur.text, start: sec(cur.t), dur: (t - cur.t) / 1000 });
    busy.push([sec(cur.t), sec(t)]);
    cur = null;
  };
  for (const e of events.slice(from + 1, to < 0 ? undefined : to)) {
    if (e.type === 'cap') {
      close(e.t);
      cur = { text: e.text, t: e.t };
    } else if (e.type === 'cap-off') {
      close(e.t);
    }
  }
  close(tEnd);

  const silences = [];
  let at = 0;
  for (const [a, b] of busy.sort((x, y) => x[0] - y[0])) {
    if (a - at > SILENT_SECONDS) silences.push({ from: at, to: a });
    at = Math.max(at, b);
  }
  if (sec(tEnd) - at > SILENT_SECONDS) silences.push({ from: at, to: sec(tEnd) });
  return { captions, silences };
}

// ----------------------------------------------------------- one scene's run

async function shootScene(browser, context, base, index) {
  const result = { index, name: cartoon.scenes[index].name, frames: [], errors: [], seconds: null, captions: [], silences: [], lines: [], capped: null };
  // A fake clock belongs to a whole browser context, not a page: scenes running at once need a context each.
  const own = FAST ? await browser.newContext(CONTEXT) : null;
  const page = await (own ?? context).newPage();
  // Fast mode: the page's clock is fake and paused, and only moves when we push it (see `advance`).
  // It goes in first, so the probe and the app get the fake timers.
  let storyMs = 0; // how far we have pushed the fake clock
  if (FAST) {
    await page.clock.install({ time: FAKE_START });
    await page.clock.pauseAt(FAKE_START + 1000);
    // Recordings play in real time, which the fake clock knows nothing of: every line goes to the stand-in voice.
    await page.route('**/audio/manifest.json', (route) => route.fulfill({ json: { lines: [] } }));
  }
  await page.addInitScript(installProbe);
  page.on('pageerror', (e) => result.errors.push(`${e.message}`));
  page.on('console', (m) => {
    // A missing recording (404) is normal before the voices are made.
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) result.errors.push(`console: ${m.text()}`);
  });

  /** Lets `ms` of story time go by: real time normally, a push of the fake clock in --fast. */
  const advance = async (ms) => {
    if (!FAST) return sleep(ms);
    await page.clock.runFor(ms);
    storyMs += ms;
    await page.waitForTimeout(REAL_PAUSE_MS); // real time, for the fetches and decodes the page is waiting on
  };
  /** A clock for the loop below, in ms: story time in --fast, wall-clock time otherwise. */
  const now = () => (FAST ? storyMs : Date.now());

  const shoot = async () => {
    const k = result.frames.length;
    const file = join(OUT, `scene${index + 1}-${k}.png`);
    const t = await page.evaluate(() => (performance.now() - window.__probe.sceneT) / 1000).catch(() => 0);
    const data = await page.evaluate(collectFrame).catch(() => null);
    await page.screenshot({ path: file });
    result.frames.push({ k, file, t, data, reasons: [] });
  };
  const state = () => page.evaluate(() => ({ scene: window.__probe.scene, end: window.__probe.end }));

  try {
    await page.goto(`${base}/?cartoon=${id}&scene=${index}`);
    // Anywhere harmless: the first touch is what lets the page play audio.
    await page.mouse.click(590, 806).catch(() => {});

    // Curtains up: the player marks the root with the scene's number.
    const opened = Date.now(); // real time, for the page's loading; the fake clock is no help here
    for (;;) {
      const s = await state();
      if (s.scene === String(index)) break;
      if (result.errors.length) throw new Error('the script threw before the scene began');
      if (Date.now() - opened > 40_000) throw new Error('the curtains never opened (does the cartoon load? is set() throwing?)');
      await advance(FAST ? STEP_MS : 100);
    }
    await shoot();

    let nextFrame = now() + EVERY * 1000;
    const began = now();
    for (;;) {
      const s = await state();
      if (s.end || (s.scene !== String(index) && s.scene !== null)) break;
      if (result.errors.length) break;
      if (now() - began > STUCK_SECONDS * 1000) {
        result.errors.push(`the scene had not finished after ${STUCK_SECONDS} s`);
        break;
      }
      const room = result.frames.length - 1 < FRAMES; // frames after the opening set
      if (!room && result.capped === null) result.capped = result.frames.at(-1).t;
      if (now() >= nextFrame && room) {
        await shoot();
        nextFrame = now() + EVERY * 1000;
      }
      await advance(FAST ? STEP_MS : 100);
    }

    const { events } = await page.evaluate(() => window.__probe);
    // Events are in the order they happened; compare positions, not clock readings (two can share one).
    const from = events.findIndex((e) => e.type === 'scene' && e.scene === String(index));
    const to = events.findIndex((e, i) => i > from && (e.type === 'end' || (e.type === 'scene' && e.scene !== String(index) && e.scene !== null)));
    const mine = events.slice(from + 1, to < 0 ? undefined : to);
    if (to >= 0) result.seconds = (events[to].t - events[from].t) / 1000;
    if (from >= 0) Object.assign(result, timeline(events, from, to));
    result.lines = result.captions.map((c) => c.text);
    checkFrames(result.frames);
  } catch (e) {
    result.errors.push(e.message);
    await page.screenshot({ path: join(OUT, `scene${index + 1}-error.png`) }).catch(() => {});
  } finally {
    await page.close().catch(() => {});
    await own?.close().catch(() => {});
  }
  return result;
}

/**
 * --openings: one scene's opening set and nothing else. The page runs on the
 * fake clock, paused: the player builds the set behind the curtains and then
 * waits ~2.4 s (story time) before play() begins, so the moment the backdrop
 * exists is the moment the set is finished and nothing has yet moved. The
 * curtains and the title banner are hidden for the picture, and the clock is
 * never pushed on past that. Quick: the cost is loading the page.
 */
async function shootOpening(browser, base, index) {
  const result = { index, name: cartoon.scenes[index].name, frames: [], errors: [] };
  const own = await browser.newContext(CONTEXT);
  const page = await own.newPage();
  await page.clock.install({ time: FAKE_START });
  await page.clock.pauseAt(FAKE_START + 1000);
  await page.route('**/audio/manifest.json', (route) => route.fulfill({ json: { lines: [] } }));
  page.on('pageerror', (e) => result.errors.push(`${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) result.errors.push(`console: ${m.text()}`);
  });
  try {
    await page.goto(`${base}/?cartoon=${id}&scene=${index}`);
    const began = Date.now();
    // Push the clock on a little at a time until set() has run (the title banner's entrance comes first).
    for (;;) {
      if (await page.evaluate(() => document.querySelector('.story-stage .story-backdrop') !== null)) break;
      if (result.errors.length) throw new Error('the script threw before the scene began');
      if (Date.now() - began > 40_000) throw new Error('set() never built a backdrop (does the cartoon load? is set() throwing?)');
      await page.clock.runFor(100);
      await page.waitForTimeout(REAL_PAUSE_MS);
    }
    // A zero-length camera move in set() lands on the next frame.
    await page.clock.runFor(50);
    await page.addStyleTag({ content: '.story-curtain, .story-title { visibility: hidden !important; }' });
    const file = join(OUT, `scene${index + 1}.png`);
    const data = await page.evaluate(collectFrame).catch(() => null);
    await page.screenshot({ path: file });
    result.frames.push({ k: 0, file, t: 0, data, reasons: [] });
    checkFrames(result.frames);
  } catch (e) {
    result.errors.push(e.message);
    await page.screenshot({ path: join(OUT, `scene${index + 1}-error.png`) }).catch(() => {});
  } finally {
    await page.close().catch(() => {});
    await own.close().catch(() => {});
  }
  return result;
}

// ------------------------------------------------------------------ sheets

/**
 * The sheets are what the writer (usually Claude) looks at instead of the
 * frames one by one. Each is sized to be read as ONE image, about 1240 px
 * wide and not much taller, because a model shrinks a tall image until it
 * fits: the old single contact sheet of every frame (1264 × 6000+) arrived
 * with each frame about 95 px wide, too small to judge and still paid for.
 * A frame read on its own costs about as much as a half-size sheet of four.
 *
 *   sheet.png            the whole episode at a glance: each scene's opening
 *                        and up to 5 more frames, small
 *   openings.png         every scene's opening set at half size, 2 to a row:
 *                        the layout check
 *   flags.png            every flagged frame at half size, the actors it is
 *                        about boxed in red, the reasons under it (flags-2.png …
 *                        when there are more than 6)
 *   sheet-scene<n>.png   one scene's every frame at quarter size, 4 to a row:
 *                        read only when a scene's action needs a closer look
 *
 * --openings writes only its own sheet.png (the openings.png layout) and
 * flags.png into <out>/openings/.
 */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const SHEET_WIDTH = 1240;
const FLAGS_PER_SHEET = 6;
const OVERVIEW_FRAMES = 6;

/** Up to `k` of `n` items, evenly spread, always the first and the last. */
function spread(n, k) {
  if (n <= k) return Array.from({ length: n }, (_, i) => i);
  return [...new Set(Array.from({ length: k }, (_, i) => Math.round((i * (n - 1)) / (k - 1))))];
}

/** One frame on a sheet: its label, any reasons, and (on the flags sheet) red boxes round the actors they're about. */
function card(f, label, { reasons = false, boxes = false } = {}) {
  const flagged = f.reasons?.length > 0;
  const kinds = flagged ? [...new Set(f.reasons.map((r) => r.kind))].join(', ') : '';
  const why = !flagged ? '' : reasons ? `<ul class="why">${f.reasons.map((r) => `<li>${esc(r.message)}</li>`).join('')}</ul>` : `<div class="why">${esc(kinds)}</div>`;
  let marks = '';
  if (boxes && flagged && f.data) {
    const keys = new Set(f.reasons.flatMap((r) => r.actors ?? []));
    marks = f.data.actors
      .filter((a) => keys.has(a.key))
      .map((a) => {
        const { x, y, w, h } = a.box;
        const pc = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
        return `<div class="mark" style="left:${pc(x, 1180)};top:${pc(y, 820)};width:${pc(w, 1180)};height:${pc(h, 820)}"><span>${esc(a.key)}</span></div>`;
      })
      .join('');
  }
  return `<figure${flagged ? ' class="flagged"' : ''}><div class="pic"><img src="${pathToFileURL(f.file).href}">${marks}</div><figcaption>${label}${why}</figcaption></figure>`;
}

/** Renders one sheet: `sections` of cards, `cols` to a row, to `name` in OUT. */
async function renderSheet(context, name, heading, sections, cols) {
  const body = sections.map((s) => `<section>${s.title ? `<h2>${s.title}</h2>` : ''}<div class="row">${s.cards.join('')}</div></section>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(cartoon.title)}</title>
<style>
  body { margin: 0; padding: 12px; width: ${SHEET_WIDTH - 24}px; background: #1f2a22; color: #f4ecd8; font: 15px/1.3 system-ui, sans-serif; }
  h1 { margin: 0 0 6px; font-size: 20px; } h2 { margin: 10px 0 4px; font-size: 15px; }
  .row { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 6px; }
  figure { margin: 0; } .pic { position: relative; } img { width: 100%; display: block; border-radius: 3px; background: #000; }
  figure.flagged img { outline: 4px solid #e8302a; outline-offset: -4px; }
  .mark { position: absolute; border: 3px solid #ff2a1a; box-sizing: border-box; }
  .mark span { position: absolute; left: -3px; top: -18px; background: #ff2a1a; color: #fff; font: 700 11px/16px system-ui; padding: 0 4px; white-space: nowrap; }
  figcaption { font-size: 12px; opacity: 0.75; padding-top: 2px; }
  .why { color: #ff8a80; font-weight: 700; opacity: 1; margin: 2px 0 0; padding-left: 16px; }
  figure.flagged figcaption { opacity: 1; }
</style>
<h1>${esc(cartoon.title)} <small style="opacity:.6">(${esc(id)}: ${esc(heading)})</small></h1>${body}`;
  const file = join(OUT, `${name}.html`);
  writeFileSync(file, html);
  const page = await context.newPage();
  await page.setViewportSize({ width: SHEET_WIDTH, height: 100 }); // fullPage grows it to fit
  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  await page.close();
  rmSync(file);
  return join(OUT, `${name}.png`);
}

/** Every sheet for a run (see above). Returns the files written, the ones to read first first. */
async function sheets(context, results) {
  const written = [];
  const errorFrame = (r) => ({ file: join(OUT, `scene${r.index + 1}-error.png`), reasons: [] });
  const sceneTitle = (r) => `Scene ${r.index + 1}: ${esc(r.name)}${r.seconds == null ? '' : ` (${r.seconds.toFixed(0)} s)`}`;
  const time = (f) => (f.k === 0 ? 'opening set' : `${f.t.toFixed(0)} s`);

  // The opening sets, half size.
  const openings = results.map((r) => card(r.frames[0] ?? errorFrame(r), sceneTitle(r)));
  written.push(await renderSheet(context, OPENINGS ? 'sheet' : 'openings', 'opening sets', [{ cards: openings }], 2));

  if (!OPENINGS) {
    // The overview: a few frames of each scene, evenly spread.
    const overview = results.map((r) => ({ title: sceneTitle(r), cards: spread(r.frames.length, OVERVIEW_FRAMES).map((i) => card(r.frames[i], time(r.frames[i]))) }));
    written.unshift(await renderSheet(context, 'sheet', 'every scene at a glance', overview, OVERVIEW_FRAMES));
  }

  // The flagged frames, half size, with the reasons and the actors boxed.
  const flagged = results.flatMap((r) => r.frames.filter((f) => f.reasons.length).map((f) => card(f, `Scene ${r.index + 1}, ${time(f)}: ${relative(OUT, f.file)}`, { reasons: true, boxes: true })));
  for (let i = 0; i < flagged.length; i += FLAGS_PER_SHEET) {
    const n = i / FLAGS_PER_SHEET + 1;
    written.push(await renderSheet(context, n === 1 ? 'flags' : `flags-${n}`, 'flagged frames', [{ cards: flagged.slice(i, i + FLAGS_PER_SHEET) }], 2));
  }

  // Each scene's every frame, quarter size: on demand.
  if (!OPENINGS) for (const r of results) await renderSheet(context, `sheet-scene${r.index + 1}`, `scene ${r.index + 1}, every frame`, [{ title: sceneTitle(r), cards: r.frames.map((f) => card(f, time(f))) }], 4);
  return written;
}

// ------------------------------------------------------------ frames to look at

/** The flagged frames of every scene, in order: what to print and what goes in flags.json. */
function flaggedFrames(results) {
  const out = [];
  for (const r of results) for (const f of r.frames) if (f.reasons.length) out.push({ scene: r.index + 1, frame: f.k, t: Math.round(f.t * 10) / 10, file: relative(ROOT, f.file), reasons: f.reasons.map((x) => `${x.kind}: ${x.message}`) });
  return out;
}

/** Prints "Frames to look at" and writes flags.json. Returns the flagged frames. */
function reportFrames(results) {
  const flagged = flaggedFrames(results);
  const checked = results.reduce((n, r) => n + r.frames.length, 0);
  console.log(`\nFrames to look at (layout checks on ${checked} frame${checked === 1 ? '' : 's'}: ${flagged.length} flagged)`);
  if (!flagged.length) console.log('  none: no actor off stage, no face under a caption, no pile-ups, no missing speaker.');
  for (const f of flagged) {
    console.log(`  ${f.file}   (scene ${f.scene}, ${f.frame === 0 ? 'opening set' : `${f.t} s`})`);
    for (const r of f.reasons) console.log(`      - ${r}`);
  }
  writeFileSync(join(OUT, 'flags.json'), JSON.stringify({ id, mode: OPENINGS ? 'openings' : FAST ? 'fast' : 'real-time', checked, flagged }, null, 2) + '\n');
  return flagged;
}

// ---------------------------------------------------------------------- run

let exitCode = 0;
try {
  mkdirSync(OUT, { recursive: true });
  // Old frames from an earlier, longer run would mislead.
  const sheetsRe = '^(sheet|openings|flags)(-.*)?\\.png$';
  const stale = new RegExp(only === null ? `^scene\\d+(-.*)?\\.png$|${sheetsRe}` : `^scene${only + 1}(-.*)?\\.png$|${sheetsRe}`);
  for (const f of readdirSync(OUT)) if (stale.test(f)) rmSync(join(OUT, f));

  const base = (option('url') ?? (await startServer())).replace(/\/$/, '');
  const browser = await chromium.launch({ executablePath: chromiumPath(), args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const context = await browser.newContext(CONTEXT);

  // The dev server turns the code into modules the first time it is asked: do that before any timing.
  const warm = await context.newPage();
  await warm.goto(`${base}/?cartoon=${id}`);
  // (--openings only needs the set built, which comes well before the curtains open.)
  await warm.waitForFunction((sel) => document.querySelector(sel) !== null, OPENINGS ? '.story-stage .story-backdrop' : '[data-scene]', { timeout: 60_000 }).catch(() => {});
  await warm.close();

  const parallel = Math.min(PARALLEL, sceneIndexes.length);
  if (OPENINGS) {
    const t0 = Date.now();
    console.log(`${cartoon.title} (${id}): the opening set of ${sceneIndexes.length} scene${sceneIndexes.length === 1 ? '' : 's'}, ${parallel} at a time (--openings)...`);
    const shots = new Array(sceneIndexes.length);
    let n = 0;
    await Promise.all(
      Array.from({ length: parallel }, async () => {
        while (n < sceneIndexes.length) {
          const slot = n++;
          shots[slot] = await shootOpening(browser, base, sceneIndexes[slot]);
        }
      }),
    );
    const written = await sheets(context, shots);
    await browser.close();
    const errs = shots.flatMap((r) => r.errors.map((e) => `scene ${r.index + 1}: ${e}`));
    const flagged = reportFrames(shots);
    for (const e of errs) console.log(`ERROR  ${e}`);
    console.log(`\nLook at: ${written.map((f) => relative(ROOT, f)).join('  ')}   (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    if (errs.length || (flag('strict') && flagged.length)) exitCode = 1;
    process.exitCode = exitCode;
    stopServer();
    process.exit(exitCode);
  }
  console.log(`${cartoon.title} (${id}): ${sceneIndexes.length} scene${sceneIndexes.length === 1 ? '' : 's'}, ${FAST ? 'on a fake clock (--fast)' : 'in real time'}, ${parallel} at a time...`);
  const results = new Array(sceneIndexes.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: parallel }, async () => {
      while (next < sceneIndexes.length) {
        const slot = next++;
        results[slot] = await shootScene(browser, context, base, sceneIndexes[slot]);
        const r = results[slot];
        console.log(`  scene ${r.index + 1} done: ${r.seconds === null ? 'no time' : r.seconds.toFixed(1) + ' s'}, ${r.frames.length} frames${r.errors.length ? ', ERRORS' : ''}`);
      }
    }),
  );

  const written = await sheets(context, results);
  await browser.close();

  // ---------------------------------------------------------- the report
  const flags = [];
  const errors = [];
  console.log(`\nPacing for ${id} (${FAST ? 'STORY-CLOCK times from a --fast run' : 'measured in real time'}, ${parallel} scene${parallel === 1 ? '' : 's'} at a time)`);
  if (FAST) {
    console.log('  (story-clock times, every line said by the stand-in voice: close, but the final pacing check is a run without --fast)');
  }
  if (parallel > 1 && !FAST) console.log(`  WARNING: ${parallel} scenes ran at once, so a busy machine makes the times read high (GSAP lag smoothing). Run with --parallel 1 for true times.`);
  console.log('  scene  seconds  lines  name');
  for (const r of results) {
    const secs = r.seconds === null ? '   ?' : r.seconds.toFixed(0).padStart(4);
    console.log(`  ${String(r.index + 1).padStart(5)}  ${secs} s  ${String(r.lines.length).padStart(5)}  ${r.name}`);
    if (r.seconds !== null && r.seconds > 90) flags.push(`scene ${r.index + 1} runs ${r.seconds.toFixed(0)} s: over 90 s. Split it, or cut something.`);
    if (r.lines.length === 0 && r.seconds !== null) flags.push(`scene ${r.index + 1} says nothing (no captions shown): is that on purpose?`);
    for (const s of r.silences) flags.push(`scene ${r.index + 1} is silent from ${s.from.toFixed(1)} s to ${s.to.toFixed(1)} s (${(s.to - s.from).toFixed(1)} s with no caption).`);
    for (const e of r.errors) errors.push(`scene ${r.index + 1}: ${e}`);
  }

  // Each scene's captions, in order: when each came on (from the scene's start) and how long it stayed.
  // Long (a line per line said), so only with --captions: the silences are FLAGs below either way.
  if (CAPTIONS) console.log(`\nCaption timeline (seconds from each scene's start; silent = no caption, over ${SILENT_SECONDS} s)`);
  for (const r of CAPTIONS ? results : []) {
    console.log(`  scene ${r.index + 1}: ${r.name}${r.seconds === null ? '' : ` (${r.seconds.toFixed(1)} s)`}`);
    if (!r.captions.length) console.log('    (no captions)');
    // Silences sit in the list where they happen.
    const rows = [...r.captions.map((c) => ({ at: c.start, c })), ...r.silences.map((s) => ({ at: s.from, s }))].sort((a, b) => a.at - b.at);
    for (const row of rows) {
      if (row.c) console.log(`    ${row.c.start.toFixed(1).padStart(5)} s  ${row.c.dur.toFixed(1).padStart(4)} s  "${row.c.text}"`);
      else console.log(`    ${row.s.from.toFixed(1).padStart(5)} s  ${(row.s.to - row.s.from).toFixed(1).padStart(4)} s  ** SILENT ** (until ${row.s.to.toFixed(1)} s)`);
    }
  }
  for (const r of results) if (r.capped !== null) console.log(`  scene ${r.index + 1}: frames stopped at the cap of ${FRAMES}, ${r.capped.toFixed(0)} s in (raise --frames)`);
  console.log('');
  const timed = results.filter((r) => r.seconds !== null);
  const total = timed.reduce((t, r) => t + r.seconds, 0);
  if (only === null) {
    console.log(`  total  ${fmt(total)} (${total.toFixed(0)} s), ${results.reduce((t, r) => t + r.lines.length, 0)} lines said`);
    console.log(`  the script has ${Object.keys(cartoon.lines).length} lines: ${spokenSeconds(cartoon.lines).toFixed(0)} s of speech if each is said once`);
    if (timed.length === results.length) {
      if (total < 120) flags.push(`the episode runs ${fmt(total)}: under 2 minutes. Add a beat, or a scene.`);
      if (total > 360) flags.push(`the episode runs ${fmt(total)}: over 6 minutes. Cut something.`);
    }
    const said = new Set(results.flatMap((r) => r.lines));
    const unseen = Object.entries(cartoon.lines).filter(([, l]) => !said.has(l.text));
    if (unseen.length) console.log(`  not said in this run: ${unseen.map(([k]) => k).join(', ')}`);
  }
  for (const f of flags) console.log(`FLAG   ${f}`);
  for (const e of errors) console.log(`ERROR  ${e}`);
  const layout = reportFrames(results);
  console.log(`\nLook at: ${written.map((f) => relative(ROOT, f)).join('  ')}`);
  console.log(`  (one scene's every frame: ${relative(ROOT, OUT)}/sheet-scene<n>.png; single frames: scene<n>-<k>.png)`);
  if (errors.length || (flag('strict') && (flags.length || layout.length))) exitCode = 1;
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  exitCode = 1;
} finally {
  stopServer();
}
process.exit(exitCode);
