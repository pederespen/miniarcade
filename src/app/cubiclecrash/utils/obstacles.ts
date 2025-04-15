import { Obstacle, PowerupType } from "../types";
import {
  MIN_OBSTACLES_BETWEEN_POWERUPS,
  POWERUP_SPAWN_CHANCE,
  MIN_SCORE_FOR_POWERUPS,
} from "../constants";

// Moves obstacles based on current speed and checks for scoring
export function updateObstacles(
  obstacles: Obstacle[],
  obstacleSpeed: number,
  airplaneX: number,
  lastScoringObstacleId: number | null,
  activePowerup: PowerupType | null
): {
  updatedObstacles: Obstacle[];
  newLastScoringObstacleId: number | null;
  scoreIncrement: number;
} {
  let newLastScoringObstacleId = lastScoringObstacleId;
  let scoreIncrement = 0;

  // Process obstacles - move them left and check if they've been passed
  const updatedObstacles = obstacles
    .map((obstacle) => {
      // Move obstacle to the left
      const newX = obstacle.x - obstacleSpeed;

      // Check if obstacle is now passed
      const isPassed = obstacle.passed || newX + obstacle.width < airplaneX;

      // Update score if this is a newly passed obstacle
      if (
        isPassed &&
        !obstacle.passed &&
        obstacle.id !== lastScoringObstacleId
      ) {
        // Calculate points to add, handling double points
        const pointsToAdd = activePowerup === PowerupType.DOUBLE_POINTS ? 2 : 1;

        scoreIncrement += pointsToAdd;
        newLastScoringObstacleId = obstacle.id;
      }

      return {
        ...obstacle,
        x: newX,
        passed: isPassed,
      };
    })
    .filter((obstacle) => obstacle.x + obstacle.width > 0); // Remove obstacles that are off-screen

  return {
    updatedObstacles,
    newLastScoringObstacleId,
    scoreIncrement,
  };
}

// Create a new obstacle
export function createObstacle(
  boardWidth: number,
  boardHeight: number,
  scaleFactor: number
): Obstacle {
  const obstacleTypes = ["drawer", "coffee", "plant", "monitor", "fan"];
  const type = obstacleTypes[
    Math.floor(Math.random() * obstacleTypes.length)
  ] as Obstacle["type"];

  // Base sizes for reference board size
  let baseWidth = 70;
  let baseHeight = 60;

  if (type === "drawer") {
    baseWidth = 120;
    baseHeight = 40;
  } else if (type === "monitor") {
    baseWidth = 80;
    baseHeight = 70;
  } else if (type === "fan") {
    baseWidth = 60;
    baseHeight = 60;
  }

  // Scale obstacle size based on board size
  const width = Math.floor(baseWidth * scaleFactor);
  const height = Math.floor(baseHeight * scaleFactor);

  // Randomize y position - ensure better vertical spacing
  const minY = height * 1.2; // Add some margin from top
  const maxY = boardHeight - height * 1.2; // Add some margin from bottom
  const y = Math.floor(Math.random() * (maxY - minY) + minY);

  return {
    id: Date.now(),
    x: boardWidth + width,
    y,
    width,
    height,
    type,
    passed: false,
  };
}

// Decide whether to spawn a powerup after an obstacle
export function shouldSpawnPowerup(
  obstaclesSinceLastPowerup: number,
  currentScore: number
): boolean {
  return (
    obstaclesSinceLastPowerup >= MIN_OBSTACLES_BETWEEN_POWERUPS &&
    Math.random() < POWERUP_SPAWN_CHANCE &&
    currentScore >= MIN_SCORE_FOR_POWERUPS
  );
}
