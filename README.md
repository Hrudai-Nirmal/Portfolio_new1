# Hrudai Nirmal — portfolio

The first slice is a static, cleaned binary peacock hero background built from the supplied SVG. Hero text, navigation, and subsequent sections are intentionally pending design discussion.

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

The original supplied SVG is preserved in `assets/peacock-source.svg`. Regenerate the cleaned vector with `node scripts/clean-peacock.mjs`. Mesh gaps are reconstructed from nearby glyph colors while preserving the binary style.

## Deployment

Import this repository in Vercel using its Next.js preset, repository root, and `main` production branch. No environment variables are required. Automatic deployments depend on the GitHub integration being configured in Vercel.

See [context.md](context.md) for working agreements, dependencies, and animation limitations.
