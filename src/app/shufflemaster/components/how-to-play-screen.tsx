import React from "react";

export function HowToPlayScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="bg-sky-950 rounded-lg p-6 shadow-lg border border-sky-600">
      <div className="mx-auto">
        <h2 className="text-2xl font-semibold text-sky-600 mb-6 text-center">
          How to Play
        </h2>

        <ul className="list-disc pl-5 text-indigo-100 space-y-3 mb-6">
          <li>Click on tiles adjacent to the empty space to move them</li>
          <li>Rearrange the tiles to recreate the original image</li>
          <li>The empty space should end up in the bottom-right corner</li>
          <li>Complete the puzzle in as few moves as possible</li>
        </ul>

        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="py-3 px-10 rounded-lg font-bold bg-sky-600 hover:bg-cyan-600 text-white cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
