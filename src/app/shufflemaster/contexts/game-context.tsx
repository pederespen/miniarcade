"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useTooltip } from "../hooks/use-tooltip";

// Type definitions for our context
type GameContextType = {
  // Game state
  userImage: string | null;
  gridSize: number;
  gameBoardSize: number;
  isCustomImage: boolean;
  gameStarted: boolean;
  selectingImage: boolean;
  selectedPresetId: number | null;
  showingHowToPlay: boolean;
  setGridSize: (size: number) => void;

  // Board size
  onBoardSizeChange: (size: number) => void;

  // Game actions
  startGame: () => void;
  resetGame: () => void;
  selectDifferentImage: () => void;
  handlePresetSelect: (imageUrl: string, id: number) => void;
  continueToImageSelection: () => void;

  // Tooltip references and functions
  howToPlayTooltipRef: React.RefObject<HTMLDivElement | null>;
  howToPlayButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleHowToPlayTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideHowToPlayTooltip: () => void;
  helpTooltipRef: React.RefObject<HTMLDivElement | null>;
  helpButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleHelpTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideHelpTooltip: () => void;
};

// Create context with a default undefined value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  // Game state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(3); // Default 3x3
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [selectingImage, setSelectingImage] = useState(false);
  const [showingHowToPlay, setShowingHowToPlay] = useState(true);
  const [gameBoardSize, setGameBoardSize] = useState<number>(500);
  const [isCustomImage, setIsCustomImage] = useState(false);

  // Use custom tooltip hooks
  const {
    tooltipRef: howToPlayTooltipRef,
    buttonRef: howToPlayButtonRef,
    toggleTooltip: toggleHowToPlayTooltip,
    hideTooltip: hideHowToPlayTooltip,
  } = useTooltip();

  const {
    tooltipRef: helpTooltipRef,
    buttonRef: helpButtonRef,
    toggleTooltip: toggleHelpTooltip,
    hideTooltip: hideHelpTooltip,
  } = useTooltip();

  // Handle board size changes
  const handleBoardSizeChange = useCallback((size: number) => {
    setGameBoardSize(size);
  }, []);

  const handlePresetSelect = (imageUrl: string, id: number) => {
    setUserImage(imageUrl);
    setSelectedPresetId(id);
    // Check if this is a custom image (id = -1)
    setIsCustomImage(id === -1);
    setSelectingImage(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setUserImage(null);
    setSelectedPresetId(null);
    setSelectingImage(true);
    setIsCustomImage(false);
    setShowingHowToPlay(false);
  };

  const selectDifferentImage = () => {
    setUserImage(null);
    setSelectedPresetId(null);
    setSelectingImage(true);
    setIsCustomImage(false);
    setShowingHowToPlay(false);
  };

  const continueToImageSelection = () => {
    setShowingHowToPlay(false);
    setSelectingImage(true);
  };

  // Context value object
  const contextValue: GameContextType = {
    // Game state
    userImage,
    gridSize,
    gameBoardSize,
    isCustomImage,
    gameStarted,
    selectingImage,
    selectedPresetId,
    showingHowToPlay,
    setGridSize,

    // Functions
    onBoardSizeChange: handleBoardSizeChange,
    startGame,
    resetGame,
    selectDifferentImage,
    handlePresetSelect,
    continueToImageSelection,

    // Tooltip refs and functions
    howToPlayTooltipRef,
    howToPlayButtonRef,
    toggleHowToPlayTooltip,
    hideHowToPlayTooltip,
    helpTooltipRef,
    helpButtonRef,
    toggleHelpTooltip,
    hideHelpTooltip,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
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
