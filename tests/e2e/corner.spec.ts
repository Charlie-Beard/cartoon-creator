import { expect, test } from '@playwright/test';
import { SHELF } from '../../src/cartoons';
import { answerTo, openCorner } from './helpers';

test('the sum is worked out right', () => {
  expect(answerTo('6 × 8 =')).toBe(48);
  expect(answerTo('54 ÷ 6')).toBe(9);
});

test('a wrong answer gives another sum and the right one opens the corner', async ({ page }) => {
  await page.goto('/');
  await page.locator('.gear-btn').click();
  const sum = page.locator('.gate-sum');
  await expect(sum).toBeVisible();

  // Wrong on purpose (the answer is never 0): the gate stays and says so.
  await page.locator('.gate-key[aria-label="0"]').click();
  await page.locator('.gate-key.ok').click();
  await expect(page.locator('.gate-note')).toContainText('Not quite');
  await expect(page.locator('.gate')).toBeVisible();
  await expect(page.locator('.scene.corner')).toHaveCount(0);

  // Right: the gate goes and the corner opens.
  const typed = answerTo((await sum.textContent()) ?? '');
  for (const digit of String(typed)) await page.locator(`.gate-key[aria-label="${digit}"]`).click();
  await page.locator('.gate-key.ok').click();
  await expect(page.locator('.gate')).toHaveCount(0);
  await expect(page.locator('.scene.corner')).toBeVisible();
});

test('the corner lists every cartoon and goes back to the library', async ({ page }) => {
  await page.goto('/');
  await openCorner(page);
  for (const entry of SHELF) await expect(page.locator(`[data-corner="${entry.id}"]`), entry.id).toBeVisible();
  if (!SHELF.length) await expect(page.getByText('No cartoons yet.')).toBeVisible();
  await page.locator('[data-back]').click();
  await expect(page.locator('.scene.library')).toBeVisible();
});

test('the gear is not on the player', async ({ page }) => {
  test.skip(!SHELF.length, 'nothing on the shelf');
  await page.goto(`/?cartoon=${SHELF[0].id}`);
  await expect(page.locator('[data-scene]')).toBeAttached({ timeout: 20_000 });
  await expect(page.locator('.gear-btn')).toBeHidden();
});
