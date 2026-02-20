import React, { useEffect, useMemo, useRef } from 'react';
import { AdaptiveDpr, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import * as THREE from 'three';

type FaceData = {
  positions: Float32Array;
  normals: Float32Array;
  randoms: Float32Array;
  sizes: Float32Array;
  features: Float32Array;
};

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uLayer;

  attribute vec3 aFacePos;
  attribute vec3 aNormal;
  attribute float aRandom;
  attribute float aSize;
  attribute float aFeature;

  varying float vRandom;
  varying float vAlpha;
  varying float vFront;
  varying float vRim;
  varying float vDepth;
  varying float vFeature;

  void main() {
    vRandom = aRandom;
    vFeature = aFeature;

    vec3 n = normalize(aNormal);
    vec3 pos = mix(position, aFacePos, uMorph);

    float dissolve = smoothstep(aRandom - 0.08, aRandom + 0.08, uScroll);
    pos += n * dissolve * (0.86 + uLayer * 0.26 + aFeature * 0.1);
    pos.y += (aRandom - 0.5) * dissolve * (0.45 + uLayer * 0.22);

    float idle = smoothstep(0.82, 1.0, uMorph) * (1.0 - uScroll);
    pos += n * sin(uTime * (0.35 + uLayer * 0.09) + aRandom * 17.0) * idle * (0.03 + uLayer * 0.02 + aFeature * 0.015);

    float layerSpread = smoothstep(0.82, 1.0, uMorph) * (0.07 + uLayer * 0.08);
    pos += n * layerSpread;

    vec3 frontLightPos = vec3(uMouse.x * 1.95, uMouse.y * 1.35 + 0.12, 2.15);
    vec3 backLightPos = vec3(-uMouse.x * 2.85, uMouse.y * 1.7 + 0.18, -3.45);

    vec3 frontDir = normalize(frontLightPos - pos);
    vec3 backDir = normalize(backLightPos - pos);

    float front = max(dot(n, frontDir), 0.0);
    float back = max(dot(n, backDir), 0.0);

    vec3 viewDir = normalize(vec3(0.0, 0.0, 3.1) - pos);
    float rim = pow(max(1.0 - dot(n, viewDir), 0.0), 1.95);

    float frontDistance = length(frontLightPos - pos);
    float backDistance = length(backLightPos - pos);

    float frontAttenuation = 1.0 / (1.0 + frontDistance * frontDistance * 0.9);
    float backAttenuation = 1.0 / (1.0 + backDistance * backDistance * 0.2);

    vFront = front * (1.56 + uLayer * 0.24 + aFeature * 0.46) + frontAttenuation * 1.4;
    vRim = rim * (1.38 + uLayer * 0.95) + back * backAttenuation * (2.25 + uLayer * 0.88);
    vDepth = smoothstep(-1.0, 0.9, pos.z);

    float layerAlpha = mix(1.0, 0.55, uLayer / 2.0);
    vAlpha = smoothstep(0.0, 0.35, uMorph) * (1.0 - dissolve) * layerAlpha;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float layerSize = mix(1.08, 2.5, uLayer / 2.0);
    gl_PointSize = aSize * layerSize * uPixelRatio * (330.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vRandom;
  varying float vAlpha;
  varying float vFront;
  varying float vRim;
  varying float vDepth;
  varying float vFeature;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = pow(max(0.0, 1.0 - d * 2.8), 2.0);
    float halo = exp(-d * 6.1) * 0.7;
    float strength = core + halo;

    vec3 shadow = vec3(0.02, 0.09, 0.18);
    vec3 mid = vec3(0.18, 0.86, 1.0);
    vec3 bright = vec3(0.98, 1.0, 1.0);
    vec3 rimLavender = vec3(0.72, 0.96, 1.0);

    vec3 base = mix(shadow, mid, smoothstep(0.15, 0.85, vRandom));
    base = mix(base, bright, clamp(vFront * 0.62 + vFeature * 0.4, 0.0, 1.0));
    base = mix(base, rimLavender, clamp(vRim * 0.76, 0.0, 1.0));
    base = mix(base, vec3(0.10, 0.82, 1.0), vDepth * 0.62);

    float sparkle = smoothstep(0.8, 1.0, vFeature) * 0.58;
    float shimmer = 1.0 + sin(vRandom * 52.0) * 0.1 + sparkle;
    float alpha = strength * vAlpha * 1.95;
    vec3 color = base * shimmer * (1.0 + vFront * 1.12 + vRim * 0.92 + vFeature * 0.44);

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const GLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uGlowColor;
  uniform vec2 uMouse;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    vec2 center = vec2(-uMouse.x * 0.38, uMouse.y * 0.24);

    float d = length((uv - center) * vec2(0.66, 0.86));
    float pulse = 0.95 + sin(uTime * 0.9) * 0.05;
    float glow = exp(-d * 2.5) * pulse;

    float secondary = exp(-length(uv - center * 0.75) * 5.2) * 0.92;
    float alpha = (glow + secondary) * 1.35;

    gl_FragColor = vec4(uGlowColor * (glow + secondary * 0.9), alpha);
  }
`;

const DUST_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aRandom;

  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.25 + aRandom * 13.0) * 0.08;
    p.x += cos(uTime * 0.18 + aRandom * 7.0) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.4 + aRandom * 0.6;
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float falloff = exp(-d * 5.5);
    vec3 color = vec3(0.36, 0.78, 0.96);

    gl_FragColor = vec4(color * falloff * vAlpha, falloff * vAlpha * 0.34);
  }
`;

function createSpherePositions(count: number): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const radius = 1.12 + Math.random() * 0.58;

    points[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    points[i * 3 + 1] = radius * Math.cos(phi);
    points[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return points;
}

function gaussian(distance: number, sigma: number): number {
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function getNamedMesh(scene: THREE.Group, names: string[]): THREE.Mesh | null {
  for (const name of names) {
    const hit = scene.getObjectByName(name);
    if (hit instanceof THREE.Mesh && hit.geometry instanceof THREE.BufferGeometry) {
      return hit;
    }
  }
  return null;
}

function useFaceParticles(count: number): FaceData {
  const { scene } = useGLTF('/Ava.glb');

  return useMemo(() => {
    const headMesh = getNamedMesh(scene, ['Anna_Head', 'Head', 'Wolf3D_Head', 'Face']);
    const hairMesh = getNamedMesh(scene, ['Anna_Hair', 'Hair']);
    const eyesMesh = getNamedMesh(scene, ['Anna_Eyes', 'Eyes']);
    const browsMesh = getNamedMesh(scene, ['Anna_Eyebrows', 'Eyebrows']);
    const teethMesh = getNamedMesh(scene, ['Anna_Teeth', 'Teeth']);

    if (!headMesh) {
      throw new Error('Unable to find head mesh in /public/Ava.glb. Expected names like Anna_Head / Head / Wolf3D_Head.');
    }

    const targets = [
      { mesh: headMesh, weight: 0.68 },
      { mesh: hairMesh, weight: 0.2 },
      { mesh: eyesMesh, weight: 0.06 },
      { mesh: browsMesh, weight: 0.04 },
      { mesh: teethMesh, weight: 0.02 },
    ].filter((t): t is { mesh: THREE.Mesh; weight: number } => !!t.mesh);

    targets.forEach(({ mesh }) => mesh.updateWorldMatrix(true, false));

    const headGeometry = headMesh.geometry;
    headGeometry.computeBoundingBox();

    const localBounds = headGeometry.boundingBox?.clone();
    const bounds = localBounds
      ? localBounds.applyMatrix4(headMesh.matrixWorld)
      : new THREE.Box3(new THREE.Vector3(-1, -1.4, -0.8), new THREE.Vector3(1, 1.5, 0.8));

    const faceCenter = new THREE.Vector3(
      (bounds.min.x + bounds.max.x) * 0.5,
      (bounds.min.y + bounds.max.y) * 0.52,
      (bounds.min.z + bounds.max.z) * 0.5,
    );

    const faceHeight = Math.max(bounds.max.y - bounds.min.y, 0.001);
    const normalizeScale = 2.25 / faceHeight;

    const width = Math.max(bounds.max.x - bounds.min.x, 0.001);
    const height = Math.max(bounds.max.y - bounds.min.y, 0.001);
    const depth = Math.max(bounds.max.z - bounds.min.z, 0.001);

    const samplers = targets.map(({ mesh, weight }) => ({
      weight,
      sampler: new MeshSurfaceSampler(mesh).build(),
    }));

    const cumulativeWeights: number[] = [];
    let totalWeight = 0;
    samplers.forEach((item) => {
      totalWeight += item.weight;
      cumulativeWeights.push(totalWeight);
    });

    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);
    const features = new Float32Array(count);

    const p = new THREE.Vector3();
    const n = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      const pick = Math.random() * totalWeight;
      let samplerIndex = 0;
      while (samplerIndex < cumulativeWeights.length - 1 && pick > cumulativeWeights[samplerIndex]) {
        samplerIndex += 1;
      }

      samplers[samplerIndex].sampler.sample(p, n);

      const normalizedX = (p.x - faceCenter.x) * normalizeScale;
      const normalizedY = (p.y - faceCenter.y) * normalizeScale;
      const normalizedZ = (p.z - faceCenter.z) * normalizeScale;

      positions[i * 3] = normalizedX;
      positions[i * 3 + 1] = normalizedY;
      positions[i * 3 + 2] = normalizedZ;

      normals[i * 3] = n.x;
      normals[i * 3 + 1] = n.y;
      normals[i * 3 + 2] = n.z;

      randoms[i] = Math.random();

      const xNorm = (p.x - bounds.min.x) / width;
      const yNorm = (p.y - bounds.min.y) / height;
      const centerX = xNorm - 0.5;

      const leftEye = gaussian(Math.hypot(xNorm - 0.36, yNorm - 0.64), 0.11);
      const rightEye = gaussian(Math.hypot(xNorm - 0.64, yNorm - 0.64), 0.11);
      const lips = gaussian(Math.hypot(xNorm - 0.5, yNorm - 0.34), 0.16);
      const nose = gaussian(Math.hypot(xNorm - 0.5, yNorm - 0.5), 0.13);
      const hairline = gaussian(yNorm - 0.86, 0.16);
      const silhouette = THREE.MathUtils.smoothstep(Math.abs(centerX), 0.24, 0.56);

      const feature = THREE.MathUtils.clamp(
        (leftEye + rightEye) * 0.52
        + lips * 0.36
        + nose * 0.24
        + hairline * 0.18
        + silhouette * 0.14,
        0,
        1,
      );

      features[i] = feature;

      const depthWeight = THREE.MathUtils.clamp((p.z - bounds.min.z) / depth, 0, 1);
      sizes[i] = 0.032 + Math.random() * 0.04 + depthWeight * 0.022 + feature * 0.038;
    }

    return {
      positions,
      normals,
      randoms,
      sizes,
      features,
    };
  }, [count, scene]);
}

type LayerProps = {
  count: number;
  face: FaceData;
  sphere: Float32Array;
  mouseRef: React.MutableRefObject<{ x: number; y: number; sx: number; sy: number }>;
  scrollProgress: number;
  layer: number;
  rotationStrength: number;
};

function ParticleLayer({ count, face, sphere, mouseRef, scrollProgress, layer, rotationStrength }: LayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const baseScale = 2.04 + layer * 0.09;
  const baseX = 0.08 - layer * 0.015;
  const baseY = -0.3 + layer * 0.024;
  const baseZ = layer * 0.05;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: {
        value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5),
      },
      uLayer: { value: layer },
    }),
    [layer],
  );

  useEffect(() => {
    gsap.to(uniforms.uMorph, {
      value: 1,
      duration: 2.4,
      ease: 'power3.inOut',
      delay: 0.15 + layer * 0.08,
    });
  }, [layer, uniforms]);

  useEffect(() => {
    uniforms.uScroll.value = scrollProgress;
  }, [scrollProgress, uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    const m = mouseRef.current;
    uniforms.uMouse.value.set(m.sx, m.sy);

    if (pointsRef.current) {
      pointsRef.current.rotation.y += (m.sx * rotationStrength - pointsRef.current.rotation.y) * 0.11;
      pointsRef.current.rotation.x += (-m.sy * (rotationStrength * 0.74) - pointsRef.current.rotation.x) * 0.11;
      pointsRef.current.position.x += ((baseX + m.sx * (0.11 + layer * 0.02)) - pointsRef.current.position.x) * 0.1;
      pointsRef.current.position.y += ((baseY + m.sy * (0.07 + layer * 0.015)) - pointsRef.current.position.y) * 0.1;
      pointsRef.current.position.z += ((baseZ + Math.abs(m.sx) * (0.02 + layer * 0.01)) - pointsRef.current.position.z) * 0.1;
    }
  });

  return (
    <points
      ref={pointsRef}
      frustumCulled={false}
      scale={baseScale}
      position={[baseX, baseY, baseZ]}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={sphere} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aFacePos" array={face.positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aNormal" array={face.normals} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" array={face.randoms} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" array={face.sizes} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aFeature" array={face.features} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BackGlow({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number; sx: number; sy: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const accentRef = useRef<THREE.Mesh>(null);
  const hotspotRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uGlowColor: { value: new THREE.Color('#2dfdff') },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
    }),
    [],
  );

  const accentUniforms = useMemo(
    () => ({
      uGlowColor: { value: new THREE.Color('#8fd7ff') },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    accentUniforms.uTime.value = state.clock.elapsedTime;

    const m = mouseRef.current;
    uniforms.uMouse.value.set(m.sx, m.sy);
    accentUniforms.uMouse.value.set(-m.sx * 0.8, m.sy * 0.5);

    if (meshRef.current) {
      meshRef.current.position.x += ((-m.sx * 0.78) - meshRef.current.position.x) * 0.14;
      meshRef.current.position.y += ((m.sy * 0.4) - meshRef.current.position.y) * 0.14;
    }

    if (accentRef.current) {
      accentRef.current.position.x += ((m.sx * 0.62) - accentRef.current.position.x) * 0.12;
      accentRef.current.position.y += ((-m.sy * 0.32) - accentRef.current.position.y) * 0.12;
    }

    if (hotspotRef.current) {
      hotspotRef.current.position.x += ((m.sx * 0.95) - hotspotRef.current.position.x) * 0.18;
      hotspotRef.current.position.y += ((m.sy * 0.55) - hotspotRef.current.position.y) * 0.18;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, -2.15]}>
        <planeGeometry args={[8.2, 8.2]} />
        <shaderMaterial
          vertexShader={GLOW_VERTEX}
          fragmentShader={GLOW_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={accentRef} position={[0.25, -0.15, -1.55]}>
        <planeGeometry args={[4.6, 4.6]} />
        <shaderMaterial
          vertexShader={GLOW_VERTEX}
          fragmentShader={GLOW_FRAGMENT}
          uniforms={accentUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={hotspotRef} position={[0.15, 0.1, -1.2]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#b4ffff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} />
      </mesh>
    </>
  );
}

function AmbientDust({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(7.2);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(5.8);
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-3.6, 1.2);

      sizes[i] = 0.03 + Math.random() * 0.14;
      randoms[i] = Math.random();
    }

    return { positions, sizes, randoms };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5),
      },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00045;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={geometry.positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" array={geometry.sizes} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" array={geometry.randoms} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={DUST_VERTEX}
        fragmentShader={DUST_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

type ParticleProps = {
  scrollProgress: number;
  count: number;
};

function AvaParticles({ scrollProgress, count }: ParticleProps) {
  const mouseRef = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  const face = useFaceParticles(count);
  const sphere = useMemo(() => createSpherePositions(count), [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    const m = mouseRef.current;
    m.sx += (m.x - m.sx) * 0.22;
    m.sy += (m.y - m.sy) * 0.22;
  });

  return (
    <>
      <BackGlow mouseRef={mouseRef} />
      <AmbientDust count={1300} />
      <ParticleLayer
        count={count}
        face={face}
        sphere={sphere}
        mouseRef={mouseRef}
        scrollProgress={scrollProgress}
        layer={0}
        rotationStrength={0.9}
      />
      <ParticleLayer
        count={count}
        face={face}
        sphere={sphere}
        mouseRef={mouseRef}
        scrollProgress={scrollProgress}
        layer={1}
        rotationStrength={0.72}
      />
      <ParticleLayer
        count={count}
        face={face}
        sphere={sphere}
        mouseRef={mouseRef}
        scrollProgress={scrollProgress}
        layer={2}
        rotationStrength={0.56}
      />
    </>
  );
}

type AvaParticleSceneProps = {
  scrollProgress: number;
  className?: string;
};

export default function AvaParticleScene({ scrollProgress, className }: AvaParticleSceneProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 5200 : 13000;

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0.16, 0.08, 3.85], fov: 37, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <AdaptiveDpr pixelated />
        <AvaParticles scrollProgress={scrollProgress} count={count} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/Ava.glb');
