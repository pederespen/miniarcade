import { GameSettings } from "./types";

export const GAME_SETTINGS: GameSettings = {
  initialTime: 120, // seconds
  timeAddedPerWord: 20, // seconds
  wordLength: 5,
  maxAttempts: 5,
};

export const DEFAULT_BOARD_SIZE = {
  width: 350,
  height: 420,
};

export const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

export const ENTER_KEY = "ENTER";
export const BACKSPACE_KEY = "BACKSPACE";

export const LETTER_COLORS = {
  correct: "bg-green-500",
  "wrong-position": "bg-yellow-500",
  incorrect: "bg-gray-700",
  unused: "bg-gray-400",
};

// Word list that will be populated from the text file
export const WORD_LIST_5: string[] = [];
