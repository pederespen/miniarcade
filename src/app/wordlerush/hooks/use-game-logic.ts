"use client";

import { useCallback, useEffect, useState } from "react";
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
  WORD_LIST_5,
  WORD_LIST_6,
} from "../constants";

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
    const wordList = settings.wordLength === 5 ? WORD_LIST_5 : WORD_LIST_6;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const selectedWord = wordList[randomIndex];
    console.log("[DEBUG] Current word:", selectedWord);
    return selectedWord;
  }, [settings.wordLength]);

  // Reset the game state
  const resetGame = useCallback(() => {
    setSettings(GAME_SETTINGS);
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

          // If current score > high score, update high score
          if (prevStats.score > highScore) {
            setHighScore(prevStats.score);
          }

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
  }, [isPlaying, stats.gameOver, highScore, setHighScore]);

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

    // Check the word against the target word
    const targetWordChars = currentWord.split("");
    const newBoard = [...board];
    const newRow: WordRow = [...newBoard[currentRowIndex]];
    const newKeyboardState = { ...keyboardState };

    // First pass: check for exact matches
    targetWordChars.forEach((char, index) => {
      if (newRow[index].char === char) {
        newRow[index].status = "correct";
        newKeyboardState[char] = "correct";
      }
    });

    // Second pass: check for wrong positions
    targetWordChars.forEach((char, index) => {
      if (newRow[index].status === "correct") {
        return; // Skip letters already marked as correct
      }

      if (
        currentRowLetters.includes(char) &&
        targetWordChars.includes(newRow[index].char)
      ) {
        newRow[index].status = "wrong-position";
        if (newKeyboardState[newRow[index].char] !== "correct") {
          newKeyboardState[newRow[index].char] = "wrong-position";
        }
      } else {
        newRow[index].status = "incorrect";
        if (!newKeyboardState[newRow[index].char]) {
          newKeyboardState[newRow[index].char] = "incorrect";
        }
      }
    });

    newBoard[currentRowIndex] = newRow;
    setBoard(newBoard);
    setKeyboardState(newKeyboardState);

    // Check if word is correct
    const isCorrect = currentRowLetters === currentWord;

    if (isCorrect) {
      // Word solved! Update stats, add time, and set a new target word
      const pointsGained = settings.wordLength * 10;
      const timeAdded = settings.timeAddedPerWord;

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
  };
}
