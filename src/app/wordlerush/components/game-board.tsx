"use client";

import { LETTER_COLORS } from "../constants";
import { GameBoardProps } from "../types";

export default function GameBoard({
  board,
  currentRowIndex,
  currentColIndex,
  stats,
  gameVersion,
  showInvalidWord,
}: GameBoardProps) {
  return (
    <div className="flex flex-col items-center relative">
      {/* Stats display */}
      <div className="w-full flex justify-between mb-4 px-2 rounded-lg bg-indigo-800 p-3 text-white">
        <div className="flex flex-col items-center relative">
          <span className="text-xs uppercase text-indigo-300">Score</span>
          <span className="text-xl font-bold">{stats.score}</span>
          {/* Points feedback */}
          {stats.feedback.showCorrect && (
            <div className="absolute top-1/2 left-[105%] text-yellow-300 font-bold text-lg whitespace-nowrap opacity-80 transition-all duration-1500 animate-fade-up">
              +{stats.feedback.pointsGained}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center relative">
          <span className="text-xs uppercase text-indigo-300">Time</span>
          <span
            className={`text-xl font-bold ${
              stats.timeLeft < 10 ? "text-red-400" : ""
            }`}
          >
            {Math.ceil(stats.timeLeft)}s
          </span>
          {/* Time feedback */}
          {stats.feedback.showCorrect && (
            <div className="absolute top-1/2 left-[105%] text-cyan-300 font-bold text-lg whitespace-nowrap opacity-80 transition-all duration-1500 animate-fade-up">
              +{stats.feedback.timeAdded}s
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-indigo-300">Words</span>
          <span className="text-xl font-bold">{stats.wordsCompleted}</span>
        </div>
      </div>

      {/* Correct feedback overlay */}
      {stats.feedback.showCorrect && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="text-green-400 font-bold text-4xl animate-pulse px-6 py-3 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg text-center">
            Correct!
            <div className="text-cyan-300 text-2xl mt-1">
              +{stats.feedback.timeAdded}s
            </div>
          </div>
        </div>
      )}

      {/* Invalid word feedback overlay */}
      {showInvalidWord && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="text-red-400 font-bold text-3xl animate-pulse px-6 py-3 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg text-center">
            Not in word list!
          </div>
        </div>
      )}

      {/* Game board grid */}
      <div className="grid grid-rows-5 gap-1.5 mx-auto w-[16.5rem]">
        {board.map((row, rowIdx) => (
          <div
            key={`row-${rowIdx}-${gameVersion}`}
            className="grid grid-cols-5 gap-1.5"
          >
            {row.map((letter, colIdx) => {
              // Determine if this cell is the current cursor position
              const isCurrentPosition =
                rowIdx === currentRowIndex && colIdx === currentColIndex;
              const isFilled = letter.char !== "";

              return (
                <div
                  key={`cell-${rowIdx}-${colIdx}-${gameVersion}`}
                  className={`
                    h-12 
                    w-12
                    flex 
                    items-center 
                    justify-center 
                    border 
                    ${
                      isCurrentPosition ? "border-cyan-400" : "border-gray-600"
                    } 
                    ${
                      isFilled ? LETTER_COLORS[letter.status] : "bg-transparent"
                    } 
                    rounded-sm
                    font-bold 
                    text-2xl 
                    text-white
                    ${
                      rowIdx < currentRowIndex ||
                      (rowIdx === currentRowIndex && isFilled)
                        ? "animate-pop"
                        : ""
                    }
                  `}
                >
                  {letter.char}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Custom animation class for the keyframes */}
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .animate-fade-up {
          animation: fadeUp 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
