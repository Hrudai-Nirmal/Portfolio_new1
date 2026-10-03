# Hrudai Nirmal — portfolio

The current hero is a responsive forest-frame draft built from six standalone SVG foliage assets around centered demo copy. Scroll animation and subsequent sections remain pending visual review.

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

The original foliage assets live in `public/foliage`. They contain real vector paths, gradients, filters, and shapes with no embedded raster images or third-party material.

The latest supplied `ascii-art (3).svg` remains preserved in `public/peacock.svg`, but the forest draft does not render it. The isolated 60-glyph Gemini watermark was removed from the bottom right; every other SVG line remains unchanged.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, current decisions, and the proposed forest transition.
