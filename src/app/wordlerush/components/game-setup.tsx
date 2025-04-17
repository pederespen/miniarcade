"use client";

import { useState } from "react";
import { GameDifficulty } from "../types";
import { useGameContext } from "../context/game-context";

export default function GameSetup() {
  const { setGameStarted, setCountdown } = useGameContext();
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>(
    GameDifficulty.MEDIUM
  );

  const handleStartGame = () => {
    // Set countdown to show countdown before game starts
    setCountdown(3);
    // Set the game as started, which will trigger the countdown in the game play component
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8">
        Wordle Rush
      </h1>

      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl text-center font-semibold text-white mb-6">
          How to Play
        </h2>

        <div className="text-indigo-100 mb-6 space-y-3">
          <p>Solve as many word puzzles as you can before time runs out!</p>
          <p>
            For each correct word, you&apos;ll get more time added to the clock.
          </p>
          <p>
            Green tiles are letters in the correct position. Yellow tiles are
            letters in the wrong position. Gray tiles are incorrect letters.
          </p>
          <p>You can use your keyboard or tap the on-screen buttons.</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">
            Select Difficulty
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {Object.values(GameDifficulty).map((difficulty) => (
              <button
                key={difficulty}
                className={`
                  py-2 
                  rounded-md 
                  font-medium 
                  transition-colors
                  ${
                    selectedDifficulty === difficulty
                      ? "bg-cyan-500 text-white"
                      : "bg-indigo-700 text-indigo-200 hover:bg-indigo-600"
                  }
                `}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-md transition-colors shadow-md"
          onClick={handleStartGame}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
