"use client";

import { useRef, useEffect } from "react";
import { Airplane, Obstacle, GameBoardSize } from "../types";

interface GameBoardProps {
  airplane: Airplane;
  obstacles: Obstacle[];
  boardSize: GameBoardSize;
  score: number;
  gameOver: boolean;
  debug?: boolean;
}

export default function GameBoard({
  airplane,
  obstacles,
  boardSize,
  score,
  gameOver,
  debug = false,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Don't attempt to draw if the board size is invalid
    if (boardSize.width <= 0 || boardSize.height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, boardSize.width, boardSize.height);

    // Draw background (office wall)
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, boardSize.width, boardSize.height);

    // Draw grid lines
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    // Grid lines
    for (let y = 0; y < boardSize.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(boardSize.width, y);
      ctx.stroke();
    }

    for (let x = 0; x < boardSize.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, boardSize.height);
      ctx.stroke();
    }

    // Draw airplane
    ctx.fillStyle = "#3b82f6";
    ctx.save();
    ctx.translate(
      airplane.x + airplane.width / 2,
      airplane.y + airplane.height / 2
    );
    ctx.rotate((airplane.rotation * Math.PI) / 180);

    // Paper airplane shape
    ctx.beginPath();
    ctx.moveTo(airplane.width / 2, 0);
    ctx.lineTo(-airplane.width / 2, -airplane.height / 2);
    ctx.lineTo(-airplane.width / 4, 0);
    ctx.lineTo(-airplane.width / 2, airplane.height / 2);
    ctx.closePath();
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      switch (obstacle.type) {
        case "drawer":
          // Brown drawer
          ctx.fillStyle = "#8B4513";
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.fillStyle = "#A0522D";
          ctx.fillRect(
            obstacle.x + 5,
            obstacle.y + 5,
            obstacle.width - 10,
            obstacle.height / 2 - 5
          );
          break;
        case "coffee":
          // Coffee mug
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.fillStyle = "#6b4226";
          ctx.fillRect(
            obstacle.x + 10,
            obstacle.y + 10,
            obstacle.width - 20,
            obstacle.height - 20
          );
          break;
        case "plant":
          // Plant
          ctx.fillStyle = "#8B4513";
          ctx.fillRect(
            obstacle.x + obstacle.width / 4,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2,
            obstacle.height / 2
          );
          ctx.fillStyle = "#2e7d32";
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 3,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;
        case "monitor":
          // Monitor
          ctx.fillStyle = "#333333";
          ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height - 10
          );
          ctx.fillStyle = "#111111";
          ctx.fillRect(
            obstacle.x + 5,
            obstacle.y + 5,
            obstacle.width - 10,
            obstacle.height - 20
          );
          break;
        case "fan":
          // Fan
          ctx.fillStyle = "#aaaaaa";
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2 - 5,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;
        default:
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });

    // Draw hitboxes for debugging if enabled
    if (debug) {
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
      const rotatePoint = (point: { x: number; y: number }) => {
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

      // Draw obstacle hitboxes
      obstacles.forEach((obstacle) => {
        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
        ctx.lineWidth = 2;

        switch (obstacle.type) {
          case "fan":
            // Draw circular hitbox for fan
            const radius = obstacle.width * 0.37; // Matching collision detection
            const center = {
              x: obstacle.x + obstacle.width / 2,
              y: obstacle.y + obstacle.height / 2,
            };

            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;

          case "plant":
            // Draw pot hitbox (rectangle)
            const pot = {
              x: obstacle.x + obstacle.width * 0.25,
              y: obstacle.y + obstacle.height * 0.5,
              width: obstacle.width * 0.5,
              height: obstacle.height * 0.5,
            };

            ctx.strokeRect(pot.x, pot.y, pot.width, pot.height);

            // Draw foliage hitbox (circle)
            const foliage = {
              x: obstacle.x + obstacle.width * 0.5,
              y: obstacle.y + obstacle.height * 0.3,
              radius: obstacle.width * 0.35, // Matching collision detection
            };

            ctx.beginPath();
            ctx.arc(foliage.x, foliage.y, foliage.radius, 0, Math.PI * 2);
            ctx.stroke();
            break;

          default:
            // For other obstacles, use the helper to get the hitbox
            const getObstacleHitbox = (obstacle: Obstacle) => {
              switch (obstacle.type) {
                case "drawer":
                  return {
                    x: obstacle.x + obstacle.width * 0.05,
                    y: obstacle.y + obstacle.height * 0.25,
                    width: obstacle.width * 0.9,
                    height: obstacle.height * 0.5,
                  };

                case "coffee":
                  return {
                    x: obstacle.x + obstacle.width * 0.2,
                    y: obstacle.y + obstacle.height * 0.2,
                    width: obstacle.width * 0.6,
                    height: obstacle.height * 0.6,
                  };

                case "monitor":
                  return {
                    x: obstacle.x + obstacle.width * 0.1,
                    y: obstacle.y + obstacle.height * 0.1,
                    width: obstacle.width * 0.8,
                    height: obstacle.height * 0.7,
                  };

                default:
                  return {
                    x: obstacle.x + obstacle.width * 0.1,
                    y: obstacle.y + obstacle.height * 0.1,
                    width: obstacle.width * 0.8,
                    height: obstacle.height * 0.8,
                  };
              }
            };

            const hitbox = getObstacleHitbox(obstacle);
            ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        }
      });
    }

    // Draw score
    ctx.fillStyle = "#111827";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 20, 40);

    // Draw game over
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, boardSize.width, boardSize.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", boardSize.width / 2, boardSize.height / 2 - 20);

      ctx.font = "bold 30px sans-serif";
      ctx.fillText(
        `Score: ${score}`,
        boardSize.width / 2,
        boardSize.height / 2 + 30
      );
    }
  }, [airplane, obstacles, boardSize, score, gameOver, debug]);

  return (
    <canvas
      ref={canvasRef}
      width={boardSize.width}
      height={boardSize.height}
      className="border border-indigo-700 rounded-lg shadow-lg"
    />
  );
}
