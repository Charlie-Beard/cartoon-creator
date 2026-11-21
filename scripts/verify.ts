/**
 * Everything a PR needs, in one command with a short report: so whoever is
 * working (usually Claude) spends one turn and a few lines on it, not four
 * turns and pages of logs.
 *
 *   npm run verify -- <id> [<id> …]   typecheck, unit tests, check <id>, and e2e for
 *                                     <id> (even if it isn't showing on the shelf yet)
 *                                     plus the library and corner screens
 *   npm run verify                    the same for everything: check every cartoon,
 *                                     e2e every cartoon showing on the shelf (after
 *                                     a change to the kit, the player or a world)
 *   --no-e2e                          skip the browser tests (a quick pass while working)
 *
 * The quick steps run side by side, then the browser tests. Each step prints
 * one line; a failing step also prints the end of its output. `check`'s
 * report is always printed, as its warnings are worth reading. Exits 1 if
 * anything failed.
 */
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('-'));
const e2e = !args.includes('--no-e2e');

interface Step {
  name: string;
  cmd: string[];
  env?: Record<string, string>;
  /** Always show the output (indented), not only on failure. */
  show?: boolean;
}

const ANSI = /\x1b\[[0-9;?]*[A-Za-z]/g;

function run(step: Step): Promise<{ step: Step; ok: boolean; out: string; seconds: number }> {
  const t0 = Date.now();
  return new Promise((resolve) => {
    const child = spawn(step.cmd[0], step.cmd.slice(1), { env: { ...process.env, FORCE_COLOR: '0', ...step.env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', (code) => resolve({ step, ok: code === 0, out: out.replace(ANSI, ''), seconds: (Date.now() - t0) / 1000 }));
  });
}

function report(r: Awaited<ReturnType<typeof run>>): void {
  console.log(`${r.ok ? 'ok  ' : 'FAIL'}  ${r.step.name}  (${r.seconds.toFixed(0)} s)`);
  const lines = r.out.split('\n').filter((l) => l.trim() && !/^\s*(> |npm (notice|warn))/.test(l));
  if (r.step.show) for (const l of lines) console.log(`      ${l}`);
  else if (!r.ok) for (const l of lines.slice(-40)) console.log(`      ${l}`);
}

const quick: Step[] = [
  { name: 'typecheck', cmd: ['npm', 'run', '-s', 'typecheck'] },
  { name: 'unit tests', cmd: ['npx', 'vitest', 'run', '--reporter=dot'] },
  { name: ids.length ? `check ${ids.join(' ')}` : 'check (every cartoon)', cmd: ['npx', 'tsx', 'scripts/check-cartoon.ts', ...ids], show: ids.length > 0 },
];
const browser: Step = {
  name: ids.length ? `e2e: ${ids.join(', ')} and the screens` : 'e2e: every cartoon showing, and the screens',
  cmd: ['npx', 'playwright', 'test', '--reporter=dot'],
  env: ids.length ? { CARTOON: ids.join(',') } : {},
};

console.log(`verify ${ids.join(' ') || '(everything)'}${e2e ? '' : ' (no e2e)'}`);
let failed = 0;
for (const r of await Promise.all(quick.map(run))) {
  report(r);
  if (!r.ok) failed++;
}
if (e2e) {
  const r = await run(browser);
  report(r);
  if (!r.ok) failed++;
}
console.log(failed ? `\n${failed} step${failed === 1 ? '' : 's'} failed.` : '\nAll passed.');
process.exit(failed ? 1 : 0);
