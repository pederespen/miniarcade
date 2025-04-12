import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Airplane,
  Obstacle,
  GameBoardSize,
  GameLogicReturn,
  GameSettings,
} from "../types";

interface UseGameLogicProps {
  boardSize: GameBoardSize;
  setHighScore: (score: number) => void;
  highScore: number;
}

// Constants for progressive difficulty
const SPEED_INCREASE_THRESHOLD = 3; // Every 3 points
const SPEED_INCREASE_FACTOR = 1.05; // 5% increase per threshold
const SPAWN_RATE_DECREASE_FACTOR = 0.92; // 8% decrease per threshold
const MAX_DIFFICULTY_SCORE = 75; // Cap difficulty increases at score of 75 (equivalent to tier 25)

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

  // Track current settings in state to ensure UI updates properly
  const [currentSettings, setCurrentSettings] = useState<GameSettings>();

  // Refs to track the latest obstacle ID that triggered a score and the current score
  // This ensures we don't double-count obstacles regardless of state updates
  const lastScoringObstacleRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  // Fixed game settings - base values
  const baseHeight = 480; // Reference height for scaling
  const scaleFactor = boardSize.height / baseHeight;

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

  // Initialize the game state - using a ref to prevent dependency issues
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Define types for obstacle hitboxes
  interface CircleHitbox {
    x: number;
    y: number;
    radius: number;
  }

  interface RectHitbox {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface PlantHitbox {
    pot: RectHitbox;
    foliage: CircleHitbox;
  }

  // Define types for geometric calculations
  interface Point {
    x: number;
    y: number;
  }

  interface LineSegment {
    p1: Point;
    p2: Point;
  }

  // Helper function to check if a point is inside a rectangle
  const pointInRectangle = useCallback(
    (point: Point, rect: RectHitbox): boolean => {
      return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
      );
    },
    []
  );

  // Helper function to calculate distance between a point and a circle
  const distance = useCallback((point: Point, circle: CircleHitbox): number => {
    return Math.sqrt(
      Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2)
    );
  }, []);

  // Helper function to get appropriate hitbox for different obstacle types
  const getObstacleHitbox = useCallback((obstacle: Obstacle): RectHitbox => {
    switch (obstacle.type) {
      case "drawer":
        return {
          x: obstacle.x + obstacle.width * 0.05,
          y: obstacle.y + obstacle.height * 0.15,
          width: obstacle.width * 0.9,
          height: obstacle.height * 0.6,
        };

      case "coffee":
        return {
          x: obstacle.x + obstacle.width * 0.25 - 2,
          y: obstacle.y + obstacle.height * 0.2,
          width: obstacle.width * 0.5 + 4,
          height: obstacle.height * 0.7,
        };

      case "monitor":
        return {
          x: obstacle.x + obstacle.width * 0.125,
          y: obstacle.y + obstacle.height * 0.125,
          width: obstacle.width * 0.75,
          height: obstacle.height * 0.7,
        };

      default:
        // Default slightly smaller hitbox for other objects
        return {
          x: obstacle.x + obstacle.width * 0.1,
          y: obstacle.y + obstacle.height * 0.1,
          width: obstacle.width * 0.8,
          height: obstacle.height * 0.8,
        };
    }
  }, []);

  // Helper function for line segment to line segment intersection
  const lineLineIntersect = useCallback(
    (line1: LineSegment, line2: LineSegment): boolean => {
      const det =
        (line1.p2.x - line1.p1.x) * (line2.p2.y - line2.p1.y) -
        (line1.p2.y - line1.p1.y) * (line2.p2.x - line2.p1.x);

      if (det === 0) {
        return false; // Lines are parallel
      }

      const lambda =
        ((line2.p2.y - line2.p1.y) * (line2.p2.x - line1.p1.x) +
          (line2.p1.x - line2.p2.x) * (line2.p2.y - line1.p1.y)) /
        det;
      const gamma =
        ((line1.p1.y - line1.p2.y) * (line2.p2.x - line1.p1.x) +
          (line1.p2.x - line1.p1.x) * (line2.p2.y - line1.p1.y)) /
        det;

      return 0 <= lambda && lambda <= 1 && 0 <= gamma && gamma <= 1;
    },
    []
  );

  // Helper function for line segment to rectangle intersection
  const lineRectIntersect = useCallback(
    (edge: LineSegment, rect: RectHitbox): boolean => {
      // Rectangle edges
      const rectEdges: LineSegment[] = [
        // Top edge
        {
          p1: { x: rect.x, y: rect.y },
          p2: { x: rect.x + rect.width, y: rect.y },
        },
        // Right edge
        {
          p1: { x: rect.x + rect.width, y: rect.y },
          p2: { x: rect.x + rect.width, y: rect.y + rect.height },
        },
        // Bottom edge
        {
          p1: { x: rect.x, y: rect.y + rect.height },
          p2: { x: rect.x + rect.width, y: rect.y + rect.height },
        },
        // Left edge
        {
          p1: { x: rect.x, y: rect.y },
          p2: { x: rect.x, y: rect.y + rect.height },
        },
      ];

      // Check if the line segment intersects with any edge of the rectangle
      return rectEdges.some((rectEdge) => lineLineIntersect(edge, rectEdge));
    },
    [lineLineIntersect]
  );

  // Helper function for line segment to circle intersection
  const lineCircleIntersect = useCallback(
    (edge: LineSegment, circle: CircleHitbox, radius: number): boolean => {
      // Vector from p1 to p2
      const v1 = { x: edge.p2.x - edge.p1.x, y: edge.p2.y - edge.p1.y };
      // Vector from p1 to circle center
      const v2 = { x: circle.x - edge.p1.x, y: circle.y - edge.p1.y };

      // Length of the line segment
      const segmentLength = Math.sqrt(v1.x * v1.x + v1.y * v1.y);

      // Unit vector of v1
      const v1Unit = { x: v1.x / segmentLength, y: v1.y / segmentLength };

      // Projection of v2 onto v1
      const projection = v2.x * v1Unit.x + v2.y * v1Unit.y;

      // Get the closest point on the line segment to the circle center
      let closestPoint: Point;

      if (projection < 0) {
        closestPoint = edge.p1;
      } else if (projection > segmentLength) {
        closestPoint = edge.p2;
      } else {
        closestPoint = {
          x: edge.p1.x + v1Unit.x * projection,
          y: edge.p1.y + v1Unit.y * projection,
        };
      }

      // Check if the closest point is within the radius of the circle
      const dist = Math.sqrt(
        Math.pow(closestPoint.x - circle.x, 2) +
          Math.pow(closestPoint.y - circle.y, 2)
      );

      return dist < radius;
    },
    []
  );

  // More accurate collision detection using a better hitbox approach
  const checkCollision = useCallback(
    (plane: Airplane, obstacle: Obstacle): boolean => {
      // Define the actual shape of the paper airplane as a triangle
      // with 3 points for more accurate collision detection
      const planeCenter = {
        x: plane.x + plane.width / 2,
        y: plane.y + plane.height / 2,
      };

      // Calculate the rotated triangle points of the paper airplane
      const angleRad = (plane.rotation * Math.PI) / 180;
      const cosAngle = Math.cos(angleRad);
      const sinAngle = Math.sin(angleRad);

      // Define the triangle points relative to center - making the triangle slightly larger
      // for better collision sensitivity
      const rightTip = {
        x: plane.width * 0.45, // Slightly larger tip (was 0.4)
        y: 0,
      };

      const topLeft = {
        x: -plane.width * 0.45, // Slightly larger left edge (was 0.4)
        y: -plane.height * 0.45, // Slightly larger top edge (was 0.4)
      };

      const bottomLeft = {
        x: -plane.width * 0.45, // Slightly larger left edge (was 0.4)
        y: plane.height * 0.45, // Slightly larger bottom edge (was 0.4)
      };

      // Rotate the points based on plane rotation
      const rotatePoint = (point: { x: number; y: number }) => {
        return {
          x: planeCenter.x + (point.x * cosAngle - point.y * sinAngle),
          y: planeCenter.y + (point.x * sinAngle + point.y * cosAngle),
        };
      };

      // Get actual points after rotation
      const p1 = rotatePoint(rightTip);
      const p2 = rotatePoint(topLeft);
      const p3 = rotatePoint(bottomLeft);

      // Get the triangle edges as line segments
      const edges: LineSegment[] = [
        { p1, p2 }, // Top edge
        { p1: p2, p2: p3 }, // Left edge
        { p1: p3, p2: p1 }, // Bottom edge
      ];

      // Handle different obstacle types with appropriate hitboxes
      switch (obstacle.type) {
        case "fan": {
          // For circular objects, we'll use a circular hitbox
          const radius = obstacle.width * 0.37;
          const center: CircleHitbox = {
            x: obstacle.x + obstacle.width / 2,
            y: obstacle.y + obstacle.height / 3,
            radius: radius,
          };

          // Circle vs. Triangle check - first do a rough bounding box check
          const roughCheck =
            planeCenter.x - plane.width / 2 < center.x + radius &&
            planeCenter.x + plane.width / 2 > center.x - radius &&
            planeCenter.y - plane.height / 2 < center.y + radius &&
            planeCenter.y + plane.height / 2 > center.y - radius;

          if (!roughCheck) return false;

          // Do a more accurate point-to-circle check
          const distanceToP1 = Math.sqrt(
            Math.pow(p1.x - center.x, 2) + Math.pow(p1.y - center.y, 2)
          );
          const distanceToP2 = Math.sqrt(
            Math.pow(p2.x - center.x, 2) + Math.pow(p2.y - center.y, 2)
          );
          const distanceToP3 = Math.sqrt(
            Math.pow(p3.x - center.x, 2) + Math.pow(p3.y - center.y, 2)
          );

          // Also check if any edge of the triangle intersects with the circle
          const edgeIntersection = edges.some((edge) =>
            lineCircleIntersect(edge, center, radius)
          );

          return (
            distanceToP1 < radius ||
            distanceToP2 < radius ||
            distanceToP3 < radius ||
            edgeIntersection
          );
        }

        case "plant": {
          // Upper part is circular, lower part is rectangular
          const plantHitbox: PlantHitbox = {
            pot: {
              x: obstacle.x + obstacle.width * 0.25,
              y: obstacle.y + obstacle.height * 0.5 + 5,
              width: obstacle.width * 0.5,
              height: obstacle.height * 0.5 - 5,
            },
            foliage: {
              x: obstacle.x + obstacle.width * 0.5,
              y: obstacle.y + obstacle.height * 0.3,
              radius: obstacle.width * 0.4,
            },
          };

          // Check collision with pot (rectangle)
          const potCollision =
            pointInRectangle(p1, plantHitbox.pot) ||
            pointInRectangle(p2, plantHitbox.pot) ||
            pointInRectangle(p3, plantHitbox.pot) ||
            edges.some((edge) => lineRectIntersect(edge, plantHitbox.pot));

          // Check collision with foliage (circle)
          const foliageCollision =
            distance(p1, plantHitbox.foliage) < plantHitbox.foliage.radius ||
            distance(p2, plantHitbox.foliage) < plantHitbox.foliage.radius ||
            distance(p3, plantHitbox.foliage) < plantHitbox.foliage.radius ||
            edges.some((edge) =>
              lineCircleIntersect(
                edge,
                plantHitbox.foliage,
                plantHitbox.foliage.radius
              )
            );

          return potCollision || foliageCollision;
        }

        case "coffee": {
          // Handle coffee mug with two parts: main body and handle
          // Main mug body (rectangle)
          const mugBody: RectHitbox = {
            x: obstacle.x + obstacle.width * 0.25 - 2,
            y: obstacle.y + obstacle.height * 0.2,
            width: obstacle.width * 0.5 + 4,
            height: obstacle.height * 0.7,
          };

          // Check collision with mug body
          const bodyCollision =
            pointInRectangle(p1, mugBody) ||
            pointInRectangle(p2, mugBody) ||
            pointInRectangle(p3, mugBody) ||
            edges.some((edge) => lineRectIntersect(edge, mugBody));

          // Mug handle (circular arc)
          const handleCenter: CircleHitbox = {
            x: obstacle.x + obstacle.width * 0.75 + 2,
            y: obstacle.y + obstacle.height * 0.5,
            radius: obstacle.width * 0.16,
          };

          // Check collision with handle
          const handleCollision =
            distance(p1, handleCenter) < handleCenter.radius ||
            distance(p2, handleCenter) < handleCenter.radius ||
            distance(p3, handleCenter) < handleCenter.radius ||
            edges.some((edge) =>
              lineCircleIntersect(edge, handleCenter, handleCenter.radius)
            );

          return bodyCollision || handleCollision;
        }

        case "monitor": {
          // Handle monitor with screen and stand
          // Monitor screen (main part)
          const screen: RectHitbox = {
            x: obstacle.x + obstacle.width * 0.125,
            y: obstacle.y + obstacle.height * 0.125,
            width: obstacle.width * 0.75,
            height: obstacle.height * 0.7,
          };

          // Monitor stand
          const stand: RectHitbox = {
            x: obstacle.x + obstacle.width * 0.5 - obstacle.width * 0.0625,
            y: obstacle.y + obstacle.height * 0.8,
            width: obstacle.width * 0.125,
            height: obstacle.height * 0.17,
          };

          // Check collision with screen
          const screenCollision =
            pointInRectangle(p1, screen) ||
            pointInRectangle(p2, screen) ||
            pointInRectangle(p3, screen) ||
            edges.some((edge) => lineRectIntersect(edge, screen));

          // Check collision with stand
          const standCollision =
            pointInRectangle(p1, stand) ||
            pointInRectangle(p2, stand) ||
            pointInRectangle(p3, stand) ||
            edges.some((edge) => lineRectIntersect(edge, stand));

          return screenCollision || standCollision;
        }

        default: {
          // For other obstacles, use a simplified rectangular hitbox
          const rectHitbox: RectHitbox = getObstacleHitbox(obstacle);

          // Check if any point of the triangle is inside the rectangle or
          // if any edge of the triangle intersects with the rectangle
          return (
            pointInRectangle(p1, rectHitbox) ||
            pointInRectangle(p2, rectHitbox) ||
            pointInRectangle(p3, rectHitbox) ||
            edges.some((edge) => lineRectIntersect(edge, rectHitbox))
          );
        }
      }
    },
    [
      getObstacleHitbox,
      pointInRectangle,
      distance,
      lineCircleIntersect,
      lineRectIntersect,
    ]
  );

  // Handle game over
  const handleGameOver = useCallback(() => {
    if (gameStateRef.current.gameOver) return; // Prevent multiple calls

    // Force cancellation of any existing animation frame first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setGameState((prev) => ({ ...prev, isActive: false, gameOver: true }));

    // Clear all timers
    if (obstacleTimerRef.current) {
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = null;
    }

    if (warmupTimerRef.current) {
      clearTimeout(warmupTimerRef.current);
      warmupTimerRef.current = null;
    }

    // Update high score
    if (gameStateRef.current.score > highScore) {
      setHighScore(gameStateRef.current.score);
    }
  }, [highScore, setHighScore]);

  // Define warm-up duration in milliseconds
  const WARMUP_DURATION = 3000; // Exactly 3 seconds to match the countdown

  // Warm-up timer reference
  const warmupTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Only update obstacles if warm-up is complete and game version hasn't changed
    if (
      !gameStateRef.current.warmupActive &&
      currentVersion === gameStateRef.current.version
    ) {
      // Update obstacles with simplified state access
      setObstacles((prev) => {
        // Prevent updates if the game version has changed
        if (currentVersion !== gameStateRef.current.version) return prev;

        let scoredThisFrame = false;

        const updatedObstacles = prev.map((obstacle) => {
          // Move obstacle - ALWAYS use the latest settings to ensure proper speed
          const newX = obstacle.x - latestSettings.obstacleSpeed;
          let { passed } = obstacle;

          // Check if obstacle just passed the airplane and we haven't scored from it before
          if (
            !passed &&
            newX + obstacle.width < airplane.x &&
            lastScoringObstacleRef.current !== obstacle.id &&
            !scoredThisFrame
          ) {
            // Mark this obstacle as passed
            passed = true;
            scoredThisFrame = true;

            // Store the ID of this obstacle so we never count it again
            lastScoringObstacleRef.current = obstacle.id;

            // Increment our score counter (separate from React state)
            scoreRef.current += 1;

            // Sync the React state with our score counter
            // The settings will be updated via useEffect when score changes
            setGameState((prevState) => ({
              ...prevState,
              score: scoreRef.current,
            }));
          } else if (!passed && newX + obstacle.width < airplane.x) {
            // If we already scored this frame, just mark as passed without counting
            passed = true;
          }

          // Create updated obstacle state
          return { ...obstacle, x: newX, passed };
        });

        return updatedObstacles.filter((o) => o.x + o.width > 0);
      });
    }

    // Continue the loop only if the game version is still the same
    if (
      currentVersion === gameStateRef.current.version &&
      !gameStateRef.current.gameOver
    ) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [boardSize.height, airplane, handleGameOver, calculateSettings]);

  // Spawn obstacles - declare early for use in startGame
  const spawnObstacle = useCallback(() => {
    // Don't spawn obstacles during warm-up period or if game is over
    if (gameStateRef.current.warmupActive || gameStateRef.current.gameOver)
      return;

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
    const maxY = boardSize.height - height * 1.2; // Add some margin from bottom
    const y = Math.floor(Math.random() * (maxY - minY) + minY);

    const newObstacle: Obstacle = {
      id: Date.now(),
      x: boardSize.width + width,
      y,
      width,
      height,
      type,
      passed: false,
    };

    setObstacles((prev) => [...prev, newObstacle]);
  }, [boardSize.width, boardSize.height, scaleFactor]);

  // Detect changes in spawn rate and update the timer
  useEffect(() => {
    // Don't update if the game is over or not active or in warmup
    if (
      gameStateRef.current.gameOver ||
      !gameStateRef.current.isActive ||
      gameStateRef.current.warmupActive
    ) {
      return;
    }

    // Calculate settings based on current score
    const latestSettings = calculateSettings(scoreRef.current);

    // Debug check - print settings to help diagnose issues
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[DEBUG] Score: ${
          scoreRef.current
        }, Speed: ${latestSettings.obstacleSpeed.toFixed(
          2
        )}, Spawn: ${latestSettings.spawnRate.toFixed(0)}ms`
      );
    }

    // Clear and restart timer if:
    // 1. We have a timer active AND
    // 2. Either the spawn rate has changed OR we detect a reset occurred
    const spawnRateChanged =
      latestSettings.spawnRate !== currentSpawnRateRef.current;

    if (obstacleTimerRef.current && spawnRateChanged) {
      // Update our reference
      currentSpawnRateRef.current = latestSettings.spawnRate;

      // Clear and restart the timer with the new spawn rate
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = setInterval(
        spawnObstacle,
        latestSettings.spawnRate
      );
    }
  }, [gameState.score, calculateSettings, spawnObstacle]);

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

    // 5. Clear all existing obstacles
    setObstacles([]);

    // 6. Update game state with score: 0
    setGameState({
      isActive: true,
      gameOver: false,
      score: 0,
      warmupActive: true, // Start with warm-up active
      version: newVersion,
    });

    // 7. Clear any existing timers
    if (obstacleTimerRef.current) {
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = null;
    }

    if (warmupTimerRef.current) {
      clearTimeout(warmupTimerRef.current);
      warmupTimerRef.current = null;
    }

    // 8. Reset airplane position and physics
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

    // 9. Start a new animation frame with the reset state
    animationFrameRef.current = window.requestAnimationFrame(gameLoop);

    // 10. Set up warm-up timer with the GUARANTEED BASE SETTINGS
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

  // Handle player jump - now startGame is defined before this function
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
  }, [airplane, obstacles, handleGameOver, checkCollision]);

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
    score: gameState.score,
    isPlaying: gameState.isActive,
    gameOver: gameState.gameOver,
    isWarmupActive: gameState.warmupActive,
    handleJump,
    resetGame: startGame,
    currentSettings: currentSettings || calculateSettings(gameState.score),
  } as GameLogicReturn;
}
