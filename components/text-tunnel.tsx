/** Four oversized lines of type form the tunnel surfaces; no small-text wall textures. */
const TUNNEL_WALLS = [
  { side: 'left', sentence: 'IMAGINE · CREATE · EXPLORE · ' },
  { side: 'right', sentence: 'FOLLOW YOUR CURIOSITY · ' },
  { side: 'ceiling', sentence: 'IDEAS BECOME EXPERIENCES · ' },
  { side: 'floor', sentence: 'KEEP MOVING FORWARD · ' },
] as const;

/** Render a perspective tunnel using one continuous, wall-height word loop per plane. */
export function TextTunnel() {
  return (
    <div className="text-tunnel" aria-hidden="true">
      <div className="tunnel-perspective">
        <div className="tunnel-camera">
          {TUNNEL_WALLS.map(({ side, sentence }) => (
            <svg key={side} className={`tunnel-wall tunnel-wall-${side}`} viewBox="0 0 14000 1000" preserveAspectRatio="none">
              <text x="0" y="970" textLength="14000" lengthAdjust="spacingAndGlyphs">
                {sentence.repeat(4).trim()}
              </text>
            </svg>
          ))}
        </div>
      </div>
      <div className="tunnel-depth" />
    </div>
  );
}
