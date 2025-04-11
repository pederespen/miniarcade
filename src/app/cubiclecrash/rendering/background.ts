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

  // Base wall color - lighter and more muted
  const wallGradient = ctx.createLinearGradient(0, 0, 0, boardSize.height);
  wallGradient.addColorStop(0, "#faf9f7"); // Lighter
  wallGradient.addColorStop(1, "#efeae5"); // More muted
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);

  // Floor at the bottom (carpet) - more muted
  const floorHeight = boardSize.height * 0.15;
  const carpetGradient = ctx.createLinearGradient(
    0,
    boardSize.height - floorHeight,
    0,
    boardSize.height
  );
  carpetGradient.addColorStop(0, "rgba(100, 130, 160, 0.3)"); // More transparent blue
  carpetGradient.addColorStop(1, "rgba(70, 100, 130, 0.4)"); // More transparent dark blue
  ctx.fillStyle = carpetGradient;
  ctx.fillRect(0, boardSize.height - floorHeight, boardSize.width, floorHeight);

  // Add carpet texture/pattern - more subtle
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"; // Reduced opacity
  ctx.lineWidth = 0.5; // Thinner lines
  for (
    let y = boardSize.height - floorHeight + 5;
    y < boardSize.height;
    y += 10 // Increased spacing
  ) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(boardSize.width, y);
    ctx.stroke();
  }

  // Wall/floor divider (baseboard) - lighter
  ctx.fillStyle = "rgba(208, 208, 208, 0.4)"; // More transparent
  ctx.fillRect(0, boardSize.height - floorHeight - 5, boardSize.width, 5);

  // Use global alpha to make everything more faded
  ctx.globalAlpha = 0.6; // Set all elements to 60% opacity

  // Add some office background elements (distant cubicles or furniture)
  // Filing cabinet
  drawFilingCabinet(
    ctx,
    boardSize.width * 0.1,
    boardSize.height - floorHeight - 90,
    60,
    90
  );

  // Bookshelf
  drawBookshelf(
    ctx,
    boardSize.width * 0.7,
    boardSize.height - floorHeight - 120,
    100,
    120
  );

  // Desk
  drawDesk(
    ctx,
    boardSize.width * 0.3,
    boardSize.height - floorHeight - 40,
    150,
    40
  );

  // Wall decoration - clock
  drawClock(ctx, boardSize.width * 0.5, boardSize.height * 0.2, 30);

  // Wall decoration - picture frame
  drawPictureFrame(ctx, boardSize.width * 0.85, boardSize.height * 0.3, 60, 40);

  // Window with view
  drawWindow(ctx, boardSize.width * 0.15, boardSize.height * 0.2, 90, 70);

  // Reset global alpha for other game elements
  ctx.globalAlpha = 1.0;

  // Add some shading around the edges to create depth (keep this at full opacity)
  const edgeGradient = ctx.createLinearGradient(
    0,
    0,
    boardSize.width * 0.3,
    boardSize.height * 0.3
  );
  edgeGradient.addColorStop(0, "rgba(0, 0, 0, 0.1)"); // Lighter shadow
  edgeGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);
}

/**
 * Draws a filing cabinet
 */
function drawFilingCabinet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Cabinet body - more muted colors
  const cabinetGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  cabinetGradient.addColorStop(0, "#b0b0b0"); // Lighter gray
  cabinetGradient.addColorStop(1, "#909090"); // Lighter gray

  ctx.fillStyle = cabinetGradient;
  ctx.fillRect(x, y, width, height);

  // Cabinet drawers
  const drawerHeight = height / 3;

  for (let i = 0; i < 3; i++) {
    const drawerY = y + i * drawerHeight;

    // Drawer face - lighter
    ctx.fillStyle = "#c9c9c9"; // Lighter gray
    ctx.fillRect(x + 2, drawerY + 2, width - 4, drawerHeight - 4);

    // Drawer handle - lighter
    ctx.fillStyle = "#a0a0a0"; // Lighter gray
    ctx.fillRect(x + width / 2 - 10, drawerY + drawerHeight / 2 - 3, 20, 6);
  }

  // Add shadow - more subtle
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // More transparent shadow
  ctx.fillRect(x, y + height - 5, width, 5);
}

