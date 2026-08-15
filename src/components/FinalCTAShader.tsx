import React, { useEffect, useRef } from 'react';

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<4;i++){t+=a*noise(p);p*=2.;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*R)/MN;
  vec3 col=vec3(0);
  float bg=fbm(vec2(uv.x*2.+T*.3,-uv.y));
  for(float i=1.;i<8.;i++){
    uv+=.08*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;float d=length(p);
    // Cyan-violet palette instead of warm
    col+=.0015/d*(cos(sin(i)*vec3(0.2,1.8,2.8)+1.)*vec3(0.,1.,1.)+vec3(0.,.3,.5));
    float b=noise(i+p+bg*1.5);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(0.,bg*.1,bg*.18),d);
  }
  O=vec4(col*0.85,1);
}`;

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

export function FinalCTAShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio||1,1.5);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT); gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG); gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn('FinalCTAShader GLSL error:', gl.getShaderInfoLog(fs));
      gl.deleteShader(vs); gl.deleteShader(fs); return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, 'resolution');
    const uTime = gl.getUniformLocation(prog, 'time');

    const renderFrame = (now: number) => {
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = (now: number) => {
      renderFrame(now);
      if (visible && !reduced) raf = requestAnimationFrame(tick);
    };

    // The shader sits at the very bottom of a long page — only spend GPU/CPU
    // on it while it's actually scrolled into view, not from initial mount.
    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) {
        if (reduced) {
          renderFrame(0);
        } else {
          raf = requestAnimationFrame(tick);
        }
      } else if (!visible) {
        cancelAnimationFrame(raf);
      }
    }, { rootMargin: '200px' });
    io.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      io.disconnect();
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.45,
      }}
    />
  );
}
