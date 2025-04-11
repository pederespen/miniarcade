import { Obstacle } from "../types";

/**
 * Draw a drawer obstacle
 */
export function drawDrawer(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  // Enhanced 3D drawer
  // Drawer body with gradient for depth
  const drawerGradient = ctx.createLinearGradient(
    obstacle.x,
    obstacle.y,
    obstacle.x + obstacle.width,
    obstacle.y + obstacle.height
  );
  drawerGradient.addColorStop(0, "#8B4513");
  drawerGradient.addColorStop(1, "#5D2906");

  ctx.fillStyle = drawerGradient;
  ctx.beginPath();
  ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 5);
  ctx.fill();

  // Drawer front panel with lighter wood color
  const frontGradient = ctx.createLinearGradient(
    obstacle.x + 5,
    obstacle.y + 5,
    obstacle.x + obstacle.width - 5,
    obstacle.y + obstacle.height / 2
  );
  frontGradient.addColorStop(0, "#A0522D");
  frontGradient.addColorStop(1, "#8B4513");

  ctx.fillStyle = frontGradient;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + 5,
    obstacle.y + 5,
    obstacle.width - 10,
    obstacle.height - 10,
    3
  );
  ctx.fill();

  // Drawer handle
  ctx.fillStyle = "#D4AF37";
  const handleWidth = obstacle.width * 0.15;
  const handleHeight = obstacle.height * 0.2;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width / 2 - handleWidth / 2,
    obstacle.y + obstacle.height / 2 - handleHeight / 2,
    handleWidth,
    handleHeight,
    2
  );
  ctx.fill();

  // Add drawer handle shadow
  ctx.strokeStyle = "#5D2906";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width / 2 - handleWidth / 2,
    obstacle.y + obstacle.height / 2 - handleHeight / 2,
    handleWidth,
    handleHeight,
    2
  );
  ctx.stroke();
}

/**
 * Draw a coffee mug obstacle
 */
export function drawCoffee(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  // Enhanced 3D coffee mug
  // Mug body with gradient
  const mugGradient = ctx.createLinearGradient(
    obstacle.x + obstacle.width * 0.25,
    obstacle.y,
    obstacle.x + obstacle.width * 0.75,
    obstacle.y + obstacle.height
  );
  mugGradient.addColorStop(0, "#F5F5F5");
  mugGradient.addColorStop(1, "#E0E0E0");

  // Draw mug body (cylinder)
  ctx.fillStyle = mugGradient;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width * 0.25,
    obstacle.y + obstacle.height * 0.2,
    obstacle.width * 0.5,
    obstacle.height * 0.7,
    5
  );
  ctx.fill();

  // Add black border around the mug body for better visibility
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width * 0.25,
    obstacle.y + obstacle.height * 0.2,
    obstacle.width * 0.5,
    obstacle.height * 0.7,
    5
  );
  ctx.stroke();

  // Mug handle
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width * 0.75 + 2,
    obstacle.y + obstacle.height * 0.5,
    obstacle.width * 0.16,
    -Math.PI * 0.5,
    Math.PI * 0.5,
    false
  );
  ctx.strokeStyle = "#D4D4D4";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Add black border around the handle for better visibility
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width * 0.75 + 2,
    obstacle.y + obstacle.height * 0.5,
    obstacle.width * 0.16,
    -Math.PI * 0.5,
    Math.PI * 0.5,
    false
  );
  ctx.stroke();

  // Coffee liquid
  const coffeeGradient = ctx.createLinearGradient(
    obstacle.x + obstacle.width * 0.25,
    obstacle.y + obstacle.height * 0.25,
    obstacle.x + obstacle.width * 0.75,
    obstacle.y + obstacle.height * 0.4
  );
  coffeeGradient.addColorStop(0, "#6F4E37");
  coffeeGradient.addColorStop(1, "#5D4037");

  ctx.fillStyle = coffeeGradient;
  // Slightly smaller than the mug itself
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width * 0.25 + 3,
    obstacle.y + obstacle.height * 0.25,
    obstacle.width * 0.5 - 6,
    obstacle.height * 0.15,
    3
  );
  ctx.fill();

  // Coffee steam
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 2;

  // Draw multiple steam wisps
  for (let i = 0; i < 3; i++) {
    const startX =
      obstacle.x + obstacle.width * 0.35 + i * obstacle.width * 0.15;
    const startY = obstacle.y + obstacle.height * 0.25;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    // Wavy steam pattern
    ctx.bezierCurveTo(
      startX - 5,
      startY - 10,
      startX + 5,
      startY - 20,
      startX,
      startY - 30
    );
    ctx.stroke();
  }
}

