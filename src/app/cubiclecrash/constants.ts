// Constants for progressive difficulty
export const SPEED_INCREASE_THRESHOLD = 3; // Every 3 points
export const SPEED_INCREASE_FACTOR = 1.05; // 5% increase per threshold
export const SPAWN_RATE_DECREASE_FACTOR = 0.92; // 8% decrease per threshold
export const MAX_DIFFICULTY_SCORE = 75; // Cap difficulty increases at score of 75 (equivalent to tier 25)

// Powerup constants
export const POWERUP_SPAWN_CHANCE = 0.2; // 20% chance to spawn a powerup when obstacle spawns
export const POWERUP_DURATION = 8000; // 8 seconds powerup duration
export const MIN_SCORE_FOR_POWERUPS = 5; // Don't spawn powerups until player has at least 5 points
export const MIN_OBSTACLES_BETWEEN_POWERUPS = 5; // Minimum obstacles before another powerup can spawn

// Define warm-up duration in milliseconds
export const WARMUP_DURATION = 3000; // Exactly 3 seconds to match the countdown
