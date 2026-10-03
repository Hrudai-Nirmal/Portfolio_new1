# Hrudai Nirmal — portfolio

The hero places demo copy on the left and the original peacock on the right, framed by dense realistic foliage. Scrolling slides woody vines clockwise while surrounding greenery retreats outward. The hero text fades as the eye centers and zooms into a tunnel formed by four oversized lines of placeholder words. A placeholder second section follows.

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

The supplied `ascii-art (3).svg` is rendered from `public/peacock.svg`. The isolated 60-glyph Gemini watermark was removed from the bottom right; every other SVG line remains unchanged and is protected by a hash test.

GSAP ScrollTrigger controls the foliage exit, eye zoom, and forward text-tunnel journey in a reversible timeline. Lenis shares GSAP’s animation clock for smooth wheel scrolling. Foreground ferns sway gently at rest and pause offscreen. Reduced-motion visitors receive normal document scrolling with static foliage.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, current decisions, and the forest-to-tunnel transition.
