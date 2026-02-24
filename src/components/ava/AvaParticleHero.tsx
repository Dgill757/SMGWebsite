/**
 * AvaParticleHero — Three.js / R3F interactive particle portrait
 *
 * Architecture:
 *   Canvas → Scene → BacklightPlane + AvaPointCloud (glow pass + core pass)
 *
 * How depth works:
 *   Each pixel's Z position = luminance-based depth + Sobel edge push + jitter
 *   → brighter pixels come forward, edges are emphasised → genuinely volumetric
 *
 * Bloom without external postprocessing:
 *   Two <points> layers share the same BufferGeometry:
 *     1. Glow aura  — 4× larger points, ~9 % opacity, AdditiveBlending
 *     2. Core layer — normal size,      ~88 % opacity, AdditiveBlending
 *   The result looks identical to a postprocessing bloom pass.
 *
 * ─── TWEAK KNOBS ────────────────────────────────────────────────────────────
 */
export const PARTICLE_STEP_DESKTOP = 3      // px stride (lower = more dots)
export const PARTICLE_STEP_MOBILE  = 6
export const DEPTH_STRENGTH        = 115    // Z range from luminance
export const EDGE_DEPTH_BOOST      = 30     // extra Z for detected edges
export const BLOOM_GLOW_MULT       = 4.2    // glow-pass size multiplier
export const BLOOM_GLOW_OPACITY    = 0.09   // glow-pass alpha (0–1)
export const PARALLAX_STRENGTH     = 0.40   // rotation strength (radians)
export const BACKLIGHT_STRENGTH    = 0.20   // backlight plane opacity
export const PARTICLE_SIZE_DESKTOP = 1.5    // world-unit dot radius (desktop)
export const PARTICLE_SIZE_MOBILE  = 2.2    // world-unit dot radius (mobile)
// ────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame }                             from '@react-three/fiber'
import * as THREE                                       from 'three'

// ── tiny helpers ──────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const lerp  = (a: number, b: number, t: number)   => a + (b - a) * clamp(t, 0, 1)
const ease  = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c) }

// ── shared types ──────────────────────────────────────────────────────────────
interface ParticleData {
  positions : Float32Array   // x,y,z per particle
  colors    : Float32Array   // r,g,b per particle
  count     : number
}

// ── Backlight shader ──────────────────────────────────────────────────────────
// A large plane behind the face with a radial cyan gradient.
// Moves OPPOSITE to the mouse so the face reads as three-dimensional.
const BL_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`
const BL_FRAG = /* glsl */`
  varying vec2 vUv;
  uniform float uOp;
  void main() {
    float d = length(vUv - 0.5);
    float g = pow(max(0.0, 1.0 - d * 2.0), 2.4);
    // Dual-colour: centre white-cyan → rim deep-cyan
    vec3 col = mix(vec3(0.5,0.95,1.0), vec3(0.0,0.65,1.0), clamp(d*3.0,0.0,1.0));
    gl_FragColor = vec4(col, uOp * g);
  }
