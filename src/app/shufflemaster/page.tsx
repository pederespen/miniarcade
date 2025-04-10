"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ShuffleMasterGame from "./game";

// Preset images for users to choose from
const presetImages = [
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

// Custom hook for tooltip management
function useTooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentTooltipRef = tooltipRef.current;
    const currentButtonRef = buttonRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentTooltipRef &&
        !currentTooltipRef.classList.contains("hidden") &&
        !currentTooltipRef.contains(event.target as Node) &&
        !currentButtonRef?.contains(event.target as Node)
      ) {
        currentTooltipRef.classList.add("hidden", "opacity-0", "scale-95");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTooltip = useCallback(
    (otherTooltipRef?: React.RefObject<HTMLDivElement | null>) => {
      if (tooltipRef.current) {
        tooltipRef.current.classList.toggle("hidden");
        tooltipRef.current.classList.toggle("opacity-0");
        tooltipRef.current.classList.toggle("scale-95");
      }

      // Hide other tooltip if specified
      if (
        otherTooltipRef?.current &&
        !otherTooltipRef.current.classList.contains("hidden")
      ) {
        otherTooltipRef.current.classList.add(
          "hidden",
          "opacity-0",
          "scale-95"
        );
      }
    },
    []
  );

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.classList.add("hidden", "opacity-0", "scale-95");
    }
  }, []);

  return { tooltipRef, buttonRef, toggleTooltip, hideTooltip };
}

// GridSizeSelector Component
function GridSizeSelector({
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

// ImageSelector Component
function ImageSelector({
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
function SelectedImageDisplay({ imageUrl }: { imageUrl: string }) {
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

// GameControls Component
function GameControls({
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

// GameSetup Component
function GameSetup({
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

// HowToPlayTooltip Component
function HowToPlayTooltip({
  tooltipRef,
  buttonRef,
  toggleTooltip,
  hideTooltip,
  otherTooltipRef,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideTooltip: () => void;
  otherTooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          toggleTooltip(otherTooltipRef);
        }}
      >
        How to Play
      </button>
      <div
        ref={tooltipRef}
        className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={hideTooltip}
        ></div>
        <div
          className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg max-w-md mx-auto border border-cyan-500/30 z-10"
          style={{ maxWidth: "min(500px, 90vw)" }}
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
            onClick={hideTooltip}
          >
            ✕
          </button>
          <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
            How to Play
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Click on tiles adjacent to the empty space to move them</li>
            <li>Rearrange the tiles to recreate the original image</li>
            <li>The empty space should end up in the bottom-right corner</li>
            <li>Complete the puzzle in as few moves as possible</li>
          </ul>
          <p className="text-xs text-cyan-300/70 mt-4 italic text-center">
            Hint: Try to complete one layer at a time from the top. When you
            have two layers left, complete it from left to right.
          </p>
        </div>
      </div>
    </div>
  );
}

// HelpTooltip Component
function HelpTooltip({
  tooltipRef,
  buttonRef,
  toggleTooltip,
  hideTooltip,
  otherTooltipRef,
  userImage,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideTooltip: () => void;
  otherTooltipRef: React.RefObject<HTMLDivElement | null>;
  userImage: string;
}) {
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          toggleTooltip(otherTooltipRef);
        }}
      >
        Help
      </button>
      <div
        ref={tooltipRef}
        className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={hideTooltip}
        ></div>
        <div
          className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg mx-auto border border-cyan-500/30 z-10"
          style={{ width: "90%", maxWidth: "450px" }}
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
            onClick={hideTooltip}
          >
            ✕
          </button>
          <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
            Reference Image
          </h3>
          <div className="w-[380px] h-[380px] max-w-[90%] max-h-[90vw] relative mx-auto">
            <Image
              src={userImage}
              alt="Original image"
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 90vw, 380px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// GameplayControls Component
function GameplayControls({
  howToPlayTooltipRef,
  howToPlayButtonRef,
  toggleHowToPlayTooltip,
  hideHowToPlayTooltip,
  helpTooltipRef,
  helpButtonRef,
  toggleHelpTooltip,
  hideHelpTooltip,
  gameBoardSize,
  userImage,
}: {
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
  gameBoardSize: number;
  userImage: string;
}) {
  return (
    <div
      className="mt-1 flex justify-between w-full mx-auto"
      style={{ maxWidth: `${gameBoardSize}px` }}
    >
      <HowToPlayTooltip
        tooltipRef={howToPlayTooltipRef}
        buttonRef={howToPlayButtonRef}
        toggleTooltip={toggleHowToPlayTooltip}
        hideTooltip={hideHowToPlayTooltip}
        otherTooltipRef={helpTooltipRef}
      />

      <HelpTooltip
        tooltipRef={helpTooltipRef}
        buttonRef={helpButtonRef}
        toggleTooltip={toggleHelpTooltip}
        hideTooltip={hideHelpTooltip}
        otherTooltipRef={howToPlayTooltipRef}
        userImage={userImage}
      />
    </div>
  );
}

// GamePlay Component
function GamePlay({
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

export default function ShuffleMaster() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(3); // Default 3x3
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [selectingImage, setSelectingImage] = useState(true);
  const [gameBoardSize, setGameBoardSize] = useState<number>(500);

  // Use custom tooltip hooks
  const {
    tooltipRef: howToPlayTooltipRef,
    buttonRef: howToPlayButtonRef,
    toggleTooltip: toggleHowToPlayTooltip,
    hideTooltip: hideHowToPlayTooltip,
  } = useTooltip();

  const {
    tooltipRef: helpTooltipRef,
    buttonRef: helpButtonRef,
    toggleTooltip: toggleHelpTooltip,
    hideTooltip: hideHelpTooltip,
  } = useTooltip();

  // Handle board size changes
  const handleBoardSizeChange = useCallback((size: number) => {
    setGameBoardSize(size);
  }, []);

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
        <GameSetup
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          selectedPresetId={selectedPresetId}
          onImageSelect={handlePresetSelect}
          userImage={userImage}
          selectingImage={selectingImage}
          onStartGame={startGame}
          onSelectDifferentImage={selectDifferentImage}
        />
      ) : (
        userImage && (
          <GamePlay
            userImage={userImage}
            gridSize={gridSize}
            onReset={resetGame}
            gameBoardSize={gameBoardSize}
            onBoardSizeChange={handleBoardSizeChange}
            howToPlayTooltipRef={howToPlayTooltipRef}
            howToPlayButtonRef={howToPlayButtonRef}
            toggleHowToPlayTooltip={toggleHowToPlayTooltip}
            hideHowToPlayTooltip={hideHowToPlayTooltip}
            helpTooltipRef={helpTooltipRef}
            helpButtonRef={helpButtonRef}
            toggleHelpTooltip={toggleHelpTooltip}
            hideHelpTooltip={hideHelpTooltip}
          />
        )
      )}
    </div>
  );
}
