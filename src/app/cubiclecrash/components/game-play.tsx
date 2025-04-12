"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GamePlayProps } from "../types";
import GameBoard from "./game-board";
import useBoardSize from "../hooks/use-board-size";
import useGameLogic from "../hooks/use-game-logic";

// Set to true only during development, false for production
const DEV_MODE = false;

export default function GamePlay({
  onBoardSizeChange,
  highScore,
  setHighScore,
}: GamePlayProps) {
  // Use DEV_MODE constant instead of UI toggle
  const [debugMode] = useState(DEV_MODE);

  // Use refs to avoid re-renders that cause update depth issues
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Get board size
  const { boardSize, sizeCalculated } = useBoardSize({
    onSizeChange: onBoardSizeChange,
  });

  // Initialize the game logic
  const {
    airplane,
    obstacles,
    score,
    isPlaying,
    gameOver,
    handleJump,
    resetGame,
  } = useGameLogic({
    boardSize,
    highScore,
    setHighScore,
  });

  // Wrap resetGame to avoid React state updates during rendering
  const handleReset = useCallback(() => {
    // For mobile compatibility, focus on the container after reset
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    // Schedule the reset to happen in the next tick
    setTimeout(() => resetGame(), 0);
  }, [resetGame]);

  // Handle mobile-specific restart issues
  const forceMobileRestart = useCallback(() => {
    // For severe mobile issues, try the nuclear approach:
    if (gameOver) {
      // 1. Focus and scroll if needed
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
        window.scrollTo(0, 0);
      }

      // 2. Force a complete reset with multiple approaches
      setTimeout(() => {
        // Cancel any running animation frames globally
        if (window.requestAnimationFrame) {
          const id = window.requestAnimationFrame(() => {});
          for (let i = 0; i < id; i++) {
            window.cancelAnimationFrame(i);
          }
        }

        resetGame();
      }, 50);
    }
  }, [gameOver, resetGame]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        handleJump();
        e.preventDefault();
      }

      // Keep debug mode toggle for development but only if DEV_MODE is true
      if (DEV_MODE && (e.code === "KeyD" || e.key === "d")) {
        // No longer needed as we're not toggling debug mode
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleJump]);

  // Simple loading state - should resolve quickly with our improved useBoardSize
  if (!sizeCalculated) {
    return (
      <div className="flex flex-col items-center w-full" ref={gameContainerRef}>
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Removed buttons section entirely */}

      {/* Aspect ratio container - 4:3 ratio maintained */}
      <div
        className="relative w-full max-w-xl mt-10"
        style={{ touchAction: "none" }}
      >
        {/* Fixed aspect ratio container (4:3) using padding technique */}
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <div
            ref={gameContainerRef}
            className="absolute inset-0 flex justify-center items-center"
            tabIndex={0}
            onClick={() => {
              // Only handle clicks on desktop devices
              if (window.matchMedia("(hover: hover)").matches) {
                handleJump();
              }
            }}
            onTouchStart={() => {
              // Only handle touch on mobile devices
              // If the game is over, handle it like a reset
              if (gameOver) {
                forceMobileRestart();
              } else {
                handleJump();
              }
            }}
            style={{
              cursor: "pointer",
              touchAction: "none", // This tells the browser we'll handle all touch actions
              outline: "none", // Remove focus outline
            }}
          >
            <GameBoard
              airplane={airplane}
              obstacles={obstacles}
              boardSize={boardSize}
              score={score}
              gameOver={gameOver}
              debug={debugMode}
            />

            {/* Removed mobile debug overlay */}
          </div>

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Cubicle Crash
                </h2>
                <button
                  onClick={handleJump}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full"
                >
                  Start Flying
                </button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                  Game Over!
                </h2>
                <div className="mb-6 text-white">
                  <p className="text-xl mb-2">Score: {score}</p>
                  <p className="text-lg">High Score: {highScore}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    if (window.matchMedia("(hover: hover)").matches) {
                      // Desktop
                      handleReset();
                    } else {
                      // Mobile - use the nuclear approach
                      forceMobileRestart();
                    }
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
