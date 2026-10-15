/**
 * Screenshots and pacing for one cartoon: look at every scene, and find out
 * how long the episode really runs.
 *
 *   npm run shots -- lost-kettle
 *   npm run shots -- lost-kettle --scene 2          # one scene only
 *   npm run shots -- lost-kettle --no-tap           # wait out every tap-to-help
 *   npm run shots -- lost-kettle --url http://localhost:5173   # use a dev server already running
 *
 * It starts `vite` on a free port itself (unless --url is given), opens
 * /?cartoon=<id>&scene=<n> for each scene in Playwright (chromium at
 * 1180 × 820, scale 1), waits for the curtains to open, and saves
 *
 *   screenshots/<id>/scene<n>-0.png    the scene's opening set
 *   screenshots/<id>/scene<n>-<k>.png  frames while it plays: one every 3 s until
 *                                      the scene ends, and one the moment a
 *                                      tap-to-help appears
 *   screenshots/<id>/sheet.png         a contact sheet of them all (look at this first)
 *
 * and prints a pacing report. The time is measured, not guessed: each
 * scene runs in real time, one at a time (see --parallel), and is timed
 * from the player starting it to the player starting the next, so it
 * includes the little beat between scenes. Lines with no recording are
 * "spoken" by a stand-in for the iPad's voice that takes as long as
 * estimateSeconds says; recorded lines (public/audio) play for real.
 *
 * Two ways to meet his turns (tap-to-help):
 *   default   each is tapped at once, so a child who waits takes up to ~21 s
 *             longer for each (the report says how much)
 *   --no-tap  none is tapped: the nudge and helped lines play, and the story
 *             carries on by itself after ~21 s. The times are then what a
 *             child who never taps would see.
 * The report says which mode was used.
 *
 * The report also lists every caption of every scene (when it came on and
 * for how long), and flags silent stretches: more than 4 s with no caption
 * showing and no tap waiting.
 *
 * Flags: a scene over 90 s, an episode outside 2–5 minutes, a silent
 * stretch. Exits 1 on an error (the script threw, a scene never finished);
 * --strict also exits 1 on a flag.
 *
 * Options: --every S (seconds between frames, default 3), --frames N (cap on
 * frames per scene after the opening set; default no cap but a safety cap of
 * 60), --parallel N (scenes at once, default 1: more are quicker but a busy
 * machine makes GSAP lag-smooth and the times read high), --no-tap, --out DIR.
 *
 * Chromium comes from PW_CHROMIUM (or /opt/pw-browsers/chromium if that
 * exists, else Playwright's own).
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { SHELF } from '../src/cartoons/index.ts';
import { spokenSeconds } from '../src/core/cartoon.ts';
import { DEFAULT_NAME, personalise } from '../src/core/phrases.ts';

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
const id = positional[0];
if (!id) {
  console.error('Usage: npm run shots -- <cartoonId> [--scene N] [--no-tap] [--every 3] [--frames N] [--parallel 1] [--url http://localhost:5173] [--strict]');
  console.error(`On the shelf: ${SHELF.map((c) => c.id).join(', ') || '(nothing yet)'}`);
  process.exit(2);
}
const entry = SHELF.find((c) => c.id === id);
if (!entry) {
  console.error(`"${id}" is not on the shelf (src/cartoons/index.ts). On the shelf: ${SHELF.map((c) => c.id).join(', ') || '(nothing yet)'}`);
  process.exit(2);
}
const cartoon = (await entry.load()).default;
const EVERY = Number(option('every', 3));
/** Most frames kept per scene after the opening set: --frames N, but never more than the safety cap. */
const MAX_FRAMES = 60;
const FRAMES = Math.min(MAX_FRAMES, option('frames') === undefined ? MAX_FRAMES : Number(option('frames')));
const PARALLEL = Math.max(1, Number(option('parallel', 1)));
const NO_TAP = flag('no-tap');
const OUT = resolve(ROOT, option('out', join('screenshots', id)));
const only = option('scene') === undefined ? null : Number(option('scene')) - 1;
/** Scenes are numbered from 1 for people (scene 1 is `?scene=0`). */
const sceneIndexes = only === null ? cartoon.scenes.map((_, i) => i) : [only];
if (sceneIndexes.some((i) => !cartoon.scenes[i])) {
  console.error(`${id} has ${cartoon.scenes.length} scenes; there is no scene ${only + 1}.`);
  process.exit(2);
}

// Longest a scene may take (the player gives up on one after 180 s, plus the curtains).
const STUCK_SECONDS = 200;
const TAP_WAIT_SECONDS = 21; // the kit's patience: 9 s, a nudge, 12 s, then it helps him
const SILENT_SECONDS = 4; // a stretch with no caption and no tap waiting longer than this is flagged
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ server

let server = null;
async function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once('error', rej);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });
}

