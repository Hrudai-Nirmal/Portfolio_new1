/** Keep artwork and copy server-rendered while the scroll shell animates decorative layers. */
import Image from 'next/image';
import { Fragment } from 'react';
import { ForestScroll } from './forest-scroll';
import { TextTunnel } from './text-tunnel';
import { PeacockArtwork } from './peacock-artwork';

const EDGE_VINES = [
  { edge: 'top', flow: 'right-to-left', exit: 'right', outward: 'up' },
  { edge: 'right', flow: 'bottom-to-top', exit: 'down', outward: 'right' },
  { edge: 'bottom', flow: 'left-to-right', exit: 'left', outward: 'down' },
  { edge: 'left', flow: 'top-to-bottom', exit: 'up', outward: 'left' },
] as const;

/** Weave moving woody vines between background leaves and gently swaying foreground ferns. */
export function ForestHero() {
  return (
    <>
      <ForestScroll>
        <section className="forest-stage" aria-labelledby="hero-title">
          <div className="forest-atmosphere" aria-hidden="true" />
          <div className="peacock-position">
            <div className="peacock-camera">
              <PeacockArtwork />
              <span className="peacock-eye" aria-hidden="true" />
            </div>
          </div>
          <TextTunnel />
          <div className="forest-frame" aria-hidden="true">
            {EDGE_VINES.map(({ edge, flow, exit, outward }) => (
              <Fragment key={edge}>
                <div className={`forest-edge forest-edge-${edge} forest-back-leaves`} data-edge={edge} data-motion="foliage" data-exit={outward}>
                  <Image className="edge-vine" src="/foliage/realistic-vine.webp" width={2167} height={726}
                    sizes="100vw" alt="" loading="eager" unoptimized />
                </div>
                <div className={`forest-edge forest-edge-${edge} forest-mid-vine`} data-edge={edge} data-flow={flow} data-motion="vine" data-exit={exit}>
                  <Image className="woody-vine" src="/foliage/woody-vine.webp" width={2172} height={724}
                    sizes="100vw" alt="" loading="eager" unoptimized />
                </div>
                <div className={`forest-edge forest-edge-${edge} forest-front-leaves`} data-edge={edge} data-motion="foliage" data-exit={outward}>
                  <div className="forest-breeze">
                    <Image className="edge-fern edge-fern-near" src="/foliage/realistic-fern.webp" width={1254} height={1254}
                      sizes="35vw" alt="" loading="eager" unoptimized />
                    <Image className="edge-fern edge-fern-far" src="/foliage/realistic-fern.webp" width={1254} height={1254}
                      sizes="25vw" alt="" loading="eager" unoptimized />
                  </div>
                </div>
              </Fragment>
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
