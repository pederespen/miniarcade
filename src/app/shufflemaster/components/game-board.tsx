import { Tile } from "../types";

interface GameBoardProps {
  tiles: Tile[];
  boardSize: number;
  gridSize: number;
  imageUrl: string;
  isSolved: boolean;
  onMoveTile: (tileIndex: number) => void;
}

export default function GameBoard({
  tiles,
  boardSize,
  gridSize,
  imageUrl,
  isSolved,
  onMoveTile,
}: GameBoardProps) {
  // Calculate tile size based on board size
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
    if (id === tiles.length - 1) return {}; // Empty tile

    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    return {
      backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
    };
  };

  return (
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
            onClick={() => onMoveTile(index)}
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
  );
}
