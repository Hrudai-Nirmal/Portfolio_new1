/** Exercise the restored composition, clockwise exit, reverse scroll, and reduced motion. */
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('shows the original peacock right of the copy with loaded realistic foliage', async ({ page, request }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const artwork = page.locator('.peacock-artwork');
    await expect(artwork).toBeVisible();
    const copyBounds = await page.locator('.hero-copy').boundingBox();
    const artworkBounds = await artwork.boundingBox();
    expect(copyBounds!.x + copyBounds!.width).toBeLessThan(artworkBounds!.x);
    await expect(page.locator('.forest-frame img')).toHaveCount(16);
    await expect.poll(() => page.locator('.forest-frame img').evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)
    )).toBe(true);
    const artworkResponse = await request.get('/peacock.svg');
    expect(createHash('sha256').update(await artworkResponse.body()).digest('hex')).toBe('d483773b1ba23adc487222bd6969970e49b647479e01a2e42c0babe0a5d4b655');
  } catch (error) { throw new Error('Restored forest composition failed', { cause: error }); }
});

test('slides vines clockwise and foliage outward, then reverses both on return', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('.forest-scroll')).toHaveAttribute('data-animation-ready', 'true');
    await page.evaluate(() => window.scrollTo(0, 650));
    for (const [edge, axis, sign] of [['top', 'm41', 1], ['right', 'm42', 1], ['bottom', 'm41', -1], ['left', 'm42', -1]] as const) {
      await expect.poll(() => page.locator(`[data-motion="vine"][data-edge="${edge}"]`).evaluate((element, coordinates) =>
        new DOMMatrix(getComputedStyle(element).transform)[coordinates.axis] * coordinates.sign, { axis, sign }
      )).toBeGreaterThan(150);
    }
    for (const [edge, axis, crossAxis, sign] of [['top', 'm42', 'm41', -1], ['right', 'm41', 'm42', 1], ['bottom', 'm42', 'm41', 1], ['left', 'm41', 'm42', -1]] as const) {
      const foliage = page.locator(`[data-motion="foliage"][data-edge="${edge}"]`);
      await expect.poll(() => foliage.evaluateAll((elements, coordinates) =>
        elements.every((element) => {
          const matrix = new DOMMatrix(getComputedStyle(element).transform);
          return matrix[coordinates.axis] * coordinates.sign > 150 && Math.abs(matrix[coordinates.crossAxis]) < 1;
        }), { axis, crossAxis, sign }
      )).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 1150));
    await expect.poll(() => page.locator('.forest-frame').evaluate((frame) =>
      [...frame.children].every((edge) => Number(getComputedStyle(edge).opacity) < 0.05)
    )).toBe(true);
    await page.locator('#next-section').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'The next chapter.' })).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.locator('[data-motion="vine"][data-edge="top"]').evaluate((element) =>
      Math.abs(new DOMMatrix(getComputedStyle(element).transform).m41)
    )).toBeLessThan(2);
    await expect(page.locator('[data-motion="vine"][data-edge="top"]')).toHaveCSS('opacity', '1');
  } catch (error) { throw new Error('Clockwise scroll transition failed', { cause: error }); }
});

test('keeps mobile and short viewports readable without horizontal overflow', async ({ page }) => {
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 800, height: 420 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('.forest-stage')).toHaveCSS('height', `${viewport.height}px`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      await expect(page.locator('.hero-copy')).toBeInViewport();
      await expect(page.locator('.peacock-artwork')).toBeInViewport();
    }
  } catch (error) { throw new Error('Responsive forest failed', { cause: error }); }
});

test('respects reduced motion while keeping both sections accessible', async ({ page }) => {
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.forest-scroll')).toHaveCSS('height', '720px');
    await page.getByRole('link', { name: 'Scroll to explore' }).click();
    await expect(page.getByRole('heading', { name: 'The next chapter.' })).toBeInViewport();
    await expect(page.locator('[data-motion="vine"][data-edge="top"]')).toHaveCSS('transform', 'none');
    await expect(page.locator('.forest-breeze').first()).toHaveCSS('transform', 'none');
  } catch (error) { throw new Error('Reduced motion forest failed', { cause: error }); }
});

test('gently sways foliage at rest and pauses the breeze outside the hero', async ({ page }) => {
  try {
    await page.goto('/');
    const breeze = page.locator('.forest-breeze').first();
    await expect(breeze).toBeAttached();
    const initialTransform = await breeze.evaluate((element) => getComputedStyle(element).transform);
    await expect.poll(() => breeze.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransform);
    await expect(page.locator('.peacock-artwork')).toHaveCSS('transform', 'none');
    await page.locator('#next-section').scrollIntoViewIfNeeded();
    const pausedTransform = await breeze.evaluate((element) => getComputedStyle(element).transform);
    await page.waitForTimeout(250);
    expect(await breeze.evaluate((element) => getComputedStyle(element).transform)).toBe(pausedTransform);
  } catch (error) { throw new Error('Ambient foliage motion failed', { cause: error }); }
});
