'use client';

import * as THREE from 'three';
import { AmbientStarsProps } from '@/types';
import { useAmbientStars } from '@/hooks/useAmbientStars';

export function AmbientStars({ count = 1500 }: AmbientStarsProps) {
  const { pointsRef, texture, positions } = useAmbientStars(count);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        map={texture || undefined}
        transparent
        alphaTest={0.01}
        opacity={0.2}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
