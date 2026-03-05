import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, RootState } from '@react-three/fiber';
import { IUseStar } from '@/types';
import { createStarTexture } from '@/utils/createStarTexture';

const useStar = (props: IUseStar) => {
  const { task, scrollRef } = props;
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const texture = useMemo(() => createStarTexture(), []);

  const prevCompletedRef = useRef(task.completed);
  useEffect(() => {
    if (prevCompletedRef.current !== task.completed) {
      setPulseAnimation(1);
      prevCompletedRef.current = task.completed;

      const timer = setTimeout(() => setPulseAnimation(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [task.completed]);

  const isRecentlyCreated = useMemo(() => {
    if (!task.localId) return false;
    const createdAt = parseInt(task.localId.replace('local_', ''));
    return Date.now() - createdAt < 3000;
  }, [task.localId]);

  useEffect(() => {
    if (!isRecentlyCreated) return;
    setPulseAnimation(1);
    const timer = setTimeout(() => setPulseAnimation(0), 2000);
    return () => clearTimeout(timer);
  }, []);

  const { position, color } = useMemo(() => {
    const seed = task.id;
    const x = (Math.sin(seed * 0.123) * 10000) % 1;
    const y = (Math.cos(seed * 0.456) * 10000) % 1;
    const z = (Math.sin(seed * 0.789 + y) * 10000) % 1;

    const pos = new THREE.Vector3((x - 0.5) * 100, (y - 0.5) * 50 + 20, (z - 0.5) * 20);

    const col = task.completed ? new THREE.Color('#10b981') : new THREE.Color('#3b82f6');

    return { position: pos, color: col };
  }, [task.id, task.completed]);

  useFrame((state: RootState) => {
    if (spriteRef.current) {
      const time = state.clock.getElapsedTime();
      const baseScale = task.completed ? 5.0 : 8.0;
      const pulse = 1 + Math.sin(time * 2 + task.id) * 0.1;
      const hoverScale = hovered ? 1.8 : 1;

      let burstScale = 1;
      if (pulseAnimation > 0) {
        const progress = (time % 2) / 2;
        burstScale = 1 + Math.sin(progress * Math.PI) * 2;
      }

      spriteRef.current.scale.setScalar(baseScale * pulse * hoverScale * burstScale);
      spriteRef.current.position.y = (scrollRef.current || 0) * 0.05;
    }
  });

  const handlePointerOver = (e: THREE.Event) => {
    (e as unknown as { stopPropagation: () => void }).stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return {
    spriteRef,
    hovered,
    texture,
    position,
    color,
    handlePointerOver,
    handlePointerOut,
  };
};

export { useStar };
