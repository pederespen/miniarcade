import { GameBoardSize } from "../types";

// Background image cache for different backgrounds
const backgroundImages: Record<string, HTMLImageElement | null> = {
  default: null,
  level2: null,
  level3: null,
};

// Track the current game version to detect resets
let currentGameVersion = 0;

/**
 * Draws the office background for the game using an SVG image
 * Changes background at score thresholds:
 * - default: 0-39 points
 * - level2: 40-79 points
 * - level3: 80+ points
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  boardSize: GameBoardSize,
  score: number = 0,
  gameVersion: number = 1
): void {
  // If game version changed, reset to default background
  if (gameVersion !== currentGameVersion) {
    currentGameVersion = gameVersion;
  }

  // Clear canvas
  ctx.clearRect(0, 0, boardSize.width, boardSize.height);

  // Determine which background to use based on score
  let backgroundKey = "default";
  if (score >= 80) {
    backgroundKey = "level3";
  } else if (score >= 40) {
    backgroundKey = "level2";
  }

  // Load the background image if not already loaded
  if (!backgroundImages[backgroundKey]) {
    backgroundImages[backgroundKey] = new Image();

    // Set the appropriate source based on level
    if (backgroundKey === "level3") {
      backgroundImages[backgroundKey]!.src =
        "./cubiclecrash/background-level3.svg";
    } else if (backgroundKey === "level2") {
      backgroundImages[backgroundKey]!.src =
        "./cubiclecrash/background-level2.svg";
    } else {
      backgroundImages[backgroundKey]!.src =
        "./cubiclecrash/background-level1.svg";
    }
  }

  // Draw the background image if it's loaded
  if (backgroundImages[backgroundKey]?.complete) {
    ctx.drawImage(
      backgroundImages[backgroundKey]!,
      0,
      0,
      boardSize.width,
      boardSize.height
    );
  } else {
    // If image is not loaded yet, draw a simple background and listen for load event
    drawFallbackBackground(ctx, boardSize);
    backgroundImages[backgroundKey]!.onload = () => {
      // Redraw with the loaded image
      ctx.clearRect(0, 0, boardSize.width, boardSize.height);
      ctx.drawImage(
        backgroundImages[backgroundKey]!,
        0,
        0,
        boardSize.width,
        boardSize.height
      );
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
