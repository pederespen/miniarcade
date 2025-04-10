import {
  GridSizeSelector,
  ImageSelector,
  SelectedImageDisplay,
  GameControls,
} from "./image-selection";

// GameSetup Component
export function GameSetup({
  gridSize,
  onGridSizeChange,
  selectedPresetId,
  onImageSelect,
  userImage,
  selectingImage,
  onStartGame,
  onSelectDifferentImage,
}: {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  selectedPresetId: number | null;
  onImageSelect: (imageUrl: string, id: number) => void;
  userImage: string | null;
  selectingImage: boolean;
  onStartGame: () => void;
  onSelectDifferentImage: () => void;
}) {
  return (
    <div className="bg-black rounded-lg p-6 shadow-lg">
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
        userImage && <SelectedImageDisplay imageUrl={userImage} />
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
