"use client";

import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";
import { GameProvider, useGameContext } from "./context/game-context";

function CubicleCrashGameContent() {
  const { gameStarted, highScore, setHighScore, handleBoardSizeChange } =
    useGameContext();

  return (
    <div className="container mx-auto px-2 sm:px-6 py-4 max-w-4xl h-full flex flex-col">
      {!gameStarted ? (
        <GameSetup />
      ) : (
        <GamePlay
          onBoardSizeChange={handleBoardSizeChange}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      )}
    </div>
  );
}

export default function CubiclecrashGame() {
  return (
    <GameProvider>
      <CubicleCrashGameContent />
    </GameProvider>
  );
}
