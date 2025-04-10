import Image from "next/image";

// Preset images for users to choose from
export const presetImages = [
  {
    id: 1,
    name: "Simple Geometric",
    url: "./images/puzzles/simple.svg",
  },
  {
    id: 2,
    name: "Landscape Scene",
    url: "./images/puzzles/medium.svg",
  },
  {
    id: 3,
    name: "Space Adventure",
    url: "./images/puzzles/complex.svg",
  },
];

// ImageSelector Component
export function ImageSelector({
  onImageSelect,
  selectedPresetId,
}: {
  onImageSelect: (imageUrl: string, id: number) => void;
  selectedPresetId: number | null;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-indigo-100 mb-4">Select an Image</h3>
      <div className="grid grid-cols-3 gap-4">
        {presetImages.map((image) => (
          <div
            key={image.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all hover:opacity-90 ${
              selectedPresetId === image.id
                ? "ring-2 ring-cyan-400 transform scale-[1.02]"
                : ""
            }`}
            onClick={() => onImageSelect(image.url, image.id)}
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SelectedImageDisplay Component
export function SelectedImageDisplay({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-indigo-100 mb-2">Selected Image:</h3>
      <div className="w-64 h-64 mx-auto relative mb-4">
        <Image
          src={imageUrl}
          alt="Selected image"
          fill
          className="object-cover rounded"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>
    </div>
  );
}

// GridSizeSelector Component
export function GridSizeSelector({
  gridSize,
  onGridSizeChange,
}: {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
}) {
  return (
    <div className="mb-6">
      <label className="block text-indigo-100 mb-2">Grid Size</label>
      <div className="flex flex-wrap gap-2">
        {[3, 4, 5, 6, 7].map((size) => (
          <button
            key={size}
            className={`px-4 py-2 rounded cursor-pointer ${
              gridSize === size
                ? "bg-cyan-500 text-white"
                : "bg-indigo-700 text-indigo-100 hover:bg-indigo-600"
            }`}
            onClick={() => onGridSizeChange(size)}
          >
            {size}x{size}
          </button>
        ))}
      </div>
    </div>
  );
}

// GameControls Component
export function GameControls({
  onStartGame,
  onSelectDifferentImage,
}: {
  onStartGame: () => void;
  onSelectDifferentImage: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={onStartGame}
        className="py-3 px-12 rounded-lg font-bold bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer"
      >
        Start Game
      </button>
      <button
        onClick={onSelectDifferentImage}
        className="text-indigo-300 hover:text-indigo-100 underline text-sm cursor-pointer"
      >
        Select different image
      </button>
    </div>
  );
}