/**
 * Draws a bookshelf
 */
function drawBookshelf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Bookshelf body - more muted colors
  const shelfGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  shelfGradient.addColorStop(0, "#b0a090"); // Lighter brown
  shelfGradient.addColorStop(1, "#a08070"); // Lighter brown

  ctx.fillStyle = shelfGradient;
  ctx.fillRect(x, y, width, height);

  // Shelves
  const shelfCount = 3;
  const shelfThickness = 4;
  const shelfSpacing = height / (shelfCount + 1);

  for (let i = 1; i <= shelfCount; i++) {
    const shelfY = y + i * shelfSpacing;
    ctx.fillStyle = "#a09080"; // Lighter brown
    ctx.fillRect(x, shelfY, width, shelfThickness);

    // Add books on each shelf with fixed positioning
    drawBooksFixed(ctx, x + 5, shelfY - 20, width - 10, 20, i);
  }

  // Add shadow - more subtle
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // More transparent shadow
  ctx.fillRect(x, y + height - 5, width, 5);
}

/**
 * Draws books on a shelf with fixed positions and muted colors
 */
function drawBooksFixed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  shelfIndex: number
): void {
  // Predefined book widths and more muted colors per shelf
  const bookConfigurations = [
    // First shelf - more muted colors
    [
      { width: 12, color: "#f08080" }, // Muted red
      { width: 8, color: "#90c0e0" }, // Muted blue
      { width: 15, color: "#90c090" }, // Muted green
      { width: 10, color: "#f0e090" }, // Muted yellow
      { width: 14, color: "#c090c0" }, // Muted purple
      { width: 12, color: "#e0a080" }, // Muted orange
      { width: 9, color: "#a0b0b8" }, // Muted blue grey
    ],
    // Second shelf - more muted colors
    [
      { width: 10, color: "#e0a080" }, // Muted orange
      { width: 15, color: "#90c0e0" }, // Muted blue
      { width: 8, color: "#c090c0" }, // Muted purple
      { width: 12, color: "#90c090" }, // Muted green
      { width: 14, color: "#f08080" }, // Muted red
      { width: 10, color: "#f0e090" }, // Muted yellow
    ],
    // Third shelf - more muted colors
    [
      { width: 14, color: "#90c0e0" }, // Muted blue
      { width: 10, color: "#90c090" }, // Muted green
      { width: 12, color: "#f08080" }, // Muted red
      { width: 8, color: "#f0e090" }, // Muted yellow
      { width: 15, color: "#e0a080" }, // Muted orange
      { width: 10, color: "#c090c0" }, // Muted purple
      { width: 11, color: "#a0b0b8" }, // Muted blue grey
    ],
  ];

  // Use appropriate configuration based on shelf index (1-based)
  const books =
    bookConfigurations[(shelfIndex - 1) % bookConfigurations.length];

  let currentX = x;

  for (const book of books) {
    // Check if we still have room on the shelf
    if (currentX + book.width > x + width) break;

    // Draw the book
    ctx.fillStyle = book.color;
    ctx.fillRect(currentX, y, book.width, height);

    // Book spine details - more subtle
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // More transparent
    ctx.fillRect(currentX, y, 1, height);

    currentX += book.width + 1; // Add 1px gap between books
  }
}

/**
 * Draws a desk
 */
