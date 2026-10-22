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

/** The library opens on a bookcase, one book per world, and each book goes in and back out. */
test('the bookcase has a book for every world, and each opens and closes', async ({ page }) => {
  test.skip(!SHELF.length, 'nothing on the shelf');
  await page.goto('/');
  const worlds = [...new Set(SHELF.map((c) => c.world))];
  await expect(page.locator('.shelf-book')).toHaveCount(worlds.length);
  await expect(page.locator('[data-cartoon]')).toHaveCount(0);

  for (const world of worlds) {
    const book = page.locator(`.shelf-book[data-book="${world}"]`);
    const box = await book.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(120);
    expect(box!.height).toBeGreaterThanOrEqual(120);
    await book.click();
    await expect(page.locator('.shelf-deck')).toHaveAttribute('data-open', world);
    // Only this world's cartoons are inside.
    const first = SHELF.find((c) => c.world === world)!;
    await expect(page.locator(`[data-cartoon="${first.id}"]`)).toBeVisible();
    for (const other of SHELF.filter((c) => c.world !== world)) await expect(page.locator(`[data-cartoon="${other.id}"]`)).toHaveCount(0);
    await page.getByRole('button', { name: 'All the books' }).click();
    await expect(page.locator('.shelf-book')).toHaveCount(worlds.length);
  }
});

test('the library has the gear in the corner and no scrolling', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.gear-btn')).toBeVisible();
  const scrolls = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 1 || document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(scrolls).toBe(false);
});
