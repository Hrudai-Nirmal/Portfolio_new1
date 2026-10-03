/** Floating primary navigation for the single-page portfolio hero. */

/** Render the centered glass navigation shell above the immersive hero. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-logo" href="#home" aria-label="Hrudai Nirmal">
        HN
      </a>
      <nav className="site-navigation" aria-label="Primary navigation">
        <a href="#home" aria-current="page">Home</a>
        <a href="#work">Work</a>
        <a href="#about">About</a>
      </nav>
      <a className="site-contact" href="#contact">Contact</a>
    </header>
  );
}
