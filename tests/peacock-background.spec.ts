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

test('keeps the peacock proportional on the right with clear space for hero copy', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('data-render-state', 'ready');
    const screenshot = await page.locator('.peacock-stage').screenshot({ mask: [page.locator('nextjs-portal')] });
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
    expect(hasArtworkAtLeft).toBe(false);
    const artworkBounds = await canvas.boundingBox();
    expect(artworkBounds).not.toBeNull();
    expect(artworkBounds!.x).toBeGreaterThan(720);
    expect(artworkBounds!.width / artworkBounds!.height).toBeCloseTo(0.66, 2);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 800, height: 280 }]) {
      await page.setViewportSize(viewport);
      await expect(page.locator('.peacock-stage')).toHaveCSS('height', `${viewport.height}px`);
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
      expect(dimensions).toEqual(viewport);
    }
    await expect(page.locator('.peacock-artwork')).toHaveCSS('background-size', '100% 100%');
  } catch (error) { throw new Error('Right-aligned artwork verification failed', { cause: error }); }
});

test('removes surrounding mesh from the source artwork while retaining the bird', async ({ page }) => {
  try {
    await page.goto('/');
    const samples = await page.evaluate(async () => {
      try {
        const artwork = new Image();
        artwork.src = '/peacock.svg';
        await artwork.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 845;
        canvas.height = 1280;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Artwork sampling requires a 2D context.');
        context.drawImage(artwork, 0, 0);
        function hasVisiblePixels(left: number, top: number, width: number, height: number) {
          return context!.getImageData(left, top, width, height).data.some((value, index) => index % 4 !== 3 && value > 10);
        }
        return {
          upperBackground: hasVisiblePixels(0, 0, 845, 300),
          leftBackground: hasVisiblePixels(0, 700, 250, 500),
          rightBackground: hasVisiblePixels(730, 350, 110, 850),
          head: hasVisiblePixels(280, 430, 250, 160),
          neck: hasVisiblePixels(440, 800, 160, 400),
        };
      } catch (error) { throw new Error('Could not inspect the source artwork', { cause: error }); }
    });
    expect(samples).toEqual({ upperBackground: false, leftBackground: false, rightBackground: false, head: true, neck: true });
  } catch (error) { throw new Error('Background removal verification failed', { cause: error }); }
});
