import Image from "next/image";
import { useState } from "react";
import { ImageUpload } from "./image-upload";

// Preset images for users to choose from
export const presetImages = [
  {
    id: 1,
    name: "preset_1",
    url: "./shufflemaster/preset_1.svg",
  },
  {
    id: 2,
    name: "preset_2",
    url: "./shufflemaster/preset_2.svg",
  },
  {
    id: 3,
    name: "Preset_3",
    url: "./shufflemaster/preset_3.svg",
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
      <div className="flex justify-center sm:justify-start border-b border-indigo-700 mb-4">
        <button
          className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-sm sm:text-base font-medium ${
            activeTab === "presets"
              ? "text-cyan-500 border-b-2 border-cyan-500"
              : "text-indigo-300 hover:text-indigo-100"
          }`}
          onClick={() => setActiveTab("presets")}
        >
          Preset Images
        </button>
        <button
          className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-sm sm:text-base font-medium ${
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
          <div className="flex overflow-x-auto pb-4 sm:grid sm:grid-cols-3 gap-4">
            {presetImages.map((image) => (
              <div
                key={image.id}
                className={`relative flex-shrink-0 w-[150px] sm:w-auto cursor-pointer rounded-lg overflow-hidden transition-all hover:opacity-90 ${
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
                    sizes="(max-width: 640px) 150px, (max-width: 768px) 33vw, 250px"
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
    <div className="mb-6 flex flex-col items-center justify-center">
      <div className="w-auto h-auto max-w-[256px] max-h-[256px] mx-auto relative mb-4 rounded-lg overflow-hidden border-2 border-indigo-500">
        <Image
          src={imageUrl}
          alt="Selected image"
          width={192}
          height={192}
          className="object-contain"
          sizes="256px"
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
      <div className="flex flex-row flex-wrap justify-center gap-1 sm:gap-2 justify-start">
        {[3, 4, 5, 6, 7].map((size) => (
          <button
            key={size}
            className={`px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded cursor-pointer transition-colors ${
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
