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

  // Base wall color - slightly warmer than before
  const wallGradient = ctx.createLinearGradient(0, 0, 0, boardSize.height);
  wallGradient.addColorStop(0, "#f8f6f4");
  wallGradient.addColorStop(1, "#e5e2dd");
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, boardSize.width, boardSize.height);

  // Floor at the bottom (carpet)
  const floorHeight = boardSize.height * 0.15;
  const carpetGradient = ctx.createLinearGradient(
    0,
    boardSize.height - floorHeight,
    0,
    boardSize.height
  );
  carpetGradient.addColorStop(0, "#4a6b8a");
  carpetGradient.addColorStop(1, "#345170");
  ctx.fillStyle = carpetGradient;
  ctx.fillRect(0, boardSize.height - floorHeight, boardSize.width, floorHeight);

  // Add carpet texture/pattern
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (
    let y = boardSize.height - floorHeight + 5;
    y < boardSize.height;
    y += 8
  ) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(boardSize.width, y);
    ctx.stroke();
  }

  // Wall/floor divider (baseboard)
  ctx.fillStyle = "#d0d0d0";
  ctx.fillRect(0, boardSize.height - floorHeight - 5, boardSize.width, 5);

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

  // Add subtle wall texture
  ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
  ctx.lineWidth = 1;

  // Create a subtle grid pattern for the wall
  const gridSize = 40;
  for (let y = 0; y < boardSize.height - floorHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(boardSize.width, y);
    ctx.stroke();
  }

  for (let x = 0; x < boardSize.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, boardSize.height - floorHeight);
    ctx.stroke();
  }

  // Add some shading around the edges to create depth
  const edgeGradient = ctx.createLinearGradient(
    0,
    0,
    boardSize.width * 0.3,
    boardSize.height * 0.3
  );
  edgeGradient.addColorStop(0, "rgba(0, 0, 0, 0.2)");
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
  // Cabinet body
  const cabinetGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  cabinetGradient.addColorStop(0, "#9e9e9e");
  cabinetGradient.addColorStop(1, "#757575");

  ctx.fillStyle = cabinetGradient;
  ctx.fillRect(x, y, width, height);

  // Cabinet drawers
  const drawerHeight = height / 3;

  for (let i = 0; i < 3; i++) {
    const drawerY = y + i * drawerHeight;

    // Drawer face
    ctx.fillStyle = "#bdbdbd";
    ctx.fillRect(x + 2, drawerY + 2, width - 4, drawerHeight - 4);

    // Drawer handle
    ctx.fillStyle = "#616161";
    ctx.fillRect(x + width / 2 - 10, drawerY + drawerHeight / 2 - 3, 20, 6);
  }

  // Add shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
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
  // Bookshelf body
  const shelfGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  shelfGradient.addColorStop(0, "#8d6e63");
  shelfGradient.addColorStop(1, "#6d4c41");

  ctx.fillStyle = shelfGradient;
  ctx.fillRect(x, y, width, height);

  // Shelves
  const shelfCount = 3;
  const shelfThickness = 4;
  const shelfSpacing = height / (shelfCount + 1);

  for (let i = 1; i <= shelfCount; i++) {
    const shelfY = y + i * shelfSpacing;
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x, shelfY, width, shelfThickness);

    // Add books on each shelf
    drawBooks(ctx, x + 5, shelfY - 20, width - 10, 20);
  }

  // Add shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(x, y + height - 5, width, 5);
}

/**
 * Draws books on a shelf
 */
function drawBooks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const bookColors = [
    "#e53935",
    "#1e88e5",
    "#43a047",
    "#fdd835",
    "#8e24aa",
    "#fb8c00",
  ];
  let currentX = x;

  while (currentX < x + width - 5) {
    const bookWidth = 5 + Math.random() * 15;
    if (currentX + bookWidth > x + width) break;

    const colorIndex = Math.floor(Math.random() * bookColors.length);
    ctx.fillStyle = bookColors[colorIndex];
    ctx.fillRect(currentX, y, bookWidth, height);

    // Book spine details
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(currentX, y, 1, height);

    currentX += bookWidth;
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
  // Desk top
  const deskGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  deskGradient.addColorStop(0, "#d7ccc8");
  deskGradient.addColorStop(1, "#bcaaa4");

  ctx.fillStyle = deskGradient;
  ctx.fillRect(x, y, width, height);

  // Desk leg left
  ctx.fillStyle = "#a1887f";
  ctx.fillRect(x + 10, y + height, 10, 30);

  // Desk leg right
  ctx.fillRect(x + width - 20, y + height, 10, 30);

  // Add some desk items
  // Monitor
  ctx.fillStyle = "#424242";
  ctx.fillRect(x + 30, y - 30, 40, 25);
  ctx.fillStyle = "#212121";
  ctx.fillRect(x + 45, y - 5, 10, 5);

  // Desk pad
  ctx.fillStyle = "#78909c";
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
  // Clock face
  ctx.fillStyle = "#fafafa";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Clock outline
  ctx.strokeStyle = "#757575";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Clock hands
  // Hour hand
  ctx.strokeStyle = "#424242";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + radius * 0.5, y + radius * 0.3);
  ctx.stroke();

  // Minute hand
  ctx.lineWidth = 2;
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
  // Frame
  ctx.fillStyle = "#a1887f";
  ctx.fillRect(x - 3, y - 3, width + 6, height + 6);

  // Picture
  const pictureGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  pictureGradient.addColorStop(0, "#bbdefb");
  pictureGradient.addColorStop(0.7, "#64b5f6");
  pictureGradient.addColorStop(1, "#1976d2");

  ctx.fillStyle = pictureGradient;
  ctx.fillRect(x, y, width, height);

  // Picture details (mountains)
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
  // Window frame
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);

  // Window view (sky)
  const skyGradient = ctx.createLinearGradient(
    x + 5,
    y + 5,
    x + 5,
    y + height - 5
  );
  skyGradient.addColorStop(0, "#64b5f6");
  skyGradient.addColorStop(1, "#bbdefb");

  ctx.fillStyle = skyGradient;
  ctx.fillRect(x + 5, y + 5, width - 10, height - 10);

  // Window divisions
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(x + width / 2, y, 3, height);
  ctx.fillRect(x, y + height / 2, width, 3);

  // Clouds
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
