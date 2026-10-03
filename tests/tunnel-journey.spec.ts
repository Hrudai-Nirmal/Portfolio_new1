/** Verify the complete scroll journey by observing actual projected geometry and reverse playback. */
import { expect, test } from '@playwright/test';

test('aligns the eye vertically and removes the green background light', async ({ page }) => {
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const eye = page.locator('.peacock-eye');
      await expect(eye).toBeAttached();
      const bounds = await eye.boundingBox();
      expect(Math.abs(bounds!.y - viewport.height / 2)).toBeLessThan(2);
      await expect(page.locator('.forest-atmosphere')).toHaveCSS('background-image', 'none');
      await expect(page.locator('.forest-stage')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    }
  } catch (error) { throw new Error('Eye starting alignment failed', { cause: error }); }
});

test('fades copy with vines, centers the eye, zooms into a full-height text tunnel and reverses', async ({ page }) => {
  try {
    const browserErrors: string[] = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/lenis/);
    await expect(page.locator('.forest-scroll')).toHaveAttribute('data-animation-ready', 'true');
    await page.evaluate(() => window.scrollTo(0, 420));
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '0');
    await expect.poll(() => page.locator('[data-motion="vine"]').evaluateAll((vines) =>
      vines.every((vine) => Number(getComputedStyle(vine).opacity) < 0.05)
    )).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 1050));
    await expect.poll(async () => {
      const eyeBounds = await page.locator('.peacock-eye').boundingBox();
      return Math.abs(eyeBounds!.x - 720) + Math.abs(eyeBounds!.y - 450);
    }).toBeLessThan(3);
    await page.evaluate(() => window.scrollTo(0, 2100));
    await expect.poll(() => page.locator('.peacock-artwork').evaluate((artwork) =>
      (artwork as SVGSVGElement).viewBox.baseVal.width
    )).toBeLessThan(100);
    await page.evaluate(() => window.scrollTo(0, 3100));
    await expect(page.locator('.text-tunnel')).toHaveCSS('opacity', '1');
    await expect(page.locator('.peacock-position')).toHaveCSS('opacity', '0');
    await expect(page.locator('.tunnel-wall')).toHaveCount(4);
    await expect(page.locator('.tunnel-wall text')).toHaveCount(4);
    await expect(page.locator('.tunnel-wall text').first()).toHaveCSS('font-size', '1300px');
    const initialDepth = await page.locator('.tunnel-camera').evaluate((camera) => new DOMMatrix(getComputedStyle(camera).transform).m43);
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.locator('.tunnel-camera').evaluate((camera) =>
      new DOMMatrix(getComputedStyle(camera).transform).m43
    )).toBeGreaterThan(initialDepth + 500);
    // Reverse through the same wheel input as visitors; native scrollTo races active Lenis inertia.
    await page.mouse.wheel(0, -10000);
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
    await expect(page.locator('.text-tunnel')).toHaveCSS('opacity', '0');
    await expect(page.locator('.peacock-artwork')).toHaveAttribute('viewBox', '0 0 1358.4 2048');
    expect(browserErrors).toEqual([]);
  } catch (error) { throw new Error('Eye to text tunnel journey failed', { cause: error }); }
});

test('keeps the tunnel functional on mobile and disables the journey for reduced motion', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.forest-scroll')).toHaveAttribute('data-animation-ready', 'true');
    await page.evaluate(() => window.scrollTo(0, 3200));
    await expect(page.locator('.text-tunnel')).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.forest-scroll')).toHaveCSS('height', '844px');
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
    await expect(page.locator('.text-tunnel')).toHaveCSS('visibility', 'hidden');
    await page.getByRole('link', { name: 'Scroll to explore' }).click();
    await expect(page.getByRole('heading', { name: 'The next chapter.' })).toBeInViewport();
  } catch (error) { throw new Error('Mobile or reduced-motion journey failed', { cause: error }); }
});
