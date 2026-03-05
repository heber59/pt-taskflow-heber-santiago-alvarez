'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollManagerProps } from '@/types';

// Smooths the rawest scroll input for frame-perfect updates
export function ScrollManager({ scrollRef, smoothScrollRef }: ScrollManagerProps) {
    useFrame(() => {
        if (smoothScrollRef.current !== undefined && scrollRef.current !== undefined) {
            smoothScrollRef.current = THREE.MathUtils.lerp(
                smoothScrollRef.current,
                scrollRef.current,
                0.05
            );
        }
    });

    return null;
}
