'use client'
/**
 * AvaParticleHero v3 — crash-proof Three.js / R3F 3D particle portrait
 *
 * Primary mode  : /ava-face.glb → MeshSurfaceSampler → true 3D surface cloud
 * Fallback mode : /ava-face.png → luminance depth + two-pass pixel sampling
 * Hard fallback : <img> static image when WebGL is unavailable
 *
 * GLB detection : attempt load via useGLTF; GLBErrorBoundary catches 404/errors
 *                 and flips to image mode — no fragile HEAD fetch required.
 * WebGL guard   : CanvasErrorBoundary wraps Canvas; shows static image on failure.
 * window/doc    : all access is inside useEffect, useFrame, or useMemo (client-only
 *                 with 'use client'; also guarded by typeof window checks where used
 *                 outside effects to be safe in any SSR context).
 *
 * ─── TWEAK KNOBS ─────────────────────────────────────────────────────────────
 */
export const POINT_COUNT_DESKTOP   = 50_000
export const POINT_COUNT_MOBILE    = 12_000
export const DAMP_SPEED            = 22      // MathUtils.damp lambda
export const CYAN_COLOR            = '#00E5FF'
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
  const meshRef = useRef<THREE.Mesh>(null)
  const sm      = useRef({ x: 0, y: 0 })
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
function PortraitCloud({
  data, isMobile, mouseRef,
}: { data: ParticleData; isMobile: boolean; mouseRef: MouseRef }) {
  const groupRef = useRef<THREE.Group>(null)
  const sm       = useRef({ x: 0, y: 0 })
  const t0       = useRef<number | null>(null)
  // makeCircleTexture calls document.createElement — safe here because:
  //   • Vite: always runs in browser
  //   • Next.js: 'use client' ensures client-only execution
  const sprite   = useMemo(makeCircleTexture, [])

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

  useFrame(({ clock }, delta) => {
    const now = clock.getElapsedTime()
    if (t0.current === null) t0.current = now

    const rev       = ease(Math.min(1, (now - t0.current) / 2.5))
    glowMat.opacity = GLOW_OPACITY * rev
    coreMat.opacity = CORE_OPACITY * rev

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

  const data = useMemo((): ParticleData | null => {
    if (!mesh) return null

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

    // Pass 2 — normalise + colour
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const cyanC     = new THREE.Color(CYAN_COLOR)
    const purpleC   = new THREE.Color(PURPLE_COLOR)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (rawPos[i * 3]     - cx) * s
      positions[i * 3 + 1] = (rawPos[i * 3 + 1] - cy) * s
      positions[i * 3 + 2] = (rawPos[i * 3 + 2] - cz) * s
      const c = Math.random() < PURPLE_PERCENT ? purpleC : cyanC
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, colors, count }
  }, [mesh, isMobile])

  if (!data) return null
  return <PortraitCloud data={data} isMobile={isMobile} mouseRef={mouseRef} />
}

// ── Image Fallback ─────────────────────────────────────────────────────────────
// Two-pass grid sampling with Z_CLAMP; called only from within useEffect.
function buildImageParticles(isMobile: boolean): Promise<ParticleData> {
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
      const cyanC   = new THREE.Color(CYAN_COLOR)
      const purpleC = new THREE.Color(PURPLE_COLOR)

      // Two-pass: grid A at (0, 0) + grid B at (step/2, step/2) — fills gaps
      const half = step >> 1
      const offsets: [number, number][] = [[0, 0], [half, half]]

      for (const [ox, oy] of offsets) {
        for (let y = oy; y < iH; y += step) {
          for (let x = ox; x < iW; x += step) {
            const l = lum(x, y)
            if (l < 0.055) continue

            const sx = (x / iW - 0.5) * scaleX
            const sy = (0.5 - y / iH) * scaleY
            const gx = lum(x + 1, y) - lum(x - 1, y)
            const gy = lum(x, y + 1) - lum(x, y - 1)
            let sz = (l - 0.45) * DEPTH_STRENGTH
                   + Math.sqrt(gx * gx + gy * gy) * EDGE_DEPTH_BOOST
                   + (Math.random() - 0.5) * 10
            sz = clamp(sz, -Z_CLAMP, Z_CLAMP)

            pos.push(sx, sy, sz)
            const c = Math.random() < PURPLE_PERCENT ? purpleC : cyanC
            col.push(c.r, c.g, c.b)
          }
        }
      }

      resolve({
        positions : new Float32Array(pos),
        colors    : new Float32Array(col),
        count     : pos.length / 3,
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
  imageData   : ParticleData | null
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
        imageData && <PortraitCloud data={imageData} isMobile={isMobile} mouseRef={mouseRef} />
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
  const [imageData, setImageData] = useState<ParticleData | null>(null)
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
      .then(d => { if (!cancelled) setImageData(d) })
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
