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
- The home route has demo hero text on the left and the supplied static binary peacock on the right. On mobile, copy sits above the bottom-aligned artwork. Navigation and later sections remain pending.
- Demo copy: Hrudai Nirmal; “Ideas into experiences.”; “A space for thoughtful design, expressive interfaces, and the curiosity that connects them.”; “Design. Code. Curiosity.” This is placeholder copy, not approved final portfolio content.
- User explicitly requested the latest `ascii-art (1).svg` be used directly without any edits. `public/peacock.svg` is a byte-for-byte copy, including its original style/font declarations and black background. Do not clean, reconstruct, filter, or animate it.
- Source dimensions: 849.6 × 1280. SHA-256: `5de91a383f54dc2b835d18f619936832f0ae3f299ba0994375aeeb06e07f585c`.
- Removed the earlier repair script and superseded source asset to prevent accidental regeneration. Prior versions remain in Git history.
- Original proportions and right-side placement remain. The stage is 100dvh; mobile artwork is bottom-aligned and at most 80vw.

## Dependencies and decisions
- Next.js, React, and React DOM (MIT) provide the agreed application foundation. Next.js was approximately 186 MB unpacked before platform binaries at installation; React approximately 179 KB. These are installation sizes, not client bundles.
- TypeScript and Playwright (Apache-2.0), plus MIT type declarations, are development tooling only. Playwright's separate browser download is not shipped to visitors.
- No image processing dependency or transformation pipeline is used; serve the supplied SVG directly.
- Defer GSAP/ScrollTrigger, Lenis, Zustand, and shadcn until later sections need them. The static hero itself requires none of these.

## Verification
- Four Playwright tests cover static rendering, responsive artwork placement, byte-for-byte preservation of the supplied SVG, and readable demo copy beside/above the artwork.
- Each implementation slice was preceded by an observed failing test, followed by passing tests.
- `npm test`, `npm run typecheck`, and `npm run build` pass. Production screenshots inspected at 1440 × 900 and 390 × 844.
