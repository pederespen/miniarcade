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

// Define powerup types
export enum PowerupType {
  DOUBLE_POINTS = "DOUBLE_POINTS",
  INVINCIBILITY = "INVINCIBILITY",
}

// Define the powerup interface
export interface Powerup {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerupType;
  collected: boolean;
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
  powerups: Powerup[];
  boardSize: GameBoardSize;
  score: number;
  gameOver: boolean;
  activePowerup: PowerupType | null;
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
  powerups: Powerup[];
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  isWarmupActive: boolean;
  activePowerup: PowerupType | null;
  handleJump: () => void;
  resetGame: () => void;
  currentSettings: GameSettings;
}
