/** Keep the checked-in glyphs as live vectors so zooming never magnifies an image texture. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceArtwork = readFileSync(join(process.cwd(), 'public/peacock.svg'), 'utf8');
const glyphMarkup = sourceArtwork.match(/<g>[\s\S]*<\/g>/)?.[0];
if (!glyphMarkup) throw new Error('The peacock SVG must contain its original glyph group.');

/** Embed only the trusted repository glyph group, leaving source bytes and colors untouched. */
export function PeacockArtwork() {
  return <svg className="peacock-artwork" viewBox="0 0 1358.4 2048" width="1358.4" height="2048"
    role="img" aria-label="Peacock rendered in blue character artwork"
    dangerouslySetInnerHTML={{ __html: glyphMarkup! }} />;
}
