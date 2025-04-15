import { Tile } from "./types";

// Helper function to get valid moves for the empty tile
export const getValidMoves = (emptyPos: number, size: number): number[] => {
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

// Check if a tile can be moved
export const canMoveTile = (
  tilePos: number,
  emptyPos: number,
  gridSize: number
): boolean => {
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

// Format time in minutes and seconds
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const shuffleTiles = (tilesArray: Tile[], gridSize: number): Tile[] => {
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
};

// Super simple test function - creates a solved puzzle with just the last two tiles swapped
export const devShuffleTiles = (
  tilesArray: Tile[],
  totalTiles: number
): Tile[] => {
  // Create a completely solved puzzle (everything in order)
  // Then just swap the last two tiles

  // The array is already ordered initially (tile.id === tile.currentPos)
  // so only need to swap the last two positions

  // Get the indices of tiles that should go in the last two positions
  const lastTileIndex = tilesArray.findIndex((t) => t.id === totalTiles - 1); // Empty tile
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
};
