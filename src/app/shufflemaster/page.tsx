"use client";

import { useState, useEffect, useRef } from "react";
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
  const [gridSize, setGridSize] = useState(3); // Default 3x3
  const [imageSource, setImageSource] = useState<"upload" | "preset">("upload");
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [selectingImage, setSelectingImage] = useState(true);

  // Refs for the tooltips
  const howToPlayTooltipRef = useRef<HTMLDivElement>(null);
  const helpTooltipRef = useRef<HTMLDivElement>(null);
  const howToPlayButtonRef = useRef<HTMLButtonElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside tooltips
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if howToPlayTooltip is open and click is outside of it
      if (
        howToPlayTooltipRef.current &&
        !howToPlayTooltipRef.current.classList.contains("hidden") &&
        !howToPlayTooltipRef.current.contains(event.target as Node) &&
        !howToPlayButtonRef.current?.contains(event.target as Node)
      ) {
        howToPlayTooltipRef.current.classList.add(
          "hidden",
          "opacity-0",
          "translate-y-2"
        );
      }

      // Check if helpTooltip is open and click is outside of it
      if (
        helpTooltipRef.current &&
        !helpTooltipRef.current.classList.contains("hidden") &&
        !helpTooltipRef.current.contains(event.target as Node) &&
        !helpButtonRef.current?.contains(event.target as Node)
      ) {
        helpTooltipRef.current.classList.add(
          "hidden",
          "opacity-0",
          "translate-y-2"
        );
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUploaded = (imageDataUrl: string) => {
    setUserImage(imageDataUrl);
    setSelectingImage(false);
  };

  const handlePresetSelect = (imageUrl: string, id: number) => {
    setUserImage(imageUrl);
    setSelectedPresetId(id);
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
  };

  const selectDifferentImage = () => {
    setUserImage(null);
    setSelectedPresetId(null);
    setSelectingImage(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {!gameStarted ? (
        <div className="bg-black rounded-lg p-6 shadow-lg">
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
                  onClick={() => setGridSize(size)}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          {selectingImage ? (
            <div className="mb-6">
              <div className="flex border-b border-indigo-700 mb-4">
                <button
                  className={`py-2 px-4 cursor-pointer ${
                    imageSource === "upload"
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-indigo-300 hover:text-indigo-100"
                  }`}
                  onClick={() => setImageSource("upload")}
                >
                  Upload Image
                </button>
                <button
                  className={`py-2 px-4 cursor-pointer ${
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
          ) : (
            userImage && (
              <div className="mb-6">
                <h3 className="text-indigo-100 mb-2">Selected Image:</h3>
                <div className="w-64 h-64 mx-auto relative mb-4">
                  <Image
                    src={userImage}
                    alt="Selected image"
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                </div>
              </div>
            )
          )}

          {userImage && !selectingImage && (
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={startGame}
                className="py-3 px-12 rounded-lg font-bold bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer"
              >
                Start Game
              </button>
              <button
                onClick={selectDifferentImage}
                className="text-indigo-300 hover:text-indigo-100 underline text-sm cursor-pointer"
              >
                Select different image
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative">
            <ShuffleMasterGame
              imageUrl={userImage!}
              gridSize={gridSize}
              onReset={resetGame}
            />

            <div className="mt-2 flex justify-between">
              <div className="relative inline-block">
                <button
                  ref={howToPlayButtonRef}
                  className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    const tooltip = howToPlayTooltipRef.current;
                    if (tooltip) {
                      tooltip.classList.toggle("hidden");
                      tooltip.classList.toggle("opacity-0");
                      tooltip.classList.toggle("scale-95");
                    }
                    // Hide the other tooltip if it's open
                    const helpTooltip = helpTooltipRef.current;
                    if (
                      helpTooltip &&
                      !helpTooltip.classList.contains("hidden")
                    ) {
                      helpTooltip.classList.add(
                        "hidden",
                        "opacity-0",
                        "scale-95"
                      );
                    }
                  }}
                >
                  How to Play
                </button>
                <div
                  ref={howToPlayTooltipRef}
                  className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
                >
                  <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => {
                      if (howToPlayTooltipRef.current) {
                        howToPlayTooltipRef.current.classList.add(
                          "hidden",
                          "opacity-0",
                          "scale-95"
                        );
                      }
                    }}
                  ></div>
                  <div className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg max-w-md mx-4 border border-cyan-500/30 z-10">
                    <button
                      className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
                      onClick={() => {
                        if (howToPlayTooltipRef.current) {
                          howToPlayTooltipRef.current.classList.add(
                            "hidden",
                            "opacity-0",
                            "scale-95"
                          );
                        }
                      }}
                    >
                      ✕
                    </button>
                    <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
                      How to Play
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        Click on tiles adjacent to the empty space to move them
                      </li>
                      <li>
                        Rearrange the tiles to recreate the original image
                      </li>
                      <li>
                        The empty space should end up in the bottom-right corner
                      </li>
                      <li>Complete the puzzle in as few moves as possible</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative inline-block">
                <button
                  ref={helpButtonRef}
                  className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    const tooltip = helpTooltipRef.current;
                    if (tooltip) {
                      tooltip.classList.toggle("hidden");
                      tooltip.classList.toggle("opacity-0");
                      tooltip.classList.toggle("scale-95");
                    }
                    // Hide the other tooltip if it's open
                    const howToPlayTooltip = howToPlayTooltipRef.current;
                    if (
                      howToPlayTooltip &&
                      !howToPlayTooltip.classList.contains("hidden")
                    ) {
                      howToPlayTooltip.classList.add(
                        "hidden",
                        "opacity-0",
                        "scale-95"
                      );
                    }
                  }}
                >
                  Help
                </button>
                <div
                  ref={helpTooltipRef}
                  className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
                >
                  <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => {
                      if (helpTooltipRef.current) {
                        helpTooltipRef.current.classList.add(
                          "hidden",
                          "opacity-0",
                          "scale-95"
                        );
                      }
                    }}
                  ></div>
                  <div className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg mx-4 border border-cyan-500/30 z-10">
                    <button
                      className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
                      onClick={() => {
                        if (helpTooltipRef.current) {
                          helpTooltipRef.current.classList.add(
                            "hidden",
                            "opacity-0",
                            "scale-95"
                          );
                        }
                      }}
                    >
                      ✕
                    </button>
                    <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
                      Reference Image
                    </h3>
                    <div className="w-52 h-52 relative mx-auto">
                      <Image
                        src={userImage!}
                        alt="Original image"
                        fill
                        className="object-contain rounded"
                        sizes="208px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
