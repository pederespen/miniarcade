import { Airplane, PowerupType } from "../types";

/**
 * Draws the paper airplane with 3D effects
 */
export function drawAirplane(
  ctx: CanvasRenderingContext2D,
  airplane: Airplane,
  activePowerup: PowerupType | null = null
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

  // Base color - modified based on powerup
  let baseColor, rightWingColors, leftWingColors, outlineColor;

  if (activePowerup === PowerupType.DOUBLE_POINTS) {
    // Gold/yellow theme for double points
    baseColor = "#FFF9C4";
    rightWingColors = {
      start: "rgba(255, 193, 7, 0.7)",
      end: "rgba(255, 235, 59, 0.3)",
    };
    leftWingColors = {
      start: "rgba(255, 255, 255, 0.8)",
      end: "rgba(255, 235, 59, 0.4)",
    };
    outlineColor = "#FF8F00";
  } else if (activePowerup === PowerupType.INVINCIBILITY) {
    // Blue shield theme for invincibility
    baseColor = "#E3F2FD";
    rightWingColors = {
      start: "rgba(33, 150, 243, 0.7)",
      end: "rgba(144, 202, 249, 0.3)",
    };
    leftWingColors = {
      start: "rgba(255, 255, 255, 0.8)",
      end: "rgba(144, 202, 249, 0.4)",
    };
    outlineColor = "#1565C0";
  } else {
    // Default colors
    baseColor = "#f5f5f5";
    rightWingColors = {
      start: "rgba(180, 180, 180, 0.5)",
      end: "rgba(230, 230, 230, 0.2)",
    };
    leftWingColors = {
      start: "rgba(255, 255, 255, 0.8)",
      end: "rgba(240, 240, 240, 0.3)",
    };
    outlineColor = "#6b7280";
  }

  // Fill with base color
  ctx.fillStyle = baseColor;
  ctx.fill();

  // Add shadow for 3D effect - right wing
  const rightWingGradient = ctx.createLinearGradient(
    0,
    0,
    planeWidth / 2,
    planeHeight / 4
  );
  rightWingGradient.addColorStop(0, rightWingColors.start);
  rightWingGradient.addColorStop(1, rightWingColors.end);

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
  leftWingGradient.addColorStop(0, leftWingColors.start);
  leftWingGradient.addColorStop(1, leftWingColors.end);

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
  ctx.lineTo(-planeWidth / 4, 0);
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
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Add powerup effect if active
  if (activePowerup) {
    // Outer glow effect with powerup color
    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // Nose tip
    ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
    ctx.lineTo(-planeWidth / 4, 0); // Middle fold
    ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
    ctx.closePath();

    const glowColor =
      activePowerup === PowerupType.DOUBLE_POINTS
        ? "rgba(255, 215, 0, 0.3)"
        : "rgba(33, 150, 243, 0.3)";

    ctx.shadowColor =
      activePowerup === PowerupType.DOUBLE_POINTS ? "#FFC107" : "#2196F3";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
