'use client';

import { Canvas, useFrame, RootState } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useTasks } from '@hooks/useTasks';
import { Task } from 'types';
import { TaskModal } from './TaskModal';
import { Html } from '@react-three/drei';

// Utility to create a glowing star texture
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// Static ambient stars for the background
function AmbientStars({ count = 1500, scrollRef }: { count?: number; scrollRef: React.RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => createStarTexture(), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return pos;
  }, [count]);

  useFrame((state: RootState, delta: number) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0025 + (scrollRef.current || 0) * 0.0005;
      pointsRef.current.rotation.x = (scrollRef.current || 0) * 0.00025;
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

function Star({ task, onClick, scrollRef }: { task: Task; onClick: (task: Task) => void; scrollRef: React.RefObject<number> }) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const texture = useMemo(() => createStarTexture(), []);

  // State-change animation effect
  const prevCompletedRef = useRef(task.completed);
  useEffect(() => {
    if (prevCompletedRef.current !== task.completed) {
      setPulseAnimation(1);
      prevCompletedRef.current = task.completed;

      const timer = setTimeout(() => setPulseAnimation(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [task.completed]);

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

    const col = task.completed ? new THREE.Color('#10b981') : new THREE.Color('#3b82f6');

    return { position: pos, color: col };
  }, [task.id, task.completed]);

  useFrame((state: RootState) => {
    if (spriteRef.current) {
      const t = state.clock.getElapsedTime();
      const baseScale = task.completed ? 5.0 : 8.0;
      const pulse = 1 + Math.sin(t * 2 + task.id) * 0.1;
      const hoverScale = hovered ? 1.8 : 1;
      const stateChangeScale = 1 + pulseAnimation * 1.5;

      spriteRef.current.scale.setScalar(baseScale * pulse * hoverScale * stateChangeScale);

      // Interaction movement
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

function TaskGalaxy({ tasks, onTaskClick, scrollRef }: { tasks: Task[]; onTaskClick: (task: Task) => void; scrollRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

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

export function StarBackground() {
  const { tasks, filter } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(0);
  const smoothScrollRef = useRef(0);

  // Smooth scroll logic
  function ScrollManager() {
    useFrame(() => {
      smoothScrollRef.current = THREE.MathUtils.lerp(
        smoothScrollRef.current,
        scrollRef.current,
        0.05
      );
    });
    return null;
  }

  // Sync scroll position manually using wheel events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Limit speed - clamp deltaY to a maximum "velocity" per event
      const maxDelta = 100;
      const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));

      // Sensitivity factor - normal response
      scrollRef.current += clampedDelta * 0.002;
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Sync selectedTask when tasks list updates (Bug Fix)
  useEffect(() => {
    if (selectedTask) {
      const currentTask = tasks.find(t => t.id === selectedTask.id);
      if (currentTask) {
        setSelectedTask(currentTask);
      }
    }
  }, [tasks, selectedTask?.id]);

  const visibleTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'pending':
        return tasks.filter(t => !t.completed);
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 100], far: 1000 }} gl={{ antialias: true }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1.5} />
        <ScrollManager />
        <AmbientStars count={1000} scrollRef={smoothScrollRef} />
        <TaskGalaxy tasks={visibleTasks} onTaskClick={handleTaskClick} scrollRef={smoothScrollRef} />
      </Canvas>

      <TaskModal
        task={selectedTask}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
