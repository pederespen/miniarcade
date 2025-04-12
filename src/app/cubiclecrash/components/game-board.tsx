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

  // Add a key for canvas re-creation on game over -> restart
  const canvasKey = useRef(0);

  // Force canvas refresh when game state changes from over to playing
  useEffect(() => {
    if (!gameOver) {
      canvasKey.current++;
    }
  }, [gameOver]);

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

    // Hard reset the canvas on mobile for restarts
    return () => {
      if (canvas && !window.matchMedia("(hover: hover)").matches) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          // Full clear on teardown
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
  }, [boardSize.width, boardSize.height, canvasKey.current]);

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Don't attempt to draw if the board size is invalid
    if (boardSize.width <= 0 || boardSize.height <= 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Clear the canvas completely before drawing
    ctx.clearRect(0, 0, boardSize.width, boardSize.height);

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
      key={canvasKey.current} // Force re-creation of canvas element on key change
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