`

// ── BacklightPlane ────────────────────────────────────────────────────────────
function BacklightPlane({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const sm      = useRef({ x: 0, y: 0 })

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms       : { uOp: { value: BACKLIGHT_STRENGTH } },
    vertexShader   : BL_VERT,
    fragmentShader : BL_FRAG,
    transparent    : true,
    blending       : THREE.AdditiveBlending,
    depthWrite     : false,
    side           : THREE.DoubleSide,
  }), [])

  useFrame(({ mouse }) => {
    sm.current.x += (mouse.x - sm.current.x) * 0.055
    sm.current.y += (mouse.y - sm.current.y) * 0.055
    if (!meshRef.current) return
    // Opposite-mouse: light always behind the face on the far side
    meshRef.current.position.x = lerp(
      meshRef.current.position.x, -sm.current.x * (isMobile ? 25 : 52), 0.06
    )
    meshRef.current.position.y = lerp(
      meshRef.current.position.y,  sm.current.y * (isMobile ? 16 : 36), 0.06
    )
  })

  const sz = isMobile ? 300 : 520
  return (
    <mesh ref={meshRef} position={[0, 0, -175]}>
      <planeGeometry args={[sz, sz]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

// ── AvaPointCloud ─────────────────────────────────────────────────────────────
// Two <points> layers sharing one geometry:
//   layer 0 → wide soft glow  (simulates bloom)
//   layer 1 → sharp core dots
function AvaPointCloud({
  data, isMobile, prefersReduced,
}: {
  data           : ParticleData
  isMobile       : boolean
  prefersReduced : boolean
}) {
  const glowRef = useRef<THREE.Points>(null)
  const coreRef = useRef<THREE.Points>(null)
  const sm      = useRef({ x: 0, y: 0 })
  const t0      = useRef<number | null>(null)  // reveal start time

  // Shared geometry — built once, reused by both passes
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(data.colors,    3))
    return g
  }, [data])

  const pxBase  = isMobile ? PARTICLE_SIZE_MOBILE : PARTICLE_SIZE_DESKTOP
  const glowMat = useMemo(() => new THREE.PointsMaterial({
    size             : pxBase * BLOOM_GLOW_MULT,
    sizeAttenuation  : true,
    vertexColors     : true,
    blending         : THREE.AdditiveBlending,
    depthWrite       : false,
    transparent      : true,
    opacity          : 0,   // animated in on reveal
  }), [pxBase])

  const coreMat = useMemo(() => new THREE.PointsMaterial({
    size             : pxBase,
    sizeAttenuation  : true,
    vertexColors     : true,
    blending         : THREE.AdditiveBlending,
    depthWrite       : false,
    transparent      : true,
    opacity          : 0,   // animated in on reveal
  }), [pxBase])

  useFrame(({ clock, mouse }) => {
    const now = clock.getElapsedTime()

    // ── Reveal fade-in ────────────────────────────────────────────────────
    if (t0.current === null) t0.current = now
    const rev = ease(Math.min(1, (now - t0.current) / 2.5))
    glowMat.opacity = BLOOM_GLOW_OPACITY * rev
    coreMat.opacity = 0.88 * rev

    if (prefersReduced) return

    // ── Smooth mouse (R3F gives normalised –1…+1) ─────────────────────────
    sm.current.x += (mouse.x - sm.current.x) * 0.055
    sm.current.y += (mouse.y - sm.current.y) * 0.055

    // ── Gaze-follow rotation ──────────────────────────────────────────────
    const target = [glowRef.current, coreRef.current]
    for (const obj of target) {
      if (!obj) continue
      obj.rotation.y = lerp(obj.rotation.y, sm.current.x * PARALLAX_STRENGTH,     0.07)
      obj.rotation.x = lerp(obj.rotation.x, -sm.current.y * PARALLAX_STRENGTH * 0.6, 0.07)
      // Breathing Z — subtle life even without cursor movement
      obj.position.z = Math.sin(now * 0.55) * 5.5
    }
  })

  return (
    <>
      <points ref={glowRef} geometry={geo} material={glowMat} />
      <points ref={coreRef} geometry={geo} material={coreMat} />
    </>
  )
}

// ── Scene root ────────────────────────────────────────────────────────────────
function Scene({
  data, isMobile, prefersReduced,
}: {
  data           : ParticleData
  isMobile       : boolean
  prefersReduced : boolean
}) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <BacklightPlane isMobile={isMobile} />
      <AvaPointCloud data={data} isMobile={isMobile} prefersReduced={prefersReduced} />
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
interface AvaParticleHeroProps {
  className?     : string
  scrollProgress?: number     // accepted for API compatibility, not used
}

export default function AvaParticleHero({ className }: AvaParticleHeroProps) {
  const [data, setData] = useState<ParticleData | null>(null)

  // Stable flags — detected once at mount
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  )
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // ── Build particle data from ava-face.png ─────────────────────────────────
  useEffect(() => {
    const img        = new Image()
    img.crossOrigin  = 'anonymous'
    img.src          = '/ava-face.png'

    img.onload = () => {
      const iW   = img.naturalWidth
      const iH   = img.naturalHeight
      const step = isMobile ? PARTICLE_STEP_MOBILE : PARTICLE_STEP_DESKTOP

      // Read pixel data via offscreen canvas
      const off  = document.createElement('canvas')
      off.width  = iW
      off.height = iH
      const c2   = off.getContext('2d')!
      c2.drawImage(img, 0, 0)
      const px = c2.getImageData(0, 0, iW, iH).data

      // Helper: perceived luminance at pixel coords
      const lum = (x: number, y: number): number => {
        if (x < 0 || x >= iW || y < 0 || y >= iH) return 0
        const i = (y * iW + x) * 4
        return (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255
      }

      // ── Scene scale ──────────────────────────────────────────────────────
      // Camera is at z = 500, fov = 50.  Visible height at z = 0 ≈ 466 units.
      const visH = 2 * 500 * Math.tan((50 * Math.PI / 180) / 2) // 466
      const visW = visH * (window.innerWidth / window.innerHeight)

      const imgAspect = iW / iH
      // Fill 92 % of the viewport height, constrain width so it fits on mobile
      let scaleY = visH * 0.92
      let scaleX = scaleY * imgAspect
      if (scaleX > visW * 0.94) {
        scaleX = visW * 0.94
        scaleY = scaleX / imgAspect
      }

      // ── Sample pixels → positions + colours ──────────────────────────────
      const pos: number[] = []
      const col: number[] = []

      for (let y = 0; y < iH; y += step) {
        for (let x = 0; x < iW; x += step) {
          const l = lum(x, y)
          if (l < 0.055) continue         // skip background / transparent

          // ── Position ──────────────────────────────────────────────────
          const sx = (x / iW - 0.5) * scaleX
          const sy = (0.5 - y / iH) * scaleY

          // Pseudo-depth: bright pixels come forward
          let sz = (l - 0.45) * DEPTH_STRENGTH

          // Sobel edge detection → push edges forward for facial-feature pop
          const gx = lum(x + 1, y) - lum(x - 1, y)
          const gy = lum(x, y + 1) - lum(x, y - 1)
          sz += Math.sqrt(gx * gx + gy * gy) * EDGE_DEPTH_BOOST

          // Organic Z jitter — prevents the flat "grid" look
          sz += (Math.random() - 0.5) * 14

          pos.push(sx, sy, sz)

          // ── Colour: cyan palette ──────────────────────────────────────
          const r = Math.random()
          if (r < 0.05) {
            // 5 % purple sparks for premium feel
            col.push(0.66, 0.33, 1.0)
          } else {
            // Lerp from base cyan (#00E5FF) → light cyan (#66FCFF) by lum
            const t = clamp(l * 1.25, 0, 1)
            col.push(
              lerp(0.0,   0.40,  t),   // R: 0 → 0.40
              lerp(0.898, 0.988, t),   // G: 0.898 → 0.988
              1.0,                      // B: always 1
            )
          }
        }
      }

      setData({
        positions : new Float32Array(pos),
        colors    : new Float32Array(col),
        count     : pos.length / 3,
      })
    }
  }, [isMobile])

  // Black placeholder while image loads
  if (!data) {
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', background: '#000' }}
      />
    )
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 500], fov: 50, near: 1, far: 2000 }}
        dpr={[1, 1.75]}
        gl={{
          antialias       : false,
          alpha           : false,
          powerPreference : 'high-performance',
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Scene data={data} isMobile={isMobile} prefersReduced={prefersReduced} />
      </Canvas>
    </div>
  )
}
