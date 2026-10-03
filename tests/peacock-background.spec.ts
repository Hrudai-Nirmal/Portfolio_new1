/** Verify the static SVG composition in a real browser, including responsive placement. */
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('shows the static peacock above the animated AeroShards background', async ({ page }) => {
  try {
    const browserErrors: string[] = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    await page.goto('/');
    const artwork = page.locator('img.peacock-artwork');
    await expect(artwork).toBeVisible();
    await expect(artwork).toHaveAttribute('loading', 'eager');
    expect(await artwork.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('.aero-shards canvas')).toHaveCount(1);
    await expect(page.locator('.aero-shards')).toHaveCSS('background-color', 'rgb(18, 15, 23)');
    await expect(page.getByRole('button', { name: /animation/i })).toHaveCount(0);
    const firstFrame = await artwork.screenshot();
    expect((await artwork.screenshot()).equals(firstFrame)).toBe(true);
    const layers = await page.evaluate(() => ({
      background: Number(getComputedStyle(document.querySelector('.hero-background')!).zIndex),
      peacock: Number(getComputedStyle(document.querySelector('.peacock-artwork')!).zIndex),
      copy: Number(getComputedStyle(document.querySelector('.hero-copy')!).zIndex),
    }));
    expect(layers.background).toBeLessThan(layers.peacock);
    expect(layers.peacock).toBeLessThan(layers.copy);
    await page.mouse.move(1200, 450);
    expect(browserErrors).toEqual([]);
  } catch (error) { throw new Error('Static artwork verification failed', { cause: error }); }
});

test('centers a glass navigation header above the hero', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Hrudai Nirmal' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    const desktopBounds = await header.boundingBox();
    expect(Math.abs(desktopBounds!.x + desktopBounds!.width / 2 - 720)).toBeLessThan(2);
    expect(await header.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain('blur');
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileBounds = await header.boundingBox();
    expect(mobileBounds!.x).toBeGreaterThanOrEqual(12);
    expect(mobileBounds!.x + mobileBounds!.width).toBeLessThanOrEqual(378);
    const mobileCopyBounds = await page.locator('.hero-copy').boundingBox();
    expect(mobileCopyBounds!.y - (mobileBounds!.y + mobileBounds!.height)).toBeGreaterThanOrEqual(16);
  } catch (error) { throw new Error('Glass header verification failed', { cause: error }); }
});

test('keeps natural proportions on the right and fits desktop and mobile screens', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const artwork = page.locator('img.peacock-artwork');
    await expect(artwork).toBeVisible();
    const bounds = await artwork.boundingBox();
    expect(bounds!.x).toBeGreaterThan(720);
    expect(bounds!.width / bounds!.height).toBeCloseTo(1358.4 / 2048, 2);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 800, height: 280 }]) {
      await page.setViewportSize(viewport);
      await expect(page.locator('.peacock-stage')).toHaveCSS('height', `${viewport.height}px`);
      expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))).toEqual(viewport);
    }
  } catch (error) { throw new Error('Responsive artwork verification failed', { cause: error }); }
});

test('serves the new SVG with only the bottom-right watermark removed', async ({ request }) => {
  try {
    const response = await request.get('/peacock.svg');
    expect(response.ok()).toBe(true);
    const artwork = await response.body();
    expect(createHash('sha256').update(artwork).digest('hex')).toBe('d483773b1ba23adc487222bd6969970e49b647479e01a2e42c0babe0a5d4b655');
    const source = artwork.toString('utf8');
    const watermarkGlyphs = [...source.matchAll(/<text x="([^"]+)" y="([^"]+)"/g)].filter((match) => {
      const horizontal = Number(match[1]);
      const vertical = Number(match[2]);
      return horizontal >= 1120 && horizontal <= 1200 && vertical >= 1818 && vertical <= 1890;
    });
    expect(watermarkGlyphs).toHaveLength(0);
  } catch (error) { throw new Error('Watermark removal verification failed', { cause: error }); }
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
