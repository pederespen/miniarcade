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
      <div className="flex justify-center sm:justify-start border-b border-sky-700 mb-4">
        <button
          className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-sm sm:text-base font-medium cursor-pointer ${
            activeTab === "presets"
              ? "text-sky-600 border-b-2 border-sky-600"
              : "text-indigo-100 hover:text-sky-600"
          }`}
          onClick={() => setActiveTab("presets")}
        >
          Preset Images
        </button>
        <button
          className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-sm sm:text-base font-medium cursor-pointer ${
            activeTab === "upload"
              ? "text-sky-600 border-b-2 border-sky-600"
              : "text-indigo-100 hover:text-sky-600"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>
      </div>

      {/* Content */}
      {activeTab === "presets" ? (
        <div className="mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {presetImages.map((image) => (
              <div
                key={image.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all hover:opacity-90 ${
                  selectedPresetId === image.id
                    ? "ring-2 ring-sky-600 transform scale-[1.02]"
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
      <div className="w-auto h-auto max-w-[320px] max-h-[320px] mx-auto relative mb-4 rounded-lg overflow-hidden border border-sky-600">
        <Image
          src={imageUrl}
          alt="Selected image"
          width={320}
          height={320}
          className="object-contain"
          sizes="320px"
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
    <div className="mb-6 ">
      <label className="block text-indigo-100 mb-2">Grid Size</label>
      <div className="flex flex-row flex-wrap justify-center gap-1 sm:gap-2 justify-start">
        {[3, 4, 5, 6, 7].map((size) => (
          <button
            key={size}
            className={`px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded cursor-pointer transition-colors ${
              gridSize === size
                ? "bg-sky-600 text-white"
                : "bg-sky-900 text-indigo-100 hover:bg-sky-800"
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
        className="py-3 px-12 rounded-lg font-bold bg-sky-600 hover:bg-cyan-600 text-white cursor-pointer"
      >
        Start Game
      </button>
      <button
        onClick={onSelectDifferentImage}
        className="text-sky-600 hover:text-cyan-600 underline text-sm cursor-pointer"
      >
        Select different image
      </button>
    </div>
  );
}
