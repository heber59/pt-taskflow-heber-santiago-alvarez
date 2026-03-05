'use client';

import { useFrame, RootState } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Task, TaskGalaxyProps } from '@/types';
import { Star } from '@/components/stars/Star';

// Container for all task stars - rotates based on scroll and time
export function TaskGalaxy({ tasks, onTaskClick, scrollRef }: TaskGalaxyProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Rotate galaxy based on scroll input and steady base rotation
    useFrame((state: RootState, delta: number) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.01 + (scrollRef.current || 0) * 0.0002;
        }
    });

    return (
        <group ref={groupRef}>
            {tasks.map((task) => (
                <Star key={task.id} task={task} onClick={onTaskClick} scrollRef={scrollRef} />
            ))}
        </group>
    );
}
