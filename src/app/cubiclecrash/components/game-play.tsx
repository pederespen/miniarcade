"use client";

import { useRef, useEffect, useCallback } from "react";
import { GamePlayProps } from "../types";
import GameBoard from "./game-board";
import useBoardSize from "../hooks/use-board-size";
import useGameLogic from "../hooks/use-game-logic";
import { useGameContext } from "../context/game-context";

export default function GamePlay({
  onBoardSizeChange,
  highScore,
  setHighScore,
}: GamePlayProps) {
  const {
    debugMode,
    setDebugMode,
    countdown,
    setCountdown,
    gameVersion,
    incrementGameVersion,
  } = useGameContext();
  const isDevelopment = process.env.NODE_ENV === "development";

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
    powerups,
    score,
    isPlaying,
    gameOver,
    isWarmupActive,
    activePowerup,
    handleJump,
    resetGame,
    currentSettings,
  } = useGameLogic({
    boardSize,
    highScore,
    setHighScore,
  });

  // Wrap resetGame to avoid React state updates during rendering
  const handleReset = useCallback(() => {
    // Focus on the container
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    // Increment game version to reset background
    incrementGameVersion();
    // Call resetGame directly for consistency with mobile
    resetGame();
  }, [resetGame, incrementGameVersion]);

  // Handle mobile-specific restart issues
  const forceMobileRestart = useCallback(() => {
    // For severe mobile issues, try the nuclear approach:
    if (gameOver) {
      // 1. Focus and scroll if needed
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
        // Increment game version to reset background
        incrementGameVersion();
        // 2. Direct call to resetGame
        resetGame();
      }
    }
  }, [gameOver, resetGame, incrementGameVersion]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore input during warm-up period
      if (isWarmupActive) {
        e.preventDefault();
        return;
      }

      if (e.code === "Space" || e.key === " ") {
        handleJump();
        e.preventDefault();
      }

      // Keep debug mode toggle for development but only if in development mode
      if (isDevelopment && (e.code === "KeyD" || e.key === "d")) {
        setDebugMode(!debugMode);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleJump, isDevelopment, isWarmupActive, debugMode, setDebugMode]);

  // Add countdown effect
  useEffect(() => {
    if (isPlaying && isWarmupActive) {
      setCountdown(3);
      const timer1 = setTimeout(() => setCountdown(2), 1000);
      const timer2 = setTimeout(() => setCountdown(1), 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isPlaying, isWarmupActive, setCountdown]);

  // Add non-passive touch event listeners
  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      // Add non-passive touch event listeners
      const touchStartHandler = (e: TouchEvent) => {
        // Prevent default touch behavior to avoid any browser interference
        e.preventDefault();

        // Only handle touch on mobile devices when not in warm-up mode
        // If the game is over, handle it like a reset
        if (gameOver) {
          forceMobileRestart();
        } else if (!isWarmupActive) {
          handleJump();
        }
      };

      const touchEndHandler = (e: TouchEvent) => {
        // Prevent default to avoid ghost clicks and scrolling on mobile
        e.preventDefault();
      };

      const touchCancelHandler = (e: TouchEvent) => {
        // Ensure we clean up any touch events properly
        e.preventDefault();
      };

      // Add event listeners with the non-passive option
      gameContainer.addEventListener("touchstart", touchStartHandler, {
        passive: false,
      });
      gameContainer.addEventListener("touchend", touchEndHandler, {
        passive: false,
      });
      gameContainer.addEventListener("touchcancel", touchCancelHandler, {
        passive: false,
      });

      return () => {
        // Clean up event listeners
        gameContainer.removeEventListener("touchstart", touchStartHandler);
        gameContainer.removeEventListener("touchend", touchEndHandler);
        gameContainer.removeEventListener("touchcancel", touchCancelHandler);
      };
    }
  }, [gameOver, isWarmupActive, forceMobileRestart, handleJump]);

  // Simple loading state - should resolve quickly with our improved useBoardSize
  if (!sizeCalculated) {
    return (
      <div className="flex flex-col items-center w-full" ref={gameContainerRef}>
        <div className="text-sky-600">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full space-y-4">
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
              // Only handle clicks on desktop devices when not in warm-up mode
              if (
                window.matchMedia("(hover: hover)").matches &&
                !isWarmupActive
              ) {
                handleJump();
              }
            }}
            style={{
              cursor: "pointer",
              touchAction: "none", // This tells the browser we'll handle all touch actions
              outline: "none", // Remove focus outline
              WebkitTapHighlightColor: "transparent", // Prevent tap highlight on iOS
              userSelect: "none", // Prevent text selection
            }}
          >
            <GameBoard
              airplane={airplane}
              obstacles={obstacles}
              powerups={powerups}
              boardSize={boardSize}
              score={score}
              gameOver={gameOver}
              activePowerup={activePowerup}
              gameVersion={gameVersion}
              debug={debugMode}
              debugStats={
                debugMode && currentSettings
                  ? {
                      obstacleSpeed: currentSettings.obstacleSpeed,
                      spawnRate: currentSettings.spawnRate,
                    }
                  : undefined
              }
            />

            {/* Replace warm-up indicator with countdown */}
            {isPlaying && isWarmupActive && (
              <div className="absolute top-1/3 left-0 right-0 flex justify-center">
                <div className="bg-black/70 text-white px-8 py-6 rounded-lg text-5xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* Removed mobile debug overlay */}
          </div>

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-sky-600 mb-4">
                  Cubicle Crash
                </h2>
                <button
                  onClick={handleJump}
                  className="bg-sky-600 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full"
                >
                  Start Flying
                </button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
              <div className="text-center bg-sky-950 p-6 rounded-lg border border-sky-600 shadow-lg max-w-[80%]">
                <h2 className="text-2xl font-bold text-sky-600 mb-2">
                  Game Over
                </h2>
                <div className="mb-4">
                  <p className="text-xl text-white mb-1">Score: {score}</p>
                  <p className="text-lg text-indigo-100">
                    High Score: {highScore}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-sky-600 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
