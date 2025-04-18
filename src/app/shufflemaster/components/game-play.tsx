import { useRef } from "react";
import ShuffleMasterGame from "../game";
import { GameplayControls } from "./tooltips";
import { useGameContext } from "../contexts/game-context";

// GamePlay Component - simplified with context
export function GamePlay() {
  const {
    userImage,
    gridSize,
    gameBoardSize,
    isCustomImage,
    onBoardSizeChange,
    resetGame: onReset,
    howToPlayTooltipRef,
    helpTooltipRef,
    helpButtonRef,
    toggleHelpTooltip,
    hideHelpTooltip,
  } = useGameContext();

  const gameContainerRef = useRef<HTMLDivElement>(null);

  if (!userImage) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative w-full max-w-2xl mx-auto"
        style={{ minHeight: "520px" }}
        ref={gameContainerRef}
      >
        <ShuffleMasterGame
          imageUrl={userImage}
          gridSize={gridSize}
          onReset={onReset}
          onBoardSizeChange={onBoardSizeChange}
          isCustomImage={isCustomImage}
        />
        <GameplayControls
          helpTooltipRef={helpTooltipRef}
          helpButtonRef={helpButtonRef}
          toggleHelpTooltip={toggleHelpTooltip}
          hideHelpTooltip={hideHelpTooltip}
          gameBoardSize={gameBoardSize}
          userImage={userImage}
          howToPlayTooltipRef={howToPlayTooltipRef}
        />
      </div>
    </div>
  );
}
