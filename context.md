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
- The home route has demo hero text on the left and the supplied static binary peacock on the right. On mobile, copy sits above the bottom-aligned artwork.
- The discarded AeroShards background and centered glass header have been removed, including their source files and runtime dependency.
- The next proposed direction is a forest frame made from separate transparent foliage and flora assets around the viewport edges. Its center must remain clear for hero copy, and its eventual scroll transition should move each depth layer outward before the following section enters. This direction is awaiting visual approval and assets before implementation.
- Demo copy: Hrudai Nirmal; “Ideas into experiences.”; “A space for thoughtful design, expressive interfaces, and the curiosity that connects them.”; “Design. Code. Curiosity.” This is placeholder copy, not approved final portfolio content.
- The current source is `ascii-art (3).svg` (1358.4 × 2048). `public/peacock.svg` preserves its original markup except for the explicitly requested Gemini watermark removal; do not clean, reconstruct, filter, or animate the peacock artwork.
- Source SHA-256: `03bd595be76e21cdae112826834fc74b05a913b7f0e437db2d140f06618a0a3d`. Served asset SHA-256: `d483773b1ba23adc487222bd6969970e49b647479e01a2e42c0babe0a5d4b655`.
- The watermark was an isolated 60-glyph grayscale diamond in the bottom-right rectangle `x=1120–1200`, `y=1818–1890`. Only those 60 complete `<text>` lines were removed; comparison against the supplied file confirms all remaining bytes are unchanged.
- Removed the earlier repair script and superseded source asset to prevent accidental regeneration. Prior versions remain in Git history.
- Original proportions and right-side placement remain. The stage is 100dvh; mobile artwork is bottom-aligned and at most 80vw.

## Dependencies and decisions
- Next.js, React, and React DOM (MIT) provide the agreed application foundation. Next.js was approximately 186 MB unpacked before platform binaries at installation; React approximately 179 KB. These are installation sizes, not client bundles.
- TypeScript and Playwright (Apache-2.0), plus MIT type declarations, are development tooling only. Playwright's separate browser download is not shipped to visitors.
- No image processing dependency is used. The one-time watermark edit removed its isolated SVG text elements without changing the peacock.
- Defer Lenis, Zustand, and shadcn UI primitives until later sections need them. GSAP with ScrollTrigger is the intended implementation for the proposed foliage exit, but should be added only after the forest composition is approved.

## Verification
- Five Playwright tests cover the absence of the discarded background and header, responsive artwork placement, the expected watermark-free SVG hash and empty watermark coordinates, and readable demo copy beside/above the artwork.
- Each implementation slice was preceded by an observed failing test, followed by passing tests.
- `npm test`, `npm run typecheck`, and `npm run build` pass.
