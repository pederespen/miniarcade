"use client";

import { useState, useCallback } from "react";
import { useTooltip } from "./hooks/use-tooltip";
import { GameSetup } from "./components/game-setup";
import { GamePlay } from "./components/game-play";

export default function ShuffleMaster() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(3); // Default 3x3
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [selectingImage, setSelectingImage] = useState(true);
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
  };

  const selectDifferentImage = () => {
    setUserImage(null);
    setSelectedPresetId(null);
    setSelectingImage(true);
    setIsCustomImage(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {!gameStarted ? (
        <GameSetup
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          selectedPresetId={selectedPresetId}
          onImageSelect={handlePresetSelect}
          userImage={userImage}
          selectingImage={selectingImage}
          onStartGame={startGame}
          onSelectDifferentImage={selectDifferentImage}
          isCustomImage={isCustomImage}
        />
      ) : (
        userImage && (
          <GamePlay
            userImage={userImage}
            gridSize={gridSize}
            onReset={resetGame}
            gameBoardSize={gameBoardSize}
            onBoardSizeChange={handleBoardSizeChange}
            howToPlayTooltipRef={howToPlayTooltipRef}
            howToPlayButtonRef={howToPlayButtonRef}
            toggleHowToPlayTooltip={toggleHowToPlayTooltip}
            hideHowToPlayTooltip={hideHowToPlayTooltip}
            helpTooltipRef={helpTooltipRef}
            helpButtonRef={helpButtonRef}
            toggleHelpTooltip={toggleHelpTooltip}
            hideHelpTooltip={hideHelpTooltip}
            isCustomImage={isCustomImage}
          />
        )
      )}
    </div>
  );
}
