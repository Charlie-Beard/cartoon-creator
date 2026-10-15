/**
 * Shared by the screenshot scripts (shots.mjs, lab-shots.mjs): start `vite`
 * on a free port, and find a Chromium for Playwright.
 *
 *   const dev = createDevServer(ROOT);
 *   const base = await dev.start();     // "http://127.0.0.1:54321"
 *   ...
 *   dev.stop();
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A port nothing is listening on. */
export function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once('error', rej);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });
}

/** One vite dev server on its own port, so it never clashes with `npm run dev` or another agent's. */
export function createDevServer(root) {
  let server = null;
  return {
    async start() {
      const port = await freePort();
      const base = `http://127.0.0.1:${port}`;
      server = spawn(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), '--port', String(port), '--strictPort', '--host', '127.0.0.1'], {
        cwd: root,
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
    },
    stop() {
      server?.kill();
      server = null;
    },
  };
}

/** Chromium from PW_CHROMIUM, else /opt/pw-browsers/chromium if it exists, else Playwright's own (undefined). */
export const chromiumPath = () => process.env.PW_CHROMIUM || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
