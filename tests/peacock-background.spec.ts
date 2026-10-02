/** Verify the static SVG composition in a real browser, including responsive placement. */
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('shows static peacock artwork without animation or playback controls', async ({ page }) => {
  try {
    await page.goto('/');
    const artwork = page.locator('img.peacock-artwork');
    await expect(artwork).toBeVisible();
    expect(await artwork.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /animation/i })).toHaveCount(0);
    const firstFrame = await artwork.screenshot();
    expect((await artwork.screenshot()).equals(firstFrame)).toBe(true);
  } catch (error) { throw new Error('Static artwork verification failed', { cause: error }); }
});

test('keeps natural proportions on the right and fits desktop and mobile screens', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const artwork = page.locator('img.peacock-artwork');
    await expect(artwork).toBeVisible();
    const bounds = await artwork.boundingBox();
    expect(bounds!.x).toBeGreaterThan(720);
    expect(bounds!.width / bounds!.height).toBeCloseTo(849.6 / 1280, 2);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 800, height: 280 }]) {
      await page.setViewportSize(viewport);
      await expect(page.locator('.peacock-stage')).toHaveCSS('height', `${viewport.height}px`);
      expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))).toEqual(viewport);
    }
  } catch (error) { throw new Error('Responsive artwork verification failed', { cause: error }); }
});

test('serves the supplied SVG byte-for-byte without cleanup or regeneration', async ({ request }) => {
  try {
    const response = await request.get('/peacock.svg');
    expect(response.ok()).toBe(true);
    const artwork = await response.body();
    expect(createHash('sha256').update(artwork).digest('hex')).toBe('5de91a383f54dc2b835d18f619936832f0ae3f299ba0994375aeeb06e07f585c');
  } catch (error) { throw new Error('Original SVG preservation verification failed', { cause: error }); }
});

test('places demo hero copy to the left of the artwork and keeps it readable on mobile', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Ideas into experiences.' })).toBeVisible();
    await expect(page.getByText('Hrudai Nirmal', { exact: true })).toBeVisible();
    const copyBounds = await page.locator('.hero-copy').boundingBox();
    const artworkBounds = await page.locator('.peacock-artwork').boundingBox();
    expect(copyBounds!.x + copyBounds!.width).toBeLessThan(artworkBounds!.x);
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileCopy = await page.locator('.hero-copy').boundingBox();
    const mobileArtwork = await page.locator('.peacock-artwork').boundingBox();
    expect(mobileCopy!.y + mobileCopy!.height).toBeLessThan(mobileArtwork!.y);
    expect(mobileCopy!.x).toBeGreaterThanOrEqual(0);
    expect(mobileCopy!.x + mobileCopy!.width).toBeLessThanOrEqual(390);
  } catch (error) { throw new Error('Hero copy layout verification failed', { cause: error }); }
});
