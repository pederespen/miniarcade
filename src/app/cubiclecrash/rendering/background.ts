import { GameBoardSize } from "../types";

/**
 * Draws the office background for the game
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  boardSize: GameBoardSize
): void {
  // Clear canvas
  ctx.clearRect(0, 0, boardSize.width, boardSize.height);

  // Base wall color
  const wallGradient = ctx.createLinearGradient(0, 0, 0, boardSize.height);
  wallGradient.addColorStop(0, "#f5f5f5");
  wallGradient.addColorStop(1, "#e0e0e0");
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);

  // Cubicle wall texture - horizontal panels
  ctx.fillStyle = "#e8e8e8";
  for (let y = 50; y < boardSize.height; y += 100) {
    ctx.fillRect(0, y - 5, boardSize.width, 10);
  }

  // Cubicle posts - vertical supports
  ctx.fillStyle = "#d0d0d0";
  for (let x = 0; x < boardSize.width; x += 300) {
    ctx.fillRect(x - 5, 0, 10, boardSize.height);
  }

  // Add some subtle pattern
  ctx.strokeStyle = "#dedede";
  ctx.lineWidth = 1;

  // Horizontal lines - cubicle fabric texture
  for (let y = 0; y < boardSize.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(boardSize.width, y);
    ctx.stroke();
  }

  // Vertical lines - more subtle
  for (let x = 0; x < boardSize.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, boardSize.height);
    ctx.stroke();
  }

  // Add some shading around the edges to create depth
  const edgeGradient = ctx.createLinearGradient(
    0,
    0,
    boardSize.width * 0.3,
    boardSize.height * 0.3
  );
  edgeGradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
  edgeGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);
}
