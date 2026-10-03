/** Regressions for vector detail, a flush tunnel entrance, and reversible phase boundaries. */
import { expect, test } from '@playwright/test';

test('zooms vector coordinates without magnifying a composited image', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('svg.peacock-artwork')).toBeVisible();
    expect(await page.locator('.peacock-artwork text').count()).toBeGreaterThan(1000);
    await page.evaluate(() => window.scrollTo(0, 2100));
    await expect.poll(() => page.locator('.peacock-artwork').evaluate((artwork) =>
      (artwork as SVGSVGElement).viewBox.baseVal.width)).toBeLessThan(100);
    expect(await page.locator('.peacock-camera').evaluate((camera) =>
      new DOMMatrix(getComputedStyle(camera).transform).a)).toBe(1);
  } catch (error) { throw new Error('Vector zoom regression', { cause: error }); }
});

test('aligns the first glyph and full height of all four tunnel walls', async ({ page }) => {
  try {
    await page.goto('/');
    await expect(page.locator('.forest-scroll')).toHaveAttribute('data-animation-ready', 'true');
    const walls = await page.locator('.tunnel-wall').evaluateAll((elements) => elements.map((element) => {
      const wall = element as SVGSVGElement;
      const glyphBounds = wall.querySelector('text')!.getBBox();
      const lettering = wall.querySelector('text')!;
      const drawing = document.createElement('canvas').getContext('2d')!;
      drawing.font = getComputedStyle(lettering).font;
      const ink = drawing.measureText(lettering.textContent!);
      const viewport = wall.viewBox.baseVal;
      const transform = new DOMMatrix(getComputedStyle(wall).transform);
      return {
        startGap: Math.abs(glyphBounds.x - viewport.x),
        heightGap: Math.abs(ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent - viewport.height),
        firstDepth: new DOMPoint(-7000, 0, 0).matrixTransform(transform).z,
        lastDepth: new DOMPoint(7000, 0, 0).matrixTransform(transform).z,
      };
    }));
    expect(walls).toHaveLength(4);
    for (const wall of walls) {
      expect(wall.startGap).toBeLessThan(1);
      expect(wall.heightGap).toBeLessThan(1);
      expect(Math.max(wall.firstDepth, wall.lastDepth)).toBeCloseTo(0);
      expect(Math.min(wall.firstDepth, wall.lastDepth)).toBeCloseTo(-14000);
    }
  } catch (error) { throw new Error('Tunnel entrance regression', { cause: error }); }
});

test('never exposes the tunnel over the bird and restores home after resize and repeated reversal', async ({ page }) => {
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('.forest-scroll')).toHaveAttribute('data-animation-ready', 'true');
    for (const scrollPosition of [1950, 2100, 2250, 2400, 2550, 2700, 2900, 3100]) {
      await page.evaluate((position) => window.scrollTo(0, position), scrollPosition);
      await page.waitForTimeout(350);
      const visibility = await page.evaluate(() => ({
        peacock: Number(getComputedStyle(document.querySelector('.peacock-position')!).opacity),
        tunnel: Number(getComputedStyle(document.querySelector('.text-tunnel')!).opacity),
      }));
      expect(visibility.peacock > 0.001 && visibility.tunnel > 0.001).toBe(false);
    }
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);
    for (let cycle = 0; cycle < 2; cycle++) {
      await page.mouse.wheel(0, 7000);
      await expect(page.getByRole('heading', { name: 'The next chapter.' })).toBeInViewport();
      await page.mouse.wheel(0, -12000);
      await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
      await expect(page.locator('.peacock-position')).toHaveCSS('opacity', '1');
      await expect(page.locator('.text-tunnel')).toHaveCSS('visibility', 'hidden');
      await expect.poll(() => page.locator('.forest-edge').evaluateAll((edges) => edges.every((edge) => {
        const style = getComputedStyle(edge);
        const transform = new DOMMatrix(style.transform);
        return style.opacity === '1' && Math.abs(transform.m41) < 1 && Math.abs(transform.m42) < 1;
      }))).toBe(true);
      await expect(page.locator('.peacock-artwork')).toHaveAttribute('viewBox', '0 0 1358.4 2048');
    }
  } catch (error) { throw new Error('Phase reversal regression', { cause: error }); }
});
