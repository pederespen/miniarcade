"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GamePlayProps } from "../types";
import GameBoard from "./game-board";
import useBoardSize from "../hooks/use-board-size";
import useGameLogic from "../hooks/use-game-logic";

export default function GamePlay({
  difficulty,
  onReset,
  onBoardSizeChange,
  highScore,
  setHighScore,
}: GamePlayProps) {
  // Add debug state
  const [debugMode, setDebugMode] = useState(false);

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
    difficulty,
    boardSize,
    highScore,
    setHighScore,
  });

  // Wrap resetGame to avoid React state updates during rendering
  const handleReset = useCallback(() => {
    // Schedule the reset to happen in the next tick
    setTimeout(() => resetGame(), 0);
  }, [resetGame]);

  // Safely handle the main menu click
  const handleMainMenu = useCallback(() => {
    // Use setTimeout to avoid potential React state update conflicts
    setTimeout(() => onReset(), 0);
  }, [onReset]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        handleJump();
        e.preventDefault();
      }

      // Toggle debug mode with D key
      if (e.code === "KeyD" || e.key === "d") {
        setDebugMode((prev) => !prev);
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
      <div className="flex justify-between w-full max-w-xl">
        <button
          onClick={handleMainMenu}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Main Menu
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => setDebugMode((prev) => !prev)}
            className={`${
              debugMode
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white font-bold py-2 px-4 rounded`}
            title="Toggle debug mode (shortcut: D key)"
          >
            Debug {debugMode ? "On" : "Off"}
          </button>

          <button
            onClick={handleReset}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
          >
            Restart
          </button>
        </div>
      </div>

      <div
        className="relative w-full max-w-xl flex justify-center"
        style={{ touchAction: "manipulation" }}
      >
        <div
          ref={gameContainerRef}
          className="w-full flex justify-center"
          onClick={handleJump}
          style={{ cursor: "pointer" }}
        >
          <GameBoard
            airplane={airplane}
            obstacles={obstacles}
            boardSize={boardSize}
            score={score}
            gameOver={gameOver}
            debug={debugMode}
          />
        </div>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-center p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Paper Plane
              </h2>
              <p className="text-cyan-200 mb-6">
                Click or tap to start flying!
              </p>
              <button
                onClick={handleJump}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full"
              >
                Start Flying
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-indigo-100 space-y-2">
        <p>Click or tap the screen to make the paper airplane fly!</p>
        <p>
          Current Score: {score} | High Score: {highScore}
        </p>
        {gameOver && (
          <div className="mt-6 font-bold text-xl">
            <p className="text-cyan-400">Game Over!</p>
            <button
              onClick={handleReset}
              className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
