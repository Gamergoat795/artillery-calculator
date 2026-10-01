import type { Vector } from '@/components/templates/Canvas';

export default async function drawImpact(
  context: CanvasRenderingContext2D,
  target: Vector,
  impact: Vector,
  previousGun: Vector,
  gun: Vector,
  scaledDimension: number,
  markerRadius: number,
) {
  const scale = (vector: Vector) => [
    vector.x * scaledDimension,
    vector.y * scaledDimension,
  ];
  const [targetX, targetY] = scale(target);
  const [impactX, impactY] = scale(impact);
  const [previousGunX, previousGunY] = scale(previousGun);
  const [gunX, gunY] = scale(gun);

  context.setLineDash([markerRadius, markerRadius / 1.5]);
  context.lineWidth = markerRadius / 3;

  // the miss
  context.strokeStyle = '#ffd24d';
  context.beginPath();
  context.moveTo(targetX, targetY);
  context.lineTo(impactX, impactY);
  context.stroke();

  // how far the gun was moved, the same as the miss
  context.strokeStyle = 'rgba(82, 168, 255, 0.6)';
  context.beginPath();
  context.moveTo(previousGunX, previousGunY);
  context.lineTo(gunX, gunY);
  context.stroke();

  context.setLineDash([]);

  // where the gun was placed before
  context.beginPath();
  context.arc(previousGunX, previousGunY, markerRadius, 0, Math.PI * 2);
  context.stroke();

  // cross at the impact
  context.strokeStyle = '#ffd24d';
  context.lineWidth = markerRadius / 2;
  context.beginPath();
  context.moveTo(impactX - markerRadius, impactY - markerRadius);
  context.lineTo(impactX + markerRadius, impactY + markerRadius);
  context.moveTo(impactX + markerRadius, impactY - markerRadius);
  context.lineTo(impactX - markerRadius, impactY + markerRadius);
  context.stroke();
}
