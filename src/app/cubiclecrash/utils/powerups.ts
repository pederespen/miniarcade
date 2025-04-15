import { Powerup, PowerupType } from "../types";
import {
  POWERUP_SPAWN_CHANCE,
  POWERUP_DURATION,
  MIN_SCORE_FOR_POWERUPS,
  MIN_OBSTACLES_BETWEEN_POWERUPS,
} from "../constants";

/**
 * Interface for powerup management functions
 */
export interface PowerupManager {
  applyPowerup: (powerupType: PowerupType) => void;
  spawnPowerup: () => void;
  clearPowerupTimer: () => void;
}

/**
 * Creates powerup management functions
 */
export function createPowerupManager(
  setActivePowerup: (powerupType: PowerupType | null) => void,
  activePowerupRef: React.MutableRefObject<PowerupType | null>,
  powerupTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setPowerups: React.Dispatch<React.SetStateAction<Powerup[]>>,
  scoreRef: React.MutableRefObject<number>,
  obstaclesSinceLastPowerupRef: React.MutableRefObject<number>,
  gameStateRef: React.MutableRefObject<{
    isActive: boolean;
    gameOver: boolean;
    score: number;
    warmupActive: boolean;
    version: number;
  }>,
  boardSize: { width: number; height: number },
  scaleFactor: number
): PowerupManager {
  /**
   * Applies a powerup effect
   */
  const applyPowerup = (powerupType: PowerupType) => {
    // End any existing powerup
    if (powerupTimerRef.current) {
      clearTimeout(powerupTimerRef.current);
    }

    // Apply the new powerup to both state and ref
    setActivePowerup(powerupType);
    activePowerupRef.current = powerupType;

    // Set a timer to end the powerup effect
    powerupTimerRef.current = setTimeout(() => {
      setActivePowerup(null);
      activePowerupRef.current = null;
      powerupTimerRef.current = null;
    }, POWERUP_DURATION);
  };

  /**
   * Spawns a powerup at a random position
   */
  const spawnPowerup = () => {
    // Don't spawn powerups during warm-up period or if game is over
    if (
      gameStateRef.current.warmupActive ||
      gameStateRef.current.gameOver ||
      scoreRef.current < MIN_SCORE_FOR_POWERUPS
    )
      return;

    // Random powerup type
    const powerupTypes = [PowerupType.DOUBLE_POINTS, PowerupType.INVINCIBILITY];
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

    // Base sizes for powerups
    const baseSize = 40;
    const size = Math.floor(baseSize * scaleFactor);

    // Randomize y position - ensure better vertical spacing
    const minY = size * 1.2; // Add some margin from top
    const maxY = boardSize.height - size * 1.2; // Add some margin from bottom
    const y = Math.floor(Math.random() * (maxY - minY) + minY);

    const newPowerup: Powerup = {
      id: Date.now(),
      x: boardSize.width + size,
      y,
      width: size,
      height: size,
      type,
      collected: false,
    };

    setPowerups((prev) => [...prev, newPowerup]);
  };

  /**
   * Clears the powerup timer
   */
  const clearPowerupTimer = () => {
    if (powerupTimerRef.current) {
      clearTimeout(powerupTimerRef.current);
      powerupTimerRef.current = null;
    }
  };

  return {
    applyPowerup,
    spawnPowerup,
    clearPowerupTimer,
  };
}

/**
 * Checks if conditions are met to possibly spawn a powerup
 */
export function shouldTrySpawnPowerup(
  obstaclesSinceLastPowerupRef: React.MutableRefObject<number>,
  scoreRef: React.MutableRefObject<number>
): boolean {
  return (
    obstaclesSinceLastPowerupRef.current >= MIN_OBSTACLES_BETWEEN_POWERUPS &&
    Math.random() < POWERUP_SPAWN_CHANCE &&
    scoreRef.current >= MIN_SCORE_FOR_POWERUPS
  );
}
