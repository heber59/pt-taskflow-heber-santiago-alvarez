'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Stars({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      size[i] = Math.random() * 2 + 0.5;
    }
    return size;
  }, [count]);

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
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial size={1} color="#6366f1" sizeAttenuation transparent />
    </points>
  );
}

export function StarBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Canvas camera={{ position: [0, 0, 100], far: 500 }}>
        <Stars count={500} />
      </Canvas>
    </div>
  );
}
