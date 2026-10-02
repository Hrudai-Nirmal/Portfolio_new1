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

## Current state and gotchas
- The local folder and remote repository were empty at initial inspection.
- Next.js App Router application with strict TypeScript and Playwright browser tests is now configured.
- The home route currently contains only the SVG-based animated peacock background for review; hero copy and layout are still pending.
- Browser tests were observed failing on the empty scaffold, then passing with the renderer. Pause, frame changes, reduced motion, and mobile overflow are covered.

## Hero background — first slice
- Reference: user-provided five-second `peacockvid.mp4`; source artwork: `peacockvector.svg` (844.8 × 1280, 7,040 paths, approximately 1.1 MB).
- Recreate the dark blue/cyan character-texture shimmer with gentle spatial distortion using the SVG as a WebGL texture. A static SVG cannot reconstruct the changing poses in the video; this is an approximation for review.
- Per the viewport-fill request, map the complete artwork to 100% viewport width and 100dvh height. This stretches the portrait on wide screens rather than leaving side gutters or cropping it. The static preview uses the same sizing. Hero copy and later sections are outside this slice.
- Use native WebGL to avoid a graphics-library dependency and animating thousands of SVG DOM nodes.
- Add Next.js, React, and React DOM (MIT) for the agreed application foundation. Next.js is approximately 186 MB unpacked before platform binaries; React approximately 179 KB. These package sizes are installation sizes, not client bundles.
- TypeScript and Playwright (Apache-2.0), plus MIT type declarations, are development tooling only. Playwright needs a separate browser download for real GPU/browser verification; it is not shipped to visitors.
- Defer GSAP/ScrollTrigger, Lenis, Zustand, and shadcn until the sections require their capabilities.

## Verification and renderer details
- `npm test`, `npm run typecheck`, and `npm run build` pass. Production screenshots inspected at 1440 × 900 and 390 × 844.
- Shader distortion and shimmer approximate the reference; no video playback or true pose reconstruction is used.
- SVG remains visible before hydration or if WebGL fails, with an explicit error message on failure.
- Animation pauses for reduced motion by default, via the visitor control, and while the document is hidden. GPU pixel density is capped at 1.5.
- Use animation-frame timestamps consistently: mixing them with `performance.now()` caused a negative initial delta during testing.

- Viewport-fill regression test first failed on the empty left gutter, then passed after updating shader UV mapping and CSS. Covers desktop, mobile, and short landscape viewports with no overflow.
