import { GameSettings } from "../types";
import {
  SPEED_INCREASE_THRESHOLD,
  SPEED_INCREASE_FACTOR,
  SPAWN_RATE_DECREASE_FACTOR,
  MAX_DIFFICULTY_SCORE,
} from "../constants";

// Create base settings scaled to the board size
export function createBaseSettings(scaleFactor: number): GameSettings {
  return {
    gravity: 0.4 * scaleFactor,
    jumpPower: -7 * scaleFactor,
    obstacleSpeed: 4 * scaleFactor,
    spawnRate: 1500,
  };
}

// Calculate current game settings based on score
export function calculateGameSettings(
  baseSettings: GameSettings,
  score: number
): GameSettings {
  // Cap the score for difficulty calculation
  const cappedScore = Math.min(score, MAX_DIFFICULTY_SCORE);

  // Calculate how many thresholds we've crossed
  const thresholdsPassed = Math.floor(cappedScore / SPEED_INCREASE_THRESHOLD);

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
}

// Check if spawn rate has changed significantly enough to update timer
export function shouldUpdateSpawnRate(
  currentRate: number,
  newRate: number
): boolean {
  return Math.abs(newRate - currentRate) > 10;
}
