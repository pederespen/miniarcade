import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Airplane,
  Obstacle,
  GameLogicReturn,
  GameSettings,
  Powerup,
  PowerupType,
  UseGameLogicProps,
} from "../types";
import {
  SPEED_INCREASE_THRESHOLD,
  SPEED_INCREASE_FACTOR,
  SPAWN_RATE_DECREASE_FACTOR,
  MAX_DIFFICULTY_SCORE,
  WARMUP_DURATION,
} from "../constants";
import { checkCollision, checkPowerupCollision } from "../utils/collision";
import { createPowerupManager } from "../utils/powerups";
import {
  createObstacle,
  shouldSpawnPowerup,
  updateObstacles,
} from "../utils/obstacles";

export default function useGameLogic({
  boardSize,
  setHighScore,
  highScore,
}: UseGameLogicProps) {
  // Game state - simplified
  const [gameState, setGameState] = useState({
    isActive: false,
    gameOver: false,
    score: 0,
    warmupActive: false, // New state to track warm-up period
    version: 0, // Version flag to help with stale closures
  });

  // Game elements
  const [airplane, setAirplane] = useState<Airplane>({
    x: 100,
    y: boardSize.height / 2,
    width: 60,
    height: 30,
    rotation: 0,
    velocity: 0.1,
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [activePowerup, setActivePowerup] = useState<PowerupType | null>(null);

  // Track current settings in state to ensure UI updates properly
  const [currentSettings, setCurrentSettings] = useState<GameSettings>();

  // Refs to track the latest obstacle ID that triggered a score and the current score
  // This ensures we don't double-count obstacles regardless of state updates
  const lastScoringObstacleRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  // Ref to track obstacles since last powerup
  const obstaclesSinceLastPowerupRef = useRef<number>(0);

  // Ref for active powerup timer
  const powerupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Warm-up timer reference
  const warmupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to track active powerup for consistent state access
  const activePowerupRef = useRef<PowerupType | null>(null);

  // Fixed game settings - base values
  const baseHeight = 480; // Reference height for scaling
  const scaleFactor = boardSize.height / baseHeight;

  // Initialize the game state - using a ref to prevent dependency issues
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Create powerup manager
  const powerupManager = useMemo(
    () =>
      createPowerupManager(
        setActivePowerup,
        activePowerupRef,
        powerupTimerRef,
        setPowerups,
        scoreRef,
        obstaclesSinceLastPowerupRef,
        gameStateRef,
        boardSize,
        scaleFactor
      ),
    [boardSize, scaleFactor]
  );

  // Base settings - wrapped in useMemo to prevent recreation on every render
  const baseSettings = useMemo(
    () => ({
      gravity: 0.4 * scaleFactor,
      jumpPower: -7 * scaleFactor,
      obstacleSpeed: 4 * scaleFactor,
      spawnRate: 1500,
    }),
    [scaleFactor]
  );

  // Calculate the current settings based on score and active powerups
  const calculateSettings = useCallback(
    (score: number): GameSettings => {
      // Cap the score for difficulty calculation
      const cappedScore = Math.min(score, MAX_DIFFICULTY_SCORE);

      // Calculate how many thresholds we've crossed
      const thresholdsPassed = Math.floor(
        cappedScore / SPEED_INCREASE_THRESHOLD
      );

      // Calculate speed multiplier
      const speedMultiplier = Math.pow(SPEED_INCREASE_FACTOR, thresholdsPassed);

      // Calculate spawn rate multiplier (changes every 2 thresholds)
      const spawnRateMultiplier = Math.pow(
        SPAWN_RATE_DECREASE_FACTOR,
        Math.floor(thresholdsPassed / 2)
      );

      return {
        gravity: baseSettings.gravity,
        jumpPower: baseSettings.jumpPower,
        obstacleSpeed: baseSettings.obstacleSpeed * speedMultiplier,
        spawnRate: baseSettings.spawnRate * spawnRateMultiplier,
      };
    },
    [baseSettings]
  );

  // Update current settings whenever score changes
  useEffect(() => {
    setCurrentSettings(calculateSettings(gameState.score));
  }, [gameState.score, calculateSettings]);

  // References for animation frame and timers
  const animationFrameRef = useRef<number | null>(null);
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Store the current spawn rate to detect changes
  const currentSpawnRateRef = useRef(
    currentSettings?.spawnRate || baseSettings.spawnRate
  );

  // Handle game over
  const handleGameOver = useCallback(() => {
    // Check if powerup is active and if it's invincibility
    if (activePowerupRef.current === PowerupType.INVINCIBILITY) {
      // Player is invincible, don't end the game
      return;
    }

    // Cancel any animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear any timers
    if (obstacleTimerRef.current) {
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = null;
    }

    // Clear powerup timer
    powerupManager.clearPowerupTimer();

    // Update high score if needed
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
    }

    // Set game over state
    setGameState((prev) => ({
      ...prev,
      gameOver: true,
    }));
  }, [highScore, setHighScore, activePowerupRef, powerupManager]);

  // Update activePowerupRef whenever activePowerup changes
  useEffect(() => {
    activePowerupRef.current = activePowerup;
  }, [activePowerup]);

  // Game loop function - declare early for use in startGame
  const gameLoop = useCallback(() => {
    // Get the current version to prevent stale closures
    const currentVersion = gameStateRef.current.version;

    if (gameStateRef.current.gameOver) {
      return;
    }

    // Calculate current settings based on the CURRENT score
    // This ensures we're always using the correct values, not stale ones
    const latestSettings = calculateSettings(scoreRef.current);

    // Update airplane with physics
    setAirplane((prev) => {
      // Prevent updates if the game version has changed
      if (currentVersion !== gameStateRef.current.version) return prev;

      // During warm-up, keep the plane flying straight with no gravity
      if (gameStateRef.current.warmupActive) {
        return {
          ...prev,
          rotation: 0, // Keep rotation level during warm-up
        };
      }

      // Normal physics after warm-up
      const newVelocity = prev.velocity + latestSettings.gravity;
      const newY = prev.y + newVelocity;
      let newRotation = prev.rotation + 1;

      if (newRotation > 45) newRotation = 45;

      // Check boundaries
      if (newY < 0 || newY > boardSize.height - prev.height) {
        // Schedule game over instead of calling it directly to avoid state updates during render
        setTimeout(() => handleGameOver(), 0);
        return prev;
      }

      // Create updated airplane state for collision checking
      const updatedAirplane = {
        ...prev,
        y: newY,
        velocity: newVelocity,
        rotation: newRotation,
      };

      // Instead of checking for collisions here, we'll let the effect in the main component handle it
      return updatedAirplane;
    });

    // Use the extracted updateObstacles function
    setObstacles((prev) => {
      // Prevent updates if the game version has changed
      if (currentVersion !== gameStateRef.current.version) return prev;

      // Process obstacles using the extracted function
      const { updatedObstacles, newLastScoringObstacleId, scoreIncrement } =
        updateObstacles(
          prev,
          latestSettings.obstacleSpeed,
          airplane.x,
          lastScoringObstacleRef.current,
          activePowerupRef.current
        );

      // Update score reference and last scoring obstacle reference if needed
      if (scoreIncrement > 0) {
        scoreRef.current += scoreIncrement;
        lastScoringObstacleRef.current = newLastScoringObstacleId;

        // Update React state (for display purposes)
        setTimeout(() => {
          setGameState((prevState) => ({
            ...prevState,
            score: scoreRef.current,
          }));
        }, 0);
      }

      return updatedObstacles;
    });

    // Move powerups based on current speed and check for collection
    setPowerups((prev) => {
      // Prevent updates if the game version has changed
      if (currentVersion !== gameStateRef.current.version) return prev;

      // Check if airplane has collected any powerups
      let hasCollectedPowerup = false;
      let collectedType: PowerupType | null = null;

      // Process powerups - move them left and check for collection
      const updatedPowerups = prev
        .map((powerup) => {
          // Move powerup to the left
          const newX = powerup.x - latestSettings.obstacleSpeed;

          // Check if powerup should be collected
          let isCollected = powerup.collected;

          if (!isCollected && checkPowerupCollision(airplane, powerup)) {
            isCollected = true;
            hasCollectedPowerup = true;
            collectedType = powerup.type;
          }

          return {
            ...powerup,
            x: newX,
            collected: isCollected,
          };
        })
        .filter((powerup) => powerup.x + powerup.width > 0); // Remove powerups that are off-screen

      // Apply collected powerup effect (in a setTimeout to avoid state update during render)
      if (hasCollectedPowerup && collectedType) {
        setTimeout(() => {
          powerupManager.applyPowerup(collectedType!);
        }, 0);
      }

      return updatedPowerups;
    });

    // Continue the loop only if the game version is still the same
    if (
      currentVersion === gameStateRef.current.version &&
      !gameStateRef.current.gameOver
    ) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [
    calculateSettings,
    boardSize.height,
    handleGameOver,
    airplane,
    powerupManager,
  ]);

  // Spawn obstacles - declare early for use in startGame
  const spawnObstacle = useCallback(() => {
    // Don't spawn obstacles during warm-up period or if game is over
    if (gameStateRef.current.warmupActive || gameStateRef.current.gameOver)
      return;

    // Use the extracted createObstacle function
    const newObstacle = createObstacle(
      boardSize.width,
      boardSize.height,
      scaleFactor
    );

    setObstacles((prev) => [...prev, newObstacle]);

    // Increment the obstacles since last powerup counter
    obstaclesSinceLastPowerupRef.current += 1;

    // Use the extracted shouldSpawnPowerup function
    if (
      shouldSpawnPowerup(obstaclesSinceLastPowerupRef.current, scoreRef.current)
    ) {
      powerupManager.spawnPowerup();
      // Reset the counter when a powerup is spawned
      obstaclesSinceLastPowerupRef.current = 0;
    }
  }, [boardSize.width, boardSize.height, scaleFactor, powerupManager]);

  // Start the game - need to define this before handleJump can reference it
  const startGame = useCallback(() => {
    // Increment the version to invalidate any stale closures
    const newVersion = (gameStateRef.current.version || 0) + 1;

    // Ensure all existing animation frames are canceled before starting a new game
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Try to cancel any potential lingering animation frames (for both mobile and desktop)
    try {
      const id = window.requestAnimationFrame(() => {});
      for (let i = id; i > id - 10; i--) {
        window.cancelAnimationFrame(i);
      }
    } catch {
      // Ignore errors, just a precaution
    }

    // RESET ALL GAME STATE IN THE CORRECT ORDER

    // 1. Reset score and tracking refs
    scoreRef.current = 0;
    lastScoringObstacleRef.current = null;
    obstaclesSinceLastPowerupRef.current = 0; // Reset the obstacles since last powerup counter

    // 2. Generate fresh settings object based on base values
    const initialGameSettings = {
      gravity: baseSettings.gravity,
      jumpPower: baseSettings.jumpPower,
      obstacleSpeed: baseSettings.obstacleSpeed, // Base speed, not multiplied
      spawnRate: baseSettings.spawnRate, // Base spawn rate, not multiplied
    };

    // 3. Update the settings state
    setCurrentSettings(initialGameSettings);

    // 4. Reset spawn rate reference
    currentSpawnRateRef.current = baseSettings.spawnRate;

    // 5. Clear all existing obstacles and powerups
    setObstacles([]);
    setPowerups([]);

    // 6. Clear any active powerup
    setActivePowerup(null);
    activePowerupRef.current = null;
    if (powerupTimerRef.current) {
      clearTimeout(powerupTimerRef.current);
      powerupTimerRef.current = null;
    }

    // 7. Update game state with score: 0
    setGameState({
      isActive: true,
      gameOver: false,
      score: 0,
      warmupActive: true, // Start with warm-up active
      version: newVersion,
    });

    // 8. Clear any existing timers
    if (obstacleTimerRef.current) {
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = null;
    }

    if (warmupTimerRef.current) {
      clearTimeout(warmupTimerRef.current);
      warmupTimerRef.current = null;
    }

    // 9. Reset airplane position and physics
    const baseAirplaneWidth = 60;
    const baseAirplaneHeight = 30;
    const airplaneWidth = Math.floor(baseAirplaneWidth * scaleFactor);
    const airplaneHeight = Math.floor(baseAirplaneHeight * scaleFactor);

    setAirplane({
      x: Math.floor(80 * scaleFactor),
      y: boardSize.height / 2,
      width: airplaneWidth,
      height: airplaneHeight,
      rotation: 0,
      velocity: 0,
    });

    // Force browser to handle any pending operations before continuing
    if (typeof window !== "undefined") {
      void window.document.body.offsetHeight;
    }

    // 10. Start a new animation frame with the reset state
    animationFrameRef.current = window.requestAnimationFrame(gameLoop);

    // 11. Set up warm-up timer with the GUARANTEED BASE SETTINGS
    warmupTimerRef.current = setTimeout(() => {
      if (gameStateRef.current.version === newVersion) {
        // End warm-up
        setGameState((prev) => ({ ...prev, warmupActive: false }));

        // Add a slight upward motion
        setAirplane((prev) => ({
          ...prev,
          velocity: -3 * scaleFactor,
          rotation: -10,
        }));

        // Spawn first obstacle and start timer with GUARANTEED BASE SPAWN RATE
        spawnObstacle();
        obstacleTimerRef.current = setInterval(
          spawnObstacle,
          baseSettings.spawnRate // Use baseSettings directly to avoid any potential stale closure issues
        );
      }
    }, WARMUP_DURATION);
  }, [boardSize.height, spawnObstacle, gameLoop, scaleFactor, baseSettings]);

  // Handle player jump
  const handleJump = useCallback(() => {
    // If game is over, clicking/tapping anywhere should restart the game immediately
    if (gameStateRef.current.gameOver) {
      // Restart the game with a direct call for both desktop and mobile
      startGame();
      return;
    }

    // If game not active, start it
    if (!gameStateRef.current.isActive) {
      startGame();
      return;
    }

    // Ignore jumps during warm-up period
    if (gameStateRef.current.warmupActive) {
      return;
    }

    const latestSettings = calculateSettings(gameStateRef.current.score);

    setAirplane((prev) => ({
      ...prev,
      velocity: latestSettings.jumpPower,
      rotation: -20,
    }));
  }, [calculateSettings, startGame]);

  // Collision detection effect - separate from the game loop to avoid state updates during render
  useEffect(() => {
    if (gameStateRef.current.gameOver) return;

    // Check for collisions with current airplane and obstacles
    const hasCollision = obstacles.some(
      (obstacle) => !obstacle.passed && checkCollision(airplane, obstacle)
    );

    if (hasCollision) {
      handleGameOver();
    }

    // Check for powerup collections
    powerups.forEach((powerup) => {
      if (!powerup.collected && checkPowerupCollision(airplane, powerup)) {
        // Mark powerup as collected
        setPowerups((prev) =>
          prev.map((p) => (p.id === powerup.id ? { ...p, collected: true } : p))
        );

        // Apply powerup effect
        powerupManager.applyPowerup(powerup.type);
      }
    });
  }, [
    calculateSettings,
    boardSize.height,
    handleGameOver,
    airplane,
    obstacles,
    powerups,
    powerupManager,
  ]);

  // Effect to update obstacle spawn rate when score changes
  useEffect(() => {
    // Skip if game is not active or is in warm-up
    if (
      !gameStateRef.current.isActive ||
      gameStateRef.current.warmupActive ||
      gameStateRef.current.gameOver
    ) {
      return;
    }

    // Get the updated spawn rate based on current score
    const updatedSettings = calculateSettings(gameStateRef.current.score);

    // Only update if spawn rate has changed significantly
    if (
      Math.abs(updatedSettings.spawnRate - currentSpawnRateRef.current) > 10
    ) {
      currentSpawnRateRef.current = updatedSettings.spawnRate;

      // Clear existing timer and create a new one with updated spawn rate
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
        obstacleTimerRef.current = setInterval(
          spawnObstacle,
          updatedSettings.spawnRate
        );
      }
    }
  }, [gameState.score, calculateSettings, spawnObstacle]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (warmupTimerRef.current) {
        clearTimeout(warmupTimerRef.current);
      }
      if (powerupTimerRef.current) {
        clearTimeout(powerupTimerRef.current);
      }
    };
  }, []);

  // Auto-start when board size is available
  useEffect(() => {
    const hasValidBoardSize = boardSize.width > 0 && boardSize.height > 0;
    if (
      hasValidBoardSize &&
      !gameStateRef.current.isActive &&
      !gameStateRef.current.gameOver
    ) {
      startGame();
    }
  }, [boardSize.width, boardSize.height, startGame]);

  return {
    airplane,
    obstacles,
    powerups,
    score: gameState.score,
    isPlaying: gameState.isActive,
    gameOver: gameState.gameOver,
    isWarmupActive: gameState.warmupActive,
    activePowerup,
    handleJump,
    resetGame: startGame,
    currentSettings: currentSettings || calculateSettings(gameState.score),
  } as GameLogicReturn;
}
