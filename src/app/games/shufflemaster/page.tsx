"use client";

import { useState } from "react";
import Image from "next/image";
import ShuffleMasterGame from "./game";
import ImageUploader from "./image-uploader";

// Preset images for users to choose from
const presetImages = [
  {
    id: 1,
    name: "Simple Geometric",
    url: "/images/puzzles/simple.svg",
  },
  {
    id: 2,
    name: "Landscape Scene",
    url: "/images/puzzles/medium.svg",
  },
  {
    id: 3,
    name: "Space Adventure",
    url: "/images/puzzles/complex.svg",
  },
];

export default function ShuffleMaster() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(4); // Default 4x4
  const [imageSource, setImageSource] = useState<"upload" | "preset">("upload");
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);

  const handleImageUploaded = (imageDataUrl: string) => {
    setUserImage(imageDataUrl);
  };

  const handlePresetSelect = (imageUrl: string, id: number) => {
    setUserImage(imageUrl);
    setSelectedPresetId(id);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setUserImage(null);
    setSelectedPresetId(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {!gameStarted ? (
        <div className="bg-black rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Game Setup</h2>

          <div className="mb-6">
            <label className="block text-indigo-100 mb-2">Grid Size</label>
            <div className="flex space-x-4">
              {[3, 4, 5].map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded ${
                    gridSize === size
                      ? "bg-cyan-500 text-white"
                      : "bg-indigo-700 text-indigo-100 hover:bg-indigo-600"
                  }`}
                  onClick={() => setGridSize(size)}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-indigo-700 mb-4">
              <button
                className={`py-2 px-4 ${
                  imageSource === "upload"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-indigo-300 hover:text-indigo-100"
                }`}
                onClick={() => setImageSource("upload")}
              >
                Upload Image
              </button>
              <button
                className={`py-2 px-4 ${
                  imageSource === "preset"
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-indigo-300 hover:text-indigo-100"
                }`}
                onClick={() => setImageSource("preset")}
              >
                Preset Images
              </button>
            </div>

            {imageSource === "upload" ? (
              <ImageUploader onImageUploaded={handleImageUploaded} />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {presetImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all hover:opacity-90 ${
                      selectedPresetId === image.id
                        ? "ring-2 ring-cyan-400 transform scale-[1.02]"
                        : ""
                    }`}
                    onClick={() => handlePresetSelect(image.url, image.id)}
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
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-xs text-white truncate text-center">
                        {image.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {userImage && imageSource === "upload" && (
            <div className="mb-6">
              <h3 className="text-indigo-100 mb-2">Preview:</h3>
              <div className="w-48 h-48 mx-auto relative">
                <Image
                  src={userImage}
                  alt="Selected image"
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
            </div>
          )}

          <button
            onClick={startGame}
            disabled={!userImage}
            className={`w-full py-3 rounded-lg font-bold ${
              userImage
                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ShuffleMasterGame
            imageUrl={userImage!}
            gridSize={gridSize}
            onReset={resetGame}
          />
        </div>
      )}
    </div>
  );
}
