"use client";

import { useRef, useEffect, useState } from "react";
import {
  Airplane,
  GameBoardSize,
  Obstacle,
  Powerup,
  PowerupType,
} from "../types";
import {
  drawBackground,
  drawAirplane,
  drawObstacle,
  drawPowerup,
  drawDebugHitboxes,
  drawScore,
  drawDebugStats,
  drawPowerupIndicator,
} from "../rendering";

interface GameBoardProps {
  airplane: Airplane;
  obstacles: Obstacle[];
  powerups: Powerup[];
  boardSize: GameBoardSize;
  score: number;
  gameOver: boolean;
  activePowerup: PowerupType | null;
  debug?: boolean;
  debugStats?: {
    obstacleSpeed: number;
    spawnRate: number;
  };
}

export default function GameBoard({
  airplane,
  obstacles,
  powerups,
  boardSize,
  score,
  gameOver,
  activePowerup,
  debug = false,
  debugStats,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);

  // Set up canvas with correct dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set the actual canvas dimensions to match the logical dimensions
    canvas.width = boardSize.width;
    canvas.height = boardSize.height;

    // Apply pixel density adjustments for high DPI screens
    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx) {
      // Clear any previous content completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Track FPS for debug mode
    if (debug) {
      const now = performance.now();
      frameCountRef.current++;

      if (lastFrameTimeRef.current) {
        // Only update FPS calculation once per second to avoid fluctuations
        if (now - lastFpsUpdateRef.current > 1000) {
          const elapsed = now - lastFpsUpdateRef.current;
          setFps((frameCountRef.current * 1000) / elapsed);
          frameCountRef.current = 0;
          lastFpsUpdateRef.current = now;
        }
      } else {
        // First frame
        lastFpsUpdateRef.current = now;
      }

      lastFrameTimeRef.current = now;
    }

    // Clear the canvas completely before drawing
    ctx.clearRect(0, 0, boardSize.width, boardSize.height);

    // Draw background with score
    drawBackground(ctx, boardSize, score);

    // Draw powerups
    powerups.forEach((powerup) => {
      if (!powerup.collected) {
        drawPowerup(ctx, powerup);
      }
    });

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      drawObstacle(ctx, obstacle);
    });

    // Draw airplane with powerup effect if active
    drawAirplane(ctx, airplane, activePowerup);

    // Draw the score
    drawScore(ctx, score);

    // Draw powerup indicator if active
    drawPowerupIndicator(ctx, activePowerup);

    // Draw hitboxes for debugging if enabled
    if (debug) {
      drawDebugHitboxes(ctx, airplane, obstacles, powerups);

      // Draw debug stats if provided
      if (debugStats) {
        drawDebugStats(ctx, boardSize, {
          ...debugStats,
          fps,
        });
      }
    }
  }, [
    boardSize,
    airplane,
    obstacles,
    powerups,
    activePowerup,
    debug,
    debugStats,
    score,
    gameOver,
    fps,
  ]);

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
