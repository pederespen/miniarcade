export interface GameBoardSize {
  width: number;
  height: number;
}

export interface GameSetupProps {
  onStartGame: () => void;
  highScore: number;
}

export interface GamePlayProps {
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
  debugStats?: {
    difficultyTier: number;
    obstacleSpeed: number;
    spawnRate: number;
    fps?: number;
  };
}

export interface GameSettings {
  gravity: number;
  jumpPower: number;
  obstacleSpeed: number;
  spawnRate: number;
}

export interface GameLogicReturn {
  airplane: Airplane;
  obstacles: Obstacle[];
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  isWarmupActive: boolean;
  handleJump: () => void;
  resetGame: () => void;
  currentSettings: GameSettings;
}
