"use client";

import { useState, useCallback } from "react";
import { Difficulty, GameBoardSize } from "./types";
import GameSetup from "./components/game-setup";
import GamePlay from "./components/game-play";

export default function PaperPlane() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium"); // easy, medium, hard
  const [gameBoardSize, setGameBoardSize] = useState<GameBoardSize>({
    width: 800,
    height: 600,
  });
  const [highScore, setHighScore] = useState(0);

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
    <div className="container mx-auto p-6 max-w-4xl">
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
