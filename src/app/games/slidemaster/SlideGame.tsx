"use client";

import { useState, useEffect } from "react";

interface Tile {
  id: number;
  currentPos: number;
  isEmpty: boolean;
}

interface SlideGameProps {
  imageUrl: string;
  gridSize: number;
  onReset: () => void;
}

export default function SlideGame({
  imageUrl,
  gridSize,
  onReset,
}: SlideGameProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  const totalTiles = gridSize * gridSize;

  // Initialize tiles
  useEffect(() => {
    initializeGame();
  }, [gridSize, imageUrl]);

  const initializeGame = () => {
    setIsLoading(true);
    setMoves(0);
    setIsSolved(false);

    const initialTiles: Tile[] = [];

    // Create ordered tiles first
    for (let i = 0; i < totalTiles; i++) {
      initialTiles.push({
        id: i,
        currentPos: i,
        isEmpty: i === totalTiles - 1, // Last tile is empty
      });
    }

    // Shuffle tiles
    const shuffledTiles = shuffleTiles([...initialTiles]);

    // Make sure the puzzle is solvable
    if (!isSolvable(shuffledTiles, gridSize)) {
      // Swap two non-empty tiles to make it solvable
      const tile1 = shuffledTiles.findIndex((t) => !t.isEmpty);
      const tile2 = shuffledTiles.findIndex(
        (t, i) => !t.isEmpty && i !== tile1
      );

      // Swap their positions
      const temp = shuffledTiles[tile1].currentPos;
      shuffledTiles[tile1].currentPos = shuffledTiles[tile2].currentPos;
      shuffledTiles[tile2].currentPos = temp;
    }

    setTiles(shuffledTiles);
    setIsLoading(false);
  };

  // Check if the puzzle is solvable (using inversion count)
  const isSolvable = (tiles: Tile[], size: number) => {
    // Convert to 1D array without empty tile
    const flatTiles = tiles.filter((t) => !t.isEmpty).map((t) => t.id);

    // Count inversions
    let inversions = 0;
    for (let i = 0; i < flatTiles.length; i++) {
      for (let j = i + 1; j < flatTiles.length; j++) {
        if (flatTiles[i] > flatTiles[j]) {
          inversions++;
        }
      }
    }

    // Empty tile's row position from bottom (0-indexed)
    const emptyTilePos = tiles.find((t) => t.isEmpty)!.currentPos;
    const emptyRow = Math.floor(emptyTilePos / size);
    const emptyRowFromBottom = size - 1 - emptyRow;

    // For odd grid size, solvable if inversions even
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    }
    // For even grid size, solvable if:
    // (inversions odd && empty on even row from bottom) || (inversions even && empty on odd row from bottom)
    else {
      return (
        (inversions % 2 === 1 && emptyRowFromBottom % 2 === 0) ||
        (inversions % 2 === 0 && emptyRowFromBottom % 2 === 1)
      );
    }
  };

  // Fisher-Yates shuffle algorithm
  const shuffleTiles = (tilesArray: Tile[]) => {
    for (let i = tilesArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap positions, not IDs
      const temp = tilesArray[i].currentPos;
      tilesArray[i].currentPos = tilesArray[j].currentPos;
      tilesArray[j].currentPos = temp;
    }
    return tilesArray;
  };

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
      }
    }
  };

  // Calculate tile size based on container size
  const tileSize = 300 / gridSize;

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

  if (isLoading) {
    return <div className="text-white">Loading game...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-sm mb-4">
        <div className="text-cyan-400">Moves: {moves}</div>
        <button
          onClick={() => setShowNumbers(!showNumbers)}
          className="text-indigo-300 hover:text-indigo-100"
        >
          {showNumbers ? "Hide Numbers" : "Show Numbers"}
        </button>
      </div>

      <div
        className="relative bg-indigo-900 rounded-lg overflow-hidden shadow-lg"
        style={{
          width: `${gridSize * tileSize}px`,
          height: `${gridSize * tileSize}px`,
        }}
      >
        {tiles.map(
          (tile, index) =>
            !tile.isEmpty && (
              <div
                key={tile.id}
                onClick={() => moveTile(index)}
                className={`absolute cursor-pointer transition-all duration-150 ${
                  isSolved ? "opacity-100" : "hover:opacity-90"
                }`}
                style={{
                  width: `${tileSize}px`,
                  height: `${tileSize}px`,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${gridSize * tileSize}px ${
                    gridSize * tileSize
                  }px`,
                  ...getBackgroundPosition(tile.id),
                  ...getTilePosition(tile.currentPos),
                  boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.3)",
                }}
              >
                {showNumbers && (
                  <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                    {tile.id + 1}
                  </span>
                )}
              </div>
            )
        )}
      </div>

      {isSolved && (
        <div className="mt-4 p-4 bg-cyan-500 text-white font-bold rounded-lg text-center">
          <p className="mb-2">🎉 Puzzle Solved! 🎉</p>
          <p>You completed it in {moves} moves!</p>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded"
        >
          Shuffle
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          New Image
        </button>
      </div>
    </div>
  );
}
