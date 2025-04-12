import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Airplane, Obstacle, GameBoardSize, GameLogicReturn } from "../types";

interface UseGameLogicProps {
  boardSize: GameBoardSize;
  setHighScore: (score: number) => void;
  highScore: number;
}

// Constants for progressive difficulty
const SPEED_INCREASE_THRESHOLD = 3; // Every 3 points (adjusted for actual scoring behavior)
const SPEED_INCREASE_FACTOR = 1.05; // 5% increase per threshold (adjusted for more gradual progression)
const SPAWN_RATE_DECREASE_FACTOR = 0.92; // 8% decrease per threshold
const MAX_DIFFICULTY_TIER = 15; // Cap difficulty increases at a higher level

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

  // Store difficulty tier state
  const [difficultyTier, setDifficultyTier] = useState(0);

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

  // Derive current settings based on difficulty tier
  const settings = useCallback(() => {
    const speedMultiplier = Math.pow(
      SPEED_INCREASE_FACTOR,
      Math.min(difficultyTier, MAX_DIFFICULTY_TIER)
    );
    const spawnRateMultiplier = Math.pow(
      SPAWN_RATE_DECREASE_FACTOR,
      Math.floor(difficultyTier / 2)
    );

    return {
      gravity: baseSettings.gravity,
      jumpPower: baseSettings.jumpPower,
      obstacleSpeed: baseSettings.obstacleSpeed * speedMultiplier,
      spawnRate: baseSettings.spawnRate * spawnRateMultiplier,
    };
  }, [baseSettings, difficultyTier]);

  // Current settings value
  const currentSettings = settings();

  // References for animation frame and timers
  const animationFrameRef = useRef<number | null>(null);
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Store the current spawn rate to detect changes
  const currentSpawnRateRef = useRef(currentSettings.spawnRate);

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
    if (gameStateRef.current.gameOver) {
      return;
    }

    // Get latest settings
    const latestSettings = settings();

    // Update airplane with physics
    setAirplane((prev) => {
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

    // Only update obstacles if warm-up is complete
    if (!gameStateRef.current.warmupActive) {
      // Update obstacles with simplified state access
      setObstacles((prev) => {
        let scoredThisFrame = false;

        const updatedObstacles = prev.map((obstacle) => {
          // Move obstacle
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

            // Update difficulty tier based on current score
            const newDifficultyTier = Math.floor(
              scoreRef.current / SPEED_INCREASE_THRESHOLD
            );
            if (newDifficultyTier > difficultyTier) {
              setDifficultyTier(newDifficultyTier);
            }

            // Sync the React state with our score counter
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

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [boardSize.height, airplane, handleGameOver, settings, difficultyTier]);

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
    // Don't update if the game is over or not active
    if (gameStateRef.current.gameOver || !gameStateRef.current.isActive) return;

    const latestSettings = settings();

    // Only update if the spawn rate has changed and we have a timer
    if (
      latestSettings.spawnRate !== currentSpawnRateRef.current &&
      obstacleTimerRef.current
    ) {
      currentSpawnRateRef.current = latestSettings.spawnRate;

      // Clear and restart the timer with the new spawn rate
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = setInterval(
        spawnObstacle,
        latestSettings.spawnRate
      );
    }
  }, [difficultyTier, settings, spawnObstacle]);

  // Start the game - need to define this before handleJump can reference it
  const startGame = useCallback(() => {
    // Ensure all existing animation frames are canceled before starting a new game
    // This helps prevent issues on mobile when restarting
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Reset game state and difficulty
    scoreRef.current = 0;
    lastScoringObstacleRef.current = null;

    setGameState({
      isActive: true,
      gameOver: false,
      score: 0,
      warmupActive: true, // Start with warm-up active
    });

    setDifficultyTier(0);
    currentSpawnRateRef.current = baseSettings.spawnRate;

    // Clear any existing timers
    if (obstacleTimerRef.current) {
      clearInterval(obstacleTimerRef.current);
      obstacleTimerRef.current = null;
    }

    // Clear any existing warm-up timer
    if (warmupTimerRef.current) {
      clearTimeout(warmupTimerRef.current);
      warmupTimerRef.current = null;
    }

    // Scale airplane size based on board size
    const baseAirplaneWidth = 60;
    const baseAirplaneHeight = 30;
    const airplaneWidth = Math.floor(baseAirplaneWidth * scaleFactor);
    const airplaneHeight = Math.floor(baseAirplaneHeight * scaleFactor);

    // Reset airplane with size scaled to the canvas
    setAirplane({
      x: Math.floor(80 * scaleFactor), // Position scaled relative to board size
      y: boardSize.height / 2,
      width: airplaneWidth,
      height: airplaneHeight,
      rotation: 0,
      velocity: 0, // Start with zero velocity in warm-up
    });

    // Clear obstacles
    setObstacles([]);

    // Get initial settings
    const initialSettings = settings();

    // Force a new game loop first - needed for mobile
    if (typeof window !== "undefined") {
      // Force layout recalculation in the browser
      void window.document.body.offsetHeight;

      // Start game loop immediately - no delay
      // Use setTimeout to ensure it runs in a clean execution context
      setTimeout(() => {
        if (animationFrameRef.current === null) {
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        }
      }, 0);
    }

    // Start the warm-up timer after animation has started
    warmupTimerRef.current = setTimeout(() => {
      // End warm-up and start spawning obstacles
      setGameState((prev) => ({ ...prev, warmupActive: false }));

      // Add a slight upward "launch" motion when warm-up ends to signal start
      setAirplane((prev) => ({
        ...prev,
        velocity: -3 * scaleFactor, // Gentle upward motion
        rotation: -10, // Slight upward tilt
      }));

      // Start obstacle spawning after warm-up
      spawnObstacle(); // Spawn one immediately
      obstacleTimerRef.current = setInterval(
        spawnObstacle,
        initialSettings.spawnRate
      );
    }, WARMUP_DURATION);
  }, [
    boardSize.height,
    settings,
    spawnObstacle,
    gameLoop,
    scaleFactor,
    baseSettings.spawnRate,
  ]);

  // Handle player jump - now startGame is defined before this function
  const handleJump = useCallback(() => {
    // If game is over, clicking/tapping anywhere should restart the game immediately
    if (gameStateRef.current.gameOver) {
      // Use setTimeout with 0 delay to ensure clean execution context
      setTimeout(() => {
        // Force cancel any potentially running animation frames before starting
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        startGame();
      }, 0);
      return;
    }

    // If game not active, start it
    if (!gameStateRef.current.isActive) {
      setTimeout(() => startGame(), 0);
      return;
    }

    // Ignore jumps during warm-up period
    if (gameStateRef.current.warmupActive) {
      return;
    }

    const latestSettings = settings();

    setAirplane((prev) => ({
      ...prev,
      velocity: latestSettings.jumpPower,
      rotation: -20,
    }));
  }, [settings, startGame]);

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
  } as GameLogicReturn;
}
