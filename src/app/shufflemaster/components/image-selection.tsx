import Image from "next/image";
import { useState } from "react";
import { ImageUpload } from "./image-upload";

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
  const [activeTab, setActiveTab] = useState<"presets" | "upload">("presets");

  const handleImageCropped = (imageDataUrl: string) => {
    // Use a special ID (-1) to indicate a custom image
    onImageSelect(imageDataUrl, -1);
  };

  return (
    <div className="mb-6">
      {/* Tabs */}
      <div className="flex border-b border-indigo-700 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "presets"
              ? "text-cyan-500 border-b-2 border-cyan-500"
              : "text-indigo-300 hover:text-indigo-100"
          }`}
          onClick={() => setActiveTab("presets")}
        >
          Preset Images
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "upload"
              ? "text-cyan-500 border-b-2 border-cyan-500"
              : "text-indigo-300 hover:text-indigo-100"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>
      </div>

      {/* Content */}
      {activeTab === "presets" ? (
        <div>
          <h3 className="text-indigo-100 mb-4">Select a Preset Image</h3>
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
      ) : (
        <ImageUpload
          onImageCropped={handleImageCropped}
          onCancel={() => setActiveTab("presets")}
        />
      )}
    </div>
  );
}

// SelectedImageDisplay Component
export function SelectedImageDisplay({
  imageUrl,
  isCustomImage = false,
}: {
  imageUrl: string;
  isCustomImage?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="w-64 h-64 mx-auto relative mb-4 rounded-lg overflow-hidden border-2 border-indigo-500">
        <Image
          src={imageUrl}
          alt="Selected image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
          unoptimized={isCustomImage} // Skip Next.js optimization for data URLs
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
