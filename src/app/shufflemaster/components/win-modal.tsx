import { formatTime } from "../utils";

interface WinModalProps {
  moves: number;
  startTime: number | null;
  endTime: number | null;
  elapsedTime: number;
  onNewGame: () => void;
}

export default function WinModal({
  moves,
  startTime,
  endTime,
  elapsedTime,
  onNewGame,
}: WinModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-sky-950 border border-sky-600 rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transform backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-sky-600 mb-4">
            🎉 Puzzle Solved! 🎉
          </h3>

          <div className="bg-sky-900/70 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center">
              <span className="text-indigo-100">Moves</span>
              <span className="text-indigo-100">Time</span>
              <span className="text-white font-bold text-xl">{moves}</span>
              <span className="text-white font-bold text-xl">
                {endTime && startTime
                  ? formatTime(Math.floor((endTime - startTime) / 1000))
                  : formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNewGame}
              className="px-8 py-3 bg-sky-600 hover:bg-cyan-600 text-white rounded-lg font-bold cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
