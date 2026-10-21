import { defineConfig } from '@playwright/test';

/** PW_PORT lets several worktrees run their e2e tests at once. */
const port = Number(process.env.PW_PORT ?? 4173);

/**
 * The cartoons target one device: iPad (11th gen), landscape.
 *
 * Every cartoon on the shelf is played through (tests/e2e/cartoons.spec.ts).
 * To test just one while you write it: CARTOON=lost-kettle npm run test:e2e
 * (in the cloud also PW_CHROMIUM=/opt/pw-browsers/chromium).
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  // Every cartoon's tests are in one file (cartoons.spec.ts), and each test
  // opens its own page, so they can share out among the workers rather than
  // queue up behind one. The tests spend most of their time waiting on the
  // page, so a worker per core keeps the machine busy (PW_WORKERS to change it).
  fullyParallel: true,
  workers: process.env.PW_WORKERS ?? '100%',
  use: {
    baseURL: `http://localhost:${port}`,
    hasTouch: true,
    isMobile: false,
    deviceScaleFactor: 2,
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  projects: [
    { name: 'home-screen', use: { viewport: { width: 1180, height: 820 } } },
    // The shorter Safari-tab viewport checks the screens' layout; playing every
    // cartoon through again at that size would double the slowest tests for
    // nothing (the stage is letterboxed the same way).
    { name: 'safari-tab', use: { viewport: { width: 1180, height: 760 } }, testIgnore: /cartoons\.spec/ },
  ],
  webServer: {
    // PW_PREBUILT=1 serves the dist/ already there (CI builds it once, before the tests).
    command: `${process.env.PW_PREBUILT ? '' : 'npm run build && '}npx vite preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
