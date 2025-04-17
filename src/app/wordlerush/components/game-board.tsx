"use client";

import { LETTER_COLORS } from "../constants";
import { GameBoardProps } from "../types";

export default function GameBoard({
  board,
  currentRowIndex,
  currentColIndex,
  stats,
  gameVersion,
}: GameBoardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Stats display */}
      <div className="w-full flex justify-between mb-4 px-2 rounded-lg bg-indigo-800 p-3 text-white">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-indigo-300">Score</span>
          <span className="text-xl font-bold">{stats.score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-indigo-300">Time</span>
          <span
            className={`text-xl font-bold ${
              stats.timeLeft < 10 ? "text-red-400" : ""
            }`}
          >
            {Math.ceil(stats.timeLeft)}s
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-indigo-300">Words</span>
          <span className="text-xl font-bold">{stats.wordsCompleted}</span>
        </div>
      </div>

      {/* Game board grid */}
      <div className="grid grid-rows-6 gap-1 w-full max-w-sm mx-auto">
        {board.map((row, rowIdx) => (
          <div
            key={`row-${rowIdx}-${gameVersion}`}
            className="grid grid-cols-5 gap-1"
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
                    w-full 
                    flex 
                    items-center 
                    justify-center 
                    border-2 
                    ${
                      isCurrentPosition ? "border-cyan-400" : "border-gray-600"
                    } 
                    ${
                      isFilled ? LETTER_COLORS[letter.status] : "bg-transparent"
                    } 
                    rounded-md 
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
    </div>
  );
}
