'use client';

/** Load the heavy WebGPU renderer separately from the immediately visible hero content. */
import dynamic from 'next/dynamic';

const AeroShards = dynamic(() => import('./AeroShards'), { ssr: false });

/** Render the requested AeroShards configuration across the full hero stage. */
export function HeroBackground() {
  return (
    <div className="hero-background">
      <AeroShards
        backgroundColor="#120F17"
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        flow="stream"
        material="pearl"
        detail="bold"
        effect="none"
        scale={1}
        spread={1.1}
        depth={0}
        speed={1}
        spin={1.3}
        interaction="repel"
        density={0.8}
        shardSize={1.1}
        stretch={0.6}
        turbulence={1}
        glow={2}
        edgeSoftness={2}
        bloom={2.8}
        grain={0.12}
        chromaticAberration={0}
        transitionDuration={1}
        interactionRadius={1.5}
        interactionStrength={0.5}
        rippleIntensity={1}
        holdToGather
      />
    </div>
  );
}
