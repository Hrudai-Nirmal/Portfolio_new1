/** Test observable rendering so a blank canvas cannot pass as a working background. */
import { expect, test } from '@playwright/test';

test('renders the supplied artwork, animates, and can pause', async ({ page }) => {
  try {
    const browserErrors: string[] = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('data-render-state', 'ready');
    const firstFrame = await canvas.screenshot({ mask: [page.locator('nextjs-portal')] });
    await expect.poll(async () => {
      try { return (await canvas.screenshot({ mask: [page.locator('nextjs-portal')] })).equals(firstFrame); }
      catch (error) { throw new Error('Could not inspect the animated canvas', { cause: error }); }
    }).toBe(false);
    await page.getByRole('button', { name: 'Pause animation' }).click();
    await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
    const pausedFrame = await canvas.screenshot({ mask: [page.locator('nextjs-portal')] });
    expect((await canvas.screenshot({ mask: [page.locator('nextjs-portal')] })).equals(pausedFrame)).toBe(true);
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

test('fills one viewport with artwork across the width and no page overflow', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('data-render-state', 'ready');
    const screenshot = await canvas.screenshot({ mask: [page.locator('nextjs-portal')] });
    const hasArtworkAtLeft = await page.evaluate(async (imageBase64) => {
      try {
        const image = new Image();
        image.src = `data:image/png;base64,${imageBase64}`;
        await image.decode();
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = image.width;
        sampleCanvas.height = image.height;
        const context = sampleCanvas.getContext('2d');
        if (!context) throw new Error('Pixel sampling requires a 2D context.');
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(100, 0, 100, image.height).data;
        return pixels.some((channel, index) => index % 4 !== 3 && channel > 10);
      } catch (error) { throw new Error('Could not sample the artwork edge', { cause: error }); }
    }, screenshot.toString('base64'));
    expect(hasArtworkAtLeft).toBe(true);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 800, height: 280 }]) {
      await page.setViewportSize(viewport);
      await expect(page.locator('.peacock-stage')).toHaveCSS('height', `${viewport.height}px`);
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
      expect(dimensions).toEqual(viewport);
    }
    await expect(page.locator('.peacock-artwork')).toHaveCSS('background-size', '100% 100%');
  } catch (error) { throw new Error('Viewport fill verification failed', { cause: error }); }
});
