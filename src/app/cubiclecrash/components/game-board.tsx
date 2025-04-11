"use client";

import { useRef, useEffect } from "react";
import { Airplane, GameBoardSize, Obstacle } from "../types";

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

  // Set up canvas with correct dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set the actual canvas dimensions to match the logical dimensions
    canvas.width = boardSize.width;
    canvas.height = boardSize.height;

    // Apply pixel density adjustments for high DPI screens
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const pixelRatio = window.devicePixelRatio || 1;
      if (pixelRatio > 1) {
        const displayWidth = canvas.width;
        const displayHeight = canvas.height;

        canvas.width = displayWidth * pixelRatio;
        canvas.height = displayHeight * pixelRatio;

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        ctx.scale(pixelRatio, pixelRatio);
      }
    }
  }, [boardSize.width, boardSize.height]);

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

    // Draw enhanced office background
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

    // Draw airplane
    ctx.save();
    ctx.translate(
      airplane.x + airplane.width / 2,
      airplane.y + airplane.height / 2
    );
    ctx.rotate((airplane.rotation * Math.PI) / 180);

    // Enhanced 3D paper airplane
    const planeWidth = airplane.width;
    const planeHeight = airplane.height;

    // Main body
    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // Nose tip
    ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
    ctx.lineTo(-planeWidth / 4, 0); // Middle fold
    ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
    ctx.closePath();

    // Base color - light paper color
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();

    // Add shadow for 3D effect - right wing
    const rightWingGradient = ctx.createLinearGradient(
      0,
      0,
      planeWidth / 2,
      planeHeight / 4
    );
    rightWingGradient.addColorStop(0, "rgba(180, 180, 180, 0.5)");
    rightWingGradient.addColorStop(1, "rgba(230, 230, 230, 0.2)");

    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // Nose tip
    ctx.lineTo(-planeWidth / 4, 0); // Middle fold
    ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
    ctx.closePath();
    ctx.fillStyle = rightWingGradient;
    ctx.fill();

    // Add highlight for 3D effect - left wing
    const leftWingGradient = ctx.createLinearGradient(
      0,
      0,
      -planeWidth / 3,
      -planeHeight / 3
    );
    leftWingGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    leftWingGradient.addColorStop(1, "rgba(240, 240, 240, 0.3)");

    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // Nose tip
    ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
    ctx.lineTo(-planeWidth / 4, 0); // Middle fold
    ctx.closePath();
    ctx.fillStyle = leftWingGradient;
    ctx.fill();

    // Draw folding lines
    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // From nose
    ctx.lineTo(-planeWidth / 4, 0); // To middle fold
    ctx.strokeStyle = "#aaaaaa";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bottom middle fold line
    ctx.beginPath();
    ctx.moveTo(-planeWidth / 4, 0);
    ctx.lineTo(-planeWidth / 3, planeHeight / 4);
    ctx.strokeStyle = "#aaaaaa";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Top middle fold line
    ctx.beginPath();
    ctx.moveTo(-planeWidth / 4, 0);
    ctx.lineTo(-planeWidth / 3, -planeHeight / 4);
    ctx.stroke();

    // Outline the entire plane
    ctx.beginPath();
    ctx.moveTo(planeWidth / 2, 0); // Nose tip
    ctx.lineTo(-planeWidth / 2, -planeHeight / 2); // Top left
    ctx.lineTo(-planeWidth / 4, 0); // Middle fold
    ctx.lineTo(-planeWidth / 2, planeHeight / 2); // Bottom left
    ctx.closePath();
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      switch (obstacle.type) {
        case "drawer":
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
          ctx.roundRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height,
            5
          );
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
            obstacle.height / 2 - 5,
            3
          );
          ctx.fill();

          // Drawer handle
          ctx.fillStyle = "#D4AF37";
          ctx.beginPath();
          ctx.roundRect(
            obstacle.x + obstacle.width / 2 - obstacle.width / 8,
            obstacle.y + obstacle.height / 4 - 5,
            obstacle.width / 4,
            10,
            5
          );
          ctx.fill();

          // Add wood grain texture (simple lines)
          ctx.strokeStyle = "rgba(60, 30, 15, 0.2)";
          ctx.lineWidth = 1;

          for (
            let y = obstacle.y + 15;
            y < obstacle.y + obstacle.height - 10;
            y += 8
          ) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x + 10, y);
            ctx.bezierCurveTo(
              obstacle.x + obstacle.width / 3,
              y + 3,
              obstacle.x + (obstacle.width * 2) / 3,
              y - 2,
              obstacle.x + obstacle.width - 10,
              y + 1
            );
            ctx.stroke();
          }

          // Add shadow at the bottom
          ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
          ctx.beginPath();
          ctx.rect(
            obstacle.x,
            obstacle.y + obstacle.height - 8,
            obstacle.width,
            8
          );
          ctx.fill();
          break;
        case "coffee":
          // Enhanced coffee mug with 3D effect
          // Mug body
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.ellipse(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height - obstacle.height / 6,
            obstacle.width / 2 - 2,
            obstacle.height / 6,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Create gradient for mug body
          const mugGradient = ctx.createLinearGradient(
            obstacle.x,
            obstacle.y,
            obstacle.x + obstacle.width,
            obstacle.y + obstacle.height
          );
          mugGradient.addColorStop(0, "#ffffff");
          mugGradient.addColorStop(1, "#e0e0e0");

          // Cylindrical body
          ctx.fillStyle = mugGradient;
          ctx.beginPath();
          ctx.rect(
            obstacle.x + obstacle.width / 4,
            obstacle.y + obstacle.height / 5,
            obstacle.width / 2,
            obstacle.height * 0.7
          );
          ctx.fill();

          // Coffee liquid
          const coffeeGradient = ctx.createLinearGradient(
            obstacle.x + obstacle.width / 4,
            obstacle.y + obstacle.height / 5,
            obstacle.x + (obstacle.width * 3) / 4,
            obstacle.y + obstacle.height / 3
          );
          coffeeGradient.addColorStop(0, "#6b4226");
          coffeeGradient.addColorStop(1, "#8B5A2B");

          ctx.fillStyle = coffeeGradient;
          ctx.beginPath();
          ctx.ellipse(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 5,
            obstacle.width / 4,
            obstacle.height / 12,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Mug handle
          ctx.strokeStyle = "#e0e0e0";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            obstacle.x + (obstacle.width * 3) / 4 + 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 6,
            -Math.PI / 2,
            Math.PI / 2
          );
          ctx.stroke();
          break;
        case "plant":
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
          ctx.lineTo(
            obstacle.x + obstacle.width / 4,
            obstacle.y + obstacle.height - 5
          );
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
            const offsetX =
              (Math.cos((i * Math.PI) / 2.5) * obstacle.width) / 12;
            const offsetY =
              (Math.sin((i * Math.PI) / 2.5) * obstacle.width) / 12;

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
          ctx.moveTo(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2
          );
          ctx.lineTo(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3
          );
          ctx.stroke();
          break;
        case "monitor":
          // Enhanced 3D monitor
          // Monitor base
          const baseGradient = ctx.createLinearGradient(
            obstacle.x + obstacle.width / 3,
            obstacle.y + obstacle.height - obstacle.height / 6,
            obstacle.x + (obstacle.width * 2) / 3,
            obstacle.y + obstacle.height
          );
          baseGradient.addColorStop(0, "#555555");
          baseGradient.addColorStop(1, "#333333");

          ctx.fillStyle = baseGradient;
          ctx.beginPath();
          ctx.ellipse(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height - obstacle.height / 12,
            obstacle.width / 4,
            obstacle.height / 12,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Monitor stand
          ctx.fillStyle = "#444444";
          ctx.beginPath();
          ctx.rect(
            obstacle.x + obstacle.width / 2 - obstacle.width / 16,
            obstacle.y + obstacle.height - obstacle.height / 5,
            obstacle.width / 8,
            obstacle.height / 6
          );
          ctx.fill();

          // Monitor body with 3D effect
          const monitorBodyGradient = ctx.createLinearGradient(
            obstacle.x,
            obstacle.y,
            obstacle.x + obstacle.width,
            obstacle.y + obstacle.height / 2
          );
          monitorBodyGradient.addColorStop(0, "#444444");
          monitorBodyGradient.addColorStop(1, "#222222");

          // Monitor frame
          ctx.fillStyle = monitorBodyGradient;
          ctx.beginPath();
          ctx.roundRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height - obstacle.height / 5,
            5
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
          break;
        case "fan":
          // Enhanced 3D fan
          // Fan base
          const fanBaseGradient = ctx.createLinearGradient(
            obstacle.x + obstacle.width / 4,
            obstacle.y + (obstacle.height * 3) / 4,
            obstacle.x + (obstacle.width * 3) / 4,
            obstacle.y + obstacle.height
          );
          fanBaseGradient.addColorStop(0, "#777777");
          fanBaseGradient.addColorStop(1, "#555555");

          ctx.fillStyle = fanBaseGradient;
          ctx.beginPath();
          ctx.ellipse(
            obstacle.x + obstacle.width / 2,
            obstacle.y + (obstacle.height * 7) / 8,
            obstacle.width / 4,
            obstacle.height / 8,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Fan pole
          ctx.fillStyle = "#888888";
          ctx.beginPath();
          ctx.rect(
            obstacle.x + obstacle.width / 2 - 4,
            obstacle.y + obstacle.height / 2,
            8,
            (obstacle.height * 3) / 8
          );
          ctx.fill();

          // Fan housing
          const fanHousingGradient = ctx.createRadialGradient(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 8,
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 2
          );
          fanHousingGradient.addColorStop(0, "#cccccc");
          fanHousingGradient.addColorStop(1, "#999999");

          ctx.fillStyle = fanHousingGradient;
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 3,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Fan blades
          ctx.fillStyle = "#777777";
          for (let i = 0; i < 4; i++) {
            const angle =
              (i * Math.PI) / 2 + ((Date.now() * 0.003) % (Math.PI * 2));
            const bladeLength = obstacle.width / 3.5;

            ctx.save();
            ctx.translate(
              obstacle.x + obstacle.width / 2,
              obstacle.y + obstacle.height / 3
            );
            ctx.rotate(angle);

            // Draw a blade
            ctx.beginPath();
            ctx.ellipse(
              bladeLength / 2,
              0,
              bladeLength / 2,
              bladeLength / 5,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
          }

          // Fan center
          ctx.fillStyle = "#555555";
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 12,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Fan grill
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 3,
            obstacle.width / 3 - 2,
            0,
            Math.PI * 2
          );
          ctx.stroke();

          // Fan grill spokes
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const innerRadius = obstacle.width / 6;
            const outerRadius = obstacle.width / 3 - 2;

            ctx.beginPath();
            ctx.moveTo(
              obstacle.x + obstacle.width / 2 + Math.cos(angle) * innerRadius,
              obstacle.y + obstacle.height / 3 + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
              obstacle.x + obstacle.width / 2 + Math.cos(angle) * outerRadius,
              obstacle.y + obstacle.height / 3 + Math.sin(angle) * outerRadius
            );
            ctx.stroke();
          }
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
  }, [airplane, obstacles, boardSize, score, gameOver, debug]);

  return (
    <canvas
      ref={canvasRef}
      width={boardSize.width}
      height={boardSize.height}
      className="rounded-lg shadow-lg"
      style={{
        touchAction: "none",
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        display: "block",
        margin: "auto",
      }}
    />
  );
}
