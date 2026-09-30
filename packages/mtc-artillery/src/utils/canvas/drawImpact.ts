import type { Vector } from '@/components/templates/Canvas';

export default async function drawImpact(
  context: CanvasRenderingContext2D,
  target: Vector,
  impact: Vector,
  scaledDimension: number,
  markerRadius: number,
) {
  const targetX = target.x * scaledDimension;
  const targetY = target.y * scaledDimension;
  const impactX = impact.x * scaledDimension;
  const impactY = impact.y * scaledDimension;

  // dashed line showing the miss
  context.lineWidth = markerRadius / 3;
  context.strokeStyle = '#ffd24d';
  context.setLineDash([markerRadius, markerRadius / 1.5]);
  context.beginPath();
  context.moveTo(targetX, targetY);
  context.lineTo(impactX, impactY);
  context.stroke();
  context.setLineDash([]);

  // cross at the impact
  context.lineWidth = markerRadius / 2;
  context.beginPath();
  context.moveTo(impactX - markerRadius, impactY - markerRadius);
  context.lineTo(impactX + markerRadius, impactY + markerRadius);
  context.moveTo(impactX + markerRadius, impactY - markerRadius);
  context.lineTo(impactX - markerRadius, impactY + markerRadius);
  context.stroke();
}
