import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Accent color per service (index matches SERVICES order). */
export const SERVICE_COLORS = ['#e50914', '#ff3b30', '#f07373', '#d32f2f', '#ff6b6b'];

function Orb({ active }: { active: number }) {
  const knotRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const target = useMemo(() => new THREE.Color(SERVICE_COLORS[active % SERVICE_COLORS.length]), [active]);
  const current = useMemo(() => new THREE.Color('#e50914'), []);

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
          color="#e50914"
          emissive="#e50914"
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
        <meshBasicMaterial ref={innerMatRef} color="#e50914" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.45, 0.012, 8, 90]} />
        <meshBasicMaterial color="#e83a3a" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Scene({ active }: { active: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#ffffff" />
      <pointLight position={[-3, -2, -3]} intensity={18} color="#d32f2f" />
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
