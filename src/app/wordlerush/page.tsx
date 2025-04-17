"use client";

import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";
import { GameProvider, useGameContext } from "./context/game-context";

function WordleRushGameContent() {
  const { gameStarted, highScore, setHighScore } = useGameContext();

  return (
    <div className="container mx-auto px-2 sm:px-6 py-4 max-w-4xl h-full flex flex-col">
      {!gameStarted ? (
        <GameSetup />
      ) : (
        <GamePlay highScore={highScore} setHighScore={setHighScore} />
      )}
    </div>
  );
}

export default function WordleRushGame() {
  return (
    <GameProvider>
      <WordleRushGameContent />
    </GameProvider>
  );
}
