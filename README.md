# Hrudai Nirmal — portfolio

The first slice pairs demo hero text with the supplied static peacock SVG. Final copy, navigation, and subsequent sections remain pending design discussion.

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

The latest supplied `ascii-art (1).svg` is copied directly to `public/peacock.svg`, without modifications. The browser test checks its exact SHA-256 hash. Do not run cleanup, reconstruction, or animation on this asset.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, dependencies, and animation limitations.
