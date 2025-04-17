"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { GameContextType } from "../types";

// Create the context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [gameVersion, setGameVersion] = useState(1);

  // Function to increment game version - used on game reset
  const incrementGameVersion = useCallback(() => {
    setGameVersion((prev) => prev + 1);
  }, []);

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
    <GameContext.Provider
      value={{
        gameStarted,
        setGameStarted,
        highScore,
        setHighScore,
        countdown,
        setCountdown,
        gameVersion,
        incrementGameVersion,
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
