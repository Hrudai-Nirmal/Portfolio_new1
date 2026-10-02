/** Verify the static SVG composition in a real browser, including responsive placement. */
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

test('removes stray mesh glyphs and repairs the missing neck band in the new binary artwork', async ({ page }) => {
  try {
    await page.goto('/');
    const samples = await page.evaluate(async () => {
      try {
        const response = await fetch('/peacock.svg');
        if (!response.ok) throw new Error('Artwork request failed.');
        const source = await response.text();
        const document = new DOMParser().parseFromString(source, 'image/svg+xml');
        const glyphs = [...document.querySelectorAll('text')];
        const repairedCells = glyphs.filter((glyph) => Number(glyph.getAttribute('x')) >= 518 && Number(glyph.getAttribute('x')) <= 556.8 && Number(glyph.getAttribute('y')) === 806.4);
        return {
          hasExternalFont: source.includes('@import'),
          hasNonBinaryGlyphs: glyphs.some((glyph) => !/^[01]$/.test(glyph.textContent ?? '')),
          strayGlyphs: glyphs.filter((glyph) => Number(glyph.getAttribute('y')) < 290 || (Number(glyph.getAttribute('x')) < 300 && Number(glyph.getAttribute('y')) > 700)).length,
          repairedCells: repairedCells.length,
          hasVisibleRepairs: repairedCells.every((glyph) => Number(glyph.getAttribute('fill')?.match(/\d+/g)?.[2]) >= 30),
          headHighlights: glyphs.filter((glyph) => glyph.textContent === '1' && Number(glyph.getAttribute('y')) < 600).length,
        };
      } catch (error) { throw new Error('Could not inspect SVG glyphs', { cause: error }); }
    });
    expect(samples.hasExternalFont).toBe(false);
    expect(samples.hasNonBinaryGlyphs).toBe(false);
    expect(samples.strayGlyphs).toBe(0);
    expect(samples.repairedCells).toBe(9);
    expect(samples.hasVisibleRepairs).toBe(true);
    expect(samples.headHighlights).toBeGreaterThan(150);
  } catch (error) { throw new Error('Vector cleanup verification failed', { cause: error }); }
});

test('repairs the mesh breaks through the beak and forehead', async ({ request }) => {
  try {
    const response = await request.get('/peacock.svg');
    expect(response.ok()).toBe(true);
    const source = await response.text();
    expect(source.includes('<text x="158.4" y="590.4"')).toBe(true);
    expect(source.includes('<text x="388.8" y="438.4"')).toBe(true);
  } catch (error) { throw new Error('Facial repair verification failed', { cause: error }); }
});
