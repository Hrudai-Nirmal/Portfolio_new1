/** Test observable rendering so a blank canvas cannot pass as a working background. */
import { expect, test } from '@playwright/test';

test('renders the supplied artwork, animates, and can pause', async ({ page }) => {
  try {
    const browserErrors: string[] = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('data-render-state', 'ready');
    const firstFrame = await canvas.screenshot();
    await expect.poll(async () => {
      try { return (await canvas.screenshot()).equals(firstFrame); }
      catch (error) { throw new Error('Could not inspect the animated canvas', { cause: error }); }
    }).toBe(false);
    await page.getByRole('button', { name: 'Pause animation' }).click();
    await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
    const pausedFrame = await canvas.screenshot();
    expect((await canvas.screenshot()).equals(pausedFrame)).toBe(true);
    expect(browserErrors).toEqual([]);
  } catch (error) { throw new Error('Peacock animation verification failed', { cause: error }); }
});

test('respects reduced motion and fits a mobile viewport', async ({ page }) => {
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveAttribute('data-render-state', 'ready');
    await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(dimensions.width).toBe(dimensions.viewport);
  } catch (error) { throw new Error('Reduced-motion mobile verification failed', { cause: error }); }
});
