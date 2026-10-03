'use client';

/** Scope scroll animation to this hero; CSS supplies sticky positioning even before hydration. */
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** Separate clockwise vines, outward foliage, and ambient breeze on nested transform layers. */
export function ForestScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
      const advanceScroll = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(advanceScroll);
      gsap.ticker.lagSmoothing(0);
      const peacockPosition = scrollElement.querySelector<HTMLElement>('.peacock-position')!;
      const peacockCamera = scrollElement.querySelector<HTMLElement>('.peacock-camera')!;
      const stage = scrollElement.querySelector<HTMLElement>('.forest-stage')!;
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
          scrub: 0.25,
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
          duration: isVine ? 0.55 : 1.3,
        }, 0);
        timeline.to(edge, { opacity: 0, duration: isVine ? 0.23 : 0.4 }, isVine ? 0.32 : 0.8);
      }
      timeline.to(scrollElement.querySelector('.scroll-cue'), { opacity: 0, duration: 0.2 }, 0);
      timeline.to(scrollElement.querySelector('.hero-copy'), { opacity: 0, duration: 0.55, ease: 'power1.inOut' }, 0);
      // Measure the untransformed layout so refresh/resize never compounds an existing camera translation.
      timeline.to(peacockPosition, {
        x: () => stage.clientWidth / 2 - (peacockPosition.offsetLeft + peacockPosition.offsetWidth * 0.465),
        duration: 1.2,
        ease: 'power2.inOut',
      }, 0.1);
      timeline.to(peacockCamera, { scale: 1.6, duration: 1.05, ease: 'power1.in' }, 0.25);
      timeline.to(peacockCamera, { scale: 64, duration: 2.3, ease: 'power2.in' }, 1.3);
      // The tunnel grows out of the centered pupil only after the eye dominates the frame.
      timeline.fromTo(scrollElement.querySelector('.text-tunnel'),
        { autoAlpha: 0, scale: 0.04, clipPath: 'circle(0% at 50% 50%)' },
        { autoAlpha: 1, scale: 1, clipPath: 'circle(75% at 50% 50%)', duration: 0.9, ease: 'power2.inOut' }, 2.7);
      timeline.to(peacockPosition, { autoAlpha: 0, duration: 0.35 }, 3.25);
      timeline.fromTo(scrollElement.querySelector('.tunnel-camera'), { z: 0 },
        { z: 7800, duration: 4.9, ease: 'none' }, 3.1);
      return () => {
        gsap.ticker.remove(advanceScroll);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
      };
    }, scrollElement);
    scrollElement.dataset.animationReady = 'true';
    return () => {
      media.revert();
      delete scrollElement.dataset.animationReady;
    };
  }, []);

  return <div ref={scrollRef} className="forest-scroll">{children}</div>;
}
