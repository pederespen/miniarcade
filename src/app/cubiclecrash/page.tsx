"use client";

import { useEffect } from "react";
import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";
import { GameProvider, useGameContext } from "./context/game-context";

function CubiclecrashGameContent() {
  const { gameStarted, highScore, setHighScore, handleBoardSizeChange } =
    useGameContext();

  // Add a viewport meta tag to ensure proper scaling on mobile
  useEffect(() => {
    // Check if the viewport meta tag exists
    const viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      // Create and append viewport meta tag if it doesn't exist
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    } else {
      // Update existing viewport meta tag
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
  }, []);

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
      <CubiclecrashGameContent />
    </GameProvider>
  );
}
