"use client";

import { useEffect, useRef } from "react";

const FRAG_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;

const float GRID_SCALE   = 18.0;
const float MAJOR_STEP   = 4.0;
const float THIN_WIDTH   = 0.008;
const float MAJOR_WIDTH  = 0.014;
const float SCROLL_SPEED = 0.012;

const float VIGNETTE_AMT = 0.35;
const float NOISE_AMT    = 0.018;

// ordered dither 4x4
float bayer4(vec2 p){
  ivec2 ip = ivec2(int(mod(p.x,4.0)), int(mod(p.y,4.0)));
  int idx = ip.y*4 + ip.x;
  int m[16]; m[0]=0;m[1]=8;m[2]=2;m[3]=10;m[4]=12;m[5]=4;m[6]=14;m[7]=6;
  m[8]=3;m[9]=11;m[10]=1;m[11]=9;m[12]=15;m[13]=7;m[14]=13;m[15]=5;
  return float(m[idx]) / 15.0;
}

float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float gridLineAA(vec2 uv, float scale, float width){
  vec2 g = abs(fract(uv*scale) - 0.5);
  float d = min(g.x, g.y);
  float aa = fwidth(d);
  return 1.0 - smoothstep(width, width + aa, d);
}
float majorGridAA(vec2 uv, float scale, float stepN, float width){
  float sMajor = max(1.0, scale/stepN);
  return gridLineAA(uv, sMajor, width);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  R = iResolution.xy;
  float t = iTime;
  vec2 uv = (fragCoord - 0.5*R) / max(R.y, 1.0);

  // Background: pure dark grays matching #0a0a0a
  vec3 baseDeep = vec3(0.035, 0.035, 0.035);
  vec3 baseTint = vec3(0.055, 0.055, 0.055);
  float vgrad   = smoothstep(-0.92, 0.55, -uv.y);
  vec3  bg      = mix(baseDeep, baseTint, vgrad);

  // Vignette
  float rad = length(uv);
  float vig = pow(1.0 - VIGNETTE_AMT * rad, 1.0);
  bg *= clamp(vig, 0.0, 1.0);

  // Scrolling grid
  vec2 scrollDir = normalize(vec2(1.0, -0.55));
  vec2 uvAnim    = uv + SCROLL_SPEED * t * scrollDir;

  float thin  = gridLineAA (uvAnim, GRID_SCALE, THIN_WIDTH);
  float major = majorGridAA(uvAnim, GRID_SCALE, MAJOR_STEP, MAJOR_WIDTH);

  // Grid lines in very dim grays
  vec3 lineThin  = vec3(0.22, 0.22, 0.22);
  vec3 lineMajor = vec3(0.30, 0.30, 0.30);

  vec3 col = bg
           + lineThin  * thin  * 0.15
           + lineMajor * major * 0.25;

  // Film noise
  float n = vnoise(fragCoord*0.6 + vec2(t*12.0, -t*9.0));
  col += (n - 0.5) * NOISE_AMT;

  // Ordered dither
  float luma = dot(col, vec3(0.2126,0.7152,0.0722));
  float dAmt = mix(0.008, 0.003, luma);
  col += (bayer4(fragCoord) - 0.5) * dAmt;

  col = tanh(col);
  fragColor = vec4(col, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function InfiniteGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    let disposed = false;

    // Geometry
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Shaders
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const program = linkProgram(gl, vs, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!program) return;

    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    // Resize
    const dpr = Math.min(window.devicePixelRatio, 1.5); // cap for perf
    function resize() {
      if (disposed || !canvas) return;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const start = performance.now();

    function tick(now: number) {
      if (disposed) return;
      const t = (now - start) / 1000;

      resize();
      gl!.useProgram(program);
      if (uResolution) gl!.uniform3f(uResolution, canvas!.width, canvas!.height, dpr);
      if (uTime) gl!.uniform1f(uTime, t);

      gl!.bindVertexArray(vao);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
