'use client'
/**
 * AvaParticleHero v4 — adaptive density + hair fill pass + micro jitter
 *
 * Primary mode  : /ava-face.glb → MeshSurfaceSampler → true 3D surface cloud
 * Fallback mode : /ava-face.png → adaptive luminance density + two-pass sampling
 * Hard fallback : <img> static image when WebGL is unavailable
 *
 * v4 changes (from v3):
 *  - Adaptive density: dark areas retain ~40% base density (smoothstep 0.05–0.35)
 *  - Hair fill pass: second particle layer for luminance < 0.35 regions
 *    (GLB: extra sample pass at same surface; image: luminance-gated fill)
 *  - Micro jitter: ±0.6 XY, ±0.8 Z offsets break grid feel + add volume
 *
 * ─── TWEAK KNOBS ─────────────────────────────────────────────────────────────
 */
export const POINT_COUNT_DESKTOP   = 50_000
export const POINT_COUNT_MOBILE    = 12_000
export const DAMP_SPEED            = 22      // MathUtils.damp lambda
export const CYAN_COLOR            = '#00D9FF'
export const PURPLE_COLOR          = '#A855FF'
export const PURPLE_PERCENT        = 0.04    // fraction of dots that are purple
export const CORE_SIZE             = 1.6     // world-unit dot radius (desktop)
export const CORE_OPACITY          = 0.88
export const GLOW_SIZE_MULT        = 4.0     // glow dot size = CORE_SIZE × mult
export const GLOW_OPACITY          = 0.09
export const PARALLAX_STRENGTH     = 0.30    // portrait rotation range (radians)
export const BACKLIGHT_STRENGTH    = 0.22    // backlight plane peak opacity
// Image-fallback only
export const PARTICLE_STEP_DESKTOP = 3       // pixel stride
export const PARTICLE_STEP_MOBILE  = 6
export const DEPTH_STRENGTH        = 110     // Z range from luminance
export const EDGE_DEPTH_BOOST      = 28      // extra Z for Sobel edges
export const Z_CLAMP               = 80      // hard limit prevents depth caves
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useRef, useEffect, useMemo, useState, Suspense, Component,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF }                    from '@react-three/drei'
import * as THREE                     from 'three'
import { MeshSurfaceSampler }         from 'three/examples/jsm/math/MeshSurfaceSampler.js'

// ── Types ──────────────────────────────────────────────────────────────────────
interface ParticleData {
  positions : Float32Array
  colors    : Float32Array
  count     : number
}

/** Combined result from buildImageParticles — primary + hair fill layer */
interface ImageParticleResult {
  primary  : ParticleData
  hairFill : ParticleData
}

type MouseRef = React.MutableRefObject<{ x: number; y: number }>

// ── Error Boundaries ──────────────────────────────────────────────────────────

/**
 * GLBErrorBoundary — wraps GLBPortrait inside the R3F scene.
 * When useGLTF throws (404, network error, parse failure) this catches it,
 * renders nothing, and calls onError() so the parent can switch to image mode.
 */
interface EBProps { children: React.ReactNode; onError: () => void }
interface EBState { failed: boolean }

class GLBErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { failed: false }

  static getDerivedStateFromError(): EBState {
    return { failed: true }
  }

  componentDidCatch(err: unknown) {
    console.warn('[AvaParticleHero] GLB load failed, switching to image mode:', err)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * CanvasErrorBoundary — wraps the entire Canvas element.
 * If WebGL context creation fails or Three.js throws during render,
 * shows a static <img> fallback instead of a black screen.
 */
interface CBProps { children: React.ReactNode; fallback: React.ReactNode }
interface CBState { failed: boolean }

class CanvasErrorBoundary extends Component<CBProps, CBState> {
  state: CBState = { failed: false }

  static getDerivedStateFromError(): CBState {
    return { failed: true }
  }

  componentDidCatch(err: unknown) {
    console.warn('[AvaParticleHero] Canvas / WebGL error, showing static fallback:', err)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const ease  = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c) }

/** Smooth-step interpolation — used for adaptive particle density */
const ss = (lo: number, hi: number, v: number): number => {
  const t = clamp((v - lo) / (hi - lo), 0, 1)
  return t * t * (3 - 2 * t)
}

/** 64×64 radial-gradient canvas texture — produces round glowing point sprites */
function makeCircleTexture(): THREE.CanvasTexture {
  const size = 64
  const cv   = document.createElement('canvas')
  cv.width   = size
  cv.height  = size
  const ctx  = cv.getContext('2d')!
  const r    = size / 2
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0,    'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.8)')
  grad.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(cv)
}

