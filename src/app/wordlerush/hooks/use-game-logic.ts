"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  GameBoard,
  UseGameLogicProps,
  GameLogicReturn,
  GameStats,
  WordRow,
} from "../types";
import {
  BACKSPACE_KEY,
  ENTER_KEY,
  GAME_SETTINGS,
  WORD_LIST,
} from "../utils/constants";

export function useGameLogic({
  setHighScore,
  highScore,
}: UseGameLogicProps): GameLogicReturn {
  // Game state
  const [settings, setSettings] = useState(GAME_SETTINGS);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [board, setBoard] = useState<GameBoard>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColIndex, setCurrentColIndex] = useState(0);
  const [keyboardState, setKeyboardState] = useState<
    Record<string, "correct" | "wrong-position" | "incorrect" | "unused">
  >({});
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    wordsCompleted: 0,
    timeLeft: settings.initialTime,
    gameOver: false,
    feedback: {
      showCorrect: false,
      pointsGained: 0,
      timeAdded: 0,
    },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  // State for invalid word feedback
  const [showInvalidWord, setShowInvalidWord] = useState(false);

  // Use ref instead of state for tracking used words to avoid re-renders
  const usedWordsRef = useRef<Set<string>>(new Set());

  // Initialize or reset the game board
  const initializeBoard = useCallback(() => {
    const { wordLength, maxAttempts } = settings;
    const newBoard: GameBoard = [];

    for (let row = 0; row < maxAttempts; row++) {
      const newRow: WordRow = [];
      for (let col = 0; col < wordLength; col++) {
        newRow.push({ char: "", status: "unused" });
      }
      newBoard.push(newRow);
    }

    return newBoard;
  }, [settings]);

  // Get a random word
  const getRandomWord = useCallback(() => {
    // Filter out words that have already been used
    const availableWords = WORD_LIST.filter(
      (word: string) => !usedWordsRef.current.has(word)
    );

    // If we've used all words, reset the used words set
    if (availableWords.length === 0) {
      console.log("[DEBUG] All words used, resetting used words set");
      usedWordsRef.current = new Set();
      return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    console.log("[DEBUG] Current word:", selectedWord);
    return selectedWord;
  }, []);

  // Reset the game state
  const resetGame = useCallback(() => {
    setSettings(GAME_SETTINGS);
    usedWordsRef.current = new Set(); // Reset used words when starting a new game
    const initialWord = getRandomWord();
    setCurrentWord(initialWord);
    console.log("[DEBUG] Game reset with word:", initialWord);
    setBoard(initializeBoard());
    setCurrentRowIndex(0);
    setCurrentColIndex(0);
    setKeyboardState({});
    setStats({
      score: 0,
      wordsCompleted: 0,
      timeLeft: GAME_SETTINGS.initialTime,
      gameOver: false,
      feedback: {
        showCorrect: false,
        pointsGained: 0,
        timeAdded: 0,
      },
    });
    setIsPlaying(true);
  }, [getRandomWord, initializeBoard]);

  // Initialize the game on component mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || stats.gameOver) return;

    const timer = setInterval(() => {
      setStats((prevStats) => {
        const newTimeLeft = prevStats.timeLeft - 0.1;

        if (newTimeLeft <= 0) {
          clearInterval(timer);

          // We'll handle the high score update in another effect
          return {
            ...prevStats,
            timeLeft: 0,
            gameOver: true,
          };
        }

        return {
          ...prevStats,
          timeLeft: newTimeLeft,
        };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, stats.gameOver]);

  // Separate effect to handle updating the high score when game is over
  useEffect(() => {
    if (stats.gameOver && stats.score > highScore) {
      // Use setTimeout to push this update to the next tick
      const timeoutId = setTimeout(() => {
        setHighScore(stats.score);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [stats.gameOver, stats.score, highScore, setHighScore]);

  // Function to check the current word attempt
  const checkWordAttempt = useCallback(() => {
    const currentRowLetters = board[currentRowIndex]
      .map((letter) => letter.char)
      .join("");

    // Check if input is a valid word (would normally check against a dictionary API)
    // For simplicity, we'll just check if all letters are filled
    if (currentRowLetters.length < settings.wordLength) {
      return false;
    }

    // Check if the word is in our word list
    if (!WORD_LIST.includes(currentRowLetters)) {
      // Show invalid word feedback
      setShowInvalidWord(true);

      // Hide feedback after 1.5 seconds
      setTimeout(() => {
        setShowInvalidWord(false);
      }, 1500);

      return false;
    }

    // Check the word against the target word
    const targetWordChars = currentWord.split("");
    const newBoard = [...board];
    const newRow: WordRow = [...newBoard[currentRowIndex]];
    const newKeyboardState = { ...keyboardState };

    // Create a letter frequency map for the target word
    const targetLetterCount: Record<string, number> = {};
    targetWordChars.forEach((char) => {
      targetLetterCount[char] = (targetLetterCount[char] || 0) + 1;
    });

    // First pass: Mark correct positions and count them
    const correctPositions: Record<string, number> = {};
    newRow.forEach((letterObj, index) => {
      const char = letterObj.char;
      if (char === targetWordChars[index]) {
        newRow[index].status = "correct";
        newKeyboardState[char] = "correct";
        correctPositions[char] = (correctPositions[char] || 0) + 1;
      } else {
        // Reset status for second pass
        newRow[index].status = "unused";
      }
    });

    // Second pass: Mark wrong positions or incorrect
    newRow.forEach((letterObj, index) => {
      const char = letterObj.char;

      // Skip letters already marked as correct
      if (newRow[index].status === "correct") {
        return;
      }

      // Check if this letter exists in the target word
      if (targetLetterCount[char]) {
        // Check if we have remaining instances of this letter to mark
        const usedCount = correctPositions[char] || 0;
        if (usedCount < targetLetterCount[char]) {
          newRow[index].status = "wrong-position";
          correctPositions[char] = usedCount + 1;

          // Update keyboard state if not already marked as correct
          if (newKeyboardState[char] !== "correct") {
            newKeyboardState[char] = "wrong-position";
          }
        } else {
          // All instances of this letter have been accounted for
          newRow[index].status = "incorrect";
          if (!newKeyboardState[char]) {
            newKeyboardState[char] = "incorrect";
          }
        }
      } else {
        // Letter doesn't exist in target word
        newRow[index].status = "incorrect";
        if (!newKeyboardState[char]) {
          newKeyboardState[char] = "incorrect";
        }
      }
    });

    newBoard[currentRowIndex] = newRow;
    setBoard(newBoard);
    setKeyboardState(newKeyboardState);

    // Check if word is correct
    const isCorrect = currentRowLetters === currentWord;

    if (isCorrect) {
      // Word solved! Update stats, add 20 seconds, and set a new target word
      const pointsGained = settings.wordLength * 10;
      const timeAdded = settings.timeAddedPerWord;

      // Add the current word to used words
      usedWordsRef.current.add(currentWord);

      // If we've used most words, reset the used words list
      if (usedWordsRef.current.size >= WORD_LIST.length * 0.8) {
        console.log("[DEBUG] Most words used, resetting used words set");
        usedWordsRef.current = new Set([currentWord]); // Keep only the current word
      }

      setStats((prev) => ({
        ...prev,
        score: prev.score + pointsGained,
        wordsCompleted: prev.wordsCompleted + 1,
        timeLeft: prev.timeLeft + timeAdded,
        feedback: {
          showCorrect: true,
          pointsGained: pointsGained,
          timeAdded: timeAdded,
        },
      }));

      // Reset feedback after 1.5 seconds
      setTimeout(() => {
        setStats((prev) => ({
          ...prev,
          feedback: {
            showCorrect: false,
            pointsGained: 0,
            timeAdded: 0,
          },
        }));
      }, 1500);

      console.log("[DEBUG] Word completed:", currentWord);
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      setBoard(initializeBoard());
      setCurrentRowIndex(0);
      setCurrentColIndex(0);
      setKeyboardState({}); // Reset keyboard state for the new word
    } else {
      // Move to next row if not the last attempt
      if (currentRowIndex < settings.maxAttempts - 1) {
        setCurrentRowIndex(currentRowIndex + 1);
        setCurrentColIndex(0);
      } else {
        // Failed all attempts for this word, move to next word
        console.log("[DEBUG] Failed all attempts for word:", currentWord);
        const newWord = getRandomWord();
        setCurrentWord(newWord);
        setBoard(initializeBoard());
        setCurrentRowIndex(0);
        setCurrentColIndex(0);
        setKeyboardState({}); // Reset keyboard state for the new word
      }
    }

    return true;
  }, [
    board,
    currentRowIndex,
    currentWord,
    getRandomWord,
    initializeBoard,
    keyboardState,
    settings,
  ]);

  // Handle key press
  const handleKeyPress = useCallback(
    (key: string) => {
      if (stats.gameOver || !isPlaying) return;

      const keyUpper = key.toUpperCase();

      // Handle special keys
      if (keyUpper === ENTER_KEY) {
        checkWordAttempt();
        return;
      }

      if (keyUpper === BACKSPACE_KEY) {
        if (currentColIndex > 0) {
          const newBoard = [...board];
          newBoard[currentRowIndex][currentColIndex - 1] = {
            char: "",
            status: "unused",
          };
          setBoard(newBoard);
          setCurrentColIndex(currentColIndex - 1);
        }
        return;
      }

      // Handle letter keys
      if (/^[A-Z]$/.test(keyUpper) && currentColIndex < settings.wordLength) {
        const newBoard = [...board];
        newBoard[currentRowIndex][currentColIndex] = {
          char: keyUpper,
          status: "unused",
        };
        setBoard(newBoard);
        setCurrentColIndex(currentColIndex + 1);
      }
    },
    [
      board,
      checkWordAttempt,
      currentColIndex,
      currentRowIndex,
      isPlaying,
      settings.wordLength,
      stats.gameOver,
    ]
  );

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleKeyPress(ENTER_KEY);
      } else if (e.key === "Backspace") {
        handleKeyPress(BACKSPACE_KEY);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  return {
    board,
    currentRowIndex,
    currentColIndex,
    keyboardState,
    stats,
    handleKeyPress,
    resetGame,
    currentSettings: settings,
    showInvalidWord,
  };
}
