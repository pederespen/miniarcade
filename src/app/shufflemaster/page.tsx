"use client";

import { GameProvider } from "./contexts/game-context";
import { GameSetup } from "./components/game-setup";
import { GamePlay } from "./components/game-play";
import { useGameContext } from "./contexts/game-context";
import { HowToPlayScreen } from "./components/how-to-play-screen";

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
  // Get the context values for game flow
  const { gameStarted, userImage, showingHowToPlay, continueToImageSelection } =
    useGameContext();

  return (
    <div
      className={`container mx-auto p-6 ${
        showingHowToPlay ? "max-w-lg" : gameStarted ? "max-w-4xl" : "max-w-2xl"
      }`}
    >
      {gameStarted ? (
        userImage && <GamePlay />
      ) : showingHowToPlay ? (
        <HowToPlayScreen onContinue={continueToImageSelection} />
      ) : (
        <GameSetup />
      )}
    </div>
  );
}
