export * from "./background";
export * from "./airplane";
export * from "./obstacles";
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
