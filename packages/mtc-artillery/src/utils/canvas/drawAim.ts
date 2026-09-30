import type { Vector } from '@/components/templates/Canvas';

export default async function drawAim(
  context: CanvasRenderingContext2D,
  aim: Vector,
  scaledDimension: number,
  markerRadius: number,
) {
  const aimX = aim.x * scaledDimension;
  const aimY = aim.y * scaledDimension;

  context.lineWidth = markerRadius / 3;
  context.strokeStyle = '#ff6666';
  context.beginPath();
  context.arc(aimX, aimY, markerRadius, 0, Math.PI * 2);
  context.stroke();
}