/**
 * Draw a plant obstacle
 */
export function drawPlant(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  // Enhanced 3D plant
  // Plant pot with gradient
  const potGradient = ctx.createLinearGradient(
    obstacle.x + obstacle.width / 4,
    obstacle.y + obstacle.height / 2,
    obstacle.x + (obstacle.width * 3) / 4,
    obstacle.y + obstacle.height
  );
  potGradient.addColorStop(0, "#A0522D");
  potGradient.addColorStop(1, "#8B4513");

  ctx.fillStyle = potGradient;

  // Draw pot with rounded bottom
  ctx.beginPath();
  ctx.moveTo(
    obstacle.x + obstacle.width / 4,
    obstacle.y + obstacle.height / 2 + 5
  );
  ctx.lineTo(obstacle.x + obstacle.width / 4, obstacle.y + obstacle.height - 5);
  ctx.quadraticCurveTo(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height + 5,
    obstacle.x + (obstacle.width * 3) / 4,
    obstacle.y + obstacle.height - 5
  );
  ctx.lineTo(
    obstacle.x + (obstacle.width * 3) / 4,
    obstacle.y + obstacle.height / 2 + 5
  );
  ctx.closePath();
  ctx.fill();

  // Pot rim
  ctx.fillStyle = "#D2691E";
  ctx.beginPath();
  ctx.rect(
    obstacle.x + obstacle.width / 4 - 3,
    obstacle.y + obstacle.height / 2,
    obstacle.width / 2 + 6,
    8
  );
  ctx.fill();

  // Plant foliage with gradient
  const foliageGradient = ctx.createRadialGradient(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 10,
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 2.5
  );
  foliageGradient.addColorStop(0, "#4CAF50");
  foliageGradient.addColorStop(0.7, "#2e7d32");
  foliageGradient.addColorStop(1, "#1b5e20");

  ctx.fillStyle = foliageGradient;

  // Draw multiple overlapping circles for fuller foliage
  for (let i = 0; i < 5; i++) {
    const offsetX = (Math.cos((i * Math.PI) / 2.5) * obstacle.width) / 12;
    const offsetY = (Math.sin((i * Math.PI) / 2.5) * obstacle.width) / 12;

    ctx.beginPath();
    ctx.arc(
      obstacle.x + obstacle.width / 2 + offsetX,
      obstacle.y + obstacle.height / 3 + offsetY,
      obstacle.width / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Add plant stem
  ctx.strokeStyle = "#43A047";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
  ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 3);
  ctx.stroke();
}

/**
 * Draw a monitor obstacle
 */
export function drawMonitor(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  // Enhanced 3D computer monitor
  // Monitor frame with gradient
  const frameGradient = ctx.createLinearGradient(
    obstacle.x,
    obstacle.y,
    obstacle.x + obstacle.width,
    obstacle.y + obstacle.height
  );
  frameGradient.addColorStop(0, "#424242");
  frameGradient.addColorStop(1, "#212121");

  // Draw monitor frame
  ctx.fillStyle = frameGradient;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x,
    obstacle.y,
    obstacle.width,
    obstacle.height - obstacle.height / 6,
    8
  );
  ctx.fill();

  // Monitor stand/base
  ctx.fillStyle = "#212121";
  ctx.beginPath();
  // Stand neck
  ctx.rect(
    obstacle.x + obstacle.width / 2 - obstacle.width / 16,
    obstacle.y + obstacle.height - obstacle.height / 6,
    obstacle.width / 8,
    obstacle.height / 10
  );
  // Stand base
  ctx.roundRect(
    obstacle.x + obstacle.width / 2 - obstacle.width / 8,
    obstacle.y + obstacle.height - obstacle.height / 12,
    obstacle.width / 4,
    obstacle.height / 12,
    3
  );
  ctx.fill();

  // Monitor screen
  const screenGradient = ctx.createLinearGradient(
    obstacle.x + obstacle.width / 8,
    obstacle.y + obstacle.height / 8,
    obstacle.x + obstacle.width - obstacle.width / 8,
    obstacle.y + obstacle.height - obstacle.height / 3
  );
  screenGradient.addColorStop(0, "#1e3a8a");
  screenGradient.addColorStop(1, "#0c1e4a");

  ctx.fillStyle = screenGradient;
  ctx.beginPath();
  ctx.roundRect(
    obstacle.x + obstacle.width / 8,
    obstacle.y + obstacle.height / 8,
    obstacle.width - obstacle.width / 4,
    obstacle.height - obstacle.height / 3,
    3
  );
  ctx.fill();

  // Add screen glare
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.ellipse(
    obstacle.x + obstacle.width / 3,
    obstacle.y + obstacle.height / 5,
    obstacle.width / 8,
    obstacle.height / 8,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

/**
 * Draw a fan obstacle
 */
export function drawFan(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  // Fan base/stand
  ctx.fillStyle = "#455A64";
  ctx.beginPath();
  ctx.ellipse(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height * 0.8,
    obstacle.width / 3,
    obstacle.height / 10,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Fan post
  ctx.fillStyle = "#607D8B";
  ctx.beginPath();
  ctx.rect(
    obstacle.x + obstacle.width / 2 - 5,
    obstacle.y + obstacle.height * 0.45,
    10,
    obstacle.height * 0.35
  );
  ctx.fill();

  // Fan head
  const headGradient = ctx.createRadialGradient(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 10,
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 2
  );
  headGradient.addColorStop(0, "#90A4AE");
  headGradient.addColorStop(1, "#546E7A");

  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 2.5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Fan housing details (rim)
  ctx.strokeStyle = "#455A64";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 2.5,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  // Fan center/hub
  ctx.fillStyle = "#37474F";
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 10,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Fan blades - rotating effect
  const bladeCount = 4;
  const time = Date.now() / 1000;
  const rotationSpeed = 5.0;
  const baseRotation = (time * rotationSpeed) % (Math.PI * 2);

  ctx.fillStyle = "#78909C";

  for (let i = 0; i < bladeCount; i++) {
    const angle = baseRotation + (i * Math.PI * 2) / bladeCount;
    ctx.save();
    ctx.translate(
      obstacle.x + obstacle.width / 2,
      obstacle.y + obstacle.height / 3
    );
    ctx.rotate(angle);

    // Draw blade
    ctx.beginPath();
    ctx.ellipse(
      obstacle.width / 5,
      0,
      obstacle.width / 5,
      obstacle.width / 12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  // Fan center cap
  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(
    obstacle.x + obstacle.width / 2,
    obstacle.y + obstacle.height / 3,
    obstacle.width / 20,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

/**
 * Draw an obstacle based on its type
 */
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle
): void {
  switch (obstacle.type) {
    case "drawer":
      drawDrawer(ctx, obstacle);
      break;
    case "coffee":
      drawCoffee(ctx, obstacle);
      break;
    case "plant":
      drawPlant(ctx, obstacle);
      break;
    case "monitor":
      drawMonitor(ctx, obstacle);
      break;
    case "fan":
      drawFan(ctx, obstacle);
      break;
    default:
      // Fallback for unknown types
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}
