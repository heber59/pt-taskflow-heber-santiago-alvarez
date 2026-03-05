'use client';

import { useFrame, RootState } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Task, StarProps } from '@/types';
import { createStarTexture } from '@/components/stars/createStarTexture';

// Individual task star in the galaxy - interactive and animated
export function Star({ task, onClick, scrollRef }: StarProps) {
    const spriteRef = useRef<THREE.Sprite>(null);
    const [hovered, setHovered] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(0);
    const texture = useMemo(() => createStarTexture(), []);

    // Trigger pulse animation when task completion status changes
    const prevCompletedRef = useRef(task.completed);
    useEffect(() => {
        if (prevCompletedRef.current !== task.completed) {
            setPulseAnimation(1);
            prevCompletedRef.current = task.completed;

            const timer = setTimeout(() => setPulseAnimation(0), 1000);
            return () => clearTimeout(timer);
        }
    }, [task.completed]);

    // Calculate position from task ID (deterministic, consistent placement)
    const { position, color } = useMemo(() => {
        const seed = task.id;
        const x = (Math.sin(seed * 0.123) * 10000) % 1;
        const y = (Math.cos(seed * 0.456) * 10000) % 1;
        const z = (Math.sin(seed * 0.789 + y) * 10000) % 1;

        const pos = new THREE.Vector3(
            (x - 0.5) * 120,
            (y - 0.5) * 120,
            (z - 0.5) * 80
        );

        // Blue for pending, green for completed
        const col = task.completed ? new THREE.Color('#10b981') : new THREE.Color('#3b82f6');

        return { position: pos, color: col };
    }, [task.id, task.completed]);

    // Animation: scale pulse + hover effect + state change animation + scroll interaction
    useFrame((state: RootState) => {
        if (spriteRef.current) {
            const t = state.clock.getElapsedTime();
            const baseScale = task.completed ? 5.0 : 8.0;
            const pulse = 1 + Math.sin(t * 2 + task.id) * 0.1;
            const hoverScale = hovered ? 1.8 : 1;
            const stateChangeScale = 1 + pulseAnimation * 1.5;

            spriteRef.current.scale.setScalar(baseScale * pulse * hoverScale * stateChangeScale);

            // Scroll affects vertical position slightly
            spriteRef.current.position.y = position.y + (scrollRef.current || 0) * 0.05;
        }
    });

    return (
        <group position={position}>
            <sprite
                ref={spriteRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(task);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <spriteMaterial
                    map={texture || undefined}
                    color={color}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </sprite>
            {hovered && (
                <Html position={[0, 2, 0]} center>
                    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/40 px-4 py-2 rounded-xl shadow-[0_0_60px_rgba(255,255,255,0.1)] pointer-events-none whitespace-nowrap">
                        <p className="text-white text-base font-bold tracking-tight uppercase drop-shadow-xl">{task.todo}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}
