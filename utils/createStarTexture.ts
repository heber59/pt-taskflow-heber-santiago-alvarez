import * as THREE from 'three';

// Creates a glowing star texture using canvas gradient
export function createStarTexture(color: string = 'white'): THREE.CanvasTexture | null {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (color === 'gray') {
    gradient.addColorStop(0, 'rgba(156, 163, 175, 1)'); // light gray
    gradient.addColorStop(0.2, 'rgba(156, 163, 175, 0.8)');
    gradient.addColorStop(0.5, 'rgba(156, 163, 175, 0.3)');
    gradient.addColorStop(1, 'rgba(156, 163, 175, 0)');
  } else {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}
