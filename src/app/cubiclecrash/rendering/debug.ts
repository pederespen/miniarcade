import { Airplane, Obstacle, Powerup } from "../types";

interface Point {
  x: number;
  y: number;
}

/**
 * Draw hitboxes for the airplane and obstacles when debug mode is enabled
 */
export function drawDebugHitboxes(
  ctx: CanvasRenderingContext2D,
  airplane: Airplane,
  obstacles: Obstacle[],
  powerups: Powerup[] = []
): void {
  // Define the actual shape of the paper airplane as a triangle with 3 points
  const planeCenter = {
    x: airplane.x + airplane.width / 2,
    y: airplane.y + airplane.height / 2,
  };

  // Calculate the rotated triangle points of the paper airplane
  const angleRad = (airplane.rotation * Math.PI) / 180;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  // Define the triangle points relative to center - matching the collision detection
  const rightTip = {
    x: airplane.width * 0.45, // Slightly larger tip
    y: 0,
  };

  const topLeft = {
    x: -airplane.width * 0.45, // Slightly larger left edge
    y: -airplane.height * 0.45, // Slightly larger top edge
  };

  const bottomLeft = {
    x: -airplane.width * 0.45, // Slightly larger left edge
    y: airplane.height * 0.45, // Slightly larger bottom edge
  };

  // Rotate the points based on plane rotation
  const rotatePoint = (point: { x: number; y: number }): Point => {
    return {
      x: planeCenter.x + (point.x * cosAngle - point.y * sinAngle),
      y: planeCenter.y + (point.x * sinAngle + point.y * cosAngle),
    };
  };

  // Get actual points after rotation
  const p1 = rotatePoint(rightTip);
  const p2 = rotatePoint(topLeft);
  const p3 = rotatePoint(bottomLeft);

  // Draw airplane hitbox as a triangle
  ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.stroke();

  // Draw interior fold line for hitbox visualization
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(planeCenter.x, planeCenter.y);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw obstacle hitboxes
  obstacles.forEach((obstacle) => {
    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
    ctx.lineWidth = 2;

    switch (obstacle.type) {
      case "fan": {
        // Draw circular hitbox for fan
        const radius = obstacle.width * 0.37;
        const center = {
          x: obstacle.x + obstacle.width / 2,
          y: obstacle.y + obstacle.height / 3,
        };

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case "plant": {
        // Draw pot hitbox (rectangle)
        const pot = {
          x: obstacle.x + obstacle.width / 4,
          y: obstacle.y + obstacle.height / 2 + 5,
          width: obstacle.width / 2,
          height: obstacle.height / 2 - 5,
        };

        ctx.strokeRect(pot.x, pot.y, pot.width, pot.height);

        // Draw foliage hitbox (circle) - covers all the overlapping foliage circles
        const foliage = {
          x: obstacle.x + obstacle.width / 2,
          y: obstacle.y + obstacle.height / 3,
          radius: obstacle.width * 0.25,
        };

        ctx.beginPath();
        ctx.arc(foliage.x, foliage.y, foliage.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case "coffee": {
        // Draw mug body hitbox
        const mugBody = {
          x: obstacle.x + obstacle.width * 0.25 - 2,
          y: obstacle.y + obstacle.height * 0.2,
          width: obstacle.width * 0.5 + 4,
          height: obstacle.height * 0.7,
        };

        ctx.strokeRect(mugBody.x, mugBody.y, mugBody.width, mugBody.height);

        // Draw handle hitbox
        const handle = {
          x: obstacle.x + obstacle.width * 0.75 + 2,
          y: obstacle.y + obstacle.height * 0.5,
          radius: obstacle.width * 0.16,
        };

        ctx.beginPath();
        ctx.arc(handle.x, handle.y, handle.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case "monitor": {
        // Draw screen hitbox (main part)
        const screen = {
          x: obstacle.x + obstacle.width * 0.125,
          y: obstacle.y + obstacle.height * 0.125,
          width: obstacle.width * 0.75,
          height: obstacle.height * 0.7,
        };

        ctx.strokeRect(screen.x, screen.y, screen.width, screen.height);

        // Draw monitor stand
        const stand = {
          x: obstacle.x + obstacle.width * 0.5 - obstacle.width * 0.0625,
          y: obstacle.y + obstacle.height * 0.8,
          width: obstacle.width * 0.125,
          height: obstacle.height * 0.17,
        };

        ctx.strokeRect(stand.x, stand.y, stand.width, stand.height);
        break;
      }

      default: {
        // Default rectangular hitbox
        ctx.strokeRect(
          obstacle.x + obstacle.width * 0.1,
          obstacle.y + obstacle.height * 0.1,
          obstacle.width * 0.8,
          obstacle.height * 0.8
        );
        break;
      }
    }
  });

  // Draw powerup hitboxes
  powerups.forEach((powerup) => {
    if (powerup.collected) return;

    // Draw circular hitbox for powerups (purple color to distinguish from obstacles)
    ctx.strokeStyle = "rgba(255, 0, 255, 0.8)"; // Purple color
    ctx.lineWidth = 2;

    const centerX = powerup.x + powerup.width / 2;
    const centerY = powerup.y + powerup.height / 2;
    const radius = powerup.width / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Add a label for the powerup type
    ctx.fillStyle = "rgba(255, 0, 255, 0.8)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      powerup.type === "DOUBLE_POINTS" ? "2X" : "INV",
      centerX,
      centerY - radius - 5
    );
  });
}

/**
 * Draw debug statistics in the bottom left corner
 */
export function drawDebugStats(
  ctx: CanvasRenderingContext2D,
  boardSize: { width: number; height: number },
  stats: {
    obstacleSpeed: number;
    spawnRate: number;
    fps?: number;
    activeDebugFeatures?: string[];
  }
): void {
  const { obstacleSpeed, spawnRate, fps } = stats;

  // Reduce height with smaller line spacing and less padding
  const lineHeight = 16;
  const padding = 8;
  // Calculate box height - remove feature height calculation
  const boxHeight = lineHeight * 3 + padding * 2;

  // Draw semi-transparent background
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, boardSize.height - boxHeight - 5, 180, boxHeight);

  // Set text style
  ctx.fillStyle = "rgba(0, 255, 0, 0.9)";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";

  // Display stats
  const y = boardSize.height - boxHeight + padding;

  // Original three-line format with smaller spacing
  ctx.fillText(`Speed: ${obstacleSpeed.toFixed(2)}`, 20, y);
  ctx.fillText(`Spawn Rate: ${spawnRate.toFixed(0)} ms`, 20, y + lineHeight);

  if (fps !== undefined) {
    ctx.fillText(`FPS: ${Math.round(fps)}`, 20, y + lineHeight * 2);
  }

  // Remove the active debug features display section
}
