import { useState, useEffect, useCallback } from "react";
import { Tile } from "../types";
import { canMoveTile, shuffleTiles, devShuffleTiles } from "../utils";
import { DEV_MODE } from "../types";

export default function useGameLogic(gridSize: number, imageUrl: string) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalTiles = gridSize * gridSize;

  // Initialize tiles
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
      ? devShuffleTiles([...initialTiles], totalTiles)
      : shuffleTiles([...initialTiles], gridSize);

    setTiles(shuffledTiles);
    setIsLoading(false);
  }, [gridSize, totalTiles]);

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

  // Initialize game when gridSize or imageUrl changes
  useEffect(() => {
    initializeGame();
  }, [gridSize, imageUrl, initializeGame]);

  // Move a tile
  const moveTile = useCallback(
    (tileIndex: number) => {
      if (isSolved) return;

      const newTiles = [...tiles];
      const emptyTile = newTiles.find((tile) => tile.isEmpty);

      if (!emptyTile) return;

      const tilePos = newTiles[tileIndex].currentPos;
      const emptyPos = emptyTile.currentPos;

      if (canMoveTile(tilePos, emptyPos, gridSize)) {
        // Swap positions
        newTiles[tileIndex].currentPos = emptyPos;
        emptyTile.currentPos = tilePos;

        setTiles(newTiles);
        setMoves((prev) => prev + 1);

        // Check if puzzle is solved
        const solved = newTiles.every((tile) => tile.id === tile.currentPos);
        if (solved) {
          setIsSolved(true);
          setEndTime(Date.now());
        }
      }
    },
    [tiles, isSolved, gridSize]
  );

  return {
    tiles,
    isLoading,
    moves,
    isSolved,
    startTime,
    endTime,
    elapsedTime,
    initializeGame,
    moveTile,
  };
}
