/** Compose hero content over AeroShards while keeping the peacock itself static. */

import Image from 'next/image';

import { HeroBackground } from './hero-background';

/** Display placeholder portfolio copy and the user's exact peacock asset. */
export function PeacockBackground() {
  return (
    <section id="home" className="peacock-stage" aria-labelledby="hero-title">
      <HeroBackground />
      <Image
        className="peacock-artwork"
        src="/peacock.svg"
        width={1358}
        height={2048}
        sizes="(max-width: 640px) 80vw, 55vw"
        alt=""
        loading="eager"
        fetchPriority="high"
        unoptimized
      />
      <div className="hero-copy">
        <p className="hero-name">Hrudai Nirmal</p>
        <h1 id="hero-title">Ideas into<br /><span>experiences.</span></h1>
        <p className="hero-description">A space for thoughtful design, expressive interfaces, and the curiosity that connects them.</p>
        <p className="hero-note">Design. Code. Curiosity.</p>
      </div>
    </section>
  );
}
