"use client";

import { useRef, useEffect } from "react";
import { Airplane, GameBoardSize, Obstacle } from "../types";
import {
  drawBackground,
  drawAirplane,
  drawObstacle,
  drawDebugHitboxes,
  drawScore,
} from "../rendering";

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

    // Draw background
    drawBackground(ctx, boardSize);

    // Draw airplane
    drawAirplane(ctx, airplane);

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      drawObstacle(ctx, obstacle);
    });

    // Draw hitboxes for debugging if enabled
    if (debug) {
      drawDebugHitboxes(ctx, airplane, obstacles);
    }

    // Draw the score
    drawScore(ctx, score);
  }, [boardSize, airplane, obstacles, debug, score, gameOver]);

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
