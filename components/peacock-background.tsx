/** Static artwork keeps the hero lightweight and leaves the left column ready for copy. */

/** Display the cleaned binary peacock without animation or client-side rendering. */
export function PeacockBackground() {
  return (
    <section className="peacock-stage" aria-label="Peacock hero background preview">
      <img className="peacock-artwork" src="/peacock.svg" width={849.6} height={1280} alt="" fetchPriority="high" />
    </section>
  );
}