function drawDesk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Desk top - lighter colors
  const deskGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  deskGradient.addColorStop(0, "#e0d0c8"); // Lighter brown
  deskGradient.addColorStop(1, "#d0c0b8"); // Lighter brown

  ctx.fillStyle = deskGradient;
  ctx.fillRect(x, y, width, height);

  // Desk leg left - lighter
  ctx.fillStyle = "#c0b0a8"; // Lighter brown
  ctx.fillRect(x + 10, y + height, 10, 30);

  // Desk leg right
  ctx.fillRect(x + width - 20, y + height, 10, 30);

  // Add some desk items - lighter
  // Monitor
  ctx.fillStyle = "#808080"; // Lighter gray
  ctx.fillRect(x + 30, y - 30, 40, 25);
  ctx.fillStyle = "#606060"; // Lighter gray
  ctx.fillRect(x + 45, y - 5, 10, 5);

  // Desk pad
  ctx.fillStyle = "#a0b0b8"; // Lighter blue-gray
  ctx.fillRect(x + 80, y + 5, 40, 25);
}

/**
 * Draws a clock
 */
function drawClock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  // Clock face - unchanged but will be affected by globalAlpha
  ctx.fillStyle = "#fafafa";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Clock outline - lighter
  ctx.strokeStyle = "#a0a0a0"; // Lighter gray
  ctx.lineWidth = 1.5; // Slightly thinner
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Clock hands - lighter
  // Hour hand
  ctx.strokeStyle = "#808080"; // Lighter gray
  ctx.lineWidth = 2; // Slightly thinner
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + radius * 0.5, y + radius * 0.3);
  ctx.stroke();

  // Minute hand
  ctx.lineWidth = 1.5; // Slightly thinner
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - radius * 0.2, y - radius * 0.7);
  ctx.stroke();
}

/**
 * Draws a picture frame
 */
function drawPictureFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Frame - lighter
  ctx.fillStyle = "#c0b0a8"; // Lighter brown
  ctx.fillRect(x - 3, y - 3, width + 6, height + 6);

  // Picture - more muted colors
  const pictureGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  pictureGradient.addColorStop(0, "#d0e0f0"); // Lighter blue
  pictureGradient.addColorStop(0.7, "#a0c0e0"); // Lighter blue
  pictureGradient.addColorStop(1, "#80a0d0"); // Lighter blue

  ctx.fillStyle = pictureGradient;
  ctx.fillRect(x, y, width, height);

  // Picture details (mountains) - unchanged but will be affected by globalAlpha
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.2, y + height * 0.6);
  ctx.lineTo(x + width * 0.35, y + height * 0.3);
  ctx.lineTo(x + width * 0.5, y + height * 0.5);
  ctx.lineTo(x + width * 0.7, y + height * 0.2);
  ctx.lineTo(x + width * 0.9, y + height * 0.5);
  ctx.lineTo(x + width, y + height * 0.7);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + height * 0.7);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws a window
 */
function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Window frame - unchanged but will be affected by globalAlpha
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);

  // Window view (sky) - more muted colors
  const skyGradient = ctx.createLinearGradient(
    x + 5,
    y + 5,
    x + 5,
    y + height - 5
  );
  skyGradient.addColorStop(0, "#a0c8f0"); // Lighter blue
  skyGradient.addColorStop(1, "#d0e0f0"); // Lighter blue

  ctx.fillStyle = skyGradient;
  ctx.fillRect(x + 5, y + 5, width - 10, height - 10);

  // Window divisions - lighter
  ctx.fillStyle = "#e8e8e8"; // Lighter gray
  ctx.fillRect(x + width / 2, y, 3, height);
  ctx.fillRect(x, y + height / 2, width, 3);

  // Clouds - unchanged but will be affected by globalAlpha
  ctx.fillStyle = "#ffffff";
  // Cloud 1
  ctx.beginPath();
  ctx.arc(x + 20, y + 15, 8, 0, Math.PI * 2);
  ctx.arc(x + 30, y + 12, 10, 0, Math.PI * 2);
  ctx.arc(x + 40, y + 15, 8, 0, Math.PI * 2);
  ctx.fill();

  // Cloud 2
  ctx.beginPath();
  ctx.arc(x + width - 30, y + 25, 10, 0, Math.PI * 2);
  ctx.arc(x + width - 20, y + 20, 8, 0, Math.PI * 2);
  ctx.arc(x + width - 40, y + 22, 7, 0, Math.PI * 2);
  ctx.fill();
}
