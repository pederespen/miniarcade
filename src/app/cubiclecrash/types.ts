export interface GameBoardSize {
  width: number;
  height: number;
}

// Remove the empty interface and use a Record type
export type GameSetupProps = Record<string, never>;

export interface GamePlayProps {
  onBoardSizeChange: (size: GameBoardSize) => void;
  highScore: number;
  setHighScore: (score: number) => void;
}

// Add UseGameLogicProps
export interface UseGameLogicProps {
  boardSize: GameBoardSize;
  setHighScore: (score: number) => void;
  highScore: number;
}

// Add GameContextType
export interface GameContextType {
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  handleBoardSizeChange: (size: GameBoardSize) => void;
  debugMode: boolean;
  setDebugMode: (mode: boolean) => void;
  countdown: number;
  setCountdown: (count: number) => void;
  gameVersion: number;
  incrementGameVersion: () => void;
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
  gameVersion: number;
  debug?: boolean;
  debugStats?: {
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

// Collision detection types
export interface CircleHitbox {
  x: number;
  y: number;
  radius: number;
}

export interface RectHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlantHitbox {
  pot: RectHitbox;
  foliage: CircleHitbox;
}

export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  p1: Point;
  p2: Point;
}
