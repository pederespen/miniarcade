"use client";

import { useGameContext } from "../context/game-context";

export default function GameSetup() {
  const { setGameStarted, setCountdown, wordsLoaded } = useGameContext();

  const handleStartGame = () => {
    // Set countdown to 0 to skip the countdown
    setCountdown(0);
    // Set the game as started
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-4 pt-8">
      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl text-center font-semibold text-white mb-6">
          How to Play
        </h2>

        <ul className="text-indigo-100 mb-6 space-y-2 list-disc pl-5">
          <li>Solve the word puzzles before time runs out</li>
          <li>Correct words give points and add time to the clock</li>
          <li>Green tiles = correct position</li>
          <li>Yellow tiles = wrong position</li>
          <li>Gray tiles = incorrect letters</li>
        </ul>

        <button
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-md transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleStartGame}
          disabled={!wordsLoaded}
        >
          {wordsLoaded ? "START GAME" : "LOADING WORDS..."}
        </button>
      </div>
    </div>
  );
}
