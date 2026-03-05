'use client';

import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { IStarProps } from '@/types';
import { useStar } from '@/hooks/useStar';

export function Star(props: IStarProps) {
  const { task, onClick, scrollRef } = props;
  const { spriteRef, hovered, texture, position, color, handlePointerOver, handlePointerOut } =
    useStar({ task, scrollRef });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
    >
      <sprite ref={spriteRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
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
          <div
            className="bg-slate-900/95 backdrop-blur-2xl border border-white/40 px-4 py-2 rounded-xl shadow-[0_0_60px_rgba(255,255,255,0.1)] whitespace-nowrap cursor-pointer"
            onClick={() => onClick(task)}
          >
            <p className="text-white text-base font-bold tracking-tight uppercase drop-shadow-xl">
              {task.todo}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
