import {
  GridSizeSelector,
  ImageSelector,
  SelectedImageDisplay,
  GameControls,
} from "./image-selection";
import { useGameContext } from "../contexts/game-context";

// GameSetup Component
export function GameSetup() {
  const {
    gridSize,
    setGridSize: onGridSizeChange,
    selectedPresetId,
    handlePresetSelect: onImageSelect,
    userImage,
    selectingImage,
    startGame: onStartGame,
    selectDifferentImage: onSelectDifferentImage,
    isCustomImage,
  } = useGameContext();

  return (
    <div className="bg-sky-950 rounded-lg p-6 shadow-lg w-full border border-sky-600">
      <GridSizeSelector
        gridSize={gridSize}
        onGridSizeChange={onGridSizeChange}
      />

      {selectingImage ? (
        <ImageSelector
          onImageSelect={onImageSelect}
          selectedPresetId={selectedPresetId}
        />
      ) : (
        userImage && (
          <SelectedImageDisplay
            imageUrl={userImage}
            isCustomImage={isCustomImage}
          />
        )
      )}

      {userImage && !selectingImage && (
        <GameControls
          onStartGame={onStartGame}
          onSelectDifferentImage={onSelectDifferentImage}
        />
      )}
    </div>
  );
}
