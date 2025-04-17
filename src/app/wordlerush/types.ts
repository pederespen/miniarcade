export type GameSetupProps = Record<string, never>;

export interface GamePlayProps {
  highScore: number;
  setHighScore: (score: number) => void;
}

export interface UseGameLogicProps {
  boardSize: {
    width: number;
    height: number;
  };
  setHighScore: (score: number) => void;
  highScore: number;
}

export interface GameContextType {
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  countdown: number;
  setCountdown: (count: number) => void;
  gameVersion: number;
  incrementGameVersion: () => void;
}

export interface Letter {
  char: string;
  status: "correct" | "wrong-position" | "incorrect" | "unused";
}

export type WordRow = Letter[];

export type GameBoard = WordRow[];

export interface KeyboardKey {
  char: string;
  status: "correct" | "wrong-position" | "incorrect" | "unused";
}

export interface GameStats {
  score: number;
  wordsCompleted: number;
  timeLeft: number;
  gameOver: boolean;
  feedback: {
    showCorrect: boolean;
    pointsGained: number;
    timeAdded: number;
  };
}

export interface GameBoardProps {
  board: GameBoard;
  currentRowIndex: number;
  currentColIndex: number;
  stats: GameStats;
  gameVersion: number;
}

export interface KeyboardProps {
  keyboardState: Record<
    string,
    "correct" | "wrong-position" | "incorrect" | "unused"
  >;
  onKeyPress: (key: string) => void;
}

export enum GameDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface GameSettings {
  difficulty: GameDifficulty;
  initialTime: number;
  timeAddedPerWord: number;
  wordLength: number;
  maxAttempts: number;
}

export interface GameLogicReturn {
  board: GameBoard;
  currentRowIndex: number;
  currentColIndex: number;
  keyboardState: Record<
    string,
    "correct" | "wrong-position" | "incorrect" | "unused"
  >;
  stats: GameStats;
  handleKeyPress: (key: string) => void;
  resetGame: () => void;
  currentSettings: GameSettings;
}
