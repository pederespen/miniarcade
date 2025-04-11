"use client";

import { GameSetupProps } from "../types";

export default function GameSetup({ onStartGame, highScore }: GameSetupProps) {
  return (
    <div className="flex flex-col items-center space-y-8 mt-10">
      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
          Game Instructions
        </h2>
        <ul className="list-disc pl-5 text-indigo-100 space-y-2">
          <li>Click or tap to make your paper airplane fly upward</li>
          <li>Navigate through office obstacles</li>
          <li>Each obstacle you pass earns you points</li>
          <li>Hitting an obstacle ends the game</li>
          <li>The further you go, the harder it gets!</li>
        </ul>
      </div>

      {highScore > 0 && (
        <div className="bg-indigo-900 p-4 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-cyan-400">
            High Score: {highScore}
          </h2>
        </div>
      )}

      <button
        onClick={onStartGame}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
}
