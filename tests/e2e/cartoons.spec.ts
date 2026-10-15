import { expect, test, type Page } from '@playwright/test';
import { cardFor, CARTOONS, openCorner, playerState } from './helpers';

/**
 * Every cartoon on the shelf (CARTOON=<id> for just one) is opened from the
 * library, played through every scene to the end button, and the library
 * shows the watched tick. With an empty shelf there is nothing here.
 *
 * Two ways through: skipping scene after scene (fast, and checks every
 * scene can be left), and playing it as he would, with the clock sped up,
 * tapping the first tap-to-help when it appears.
 */

/** How many scenes a cartoon has, as the corner's "play from" list shows. */
async function sceneCount(page: Page, id: string): Promise<number> {
  await page.goto('/');
  await openCorner(page);
  const options = page.locator(`[data-corner="${id}"] select option`);
  // The list fills in once the script has loaded.
  await expect.poll(() => options.count(), { timeout: 20_000 }).toBeGreaterThan(0);
  const n = await options.count();
  await page.locator('[data-back]').click();
  await expect(page.locator('.scene.library')).toBeVisible();
  return n;
}

/** Back to the shelf from the end button: the cartoon carries its tick. */
async function backToTheShelf(page: Page, id: string): Promise<void> {
  // The end button breathes for ever, so it is never "stable": press it anyway.
  await page.locator('[data-end]').click({ force: true });
  await expect(page.locator('.scene.library')).toBeVisible();
  const card = await cardFor(page, id);
  await expect(card).toBeVisible();
  await expect(card.locator('.shelf-tick'), `${id} should have the watched tick`).toHaveCount(1);
}

for (const entry of CARTOONS) {
  test.describe(entry.id, () => {
    test('opens from the library, every scene can be skipped, and the end goes back with a tick', async ({ page }) => {
      test.setTimeout(120_000);
      const scenes = await sceneCount(page, entry.id);
      expect(scenes, 'a cartoon has scenes').toBeGreaterThan(0);

      await page.goto('/');
      await (await cardFor(page, entry.id)).click();
      await expect(page.locator('.scene.library')).toHaveCount(0);

      const seen: string[] = [];
      for (let guard = 0; guard < scenes + 4; guard++) {
        // Curtains up, or already at the end.
        await expect.poll(() => playerState(page), { timeout: 30_000 }).not.toBe('');
        const at = await playerState(page);
        if (at === 'end') break;
        seen.push(at);
        // Skip until it takes: between scenes the skip button waits for the paper wipe.
        await expect
          .poll(
            async () => {
              await page.locator('[data-skip]').click({ timeout: 2000 }).catch(() => {});
              await page.waitForTimeout(300);
              return playerState(page);
            },
            { timeout: 30_000, message: `scene ${at} did not skip` },
          )
          .not.toBe(at);
      }
      expect(await playerState(page)).toBe('end');
      expect(seen[0]).toBe('0');
      expect(seen.length).toBeLessThanOrEqual(scenes);
      expect(Number(seen[seen.length - 1])).toBeLessThanOrEqual(scenes - 1);

      await backToTheShelf(page, entry.id);
    });

    test('plays through as he would, tapping his turn, to the end', async ({ page }) => {
      test.setTimeout(240_000);
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      // Time runs on by itself, and is pushed along a second at a time: a
      // whole episode takes seconds, not minutes. (The player moves on from
      // a scene that stalls after 180 s, so nothing can hang the test.)
      await page.clock.install();
      await page.goto('/');
      await (await cardFor(page, entry.id)).click();

      let taps = 0;
      let at = '';
      for (let second = 0; second < 700; second++) {
        const tap = page.locator('[data-tap-to-help]');
        if (await tap.count()) {
          await tap.first().click({ timeout: 3000 }).catch(() => {});
          taps++;
          await page.clock.runFor(500);
        }
        at = await playerState(page);
        if (at === 'end') break;
        await page.clock.runFor(1000);
        // Real time for the audio and fetches the page is waiting on.
        await page.waitForTimeout(15);
      }
      expect(errors, 'the script threw while it played').toEqual([]);
      expect(at, 'the cartoon never reached its end').toBe('end');
      expect(taps, 'no tap-to-help came up').toBeGreaterThan(0);

      await backToTheShelf(page, entry.id);
    });

    test('can be started from its last scene in the grown-ups’ corner', async ({ page }) => {
      await page.goto('/');
      await openCorner(page);
      const row = page.locator(`[data-corner="${entry.id}"]`);
      const options = row.locator('select option');
      await expect.poll(() => options.count(), { timeout: 20_000 }).toBeGreaterThan(0);
      const last = (await options.count()) - 1;
      await row.locator('select').selectOption(String(last));
      await row.locator('[data-play]').click();
      await expect.poll(() => playerState(page), { timeout: 30_000 }).toBe(String(last));
    });
  });
}
