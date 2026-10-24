/**
 * The narrator and every character's voice.
 *
 *   lines → audio/lines/<id>.mp3  (whole lines; the id includes the
 *                                  speaker, see `voiceId` in core/phrases.ts)
 *
 * Until a line is recorded (scripts/voice, ElevenLabs), it falls back to
 * the iPad's own British voice. Only one voice clip plays at a time.
 */
import { voiceId } from '../core/phrases';
import { onPause, paused, whenPlaying } from '../ui/pause';
import { audio, buses } from './engine';

interface Manifest {
  lines: string[];
}

let manifest: Manifest = { lines: [] };
let manifestLoaded: Promise<void> | null = null;

const buffers = new Map<string, Promise<AudioBuffer | null>>();
let current: { stop: () => void } | null = null;

const base = (): string => new URL('./audio/', document.baseURI).href;

/**
 * A fetch that gives up after a while: a request stuck on a poor
 * connection must not hold the show up. Giving up just means the iPad's
 * own voice speaks.
 */
function fetchSoon(url: string, ms = 6000): Promise<Response> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { signal: ctl.signal }).finally(() => clearTimeout(t));
}

export function loadManifest(): Promise<void> {
  manifestLoaded ??= fetchSoon(base() + 'manifest.json')
    .then((r) => (r.ok ? r.json() : manifest))
    .then((m: Partial<Manifest>) => {
      manifest = { lines: m.lines ?? [] };
    })
    .catch(() => {});
  return manifestLoaded;
}

/**
 * Decoded clips are big (about 190 KB for every second of speech), so the
 * cache keeps only the most recently used couple of minutes. An episode
 * preloads its own lines; older ones are fetched again from the browser's
 * own cache if they are ever needed.
 */
const MAX_CACHED_SECONDS = 120;
const cachedSeconds = new Map<string, number>();
let cachedTotal = 0;

function remember(url: string, buf: AudioBuffer): void {
  cachedSeconds.set(url, buf.duration);
  cachedTotal += buf.duration;
  // Oldest first (a Map keeps the order they were last used in); never the one just decoded.
  for (const old of buffers.keys()) {
    if (cachedTotal <= MAX_CACHED_SECONDS) break;
    const secs = cachedSeconds.get(old);
    if (old === url || secs === undefined) continue;
    cachedTotal -= secs;
    cachedSeconds.delete(old);
    buffers.delete(old);
  }
}

function fetchBuffer(url: string): Promise<AudioBuffer | null> {
  let p = buffers.get(url);
  if (p) {
    // Used again: move it to the back of the queue for going.
    buffers.delete(url);
    buffers.set(url, p);
    return p;
  }
  p = fetchSoon(url)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
    .then((data) => audio().decodeAudioData(data))
    .then((buf) => {
      if (buffers.get(url) === p) remember(url, buf);
      return buf;
    })
    .catch(() => null);
  buffers.set(url, p);
  return p;
}

/** Resolves true when the clip played to its end, false when something stopped it. */
function playBuffer(buf: AudioBuffer, rate = 1): Promise<boolean> {
  stopClip();
  return new Promise((resolve) => {
    const src = audio().createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    src.connect(buses.voice);
    let done = false;
    const finish = (completed: boolean) => {
      if (done) return;
      done = true;
      if (current?.stop === stopThis) current = null;
      resolve(completed);
    };
    const stopThis = () => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
      finish(false);
    };
    // Stopping a source also fires onended, so `stopThis` must get in first.
    src.onended = () => finish(true);
    // Safety net: when iOS suspends the audio (a call, Siri, coming back to
    // the app) the clip never plays and onended never fires. Carry on as if
    // it was said, and make sure it can't start late over the next line.
    setTimeout(() => {
      if (done) return;
      try {
        src.stop();
      } catch {
        /* never started */
      }
      finish(true);
    }, (buf.duration / rate) * 1000 + 1500);
    current = { stop: stopThis };
    src.start();
  });
}

