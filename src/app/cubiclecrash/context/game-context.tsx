"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GameBoardSize } from "../types";

// Define the context type
type GameContextType = {
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  handleBoardSizeChange: (size: GameBoardSize) => void;
};

// Create the context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Handle board size changes (required by interface but we don't need to use the size)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBoardSizeChange = (size: GameBoardSize) => {
    // The size is handled internally by the game components
    // We don't need to do anything with it at this level
  };

  return (
    <GameContext.Provider
      value={{
        gameStarted,
        setGameStarted,
        highScore,
        setHighScore,
        handleBoardSizeChange,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
