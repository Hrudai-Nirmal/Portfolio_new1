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
    // SVG getBBox includes font leading; use actual ink height so letters reach the adjoining planes.
    const drawing = document.createElement('canvas').getContext('2d');
    if (!drawing) throw new Error('Text tunnel requires canvas font measurement.');
    for (const wall of scrollElement.querySelectorAll<SVGSVGElement>('.tunnel-wall')) {
      const lettering = wall.querySelector('text')!;
      drawing.font = getComputedStyle(lettering).font;
      const ink = drawing.measureText(lettering.textContent!);
      const bounds = lettering.getBBox();
      wall.setAttribute('viewBox', `${bounds.x} ${970 - ink.actualBoundingBoxAscent} ${bounds.width} ${ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent}`);
    }
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
      const advanceScroll = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(advanceScroll);
      gsap.ticker.lagSmoothing(0);
      const peacockPosition = scrollElement.querySelector<HTMLElement>('.peacock-position')!;
      const peacockArtwork = scrollElement.querySelector<SVGSVGElement>('.peacock-artwork')!;
      const vectorCamera = { zoom: 1 };
      // Change the SVG coordinate window: glyphs repaint at their final size instead of scaling a bitmap.
      const renderPeacock = () => {
        const width = 1358.4 / vectorCamera.zoom;
        const height = 2048 / vectorCamera.zoom;
        peacockArtwork.setAttribute('viewBox', `${(1358.4 - width) * 0.465} ${(2048 - height) * 0.398} ${width} ${height}`);
      };
      const stage = scrollElement.querySelector<HTMLElement>('.forest-stage')!;
      const breezeTweens = [...scrollElement.querySelectorAll<HTMLElement>('.forest-breeze')].map((cluster, index) =>
        gsap.fromTo(cluster, { rotation: index % 2 === 0 ? -0.65 : 0.65 }, {
          rotation: index % 2 === 0 ? 1.15 : -1.15,
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
      // Vines retain their existing edge travel. Foliage bends around rooted pivots without translating.
      for (const edge of scrollElement.querySelectorAll<HTMLElement>('[data-edge]')) {
        const direction = edge.dataset.exit;
        const isVine = edge.dataset.motion === 'vine';
        if (isVine) timeline.fromTo(edge, { x: 0, y: 0 }, {
          x: () => direction === 'right' ? window.innerWidth * 1.15 : direction === 'left' ? -window.innerWidth * 1.15 : 0,
          y: () => direction === 'down' ? window.innerHeight * 1.15 : direction === 'up' ? -window.innerHeight * 1.15 : 0,
          duration: 0.55,
        }, 0);
        timeline.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: isVine ? 0.23 : 0.4 }, isVine ? 0.32 : 0.8);
      }
      const branches = [...scrollElement.querySelectorAll<HTMLElement>('.foliage-swing')];
      branches.forEach((branch, index) => {
        // A deterministic shuffle looks varied but retains the same direction on refresh and reversal.
        const direction = (index * 7 + 3) % 11 < 5 ? -1 : 1;
        branch.dataset.fall = direction < 0 ? 'left' : 'right';
        timeline.fromTo(branch, { rotation: 0 }, {
          rotation: direction * (62 + index % 3 * 7), duration: 1.2, ease: 'power1.inOut',
        }, 0);
      });
      const impactTweens = new Map<HTMLElement, gsap.core.Timeline>();
      let previousPointer: { horizontal: number; vertical: number; time: number } | null = null;
      const resetPointer = () => { previousPointer = null; };
      const handlePointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || timeline.progress() > 0.13) { resetPointer(); return; }
        const previous = previousPointer;
        previousPointer = { horizontal: event.clientX, vertical: event.clientY, time: event.timeStamp };
        if (!previous) return;
        const elapsed = Math.max(16, event.timeStamp - previous.time);
        const horizontalSpeed = (event.clientX - previous.horizontal) / elapsed;
        const verticalSpeed = (event.clientY - previous.vertical) / elapsed;
        const speed = Math.hypot(horizontalSpeed, verticalSpeed);
        if (speed < 0.04) return;
        for (const branch of branches) {
          const artwork = branch.querySelector('img')!;
          const bounds = artwork.getBoundingClientRect();
          if (!bounds.width || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) continue;
          const impact = branch.querySelector<HTMLElement>('.foliage-impact')!;
          const [rootHorizontal, rootVertical] = getComputedStyle(branch).transformOrigin.split(' ').map(parseFloat);
          const stageBounds = stage.getBoundingClientRect();
          const leverHorizontal = event.clientX - stageBounds.left - rootHorizontal;
          const leverVertical = event.clientY - stageBounds.top - rootVertical;
          const torque = leverHorizontal * verticalSpeed - leverVertical * horizontalSpeed;
          const angle = Math.sign(torque) * Math.min(12, speed * 2.4);
          impactTweens.get(impact)?.kill();
          impactTweens.set(impact, gsap.timeline().to(impact, { rotation: angle, duration: 0.12, ease: 'power2.out' })
            .to(impact, { rotation: 0, duration: 1.65, ease: 'elastic.out(1, 0.38)' }));
        }
      };
      stage.addEventListener('pointermove', handlePointer, { passive: true });
      stage.addEventListener('pointerleave', resetPointer);
      timeline.fromTo(scrollElement.querySelector('.scroll-cue'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0);
      timeline.fromTo(scrollElement.querySelector('.hero-copy'), { opacity: 1 }, { opacity: 0, duration: 0.55, ease: 'power1.inOut' }, 0);
      // Measure the untransformed layout so refresh/resize never compounds an existing camera translation.
      timeline.fromTo(peacockPosition, { x: 0 }, {
        x: () => stage.clientWidth / 2 - (peacockPosition.offsetLeft + peacockPosition.offsetWidth * 0.465),
        duration: 1.2,
        ease: 'power2.inOut',
        force3D: false,
      }, 0.1);
      timeline.fromTo(vectorCamera, { zoom: 1 }, { zoom: 1.6, duration: 1.05, ease: 'power1.in', onUpdate: renderPeacock }, 0.25);
      timeline.fromTo(vectorCamera, { zoom: 1.6 }, { zoom: 64, duration: 2.3, ease: 'power2.in', immediateRender: false, onUpdate: renderPeacock }, 1.3);
      // Non-overlapping visibility intervals also reverse cleanly: the tunnel clears before the bird returns.
      timeline.fromTo(peacockPosition, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, 2.9);
      timeline.fromTo(scrollElement.querySelector('.text-tunnel'),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' }, 3.3);
      timeline.fromTo(scrollElement.querySelector('.tunnel-camera'), { z: 0 },
        { z: 7800, duration: 4.7, ease: 'none' }, 3.3);
      return () => {
        stage.removeEventListener('pointermove', handlePointer);
        stage.removeEventListener('pointerleave', resetPointer);
        impactTweens.forEach((tween) => tween.kill());
        gsap.set(branches.map((branch) => branch.querySelector('.foliage-impact')), { clearProps: 'transform' });
        gsap.ticker.remove(advanceScroll);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
        peacockArtwork.setAttribute('viewBox', '0 0 1358.4 2048');
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
