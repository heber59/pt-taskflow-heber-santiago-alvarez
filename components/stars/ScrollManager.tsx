'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { IScrollManagerProps } from '@/types';

// Smooths the rawest scroll input for frame-perfect updates
export function ScrollManager(props: IScrollManagerProps) {
  const { scrollRef, smoothScrollRef } = props;
  useFrame(() => {
    if (smoothScrollRef.current !== undefined && scrollRef.current !== undefined) {
      smoothScrollRef.current = THREE.MathUtils.lerp(
        smoothScrollRef.current,
        scrollRef.current,
        0.05
      );

      scrollRef.current *= 0.95;

      if (Math.abs(scrollRef.current) < 0.0001) {
        scrollRef.current = 0;
      }
    }
  });

  return null;
}
