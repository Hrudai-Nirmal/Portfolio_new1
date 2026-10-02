/** Compose demo hero copy beside the original artwork without modifying or animating the SVG. */

/** Display placeholder portfolio copy and the user's exact peacock asset. */
export function PeacockBackground() {
  return (
    <section className="peacock-stage" aria-labelledby="hero-title">
      <img className="peacock-artwork" src="/peacock.svg" width={849.6} height={1280} alt="" fetchPriority="high" />
      <div className="hero-copy">
        <p className="hero-name">Hrudai Nirmal</p>
        <h1 id="hero-title">Ideas into<br /><span>experiences.</span></h1>
        <p className="hero-description">A space for thoughtful design, expressive interfaces, and the curiosity that connects them.</p>
        <p className="hero-note">Design. Code. Curiosity.</p>
      </div>
    </section>
  );
}
