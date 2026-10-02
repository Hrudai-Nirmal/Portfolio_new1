# Portfolio project context

## Purpose
Build Hrudai Nirmal's portfolio as a dark, immersive, scroll-driven website with smooth animations and interactive components.

## Agreed technology
- Next.js with React and TypeScript, running on Node.js.
- shadcn/ui for interface components.
- GSAP and ScrollTrigger for animation and scroll-driven sequences.
- GLSL shaders for selected visual effects.
- Zustand for global state when needed.
- Lenis for smooth scrolling.

## Delivery agreements
- Build one section at a time; agree on its direction before implementing it.
- Suggestions and drafts are welcome. Do not invent portfolio content or build the entire site at once.
- Commit and push completed changes to https://github.com/Hrudai-Nirmal/Portfolio_new1.git using Conventional Commits.
- The intended deployment platform is Vercel. Repository integration and automatic deployments have not yet been verified.
- Use strict red → green → refactor cycles for features and bug fixes. Run existing tests before marking implementation complete.
- Follow the user's supplied AGENTS.md working agreements, including naming, public-function JSDoc, input validation, explicit async error handling, and root-cause fixes.
- Maintain this file as project behavior and decisions evolve.

## Current state
- The home route contains only the static binary peacock on the right. Hero copy, navigation, and later sections remain pending.
- User explicitly requested no animation for this artwork. The canvas, WebGL renderer, playback control, and animation lifecycle code were removed.
- Use `assets/peacock-source.svg`, the unmodified user-provided `ascii-art (2).svg`, as the source of truth for the artwork (849.6 × 1280, 4,472 text glyphs).
- `public/peacock.svg` is the cleaned, transparent SVG served to visitors. It preserves binary `0`/`1` text, uses local monospace, and has no external font requests.
- Regenerate with `node scripts/clean-peacock.mjs`. The script traces the silhouette to discard surrounding mesh glyphs and interpolates missing or darkened head/neck cells from nearby visible colors. The eye and crest retain their original negative space. Repairs estimate hidden detail; they do not recover it exactly.
- Original proportions are preserved with a right-aligned image and an empty left column. The stage remains 100dvh; mobile artwork is bottom-aligned and at most 80vw.

## Dependencies and decisions
- Next.js, React, and React DOM (MIT) provide the agreed application foundation. Next.js was approximately 186 MB unpacked before platform binaries at installation; React approximately 179 KB. These are installation sizes, not client bundles.
- TypeScript and Playwright (Apache-2.0), plus MIT type declarations, are development tooling only. Playwright's separate browser download is not shipped to visitors.
- No image processing dependency is needed: cleanup edits native SVG text cells using Node.js.
- Defer GSAP/ScrollTrigger, Lenis, Zustand, and shadcn until later sections need them. The static hero itself requires none of these.

## Verification
- Four Playwright tests cover static rendering with no canvas/playback controls, responsive right-side placement, removal of stray glyphs, and repaired neck/beak/forehead gaps.
- Each implementation slice was preceded by an observed failing test, followed by passing tests.
- `npm test`, `npm run typecheck`, and `npm run build` pass. Production screenshots inspected at 1440 × 900 and 390 × 844.
