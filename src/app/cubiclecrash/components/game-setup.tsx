"use client";

import { useGameContext } from "../context/game-context";

export default function GameSetup() {
  const { setGameStarted, highScore } = useGameContext();

  const onStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center space-y-8 mt-10">
      <div className="bg-indigo-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
          How to Play
        </h2>
        <ul className="list-disc pl-5 text-indigo-100 space-y-2">
          <li>
            Click or tap to make your paper airplane fly and dodge obstacles
          </li>
          <li>Each obstacle you pass earns you points</li>
          <li>The further you go, the harder it gets!</li>
        </ul>

        {/* Powerups section */}
        <div className="mt-6 border-t border-indigo-600 pt-4">
          <h3 className="text-xl font-semibold text-cyan-400 mb-3">Powerups</h3>
          <div className="flex flex-row gap-3">
            {/* Double Points Powerup - Gold orb with 2× */}
            <div className="flex items-center gap-2 bg-indigo-700/50 p-2 rounded-md flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 relative">
                {/* Gold gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFF9C4] via-[#FFC107] to-[#FF8F00]"></div>
                {/* Outer glow */}
                <div className="absolute inset-[-4px] rounded-full bg-[#FFD700] opacity-30 animate-pulse"></div>
                {/* 2× text */}
                <span className="relative text-white font-bold text-lg z-10">
                  2×
                </span>
              </div>
              <span className="text-indigo-100 font-semibold text-sm">
                Double Points
              </span>
            </div>

            {/* Invincibility Powerup - Blue shield orb */}
            <div className="flex items-center gap-2 bg-indigo-700/50 p-2 rounded-md flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 relative">
                {/* Blue gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E3F2FD] via-[#2196F3] to-[#1565C0]"></div>
                {/* Outer glow */}
                <div className="absolute inset-[-4px] rounded-full bg-[#2196F3] opacity-30 animate-pulse"></div>
                {/* Shield symbol */}
                <div className="relative z-10 w-5 h-5">
                  <div className="w-full h-full border-t-4 border-l-2 border-r-2 rounded-t-full border-white"></div>
                  <div className="absolute top-1/2 left-1/2 w-[2px] h-3 bg-white transform -translate-x-1/2"></div>
                </div>
              </div>
              <span className="text-indigo-100 font-semibold text-sm">
                Invincibility
              </span>
            </div>
          </div>
        </div>
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
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105 cursor-pointer"
      >
        Start Game
      </button>
    </div>
  );
}
