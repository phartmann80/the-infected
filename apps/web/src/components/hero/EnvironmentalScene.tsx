'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh, Points } from 'three';
import * as THREE from 'three';

function RuinedSignalTower() {
  const tower = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (tower.current) {
      tower.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.06;
      tower.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.05;
    }
  });

  return (
    <group position={[1.75, -0.45, -2.2]} rotation={[0.08, -0.2, -0.05]}>
      <mesh ref={tower}>
        <coneGeometry args={[0.72, 3.2, 4, 1, false]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.92} metalness={0.2} />
      </mesh>
      <mesh position={[0.04, 0.08, 0.04]} rotation={[0.1, 0.1, 0]}>
        <coneGeometry args={[0.54, 3.05, 4, 1, true]} />
        <meshStandardMaterial color="#ff4a1c" transparent opacity={0.14} emissive="#ff2d12" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function EmberField() {
  const points = useRef<Points>(null);
  const geometry = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 4 - 1.5;
      positions[i * 3 + 2] = Math.random() * -5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.elapsedTime * 0.018;
      points.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.08;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.018} color="#ff6a2a" transparent opacity={0.62} depthWrite={false} />
    </points>
  );
}

function GroundFog() {
  const fog = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (fog.current) {
      fog.current.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.22;
      fog.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.025;
    }
  });

  return (
    <mesh ref={fog} position={[0.9, -1.22, -2.7]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6.5, 2.1, 1, 1]} />
      <meshBasicMaterial color="#9ca3af" transparent opacity={0.095} depthWrite={false} />
    </mesh>
  );
}

type EnvironmentalSceneProps = {
  active: boolean;
  reducedDetail?: boolean;
};

export function EnvironmentalScene({ active, reducedDetail = false }: EnvironmentalSceneProps) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 opacity-80 [mask-image:linear-gradient(90deg,transparent,black_34%,black)]">
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 42 }}
        dpr={reducedDetail ? [1, 1] : [1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#030405"]} />
        <fog attach="fog" args={["#130907", 3.4, 8.5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[2.4, 1.2, 1.3]} color="#ff4a1c" intensity={2.1} />
        <directionalLight position={[-2, 3, 2]} intensity={0.7} color="#d1d5db" />
        <RuinedSignalTower />
        <GroundFog />
        {!reducedDetail && <EmberField />}
      </Canvas>
    </div>
  );
}
