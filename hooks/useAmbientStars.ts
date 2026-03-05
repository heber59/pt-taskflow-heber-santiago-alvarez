import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, RootState } from '@react-three/fiber';
import { createStarTexture } from '@/utils/createStarTexture';
import { IuseAmbientStars } from '@/types';

const useAmbientStars = (props: IuseAmbientStars) => {
  const { count } = props;
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => createStarTexture('gray'), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return pos;
  }, [count]);

  useFrame((_state: RootState, delta: number) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0002;
    }
  });

  return { pointsRef, texture, positions };
};

export { useAmbientStars };
