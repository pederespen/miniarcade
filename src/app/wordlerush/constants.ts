import { GameSettings } from "./types";

// Unified game settings (no difficulty levels)
export const GAME_SETTINGS: GameSettings = {
  initialTime: 120, // seconds
  timeAddedPerWord: 20, // seconds
  wordLength: 5,
  maxAttempts: 5,
};

// Default game board dimensions
export const DEFAULT_BOARD_SIZE = {
  width: 350,
  height: 420,
};

// Keyboard layout
export const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

// Special keys
export const ENTER_KEY = "ENTER";
export const BACKSPACE_KEY = "BACKSPACE";

// Colors for letter statuses
export const LETTER_COLORS = {
  correct: "bg-green-500",
  "wrong-position": "bg-yellow-500",
  incorrect: "bg-gray-700",
  unused: "bg-gray-400",
};

// Common 5-letter words for the game - this is a small sample, would be extended in a real game
export const WORD_LIST_5 = [
  "APPLE",
  "BEACH",
  "CHAIR",
  "DANCE",
  "EARTH",
  "FOCUS",
  "GRAPE",
  "HORSE",
  "IGLOO",
  "JUICE",
  "KAYAK",
  "LEMON",
  "MUSIC",
  "NOVEL",
  "OCEAN",
  "PIANO",
  "QUEEN",
  "RIVER",
  "SMILE",
  "TABLE",
  "UNCLE",
  "VIRUS",
  "WATER",
  "XENON",
  "YOUTH",
  "ZEBRA",
  "BRAVE",
  "CLOCK",
  "DREAM",
  "FLEET",
  "HAPPY",
  "LIGHT",
  "SPACE",
  "GREEN",
  "HOUSE",
  "HEART",
  "CANDY",
  "BREAD",
  "FRONT",
  "SHARK",
  "CLOUD",
  "PLANT",
  "TIGER",
  "MOUSE",
  "PIZZA",
  "BACON",
  "CREAM",
  "STORM",
  "PAPER",
  "SNAKE",
  "MAGIC",
  "PHONE",
  "PEACE",
  "TRUCK",
  "WORLD",
  "FJORD",
  "WALTZ",
  "NYMPH",
  "ONYX",
  "QUARK",
  "IVORY",
  "GLYPH",
  "AZURE",
  "CYNIC",
  "LYNX",
  "KHAKI",
  "JOUST",
  "PSYCH",
  "ZESTY",
  "WHISK",
  "VEXED",
  "QUELL",
  "OXIDE",
  "EBONY",
  "UMBRA",
];
