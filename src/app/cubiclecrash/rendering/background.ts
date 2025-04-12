import { GameBoardSize } from "../types";

// Background image cache
let backgroundImage: HTMLImageElement | null = null;

/**
 * Draws the office background for the game using an SVG image
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  boardSize: GameBoardSize
): void {
  // Clear canvas
  ctx.clearRect(0, 0, boardSize.width, boardSize.height);

  // Load the background image if not already loaded
  if (!backgroundImage) {
    backgroundImage = new Image();
    backgroundImage.src = "/images/cubiclecrash-background.svg";
  }

  // Draw the background image if it's loaded
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, boardSize.width, boardSize.height);
  } else {
    // If image is not loaded yet, draw a simple background and listen for load event
    drawFallbackBackground(ctx, boardSize);
    backgroundImage.onload = () => {
      // Redraw with the loaded image
      ctx.clearRect(0, 0, boardSize.width, boardSize.height);
      ctx.drawImage(backgroundImage!, 0, 0, boardSize.width, boardSize.height);
    };
  }
}

/**
 * Draws a simple fallback background in case the image hasn't loaded yet
 */
function drawFallbackBackground(
  ctx: CanvasRenderingContext2D,
  boardSize: GameBoardSize
): void {
  // Simple wall and floor
  ctx.fillStyle = "#efeae5";
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);

  // Floor
  ctx.fillStyle = "rgba(100, 130, 160, 0.3)";
  const floorHeight = boardSize.height * 0.15;
  ctx.fillRect(0, boardSize.height - floorHeight, boardSize.width, floorHeight);
}