async function startServer() {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), '--port', String(port), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  server.stdout.on('data', (d) => (log += d));
  server.stderr.on('data', (d) => (log += d));
  for (let i = 0; i < 240; i++) {
    if (server.exitCode !== null) throw new Error(`vite exited early:\n${log}`);
    try {
      if ((await fetch(base + '/')).ok) return base;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error(`vite did not start:\n${log}`);
}
const stopServer = () => {
  server?.kill();
  server = null;
};
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

  const log = (window.__probe = { events: [], scene: null, sceneT: 0, end: false, taps: 0, tapping: false });
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
    const tapping = !!document.querySelector('[data-tap-to-help]');
    if (tapping && !log.tapping) {
      log.taps++;
      note('tap');
    }
    if (!tapping && log.tapping) note('tap-end');
    log.tapping = tapping;
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

// ------------------------------------------------------------ the timeline

/**
 * From the probe's events (from = the scene's start, to = the next scene's
 * start or the end, -1 if it never came): every caption with when it came
 * on (seconds from the scene's start) and how long it stayed, and the
 * silent stretches: no caption showing and no tap waiting for longer than
 * SILENT_SECONDS. A tap that waits is not silence, even though the
 * captions are off: the ring is breathing and he has something to do.
 */
function timeline(events, from, to) {
  const t0 = events[from].t;
  const tEnd = to >= 0 ? events[to].t : events.at(-1).t;
  const sec = (t) => (t - t0) / 1000;
  const captions = [];
  const busy = []; // [start, end] in seconds: a caption showing, or a tap waiting
  let cur = null;
  let tapAt = null;
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
    } else if (e.type === 'tap') {
      tapAt = e.t;
    } else if (e.type === 'tap-end' && tapAt !== null) {
      busy.push([sec(tapAt), sec(e.t)]);
      tapAt = null;
    }
  }
  close(tEnd);
  if (tapAt !== null) busy.push([sec(tapAt), sec(tEnd)]);

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

async function shootScene(context, base, index) {
  const result = { index, name: cartoon.scenes[index].name, frames: [], errors: [], seconds: null, captions: [], silences: [], lines: [], taps: 0, capped: null };
  const page = await context.newPage();
  await page.addInitScript(installProbe);
  page.on('pageerror', (e) => result.errors.push(`${e.message}`));
  page.on('console', (m) => {
    // A missing recording (404) is normal before the voices are made.
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) result.errors.push(`console: ${m.text()}`);
  });

  const shoot = async (tap = false) => {
    const k = result.frames.length;
    const file = join(OUT, `scene${index + 1}-${k}.png`);
    const t = await page.evaluate(() => (performance.now() - window.__probe.sceneT) / 1000).catch(() => 0);
    await page.screenshot({ path: file });
    result.frames.push({ k, file, t, tap });
  };
  const state = () => page.evaluate(() => ({ scene: window.__probe.scene, end: window.__probe.end, tapping: window.__probe.tapping, taps: window.__probe.taps }));

  try {
    await page.goto(`${base}/?cartoon=${id}&scene=${index}`);
    // Anywhere harmless: the first touch is what lets the page play audio.
    await page.mouse.click(590, 806).catch(() => {});

    // Curtains up: the player marks the root with the scene's number.
    const opened = Date.now();
    for (;;) {
      const s = await state();
      if (s.scene === String(index)) break;
      if (result.errors.length) throw new Error('the script threw before the scene began');
      if (Date.now() - opened > 40_000) throw new Error('the curtains never opened (does the cartoon load? is set() throwing?)');
      await sleep(100);
    }
    await shoot();

    let nextFrame = Date.now() + EVERY * 1000;
    let tapped = 0;
    const began = Date.now();
    for (;;) {
      const s = await state();
      if (s.end || (s.scene !== String(index) && s.scene !== null)) break;
      if (result.errors.length) break;
      if (Date.now() - began > STUCK_SECONDS * 1000) {
        result.errors.push(`the scene had not finished after ${STUCK_SECONDS} s`);
        break;
      }
      const room = result.frames.length - 1 < FRAMES; // frames after the opening set
      if (!room && result.capped === null) result.capped = result.frames.at(-1).t;
      if (s.tapping && s.taps > tapped) {
        // His turn: show it, then (unless --no-tap) do it.
        await sleep(350); // let the ring fade in
        if (room) await shoot(true);
        if (!NO_TAP) {
          const box = await page.locator('[data-tap-to-help]').first().boundingBox();
          if (box) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        }
        tapped = s.taps;
        nextFrame = Date.now() + EVERY * 1000;
      } else if (Date.now() >= nextFrame && room) {
        await shoot();
        nextFrame = Date.now() + EVERY * 1000;
      }
      await sleep(100);
    }

    const { events } = await page.evaluate(() => window.__probe);
    // Events are in the order they happened; compare positions, not clock readings (two can share one).
    const from = events.findIndex((e) => e.type === 'scene' && e.scene === String(index));
    const to = events.findIndex((e, i) => i > from && (e.type === 'end' || (e.type === 'scene' && e.scene !== String(index) && e.scene !== null)));
    const mine = events.slice(from + 1, to < 0 ? undefined : to);
    if (to >= 0) result.seconds = (events[to].t - events[from].t) / 1000;
    result.taps = mine.filter((e) => e.type === 'tap').length;
    if (from >= 0) Object.assign(result, timeline(events, from, to));
    result.lines = result.captions.map((c) => c.text);
  } catch (e) {
    result.errors.push(e.message);
    await page.screenshot({ path: join(OUT, `scene${index + 1}-error.png`) }).catch(() => {});
  } finally {
    await page.close().catch(() => {});
  }
  return result;
}

