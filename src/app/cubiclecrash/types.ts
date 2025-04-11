export type Difficulty = "easy" | "medium" | "hard";

export interface GameBoardSize {
  width: number;
  height: number;
}

export interface GameSetupProps {
  onStartGame: () => void;
  highScore: number;
}

export interface GamePlayProps {
  difficulty: Difficulty;
  onBoardSizeChange: (size: GameBoardSize) => void;
  highScore: number;
  setHighScore: (score: number) => void;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "drawer" | "coffee" | "plant" | "monitor" | "fan";
  passed: boolean;
}

export interface Airplane {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  velocity: number;
}

export interface GameBoardProps {
  airplane: Airplane;
  obstacles: Obstacle[];
  boardSize: GameBoardSize;
  score: number;
  gameOver: boolean;
  debug?: boolean;
}
