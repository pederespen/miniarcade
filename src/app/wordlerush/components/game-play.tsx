"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "../context/game-context";
import { GamePlayProps } from "../types";
import { useGameLogic } from "../hooks/use-game-logic";
import GameBoard from "./game-board";
import Keyboard from "./keyboard";

export default function GamePlay({ highScore, setHighScore }: GamePlayProps) {
  const { countdown, setCountdown, gameVersion, incrementGameVersion } =
    useGameContext();
  // Always set showCountdown to false to skip the countdown overlay
  const [showCountdown, setShowCountdown] = useState(false);

  // Set up the game logic
  const {
    board,
    currentRowIndex,
    currentColIndex,
    keyboardState,
    stats,
    handleKeyPress,
    resetGame,
    showInvalidWord,
    showFailedAttempt,
    failedWord,
  } = useGameLogic({
    boardSize: { width: 350, height: 420 },
    highScore,
    setHighScore,
  });

  // Handle countdown before starting the game - modified to skip countdown
  useEffect(() => {
    // Ensure countdown is 0 and showCountdown is false
    if (countdown > 0) {
      setCountdown(0);
    }
    setShowCountdown(false);
  }, [countdown, setCountdown]);

  // Play again button handler
  const handlePlayAgain = () => {
    incrementGameVersion();
    resetGame();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between h-full">
      {/* Countdown Overlay - now hidden */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="text-6xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {stats.gameOver && (
        <div className="fixed inset-0 bg-sky-950/30 backdrop-blur-sm flex items-center justify-center z-10 px-4">
          <div className="bg-sky-950 rounded-lg p-6 sm:p-8 max-w-xs sm:max-w-sm w-full text-center border border-sky-600 shadow-lg">
            <h2 className="text-3xl font-bold text-sky-600 mb-4">Game Over!</h2>

            <div className="mb-6">
              <div className="text-indigo-100 mb-1">Final Score</div>
              <div className="text-4xl font-bold text-sky-600">
                {stats.score}
              </div>

              <div className="text-indigo-100 mt-4 mb-1">Words Completed</div>
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
              className="w-full py-3 bg-sky-600 hover:bg-cyan-600 text-white font-bold rounded-md transition-colors cursor-pointer"
              onClick={handlePlayAgain}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Header */}
      <div className="w-full mb-4">
        {/* Game board space - title and difficulty removed */}
      </div>

      {/* Game Board */}
      <div className="w-full">
        <GameBoard
          board={board}
          currentRowIndex={currentRowIndex}
          currentColIndex={currentColIndex}
          stats={stats}
          gameVersion={gameVersion}
          showInvalidWord={showInvalidWord}
          showFailedAttempt={showFailedAttempt}
          failedWord={failedWord}
        />
      </div>

      {/* Virtual Keyboard */}
      <div className="w-full mt-4">
        <Keyboard keyboardState={keyboardState} onKeyPress={handleKeyPress} />
      </div>

      {/* Spacer to push content up */}
      <div className="flex-grow"></div>
    </div>
  );
}
