"use client";

import { useGameContext } from "../context/game-context";

export default function GameSetup() {
  const { setGameStarted, setCountdown } = useGameContext();

  const handleStartGame = () => {
    // Set countdown to 0 to skip the countdown
    setCountdown(0);
    // Set the game as started
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto px-4">
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
