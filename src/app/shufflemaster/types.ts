// Types for ShuffleMaster game

export interface Tile {
  id: number;
  currentPos: number;
  isEmpty: boolean;
}

export interface ShuffleGameProps {
  imageUrl: string;
  gridSize: number;
  onReset: () => void;
  onBoardSizeChange?: (size: number) => void;
  isCustomImage?: boolean;
}
