"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Set to true for testing (one move to solve), false for regular gameplay
const DEV_MODE = false;

interface Tile {
  id: number;
  currentPos: number;
  isEmpty: boolean;
}

interface ShuffleGameProps {
  imageUrl: string;
  gridSize: number;
  onReset: () => void;
  onBoardSizeChange?: (size: number) => void;
}

export default function ShuffleMasterGame({
  imageUrl,
  gridSize,
  onReset,
  onBoardSizeChange,
}: ShuffleGameProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Remove default size and add sizeCalculated state
  const [boardSize, setBoardSize] = useState(0);
  const [sizeCalculated, setSizeCalculated] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const totalTiles = gridSize * gridSize;

  // Calculate responsive board size
  const updateBoardSize = useCallback(() => {
    if (!gameContainerRef.current) return;

    // Get the parent container width
    const parentElement = gameContainerRef.current.parentElement;
    if (!parentElement) return;

    // Get the actual available width from the parent element
    const containerWidth = parentElement.offsetWidth;

    // Set minimum and maximum sizes
    const minSize = Math.min(300, containerWidth * 0.9);
    const maxSize = 500;

    // Ensure board size stays within bounds
    const newSize = Math.max(minSize, Math.min(containerWidth * 0.95, maxSize));

    // Update the board size if it's significantly different
    if (Math.abs(newSize - boardSize) > 5 || !sizeCalculated) {
      setBoardSize(newSize);
      setSizeCalculated(true);
      if (onBoardSizeChange) {
        onBoardSizeChange(newSize);
      }
    }
  }, [boardSize, onBoardSizeChange, sizeCalculated]);

  // Force an immediate size calculation after the component is mounted
  useEffect(() => {
    // Add a slight delay to ensure the parent is rendered
    setTimeout(updateBoardSize, 0);
  }, [updateBoardSize]);

  // Set up resize observer to detect container size changes
  useEffect(() => {
    if (!gameContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateBoardSize();
    });

    const parentElement = gameContainerRef.current.parentElement;
    if (parentElement) {
      resizeObserver.observe(parentElement);
    }

    // Clean up on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateBoardSize]);

  // Also listen for window resize events
  useEffect(() => {
    window.addEventListener("resize", updateBoardSize);
    return () => {
      window.removeEventListener("resize", updateBoardSize);
    };
  }, [updateBoardSize]);

  // Initialize timer when game starts
  useEffect(() => {
    if (!isLoading && !isSolved && startTime === null) {
      setStartTime(Date.now());
    }
  }, [isLoading, isSolved, startTime]);

  // Update timer every second while game is in progress
  useEffect(() => {
    if (!isLoading && !isSolved && startTime !== null) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, isSolved, startTime]);

  // Fisher-Yates shuffle algorithm - for regular gameplay
  const shuffleTiles = useCallback(
    (tilesArray: Tile[]) => {
      // Start with a solved puzzle (already in order)
      // Then perform a series of random valid moves

      // The number of random moves to perform - adjust based on grid size for appropriate difficulty
      // More moves for larger puzzles
      const numMoves = gridSize * gridSize * 20; // e.g., 180 moves for a 3x3, 320 for a 4x4

      // Find the empty tile
      const emptyTileIndex = tilesArray.findIndex((t) => t.isEmpty);
      let emptyPos = tilesArray[emptyTileIndex].currentPos;

      // Perform random valid moves
      for (let i = 0; i < numMoves; i++) {
        // Get valid adjacent positions to the empty tile
        const validMoves = getValidMoves(emptyPos, gridSize);

        // Choose a random valid move
        const randomMoveIndex = Math.floor(Math.random() * validMoves.length);
        const tileToMovePos = validMoves[randomMoveIndex];

        // Find the tile at this position
        const tileToMoveIndex = tilesArray.findIndex(
          (t) => t.currentPos === tileToMovePos
        );

        // Swap positions
        tilesArray[tileToMoveIndex].currentPos = emptyPos;
        tilesArray[emptyTileIndex].currentPos = tileToMovePos;

        // Update empty position for next iteration
        emptyPos = tileToMovePos;
      }

      return tilesArray;
    },
    [gridSize]
  );

  // Helper function to get valid moves for the empty tile
  const getValidMoves = (emptyPos: number, size: number) => {
    const row = Math.floor(emptyPos / size);
    const col = emptyPos % size;
    const validMoves: number[] = [];

    // Check above
    if (row > 0) {
      validMoves.push(emptyPos - size);
    }

    // Check below
    if (row < size - 1) {
      validMoves.push(emptyPos + size);
    }

    // Check left
    if (col > 0) {
      validMoves.push(emptyPos - 1);
    }

    // Check right
    if (col < size - 1) {
      validMoves.push(emptyPos + 1);
    }

    return validMoves;
  };

  // Super simple test function - creates a solved puzzle with just the last two tiles swapped
  const devShuffleTiles = useCallback(
    (tilesArray: Tile[]) => {
      // Create a completely solved puzzle (everything in order)
      // Then just swap the last two tiles

      // The array is already ordered initially (tile.id === tile.currentPos)
      // so we only need to swap the last two positions

      // Get the indices of tiles that should go in the last two positions
      const lastTileIndex = tilesArray.findIndex(
        (t) => t.id === totalTiles - 1
      ); // Empty tile
      const secondLastTileIndex = tilesArray.findIndex(
        (t) => t.id === totalTiles - 2
      );

      if (lastTileIndex !== -1 && secondLastTileIndex !== -1) {
        // Swap their positions
        const temp = tilesArray[lastTileIndex].currentPos;
        tilesArray[lastTileIndex].currentPos =
          tilesArray[secondLastTileIndex].currentPos;
        tilesArray[secondLastTileIndex].currentPos = temp;
      }

      return tilesArray;
    },
    [totalTiles]
  );

  // Use useCallback to prevent re-creation on every render
  const initializeGame = useCallback(() => {
    setIsLoading(true);
    setMoves(0);
    setIsSolved(false);
    setStartTime(null);
    setEndTime(null);
    setElapsedTime(0);

    const initialTiles: Tile[] = [];

    // Create ordered tiles first
    for (let i = 0; i < totalTiles; i++) {
      initialTiles.push({
        id: i,
        currentPos: i,
        isEmpty: i === totalTiles - 1, // Last tile is empty
      });
    }

    // Use appropriate shuffle function based on DEV_MODE
    const shuffledTiles = DEV_MODE
      ? devShuffleTiles([...initialTiles])
      : shuffleTiles([...initialTiles]);

    // Since we're shuffling by making valid moves, the puzzle is guaranteed to be solvable
    // No need for solvability check or fixes

    setTiles(shuffledTiles);
    setIsLoading(false);
  }, [totalTiles, devShuffleTiles, shuffleTiles]);

  // Initialize tiles
  useEffect(() => {
    initializeGame();
  }, [gridSize, imageUrl, initializeGame]);

  // Check if a tile can be moved
  const canMoveTile = (tilePos: number, emptyPos: number) => {
    // Calculate row and column for both positions
    const tileRow = Math.floor(tilePos / gridSize);
    const tileCol = tilePos % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    // Check if tile is adjacent to empty space
    return (
      // Same row, adjacent column
      (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
      // Same column, adjacent row
      (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
    );
  };

  // Move a tile
  const moveTile = (tileIndex: number) => {
    if (isSolved) return;

    const newTiles = [...tiles];
    const emptyTile = newTiles.find((tile) => tile.isEmpty);

    if (!emptyTile) return;

    const tilePos = newTiles[tileIndex].currentPos;
    const emptyPos = emptyTile.currentPos;

    if (canMoveTile(tilePos, emptyPos)) {
      // Swap positions
      newTiles[tileIndex].currentPos = emptyPos;
      emptyTile.currentPos = tilePos;

      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if puzzle is solved
      const solved = newTiles.every((tile) => tile.id === tile.currentPos);
      if (solved) {
        setIsSolved(true);
        setEndTime(Date.now());
      }
    }
  };

  // Calculate tile size based on dynamic board size
  const tileSize = boardSize / gridSize;

  // Calculate tile position for CSS
  const getTilePosition = (pos: number) => {
    const row = Math.floor(pos / gridSize);
    const col = pos % gridSize;
    return {
      top: `${row * tileSize}px`,
      left: `${col * tileSize}px`,
    };
  };

  // Calculate background position for the image slice
  const getBackgroundPosition = (id: number) => {
    if (id === totalTiles - 1) return {}; // Empty tile

    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    return {
      backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
    };
  };

  // Format time in minutes and seconds
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Loading state needs the ref to be attached to properly calculate size
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full" ref={gameContainerRef}>
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  // Don't render the board until we've calculated its size
  if (!sizeCalculated || boardSize === 0) {
    return (
      <div className="flex flex-col items-center w-full" ref={gameContainerRef}>
        <div className="text-white">Calculating board size...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full" ref={gameContainerRef}>
      <div
        className="relative bg-black rounded-lg overflow-hidden shadow-lg border-2 border-white mx-auto"
        style={{
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          maxWidth: "100%",
          aspectRatio: "1/1",
        }}
      >
        {tiles.map((tile, index) => {
          // Only render non-empty tiles
          if (tile.isEmpty) return null;

          return (
            <div
              key={tile.id}
              onClick={() => moveTile(index)}
              className={`absolute cursor-pointer ${
                isSolved ? "opacity-100" : "hover:opacity-90"
              }`}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${boardSize}px ${boardSize}px`,
                ...getBackgroundPosition(tile.id),
                ...getTilePosition(tile.currentPos),
                boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.3)",
              }}
            />
          );
        })}
      </div>

      {/* Win popup modal */}
      {isSolved && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-indigo-900/90 border-2 border-cyan-400 rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transform backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                🎉 Puzzle Solved! 🎉
              </h3>

              <div className="bg-indigo-800/70 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center">
                  <span className="text-indigo-200">Moves</span>
                  <span className="text-indigo-200">Time</span>
                  <span className="text-white font-bold text-xl">{moves}</span>
                  <span className="text-white font-bold text-xl">
                    {endTime && startTime
                      ? formatTime(Math.floor((endTime - startTime) / 1000))
                      : formatTime(elapsedTime)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={initializeGame}
                  className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-bold cursor-pointer"
                >
                  Shuffle
                </button>
                <button
                  onClick={onReset}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold cursor-pointer"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
