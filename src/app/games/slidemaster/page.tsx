"use client";

import { useState } from "react";
import SlideGame from "./SlideGame";
import ImageUploader from "./ImageUploader";

export default function SlideMASTER() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(4); // Default 4x4

  const handleImageUploaded = (imageDataUrl: string) => {
    setUserImage(imageDataUrl);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setUserImage(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">
        SlideMASTER
      </h1>

      {!gameStarted ? (
        <div className="bg-indigo-800 rounded-lg p-6 shadow-lg">
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
            <ImageUploader onImageUploaded={handleImageUploaded} />
          </div>

          {userImage && (
            <div className="mb-6">
              <h3 className="text-indigo-100 mb-2">Preview:</h3>
              <div className="w-48 h-48 mx-auto">
                <img
                  src={userImage}
                  alt="Uploaded image"
                  className="w-full h-full object-cover rounded"
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
          <SlideGame
            imageUrl={userImage!}
            gridSize={gridSize}
            onReset={resetGame}
          />
          <button
            onClick={resetGame}
            className="mt-6 bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-6 rounded"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
