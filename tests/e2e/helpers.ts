import { expect, type Page } from '@playwright/test';
import { SHELF } from '../../scripts/lib/shelf';

/**
 * The cartoons to play through: the whole shelf, or just CARTOON=<id>
 * (comma-separated for several) while one is being written.
 */
export const CARTOONS = SHELF.filter((c) => !process.env.CARTOON || process.env.CARTOON.split(',').includes(c.id));

/** The grown-ups' gate's sum ("6 × 8", "54 ÷ 6"), worked out from what is on screen. */
export function answerTo(text: string): number {
  const m = /^\s*(\d+)\s*([×÷])\s*(\d+)\s*=?\s*$/.exec(text);
  if (!m) throw new Error(`Not a sum I know: "${text}"`);
  const [a, b] = [Number(m[1]), Number(m[3])];
  return m[2] === '×' ? a * b : a / b;
}

/** Types a number on the gate's pad and presses OK. */
async function typeAnswer(page: Page, answer: number): Promise<void> {
  for (const digit of String(answer)) await page.locator(`.gate-key[aria-label="${digit}"]`).click();
  await page.locator('.gate-key.ok').click();
}

/** From the library: the gear, the sum, the right answer, and into the grown-ups' corner. */
export async function openCorner(page: Page): Promise<void> {
  await page.locator('.gear-btn').click();
  const sum = page.locator('.gate-sum');
  await expect(sum).toBeVisible();
  await typeAnswer(page, answerTo((await sum.textContent()) ?? ''));
  await expect(page.locator('.gate')).toHaveCount(0);
  // The corner loads every cartoon's script to list its scenes, which can
  // take a while on a busy machine.
  await expect(page.locator('.scene.corner')).toBeVisible({ timeout: 20_000 });
}

/** The library's card for a cartoon, turning pages if it is not on the first. */
export async function cardFor(page: Page, id: string) {
  const card = page.locator(`[data-cartoon="${id}"]`);
  const more = page.getByRole('button', { name: 'More cartoons' });
  // Wait for the shelf to be drawn first: on a busy machine the first look
  // can come before it, when neither the card nor "More" is there yet.
  await expect(page.locator('.shelf-card').first()).toBeAttached({ timeout: 20_000 });
  for (let guard = 0; guard < 20 && (await card.count()) === 0; guard++) {
    if (!(await more.isVisible())) break;
    await more.click();
    await page.waitForTimeout(600);
  }
  return card;
}

/**
 * Moves the page's fake clock (page.clock.install()) on by `ms`, a quarter
 * second at a time. Each jump fires the timers that fall due and draws one
 * frame, where clock.runFor would draw every frame on the way (60 a second,
 * which is most of a play-through's time). GSAP reads a jump of more than
 * half a second as lag and shortens it, so the jumps stay under that.
 */
export async function advance(page: Page, ms: number): Promise<void> {
  for (let t = 0; t < ms; t += 250) await page.clock.fastForward(Math.min(250, ms - t));
}

/** What the player is showing: the scene number it has reached, or 'end' once the end button is up. */
export const playerState = (page: Page): Promise<string> =>
  page.evaluate(() => (document.querySelector('[data-end]') ? 'end' : (document.querySelector('[data-scene]')?.getAttribute('data-scene') ?? '')));
