import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Animated Floating Globe / Retraining Feedback Core
function ModelCore() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
          emissive="#1E3A8A"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
}

// Orbiting Telemetry Particles / Feedback Ring
function ParticleRing() {
  const pointsRef = useRef();
  const count = 300;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#60A5FA');
    const colorB = new THREE.Color('#818CF8');

    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 1.2;

      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta);

      const mixed = colorA.clone().lerp(colorB, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating 3D KPI Glass Nodes
function FloatingKpiNode({ position, label, value, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() + position[0]) * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={meshRef} position={position}>
        <mesh>
          <boxGeometry args={[1.2, 0.7, 0.15]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.35}
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            ior={1.5}
            reflectivity={0.9}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Camera Mouse Parallax
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 0.8, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export const Hero3DScene = ({ className = '' }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // 2D Fallback for reduced motion or devices without WebGL
  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 p-8 border border-blue-500/20 ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 blur-xl opacity-60 animate-pulse" />
          <div className="mt-4 rounded-xl bg-slate-900/80 px-4 py-2 border border-blue-500/30 text-xs font-semibold text-blue-400">
            AdaptFlow Self-Adaptive Core Active
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-3xl bg-slate-950/60 border border-slate-800/80 shadow-2xl ${className}`}>
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/60 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-medium text-slate-300">Live 3D Telemetry Grid</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#93C5FD" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#A78BFA" />

        <CameraRig />
        <ModelCore />
        <ParticleRing />
        <Sparkles count={80} scale={6} size={2} speed={0.4} opacity={0.6} color="#60A5FA" />

        <FloatingKpiNode position={[-2.4, 1.2, -0.5]} color="#1D4ED8" />
        <FloatingKpiNode position={[2.5, -1.0, -0.2]} color="#4338CA" />
        <FloatingKpiNode position={[-2.0, -1.4, -0.8]} color="#0D9488" />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
