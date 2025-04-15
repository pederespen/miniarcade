import { Airplane, GameSettings } from "../types";

// Updates airplane position, velocity and rotation based on physics
export function updateAirplanePhysics(
  airplane: Airplane,
  settings: GameSettings,
  boardHeight: number,
  warmupActive: boolean
): { updatedAirplane: Airplane; outOfBounds: boolean } {
  // During warm-up, keep the plane flying straight with no gravity
  if (warmupActive) {
    return {
      updatedAirplane: {
        ...airplane,
        rotation: 0, // Keep rotation level during warm-up
      },
      outOfBounds: false,
    };
  }

  // Normal physics after warm-up
  const newVelocity = airplane.velocity + settings.gravity;
  const newY = airplane.y + newVelocity;
  let newRotation = airplane.rotation + 1;

  if (newRotation > 45) newRotation = 45;

  // Check boundaries
  const outOfBounds = newY < 0 || newY > boardHeight - airplane.height;

  // Create updated airplane state
  const updatedAirplane = {
    ...airplane,
    y: newY,
    velocity: newVelocity,
    rotation: newRotation,
  };

  return { updatedAirplane, outOfBounds };
}

// Apply a jump to the airplane
export function handleAirplaneJump(
  airplane: Airplane,
  jumpPower: number
): Airplane {
  return {
    ...airplane,
    velocity: jumpPower,
    rotation: -20,
  };
}

// Create initial airplane based on board size and scale
export function createInitialAirplane(
  boardHeight: number,
  scaleFactor: number
): Airplane {
  const baseAirplaneWidth = 60;
  const baseAirplaneHeight = 30;
  const airplaneWidth = Math.floor(baseAirplaneWidth * scaleFactor);
  const airplaneHeight = Math.floor(baseAirplaneHeight * scaleFactor);

  return {
    x: Math.floor(80 * scaleFactor),
    y: boardHeight / 2,
    width: airplaneWidth,
    height: airplaneHeight,
    rotation: 0,
    velocity: 0,
  };
}

// Handle airplane warm-up end (adds slight upward motion)
export function applyWarmupEndMotion(
  airplane: Airplane,
  scaleFactor: number
): Airplane {
  return {
    ...airplane,
    velocity: -3 * scaleFactor,
    rotation: -10,
  };
}
