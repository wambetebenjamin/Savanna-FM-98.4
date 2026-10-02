'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type EnvironmentVariant = 'studio' | 'archive' | 'signal';

function FloatingDust({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(270);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.sin(index * 12.9898) * 4.7) % 4.7;
      values[index + 1] = (Math.cos(index * 7.233) * 3.2) % 3.2;
      values[index + 2] = (Math.sin(index * 3.117) * 3.5) % 3.5;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.018;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.025} transparent opacity={0.42} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function VinylSculpture({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z += delta * 0.065;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.09;
  });

  return (
    <group ref={group} position={[2.45, 0.15, 0]} rotation={[0.2, -0.38, 0.1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.72, 1.72, 0.14, 96]} />
        <meshStandardMaterial color="#0b1018" roughness={0.24} metalness={0.72} />
      </mesh>
      {[1.48, 1.25, 1.02, 0.78].map((radius) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, .08]}>
          <torusGeometry args={[radius, 0.012, 8, 100]} />
          <meshStandardMaterial color="#b6ff3b" metalness={0.7} roughness={0.25} transparent opacity={0.46} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, .11]}>
        <cylinderGeometry args={[0.52, 0.52, 0.04, 64]} />
        <meshStandardMaterial color="#dfe7ff" roughness={0.42} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, .15]}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 40]} />
        <meshStandardMaterial color="#4f9d3a" metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[1.65, 0.85, .25]} rotation={[0, 0, -.58]} castShadow>
        <boxGeometry args={[1.5, 0.065, 0.08]} />
        <meshStandardMaterial color="#65728a" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[1.05, 0.45, .27]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#f4f7ff" metalness={0.5} roughness={0.18} />
      </mesh>
    </group>
  );
}

function SignalBars({ reducedMotion, position = [-2.8, -1.5, -0.8] as [number, number, number] }: { reducedMotion: boolean; position?: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 31 }, (_, index) => 0.18 + ((index * 19 + 7) % 25) / 12), []);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const pulse = 0.58 + Math.sin(state.clock.elapsedTime * 1.8 + index * .47) * .22;
      mesh.scale.y = Math.max(.22, pulse);
    });
  });

  return (
    <group ref={group} position={position} rotation={[-0.12, 0.24, -0.03]}>
      {bars.map((height, index) => (
        <mesh key={index} position={[index * .16, height / 2, Math.sin(index * .4) * .16]} castShadow>
          <boxGeometry args={[.055, height, .055]} />
          <meshStandardMaterial color={index % 4 === 0 ? '#8bd85d' : '#b6ff3b'} emissive="#438d39" emissiveIntensity={0.18} metalness={0.58} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function BroadcastRings({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * .08;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * .25) * .16;
  });
  return (
    <group ref={group} position={[1.5, 0, -1]} rotation={[.35, -.35, .1]}>
      {[.7, 1.15, 1.62, 2.08].map((radius, index) => (
        <mesh key={radius} rotation={[index % 2 ? .9 : .35, index * .32, 0]}>
          <torusGeometry args={[radius, index === 0 ? .045 : .018, 12, 100]} />
          <meshStandardMaterial color={index === 0 ? '#dfe7ff' : '#8ee95d'} metalness={.7} roughness={.2} transparent opacity={.68 - index * .09} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[.48, 48, 48]} />
        <meshPhysicalMaterial color="#5cab43" roughness={.12} metalness={.34} transmission={.18} clearcoat={1} clearcoatRoughness={.16} />
      </mesh>
    </group>
  );
}

function RadioWorld({ variant, reducedMotion }: { variant: EnvironmentVariant; reducedMotion: boolean }) {
  const world = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = event.clientY / window.innerHeight * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!world.current) return;
    const targetX = reducedMotion ? 0 : pointer.current.y * .11;
    const targetY = reducedMotion ? 0 : pointer.current.x * .18;
    world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, targetX, 3.5, delta);
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, targetY, 3.5, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.current.x * .12, 3, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pointer.current.y * -.1, 3, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#090b10', 7, 15]} />
      <ambientLight intensity={1.55} />
      <directionalLight position={[-4, 5, 5]} intensity={2.6} color="#eefaff" castShadow />
      <pointLight position={[3.5, 1.2, 3]} intensity={18} distance={8} color="#b6ff3b" />
      <pointLight position={[-3, -1, 2]} intensity={10} distance={7} color="#4f9d3a" />
      <group ref={world} scale={variant === 'studio' ? 1 : .88}>
        {variant === 'studio' && <VinylSculpture reducedMotion={reducedMotion} />}
        {variant === 'archive' && <BroadcastRings reducedMotion={reducedMotion} />}
        {variant === 'signal' && <BroadcastRings reducedMotion={reducedMotion} />}
        <SignalBars reducedMotion={reducedMotion} position={variant === 'studio' ? [-2.8, -1.5, -.8] : [-2.4, -1.6, -1.5]} />
        <FloatingDust color={variant === 'studio' ? '#b6ff3b' : '#8fdc61'} />
      </group>
    </>
  );
}

export default function ImmersiveRadioEnvironment({ variant = 'studio', className = '' }: { variant?: EnvironmentVariant; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener('change', updateMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '180px' });
    if (holder.current) observer.observe(holder.current);
    return () => {
      motionQuery.removeEventListener('change', updateMotion);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={holder} className={`immersive-radio-world immersive-radio-world--${variant} ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.8], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
        shadows
      >
        <RadioWorld variant={variant} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
