/** Verify the vector forest-frame draft, its edge directions, and responsive composition. */
import { expect, test } from '@playwright/test';

const EDGE_VINES = [
  { edge: 'top', flow: 'right-to-left', exit: 'right' },
  { edge: 'left', flow: 'top-to-bottom', exit: 'up' },
  { edge: 'bottom', flow: 'left-to-right', exit: 'left' },
  { edge: 'right', flow: 'bottom-to-top', exit: 'down' },
] as const;

test('frames centered hero copy with four anticlockwise edge vines', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Ideas into experiences.' })).toBeVisible();
    await expect(page.locator('.forest-vine')).toHaveCount(4);
    await expect(page.locator('.peacock-artwork')).toHaveCount(0);

    for (const vine of EDGE_VINES) {
      const edgeVine = page.locator(`[data-edge="${vine.edge}"]`);
      await expect(edgeVine).toHaveAttribute('data-flow', vine.flow);
      await expect(edgeVine).toHaveAttribute('data-exit', vine.exit);
    }

    const heroCopyBounds = await page.locator('.hero-copy').boundingBox();
    expect(Math.abs(heroCopyBounds!.x + heroCopyBounds!.width / 2 - 720)).toBeLessThan(3);
    expect(Math.abs(heroCopyBounds!.y + heroCopyBounds!.height / 2 - 450)).toBeLessThan(3);
  } catch (error) { throw new Error('Forest frame composition verification failed', { cause: error }); }
});

test('serves each foliage asset as standalone vector artwork', async ({ request }) => {
  try {
    const assetNames = [
      'vine-top.svg',
      'vine-left.svg',
      'vine-bottom.svg',
      'vine-right.svg',
      'foliage-corner.svg',
      'flora-sprig.svg',
    ];

    for (const assetName of assetNames) {
      const response = await request.get(`/foliage/${assetName}`);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/svg+xml');
      const source = await response.text();
      expect(source).toContain('<svg');
      expect(source).toContain('viewBox=');
      expect(source).not.toContain('<image');
    }
  } catch (error) { throw new Error('Vector foliage asset verification failed', { cause: error }); }
});

test('keeps the forest stage within desktop and mobile viewports', async ({ page }) => {
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 800, height: 420 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('.forest-stage')).toHaveCSS('height', `${viewport.height}px`);
      expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }))).toEqual(viewport);
    }
  } catch (error) { throw new Error('Responsive forest frame verification failed', { cause: error }); }
});

test('keeps the discarded animation and navigation out of the hero', async ({ page }) => {
  try {
    await page.goto('/');
    await expect(page.locator('.aero-shards')).toHaveCount(0);
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByRole('navigation')).toHaveCount(0);
  } catch (error) { throw new Error('Discarded UI verification failed', { cause: error }); }
});

test('keeps the centered copy readable on narrow screens', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const copyBounds = await page.locator('.hero-copy').boundingBox();
    expect(copyBounds!.x).toBeGreaterThanOrEqual(32);
    expect(copyBounds!.x + copyBounds!.width).toBeLessThanOrEqual(358);
    expect(copyBounds!.y).toBeGreaterThan(160);
    expect(copyBounds!.y + copyBounds!.height).toBeLessThan(684);
  } catch (error) { throw new Error('Mobile hero copy verification failed', { cause: error }); }
});
