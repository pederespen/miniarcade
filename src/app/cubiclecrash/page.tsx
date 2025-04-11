"use client";

import { useState, useCallback, useEffect } from "react";
import { Difficulty, GameBoardSize } from "./types";
import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";

export default function CubiclecrashGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium"); // easy, medium, hard
  const [gameBoardSize, setGameBoardSize] = useState<GameBoardSize>(() => {
    // Calculate initial size based on viewport
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const width = isMobile ? Math.min(window.innerWidth * 0.95, 600) : 800;
    const height = width * 0.75;

    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  });
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

  // Handle board size changes for responsive design
  const handleBoardSizeChange = useCallback((size: GameBoardSize) => {
    setGameBoardSize(size);
  }, []);

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  return (
    <div className="container mx-auto px-2 sm:px-6 py-4 max-w-4xl h-full flex flex-col">
      {!gameStarted ? (
        <GameSetup
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartGame={startGame}
          highScore={highScore}
        />
      ) : (
        <GamePlay
          difficulty={difficulty}
          onReset={resetGame}
          gameBoardSize={gameBoardSize}
          onBoardSizeChange={handleBoardSizeChange}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      )}
    </div>
  );
}
