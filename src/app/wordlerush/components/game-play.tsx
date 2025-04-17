"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "../context/game-context";
import { GamePlayProps } from "../types";
import { useGameLogic } from "../hooks/use-game-logic";
import GameBoard from "./game-board";
import Keyboard from "./keyboard";
import { DEFAULT_BOARD_SIZE } from "../constants";

export default function GamePlay({
  onBoardSizeChange,
  highScore,
  setHighScore,
}: GamePlayProps) {
  const {
    countdown,
    setCountdown,
    debugMode,
    gameVersion,
    incrementGameVersion,
  } = useGameContext();
  const [showCountdown, setShowCountdown] = useState(countdown > 0);

  // Set up the game logic
  const {
    board,
    currentRowIndex,
    currentColIndex,
    keyboardState,
    stats,
    handleKeyPress,
    resetGame,
    currentSettings,
  } = useGameLogic({
    boardSize: DEFAULT_BOARD_SIZE,
    highScore,
    setHighScore,
  });

  // Handle countdown before starting the game
  useEffect(() => {
    if (countdown <= 0) {
      setShowCountdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
      if (countdown === 1) {
        setShowCountdown(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, setCountdown]);

  // Handle board size changes
  useEffect(() => {
    onBoardSizeChange(DEFAULT_BOARD_SIZE);
  }, [onBoardSizeChange]);

  // Play again button handler
  const handlePlayAgain = () => {
    incrementGameVersion();
    resetGame();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between h-full py-4">
      {/* Countdown Overlay */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="text-6xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {stats.gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-indigo-800 rounded-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>

            <div className="mb-6">
              <div className="text-indigo-200 mb-1">Final Score</div>
              <div className="text-4xl font-bold text-cyan-400">
                {stats.score}
              </div>

              <div className="text-indigo-200 mt-4 mb-1">Words Completed</div>
              <div className="text-3xl font-bold text-white">
                {stats.wordsCompleted}
              </div>

              {stats.score > highScore && (
                <div className="mt-4 text-yellow-300 font-bold">
                  New High Score!
                </div>
              )}
            </div>

            <button
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-md transition-colors"
              onClick={handlePlayAgain}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Header */}
      <div className="w-full mb-4">
        <h1 className="text-2xl font-bold text-center text-cyan-400">
          Wordle Rush
        </h1>
        <div className="text-center text-sm text-indigo-300">
          Difficulty:{" "}
          {currentSettings.difficulty.charAt(0).toUpperCase() +
            currentSettings.difficulty.slice(1)}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-grow w-full">
        <GameBoard
          board={board}
          currentRowIndex={currentRowIndex}
          currentColIndex={currentColIndex}
          stats={stats}
          gameVersion={gameVersion}
          debug={debugMode}
        />
      </div>

      {/* Virtual Keyboard */}
      <div className="w-full mt-4">
        <Keyboard keyboardState={keyboardState} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
