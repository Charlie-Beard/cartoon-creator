import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    // Generous timeout: seeded sweeps over every skill run slowly when agents share the machine.
    testTimeout: 30_000,
    // Keep transformed modules between runs (in node_modules/.vitest-cache): turning every
    // world's art into modules was most of each run, and a session runs the tests many times.
    fsModuleCache: true,
  },
});
