'use client';

import { useFrame, RootState } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { AmbientStarsProps } from '@/types';
import { createStarTexture } from '@/components/stars/createStarTexture';

// Static ambient background stars - kept mostly fixed to stay on-screen
export function AmbientStars({ count = 1500 }: AmbientStarsProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const texture = useMemo(() => createStarTexture('gray'), []);

    // Generate random positions for background stars
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 800;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 800;
        }
        return pos;
    }, [count]);

    // Very slow rotation to maintain visual static without overwhelming movement
    useFrame((state: RootState, delta: number) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.0002;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    args={[positions, 3]}
                />
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
