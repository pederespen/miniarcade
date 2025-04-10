import { useRef } from "react";
import ShuffleMasterGame from "../game";
import { GameplayControls } from "../components/tooltips";

// GamePlay Component
export function GamePlay({
  userImage,
  gridSize,
  onReset,
  gameBoardSize,
  onBoardSizeChange,
  howToPlayTooltipRef,
  howToPlayButtonRef,
  toggleHowToPlayTooltip,
  hideHowToPlayTooltip,
  helpTooltipRef,
  helpButtonRef,
  toggleHelpTooltip,
  hideHelpTooltip,
  isCustomImage = false,
}: {
  userImage: string;
  gridSize: number;
  onReset: () => void;
  gameBoardSize: number;
  onBoardSizeChange: (size: number) => void;
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
  isCustomImage?: boolean;
}) {
  const gameContainerRef = useRef<HTMLDivElement>(null);

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
          howToPlayTooltipRef={howToPlayTooltipRef}
          howToPlayButtonRef={howToPlayButtonRef}
          toggleHowToPlayTooltip={toggleHowToPlayTooltip}
          hideHowToPlayTooltip={hideHowToPlayTooltip}
          helpTooltipRef={helpTooltipRef}
          helpButtonRef={helpButtonRef}
          toggleHelpTooltip={toggleHelpTooltip}
          hideHelpTooltip={hideHelpTooltip}
          gameBoardSize={gameBoardSize}
          userImage={userImage}
        />
      </div>
    </div>
  );
}
