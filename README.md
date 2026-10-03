# Hrudai Nirmal — portfolio

The first slice pairs demo hero text and a centered glass header with the supplied static peacock SVG over an interactive AeroShards WebGPU background. Final copy and subsequent sections remain pending design discussion.

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

The latest supplied `ascii-art (3).svg` is used in `public/peacock.svg`. The isolated 60-glyph Gemini watermark was removed from the bottom right; every other SVG line remains unchanged. A browser test checks the exact watermark-free SHA-256 hash and coordinates. Do not run further cleanup, reconstruction, or animation on this asset.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, dependencies, and animation limitations.
