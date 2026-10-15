import { expect, test } from '@playwright/test';
import { SHELF } from '../../scripts/lib/shelf';
import { cardFor } from './helpers';

/** The shelf shows one card per cartoon (and a kind word when there are none). */
test('the library shows a card for every cartoon on the shelf', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Cartoons', { exact: true }).first()).toBeVisible();

  if (!SHELF.length) {
    await expect(page.locator('[data-cartoon]')).toHaveCount(0);
    await expect(page.getByText('No cartoons yet.')).toBeVisible();
    return;
  }

  for (const entry of SHELF) {
    const card = await cardFor(page, entry.id);
    await expect(card, `a card for ${entry.id}`).toHaveCount(1);
    await expect(card).toContainText(entry.title);
    await expect(card).toBeVisible();
    // 72 px is the least a touch target may be.
    const box = await card.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(72);
    expect(box!.height).toBeGreaterThanOrEqual(72);
  }
});

test('the library has the gear in the corner and no scrolling', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.gear-btn')).toBeVisible();
  const scrolls = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 1 || document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(scrolls).toBe(false);
});
