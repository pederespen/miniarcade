export * from "./background";
export * from "./airplane";
export * from "./obstacles";
export * from "./powerups";
export * from "./debug";

/**
 * Draw the score display
 */
export function drawScore(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.fillStyle = "#111827";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

/**
 * Draw the active powerup indicator
 */
import { PowerupType } from "../types";

export function drawPowerupIndicator(
  ctx: CanvasRenderingContext2D,
  activePowerup: PowerupType | null
): void {
  if (!activePowerup) return;

  const indicatorText =
    activePowerup === PowerupType.DOUBLE_POINTS
      ? "DOUBLE POINTS"
      : "INVINCIBLE";

  const indicatorColor =
    activePowerup === PowerupType.DOUBLE_POINTS ? "#FFC107" : "#2196F3";

  // Position below the score
  ctx.save();

  // Use a smaller font size than score
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Position at same x-position as score but below it
  const textX = 20;
  const textY = 50;

  // Draw text with glow effect
  ctx.shadowColor = indicatorColor;
  ctx.shadowBlur = 8;
  ctx.fillStyle = indicatorColor;
  ctx.fillText(indicatorText, textX, textY);

  ctx.restore();
}
