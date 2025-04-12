import { Powerup, PowerupType } from "../types";

/**
 * Draw a double points powerup (gold orb)
 */
export function drawDoublePointsPowerup(
  ctx: CanvasRenderingContext2D,
  powerup: Powerup
): void {
  const centerX = powerup.x + powerup.width / 2;
  const centerY = powerup.y + powerup.height / 2;
  const radius = powerup.width / 2;

  // Gold orb with gradient
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.3,
    centerY - radius * 0.3,
    radius * 0.1,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, "#FFF9C4");
  gradient.addColorStop(0.7, "#FFC107");
  gradient.addColorStop(1, "#FF8F00");

  // Draw the orb
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw a "2x" symbol in the center
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${radius * 0.8}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("2×", centerX, centerY);

  // Add a pulsing glow effect
  const glowSize = radius * 1.2;
  const glowOpacity = 0.3 + 0.1 * Math.sin(Date.now() / 200);

  ctx.fillStyle = `rgba(255, 215, 0, ${glowOpacity})`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw an invincibility powerup (shield orb)
 */
export function drawInvincibilityPowerup(
  ctx: CanvasRenderingContext2D,
  powerup: Powerup
): void {
  const centerX = powerup.x + powerup.width / 2;
  const centerY = powerup.y + powerup.height / 2;
  const radius = powerup.width / 2;

  // Blue shield orb with gradient
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.3,
    centerY - radius * 0.3,
    radius * 0.1,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, "#E3F2FD");
  gradient.addColorStop(0.7, "#2196F3");
  gradient.addColorStop(1, "#1565C0");

  // Draw the orb
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw a shield symbol in the center
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = radius * 0.15;

  // Shield outline
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.6, Math.PI * 0.9, Math.PI * 0.1, true);
  ctx.stroke();

  // Shield center line
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius * 0.5);
  ctx.lineTo(centerX, centerY + radius * 0.3);
  ctx.stroke();

  // Add a pulsing glow effect
  const glowSize = radius * 1.2;
  const glowOpacity = 0.3 + 0.1 * Math.sin(Date.now() / 200);

  ctx.fillStyle = `rgba(33, 150, 243, ${glowOpacity})`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw a powerup based on its type
 */
export function drawPowerup(
  ctx: CanvasRenderingContext2D,
  powerup: Powerup
): void {
  switch (powerup.type) {
    case PowerupType.DOUBLE_POINTS:
      drawDoublePointsPowerup(ctx, powerup);
      break;
    case PowerupType.INVINCIBILITY:
      drawInvincibilityPowerup(ctx, powerup);
      break;
    default:
      // Fallback for unknown powerup types
      const centerX = powerup.x + powerup.width / 2;
      const centerY = powerup.y + powerup.height / 2;
      const radius = powerup.width / 2;

      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}
