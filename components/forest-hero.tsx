/** Assemble the approved forest-frame concept from independent scalable vector assets. */

import Image from 'next/image';

const EDGE_VINES = [
  { edge: 'top', flow: 'right-to-left', exit: 'right', width: 1600, height: 300 },
  { edge: 'left', flow: 'top-to-bottom', exit: 'up', width: 300, height: 1200 },
  { edge: 'bottom', flow: 'left-to-right', exit: 'left', width: 1600, height: 300 },
  { edge: 'right', flow: 'bottom-to-top', exit: 'down', width: 300, height: 1200 },
] as const;

/** Render the static foliage draft with a clear central safe area for hero copy. */
export function ForestHero() {
  return (
    <section className="forest-stage" aria-labelledby="hero-title">
      <div className="forest-atmosphere" aria-hidden="true" />
      <div className="forest-frame" aria-hidden="true">
        {EDGE_VINES.map(({ edge, flow, exit, width, height }) => (
          <Image
            key={edge}
            className={`forest-vine forest-vine-${edge}`}
            src={`/foliage/vine-${edge}.svg`}
            width={width}
            height={height}
            sizes={edge === 'top' || edge === 'bottom' ? '100vw' : '25vw'}
            alt=""
            data-edge={edge}
            data-flow={flow}
            data-exit={exit}
            loading="eager"
            unoptimized
          />
        ))}
        <Image className="forest-corner forest-corner-top-right" src="/foliage/foliage-corner.svg" width={620} height={620} alt="" unoptimized />
        <Image className="forest-corner forest-corner-bottom-left" src="/foliage/foliage-corner.svg" width={620} height={620} alt="" unoptimized />
        <Image className="forest-flora forest-flora-top-left" src="/foliage/flora-sprig.svg" width={420} height={640} alt="" unoptimized />
        <Image className="forest-flora forest-flora-bottom-right" src="/foliage/flora-sprig.svg" width={420} height={640} alt="" unoptimized />
      </div>
      <div className="hero-copy">
        <p className="hero-name">Hrudai Nirmal</p>
        <h1 id="hero-title">Ideas into<br /><span>experiences.</span></h1>
        <p className="hero-description">A space for thoughtful design, expressive interfaces, and the curiosity that connects them.</p>
        <p className="hero-note">Design. Code. Curiosity.</p>
      </div>
    </section>
  );
}
