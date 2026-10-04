/** Verify rooted foliage motion and velocity-driven contact independently of the vines. */
import { expect, test } from '@playwright/test';

test('swings each foliage placement about an offscreen root and reverses without translation', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-animation-ready]')).toBeAttached();
    await expect(page.locator('.foliage-swing')).toHaveCount(12);
    const roots = await page.locator('.foliage-swing').evaluateAll((branches) => branches.map(branch => {
      const [horizontal, vertical] = getComputedStyle(branch).transformOrigin.split(' ').map(parseFloat);
      return { horizontal, vertical, direction: branch.getAttribute('data-fall') };
    }));
    expect(new Set(roots.map(root => root.direction)).size).toBe(2);
    expect(roots.every(root => root.horizontal < 0 || root.horizontal > 1440 || root.vertical < 0 || root.vertical > 900)).toBe(true);
    await page.evaluate(() => scrollTo(0, 500));
    await expect.poll(() => page.locator('.foliage-swing').evaluateAll(branches => branches.every(branch => {
      const matrix = new DOMMatrix(getComputedStyle(branch).transform);
      return Math.abs(matrix.b) > 0.2 && matrix.m41 === 0 && matrix.m42 === 0;
    }))).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await expect.poll(() => page.locator('.foliage-swing').evaluateAll(branches => branches.every(branch => Math.abs(new DOMMatrix(getComputedStyle(branch).transform).b) < 0.001))).toBe(true);
  } catch (error) { throw new Error('Rooted foliage swing failed', { cause: error }); }
});

test('cursor impacts foliage with velocity, settles, and never affects vines', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('.foliage-impact')).toHaveCount(12);
    await page.mouse.move(720, 450);
    await page.mouse.move(1100, 70);
    await expect.poll(() => page.locator('.foliage-impact').evaluateAll(branches => branches.some(branch => Math.abs(new DOMMatrix(getComputedStyle(branch).transform).b) > 0.01))).toBe(true);
    await expect(page.locator('[data-motion="vine"] .foliage-impact')).toHaveCount(0);
    await expect(page.locator('[data-motion="vine"]').first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect.poll(() => page.locator('.foliage-impact').evaluateAll(branches => branches.every(branch => Math.abs(new DOMMatrix(getComputedStyle(branch).transform).b) < 0.001)), { timeout: 5000 }).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.mouse.move(720,450);
    await page.mouse.move(1100,70);
    await expect(page.locator('.foliage-impact').first()).toHaveCSS('transform', 'none');
  } catch (error) { throw new Error('Foliage contact failed', { cause: error }); }
});
