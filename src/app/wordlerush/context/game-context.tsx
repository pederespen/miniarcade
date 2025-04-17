"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { GameBoardSize, GameContextType } from "../types";

// Create the context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameVersion, setGameVersion] = useState(1);
  const isDevelopment = process.env.NODE_ENV === "development";

  // Function to increment game version - used on game reset
  const incrementGameVersion = useCallback(() => {
    setGameVersion((prev) => prev + 1);
  }, []);

  // Handle board size changes (required by interface but we don't need to use the size)
  const handleBoardSizeChange = (size: GameBoardSize) => {
    // The size is handled internally by the game components
    // We don't need to do anything with it at this level
  };

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

  // Initialize debug mode from URL parameters in development mode
  useEffect(() => {
    if (isDevelopment && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      // Default to true in development mode unless explicitly set to false
      const debug = params.has("debug") ? params.get("debug") === "true" : true;
      setDebugMode(debug);
    } else {
      setDebugMode(false); // Always false in production
    }
  }, [isDevelopment]);

  return (
    <GameContext.Provider
      value={{
        gameStarted,
        setGameStarted,
        highScore,
        setHighScore,
        handleBoardSizeChange,
        debugMode,
        setDebugMode,
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
