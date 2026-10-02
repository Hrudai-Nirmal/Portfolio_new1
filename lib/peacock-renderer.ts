/** Render the supplied vector as one texture: thousands of paths stay out of the animation loop. */
const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D uArtwork;
uniform float uTime;
varying vec2 vUv;
void main() {
  // The canvas keeps the source aspect ratio; map the full portrait without stretching.
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float headMask = exp(-pow((uv.y - 0.38) * 6.0, 2.0));
  uv.x += sin(uTime * 0.85 + uv.y * 9.0) * 0.012 * headMask;
  uv.y += sin(uTime * 0.65 + uv.x * 7.0) * 0.003 * headMask;
  uv.x += sin(uv.y * 65.0 + uTime * 1.4) * 0.0014;
  vec3 color = texture2D(uArtwork, clamp(uv, 0.0, 1.0)).rgb;
  float shimmer = 0.93 + 0.14 * sin(uv.y * 24.0 - uTime * 1.8 + uv.x * 12.0);
  float scan = 0.97 + 0.03 * sin(uv.y * 800.0 + uTime * 2.0);
  float edge = smoothstep(0.0, 0.10, uv.x) * smoothstep(0.0, 0.10, 1.0 - uv.x);
  gl_FragColor = vec4(color * shimmer * scan * edge, 1.0);
}`;

/** Create a renderer only after the image loads; throw real GPU failures for the caller to report. */
export function createPeacockRenderer(canvas: HTMLCanvasElement, artwork: HTMLImageElement) {
  if (!canvas || !artwork?.naturalWidth) throw new Error('A canvas and loaded artwork are required.');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) throw new Error('WebGL is unavailable on this device.');
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();

  const disposeRenderer = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
  };

  try {
    if (!program || !buffer || !texture) throw new Error('GPU resource allocation failed.');
    for (const [shaderType, source] of [[gl.VERTEX_SHADER, VERTEX_SHADER], [gl.FRAGMENT_SHADER, FRAGMENT_SHADER]] as const) {
      const shader = gl.createShader(shaderType);
      if (!shader) throw new Error('Shader allocation failed.');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed.');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed.');
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork);
    gl.uniform1i(gl.getUniformLocation(program, 'uArtwork'), 0);
    const timeUniform = gl.getUniformLocation(program, 'uTime');

    return {
      /** Draw at a bounded pixel density to keep mobile GPU work reasonable. */
      renderFrame(elapsedSeconds: number) {
        if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) throw new Error('Animation time must be finite and nonnegative.');
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
        const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform1f(timeUniform, elapsedSeconds);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
      /** Release resources on unmount, including React development remounts. */
      dispose: disposeRenderer,
    };
  } catch (error) {
    disposeRenderer();
    throw error;
  }
}
