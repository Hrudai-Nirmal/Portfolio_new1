'use client';

/** Scope scroll animation to this hero; CSS supplies sticky positioning even before hydration. */
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Separate clockwise vines, outward foliage, and ambient breeze on nested transform layers. */
export function ForestScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const breezeTweens = [...scrollElement.querySelectorAll<HTMLElement>('.forest-breeze')].map((cluster, index) =>
        gsap.to(cluster, {
          rotation: index % 2 === 0 ? 0.65 : -0.65,
          y: index % 2 === 0 ? 4 : -4,
          duration: 5.5 + index * 0.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        })
      );
      // Stop invisible perpetual motion while retaining its phase for a natural return.
      ScrollTrigger.create({
        trigger: scrollElement,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: ({ isActive }) => breezeTweens.forEach((tween) => isActive ? tween.play() : tween.pause()),
      });
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
      // Each layer declares its own exit; child breeze transforms cannot override this travel.
      for (const edge of scrollElement.querySelectorAll<HTMLElement>('[data-edge]')) {
        const direction = edge.dataset.exit;
        // Vines travel along an entire edge; finish early to match the shorter outward leaf exit.
        const isVine = edge.dataset.motion === 'vine';
        timeline.to(edge, {
          x: () => direction === 'right' ? window.innerWidth * 1.15 : direction === 'left' ? -window.innerWidth * 1.15 : 0,
          y: () => direction === 'down' ? window.innerHeight * 1.15 : direction === 'up' ? -window.innerHeight * 1.15 : 0,
          duration: isVine ? 0.32 : 1,
        }, 0);
        timeline.to(edge, { opacity: 0, duration: isVine ? 0.14 : 0.25 }, isVine ? 0.18 : 0.65);
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
