/** Rebuild the binary SVG from the supplied source; never rasterize or smooth its characters.
 * The traced outline removes unrelated mesh marks. Local color interpolation repairs occluded
 * neck cells, while the eye and crest retain their original negative space.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BODY_OUTLINE = [[92,636],[118,589],[182,542],[248,522],[290,479],[330,446],[360,420],[414,394],[440,400],[452,430],[482,454],[516,447],[526,489],[499,543],[491,573],[528,607],[567,642],[629,649],[653,677],[667,743],[675,863],[684,961],[675,1080],[698,1170],[750,1280],[419,1280],[406,1170],[414,1070],[450,957],[438,881],[461,806],[480,745],[456,694],[414,645],[364,606],[330,602],[303,594],[268,600],[238,591],[181,603],[130,621]];
const CREST_OUTLINE = [[509,454],[528,405],[547,350],[565,301],[583,316],[605,342],[623,368],[640,404],[643,437],[610,452],[568,461]];
const REPAIR_OUTLINE = [[495,574],[528,607],[567,642],[629,649],[653,677],[667,743],[675,863],[684,961],[675,1080],[698,1170],[750,1280],[419,1280],[406,1170],[414,1070],[450,957],[438,881],[461,806],[480,745],[456,694],[414,645],[364,606],[400,591],[446,567]];
const HEAD_REPAIR_OUTLINE = [[92,636],[118,589],[182,542],[248,522],[290,479],[330,446],[360,420],[414,394],[440,400],[452,430],[482,454],[516,447],[526,489],[499,543],[491,573],[446,567],[400,591],[364,606],[330,602],[303,594],[268,600],[238,591],[181,603],[130,621]];
const GLYPH_PATTERN = /<text x="([^"]+)" y="([^"]+)" fill="rgb\((\d+),(\d+),(\d+)\)">([01])<\/text>/g;

/** Use the traced source coordinates to distinguish the bird from disconnected mesh. */
function isInsideOutline(horizontal, vertical, outline) {
  let isInside = false;
  for (let current = 0, previous = outline.length - 1; current < outline.length; previous = current++) {
    const [currentHorizontal, currentVertical] = outline[current];
    const [previousHorizontal, previousVertical] = outline[previous];
    if ((currentVertical > vertical) !== (previousVertical > vertical) && horizontal < (previousHorizontal - currentHorizontal) * (vertical - currentVertical) / (previousVertical - currentVertical) + currentHorizontal) isInside = !isInside;
  }
  return isInside;
}

/** Estimate the hidden feather color from nearby visible cells, excluding black mesh gaps. */
function interpolateColor(horizontal, vertical, visibleGlyphs) {
  const neighbors = visibleGlyphs.map((glyph) => ({ glyph, distance: Math.hypot(glyph.horizontal - horizontal, glyph.vertical - vertical) }))
    .filter((neighbor) => neighbor.distance < 110)
    .sort((left, right) => left.distance - right.distance).slice(0, 16);
  if (neighbors.length === 0) throw new Error(`No visible feather samples near ${horizontal}, ${vertical}.`);
  const totalWeight = neighbors.reduce((sum, neighbor) => sum + 1 / Math.max(8, neighbor.distance), 0);
  return [0, 1, 2].map((channel) => Math.round(neighbors.reduce((sum, neighbor) => sum + neighbor.glyph.color[channel] / Math.max(8, neighbor.distance), 0) / totalWeight));
}

const source = readFileSync(new URL('../assets/peacock-source.svg', import.meta.url), 'utf8');
const sourceGlyphs = [...source.matchAll(GLYPH_PATTERN)].map((match) => ({ horizontal: Number(match[1]), vertical: Number(match[2]), color: match.slice(3, 6).map(Number), character: match[6] }));
if (sourceGlyphs.length !== 4472) throw new Error('Unexpected source SVG: review the glyph parser before regenerating.');
const birdGlyphs = sourceGlyphs.filter((glyph) => isInsideOutline(glyph.horizontal, glyph.vertical, BODY_OUTLINE) || isInsideOutline(glyph.horizontal, glyph.vertical, CREST_OUTLINE));
const glyphMap = new Map(birdGlyphs.map((glyph) => [`${glyph.horizontal.toFixed(1)},${glyph.vertical.toFixed(1)}`, glyph]));
const visibleFeathers = birdGlyphs.filter((glyph) => glyph.vertical > 565 && glyph.color[2] > 65 && isInsideOutline(glyph.horizontal, glyph.vertical, REPAIR_OUTLINE));
const visibleHead = birdGlyphs.filter((glyph) => glyph.vertical < 606 && glyph.color[2] > 35 && isInsideOutline(glyph.horizontal, glyph.vertical, HEAD_REPAIR_OUTLINE));
const repairedGlyphs = [];
for (let row = 0; row < 160; row++) {
  const vertical = row * 8 + 6.4;
  for (let column = 0; column < 177; column++) {
    const horizontal = column * 4.8;
    const glyph = glyphMap.get(`${horizontal.toFixed(1)},${vertical.toFixed(1)}`);
    const isNeck = isInsideOutline(horizontal, vertical, REPAIR_OUTLINE);
    // The eye/face shadow is anatomy, not a missing mesh stripe.
    const isEye = ((horizontal - 393) / 52) ** 2 + ((vertical - 492) / 44) ** 2 < 1;
    const isHead = !isEye && isInsideOutline(horizontal, vertical, HEAD_REPAIR_OUTLINE);
    const shouldRepair = isNeck || isHead;
    if (shouldRepair) {
      const neighborColor = interpolateColor(horizontal, vertical, isNeck ? visibleFeathers : visibleHead);
      // Fill missing cells and the dark occlusion bands, preserving brighter source detail.
      const color = !glyph || glyph.color[2] < neighborColor[2] * 0.65 ? neighborColor : glyph.color;
      repairedGlyphs.push({ horizontal, vertical, color, character: glyph?.character ?? '0' });
    } else if (glyph && Math.max(...glyph.color) > 8) repairedGlyphs.push(glyph);
  }
}
const glyphMarkup = repairedGlyphs.map((glyph) => `    <text x="${glyph.horizontal.toFixed(1)}" y="${glyph.vertical.toFixed(1)}" fill="rgb(${glyph.color.join(',')})">${glyph.character}</text>`).join('\n');
writeFileSync(new URL('../public/peacock.svg', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Cleaned from assets/peacock-source.svg by scripts/clean-peacock.mjs; repaired cells are estimates of occluded feathers. -->
<svg xmlns="http://www.w3.org/2000/svg" width="849.6" height="1280" viewBox="0 0 849.6 1280">
  <style>text { font-family: monospace; font-size: 8px; }</style>
  <g>
${glyphMarkup}
  </g>
</svg>\n`);
