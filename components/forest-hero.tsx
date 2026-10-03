/** Keep artwork and copy server-rendered while the scroll shell animates decorative layers. */
import Image from 'next/image';
import { ForestScroll } from './forest-scroll';

const EDGE_VINES = [
  { edge: 'top', flow: 'right-to-left', exit: 'right' },
  { edge: 'right', flow: 'bottom-to-top', exit: 'down' },
  { edge: 'bottom', flow: 'left-to-right', exit: 'left' },
  { edge: 'left', flow: 'top-to-bottom', exit: 'up' },
] as const;

/** Compose the original peacock and copy inside four independent photographic foliage layers. */
export function ForestHero() {
  return (
    <>
      <ForestScroll>
        <section className="forest-stage" aria-labelledby="hero-title">
          <div className="forest-atmosphere" aria-hidden="true" />
          <Image className="peacock-artwork" src="/peacock.svg" width={1358} height={2048}
            alt="Peacock rendered in blue character artwork" loading="eager" fetchPriority="high" unoptimized
            sizes="(max-width: 640px) 60vw, 43vw" />
          <div className="forest-frame" aria-hidden="true">
            {EDGE_VINES.map(({ edge, flow, exit }) => (
              <div key={edge} className={`forest-edge forest-edge-${edge}`} data-edge={edge} data-flow={flow} data-exit={exit}>
                <Image className="edge-vine" src="/foliage/realistic-vine.webp" width={2167} height={726}
                  sizes="100vw" alt="" loading="eager" unoptimized />
                <Image className="edge-fern edge-fern-near" src="/foliage/realistic-fern.webp" width={1254} height={1254}
                  sizes="35vw" alt="" loading="eager" unoptimized />
                <Image className="edge-fern edge-fern-far" src="/foliage/realistic-fern.webp" width={1254} height={1254}
                  sizes="25vw" alt="" loading="eager" unoptimized />
              </div>
            ))}
          </div>
          <div className="hero-copy">
            <p className="hero-name">Hrudai Nirmal</p>
            <h1 id="hero-title">Ideas into<br /><span>experiences.</span></h1>
            <p className="hero-description">A space for thoughtful design, expressive interfaces, and the curiosity that connects them.</p>
            <p className="hero-note">Design. Code. Curiosity.</p>
          </div>
          <a className="scroll-cue" href="#next-section">Scroll to explore <span aria-hidden="true">↓</span></a>
        </section>
      </ForestScroll>
      <section id="next-section" className="next-section" aria-labelledby="next-title">
        <p className="section-index">01 / A NEW PERSPECTIVE</p>
        <h2 id="next-title">The next chapter.</h2>
        <p>A little room for what comes next.<br />This is a placeholder while we build the portfolio, one section at a time.</p>
        <div className="section-placeholder" aria-hidden="true"><span>SELECTED WORK</span><span>Coming into focus ↗</span></div>
      </section>
    </>
  );
}
