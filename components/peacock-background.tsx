'use client';

/** Own GPU and browser lifecycles while retaining the original artwork before hydration. */
import { useEffect, useRef, useState } from 'react';
import { createPeacockRenderer } from '../lib/peacock-renderer';

/** Display the animated hero artwork with an explicit visitor-controlled pause. */
export function PeacockBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderState, setRenderState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Peacock canvas was not mounted.');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let renderer: ReturnType<typeof createPeacockRenderer> | undefined;
    let animationFrame = 0;
    let elapsedSeconds = 0;
    let previousTimestamp: number | null = null;
    let isDisposed = false;
    const artwork = new Image();

    function syncMotionPreference() {
      isPlayingRef.current = !motionPreference.matches;
      setIsPlaying(isPlayingRef.current);
    }

    function reportFailure(error: unknown) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setRenderState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Animation could not be loaded.');
      cancelAnimationFrame(animationFrame);
    }

    function renderFrame(timestamp: number) {
      try {
        if (isDisposed || !renderer) return;
        if (isPlayingRef.current && !document.hidden && previousTimestamp !== null) elapsedSeconds += Math.min((timestamp - previousTimestamp) / 1000, 0.05);
        previousTimestamp = timestamp;
        renderer.renderFrame(elapsedSeconds);
        // Stop scheduling when paused; resizing still redraws through ResizeObserver.
        if (isPlayingRef.current && !document.hidden) animationFrame = requestAnimationFrame(renderFrame);
      } catch (error) { reportFailure(error); }
    }

    function requestFrame() {
      cancelAnimationFrame(animationFrame);
      // RAF timestamps share the frame clock; performance.now() can be ahead of that clock.
      previousTimestamp = null;
      animationFrame = requestAnimationFrame(renderFrame);
    }

    function handleMotionChange() { syncMotionPreference(); requestFrame(); }
    function handleContextLoss(event: Event) {
      event.preventDefault();
      reportFailure(new Error('Graphics context lost. Reload to restart the animation.'));
    }

    syncMotionPreference();
    artwork.onload = () => {
      if (isDisposed) return;
      try {
        renderer = createPeacockRenderer(canvas, artwork);
        renderer.renderFrame(0);
        setRenderState('ready');
        requestFrame();
      } catch (error) { reportFailure(error); }
    };
    artwork.onerror = () => reportFailure(new Error('The peacock artwork could not be loaded.'));
    artwork.src = '/peacock.svg';
    const resizeObserver = new ResizeObserver(requestFrame);
    resizeObserver.observe(canvas);
    motionPreference.addEventListener('change', handleMotionChange);
    document.addEventListener('visibilitychange', requestFrame);
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    canvas.addEventListener('motiontoggle', requestFrame);

    return () => {
      isDisposed = true;
      artwork.onload = null;
      artwork.onerror = null;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      motionPreference.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', requestFrame);
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      canvas.removeEventListener('motiontoggle', requestFrame);
      renderer?.dispose();
    };
  }, []);

  function toggleAnimation() {
    isPlayingRef.current = !isPlayingRef.current;
    setIsPlaying(isPlayingRef.current);
    canvasRef.current?.dispatchEvent(new Event('motiontoggle'));
  }

  return (
    <section className="peacock-stage" aria-label="Peacock hero background preview">
      <div className="peacock-artwork" aria-hidden="true" />
      <canvas ref={canvasRef} aria-hidden="true" data-render-state={renderState} className={renderState === 'ready' ? 'is-ready' : ''} />
      {renderState === 'ready' && <button className="motion-control" onClick={toggleAnimation} aria-label={isPlaying ? 'Pause animation' : 'Play animation'}>
        <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▷'}</span> {isPlaying ? 'Pause' : 'Play'}
      </button>}
      {errorMessage && <p className="animation-error" role="status">Static preview — {errorMessage}</p>}
    </section>
  );
}
