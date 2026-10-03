'use client';

/** Scope scroll animation to this hero; CSS supplies sticky positioning even before hydration. */
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Scrub foliage clockwise while preserving the peacock and copy as a stationary composition. */
export function ForestScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scrollElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });
      // Translate whole edge groups so the rotated images retain their botanical orientation.
      for (const edge of scrollElement.querySelectorAll<HTMLElement>('[data-edge]')) {
        const direction = edge.dataset.exit;
        timeline.to(edge, {
          x: () => direction === 'right' ? window.innerWidth * 1.15 : direction === 'left' ? -window.innerWidth * 1.15 : 0,
          y: () => direction === 'down' ? window.innerHeight * 1.15 : direction === 'up' ? -window.innerHeight * 1.15 : 0,
          duration: 1,
        }, 0);
        timeline.to(edge, { opacity: 0, duration: 0.25 }, 0.65);
      }
      timeline.to(scrollElement.querySelector('.scroll-cue'), { opacity: 0, duration: 0.2 }, 0);
    }, scrollElement);
    scrollElement.dataset.animationReady = 'true';
    return () => {
      media.revert();
      delete scrollElement.dataset.animationReady;
    };
  }, []);

  return <div ref={scrollRef} className="forest-scroll">{children}</div>;
}
