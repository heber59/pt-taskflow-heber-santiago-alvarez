'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface TaskCubeProps {
  completed: boolean;
  isDeleting: boolean;
}

function Cube({ completed, isDeleting }: TaskCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  useEffect(() => {
    if (materialRef.current) {
      const targetColor = completed ? 0x22c55e : 0x9ca3af; // green or gray
      const startColor = materialRef.current.color.getHex();
      const startTime = Date.now();
      const duration = 600;

      const animate = () => {
        if (!materialRef.current) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const r1 = (startColor >> 16) & 255;
        const g1 = (startColor >> 8) & 255;
        const b1 = startColor & 255;

        const r2 = (targetColor >> 16) & 255;
        const g2 = (targetColor >> 8) & 255;
        const b2 = targetColor & 255;

        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);

        materialRef.current.color.setHex((r << 16) | (g << 8) | b);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [completed]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;

    // Dissolve effect when deleting
    if (isDeleting && materialRef.current) {
      const t = (clock.getElapsedTime() * 2) % 1;
      materialRef.current.opacity = Math.max(0, 1 - t);
    }
  });

  const initialColor = completed ? 0x22c55e : 0x9ca3af;

  return (
    <mesh ref={meshRef} scale={[0.8, 0.8, 0.8]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial
        ref={materialRef}
        color={initialColor}
        emissive={initialColor}
        emissiveIntensity={0.3}
        transparent={isDeleting}
        opacity={isDeleting ? 0 : 1}
      />
    </mesh>
  );
}

export default function TaskCube({ completed, isDeleting }: TaskCubeProps) {
  return (
    <Canvas className="w-full h-full" style={{ background: 'transparent' }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Cube completed={completed} isDeleting={isDeleting} />
      <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
