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
  use: {
    baseURL: `http://localhost:${port}`,
    hasTouch: true,
    isMobile: false,
    deviceScaleFactor: 2,
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  projects: [
    { name: 'home-screen', use: { viewport: { width: 1180, height: 820 } } },
    { name: 'safari-tab', use: { viewport: { width: 1180, height: 760 } } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
