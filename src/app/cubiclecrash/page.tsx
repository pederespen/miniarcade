"use client";

import { useState, useCallback, useEffect } from "react";
import { GameBoardSize } from "./types";
import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";
import DebugPanel from "../components/debug-panel";

export default function CubiclecrashGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

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

  // Handle board size changes (required by interface but we don't need to use the size)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBoardSizeChange = useCallback((size: GameBoardSize) => {
    // The size is handled internally by the game components
    // We don't need to do anything with it at this level
  }, []);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="container mx-auto px-2 sm:px-6 py-4 max-w-4xl h-full flex flex-col">
      {!gameStarted ? (
        <GameSetup onStartGame={startGame} highScore={highScore} />
      ) : (
        <GamePlay
          onBoardSizeChange={handleBoardSizeChange}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      )}

      {/* Debug Panel */}
      <DebugPanel gameName="Cubicle Crash" />
    </div>
  );
}