let britishVoice: SpeechSynthesisVoice | null | undefined;
function pickVoice(): SpeechSynthesisVoice | null {
  if (britishVoice !== undefined) return britishVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (!voices.length) return null;
  const gb = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en-gb'));
  britishVoice =
    gb.find((v) => /premium|enhanced/i.test(v.name)) ?? gb.find((v) => /serena|kate|stephanie|daniel/i.test(v.name)) ?? gb[0] ?? null;
  return britishVoice;
}

/** Resolves true when the iPad finished saying it, false when it was cut off. */
function speak(text: string, rate = 0.85): Promise<boolean> {
  stopClip();
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve(false);
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = rate;
    u.pitch = 1.05;
    const v = pickVoice();
    if (v) u.voice = v;
    let done = false;
    const finish = (completed: boolean) => {
      if (done) return;
      done = true;
      resolve(completed);
    };
    u.onend = () => finish(true);
    // Cancelling fires an error event too; the stop below has already said false.
    u.onerror = () => finish(false);
    // Safety net: Safari occasionally never fires onend.
    setTimeout(() => finish(true), 1200 + text.length * 120);
    current = {
      stop: () => {
        synth.cancel();
        finish(false);
      },
    };
    synth.speak(u);
  });
}

/**
 * In development, once there are recordings, says in the console when
 * something falls back to the iPad's voice: a line scripts/voice/export.ts
 * missed, or one changed since it was recorded.
 */
function unrecorded(what: string): void {
  if (import.meta.env.DEV && manifest.lines.length) console.warn(`[voice] not recorded, the iPad says it: ${what}`);
}

/**
 * The line that owns the voice now. A new one, or
 * stop(), takes it away, so a line still loading when it is cancelled
 * stays silent instead of playing late.
 */
let speaking: object | null = null;

/** Stops the clip playing now . */
function stopClip(): void {
  const c = current;
  current = null;
  c?.stop();
}

/**
 * Plays a line for `token`, holding it while the game is paused (ui/pause.ts).
 * The pause cuts off the clip playing; once he's back the line is said
 * again from its start, so he never misses one and the caller just waits.
 */
async function held(token: object, play: () => Promise<boolean>): Promise<boolean> {
  for (;;) {
    await whenPlaying();
    if (speaking !== token) return false;
    const finished = await play();
    if (finished || speaking !== token || !paused()) return finished;
  }
}

// Nothing is said while the game is paused: cut off what's playing (`held` says it again).
onPause((p) => p && stopClip());

/** Stops all speech. */
export function stop(): void {
  speaking = null;
  stopClip();
}

const lineUrl = (id: string) => `${base()}lines/${id}.mp3`;
export const voice = {
  /**
   * Says a line in a speaker's voice (a character id, default the
   * narrator).   *
   * Resolves true only if the line played to its end. False means it was
   * interrupted or stopped, so callers must not carry on as if it finished.
   */
  async say(template: string, who = 'narrator'): Promise<boolean> {
    stop();
    const token = {};
    speaking = token;
    await loadManifest();
    const id = voiceId(template, who);
    if (manifest.lines.includes(id)) {
      const buf = await fetchBuffer(lineUrl(id));
      if (speaking !== token) return false;
      if (buf) return held(token, () => playBuffer(buf));
    }
    if (speaking !== token) return false;
    unrecorded(`${who}: “${template}”`);
    return held(token, () => speak(template, 0.9));
  },

  /** Warms the cache so the first tap answers instantly. Lines are the narrator's unless they say who. */
  async preload(o: { lines?: Array<string | { text: string; who?: string }> }): Promise<void> {
    await loadManifest();
    const jobs: Promise<unknown>[] = [];
    for (const l of o.lines ?? []) {
      const { text: t, who } = typeof l === 'string' ? { text: l, who: undefined } : l;
      const id = voiceId(t, who);
      if (manifest.lines.includes(id)) jobs.push(fetchBuffer(lineUrl(id)));
    }
    await Promise.all(jobs);
  },

  stop,
};

// iOS loads speech voices lazily.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    britishVoice = undefined;
  };
}