// ── Backlight Shader ───────────────────────────────────────────────────────────
const BL_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const BL_FRAG = /* glsl */`
  varying vec2 vUv;
  uniform float uOp;
  uniform float uTime;
  void main() {
    float d   = length(vUv - 0.5);
    float br  = 1.0 + 0.06 * sin(uTime * 0.8);
    float g   = pow(max(0.0, 1.0 - d * 2.0 * br), 2.4);
    vec3  col = mix(vec3(0.5, 0.95, 1.0), vec3(0.0, 0.65, 1.0),
                    clamp(d * 3.0, 0.0, 1.0));
    gl_FragColor = vec4(col, uOp * g);
  }
`

// ── BacklightPlane ─────────────────────────────────────────────────────────────
function BacklightPlane({ isMobile, mouseRef }: { isMobile: boolean; mouseRef: MouseRef }) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const sm         = useRef({ x: 0, y: 0 })
  const prevMouse  = useRef({ x: 0, y: 0 })
  const speedSmooth = useRef(0)
  const mat     = useMemo(() => new THREE.ShaderMaterial({
    uniforms       : { uOp: { value: BACKLIGHT_STRENGTH }, uTime: { value: 0 } },
    vertexShader   : BL_VERT,
    fragmentShader : BL_FRAG,
    transparent    : true,
    blending       : THREE.AdditiveBlending,
    depthWrite     : false,
    side           : THREE.DoubleSide,
  }), [])

  useFrame(({ clock }, delta) => {
    mat.uniforms.uTime.value = clock.getElapsedTime()
    // Cursor velocity → backlight intensity boost
    const rawSpeed = Math.hypot(
      mouseRef.current.x - prevMouse.current.x,
      mouseRef.current.y - prevMouse.current.y,
    )
    speedSmooth.current = THREE.MathUtils.damp(speedSmooth.current, rawSpeed, 5, delta)
    prevMouse.current.x = mouseRef.current.x
    prevMouse.current.y = mouseRef.current.y
    const boost = Math.min(speedSmooth.current * 12, 0.55)
    mat.uniforms.uOp.value = BACKLIGHT_STRENGTH * (1 + boost)

    sm.current.x = THREE.MathUtils.damp(sm.current.x, mouseRef.current.x, 8, delta)
    sm.current.y = THREE.MathUtils.damp(sm.current.y, mouseRef.current.y, 8, delta)
    if (!meshRef.current) return
    meshRef.current.position.x = -sm.current.x * (isMobile ? 25 : 52)
    meshRef.current.position.y =  sm.current.y * (isMobile ? 16 : 36)
  })

  const sz = isMobile ? 300 : 520
  return (
    <mesh ref={meshRef} position={[0, 0, -175]}>
      <planeGeometry args={[sz, sz]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

// ── CameraRig ──────────────────────────────────────────────────────────────────
function CameraRig({ mouseRef }: { mouseRef: MouseRef }) {
  const { camera } = useThree()
  const sm         = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    sm.current.x = THREE.MathUtils.damp(sm.current.x, mouseRef.current.x, 6, delta)
    sm.current.y = THREE.MathUtils.damp(sm.current.y, mouseRef.current.y, 6, delta)
    camera.position.x = sm.current.x * 12
    camera.position.y = sm.current.y *  8
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ── PortraitCloud ──────────────────────────────────────────────────────────────
// Shared renderer for GLB-sampled and image-derived particle data.
// Accepts an optional hairFill layer for depth haze in dark regions.
function PortraitCloud({
  data, hairFill, isMobile, mouseRef,
}: {
  data     : ParticleData
  hairFill ?: ParticleData
  isMobile : boolean
  mouseRef : MouseRef
}) {
  const groupRef = useRef<THREE.Group>(null)
  const sm       = useRef({ x: 0, y: 0 })
  const t0       = useRef<number | null>(null)
  // makeCircleTexture calls document.createElement — safe here because:
  //   • Vite: always runs in browser
  //   • Next.js: 'use client' ensures client-only execution
  const sprite   = useMemo(makeCircleTexture, [])

  // ── Primary geometry ────────────────────────────────────────────────────────
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(data.colors,    3))
    return g
  }, [data])

  const baseSize = isMobile ? CORE_SIZE * 1.4 : CORE_SIZE

  const glowMat = useMemo(() => new THREE.PointsMaterial({
    size            : baseSize * GLOW_SIZE_MULT,
    sizeAttenuation : true,
    vertexColors    : true,
    blending        : THREE.AdditiveBlending,
    depthWrite      : false,
    transparent     : true,
    opacity         : 0,
    map             : sprite,
    alphaTest       : 0.01,
  }), [baseSize, sprite])

  const coreMat = useMemo(() => new THREE.PointsMaterial({
    size            : baseSize,
    sizeAttenuation : true,
    vertexColors    : true,
    blending        : THREE.AdditiveBlending,
    depthWrite      : false,
    transparent     : true,
    opacity         : 0,
    map             : sprite,
    alphaTest       : 0.01,
  }), [baseSize, sprite])

  // ── Hair fill geometry + material ───────────────────────────────────────────
  // Slightly larger size (×1.3), lower opacity (CORE_OPACITY × 0.45)
  // Rendered behind the primary layers to add depth haze in dark/hair regions.
  const hairGeo = useMemo(() => {
    if (!hairFill || hairFill.count === 0) return null
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(hairFill.positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(hairFill.colors,    3))
    return g
  }, [hairFill])

  const hairMat = useMemo(() => new THREE.PointsMaterial({
    size            : baseSize * 1.3,   // slightly larger than core
    sizeAttenuation : true,
    vertexColors    : true,
    blending        : THREE.AdditiveBlending,
    depthWrite      : false,
    transparent     : true,
    opacity         : 0,
    map             : sprite,
    alphaTest       : 0.01,
  }), [baseSize, sprite])

  useFrame(({ clock }, delta) => {
    const now = clock.getElapsedTime()
    if (t0.current === null) t0.current = now

    const rev       = ease(Math.min(1, (now - t0.current) / 2.5))
    // Subtle sparkle: glow layer breathes gently at a prime-ish frequency
    const sparkle   = 1 + 0.04 * Math.sin(now * 3.7 + 1.2)
    glowMat.opacity = GLOW_OPACITY * rev * sparkle
    coreMat.opacity = CORE_OPACITY * rev
    // Hair fill fades in with same reveal curve, lower opacity
    hairMat.opacity = CORE_OPACITY * 0.45 * rev

    sm.current.x = THREE.MathUtils.damp(sm.current.x, mouseRef.current.x, DAMP_SPEED, delta)
    sm.current.y = THREE.MathUtils.damp(sm.current.y, mouseRef.current.y, DAMP_SPEED, delta)

    if (groupRef.current) {
      groupRef.current.rotation.y = sm.current.x * PARALLAX_STRENGTH
      groupRef.current.rotation.x = -sm.current.y * PARALLAX_STRENGTH * 0.6
      groupRef.current.position.z = Math.sin(now * 0.55) * 5.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Hair fill rendered first (behind) for depth haze */}
      {hairGeo && <points geometry={hairGeo} material={hairMat} />}
      <points geometry={geo} material={glowMat} />
      <points geometry={geo} material={coreMat} />
    </group>
  )
}

// ── GLBPortrait ────────────────────────────────────────────────────────────────
// Must be rendered inside GLBErrorBoundary + Suspense so failures are caught.
function GLBPortrait({ isMobile, mouseRef }: { isMobile: boolean; mouseRef: MouseRef }) {
  const { scene } = useGLTF('/ava-face.glb')

  const mesh = useMemo((): THREE.Mesh | null => {
    let found: THREE.Mesh | null = null
    scene.traverse((child) => {
      if (!found && child instanceof THREE.Mesh) found = child
    })
    return found
  }, [scene])

  const { primary, hairFill } = useMemo((): {
    primary  : ParticleData | null
    hairFill : ParticleData | null
  } => {
    if (!mesh) return { primary: null, hairFill: null }

    const count   = isMobile ? POINT_COUNT_MOBILE : POINT_COUNT_DESKTOP
    const sampler = new MeshSurfaceSampler(mesh).build()
    const tempPos = new THREE.Vector3()

    // Pass 1 — sample + find bounding box for normalisation
    const rawPos = new Float32Array(count * 3)
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity
    let minZ = Infinity, maxZ = -Infinity

    for (let i = 0; i < count; i++) {
      sampler.sample(tempPos)
      rawPos[i * 3]     = tempPos.x
      rawPos[i * 3 + 1] = tempPos.y
      rawPos[i * 3 + 2] = tempPos.z
      if (tempPos.x < minX) minX = tempPos.x
      if (tempPos.x > maxX) maxX = tempPos.x
      if (tempPos.y < minY) minY = tempPos.y
      if (tempPos.y > maxY) maxY = tempPos.y
      if (tempPos.z < minZ) minZ = tempPos.z
      if (tempPos.z > maxZ) maxZ = tempPos.z
    }

    // Target world dimensions: camera z=500, fov=50 → visH ≈ 466 units
    const W    = typeof window !== 'undefined' ? window.innerWidth  : 1280
    const H    = typeof window !== 'undefined' ? window.innerHeight : 800
    const visH = 2 * 500 * Math.tan((50 * Math.PI / 180) / 2)
    const visW = visH * (W / H)
    const mAsp = (maxX - minX) / Math.max(0.001, maxY - minY)
    let   tgtH = visH * 0.92
    let   tgtW = tgtH * mAsp
    if (tgtW > visW * 0.94) { tgtW = visW * 0.94; tgtH = tgtW / mAsp }

    const sX = tgtW / Math.max(0.001, maxX - minX)
    const sY = tgtH / Math.max(0.001, maxY - minY)
    const s  = Math.min(sX, sY)
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const cz = (minZ + maxZ) / 2

    // Pass 2 — normalise + colour + micro jitter (breaks grid feel, adds volume)
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const cyanC     = new THREE.Color(CYAN_COLOR)
    const purpleC   = new THREE.Color(PURPLE_COLOR)

    for (let i = 0; i < count; i++) {
      // Micro jitter: ±0.6 XY, ±0.8 Z — subtle organic displacement
      positions[i * 3]     = (rawPos[i * 3]     - cx) * s + (Math.random() - 0.5) * 1.2
      positions[i * 3 + 1] = (rawPos[i * 3 + 1] - cy) * s + (Math.random() - 0.5) * 1.2
      positions[i * 3 + 2] = (rawPos[i * 3 + 2] - cz) * s + (Math.random() - 0.5) * 1.6
      const c = Math.random() < PURPLE_PERCENT ? purpleC : cyanC
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const primary: ParticleData = { positions, colors, count }

    // Hair fill pass — ~30% extra samples from same surface, pushed back in Z
    // Creates depth haze and fills any sparse mesh regions without flattening.
    const fillCount     = Math.floor(count * 0.30)
    const fillPositions = new Float32Array(fillCount * 3)
    const fillColors    = new Float32Array(fillCount * 3)

    for (let i = 0; i < fillCount; i++) {
      sampler.sample(tempPos)
      fillPositions[i * 3]     = (tempPos.x - cx) * s + (Math.random() - 0.5) * 1.0
      fillPositions[i * 3 + 1] = (tempPos.y - cy) * s + (Math.random() - 0.5) * 1.0
      // Push back 3–8 world units for depth haze (behind primary layer)
      fillPositions[i * 3 + 2] = (tempPos.z - cz) * s - (3 + Math.random() * 5)
      // Slight cyan-purple tint variation — more purple for warmth in shadows
      const c = Math.random() < 0.55 ? cyanC : purpleC
      fillColors[i * 3]     = c.r
      fillColors[i * 3 + 1] = c.g
      fillColors[i * 3 + 2] = c.b
    }

    const hairFill: ParticleData = {
      positions : fillPositions,
      colors    : fillColors,
      count     : fillCount,
    }

    return { primary, hairFill }
  }, [mesh, isMobile])

  if (!primary) return null
  return (
    <PortraitCloud
      data={primary}
      hairFill={hairFill ?? undefined}
      isMobile={isMobile}
      mouseRef={mouseRef}
    />
  )
}

// ── Image Fallback ─────────────────────────────────────────────────────────────
// Adaptive density + two-pass grid + hair fill pass + micro jitter.
// Called only from within useEffect (client-only).
function buildImageParticles(isMobile: boolean): Promise<ImageParticleResult> {
  return new Promise((resolve, reject) => {
    const img       = new Image()
    img.crossOrigin = 'anonymous'
    img.src         = '/ava-face.png'
    img.onerror     = () => reject(new Error('Failed to load /ava-face.png'))

    img.onload = () => {
      const iW   = img.naturalWidth
      const iH   = img.naturalHeight
      const step = isMobile ? PARTICLE_STEP_MOBILE : PARTICLE_STEP_DESKTOP

      // document.createElement safe inside Promise callback (client-only)
      const off  = document.createElement('canvas')
      off.width  = iW
      off.height = iH
      const c2   = off.getContext('2d')!
      c2.drawImage(img, 0, 0)
      const px = c2.getImageData(0, 0, iW, iH).data

      const lum = (x: number, y: number): number => {
        if (x < 0 || x >= iW || y < 0 || y >= iH) return 0
        const i = (y * iW + x) * 4
        return (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255
      }

      const W      = typeof window !== 'undefined' ? window.innerWidth  : 1280
      const H      = typeof window !== 'undefined' ? window.innerHeight : 800
      const visH   = 2 * 500 * Math.tan((50 * Math.PI / 180) / 2)
      const visW   = visH * (W / H)
      const imgAsp = iW / iH
      let   scaleY = visH * 0.92
      let   scaleX = scaleY * imgAsp
      if (scaleX > visW * 0.94) { scaleX = visW * 0.94; scaleY = scaleX / imgAsp }

      const pos: number[] = []
      const col: number[] = []
      const hairPos: number[] = []
      const hairCol: number[] = []
      const cyanC   = new THREE.Color(CYAN_COLOR)
      const purpleC = new THREE.Color(PURPLE_COLOR)

      // Two-pass grid A at (0,0) + grid B at (step/2, step/2) — fills gaps
      const half = step >> 1
      const offsets: [number, number][] = [[0, 0], [half, half]]

      for (const [ox, oy] of offsets) {
        for (let y = oy; y < iH; y += step) {
          for (let x = ox; x < iW; x += step) {
            const l = lum(x, y)

            // Task 1 — adaptive density instead of hard cutoff:
            // Dark areas keep ~40% density; bright areas approach 100%.
            // Only reject pixels that are truly transparent/background (< 1%).
            if (l < 0.01) continue
            const density = ss(0.05, 0.35, l) * 0.6 + 0.4
            if (Math.random() > density) continue

            const sx  = (x / iW - 0.5) * scaleX
            const sy  = (0.5 - y / iH) * scaleY
            const gxl = lum(x + 1, y) - lum(x - 1, y)
            const gyl = lum(x, y + 1) - lum(x, y - 1)
            let sz = (l - 0.45) * DEPTH_STRENGTH
                   + Math.sqrt(gxl * gxl + gyl * gyl) * EDGE_DEPTH_BOOST
            sz = clamp(sz, -Z_CLAMP, Z_CLAMP)

            // Task 3 — micro jitter: ±0.6 XY, ±0.8 Z
            pos.push(
              sx + (Math.random() - 0.5) * 1.2,
              sy + (Math.random() - 0.5) * 1.2,
              sz + (Math.random() - 0.5) * 1.6,
            )
            const c = Math.random() < PURPLE_PERCENT ? purpleC : cyanC
            col.push(c.r, c.g, c.b)
          }
        }
      }

      // Task 2 — Hair fill pass: secondary subtle layer for dark regions.
      // Only pixels with luminance < 0.35 (hair, shadows, eyebrows, lashes).
      // Size ×1.3, opacity ×0.45, pushed 3–8 units behind primary layer.
      for (let y = 0; y < iH; y += step) {
        for (let x = 0; x < iW; x += step) {
          const l = lum(x, y)
          // Only process dark/mid-dark pixels in the hair/shadow range
          if (l < 0.01 || l >= 0.35) continue
          // Additional 50% thinning — fill layer is supplementary, not dominant
          if (Math.random() > 0.5) continue

          const sx  = (x / iW - 0.5) * scaleX
          const sy  = (0.5 - y / iH) * scaleY
          const gxl = lum(x + 1, y) - lum(x - 1, y)
          const gyl = lum(x, y + 1) - lum(x, y - 1)
          let sz = (l - 0.45) * DEPTH_STRENGTH
                 + Math.sqrt(gxl * gxl + gyl * gyl) * EDGE_DEPTH_BOOST
          sz = clamp(sz, -Z_CLAMP, Z_CLAMP)
          // Push back 3–8 units — depth haze behind primary layer
          sz -= 3 + Math.random() * 5

          hairPos.push(
            sx + (Math.random() - 0.5) * 1.2,
            sy + (Math.random() - 0.5) * 1.2,
            sz,
          )
          // Slight cyan-purple tint variation — shadows lean warmer (purple)
          const c = Math.random() < 0.55 ? cyanC : purpleC
          hairCol.push(c.r, c.g, c.b)
        }
      }

      resolve({
        primary: {
          positions : new Float32Array(pos),
          colors    : new Float32Array(col),
          count     : pos.length / 3,
        },
        hairFill: {
          positions : new Float32Array(hairPos),
          colors    : new Float32Array(hairCol),
          count     : hairPos.length / 3,
        },
      })
    }
  })
}

// ── Scene ──────────────────────────────────────────────────────────────────────
function Scene({
  useGLB, onGLBError, imageData, isMobile, mouseRef,
}: {
  useGLB      : boolean
  onGLBError  : () => void
  imageData   : ImageParticleResult | null
  isMobile    : boolean
  mouseRef    : MouseRef
}) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <CameraRig mouseRef={mouseRef} />
      <BacklightPlane isMobile={isMobile} mouseRef={mouseRef} />
      {useGLB ? (
        // GLBErrorBoundary catches useGLTF failures (404, parse error, etc.)
        // and calls onGLBError() to switch the parent to image-fallback mode.
        <GLBErrorBoundary onError={onGLBError}>
          <Suspense fallback={null}>
            <GLBPortrait isMobile={isMobile} mouseRef={mouseRef} />
          </Suspense>
        </GLBErrorBoundary>
      ) : (
        imageData && (
          <PortraitCloud
            data={imageData.primary}
            hairFill={imageData.hairFill}
            isMobile={isMobile}
            mouseRef={mouseRef}
          />
        )
      )}
    </>
  )
}

// ── Static Image Fallback (shown when WebGL is unavailable) ───────────────────
function StaticFallback({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%', height: '100%',
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <img
        src="/ava-face.png"
        alt="Ava"
        style={{ height: '80%', width: 'auto', objectFit: 'contain', opacity: 0.5 }}
      />
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────────────────────
interface AvaParticleHeroProps {
  className?      : string
  scrollProgress? : number   // accepted for API compat; not used internally
}

export default function AvaParticleHero({ className }: AvaParticleHeroProps) {
  // useGLB starts true → always try GLB first (no HEAD fetch delay/flash)
  // GLBErrorBoundary sets it to false if the file is missing or broken
  const [useGLB,    setUseGLB]    = useState(true)
  const [imageData, setImageData] = useState<ImageParticleResult | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Computed once on mount — window is available ('use client' / Vite client-only)
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  )

  // Build image particles when GLB mode is disabled (either at start or after error)
  useEffect(() => {
    if (useGLB) return
    let cancelled = false
    buildImageParticles(isMobile)
      .then(result => { if (!cancelled) setImageData(result) })
      .catch((err) => console.warn('[AvaParticleHero] image fallback failed:', err))
    return () => { cancelled = true }
  }, [useGLB, isMobile])

  // Global pointer tracking — all window access safely inside useEffect
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const handleGLBError = () => setUseGLB(false)

  return (
    // CanvasErrorBoundary catches WebGL context failures and Three.js render errors.
    // Falls back to a static <img> so the hero never shows a blank black screen.
    <CanvasErrorBoundary fallback={<StaticFallback className={className} />}>
      <div className={className} style={{ width: '100%', height: '100%', background: '#000' }}>
        <Canvas
          camera={{ position: [0, 0, 500], fov: 50, near: 1, far: 2000 }}
          dpr={[1, 1.75]}
          gl={{
            antialias       : false,
            alpha           : false,
            powerPreference : 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Scene
            useGLB={useGLB}
            onGLBError={handleGLBError}
            imageData={imageData}
            isMobile={isMobile}
            mouseRef={mouseRef}
          />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  )
}
