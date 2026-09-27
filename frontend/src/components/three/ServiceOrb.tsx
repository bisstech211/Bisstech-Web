import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Accent color per service (index matches SERVICES order). Coffee/espresso palette. */
export const SERVICE_COLORS = ['#6F4E37', '#8B6B53', '#564235', '#48352C', '#3D2B1F', '#2D1E15', '#7A5A45'];

function Orb({ active }: { active: number }) {
  const knotRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const target = useMemo(() => new THREE.Color(SERVICE_COLORS[active % SERVICE_COLORS.length]), [active]);
  const current = useMemo(() => new THREE.Color('#6F4E37'), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    current.lerp(target, Math.min(delta * 2.2, 1));
    if (matRef.current) {
      matRef.current.emissive.copy(current);
      matRef.current.color.copy(current);
    }
    if (innerMatRef.current) {
      innerMatRef.current.color.copy(current);
    }
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.25;
      knotRef.current.rotation.y += delta * 0.35;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.4;
      innerRef.current.rotation.z += delta * 0.3;
      innerRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.85, 0.24, 140, 18]} />
        <meshStandardMaterial
          ref={matRef}
          color="#6F4E37"
          emissive="#6F4E37"
          emissiveIntensity={0.9}
          metalness={0.7}
          roughness={0.2}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial ref={innerMatRef} color="#6F4E37" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.45, 0.012, 8, 90]} />
        <meshBasicMaterial color="#8B6B53" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Scene({ active }: { active: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#ffffff" />
      <pointLight position={[-3, -2, -3]} intensity={18} color="#48352C" />
      <Orb active={active} />
    </>
  );
}

/** Abstract 3D orb that reacts to the currently active service. */
export default function ServiceOrb({ active = 0 }: { active?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene active={active} />
    </Canvas>
  );
}