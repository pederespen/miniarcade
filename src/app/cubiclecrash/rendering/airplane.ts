import { Airplane } from "../types";

/**
 * Draws the paper airplane with 3D effects
 */
export function drawAirplane(
  ctx: CanvasRenderingContext2D,
  airplane: Airplane
): void {
  ctx.save();
  ctx.translate(
    airplane.x + airplane.width / 2,
    airplane.y + airplane.height / 2
  );
  ctx.rotate((airplane.rotation * Math.PI) / 180);

  // Enhanced 3D paper airplane
  const planeWidth = airplane.width;
  const planeHeight = airplane.height;

  // Main body
  ctx.beginPath();
  ctx.moveTo(planeWidth / 2, 0); // Nose tip
  ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
  ctx.lineTo(-planeWidth / 4, 0); // Middle fold
  ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
  ctx.closePath();

  // Base color - light paper color
  ctx.fillStyle = "#f5f5f5";
  ctx.fill();

  // Add shadow for 3D effect - right wing
  const rightWingGradient = ctx.createLinearGradient(
    0,
    0,
    planeWidth / 2,
    planeHeight / 4
  );
  rightWingGradient.addColorStop(0, "rgba(180, 180, 180, 0.5)");
  rightWingGradient.addColorStop(1, "rgba(230, 230, 230, 0.2)");

  ctx.beginPath();
  ctx.moveTo(planeWidth / 2, 0); // Nose tip
  ctx.lineTo(-planeWidth / 4, 0); // Middle fold
  ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
  ctx.closePath();
  ctx.fillStyle = rightWingGradient;
  ctx.fill();

  // Add highlight for 3D effect - left wing
  const leftWingGradient = ctx.createLinearGradient(
    0,
    0,
    -planeWidth / 3,
    -planeHeight / 3
  );
  leftWingGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  leftWingGradient.addColorStop(1, "rgba(240, 240, 240, 0.3)");

  ctx.beginPath();
  ctx.moveTo(planeWidth / 2, 0); // Nose tip
  ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
  ctx.lineTo(-planeWidth / 4, 0); // Middle fold
  ctx.closePath();
  ctx.fillStyle = leftWingGradient;
  ctx.fill();

  // Draw folding lines
  ctx.beginPath();
  ctx.moveTo(planeWidth / 2, 0); // From nose
  ctx.lineTo(-planeWidth / 4, 0); // To middle fold
  ctx.strokeStyle = "#aaaaaa";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Bottom middle fold line
  ctx.beginPath();
  ctx.moveTo(-planeWidth / 4, 0);
  ctx.lineTo(-planeWidth / 3, planeHeight / 4);
  ctx.strokeStyle = "#aaaaaa";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Top middle fold line
  ctx.beginPath();
  ctx.moveTo(-planeWidth / 4, 0);
  ctx.lineTo(-planeWidth / 3, -planeHeight / 4);
  ctx.stroke();

  // Outline the entire plane
  ctx.beginPath();
  ctx.moveTo(planeWidth / 2, 0); // Nose tip
  ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
  ctx.lineTo(-planeWidth / 4, 0); // Middle fold
  ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
  ctx.closePath();
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
