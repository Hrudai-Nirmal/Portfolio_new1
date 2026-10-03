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
- The home route restores the user's unchanged peacock on the right and left-aligned hero copy, surrounded by dense realistic foliage. Narrow screens place the copy above the right-aligned peacock.
- The discarded AeroShards background and centered glass header have been removed, including their source files and runtime dependency.
- Three transparent assets generated with built-in ImageGen form sixteen placements: dense leaf cover, fern/flower clusters, and four exposed woody vines. Optimized alpha WebP files live in `public/foliage`; PNG masters and prompt provenance live in `assets/foliage`. The previous SVG draft remains available but is not used by the page.
- The vines run anticlockwise at rest: top right-to-left, left top-to-bottom, bottom left-to-right, and right bottom-to-top. Their markup records the intended clockwise exits: right, up, left, and down respectively.
- GSAP ScrollTrigger scrubs the four woody vines clockwise during the opening part of the scroll journey, reversing anticlockwise on upward scroll. Background leaves and foreground ferns move outward toward their respective edges. Woody vines sit between those two foliage depths. Each layer owns its scroll transform.
- Woody vines are pushed toward the viewport boundary and intentionally partially cropped. Their travel and fade finish alongside the hero copy fade, early in the scroll interval, matching the early visual clearance of the outward-moving leaves rather than lingering around the hero.
- Foreground fern clusters sway by at most 0.65 degrees and 4 pixels over differing 5.5–7.9 second half-cycles. Nested breeze wrappers prevent ambient transforms from conflicting with scroll transforms. Breeze pauses outside the hero and is disabled with reduced motion.
- A clearly labeled placeholder second section makes the transition reviewable. Reduced motion removes the sticky interval and animation, allowing ordinary scrolling between the two sections.
- Demo copy: Hrudai Nirmal; “Ideas into experiences.”; “A space for thoughtful design, expressive interfaces, and the curiosity that connects them.”; “Design. Code. Curiosity.” This is placeholder copy, not approved final portfolio content.
- The current source is `ascii-art (3).svg` (1358.4 × 2048). `public/peacock.svg` preserves its original markup except for the explicitly requested Gemini watermark removal; do not clean, reconstruct, or filter the peacock artwork. The approved transition embeds the trusted glyph group as inline SVG and animates its viewBox around the eye; it does not scale a composited image. The original served file remains unchanged.
- Source SHA-256: `03bd595be76e21cdae112826834fc74b05a913b7f0e437db2d140f06618a0a3d`. Served asset SHA-256: `d483773b1ba23adc487222bd6969970e49b647479e01a2e42c0babe0a5d4b655`.
- The watermark was an isolated 60-glyph grayscale diamond in the bottom-right rectangle `x=1120–1200`, `y=1818–1890`. Only those 60 complete `<text>` lines were removed; comparison against the supplied file confirms all remaining bytes are unchanged.
- Removed the earlier repair script and superseded source asset to prevent accidental regeneration. Prior versions remain in Git history.
- The forest stage is 100dvh within a 720svh scroll wrapper. Desktop and mobile use separate crop values; four secondary fern placements are hidden on mobile.

- The green atmospheric gradient has been removed. The peacock eye starts at the viewport’s vertical center (46.5% / 39.8% within its SVG). As foliage exits, copy fades and the eye moves horizontally to center before a vector-coordinate zoom. The bird fades completely before the tunnel appears; these visibility phases never overlap.
- Four SVG planes form a perspective tunnel. Each wall has one oversized, uninterrupted placeholder sentence loop, with glyphs filling the wall height. Canvas font metrics measure actual ink bounds (SVG getBBox includes empty font leading), and each plane uses the same 14,000-unit depth extent. The camera advances through these planes before the placeholder second section. Scroll progress controls the entire reversible sequence; reduced motion keeps the original static hero and hides the tunnel.

- Every scroll tween has an explicit starting state so ScrollTrigger refreshes cannot capture an intermediate pose as home. Lenis and GSAP continue sharing one ticker. The inline SVG uses scoped monospace styling instead of embedding the source’s global text stylesheet.

## Dependencies and decisions
- Next.js, React, and React DOM (MIT) provide the agreed application foundation. Next.js was approximately 186 MB unpacked before platform binaries at installation; React approximately 179 KB. These are installation sizes, not client bundles.
- TypeScript and Playwright (Apache-2.0), plus MIT type declarations, are development tooling only. Playwright's separate browser download is not shipped to visitors.
- `gsap@3.15.0` provides ScrollTrigger under GSAP's standard no-charge license (https://gsap.com/standard-license/). The package is about 6.3 MB unpacked; only GSAP core and ScrollTrigger are imported. Effects and triggers are scoped and reverted on unmount and media changes.
- WebP conversion uses the existing transitive Sharp installation from Next.js; no additional image processing dependency was introduced. All placements reuse three cached WebP assets.
- Lenis 1.3.26 (MIT, approximately 458 KB unpacked) smooths wheel scrolling using the GSAP ticker. It forwards scroll updates to ScrollTrigger and is destroyed on unmount or reduced-motion changes. Zustand and shadcn primitives remain deferred until needed.

## Verification
- Eleven Playwright tests cover restored composition, loaded assets, original peacock hash, independent clockwise vine and outward foliage movement, disappearance and reversal, ambient sway and offscreen pause, second-section visibility, responsive overflow, reduced motion, eye alignment and zoom, four full-height text walls, forward tunnel travel, non-overlapping reveal phases, crisp SVG-coordinate zoom, actual text-wall height/depth, and repeated reverse playback after resizing.
- Each implementation slice was preceded by an observed failing test, followed by passing tests.
- `npm test`, `npm run typecheck`, and `npm run build` pass.
