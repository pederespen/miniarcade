"use client";

import { GameProvider } from "./contexts/game-context";
import { GameSetup } from "./components/game-setup";
import { GamePlay } from "./components/game-play";
import { useGameContext } from "./contexts/game-context";

// Main component with provider
export default function ShuffleMaster() {
  return (
    <GameProvider>
      <ShuffleMasterContent />
    </GameProvider>
  );
}

// Content component that consumes the context
function ShuffleMasterContent() {
  // Just need to know if game started and if there's an image
  const { gameStarted, userImage } = useGameContext();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {!gameStarted ? <GameSetup /> : userImage && <GamePlay />}
    </div>
  );
}
