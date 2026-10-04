# Hrudai Nirmal — portfolio

The hero places demo copy on the left and the original peacock on the right, framed by dense realistic foliage. Scrolling slides woody vines clockwise while each surrounding foliage piece falls sideways about a pivot just outside the screen. The hero text fades as the eye centers and zooms in. Once the bird disappears, a tunnel formed by four oversized lines of placeholder words fades in. A placeholder second section follows.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Verification

```sh
npx playwright install chromium
npm test
npm run typecheck
npm run build
```

## Artwork

Realistic foliage uses three AI-generated transparent WebP assets in `public/foliage`, reused across sixteen placements. PNG masters and generation prompts are kept in `assets/foliage`. Earlier SVG drafts remain available for reference.

The supplied `ascii-art (3).svg` is preserved at `public/peacock.svg`. Its glyph group is embedded as inline SVG, with a viewBox zoom that redraws crisp vector characters. The isolated 60-glyph Gemini watermark was removed from the bottom right; every other SVG line remains unchanged and is protected by a hash test.

GSAP ScrollTrigger controls the foliage exit, eye zoom, and forward text-tunnel journey in a reversible timeline. Lenis shares GSAP’s animation clock for smooth wheel scrolling. All non-vine foliage swings gently in the breeze and responds to mouse velocity with a brief elastic bend. Separate transform wrappers preserve scroll reversal, and the vines retain their original motion. Reduced-motion visitors receive normal document scrolling with static foliage.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, current decisions, and the forest-to-tunnel transition.