// ------------------------------------------------------------- contact sheet

const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

async function contactSheet(context, results, base) {
  const rows = results
    .map((r) => {
      const label = `Scene ${r.index + 1}: ${esc(r.name)}${r.seconds === null ? '' : ` (${r.seconds.toFixed(0)} s)`}`;
      const thumbs = r.frames
        .map((f, i) => `<figure><img src="${pathToFileURL(f.file).href}"><figcaption>${i === 0 ? 'opening set' : `${f.t.toFixed(0)} s${f.tap ? ' (tap waiting)' : ''}`}</figcaption></figure>`)
        .join('');
      return `<section><h2>${label}</h2><div class="row">${thumbs}</div></section>`;
    })
    .join('');
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(cartoon.title)}</title>
<style>
  body { margin: 0; padding: 16px; width: 1232px; background: #1f2a22; color: #f4ecd8; font: 15px/1.3 system-ui, sans-serif; }
  h1 { margin: 0 0 12px; font-size: 22px; } h2 { margin: 16px 0 6px; font-size: 16px; }
  .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  figure { margin: 0; } img { width: 100%; display: block; border-radius: 4px; background: #000; }
  figcaption { font-size: 12px; opacity: 0.7; padding-top: 2px; }
</style>
<h1>${esc(cartoon.title)} <small style="opacity:.6">(${esc(id)})</small></h1>${rows}`;
  const file = join(OUT, 'sheet.html');
  writeFileSync(file, html);
  const page = await context.newPage();
  await page.setViewportSize({ width: 1264, height: 800 });
  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  await page.screenshot({ path: join(OUT, 'sheet.png'), fullPage: true });
  await page.close();
  rmSync(file);
  void base;
}

// ---------------------------------------------------------------------- run

let exitCode = 0;
try {
  mkdirSync(OUT, { recursive: true });
  // Old frames from an earlier, longer run would mislead.
  const stale = only === null ? /^scene\d+-.*\.png$|^sheet\.png$/ : new RegExp(`^scene${only + 1}-.*\\.png$|^sheet\\.png$`);
  for (const f of readdirSync(OUT)) if (stale.test(f)) rmSync(join(OUT, f));

  const base = (option('url') ?? (await startServer())).replace(/\/$/, '');
  const executablePath = process.env.PW_CHROMIUM || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch({ executablePath, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const context = await browser.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1, hasTouch: true });

  // The dev server turns the code into modules the first time it is asked: do that before any timing.
  const warm = await context.newPage();
  await warm.goto(`${base}/?cartoon=${id}`);
  await warm.waitForFunction(() => document.querySelector('[data-scene]') !== null, null, { timeout: 60_000 }).catch(() => {});
  await warm.close();

  const parallel = Math.min(PARALLEL, sceneIndexes.length);
  console.log(`${cartoon.title} (${id}): ${sceneIndexes.length} scene${sceneIndexes.length === 1 ? '' : 's'}, in real time, ${parallel} at a time, ${NO_TAP ? 'waiting out every tap-to-help (--no-tap)' : 'tapping every tap-to-help at once'}...`);
  const results = new Array(sceneIndexes.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: parallel }, async () => {
      while (next < sceneIndexes.length) {
        const slot = next++;
        results[slot] = await shootScene(context, base, sceneIndexes[slot]);
        const r = results[slot];
        console.log(`  scene ${r.index + 1} done: ${r.seconds === null ? 'no time' : r.seconds.toFixed(1) + ' s'}, ${r.frames.length} frames${r.errors.length ? ', ERRORS' : ''}`);
      }
    }),
  );

  await contactSheet(context, results, base);
  await browser.close();

  // ---------------------------------------------------------- the report
  const flags = [];
  const errors = [];
  const mode = NO_TAP
    ? 'MODE: --no-tap (no tap-to-help was tapped: the nudge and helped lines played, and each wait ran its full ~21 s)'
    : 'MODE: tapping (every tap-to-help was tapped at once; a child who waits takes up to ~21 s longer for each)';
  console.log(`\nPacing for ${id} (measured in real time, ${parallel} scene${parallel === 1 ? '' : 's'} at a time)`);
  console.log(`  ${mode}`);
  if (parallel > 1) console.log(`  WARNING: ${parallel} scenes ran at once, so a busy machine makes the times read high (GSAP lag smoothing). Run with --parallel 1 for true times.`);
  console.log('  scene  seconds  lines  taps  name');
  for (const r of results) {
    const secs = r.seconds === null ? '   ?' : r.seconds.toFixed(0).padStart(4);
    console.log(`  ${String(r.index + 1).padStart(5)}  ${secs} s  ${String(r.lines.length).padStart(5)}  ${String(r.taps).padStart(4)}  ${r.name}`);
    if (r.seconds !== null && r.seconds > 90) flags.push(`scene ${r.index + 1} runs ${r.seconds.toFixed(0)} s: over 90 s. Split it, or cut something.`);
    if (r.lines.length === 0 && r.seconds !== null) flags.push(`scene ${r.index + 1} says nothing (no captions shown): is that on purpose?`);
    for (const s of r.silences) flags.push(`scene ${r.index + 1} is silent from ${s.from.toFixed(1)} s to ${s.to.toFixed(1)} s (${(s.to - s.from).toFixed(1)} s with no caption and no tap waiting).`);
    for (const e of r.errors) errors.push(`scene ${r.index + 1}: ${e}`);
  }

  // Each scene's captions, in order: when each came on (from the scene's start) and how long it stayed.
  console.log(`\nCaption timeline (seconds from each scene's start; silent = no caption and no tap waiting, over ${SILENT_SECONDS} s)`);
  for (const r of results) {
    console.log(`  scene ${r.index + 1}: ${r.name}${r.seconds === null ? '' : ` (${r.seconds.toFixed(1)} s)`}`);
    if (!r.captions.length) console.log('    (no captions)');
    // Silences sit in the list where they happen.
    const rows = [...r.captions.map((c) => ({ at: c.start, c })), ...r.silences.map((s) => ({ at: s.from, s }))].sort((a, b) => a.at - b.at);
    for (const row of rows) {
      if (row.c) console.log(`    ${row.c.start.toFixed(1).padStart(5)} s  ${row.c.dur.toFixed(1).padStart(4)} s  "${row.c.text}"`);
      else console.log(`    ${row.s.from.toFixed(1).padStart(5)} s  ${(row.s.to - row.s.from).toFixed(1).padStart(4)} s  ** SILENT ** (until ${row.s.to.toFixed(1)} s)`);
    }
    if (r.capped !== null) console.log(`    (frames stopped at the cap of ${FRAMES}, ${r.capped.toFixed(0)} s in; raise --frames)`);
  }
  console.log('');
  const timed = results.filter((r) => r.seconds !== null);
  const total = timed.reduce((t, r) => t + r.seconds, 0);
  const taps = results.reduce((t, r) => t + r.taps, 0);
  if (only === null) {
    console.log(`  total  ${fmt(total)} (${total.toFixed(0)} s), ${results.reduce((t, r) => t + r.lines.length, 0)} lines said, ${taps} tap-to-help`);
    if (taps && !NO_TAP) console.log(`         if he waits out every tap: up to ${fmt(total + taps * TAP_WAIT_SECONDS)} (run with --no-tap to measure it)`);
    console.log(`  the script has ${Object.keys(cartoon.lines).length} lines: ${spokenSeconds(cartoon.lines).toFixed(0)} s of speech if each is said once`);
    if (timed.length === results.length) {
      if (total < 120) flags.push(`the episode runs ${fmt(total)}: under 2 minutes. Add a beat, or a scene.`);
      if (total > 300) flags.push(`the episode runs ${fmt(total)}: over 5 minutes. Cut something.`);
    }
    const said = new Set(results.flatMap((r) => r.lines));
    const unseen = Object.entries(cartoon.lines).filter(([, l]) => !said.has(personalise(l.text, DEFAULT_NAME)));
    if (unseen.length) console.log(`  not said in this run: ${unseen.map(([k]) => k).join(', ')} ${NO_TAP ? '' : '(nudge and helped lines only come if he waits: try --no-tap)'}`);
  }
  for (const f of flags) console.log(`FLAG   ${f}`);
  for (const e of errors) console.log(`ERROR  ${e}`);
  console.log(`\nContact sheet: ${join(OUT, 'sheet.png')}   (look at this first, then any scene that looks odd)`);
  console.log(`Screenshots:   ${OUT}/scene<n>-<k>.png`);
  if (errors.length || (flag('strict') && flags.length)) exitCode = 1;
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  exitCode = 1;
} finally {
  stopServer();
}
process.exit(exitCode);
